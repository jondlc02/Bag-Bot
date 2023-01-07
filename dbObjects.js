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

Players.prototype.addItem = async function(item, itemNum)
{
	const playerItem = await Players_Inv.findOne({where: {player_id: this.player_id, item_id: item.id}});
	if (!playerItem)
	{
		Players_Inv.create({player_id: this.player_id, item_id: item.id, quantity: itemNum});
	}
	else
	{
		playerItem.quantity += itemNum;
		playerItem.save();
	}
	this.cur_weight += item.weight * itemNum;
	this.save();
};

Players.prototype.removeItem = async function(playerItem, item, itemNum)
{
	// Player Item is a Players_Inv object, itemNum is just an int
	console.log(`Initial itemNum = ${itemNum}`);
	if (playerItem.quantity <= itemNum)
    {
		console.log(`Attempting to delete Item id ${item.id} from player id ${this.player_id}`);
        itemNum = playerItem.quantity;
		console.log(`New itemNum = ${itemNum}`);
        await Players_Inv.destroy({where: {player_id: this.player_id, item_id: item.id}});
    }
    else
    {
        playerItem.quantity -= itemNum;
        playerItem.save();
    }
	this.cur_weight -= item.weight * itemNum;
    this.save();
	return itemNum;
}

/*Reflect.defineProperty(Players.prototype, 'addItem', {
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

		return Players_Inv.create({ player_id: this.player_id, item_id: item.id});
		return true;
	}
}); // This does not work, this keyword returns undefined*/


module.exports = {Items, Players, Players_Inv};