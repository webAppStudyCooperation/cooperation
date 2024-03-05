/** 회원 탈퇴  */

import e from "express";
import { json } from "stream/consumers";
import { baseURL } from "../config.js";
import { cookieManager } from "../cookie.js";
import { makeReSignUserJsonStr } from "../models/back/user.js";
import { InputForm } from "./InputForm.js";

export class ReSignForm {
  private inputForm = new InputForm();
  private inputId: HTMLInputElement;
  private inputPassword: HTMLInputElement;
  private parentElement: HTMLElement;

  constructor(
    onClickBack: () => void,
    onSuccecsReSign: () => void,
    parentElement: HTMLElement
  ) {
    this.parentElement = parentElement;
    this.inputId = this.inputForm.addInputForm("아이디를 입력해주세요.", true);
    this.inputPassword = this.inputForm.addInputForm(
      "PW를 입력해주세요.",
      false
    );
    this.inputForm.addButton("뒤로가기", (e) => {
      onClickBack();
    });
    this.inputForm.addButton("회원탈퇴", (e) => {
      this.onClickReSign(onSuccecsReSign);
    });

    this.inputForm.appendFormTo(parentElement);
  }

  removeSelf(parent: HTMLElement) {
    this.inputForm.removeFormFrom(parent);
  }

  private onClickReSign(onSuccessReSign: () => void) {
    const promise = this.delete(this.inputId.value, this.inputPassword.value);

    promise === null
      ? alert("유효하지 않은 형식 ㅠㅠ")
      : promise?.then((res) => {
          res.json().then((json) => {
            if (res.status === 200) {
              alert("회원 탈퇴가 성공적으로 이뤄졌습니다.");
              onSuccessReSign();
            } else if (res.status === 400) {
              alert(json);
            }
          });
          // .catch(e){console.log};
        });
  }

  private checkInput(userId: string, userPassword: string): boolean {
    const list = [userId, userPassword];
    // 공통체크
    if (list.some((str) => str == null || str == "" || str.length < 3)) {
      return false;
    }
    return true;
  }

  private delete(
    userId: string,
    userPassword: string
  ): Promise<Response> | null {
    if (!this.checkInput(userId, userPassword)) {
      return null;
    }
    return fetch(baseURL + "user/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: makeReSignUserJsonStr(userId, userPassword),
    });
  }

  // 임시화면
  showGoodbye() {
    this.inputForm.removeFormFrom(this.parentElement);

    const div: HTMLDivElement = document.createElement("div");
    const h1: HTMLDivElement = document.createElement("h1");
    h1.innerText = "Goodbye!";
    this.parentElement.appendChild(h1);
  }
}
