import { connect } from "http2";
import { json } from "stream/consumers";
import { LoginForm } from "./forms/loginForm.js";
import { SignUpForm } from "./forms/signUpForm.js";
import { ReSignForm } from "./forms/reSignFrom.js";
import e from "express";
import { feedManager } from "./board.js";
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
  const div: HTMLDivElement = document.createElement("div");
  const h1: HTMLDivElement = document.createElement("h1");
  const selectBar: HTMLDivElement = document.createElement("div");

  const boardBtn: HTMLButtonElement = document.createElement("button");
  const chatBtn: HTMLButtonElement = document.createElement("button");
  const gameBtn: HTMLButtonElement = document.createElement("button");

  boardBtn.addEventListener("click", () => {
    feedManager.setFeedAtContent();
  });

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

  onLogOuted() {
    this.loginForm.makeLogOutToLogin();
  }

  onLogIned() {
    this.loginForm.makeLoginToLogout();
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
    this.loginFormBtnEventListener();
    this.signFormBtnEventListener();
    this.reSignFormBtnEventListener();
  }

  /**로그인 화면에 있는 회원가입, 회원탈퇴 버튼 리스너 */
  private loginFormBtnEventListener() {
    this.loginForm
      .returnReSignBtn()
      .addEventListener("click", (e) => this.drawReSignPage(e));

    this.loginForm
      .returnSignUpBtn()
      .addEventListener("click", (e) => this.drawSignUpPage(e));
  }

  private signFormBtnEventListener() {
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

  private reSignFormBtnEventListener() {
    this.reSignForm.returnReSignBtn().addEventListener("click", (e) => {
      // this.eraseForm(e);
    });

    this.reSignForm.returnBackBtn().addEventListener("click", (e) => {
      this.backToLoginForm(e);
    });
  }

  private backToLoginForm(e: Event) {
    // this.eraseForm(e);
    // input 초기화 막음
    this.clear();
    this.drawLoginPage();
  }

  private appendToMainContent(thisForm: HTMLElement | HTMLFormElement) {
    this.content?.appendChild(thisForm);
  }

  /**content에 붙여진 div들 지우기 */
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
