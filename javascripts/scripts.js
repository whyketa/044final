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

//для обводки
document.querySelectorAll("h2").forEach((h2) => {
  h2.setAttribute("data-text", h2.textContent);
});

// анимация картинок
const movingImages = document.querySelectorAll(".moving");

document.addEventListener("mousemove", (e) => {
  const mouseX = e.clientX / window.innerWidth - 0.5;
  const mouseY = e.clientY / window.innerHeight - 0.5;

  movingImages.forEach((img) => {
    const speed = img.dataset.speed || 20;

    const x = mouseX * speed;
    const y = mouseY * speed;

    img.style.transform = `translate(${x}px, ${y}px)`;
  });
});

// анимация трайблов
const floatElements = [...document.querySelectorAll(".bg-float")];

const trible3 = document.querySelector(".trible3");
const trible7 = document.querySelector(".trible7");

const escapingElements = [trible3, trible7].filter(Boolean);

const usualFloatElements = floatElements.filter((el) => {
  return !escapingElements.includes(el);
});

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function resetElement(el) {
  el.style.setProperty("--x", "0px");
  el.style.setProperty("--y", "0px");
  el.style.setProperty("--float-rotate", "0deg");
}

function moveElement(el) {
  const x = randomBetween(-45, 45);
  const y = randomBetween(-70, 70);
  const rotate = randomBetween(-6, 6);

  el.style.setProperty("--x", `${x}px`);
  el.style.setProperty("--y", `${y}px`);
  el.style.setProperty("--float-rotate", `${rotate}deg`);
}

function chooseMovingElements() {
  usualFloatElements.forEach((el) => {
    resetElement(el);
  });

  const count = 3;
  const shuffled = [...usualFloatElements].sort(() => Math.random() - 0.5);
  const movingElements = shuffled.slice(0, count);

  movingElements.forEach((el) => {
    moveElement(el);
  });
}

function getElementTopInsidePage(el) {
  const page = document.querySelector(".page");
  const pageTop = page.getBoundingClientRect().top + window.scrollY;
  const elTop = el.getBoundingClientRect().top + window.scrollY;

  return elTop - pageTop;
}

function flyDownAndBack(el) {
  const page = document.querySelector(".page");
  const pageHeight = page.scrollHeight;
  const elTop = getElementTopInsidePage(el);
  const distance = pageHeight - elTop + 200;

  resetElement(el);
  el.classList.add("is-escaping");

  el.style.setProperty("--y", `${distance}px`);
  el.style.setProperty("--float-rotate", "14deg");

  setTimeout(() => {
    resetElement(el);
  }, 14000);

  setTimeout(() => {
    el.classList.remove("is-escaping");
  }, 27000);
}

function flyUpAndBack(el) {
  const elTop = getElementTopInsidePage(el);
  const distance = -elTop - el.offsetHeight - 200;

  resetElement(el);
  el.classList.add("is-escaping");

  el.style.setProperty("--y", `${distance}px`);
  el.style.setProperty("--float-rotate", "-14deg");

  setTimeout(() => {
    resetElement(el);
  }, 14000);

  setTimeout(() => {
    el.classList.remove("is-escaping");
  }, 27000);
}

setTimeout(() => {
  chooseMovingElements();

  setInterval(() => {
    chooseMovingElements();
  }, 4000);
}, 2500);

setTimeout(() => {
  flyDownAndBack(trible3);
}, 5000);

setTimeout(() => {
  flyUpAndBack(trible7);
}, 7000);

//анимация листалки
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".cardsTrack");
  const originalCards = Array.from(document.querySelectorAll(".card"));

  if (!track || originalCards.length === 0) return;

  const originalCount = originalCards.length;
  const copiesBefore = 2;
  const copiesAfter = 2;

  let cards = [];
  let currentIndex = originalCount * copiesBefore;
  let isMouseDown = false;
  let preventClick = false;
  let startX = 0;
  let startScrollLeft = 0;
  let scrollTimeout;
  let autoScroll;

  function createInfiniteCards() {
    const beforeFragment = document.createDocumentFragment();
    const afterFragment = document.createDocumentFragment();

    for (let i = 0; i < copiesBefore; i++) {
      originalCards.forEach((card) => {
        const clone = card.cloneNode(true);
        clone.classList.remove("active");
        beforeFragment.appendChild(clone);
      });
    }

    for (let i = 0; i < copiesAfter; i++) {
      originalCards.forEach((card) => {
        const clone = card.cloneNode(true);
        clone.classList.remove("active");
        afterFragment.appendChild(clone);
      });
    }

    track.prepend(beforeFragment);
    track.appendChild(afterFragment);

    cards = Array.from(track.querySelectorAll(".card"));

    cards.forEach((card) => {
      card.draggable = false;

      card.addEventListener("click", (event) => {
        if (preventClick) {
          event.preventDefault();
          preventClick = false;
        }
      });
    });
  }

  function setActiveCard(index) {
    cards.forEach((card) => {
      card.classList.remove("active");
    });

    cards[index].classList.add("active");
    currentIndex = index;
  }

  function updateActiveByCenter() {
    const trackRect = track.getBoundingClientRect();
    const trackCenter = trackRect.left + trackRect.width / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    cards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(trackCenter - cardCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveCard(closestIndex);
  }

  function getGroupWidth() {
    return cards[originalCount].offsetLeft - cards[0].offsetLeft;
  }

  function checkInfiniteScroll() {
    const groupWidth = getGroupWidth();
    if (!groupWidth) return 0;

    const oldScrollLeft = track.scrollLeft;
    const center = track.scrollLeft + track.offsetWidth / 2;

    const leftLimit = cards[originalCount].offsetLeft;
    const rightLimit = cards[originalCount * 4].offsetLeft;

    if (center < leftLimit) {
      track.scrollLeft += groupWidth * 2;
    }

    if (center > rightLimit) {
      track.scrollLeft -= groupWidth * 2;
    }

    return track.scrollLeft - oldScrollLeft;
  }

  function scrollToCard(index) {
    const card = cards[index];

    const scrollPosition =
      card.offsetLeft - track.offsetWidth / 2 + card.offsetWidth / 2;

    track.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    });

    setActiveCard(index);
  }

  function scrollToStart() {
    const startIndex = originalCount * copiesBefore;
    scrollToCard(startIndex);
  }

  function nextCard() {
    checkInfiniteScroll();
    updateActiveByCenter();

    let nextIndex = currentIndex + 1;

    if (nextIndex >= cards.length) {
      nextIndex = originalCount * copiesBefore;
    }

    scrollToCard(nextIndex);

    setTimeout(() => {
      checkInfiniteScroll();
      updateActiveByCenter();
    }, 600);
  }

  function startAutoScroll() {
    stopAutoScroll();

    autoScroll = setInterval(() => {
      if (!isMouseDown) {
        nextCard();
      }
    }, 3000);
  }

  function stopAutoScroll() {
    clearInterval(autoScroll);
  }

  track.addEventListener("mousedown", (event) => {
    isMouseDown = true;
    preventClick = false;

    startX = event.pageX;
    startScrollLeft = track.scrollLeft;

    stopAutoScroll();

    track.style.cursor = "grabbing";
    track.style.scrollBehavior = "auto";
    track.style.scrollSnapType = "none";
  });

  window.addEventListener("mousemove", (event) => {
    if (!isMouseDown) return;

    event.preventDefault();

    const distance = event.pageX - startX;

    if (Math.abs(distance) > 5) {
      preventClick = true;
    }

    track.scrollLeft = startScrollLeft - distance;

    const jump = checkInfiniteScroll();

    if (jump !== 0) {
      startScrollLeft += jump;
    }

    updateActiveByCenter();
  });

  window.addEventListener("mouseup", () => {
    if (!isMouseDown) return;

    isMouseDown = false;

    track.style.cursor = "grab";
    track.style.scrollBehavior = "smooth";
    track.style.scrollSnapType = "x mandatory";

    checkInfiniteScroll();
    updateActiveByCenter();

    setTimeout(() => {
      startAutoScroll();
    }, 1500);
  });

  track.addEventListener("scroll", () => {
    if (isMouseDown) return;

    clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {
      checkInfiniteScroll();
      updateActiveByCenter();
    }, 80);
  });

  window.addEventListener("resize", () => {
    scrollToStart();
    updateActiveByCenter();
  });

  createInfiniteCards();

  requestAnimationFrame(() => {
    scrollToStart();
    updateActiveByCenter();
    startAutoScroll();
    track.style.cursor = "grab";
  });
});

//карта
// Функция инициализации карты
function initMap() {
  // Создаём карту
  const map = new ymaps.Map("map", {
    center: [55.7873, 37.641764], // Координаты центра карты, наше адрес
    zoom: 16, // Масштаб карты
  });

  // Создаём метку на карте
  const placemark = new ymaps.Placemark(
    [55.7873, 37.641764],
    {
      balloonContent: "044 shop, улица Слэя, 52",
    },
    {
      preset: "islands#redIcon", // Красная иконка
    },
  );

  // Добавляем метку на карту
  map.geoObjects.add(placemark);
}

// Ждём загрузки API Яндекс Карт
ymaps.ready(initMap);
