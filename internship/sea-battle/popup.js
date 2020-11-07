const popup = document.querySelector(".popup");

// close popup
document.querySelector(".popup__close").addEventListener("click", (e) => {
  popup.classList.remove("popup--show");
});

// exit popup by "esc"
window.addEventListener("keydown", (e) => {
  if (e.keyCode === 27) {
    e.preventDefault();
    if (popup.classList.contains("popup--show")) {
      popup.classList.remove("popup--show");
    }
  }
});

// document.querySelector(".add-text").addEventListener("click", (e) => {
//   logs.textContent = logs.textContent + "123";
// });
