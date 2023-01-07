const {SlashCommandBuilder} = require('discord.js');
const {Players} = require('./../dbObjects.js');

// Command for adding a new player into the database.
// Players add themselves into the database
module.exports = {
    data: new SlashCommandBuilder()
        .setName('createplayer')
        .setDescription('Create a new player to keep track of their inventory in the database.')
        .addIntegerOption(option =>
            option
                .setName('strength')
                .setDescription('Your strength.')
                .setRequired(true))
        .addIntegerOption(option =>
           option
                .setName('dexterity')
                .setDescription('Your dexterity.')
                .setRequired(true))
        .addIntegerOption(option =>
            option
                .setName('constitution')
                .setDescription('Your constitution.')
                .setRequired(true))
        .addIntegerOption(option =>
           option
                .setName('intelligence')
                .setDescription('Your intelligence.')
                .setRequired(true))
        .addIntegerOption(option =>
            option
                .setName('wisdom')
                .setDescription('Your wisdom.')
                .setRequired(true))
        .addIntegerOption(option =>
            option
                .setName('charisma')
                .setDescription('Your charisma.')
                .setRequired(true)),
    async execute(interaction)
    {
        await interaction.deferReply({ephemeral: true});

        const playerID = interaction.user.id;
        const strength = interaction.options.getInteger('strength');
        const dexterity = interaction.options.getInteger('dexterity');
        const constitution = interaction.options.getInteger('constitution');
        const intelligence = interaction.options.getInteger('intelligence');
        const wisdom = interaction.options.getInteger('wisdom');
        const charisma = interaction.options.getInteger('charisma');

        try 
        {
            const player = await Players.create(
            {
                player_id: playerID,
                strength: strength,
                dexterity: dexterity,
                constitution: constitution,
                intelligence: intelligence,
                wisdom: wisdom,
                charisma: charisma,
                max_weight: strength * 15
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