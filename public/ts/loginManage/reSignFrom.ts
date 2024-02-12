/** 회원 탈퇴  */

import e from "express";
import { json } from "stream/consumers";
import { baseURL } from "../config.js";
import { makeReSignUserJsonStr } from "../models/back/user.js";
import { InputsForm } from "./InputsForm";

function inputsForm() {
  const inputsDiv: HTMLDivElement = document.createElement("div");
  const idInput: HTMLInputElement = document.createElement("input");
  const pwInput: HTMLInputElement = document.createElement("input");

  inputsDiv.id = "inputsId";

  inputsDiv.appendChild(idInput);
  inputsDiv.appendChild(pwInput);

  idInput.placeholder = "아이디를 입력해주세요";
  pwInput.placeholder = "비밀번호를 입력해주세요";

  return inputsDiv;
}

export class ReSignForm {
  private reSignBtn: HTMLButtonElement = document.createElement("button");
  private reSignForm: HTMLFormElement = document.createElement("form");
  private inputsDiv: HTMLDivElement;

  private userIdInput: HTMLInputElement;
  private userPasswordInput: HTMLInputElement;

  constructor() {
    this.inputsDiv = inputsForm();
    this.reSignForm.append(this.inputsDiv);
    this.reSignForm.appendChild(this.reSignBtn);

    this.userIdInput = this.inputsDiv.children[0] as HTMLInputElement;
    this.userPasswordInput = this.inputsDiv.children[1] as HTMLInputElement;

    this.reSignBtn.innerText = "회원탈퇴";

    this.reSignBtn.addEventListener("click", (e) => {
      this.eventListener(e);
    });
  }

  private eventListener(e: Event) {
    e.preventDefault();

    // Value값 읽기 위해 타입캐스팅

    const promise = this.delete(
      this.userIdInput.value,
      this.userPasswordInput.value
    );

    promise === null
      ? alert("유효하지 않은 형식 ㅠㅠ")
      : promise?.then((res) => {
          res.json().then((json) => {
            if (res.status === 200) {
              alert("회원 탈퇴가 성공적으로 이뤄졌습니다.");
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

  form() {
    return this.reSignForm;
  }

  returnReSignBtn() {
    return this.reSignBtn;
  }
}
