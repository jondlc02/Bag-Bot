const {SlashCommandBuilder} = require('discord.js');
const {Tags} = require('./../dbObjects.js');

// Adds tag into the database
module.exports = {
    data: new SlashCommandBuilder()
        .setName('tag')
        .setDescription('Searches database for a tag with a given name.')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('The name of the tag')
                .setRequired(true)),
    async execute(interaction)
    {
        const tagName = interaction.options.getString('name');

        await interaction.deferReply();

        const tag = await Tags.findOne({where: {name: tagName}});

        if (tag)
        {
            tag.increment('usage_count');
            await interaction.editReply(tag.get('description'));
        }
        else
        {
            await interaction.editReply(`Could not find tag with the name: ${tagName}.`);
        }
    },
};