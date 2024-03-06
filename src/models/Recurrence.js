const { sequelize, DataTypes } = require("../config/db");

const Recurrence = sequelize.define(
  "Recurrence",
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },

    type: {
      type: DataTypes.ENUM("once", "weekly", "everyday"),
      allowNull: false,
      defaultValue: "once",
    },
    daysOfWeek: {
      type: DataTypes.JSON,
    },
  },

  { timestamps: false }
);

module.exports = { Recurrence };
