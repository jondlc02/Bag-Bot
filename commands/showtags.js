const {SlashCommandBuilder} = require('discord.js');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Tags = require('./../models/tags.js')(sequelize, Sequelize.DataTypes);

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