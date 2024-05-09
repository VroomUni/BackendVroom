// const { sequelize, DataTypes } = require("../config/db");
// const { User } = require("./User");
// const { RideOccurrence } = require("./RideOccurence"); // Replace with your actual RideOccurrence model

// // Ratings given by passengers to drivers
// const DriverRating = sequelize.define("driver_rating", {
//   id: {
//     primaryKey: true,
//     type: DataTypes.UUID,
//     defaultValue: DataTypes.UUIDV4,
//   },

//   value: {
//     type: DataTypes.FLOAT(),
//     allowNull: false,
//   },

//   createdAt: {
//     type: DataTypes.DATE,
//     allowNull: false,
//     defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
//   },

//   updatedAt: {
//     type: DataTypes.DATE,
//     allowNull: false,
//     defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
//   },

//   passengerId: {
//     type: DataTypes.UUID,
//     references: {
//       model: User,
//       key: 'id'
//     }
//   },

//   driverId: {
//     type: DataTypes.UUID,
//     references: {
//       model: User,
//       key: 'id'
//     }
//   },

//   rideOccurrenceId: {
//     type: DataTypes.UUID,
//     references: {
//       model: RideOccurrence,
//       key: 'id'
//     }
//   }
// });


// module.exports = {DriverRating};
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
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
  },

  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
  },

  driverId: {
    type: DataTypes.UUID,
  
  },

  passengerId: {
    type: DataTypes.UUID,
   
  },

  rideOccurrenceId: {
    type: DataTypes.UUID,
   
  }
});
module.exports = { DriverRating };


