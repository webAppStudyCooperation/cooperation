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

/**
 * 게시물 정보를 수정하는 post api, 아래의 정보를 body에 넣어야 함
  boardId: number,
  title: string,
  content: string,
  secret: number,
  password: string | null,
 */
router.put(
  "/boards/update",
  function (req: Request, res: Response, next: NextFunction) {
    let body = req.body
    db.updateBoardItem(
      body.boardId,
      body.title,
      body.content,
      body.secret,
      body.password,
      (success: boolean) => {
        if(success) {
          res.status(200)
        } else {
          res.status(400)
        }
      }
    );
  }
)

router.post(
  "/boards/add",
  function (req: Request, res: Response, next: NextFunction) {
    try {
      let boardItem = req.body as BoardItem
      if(boardItem == null || boardItem == undefined) {
        throw Error
      }  
      db.insertBoardItem(
        boardItem,
        (success: boolean) => {
          if(success) {
            res.status(200)
          } else {
            res.status(400)
          }
        }
      )
    } catch {
      res.status(400)
    }
  }
)

router.delete(
  "boards/delete",
  function (req: Request, res: Response, next: NextFunction) {
    try {
      let boardId = req.body.boardId as number
      if(boardId == null || boardId == undefined) {
        throw Error
      }   
      db.deleteBoardItem(
        boardId,
        (success: boolean) => {
          if(success) {
            res.status(200)
          } else [
            res.status(400)
          ]
        }
      )
    } catch {
      res.status(400)
    }
  }
)

router.post(
  "/boards/comment/add",
  function (req: Request, res: Response, next: NextFunction) {
    try {
      let comment = req.body as BoardComment 
      if(comment == null || comment == undefined) {
        throw Error
      }   
      db.insertComment(
        comment,
        (success: boolean) => {
          if(success) {
            res.status(200).json("message: success")
          } else {
            res.status(400).json("message: fail")
          }
        }
      )
    } catch {
      res.status(400)
    }  
  }
)

router.delete(
  "boards/comment/delete",
  function (req: Request, res: Response, next: NextFunction) {
    try {
      let boardId = req.body.boardId   
      db.deleteComment(
        boardId,
        (success: boolean) => {
          if(success) {
            res.status(200)
          } else {
            res.status(400)
          }
        }
      )
    } catch {
      res.status(400)
    }  
  }
)

module.exports = router;
