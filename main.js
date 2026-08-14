/**
 * Royal Green Farms — main.js
 * Handles: Sticky Header, Scroll Animations, Lightbox, Tabs, Form Submission
 */

document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================================
       1. STICKY HEADER
       ======================================================================= */
    const header = document.getElementById('header');

    const updateHeader = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader(); // Run on load in case page is reloaded mid-scroll


    /* =========================================================================
       2. SCROLL REVEAL ANIMATIONS — Intersection Observer
       ======================================================================= */
    const animatedElements = document.querySelectorAll('.animate-fade-up');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.12
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, observerOptions);

    // Observe pre-defined elements
    animatedElements.forEach(el => observer.observe(el));

    // Dynamically add animation to common section elements
    const sectionsToAnimate = [
        '.section-title',
        '.section-subtitle',
        '.section-desc',
        '.stat-item',
        '.split-col',
        '.gallery-item',
        '.specs-image',
        '.specs-content',
        '.form-card',
        '.map-container',
        '.material-card'
    ];

    sectionsToAnimate.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('animate-fade-up');
            observer.observe(el);
        });
    });


    /* =========================================================================
       3. IMAGE LIGHTBOX
       ======================================================================= */
    const lightboxModal   = document.getElementById('lightboxModal');
    const lightboxImg     = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose   = document.getElementById('lightboxClose');
    const lightboxBackdrop = document.getElementById('lightboxBackdrop');

    /**
     * Opens the lightbox with the given image src and caption text.
     * @param {string} src
     * @param {string} alt
     * @param {string} caption
     */
    const openLightbox = (src, alt, caption) => {
        lightboxImg.src = src;
        lightboxImg.alt = alt || '';
        lightboxCaption.textContent = caption || '';
        lightboxModal.removeAttribute('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    };

    /**
     * Closes the lightbox and resets state.
     */
    const closeLightbox = () => {
        lightboxModal.setAttribute('hidden', '');
        lightboxImg.src = '';
        document.body.style.overflow = '';
    };

    // Trigger lightbox from any .lightbox-trigger img
    document.querySelectorAll('.lightbox-trigger').forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            openLightbox(img.src, img.alt, img.dataset.caption || img.alt);
        });
    });

    // Trigger lightbox from the gallery zoom button
    document.querySelectorAll('.gallery-zoom-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const galleryItem = btn.closest('.gallery-item');
            const img = galleryItem ? galleryItem.querySelector('img') : null;
            if (img) {
                openLightbox(img.src, img.alt, img.dataset.caption || img.alt);
            }
        });
    });

    // Close on X button
    lightboxClose.addEventListener('click', closeLightbox);

    // Close on backdrop click
    lightboxBackdrop.addEventListener('click', closeLightbox);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !lightboxModal.hasAttribute('hidden')) {
            closeLightbox();
        }
    });


    /* =========================================================================
       4. TABBED DATA MODULES
       ======================================================================= */
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels  = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.tab;

            // Update button states
            tabButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            // Update panel visibility
            tabPanels.forEach(panel => {
                if (panel.id === targetId) {
                    panel.removeAttribute('hidden');
                    panel.classList.add('active');
                } else {
                    panel.setAttribute('hidden', '');
                    panel.classList.remove('active');
                }
            });
        });
    });


    /* =========================================================================
       5. SITE VISIT FORM — Lead Capture with Validation
       ======================================================================= */
    const form        = document.getElementById('siteVisitForm');
    const formSuccess = document.getElementById('formSuccess');

    if (form) {
        // Set minimum date to today for the date picker
        const dateInput = document.getElementById('visitor-date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name  = document.getElementById('visitor-name').value.trim();
            const phone = document.getElementById('visitor-phone').value.trim();
            const date  = document.getElementById('visitor-date').value;

            // Basic validation
            if (!name || !phone || !date) {
                // Highlight empty required fields
                [['visitor-name', name], ['visitor-phone', phone], ['visitor-date', date]].forEach(([id, val]) => {
                    const el = document.getElementById(id);
                    if (!val) {
                        el.style.borderColor = '#e74c3c';
                        el.addEventListener('input', () => {
                            el.style.borderColor = '';
                        }, { once: true });
                    }
                });
                return;
            }

            // Success: hide the form, show the success message
            form.style.display = 'none';
            formSuccess.classList.add('visible');

            // Log the data (replace with actual API call / mailto / etc.)
            console.log('Site Visit Booked:', { name, phone, date });
        });
    }

    /* =========================================================================
       6. HERO VIDEO PLAYLIST
       ======================================================================= */
    const heroVideo = document.getElementById('heroVideo');
    if (heroVideo) {
        const videos = [
            { src: 'assets/1st.mp4', duration: 3000 },
            { src: 'assets/Real_estate_walkthrough_video_202608141301.mp4', duration: 10000 }
        ];
        let currentVideoIndex = 0;

        const playNextVideo = () => {
            const currentVideo = videos[currentVideoIndex];
            heroVideo.src = currentVideo.src;
            heroVideo.load(); // Ensure the new source is loaded
            heroVideo.play().catch(e => console.log('Autoplay prevented:', e));

            setTimeout(() => {
                currentVideoIndex = (currentVideoIndex + 1) % videos.length;
                playNextVideo();
            }, currentVideo.duration);
        };

        // Start the sequence
        playNextVideo();
    }

});
