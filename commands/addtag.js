const {SlashCommandBuilder} = require('discord.js');
const {Tags} = require('./../dbObjects.js');

// Adds tag into the database
module.exports = {
    data: new SlashCommandBuilder()
        .setName('addtag')
        .setDescription('Adds tag into the database if the name is unique')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('The name of the tag')
                .setRequired(true))
        .addStringOption(option => 
            option 
                .setName('description')
                .setDescription('Create a description for the tag')
                .setRequired(true)),
    async execute(interaction)
    {
        const tagName = interaction.options.getString('name');
        const tagDescription = interaction.options.getString('description');

        await interaction.deferReply({ephemeral: true});

        try 
        {
            const tag = await Tags.create(
            {
                name: tagName,
                description: tagDescription,
                username: interaction.user.username
            });

            await interaction.editReply(`"${tag.name}" was added to the database.`)
        }
        catch (error)
        {
            if (error.name === 'SequelizeUniqueConstraintError')
            {
                await interaction.editReply(`A tag with the name "${tagName}" already exists.`);
            }
            else
            {
                await interaction.editReply('Something went wrong with creating that tag.');
            }
        }
    },
};