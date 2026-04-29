/**
 * StartGOLD — Common Header/Footer Loader
 * Include this script on every page to automatically load shared components.
 */
document.addEventListener('DOMContentLoaded', async () => {

    // Load Header
    const headerSlot = document.getElementById('header-slot');
    if (headerSlot) {
        try {
            const res = await fetch('components/header.html');
            headerSlot.innerHTML = await res.text();
            initHeader();
        } catch (e) {
            console.error('Failed to load header:', e);
        }
    }

    // Load Footer
    const footerSlot = document.getElementById('footer-slot');
    if (footerSlot) {
        try {
            const res = await fetch('components/footer.html');
            footerSlot.innerHTML = await res.text();
        } catch (e) {
            console.error('Failed to load footer:', e);
        }
    }

    // Initialize scroll animations after a small delay to let layout settle
    setTimeout(initScrollAnimations, 200);

    // Create scroll-to-top button
    initScrollToTop();
});

/** Header interactions — scroll, hamburger */
function initHeader() {
    // Scroll effect
    window.addEventListener('scroll', () => {
        const header = document.getElementById('siteHeader');
        if (header) header.classList.toggle('scrolled', scrollY > 40);
    });

    // Hamburger menu
    const ham = document.getElementById('hamburger');
    const ov = document.getElementById('menuOverlay');
    const bd = document.getElementById('menuBackdrop');

    function closeMenu() {
        ham.classList.remove('open');
        ov.classList.remove('open');
        if (bd) bd.classList.remove('open');
        document.body.style.overflow = '';
    }

    function toggleMenu() {
        ham.classList.toggle('open');
        ov.classList.toggle('open');
        if (bd) bd.classList.toggle('open');
        document.body.style.overflow = ov.classList.contains('open') ? 'hidden' : '';
    }

    // Assign active state to current menu page
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    if (ov) {
        ov.querySelectorAll('a').forEach(a => {
            if (a.getAttribute('href') === currentPath) {
                a.classList.add('active');
            }
        });
    }

    if (ham && ov) {
        ham.addEventListener('click', toggleMenu);
        // Close on backdrop click
        if (bd) bd.addEventListener('click', closeMenu);
        // Close on link click
        ov.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    }

    // Start live rate updates via WebSocket
    initLiveRates();
}

/** Live Gold & Silver rates via WebSocket */
function initLiveRates() {
    // Obfuscated connection params (XOR 0x5A) — not stored as plain strings
    const _x = 0x5A;
    const _d = function(a) { return a.map(function(c) { return String.fromCharCode(c ^ _x); }).join(''); };
    const WS_URL = 'wss://sgbackoffice.startgold.com/ws/';
    const PROTOCOLS = [_d([106,56,104,98,108,59,98,56,107,107,106,106,60,106,99,109,63,109,57,98,63,98,109,99,62,56,62,110,107,109,110,63,110,108,98,59,99,63,99,104,60,98,98,98,63,108,63,104,98,99,111,99,111,63,60,62,62,110,109,110,109,56,98,99])];
    const RECONNECT_BASE = 3000;   // start at 3s
    const RECONNECT_MAX = 30000;   // cap at 30s

    let ws = null;
    let reconnectTimer = null;
    let retryCount = 0;

    function formatPrice(val) {
        const num = parseFloat(val);
        if (isNaN(num)) return '--';
        return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function parseAndUpdate(raw) {
        const items = raw.trim().split(/\s+(?=3\|)/);
        items.forEach(item => {
            const parts = item.split('|');
            if (parts.length < 5 || parts[0] !== '3') return;
            const id = parts[1];
            const buyPrice = parts[3];
            if (id === '1') {
                document.querySelectorAll('#rateGold, .rate-val-gold').forEach(el => {
                    el.textContent = '₹ ' + formatPrice(buyPrice) + '/gm';
                });
            } else if (id === '3') {
                document.querySelectorAll('#rateSilver, .rate-val-silver').forEach(el => {
                    el.textContent = '₹ ' + formatPrice(buyPrice) + '/gm';
                });
            }
        });
    }

    function connect() {
        // Don't connect if tab is hidden or offline
        if (document.hidden || !navigator.onLine) return;
        // Clean up any existing connection
        disconnect();

        ws = new WebSocket(WS_URL, PROTOCOLS);

        ws.onopen = function () {
            retryCount = 0; // reset backoff on successful connection
        };

        ws.onmessage = function (e) {
            const data = e.data;
            if (!data || data === 'R') return;
            const cleaned = data.replace(/^R[\s\t]+/, '');
            parseAndUpdate(cleaned);
        };

        ws.onclose = function () {
            ws = null;
            scheduleReconnect();
        };

        ws.onerror = function () {
            try { ws.close(); } catch (x) {}
        };
    }

    function disconnect() {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
        if (ws) {
            try { ws.close(); } catch (x) {}
            ws = null;
        }
    }

    function scheduleReconnect() {
        if (reconnectTimer) return; // already scheduled
        if (document.hidden || !navigator.onLine) return; // wait for visibility/network events
        const delay = Math.min(RECONNECT_BASE * Math.pow(1.5, retryCount), RECONNECT_MAX);
        retryCount++;
        reconnectTimer = setTimeout(() => {
            reconnectTimer = null;
            connect();
        }, delay);
    }

    // --- Tab visibility: disconnect when hidden, reconnect when visible ---
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            disconnect();
        } else {
            retryCount = 0; // fresh start when user comes back
            connect();
        }
    });

    // --- Network: reconnect when back online ---
    window.addEventListener('online', () => {
        retryCount = 0;
        connect();
    });

    window.addEventListener('offline', () => {
        disconnect();
    });

    // Initial connection
    connect();
}

/** Scroll Animations — auto-detect and animate elements on scroll */
function initScrollAnimations() {
    // Auto-annotate elements with data-anim attributes
    const animRules = [
        // === INDEX PAGE HERO ===
        { sel: '.hero-h1', anim: 'fade-up' },
        { sel: '.hero-p', anim: 'fade-up' },
        { sel: '.hero-badges', anim: 'fade-up' },
        { sel: '.hero-phone', anim: 'zoom-in' },
        // === ABOUT / FEATURES / CONTACT HERO ===
        { sel: '.about-hero-heading', anim: 'fade-up' },
        { sel: '.about-hero-desc', anim: 'fade-up' },
        { sel: '.about-hero-logo, .features-hero-img', anim: 'zoom-in' },
        // === MARQUEE ===
        { sel: '.marquee-bar', anim: 'fade-in' },
        // === SECTION HEADINGS ===
        { sel: '.sip-header, .about-why-header, .feat-showcase-heading, .slide-heading', anim: 'fade-up' },
        { sel: '.about-mv-heading, .why-section-heading', anim: 'fade-up' },
        // === CARDS (staggered) ===
        { sel: '.why-feature-card, .about-why-card, .about-mv-card', anim: 'fade-up', stagger: true },
        // === SIP SECTION ===
        { sel: '.sip-content-left', anim: 'slide-left' },
        { sel: '.sip-content-right', anim: 'slide-right' },
        { sel: '.sip-plan-card', anim: 'fade-up', stagger: true },
        // === TRUST BADGES ===
        { sel: '.trust-badge-item', anim: 'fade-up', stagger: true },
        // === APP SHOWCASE SLIDER ===
        { sel: '.slide-features.left .slide-feature', anim: 'slide-left', stagger: true },
        { sel: '.slide-features.right .slide-feature', anim: 'slide-right', stagger: true },
        { sel: '.slide-phone', anim: 'zoom-in' },
        // === DIGITAL GOLD SECTION ===
        { sel: '.digi-gold-content', anim: 'fade-up' },
        { sel: '.digi-gold-visual', anim: 'scale-in' },
        // === FEATURE SHOWCASE ===
        { sel: '.feat-showcase-image', anim: 'zoom-in' },
        // === SIP SECTION HEADER (features page) ===
        { sel: '.sip-title, .sip-desc', anim: 'fade-up' },
        { sel: '.sip-grow-title', anim: 'fade-up' },
        // === FAQ ===
        { sel: '.faq-item', anim: 'fade-up', stagger: true },
        // === FOOTER ===
        { sel: '.footer-col', anim: 'fade-up', stagger: true },
        // === CONTACT PAGE ===
        { sel: '.contact-info-card', anim: 'slide-left' },
        { sel: '.contact-form-card', anim: 'slide-right' },
        // === POLICY / TERMS SECTIONS ===
        { sel: '.policy-section', anim: 'fade-up', stagger: true },
        { sel: '.policy-intro', anim: 'fade-up' },
        // === BREADCRUMB ===
        { sel: '.breadcrumb-nav', anim: 'fade-in' },
        // === CTA BUTTONS ===
        { sel: '.btn-start-invest', anim: 'fade-up' },
        // === GOLDEN BANNER ===
        { sel: '.golden-heading', anim: 'fade-up' },
        { sel: '.golden-logo', anim: 'zoom-in' },
        // === WHY CHOOSE SECTION ===
        { sel: '.why-choose-header', anim: 'fade-up' },
        { sel: '.why-feature-card', anim: 'fade-up', stagger: true },
        // === STABLE INVESTMENT SECTION ===
        { sel: '.stable-invest-header', anim: 'fade-up' },
        { sel: '.stable-invest-left', anim: 'slide-left' },
        { sel: '.stable-invest-right', anim: 'slide-right' },
        { sel: '.stat-block', anim: 'fade-up', stagger: true },
    ];

    animRules.forEach(rule => {
        const els = document.querySelectorAll(rule.sel);
        els.forEach((el, i) => {
            // Skip elements already annotated or inside the header
            if (el.dataset.anim || el.closest('#siteHeader')) return;
            el.dataset.anim = rule.anim;
            if (rule.stagger) {
                el.dataset.animDelay = String(Math.min(i + 1, 6));
            }
        });
    });

    // Intersection Observer for triggering animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target); // Animate once only
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '50px 0px -20px 0px'
    });

    // Observe all annotated elements
    const allAnimEls = document.querySelectorAll('[data-anim]');
    allAnimEls.forEach(el => observer.observe(el));

    // Force-trigger elements already in viewport (hero/top sections)
    // Small stagger so they don't all pop at once
    requestAnimationFrame(() => {
        let delay = 0;
        allAnimEls.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                setTimeout(() => {
                    el.classList.add('in-view');
                    observer.unobserve(el);
                }, delay);
                delay += 120; // stagger each visible element by 120ms
            }
        });
    });
}

/** Scroll-to-Top Button with circular scroll progress ring */
function initScrollToTop() {
    // Create wrapper
    const wrap = document.createElement('div');
    wrap.id = 'scrollToTopWrap';

    // SVG progress ring (circle circumference = 2 * π * 20 ≈ 125.66)
    const circumference = 125.66;
    wrap.innerHTML = `
        <svg class="scroll-progress-ring" viewBox="0 0 48 48">
            <circle class="ring-bg" cx="24" cy="24" r="20"/>
            <circle class="ring-fill" cx="24" cy="24" r="20"
                stroke-dasharray="${circumference}"
                stroke-dashoffset="${circumference}"/>
        </svg>
        <button id="scrollToTopBtn" aria-label="Scroll to top" title="Back to top">
            <i class="bi bi-chevron-up"></i>
        </button>
    `;
    document.body.appendChild(wrap);

    const btn = document.getElementById('scrollToTopBtn');
    const ringFill = wrap.querySelector('.ring-fill');

    // Update progress ring + show/hide button on scroll
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollTop = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progress = docHeight > 0 ? scrollTop / docHeight : 0;

                // Update ring
                const offset = circumference - (progress * circumference);
                ringFill.style.strokeDashoffset = offset;

                // Show/hide
                wrap.classList.toggle('visible', scrollTop > 300);

                ticking = false;
            });
            ticking = true;
        }
    });

    // Smooth scroll to top on click
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
