var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { baseURL } from "../config.js";
import { InputsForm } from "./InputsForm.js";
import { makeJoinUserJsonStr } from "../models/back/user.js";
/**회원가입
 * familyID 만들러가기 보류
 */
export class SignUpForm extends InputsForm {
    /** */
    constructor() {
        super();
        this.signUpFormUI = document.createElement("form");
        this.name = document.createElement("input");
        this.nickname = document.createElement("input");
        this.signUpBtn = document.createElement("button");
        this.backBtn = document.createElement("input");
        this.readyToClear = false;
        // super.div.appendChild(this.familyIdInput);
        // 접근 불가
        this.signUpFormUI.appendChild(this.backBtn);
        this.signUpFormUI.appendChild(this.name);
        this.signUpFormUI.appendChild(this.nickname);
        this.signUpFormUI.appendChild(this.returnInputsDiv());
        this.signUpFormUI.appendChild(this.signUpBtn);
        this.name.placeholder = "이름을 입력해주세요.";
        this.nickname.placeholder = "닉네임을 입력해주세요.";
        this.signUpBtn.innerText = "회원가입";
        this.backBtn.value = "뒤로가기";
        // 눌렀을시 form의 input 초기화
        this.backBtn.type = "reset";
        this.signUpBtn.addEventListener("click", (e) => {
            this.eventListener(e);
        });
        // this.backBtn.addEventListener("click", (e) => {
        //   e.preventDefault();
        // });
    }
    eventListener(e) {
        return __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            const promise = this.post(this.returnUserId(), this.returnUserPassword(), this.name.value, this.nickname.value);
            if (promise === null) {
                alert("유효하지 않은 형식 ㅠㅠ");
            }
            else {
                const res = yield promise;
                const json = yield res.json();
                if (res.status === 200) {
                    alert(json);
                    this.readyToClear = true;
                }
                else if (res.status === 400) {
                    alert(json);
                }
            }
            // this.readyToClear = await this.checkPromiseToSignup(promise);
            // console.log(await this.checkPromiseToSignup(promise));
            // console.log(this.readyToClear);
            //UI
            if (this.readyToClear) {
                // this.drawWelcomeScreen();
                // setTimeout(() => {
                //   this.signUpFormUI.replaceChildren();
                //   //  3초 후 게시물로 이동
                // }, 3000);
                alert("회원가입 축하드립니다!");
            }
        });
    }
    // //  promise 반환
    // private async checkPromiseToSignup(
    //   promise: Promise<Response> | null
    // ): Promise<boolean> {
    //   if (promise === null) {
    //     alert("유효하지 않은 형식 ㅠㅠ");
    //   } else {
    //     promise.then((res) => {
    //       res.json().then((json) => {
    //         if (res.status === 200) {
    //           alert(json);
    //           // this.readyToClear = true;
    //           console.log("true 반환");
    //           return true;
    //         } else if (res.status === 400) {
    //           alert(res.status);
    //           alert(json);
    //         }
    //       });
    //     });
    //   }
    //   console.log("가입 성공시에는 뜨지말아야함 ");
    //   // then()이 완료되기전에 실행
    // }
    checkClear() {
        return this.readyToClear;
    }
    /** 처음회원가입시 familyId는 0 */
    post(userId, userPassword, name, nickname) {
        let valid = this.checkInput(userId, userPassword, name, nickname);
        if (!valid)
            return null;
        // let data = makeJoinUserJsonStr(userId, userPassword, name, nickname);
        return fetch(baseURL + "user/join", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: makeJoinUserJsonStr(userId, userPassword, name, nickname),
        });
    }
    checkInput(userId, userPassword, name, nickname) {
        // 공통 체크
        const list = [userId, userPassword, name, nickname];
        list.some((str) => {
            if (str == null || str == "" || str.length < 3) {
                console.log(str);
            }
        });
        // 하나라도 만족한다면 false 반환
        if (list.some((str) => str == null || str == "" || str.length < 3)) {
            return false;
        }
        // password 추가 체크
        if (userPassword.includes("@")) {
            return false;
        }
        return true;
    }
    /**
     * welcome 화면
     * 1.signup form에 welcome 붙이고, 3초 후 signup settong재세팅
     * 2. welcomDiv와 signUpForm 분리
     * -> 그럼 loginManage에서 관리해야함
     * ->signUp 역할 분리가 안된다 생각했는데
     * -> 분리하는게 더 역할에 맞는것 같음
     * welcome 화면 렌더링 -> LoginPageManager 클래스에서 관리하겠음
     *
     */
    // private drawWelcomeScreen() {
    //   this.signUpFormUI.replaceChildren();
    //   this.signUpFormUI.appendChild(this.welcomeDiv);
    // }
    form() {
        this.clearInputValues();
        return this.signUpFormUI;
    }
    returnSignUpBtn() {
        return this.signUpBtn;
    }
    returnBackBtn() {
        return this.backBtn;
    }
    clearInputValues() {
        this.signUpFormUI.reset();
    }
}
