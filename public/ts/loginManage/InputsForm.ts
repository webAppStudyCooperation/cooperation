/** 입력창  */

export class InputsForm {
  private inputsDiv = document.createElement("div");
  private idInput = document.createElement("input");
  private pwInput = document.createElement("input");

  constructor() {
    this.inputsDiv.appendChild(this.idInput);
    this.inputsDiv.appendChild(this.pwInput);

    this.idInput.type = "text";
    this.pwInput.type = "password";
    this.idInput.placeholder = "ID를 입력해주세요.";
    this.pwInput.placeholder = "PW를 입력해주세요.";
  }

  returnInputsDiv() {
    return this.inputsDiv;
  }

  returnUserId() {
    return this.idInput.value;
  }

  returnUserPassword() {
    return this.pwInput.value;
  }
}
