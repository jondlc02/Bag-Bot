const {SlashCommandBuilder, Collection} = require('discord.js');
const {Rec_Items} = require('./../dbObjects.js');

// DM command for creating new items for the itemlist
module.exports = {
    data: new SlashCommandBuilder()
        .setName('itemrec')
        .setDescription('Creates a new item in the database. DM may make it an official item.')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('Name of the item.')
                .setRequired(true))
        .addStringOption(option => 
            option 
                .setName('description')
                .setDescription('Create a description for the item.')
                .setRequired(true))
        .addIntegerOption(option => 
            option 
                .setName('weight')
                .setDescription('Set the weight for the item (lbs).')
                .setRequired(true))    
        .addStringOption(option =>
            option
                .setName('category')
                .setDescription('Give this item a type.')
                .setRequired(true)
                .addChoices(
                    {name: 'weapon', value: 'Weapons'},
                    {name: 'armor', value: 'Armor'},
                    {name: 'consumable', value: 'Consumables'},
                    {name: 'key item', value: 'Key Items'},
                    {name: 'misc', value: 'Misc'}
                )),
    async execute(interaction)
    {
        await interaction.deferReply({ephemeral: true});

        const itemName = interaction.options.getString('name');
        const itemDescription = interaction.options.getString('description');
        const itemWeight = interaction.options.getInteger('weight');
        const itemCategory = interaction.options.getString('category');

        try 
        {
            const item = await Rec_Items.create(
            {
                name: itemName,
                description: itemDescription,
                weight: itemWeight,
                category: itemCategory,
                creator_user: interaction.user.username
            });

            await interaction.editReply(`"${item.name}" was added to the list of player-made items!`)
        }
        catch (error)
        {
            if (error.name === 'SequelizeUniqueConstraintError')
            {
                await interaction.editReply(`An item with the name "${itemName}" already exists.`);
            }
            else
            {
                await interaction.editReply('Something went wrong with creating that item.');
            }
        }   
    },
};