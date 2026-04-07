// Central configuration area for quick updates to contact links and image URLs.
const siteConfig = {
  contact: {
    email: "Colton.SharpsConsulting@gmail.com",
    phoneDisplay: "806.673.6610",
    phoneRaw: "18066736610",
    linkedin: "",
    github: "",
    resume: ""
  },
  imageSlots: {
    "hero-signal": {
      src: "Futuristic professional portrait in blue glow.png",
      alt: "Portrait of Colton H. Sharp with a blue illuminated backdrop",
      caption: "Profile avatar"
    },
    "featured-case-study": {
      src: "",
      alt: "Featured proof asset for Colton H. Sharp",
      caption: "Featured proof"
    },
    "workflow-dashboard": {
      src: "",
      alt: "Workflow or dashboard image",
      caption: "Workflow systems"
    },
    "infrastructure-environment": {
      src: "",
      alt: "Infrastructure or systems support image",
      caption: "Infrastructure support"
    },
    "instructional-system": {
      src: "",
      alt: "Instructional systems image",
      caption: "Instructional systems"
    },
    "operations-planning": {
      src: "",
      alt: "Operations planning image",
      caption: "Operations planning"
    },
    "gallery-certificate": {
      src: "",
      alt: "Certificate or credential image",
      caption: "Credential"
    },
    "gallery-dashboard": {
      src: "",
      alt: "Dashboard or analytics screenshot",
      caption: "Dashboard"
    },
    "gallery-classroom": {
      src: "",
      alt: "Classroom or lab environment image",
      caption: "Environment"
    },
    "gallery-diagram": {
      src: "",
      alt: "System diagram or workflow image",
      caption: "Diagram"
    },
    "gallery-brand": {
      src: "",
      alt: "Brand or flagship composition image",
      caption: "Brand composition"
    },
    "gallery-portrait": {
      src: "",
      alt: "Professional portrait image",
      caption: "Portrait"
    }
  }
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const navToggle = document.querySelector(".nav-toggle");
const navLinks = [...document.querySelectorAll("#mainNav a")];
const sections = [...document.querySelectorAll("main section[id]")];

const linkResolvers = {
  email: () => `mailto:${siteConfig.contact.email}`,
  phone: () => `tel:${siteConfig.contact.phoneRaw}`,
  linkedin: () => siteConfig.contact.linkedin,
  github: () => siteConfig.contact.github,
  resume: () => siteConfig.contact.resume
};

function applyContactConfig() {
  const fieldMap = {
    email: siteConfig.contact.email,
    phoneDisplay: siteConfig.contact.phoneDisplay
  };

  document.querySelectorAll("[data-field]").forEach((field) => {
    const key = field.dataset.field;
    field.textContent = fieldMap[key] || "";
  });

  document.querySelectorAll("[data-link]").forEach((element) => {
    const key = element.dataset.link;
    const href = linkResolvers[key]?.();

    if (href) {
      element.href = href;
      element.classList.remove("is-disabled");
      element.removeAttribute("aria-disabled");
      return;
    }

    element.removeAttribute("href");
    element.setAttribute("aria-disabled", "true");
    element.classList.add("is-disabled");
  });
}

function renderMediaSlot(slot) {
  const slotId = slot.dataset.slot;
  const slotConfig = siteConfig.imageSlots[slotId] || {};
  const title = slot.dataset.title || slotId;
  const hint = slot.dataset.hint || "Add an image URL in script.js.";

  slot.innerHTML = "";

  if (slotConfig.src) {
    const image = document.createElement("img");
    image.src = slotConfig.src;
    image.alt = slotConfig.alt || title;
    image.loading = "lazy";
    image.decoding = "async";
    if (slotConfig.objectPosition) {
      image.style.objectPosition = slotConfig.objectPosition;
    }

    const caption = document.createElement("div");
    caption.className = "media-caption";
    caption.innerHTML = `
      <strong>${title}</strong>
      <span>${slotConfig.caption || hint}</span>
    `;

    slot.classList.add("has-image");
    slot.classList.remove("is-empty");
    slot.append(image, caption);
    return;
  }

  const placeholder = document.createElement("div");
  placeholder.className = "media-placeholder";
  placeholder.innerHTML = `
    <span class="media-slot-id">${slotId}</span>
    <strong>${title}</strong>
    <p>${hint}</p>
  `;

  slot.classList.remove("has-image");
  slot.classList.add("is-empty");
  slot.appendChild(placeholder);
}

function renderAllMediaSlots() {
  document.querySelectorAll(".media-slot").forEach(renderMediaSlot);
}

function setupRevealAnimations() {
  const revealElements = [...document.querySelectorAll(".reveal")];

  revealElements.forEach((element, index) => {
    element.style.setProperty("--delay", `${Math.min(index * 70, 240)}ms`);
  });

  if (prefersReducedMotion) {
    revealElements.forEach((element) => element.classList.add("visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.16 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

function setupActiveNavigation() {
  if (!sections.length) return;

  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });
  };

  const navObserver = new IntersectionObserver(
    (entries) => {
      const visibleSection = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visibleSection) {
        setActive(visibleSection.target.id);
      }
    },
    {
      rootMargin: "-38% 0px -45% 0px",
      threshold: [0.15, 0.35, 0.6]
    }
  );

  setActive(sections[0].id);
  sections.forEach((section) => navObserver.observe(section));
}

function closeNavigation() {
  document.body.classList.remove("nav-open");
  navToggle?.setAttribute("aria-expanded", "false");
}

function setupNavigationToggle() {
  if (!navToggle) return;

  navToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeNavigation);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) {
      closeNavigation();
    }
  });
}

function setFooterYear() {
  const year = document.getElementById("year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
}

applyContactConfig();
renderAllMediaSlots();
setupRevealAnimations();
setupActiveNavigation();
setupNavigationToggle();
setFooterYear();
