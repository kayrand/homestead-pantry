import { loadHeaderFooter } from "./utils.mjs";
import PantryList from "./PantryList.mjs";
import PantryForm from "./PantryForm.mjs";

loadHeaderFooter();

const listElement = document.querySelector("#pantryList");
const formElement = document.querySelector("#addItemForm");

const pantryList = new PantryList("pantry-items", listElement);
pantryList.render();

const pantryForm = new PantryForm("pantry-items", formElement, () => {
  pantryList.render();
});
pantryForm.init();

// search and filter
document.querySelector("#pantrySearch").addEventListener("input", (e) => {
  pantryList.setSearch(e.target.value);
});
document.querySelector("#pantryFilter").addEventListener("change", (e) => {
  pantryList.setFilter(e.target.value);
});
