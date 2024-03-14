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
    defaultValue: 0,
    //-1 : canceled , 0 : active
    validate: {
      isIn: [[-1, 0]],
    },
    allowNull: false,
  },
  initialDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },

  spots: {
    type: DataTypes.INTEGER(),
    allowNull: false,
  },
  encodedPath: {
    type: DataTypes.TEXT(),
    allowNull: false,
  },
  encodedArea: {
    type: DataTypes.TEXT(),
    allowNull: false,
  },
});
//assoc
Ride.hasOne(Recurrence, {
  onDelete: "cascade",
  hooks: true,
});
Recurrence.belongsTo(Ride);

module.exports = { Ride };
