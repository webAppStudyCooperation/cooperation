var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});
// router.get("/test", function (req, res, next) {
//   const path = require("path");
//   const options = { root: path.join(__dirname, "../views") };
//   res.sendFile("htmlTest.html", options);
// });

module.exports = router;
