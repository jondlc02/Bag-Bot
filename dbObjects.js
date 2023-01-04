const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Tags = require('./models/tags.js')(sequelize, Sequelize.DataTypes);
const Items = require('./models/item.js')(sequelize, Sequelize.DataTypes);
const Players = require('./models/player.js')(sequelize, Sequelize.DataTypes);
const Players_Inv = require('./models/player_inv.js')(sequelize, Sequelize.DataTypes);

Players_Inv.belongsTo(Items, { foreignKey: 'item_id', as: 'item'});

Reflect.defineProperty(Players.prototype, 'addItem', {
	value: async item => {
		const playerItem = await Players_Inv.findOne({
			where: { player_id: this.player_id, item_id: item.id },
		});

		if (playerItem) 
        {
			playerItem.amount += 1;
			return playerItem.save();
		}

		return Players_Inv.create({ player_id: this.player_id, item_id: item.id});
	},
});


module.exports = {Tags, Items, Players, Players_Inv};