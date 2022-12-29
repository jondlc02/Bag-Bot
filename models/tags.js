module.exports = (sequelize,  DataTypes) => 
{
    return sequelize.define('tags', 
    {
        name: 
        { // Specifies that the name part of the tag is a string/text and that each name
            type: DataTypes.TEXT, // Must be unique to be entered into the database
            unique: true,
	    },
	    description: DataTypes.TEXT, // Tags also have descriptions which must be string/text
	    username: DataTypes.TEXT, // Tags include usernames
	    usage_count: 
        {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
	    },
    }, {timestamps: false});
};