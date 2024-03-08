var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { baseURL } from "./config.js";
import { BoardItem } from "./models/back/boards.js";
import { BoardComment } from "./models/back/comments.js";
import { DateString } from "./models/back/boards.js";
import { feedManager } from "./topMenu.js";
import { InputForm } from "./forms/InputForm.js";
/**
 * 게시물 관련한 모든 content를 담을 Div
 * 글 추가 버튼, 글 list , 댓글 등
 * 편집 페이지는 제외
 */
const allOfBoardContent = document.createElement("div");
allOfBoardContent.className = "allOfBoardContent";
class InputFeedForm {
    /** 피드 작성 폼 생성 */
    constructor() {
        this.isClosed = true;
        this.inputFeedDiv = document.createElement("form");
        this.inputForm = new InputForm();
        this.inputTitle = this.inputForm.addInputForm("게시글 제목을 입력해주세요.", true);
        this.inputContent = this.inputForm.addInputForm("게시글 내용을 입력해주세요.", true);
        this.inputForm.addButton("피드 등록", (e) => {
            this.addListener(e);
        });
        this.inputForm.appendFormTo(this.inputFeedDiv);
        this.inputFeedDiv.className = "inputFeedDiv";
    }
    addListener(e) {
        e.preventDefault();
        this.close();
        feedManager.postNewFeed(this.inputTitle.value, this.inputContent.value);
    }
    returnInputDiv() {
        return this.inputFeedDiv;
    }
    resetForm() {
        this.inputForm.refreshAllInputs();
    }
    getIsClosed() {
        return this.isClosed;
    }
    show() {
        feedManager.returnAddBtnFeed().appendChild(this.returnInputDiv());
        this.isClosed = false;
    }
    close() {
        feedManager.returnAddBtnFeed().removeChild(this.returnInputDiv());
        this.isClosed = true;
    }
}
/* single Feed, 토글 버튼, 댓글 */
// const FeedState = {
//   CLOSE: "close",
//   OPEN: "open",
// };
export class FeedManager {
    constructor(user) {
        this.data = [];
        this.feedList = [];
        /** 피드 추가 버튼 생성 및  기능*/
        this.addBtn = document.createElement("button");
        this.addBtnDiv = document.createElement("div");
        this.feedDiv = document.createElement("div");
        this.mainContentElem = document.getElementById("mainContent");
        /** 게시글 InputFeedForm */
        this.inputFeedDiv = new InputFeedForm();
        this.user = user;
        // classname 선언
        this.addBtn.className = "addFeedBtn";
        this.feedDiv.className = "feedDiv";
        this.setData(this.user.familyId);
        this.addBtn.innerText = "피드 추가:+";
        this.addBtn.classList.add("btnClass");
        this.addBtnDiv.appendChild(this.addBtn);
        this.addBtn.addEventListener("click", () => {
            if (this.isInputFormClosed()) {
                this.addBtn.innerText = "피드 추가 닫기:-";
                this.showInputForm();
            }
            else {
                this.addBtn.innerText = "피드 추가:+";
                this.closeInputForm();
            }
        });
        // 맨위 addBtn -> 피드 추가
        allOfBoardContent === null || allOfBoardContent === void 0 ? void 0 : allOfBoardContent.appendChild(this.addBtnDiv);
    }
    setUser(user) {
        if (this.user.familyId != user.familyId) {
            this.setData(user.familyId);
        }
        this.user = user;
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
                d.sort(function (a, b) {
                    // a.boardId as unknown as number;
                    // b.boardId as unknown as number;
                    if (a.boardId < b.boardId)
                        return 1;
                    if (a.boardId > b.boardId)
                        return -1;
                    return 0;
                });
                // 내림차순
                d.forEach((boardItem) => {
                    this.feedList.push(new Feed(boardItem, boardItem.title, this.getComment(boardItem.boardId), this.user));
                });
            });
            console.log(this.feedList);
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
        var _a;
        console.log("setFeedAtContent시작");
        this.getFeeds().forEach((e) => { var _a; return (_a = this.feedDiv) === null || _a === void 0 ? void 0 : _a.appendChild(e.returnSingle()); });
        allOfBoardContent.appendChild(this.feedDiv);
        (_a = this.mainContentElem) === null || _a === void 0 ? void 0 : _a.appendChild(allOfBoardContent);
    }
    /** 게시글 Update
     * FeedManager에서 관리
     * inputFeedDiv.show()
     * inputFeedForm의 inner 버튼을 눌렀을시 ,
     * FeedManger에서 post 요청을 보낸다.
     * FeedManager에서 FeedList에 push한다s
     *
     */
    isInputFormClosed() {
        return this.inputFeedDiv.getIsClosed();
    }
    showInputForm() {
        this.inputFeedDiv.show();
    }
    closeInputForm() {
        this.inputFeedDiv.close();
    }
    /**피드 등록시 (게시글 등록) 서버에게 post 요청 */
    postNewFeed(titleValue, contentValue) {
        //modifyDate 후에 구현 예정
        let testDate = new DateString(null, new Date());
        // 임시 testData, 로그인 구현 이후 수정 필요
        // 다른 폴더로 클래스 분리했을시 boardId feedmanager 접근 못함
        // feedManager.getFeedNumber() + 1
        console.log(`this.user\n `);
        console.log(this.user);
        let data = {
            boardId: 0,
            title: titleValue,
            content: contentValue,
            creationDate: "2021:07:29 00:00:00",
            modifyDate: "2021:07:29 00:00:00",
            password: null,
            secret: 0,
            createUser: this.user,
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
                this.inputFeedDiv.resetForm();
                this.afterPostNewFeed(this.user);
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
            this.addBtn.innerText = "피드 추가:+";
        });
    }
    returnAddBtnFeed() {
        return this.addBtnDiv;
    }
}
/** 하나의 피드 -> 하나의 boardItem 정보들로 구성*/
class Feed {
    constructor(boardItem, title, commentPromise, loginedUser) {
        this.needRequestComment = true;
        this.commentUI = document.createElement("div");
        this.contentUI = document.createElement("div");
        this.mainContentElem = document.getElementById("mainContent");
        this.boardItem = boardItem;
        this.commentPromise = commentPromise;
        this.feed = document.createElement("div");
        this.feed.className = `singleFeed`;
        this.feedContentTitle = document.createElement("div");
        this.feedContentTitle.className = `contentTitle`;
        this.feedWriter = document.createElement("div");
        //삭제 버튼
        this.removeBtn = document.createElement("button");
        this.removeBtn.innerText = "-";
        this.removeBtn.addEventListener("click", (event) => {
            this.removeListener(this.boardItem.boardId);
        });
        this.removeBtn.className = `removeBtn`;
        //수정버튼
        this.editBtn = document.createElement("button");
        this.editBtn.innerText = "edit";
        this.editBtn.addEventListener("click", () => {
            this.editListener();
        });
        this.editBtn.className = `editBtn`;
        //토글 버튼
        this.toggleBtn = document.createElement("button");
        this.toggleBtn.innerText = "open";
        this.toggleBtn.addEventListener("click", (event) => {
            this.toggleListener(event);
        });
        this.toggleBtn.className = `toggleBtn`;
        /**btnClass css 입히기 */
        this.removeBtn.classList.add("btnClass");
        this.toggleBtn.classList.add("btnClass");
        this.editBtn.classList.add("btnClass");
        /**댓글 입력, 등록 버튼  만들기 -> inputForm 생성  */
        this.inputForm = document.createElement("form");
        this.input = document.createElement("input");
        this.inputBtn = document.createElement("button");
        this.inputBtn.innerText = "등록";
        this.inputForm.appendChild(this.input);
        this.inputForm.appendChild(this.inputBtn);
        this.inputBtn.addEventListener("click", (event) => this.inputBtnListener(event, loginedUser));
        /**input className 생성 */
        this.inputForm.className = "inputForm";
        this.input.className = "input";
        this.inputBtn.className = "inputBtn";
        this.feed.appendChild(this.feedContentTitle);
        this.feed.appendChild(this.feedWriter);
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
        this.feedWriter.innerText = "작성자: " + this.boardItem.createUser.nickName;
        this.contentUI.innerText = this.boardItem.content;
    }
    /** HTMLDivElement인 feed return */
    returnSingle() {
        return this.feed;
    }
    /**버튼 toggle */
    toggleListener(event) {
        // let targetParentNode = this.toggleBtn.parentNode;
        var _a, _b;
        if (this.toggleBtn.innerText === "open") {
            this.showContent();
            this.showComment();
            (_a = this.toggleBtn.parentNode) === null || _a === void 0 ? void 0 : _a.appendChild(this.inputForm);
        }
        else {
            this.hideComent();
            this.hideContent();
            (_b = this.toggleBtn.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(this.inputForm);
        }
    }
    /**댓글 등록 eventListener */
    inputBtnListener(e, loginedUser) {
        return __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            // submit 이후 새로고침 방지
            console.log(this.input.value.toString);
            yield this.postNewComment(loginedUser);
            // reRenderㄴ
            this.commentUIrefresh();
            this.inputForm.reset();
        });
    }
    commentUIrefresh() {
        this.clearCommentUI();
        this.initCommentUI();
    }
    clearCommentUI() {
        var _a;
        (_a = this.toggleBtn.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(this.commentUI);
    }
    initCommentUI() {
        var _a;
        this.commentUI = this.createComment(this.boardItem.comments);
        (_a = this.toggleBtn.parentNode) === null || _a === void 0 ? void 0 : _a.appendChild(this.commentUI);
    }
    /** 등록한 댓글 post */
    postNewComment(loginedUser) {
        return __awaiter(this, void 0, void 0, function* () {
            /**댓글 생성 -> body에 boardComment 넣어서 보낼 것 */
            // 임시
            // 현재 user에 대한 정보가 없는데....
            // commentId 0부터 시작하는지 확인할것
            let data = new BoardComment(this.boardItem.boardId, this.boardItem.comments.length + 1, this.input.value, loginedUser);
            try {
                const res = yield fetch(baseURL + `api/boards/comment/add`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });
                if (res.status == 200) {
                    this.boardItem.comments.push(data);
                    alert("등록 성공");
                }
                else if (res.status == 400) {
                    alert("등록 실패");
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
                this.commentUI = this.createComment(this.boardItem.comments);
                // commentList 댓글로 이뤄진 div 태그 반환
                (_a = this.toggleBtn.parentNode) === null || _a === void 0 ? void 0 : _a.appendChild(this.commentUI);
                this.needRequestComment = false;
            });
        }
        else {
            this.toggleBtn.innerText = "close";
            this.commentUI = this.createComment(this.boardItem.comments);
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
        var _a;
        (_a = this.mainContentElem) === null || _a === void 0 ? void 0 : _a.removeChild(allOfBoardContent);
        const thisItem = this.getDataForEdit();
        this.setEditPage(thisItem, thisItem.title, thisItem.content);
    }
    /**
     * 편집 페이지 만들기
     */
    setEditPage(boardItem, title, content) {
        var _a;
        const editPage = document.createElement("div");
        const inputFeedDiv = document.createElement("form");
        const inputsDiv = document.createElement("div");
        const inputContent = document.createElement("input");
        const inputTitle = document.createElement("input");
        const innerAddBtn = document.createElement("button");
        /** className 지정 */
        // inputFeedDiv.className = "inputFeedDiv";
        inputFeedDiv.className = "inputForm";
        inputContent.className = "inputContent";
        inputTitle.className = "inputTitle";
        inputTitle.type = "textarea";
        innerAddBtn.className = "inputBtn";
        inputsDiv.className = "inputDiv";
        inputTitle.value = title;
        inputContent.value = content;
        innerAddBtn.innerText = "피드 재등록:+";
        inputsDiv.appendChild(inputTitle);
        inputsDiv.appendChild(inputContent);
        inputFeedDiv.appendChild(inputsDiv);
        inputFeedDiv.appendChild(innerAddBtn);
        editPage.appendChild(inputFeedDiv);
        (_a = this.mainContentElem) === null || _a === void 0 ? void 0 : _a.appendChild(editPage);
        innerAddBtn.addEventListener("click", (e) => {
            var _a, _b;
            e.preventDefault();
            feedManager.editFeed(boardItem, inputTitle.value, inputContent.value);
            // editPage 제거,  allOfBoardContent 붙이기, this.feedList 수정
            (_a = this.mainContentElem) === null || _a === void 0 ? void 0 : _a.removeChild(editPage);
            (_b = this.mainContentElem) === null || _b === void 0 ? void 0 : _b.appendChild(allOfBoardContent);
        });
    }
    /**해당 게시글의 댓글 생성*/
    createComment(DBcommentList) {
        const commentList = document.createElement("div");
        commentList.className = "commentList";
        DBcommentList.sort(function (a, b) {
            if (a.commentId < b.commentId)
                return 1;
            if (a.commentId > b.commentId)
                return -1;
            return 0;
        });
        for (let i = 0; i < DBcommentList.length; i++) {
            const comment = document.createElement("div");
            const commentID = document.createElement("div");
            const commentContent = document.createElement("div");
            const commentUser = document.createElement("div");
            const commentBtn = document.createElement("button");
            comment.className = "sigleComment";
            commentID.className = "commentID";
            commentUser.className = "commentUser";
            commentContent.className = "commentContent";
            commentBtn.classList.add("btnClass");
            commentBtn.innerText = "삭제";
            commentBtn.addEventListener("click", () => this.deleteComment(DBcommentList[i].commentId));
            // commentID.innerText = DBcommentList[i].commentId.toString();
            commentUser.innerText = DBcommentList[i].user.nickName;
            commentContent.innerText = DBcommentList[i].content;
            // comment.appendChild(commentID);
            comment.appendChild(commentUser);
            comment.appendChild(commentContent);
            comment.appendChild(commentBtn);
            commentList.appendChild(comment);
        }
        return commentList;
    }
    /**
     * 댓글 삭제 api
     * commentId를 body에 넣어 보낸다.
     * "body": {
     *  "commentId": 12
     * }
     */
    /** 게시글 댓글 삭제 후 UI update */
    deleteComment(commentId) {
        fetch(baseURL + `api/boards/comment/delete`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({ commentId: commentId }),
        })
            .then((res) => {
            if (res.status === 200) {
                // 해당 commentId만 제외한 후 그리기
                //reRender
                this.boardItem.comments = this.boardItem.comments.filter((e) => e.commentId != commentId);
                this.commentUIrefresh();
                this.boardItem.comments = this.boardItem.comments.filter((e) => e.commentId != commentId);
                console.log(this.boardItem.comments);
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
}
