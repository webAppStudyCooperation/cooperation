const board = document.getElementById("board");
const mainContentElem = document.getElementById("mainContent");
/**
 * 게시물 관련한 모든 content를 담을 Div
 * 글 추가 버튼, 글 list , 댓글 등
 * 편집 페이지는 제외
 */
const allOfBoardContent = document.createElement("div");
allOfBoardContent.className = "allOfBoardContent";
import { baseURL } from "./config.js";
import { BoardComment } from "./models/back/comments.js";
import { User } from "./models/back/user.js";
import { DateString } from "./models/back/boards.js";
// import { inputFeedForm } from "../frontModel/inputFeedForm";
/**임시 유저 정보 , 로그인 구현 후 삭제할 것 */
const testUser = new User("test", "TESTNAME", "TESTNICKNAME", 0);
/**
 * 편집 페이지 만들기
 */
function setEditPage(boardItem, title, content) {
    const editPage = document.createElement("div");
    const inputFeedForm = document.createElement("form");
    const inputContent = document.createElement("input");
    const inputTitle = document.createElement("input");
    const innerAddBtn = document.createElement("button");
    inputTitle.value = title;
    inputContent.value = content;
    innerAddBtn.innerText = "피드 재등록";
    inputFeedForm.appendChild(inputTitle);
    inputFeedForm.appendChild(inputContent);
    inputFeedForm.appendChild(innerAddBtn);
    editPage.appendChild(inputFeedForm);
    mainContentElem === null || mainContentElem === void 0 ? void 0 : mainContentElem.appendChild(editPage);
    innerAddBtn.addEventListener("click", (e) => {
        console.log(inputTitle.value);
        console.log(inputContent.value);
        // POST FUCNITON
        e.preventDefault();
        // //DATE 수정필요
        const data = {
            boardId: boardItem.boardId,
            title: inputTitle.value,
            content: inputContent.value,
            creationDate: boardItem.creationDate,
            modifyDate: "2021:07:29 00:00:00",
            password: boardItem.password,
            secret: boardItem.secret,
            createUser: testUser,
            comments: boardItem.comments,
            familyId: 0,
        };
        fetch(baseURL + "api/boards/update", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then((res) => console.log(res));
        // editPage 제거,  allOfBoardContent 붙이기
        mainContentElem === null || mainContentElem === void 0 ? void 0 : mainContentElem.removeChild(editPage);
        mainContentElem === null || mainContentElem === void 0 ? void 0 : mainContentElem.appendChild(allOfBoardContent);
    });
    // // const thisForm = inputFeedForm.returnForm();
    // console.log(thisForm.childNodes[0].textContent);
    // // 0: inputTitle, 1: inputContent, 2: Btn
    // // 기존 내용 세팅
    // thisForm.childNodes[0].textContent = title;
    // thisForm.childNodes[1].textContent = content;
    // editPage?.appendChild(inputFeedForm.returnForm());
    // mainContentElem?.appendChild(editPage);
}
class InputFeedForm {
    /** 피드 작성 폼 생성 */
    constructor() {
        this.inputFeedForm = document.createElement("form");
        this.inputContent = document.createElement("input");
        this.inputTitle = document.createElement("input");
        this.innerAddBtn = document.createElement("button");
        this.innerAddBtn.innerText = "피드 등록";
        this.inputFeedForm.appendChild(this.inputTitle);
        this.inputFeedForm.appendChild(this.inputContent);
        this.inputFeedForm.appendChild(this.innerAddBtn);
        this.innerAddBtn.addEventListener("click", (e) => this.submitNewFeed(e));
        this.inputFeedForm.className = "inputFeedForm";
        this.inputTitle.className = "inputTitle";
        this.inputContent.className = "inputContent";
        this.innerAddBtn.className = "inputAddBtn";
    }
    setBtnForNewsubmit() { }
    setBtnForEdit() { }
    returnForm() {
        return this.inputFeedForm;
    }
    show() {
        allOfBoardContent === null || allOfBoardContent === void 0 ? void 0 : allOfBoardContent.appendChild(this.returnForm());
    }
    innerBtnListener() {
        if (this.inputFeedForm.parentNode === allOfBoardContent) {
            allOfBoardContent === null || allOfBoardContent === void 0 ? void 0 : allOfBoardContent.removeChild(this.returnForm());
        }
        else {
            //editPage에서 버튼 눌렀을때
            mainContentElem === null || mainContentElem === void 0 ? void 0 : mainContentElem.removeChild(this.inputFeedForm);
            mainContentElem === null || mainContentElem === void 0 ? void 0 : mainContentElem.appendChild(allOfBoardContent);
        }
    }
    /**피드 등록*/
    submitNewFeed(e) {
        e.preventDefault();
        this.innerBtnListener();
        this.postNewFeed();
        this.inputFeedForm.reset();
    }
    /**피드 등록시 서버에게 post 요청 */
    postNewFeed() {
        //modifyDate 후에 구현 예정
        let testDate = new DateString(null, new Date());
        // 임시 testData, 로그인 구현 이후 수정 필요
        // 다른 폴더로 클래스 분리했을시 boardId feedmanager 접근 못함
        // feedManager.getFeedNumber() + 1
        let data = {
            boardId: 0,
            title: this.inputTitle.value,
            content: this.inputContent.value,
            creationDate: "2021:07:29 00:00:00",
            modifyDate: "2021:07:29 00:00:00",
            password: null,
            secret: 0,
            createUser: testUser,
            familyId: 0,
        };
        fetch(baseURL + "api/boards/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then((res) => {
            console.log(res);
        });
    }
}
const inputFeedForm = new InputFeedForm();
// /** 피드 추가 버튼 생성 및  기능*/
// const addBtn: HTMLButtonElement = document.createElement("button");
// addBtn.innerText = "피드 추가:+";
// addBtn.addEventListener("click", () => {
//   inputFeedForm.show();
// });
// // 작동 O
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
        /** 피드 추가 버튼 생성 및  기능*/
        this.addBtn = document.createElement("button");
        this.feedDiv = document.createElement("div");
        this.setData(familyId);
        this.addBtn.innerText = "피드 추가:+";
        this.addBtn.addEventListener("click", () => {
            inputFeedForm.show();
        });
        // 맨위 addBtn -> 피드 추가
        board === null || board === void 0 ? void 0 : board.addEventListener("click", () => {
            allOfBoardContent === null || allOfBoardContent === void 0 ? void 0 : allOfBoardContent.appendChild(this.addBtn);
        });
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
                this.feedList.push(new Feed(boardItem, boardItem.title, this.getComment(boardItem.boardId)));
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
    getFeedNumber() {
        return this.feedList.length;
    }
    removeFeed(boardId) {
        // UI삭제
        let newFeedList = this.feedList.filter((value) => {
            return value.boardItem.boardId != boardId;
        });
        this.feedList = newFeedList;
        // 기존에 있던 feedDiv에 있는 모든 feedNode들 삭제
        while (this.feedDiv.firstChild) {
            this.feedDiv.removeChild(this.feedDiv.firstChild);
        }
        allOfBoardContent.removeChild(this.feedDiv);
        this.setFeedAtContent();
    }
    /**mainContent에 feedList mainContent에 붙임 */
    setFeedAtContent() {
        //feed divElement들 feedDiv 붙일때만 사용
        /**
         * 1. feedDiv에 각 feed들을 append
         * 2. allofBoardContent(추가하기 btn, feedDiv)에 feedDiv append
         * 3. 최종 mainContent에 allofBoardConent append
         */
        this.getFeeds().forEach((e) => { var _a; return (_a = this.feedDiv) === null || _a === void 0 ? void 0 : _a.appendChild(e.returnSingle()); });
        allOfBoardContent.appendChild(this.feedDiv);
        mainContentElem === null || mainContentElem === void 0 ? void 0 : mainContentElem.appendChild(allOfBoardContent);
        // if (parentNode == this.feedDiv) {
        //   this.getFeeds().forEach((e) => parentNode?.appendChild(e.returnSingle()));
        // } else if (parentNode === null && parentNode === allOfBoardContent) {
        //   parentNode.appendChild(this.feedDiv);
        // }
        // grandParentNode?.appendChild(parentNode as HTMLElement);
    }
}
/**
 * 임시로 familyId를 0으로 처리하였다.
 * 로그인 기능 구현 이후 이부분 로그인된 사용자의 familyId를 값으로 넣어주어야 한다.
 */
const feedManager = new FeedManager(0);
// 하나의 피드 -> 하나의 boardItem 정보들로 구성
class Feed {
    constructor(boardItem, title, commentPromise) {
        this.needRequestComment = true;
        this.commentUI = document.createElement("div");
        this.contentUI = document.createElement("div");
        this.boardItem = boardItem;
        this.commentPromise = commentPromise;
        this.feed = document.createElement("div");
        this.feed.innerText = title;
        //삭제 버튼
        this.removeBtn = document.createElement("button");
        this.removeBtn.innerText = "remove";
        this.removeBtn.addEventListener("click", (event) => {
            this.removeListner(this.boardItem.boardId);
        });
        //수정버튼
        this.editBtn = document.createElement("button");
        this.editBtn.innerText = "edit";
        this.editBtn.addEventListener("click", () => {
            this.editListner();
        });
        //토글 버튼
        this.toggleBtn = document.createElement("button");
        this.toggleBtn.innerText = "open";
        this.toggleBtn.addEventListener("click", (event) => {
            this.toggleListner(event);
        });
        /**댓글 입력, 등록 버튼  만들기 -> inputForm 생성  */
        this.inputForm = document.createElement("form");
        this.input = document.createElement("input");
        this.inputBtn = document.createElement("button");
        this.inputBtn.innerText = "등록";
        this.inputForm.appendChild(this.input);
        this.inputForm.appendChild(this.inputBtn);
        this.inputBtn.addEventListener("click", (event) => this.submitValue(event));
        this.feed.appendChild(this.removeBtn);
        this.feed.appendChild(this.editBtn);
        this.feed.appendChild(this.toggleBtn);
        // this.commentUI.appendChild(this.inputForm);
    }
    /*HTMLDivElement인 feed return */
    returnSingle() {
        return this.feed;
    }
    /*버튼 toggle */
    toggleListner(event) {
        // let targetParentNode = this.toggleBtn.parentNode;
        var _a;
        if (this.toggleBtn.innerText === "open") {
            this.showContent();
            this.showComment();
        }
        else {
            this.hideComent();
            this.hideContent();
            (_a = this.toggleBtn.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(this.inputForm);
        }
    }
    // /**댓글 입력, 등록 버튼  만들기 -> inputForm 생성  */
    // private makeCommentForm() {
    //   //댓글 폼
    //   this.inputForm = document.createElement("form");
    //   this.input = document.createElement("input");
    //   this.inputBtn = document.createElement("button");
    //   this.inputBtn.innerText = "등록";
    //   this.inputForm.appendChild(this.input);
    //   this.inputForm.appendChild(this.inputBtn);
    //   this.inputBtn.addEventListener("click", (event) => this.submitValue(event));
    //   this.feed.appendChild(this.removeBtn);
    //   this.feed.appendChild(this.editBtn);
    //   this.feed.appendChild(this.toggleBtn);
    //   this.feed.appendChild(this.inputForm);
    // }
    /**댓글 등록  */
    submitValue(e) {
        console.log(this.input.value);
        e.preventDefault();
        // submit 이후 새로고침 방지
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
        this.inputForm.reset();
    }
    /**해당 Feed에 대한 내용[글] 붙이기 */
    showContent() {
        var _a;
        this.contentUI.innerText = this.boardItem.content;
        (_a = this.toggleBtn.parentNode) === null || _a === void 0 ? void 0 : _a.appendChild(this.contentUI);
    }
    /**해당 Feed에 대한 내용[글] 가리기 */
    hideContent() {
        var _a;
        console.log(this.toggleBtn.parentNode);
        console.log(this.contentUI.parentNode);
        (_a = this.toggleBtn.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(this.contentUI);
    }
    /**해당 Feed에 대한 댓글 붙이기 */
    showComment() {
        var _a, _b;
        if (this.needRequestComment) {
            this.commentPromise.then((d) => {
                var _a;
                d.forEach((elem) => {
                    this.boardItem.comments.push(elem);
                });
                this.toggleBtn.innerText = "close";
                this.commentUI = createComment(this.boardItem.comments);
                // commentList 댓글로 이뤄진 div 태그 반환
                (_a = this.toggleBtn.parentNode) === null || _a === void 0 ? void 0 : _a.appendChild(this.commentUI);
                this.needRequestComment = false;
            });
        }
        else {
            this.toggleBtn.innerText = "close";
            this.commentUI = createComment(this.boardItem.comments);
            (_a = this.toggleBtn.parentNode) === null || _a === void 0 ? void 0 : _a.appendChild(this.commentUI);
        }
        (_b = this.toggleBtn.parentNode) === null || _b === void 0 ? void 0 : _b.appendChild(this.inputForm);
    }
    hideComent() {
        var _a;
        this.toggleBtn.innerText = "open";
        (_a = this.toggleBtn.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(this.commentUI);
    }
    removeListner(boardId) {
        feedManager.removeFeed(boardId);
        fetch(baseURL + `api/boards/delete`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({ boardId: boardId }),
        })
            .then((response) => response)
            .then((d) => console.log(d));
    }
    getDataForEdit() {
        return this.boardItem;
    }
    editListner() {
        mainContentElem === null || mainContentElem === void 0 ? void 0 : mainContentElem.removeChild(allOfBoardContent);
        const thisItem = this.getDataForEdit();
        setEditPage(thisItem, thisItem.title, thisItem.content);
    }
}
// setFeedAtContent
board === null || board === void 0 ? void 0 : board.addEventListener("click", () => {
    feedManager.setFeedAtContent();
});
