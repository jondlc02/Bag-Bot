const {SlashCommandBuilder} = require('discord.js');
const {Players} = require('./../dbObjects.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('aboutme')
        .setDescription('Displays information on your character.'),
    async execute(interaction)
    {
        await interaction.deferReply({ephemeral: true});

        const player = await Players.findOne({where: {player_id: interaction.user.id}});
        if (!player)
        {
            await interaction.editReply('You are not in the database! Use /createplayer to add yourself to the database.');
            return;
        }

        await interaction.editReply
        (
            `Strength: ${player.strength} ` + 
            `/ Dexterity: ${player.dexterity} ` +
            `/ Constitution: ${player.constitution} \n` +
            `Intelligence: ${player.intelligence} ` +
            `/ Wisdom: ${player.wisdom} ` +
            `/ Charisma: ${player.charisma} \n` +
            `Gold: ${player.gold} / Carrying Capacity: ${player.max_weight} ` + 
            `/ Current Weight Load: ${player.cur_weight}`
        );

        if (player.max_weight <= player.cur_weight)
        {
            await interaction.followUp({content: `You are overencumbered!`, ephemeral: true});
        }
    }
};