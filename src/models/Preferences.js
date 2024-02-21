const { sequelize, DataTypes } = require("../config/db");

const Preference = sequelize.define("Preference", {
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },

  smoking: {
    type: DataTypes.BOOLEAN(),
  },
  talkative: {
    type: DataTypes.ENUM(['light chitchat','gabfest']),
  },
  musicGenre: {
    type: DataTypes.STRING(45),
  },
  eating: {
    type: DataTypes.BOOLEAN(),
  }
},{timestamps:false}) ;

module.exports = { Preference };
