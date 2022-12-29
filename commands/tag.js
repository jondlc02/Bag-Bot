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
        .setName('tag')
        .setDescription('Searches databse for a tag with a given name.')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('The name of the tag.')
                .setRequired(true)),
    async execute(interaction)
    {
        const tagName = interaction.options.getString('name');

        await interaction.deferReply();

        const tag = await Tags.findOne({where: {name: tagName}});

        if (tag) 
        {
            // If findOne is successful you can use ('get') to obtain any part of the tag
            tag.increment('usage_count');
            await interaction.editReply(tag.get('description'));
        }
        else
        {
            await interaction.editReply(`Could not find tag ${tagName}`);
        }
    },
};