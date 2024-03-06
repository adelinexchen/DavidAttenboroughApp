// set default items purchased to 0
// set functionality for what happens when you try to buy an item
document.querySelectorAll(".shop_item").forEach((shopItem) => {
  const coins = shopItem.querySelectorAll(".coin");
  coins.forEach((coin) => {
    shopItem.addEventListener("click", () => {
      let alertBox = document.querySelector(".alert_box");
      if (coin.classList.contains("coin")) {
        alertBox.classList.remove("alert_box_closed");
        alertBox.classList.add("alert_box_opened");
        document.getElementById("popup").style.zIndex = "3";
      }

      // confirm purchase alert
      document.getElementById(
        "alert_message"
      ).textContent = `Buy this sticker for ${coin.innerHTML} David Dollars?`;

      document.getElementById("cancel_alert").addEventListener("click", () => {
        alertBox.classList.add("alert_box_closed");
        alertBox.classList.remove("alert_box_opened");
        document.getElementById("popup").style.zIndex = "-1";
      });

      // if purchase is confirmed:
      document.getElementById("confirm_alert").addEventListener("click", () => {
        if (
          Number(getCookie("balance")) < Number(coin.innerHTML) &&
          coin.className != "coin_clicked"
        ) {
          // user does not have the money to buy item
          alertBox.classList.add("alert_box_closed");
          alertBox.classList.remove("alert_box_opened");
          document
            .querySelector(".insufficient")
            .classList.remove("insufficient_closed");

          document
            .querySelector(".insufficient")
            .classList.add("insufficient_opened");
        } else if (
          coin.className != "coin_clicked" &&
          Number(getCookie("balance")) >= Number(coin.innerHTML)
        ) {
          // user has enough money to buy item
          updateItems(getCookie("user"), shopItem.id);
          updateBalance(
            getCookie("user"),
            Number(getCookie("balance")) - Number(coin.innerHTML)
          );
          // does not allow user to buy item again (avoid multiple purchases)
          coin.classList.remove("coin");
          coin.classList.add("coin_clicked");
          document.getElementById("balance").textContent = getCookie("balance");
          alertBox.classList.add("alert_box_closed");
          alertBox.classList.remove("alert_box_opened");
          document.getElementById("popup").style.zIndex = "-1";
          document
            .querySelector(".insufficient")
            .classList.remove("insufficient_opened");

          document
            .querySelector(".insufficient")
            .classList.add("insufficient_closed");
        }
      });
    });
  });
});
