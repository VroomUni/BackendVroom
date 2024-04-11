const { sequelize, DataTypes } = require("../config/db");

const RideOccurence = sequelize.define("Ride_occurence", {
  id: { primaryKey: true, type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },

  status: {
    type: DataTypes.INTEGER,
    //-1 : canceled , 0 : available , 1 : fullyReserved 
    validate: {
      isIn: [[-1, 0, 1]],
    },
    allowNull: false,
    defaultValue:0
  },
  occurenceDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  note: {
    type: DataTypes.STRING(45),
  },
},{timestamps:false});

module.exports = { RideOccurence };
