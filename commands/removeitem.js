const {SlashCommandBuilder} = require('discord.js');
const {Items, Players, Players_Inv} = require('./../dbObjects.js');
const {Op} = require('sequelize');

// DM command for removing items from players inventories
module.exports = {
    data: new SlashCommandBuilder()
        .setName('removeitem')
        .setDescription('Take an item from a player as a DM')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('Name of the item that should be taken away.')
                .setRequired(true))
        .addUserOption(option => 
            option 
                .setName('player')
                .setDescription('The player whose item is being taken away.')
                .setRequired(true))
        .addIntegerOption(option =>
            option
                .setName('amount')
                .setDescription('The number of items to take from the player (default is 1).')),
    async execute(interaction)
    {
        await interaction.deferReply({ephemeral: true});

        if (!interaction.member.roles.cache.has(DMRoleID))
        {
            console.log(`User does not have proper permission`);
            await interaction.editReply(`Only the DM has access to this command!`);
            return;
        }

        const itemName = interaction.options.getString('name');
        const player = interaction.options.getUser('player');
        var itemNum = interaction.options.getInteger('amount') || 1;

        const person = await Players.findOne({where: {player_id: player.id}});
        if (!person)
        {
            await interaction.editReply(`A player could not be found under that user.`);
            return;
        }

        if (!itemName.localeCompare('gold', undefined, {sensitivity: 'accent'}))
        {
            if (itemNum > person.gold)
            {
                person.gold = 0;
            }
            else
            {
                person.gold -= itemNum;
            }
            person.save();
            interaction.editReply(`${itemNum} gold was awarded to ${player.username}!`);
            return;
        }

        const item = await Items.findOne({where: {name: {[Op.like]: itemName}}});
        if (!item)
        {
            await interaction.editReply(`That item does not exist.`);
            return;
        }

        const playerItem = await Players_Inv.findOne({where: {player_id: player.id, item_id: item.id}});
        if (!playerItem)
        {
            await interaction.editReply(`This player does not have any [${item.name}] in their inventory!`);
            return;
        }
        else
        {
            console.log('Removing items.')
            itemNum = await person.removeItem(playerItem, item, itemNum);
            console.log('Items removed!');
        }
        
        if (itemNum === 1)
        {
            await interaction.editReply(`A(n) ${item.name} was successfully taken from ${player.username}.`);
            return;
        }
        await interaction.editReply(`${itemNum} ${item.name}s were successfully taken from ${player.username}.`);

    },
};