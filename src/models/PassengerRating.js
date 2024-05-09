// const { sequelize, DataTypes } = require("../config/db");
// const { User } = require("./User");
// const { RideOccurrence } = require("./RideOccurence"); 

// const PassengerRating = sequelize.define("passenger_rating", {
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

//   driverId: {
//     type: DataTypes.UUID,
//     references: {
//       model: User,
//       key: 'id'
//     }
//   },

//   passengerId: {
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

// module.exports = {PassengerRating};







const { sequelize, DataTypes } = require("../config/db");
//rates made by passengers on rides 
const PassengerRating = sequelize.define("passenger_rating", {
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
module.exports = { PassengerRating };