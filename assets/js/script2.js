// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Reveal animations on scroll
const revealElements = document.querySelectorAll('.project-single, .degree-block');

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 100;
    
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Initial state for animation
revealElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'all 0.6s ease-out';
});

window.addEventListener('scroll', revealOnScroll);
// Trigger once on load
revealOnScroll();

// Carousel logic - Dynamic Aspect Ratios based on actual media size
function updateCarouselRatio(carousel, activeSlide) {
    const media = activeSlide.querySelector('img') || activeSlide.querySelector('video');
    if (!media) return;

    const setRatio = () => {
        let width = media.naturalWidth || media.videoWidth;
        let height = media.naturalHeight || media.videoHeight;
        
        if (width && height) {
            carousel.style.aspectRatio = `${width} / ${height}`;
        } else {
            carousel.style.aspectRatio = '4/3'; // fallback
        }
    };

    if (media.tagName === 'IMG') {
        if (media.complete) {
            setRatio();
        } else {
            media.onload = setRatio;
        }
    } else {
        if (media.readyState >= 1) {
            setRatio();
        } else {
            media.onloadedmetadata = setRatio;
        }
    }
}

window.goToSlide = function(carouselId, index) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.carousel-slide');
    const indicators = carousel.querySelectorAll('.carousel-indicator');
    
    // Update active states
    slides.forEach((slide, i) => {
        if (i === index) {
            slide.classList.add('active');
            updateCarouselRatio(carousel, slide);
        } else {
            slide.classList.remove('active');
        }
    });
    
    indicators.forEach((indicator, i) => {
        if (i === index) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
    
    carousel.dataset.currentIndex = index;
};

window.nextSlide = function(carouselId) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.carousel-slide');
    let currentIndex = parseInt(carousel.dataset.currentIndex || 0);
    
    currentIndex = (currentIndex + 1) % slides.length;
    goToSlide(carouselId, currentIndex);
};

window.prevSlide = function(carouselId) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.carousel-slide');
    let currentIndex = parseInt(carousel.dataset.currentIndex || 0);
    
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    goToSlide(carouselId, currentIndex);
};

// Initialize carousels on load
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.carousel').forEach(carousel => {
        const firstSlide = carousel.querySelector('.carousel-slide.active');
        if (firstSlide) {
            updateCarouselRatio(carousel, firstSlide);
        }
    });
});
