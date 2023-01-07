const {SlashCommandBuilder} = require('discord.js');
const {Items, Players_Inv} = require('./../dbObjects.js');
const {Op} = require('sequelize');

// Adds tag into the database
module.exports = {
    data: new SlashCommandBuilder()
        .setName('inspectitem')
        .setDescription('Finds an item in your inventory and tells you all about it.')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('Name of the item you would like to inspect.')
                .setRequired(true)),
    async execute(interaction)
    {
        await interaction.deferReply({ephemeral: true});

        const itemName = await interaction.options.getString('name');

        const item = await Items.findOne({where: {name: {[Op.like]: itemName}}});
        if (!item)
        {
            await interaction.editReply('That is not an item in your inventory!');
            return;
        }

        const playerItem = await Players_Inv.findOne({where: {player_id: interaction.user.id, item_id: item.id}});

        if (!playerItem)
        {
            await interaction.editReply('That is not an item in your inventory!');
            return;
        }

        await interaction.editReply(`${item.name}: ${item.description} \nQuantity: ${playerItem.quantity} / Weight: ${item.weight} / Item Category: ${item.category}`);
    }
};