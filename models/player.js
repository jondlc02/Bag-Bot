module.exports = (sequelize,  DataTypes) => 
{
    return sequelize.define('player', 
    {
        player_id: 
        {
            type: DataTypes.STRING,
            primary_key: true,
	    },
	    gold:
        {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
	    max_weight:
        {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        cur_weight: 
        {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        }
    }, {timestamps: false});
};