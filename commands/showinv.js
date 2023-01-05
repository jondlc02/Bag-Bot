const {SlashCommandBuilder, CommandInteractionOptionResolver} = require('discord.js');
const item = require('../models/item.js');
const {Items, Players_Inv} = require('./../dbObjects.js');

// Shows a player their inventory privately
module.exports = {
    data: new SlashCommandBuilder()
        .setName('showinv')
        .setDescription('Displays the contents of your inventory.')
        .addStringOption(option =>
            option
                .setName('category')
                .setDescription('The category of items in your inventory to display.')
                .addChoices(
                    {name: 'weapon', value: 'Weapons'},
                    {name: 'armor', value: 'Armor'},
                    {name: 'consumable', value: 'Consumables'},
                    {name: 'key item', value: 'Key Items'},
                    {name: 'misc', value: 'Misc'},
                    {name: 'all', value: 'all'}
                )),
    async execute(interaction)
    {
        await interaction.deferReply({ephemeral: true});

        const category = await interaction.options.getString('category') || 'all';
        const playerID = interaction.user.id;
        const fullInv = await Players_Inv.findAll({where: {player_id: playerID}, include: ['item']});
        const weapons = [];
        const armor = [];
        const consumables = [];
        const key_items = [];
        const misc = [];
        for (var i = 0; i < fullInv.length; i++)
        {
            let itemString = [fullInv[i].item.name, fullInv[i].quantity].join(' - ')   
            switch (fullInv[i].item.category)
            {
                case 'Weapons':
                    weapons.push(itemString);
                    break;
                case 'Armor':
                    armor.push(itemString);
                    break;
                case 'Consumables':
                    consumables.push(itemString);
                    break;
                case 'Key Items':
                    key_items.push(itemString);
                    break;
                case 'Misc':
                    misc.push(itemString);
            }
        }

        switch(category)
        {
            case 'all':
                await interaction.editReply(`Weapons: \n${weapons.join('\n')} \n\nArmor: \n${armor.join('\n')} \n\nConsumables: \n${consumables.join('\n')} \n\nKey Items: \n${key_items.join('\n')} \n\nMisc: \n${misc.join('\n')}`);
                break;
            case 'Weapons':
                await interaction.editReply(`Weapons: \n${weapons.join('\n')}`);
                break;
            case 'Armor':
                await interaction.editReply(`Armor: \n${armor.join('\n')}`);
                break;
            case 'Consumables':
                await interaction.editReply(`Consumables: \n${consumables.join('\n')}`);
                break;
            case 'Key Items':
                await interaction.editReply(`Key Items: \n${key_items.join('\n')}`);
                break;
            case 'Misc': 
                await interaction.editReply(`Misc: \n${misc.join('\n')}`);
                break;
        }
    }
};