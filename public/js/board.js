const board = document.getElementById("board");
let boardFlag = false;
const mainContentElem = document.getElementById("mainContent");
import { baseURL } from "./config.js";
//해당 게시글의 댓글 생성
function createComment(DBcommentList) {
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
    constructor() {
        this.data = [];
        this.feedList = [];
        this.setData();
    }
    setData() {
        // startLoading
        this.getDataList().then((d) => {
            this.data = d;
            while (this.feedList.length > 0) {
                this.feedList.pop();
            }
            d.forEach((boardItem) => {
                this.feedList.push(new Feed(boardItem, boardItem.content, this.getComment(boardItem.boardId)));
            });
        });
        // endLoding
    }
    getComment(boardId) {
        return (fetch(baseURL + `api/boards/comments?boardId=${boardId}`)
            .then((response) => response.json().then((json) => {
            return json;
        }))
            // data는 함수이다.
            .catch((error) => console.error(error)));
    }
    getDataList() {
        // let data: Promise<BoardItem>;
        return (fetch(baseURL + "api/boards")
            .then((response) => response.json().then((json) => {
            return json;
        }))
            // data는 함수이다.
            .catch((error) => console.error(error)));
    }
    getFeedAt(index) {
        return this.feedList[index];
    }
    getFeeds() {
        return this.feedList;
    }
}
const feedManager = new FeedManager();
// 하나의 피드 -> 하나의 boardItem 정보들로 구성
class Feed {
    constructor(boardItem, content, commentPromise) {
        this.needRequestComment = true;
        this.commentUI = document.createElement("div");
        this.boardItem = boardItem;
        this.commentPromise = commentPromise;
        this.feed = document.createElement("div");
        this.feed.innerText = content;
        //삭제 버튼
        this.removeBtn = document.createElement("button");
        this.removeBtn.innerText = "remove";
        this.removeBtn.addEventListener("click", this.removeListner);
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
    toggleListner(event) {
        // let targetParentNode = this.toggleBtn.parentNode;
        if (this.toggleBtn.innerText === "open") {
            this.addComment();
        }
        else {
            this.removeComent();
        }
    }
    addComment() {
        var _a;
        if (this.needRequestComment) {
            this.commentPromise.then((d) => {
                var _a;
                d.forEach((elem) => {
                    this.boardItem.comments.push(elem);
                    console.log(elem);
                });
                this.toggleBtn.innerText = "close";
                this.commentUI = createComment(this.boardItem.comments);
                (_a = this.toggleBtn.parentNode) === null || _a === void 0 ? void 0 : _a.appendChild(this.commentUI);
                this.needRequestComment = false;
            });
        }
        else {
            this.toggleBtn.innerText = "close";
            this.commentUI = createComment(this.boardItem.comments);
            (_a = this.toggleBtn.parentNode) === null || _a === void 0 ? void 0 : _a.appendChild(this.commentUI);
        }
    }
    removeComent() {
        var _a;
        this.toggleBtn.innerText = "open";
        (_a = this.toggleBtn.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(this.commentUI);
    }
    removeListner() {
        fetch(baseURL + );
        //DB 업데이트
    }
    editListner() {
        //DB 업데이트
    }
}
/**mainContent에 feedList mainContent에 붙임 */
function setFeedAtContent() {
    return feedManager
        .getFeeds()
        .forEach((e) => mainContentElem === null || mainContentElem === void 0 ? void 0 : mainContentElem.appendChild(e.returnSingle()));
}
board === null || board === void 0 ? void 0 : board.addEventListener("click", setFeedAtContent);
