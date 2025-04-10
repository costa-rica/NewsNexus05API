require("dotenv").config();
const { sequelize } = require("newsnexus05db");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var adminDbRouter = require("./routes/adminDb");

var app = express();
const cors = require("cors");
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/admin-db", adminDbRouter);

const { onStartUpCreateEnvUsers } = require("./modules/onStartUp");
// Sync database and start server
sequelize
  .sync()
  .then(async () => {
    console.log("✅ Database connected & synced");
    await onStartUpCreateEnvUsers(); // <-- Call function here
  })
  .catch((error) => console.error("Error syncing database:", error));

module.exports = app;
