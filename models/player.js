module.exports = (sequelize,  DataTypes) => 
{
    return sequelize.define('player', 
    {
        player_id: 
        {
            type: DataTypes.STRING,
            unique: true,
            primary_key: true
	    },
        strength:
        {
            type:DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        dexterity:
        {
            type:DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        constitution:
        {
            type:DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        intelligence:
        {
            type:DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        wisdom:
        {
            type:DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        charisma:
        {
            type:DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
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