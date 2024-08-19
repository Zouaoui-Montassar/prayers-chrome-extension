"use strict";
function showAlert() {
    alert("This is a test alert from your Chrome extension!!!!!!!!!!");
}
document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("alertButton");
    if (button) {
        button.addEventListener("click", showAlert);
    }
});
