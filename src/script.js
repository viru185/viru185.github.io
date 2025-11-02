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
const TECH_ICON_SOURCE = "src/data/tech-icons.json";
const PREVIEW_PLACEHOLDERS = {
    "coming-soon": {
        label: "Preview coming soon",
        icon: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 3a9 9 0 1 0 .1 0Zm0 2a7 7 0 1 1-7 7h2a5 5 0 1 0 5-5V5Z"/></svg>'
    },
    unavailable: {
        label: "No preview available",
        icon: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 4.3 4.3 3l17 17-1.3 1.3-2.6-2.6a10.4 10.4 0 0 1-5.3 1.6c-4.7 0-8.8-3-11-7.3 1-1.9 2.2-3.6 3.8-4.9L3 4.3Zm3.6 3.6A8.6 8.6 0 0 0 4 12c1.8 3.5 5 5.7 8.5 5.7 1.4 0 2.7-.4 3.9-1.1l-9.8-9.7Zm6-4.9c4.7 0 8.8 3 11 7.3a15 15 0 0 1-3.6 4.7l-1.4-1.4A8.6 8.6 0 0 0 20 12c-1.8-3.5-5-5.7-8.5-5.7-1.2 0-2.4.3-3.4.8l-1.4-1.4a10.4 10.4 0 0 1 4.9-1.7Z"/></svg>'
    }
};

const ACTION_ICONS = {
    live: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm1 2.2c2.1.3 3.8 2 4.1 4.1h-4.1V5.2Zm-2 0v4.1H6.9C7.2 7 8.9 5.3 11 5.2Zm-4.1 6H11v4.1c-2.1-.2-3.8-1.9-4.1-4.1Zm6 4.1V11H17c-.3 2.1-2 3.8-4.1 4.1Z"/></svg>',
    production: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M5.5 3A1.5 1.5 0 0 0 4 4.5V21h4v-3h8v3h4V4.5A1.5 1.5 0 0 0 18.5 3h-13Zm2.5 3h2v3h-2V6Zm4 0h2v3h-2V6ZM8 11h8v2H8v-2Zm0 4h8v2H8v-2Z"/></svg>',
    code: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="m8.3 5.7 1.4 1.4L6.4 12l3.3 4.9-1.4 1.4L4 12l4.3-6.3Zm7.4 0L20 12l-4.3 6.3-1.4-1.4 3.3-4.9-3.3-4.9 1.4-1.4Z"/></svg>',
    private: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a4 4 0 0 1 4 4v2h1.5A2.5 2.5 0 0 1 20 10.5v7A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-7A2.5 2.5 0 0 1 6.5 8H8V6a4 4 0 0 1 4-4Zm0 2a2 2 0 0 0-2 2v2h4V6a2 2 0 0 0-2-2Zm-3.5 6a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5h-7Z"/></svg>'
};

let techIconCache = null;

let ticking = false;

const parseSVG = (markup) => {
    const template = document.createElement("template");
    template.innerHTML = markup.trim();
    return template.content.firstElementChild;
};

const loadTechIcons = async () => {
    if (techIconCache) return techIconCache;
    const response = await fetch(TECH_ICON_SOURCE);
    if (!response.ok) {
        throw new Error(`Failed to load tech icons: ${response.statusText}`);
    }
    techIconCache = await response.json();
    return techIconCache;
};

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
            const iconMarkup = techIconCache?.[item];
            if (iconMarkup) {
                const iconNode = parseSVG(iconMarkup);
                iconNode.classList.add("project-card__tech-icon");
                iconNode.setAttribute("aria-hidden", "true");
                tag.appendChild(iconNode);
            }
            const label = document.createElement("span");
            label.textContent = item;
            tag.appendChild(label);
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
        const deploymentType =
            project.visibility === "private" ? "production" : "live";
        const deploymentLabel =
            project.visibility === "private" ? "Production Site" : "Live Demo";
        links.appendChild(
            createActionLink(deploymentType, project.deployment, deploymentLabel)
        );
    }
    if (project.source) {
        links.appendChild(createActionLink("code", project.source, "Source Code"));
    } else if (project.visibility === "private") {
        links.appendChild(
            createActionInfo("private", "Client delivery (confidential)")
        );
    }
    if (links.childElementCount) {
        card.appendChild(links);
    }

    return card;
};

const createActionLink = (type, href, label) => {
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.target = "_blank";
    anchor.rel = "noopener";
    anchor.className = `project-card__link project-card__link--${type}`;

    const iconMarkup = ACTION_ICONS[type] ?? ACTION_ICONS.live;
    const iconNode = parseSVG(iconMarkup);
    iconNode.classList.add("project-card__link-icon");
    iconNode.setAttribute("aria-hidden", "true");
    anchor.appendChild(iconNode);

    if (label) {
        const text = document.createElement("span");
        text.textContent = label;
        anchor.appendChild(text);
    }

    return anchor;
};

const createActionInfo = (type, label) => {
    const wrapper = document.createElement("span");
    wrapper.className = `project-card__link-info project-card__link-info--${type}`;
    const iconNode = parseSVG(ACTION_ICONS.private);
    iconNode.classList.add("project-card__link-icon");
    iconNode.setAttribute("aria-hidden", "true");
    wrapper.appendChild(iconNode);
    const text = document.createElement("span");
    text.textContent = label;
    wrapper.appendChild(text);
    return wrapper;
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
            figure.innerHTML = "";
            figure.appendChild(createProjectPlaceholder("unavailable"));
        });

        figure.appendChild(img);
    } else {
        const placeholderState = project.preview ?? "coming-soon";
        figure.appendChild(createProjectPlaceholder(placeholderState));
    }

    return figure;
};

const createProjectPlaceholder = (state) => {
    const details =
        PREVIEW_PLACEHOLDERS[state] ?? PREVIEW_PLACEHOLDERS["coming-soon"];
    const placeholder = document.createElement("div");
    placeholder.className = `project-card__placeholder project-card__placeholder--${state}`;

    const iconNode = parseSVG(details.icon);
    iconNode.classList.add("project-card__placeholder-icon");
    iconNode.setAttribute("aria-hidden", "true");
    placeholder.appendChild(iconNode);

    const label = document.createElement("span");
    label.textContent = details.label;
    placeholder.appendChild(label);

    return placeholder;
};

const renderProjects = async () => {
    if (!projectGrid) return;

    try {
        await loadTechIcons();
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
