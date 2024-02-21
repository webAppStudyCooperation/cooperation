import { connect } from "http2";
import { json } from "stream/consumers";
import { LoginForm } from "./loginManage/loginForm.js";
import { SignUpForm } from "./loginManage/signUpForm.js";
import { ReSignForm } from "./loginManage/reSignFrom.js";
import e from "express";

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

  drawLoginPage() {
    this.appendToMainContent(this.loginForm.form());
  }

  private drawSignUpPage(e: Event) {
    this.eraseForm(e);
    this.appendToMainContent(this.signUpForm.form());
  }

  private drawReSignPage(e: Event) {
    this.eraseForm(e);
    this.appendToMainContent(this.reSignForm.form());
  }

  /**
   * 모든 Form의 btn listener,
   * Form UI 전환을 위해
   */
  private btnsEventListener() {
    this.loginBtnEventListener();
    this.signBtnEventListener();
    this.reSignBtnEventListener();
  }

  private loginBtnEventListener() {
    this.loginForm
      .returnReSignBtn()
      .addEventListener("click", (e) => this.drawReSignPage(e));

    this.loginForm
      .returnSignUpBtn()
      .addEventListener("click", (e) => this.drawSignUpPage(e));
  }

  private signBtnEventListener() {
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

  private reSignBtnEventListener() {
    this.reSignForm.returnReSignBtn().addEventListener("click", (e) => {
      // this.eraseForm(e);
    });

    this.reSignForm.returnBackBtn().addEventListener("click", (e) => {
      this.backToLoginForm(e);
    });
  }

  private backToLoginForm(e: Event) {
    this.eraseForm(e);
    this.drawLoginPage();
  }

  private appendToMainContent(thisForm: HTMLElement | HTMLFormElement) {
    console.log(thisForm);
    this.content?.appendChild(thisForm);
  }

  private eraseForm(e: Event) {
    e.preventDefault();

    this.clear();
  }

  private clear() {
    this.content?.replaceChildren();
    // this.content?.removeChild();
  }
}
export const loginPageManager = new LoginPageManager();
