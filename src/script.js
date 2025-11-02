const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".site-nav__list a");
const projectGrid = document.querySelector("[data-project-grid]");
const currentYearTarget = document.querySelector("[data-current-year]");
const loader = document.getElementById("site-loader");
const prefersReducedMotion =
    typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : { matches: false, addEventListener: null, addListener: null };
const HEAT_BOUND_ATTR = "data-heat-bound";

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

    const header = document.createElement("div");
    header.className = "project-card__header";

    const title = document.createElement("h3");
    title.className = "project-card__title heat-text";
    title.textContent = project.name;
    header.appendChild(title);

    if (project.visibility) {
        const badge = document.createElement("span");
        badge.className = "project-card__badge";
        badge.dataset.variant = project.visibility;

        const badgeIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        badgeIcon.setAttribute("aria-hidden", "true");
        badgeIcon.setAttribute("focusable", "false");
        badgeIcon.setAttribute("width", "14");
        badgeIcon.setAttribute("height", "14");
        badgeIcon.setAttribute("viewBox", "0 0 24 24");

        const badgePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        if (project.visibility === "public") {
            badgePath.setAttribute(
                "d",
                "M12 2.5A9.5 9.5 0 1 0 21.5 12 9.5 9.5 0 0 0 12 2.5Zm0 2a7.4 7.4 0 0 1 6.9 4.7H12a.8.8 0 0 0-.7.4l-2.7 4.8-1.2-2.4a.8.8 0 0 0-1.4.7l1.9 3.7a.8.8 0 0 0 1.4 0l3.1-5.7h7.5A7.5 7.5 0 1 1 12 4.5Z"
            );
        } else {
            badgePath.setAttribute(
                "d",
                "M5 5.5a2.5 2.5 0 0 1 2.5-2.5h9A2.5 2.5 0 0 1 19 5.5V9h-1.5V5.5A1 1 0 0 0 16.5 4.5h-9a1 1 0 0 0-1 1V18a1 1 0 0 0 1 1h5.9V20.5H7.5A2.5 2.5 0 0 1 5 18Z"
            );
        }
        badgePath.setAttribute("fill", "currentColor");
        badgeIcon.appendChild(badgePath);

        const badgeLabel = document.createElement("span");
        badgeLabel.textContent = project.visibility === "public" ? "Public" : "Private";

        badge.append(badgeIcon, badgeLabel);
        header.appendChild(badge);
    }

    card.appendChild(header);

    const media = createProjectMedia(project);
    card.appendChild(media);

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

    const links = document.createElement("div");
    links.className = "project-card__links";
    if (project.deployment) {
        links.appendChild(createLink(project.deployment, "Live Demo"));
    }
    if (project.source) {
        links.appendChild(createLink(project.source, "Source Code"));
    } else if (project.visibility === "private") {
        const note = document.createElement("span");
        note.textContent = "Private delivery";
        note.setAttribute(
            "aria-label",
            `${project.name} repository is private`
        );
        links.appendChild(note);
    }
    if (links.childElementCount) {
        card.appendChild(links);
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

const createProjectMedia = (project) => {
    const figure = document.createElement("figure");
    figure.className = "project-card__image";

    if (project.image) {
        const img = document.createElement("img");
        img.src = project.image;
        img.alt = `${project.name} preview`;
        img.loading = "lazy";
        img.decoding = "async";
        img.addEventListener("error", () => {
            img.remove();
            figure.appendChild(createProjectPlaceholder());
        });

        figure.appendChild(img);
        return figure;
    }

    figure.appendChild(createProjectPlaceholder());
    return figure;
};

const createProjectPlaceholder = () => {
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
        hydrateHeatText();
    } catch (error) {
        const message = document.createElement("p");
        message.className = "projects__error";
        message.textContent =
            "Unable to load projects right now. Please refresh or try again later.";
        projectGrid.appendChild(message);
        console.error(error);
    }
};

const toggleLoader = (shouldShow) => {
    if (!loader) return;
    loader.classList.toggle("is-hidden", !shouldShow);
    loader.setAttribute("aria-hidden", shouldShow ? "false" : "true");
};

const initContactForm = () => {
    const contactForm = document.querySelector(".contact-form");
    if (!contactForm) return;

    const statusTarget = contactForm.querySelector(".form-status");
    const submitButton = contactForm.querySelector(".submit-btn");

    const setStatus = (message, tone = "neutral") => {
        if (!statusTarget) return;
        statusTarget.textContent = message;
        statusTarget.dataset.tone = tone;
    };

    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!contactForm.action) return;

        submitButton?.classList.add("is-loading");
        if (submitButton) {
            submitButton.disabled = true;
        }
        setStatus("Sending...", "pending");

        try {
            const response = await fetch(contactForm.action, {
                method: (contactForm.method || "POST").toUpperCase(),
                body: new FormData(contactForm),
                headers: { Accept: "application/json" },
            });

            if (!response.ok) {
                const data = await response.json().catch(() => null);
                const message =
                    data?.errors?.map((error) => error.message).join(", ") ||
                    "Unable to send form right now. Please email me directly.";
                throw new Error(message);
            }

            setStatus("Thanks - I will get back to you soon.", "success");
            contactForm.reset();
        } catch (error) {
            console.error(error);
            setStatus(
                error instanceof Error
                    ? error.message
                    : "Oops, something went wrong. Please email me directly.",
                "error"
            );
        } finally {
            submitButton?.classList.remove("is-loading");
            if (submitButton) {
                submitButton.disabled = false;
            }
            window.setTimeout(() => setStatus("", "neutral"), 4500);
        }
    });
};

const updateCurrentYear = () => {
    if (currentYearTarget) {
        currentYearTarget.textContent = new Date().getFullYear().toString();
    }
};

const hydrateHeatText = () => {
    const heatElements = document.querySelectorAll(".heat-text");
    heatElements.forEach((element) => {
        if (!element.dataset.heat) {
            element.dataset.heat = (element.textContent || "").trim();
        }
        if (element.getAttribute(HEAT_BOUND_ATTR) === "true") {
            return;
        }

        element.setAttribute(HEAT_BOUND_ATTR, "true");

        element.addEventListener("pointermove", (event) => {
            if (prefersReducedMotion.matches) return;
            const rect = element.getBoundingClientRect();
            if (!rect.width || !rect.height) return;

            const relativeX = ((event.clientX - rect.left) / rect.width) * 100;
            const relativeY = ((event.clientY - rect.top) / rect.height) * 100;
            element.style.setProperty("--heat-x", `${relativeX}%`);
            element.style.setProperty("--heat-y", `${relativeY}%`);

            const distance = Math.hypot(relativeX - 50, relativeY - 50);
            const intensity = Math.max(0.2, 1 - Math.min(distance / 70, 1));
            element.style.setProperty("--heat-strength", intensity.toFixed(2));
        });

        element.addEventListener("pointerleave", () => {
            element.style.setProperty("--heat-strength", "0");
        });

        element.addEventListener("pointerout", () => {
            element.style.setProperty("--heat-strength", "0");
        });

        element.addEventListener("blur", () => {
            element.style.setProperty("--heat-strength", "0");
        });
    });
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
window.addEventListener(
    "load",
    () => {
        setHeaderState();
        if (!prefersReducedMotion.matches) {
            window.setTimeout(() => toggleLoader(false), 360);
        } else {
            toggleLoader(false);
            loader?.remove();
        }
    },
    { once: true }
);

renderProjects();
initContactForm();
updateCurrentYear();
hydrateHeatText();

if (!prefersReducedMotion.matches) {
    toggleLoader(true);
} else {
    toggleLoader(false);
    loader?.remove();
}

const handleReducedMotionChange = (event) => {
    if (event.matches) {
        document
            .querySelectorAll(".heat-text")
            .forEach((element) => element.style.setProperty("--heat-strength", "0"));
        toggleLoader(false);
        loader?.remove();
    }
};

if (typeof prefersReducedMotion.addEventListener === "function") {
    prefersReducedMotion.addEventListener("change", handleReducedMotionChange);
} else if (typeof prefersReducedMotion.addListener === "function") {
    prefersReducedMotion.addListener(handleReducedMotionChange);
}

