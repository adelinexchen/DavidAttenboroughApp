// function to operate carousel
document.querySelectorAll(".carousel").forEach((carousel) => {
  let num = 0;
  let images = "";
  // getting all the images user has purchased so they can be put into carousel
  const cookieItems = getCookie("items").split(",");
  let numImages = cookieItems.length;
  console.log(getCookie("items"));
  for (let i = 0; i < numImages; i++) {
    if (cookieItems[i] != "") {
      images +=
        '<div class="carousel_img"> <img src="' + cookieItems[i] + '"> </div>';
    }
  }
  carousel.insertAdjacentHTML(
    "beforeend",
    `<div id="carousel_images">${images}</div>`
  );

  const items = carousel.querySelectorAll(".carousel_img");
  if (items.length == 0) {
    document.querySelector(".title").insertAdjacentHTML(
      "beforeend",
      `<span>W</span>
          <span>e</span>
          <span>l</span>
          <span>c</span>
          <span>o</span>
          <span>m</span>
          <span>e</span>
          <span>!</span>
      `
    );
    carousel.insertAdjacentHTML(
      "beforeend",
      `
        <img id="welcome_message" src="images/welcome_message.png" alt="welcome message">
    `
    );
  } else {
    document.querySelector(".title").insertAdjacentHTML(
      "beforeend",
      `<span>M</span>
          <span style="padding-right: 15px">y</span>
          <span>G</span>
          <span>a</span>
          <span>l</span>
          <span>l</span>
          <span>e</span>
          <span>r</span>
          <span>y</span>
      `
    );
    // creating left, right scroll buttons and navigation buttons on carousel
    const buttonsHtml = Array.from(items, () => {
      return `<span class="nav_button"></span>`;
    });
    carousel.insertAdjacentHTML(
      "beforeend",
      `
    <div class="nav_bar">
        ${buttonsHtml.join("")}
    </div>
    `
    );
    document.getElementById("carousel_images").insertAdjacentHTML(
      "beforeend",
      `<span class="scroll_button" id="left-scroll-button">&lt;</span>
        <span class="scroll_button" id="right-scroll-button">&gt;</span>`
    );

    // adding functionality to buttons
    const buttons = carousel.querySelectorAll(".nav_button");
    buttons.forEach((button, i) => {
      button.addEventListener("click", () => {
        items.forEach((item) => item.classList.remove("carousel_img-selected"));
        buttons.forEach((button) =>
          button.classList.remove("nav_button-selected")
        );
        items[i].classList.add("carousel_img-selected");
        button.classList.add("nav_button-selected");
        num = i;
      });

      button.addEventListener("mouseenter", () => {
        button.classList.add("nav_button-hover");
      });

      button.addEventListener("mouseleave", () => {
        button.classList.remove("nav_button-hover");
      });
    });
    items[0].classList.add("carousel_img-selected");
    buttons[0].classList.add("nav_button-selected");

    const scrollButtons = carousel.querySelectorAll(".scroll_button");
    scrollButtons.forEach((button, i) => {
      button.addEventListener("click", () => {
        if (button.id == "right-scroll-button") {
          num += 1;
          num = num % buttons.length;
        } else if (button.id == "left-scroll-button") {
          num -= 1;
          if (num < 0) {
            num = buttons.length - 1;
          }
        }
        items.forEach((item) => item.classList.remove("carousel_img-selected"));
        buttons.forEach((button) =>
          button.classList.remove("nav_button-selected")
        );
        items[num].classList.add("carousel_img-selected");
        buttons[num].classList.add("nav_button-selected");
      });
      button.addEventListener("mousedown", () => {
        scrollButtons[i].classList.add("scroll_button-selected");
      });
      button.addEventListener("mouseup", () => {
        scrollButtons[i].classList.remove("scroll_button-selected");
      });
    });

    // changing the carousel images
    function changeCarousel() {
      num += 1;
      const buttons = carousel.querySelectorAll(".nav_button");
      const items = carousel.querySelectorAll(".carousel_img");
      num = num % buttons.length;
      items.forEach((item) => item.classList.remove("carousel_img-selected"));
      buttons.forEach((button) =>
        button.classList.remove("nav_button-selected")
      );
      items[num].classList.add("carousel_img-selected");
      buttons[num].classList.add("nav_button-selected");
    }
    // if no button is pressed, the carousel images change every 4 seconds
    setInterval(changeCarousel, 4000);
  }
});

// refresh the time displayed on the "David's Time" component under carousel
// Displays a message that corresponds to time of day
function refreshTime() {
  const timeDisplay = document.getElementById("davids_time");
  if (timeDisplay != null) {
    const dateString = new Date().toLocaleString().split(" ")[1].split(":");
    // adjusting time to be local time where David is (London England time)
    let adjusted = dateString[0];
    if (adjusted < 9) {
      adjusted = 24 - (9 - adjusted);
    } else {
      adjusted -= 9;
    }
    const davidsMessage = document.getElementById("davids_message");
    if (adjusted > 4 && adjusted < 11) {
      davidsMessage.textContent = "Good morning!";
    } else if (adjusted <= 13 && adjusted >= 11) {
      davidsMessage.textContent = "I'm eating lunch";
    } else if (adjusted < 17 && adjusted > 13) {
      davidsMessage.textContent = "Good afternoon ;)";
    } else if (adjusted < 20 && adjusted >= 17) {
      davidsMessage.textContent = "I'm eating dinner";
    } else {
      davidsMessage.textContent = "I'm sleeping";
    }
    if (adjusted < 10) {
      adjusted = "0" + adjusted;
    }
    timeDisplay.textContent =
      adjusted + ":" + dateString[1] + ":" + dateString[2];
  }
}
// refresh time every second
setInterval(refreshTime, 1000);

// reset user's progress
// this is in case user wants to restart their progress, but also for the sake of my demo
document.getElementById("reset_button").addEventListener("click", () => {
  document.cookie = "user=";
  document.cookie = "balance=";
  document.cookie = "items=";
  document.cookie = "password=";
  window.location.href = "index.html";
});
