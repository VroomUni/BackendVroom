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
      allowNull: false,
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
    },
  },

  { timestamps: false }
);

module.exports = { Recurrence };
