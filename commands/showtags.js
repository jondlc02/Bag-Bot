const {SlashCommandBuilder} = require('discord.js');
const {Tags} = require('./../dbObjects.js');

// Lists all tag names in the database
module.exports = {
    data: new SlashCommandBuilder()
        .setName('showtags')
        .setDescription('Lists all the tag names in the database in alphabetical order.'),
    async execute(interaction)
    {
        await interaction.deferReply();
        
        const tagList = await Tags.findAll({attributes: ['name']});
        const tagString = tagList.map(t => t.name).join(', ') || `No tags set.`;

        await interaction.editReply(`List of tags: ${tagString}`);
    },
};