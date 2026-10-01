import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function pantryItemTemplate(item) {
  return `<li class="jar-card">
    <span class="jar-remove" data-id="${item.id}" title="Remove item">&times;</span>
    <span class="jar-cat">${item.category}</span>
    <h3>${item.name}</h3>
    <p class="jar-meta">${item.quantity} on hand &middot; Exp ${item.expiration}</p>
  </li>`;
}

export default class PantryList {
  constructor(key, listElement) {
    this.key = key;
    this.listElement = listElement;
  }

  render() {
    const items = getLocalStorage(this.key) || [];
    if (items.length === 0) {
      this.listElement.innerHTML =
        "<p class='empty'>Your pantry is empty. Add your first item above!</p>";
      return;
    }
    this.listElement.innerHTML = items.map(pantryItemTemplate).join("");
    this.addRemoveListeners();
  }

  addRemoveListeners() {
    const buttons = this.listElement.querySelectorAll(".jar-remove");
    buttons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.removeItem(e.target.dataset.id);
      });
    });
  }

  removeItem(id) {
    let items = getLocalStorage(this.key) || [];
    items = items.filter((item) => item.id !== id);
    setLocalStorage(this.key, items);
    this.render();
  }
}