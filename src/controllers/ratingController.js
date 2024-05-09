const { DriverRating } = require('../models/DriverRating');
const { PassengerRating } = require('../models/PassengerRating');
const Driver = require('../models/DriverRating'); // Import Driver model
const Passenger = require('../models/PassengerRating'); // Import Passenger model

class RatingController {
  static async createDriverRating(req, res) {
    const { driverId, value } = req.body;

    try {
      // Create a new rating
      const rating = await DriverRating.create({
        driverId,
        value
      });

      // Fetch all ratings for the driver
      const ratings = await DriverRating.findAll({
        where: { driverId }
      });

      // Calculate the average rating
      const avgRating = ratings.reduce((total, rating) => total + rating.value, 0) / ratings.length;

      // Update the driver's rating in the database
      const driver = await Driver.findByPk(driverId);
      driver.rating = avgRating;
      await driver.save();

      res.status(200).json(rating);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createPassengerRating(req, res) {
    const { passengerId, value } = req.body;

    try {
      // Create a new rating
      const rating = await PassengerRating.create({
        passengerId,
        value
      });

      // Fetch all ratings for the passenger
      const ratings = await PassengerRating.findAll({
        where: { passengerId }
      });

      // Calculate the average rating
      const avgRating = ratings.reduce((total, rating) => total + rating.value, 0) / ratings.length;

      // Update the passenger's rating in the database
      const passenger = await Passenger.findByPk(passengerId);
      passenger.rating = avgRating;
      await passenger.save();

      res.status(200).json(rating);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = RatingController;