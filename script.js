document.addEventListener('DOMContentLoaded', () => {

   /* --- 1. INITIALIZATION & CAROUSELS --- */
   const initCarousel = (selector, interval) => {
    const el = document.querySelector(selector);
    if (el && typeof bootstrap !== 'undefined') {
        const carouselInstance = new bootstrap.Carousel(el, { 
            interval: interval, 
            ride: 'carousel', 
            pause: 'hover' 
        });
        carouselInstance.cycle(); 
    }
};

    /* --- 2. HEADER SCROLL EFFECT --- */
    const header = document.querySelector('.header-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* --- 3. 3D PERSPECTIVE SHOWCASE CAROUSEL --- */
    const hero = document.querySelector('.hero-gradient');
    if (hero) {
        // 3D Tablet Showcase Logic
        const cards = [
            document.getElementById('heroCard0'),
            document.getElementById('heroCard1'),
            document.getElementById('heroCard2')
        ].filter(Boolean);

        const indicators = document.querySelectorAll('.stage-vertical-indicator .indicator-step');
        let currentCardIndex = 0;
        let cardAutoTimer = null;

        const updateCardPositions = (activeIndex) => {
            currentCardIndex = activeIndex;
            cards.forEach((card, i) => {
                card.classList.remove('card-pos-0', 'card-pos-1', 'card-pos-2');
                const relPos = (i - activeIndex + 3) % 3;
                card.classList.add(`card-pos-${relPos}`);
            });

            indicators.forEach((ind, i) => {
                if (i === activeIndex) {
                    ind.classList.add('active');
                } else {
                    ind.classList.remove('active');
                }
            });
        };

        const nextCard = () => {
            if (cards.length > 0) {
                updateCardPositions((currentCardIndex + 1) % cards.length);
            }
        };

        const startAutoCycle = () => {
            stopAutoCycle();
            cardAutoTimer = setInterval(nextCard, 6000);
        };

        const stopAutoCycle = () => {
            if (cardAutoTimer) {
                clearInterval(cardAutoTimer);
                cardAutoTimer = null;
            }
        };

        // Attach Card Click Handlers
        cards.forEach((card, index) => {
            card.addEventListener('click', (e) => {
                if (currentCardIndex !== index) {
                    e.preventDefault();
                    updateCardPositions(index);
                    startAutoCycle();
                } else {
                    // Clicking the active front card: open modal or scroll to project
                    if (index === 0 && typeof window.openLaptopModal === 'function') {
                        window.openLaptopModal('./assets/Teamup.png');
                    } else if (index === 1 && typeof window.openLaptopModal === 'function') {
                        window.openLaptopModal('./assets/Lilas.png');
                    } else if (index === 2 && typeof window.openLaptopModal === 'function') {
                        window.openLaptopModal('./assets/paya_street.png');
                    }
                }
            });
        });

        // Attach Vertical Indicator Step Clicks
        indicators.forEach((ind, index) => {
            ind.addEventListener('click', () => {
                updateCardPositions(index);
                startAutoCycle();
            });
        });

        // Pause cycle on hover
        const showcaseStage = document.querySelector('.hero-showcase-stage');
        if (showcaseStage) {
            showcaseStage.addEventListener('mouseenter', stopAutoCycle);
            showcaseStage.addEventListener('mouseleave', startAutoCycle);
        }

        // 3D Parallax Tilt with Mouse Move
        let targetTiltX = 0;
        let targetTiltY = 0;
        let currentTiltX = 0;
        let currentTiltY = 0;

        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const relX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
            const relY = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

            targetTiltX = relY * -12; // tilt around X axis (pitch)
            targetTiltY = relX * 14;  // tilt around Y axis (yaw)
        });

        hero.addEventListener('mouseleave', () => {
            targetTiltX = 0;
            targetTiltY = 0;
        });

        function renderParallax() {
            // Smooth lerp
            currentTiltX += (targetTiltX - currentTiltX) * 0.08;
            currentTiltY += (targetTiltY - currentTiltY) * 0.08;

            hero.style.setProperty('--mouse-tilt-x', `${currentTiltX.toFixed(2)}deg`);
            hero.style.setProperty('--mouse-tilt-y', `${currentTiltY.toFixed(2)}deg`);

            requestAnimationFrame(renderParallax);
        }
        renderParallax();
        startAutoCycle();
    }

    /* --- 4. DARK SPOTLIGHTS (SYNC ARC & POSTERS) --- */
    const darkSections = document.querySelectorAll('.dark-project-row, .brand-poster-section');
    darkSections.forEach(section => {
        const spotlight = document.createElement('div');
        Object.assign(spotlight.style, {
            position: 'absolute', top: '0', left: '0', width: '100%', height: '100%',
            pointerEvents: 'none', zIndex: '0'
        });
        section.prepend(spotlight);
        let d1 = 0, d2 = Math.PI;
        function animate() {
            d1 += 0.007; d2 += 0.009; 
            const dx1 = 50 + Math.cos(d1) * 40, dy1 = 50 + Math.sin(d1 * 0.8) * 35;
            const dx2 = 50 + Math.cos(d2 * 1.1) * 40, dy2 = 50 + Math.sin(d2) * 35;
            spotlight.style.background = `
                radial-gradient(circle at ${dx1}% ${dy1}%, rgba(139, 0, 0, 0.7) 0%, transparent 70%),
                radial-gradient(circle at ${dx2}% ${dy2}%, rgba(200, 0, 0, 0.45) 0%, transparent 65%)
            `;
            requestAnimationFrame(animate);
        }
        animate();
    });

  /* --- 5. REVEAL ELEMENTS & SKILL BARS (WITH SMOOTH COUNT-UP) --- */
const revealElements = document.querySelectorAll('.about-section, .about-hero, .reveal, .reveal-left, .reveal-right, .skills-section-outer, .experience-wide-card, .category-divider, .skills-glass-card');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add active class to the container
            entry.target.classList.add('active');
            
            // Animate progress bar widths
            const bars = entry.target.querySelectorAll('.bar-fill');
            if (bars.length > 0) {
                bars.forEach(bar => {
                    const targetWidth = bar.getAttribute('data-width');
                    if (targetWidth) {
                        setTimeout(() => {
                            bar.style.width = targetWidth;
                        }, 180);
                    }
                });
            }

            // Animate percentage numbers smoothly counting up from 0%
            const percentages = entry.target.querySelectorAll('.percentage[data-target]');
            if (percentages.length > 0) {
                percentages.forEach(percEl => {
                    const target = parseInt(percEl.getAttribute('data-target'), 10);
                    if (!isNaN(target)) {
                        percEl.textContent = '0%';
                        setTimeout(() => {
                            const duration = 1300;
                            const startTime = performance.now();
                            function stepCount(now) {
                                const elapsed = now - startTime;
                                const progress = Math.min(elapsed / duration, 1);
                                const ease = 1 - Math.pow(1 - progress, 3);
                                const current = Math.round(target * ease);
                                percEl.textContent = `${current}%`;
                                if (progress < 1) {
                                    requestAnimationFrame(stepCount);
                                } else {
                                    percEl.textContent = `${target}%`;
                                }
                            }
                            requestAnimationFrame(stepCount);
                        }, 220);
                    }
                });
            }
            
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

revealElements.forEach(el => observer.observe(el));

    /* --- 6. PROJECT MODAL SYSTEM (LAPTOP & PHONE) --- */
    const laptopModal = document.getElementById('laptopModal');
    const phoneModal = document.getElementById('phoneModal');

    function bindModalScroll(windowEl, indicatorEl) {
        if (!windowEl || windowEl.dataset.scrollBound) return;
        windowEl.dataset.scrollBound = 'true';

        let isDown = false;
        let startY = 0;
        let startScroll = 0;

        const hideIndicator = () => {
            if (indicatorEl && windowEl.scrollTop > 15) {
                indicatorEl.classList.add('hidden');
            }
        };

        // Native scroll listener
        windowEl.addEventListener('scroll', hideIndicator, { passive: true });

        // Touch Drag for Tablets (iPad Mini) and Mobile Phones (iPhones/Android)
        windowEl.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches.length === 1) {
                isDown = true;
                startY = e.touches[0].clientY;
                startScroll = windowEl.scrollTop;
            }
        }, { passive: true });

        windowEl.addEventListener('touchmove', (e) => {
            if (!isDown || !e.touches || e.touches.length !== 1) return;
            const diff = e.touches[0].clientY - startY;
            windowEl.scrollTop = startScroll - diff;
            hideIndicator();
        }, { passive: true });

        windowEl.addEventListener('touchend', () => {
            isDown = false;
        }, { passive: true });

        // Mouse Drag for Desktop & Chrome DevTools Device Emulation
        windowEl.addEventListener('mousedown', (e) => {
            isDown = true;
            startY = e.clientY;
            startScroll = windowEl.scrollTop;
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            const diff = e.clientY - startY;
            windowEl.scrollTop = startScroll - diff;
            hideIndicator();
        });

        window.addEventListener('mouseup', () => {
            isDown = false;
        });
    }

    // Pre-bind on page load
    const initialLaptopScreen = document.getElementById('laptopScreenWindow') || document.querySelector('.laptop-screen-window');
    const initialLaptopHint = document.getElementById('laptopScrollIndicator');
    if (initialLaptopScreen) bindModalScroll(initialLaptopScreen, initialLaptopHint);

    const initialPhoneScreen = document.getElementById('phoneImgWrapper') || document.querySelector('.phone-screen-window');
    const initialPhoneHint = document.getElementById('phoneScrollIndicator');
    if (initialPhoneScreen) bindModalScroll(initialPhoneScreen, initialPhoneHint);

    window.openLaptopModal = function(src, url) {
        const modalImg = document.getElementById('modalScrollImg');
        const screenWindow = document.getElementById('laptopScreenWindow') || document.querySelector('.laptop-screen-window');
        const laptopHint = document.getElementById('laptopScrollIndicator');
        const modalUrl = document.getElementById('laptopModalUrl');
        const modalExtLink = document.getElementById('laptopModalExtLink');

        if (laptopModal && modalImg) {
            modalImg.src = src;
            if (modalUrl && url) {
                modalUrl.textContent = url;
            }
            if (modalExtLink && url) {
                modalExtLink.href = url;
                const linkSpan = modalExtLink.querySelector('span');
                if (linkSpan) {
                    linkSpan.textContent = url.includes('figma.com') ? 'View Figma' : 'Visit Live';
                }
                modalExtLink.style.display = 'inline-flex';
            } else if (modalExtLink) {
                modalExtLink.style.display = 'none';
            }
            if (laptopHint) laptopHint.classList.remove('hidden');
            laptopModal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; 
            if (screenWindow) {
                bindModalScroll(screenWindow, laptopHint);
                screenWindow.scrollTop = 0;
            }
        }
    };

    window.closeLaptopModal = function() {
        if (laptopModal) {
            laptopModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    };

    window.openPhoneModal = function(type, content) {
        const sim = document.getElementById('simulatorContainer');
        const phoneImg = document.getElementById('phoneScrollImg');
        const phoneImgWrapper = document.getElementById('phoneImgWrapper') || document.querySelector('.phone-screen-window');
        const phoneHint = document.getElementById('phoneScrollIndicator');

        if (phoneModal) {
            phoneModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            if (phoneModal.scrollTop !== undefined) phoneModal.scrollTop = 0;
            if (phoneHint) phoneHint.classList.remove('hidden');

            if (type === 'live' && sim) {
                sim.style.display = 'block';
                if (phoneImgWrapper) phoneImgWrapper.style.display = 'none';
                if (phoneHint) phoneHint.classList.add('hidden');
                sim.innerHTML = `<iframe src="${content}" style="width:100%; height:100%; border:none; background: white;" title="Mobile Live App"></iframe>`;
            } else if (phoneImg) {
                if (sim) { sim.style.display = 'none'; sim.innerHTML = ''; }
                if (phoneImgWrapper) {
                    phoneImgWrapper.style.display = 'block';
                    bindModalScroll(phoneImgWrapper, phoneHint);
                    phoneImgWrapper.scrollTop = 0;
                }
                phoneImg.src = content;
            }
        }
    };

    window.closePhoneModal = function() {
        if (phoneModal) {
            phoneModal.style.display = 'none';
            document.body.style.overflow = '';
            const sim = document.getElementById('simulatorContainer');
            if (sim) { sim.innerHTML = ''; sim.style.display = 'none'; }
        }
    };

 /* --- 7. FORMSPREE HANDLING (THE EASY WAY) --- */
 const contactForm = document.getElementById('contactForm');
 if (contactForm) {
     contactForm.addEventListener('submit', async function(e) {
         e.preventDefault();
         const btnSpan = this.querySelector('button span');
         const originalText = btnSpan.innerText;
         
         btnSpan.innerText = "SENDING...";

         const data = new FormData(this);
         
         try {
             const response = await fetch(this.action, {
                 method: 'POST',
                 body: data,
                 headers: { 'Accept': 'application/json' }
             });

             if (response.ok) {
                 btnSpan.innerText = "SENT!";
                 this.reset();
                 setTimeout(() => { btnSpan.innerText = originalText; }, 3000);
             } else {
                 throw new Error('Submission failed');
             }
         } catch (error) {
             btnSpan.innerText = "ERROR - RETRY";
             setTimeout(() => { btnSpan.innerText = originalText; }, 3000);
         }
     });
 }
    /* --- 8. GLOBAL MODAL OUTSIDE CLICK & ESC HANDLER --- */
    window.addEventListener('click', (e) => {
        if (e.target === laptopModal) window.closeLaptopModal();
        if (e.target === phoneModal) window.closePhoneModal();
        const posterModal = document.getElementById('posterModal');
        if (e.target === posterModal && typeof window.closePosterModal === 'function') window.closePosterModal();
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (laptopModal && laptopModal.style.display === 'flex') window.closeLaptopModal();
            if (phoneModal && phoneModal.style.display === 'flex') window.closePhoneModal();
            const posterModal = document.getElementById('posterModal');
            if (posterModal && posterModal.style.display === 'flex' && typeof window.closePosterModal === 'function') {
                window.closePosterModal();
            }
        }
    });

    /* --- 9. MOBILE MENU LOGIC --- */
    const navHamburger = document.getElementById('navHamburger') || document.querySelector('.hamburger');
    const navCentral = document.querySelector('.nav-central');
    const navInner = document.querySelector('.nav-inner-container');
    const headerNav = document.querySelector('.header-nav');

    const closeNavDrawer = () => {
        navHamburger?.classList.remove('active');
        navCentral?.classList.remove('mobile-active');
        navInner?.classList.remove('nav-open');
        headerNav?.classList.remove('nav-open');
        document.body.style.overflow = '';
    };

    if (navHamburger && navCentral) {
        navHamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navCentral.classList.contains('mobile-active');
            if (isOpen) {
                closeNavDrawer();
            } else {
                navHamburger.classList.add('active');
                navCentral.classList.add('mobile-active');
                navInner?.classList.add('nav-open');
                headerNav?.classList.add('nav-open');
                document.body.style.overflow = 'hidden';
            }
        });

        document.querySelectorAll('.nav-links a, .drawer-socials-row a').forEach(link => {
            link.addEventListener('click', () => {
                closeNavDrawer();
            });
        });

        // Close mobile drawer on outside tap/click
        document.addEventListener('click', (e) => {
            if (navCentral.classList.contains('mobile-active')) {
                if (!navCentral.contains(e.target) && !navHamburger.contains(e.target)) {
                    closeNavDrawer();
                }
            }
        });
    }

    /* --- 10. POSTER STACK & SWIPE LOGIC --- */
    const cards = document.querySelectorAll('.poster-card-container');
    const wrapper = document.querySelector('.poster-slider-wrapper');
    const nextBtn = document.getElementById('nextBtn'); 
    const prevBtn = document.getElementById('prevBtn'); 
    const posterCounter = document.getElementById('posterCounter');
    const posterModal = document.getElementById('posterModal');
    const modalFullImg = document.getElementById('modalFullPosterImg');

    let stackIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;

    if (cards.length > 0) {
        const updateStack = () => {
            cards.forEach((card, i) => {
                card.classList.remove('active', 'prev', 'next', 'hidden');
                if (i === stackIndex) {
                    card.classList.add('active');
                } else if (i === (stackIndex - 1 + cards.length) % cards.length) {
                    card.classList.add('prev');
                } else if (i === (stackIndex + 1) % cards.length) {
                    card.classList.add('next');
                } else {
                    card.classList.add('hidden');
                }
            });
            if (posterCounter) {
                posterCounter.textContent = `0${stackIndex + 1} / 0${cards.length}`;
            }
        };

        const triggerSlideNext = () => {
            stackIndex = (stackIndex + 1) % cards.length;
            updateStack();
        };

        const triggerSlidePrev = () => {
            stackIndex = (stackIndex - 1 + cards.length) % cards.length;
            updateStack();
        };

        nextBtn?.addEventListener('click', (e) => { 
            e.stopPropagation();
            triggerSlideNext();
            nextBtn.style.transform = 'scale(0.88)';
            setTimeout(() => { nextBtn.style.transform = ''; }, 160);
        });
        
        prevBtn?.addEventListener('click', (e) => { 
            e.stopPropagation();
            triggerSlidePrev();
            prevBtn.style.transform = 'scale(0.88)';
            setTimeout(() => { prevBtn.style.transform = ''; }, 160);
        });

        // Clicking on prev or next card directly cycles the slider
        cards.forEach((cardContainer) => {
            cardContainer.addEventListener('click', (e) => {
                if (cardContainer.classList.contains('prev')) {
                    e.stopPropagation();
                    triggerSlidePrev();
                } else if (cardContainer.classList.contains('next')) {
                    e.stopPropagation();
                    triggerSlideNext();
                }
            });
        });

        // Touch swipe gestures
        wrapper?.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchEndX = e.changedTouches[0].screenX;
        }, { passive: true });

        wrapper?.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const swipeThreshold = 40; 
            if (touchEndX < touchStartX - swipeThreshold) {
                triggerSlideNext();
            } else if (touchEndX > touchStartX + swipeThreshold) {
                triggerSlidePrev();
            }
        }, { passive: true });

        // Open poster modal
        window.openPosterModal = function(src) {
            if (modalFullImg && posterModal) {
                modalFullImg.src = src;
                posterModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                if (posterModal.scrollTop !== undefined) posterModal.scrollTop = 0;
            }
        };

        window.closePosterModal = () => {
            if (posterModal) {
                posterModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        };

        posterModal?.addEventListener('click', (e) => {
            if (e.target === posterModal) closePosterModal();
        });

        // Initialize stack on load
        updateStack();

        // Craft filter pill smooth scroll
        document.querySelectorAll('.craft-pill').forEach(pill => {
            pill.addEventListener('click', function() {
                document.querySelectorAll('.craft-pill').forEach(p => p.classList.remove('on'));
                this.classList.add('on');
                const filter = this.getAttribute('data-filter');
                if (filter === 'frontend') {
                    document.getElementById('card-paya')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else if (filter === 'uiux') {
                    document.getElementById('card-arc')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else if (filter === 'mobile') {
                    document.getElementById('mobile-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else if (filter === 'graphics') {
                    document.getElementById('graphics-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    document.getElementById('project')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

/* --- 11. LUXURY CERTIFICATE SHOWCASE SLIDER --- */
const certificatesData = [
    {
        title: "Front-End Development Libraries",
        issuer: "FREECODECAMP",
        desc: "Building responsive, dynamic user interfaces using modern front-end libraries and frameworks including React, Redux, Bootstrap, jQuery, and SASS.",
        img: "./assets/certificates/Front-End Development Libraries.png",
        link: "https://www.freecodecamp.org/certification/samgonzales/front-end-development-libraries-v9"
    },
    {
        title: "Responsive Web Design",
        issuer: "FREECODECAMP",
        desc: "Architecting mobile-first layouts using HTML5 and modern CSS techniques like Flexbox and Grid for seamless cross-device experiences.",
        img: "./assets/certificates/Responsive Web Design.png",
        link: "https://drive.google.com/file/d/1V0MWmoZiCl3IXdzZJDXAyxVlZewd6_ml/view?usp=sharing"
    },
    {
        title: "Data Analysis with Python",
        issuer: "FREECODECAMP",
        desc: "Analyzing and visualizing complex data sets using Python, NumPy, Pandas, Matplotlib, and Seaborn for data-driven design and decision making.",
        img: "./assets/certificates/Data Analysis with Python.png",
        link: "https://www.freecodecamp.org/certification/samgonzales/data-analysis-with-python-v7"
    },
    {
        title: "Introduction to Figma",
        issuer: "SIMPLILEARN SKILLUP",
        desc: "Prototyping high-fidelity interfaces and managing design systems using Figma's industry-standard collaborative tools.",
        img: "./assets/certificates/Introduction to Figma.png",
        link: "https://drive.google.com/file/d/1Qv6hzlGFU1VJL8GNjajdWcD_sM4NjMCw/view?usp=sharing"
    },
    {
        title: "Digital Marketing Certified",
        issuer: "HUBSPOT ACADEMY",
        desc: "Strategizing content marketing, SEO integration, and social media engagement to drive brand awareness and conversion.",
        img: "./assets/certificates/Digital Marketing.png",
        link: "https://app-na2.hubspot.com/academy/achievements/3mzw9fxy/en/1/samantha-gonzales/digital-marketing-certified"
    },
    {
        title: "Digital Advertising Certified",
        issuer: "HUBSPOT ACADEMY",
        desc: "Developing targeted advertising campaigns, managing budgets, and optimizing multi-channel performance tracking.",
        img: "./assets/certificates/Digital Advertising Certification.png",
        link: "https://app-na2.hubspot.com/academy/achievements/s54rph1g/en/1/samantha-gonzales/digital-advertising-certified"
    },
    {
        title: "SEO Certified",
        issuer: "HUBSPOT ACADEMY",
        desc: "Mastery of search engine optimization fundamentals, including keyword research, on-page SEO, and enhancing site authority.",
        img: "./assets/certificates/SEO_CERTIFIED.PNG",
        link: "https://drive.google.com/file/d/1dXkGP-mWOhBUHlS0uLwhE52GS8wwfrAK/view?usp=drive_link"
    },
    {
        title: "SEO II Certified",
        issuer: "HUBSPOT ACADEMY",
        desc: "Advanced implementation of technical SEO tactics, focusing on website optimization, backlink strategies, and data-driven growth.",
        img: "./assets/certificates/Hubspot_SEO_II.PNG",
        link: "https://drive.google.com/file/d/1zQ02WSpQicApMDQOqf7apvJxmwoVxTJp/view?usp=drive_link"
    }
];

const certImg = document.getElementById('certActiveImg');
const certIssuer = document.getElementById('certIssuer');
const certTitle = document.getElementById('certTitle');
const certDesc = document.getElementById('certDesc');
const certLink = document.getElementById('certLink');
const certDashesContainer = document.getElementById('certDashes');
const certPrevBtn = document.getElementById('certPrevBtn');
const certNextBtn = document.getElementById('certNextBtn');

let currentCertIndex = 0;

if (certImg && certificatesData.length > 0) {
    // Generate dash indicators
    if (certDashesContainer) {
        certDashesContainer.innerHTML = '';
        certificatesData.forEach((_, idx) => {
            const dash = document.createElement('span');
            dash.className = `cert-dash ${idx === 0 ? 'active' : ''}`;
            dash.setAttribute('aria-label', `Go to certificate ${idx + 1}`);
            dash.addEventListener('click', () => renderCert(idx));
            certDashesContainer.appendChild(dash);
        });
    }

    const renderCert = (index) => {
        currentCertIndex = (index + certificatesData.length) % certificatesData.length;
        const cert = certificatesData[currentCertIndex];

        // Smooth transition
        certImg.style.opacity = '0';
        if (certTitle) certTitle.style.opacity = '0';
        if (certDesc) certDesc.style.opacity = '0';

        setTimeout(() => {
            certImg.src = cert.img;
            certImg.alt = cert.title;
            if (certIssuer) certIssuer.textContent = cert.issuer;
            if (certTitle) certTitle.textContent = cert.title;
            if (certDesc) certDesc.textContent = cert.desc;
            if (certLink) certLink.href = cert.link;

            certImg.style.opacity = '1';
            if (certTitle) certTitle.style.opacity = '1';
            if (certDesc) certDesc.style.opacity = '1';
        }, 180);

        // Update active dash
        const dashes = certDashesContainer ? certDashesContainer.querySelectorAll('.cert-dash') : [];
        dashes.forEach((d, i) => {
            d.classList.toggle('active', i === currentCertIndex);
        });
    };

    certPrevBtn?.addEventListener('click', () => {
        renderCert(currentCertIndex - 1);
    });

    certNextBtn?.addEventListener('click', () => {
        renderCert(currentCertIndex + 1);
    });
}

/* --- 12. TESTIMONIALS SLIDER (BURGUNDY GALAXY & DOME CAPSULE) --- */
const testimonialsData = [
    {
        initials: "AP",
        author: "Aimee Pangan",
        role: "Backend Developer<br>& Collaborator",
        quote: "Handling the backend is much easier when you have a UI/UX lead like Sam. She provides clean, organized layouts that make integration seamless. She makes complex data structures look intuitive."
    },
    {
        initials: "CG",
        author: "Caizel Jade Gonzales",
        role: "Client<br>& Project Lead",
        quote: "Working with Sam for the Calista Art project was amazing. She took my messy vision and turned it into a sleek, professional site that I'm actually proud to show off. She has a serious eye for detail!"
    },
    {
        initials: "JM",
        author: "Joyze Magat",
        role: "Frontend Developer<br>& Peer",
        quote: "Her designs aren't just aesthetically pleasing; they are technically sound and fully responsive. She bridges the gap between creative vision and functional code perfectly."
    },
    {
        initials: "MC",
        author: "Marc Canlas",
        role: "Frontend Developer<br>& Collaborator",
        quote: "Sam is a powerhouse when it comes to UI/UX and Frontend. She leads the creative direction of our projects with clarity and precision. Her ability to craft unique user experiences is impressive."
    }
];

const testiQuoteText = document.getElementById('testiQuoteText');
const testiAvatarText = document.getElementById('testiAvatarText');
const testiAuthorName = document.getElementById('testiAuthorName');
const testiAuthorRole = document.getElementById('testiAuthorRole');
const testiCounter = document.getElementById('testiCounter');
const testiDashesContainer = document.getElementById('testiDashes');
const testiPrevBtn = document.getElementById('testiPrevBtn');
const testiNextBtn = document.getElementById('testiNextBtn');

let currentTestiIndex = 0;

if (testiQuoteText && testimonialsData.length > 0) {
    // Generate dash indicators
    if (testiDashesContainer) {
        testiDashesContainer.innerHTML = '';
        testimonialsData.forEach((_, idx) => {
            const dash = document.createElement('span');
            dash.className = `testi-dash ${idx === 0 ? 'active' : ''}`;
            dash.setAttribute('aria-label', `Go to testimonial ${idx + 1}`);
            dash.addEventListener('click', () => renderTestimonial(idx));
            testiDashesContainer.appendChild(dash);
        });
    }

    const renderTestimonial = (index) => {
        currentTestiIndex = (index + testimonialsData.length) % testimonialsData.length;
        const item = testimonialsData[currentTestiIndex];

        // Smooth fade transition
        testiQuoteText.style.opacity = '0';
        if (testiAvatarText) testiAvatarText.style.opacity = '0';
        if (testiAuthorName) testiAuthorName.style.opacity = '0';
        if (testiAuthorRole) testiAuthorRole.style.opacity = '0';
        if (testiCounter) testiCounter.style.opacity = '0';

        setTimeout(() => {
            testiQuoteText.textContent = item.quote;
            if (testiAvatarText) testiAvatarText.textContent = item.initials;
            if (testiAuthorName) testiAuthorName.textContent = item.author;
            if (testiAuthorRole) testiAuthorRole.innerHTML = item.role;
            if (testiCounter) {
                const num = currentTestiIndex + 1;
                const total = testimonialsData.length;
                testiCounter.textContent = `${num < 10 ? '0' + num : num} / ${total < 10 ? '0' + total : total}`;
            }

            testiQuoteText.style.opacity = '1';
            if (testiAvatarText) testiAvatarText.style.opacity = '1';
            if (testiAuthorName) testiAuthorName.style.opacity = '1';
            if (testiAuthorRole) testiAuthorRole.style.opacity = '1';
            if (testiCounter) testiCounter.style.opacity = '1';
        }, 180);

        // Update active dash
        const dashes = testiDashesContainer ? testiDashesContainer.querySelectorAll('.testi-dash') : [];
        dashes.forEach((d, i) => {
            d.classList.toggle('active', i === currentTestiIndex);
        });
    };

    testiPrevBtn?.addEventListener('click', () => {
        renderTestimonial(currentTestiIndex - 1);
    });

    testiNextBtn?.addEventListener('click', () => {
        renderTestimonial(currentTestiIndex + 1);
    });
}

}); // <--- THIS IS THE VERY LAST LINE OF YOUR FILE

    
