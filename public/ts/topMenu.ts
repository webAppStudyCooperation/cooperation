import { baseURL } from "./config.js";
import { BoardItem } from "./models/back/boards.js";
import { BoardComment } from "./models/back/comments.js";
import { User } from "./models/back/user.js";
import { DateString } from "./models/back/boards.js";
import { copyFileSync } from "fs";
import { FeedManager } from "./board.js";
import { cli } from "winston/lib/winston/config/index.js";

const login: HTMLElement | null = document.getElementById("login");
const board: HTMLElement | null = document.getElementById("board");
const chat: HTMLElement | null = document.getElementById("chat");
const game: HTMLElement | null = document.getElementById("game");

const mainContentElem: HTMLElement | null =
  document.getElementById("mainContent");

/**임시 유저 정보 , 로그인 구현 후 삭제할 것 */
const testUser = new User("test", "TESTNAME", "TESTNICKNAME", 0);
/**임시 유저 정보 , 로그인 구현 후 삭제할 것 */
let user = testUser;

// setFeedAtContent
login?.addEventListener("click", () => {
    onClickMenu(login)
});
board?.addEventListener("click", () => {
    onClickMenu(board)
});
chat?.addEventListener("click", () => {
    onClickMenu(chat)
});
game?.addEventListener("click", () => {
    onClickMenu(game)
});

function onClickMenu(
    clicked: HTMLElement | null
){
    setColorDefault(login)
    setColorDefault(board)
    setColorDefault(chat)
    setColorDefault(game)
    setColorSelected(clicked)
}

/**기본색으로 변환 */
function setColorDefault(
    elem: HTMLElement | null
){
    if(elem == null) return;
    elem.style.color = "black"
}

function setColorSelected(
    elem: HTMLElement | null
) {
    if(elem == null) return;
    elem.style.color = "white"
}