export class InputForm {
    constructor() {
        this.baseForm = document.createElement("form");
        this.buttonsDiv = document.createElement("div");
        this.inputForms = [];
        this.setBaseDivs();
    }
    setBaseDivs() {
        this.baseForm.style.display = "flex";
        this.baseForm.style.flexDirection = "column";
        this.buttonsDiv.style.display = "flex";
        this.buttonsDiv.style.flexDirection = "row";
        this.baseForm.appendChild(this.buttonsDiv);
    }
    addInputForm(placeholder, showText) {
        const input = document.createElement("input");
        if (showText) {
            input.type = "text";
        }
        else {
            input.type = "password";
        }
        input.placeholder = placeholder;
        this.baseForm.appendChild(input);
        this.inputForms.push(input);
        return input;
    }
    addButton(text, onClick) {
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
    appendFormTo(parent) {
        parent.appendChild(this.baseForm);
    }
    removeFormFrom(parent) {
        parent.removeChild(this.baseForm);
    }
}
