import { User } from "./models/back/user.js";
const login = document.getElementById("login");
const board = document.getElementById("board");
const chat = document.getElementById("chat");
const game = document.getElementById("game");
const mainContentElem = document.getElementById("mainContent");
/**임시 유저 정보 , 로그인 구현 후 삭제할 것 */
const testUser = new User("test", "TESTNAME", "TESTNICKNAME", 0);
/**임시 유저 정보 , 로그인 구현 후 삭제할 것 */
let user = testUser;
// setFeedAtContent
login === null || login === void 0 ? void 0 : login.addEventListener("click", () => {
    onClickMenu(login);
});
board === null || board === void 0 ? void 0 : board.addEventListener("click", () => {
    onClickMenu(board);
});
chat === null || chat === void 0 ? void 0 : chat.addEventListener("click", () => {
    onClickMenu(chat);
});
game === null || game === void 0 ? void 0 : game.addEventListener("click", () => {
    onClickMenu(game);
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
    elem.style.color = "transparent";
}
function setColorSelected(elem) {
    if (elem == null)
        return;
    elem.style.color = "#c7c7c7";
}
