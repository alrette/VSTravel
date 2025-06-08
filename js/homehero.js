document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.hero-slideshow img.slide');
    let currentIndexImage = 0;

    if (slides.length === 0) {
        console.error('No slides found');
        return;
    }

    function changeImage() {
        slides[currentIndexImage].classList.remove('active'); // Fade out current
        currentIndexImage = (currentIndexImage + 1) % slides.length;
        slides[currentIndexImage].classList.add('active'); // Fade in next
    }

    // Set initial slide
    slides[currentIndexImage].classList.add('active');

    // Change every 3.8 seconds
    setInterval(changeImage, 3800);
});