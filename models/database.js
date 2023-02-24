const mongoose = require("mongoose");

//Schema for records
const record = new mongoose.Schema({
  price: Number,
  category: String,
  sold: Boolean,
  dateOfSale: Date,
});

//Schema for storing monthly data
//Alternate Schema is also possible to only store required data for API calls
const dataBase = new mongoose.Schema({
  month: String,
  totalSales: Number,
  totalSold: Number,
  totalNotSold: Number,
  records: [record],
});

//Creating a model out of the schema
const dataBaseModel = mongoose.model("dataBase", dataBase);
module.exports = dataBaseModel;
