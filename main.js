document.addEventListener('DOMContentLoaded', () => {
    
    // Sticky Header Logic
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Initial check for sticky header in case page is reloaded halfway down
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    }

    // Scroll Animations using Intersection Observer
    const animatedElements = document.querySelectorAll('.animate-fade-up');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once it's visible
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Add animation classes to elements dynamically for scroll reveal
    const sectionsToAnimate = [
        '.section-title',
        '.section-subtitle',
        '.section-desc',
        '.stat-item',
        '.split-col',
        '.gallery-item',
        '.specs-image',
        '.specs-content'
    ];

    sectionsToAnimate.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.classList.add('animate-fade-up');
            observer.observe(el);
        });
    });
    
});
