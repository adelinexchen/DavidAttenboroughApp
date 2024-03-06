// Creating drop down menu for each job role available
document.querySelectorAll(".role").forEach((role) => {
  let arrow = role.querySelector(".arrow");
  arrow.addEventListener("click", () => {
    let description = role.querySelector(".description").classList;
    if (description.contains("description_closed")) {
      description.remove("description_closed");
      description.add("description_opened");
      arrow.classList.remove("drop_down");
      arrow.classList.add("drop_up");
    } else {
      description.add("description_closed");
      description.remove("description_opened");
      arrow.classList.remove("drop_up");
      arrow.classList.add("drop_down");
    }
  });

  // What happens when you try to submit your application:
  role.querySelector(".submit").addEventListener("click", () => {
    let alertBox = document.querySelector(".alert_box");
    alertBox.classList.remove("alert_box_closed");
    alertBox.classList.add("alert_box_opened");

    document.getElementById("cancel_alert").addEventListener("click", () => {
      alertBox.classList.add("alert_box_closed");
      alertBox.classList.remove("alert_box_opened");
    });

    alertBox.querySelector(".close_button").addEventListener("click", () => {
      alertBox.classList.add("alert_box_closed");
      alertBox.classList.remove("alert_box_opened");
    });

    if (
      role.querySelector(".name_field").value == "" ||
      role.querySelector(".email_field").value == ""
    ) {
      // if a field is left blank, an alert is created
      document.getElementById(
        "alert_message"
      ).textContent = `Please fill in all fields`;
    } else if (!role.querySelector(".email_field").value.includes("@")) {
      // if the email is invalid an alert is created
      document.getElementById("alert_message").textContent = `Invalid email!`;
    } else {
      // if everything is filled and email is valid, application is successful
      role.querySelector(".name_field").value = "";
      role.querySelector(".email_field").value = "";
      document.getElementById(
        "alert_message"
      ).textContent = `Thank you for your application!`;
    }
  });
});
