import { getLocalStorage, setLocalStorage, alertMessage } from "./utils.mjs";

export default class PantryForm {
  constructor(key, formElement, onAdd) {
    this.key = key;
    this.formElement = formElement;
    this.onAdd = onAdd; // a callback to run after adding (to re-render the list)
  }

  init() {
    this.formElement.addEventListener("submit", (e) => {
      e.preventDefault();
      if (this.formElement.checkValidity()) {
        this.addItem();
      } else {
        this.formElement.reportValidity();
      }
    });
  }

  addItem() {
    const formData = new FormData(this.formElement);
    const newItem = {
      id: Date.now().toString(), // simple unique id
      name: formData.get("name"),
      category: formData.get("category"),
      quantity: formData.get("quantity"),
      expiration: formData.get("expiration"),
    };

    const items = getLocalStorage(this.key) || [];
    items.push(newItem);
    setLocalStorage(this.key, items);

    this.formElement.reset();
    alertMessage(`${newItem.name} added to your pantry!`, false, "success");

    if (this.onAdd) {
      this.onAdd();
    }
  }
}