const { sequelize, DataTypes } = require("../config/db");

const Preference = sequelize.define("Preference", {
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },

  smoking: {
    type: DataTypes.BOOLEAN(),
    allowNull: true,
  },
  talkative: {
    type: DataTypes.ENUM(['light chitchat','gabfest']),
    allowNull: true,
  },
  musicGenre: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  eating: {
    type: DataTypes.BOOLEAN(),
    allowNull: true,
  }
},{timestamps:false}) ;

module.exports = { Preference };
