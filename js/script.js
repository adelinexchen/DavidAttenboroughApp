// const baseURL = window.location.href.slice(0, window.location.href.length - 1) + `:8080/`;
const baseURL = "http://localhost:3000/";
// const baseURL = "http://34.135.16.213/";

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "UNDEFINED";
}

async function updateBalance(username, balance) {
  const url = `${baseURL}login/${username}`;
  const data = {
    username,
    password: getCookie("password"),
    balance,
    items: getCookie("items"),
  };

  document.cookie = `balance=${balance}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response;
}

async function updateItems(username, item) {
  const url = `${baseURL}login/${username}`;
  console.log(baseURL);
  const existingItems = getCookie("items") + `,${item}`;
  document.cookie = `items=${existingItems}`;
  const data = {
    username,
    password: getCookie("password"),
    balance: getCookie("balance"),
    items: getCookie("items"),
  };

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response;
}

if (getCookie("user") === "UNDEFINED") {
  window.location.href = "index.html";
}

console.log(getCookie("user"));

document.getElementById("balance").textContent = getCookie("balance");

// add functionality to side bar
document.querySelectorAll(".side_bar_buttons").forEach((sidebar_button) => {
  sidebar_button.addEventListener("click", () => {
    document.querySelector(".sidebar").classList.remove("closed_sidebar");
    document.querySelector(".sidebar").classList.add("opened_sidebar");
  });
});

// add functionality to close buttons
document.querySelectorAll(".exit").forEach((close_button) => {
  close_button.addEventListener("click", () => {
    console.log("no");
    document.querySelector(".sidebar").classList.add("closed_sidebar");
    document.querySelector(".sidebar").classList.remove("opened_sidebar");
    document
      .querySelector(".insufficient")
      .classList.add("insufficient_closed");
    document
      .querySelector(".insufficient")
      .classList.remove("insufficient_opened");
    document.getElementById("popup").style.zIndex = "-1";
  });
});

// export {updateBalance, updateItems, getCookie};
