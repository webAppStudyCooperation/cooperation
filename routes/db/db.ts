import { log } from "console";

const mysql = require("mysql2");
import { BoardItem, DateString, SecretNumber } from "../models/boards";
import { BoardComment } from "../models/comments";
import { User } from "../models/user";
import { Family } from "../models/family";

const connection = mysql.createConnection({
  host: "localhost",
  user: "test",
  password: "1234",
  port: 3306,
  database: "cooperation",
});

function getAllBoard(familyId: number, callback: (row: BoardItem[]) => {}) {
  connection.query(
    `SELECT * FROM board left join user on board.createUserId = user.userId WHERE board.familyID = ${familyId}`,
    (err: any, rows: any, fields: any) => {
      if (err) {
        throw err;
      } else {
        let result: BoardItem[] = [];
        for (var o in rows) {
          let item = rows[o];
          let user = new User(
            item["userId"],
            item["name"],
            item["nickname"],
            item["familyId"]
          );
          let boardItem = new BoardItem(
            item["boardId"],
            item["title"],
            item["content"],
            new DateString(item["creationDate"], null),
            new DateString(item["modifyDate"], null),
            item["password"],
            item["secret"],
            user,
            item["familyID"]
          );
          result.push(boardItem);
        }
        callback(result);
      }
    }
  );
}

function getCommentsByBoardId(
  boardId: number,
  callback: (row: BoardComment[]) => {}
) {
  connection.query(
    `SELECT * FROM comment left join user on comment.userId = user.userId where boardId = ${boardId}`,
    (err: any, rows: any, fields: any) => {
      let result: BoardComment[] = [];
      for (var o in rows) {
        let item = rows[o];
        let user = new User(
          item["userId"],
          item["name"],
          item["nickname"],
          item["familyId"]
        );
        let boardComment = new BoardComment(
          item["boardId"],
          item["idcomment"],
          item["content"],
          user
        );
        result.push(boardComment);
      }
      callback(result);
    }
  );
}

function updateBoardItem(
  boardId: number,
  title: string,
  content: string,
  secret: number,
  password: string | null,
  callback: (success: boolean, err: any | null) => {}
) {
  let s = new SecretNumber(secret);
  let modifyDate = new DateString(null, new Date());
  connection.query(
    `UPDATE board SET title = '${title}', content = '${content}', secret = '${s.getSecret()}', password = '${password}', modifyDate = '${modifyDate.getDateString()}' WHERE boardId = ${boardId}`,
    (err: any, rows: any, fields: any) => {
      if (err) {
        callback(false, err);
        return;
      }
      callback(true, null);
    }
  );
}

function insertBoardItem(
  boardItem: BoardItem,
  callback: (success: boolean) => {}
) {
  let userId = boardItem.createUser?.id;
  if (userId == null || userId == undefined) {
    callback(false);
  } else {
    const q = `INSERT INTO cooperation.board (title, content, creationDate, modifyDate, password, secret, createUserId, familyId) VALUES ('${
      boardItem.title
    }', '${
      boardItem.content
    }', '${boardItem.creationDate.getDateString()}', '${boardItem.modifyDate.getDateString()}', '${
      boardItem.password
    }', '${boardItem.secret.getSecret()}', '${userId}', ${
      boardItem.familyId
    });`;
    console.log(q);
    connection.query(q, (err: any, rows: any, fields: any) => {
      if (err) {
        callback(false);
        return;
      }
      callback(true);
    });
  }
}

function deleteBoardItem(boardId: number, callback: (success: boolean) => {}) {
  connection.query(
    `delete from board where boardId = ${boardId}`,
    (err: any, rows: any, fields: any) => {
      if (err) {
        callback(false);
        return;
      }
      callback(true);
    }
  );
}

function insertComment(
  boardComment: BoardComment,
  callback: (success: boolean) => {}
) {
  let query = `INSERT INTO cooperation.comment (content, userId, boardId) VALUES ("${boardComment.content}", "${boardComment.user.id}", ${boardComment.boardId});`;
  connection.query(query, (err: any, rows: any, fields: any) => {
    if (err) {
      log(err);
      callback(false);
      return;
    }
    callback(true);
  });
}

function deleteComment(commentId: number, callback: (success: boolean) => {}) {
  connection.query(
    `delete from comment where commentid = ${commentId}`,
    (err: any, rows: any, fields: any) => {
      if (err) {
        callback(false);
        return;
      }
      callback(true);
    }
  );
}

function insertFamily(
  familyId: number,
  familyName: string,
  callback: (success: boolean) => {}
) {
  let query = `INSERT INTO cooperation.family (familyId, familyName) VALUES (${familyId}, "${familyName}");`;
  connection.query(query, (err: any, rows: any, fields: any) => {
    if (err) {
      callback(false);
      return;
    }
    callback(true);
  });
}

function getFamily(familyId: number, callback: (family: Family) => {}) {
  let q = `Select * From cooperation.family Where familyId = ${familyId}`;
  connection.query(q, (err: any, rows: any, fields: any) => {
    if (err) {
      callback(new Family(-1, "no family"));
      return;
    }
    callback(new Family(rows[0]["familyId"], rows[0]["familyname"]));
  });
}

function checkUserPassword(userId: String, userPassword: String, callback: (jsonString: String, success: Boolean) => {}) {
  let q = `Select * From cooperation.user where userId = "${userId}"`
  connection.query(q, (err: any, rows: any, fields: any) => {
    if(rows[0] == null || rows[0] == undefined) {
      callback(JSON.stringify("{'message': 일치하는 아이디 없음}"), false);
    } else if(rows[0]["userPassword"] != userPassword){
      callback(JSON.stringify("{'message': 비밀번호 불일치}"), true);
    } else {
      callback(JSON.stringify("{'message': 로그인 성공}"), false);

    }
  });
}

function insertUser(userId: String, userPassword: String, name: String, nickname: String, familyId: number, callback: (jsonString: String, success: Boolean) => {}) {
  let checkQuery = `Select * From cooperation.user where userId = "${userId}"`
  let insertQuery = `INSERT INTO cooperation.user (userId, userPassword, name, nickname, familyId) VALUES ("${userId}", "${userPassword}", "${name}", "${nickname}", ${familyId});`;
  connection.query(checkQuery, (err: any, rows: any, fields: any) => {
    if(rows[0] == null || rows[0] == undefined) {
      // 기존 아이디 없으므로 가입 진행
      connection.query(insertQuery, (err: any, rows: any, fields: any) => {
        if(err) {
          callback(JSON.stringify("{'message': 가입 실패}"),false)
          return;
        }
        callback(JSON.stringify("{'message': 가입 완료}"),true)
      })
    } else {
      callback(JSON.stringify("{'message': 아이디 중복}"),false)
    }
  });
}

module.exports = {
  getAllBoard,
  getCommentsByBoardId,
  updateBoardItem,
  insertBoardItem,
  deleteBoardItem,
  insertComment,
  deleteComment,
  getFamily,
  insertFamily,
  checkUserPassword,
  insertUser,
};
