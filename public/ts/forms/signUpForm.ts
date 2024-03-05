import { baseURL } from "../config.js";
import { User } from "../models/back/user";
import { makeJoinUserJsonStr } from "../models/back/user.js";
import { InputForm } from "./InputForm.js";

/**회원가입
 * familyID 만들러가기 보류
 */
export class SignUpForm {
  private inputForm = new InputForm();

  private inputName: HTMLInputElement;
  private inputNickName: HTMLInputElement;
  private inputId: HTMLInputElement;
  private inputPassword: HTMLInputElement;

  /** */
  constructor(
    onClickBack: (e: Event) => void,
    onSuccessSignUp: () => void,
    parentElement: HTMLElement
  ) {
    this.inputName = this.inputForm.addInputForm("이름을 입력해주세요.", true);
    this.inputNickName = this.inputForm.addInputForm(
      "닉네임을 입력해주세요.",
      true
    );
    this.inputId = this.inputForm.addInputForm("ID를 입력해주세요.", true);
    this.inputPassword = this.inputForm.addInputForm(
      "PW를 입력해주세요.",
      false
    );

    this.inputForm.addButton("뒤로가기", (e) => {
      onClickBack(e);
      // 인풋초기화
      //
    });
    this.inputForm.addButton("회원가입", (e) => {
      this.onClickSignUp(e, onSuccessSignUp);
    });

    this.inputForm.appendFormTo(parentElement);
  }

  removeSelf(parent: HTMLElement) {
    this.inputForm.removeFormFrom(parent);
  }

  private async onClickSignUp(e: Event, onSuccessSignUp: () => void) {
    const promise = this.post(
      this.inputId.value,
      this.inputPassword.value,
      this.inputName.value,
      this.inputNickName.value
    );

    if (promise === null) {
      alert("유효하지 않은 형식 ㅠㅠ");
    } else {
      const res = await promise;
      const json = await res.json();

      if (res.status === 200) {
        onSuccessSignUp();
      } else if (res.status === 400) {
        alert(json);
      }
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
}
