import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function isExpiringSoon(expiration) {
  const exp = new Date(expiration);
  const now = new Date();
  const days = (exp - now) / (1000 * 60 * 60 * 24);
  return days <= 30;
}

function pantryItemTemplate(item) {
  const soon = isExpiringSoon(item.expiration)
    ? ' class="jar-meta exp-soon"'
    : ' class="jar-meta"';
  return `<li class="jar-card">
    <span class="jar-remove" data-id="${item.id}" title="Remove item">&times;</span>
    <span class="jar-cat">${item.category}</span>
    <h3>${item.name}</h3>
    <p${soon}>${item.quantity} on hand &middot; Exp ${item.expiration}</p>
  </li>`;
}

export default class PantryList {
  constructor(key, listElement) {
    this.key = key;
    this.listElement = listElement;
    this.searchTerm = "";
    this.filterCategory = "";
  }

  render() {
    const allItems = getLocalStorage(this.key) || [];
    this.updateStats(allItems);

    // apply search and filter
    let items = allItems;
    if (this.searchTerm) {
      items = items.filter((i) =>
        i.name.toLowerCase().includes(this.searchTerm.toLowerCase()),
      );
    }
    if (this.filterCategory) {
      items = items.filter((i) => i.category === this.filterCategory);
    }

    if (allItems.length === 0) {
      this.listElement.innerHTML =
        "<p class='empty'>Your pantry is empty. Add your first item above!</p>";
      return;
    }
    if (items.length === 0) {
      this.listElement.innerHTML =
        "<p class='empty'>No items match your search.</p>";
      return;
    }
    this.listElement.innerHTML = items.map(pantryItemTemplate).join("");
    this.addRemoveListeners();
  }

  updateStats(items) {
    document.querySelector("#statTotal").textContent = items.length;
    document.querySelector("#statSoon").textContent = items.filter((i) =>
      isExpiringSoon(i.expiration),
    ).length;
    const cats = new Set(items.map((i) => i.category));
    document.querySelector("#statCats").textContent = cats.size;
  }

  setSearch(term) {
    this.searchTerm = term;
    this.render();
  }

  setFilter(category) {
    this.filterCategory = category;
    this.render();
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