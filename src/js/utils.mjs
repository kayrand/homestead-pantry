// shortcut for querySelector
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// get data from local storage (parsed)
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// get a value from the URL query string (e.g. ?id=123)
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// render a list into a parent element using a template function
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false,
) {
  const htmlStrings = list.map(templateFn);
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

// render a single template into a parent element, with an optional callback
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

// fetch an HTML partial file and return its text
async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

// load the header and footer partials into the page
export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("/partials/header.html");
  const footerTemplate = await loadTemplate("/partials/footer.html");
  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");
  if (headerElement) renderWithTemplate(headerTemplate, headerElement);
  if (footerElement) renderWithTemplate(footerTemplate, footerElement);
}

// show a small dismissable alert message at the top of main
export function alertMessage(message, scroll = true, type = "success") {
  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.classList.add(`alert--${type}`);
  alert.innerHTML = `<p>${message}</p><span class="alert-close">&times;</span>`;

  const main = document.querySelector("main");
  alert.addEventListener("click", function (e) {
    if (e.target.classList.contains("alert-close")) {
      main.removeChild(this);
    }
  });
  main.prepend(alert);

  if (scroll) {
    window.scrollTo(0, 0);
  }
  if (type === "success") {
    setTimeout(() => {
      if (alert.parentElement) {
        main.removeChild(alert);
      }
    }, 3000);
  }
}