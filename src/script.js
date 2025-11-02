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

        const badgeIcon = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );
        badgeIcon.setAttribute("aria-hidden", "true");
        badgeIcon.setAttribute("focusable", "false");
        badgeIcon.setAttribute("width", "14");
        badgeIcon.setAttribute("height", "14");
        badgeIcon.setAttribute("viewBox", "0 0 16 16");

        const badgePath = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );
        if (project.visibility === "public") {
            badgePath.setAttribute(
                "d",
                "M8 0c1.07 0 2.041.42 2.759 1.104l.14.14.062.08a.5.5 0 0 1-.71.675l-.076-.066-.216-.205A3 3 0 0 0 5 4v2h6.5A2.5 2.5 0 0 1 14 8.5v5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 13.5v-5a2.5 2.5 0 0 1 2-2.45V4a4 4 0 0 1 4-4M4.5 7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7z"
            );
        } else {
            badgePath.setAttribute(
                "d",
                "M8 0a4 4 0 0 1 4 4v2.05a2.5 2.5 0 0 1 2 2.45v5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 13.5v-5a2.5 2.5 0 0 1 2-2.45V4a4 4 0 0 1 4-4M4.5 7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7zM8 1a3 3 0 0 0-3 3v2h6V4a3 3 0 0 0-3-3"
            );
        }
        badgePath.setAttribute("fill", "currentColor");
        badgeIcon.appendChild(badgePath);

        const badgeLabel = document.createElement("span");
        badgeLabel.textContent =
            project.visibility === "public" ? "Public" : "Private";

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
            .forEach((element) =>
                element.style.setProperty("--heat-strength", "0")
            );
        toggleLoader(false);
        loader?.remove();
    }
};

if (typeof prefersReducedMotion.addEventListener === "function") {
    prefersReducedMotion.addEventListener("change", handleReducedMotionChange);
} else if (typeof prefersReducedMotion.addListener === "function") {
    prefersReducedMotion.addListener(handleReducedMotionChange);
}
