const board = document.getElementById("board");
let boardFlag = false;
const mainContentElem = document.getElementById("mainContent");
let dataObj;
import { baseURL } from "./config.js";
// const localURL = "http://localhost:3000/";
// const baseURL = localURL;
// import baseURL = require("./config");
// const baseURL = require("./config");
console.log("whyrano");
//DB에 저장되어있는 글 목록 전부 나열
/* test feed 리스트 */
const testDummy = [
    { id: 1, content: "1" },
    { id: 2, content: "2" },
    { id: 3, content: "3" },
];
const testComment = [
    { boardId: "1", content: "댓글 1" },
    { boardId: "2", content: "댓글 2" },
    { boardId: "3", content: "댓글 3" },
];
// vanila.js에서 react state
// fetch 해서 온 데이터
// 변화 생기면 다시 POST로 업데이트
// 전역변수로 dataList 선언
fetch(baseURL + "api/boards").then((response) => response.json().then((data) => {
    console.log(data);
}));
// 객체
// // 서버 형식 ->UI
// class singleFeedForUI {
//   // constructor(obj: singleFeed) {
//   //   boardID: obj.boardId;
//   //   title: String: obj.title;
//   //   content: String: obj.content;
//   //   creationDate: String: obj.boardId;
//   //   modifyDate: String: obj.boardId;
//   //   password: String: obj.boardId;
//   //   secret: String: obj.boardId;
//   //   userId: String: obj.boardId;
//   // }
//   constructor(obj: singleFeed) {
//     boardID: String = obj.boardId;
//     title: String = obj.title;
//     content: String: obj.content;
//     creationDate: String: obj.boardId;
//     modifyDate: String: obj.boardId;
//     password: String: obj.boardId;
//     secret: String: obj.boardId;
//     userId: String: obj.boardId;
//   }
// }
//해당 게시글의 댓글 생성
function createComment(DBcommentList) {
    const commentList = document.createElement("div");
    commentList.className = "commentList";
    for (let i = 0; i < DBcommentList.length; i++) {
        const comment = document.createElement("div");
        const commentID = document.createElement("span");
        const commentContent = document.createElement("span");
        comment.className = "sigleComment";
        commentID.className = "CommentID";
        commentContent.className = "CommentContetn";
        commentID.innerText = DBcommentList[i].boardId;
        commentContent.innerText = DBcommentList[i].content;
        comment.appendChild(commentID);
        comment.appendChild(commentContent);
        commentList.appendChild(comment);
    }
    return commentList;
}
/* single Feed, 토글 버튼, 댓글 */
const FeedState = {
    CLOSE: "close",
    OPEN: "open",
};
class Feed {
    constructor(content) {
        this.commentList = createComment(testComment);
        const feed = document.createElement("div");
        feed.innerText = content;
        //삭제 버튼
        const removeBtn = document.createElement("button");
        removeBtn.innerText = "remove";
        removeBtn.addEventListener("click", this.removeListner);
        //수정버튼
        const editBtn = document.createElement("button");
        editBtn.innerText = "edit";
        //토글 버튼
        const toggleBtn = document.createElement("button");
        toggleBtn.innerText = "open";
        toggleBtn.addEventListener("click", (event) => this.buttonClicked(event, this.commentList));
        // toggleBtn.addEventListener("click", this.getListener(this.commentList));
        feed.appendChild(removeBtn);
        feed.appendChild(editBtn);
        feed.appendChild(toggleBtn);
        mainContentElem === null || mainContentElem === void 0 ? void 0 : mainContentElem.appendChild(feed);
    }
    /*버튼 toggle */
    buttonClicked(event, commentList) {
        // const target = event.target as HTMLElement;
        const target = event.target;
        console.log(typeof target);
        // if (typeof target == HTMLElement) {
        //   let targetInnerText: string = target.innerText;
        //   let targetParentNode = target.parentNode;
        //   if (targetInnerText === "open") {
        //     targetInnerText = "close";
        //     targetParentNode?.appendChild(commentList);
        //   } else {
        //     (event.target as HTMLElement).innerText = "open";
        //     targetParentNode?.removeChild(commentList);
        //   }
        // }
    }
    // getListener(commentList: HTMLDivElement) {
    //   return function (event: Event) {
    //     if (event.target.innerText === "open") {
    //       event.target.innerText = "close";
    //       event.target.parentNode.appendChild(commentList);
    //     } else {
    //       event.target.innerText = "open";
    //       event.target.parentNode.removeChild(commentList);
    //     }
    //   };
    // }
    removeListner() {
        //DB 업데이트
    }
    editListner() { }
}
function showBoardFeed() {
    if (!boardFlag) {
        for (let i = 0; i < testDummy.length; i++) {
            const singleFeed = new Feed(testDummy[i].content);
        }
        boardFlag = true;
    }
    else {
    }
}
// 게시판 글 불러오기
board === null || board === void 0 ? void 0 : board.addEventListener("click", showBoardFeed);
board === null || board === void 0 ? void 0 : board.addEventListener("click", () => console.log("It is working"));
