document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. INITIALIZATION & CAROUSELS --- */
    if (typeof emailjs !== 'undefined') {
        emailjs.init("YOUR_PUBLIC_KEY"); 
    }

    // Function to initialize Bootstrap carousels and force them to cycle
    const initCarousel = (selector, interval) => {
        const el = document.querySelector(selector);
        if (el && typeof bootstrap !== 'undefined') {
            const carouselInstance = new bootstrap.Carousel(el, { 
                interval: interval, 
                ride: 'carousel', 
                pause: 'hover' 
            });
            carouselInstance.cycle(); // Forces the carousel to start moving on its own
        }
    };
    
    // Initialize your specific carousels
    initCarousel('#certCarousel', 5000);
    initCarousel('#testimonialCarousel', 2000);

    /* --- 2. HEADER SCROLL EFFECT --- */
    const header = document.querySelector('.header-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* --- 3. CINEMATIC HERO SPOTLIGHTS --- */
    const hero = document.querySelector('.hero-gradient');
    if (hero) {
        const spotlight = document.createElement('div');
        Object.assign(spotlight.style, {
            position: 'absolute', top: '0', left: '0', width: '100%', height: '100%',
            pointerEvents: 'none', zIndex: '1',
            background: 'radial-gradient(circle at 50% 50%, #8b0000 0%, transparent 70%)',
            transition: 'opacity 1s ease-in-out'
        });
        hero.appendChild(spotlight);
        
        let angle1 = 0, angle2 = Math.PI;
        function animateHero() {
            angle1 += 0.012; angle2 += 0.015; 
            const x1 = 50 + Math.cos(angle1) * 38, y1 = 50 + Math.sin(angle1 * 0.9) * 28;
            const x2 = 50 + Math.cos(angle2 * 1.1) * 42, y2 = 50 + Math.sin(angle2) * 32;
            spotlight.style.background = `
                radial-gradient(circle at ${x1}% ${y1}%, rgba(139, 0, 0, 0.85) 0%, transparent 60%),
                radial-gradient(circle at ${x2}% ${y2}%, rgba(74, 4, 4, 0.7) 0%, transparent 55%)
            `;
            requestAnimationFrame(animateHero);
        }
        animateHero();
    }

    /* --- 4. DARK SECTION SPOTLIGHTS --- */
    const darkSection = document.querySelector('.dark-project-row');
    if (darkSection) {
        const darkSpotlight = document.createElement('div');
        Object.assign(darkSpotlight.style, {
            position: 'absolute', top: '0', left: '0', width: '100%', height: '100%',
            pointerEvents: 'none', zIndex: '0'
        });
        darkSection.prepend(darkSpotlight);
        
        let d1 = 0, d2 = Math.PI;
        function animateDark() {
            d1 += 0.007; d2 += 0.009; 
            const dx1 = 50 + Math.cos(d1) * 40, dy1 = 50 + Math.sin(d1 * 0.8) * 35;
            const dx2 = 50 + Math.cos(d2 * 1.1) * 40, dy2 = 50 + Math.sin(d2) * 35;
            darkSpotlight.style.background = `
                radial-gradient(circle at ${dx1}% ${dy1}%, rgba(139, 0, 0, 0.7) 0%, transparent 70%),
                radial-gradient(circle at ${dx2}% ${dy2}%, rgba(200, 0, 0, 0.45) 0%, transparent 65%)
            `;
            requestAnimationFrame(animateDark);
        }
        animateDark();
    }

    /* --- 5. REVEAL ELEMENTS (INTERSECTION OBSERVER) --- */
    const revealElements = document.querySelectorAll('.about-hero, .reveal, .reveal-left, .reveal-right, .skills-grid, .experience-wide-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                if (entry.target.classList.contains('skills-grid') || entry.target.querySelector('.skills-grid')) {
                    document.querySelectorAll('.bar-fill').forEach(bar => {
                        bar.style.width = bar.getAttribute('data-width');
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));

    /* --- 6. MODAL SYSTEM --- */
    const laptopModal = document.getElementById('laptopModal');
    const phoneModal = document.getElementById('phoneModal');

    window.openLaptopModal = function(src) {
        const modalImg = document.getElementById('modalScrollImg');
        const screenWindow = document.querySelector('.laptop-screen-window');
        if(laptopModal && modalImg) {
            modalImg.src = src;
            laptopModal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; 
            if(screenWindow) screenWindow.scrollTop = 0;
        }
    };

    window.closeLaptopModal = function() {
        if(laptopModal) {
            laptopModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };

    window.openPhoneModal = function(type, content) {
        const sim = document.getElementById('simulatorContainer');
        const phoneImg = document.getElementById('phoneScrollImg');
        const phoneImgWrapper = document.querySelector('.phone-screen-window');
        const BAKERY_IMAGE_PATH = './assets/heavenly_bites_full.png';

        if(phoneModal) {
            phoneModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            if (type === 'live' && sim) {
                sim.style.display = 'block';
                if(phoneImgWrapper) phoneImgWrapper.style.display = 'none';
                sim.innerHTML = `<iframe src="${content}" style="width:100%; height:100%; border:none; background: white;"></iframe>`;
            } else if (phoneImg) {
                if(sim) { sim.style.display = 'none'; sim.innerHTML = ''; }
                if(phoneImgWrapper) phoneImgWrapper.style.display = 'block';
                phoneImg.src = content === 'bakery' ? BAKERY_IMAGE_PATH : content;
            }
        }
    };

    window.closePhoneModal = function() {
        if(phoneModal) {
            phoneModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            const sim = document.getElementById('simulatorContainer');
            if(sim) { sim.innerHTML = ''; sim.style.display = 'none'; }
        }
    };

    /* --- 7. EMAILJS FORM HANDLING --- */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btnSpan = this.querySelector('button span');
            const originalText = btnSpan.innerText;
            btnSpan.innerText = "SENDING...";
            emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this)
                .then(() => {
                    btnSpan.innerText = "SENT!";
                    this.reset();
                    setTimeout(() => { btnSpan.innerText = originalText; }, 3000);
                }, () => {
                    btnSpan.innerText = "ERROR";
                });
        });
    }

    /* --- 8. OUTSIDE CLICK HANDLER --- */
    window.addEventListener('click', (e) => {
        if (e.target === laptopModal) window.closeLaptopModal();
        if (e.target === phoneModal) window.closePhoneModal();
    });

    // --- MOBILE MENU INJECTION & LOGIC ---
    const navInner = document.querySelector('.nav-inner-container');
    const navCentral = document.querySelector('.nav-central');
    const navSocials = document.querySelector('.nav-socials');

    if (navInner && window.innerWidth <= 992) {
        // 1. Create the hamburger button via JS
        const hamburger = document.createElement('div');
        hamburger.className = 'hamburger';
        hamburger.innerHTML = '<span></span><span></span><span></span>';
        navInner.appendChild(hamburger);

        // 2. Toggle Logic
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navCentral.classList.toggle('mobile-active');
            navSocials.classList.toggle('mobile-active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = navCentral.classList.contains('mobile-active') ? 'hidden' : 'auto';
        });

        // 3. Close menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navCentral.classList.remove('mobile-active');
                navSocials.classList.remove('mobile-active');
                document.body.style.overflow = 'auto';
            });
        });
    }
    
});