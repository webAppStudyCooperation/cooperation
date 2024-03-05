import { feedManager } from "./board.js";
import { loginPageManager } from "./login.js";
import { cookieManager } from "./cookie.js";
const login = document.getElementById("sign");
const board = document.getElementById("board");
const chat = document.getElementById("chat");
const game = document.getElementById("game");
const logout = document.getElementById("logout");
const mainContentElem = document.getElementById("mainContent");
// /**임시 유저 정보 , 로그인 구현 후 삭제할 것 */
// const testUser = new User("test", "TESTNAME", "TESTNICKNAME", 0);
/**임시 유저 정보 , 로그인 구현 후 삭제할 것 */
let user = undefined;
window.onload = function () {
    user = cookieManager.getUserFromCookie();
    if (user === undefined) {
        loginPageManager.onLogOuted();
    }
    else {
        loginPageManager.onLogIned();
    }
};
// setFeedAtContent
login === null || login === void 0 ? void 0 : login.addEventListener("click", () => {
    clearMainContentArea();
    onClickMenu(login);
    loginPageManager.drawLoginPage();
});
board === null || board === void 0 ? void 0 : board.addEventListener("click", () => {
    clearMainContentArea();
    feedManager.setFeedAtContent();
    onClickMenu(board);
});
chat === null || chat === void 0 ? void 0 : chat.addEventListener("click", () => {
    clearMainContentArea();
    onClickMenu(chat);
});
game === null || game === void 0 ? void 0 : game.addEventListener("click", () => {
    clearMainContentArea();
    onClickMenu(game);
    window.location.href = "https://famous-squirrel-43f0b7.netlify.app/";
});
logout === null || logout === void 0 ? void 0 : logout.addEventListener("click", () => {
    cookieManager.makeUserIdExpried();
    loginPageManager.onLogOuted();
});
function onClickMenu(clicked) {
    setColorDefault(login);
    setColorDefault(board);
    setColorDefault(chat);
    setColorDefault(game);
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
