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

revealElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'all 0.6s ease-out';
});

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// PERFECT SHAPESHIFTING CAROUSEL LOGIC
function updateCarouselRatio(carousel, activeSlide) {
    const media = activeSlide.querySelector('img, video');
    if (!media) return;
    
    if (media.tagName === 'VIDEO') {
        carousel.style.aspectRatio = '16 / 9';
        return;
    }
    
    const setRatio = () => {
        if (media.naturalWidth > 0 && media.naturalHeight > 0) {
            carousel.style.aspectRatio = `${media.naturalWidth} / ${media.naturalHeight}`;
        } else {
            // Safari cache bug: complete is true but naturalWidth is 0. Wait a frame.
            requestAnimationFrame(() => {
                if (media.naturalWidth > 0) {
                    carousel.style.aspectRatio = `${media.naturalWidth} / ${media.naturalHeight}`;
                } else {
                    // Force a reload of the image to trigger onload
                    const src = media.src;
                    media.src = '';
                    media.src = src;
                }
            });
        }
    };

    if (media.complete) {
        setRatio();
    }
    // Always attach load event just in case
    media.addEventListener('load', setRatio);
    // Also use an interval as a bulletproof fallback for Safari
    const checkInterval = setInterval(() => {
        if (media.naturalWidth > 0) {
            carousel.style.aspectRatio = `${media.naturalWidth} / ${media.naturalHeight}`;
            clearInterval(checkInterval);
        }
    }, 100);
    // Clear interval after 2 seconds to prevent infinite loops
    setTimeout(() => clearInterval(checkInterval), 2000);
}

window.goToSlide = function(carouselId, index) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.carousel-slide');
    const indicators = carousel.querySelectorAll('.carousel-indicator');
    
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

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.carousel').forEach(carousel => {
        const firstSlide = carousel.querySelector('.carousel-slide.active');
        if (firstSlide) {
            updateCarouselRatio(carousel, firstSlide);
        }
    });
});
