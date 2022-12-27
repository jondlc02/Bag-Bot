const Sequalize = require('sequelize');
const {Client, Events, GatewayIntentBits} = require('discord.js');

const client = new Client({intents: [GatewayIntentBits.Guilds]});

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

client.once(Events.ClientReady,() => {
    console.log(`Logged in as ${client.user.tag}!`);
});