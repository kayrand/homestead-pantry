import { getParam } from "./utils.mjs";

function recipeCardTemplate(recipe) {
  return `<li class="recipe-card">
    <a href="?id=${recipe.idMeal}">
      <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" loading="lazy" />
      <h3>${recipe.strMeal}</h3>
    </a>
  </li>`;
}

export default class RecipeList {
  constructor(dataSource, listElement, formElement) {
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.formElement = formElement;
  }

  init() {
    this.formElement.addEventListener("submit", (e) => {
      e.preventDefault();
      const ingredient = this.formElement.querySelector("#ingredientInput").value;
      this.search(ingredient);
    });

    // if an ingredient was passed in the URL, search it right away
    const preset = getParam("ingredient");
    if (preset) {
      this.formElement.querySelector("#ingredientInput").value = preset;
      this.search(preset);
    }
  }

  async search(ingredient) {
    const recipes = await this.dataSource.searchByIngredient(ingredient);
    if (recipes.length === 0) {
      this.listElement.innerHTML = `<p class="empty">No recipes found for "${ingredient}". Try another ingredient.</p>`;
      return;
    }
    this.listElement.innerHTML = recipes.map(recipeCardTemplate).join("");
  }
}