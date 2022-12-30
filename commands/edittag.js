const {SlashCommandBuilder} = require('discord.js');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Tags = require('./../models/tags.js')(sequelize, Sequelize.DataTypes);

// Adds tag into the database
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

        const affectedRows = await Tags.update({description: tagDescription}, {where: {name: 'tagName'}});

        if (affectedRows > 0)
        {
            await interaction.editReply(`Tag ${tagName} was affected`);
        }
        else
        {
            await interaction.editReply(`No tags found with name ${tagName}`);
        }
    },
};