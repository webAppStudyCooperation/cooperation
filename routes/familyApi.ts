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
        if(result.familyId < 1) {
            res.status(400).json(`"message": not valid familyId`)
        } else {
            res.status(200).json(result);
        }
    });
  }
);

/*
 * "body": {
    "userId" : "test", 
 *  "familyName": "familyName"
 * }
 */
router.post(
    "/makeFamily",
    function (req: Request, res: Response, next: NextFunction) {
        const familyName: string = req.body.familyName
        const userId: string = req.body.userId
        db.checkUserExist(userId, (exist: boolean) => {
            if(exist) {
                db.getFamilyByName(familyName, (family: Family) => {
                    if(family.familyId < 1) {
                        db.insertFamily(familyName, userId, (result: boolean) => {
                            if(result) {
                                db.getFamilyByName(familyName, (family: Family) => {
                                    db.updateUserFamilyId(userId, family.familyId, true, (jsonString: String, success: Boolean) => {
                                        if(success) {
                                            res.status(200).json(jsonString)
                                        } else {
                                            res.status(400).json(jsonString)
                                        }
                                    })
                                })
                                res.status(200).json(`"message": "가족 생성 성공\n 아이디의 가족이 방금 생성한 가족으로 바귀었으며 master가 되었습니다.`);
                            } else {
                                res.status(400).json(`"message": not valid familyId`)
                            }
                        });
                    } else {
                        res.status(400).json(`"message": familyName already exist`)
                    }
                })
            } else {
                res.status(400).json(`"message": userId not Valid`)
            }
        })
      }    
)

/*
 * "body": {
    "ownerUserId": "test"
    "targetUserId" : "test", 
 *  "familyId": 1
    "familyName": "testFamily"
 * }
 */
router.post(
    "/acceptUser",
    function (req: Request, res: Response, next: NextFunction) {
        const ownerUserId = req.body.ownerUserId
        const familyName: string = req.body.familyName
        const targetUserId = req.body.targetUserId
        const familyId = req.body.familyId
        db.checkUserIsOwner(ownerUserId, familyName, (check: boolean) => {
            if(check) {
                db.updateUserFamilyId(targetUserId, familyId, (jsonString: string, success: boolean) => {
                    if(success) {
                        res.status(200).json(jsonString)
                    } else {
                        res.status(400).json(jsonString)
                    }
                })
            } else {
                res.status(400).json(`"message": not valid userId or not a familyOwner`)
            }
        })
    }    
)

module.exports = router;
