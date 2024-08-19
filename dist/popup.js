"use strict";
function showAlert() {
    alert("test alert from your chrome extension!!!!!!!!!!");
}
document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("alertButton");
    if (button) {
        button.addEventListener("click", showAlert);
    }
});
