export class InputForm {
  private baseForm: HTMLFormElement = document.createElement("form");
  private buttonsDiv: HTMLDivElement = document.createElement("div");
  private inputForms: HTMLElement[] = [];

  constructor() {
    this.setBaseDivs();
  }

  private setBaseDivs() {
    this.baseForm.style.display = "flex";
    this.baseForm.style.flexDirection = "column";

    this.buttonsDiv.style.display = "flex";
    this.buttonsDiv.style.flexDirection = "row";
    this.baseForm.appendChild(this.buttonsDiv);
  }

  addInputForm(placeholder: string, showText: boolean): HTMLInputElement {
    const input = document.createElement("input");
    if (showText) {
      input.type = "text";
    } else {
      input.type = "password";
    }

    input.className = "input";
    input.placeholder = placeholder;
    this.baseForm.appendChild(input);

    this.inputForms.push(input);

    return input;
  }

  addButton(text: string, onClick: (e: Event) => void) {
    const button = document.createElement("button");
    button.innerText = text;
    button.addEventListener("click", (e) => {
      e.preventDefault();
      onClick(e);
    });
    this.buttonsDiv.appendChild(button);
  }

  refreshAllInputs() {
    this.baseForm.reset();
  }

  appendFormTo(parent: HTMLElement) {
    parent.appendChild(this.baseForm);
  }

  removeFormFrom(parent: HTMLElement) {
    parent.removeChild(this.baseForm);
  }
}
