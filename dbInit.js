const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

require('./models/item_rec.js')(sequelize, Sequelize.DataTypes);
require('./models/item.js')(sequelize, Sequelize.DataTypes);
require('./models/player.js')(sequelize, Sequelize.DataTypes);
require('./models/player_inv.js')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({force: force});
console.log(`Database synced.`);

