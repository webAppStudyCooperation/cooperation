import { Request, Response, NextFunction } from "express";

var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req: Request, res: Response, next: NextFunction) {
  res.render("index");
});

/* 소켓 테스트 페이지 */
router.get("/socketTest", function (req: Request, res: Response, next: NextFunction) {
  res.render("socketTest");
});


module.exports = router;
