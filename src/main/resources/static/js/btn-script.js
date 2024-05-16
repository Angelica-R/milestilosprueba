document.addEventListener("DOMContentLoaded", function() {
    const openChatButton = document.getElementById("open-chat-button");
    const chatBox = document.querySelector(".chat-box");

    openChatButton.addEventListener("click", function() {
        chatBox.classList.toggle("open");
    });
});