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

  /* --- 5. REVEAL ELEMENTS & SKILL BARS (FIXED) --- */
const revealElements = document.querySelectorAll('.about-hero, .reveal, .reveal-left, .reveal-right, .skills-section-outer, .experience-wide-card, .category-divider, .skills-glass-card');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add active class to the container
            entry.target.classList.add('active');
            
            // Look for bars inside the intersecting element
            const bars = entry.target.querySelectorAll('.bar-fill');
            if (bars.length > 0) {
                bars.forEach(bar => {
                    const targetWidth = bar.getAttribute('data-width');
                    if (targetWidth) {
                        // Use a small timeout to ensure the CSS transition can trigger
                        setTimeout(() => {
                            bar.style.width = targetWidth;
                        }, 200);
                    }
                });
            }
            
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.10 }); // Lowered threshold slightly so it triggers earlier

revealElements.forEach(el => observer.observe(el));

    /* --- 6. PROJECT MODAL SYSTEM (LAPTOP & PHONE) --- */
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
    /* --- 8. GLOBAL MODAL OUTSIDE CLICK HANDLER --- */
    window.addEventListener('click', (e) => {
        if (e.target === laptopModal) window.closeLaptopModal();
        if (e.target === phoneModal) window.closePhoneModal();
    });

    /* --- 9. MOBILE MENU LOGIC --- */
    const navInner = document.querySelector('.nav-inner-container');
    const navCentral = document.querySelector('.nav-central');
    const navSocials = document.querySelector('.nav-socials');

    if (navInner && window.innerWidth <= 992) {
        const hamburger = document.createElement('div');
        hamburger.className = 'hamburger';
        hamburger.innerHTML = '<span></span><span></span><span></span>';
        navInner.appendChild(hamburger);

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navCentral.classList.toggle('mobile-active');
            navSocials.classList.toggle('mobile-active');
            document.body.style.overflow = navCentral.classList.contains('mobile-active') ? 'hidden' : 'auto';
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navCentral.classList.remove('mobile-active');
                navSocials.classList.remove('mobile-active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    /* --- 10. POSTER STACK & SWIPE LOGIC --- */
    const cards = document.querySelectorAll('.poster-card-container');
    const wrapper = document.querySelector('.poster-slider-wrapper');
    const nextBtn = document.getElementById('nextBtn'); 
    const prevBtn = document.getElementById('prevBtn'); 
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
        };

        nextBtn?.addEventListener('click', (e) => { 
            e.stopPropagation();
            stackIndex = (stackIndex + 1) % cards.length; 
            updateStack(); 
        });
        
        prevBtn?.addEventListener('click', (e) => { 
            e.stopPropagation();
            stackIndex = (stackIndex - 1 + cards.length) % cards.length; 
            updateStack(); 
        });

        wrapper?.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchEndX = e.changedTouches[0].screenX;
        }, { passive: true });

        wrapper?.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const swipeThreshold = 50; 
            if (touchEndX < touchStartX - swipeThreshold) {
                stackIndex = (stackIndex + 1) % cards.length;
                updateStack();
            } else if (touchEndX > touchStartX + swipeThreshold) {
                stackIndex = (stackIndex - 1 + cards.length) % cards.length;
                updateStack();
            }
        }, { passive: true });

        cards.forEach(cardContainer => {
            cardContainer.addEventListener('click', (e) => {
                if (!cardContainer.classList.contains('active')) return;
                const swipeDistance = Math.abs(touchStartX - touchEndX);
                if (swipeDistance < 10) {
                    const imgSource = cardContainer.querySelector('.poster-img').src;
                    if (modalFullImg && posterModal) {
                        modalFullImg.src = imgSource;
                        posterModal.style.display = 'flex';
                        document.body.style.overflow = 'hidden';
                    }
                }
            });
        });

        window.closePosterModal = () => {
            if (posterModal) {
                posterModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        };

        posterModal?.addEventListener('click', (e) => {
            if (e.target === posterModal) closePosterModal();
        });

        updateStack();
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

/* --- 11. TESTIMONIAL 3D TILT ANIMATION --- */
const handleTilt = (e) => {
    const activeCard = document.querySelector('.carousel-item.active .testimonial-card');
    if (activeCard) {
        const rect = activeCard.getBoundingClientRect();
        const x = e.clientX - rect.left; 
        const y = e.clientY - rect.top;

        if (x > 0 && y > 0 && x < rect.width && y < rect.height) {
            const xRotation = -((y - rect.height / 2) / 20);
            const yRotation = (x - rect.width / 2) / 20;
            activeCard.style.transform = `perspective(1000px) scale(1.02) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
        } else {
            activeCard.style.transform = "perspective(1000px) scale(1) rotateX(0deg) rotateY(0deg)";
        }
    }
};

const testimonialSection = document.querySelector('.testimonials-section');
if (testimonialSection) {
    testimonialSection.addEventListener('mousemove', handleTilt);
    testimonialSection.addEventListener('mouseleave', () => {
        document.querySelectorAll('.testimonial-card').forEach(card => {
            card.style.transform = "perspective(1000px) scale(1) rotateX(0deg) rotateY(0deg)";
        });
    });
}

/* --- 12. FIX FOR CAROUSEL INDICATORS --- */
document.querySelectorAll('.carousel-indicators-custom button').forEach(btn => {
    btn.addEventListener('click', function() {
        const slideTo = this.getAttribute('data-bs-slide-to');
        const carouselEl = document.querySelector('#testimonialCarousel');
        const carouselInstance = bootstrap.Carousel.getInstance(carouselEl);
        if (carouselInstance) {
            carouselInstance.to(slideTo);
        }
    });
});

}); // <--- THIS IS THE VERY LAST LINE OF YOUR FILE

    
