import { baseURL } from "../config.js";
import { InputsForm } from "./InputsForm.js";
import { User } from "../models/back/user";
import { makeJoinUserJsonStr } from "../models/back/user.js";

/**회원가입
 * familyID 만들러가기 보류
 */
export class SignUpForm extends InputsForm {
  private signUpFormUI = document.createElement("form");

  private name = document.createElement("input");
  private nickname = document.createElement("input");
  private signUpBtn = document.createElement("button");
  private backBtn: HTMLButtonElement = document.createElement("button");

  private readyToClear: boolean = false;

  /** */
  constructor() {
    super();
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
    this.backBtn.innerText = "뒤로가기";

    this.signUpBtn.addEventListener("click", async (e) => {
      await this.eventListener(e);
      console.log(this.readyToClear);
    });

    // this.backBtn.addEventListener("click", (e) => {
    //   e.preventDefault();
    // });
  }

  private eventListener(e: Event) {
    e.preventDefault();

    const promise = this.post(
      this.returnUserId(),
      this.returnUserPassword(),
      this.name.value,
      this.nickname.value
    );

    if (promise === null) {
      alert("유효하지 않은 형식 ㅠㅠ");
    } else {
      promise.then((res) => {
        res.json().then((json) => {
          if (res.status === 200) {
            alert(json);
            this.readyToClear = true;
          } else if (res.status === 400) {
            alert(json);
          }
        });
      });
    }
  }

  checkClear() {
    return this.readyToClear;
  }
  /** 처음회원가입시 familyId는 0 */
  private post(
    userId: string,
    userPassword: string,
    name: string,
    nickname: string
  ): Promise<Response> | null {
    let valid = this.checkInput(userId, userPassword, name, nickname);
    if (!valid) return null;

    // let data = makeJoinUserJsonStr(userId, userPassword, name, nickname);
    return fetch(baseURL + "user/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: makeJoinUserJsonStr(userId, userPassword, name, nickname),
    });
  }

  private checkInput(
    userId: string,
    userPassword: string,
    name: string,
    nickname: string
  ): boolean {
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

  form() {
    return this.signUpFormUI;
  }

  returnSignUpBtn() {
    return this.signUpBtn;
  }

  returnBackBtn() {
    return this.backBtn;
  }
}
