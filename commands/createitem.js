const {SlashCommandBuilder, Collection} = require('discord.js');
const {Items} = require('./../dbObjects.js');
const {DMRoleID} = require('./../config.json');

// DM command for creating new items for the itemlist
module.exports = {
    data: new SlashCommandBuilder()
        .setName('createitem')
        .setDescription('(DM only) Creates a new item in the database.')
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
        if (!interaction.member.roles.cache.has(DMRoleID))
        {
            console.log(`User does not have proper permission`);
            await interaction.editReply(`Only the DM has access to this command!`);
            return;
        }
        const itemName = interaction.options.getString('name');
        const itemDescription = interaction.options.getString('description');
        const itemWeight = interaction.options.getInteger('weight');
        const itemCategory = interaction.options.getString('category');

        await interaction.deferReply({ephemeral: true});

        try 
        {
            const item = await Items.create(
            {
                name: itemName,
                description: itemDescription,
                weight: itemWeight,
                category: itemCategory
            });

            await interaction.editReply(`"${item.name}" was added to the database.`)
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