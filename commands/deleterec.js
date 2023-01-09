const {SlashCommandBuilder, Collection} = require('discord.js');
const {Rec_Items} = require('./../dbObjects.js');

// DM command for creating new items for the itemlist
module.exports = {
    data: new SlashCommandBuilder()
        .setName('deleterec')
        .setDescription('(DM only) Deletes an item from database.')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('Name of the item.')
                .setRequired(true)),
    async execute(interaction)
    {
        await interaction.deferReply({ephemeral: true});

        const itemName = interaction.options.getString('name');
        const item = await Rec_Items.findOne({where: {name: itemName}});

        if (!item)
        {
            await interaction.editReply(`[${itemName}] does not exist in the database.`);
            return;
        }

        await Rec_Items.destroy({where: {name: item.name}});
        await interaction.editReply('Deletion successful.');
    }
};