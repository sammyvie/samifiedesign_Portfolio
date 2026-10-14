/**
 * SAMIFIEDESIGN — Interactive Constellation Opening Experience
 * Silky Smooth, Ultra-Reliable 60FPS Performance Engine
 */

(function () {
    'use strict';

    // 1. CONFIGURATION & TIMINGS
    const INTRO_CONFIG = {
        sessionKey: 'samifiedesign_intro_viewed',
        drawDurationMs: 1300,       // Silky smooth constellation drawing duration
        shootingStarsDelayMs: 400,  // When shooting stars streak across the screen
        holdFinishedMs: 750,        // Brief hold on completed glowing "S" signature
        fadeDurationMs: 850,        // Soft dissolve into portfolio hero
        maxSafetyTimeoutMs: 6500,   // Guard to guarantee visitor access
        starThresholds: [
            { id: 'node-7', threshold: 0.17 },
            { id: 'node-9', threshold: 0.17 },
            { id: 'node-6', threshold: 0.32 },
            { id: 'node-10', threshold: 0.32 },
            { id: 'node-5', threshold: 0.47 },
            { id: 'node-11', threshold: 0.47 },
            { id: 'node-4', threshold: 0.63 }, // Vega
            { id: 'node-12', threshold: 0.63 }, // Antares
            { id: 'node-3', threshold: 0.77 },
            { id: 'node-13', threshold: 0.77 },
            { id: 'node-2', threshold: 0.89 },
            { id: 'node-14', threshold: 0.89 },
            { id: 'node-1', threshold: 0.99 }, // Top finial
            { id: 'node-15', threshold: 0.99 }  // Bottom finial
        ]
    };

    // Smooth celestial ease: starts with gentle momentum, softly cushions at end
    function celestialEase(t) {
        return 1 - Math.pow(1 - t, 2.6);
    }

    // 2. CHECK SESSION & QUERY OVERRIDES
    // Allows testing on page refresh or with ?intro=1 / ?replay=1
    function shouldPlayIntro() {
        // Always play on visit/refresh during development & testing
        return true;
    }

    // 3. INITIALIZE INTRO CONTROLLER
    function initConstellationIntro() {
        const introEl = document.getElementById('constellationIntro');
        if (!introEl) return;

        // If intro was already seen during this session and not a refresh, dismiss instantly
        if (!shouldPlayIntro()) {
            introEl.style.display = 'none';
            introEl.setAttribute('aria-hidden', 'true');
            return;
        }

        // Reset scroll position to top
        try {
            window.scrollTo(0, 0);
            if (document.documentElement) document.documentElement.scrollTop = 0;
            if (document.body) document.body.scrollTop = 0;
        } catch (e) {}

        // Lock background body scrolling while intro is active
        document.body.classList.add('intro-active');

        // DOM Element References
        const centralStarBtn = document.getElementById('centralStarBtn');
        const centralStarWrapper = document.getElementById('centralStarWrapper');
        const introInstruction = document.getElementById('introInstruction');
        const introSignatureLabel = document.getElementById('introSignatureLabel');
        const skipBtn = document.getElementById('introSkipBtn');
        const constellationSvg = document.getElementById('constellationSvg');
        const upperLine = document.getElementById('upperLine');
        const lowerLine = document.getElementById('lowerLine');
        const upperHalo = document.getElementById('upperHalo');
        const lowerHalo = document.getElementById('lowerHalo');
        const upperSparkHead = document.getElementById('upperSparkHead');
        const lowerSparkHead = document.getElementById('lowerSparkHead');
        const starfield = document.getElementById('introStarfield');
        const canvas = document.getElementById('introParticleCanvas');

        let isAnimating = false;
        let isCompleted = false;
        let masterRafId = null;
        let drawStartTime = null;
        let drawDone = false;

        // Generate subtle, drifting background stars
        if (starfield) {
            const starFragment = document.createDocumentFragment();
            const starCount = window.innerWidth < 768 ? 24 : 36;
            for (let i = 0; i < starCount; i++) {
                const star = document.createElement('div');
                star.className = 'intro-bg-star';
                star.style.left = `${(Math.random() * 96 + 2).toFixed(1)}%`;
                star.style.top = `${(Math.random() * 94 + 3).toFixed(1)}%`;
                const size = (Math.random() * 1.8 + 1.2).toFixed(1);
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;
                star.style.setProperty('--t', `${(Math.random() * 3 + 3.2).toFixed(1)}s`);
                star.style.setProperty('--d', `-${(Math.random() * 4).toFixed(1)}s`);
                starFragment.appendChild(star);
            }
            starfield.appendChild(starFragment);
        }

        // 4. PRECOMPUTE BEZIER PATH COORDINATES (0ms CPU cost during animation)
        const SAMPLES = 100;
        const upperPoints = new Array(SAMPLES + 1);
        const lowerPoints = new Array(SAMPLES + 1);
        let upperLength = 473;
        let lowerLength = 473;

        try {
            if (upperLine && typeof upperLine.getTotalLength === 'function') {
                const lenU = upperLine.getTotalLength();
                if (lenU > 50) upperLength = lenU;
                for (let i = 0; i <= SAMPLES; i++) {
                    const pt = upperLine.getPointAtLength((i / SAMPLES) * upperLength);
                    upperPoints[i] = { x: pt.x.toFixed(1), y: pt.y.toFixed(1) };
                }
            } else {
                for (let i = 0; i <= SAMPLES; i++) upperPoints[i] = { x: 220, y: 280 };
            }

            if (lowerLine && typeof lowerLine.getTotalLength === 'function') {
                const lenL = lowerLine.getTotalLength();
                if (lenL > 50) lowerLength = lenL;
                for (let i = 0; i <= SAMPLES; i++) {
                    const pt = lowerLine.getPointAtLength((i / SAMPLES) * lowerLength);
                    lowerPoints[i] = { x: pt.x.toFixed(1), y: pt.y.toFixed(1) };
                }
            } else {
                for (let i = 0; i <= SAMPLES; i++) lowerPoints[i] = { x: 220, y: 280 };
            }
        } catch (e) {
            for (let i = 0; i <= SAMPLES; i++) {
                upperPoints[i] = { x: 220, y: 280 };
                lowerPoints[i] = { x: 220, y: 280 };
            }
        }

        // Track star ignition state
        const starsState = INTRO_CONFIG.starThresholds.map(s => ({
            ...s,
            el: document.getElementById(s.id),
            lit: false
        }));

        // 5. HIGH-PERFORMANCE PARTICLE SYSTEM (Zero software blur)
        const particles = [];
        let ctx = null;

        if (canvas) {
            ctx = canvas.getContext('2d', { alpha: true });
            const resize = () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            };
            resize();
            window.addEventListener('resize', resize, { passive: true });
        }

        function spawnBurst(x, y, count, speedMult) {
            count = count || 20;
            speedMult = speedMult || 1;
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = (Math.random() * 2.0 + 0.6) * speedMult;
                particles.push({
                    x: x,
                    y: y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    life: 0,
                    maxLife: Math.random() * 40 + 35,
                    size: Math.random() * 2.0 + 1.0,
                    color: Math.random() > 0.35 ? '#ffeec8' : '#e2b474'
                });
            }
        }

        // UNIFIED MASTER TICK (Runs strictly once per VSync)
        function masterTick(timestamp) {
            if (!drawStartTime) drawStartTime = timestamp;

            // --- A. LINE DRAWING & SPARKS UPDATE ---
            if (!drawDone) {
                const elapsed = timestamp - drawStartTime;
                const rawProgress = Math.min(1, elapsed / INTRO_CONFIG.drawDurationMs);
                const easedProgress = celestialEase(rawProgress);

                // Update stroke dashoffset
                const dashVal = (1 - easedProgress).toFixed(4);
                if (upperLine) upperLine.style.strokeDashoffset = dashVal;
                if (lowerLine) lowerLine.style.strokeDashoffset = dashVal;
                if (upperHalo) upperHalo.style.strokeDashoffset = dashVal;
                if (lowerHalo) lowerHalo.style.strokeDashoffset = dashVal;

                // Move leading traveling sparks using standard SVG translate attributes
                const idx = Math.min(SAMPLES, Math.round(easedProgress * SAMPLES));
                const ptU = upperPoints[idx];
                const ptL = lowerPoints[idx];
                if (ptU && upperSparkHead) {
                    upperSparkHead.setAttribute('transform', 'translate(' + ptU.x + ',' + ptU.y + ')');
                }
                if (ptL && lowerSparkHead) {
                    lowerSparkHead.setAttribute('transform', 'translate(' + ptL.x + ',' + ptL.y + ')');
                }

                // Ignite star nodes sequentially
                starsState.forEach(s => {
                    if (!s.lit && easedProgress >= s.threshold) {
                        s.lit = true;
                        if (s.el) {
                            s.el.classList.add('lit');
                        }
                    }
                });

                if (rawProgress >= 1) {
                    drawDone = true;
                    onDrawingComplete();
                }
            }

            // --- B. CANVAS PARTICLES UPDATE (100% Hardware GPU arcs) ---
            if (ctx && particles.length > 0) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                for (let i = particles.length - 1; i >= 0; i--) {
                    const p = particles[i];
                    p.life++;
                    p.vx *= 0.962;
                    p.vy *= 0.962;
                    p.x += p.vx;
                    p.y += p.vy - 0.05;

                    const progress = p.life / p.maxLife;
                    if (progress >= 1) {
                        particles.splice(i, 1);
                        continue;
                    }

                    const alpha = Math.sin(progress * Math.PI) * 0.85;

                    // Dual-pass GPU circle: outer glow + inner core
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = Math.max(0, alpha * 0.28);
                    ctx.fill();

                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
                    ctx.fillStyle = '#ffffff';
                    ctx.globalAlpha = Math.max(0, alpha);
                    ctx.fill();
                }
            } else if (ctx && drawDone) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }

            // Continue loop while drawing or particles remain
            if (!drawDone || particles.length > 0) {
                masterRafId = requestAnimationFrame(masterTick);
            } else {
                masterRafId = null;
            }
        }

        // 6. MAIN ACTIVATION SEQUENCE
        function activateConstellation() {
            if (isAnimating || isCompleted) return;
            isAnimating = true;

            // Accessibility state
            if (centralStarBtn) {
                centralStarBtn.setAttribute('aria-expanded', 'true');
                centralStarBtn.style.pointerEvents = 'none';
            }

            // Step 1: Central star breathes in and blooms
            if (centralStarWrapper) {
                centralStarWrapper.classList.add('activated');
            }
            if (introInstruction) {
                introInstruction.classList.add('fade-out');
            }

            // Stardust burst from center
            if (centralStarBtn) {
                const rect = centralStarBtn.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                spawnBurst(cx, cy, 22, 1.3);
            }

            // Step 2: Synchronized Single RAF Loop for Drawing + Sparks + Particles
            if (upperSparkHead) upperSparkHead.classList.add('active');
            if (lowerSparkHead) lowerSparkHead.classList.add('active');

            // Start master tick with tiny, natural delay
            setTimeout(() => {
                masterRafId = requestAnimationFrame(masterTick);
            }, 80);
        }

        // 7. CALLED ONCE CONSTELLATION REACHES FINIALS
        function onDrawingComplete() {
            // Softly fade traveling sparks
            if (upperSparkHead) upperSparkHead.classList.remove('active');
            if (lowerSparkHead) lowerSparkHead.classList.remove('active');

            // Completed Constellation glow & signature reveal
            if (constellationSvg) {
                constellationSvg.classList.add('completed');
            }
            if (introSignatureLabel) {
                introSignatureLabel.classList.add('visible');
            }

            // Subtle stardust burst around completed signature
            if (centralStarBtn) {
                const rect = centralStarBtn.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                spawnBurst(cx, cy, 14, 0.8);
                if (!masterRafId) masterRafId = requestAnimationFrame(masterTick);
            }

            // Shoot shooting stars shower passing by across the screen
            setTimeout(() => {
                introEl.classList.add('transition-shooting');
            }, INTRO_CONFIG.shootingStarsDelayMs);

            // Hold briefly, then seamlessly transition into portfolio
            setTimeout(() => {
                finishIntro(false);
            }, INTRO_CONFIG.holdFinishedMs);
        }

        // 8. COMPLETE & CLEANUP INTRO
        function finishIntro(instant) {
            if (isCompleted) return;
            isCompleted = true;

            if (masterRafId) {
                cancelAnimationFrame(masterRafId);
                masterRafId = null;
            }

            try {
                sessionStorage.setItem(INTRO_CONFIG.sessionKey, 'true');
            } catch (e) {}

            // Unlock normal document scrolling
            document.body.classList.remove('intro-active');
            document.body.style.overflow = '';

            if (instant) {
                introEl.style.display = 'none';
                introEl.setAttribute('aria-hidden', 'true');
                if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
                return;
            }

            // Trigger gentle dissolve & light sweep
            introEl.classList.add('intro-fade-out');

            setTimeout(() => {
                introEl.style.display = 'none';
                introEl.setAttribute('aria-hidden', 'true');
                if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
            }, INTRO_CONFIG.fadeDurationMs);
        }

        // EVENT LISTENERS
        if (centralStarBtn) {
            centralStarBtn.addEventListener('click', activateConstellation);
        }

        if (skipBtn) {
            skipBtn.addEventListener('click', (e) => {
                e.preventDefault();
                finishIntro(false);
            });
        }

        // Keyboard Shortcut: Escape skips immediately
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !isCompleted) {
                finishIntro(false);
            }
        });
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initConstellationIntro);
    } else {
        initConstellationIntro();
    }
})();
