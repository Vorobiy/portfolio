/* Site data & interactivity — abdullahr.com clone for eugene vorobiov */

let mapInstance = null;
let mapInitialized = false;

/* ---- Particles background (abdullahr.com) ---- */

function getParticlesConfig(isDark) {
  const color = isDark ? "#ffffff" : "#000000";
  return {
    particles: {
      number: { value: 60, density: { enable: true, value_area: 800 } },
      color: { value: color },
      shape: { type: "circle", stroke: { width: 0, color: "#000000" }, polygon: { nb_sides: 5 } },
      opacity: { value: 0.3, random: false, anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false } },
      size: { value: 3, random: true, anim: { enable: false, speed: 40, size_min: 0.1, sync: false } },
      line_linked: { enable: true, distance: 150, color, opacity: 0.2, width: 1 },
      move: { enable: true, speed: 2, direction: "none", random: false, straight: false, out_mode: "out", attract: { enable: false, rotateX: 600, rotateY: 1200 } },
    },
    interactivity: {
      detect_on: "window",
      events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: false, mode: "push" }, resize: true },
      modes: {
        grab: { distance: 140, line_linked: { opacity: 0.5 } },
        bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
        repulse: { distance: 200 },
        push: { particles_nb: 4 },
        remove: { particles_nb: 2 },
      },
    },
    retina_detect: true,
  };
}

function destroyParticles() {
  if (window.pJSDom && window.pJSDom.length > 0) {
    window.pJSDom[0].pJS.fn.vendors.destroypJS();
    window.pJSDom = [];
  }
}

function initParticles(isDark) {
  if (typeof window.particlesJS !== "function") return;
  destroyParticles();
  window.particlesJS("particles-js", getParticlesConfig(isDark));
}

/* ---- Navigation (scroll-based like abdullahr.com) ---- */

function setActiveNav(tab) {
  document.querySelectorAll(".nav-link, .mobile-nav-link").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tab);
  });
}

function scrollToSection(tab) {
  const id = tab === "say hi" ? "say-hi" : tab;
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

document.querySelectorAll(".nav-link, .mobile-nav-link").forEach((btn) => {
  btn.addEventListener("click", () => {
    scrollToSection(btn.dataset.tab);
    document.getElementById("mobile-menu").classList.remove("open");
  });
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        const tab = id === "say-hi" ? "say hi" : id;
        setActiveNav(tab);

        if (id === "say-hi" && !mapInitialized) {
          initMap();
        }
      }
    });
  },
  { rootMargin: "-45% 0px -45% 0px" }
);

document.querySelectorAll("section.section-wrapper").forEach((section) => {
  sectionObserver.observe(section);
});

/* ---- Theme toggle ---- */

const app = document.getElementById("app");
const themeToggle = document.getElementById("theme-toggle");
const mobileThemeBtn = document.getElementById("mobile-theme-btn");

function applyTheme(isDark) {
  app.classList.toggle("dark-mode", isDark);
  app.classList.toggle("light-mode", !isDark);
  document.documentElement.classList.toggle("dark-theme", isDark);
  document.documentElement.classList.toggle("light-theme", !isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");
  initParticles(isDark);
  updateMapStyle(isDark);
}

function toggleTheme() {
  applyTheme(!app.classList.contains("dark-mode"));
}

themeToggle.addEventListener("click", toggleTheme);
mobileThemeBtn.addEventListener("click", toggleTheme);

const savedTheme = localStorage.getItem("theme");
applyTheme(savedTheme !== "light");

/* ---- Mobile menu ---- */

const hamburger = document.getElementById("hamburger-btn");
const mobileMenu = document.getElementById("mobile-menu");

hamburger.addEventListener("click", () => {
  mobileMenu.classList.toggle("open");
});

/* ---- Life carousel ---- */

const carousel = document.getElementById("life-carousel");
const lifePrev = document.getElementById("life-prev");
const lifeNext = document.getElementById("life-next");
let carouselPointerDown = false;
let carouselDragged = false;
let carouselStartX = 0;

if (carousel) {
  carousel.addEventListener("pointerdown", (e) => {
    carouselPointerDown = true;
    carouselDragged = false;
    carouselStartX = e.clientX;
  });

  carousel.addEventListener("pointermove", (e) => {
    if (carouselPointerDown && Math.abs(e.clientX - carouselStartX) > 8) {
      carouselDragged = true;
    }
  });

  carousel.addEventListener("pointerup", () => {
    carouselPointerDown = false;
  });

  carousel.addEventListener("pointercancel", () => {
    carouselPointerDown = false;
  });
}

lifePrev.addEventListener("click", () => {
  carousel.scrollBy({ left: -320, behavior: "smooth" });
});

lifeNext.addEventListener("click", () => {
  carousel.scrollBy({ left: 320, behavior: "smooth" });
});

/* ---- Project filters ---- */

const filterBtns = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card-2");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    projectCards.forEach((card) => {
      const categories = card.dataset.category || "";
      const show = filter === "all" || categories.includes(filter);
      card.style.display = show ? "" : "none";
    });
  });
});

/* ---- Media modal ---- */

const imageModal = document.getElementById("image-modal");
const imageModalContent = document.getElementById("image-modal-content");
const imageModalClose = document.getElementById("image-modal-close");
const modalImage = document.getElementById("modal-image");
const modalLocation = document.getElementById("modal-location");
const modalContext = document.getElementById("modal-context");

function getFullImageSrc(img) {
  const src = img.getAttribute("data-full-src") || img.currentSrc || img.src;
  return src.split("?")[0];
}

function openImageModal({ src, alt, title, context }) {
  if (!imageModal || !modalImage) return;
  modalImage.src = src;
  modalImage.alt = alt;
  modalLocation.textContent = title;
  modalContext.textContent = context || "";
  imageModal.classList.remove("hidden");
  imageModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeImageModal() {
  if (!imageModal || !modalImage) return;
  imageModal.classList.add("hidden");
  imageModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  modalImage.removeAttribute("src");
}

function openLifePhoto(card) {
  const img = card.querySelector("img");
  if (!img) return;
  openImageModal({
    src: getFullImageSrc(img),
    alt: img.alt,
    title: card.dataset.caption || img.alt,
    context: "",
  });
}

document.querySelectorAll(".city-item").forEach((item) => {
  item.addEventListener("click", () => {
    const img = item.querySelector("img");
    openImageModal({
      src: getFullImageSrc(img),
      alt: img.alt,
      title: item.dataset.location || img.alt,
      context: item.dataset.context || "",
    });
  });
});

document.querySelectorAll(".life-carousel-card img").forEach((img) => {
  img.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (carouselDragged) {
      carouselDragged = false;
      return;
    }
    const card = img.closest(".life-carousel-card");
    if (card) openLifePhoto(card);
  });
});

document.querySelectorAll(".life-carousel-card").forEach((card) => {
  card.addEventListener("click", (e) => {
    if (e.target.closest("img")) return;
    if (carouselDragged) {
      carouselDragged = false;
      return;
    }
    openLifePhoto(card);
  });

  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openLifePhoto(card);
    }
  });
});

if (imageModal) {
  imageModal.addEventListener("click", closeImageModal);
}
if (imageModalContent) {
  imageModalContent.addEventListener("click", (e) => e.stopPropagation());
}
if (imageModalClose) {
  imageModalClose.addEventListener("click", (e) => {
    e.stopPropagation();
    closeImageModal();
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !imageModal.classList.contains("hidden")) {
    closeImageModal();
  }
});

/* ---- Contact form ---- */

const contactForm = document.getElementById("contact-form");
const formError = document.getElementById("form-error");
const formSuccess = document.getElementById("form-success");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  formError.classList.add("hidden");
  formSuccess.classList.add("hidden");

  const formData = new FormData(contactForm);
  const name = formData.get("name") || "Anonymous";
  const email = formData.get("email") || "not provided";
  const message = formData.get("message");

  const subject = encodeURIComponent(`Message from ${name}`);
  const body = encodeURIComponent(`From: ${name} (${email})\n\n${message}`);
  window.location.href = `mailto:eugenevorob@gmail.com?subject=${subject}&body=${body}`;

  formSuccess.classList.remove("hidden");
  contactForm.reset();
});

/* ---- Local time ---- */

function updateLocalTime() {
  const el = document.getElementById("local-time");
  if (!el) return;
  const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Toronto",
  });
  el.textContent = `${time.toLowerCase()} est`;
}

updateLocalTime();
setInterval(updateLocalTime, 60000);

/* ---- Map (Mapbox GL — abdullahr.com) ---- */

const MAPBOX_TOKEN = "pk.eyJ1Ijoiam9obmplZXQiLCJhIjoiY21rc3o5dzByMWpwczNkb2Y5azlwd3llayJ9.JXJtvIhO7JGiekFtAvTZ5w";
const MAP_CENTER = [-79.3832, 43.6532]; // toronto

let mapExpanded = false;

function getMapFog(isDark) {
  return isDark
    ? {
        color: "rgb(10, 10, 20)",
        "high-color": "rgb(20, 20, 40)",
        "horizon-blend": 0.05,
        "space-color": "rgb(5, 5, 10)",
        "star-intensity": 0.2,
      }
    : {
        color: "rgb(255, 255, 255)",
        "high-color": "rgb(200, 200, 250)",
        "horizon-blend": 0.05,
        "space-color": "rgb(240, 240, 255)",
        "star-intensity": 0,
      };
}

function updateMapStyle(isDark) {
  if (!mapInstance) return;
  const style = isDark
    ? "mapbox://styles/mapbox/dark-v11"
    : "mapbox://styles/mapbox/light-v11";
  mapInstance.setStyle(style);
  mapInstance.once("style.load", () => {
    mapInstance.setFog(getMapFog(isDark));
  });
}

function initMap() {
  if (mapInitialized || typeof mapboxgl === "undefined") return;
  mapInitialized = true;

  mapboxgl.accessToken = MAPBOX_TOKEN;

  const isDark = app.classList.contains("dark-mode");

  mapInstance = new mapboxgl.Map({
    container: "map",
    style: isDark
      ? "mapbox://styles/mapbox/dark-v11"
      : "mapbox://styles/mapbox/light-v11",
    projection: "globe",
    center: MAP_CENTER,
    zoom: 1.2,
    interactive: true,
  });

  mapInstance.on("style.load", () => {
    mapInstance.setFog(getMapFog(isDark));
    setTimeout(() => mapInstance.resize(), 200);
  });

  const markerEl = document.createElement("div");
  markerEl.className = "custom-marker";
  new mapboxgl.Marker({ element: markerEl })
    .setLngLat(MAP_CENTER)
    .addTo(mapInstance);
}

const mapPanel = document.getElementById("map-panel");
const mapExpandBtn = document.getElementById("map-expand-btn");

mapExpandBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  mapExpanded = !mapExpanded;
  mapPanel.classList.toggle("expanded", mapExpanded);
  mapExpandBtn.textContent = mapExpanded ? "minimize" : "expand";
  mapExpandBtn.title = mapExpanded ? "Minimize" : "Expand";
  setTimeout(() => {
    if (mapInstance) mapInstance.resize();
  }, 300);
});

/* ---- Profile easter egg ---- */

const profileClick = document.getElementById("profile-click");
const messages = [
  "👋 hey, thanks for visiting!",
  "building robots & software @ tmu",
  "always down to chat about robotics",
];

let msgIndex = 0;
profileClick.addEventListener("click", () => {
  let existing = profileClick.querySelector(".secret-message");
  if (existing) existing.remove();

  const msg = document.createElement("p");
  msg.className = "secret-message";
  msg.textContent = messages[msgIndex % messages.length];
  msg.style.cssText =
    "position:absolute;top:100%;left:0;width:100%;margin-top:0.5rem;font-size:0.8rem;color:#888;text-align:center;animation:fadeIn 0.5s ease;";
  profileClick.appendChild(msg);
  msgIndex++;

  setTimeout(() => msg.remove(), 3000);
});
