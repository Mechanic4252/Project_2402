const express = require("express");
const pageRouter = require("./Routers/pageRouter");
//careating an express app
const app = express();

//Mounting the router
app.use("/", pageRouter);

//Exporting the app
module.exports = app;
