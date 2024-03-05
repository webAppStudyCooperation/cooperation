import { LoginForm } from "./forms/loginForm.js";
import { SignUpForm } from "./forms/signUpForm.js";
import { ReSignForm } from "./forms/reSignFrom.js";
import { baseURL } from "./config.js";
/**
 * 로그인  - login
 * 로그아웃 - logout
 * 회원탈퇴 - reSign
 * 회원등록 - signUp
 */
/** 로그인 , 회원 탈퇴, 회원 가입 UI
 * form 이동 관리
 * 각각의 loginForm, signUpForm, reSignForm에 있음
 * UI 관리
 *
 * 화면 그리기, 지우기 담당
 * 각 클래스에서 서로의 기능이 필요할 때 상호작용하게 해줌
 *
 * draw~():
 */
// 가입 후 임시화면
function welcomeDiv() {
    const div = document.createElement("div");
    const h1 = document.createElement("h1");
    const selectBar = document.createElement("div");
    const boardBtn = document.createElement("button");
    const chatBtn = document.createElement("button");
    const gameBtn = document.createElement("button");
    // boardBtn.addEventListener("click", () => {
    //   feedManager.setFeedAtContent();
    // });
    chatBtn.addEventListener("click", () => {
        window.location.href = baseURL + `socketTest`;
    });
    gameBtn.addEventListener("click", () => {
        window.location.href = "https://famous-squirrel-43f0b7.netlify.app/";
    });
    boardBtn.innerText = "게시판";
    chatBtn.innerText = "채팅";
    gameBtn.innerText = "게임";
    selectBar.appendChild(boardBtn);
    selectBar.appendChild(chatBtn);
    selectBar.appendChild(gameBtn);
    h1.innerText = "welcome!";
    div.appendChild(h1);
    div.appendChild(selectBar);
    return div;
}
class LoginPageManager {
    constructor() {
        this.content = document.getElementById("mainContent");
        this.loginForm = new LoginForm();
        this.signUpForm = new SignUpForm();
        this.reSignForm = new ReSignForm();
        this.btnsEventListener();
    }
    onLogOuted() {
        this.loginForm.makeLogOutToLogin();
    }
    onLogIned() {
        this.loginForm.makeLoginToLogout();
    }
    drawLoginPage() {
        this.appendToMainContent(this.loginForm.form());
    }
    drawSignUpPage(e) {
        this.eraseForm(e);
        this.appendToMainContent(this.signUpForm.form());
    }
    drawReSignPage(e) {
        this.eraseForm(e);
        this.appendToMainContent(this.reSignForm.form());
    }
    /**
     * 모든 Form의 btn listener,
     * Form UI 전환을 위해
     */
    btnsEventListener() {
        this.loginFormBtnEventListener();
        this.signFormBtnEventListener();
        this.reSignFormBtnEventListener();
    }
    /**로그인 화면에 있는 회원가입, 회원탈퇴 버튼 리스너 */
    loginFormBtnEventListener() {
        this.loginForm
            .returnReSignBtn()
            .addEventListener("click", (e) => this.drawReSignPage(e));
        this.loginForm
            .returnSignUpBtn()
            .addEventListener("click", (e) => this.drawSignUpPage(e));
    }
    signFormBtnEventListener() {
        // 회원가입버튼 누르고 나서 화면 그리기
        this.signUpForm.returnSignUpBtn().addEventListener("click", (e) => {
            // 임시 welcome 화면
            this.clear();
            this.appendToMainContent(welcomeDiv());
        });
        // signUp, resign 클래스 내의backBtn e.preventDefault() 처리 안 되어있음
        // backBtn 기능 manager에서 관리
        // 기존 Form 지우고 새로운 그림 그리기 역할 수행
        this.signUpForm.returnBackBtn().addEventListener("click", (e) => {
            this.backToLoginForm(e);
        });
    }
    reSignFormBtnEventListener() {
        this.reSignForm.returnReSignBtn().addEventListener("click", (e) => {
            // this.eraseForm(e);
        });
        this.reSignForm.returnBackBtn().addEventListener("click", (e) => {
            this.backToLoginForm(e);
        });
    }
    backToLoginForm(e) {
        // this.eraseForm(e);
        // input 초기화 막음
        this.clear();
        this.drawLoginPage();
    }
    appendToMainContent(thisForm) {
        var _a;
        (_a = this.content) === null || _a === void 0 ? void 0 : _a.appendChild(thisForm);
    }
    /**content에 붙여진 div들 지우기 */
    eraseForm(e) {
        e.preventDefault();
        this.clear();
    }
    clear() {
        var _a;
        (_a = this.content) === null || _a === void 0 ? void 0 : _a.replaceChildren();
        // this.content?.removeChild();
    }
}
export const loginPageManager = new LoginPageManager();
