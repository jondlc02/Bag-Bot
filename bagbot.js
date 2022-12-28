const Sequelize = require('sequelize');
const {Client, Events, GatewayIntentBits, InteractionResponse, CommandInteractionOptionResolver} = require('discord.js');
const {token} = require('./config.json'); // Curly brackets give access to definition of same name

const client = new Client({intents: [GatewayIntentBits.Guilds]});

const sequelize = new Sequelize('database', 'user', 'password', 
{
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Tags = sequelize.define('tags', { // This defines the models of the database
	name: 
    { // Specifies that the name part of the tag is a string/text and that each name
		type: Sequelize.TEXT, // Must be unique to be entered into the database
		unique: true,
	},
	description: Sequelize.TEXT, // Tags also have descriptions which must be string/text
	username: Sequelize.TEXT, // Tags include usernames
	usage_count: 
    {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});

client.once(Events.ClientReady,() => 
{
    Tags.sync(); // Tables are only created if they get sync-ed
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on(Events.InteractionCreate, async interaction => 
{
    if (!interaction.isChatInputCommand()) return;

    const {commandName} = interaction;

    // Adds tag into the database
    if (commandName === 'addTag') 
    {
        const tagName = interaction.options.getString('name');
        const tagDescription = interaction.options.getString('description');

        try {
            const tag = await Tags.create(
            {
                name: tagName,
                description: tagDescription,
                username: interaction.user.username
            });

            return interaction.reply(`Tag ${tagName} added.`)
        }
        catch (error) 
        {
            if (error.name === 'SequelizeUniqueConstraintError') 
            {
                return interaction.reply(`That tag already exists.`)
            }
            return interaction.reply(`Something went wrong with adding that tag.`)
        }
    }

    // Allows for ssearching of tag with a given name, I have no idea the algorithm
    else if (command === 'tag') 
    {
        const tagName = interaction.options.getString('name');

        // findOne fetches single row of data from database
        // Needs await b/c queries are asynchronous
        const tag = await Tags.findOne({where: {name: tagName}});

        if (tag) 
        {
            // If findOne is successful you can use ('get') to obtain any part of the tag
            tag.increment('usage_count');
            return interaction.reply(tag.get('description'));
        }
        return interaction.reply(`Could not find tag ${tagName}`);
    }

    // Command allows for editing of commands with given names
    else if (commannd === 'edittag')
    {
        const tagName = interaction.options.getString('name');
        const tagDescription = interaction.options.getString('description');

        const affectedRows = await Tags.update({description: tagDescription}, {where: {name: 'tagName'}});

        if (affectedRows > 0)
        {
            return interaction.reply(`Tag ${tagName} was affected`);
        }
        return interaction.reply(`No tags found with name ${tagName}`);
    }

    // Command for displaying tag info
    else if (command === 'taginfo')
    {
        const tagName = interaction.options.getString('name');

        const tag = await Tags.findOne({where: {name: tagName}});

        if (tag)
        {
            return interaction.reply(`"${tagName}" was created by ${tag.username}
            and has been used ${tag.usage_count} times.`);
        }
        return interaction.reply(`No tag found with the name ${tagName}`);
    }
    
    // Command for displaying all tag names
    else if (command === 'showtags')
    {
        // Attributes takes an array as an argument so brackets are necessary
        const tagList = await Tags.findAll({attributes: ['name']});
        const tagString = tagList.map(t => t.name).join(', ') || 'No tags set.';

        return interaction.reply(`List of tags: ${tagString}`);
    }

    //Command for deleting tags
    else if (command === 'deletetag')
    {
        const tagName = interaction.options.getString('name');

        const rowCount = await Tags.destroy({where: {name: tagName}});

        if (rowCount)
        {
            return interaction.reply(`Tag deleted.`)
        }
        return interaction.reply(`No tag found with name ${tagName}`);
    }
});

client.login(token);