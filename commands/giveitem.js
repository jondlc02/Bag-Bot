const {SlashCommandBuilder, CommandInteractionOptionResolver} = require('discord.js');
const {Players_Inv, Players, Items} = require('./../dbObjects.js');
const {Op} = require('sequelize');

// Adds tag into the database
module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveitem')
        .setDescription('Give an item from your inventory to a fellow player or NPC.')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('Name of the item to give.')
                .setRequired(true))
        .addUserOption(option =>
            option
                .setName('player')
                .setDescription('The @ of the player you are giving to (@ the DM to give to an NPC).')
                .setRequired(true))
        .addIntegerOption(option => 
            option 
                .setName('amount')
                .setDescription('Number of that item to give (default is 1).')),
    async execute(interaction)
    {
        await interaction.deferReply({ephemeral: true});

        const giver = await interaction.user.id;
        const itemName = await interaction.options.getString('name');
        const receiver = await interaction.options.getUser('player');
        var itemNum = await interaction.options.getInteger('amount') || 1;

        const givingPlayer = await Players.findOne({where: {player_id: giver.id}});
        const receivingPlayer = await Players.findOne({where: {player_id: receiver.id}});

        if (!itemName.localeCompare('gold', undefined, {sensitivity: 'accent'}))
        {
            if (givingPlayer.gold < itemNum)
            {
                itemNum = givingPlayer.gold;
            }
            receivingPlayer.gold += itemNum;
            receivingPlayer.save();
            interaction.editReply(`${itemNum} gold was given to ${receiver.username}!`);
            return;
        }

        const item = await Items.findOne({where: {name: {[Op.like]: itemName}}});
        if (!item)
        {
            await interaction.editReply(`That item does not exist.`);
            return;
        }

        const playerItem = await Players_Inv.findOne({where: {player_id: givingPlayer.id, item_id: item.id}});
        if (!playerItem)
        {
            await interaction.editReply(`You do not have a(n) ${item.name} in your inventory.`);
            return;
        }

        givingPlayer.removeItem(item, playerItem, itemNum);        
        receivingPlayer.addItem(item);

        await interaction.users.send(receiver.id, `You have been given ${itemNum} ${item.name}(s) by ${interaction.user.username}`);
        await interaction.editReply(`Successfully sent item(s)!`)
    },
};