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
    let boardId = req.query.boardId;
    db.getCommentsByBoardId(boardId, (rows: BoardComment[]) => {
      res.status(200).json(rows);
    });
  }
);

/**
 * 게시물 정보를 수정하는 put api, body에 boardItem 넣을 것
 */
router.put(
  "/boards/update",
  function (req: Request, res: Response, next: NextFunction) {
    let boardItem : BoardItem= req.body.boardItem
    db.updateBoardItem(
      boardItem.boardId,
      boardItem.title,
      boardItem.content,
      boardItem.secret,
      boardItem.password,
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


/**
 * BoardItem을 생성하는 api
 * BoardItem을 인자로 넣는다.
 * boardId는 아무 값이나 넣어도 무관하다. (db에서 autoIncrement로 관리함)
 */
router.post(
  "/boards/add",
  function (req: Request, res: Response, next: NextFunction) {
    try {
      let boardItem: BoardItem = req.body.boardItem
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

/**
 * BoardItem을 삭제하는 api
 * boardId를 인자로 받는다
 */
router.delete(
  "boards/delete",
  function (req: Request, res: Response, next: NextFunction) {
    try {
      let boardId: number = req.body.boardId
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

/**댓글 생성 -> body에 boardComment넣어서 보낼 것 */
router.post(
  "/boards/comment/add",
  function (req: Request, res: Response, next: NextFunction) {
    try {
      let comment: BoardComment = req.body.boardComment 
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

/**
 * 댓글 삭제 api
 * commentId를 body에 넣어 보낸다.
 */
router.delete(
  "boards/comment/delete",
  function (req: Request, res: Response, next: NextFunction) {
    try {
      let boardId: number = req.body.boardId   
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
