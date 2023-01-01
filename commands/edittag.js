const {SlashCommandBuilder} = require('discord.js');
const {Tags} = require('./../dbObjects.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('edittag')
        .setDescription('Change the description of an existing tag.')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('The name of the tag you want to edit.')
                .setRequired(true))
        .addStringOption(option => 
            option 
                .setName('description')
                .setDescription('New description for the tag.')
                .setRequired(true)),
    async execute(interaction)
    {
        const tagName = interaction.options.getString('name');
        const tagDescription = interaction.options.getString('description');

        await interaction.deferReply();

        const tag = await Tags.findOne({where: {name: tagName}});

        if (tag)
        {
            tag.update({description: tagDescription});
            await interaction.editReply(`The "${tagName}" tag was successfully altered.`);
        }
        else
        {
            await interaction.editReply(`No tags found with name "${tagName}".`);
        }
    },
};