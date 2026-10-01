import { loadHeaderFooter } from "./utils.mjs";
import PantryList from "./PantryList.mjs";
import PantryForm from "./PantryForm.mjs";

loadHeaderFooter();

const listElement = document.querySelector("#pantryList");
const formElement = document.querySelector("#addItemForm");

const pantryList = new PantryList("pantry-items", listElement);
pantryList.render();

// when a new item is added, re-render the list
const pantryForm = new PantryForm("pantry-items", formElement, () => {
  pantryList.render();
});
pantryForm.init();
