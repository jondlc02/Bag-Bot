const {SlashCommandBuilder, Collection} = require('discord.js');
const {Items} = require('./../dbObjects.js');
const {DMRoleID} = require('./../config.json');

// DM command for creating new items for the itemlist
module.exports = {
    data: new SlashCommandBuilder()
        .setName('deleteitem')
        .setDescription('(DM only) Deletes an item from database.')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('Name of the item.')
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
        const item = await Items.findOne({where: {name: itemName}});

        if (!item)
        {
            await interaction.editReply(`[${itemName}] does not exist in the database.`);
            return;
        }

        await Items.destroy({where: {name: item.name}});
        await interaction.editReply('Deletion successful.');
    }
};