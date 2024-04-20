// //const { RideOccurence, Ride, User, sequelize } = require("../models");

// const getPassengerRideHistory = async (passengerFirebaseId) => {
//   try {
//     const rides = await RideOccurence.findAll({
//       attributes: ["occurenceDate"],
//       include: [
//         {
//           model: Ride,
//           attributes: ["from", "to"],
//           include: [
//             {
//               model: User,
//               as: "driver",
//               attributes: [
//                 ["firstName", "driverFirstName"],
//                 ["lastName", "driverLastName"],
//                 [
//                   sequelize.literal(
//                     "TIMESTAMPDIFF(YEAR, `driver`.`birthDate`, CURDATE())"
//                   ),
//                   "driverAge",
//                 ],
//               ],
//             },
//           ],
//         },
//       ],
//       where: { passengerFirebaseId },
//       order: [["occurenceDate", "DESC"]],
//     });

//     return rides.map((ride) => ({
//       driverFirstName: ride.Ride.driver.driverFirstName,
//       driverLastName: ride.Ride.driver.driverLastName,
//       driverAge: ride.Ride.driver.driverAge,
//       startPoint: ride.Ride.from,
//       destination: ride.Ride.to,
//       rideTime: ride.occurenceDate,
//     }));
//   } catch (error) {
//     console.error("Error fetching passenger ride history:", error);
//     throw error;
//   }
// };

// module.exports = { getPassengerRideHistory };
