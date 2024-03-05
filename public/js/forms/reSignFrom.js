/** 회원 탈퇴  */
import { baseURL } from "../config.js";
import { makeReSignUserJsonStr } from "../models/back/user.js";
import { InputForm } from "./InputForm.js";
export class ReSignForm {
    constructor(onClickBack, onSuccecsReSign, parentElement) {
        this.inputForm = new InputForm();
        this.parentElement = parentElement;
        this.inputId = this.inputForm.addInputForm("아이디를 입력해주세요.", true);
        this.inputPassword = this.inputForm.addInputForm("PW를 입력해주세요.", false);
        this.inputForm.addButton("뒤로가기", (e) => {
            onClickBack();
        });
        this.inputForm.addButton("회원탈퇴", (e) => {
            this.onClickReSign(onSuccecsReSign);
        });
        this.inputForm.appendFormTo(parentElement);
    }
    removeSelf(parent) {
        this.inputForm.removeFormFrom(parent);
    }
    onClickReSign(onSuccessReSign) {
        const promise = this.delete(this.inputId.value, this.inputPassword.value);
        promise === null
            ? alert("유효하지 않은 형식 ㅠㅠ")
            : promise === null || promise === void 0 ? void 0 : promise.then((res) => {
                res.json().then((json) => {
                    if (res.status === 200) {
                        alert("회원 탈퇴가 성공적으로 이뤄졌습니다.");
                        onSuccessReSign();
                    }
                    else if (res.status === 400) {
                        alert(json);
                    }
                });
                // .catch(e){console.log};
            });
    }
    checkInput(userId, userPassword) {
        const list = [userId, userPassword];
        // 공통체크
        if (list.some((str) => str == null || str == "" || str.length < 3)) {
            return false;
        }
        return true;
    }
    delete(userId, userPassword) {
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
        const div = document.createElement("div");
        const h1 = document.createElement("h1");
        h1.innerText = "Goodbye!";
        this.parentElement.appendChild(h1);
    }
}
