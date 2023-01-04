const {SlashCommandBuilder} = require('discord.js');
const {Players} = require('./../dbObjects.js');

// Adds tag into the database
module.exports = {
    data: new SlashCommandBuilder()
        .setName('createplayer')
        .setDescription('Create a new player to keep track of their inventory in the database.'),
    async execute(interaction)
    {
        const playerID = interaction.user.id;
        await interaction.deferReply({ephemeral: true});

        try 
        {
            const player = await Players.create(
            {
                player_id: playerID
            });

            await interaction.editReply(`You have been added to the database!`)
        }
        catch (error)
        {
            if (error.name === 'SequelizeUniqueConstraintError')
            {
                await interaction.editReply(`You seem to already exist in the database.`);
            }
            else
            {
                await interaction.editReply('Something went wrong with creating your player.');
            }
        }
    },
};