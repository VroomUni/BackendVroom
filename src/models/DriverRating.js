const { sequelize, DataTypes } = require("../config/db");
//rates made by passengers on rides 
const DriverRating = sequelize.define("driver_rating", {
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },

  value: {
    type: DataTypes.FLOAT(),
    allowNull: false,
  },
});

module.exports = { DriverRating };

