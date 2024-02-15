const { sequelize, DataTypes } = require("../config/db");

const RideRequest = sequelize.define("ride_request", {
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  //  to fetch only rides in the same direction as the req (either  passenger & driver both from SMU to x ||both from x to SMU)
  // we compare the req.from with ride.from (or ride.to with req.to)
  // (but req.from is of type POINT gemotry , and ride.from is of type string , so that has to be handled)
  from: {
    type: DataTypes.GEOMETRY("POINT"),
    allowNull: false,
  },
  to: {
    type: DataTypes.GEOMETRY("POINT"),
    allowNull: false,
  },

  status: {
    type: DataTypes.INTEGER,
    //-1 : canceled , 0 : pending , 1 : accepted
    validate: {
      isIn: [[-1, 0, 1]],
    },
    allowNull: false,
  },
});
//assoc


module.exports = { RideRequest };
