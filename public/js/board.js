const board = document.getElementById("board");
let boardFlag = false;
const mainContentElem = document.getElementById("mainContent");

import { baseURL } from "./config.js";

fetch(baseURL + "api/boards").then((response) =>
  response.json().then((data) => {
    console.log(data);
    document.getElementById("apiTest").innerHTML = data[0].content;
  })
);

//DB에 저장되어있는 글 목록 전부 나열

/* test feed 리스트 */
const testDummy = [
  { id: 1, content: "1" },
  { id: 2, content: "2" },
  { id: 3, content: "3" },
];

const testComment = [
  { id: 1, comment: "댓글 1" },
  { id: 2, comment: "댓글 2" },
  { id: 3, comment: "댓글 3" },
];

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

    commentID.innerText = DBcommentList[i].id;
    commentContent.innerText = DBcommentList[i].comment;

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
    console.log(this.commentList);
    const feed = document.createElement("div");
    feed.innerText = content;

    //토글 버튼
    const toggleBtn = document.createElement("button");
    toggleBtn.innerText = "open";

    // toggleBtn.addEventListener("click", (event) =>
    //   this.buttonClicked(event, this.commentList)
    // );
    toggleBtn.addEventListener("click", this.getListener(this.commentList));

    feed.appendChild(toggleBtn);
    mainContentElem.appendChild(feed);
  }

  /*버튼 toggle */
  buttonClicked(event, commentList) {
    if (event.target.innerText === "open") {
      event.target.innerText = "close";
      event.target.parentNode.appendChild(commentList);
    } else {
      event.target.innerText = "open";
      event.target.parentNode.removeChild(commentList);
    }
  }

  getListener(commentList) {
    return function (event) {
      if (event.target.innerText === "open") {
        event.target.innerText = "close";
        event.target.parentNode.appendChild(commentList);
      } else {
        event.target.innerText = "open";
        event.target.parentNode.removeChild(commentList);
      }
    };
  }
}

function showBoardFeed() {
  if (!boardFlag) {
    for (let i = 0; i < testDummy.length; i++) {
      const singleFeed = new Feed(testDummy[i].content);
    }
    boardFlag = true;
  } else {
  }
}

// 게시판 글 불러오기

board.addEventListener("click", showBoardFeed);