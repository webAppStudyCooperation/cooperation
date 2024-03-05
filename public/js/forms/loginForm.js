import { baseURL } from "../config.js";
import { cookieManager } from "../cookie.js";
import { User } from "../models/back/user.js";
import { InputForm } from "./InputForm.js";
/** 로그인 폼 -> 로그인 페이지 때 보여줄 폼  */
export class LoginForm {
    constructor(onClickSiginUp, onClickReSiginUp, onSuccessLogin, parentElement) {
        this.inputForm = new InputForm();
        this.inputNBtnDiv = document.createElement("div");
        this.inputId = document.createElement("input");
        this.inputPassword = document.createElement("input");
        this.inputForm.appendFormTo(this.inputNBtnDiv);
        this.inputId = this.inputForm.addInputForm("ID를 입력해주세요.", true);
        this.inputPassword = this.inputForm.addInputForm("PW를 입력해주세요.", false);
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
    removeSelf(parent) {
        this.inputForm.removeFormFrom(parent);
    }
    onClickLogin(onSuccessLogin) {
        let userId = this.inputId.value;
        let userPassword = this.inputPassword.value;
        this.post(userId, userPassword).then((response) => {
            if (response.status === 200) {
                response.json().then((json) => {
                    console.log(json);
                    const obj = JSON.parse(json);
                    const user = new User(obj.userId, obj.name, obj.nickName, obj.familyId);
                    cookieManager.setUser(user);
                    onSuccessLogin(user);
                    this.inputForm.refreshAllInputs();
                });
            }
            else if (response.status === 400) {
                response.json().then((json) => {
                    alert(json);
                });
            }
        });
    }
    post(userId, userPassword) {
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
