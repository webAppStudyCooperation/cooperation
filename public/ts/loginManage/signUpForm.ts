import { baseURL } from "../config.js";
import { InputsForm } from "./InputsForm.js";
import { User } from "../models/back/user";
import { makeJoinUserJsonStr } from "../models/back/user.js";

/**회원가입
 * familyID 만들러가기 보류
 */
export class SignUpForm extends InputsForm {
  private signUpFromUI = document.createElement("form");

  private name = document.createElement("input");
  private nickname = document.createElement("input");
  private signUpBtn = document.createElement("button");
  private makeFamilyIdBtn = document.createElement("button");

  /** */
  constructor() {
    super();
    // super.div.appendChild(this.familyIdInput);
    // 접근 불가

    this.signUpFromUI.appendChild(this.name);
    this.signUpFromUI.appendChild(this.nickname);
    this.signUpFromUI.appendChild(this.returnInputsDiv());
    this.signUpFromUI.appendChild(this.signUpBtn);

    this.name.placeholder = "이름을 입력해주세요.";
    this.nickname.placeholder = "닉네임을 입력해주세요.";
    this.signUpBtn.innerText = "회원가입";

    this.signUpBtn.addEventListener("click", (e) => this.eventListener(e));
  }

  private eventListener(e: Event) {
    e.preventDefault();

    const promise = this.post(
      this.returnUserId(),
      this.returnUserPassword(),
      this.name.value,
      this.nickname.value
    );

    if (promise == null) {
      alert("유효하지 않은 형식 ㅠㅠ");
    } else {
      promise.then((res) => {
        res.json().then((json) => {
          if (res.status === 200) {
            alert(json);
          } else if (res.status === 400) {
            alert(json);
          }
        });
      });
    }
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
    let valild = true;
    // 공통 체크
    const list = [userId, userPassword, name, nickname];
    list.forEach((str) => {
      if (str == null || str == "" || str.length < 3) {
        valild = false;
      }
    });
    // password 추가 체크
    if (userPassword.includes("@")) {
      valild = false;
    }

    return valild;
  }

  returnSignUpFormUI() {
    return this.signUpFromUI;
  }
}
