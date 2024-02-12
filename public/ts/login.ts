import { connect } from "http2";
import { json } from "stream/consumers";
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
  private loginForm: LoginForm;
  private signUpForm: SignUpForm;
  private reSignForm: ReSignForm;
  private content = document.getElementById("mainContent");

  constructor() {
    this.loginForm = new LoginForm();
    this.signUpForm = new SignUpForm();
    this.reSignForm = new ReSignForm();

    this.btnsEventListener();
  }

  showLoginPage() {
    this.appendToMainContent(this.loginForm.returnloginFormUI());
  }

  /**
   * 모든 Form의 btn listener,
   * Form UI 전환을 위해
   */
  private btnsEventListener() {
    this.loginBtnEventListener();
  }

  private loginBtnEventListener() {
    this.loginForm
      .returnReSignBtn()
      .addEventListener("click", (e) => this.showReSingPage(e));

    this.loginForm
      .returnSignUpBtn()
      .addEventListener("click", (e) => this.showSignUpPage(e));
  }

  private showSignUpPage(e: Event) {
    e.preventDefault();
    this.clear();
    this.appendToMainContent(this.signUpForm.returnSignUpFormUI());
  }

  private showReSingPage(e: Event) {
    this.clear();
  }

  private appendToMainContent(thisForm: HTMLElement | HTMLFormElement) {
    console.log(thisForm);
    this.content?.appendChild(thisForm);
  }

  private clear() {
    this.content?.replaceChildren();
    // this.content?.removeChild();
  }
}
export const loginPageManager = new LoginPageManager();
