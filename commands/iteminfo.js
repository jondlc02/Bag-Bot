const {SlashCommandBuilder} = require('discord.js');
const {DMRoleID} = require('./../config.json');
const {Items} = require('./../dbObjects.js');
const {Op} = require('sequelize');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('iteminfo')
        .setDescription('DM only command, displays info on any item.')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('Name of the item you want info on.')
                .setRequired(true)),
    async execute(interaction)
    {
        await interaction.deferReply({ephemeral: true});

        if (!interaction.member.roles.cache.has(DMRoleID))
        {
            console.log(`User does not have proper permission`);
            await interaction.editReply(`Only the DM has access to this command!`);
            return;
        }

        const itemName = interaction.options.getString('name');

        const item = await Items.findOne({where: {name: {[Op.like]: itemName}}});
        if (!item)
        {
            await interaction.editReply(`[${itemName}] does not exist in the item list.`);
            return;
        }

        await interaction.editReply
        (
            `${item.name}: \n${item.description} \n` + 
            `Weight: ${item.weight} / Item Category: ${item.category}`
        );
    }
};