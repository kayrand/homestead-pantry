import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function favoriteCardTemplate(recipe) {
  return `<li class="recipe-card">
    <span class="fav-remove" data-id="${recipe.idMeal}" title="Remove">&times;</span>
    <a href="/recipes/index.html?id=${recipe.idMeal}">
      <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" loading="lazy" />
      <h3>${recipe.strMeal}</h3>
    </a>
  </li>`;
}

export default class Favorites {
  constructor(listElement) {
    this.listElement = listElement;
  }

  render() {
    const favorites = getLocalStorage("favorites") || [];
    if (favorites.length === 0) {
      this.listElement.innerHTML =
        "<p class='empty'>No favorites yet. Find a recipe and save it!</p>";
      return;
    }
    this.listElement.innerHTML = favorites.map(favoriteCardTemplate).join("");
    this.addRemoveListeners();
  }

  addRemoveListeners() {
    this.listElement.querySelectorAll(".fav-remove").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.removeFavorite(e.target.dataset.id);
      });
    });
  }

  removeFavorite(id) {
    let favorites = getLocalStorage("favorites") || [];
    favorites = favorites.filter((f) => f.idMeal !== id);
    setLocalStorage("favorites", favorites);
    this.render();
  }
}