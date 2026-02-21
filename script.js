document.addEventListener('DOMContentLoaded', () => {
    // 1. REVEAL & SKILLS ANIMATION LOGIC (Retained)
    const revealElements = document.querySelectorAll('.about-hero, .skills-grid, .reveal, .reveal-left, .reveal-right, .experience-wide-card');
    const progressBars = document.querySelectorAll('.bar-fill');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                if (entry.target.classList.contains('skills-grid')) {
                    progressBars.forEach(bar => {
                        const targetWidth = bar.getAttribute('data-width');
                        bar.style.width = targetWidth;
                    });
                }
                if (!entry.target.classList.contains('reveal-left')) {
                    revealObserver.unobserve(entry.target);
                }
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    // 2. BOOTSTRAP CAROUSELS (Retained)
    const initCarousel = (selector, interval) => {
        const el = document.querySelector(selector);
        if (el && typeof bootstrap !== 'undefined') {
            new bootstrap.Carousel(el, { interval, ride: 'carousel', pause: 'hover' });
        }
    };
    initCarousel('#certCarousel', 5000);
    initCarousel('#testimonialCarousel', 2000);

    // 3. HEADER SCROLL EFFECT (Retained)
    const header = document.querySelector('.header-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 4. LAPTOP MODAL LOGIC (UPDATED TO WORK PROPERLY)
    const laptopModal = document.getElementById('laptopModal');
    const modalScrollImg = document.getElementById('modalScrollImg');
    const closeBtnLaptop = document.querySelector('.close-laptop');
    const screenWindow = document.querySelector('.laptop-screen-window');

    window.openLaptopModal = function(imageSrc) {
        if(modalScrollImg) modalScrollImg.src = imageSrc;
        if(laptopModal) laptopModal.style.display = 'flex';
        if(closeBtnLaptop) closeBtnLaptop.style.display = 'block';
        
        // FIX: Resets scroll to top when opening a new project
        if(screenWindow) screenWindow.scrollTop = 0;
        
        document.body.style.overflow = 'hidden';
    };

    window.closeLaptopModal = function() {
        if(laptopModal) laptopModal.style.display = 'none';
        if(closeBtnLaptop) closeBtnLaptop.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    // 5. PHONE MODAL LOGIC (Retained)
    const phoneModal = document.getElementById('phoneModal');
    const phoneScrollImg = document.getElementById('phoneScrollImg');
    const staticPhoneScroll = document.getElementById('staticPhoneScroll');
    const simulatorContainer = document.getElementById('simulatorContainer');
    const closeBtnPhone = document.querySelector('.close-phone');

    window.openPhoneModal = function(type, content) {
        if(phoneModal) phoneModal.style.display = 'flex';
        if(closeBtnPhone) {
            closeBtnPhone.style.display = 'block';
            closeBtnPhone.style.opacity = '1';
            closeBtnPhone.style.visibility = 'visible';
        }
        document.body.style.overflow = 'hidden';
        if (type === 'live') {
            if(staticPhoneScroll) staticPhoneScroll.style.display = 'none';
            if(simulatorContainer) {
                simulatorContainer.style.display = 'block';
                simulatorContainer.innerHTML = `<iframe src="${content}" allow="autoplay" style="width:100%; height:100%; border:none;"></iframe>`;
            }
        } else {
            if(simulatorContainer) {
                simulatorContainer.style.display = 'none';
                simulatorContainer.innerHTML = "";
            }
            if(staticPhoneScroll) staticPhoneScroll.style.display = 'block';
            if(phoneScrollImg) phoneScrollImg.src = content;
        }
    };

    window.closePhoneModal = function() {
        if(phoneModal) phoneModal.style.display = 'none';
        if(closeBtnPhone) {
            closeBtnPhone.style.display = 'none';
            closeBtnPhone.style.opacity = '0';
            closeBtnPhone.style.visibility = 'hidden';
        }
        document.body.style.overflow = 'auto';
        if(simulatorContainer) simulatorContainer.innerHTML = "";
    };

    // 6. GLOBAL CLICK-TO-CLOSE (Retained)
    window.addEventListener('click', (event) => {
        if (event.target === laptopModal) closeLaptopModal();
        if (event.target === phoneModal) closePhoneModal();
    });
});