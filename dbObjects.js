const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Tags = require('./models/tags.js')(sequelize, Sequelize.DataTypes);
const Weapons = require('./models/weapon.js')(sequelize, Sequelize.DataTypes);
const Armor = require('./models/armor.js')(sequelize, Sequelize.DataTypes);
const Consumables = require('./models/consumable.js')(sequelize, Sequelize.DataTypes);
const Key_Items = require('./models/keyitem.js')(sequelize, Sequelize.DataTypes);
const Misc = require('./models/misc.js')(sequelize, Sequelize.DataTypes);
const Players = require('./models/player.js')(sequelize, Sequelize.DataTypes);
const Players_Inv = require('./models/player_inv.js')(sequelize, Sequelize.DataTypes);
module.exports = {Tags, Weapons, Armor, Consumables, Key_Items, Misc, Players, Players_Inv};