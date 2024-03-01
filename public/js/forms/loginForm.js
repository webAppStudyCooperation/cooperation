import { baseURL } from "../config.js";
import { InputsForm } from "./InputsForm.js";
import { setCookie } from "../cookie.js";
/** 로그인 폼 -> 로그인 페이지 때 보여줄 폼  */
export class LoginForm extends InputsForm {
    constructor() {
        super();
        this.loginFormUI = document.createElement("form");
        this.loginBtn = document.createElement("button");
        this.inputNBtnDiv = document.createElement("div");
        this.signBtns = document.createElement("div");
        this.signUpBtn = document.createElement("button");
        this.reSignBtn = document.createElement("button");
        this.inputNBtnDiv.appendChild(this.returnInputsDiv());
        this.inputNBtnDiv.appendChild(this.loginBtn);
        this.signBtns.appendChild(this.signUpBtn);
        this.signBtns.appendChild(this.reSignBtn);
        this.loginFormUI.appendChild(this.inputNBtnDiv);
        this.loginFormUI.appendChild(this.signBtns);
        this.loginBtn.innerText = "로그인";
        this.signUpBtn.innerText = "회원가입";
        this.reSignBtn.innerText = "회원탈퇴";
        this.loginBtn.addEventListener("click", (e) => {
            e.preventDefault();
            this.eventListener();
        });
    }
    //  this  해당 클래스 객체 를 참조
    // 자신이 정의된 컨텍스트의 this
    eventListener() {
        let userId = this.returnUserId();
        let userPassword = this.returnUserPassword();
        this.post(userId, userPassword).then((response) => {
            if (response.status === 200) {
                response.json().then((json) => {
                    console.log(json);
                    let obj = JSON.parse(json);
                    console.log(typeof obj);
                    console.log(obj);
                    this.clearInputValues();
                    // 쿠키 생성
                    setCookie("userId", userId, { secure: true });
                    this.afterLogin();
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
    form() {
        this.clearInputValues();
        return this.loginFormUI;
    }
    returnSignUpBtn() {
        return this.signUpBtn;
    }
    returnReSignBtn() {
        return this.reSignBtn;
    }
    /** input 내용 초기화  */
    clearInputValues() {
        this.loginFormUI.reset();
    }
    /** 로그인 이후
     * 로그인 navBar에서 제거
     * 로그인 form 제거
     */
    afterLogin() {
        const content = document.getElementById("mainContent");
        // const menuBar = document.getElementsByClassName("menuBar");
        const login = document.getElementById("sign");
        const menuBar = login === null || login === void 0 ? void 0 : login.parentElement;
        const logout = document.createElement("p");
        logout.innerText = "로그아웃";
        if (document.cookie) {
            if (login != null && (login === null || login === void 0 ? void 0 : login.style.display) !== "none") {
                login.style.display = "none";
            }
            if (content === null || content === void 0 ? void 0 : content.childElementCount) {
                content === null || content === void 0 ? void 0 : content.replaceChildren();
            }
            menuBar === null || menuBar === void 0 ? void 0 : menuBar.appendChild(logout);
        }
    }
}
