import { LoginForm } from "./forms/loginForm.js";
import { ReSignForm } from "./forms/reSignFrom.js";
import { SignUpForm } from "./forms/signUpForm.js";
export class LoginPageManager {
    constructor(user, userLogout, userLogIn) {
        this.content = document.getElementById("mainContent");
        this.userLogout = userLogout;
        this.userLogIn = userLogIn;
        this.user = user;
    }
    showLogInPage() {
        this.appendLoginForm();
    }
    setUser(user) {
        this.user = user;
    }
    appendLoginForm() {
        if (this.content != null) {
            const content = this.content;
            const logInForm = new LoginForm(() => {
                logInForm.removeSelf(content);
                this.appendSignUpForm();
            }, () => {
                logInForm.removeSelf(content);
                this.appendReSignForm();
            }, this.userLogIn, content);
        }
    }
    appendReSignForm() {
        if (this.content != null) {
            const content = this.content;
            const resignForm = new ReSignForm(() => {
                // back버튼
                resignForm.removeSelf(content);
                this.appendLoginForm();
            }, () => {
                // 탈퇴성공
                this.userLogout();
                resignForm.removeSelf(content);
                this.appendLoginForm();
            }, content);
        }
    }
    appendSignUpForm() {
        if (this.content != null) {
            const content = this.content;
            const signUpForm = new SignUpForm(() => {
                //back버튼 클릭
                // this.content?.removeChild(signUpForm);
                signUpForm.removeSelf(content);
                this.appendLoginForm();
            }, () => {
                //가입 성공시
                signUpForm.removeSelf(content);
                this.appendLoginForm();
            }, content);
        }
    }
}
