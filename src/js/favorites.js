import { loadHeaderFooter } from "./utils.mjs";
import Favorites from "./Favorites.mjs";

loadHeaderFooter();

const listElement = document.querySelector("#favoritesList");
const favorites = new Favorites(listElement);
favorites.render();
