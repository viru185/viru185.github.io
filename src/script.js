const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".site-nav__list a");
const projectGrid = document.querySelector("[data-project-grid]");
const currentYearTarget = document.querySelector("[data-current-year]");

let ticking = false;

const setHeaderState = () => {
  if (!header) return;
  const shouldCondense = window.scrollY > 32;
  header.classList.toggle("is-condensed", shouldCondense);
};

const requestHeaderUpdate = () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      setHeaderState();
      ticking = false;
    });
    ticking = true;
  }
};

const closeNavigation = () => {
  if (!header) return;
  header.classList.remove("is-open");
  navToggle?.setAttribute("aria-expanded", "false");
};

const toggleNavigation = () => {
  if (!header) return;
  const isOpen = header.classList.toggle("is-open");
  navToggle?.setAttribute("aria-expanded", String(isOpen));
};

const createProjectCard = (project) => {
  const card = document.createElement("article");
  card.className = "project-card";

  const badge = document.createElement("span");
  badge.className = "project-card__badge";
  badge.textContent =
    project.visibility === "public" ? "Open Source" : "Client Project";
  card.appendChild(badge);

  const title = document.createElement("h3");
  title.className = "project-card__title";
  title.textContent = project.name;
  card.appendChild(title);

  if (project.image) {
    const figure = document.createElement("figure");
    figure.className = "project-card__image";

    const img = document.createElement("img");
    img.src = project.image;
    img.alt = `${project.name} preview`;
    img.loading = "lazy";
    img.decoding = "async";
    img.addEventListener("error", () => {
      img.remove();
      figure.appendChild(createPlaceholder());
    });

    figure.appendChild(img);
    card.appendChild(figure);
  } else {
    const figure = document.createElement("figure");
    figure.className = "project-card__image";
    figure.appendChild(createPlaceholder());
    card.appendChild(figure);
  }

  const description = document.createElement("p");
  description.className = "project-card__description";
  description.textContent = project.description;
  card.appendChild(description);

  if (project.tech?.length) {
    const techList = document.createElement("div");
    techList.className = "project-card__tech";
    project.tech.forEach((item) => {
      const tag = document.createElement("span");
      tag.textContent = item;
      techList.appendChild(tag);
    });
    card.appendChild(techList);
  }

  const links = document.createElement("div");
  links.className = "project-card__links";
  if (project.deployment) {
    links.appendChild(createLink(project.deployment, "Live Demo"));
  }
  if (project.source) {
    links.appendChild(createLink(project.source, "Source Code"));
  } else if (project.visibility === "private") {
    const note = document.createElement("span");
    note.textContent = "Source unavailable";
    note.setAttribute("aria-label", `${project.name} is a private repository`);
    links.appendChild(note);
  }
  if (links.childElementCount) {
    card.appendChild(links);
  }

  if (project.tags?.length) {
    const tags = document.createElement("div");
    tags.className = "project-card__tags";
    project.tags.forEach((tagText) => {
      const tag = document.createElement("span");
      tag.className = "project-card__tag";
      tag.textContent = tagText;
      tags.appendChild(tag);
    });
    card.appendChild(tags);
  }

  return card;
};

const createLink = (href, label) => {
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.target = "_blank";
  anchor.rel = "noopener";
  anchor.textContent = label;
  return anchor;
};

const createPlaceholder = () => {
  const placeholder = document.createElement("div");
  placeholder.className = "project-card__placeholder";
  placeholder.textContent = "Preview coming soon";
  return placeholder;
};

const renderProjects = async () => {
  if (!projectGrid) return;

  try {
    const response = await fetch("src/data/projects.json");
    if (!response.ok) {
      throw new Error(`Failed to load projects: ${response.statusText}`);
    }
    const projects = await response.json();

    projectGrid.innerHTML = "";
    projects.forEach((project) => {
      const card = createProjectCard(project);
      projectGrid.appendChild(card);
    });
  } catch (error) {
    const message = document.createElement("p");
    message.className = "projects__error";
    message.textContent =
      "Unable to load projects right now. Please refresh or try again later.";
    projectGrid.appendChild(message);
    console.error(error);
  }
};

const initContactFormHint = () => {
  const contactForm = document.querySelector(".contact__form");
  if (!contactForm) return;

  contactForm.addEventListener("submit", (event) => {
    const endpoint = contactForm.getAttribute("action") ?? "";
    if (endpoint.includes("{your-id}")) {
      event.preventDefault();
      alert(
        "Update the contact form endpoint before submitting. Replace {your-id} with your Formspree ID."
      );
    }
  });
};

const updateCurrentYear = () => {
  if (currentYearTarget) {
    currentYearTarget.textContent = new Date().getFullYear().toString();
  }
};

if (navToggle) {
  navToggle.addEventListener("click", toggleNavigation);
}

if (navLinks.length) {
  navLinks.forEach((link) => {
    link.addEventListener("click", closeNavigation);
  });
}

document.addEventListener("click", (event) => {
  if (!header?.classList.contains("is-open")) return;
  if (header.contains(event.target)) return;
  closeNavigation();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && header?.classList.contains("is-open")) {
    closeNavigation();
  }
});

window.addEventListener("scroll", requestHeaderUpdate, { passive: true });
window.addEventListener("load", setHeaderState, { once: true });

renderProjects();
initContactFormHint();
updateCurrentYear();
