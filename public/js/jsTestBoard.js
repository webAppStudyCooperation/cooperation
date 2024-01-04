var board = document.getElementById("board");
var boardFlag = false;
var mainContentElem = document.getElementById("mainContent");
var dataObj;

import { baseURL } from "../js/jsTestConfig.js";

//DB에 저장되어있는 글 목록 전부 나열
/* test feed 리스트 */
var testDummy = [
  { id: 1, content: "1" },
  { id: 2, content: "2" },
  { id: 3, content: "3" },
];
var testComment = [
  { boardId: "1", content: "댓글 1" },
  { boardId: "2", content: "댓글 2" },
  { boardId: "3", content: "댓글 3" },
];
// vanila.js에서 react state
// fetch 해서 온 데이터
// 변화 생기면 다시 POST로 업데이트
// 전역변수로 dataList 선언
fetch(baseURL + "api/boards").then(function (response) {
  return response.json().then(function (data) {
    console.log(data);
  });
});
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
  var commentList = document.createElement("div");
  commentList.className = "commentList";
  for (var i = 0; i < DBcommentList.length; i++) {
    var comment = document.createElement("div");
    var commentID = document.createElement("span");
    var commentContent = document.createElement("span");
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
var FeedState = {
  CLOSE: "close",
  OPEN: "open",
};
var Feed = /** @class */ (function () {
  function Feed(content) {
    var _this = this;
    this.commentList = createComment(testComment);
    var feed = document.createElement("div");
    feed.innerText = content;
    //삭제 버튼
    var removeBtn = document.createElement("button");
    removeBtn.innerText = "remove";
    removeBtn.addEventListener("click", this.removeListner);
    //수정버튼
    var editBtn = document.createElement("button");
    editBtn.innerText = "edit";
    //토글 버튼
    var toggleBtn = document.createElement("button");
    toggleBtn.innerText = "open";
    toggleBtn.addEventListener("click", function (event) {
      return _this.buttonClicked(event, _this.commentList);
    });
    // toggleBtn.addEventListener("click", this.getListener(this.commentList));
    feed.appendChild(removeBtn);
    feed.appendChild(editBtn);
    feed.appendChild(toggleBtn);
    mainContentElem === null || mainContentElem === void 0
      ? void 0
      : mainContentElem.appendChild(feed);
  }
  /*버튼 toggle */
  Feed.prototype.buttonClicked = function (event, commentList) {
    // const target = event.target as HTMLElement;
    var target = event.target;
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
  };
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
  Feed.prototype.removeListner = function () {
    //DB 업데이트
  };
  Feed.prototype.editListner = function () {};
  return Feed;
})();
function showBoardFeed() {
  if (!boardFlag) {
    for (var i = 0; i < testDummy.length; i++) {
      var singleFeed = new Feed(testDummy[i].content);
    }
    boardFlag = true;
  } else {
  }
}
// 게시판 글 불러오기
board === null || board === void 0
  ? void 0
  : board.addEventListener("click", showBoardFeed);
board === null || board === void 0
  ? void 0
  : board.addEventListener("click", function () {
      return console.log("It is working");
    });
