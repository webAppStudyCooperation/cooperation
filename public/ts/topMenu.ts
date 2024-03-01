import { baseURL } from "./config.js";
import { BoardItem } from "./models/back/boards.js";
import { BoardComment } from "./models/back/comments.js";
import { User } from "./models/back/user.js";
import { DateString } from "./models/back/boards.js";
import { copyFileSync } from "fs";
import { feedManager } from "./board.js";
import { loginPageManager } from "./login.js";

const login: HTMLElement | null = document.getElementById("sign");
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
  clearMainContentArea();
  onClickMenu(login);
  loginPageManager.drawLoginPage();
});
board?.addEventListener("click", () => {
  clearMainContentArea();
  feedManager.setFeedAtContent();
  onClickMenu(board);
});
chat?.addEventListener("click", () => {
    clearMainContentArea()
    onClickMenu(chat)
    // 임시 테스트
    window.location.href = baseURL + `socketTest`;
});
game?.addEventListener("click", () => {
  clearMainContentArea();
  onClickMenu(game);
  window.location.href = "https://famous-squirrel-43f0b7.netlify.app/";
});

function onClickMenu(clicked: HTMLElement | null) {
  setColorDefault(login);
  setColorDefault(board);
  setColorDefault(chat);
  setColorDefault(game);
  setColorSelected(clicked);
}

/**기본색으로 변환 */
function setColorDefault(elem: HTMLElement | null) {
  if (elem == null) return;
  elem.className = "notSelectedEffect";
}

function setColorSelected(elem: HTMLElement | null) {
  if (elem == null) return;
  elem.className = "selectedEffect";
}

/***임시 */
function clearMainContentArea() {
  mainContentElem?.childNodes.forEach((child: Node) => {
    mainContentElem?.removeChild(child);
  });
}
