// Array of image paths with descriptive alt texts for accessibility
const imageSources = [
    { src: "Assets/Web/AboutUs/Marquee/1.jpg", alt: "m1" },
    { src: "Assets/Web/AboutUs/Marquee/2.jpg", alt: "m2" },
    { src: "Assets/Web/AboutUs/Marquee/3.jpg", alt: "m3" },
    { src: "Assets/Web/AboutUs/Marquee/4.jpg", alt: "m4" },
    { src: "Assets/Web/AboutUs/Marquee/5.jpg", alt: "m5" },
    { src: "Assets/Web/AboutUs/Marquee/6.jpg", alt: "m6" },
    { src: "Assets/Web/AboutUs/Marquee/7.jpg", alt: "m7" },
    { src: "Assets/Web/AboutUs/Marquee/8.jpg", alt: "m8" },
    { src: "Assets/Web/AboutUs/Marquee/9.jpg", alt: "m9" },
    { src: "Assets/Web/AboutUs/Marquee/11.jpg", alt: "m10" },
    { src: "Assets/Web/AboutUs/Marquee/12.jpg", alt: "m11" },
    { src: "Assets/Web/AboutUs/Marquee/13.jpg", alt: "m12" }
];

// Create marquee content with optimized image loading
function createMarqueeContent(images, reverse = false) {
    const div = document.createElement("div");
    div.className = `marquee-content${reverse ? " reverse" : ""}`;
    div.setAttribute("aria-hidden", "true"); // Hide from screen readers since it's decorative

    images.forEach(({ src, alt }) => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = alt;
        img.loading = "lazy"; // Lazy load images for performance so they just loaded when they are needed :p
        img.decoding = "async"; 
        div.appendChild(img);
    });

    return div;
}

// Initialize marquee with error handling and performance optimization
function initializeMarquee() {
    const marqueeContainer = document.querySelector(".marquee");

    if (!marqueeContainer) {
        console.error("Marquee container not found");
        return;
    }

    // Use document fragment to minimize DOM reflows
    const fragment = document.createDocumentFragment();

  // Create two rows for continuous scrolling effect
    for (let i = 0; i < 2; i++) {
        const row = document.createElement("div");
        row.className = "marquee-row";
        row.setAttribute("role", "presentation"); // Indicate decorative purpose

        const isReverse = i === 1;
        row.appendChild(createMarqueeContent(imageSources, isReverse));
        row.appendChild(createMarqueeContent(imageSources, isReverse)); // Duplicate for seamless loop

    fragment.appendChild(row);
    } 

    marqueeContainer.appendChild(fragment);
}

document.addEventListener("DOMContentLoaded", () => {
    try {
        initializeMarquee();
    } catch (error) {
    console.error("Failed to initialize marquee:", error);
    }
});

document.addEventListener("visibilitychange", () => {
    const marquee = document.querySelector(".marquee");
    if (marquee) {
        marquee.style.animationPlayState = document.hidden ? "paused" : "running";
    }
});