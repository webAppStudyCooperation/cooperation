import { response } from "express";
import { after } from "node:test";
import { json } from "stream/consumers";
import { baseURL } from "../config.js";
import { cookieManager } from "../cookie.js";
import { User } from "../models/back/user.js";
import { InputForm } from "./InputForm.js";

/** 로그인 폼 -> 로그인 페이지 때 보여줄 폼  */
export class LoginForm {
  private inputForm = new InputForm();
  private inputNBtnDiv: HTMLDivElement = document.createElement("div");
  private inputId: HTMLInputElement = document.createElement("input");
  private inputPassword: HTMLInputElement = document.createElement("input");

  constructor(
    onClickSiginUp: (e: Event) => void,
    onClickReSiginUp: (e: Event) => void,
    onSuccessLogin: (user: User) => void,
    parentElement: HTMLElement
  ) {
    this.inputForm.appendFormTo(this.inputNBtnDiv);
    this.inputId = this.inputForm.addInputForm("ID를 입력해주세요.", true);
    this.inputPassword = this.inputForm.addInputForm(
      "PW를 입력해주세요.",
      false
    );
    this.inputForm.addButton("로그인", (e) => {
      this.onClickLogin(onSuccessLogin);
    });
    this.inputForm.addButton("회원가입", (e) => {
      onClickSiginUp(e);
    });
    this.inputForm.addButton("회원탈퇴", (e) => {
      onClickReSiginUp(e);
    });
    this.inputForm.appendFormTo(parentElement);
  }

  removeSelf(parent: HTMLElement) {
    this.inputForm.removeFormFrom(parent);
  }

  private onClickLogin(onSuccessLogin: (user: User) => void) {
    let userId = this.inputId.value;
    let userPassword = this.inputPassword.value;

    this.post(userId, userPassword).then((response) => {
      if (response.status === 200) {
        response.json().then((json) => {
          console.log(json);
          const obj = JSON.parse(json);
          const user = new User(
            obj.userId,
            obj.name,
            obj.nickName,
            obj.familyId
          );
          cookieManager.setUser(user);
          onSuccessLogin(user);
          this.inputForm.refreshAllInputs();
        });
      } else if (response.status === 400) {
        response.json().then((json) => {
          alert(json);
        });
      }
    });
  }

  private post(userId: string, userPassword: string) {
    return fetch(baseURL + "user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: userId, userPassword: userPassword }),
    }).then((response) => {
      return response;
    });
  }
}
