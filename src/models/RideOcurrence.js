const { sequelize, DataTypes } = require("../config/db");

const RideOccurence = sequelize.define("Ride_occurence", {
  id: { primaryKey: true, type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },

  status: {
    type: DataTypes.INTEGER,
    //-1 : canceled , 0 : available , 1 : fullyReserved , 2 : done
    validate: {
      isIn: [[-1, 0, 1, 2]],
    },
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  note: {
    type: DataTypes.STRING(45),
  },
});

module.exports = { RideOccurence };
