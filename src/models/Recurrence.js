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
      type: DataTypes.ENUM("once", "weekly", "daily"),
      allowNull: true,
      defaultValue: "once",
    },
    dayOfWeek: {
      type: DataTypes.ENUM(
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday"
      ),
      allowNull: true,
    },
  },

  { timestamps: false }
);

module.exports = { Recurrence };
