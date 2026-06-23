//анимация домика
const zones = document.querySelectorAll(".house-zone");
const overlays = document.querySelectorAll(".room-overlay");

const title = document.getElementById("room-title");
const description = document.getElementById("room-description");

zones.forEach((zone) => {
  zone.addEventListener("click", () => {
    const roomId = zone.dataset.room;
    const textTemplate = document.getElementById(`text-room-${roomId}`);

    if (!textTemplate) return;

    const newTitle = textTemplate.content.querySelector("h2");
    const newDescription = textTemplate.content.querySelector("h3");

    title.innerHTML = newTitle.innerHTML;
    title.setAttribute("data-text", newTitle.textContent.trim());

    description.innerHTML = newDescription.innerHTML;

    overlays.forEach((overlay) => {
      overlay.classList.remove("active");
    });

    const currentOverlay = document.querySelector(`.room-${roomId}`);

    if (currentOverlay) {
      currentOverlay.classList.remove("active");
      void currentOverlay.offsetWidth;
      currentOverlay.classList.add("active");
    }
  });
});
