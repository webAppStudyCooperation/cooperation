import { Request, Response, NextFunction } from "express";

var express = require("express");
var router = express.Router();
const db = require("./db/db"); // db 모듈 추가

/**
 * ~/user/login
 *
 * "body": {
 *  "userId": "sdf",
 *  "userPassword": "sdf"
 * }
 */
router.post(
  "/login",
  function (req: Request, res: Response, next: NextFunction) {
    db.checkUserPassword(
      req.body.userId,
      req.body.userPassword,
      (jsonString: String, success: Boolean) => {
        if (success) {
          res.status(200).json(jsonString);
        } else {
          res.status(400).json(jsonString);
        }
      }
    );
  }
);

/**
 * ~/user/join
 *
 * "body": {
 *  "userId": "sdf",
 *  "userPassword": "sdf",
 *  "name": "sdf"
 *  "nickname": "sfd",
 *  "familyId": 0
 * }
 * // 초기 가입시 familyId는 req에서 어떤 값이 들어오든 0으로 한다.
 */
router.post(
  "/join",
  function (req: Request, res: Response, next: NextFunction) {
    db.insertUser(
      req.body.userId,
      req.body.userPassword,
      req.body.name,
      req.body.nickname,
      req.body.familyId,
      (jsonString: String, success: Boolean) => {
        if (success) {
          res.status(200).json(jsonString);
        } else {
          res.status(400).json(jsonString);
        }
      }
    );
  }
);

/**
 * ~/user/login
 *
 * "body": {
 *  "userId": "sdf",
 *  "userPassword": "sdf"
 * }
 */
router.delete(
  "/delete",
  function (req: Request, res: Response, next: NextFunction) {
    db.checkUserPassword(
      req.body.userId,
      req.body.userPassword,
      (jsonString: String, success: Boolean) => {
        if (success) {
          db.deleteUser(
            req.body.userId,
            (jsonString: String, success: Boolean) => {
              if (success) {
                res.status(200).json(jsonString);
              } else {
                res.status(200).json(jsonString);
              }
            }
          );
        } else {
          res.status(400).json(jsonString);
        }
      }
    );
  }
);

module.exports = router;
