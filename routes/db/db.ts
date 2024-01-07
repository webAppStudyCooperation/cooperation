import { log } from "console";

const mysql = require("mysql2");
import { BoardItem, DateString } from "../models/boards";
import { BoardComment } from "../models/comments";
import { User } from "../models/user";


const connection = mysql.createConnection({
  host: "localhost",
  user: "test",
  password: "1234",
  port: 3306,
  database: "cooperation",
});

function getAllBoard(callback: (row: BoardItem[]) => {}) {
  connection.query(
    `SELECT * FROM board left join user on board.createUserId = user.userId`,
     (err: any, rows: any, fields: any) => {
        if (err) {
          throw err;
        } else {
          let result: BoardItem[] = [];
          for(var o in rows) {
            let item = rows[o]
            let user = new User(
              item["userId"],
              item["name"],
              item["nickname"]
            )
            let boardItem = new BoardItem(
              item["boardId"],
              item["title"],
              item["content"],
              new DateString(item["creationDate"]),
              new DateString(item["modifyDate"]),
              item["password"],
              item["secret"],
              user
            )
            result.push(boardItem)
          }
          callback(result);
        }
      }
    );
}

function getCommentsByBoardId(
  boardId: number,
  callback: ((row: BoardComment[]) => {})) 
{
  connection.query(
    `SELECT * FROM comment left join user on comment.userId = user.userId where boardId = ${boardId}`,
    (err: any, rows: any, fields: any) => {
      let result: BoardComment[] = []
      for( var o in rows) {
        let item = rows[o]
        let user = new User(
          item["userId"],
          item["name"],
          item["nickname"]
        )
        let boardComment = new BoardComment(
          item["idcomment"],
          item["content"],
          user
        )
        result.push(boardComment)
      }
      callback(result)
    }
  )
}



module.exports = {
  getAllBoard,
  getCommentsByBoardId
};
