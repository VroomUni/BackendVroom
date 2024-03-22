const { Recurrence } = require("../models/Recurrence");
const { Ride } = require("../models/Ride");
const { RideOccurence } = require("../models/RideOccurence");

const createRide = async (req, res) => {
  console.log("createRide request received ");

  try {
    const { recurrence, ...rideObj } = req.body;
    const newRide = await Ride.create(
      { ...rideObj, Recurrence: recurrence },
      { include: Recurrence }
    );
    console.log("==================");
    console.log(" ride : SUCCESS  ");
    const isRideDateToday =
      new Date(newRide.initialDate).setHours(0, 0, 0, 0) ==
      new Date().setHours(0, 0, 0, 0);
    if (recurrence.type === "once") {
      await RideOccurence.create({ occurenceDate: newRide.initialDate });
    }
    //check if ride is today , if not dont create occurences , the scheduled script will take over
    else if (recurrence.type === "weekly" && isRideDateToday) {
      const daysOfWeek = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];

      // Get the current day index
      const todayDay = new Date().getDay();

      // Loop through the recurrence object
      for (const repeatingDay of Object.keys(recurrence.daysOfWeek)) {
        const repeatingDayIndex = daysOfWeek.indexOf(repeatingDay);

        //if ride is today , and its repeating => create rideOcc for today and for +7 days
        if (todayDay === repeatingDayIndex) {
          const initialDate = new Date(newRide.initialDate);
          const nextTargetDayDate = new Date(initialDate);
          nextTargetDayDate.setDate(initialDate.getDate() + 7);

          console.log(
            "next occurrence of:",
            daysOfWeek[repeatingDayIndex],
            "date:",
            nextTargetDayDate
          );
          await RideOccurence.bulkCreate([
            { occurenceDate: initialDate, RideId: newRide.id },
            { occurenceDate: nextTargetDayDate, RideId: newRide.id },
          ]);
        } else {
          const daysUntilTargetDay = (repeatingDayIndex + 7 - todayDay) % 7;
          const nextTargetDayDate = new Date();
          nextTargetDayDate.setDate(
            nextTargetDayDate.getDate() + daysUntilTargetDay
          );

          console.log(
            "next occurrence of:",
            daysOfWeek[repeatingDayIndex],
            "date:",
            nextTargetDayDate
          );
          await RideOccurence.create({ occurenceDate: nextTargetDayDate });
        }
      }
    } else if (recurrence.type === "everyday" && isRideDateToday) {
    }

    return res.status(200).json({
      msg: "Successful Ride creation ",
    });
  } catch (error) {
    console.log("==================");
    console.error("Error creating ride ", error);
    return res.status(500).json(error);
  }
};

async function generateRideOccurences(recurrence) {
  toISOString().slice(0, 10).replace("T", " ");
}
module.exports = { createRide };
