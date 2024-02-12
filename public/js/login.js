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
 */
class LoginPageManager {
    constructor() {
        this.content = document.getElementById("mainContent");
        this.loginForm = new LoginForm();
        this.signUpForm = new SignUpForm();
        this.reSignForm = new ReSignForm();
        this.btnsEventListener();
    }
    showLoginPage() {
        this.appendToMainContent(this.loginForm.form());
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
            .addEventListener("click", (e) => this.showReSignPage(e));
        this.loginForm
            .returnSignUpBtn()
            .addEventListener("click", (e) => this.showSignUpPage(e));
    }
    showSignUpPage(e) {
        this.eraseForm(e);
        this.appendToMainContent(this.signUpForm.form());
    }
    signBtnEventListener() {
        this.signUpForm.returnSignUpBtn().addEventListener("click", (e) => {
            this.eraseForm(e);
        });
    }
    showReSignPage(e) {
        this.eraseForm(e);
        this.appendToMainContent(this.reSignForm.form());
    }
    reSignBtnEventListener() {
        this.reSignForm.returnReSignBtn().addEventListener("click", (e) => {
            this.eraseForm(e);
        });
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
