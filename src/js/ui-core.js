// --- Portfolio Item Hover Preview ---
const portfolioItems = document.querySelectorAll(".terminal-item");
const previewContainer = document.getElementById("project-preview");
const previewImage = document.getElementById("preview-image");
if (portfolioItems.length > 0 && previewContainer) {
    // Preload portfolio screenshots for instant hover display on desktop
    window.addEventListener("load", () => {
        if (window.innerWidth >= 768) {
            const preload = () => {
                portfolioItems.forEach((item) => {
                    const screenshot = item.getAttribute("data-screenshot");
                    if (screenshot) {
                        const img = new Image();
                        img.src = screenshot;
                    }
                });
            };
            if ("requestIdleCallback" in window) {
                requestIdleCallback(preload, { timeout: 2000 });
            } else {
                setTimeout(preload, 1000);
            }
        }
    });

    const OFFSET_X = 20;
    const OFFSET_Y = 20;
    document.addEventListener("mousemove", (e) => {
        if (previewContainer.classList.contains("visible")) {
            previewContainer.style.left = e.clientX + "px";
            previewContainer.style.top = e.clientY + "px";
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const previewHeight = previewContainer.offsetHeight;
            if (e.clientX > viewportWidth * 0.8) {
                previewContainer.style.setProperty(
                    "--p-x",
                    `calc(-100% - ${OFFSET_X}px)`,
                );
            } else {
                previewContainer.style.setProperty("--p-x", `${OFFSET_X}px`);
            }
            if (e.clientY + previewHeight + OFFSET_Y > viewportHeight) {
                previewContainer.style.setProperty(
                    "--p-y",
                    `calc(-100% - ${OFFSET_Y}px)`,
                );
            } else {
                previewContainer.style.setProperty("--p-y", `${OFFSET_Y}px`);
            }
        }
    });
    portfolioItems.forEach((item) => {
        item.addEventListener("mouseenter", (e) => {
            const screenshot = item.getAttribute("data-screenshot");
            if (screenshot) {
                if (previewImage) previewImage.src = screenshot;
                previewContainer.style.left = e.clientX + "px";
                previewContainer.style.top = e.clientY + "px";
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                if (e.clientX > viewportWidth * 0.8) {
                    previewContainer.style.setProperty(
                        "--p-x",
                        `calc(-100% - ${OFFSET_X}px)`,
                    );
                } else {
                    previewContainer.style.setProperty("--p-x", `${OFFSET_X}px`);
                }
                if (e.clientY > viewportHeight * 0.7) {
                    previewContainer.style.setProperty(
                        "--p-y",
                        `calc(-100% - ${OFFSET_Y}px)`,
                    );
                } else {
                    previewContainer.style.setProperty("--p-y", `${OFFSET_Y}px`);
                }
                previewContainer.classList.add("visible");
            }
        });
        item.addEventListener("mouseleave", () => {
            previewContainer.classList.remove("visible");
        });
    });
}

// --- Horizontal Scrolling Handling ---
let isScrolling = false;
window.addEventListener(
    "wheel",
    (e) => {
        if (window.innerWidth < 768) return;
        const scrollContainer = document.querySelector("main");
        if (!scrollContainer) return;
        if (Math.abs(e.deltaY) < 10) return;
        e.preventDefault();
        if (isScrolling) return;
        const direction = e.deltaY > 0 ? 1 : -1;
        const width = window.innerWidth;
        const currentScroll = scrollContainer.scrollLeft;
        const currentIndex = Math.round(currentScroll / width);
        const targetIndex = currentIndex + direction;
        const sections = document.querySelectorAll("section");
        if (targetIndex >= 0 && targetIndex < sections.length) {
            isScrolling = true;
            sections[targetIndex].scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "start",
            });
            setTimeout(() => {
                isScrolling = false;
            }, 600);
        }
    },
    { passive: false },
);
window.addEventListener("keydown", (e) => {
    if (window.innerWidth < 768) return;
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const scrollContainer = document.querySelector("main");
        if (!scrollContainer) return;
        e.preventDefault();
        if (isScrolling) return;
        const direction = e.key === "ArrowRight" ? 1 : -1;
        const width = window.innerWidth;
        const currentScroll = scrollContainer.scrollLeft;
        const currentIndex = Math.round(currentScroll / width);
        const targetIndex = currentIndex + direction;
        const sections = document.querySelectorAll("section");
        if (targetIndex >= 0 && targetIndex < sections.length) {
            isScrolling = true;
            sections[targetIndex].scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "start",
            });
            setTimeout(() => {
                isScrolling = false;
            }, 600);
        }
    }
});

// --- Smooth Scrolling for Navigation Links ---
document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll("nav a:not(#toggle-panel)");
    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("href").substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                    inline: "start",
                });
            }
        });
    });
});
