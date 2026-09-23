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

// Carousel logic - Fixed Aspect Ratios based on explicit naming tags
function updateCarouselRatio(carousel, activeSlide) {
    const ratioType = activeSlide.getAttribute('data-ratio') || 'standard';
    
    // Explicitly follow rules for specific orientations
    if (ratioType === 'hor') {
        carousel.style.aspectRatio = '3/2';
    } else if (ratioType === 'ver') {
        carousel.style.aspectRatio = '3/4';
    } else if (ratioType === 'wide') {
        carousel.style.aspectRatio = '16/9';
    } else {
        carousel.style.aspectRatio = '4/3'; // Standard default
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
