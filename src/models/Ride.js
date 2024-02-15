const { sequelize, DataTypes } = require("../config/db");
const { Recurrence } = require("./Recurrence");


const Ride = sequelize.define("Ride", {
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  from: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  to: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },

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
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },

  passengerLimit: {
    type: DataTypes.INTEGER(),
    allowNull: false,
  },
  encodedPath: {
    type: DataTypes.TEXT(),
    allowNull: false,
  },
});
//assoc
Ride.hasMany(Recurrence);
Recurrence.belongsTo(Ride);



module.exports = { Ride };
