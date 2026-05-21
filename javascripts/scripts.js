burger();

function burger() {
  const burger = document.querySelector("#burger");
  const menu = document.querySelector(".mainMenu");

  if (!burger || !menu) return;

  burger.addEventListener("click", () => {
    burger.classList.toggle("active");
    menu.classList.toggle("active");
  });

  const links = document.querySelectorAll(".mainMenuLink");

  links.forEach((link) => {
    link.addEventListener("click", () => {
      burger.classList.remove("active");
      menu.classList.remove("active");
    });
  });
}
