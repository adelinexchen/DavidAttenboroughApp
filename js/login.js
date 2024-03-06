// const baseURL = window.location.href.slice(0, window.location.href.length - 1) + `:8080/`;
// const baseURL = "http://34.135.16.213/";
const baseURL = "http://localhost:3000/";

async function getUser(username) {
  const url = `${baseURL}login/${username}`;
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data.data);
    });
}

async function validateUser(username, password) {
  const url = `${baseURL}login/${username}`;
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const response = data.data;
      console.log(response);
      console.log(password, response.password);
      if (response.password == password) {
        window.location.href = "home_page.html";
        document.cookie = `user=${username}`;
        document.cookie = `password=${response.password}`;
        document.cookie = `balance=${response.balance}`;
        document.cookie = `items=${response.items}`;
      } else if (response.username == undefined) {
        console.log("user doesn't yet exist");
        document.getElementById("popup").style.zIndex = "3";
        document.getElementById("error_message").textContent =
          "User does not exist";

        document
          .querySelector(".insufficient")
          .classList.add("insufficient_opened");
        document
          .querySelector(".insufficient")
          .classList.remove("insufficient_closed");
        document.getElementById("password").value = "";
        document.getElementById("username").value = "";
      } else {
        console.log(response.items);
        console.log("wrong passwrod");

        document.getElementById("popup").style.zIndex = "3";

        document.getElementById("error_message").textContent = "Wrong Password";
        document
          .querySelector(".insufficient")
          .classList.add("insufficient_opened");
        document
          .querySelector(".insufficient")
          .classList.remove("insufficient_closed");
        document.getElementById("password").value = "";
        document.getElementById("username").value = "";
      }
    });
}

document.getElementById("login_button").addEventListener("click", () => {
  const username = document.getElementById("username").value;

  const password = document.getElementById("password").value;
  console.log(username);
  console.log(password);

  validateUser(username, password);
});

// add functionality to close buttons
document.querySelectorAll(".exit").forEach((close_button) => {
  close_button.addEventListener("click", () => {
    document
      .querySelector(".insufficient")
      .classList.add("insufficient_closed");
    document
      .querySelector(".insufficient")
      .classList.remove("insufficient_opened");
    document.getElementById("popup").style.zIndex = "-1";
  });
});
