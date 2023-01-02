module.exports = (sequelize,  DataTypes) => 
{
    return sequelize.define('item', 
    {
        name: 
        { // Specifies that the name part of the weapon is a string/text and that each name
            type: DataTypes.TEXT, // Must be unique to be entered into the database
            unique: true,
	    },
	    description: DataTypes.TEXT, // Tags also have descriptions which must be string/text
        category_ID: DataTypes.INTEGER,
	    owner: DataTypes.TEXT // Tags include usernames
    }, {timestamps: false});
};