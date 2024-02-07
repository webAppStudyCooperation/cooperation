let sign = document.getElementById("sign");
const content = document.getElementById("mainContent");
/**
 * 로그인  - sign
 * 회원탈퇴 - reSign
 * 회원등록 - signUp
 */
class FormInPage {
    constructor(btnTxt) {
        this.div = document.createElement("div");
        this.idInput = document.createElement("input");
        this.pwInput = document.createElement("input");
        this.btn = document.createElement("button");
        this.div.appendChild(this.idInput);
        this.div.appendChild(this.pwInput);
        this.div.appendChild(this.btn);
        this.idInput.type = "text";
        this.pwInput.type = "password";
        this.idInput.placeholder = "ID를 입력해주세요.";
        this.pwInput.placeholder = "PW를 입력해주세요.";
        this.btn.innerText = btnTxt;
    }
    returnDivElem() {
        return this.div;
    }
}
class SignInForm extends FormInPage {
    constructor() {
        super("로그인");
        this.signUpBtn = document.createElement("button");
        this.reSignBtn = document.createElement("button");
        // this.div.appendChild(this.btn);
        this.div.appendChild(this.signUpBtn);
        // super.returnDivElem().appendChild(this.btn);
        this.signUpBtn.innerText = "회원가입";
        this.reSignBtn.innerText = "회원탈퇴";
        this.signUpBtn.addEventListener("click", this.moveToJoinPage);
    }
    moveToJoinPage() {
        content === null || content === void 0 ? void 0 : content.removeChild(this.returnDivElem());
    }
}
class SignUpForm extends FormInPage {
    constructor() {
        super("회원가입");
        this.familyIdInput = document.createElement("input");
        // super.div.appendChild(this.familyIdInput);
        // 접근 불가
        super.returnDivElem().appendChild(this.familyIdInput);
        this.familyIdInput.placeholder = "가족ID를 입력해주세요.";
    }
}
let signForm = new SignInForm();
let signUpForm = new SignUpForm();
sign === null || sign === void 0 ? void 0 : sign.addEventListener("click", (e) => {
    content === null || content === void 0 ? void 0 : content.appendChild(signForm.div);
    content === null || content === void 0 ? void 0 : content.appendChild(signUpForm.div);
});
export {};
