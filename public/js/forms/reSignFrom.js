/** 회원 탈퇴  */
import { baseURL } from "../config.js";
import { makeReSignUserJsonStr } from "../models/back/user.js";
function inputsForm() {
    const inputsDiv = document.createElement("div");
    const idInput = document.createElement("input");
    const pwInput = document.createElement("input");
    inputsDiv.id = "inputsId";
    inputsDiv.appendChild(idInput);
    inputsDiv.appendChild(pwInput);
    idInput.placeholder = "아이디를 입력해주세요";
    pwInput.placeholder = "비밀번호를 입력해주세요";
    return inputsDiv;
}
// 임시화면
function goodByeDiv() {
    const div = document.createElement("div");
    const h1 = document.createElement("h1");
    h1.innerText = "Goodbye!";
    div.appendChild(h1);
    return div;
}
export class ReSignForm {
    constructor() {
        this.reSignBtn = document.createElement("button");
        this.reSignForm = document.createElement("form");
        this.backBtn = document.createElement("input");
        // 탈퇴 후 임시화면
        this.goodByeDiv = document.createElement("div");
        this.inputsDiv = inputsForm();
        this.reSignForm.append(this.inputsDiv);
        this.reSignForm.appendChild(this.backBtn);
        this.reSignForm.appendChild(this.reSignBtn);
        // 탈퇴 후 임시화면
        this.goodByeDiv = goodByeDiv();
        this.userIdInput = this.inputsDiv.children[0];
        this.userPasswordInput = this.inputsDiv.children[1];
        // Value값 읽기 위해 타입캐스팅
        this.reSignBtn.innerText = "회원탈퇴";
        this.backBtn.value = "뒤로가기";
        this.backBtn.type = "reset";
        this.reSignBtn.addEventListener("click", (e) => {
            this.eventListener(e);
        });
        // this.backBtn.addEventListener("click", (e) => {
        //   e.preventDefault();
        // });
    }
    eventListener(e) {
        e.preventDefault();
        const promise = this.delete(this.userIdInput.value, this.userPasswordInput.value);
        promise === null
            ? alert("유효하지 않은 형식 ㅠㅠ")
            : promise === null || promise === void 0 ? void 0 : promise.then((res) => {
                res.json().then((json) => {
                    if (res.status === 200) {
                        alert("회원 탈퇴가 성공적으로 이뤄졌습니다.");
                        this.drawGoodbyeScreen();
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
    drawGoodbyeScreen() {
        this.reSignForm.replaceChildren();
        this.reSignForm.appendChild(this.goodByeDiv);
    }
    form() {
        return this.reSignForm;
    }
    returnReSignBtn() {
        return this.reSignBtn;
    }
    returnBackBtn() {
        return this.backBtn;
    }
}
