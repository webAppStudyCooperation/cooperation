const board = document.getElementById("board");
let boardFlag = false;
const mainContentElem = document.getElementById("mainContent");
import { baseURL } from "./config.js";
import { BoardComment } from "./models/comments.js";
import { User } from "./models/user.js";
/** 게시글 추가 버튼 생성 및  기능*/
const addBtn = document.createElement("button");
mainContentElem === null || mainContentElem === void 0 ? void 0 : mainContentElem.appendChild(addBtn);
/**게시글 추가 버튼 */
addBtn.innerText = "게시글 추가";
addBtn.addEventListener("click", showCreateFeed);
function showCreateFeed() {
    const showFeedForm = document.createElement("div");
    const inputFeed = document.createElement("input");
    const addBtn = document.createElement("button");
    addBtn.addEventListener("click", () => {
        console.log("youClickedInsideBtn");
    });
    showFeedForm.appendChild(inputFeed);
    showFeedForm.appendChild(addBtn);
}
function createFeed() {
    console.log("게시글 작성 후 추가  ");
}
/**해당 게시글의 댓글 생성*/
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
    constructor(familyId) {
        this.data = [];
        this.feedList = [];
        this.setData(familyId);
    }
    setData(familyId) {
        // startLoading
        this.getDataList(familyId).then((d) => {
            this.data = d;
            console.log(d);
            //? 기존에 있는 feedList 비우려고?
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
    getDataList(familyId) {
        // let data: Promise<BoardItem>;
        return (fetch(baseURL + "api/boards", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({ familyId: familyId }),
        })
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
/**
 * 임시로 familyId를 0으로 처리하였다.
 * 로그인 기능 구현 이후 이부분 로그인된 사용자의 familyId를 값으로 넣어주어야
 */
const feedManager = new FeedManager(0);
// 하나의 피드 -> 하나의 boardItem 정보들로 구성
class Feed {
    constructor(boardItem, content, commentPromise) {
        this.inputForm = document.createElement("div");
        this.needRequestComment = true;
        this.commentUI = document.createElement("div");
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
        // this.makeComment();
        this.inputForm = document.createElement("div");
        this.input = document.createElement("input");
        this.inputBtn = document.createElement("button");
        this.inputBtn.innerText = "등록";
        this.inputForm.appendChild(this.input);
        this.inputForm.appendChild(this.inputBtn);
        this.inputForm.addEventListener("click", (event) => this.submitValue(event));
        this.feed.appendChild(this.removeBtn);
        this.feed.appendChild(this.editBtn);
        this.feed.appendChild(this.toggleBtn);
        this.feed.appendChild(this.inputForm);
    }
    /*HTMLDivElement인 feed return */
    returnSingle() {
        return this.feed;
    }
    /*버튼 toggle */
    toggleListner(event) {
        // let targetParentNode = this.toggleBtn.parentNode;
        if (this.toggleBtn.innerText === "open") {
            this.showComment();
        }
        else {
            this.hideComent();
        }
    }
    /**댓글 입력, 등록 버튼  만들기 -> inputForm 생성  */
    // private makeComment() {
    //   //댓글 폼
    //   this.input = document.createElement("input");
    //   this.inputBtn = document.createElement("button");
    // }
    /**댓글 등록  */
    submitValue(e) {
        console.log(this.input.value);
        /**임시 유저 정보 , 로그인 구현 후 삭제할 것 */
        const testUser = new User("Test1", "TESTNAME", "TESTNICKNAME", 0);
        /**댓글 생성 -> body에 boardComment넣어서 보낼 것 */
        // 임시
        // 현재 user에 대한 정보가 없는데....
        // commentId 0부터 시작하는지 확인할것
        let data = new BoardComment(this.boardItem.boardId, this.boardItem.comments.length + 1, this.input.value, testUser);
        fetch(baseURL + `api/boards/comment/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(data),
        }).then((res) => console.log(res));
    }
    /**해당 Feed에 대한 댓글 붙이기 */
    showComment() {
        var _a;
        if (this.needRequestComment) {
            this.commentPromise.then((d) => {
                var _a;
                d.forEach((elem) => {
                    this.boardItem.comments.push(elem);
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
    hideComent() {
        var _a;
        this.toggleBtn.innerText = "open";
        (_a = this.toggleBtn.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(this.commentUI);
    }
    removeListner(boardId) {
        fetch(baseURL + `api/boards/comment/delete`, {
            method: "DELETE",
            // headers: {
            //   "Content-type": "application/json; charset=UTF-8",
            // },
            // body: JSON.stringify({ boardId: boardId }),
        })
            .then((response) => response)
            .then((d) => console.log(d));
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
