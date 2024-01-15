const board: HTMLElement | null = document.getElementById("board");
let boardFlag = false;
const mainContentElem: HTMLElement | null =
  document.getElementById("mainContent");

import { response } from "express";
import { env } from "process";
import { baseURL } from "./config.js";
import { BoardItem } from "./models/boards.js";
import { BoardComment } from "./models/comments.js";
import { User } from "./models/user.js";

//해당 게시글의 댓글 생성
function createComment(DBcommentList: BoardComment[]) {
  const commentList = document.createElement("div");
  commentList.className = "commentList";

  for (let i = 0; i < DBcommentList.length; i++) {
    const comment = document.createElement("div");
    const commentID = document.createElement("span");
    const commentContent = document.createElement("span");
    const commentUser = document.createElement("span");

    comment.className = "sigleComment";
    commentID.className = "CommentID";
    commentContent.className = "CommentContent";

    commentID.innerText = DBcommentList[i].commentId.toString();
    commentContent.innerText = DBcommentList[i].content;

    comment.appendChild(commentID);
    comment.appendChild(commentContent);
    commentList.appendChild(comment);
  }
  return commentList;
}

/* single Feed, 토글 버튼, 댓글 */
// const FeedState = {
//   CLOSE: "close",
//   OPEN: "open",
// };

class FeedManager {
  private data: BoardItem[] = [];
  private feedList: Feed[] = [];

  constructor(
    familyId: number
  ) {
    this.setData(familyId);
  }

  private setData(familyId: number) {
    // startLoading
    this.getDataList(familyId).then((d) => {
      this.data = d;
      while (this.feedList.length > 0) {
        this.feedList.pop();
      }
      d.forEach((boardItem: BoardItem) => {
        this.feedList.push(
          new Feed(
            boardItem,
            boardItem.content,
            this.getComment(boardItem.boardId)
          )
        );
      });
    });
    // endLoding
  }

  private getComment(boardId: number): Promise<BoardComment[]> {
    return (
      fetch(baseURL + `api/boards/comments?boardId=${boardId}`)
        .then((response) =>
          response.json().then((json) => {
            return json;
          })
        )
        // data는 함수이다.
        .catch((error) => console.error(error))
    );
  }

  private getDataList(familyId: number): Promise<BoardItem[]> {
    // let data: Promise<BoardItem>;
    return (
      fetch(baseURL + "api/boards", {
        body: JSON.stringify({ familyId: familyId })
      })
        .then((response) =>
          response.json().then((json) => {
            return json;
          })
        )
        // data는 함수이다.
        .catch((error) => console.error(error))
    );
  }

  getFeedAt(index: number): Feed {
    return this.feedList[index];
  }
  getFeeds(): Feed[] {
    return this.feedList;
  }

  // getData(): BoardItem[] {
  //   if (this.data != undefined || this.data != null) {
  //     return this.data;
  //   } else {
  //     return [];
  //   }
  // }
}

/** 
 * 임시로 familyId를 0으로 처리하였다.
 * 로그인 기능 구현 이후 이부분 로그인된 사용자의 familyId를 값으로 넣어주어야
*/
const feedManager = new FeedManager(0);

// 하나의 피드 -> 하나의 boardItem 정보들로 구성
class Feed {
  private feed: HTMLDivElement;
  private toggleBtn: HTMLButtonElement;
  private removeBtn: HTMLButtonElement;
  private editBtn: HTMLButtonElement;

  private needRequestComment: boolean = true;
  private commentPromise: Promise<BoardComment[]>;
  private boardItem: BoardItem;
  private commentUI: HTMLDivElement = document.createElement("div");

  constructor(
    boardItem: BoardItem,
    content: string,
    commentPromise: Promise<BoardComment[]>
  ) {
    this.boardItem = boardItem;
    this.commentPromise = commentPromise;
    this.feed = document.createElement("div");
    this.feed.innerText = content;

    //삭제 버튼
    this.removeBtn = document.createElement("button");
    this.removeBtn.innerText = "remove";
    this.removeBtn.addEventListener("click", (event) => {
      this.removeListner(this.boardItem.boardId);
    });

    //수정버튼
    this.editBtn = document.createElement("button");
    this.editBtn.innerText = "edit";
    this.editBtn.addEventListener("click", this.editListner);

    //토글 버튼
    this.toggleBtn = document.createElement("button");
    this.toggleBtn.innerText = "open";
    this.toggleBtn.addEventListener("click", (event) => {
      this.toggleListner(event);
    });

    this.feed.appendChild(this.removeBtn);
    this.feed.appendChild(this.editBtn);
    this.feed.appendChild(this.toggleBtn);
  }

  /*HTMLDivElement인 feed return */
  returnSingle() {
    return this.feed;
  }

  /*버튼 toggle */
  private toggleListner(event: Event) {
    // let targetParentNode = this.toggleBtn.parentNode;
    if (this.toggleBtn.innerText === "open") {
      this.addComment();
    } else {
      this.removeComent();
    }
  }

  private addComment() {
    if (this.needRequestComment) {
      this.commentPromise.then((d) => {
        d.forEach((elem) => {
          this.boardItem.comments.push(elem);
          console.log(elem);
        });
        this.toggleBtn.innerText = "close";
        this.commentUI = createComment(this.boardItem.comments);
        this.toggleBtn.parentNode?.appendChild(this.commentUI);
        this.needRequestComment = false;
      });
    } else {
      this.toggleBtn.innerText = "close";
      this.commentUI = createComment(this.boardItem.comments);
      this.toggleBtn.parentNode?.appendChild(this.commentUI);
    }
  }

  private removeComent() {
    this.toggleBtn.innerText = "open";
    this.toggleBtn.parentNode?.removeChild(this.commentUI);
  }

  private removeListner(boardId: number) {
    fetch(baseURL + `api/boards/comment/delete`, {
      method: "DELETE",
      // headers: {
      //   "Content-type": "application/json; charset=UTF-8",
      // },
      // body: JSON.stringify({ boardId: boardId }),
    })
      .then((response) => response)
      .then((d) => console.log(d));

    //DB 업데이트
    // console.log(boardId);
    // fetch(baseURL + `api/boards/delete`, {
    //   method: "DELETE",
    //   headers: {
    //     "Content-type": "application/json; charset=UTF-8",
    //   },
    //   body: JSON.stringify({ boardId: boardId }),
    // })
    //   .then((response) => response)
    //   .then((d) => console.log(d));

    // //DB 업데이트
  }

  private editListner() {
    //DB 업데이트
  }
}

/**mainContent에 feedList mainContent에 붙임 */
function setFeedAtContent() {
  return feedManager
    .getFeeds()
    .forEach((e) => mainContentElem?.appendChild(e.returnSingle()));
}

board?.addEventListener("click", setFeedAtContent);
