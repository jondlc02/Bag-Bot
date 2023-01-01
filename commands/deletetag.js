const {SlashCommandBuilder} = require('discord.js');
const {Tags} = require('./../dbObjects.js');

// Deletes tag from the database
module.exports = {
    data: new SlashCommandBuilder()
        .setName('deletetag')
        .setDescription('Permanently deletes a tag with a given name from the database.')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('Name of the tag you desire to delete.')
                .setRequired(true)),
    async execute(interaction)
    {
        const tagName = interaction.options.getString('name');

        await interaction.deferReply();

        const deletion = await Tags.destroy({where: {name: tagName}});

        if (deletion)
        {
            await interaction.editReply(`Tag "${tagName}" has been successfully removed.`)
        }
        else
        {
            await interaction.editReply(`A tag with the name "${tagName}" could not be found.`)
        }
    },
};