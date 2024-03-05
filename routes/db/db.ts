import { log } from "console";

const mysql = require("mysql2");
import { BoardItem, DateString, SecretNumber } from "../models/boards";
import { BoardComment } from "../models/comments";
import { User } from "../models/user";
import { Family } from "../models/family";

const pool = mysql.createPool({
  host: "localhost",
  user: "test",
  password: "1234",
  port: 3306,
  database: "cooperation",
});

function query(
  q: String,
  callback: (err: any, rows: any, fields: any) => void
){
  pool.getConnection((err: any, connection: any) => {
    connection.query(q,callback)
    connection.release();
  })

}

function getAllBoard(familyId: number, callback: (row: BoardItem[]) => {}) {
  query(
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
  query(
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
  query(
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
    query(q, (err: any, rows: any, fields: any) => {
      if (err) {
        callback(false);
        return;
      }
      callback(true);
    });
  }
}

function deleteBoardItem(boardId: number, callback: (success: boolean) => {}) {
  query(
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
  let q = `INSERT INTO cooperation.comment (content, userId, boardId) VALUES ("${boardComment.content}", "${boardComment.user.id}", ${boardComment.boardId});`;
  query(q, (err: any, rows: any, fields: any) => {
    if (err) {
      log(err);
      callback(false);
      return;
    }
    callback(true);
  });
}

function deleteComment(commentId: number, callback: (success: boolean) => {}) {
  query(
    `delete from comment where idcomment = ${commentId}`,
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
  let q = `INSERT INTO cooperation.family (familyId, familyName) VALUES (${familyId}, "${familyName}");`;
  query(q, (err: any, rows: any, fields: any) => {
    if (err) {
      callback(false);
      return;
    }
    callback(true);
  });
}

function getFamily(familyId: number, callback: (family: Family) => {}) {
  let q = `Select * From cooperation.family Where familyId = ${familyId}`;
  query(q, (err: any, rows: any, fields: any) => {
    if (err) {
      callback(new Family(-1, "no family"));
      return;
    }
    callback(new Family(rows[0]["familyId"], rows[0]["familyname"]));
  });
}

function checkUserPassword(userId: String, userPassword: String, callback: (jsonString: String, success: Boolean, user: User) => {}) {
  let q = `Select * From cooperation.user where userId = "${userId}"`
  const user = new User("","","",0);
  query(q, (err: any, rows: any, fields: any) => {
    if(rows[0] == null || rows[0] == undefined) {
      callback(JSON.stringify("{'message': 일치하는 아이디 없음}"), false, user);
    } else if(rows[0]["userPassword"] != userPassword){
      callback(JSON.stringify("{'message': 비밀번호 불일치}"), false, user);
    } else {
      user.id = rows[0]["userId"]
      user.name = rows[0]["name"]
      user.nickName = rows[0]["nickname"]
      user.familyId = rows[0]["familyId"]
      callback(JSON.stringify("{'message': 로그인 성공}"), true, user);
    }
  });
}

function insertUser(userId: String, userPassword: String, name: String, nickname: String, familyId: number, callback: (jsonString: String, success: Boolean) => {}) {
  let checkQuery = `Select * From cooperation.user where userId = "${userId}"`
  let insertQuery = `INSERT INTO cooperation.user (userId, userPassword, name, nickname, familyId) VALUES ("${userId}", "${userPassword}", "${name}", "${nickname}", ${familyId});`;
  query(checkQuery, (err: any, rows: any, fields: any) => {
    if(rows[0] == null || rows[0] == undefined) {
      checkDuplicatedNickName(nickname, (duplicated) => {
        if(duplicated) {
          callback(JSON.stringify("{'message': 닉네임 중복}"),false)
        } else {
          query(insertQuery, (err: any, rows: any, fields: any) => {
            if(err) {
              callback(JSON.stringify("{'message': 가입 실패}"),false)
            } else {
              callback(JSON.stringify("{'message': 가입 완료}"),true)
            }
          })
        }
      })
    } else {
      callback(JSON.stringify("{'message': 아이디 중복}"),false)
    }
  });
}

function checkDuplicatedNickName(nickName: String, callback: (duplicated: boolean)=>void) {
  const q = `select count(*) as 'count' from user where nickname="${nickName}"`
  query(q, (err: any, rows: any, fields: any) => {
    let count = undefined
    if(rows[0] != undefined && rows[0] != null) count = rows[0]['count'];
    if(count == 0) {
      callback(false)
    } else {
      callback(true)
    }
  })
}

function deleteUser(userId: String, callback: (jsonString: String, success: Boolean) => {}) {
  let q = `Delete From cooperation.user where userId = "${userId}"`
  query(q, (err: any, rows: any, fields: any) => {
    if(err) {
      callback(JSON.stringify("{'message': 삭제 실패}"), false);
    } else {
      callback(JSON.stringify("{'message': 삭제 성공}"), true);
    }
  });
}

function intervalCheck() {
  const q = "select count(*) as 'count' from board"
  query(q, (err:any, rows:any, fields:any) => {
    let count = 0
    if(rows[0] != undefined && rows[0] != null) count = rows[0]['count'];
    console.log(`board count = ${count}`);
  })
}

setInterval(intervalCheck, 1000*60*60*6);

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
  deleteUser,
};
