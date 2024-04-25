//const { RideOccurence, Ride, User,PassengerRating ,sequelize } = require("../models");
const { RideOccurence } = require("../../models/RideOccurence");
const { Ride } = require("../../models/Ride");
const { User } = require("../../models/User");
const { PassengerRating } = require("../../models/PassengerRating");
const { RideRequest } = require("../../models/RideRequest");
const { sequelize } = require("../../config/db");
const getPassengerRideHistory = async (passengerFirebaseId) => {
  try {
    const rides = await RideOccurence.findAll({
      attributes: ["occurenceDate"],
      include: [
        {
          model: Ride,
          attributes: ["from", "to", "startTime"],
          include: [
            {
              model: User,
              as: "driver",
              attributes: [
                ["firstName", "driverFirstName"],
                ["lastName", "driverLastName"],
                [
                  sequelize.literal(
                    "TIMESTAMPDIFF(YEAR, `driver`.`birthDate`, CURDATE())"
                  ),
                  "driverAge",
                ],
              ],
            },
          ],
        },
        {
          model: RideRequest,
          where: { passengerFirebaseId, status: 1 }, 
          required: true, // Inner join with RideRequest
        },
      ],
      order: [["occurenceDate", "DESC"]],
    });

    return rides.map((ride) => ({
      driverFirstName: ride.Ride.driver.driverFirstName,
      driverLastName: ride.Ride.driver.driverLastName,
      driverAge: ride.Ride.driver.driverAge,
      startPoint: ride.Ride.from,
      destination: ride.Ride.to,
      rideTime: ride.occurenceDate,
      startTime: ride.Ride.startTime, // Include start time of the ride
    }));
  } catch (error) {
    console.error("Error fetching passenger ride history:", error);
    throw error;
  }
};

const getDriverRideHistory = async (driverFirebaseId) => {
  try {
    const rides = await RideOccurence.findAll({
      attributes: ["occurrenceDate"],
      include: [
        {
          model: Ride,
          attributes: ["from", "to"],
          where: { driverFirebaseId }, // Filter by driverFirebaseId
        },
        {
          model: User,
          as: "passengers",
          attributes: [
            "photo",
            "firstName",
            "lastName",
            "birthDate",
            [
              sequelize.literal(
                "TIMESTAMPDIFF(YEAR, `User`.`birthDate`, CURDATE())"
              ),
              "age",
            ],
          ],
          through: {
            model: PassengerRating,
            attributes: [], // Exclude join table attributes
          },
        },
      ],
      order: [["occurrenceDate", "DESC"]],
    });

    return rides.map((ride) => ({
      rideNumber: ride.Ride.id, // Use ride ID as ride number
      startPoint: ride.Ride.from,
      endPoint: ride.Ride.to,
      rideTime: ride.occurrenceDate,
      passengers: ride.passengers.map((passenger) => ({
        photo: passenger.photo,
        name: passenger.firstName,
        lastName: passenger.lastName,
        age: passenger.age,
      })),
    }));
  } catch (error) {
    console.error("Error fetching driver ride history:", error);
    throw error;
  }
};

module.exports = { getPassengerRideHistory, getDriverRideHistory };

/*SELECT
    R.occurenceDate AS rideTime,
    RD.firstName AS driverFirstName,
    RD.lastName AS driverLastName,
    TIMESTAMPDIFF(YEAR, RD.birthDate, CURDATE()) AS driverAge,
    R.from AS startPoint,
    R.to AS destination
FROM
    RideOccurence R
INNER JOIN
    Ride RR ON R.RideId = RR.id
INNER JOIN
    User RD ON RR.driverId = RD.id
WHERE
    RD.firebaseId = :passengerFirebaseId
ORDER BY
    R.occurenceDate DESC;
*/
