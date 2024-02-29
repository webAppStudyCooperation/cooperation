/** 입력창  */

function inputForm() {
  const inputsDiv = document.createElement("div");
  const idInput = document.createElement("input");
  const pwInput = document.createElement("input");

  idInput.type = "text";
  pwInput.type = "password";
  idInput.placeholder = "ID를 입력해주세요.";
  pwInput.placeholder = "PW를 입력해주세요.";

  inputsDiv.appendChild(idInput);
  inputsDiv.appendChild(pwInput);

  return inputsDiv;
}

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

    this.idInput.value = "";
    this.pwInput.value = "";
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
