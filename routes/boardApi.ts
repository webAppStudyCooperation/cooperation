import { Request, Response, NextFunction } from "express";

var express = require("express");
var router = express.Router();
const db = require("./db/db"); // db 모듈 추가
import { BoardItem } from "./models/boards";
import { log } from "console";
import { BoardComment } from "./models/comments";

// 모든 게시물 목록을 줌
router.get(
  "/boards",
  function (req: Request, res: Response, next: NextFunction) {
    db.getAllBoard((rows: BoardItem[]) => {
      log(rows)
      res.status(200).json(rows);
    });
  }
);

// 쿼리로 게시물 아이디를 받아 해당 게시물의 모든 댓글을 줌
router.get(
  "/boards/comments",
  function (req: Request, res: Response, next: NextFunction) {
    let boardId = req.query.boardId
    db.getCommentsByBoardId(boardId, (rows: BoardComment[]) => {
      res.status(200).json(rows);
    });
  }
)

// router.post(
//   "/addBoard",
//   function (req: Request, res: Response, next: NextFunction) {
//     res.status(500);
//     db.getAllBoard((rows: string) => {
//       res.status(200).json(rows);
//     });
//   }
// );

module.exports = router;
