const {SlashCommandBuilder, userMention, UserSelectMenuBuilder} = require('discord.js');
const {Items, Players, Players_Inv} = require('./../dbObjects.js');
const {Op} = require('sequelize');
const player = require('../models/player.js');

// Adds tag into the database
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
                .setRequired(true)),
    async execute(interaction)
    {
    await interaction.deferReply({ephemeral: true});
        const itemName = interaction.options.getString('name');
        const player = interaction.options.getUser('player');
        console.log(player);
        const item = await Items.findOne({where: {name: {[Op.like]: itemName}}});

        if (!item)
        {
            await interaction.editReply(`That item does not exist.`);
        }
        else
        {
            const person = await Players.findOne({where: {player_id: player.id}});
            if (person)
            {
                const playerItem = await Players_Inv.findOne({where: {player_id: player.id, item_id: item.id}})
                if (playerItem)
                {
                    playerItem.quantity += 1;
                    playerItem.save();
                    console.log(`found in database already`);
                }
                else
                {
                    Players_Inv.create({player_id: player.id, item_id: item.id});
                }
                console.log(`adding weight to ${person.cur_weight}, should be ${person.cur_weight + item.weight}`);
                person.cur_weight += item.weight;
                person.save();
                await interaction.editReply(`The item was successfully given.`);
            }
            else
            {
                await interaction.editReply(`A player could not be found under that user.`)
            }
        }
    },
};