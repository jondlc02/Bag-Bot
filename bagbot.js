const fs = require('node:fs');
const path = require('node:path');
const Sequelize = require('sequelize');
const {Client, Events, GatewayIntentBits, Collection} = require('discord.js');
const {token} = require('./config.json'); // Curly brackets give access to definition of same name

const client = new Client({intents: [GatewayIntentBits.Guilds]});

/*---- This part of the code loads all the command files into one handy dandy collection ----*/
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');  // Helps to construct a path to the commands directory for ease of use
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); // fs.readdirSync reads path to directory and returns array of all file names in dir
// filter only returns files with .js at the end

for (const file of commandFiles) {    // Loops through array of files with .js at the end
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);    // Sets the files into the 'commands' collection
    }
    else {
        if ('execute' in command)
        {
            console.log(`No data :(`);
        }
        else if ('data' in command)
        {
            console.log(`No execute :(`);
        }
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" and/or "execute" property.`)    // Throws an error if data or execute is missing from the command
    }
}

/*const sequelize = new Sequelize('database', 'username', 'password', 
{
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});*/

/*const Tags = sequelize.define('tags', { // This defines the models of the database
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
});*/

//const Tags = require('./dbInit.js')
client.once(Events.ClientReady,() => 
{
    //Tags.sync(); // Tables are only created if they get sync-ed
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on(Events.InteractionCreate, async interaction => 
{
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command)
    {
        console.error(`No command matching ${interaction.commandName} was found`);
        return;
    }

    try
    {
        await command.execute(interaction);
    }
    catch (error)
    {
        console.error(`Error executing ${interaction.commandName}`);
		console.error(error);
    }
});

client.login(token);