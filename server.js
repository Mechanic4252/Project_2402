const app = require("./app");
const mongoose = require("mongoose");

//Connecting to the database
mongoose
  .connect("mongodb://localhost:27017/InternshipDataBase")
  .then(() => {
    console.log("database connection successful");
  })
  .catch((err) => {
    console.log("Following error occured \n", err);
  });

//Starting the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
