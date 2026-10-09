import { getLocalStorage, setLocalStorage, alertMessage } from "./utils.mjs";

export default class RecipeDetails {
  constructor(recipeId, dataSource, detailElement) {
    this.recipeId = recipeId;
    this.dataSource = dataSource;
    this.detailElement = detailElement;
    this.recipe = {};
  }

  async init() {
    this.recipe = await this.dataSource.getRecipeById(this.recipeId);
    if (!this.recipe) {
      this.detailElement.innerHTML = "<p class='empty'>Recipe not found.</p>";
      return;
    }
    this.renderRecipe();
    this.addFavoriteListener();
    this.loadNutrition();
  }

  // pull ingredient + measure pairs out of the recipe object
  getIngredients() {
    const list = [];
    for (let i = 1; i <= 20; i++) {
      const ing = this.recipe[`strIngredient${i}`];
      const measure = this.recipe[`strMeasure${i}`];
      if (ing && ing.trim() !== "") {
        list.push(`${measure} ${ing}`);
      }
    }
    return list;
  }

  renderRecipe() {
    const r = this.recipe;
    const ingredients = this.getIngredients()
      .map((item) => `<li>${item}</li>`)
      .join("");

    this.detailElement.innerHTML = `
      <a href="/recipes/index.html" class="back">&larr; Back to search</a>
      <div class="hero">
        <h1>${r.strMeal}</h1>
        <p>${r.strCategory} &middot; ${r.strArea}</p>
      </div>
      <div class="recipe-head">
        <img src="${r.strMealThumb}" alt="${r.strMeal}" class="recipe-img" />
        <div>
          <button id="favBtn" class="btn">&#9829; Save to favorites</button>
        </div>
      </div>
      <div class="recipe-body">
        <div class="panel">
          <h2>Ingredients</h2>
          <ul class="ingredients">${ingredients}</ul>
          <div id="nutrition" class="nutrition">
            <h3>Nutrition</h3>
            <p class="muted">Loading nutrition info...</p>
          </div>
        </div>
        <div class="panel">
          <h2>Instructions</h2>
          <p>${r.strInstructions}</p>
        </div>
      </div>
    `;
  }

  async loadNutrition() {
    const term = this.recipe.strCategory || this.recipe.strMeal;
    const product = await this.dataSource.getNutrition(term);
    const box = document.querySelector("#nutrition");
    if (product && product.nutriments) {
      const n = product.nutriments;
      box.innerHTML = `
        <h3>Nutrition (per 100g)</h3>
        <ul class="nutri-list">
          <li>Calories: ${n["energy-kcal_100g"] ?? "n/a"}</li>
          <li>Protein: ${n["proteins_100g"] ?? "n/a"} g</li>
          <li>Fat: ${n["fat_100g"] ?? "n/a"} g</li>
          <li>Carbs: ${n["carbohydrates_100g"] ?? "n/a"} g</li>
        </ul>
        <p class="src">Nutrition data from Open Food Facts</p>
      `;
    } else {
      box.innerHTML = `<h3>Nutrition</h3><p class="muted">No nutrition data found.</p>`;
    }
  }

  addFavoriteListener() {
    document.querySelector("#favBtn").addEventListener("click", () => {
      const favorites = getLocalStorage("favorites") || [];
      if (favorites.find((f) => f.idMeal === this.recipe.idMeal)) {
        alertMessage(
          "This recipe is already in your favorites.",
          false,
          "success",
        );
        return;
      }
      favorites.push({
        idMeal: this.recipe.idMeal,
        strMeal: this.recipe.strMeal,
        strMealThumb: this.recipe.strMealThumb,
      });
      setLocalStorage("favorites", favorites);
      alertMessage(`${this.recipe.strMeal} saved to favorites!`, false, "success");
    });
  }
}