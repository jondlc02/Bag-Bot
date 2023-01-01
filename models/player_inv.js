module.exports = (sequelize,  DataTypes) => 
{
    return sequelize.define('player_inv', 
    {
        user_id: DataTypes.STRING,
        item_id: DataTypes.INTEGER,
	    quantity:
        {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        }
    }, {timestamps: false});
};