const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Categories = require('./models/category.js')(sequelize, Sequelize.DataTypes);
require('./models/tags.js')(sequelize, Sequelize.DataTypes);
require('./models/item.js')(sequelize, Sequelize.DataTypes);
require('./models/player.js')(sequelize, Sequelize.DataTypes);
require('./models/player_inv.js')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => 
{
	const types =
	[
		Categories.upsert({category: 'Weapons'}),
		Categories.upsert({category: 'Armor'}),
		Categories.upsert({category: 'Consumables'}),
		Categories.upsert({category: 'Key Items'}),
		Categories.upsert({category: 'Misc'})
	];

	await Promise.all(types);
	console.log('Database synced.');
	sequelize.close();
}).catch(console.error);