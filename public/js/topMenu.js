import { baseURL } from "./config.js";
import { User } from "./models/back/user.js";
import { FeedManager } from "./board.js";
import { cookieManager } from "./cookie.js";
import { LoginPageManager } from "./loginManager.js";
const login = document.getElementById("sign");
const board = document.getElementById("board");
const chat = document.getElementById("chat");
const game = document.getElementById("game");
const logout = document.getElementById("logout");
const mainContentElem = document.getElementById("mainContent");
// /**임시 유저 정보 , 로그인 구현 후 삭제할 것 */
// const sign = new User("test", "TESTNAME", "TESTNICKNAME", 0);
/**임시 유저 정보 , 로그인 구현 후 삭제할 것 */
const undefinedUser = new User("", "익명user", "익명user", -1);
let user = undefinedUser;
export const feedManager = new FeedManager(user);
export const loginPageManager = new LoginPageManager(user, () => {
    // 로그아웃
    forceLogout();
}, (_user) => {
    // 로그인
    loggedIn(_user);
});
window.onload = function () {
    const tmpUser = cookieManager.getUserFromCookie();
    console.log(tmpUser);
    if (tmpUser === undefined) {
        // 로그인 실패
        forceLogout();
    }
    else {
        // 로그인 성공
        loggedIn(tmpUser);
    }
};
/**
 *window.eventlistner('onclick', fucntion)
 * widow.onload는 콜백함수
 * window load 이후
 * feedManager에 user을 넘겨야함
 *
 * 1.promise 로 만든다.
 *
 *
 */
// newPromise
// setFeedAtContent
login === null || login === void 0 ? void 0 : login.addEventListener("click", () => {
    clearMainContentArea();
    onClickMenu(login);
    loginPageManager.showLogInPage();
});
board === null || board === void 0 ? void 0 : board.addEventListener("click", () => {
    clearMainContentArea();
    feedManager.setFeedAtContent();
    onClickMenu(board);
});
chat === null || chat === void 0 ? void 0 : chat.addEventListener("click", () => {
    clearMainContentArea();
    onClickMenu(chat);
    // 임시 테스트
    window.location.href = baseURL + `socketTest`;
});
game === null || game === void 0 ? void 0 : game.addEventListener("click", () => {
    clearMainContentArea();
    onClickMenu(game);
    window.location.href = "https://famous-squirrel-43f0b7.netlify.app/";
});
logout === null || logout === void 0 ? void 0 : logout.addEventListener("click", () => {
    clearMainContentArea();
    onClickMenu(logout);
    forceLogout();
});
function onClickMenu(clicked) {
    setColorDefault(login);
    setColorDefault(board);
    setColorDefault(chat);
    setColorDefault(game);
    setColorDefault(logout);
    setColorSelected(clicked);
}
/**기본색으로 변환 */
function setColorDefault(elem) {
    if (elem == null)
        return;
    elem.className = "notSelectedEffect";
}
function setColorSelected(elem) {
    if (elem == null)
        return;
    elem.className = "selectedEffect";
}
/***임시 */
function clearMainContentArea() {
    mainContentElem === null || mainContentElem === void 0 ? void 0 : mainContentElem.childNodes.forEach((child) => {
        mainContentElem === null || mainContentElem === void 0 ? void 0 : mainContentElem.removeChild(child);
    });
}
// /** 로그인 이후
//  * 로그인 navBar에서 제거
//  * 로그인 form 제거
//  */
function forceLogout() {
    console.log("forceLogout");
    feedManager.setUser(undefinedUser);
    loginPageManager.setUser(undefinedUser);
    cookieManager.makeUserIdExpried();
    user = undefinedUser;
    makeLogOutToLogin();
}
function loggedIn(_user) {
    user = _user;
    feedManager.setUser(_user);
    loginPageManager.setUser(user);
    makeLoginToLogout();
}
function makeLoginToLogout() {
    const content = document.getElementById("mainContent");
    const login = document.getElementById("sign");
    const logout = document.getElementById("logout");
    if (logout != null)
        logout.style.display = "block";
    if (login != null)
        login.style.display = "none";
    if (content === null || content === void 0 ? void 0 : content.childElementCount) {
        content === null || content === void 0 ? void 0 : content.replaceChildren();
    }
}
function makeLogOutToLogin() {
    // topBar에 다시 로그인 버튼 만들기
    // topBar에서 로그아웃 버튼 떼기
    const login = document.getElementById("sign");
    const logout = document.getElementById("logout");
    if (logout != null)
        logout.style.display = "none";
    if (login != null)
        login.style.display = "block";
}
