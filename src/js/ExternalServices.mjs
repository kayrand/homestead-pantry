const mealdbURL = "https://www.themealdb.com/api/json/v1/1/";
const offURL = "https://world.openfoodfacts.org/cgi/search.pl";

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ExternalServices {
  async searchByIngredient(ingredient) {
    const response = await fetch(`${mealdbURL}filter.php?i=${ingredient}`);
    const data = await convertToJson(response);
    return data.meals || [];
  }

  async getRecipeById(id) {
    const response = await fetch(`${mealdbURL}lookup.php?i=${id}`);
    const data = await convertToJson(response);
    return data.meals ? data.meals[0] : null;
  }

  async getNutrition(term) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(
        `${offURL}?search_terms=${term}&search_simple=1&action=process&json=1&page_size=20`,
        { signal: controller.signal },
      );
      clearTimeout(timeout);
      const data = await convertToJson(response);
      if (!data.products) return null;
      // pick the first product that actually has calorie data
      const withData = data.products.find(
        (p) => p.nutriments && p.nutriments["energy-kcal_100g"] != null,
      );
      return withData || null;
    } catch (err) {
      clearTimeout(timeout);
      return null;
    }
  }
}