var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require('cors');

const mongoose = require("mongoose");

var app = express();

require("dotenv").config();

const uri = process.env.MONGO_URI;

const connect = mongoose.connect(uri);

connect.then((connect) => {
  console.log(`Connect ok!`);
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors({
    origin: 'http://localhost:5173', // Cho phép Frontend này truy cập
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const quizRouter = require("./routes/quiz.route");
const questionRouter = require("./routes/question.route");
const userRouter = require("./routes/user.route");

app.use("/users", userRouter);
app.use("/quizzes", quizRouter);
app.use("/questions", questionRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
