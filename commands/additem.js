const {SlashCommandBuilder, userMention, UserSelectMenuBuilder, Collection} = require('discord.js');
const {Items, Players, Players_Inv} = require('./../dbObjects.js');
const {DMRoleID} = require('./../config.json');
const {Op} = require('sequelize');

// DM command for giving players new items to their inventories. Usually used to give items
// from NPCs or found around the world.
module.exports = {
    data: new SlashCommandBuilder()
        .setName('additem')
        .setDescription('Give an item to a player as the DM.')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('Name of the item you wish to give to a player.')
                .setRequired(true))
        .addUserOption(option =>
            option
                .setName('player')
                .setDescription('The player you would like to give the item to.')
                .setRequired(true))
        .addIntegerOption(option =>
            option
                .setName('amount')
                .setDescription('The amount of the item to bestow upon the player (default is 1)')),
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
        const itemNum = interaction.options.getInteger('amount') || 1;

        const person = await Players.findOne({where: {player_id: player.id}});
        if (!person)
        {
            await interaction.editReply(`A player could not be found under that user.`);
            return;
        }

        if (!itemName.localeCompare('gold', undefined, {sensitivity: 'accent'}))
        {
            person.gold += itemNum;
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

        const playerItem = await Players_Inv.findOne({where: {player_id: player.id, item_id: item.id}})
        if (playerItem)
        {
            playerItem.quantity += itemNum;
            playerItem.save();
        }
        else
        {
            Players_Inv.create({player_id: player.id, item_id: item.id, quantity: itemNum});
        }

        person.cur_weight += item.weight * itemNum;
        person.save();

        if (itemNum === 0)
        {
            await interaction.editReply(`A ${item.name} was successfully given to ${player.username}.`);
            return;
        }
        await interaction.editReply(`${itemNum} ${item.name}s were successfully given to ${player.username}.`);
    }
};