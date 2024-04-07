const { Op, Sequelize, where } = require("sequelize");
const { Recurrence } = require("../models/Recurrence");
const { Ride } = require("../models/Ride");
const { RideOccurence } = require("../models/RideOccurence");
const { User } = require("../models/User");
const { isPointInPolygon } = require("geolib");
const { decode } = require("@googlemaps/polyline-codec");
const { Preference } = require("../models/Preferences");
const { RideRequest } = require("../models/RideRequest");

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
//searches for rides based on filters provided by passenger

// to do : dont show rides posted by the passenger
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
    passengerId,
  } = req.query;
  console.log(req.query);
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
          //only send the ride OCcurences Ids
          attributes: ["id"],
        },
      ],
      attributes: ["encodedArea"],
    });
    const ridesInRange = rides
      .filter(ride => {
        const isPassengerInRange = isPointInPolygon(
          JSON.parse(destinationOrOrigin),
          formatPolygon(ride.encodedArea)
        );
        return isPassengerInRange;
      })
      .flatMap(ride => ride.Ride_occurences.map(rOcc => rOcc.id));
    //fething all requests the passenger made
    const requests = await RideRequest.findAll({
      where: { passengerId: passengerId },
    });
    //filtering rideoccs that the passenger requested 
    const unrequestedMatchingRides = ridesInRange.filter(rocc => {
      return !requests.some(req => req.RideOccurenceId === rocc);
    });

    console.log("MATCHED RIDES COUNT", unrequestedMatchingRides.length);

    return res.status(200).json({
      rides: unrequestedMatchingRides,
    });
  } catch (error) {
    console.log("==================");
    console.error("Error searching for a ride ", error);
    return res.status(500).json(error);
  }
};
//accepts ride Ids and fetches them / todo:  exclude rides already sent request
const fetchRidesByIds = async (req, res) => {
  console.log("==================");
  console.log("search for specefic rides request received ");
  console.log(req.query);
  const { ids } = req.query;
  const rideIds = ids.split(",");
  try {
    //fetch all details abt ride occ = parent ride - user driver - user preferences
    const rides = await RideOccurence.findAll({
      where: {
        id: {
          [Op.in]: rideIds,
        },
      },
      include: [
        {
          model: Ride,
          include: [
            {
              model: User,
              as: "driver",
              attributes: [
                "firebaseId",
                "email",
                "firstName",
                "phoneNumber",
                "lastName",
              ],
              include: [
                {
                  model: Preference,
                  attributes: { exclude: ["id", "UserFirebaseId"] },
                },
              ],
            },
          ],
          attributes: { exclude: ["encodedArea"] },
        },
      ],
      attributes: ["id", "occurenceDate", "note"],
    });

    return res.status(200).json({
      rides: rides,
    });
  } catch (error) {
    console.log("==================");
    console.error("Error fetching  rides ", error);
    return res.status(500).json(error);
  }
};
// will redo this with sequelize logic in future
const fetchAllUnrequestedRides = async (req, res) => {
  console.log("==================");
  console.log("fetch all unfiltered & unrequested rides received ");
  const { passengerId, filterDate } = req.body;
  try {
    // Fetch all details about ride occurrences = parent ride - user driver - user preferences
    const _ = await RideOccurence.findAll({
      where: { occurenceDate: filterDate.split("T")[0], status: 0 },
      //including relevant data with ride occurence
      include: [
        {
          model: Ride,
          include: [
            {
              model: User,
              as: "driver",
              attributes: [
                "firebaseId",
                "email",
                "firstName",
                "phoneNumber",
                "lastName",
              ],
              include: [
                {
                  model: Preference,
                  attributes: { exclude: ["id", "UserFirebaseId"] },
                },
              ],
            },
          ],
          attributes: { exclude: ["encodedArea"] },
        },
      ],
      attributes: ["id", "occurenceDate", "note"],
    });
    console.log("OCCs", _.length);
    //fething all requests the passenger made
    const requests = await RideRequest.findAll({
      where: { passengerId: passengerId },
    });

    console.log("REQS", requests.length);
    //filtering rideOccurences that already are requested by the passenger
    const unrequestedRideOccs = _.filter(rocc => {
      return !requests.some(req => req.RideOccurenceId === rocc.id);
    });

    console.log("unrequested ", unrequestedRideOccs.length);

    return res.status(200).json({ rides: unrequestedRideOccs });
  } catch (error) {
    console.log("==================");
    console.error("Error fetching rides ", error);
    return res.status(500).json(error);
  }
};

//utility functions here --
const isNewRideDateToday = initialDate => {
  const rideDate = initialDate.setHours(0, 0, 0, 0);
  const currentDate = new Date().setHours(0, 0, 0, 0);
  return rideDate === currentDate;
};
const timeFilterHandler = (fromTime, toTime) => {
  if (!toTime) {
    return { [Op.eq]: fromTime };
  }
  return { [Op.between]: [fromTime, toTime] };
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

module.exports = {
  createRide,
  searchForRides,
  fetchRidesByIds,
  fetchAllUnrequestedRides,
};
