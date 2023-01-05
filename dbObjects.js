const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Items = require('./models/item.js')(sequelize, Sequelize.DataTypes);
const Players = require('./models/player.js')(sequelize, Sequelize.DataTypes);
const Players_Inv = require('./models/player_inv.js')(sequelize, Sequelize.DataTypes);

//Items.hasOne(Players_Inv);
Players_Inv.belongsTo(Items, {foreignKey: 'item_id', as: 'item'});

// This will become the add item method
Players.prototype.testMethod = async function(item)
{
	console.log(this.player_id);
	await console.log(item.name);
};

Reflect.defineProperty(Players.prototype, 'addItem', {
	value: async item =>
    {
		await console.log(this.player_id);
        /*console.log(this.cur_weight);
        console.log(this.player_id);
        const playerItem = await Players_Inv.findOne({where: {player_id: this.player_id, item_id: item.id }});
        this.cur_weight += item.weight;
        this.save();

		if (playerItem)     
        {
			playerItem.quantity += 1;
			return playerItem.save();
		}

		return Players_Inv.create({ player_id: this.player_id, item_id: item.id});*/
		return true;
	}
}); // This does not work, this keyword returns undefined


module.exports = {Items, Players, Players_Inv};