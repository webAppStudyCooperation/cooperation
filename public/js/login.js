import { LoginForm } from "./loginManage/loginForm.js";
import { SignUpForm } from "./loginManage/signUpForm.js";
import { ReSignForm } from "./loginManage/reSignFrom.js";
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
 *
 * draw~():
 */
class LoginPageManager {
    constructor() {
        this.content = document.getElementById("mainContent");
        this.loginForm = new LoginForm();
        this.signUpForm = new SignUpForm();
        this.reSignForm = new ReSignForm();
        this.btnsEventListener();
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
        this.loginBtnEventListener();
        this.signBtnEventListener();
        this.reSignBtnEventListener();
    }
    loginBtnEventListener() {
        this.loginForm
            .returnReSignBtn()
            .addEventListener("click", (e) => this.drawReSignPage(e));
        this.loginForm
            .returnSignUpBtn()
            .addEventListener("click", (e) => this.drawSignUpPage(e));
    }
    signBtnEventListener() {
        this.signUpForm.returnSignUpBtn().addEventListener("click", (e) => {
            // await
            // console.log(this.signUpForm.checkClear());
            // this.eraseForm(e);
        });
        // signUp, resign 클래스 내의backBtn e.preventDefault() 처리 안 되어있음
        // backBtn 기능 manager에서 관리
        // 기존 Form 지우고 새로운 그림 그리기 역할 수행
        this.signUpForm.returnBackBtn().addEventListener("click", (e) => {
            this.backToLoginForm(e);
        });
    }
    reSignBtnEventListener() {
        this.reSignForm.returnReSignBtn().addEventListener("click", (e) => {
            // this.eraseForm(e);
        });
        this.reSignForm.returnBackBtn().addEventListener("click", (e) => {
            this.backToLoginForm(e);
        });
    }
    backToLoginForm(e) {
        this.eraseForm(e);
        this.drawLoginPage();
    }
    appendToMainContent(thisForm) {
        var _a;
        console.log(thisForm);
        (_a = this.content) === null || _a === void 0 ? void 0 : _a.appendChild(thisForm);
    }
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
