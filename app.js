var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
// var logger = require("morgan");

// router변수 정의
var indexRouter = require("./routes/index");
var boardRouter = require("./routes/boardApi.ts");
var familyRouter = require("./routes/familyApi.ts");
var userRouter = require("./routes/userApi.ts")

var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// post요청받을때 body 파싱을 위함
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));

// 모든 요청에 대한 로그를 찍기 위함
app.use((req, res, next) => {
  console.log("===-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-")
  console.log(req.method)
  console.log(req.url)
  console.log(req.body)
  console.log('Time:', Date.now());
  console.log("===-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-")
  next();
})

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// app.use(logger("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// router 경로 연결
// https://ip:port/~~~
app.use("/", indexRouter);
app.use("/api", boardRouter);
app.use("/family", familyRouter);
app.use("/user", userRouter);

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
  res.render("error", { error: err });
});

module.exports = app;
