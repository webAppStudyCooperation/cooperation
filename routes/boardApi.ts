import { Request, Response, NextFunction } from "express";

var express = require("express");
var router = express.Router();
const db = require("./db/db"); // db 모듈 추가
import { BoardItem, DateString } from "./models/boards";
import { BoardComment } from "./models/comments";
import { User } from "./models/user";
import { Family } from "./models/family";
import { log } from "console";

/**
 * "body": {
 *  "familyId": 유저의 familyId
 * }
 */
router.post(
  "/boards",
  function (req: Request, res: Response, next: NextFunction) {
    const familyId: number = req.body.familyId;
    db.getAllBoard(familyId, (rows: BoardItem[]) => {
      res.status(200).json(rows);
    });
  }
);

// 쿼리로 게시물 아이디를 받아 해당 게시물의 모든 댓글을 줌
/**url 뒤에 ?query로  boardId=x 붙이기*/
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
 *  * body: {
        "boardId": 0,
        "title": "testTitle",
        "content": "dsfdsfdsfsdf",
        "creationDate": "2021:07:29 00:00:00",
        "modifyDate": "2021:07:29 00:00:00",
        "password": null,
        "secret": 0,
        "createUser": {
            "id": "test",
            "name": "testName",
            "nickName": "testNickNAme"
        },
        "comments": []
    }
 */
router.put(
  "/boards/update",
  function (req: Request, res: Response, next: NextFunction) {
    let b = req.body;
    db.updateBoardItem(
      b.boardId,
      b.title,
      b.content,
      b.secret,
      b.password,
      (success: boolean, err: any | null) => {
        if (success) {
          res.status(200).json("{'message': success}");
        } else {
          res.status(400).json(`{'message': ${err}}`);
        }
      }
    );
  }
);

/**
 * BoardItem 생성 api 아래 형식으로 요청 가능
 * body: {
        "boardId": 0,
        "title": "testTitle",
        "content": "dsfdsfdsfsdf",
        "creationDate": "2021:07:29 00:00:00",
        "modifyDate": "2021:07:29 00:00:00",
        "password": null,
        "secret": 0,
        "createUser": {
            "id": "test",
            "name": "testName",
            "nickName": "testNickNAme",
            "familyId": 0
        },
        "comments": []
    }
 */
router.post(
  "/boards/add",
  function (req: Request, res: Response, next: NextFunction) {
    try {
      const b = req.body;
      let boardItem: BoardItem = new BoardItem(
        0,
        b.title,
        b.content,
        new DateString(b.creationDate, null),
        new DateString(b.modifyDate, null),
        b.password,
        b.secret,
        b.createUser,
        b.familyId
      );
      console.log(boardItem);
      db.insertBoardItem(boardItem, (success: boolean) => {
        if (success) {
          res.status(200).json("{'message': success}");
        } else {
          res.status(400).json("{'message': fail}");
        }
      });
    } catch {
      res.status(400).json("{'message': fail}");
    }
  }
);

/**
 * BoardItem을 삭제하는 api
 * boardId를 인자로 받는다
 * "body": {
 *  "boardId": 1
 * }
 */
router.delete(
  "/boards/delete",
  function (req: Request, res: Response, next: NextFunction) {
    try {
      let boardId: number = req.body.boardId;
      if (boardId == null || boardId == undefined) {
        throw Error;
      }
      db.deleteBoardItem(boardId, (success: boolean) => {
        if (success) {
          res.status(200).json("{'message': success}");
        } else [res.status(400).json("{'message': fail}")];
      });
    } catch {
      res.status(400).json("{'message': fail}");
    }
  }
);

/**댓글 생성 -> body에 boardComment넣어서 보낼 것 */
/***
 * {
    "boardId": 10,
    "commentId": 10,
    "content": "sdfsdfjlksjfksjflkjsjdflsjdlfkjs",
    "user": {
        "id": "test",
        "name": "testname",
        "nickName": "sdfsdfsdf",
        "familyId": 0
    }
}
 */
router.post(
  "/boards/comment/add",
  function (req: Request, res: Response, next: NextFunction) {
    try {
      const b = req.body;
      const comment: BoardComment = new BoardComment(
        b.boardId,
        -1,
        b.content,
        new User(b.user.id, b.user.name, b.user.nickName, b.user.familyId)
      );
      db.insertComment(comment, (success: boolean) => {
        if (success) {
          res.status(200).json("message: success");
        } else {
          res.status(400).json("message: fail");
        }
      });
    } catch {
      res.status(400).json("{'message': fail}");
    }
  }
);

/**
 * 댓글 삭제 api
 * commentId를 body에 넣어 보낸다.
 * "body": {
 *  "commentId": 12
 * }
 */
router.delete(
  "/boards/comment/delete",
  function (req: Request, res: Response, next: NextFunction) {
    try {
      let commentId: number = req.body.commentId;
      db.deleteComment(commentId, (success: boolean) => {
        if (success) {
          res.status(200).json("{'message': success}");
        } else {
          res.status(400).json("{'message': fail}");
        }
      });
    } catch {
      res.status(400).json("{'message': fail}");
    }
  }
);

module.exports = router;
