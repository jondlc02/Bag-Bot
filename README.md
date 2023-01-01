# Bag-Bot
Needs the node_modules folders and all the dependencies that come with it.
First, in the terminal of your javascript IDE of choice (I use VSCode) do the following commands:
npm i discord.js
npm i discord.js sequelize sqlite3

Afterwards, a config.json file needs to be created in order for your code to communicate with the discord API.
The following structure is recommended for your config.json:
{
"token": "your-token-here",
"clientID": "your-clientID-here"
}

A token and client ID are necessary to communicate with the discord API and a unique one can be obtained by creating a new "application" in the discord dev portal.
This bot deploys globally so no need for a guild ID. Your bots token and client ID can be found on the discord dev portal.

Additionally, this bot client needs to be invited to a server in order to operate.
One can obtain a invitation url for their bot on the discord dev portal. I recommend the following scopes: 
bot
applications.commands

To continue, I recommend the following permissions:
(Under Text Permissions: basically all of them)
Send Messages
Create Public Threads
Create Private Threads
Send Messages in Threads
Send TTS Messages
Manages Messages
Manages Threads
Embed Links
Attach Files
Read Message History
Mention Everyone
Use External Emojis
Use External Stickers
Add Reactions
Use Slash Commands
(Under General Permissions)
Read Messages/View Channels
Manage Events

The following commands can now be executed in order to bring the bot online:
node dbInit.js
node deploy-commands.js
node bagbot.js

This should create a database.sqlite file and make the bot appear online and have all of its slash commands.

Happy tagging!
