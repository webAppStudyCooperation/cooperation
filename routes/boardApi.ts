import { Request, Response, NextFunction } from "express";
//ts-node일때만 가능
//node일떄는 불가

var express = require("express");
var router = express.Router();
const db = require("./db/db"); // db 모듈 추가

router.get(
  "/boards",
  function (req: Request, res: Response, next: NextFunction) {
    db.getAllBoard((rows: string) => {
      res.status(200).json(rows);
    });
  }
);

router.post(
  "/addBoard",
  function (req: Request, res: Response, next: NextFunction) {
    res.status(500);
    db.getAllBoard((rows: string) => {
      res.status(200).json(rows);
    });
  }
);

module.exports = router;
