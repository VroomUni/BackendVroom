const { sequelize, DataTypes } = require("../config/db");
const { Car } = require("./Car");
const { Preference } = require("./Preferences");
const { Ride } = require("./Ride");
const { RideOccurence } = require("./RideOccurence");
const { RideRequest } = require("./RideRequest");
const { DriverRating } = require("./DriverRating");
const { PassengerRating } = require("./PassengerRating");

const User = sequelize.define(
  "User",
  {
    // id: {
    //   type: DataTypes.INTEGER,
    //   autoIncrement: true,
    // },
    firebaseId: { type: DataTypes.STRING(96), primaryKey: true },

    email: {
      type: DataTypes.STRING(45),
      allowNull: false,
      validate: {
        is: /^[a-zA-Z0-9._-]+@(medtech\.tn|msb\.tn|smu\.tn)$/, //ends with msb.tn or medtech.tn
      },
    },
    firstName: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    gender: {
      type: DataTypes.ENUM("male", "female"),
      allowNull: false,
    },
    profilePicPath: {
      type: DataTypes.STRING(45),
    },
  },
  {
    //sequelize adds timestamp such as createdAt by default
    timestamps: false,
  }
);
//associations
User.hasOne(Car, {
  onDelete: "CASCADE",
});
Car.belongsTo(User);
User.hasOne(Preference, {
  onDelete: "CASCADE",
});
Preference.belongsTo(User);
//Driver offers many rides assoviation
//need to include as driver for join later !!!
Ride.belongsTo(User, { as: "driver" });

//PAssenger Ride occurence association through Ride requests
User.belongsToMany(RideOccurence, {
  through: RideRequest,
  foreignKey: "passengerId",
}); //1 user can request many ride occurences
RideOccurence.belongsToMany(User, { through: RideRequest }); //1 Ride occurence can have many user requests

//ride / ride occ associoation
Ride.hasMany(RideOccurence);
RideOccurence.belongsTo(Ride);

//driver rates Request association
User.belongsToMany(RideRequest, {
  through: DriverRating,
  foreignKey: "driverId",
}); // 1 user , in this case driver rates many requests

// passenger rates ride occurence association
User.belongsToMany(RideOccurence, {
  through: PassengerRating,
  foreignKey: "passengerId",
});
RideOccurence.belongsToMany(User, {
  through: PassengerRating,
});

module.exports = { User };
