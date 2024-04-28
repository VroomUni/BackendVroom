//const { RideOccurence, Ride, User,PassengerRating ,sequelize } = require("../models");
const { RideOccurence } = require("../models/RideOccurence");
const { Ride } = require("../models/Ride");
const { User } = require("../models/User");
const { PassengerRating } = require("../models/PassengerRating");
const { RideRequest } = require("../models/RideRequest");
const { Op, Sequelize } = require("sequelize");
const getPassengerRideHistory = async passengerId => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  try {
    //fetch all details abt ride occs in the past (at least one hour has passed  ) - its parent ride -accepted requests on it
    const rides = await RideOccurence.findAll({
      where: {
        //to get occurences that are non-canceled
        status: [0, 1],
        // either compare strictly by date , or if ride is today compare by time => startTime < now - 1 hour
        [Op.or]: [
          {
            occurenceDate: {
              [Op.lt]: today, // Compare by date: date must be less than today
            },
          },
          Sequelize.literal(
            `(occurenceDate = CURDATE() AND Ride.startTime < DATE_SUB(NOW(), INTERVAL 1 HOUR))`
          ),
        ],
      },

      include: [
        {
          model: Ride,
          attributes: ["startTime", "from", "to", "spots"],
          include: [
            {
              model: User,
              as: "driver",
              attributes: { exclude: ["exponentPushToken"] },
            },
          ],
        },
        {
          model: User,
          as: "passenger",
          through: {
            model: RideRequest,
            // fetch only accepted requests fot the given passenger
            where: { status: 1, passengerId: passengerId },
          },
          required: true,

          attributes: [],
        },
      ],
    });
    console.log(rides.length);
    console.log(JSON.stringify(rides));
    return rides;
  } catch (error) {
    console.log("==================");
    console.error("Error fetching  rides ", error);
  }
};

const getDriverRideHistory = async driverFirebaseId => {
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
              Sequelize.literal(
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

    return rides.map(ride => ({
      rideNumber: ride.Ride.id, // Use ride ID as ride number
      startPoint: ride.Ride.from,
      endPoint: ride.Ride.to,
      rideTime: ride.occurrenceDate,
      passengers: ride.passengers.map(passenger => ({
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
