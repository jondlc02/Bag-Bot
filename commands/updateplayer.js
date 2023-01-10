const {SlashCommandBuilder} = require('discord.js');
const {Players} = require('./../dbObjects.js');

// Updates stats for a player.
module.exports = {
    data: new SlashCommandBuilder()
        .setName('updateplayer')
        .setDescription('Create a new player to keep track of their inventory in the database.')
        .addIntegerOption(option =>
            option
                .setName('delta_s')
                .setDescription('Value to change strength by (this will change your max carry weight).'))
        .addIntegerOption(option =>
           option
                .setName('delta_d')
                .setDescription('Value to change dexterity by.'))
        .addIntegerOption(option =>
            option
                .setName('delta_c')
                .setDescription('Value to change constitution by.'))
        .addIntegerOption(option =>
           option
                .setName('delta_i')
                .setDescription('Value to change intelligence by.'))
        .addIntegerOption(option =>
            option
                .setName('delta_w')
                .setDescription('Value to change wisdom by.'))
        .addIntegerOption(option =>
            option
                .setName('delta_ch')
                .setDescription('Value to change charisma by.')),
    async execute(interaction)
    {
        await interaction.deferReply({ephemeral: true});

        const playerID = interaction.user.id;
        const strength = interaction.options.getInteger('delta_s') || 0;
        const dexterity = interaction.options.getInteger('delta_d') || 0;
        const constitution = interaction.options.getInteger('delta_c') || 0;
        const intelligence = interaction.options.getInteger('delta_i') || 0;
        const wisdom = interaction.options.getInteger('delta_w') || 0;
        const charisma = interaction.options.getInteger('delta_ch') || 0;

        const player = await Players.findOne({where: {player_id: playerID}});
        if (!player)
        {
            await interaction.editReply(`You have not created a character in the database!`);
            return;
        }

        player.strength += strength;
        player.dexterity += dexterity;
        player.constitution += constitution;
        player.intelligence += intelligence;
        player.wisdom += wisdom;
        player.charisma += charisma;
        player.max_weight += strength * 15;
        player.save();

        await interaction.editReply('Updates successful!');
    }
};