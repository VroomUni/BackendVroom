const { Sequelize, DataTypes } = require("sequelize");
const mysql = require("mysql2");

const sequelize = new Sequelize("mysql://root:root@localhost:3306/Vroom", {
  dialect: "mysql",
  logging: false,
});

const connectDb = async () => {
  try {
    await sequelize
      .sync
      // { : true }
      ();
    console.log("db connected successfully");
  } catch (err) {
    console.log("db failed to init :  " + err);
  }
};

module.exports = { connectDb, sequelize, DataTypes };
