import { LoginForm } from "./forms/loginForm.js";
import { ReSignForm } from "./forms/reSignFrom.js";
import { SignUpForm } from "./forms/signUpForm.js";
import { User } from "./models/back/user.js";

export class LoginPageManager {
  private content = document.getElementById("mainContent");
  private user: User;
  private userLogout: () => void;
  private userLogIn: (user: User) => void;

  constructor(
    user: User,
    userLogout: () => void,
    userLogIn: (user: User) => void
  ) {
    this.userLogout = userLogout;
    this.userLogIn = userLogIn;
    this.user = user;
  }

  showLogInPage() {
    this.appendLoginForm();
  }

  setUser(user: User) {
    this.user = user;
  }

  private appendLoginForm() {
    if (this.content != null) {
      const content = this.content;
      const logInForm = new LoginForm(
        () => {
          logInForm.removeSelf(content);
          this.appendSignUpForm();
        },
        () => {
          logInForm.removeSelf(content);
          this.appendReSignForm();
        },
        this.userLogIn,
        content
      );
    }
  }

  private appendReSignForm() {
    if (this.content != null) {
      const content = this.content;
      const resignForm = new ReSignForm(
        () => {
          // back버튼
          resignForm.removeSelf(content);
          this.appendLoginForm();
        },
        () => {
          // 탈퇴성공
          this.userLogout();
          resignForm.removeSelf(content);
          this.appendLoginForm();
        },
        content
      );
    }
  }

  private appendSignUpForm() {
    if (this.content != null) {
      const content = this.content;
      const signUpForm = new SignUpForm(
        () => {
          //back버튼 클릭
          // this.content?.removeChild(signUpForm);
          signUpForm.removeSelf(content);
          this.appendLoginForm();
        },
        () => {
          //가입 성공시
          signUpForm.removeSelf(content);
          this.appendLoginForm();
        },
        content
      );
    }
  }
}
