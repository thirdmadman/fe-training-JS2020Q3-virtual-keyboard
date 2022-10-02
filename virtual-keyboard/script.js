class Keyboard {
    elements = {
        main: null,
        keysContainer: null,
        keys: []
    };

    eventHandlers = {
        oninput: null,
        onclose: null
    };

    properties = {
        value: "",
        capsLock: false
    };

    constructor() {
        this.textInput = document.querySelector("textarea");
        this.layoutLanguage = 'ru';
        this.isKeyboardHidden = true;
        this._createKeyboard();
        this._updateFocus();
    }

    _createKeyboard() {
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");

        this.elements.main.classList.add("keyboard");
        if (this.isKeyboardHidden) {
            this.elements.main.classList.add("keyboard--hidden");
        }
        this.elements.keysContainer.classList.add("keyboard__keys");
        this.elements.keysContainer.appendChild(this._createKeys());

        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");


        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);


        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            element.addEventListener("focus", () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                });
            });
        });
    }

    _updateFocus() {
        setInterval(() => {
            if (!this.isKeyboardHidden) {
                this.textInput.focus();
            }
        }, 1000);
    }

    _createKeys() {
        const fragment = document.createDocumentFragment();
        let keyLayout = [];
        if (this.layoutLanguage === 'eng') {
            keyLayout = [
                "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace", "br",
                "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\"", "br",
                "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter", "br",
                "caps", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?", "br",
                "lang", "space", "hide"
            ];
        } else if (this.layoutLanguage === 'ru') {
            keyLayout = [
                "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace", "br",
                "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ", "\\", "br",
                "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter", "br",
                "caps", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "?", "br",
                "lang", "space", "hide"
            ];
        }


        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        keyLayout.forEach(key => {
            let keyElement = document.createElement("button");

            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard__key");


          keyElement.addEventListener("click", () => {
            this.textInput.focus();
            //let range = new Range();
            //range.setStart(this.textInput, this.properties.value.length-1);
            //range.setEnd(this.textInput, this.properties.value.length-1);
          });

            switch (key) {
                case "backspace":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("backspace");

                    keyElement.addEventListener("click", () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._triggerEvent("oninput");
                    });

                    break;

                case "caps":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");

                    keyElement.addEventListener("click", () => {
                        this._toggleCapsLock();
                        keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
                    });

                    break;

                case "enter":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_return");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += "\n";
                        this._triggerEvent("oninput");
                    });

                    break;

                case "space":
                    keyElement.classList.add("keyboard__key--extra-wide");
                    keyElement.innerHTML = createIconHTML("space_bar");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += " ";
                        this._triggerEvent("oninput");
                    });

                    break;

                case "br":
                    fragment.appendChild(document.createElement("br"));
                    keyElement = null;
                    break;

                case "lang":
                    keyElement.innerHTML = createIconHTML("language");

                    keyElement.addEventListener("click", () => {
                        this._switchLang();
                    });
                    break;


                case "hide":

                    keyElement.innerHTML = createIconHTML("keyboard_hide");
                    keyElement.addEventListener("click", () => {
                        this.close();
                    });
                    break;

                default:
                    keyElement.textContent = key.toLowerCase();

                    keyElement.addEventListener("click", () => {
                        this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                        this._triggerEvent("oninput");
                    });

                    break;
            }


            keyElement ? fragment.appendChild(keyElement) : null;
        });

        return fragment;
    }

    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    }

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    }

    _switchLang() {
        this.elements.main.remove();
        if (this.layoutLanguage === "eng") {
            this.layoutLanguage = "ru";
        } else {
            this.layoutLanguage = "eng";
        }
        this._createKeyboard();
    }

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.isKeyboardHidden = false;
        this.elements.main.classList.remove("keyboard--hidden");
    }

    close() {
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.isKeyboardHidden = true;
        this.elements.main.classList.add("keyboard--hidden");
    }
}

window.addEventListener("DOMContentLoaded", function () {
    let keyboard = new Keyboard();
});