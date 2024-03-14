const { Sequelize, DataTypes } = require("sequelize");
const mysql = require("mysql2");

const sequelize = new Sequelize(process.env.URL, {
  dialect: "mysql",
    logging:false
});

const connectDb = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("db connected successfully");
  } catch (err) {
    console.log("db failed to init :  " + err);
  }
};


module.exports = { connectDb, sequelize, DataTypes };
