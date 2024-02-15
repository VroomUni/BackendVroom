const { sequelize, DataTypes } = require("../config/db");

const Car = sequelize.define("Car", {
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },

  brand: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  model: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
},{timestamps:false}) ;

module.exports = { Car };
