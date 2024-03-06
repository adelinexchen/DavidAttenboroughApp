// const baseURL = window.location.href.slice(0, window.location.href.length - 1) + `:8080/`;
const baseURL = "http://localhost:3000/";
// const baseURL = "http://34.135.16.213/";

async function createUser(username, password) {
  const url = `${baseURL}create`;
  const data = {
    username,
    password,
    balance: 100,
    items: "",
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response;
}

async function existingUser(username, password) {
  const url = `${baseURL}login/${username}`;
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const response = data.data;
      console.log(response);
      if (!response && document.getElementById("password").value != "") {
        createUser(username, password);
        window.location.href = "index.html";
      } else if (document.getElementById("password").value == "") {
        document.getElementById("popup").style.zIndex = "3";
        document.getElementById("error_message").textContent = "Empty password";

        document
          .querySelector(".insufficient")
          .classList.add("insufficient_opened");
        document
          .querySelector(".insufficient")
          .classList.remove("insufficient_closed");
      } else {
        console.log("user exists");
        document.getElementById("popup").style.zIndex = "3";
        document.getElementById("error_message").textContent =
          "Username is taken";

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

document.getElementById("create_button").addEventListener("click", () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  console.log(username, password);
  existingUser(username, password);
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
