var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
import { BoardItem } from "./models/back/boards.js";
import { BoardComment } from "./models/back/comments.js";
import { User } from "./models/back/user.js";
import { DateString } from "./models/back/boards.js";
// import { inputFeedForm } from "../frontModel/inputFeedForm";
/**임시 유저 정보 , 로그인 구현 후 삭제할 것 */
const testUser = new User("test", "TESTNAME", "TESTNICKNAME", 0);
/**임시 유저 정보 , 로그인 구현 후 삭제할 것 */
const user = testUser;
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
        this.innerAddBtn.addEventListener("click", (e) => {
            this.addListener(e);
        });
        this.inputFeedForm.className = "inputFeedForm";
        this.inputTitle.className = "inputTitle";
        this.inputContent.className = "inputContent";
        this.innerAddBtn.className = "inputAddBtn";
    }
    addListener(e) {
        e.preventDefault();
        this.close();
        feedManager.postNewFeed(this.inputTitle.value, this.inputContent.value);
    }
    returnForm() {
        return this.inputFeedForm;
    }
    show() {
        allOfBoardContent === null || allOfBoardContent === void 0 ? void 0 : allOfBoardContent.appendChild(this.returnForm());
    }
    close() {
        if (this.inputFeedForm.parentNode === allOfBoardContent) {
            allOfBoardContent === null || allOfBoardContent === void 0 ? void 0 : allOfBoardContent.removeChild(this.returnForm());
        }
    }
}
/** 게시글 InputFeedForm */
const inputFeedForm = new InputFeedForm();
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
            this.addListener();
        });
        // 맨위 addBtn -> 피드 추가
        board === null || board === void 0 ? void 0 : board.addEventListener("click", () => {
            allOfBoardContent === null || allOfBoardContent === void 0 ? void 0 : allOfBoardContent.appendChild(this.addBtn);
        });
    }
    setData(familyId) {
        return __awaiter(this, void 0, void 0, function* () {
            // startLoading
            yield this.getDataList(familyId).then((d) => {
                this.data = d;
                console.log(d);
                while (this.feedList.length > 0) {
                    this.feedList.pop();
                }
                d.forEach((boardItem) => {
                    this.feedList.push(new Feed(boardItem, boardItem.title, this.getComment(boardItem.boardId)));
                });
            });
            // endLoding
        });
    }
    /**
     *
     * @param boardId
     *
     *
     * 댓글을 등록한 게시물 boardId를 feedList에서 찾는다.
     * commentPromise를 Update
     * return new comments
     *
     */
    updateCommentList(boardId) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(`updatCommentlist 실행 `);
            let newComments = [];
            for (const e of this.feedList) {
                if (e.boardItem.boardId === boardId) {
                    newComments = yield this.getComment(e.boardItem.boardId);
                }
            }
            return newComments;
            // this.feedList.forEach(async (e) => {
            //   if (e.boardItem.boardId === boardId) {
            //     let newComments = await this.getComment(e.boardItem.boardId);
            //     return newComments;
            //   }
            // });
            // console.log(`updatCommentlist 실행 완`);
        });
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
    /**
     * UI 업데이트
     * BoardId가 같은 속성에서
     * title, content, modifyDate secret 수정
     */
    editFeed(boardItem, inputTitle, inputContent) {
        /** 서버 요청용 객체 생성 */
        const modifyDate = new DateString("2021:07:29 00:00:00", null);
        const newBoarditem = new BoardItem(boardItem.boardId, inputTitle, inputContent, boardItem.creationDate, modifyDate, boardItem.password, boardItem.secret.value, boardItem.createUser, boardItem.familyId);
        fetch(baseURL + "api/boards/update", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newBoarditem),
        })
            .then((res) => {
            console.log(res);
            if (res.status == 200) {
                const targetFeed = this.getFeedByBoardId(boardItem.boardId);
                targetFeed === null || targetFeed === void 0 ? void 0 : targetFeed.setBoardItem(newBoarditem);
                targetFeed === null || targetFeed === void 0 ? void 0 : targetFeed.setUIValues();
            }
            else if (res.status == 400) {
                alert("등록에 실패하였습니다 :(");
            }
        })
            .catch((error) => {
            console.error(error);
            alert("등록에 실패하였습니다 :(");
        });
    }
    refresh() {
        console.log("refresh 시작");
        while (this.feedDiv.firstChild) {
            this.feedDiv.removeChild(this.feedDiv.firstChild);
        }
        // this.getFeeds().forEach((e) => this.feedDiv?.appendChild(e.returnSingle()));
    }
    getFeedByBoardId(boardId) {
        return this.feedList.find((elem) => elem.boardItem.boardId === boardId);
    }
    /**
     * 1. feedDiv에 각 feed들을 append
     * 2. allofBoardContent(추가하기 btn, feedDiv)에 feedDiv append
     * 3. 최종 mainContent에 allofBoardConent append
     */
    setFeedAtContent() {
        console.log("setFeedAtContent시작");
        this.getFeeds().forEach((e) => { var _a; return (_a = this.feedDiv) === null || _a === void 0 ? void 0 : _a.appendChild(e.returnSingle()); });
        allOfBoardContent.appendChild(this.feedDiv);
        mainContentElem === null || mainContentElem === void 0 ? void 0 : mainContentElem.appendChild(allOfBoardContent);
    }
    /** 게시글 Update
     * FeedManager에서 관리
     * inputFeedForm.show()
     * inputFeedForm의 inner 버튼을 눌렀을시 ,
     * FeedManger에서 post 요청을 보낸다.
     * FeedManager에서 FeedList에 push한다s
     *
     */
    addListener() {
        inputFeedForm.show();
    }
    /**피드 등록시 (게시글 등록) 서버에게 post 요청 */
    postNewFeed(titleValue, contentValue) {
        //modifyDate 후에 구현 예정
        let testDate = new DateString(null, new Date());
        // 임시 testData, 로그인 구현 이후 수정 필요
        // 다른 폴더로 클래스 분리했을시 boardId feedmanager 접근 못함
        // feedManager.getFeedNumber() + 1
        let data = {
            boardId: 0,
            title: titleValue,
            content: contentValue,
            creationDate: "2021:07:29 00:00:00",
            modifyDate: "2021:07:29 00:00:00",
            password: null,
            secret: 0,
            createUser: user,
            familyId: 0,
        };
        fetch(baseURL + "api/boards/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((res) => {
            if (res.status === 200) {
                inputFeedForm.returnForm().reset();
                this.afterPostNewFeed(user);
                console.log(`success!`);
            }
            else if (res.status === 400) {
                alert("게시글 등록에 실패하였습니다");
            }
        })
            .catch((error) => {
            console.error(error);
            alert("게시글 등록에 실패하였습니다 :(");
        });
    }
    afterPostNewFeed(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let promise = yield this.setData(user.familyId);
            this.refresh();
            this.setFeedAtContent();
        });
    }
}
/**
 * 임시로 familyId를 0으로 처리하였다.
 * 로그인 기능 구현 이후 이부분 로그인된 사용자의 familyId를 값으로 넣어주어야 한다.
 */
const feedManager = new FeedManager(0);
/** 하나의 피드 -> 하나의 boardItem 정보들로 구성*/
class Feed {
    constructor(boardItem, title, commentPromise) {
        this.needRequestComment = true;
        this.commentUI = document.createElement("div");
        this.contentUI = document.createElement("div");
        this.boardItem = boardItem;
        this.commentPromise = commentPromise;
        this.feed = document.createElement("div");
        this.feedContentTitle = document.createElement("span");
        this.feedContentTitle.className = `contentTitle`;
        //삭제 버튼
        this.removeBtn = document.createElement("button");
        this.removeBtn.innerText = "remove";
        this.removeBtn.addEventListener("click", (event) => {
            this.removeListener(this.boardItem.boardId);
        });
        //수정버튼
        this.editBtn = document.createElement("button");
        this.editBtn.innerText = "edit";
        this.editBtn.addEventListener("click", () => {
            this.editListener();
        });
        //토글 버튼
        this.toggleBtn = document.createElement("button");
        this.toggleBtn.innerText = "open";
        this.toggleBtn.addEventListener("click", (event) => {
            this.toggleListener(event);
        });
        /**댓글 입력, 등록 버튼  만들기 -> inputForm 생성  */
        this.inputForm = document.createElement("form");
        this.input = document.createElement("input");
        this.inputBtn = document.createElement("button");
        this.inputBtn.innerText = "등록";
        this.inputForm.appendChild(this.input);
        this.inputForm.appendChild(this.inputBtn);
        this.inputBtn.addEventListener("click", (event) => this.inputBtnListener(event));
        this.feed.appendChild(this.feedContentTitle);
        this.feed.appendChild(this.removeBtn);
        this.feed.appendChild(this.editBtn);
        this.feed.appendChild(this.toggleBtn);
        this.setUIValues();
        // this.commentUI.appendChild(this.inputForm);
    }
    setBoardItem(boardItem) {
        this.boardItem = boardItem;
    }
    setUIValues() {
        this.feedContentTitle.innerText = this.boardItem.title;
        this.contentUI.innerText = this.boardItem.content;
    }
    /** HTMLDivElement인 feed return */
    returnSingle() {
        return this.feed;
    }
    /**버튼 toggle */
    toggleListener(event) {
        // let targetParentNode = this.toggleBtn.parentNode;
        var _a;
        if (this.toggleBtn.innerText === "open") {
            this.showContent();
            this.showComment();
            (_a = this.toggleBtn.parentNode) === null || _a === void 0 ? void 0 : _a.appendChild(this.inputForm);
            console.log(`inputForm 붙이기 끝`);
        }
        else {
            this.hideComent();
            this.hideContent();
            // this.toggleBtn.parentNode?.removeChild(this.inputForm);
        }
    }
    /**댓글 등록 eventListener */
    inputBtnListener(e) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            // submit 이후 새로고침 방지
            let status = yield this.postNewComment();
            if (status == 200) {
                // get요청
                let newComments = yield feedManager.updateCommentList(this.boardItem.boardId);
                this.boardItem.comments = newComments;
                // reRender
                this.commentUIrefresh();
                this.commentUI = createComment(this.boardItem.comments);
                (_a = this.toggleBtn.parentNode) === null || _a === void 0 ? void 0 : _a.appendChild(this.commentUI);
            }
            else if (status == 400) {
            }
            this.inputForm.reset();
        });
    }
    commentUIrefresh() {
        while (this.commentUI.firstChild) {
            this.commentUI.removeChild(this.commentUI.firstChild);
        }
    }
    /** 등록한 댓글 post */
    postNewComment() {
        return __awaiter(this, void 0, void 0, function* () {
            /**댓글 생성 -> body에 boardComment 넣어서 보낼 것 */
            // 임시
            // 현재 user에 대한 정보가 없는데....
            // commentId 0부터 시작하는지 확인할것
            let data = new BoardComment(this.boardItem.boardId, this.boardItem.comments.length + 1, this.input.value, user);
            try {
                const res = yield fetch(baseURL + `api/boards/comment/add`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });
                return res.status;
                if (res.status === 200) {
                    // alert("등록에 성공하였습니다");
                }
                else if (res.status === 400) {
                    alert("등록에 실패하였습니다 :(");
                }
            }
            catch (error) {
                console.error(error);
                alert("등록에 실패하였습니다 :(");
            }
        });
    }
    /**해당 Feed에 대한 내용[글] 붙이기 */
    showContent() {
        var _a;
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
        var _a;
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
                console.log(`showComment() 끝`);
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
    removeListener(boardId) {
        fetch(baseURL + `api/boards/delete`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({ boardId: boardId }),
        })
            .then((res) => {
            if (res.status === 200) {
                feedManager.removeFeed(boardId);
                console.log(`success!`);
            }
            else if (res.status === 400) {
                alert("삭제에 실패하였습니다 :(");
            }
        })
            .then((response) => { })
            .catch((err) => {
            console.log(err);
            alert("삭제에 실패하였습니다 :(");
        });
    }
    getDataForEdit() {
        return this.boardItem;
    }
    editListener() {
        mainContentElem === null || mainContentElem === void 0 ? void 0 : mainContentElem.removeChild(allOfBoardContent);
        const thisItem = this.getDataForEdit();
        this.setEditPage(thisItem, thisItem.title, thisItem.content);
    }
    /**
     * 편집 페이지 만들기
     */
    setEditPage(boardItem, title, content) {
        const editPage = document.createElement("div");
        const inputFeedForm = document.createElement("form");
        const inputContent = document.createElement("input");
        const inputTitle = document.createElement("input");
        const innerAddBtn = document.createElement("button");
        inputTitle.value = title;
        inputContent.value = content;
        innerAddBtn.innerText = "피드 재등록:+";
        inputFeedForm.appendChild(inputTitle);
        inputFeedForm.appendChild(inputContent);
        inputFeedForm.appendChild(innerAddBtn);
        editPage.appendChild(inputFeedForm);
        mainContentElem === null || mainContentElem === void 0 ? void 0 : mainContentElem.appendChild(editPage);
        innerAddBtn.addEventListener("click", (e) => {
            e.preventDefault();
            feedManager.editFeed(boardItem, inputTitle.value, inputContent.value);
            // editPage 제거,  allOfBoardContent 붙이기, this.feedList 수정
            mainContentElem === null || mainContentElem === void 0 ? void 0 : mainContentElem.removeChild(editPage);
            mainContentElem === null || mainContentElem === void 0 ? void 0 : mainContentElem.appendChild(allOfBoardContent);
        });
    }
}
// setFeedAtContent
board === null || board === void 0 ? void 0 : board.addEventListener("click", () => {
    feedManager.setFeedAtContent();
});
