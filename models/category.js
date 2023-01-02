module.exports = (sequelize,  DataTypes) => 
{
    return sequelize.define('category', 
    {
        category: DataTypes.TEXT
    }, {timestamps: false});
};