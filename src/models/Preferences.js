const { sequelize, DataTypes } = require("../config/db");

const Preference = sequelize.define(
  "Preference",
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },

    smoking: {
      type: DataTypes.BOOLEAN(),
    },
    talkative: {
      type: DataTypes.BOOLEAN(),
    },
    loudMusic: {
      type: DataTypes.BOOLEAN(),
    },
    foodFriendly: {
      type: DataTypes.BOOLEAN(),
    },
    girlsOnly: {
      type: DataTypes.BOOLEAN(),
      defaultValue: false,
    },
    boysOnly: {
      type: DataTypes.BOOLEAN(),
      defaultValue: false,
    },
  },
  { timestamps: false }
);

module.exports = { Preference };
