//Controllers for the routes
//Import axios to make API calls and database model
const Data = require("../models/database");
const axios = require("axios");

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

//Response for the homepage
const response =
  "<div>" +
  "<h1>Welcome to homepage</h1>" +
  "<ul>" +
  "<li>" +
  "Use /getData to fetch data from API and store it in MongoDB database" +
  "</li>" +
  "<li>Use /stats/month to get statastics for the given month</li>" +
  "<li>Use /pieChart/month to get pie chart data for the given month</li>" +
  "<li>Use /barChart/month to get bar chart data for the given month</li>" +
  "</ul>" +
  "</div>";

//Controller for the homepage
exports.getHomePage = (req, res) => {
  res.status(200).send(response);
};

//Controller for fetching data from API and storing it in database
//Axios is used to make API calls and the data is stored in MongoDb database according to the schema
exports.getData = async (req, res) => {
  const URL = "https://s3.amazonaws.com/roxiler.com/product_transaction.json";
  console.log("Fetching data from URL: ", URL);
  try {
    const transactions = await axios.get(URL);
    for (var i = 0; i < transactions.data.length; i++) {
      const month =
        months[new Date(transactions.data[i].dateOfSale).getMonth()];
      const monthRecord = await Data.findOne({ month: month });
      if (!monthRecord) {
        const record = {
          price: transactions.data[i].price,
          category: transactions.data[i].category,
          sold: transactions.data[i].sold,
          dateOfSale: transactions.data[i].dateOfSale,
        };
        const newEntry = {
          month: month,
          totalSales: transactions.data[i].price,
          totalSold: transactions.data[i].sold ? 1 : 0,
          totalNotSold: transactions.data[i].sold ? 0 : 1,
          records: [record],
        };
        await Data.create(newEntry);
      } else {
        const record = {
          price: transactions.data[i].price,
          category: transactions.data[i].category,
          sold: transactions.data[i].sold,
          dateOfSale: transactions.data[i].dateOfSale,
        };
        monthRecord.totalSales += transactions.data[i].price;
        monthRecord.totalSold += transactions.data[i].sold ? 1 : 0;
        monthRecord.totalNotSold += transactions.data[i].sold ? 0 : 1;
        monthRecord.records.push(record);
        await monthRecord.save();
      }
    }
    res.status(200).json({
      status: "Successfully fetched data from API and stored it in database",
      data: transactions.data,
    });
  } catch (err) {
    console.log("Error occured \n", err);
    res.status(500).json({
      error: err,
    });
  }
};

//Controller for getting statistics for the given month
//These stats are calculated at time of storing data in database
exports.getStats = async (req, res) => {
  const monthRecord = await Data.findOne({ month: req.params.id });
  if (!monthRecord) {
    res.status(404).json({
      message: "No record found for the given month or the month is invalid",
    });
  } else {
    res.status(200).json({
      message: "Record found",
      data: {
        totalSales: monthRecord.totalSales,
        totalSold: monthRecord.totalSold,
        totalNotSold: monthRecord.totalNotSold,
      },
    });
  }
};

//Controller for getting pie chart data for the given month
exports.getPieChart = async (req, res) => {
  const monthRecord = await Data.findOne({ month: req.params.id });
  if (!monthRecord) {
    res.status(404).json({
      message: "No record found for the given month or the month is invalid",
    });
  } else {
    var categories = new Map();
    for (var i = 0; i < monthRecord.records.length; i++) {
      if (!categories.has(monthRecord.records[i].category)) {
        categories.set(monthRecord.records[i].category, 1);
      } else {
        categories.set(
          monthRecord.records[i].category,
          categories.get(monthRecord.records[i].category) + 1
        );
      }
    }
    const data = Object.fromEntries(categories);
    res.status(200).json({
      message: "Record found",
      data,
    });
  }
};

//Controller for getting bar chart data for the given month
exports.getBarChart = async (req, res) => {
  const monthRecord = await Data.findOne({ month: req.params.id });
  if (!monthRecord) {
    res.status(404).json({
      message: "No record found for the given month or the month is invalid",
    });
  } else {
    const barData = [
      { range: "0-100", Items: 0 },
      { range: "101-200", Items: 0 },
      { range: "201-300", Items: 0 },
      { range: "301-400", Items: 0 },
      { range: "401-500", Items: 0 },
      { range: "501-600", Items: 0 },
      { range: "601-700", Items: 0 },
      { range: "701-800", Items: 0 },
      { range: "801-900", Items: 0 },
      { range: "more then 900", Items: 0 },
    ];
    for (var i = 0; i < monthRecord.records.length; i++) {
      if (
        monthRecord.records[i].price > 0 &&
        monthRecord.records[i].price <= 100
      ) {
        barData[0].Items++;
      } else if (
        monthRecord.records[i].price > 100 &&
        monthRecord.records[i].price <= 200
      ) {
        barData[1].Items++;
      } else if (
        monthRecord.records[i].price > 200 &&
        monthRecord.records[i].price <= 300
      ) {
        barData[2].Items++;
      } else if (
        monthRecord.records[i].price > 300 &&
        monthRecord.records[i].price <= 400
      ) {
        barData[3].Items++;
      } else if (
        monthRecord.records[i].price > 400 &&
        monthRecord.records[i].price <= 500
      ) {
        barData[4].Items++;
      } else if (
        monthRecord.records[i].price > 500 &&
        monthRecord.records[i].price <= 600
      ) {
        barData[5].Items++;
      } else if (
        monthRecord.records[i].price > 600 &&
        monthRecord.records[i].price <= 700
      ) {
        barData[6].Items++;
      } else if (
        monthRecord.records[i].price > 700 &&
        monthRecord.records[i].price <= 800
      ) {
        barData[7].Items++;
      } else if (
        monthRecord.records[i].price > 800 &&
        monthRecord.records[i].price <= 900
      ) {
        barData[8].Items++;
      } else {
        barData[9].Items++;
      }
    }
    res.status(200).json({
      message: "Record found",
      data: barData,
    });
  }
};
