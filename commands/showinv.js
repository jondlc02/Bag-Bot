const {SlashCommandBuilder, CommandInteractionOptionResolver} = require('discord.js');
const {Items} = require('./../dbObjects.js');

// Shows a player their inventory privately
module.exports = {
    data: new SlashCommandBuilder()
        .setName('showinv')
        .setDescription('Displays the contents of your inventory.')
        .addStringOption(option =>
            option
                .setName('category')
                .setDescription('The category of items in your inventory to display.')
                .setRequired(true)
                .addChoices(
                    {name: 'weapon', value: 'Weapons'},
                    {name: 'armor', value: 'Armor'},
                    {name: 'consumable', value: 'Consumables'},
                    {name: 'key item', value: 'Key Items'},
                    {name: 'misc', value: 'Misc'}
                )),
    async execute(interaction)
    {
        await interaction.deferReply({ephemeral: true});

        const category = await interaction.options.getString('category') || 'None';

        if (category === 'None')
        {
            // List num of items in each category in the player's inventory. 
        }
    },
};