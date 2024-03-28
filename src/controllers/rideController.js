const { Op, json } = require("sequelize");
const { Recurrence } = require("../models/Recurrence");
const { Ride } = require("../models/Ride");
const { RideOccurence } = require("../models/RideOccurence");
const { isPointInPolygon, isValidCoordinate } = require("geolib");
const { decode } = require("@googlemaps/polyline-codec");

const createRide = async (req, res) => {
  console.log("==================");
  console.log("createRide request received ");

  try {
    const { recurrence, ...rideObj } = req.body;
    console.log(req.body);
    const newRide = await Ride.create(
      { ...rideObj, Recurrence: recurrence },
      { include: Recurrence }
    );

    console.log(" ride : SUCCESS  ");

    const initialDate = new Date(newRide.initialDate);
    const isRideDateToday = isNewRideDateToday(initialDate);

    if (recurrence.type === "once") {
      await createOnceRideOccurrence(newRide.initialDate, newRide.id);
    } else if (recurrence.type === "everyday") {
      await createDailyRideOccurences(initialDate, newRide.id);
    } else if (recurrence.type === "weekly") {
      //check if rideIsToday to create 2 occurences for that repeating day
      await createWeeklyRideOccurrences(
        initialDate,
        recurrence.daysOfWeek,
        newRide.id,
        isRideDateToday
      );
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

const timeFilterHandler = (fromTime, toTime) => {
  if (!toTime) {
    return { [Op.eq]: fromTime };
  }
  return { [Op.between]: [fromTime, toTime] };
};
const searchForRides = async (req, res) => {
  console.log("==================");
  console.log("search for ride request received ");
  const {
    from,
    to,
    destinationOrOrigin,
    initialDate: rideDate,
    fromTime,
    toTime,
  } = req.query;
  console.log(req.query);
  // destinationOrOrigin=JSON.parse(destinationOrOrigin);
  try {
    const rides = await Ride.findAll({
      where: {
        // either same from or same to
        [Op.or]: { from: from, to: to },
        //to handle both cases when an exact time or an interval is provided
        startTime: timeFilterHandler(fromTime, toTime),
        status: 0,
      },
      include: [
        {
          model: RideOccurence,
          where: {
            occurenceDate: rideDate,
            status: 0,
          },
        },
      ],
    });
    rides.forEach(ride => {
      ride.Ride_occurences.forEach(rOcc => {
        console.log(rOcc.dataValues);
      });
    });

    const matchingRides = rides.filter(ride => {
      const isPassengerInRange = isPointInPolygon(
        JSON.parse(destinationOrOrigin),
        formatPolygon(ride.encodedArea)
      );
      return isPassengerInRange;
    });

    console.log("MATCHED RIDES COUNT", matchingRides.length);

    return res.status(200).json({
      rides: matchingRides,
    });
  } catch (error) {
    console.log("==================");
    console.error("Error searching for a ride ", error);
    return res.status(500).json(error);
  }
};

//utility functions here --
const isNewRideDateToday = initialDate => {
  const rideDate = initialDate.setHours(0, 0, 0, 0);
  const currentDate = new Date().setHours(0, 0, 0, 0);
  return rideDate === currentDate;
};

const formatPolygon = polygon => {
  return decode(polygon).map(cord => ({
    latitude: cord[0],
    longitude: cord[1],
  }));
};
const createOnceRideOccurrence = async (initialDate, rideId) => {
  await RideOccurence.create({
    occurenceDate: initialDate,
    RideId: rideId,
  });
};

const createWeeklyRideOccurrences = async (
  initialDate,
  repeatingDays,
  rideId,
  isRideDateToday
) => {
  const daysOfWeekArray = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const rideDateDayIndex = initialDate.getDay();
  //loop through repeating days in recurrence obj
  for (const repeatingDay of Object.keys(repeatingDays)) {
    const repeatingDayIndex = daysOfWeekArray.indexOf(repeatingDay);
    //if ride is today , and today is on the repeating days
    if (rideDateDayIndex === repeatingDayIndex && isRideDateToday) {
      const nextTargetDayDate = new Date(initialDate).setDate(
        initialDate.getDate() + 7
      );

      //create an occ for today and for next week on the same day , since its repeating
      await RideOccurence.bulkCreate([
        { occurenceDate: initialDate, RideId: rideId },
        { occurenceDate: nextTargetDayDate, RideId: rideId },
      ]);
      console.log("==================");
      console.log(
        "next occurrence of:",
        daysOfWeekArray[repeatingDayIndex],
        "date:",
        nextTargetDayDate
      );
      return;
    }
    //ride is not today and today is not repeating
    else {
      const daysUntilTargetDay = (repeatingDayIndex + 7 - rideDateDayIndex) % 7;
      const nextTargetDayDate = new Date(initialDate);
      nextTargetDayDate.setDate(
        nextTargetDayDate.getDate() + daysUntilTargetDay
      );

      await RideOccurence.create({
        occurenceDate: nextTargetDayDate,
        RideId: rideId,
      });
      console.log("==================");

      console.log(
        "next occurrence of:",
        daysOfWeekArray[repeatingDayIndex],
        "date:",
        nextTargetDayDate
      );
    }
  }
};

const createDailyRideOccurences = async (initialDate, rideId) => {
  const dailyRideOccs = [];
  //ierate through each day for the next 7 days and add an occurence
  for (let i = 0; i < 7; i++) {
    const nextTargetDayDate = new Date(initialDate);
    nextTargetDayDate.setDate(nextTargetDayDate.getDate() + i);
    const rideOcc = {
      occurenceDate: nextTargetDayDate,
      RideId: rideId,
    };
    dailyRideOccs.push(rideOcc);
  }
  await RideOccurence.bulkCreate(dailyRideOccs);
  console.log("==================");

  console.log("Ride Occs created successfully", dailyRideOccs);
  return;
};

module.exports = { createRide, searchForRides };
