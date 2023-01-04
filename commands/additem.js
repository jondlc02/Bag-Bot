const {SlashCommandBuilder, userMention, UserSelectMenuBuilder, Collection} = require('discord.js');
const {Items, Players, Players_Inv} = require('./../dbObjects.js');
const {DMRoleID} = require('./../config.json');
const {Op} = require('sequelize');

// DM command for giving players new items to their inventories. Usually used to give items
// from NPCs or found around the world.
module.exports = {
    data: new SlashCommandBuilder()
        .setName('additem')
        .setDescription('Give an item to a player as the DM.')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('Name of the item you wish to give to a player.')
                .setRequired(true))
        .addUserOption(option =>
            option
                .setName('player')
                .setDescription('The player you would like to give the item to.')
                .setRequired(true))
        .setDefaultMemberPermissions(),
    async execute(interaction)
    {
        await interaction.deferReply({ephemeral: true});

        if (!interaction.member.roles.cache.has(DMRoleID))
        {
            console.log(`User does not have proper permission`);
            await interaction.editReply(`Only the DM has access to this command!`);
            return;
        }

        console.log(`adding item maybe`);
        const itemName = interaction.options.getString('name');
        const player = interaction.options.getUser('player');

        const item = await Items.findOne({where: {name: {[Op.like]: itemName}}});
        if (!item)
        {
            await interaction.editReply(`That item does not exist.`);
            return;
        }

        const person = await Players.findOne({where: {player_id: player.id}});
        if (!person)
        {
            await interaction.editReply(`A player could not be found under that user.`);
            return;
            
        }

        //console.log(person.player_id);
        //person.addItem(item);
        const playerItem = await Players_Inv.findOne({where: {player_id: player.id, item_id: item.id}})
        if (playerItem)
        {
            playerItem.quantity += 1;
            playerItem.save();
        }
        else
        {
            Players_Inv.create({player_id: player.id, item_id: item.id});
        }

        person.cur_weight += item.weight;
        person.save();
        await interaction.editReply(`The item was successfully given.`);
    }
};