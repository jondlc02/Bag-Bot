const {SlashCommandBuilder} = require('discord.js');
const {Tags} = require('./../dbObjects.js');

// Provides metadata on a given tag
module.exports = {
    data: new SlashCommandBuilder()
        .setName('taginfo')
        .setDescription(`Display a given tag's metadata.`)
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('The name of the tag you want info on.')
                .setRequired(true)),
    async execute(interaction)
    {
        const tagName = interaction.options.getString('name');

        await interaction.deferReply();

        const tag = await Tags.findOne({where: {name: tagName}});

        if (tag)
        {
            await interaction.editReply(`Tag "${tagName}" was created by ${tag.username} and has been used ${tag.usage_count} times.`);
        }
        else
        {
            await interaction.editReply(`Could not find a tag with the name "${tagName}".`)
        }
    },
};