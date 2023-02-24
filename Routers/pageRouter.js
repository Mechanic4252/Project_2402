const express = require("express");
const controller = require("../Controllers/pageController");

const Router = express.Router();
//Routes for the API
Router.route("/").get(controller.getHomePage);
Router.route("/getData").get(controller.getData);
Router.route("/stats/:id").get(controller.getStats);
Router.route("/pieChart/:id").get(controller.getPieChart);
Router.route("/barChart/:id").get(controller.getBarChart);

module.exports = Router;
