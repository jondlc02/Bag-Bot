const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

require('./models/tags.js')(sequelize, Sequelize.DataTypes);
require('./models/item.js')(sequelize, Sequelize.DataTypes);
require('./models/player.js')(sequelize, Sequelize.DataTypes);
require('./models/player_inv.js')(sequelize, Sequelize.DataTypes);
sequelize.sync();
console.log(`Database synced.`);

