const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoute = require("./routes/userRoute");
const port = 4001;

const app = express();

app.use(express.json());
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/TODO_WEBAPP");

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use("/api/users", userRoute);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
