// TheMealDB free API base
const mealdbURL = "https://www.themealdb.com/api/json/v1/1/";
// Open Food Facts search API
const offURL = "https://world.openfoodfacts.org/cgi/search.pl";

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ExternalServices {
  // search recipes by a main ingredient (e.g. "peach")
  async searchByIngredient(ingredient) {
    const response = await fetch(`${mealdbURL}filter.php?i=${ingredient}`);
    const data = await convertToJson(response);
    return data.meals || [];
  }

  // get one recipe's full details by its id
  async getRecipeById(id) {
    const response = await fetch(`${mealdbURL}lookup.php?i=${id}`);
    const data = await convertToJson(response);
    return data.meals ? data.meals[0] : null;
  }

  // get nutrition info for a food term from Open Food Facts
  async getNutrition(term) {
    const response = await fetch(
      `${offURL}?search_terms=${term}&search_simple=1&action=process&json=1&page_size=1`,
    );
    const data = await convertToJson(response);
    return data.products && data.products.length ? data.products[0] : null;
  }
}