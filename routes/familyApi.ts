import { Request, Response, NextFunction } from "express";

var express = require("express");
var router = express.Router();
const db = require("./db/db"); // db 모듈 추가
import { BoardItem, DateString } from "./models/boards";
import { Family } from "./models/family";

/**
 * "body": {
 *  "familyId": 유저의 familyId
 * }
*/
router.get(
  "/familyInfo",
  function (req: Request, res: Response, next: NextFunction) {
    const familyId: number = req.body.familyId
    db.getFamily(familyId, (result: Family) => {
        if(result.familyId == -1) {
            res.status(400).json(`"message": not valid familyId`)
        } else {
            res.status(200).json(result);
        }
    });
  }
);

/*
 * "body": {
 *  "familyId": 유저의 familyId,
 *  "familyName": "familyName"
 * }
 */
router.post(
    "/makeFamily",
    function (req: Request, res: Response, next: NextFunction) {
        const familyId: number = req.body.familyId
        const familyName: string = req.body.familyName
        db.insertFamily(familyId, familyName, (result: boolean) => {
            if(result) {
                res.status(200).json(result);
            } else {
                res.status(400).json(`"message": not valid familyId`)
            }
        });
      }    
)

module.exports = router;
