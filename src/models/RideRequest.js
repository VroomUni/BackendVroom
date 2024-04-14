const { sequelize, DataTypes } = require("../config/db");

const RideRequest = sequelize.define("ride_request", {
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },

  passengerLocation: {
    type: DataTypes.GEOMETRY("POINT"),
    allowNull: false,
  },

  status: {
    type: DataTypes.INTEGER,
    //-1 : declined , 0 : pending , 1 : accepted
    validate: {
      isIn: [[-1, 0, 1]],
    },
    allowNull: false,
    defaultValue:0
  },
});

module.exports = { RideRequest };
