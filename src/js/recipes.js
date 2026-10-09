import { loadHeaderFooter, getParam } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import RecipeList from "./RecipeList.mjs";
import RecipeDetails from "./RecipeDetails.mjs";

loadHeaderFooter();

const dataSource = new ExternalServices();
const recipeId = getParam("id");

const searchView = document.querySelector("#searchView");
const detailView = document.querySelector("#detailView");

if (recipeId) {
  // show the detail view for one recipe
  searchView.hidden = true;
  detailView.hidden = false;
  const details = new RecipeDetails(recipeId, dataSource, detailView);
  details.init();
} else {
  // show the search view
  const listElement = document.querySelector("#recipeList");
  const formElement = document.querySelector("#recipeSearchForm");
  const recipeList = new RecipeList(dataSource, listElement, formElement);
  recipeList.init();
}
