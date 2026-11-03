/**
 * StartGOLD — Common Header/Footer Loader
 * Include this script on every page to automatically load shared components.
 *
 * WHAT THIS HANDLES:
 * 1. Injects common <head> CSS/font/analytics (from components/head-assets.html)
 * 2. Loads header HTML (from components/header.html)
 * 3. Loads footer HTML (from components/footer.html)
 * 4. Loads footer scripts (bootstrap.bundle.min.js)
 *
 * NOTE: google-site-verification meta must stay in each page's static HTML
 *       because Google's crawler doesn't execute JavaScript.
 */

// ── STEP 0: Inject common <head> assets from components/head-assets.html ──
// Uses sync XHR so CSS loads before first paint (avoids FOUC).
// To add/remove CSS, fonts, or analytics — edit components/head-assets.html.
(function injectHeadAssets() {
    try {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'components/head-assets.html', false);
        xhr.send();
        if (xhr.status !== 200) return;

        var parser = new DOMParser();
        var doc = parser.parseFromString(xhr.responseText, 'text/html');

        // Inject all <link> tags
        doc.querySelectorAll('link').forEach(function(link) {
            var href = link.getAttribute('href');
            if (href && !document.querySelector('link[href="' + href + '"]')) {
                document.head.appendChild(link.cloneNode(true));
            }
        });

        // Inject all <script> tags (async external + inline)
        doc.querySelectorAll('script').forEach(function(orig) {
            var s = document.createElement('script');
            Array.from(orig.attributes).forEach(function(a) { s.setAttribute(a.name, a.value); });
            if (orig.textContent) s.textContent = orig.textContent;
            document.head.appendChild(s);
        });
    } catch (e) {
        console.error('[StartGOLD] Failed to load head-assets.html:', e);
    }
})();

document.addEventListener('DOMContentLoaded', async () => {

    // === SCALE FACTOR TEST OVERRIDE ===
    // Usage: Add ?scale=1.4 or ?scale=2 to URL to test 2K/4K scaling on any screen
    // Example: http://localhost/startgold-wep/index.html?scale=2
    const urlParams = new URLSearchParams(window.location.search);
    const scaleOverride = urlParams.get('scale');
    if (scaleOverride && parseFloat(scaleOverride) > 1) {
        document.documentElement.style.setProperty('--sf', scaleOverride);
        // Inject the same calc() rules that normally live inside @media(min-width:1921px)
        const s = document.createElement('style');
        s.textContent = `
            :root { --sf: ${scaleOverride}; }
            .container,.container-lg,.container-md,.container-sm,.container-xl { max-width: calc(1140px * var(--sf)); }
            .hero-h1,.why-choose-title,.stable-invest-title,.sip-title,.faq-title,.about-hero-heading,.about-mv-heading,.golden-heading,.slide-heading,.digi-gold-heading,.how-title { font-size: calc(42px * var(--sf)); }
            h2,h3,.why-feature-title,.step-title,.contact-info-title,.wf-label,.stable-invest-sub,.sip-sub { font-size: calc(22px * var(--sf)); }
            .sip-grow-title { font-size: calc(36px * var(--sf)); }
            .stat-value { font-size: calc(43px * var(--sf)); }
            .golden-banner-heading { font-size: calc(55px * var(--sf)); }
            .digi-gold-tagline { font-size: calc(16px * var(--sf)); }
            .hero-desc,.hero-p,.why-feature-desc,.stable-invest-desc,.sip-desc,.sf-desc,.how-desc,.step-desc,.accordion-body,.form-control { font-size: calc(18px * var(--sf)); }
            .faq-question span,.faq-answer p,.sip-grow-text,.hero-trust-label,.stat-text,.sf-text { font-size: calc(14px * var(--sf)); }
            li,.stable-list-item,.sip-plan-value,.sip-plan-period { font-size: calc(18px * var(--sf)); }
            .menu-overlay a { font-size: calc(21px * var(--sf)); }
            .footer-heading { font-size: calc(32px * var(--sf)); }
            .footer-link,.footer-desc { font-size: calc(14px * var(--sf)); }
            .marquee-track span { font-size: calc(14px * var(--sf)); }
            .start-btn,.btn-start-invest { font-size: calc(16px * var(--sf)); }
            .trust-quote-text { font-size: calc(26px * var(--sf)); }
            .trust-logo-text { font-size: calc(14px * var(--sf)); }
            .accordion-button { font-size: calc(14px * var(--sf)); }
            .contact-info-text,.form-label { font-size: calc(16px * var(--sf)); }
            .sf-title { font-size: calc(18px * var(--sf)); }
            .sip-plan-title { font-size: calc(22px * var(--sf)); }
            .hero-badge { font-size: calc(14px * var(--sf)); padding: calc(6px * var(--sf)) calc(14px * var(--sf)); }
            .footer-logo img { height: calc(44px * var(--sf)); }
            .gold-nugget { width: calc(380px * var(--sf)); }
            .feature-icon,.sf-icon,.sf-icon img,.step-icon,.step-icon img,.faq-icon img { width: calc(48px * var(--sf)); height: calc(48px * var(--sf)); }
            .trust-cert-group img { height: calc(40px * var(--sf)); }
            .social-link img { width: calc(24px * var(--sf)); height: calc(24px * var(--sf)); }
            .hero-section { padding: calc(160px * var(--sf)) 0 calc(60px * var(--sf)); }
            .marquee-bar { margin-top: calc(90px * var(--sf)); margin-left: calc(124px * var(--sf)); margin-right: calc(124px * var(--sf)); top: calc(114px * var(--sf)); }
            .sip-section { margin-top: calc(-48px * var(--sf)); padding: calc(100px * var(--sf)) 0 calc(90px * var(--sf)); }
            .app-slider-section { padding: 0 0 calc(90px * var(--sf)); }
            .why-feature-card,.why-feature-card-wide { padding: calc(30px * var(--sf)); border-radius: calc(24px * var(--sf)); }
            .digi-gold-card { padding: calc(50px * var(--sf)) calc(60px * var(--sf)); border-radius: calc(40px * var(--sf)); }
            .digi-gold-section .container { max-width: calc(1100px * var(--sf)); }
            .site-footer-new .container { max-width: calc(1080px * var(--sf)); }
            .stable-invest-section { background-size: cover; }
        `;
        document.head.appendChild(s);
        console.log('[StartGOLD] Scale test mode: --sf = ' + scaleOverride);
    }

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

    // ── Inject common footer scripts (bootstrap.bundle) ──
    if (!document.querySelector('script[src*="bootstrap.bundle"]')) {
        const bsScript = document.createElement('script');
        bsScript.src = 'vendor/bootstrap/bootstrap.bundle.min.js';
        document.body.appendChild(bsScript);
    }

    // Initialize scroll animations after a small delay to let layout settle
    setTimeout(initScrollAnimations, 200);

    // Create scroll-to-top button
    initScrollToTop();
});

/** Header interactions — scroll, hamburger */
function initHeader() {
    // The header bar is now genuinely translucent via CSS (backdrop-filter
    // blur on .header-bar), so it adapts to whatever's behind it
    // automatically -- no more need to track scroll position against a
    // hardcoded list of section selectors/colors and manually paint a
    // matching background on the header every scroll tick. The only thing
    // still worth doing on scroll is toggling a lightweight "scrolled"
    // state for the small padding tweak once the user has moved off the
    // very top of the page.
    window.addEventListener('scroll', () => {
        const header = document.getElementById('siteHeader');
        if (!header) return;
        header.classList.toggle('scrolled', window.scrollY > 40);
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

    // Store links: direct-navigate on the matching platform, QR modal otherwise
    initAppLinks();

    // "Start Saving Gold" / "Start AutoGold" CTA buttons: direct-navigate on
    // a matching phone platform, both-QR modal on desktop
    initStoreCtaButtons();

    // "A newer version of this site is available" toast, whenever the
    // visitor's cached css/js is behind what's actually deployed
    initVersionCheck();
}

/** Detects when the visitor's browser is holding a stale cached copy of
 *  the site's own css/js and offers a one-click reload once it's confident
 *  the deployed files have actually changed -- e.g. after a deploy that
 *  purges/updates css/style.css or js/common.js on the server, someone who
 *  already had the site open (or whose browser aggressively cached those
 *  files) would otherwise keep running the old ones until they happen to
 *  do a manual hard refresh.
 *
 *  Deliberately requires NO manual "bump this version number on every
 *  deploy" step -- it compares the browser's own cached copy of each
 *  watched file against a guaranteed-fresh network fetch of the same URL,
 *  using the file's own ETag/Last-Modified/Content-Length (whichever the
 *  server provides) as the signature to compare. A real deploy that
 *  changes these files' content will naturally change at least one of
 *  those response headers, so there's nothing for anyone to remember to
 *  update alongside a deploy -- this reads the truth directly off the
 *  server every time.
 *
 *  Fails silently (no false "update available" toast) if the server
 *  doesn't send any of those headers for a given file, or if the
 *  visitor's browser/network blocks the extra fetches -- most static
 *  hosts/CDNs do send at least one of them by default, but this is not
 *  guaranteed for every possible hosting setup.
 */
function initVersionCheck() {
    const WATCHED_FILES = ['js/common.js', 'css/style.css'];
    const CHECK_INTERVAL_MS = 5 * 60 * 1000; // re-check every 5 minutes while the tab stays open
    const DISMISS_KEY_PREFIX = 'sg_update_dismissed_';
    let toastEl = null;

    function fileSignature(res) {
        // Prefer ETag (usually the most precise), then Last-Modified, then
        // Content-Length as a last resort -- weaker (two different file
        // contents could coincidentally be the same length), but still
        // catches most real changes if a host doesn't send the other two.
        return res.headers.get('etag') || res.headers.get('last-modified') || res.headers.get('content-length') || '';
    }

    function getSignatures(cacheMode) {
        return Promise.all(WATCHED_FILES.map((path) =>
            fetch(path, { cache: cacheMode }).then(fileSignature).catch(() => null)
        )).then((sigs) => sigs.join('|'));
    }

    function forceReload() {
        // Re-fetch the watched files with cache:'reload' one more time
        // right before navigating -- like the background check below,
        // this both bypasses the cache for reading AND overwrites the
        // browser's cache entry for that exact URL with the fresh
        // response, so the reload that follows picks up the new files
        // immediately rather than serving what was cached a moment ago.
        Promise.all(WATCHED_FILES.map((path) =>
            fetch(path, { cache: 'reload' }).catch(() => null)
        )).finally(() => {
            window.location.reload();
        });
    }

    function showToast(freshSig) {
        if (toastEl) return;
        toastEl = document.createElement('div');
        toastEl.className = 'version-toast';
        toastEl.setAttribute('role', 'status');
        toastEl.setAttribute('aria-live', 'polite');
        toastEl.innerHTML =
            '<span class="version-toast-text">A newer version of this site is available.</span>' +
            '<button type="button" class="version-toast-reload">Reload</button>' +
            '<button type="button" class="version-toast-close" aria-label="Dismiss">&times;</button>';
        document.body.appendChild(toastEl);
        requestAnimationFrame(() => requestAnimationFrame(() => toastEl.classList.add('show')));

        toastEl.querySelector('.version-toast-reload').addEventListener('click', forceReload);
        toastEl.querySelector('.version-toast-close').addEventListener('click', () => {
            sessionStorage.setItem(DISMISS_KEY_PREFIX + freshSig, '1');
            toastEl.classList.remove('show');
            const el = toastEl;
            toastEl = null;
            setTimeout(() => el.remove(), 400);
        });
    }

    function checkForUpdate() {
        Promise.all([getSignatures('force-cache'), getSignatures('reload')])
            .then(([cachedSig, freshSig]) => {
                if (!cachedSig || !freshSig) return; // headers unavailable -- stay quiet, no false alarm
                if (cachedSig === freshSig) return; // already up to date
                if (sessionStorage.getItem(DISMISS_KEY_PREFIX + freshSig)) return; // already dismissed this exact update
                showToast(freshSig);
            })
            .catch(() => { /* offline, blocked, etc. -- ignore */ });
    }

    checkForUpdate();
    setInterval(checkForUpdate, CHECK_INTERVAL_MS);
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') checkForUpdate();
    });
}

// Shared store links + branded QR images, used by both the header icons
// and the "Start Saving Gold"/"Start AutoGold" CTA buttons below.
const STORE_LINKS = {
    android: 'https://play.google.com/store/apps/details?id=com.startgold.app&pcampaignid=web_share',
    ios: 'https://apps.apple.com/in/app/startgold/id6786217713'
};
// Pre-made, branded (logo-in-the-middle) QR codes -- not generated on the
// fly, so there's no third-party QR API dependency at all.
const STORE_QR_IMAGES = {
    android: 'img/startGOLD_Android.png',
    ios: 'img/startGOLD_iOS.png'
};

// Copies a link to the clipboard and briefly swaps the button's icon/text
// to a "Copied!" confirmation state before reverting. Falls back to the
// older execCommand('copy') technique for any browser without the modern
// Clipboard API (or where it's blocked, e.g. non-HTTPS/insecure contexts).
function copyLinkToClipboard(url, btnEl) {
    if (!btnEl) return;
    const textEl = btnEl.querySelector('.qr-copy-btn-text');
    const iconEl = btnEl.querySelector('i');
    if (!textEl || !iconEl) return;
    if (btnEl._copyResetTimer) clearTimeout(btnEl._copyResetTimer);

    function showCopied() {
        textEl.textContent = 'Copied!';
        iconEl.className = 'bi bi-check2';
        btnEl.classList.add('copied');
        btnEl._copyResetTimer = setTimeout(() => {
            textEl.textContent = 'Copy Link';
            iconEl.className = 'bi bi-clipboard';
            btnEl.classList.remove('copied');
        }, 2000);
    }

    function legacyFallbackCopy() {
        try {
            const ta = document.createElement('textarea');
            ta.value = url;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.focus();
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            showCopied();
        } catch (e) { /* clipboard unavailable -- give up quietly */ }
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(showCopied).catch(legacyFallbackCopy);
    } else {
        legacyFallbackCopy();
    }
}

function detectPlatform() {
    // Prefer the modern, explicit User-Agent Client Hints API where the
    // browser supports it (Chromium-based browsers). Google's own guidance
    // is to use this over parsing navigator.userAgent going forward: that
    // string is being progressively "reduced" (frozen minor/patch version,
    // genericized device model) as part of Chrome's ongoing UA Reduction
    // rollout, so relying on it alone gets less reliable as that continues.
    // userAgentData.platform/.mobile are synchronous (unlike
    // getHighEntropyValues(), which is async), so this needs no restructuring.
    if (navigator.userAgentData && navigator.userAgentData.platform) {
        if (/android/i.test(navigator.userAgentData.platform)) return 'android';
    }

    const ua = navigator.userAgent || navigator.vendor || '';
    // iPadOS 13+ reports itself as "MacIntel" with no "iPad" in the UA
    // string at all, so a touch-capable "Mac" is treated as iOS too.
    const isIpadOS13Plus = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
    if (/android/i.test(ua)) return 'android';
    if (/iPad|iPhone|iPod/.test(ua) || isIpadOS13Plus) return 'ios';
    return 'desktop';
}

// Chrome for iOS (CriOS) has a long-standing, widely-reported bug where a
// target="_blank" link opens a new tab that immediately closes itself and
// bounces back to the original tab -- visible as a brief flash, then
// landing back on this page instead of the store. It's specific to
// Chrome's iOS build (a thin WebKit wrapper, not Safari's own engine), so
// the fix is to skip target="_blank" for that one browser and just
// navigate the current tab instead.
function isChromeIOS() {
    return /CriOS/i.test(navigator.userAgent || '');
}

// Opens a URL the way a real link click would (rather than window.open(),
// which several mobile browsers visibly open as a blank tab first and only
// navigate a moment later -- the "blank tab then redirect" delay). Falls
// back to same-tab navigation on Chrome for iOS specifically, to sidestep
// its self-closing-tab bug described above.
function openStoreLink(url) {
    if (isChromeIOS()) {
        window.location.href = url;
        return;
    }
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

/** Store-link routing + QR modal for the two header icons.
 *  - Android visitor clicking Google Play  -> opens normally (new tab)
 *  - iOS visitor clicking the App Store    -> opens normally (new tab)
 *  - Any other combination (wrong platform, or desktop clicking either)
 *    -> shows a QR modal instead, with the branded pre-made QR image for
 *       that store, so a desktop visitor (or someone on the "wrong" phone
 *       OS) can scan it with their phone rather than land on a store page
 *       they can't use.
 */
function initAppLinks() {
    const platform = detectPlatform();

    const playLink = document.getElementById('playStoreLink');
    const appLink = document.getElementById('appStoreLink');
    const qrBackdrop = document.getElementById('qrModalBackdrop');
    const qrModal = document.getElementById('qrModal');
    const qrImg = document.getElementById('qrModalImg');
    const qrTitle = document.getElementById('qrModalTitle');
    const qrSub = document.getElementById('qrModalSub');
    const qrCopyBtn = document.getElementById('qrModalCopyBtn');
    const qrClose = document.getElementById('qrModalClose');
    if (!playLink || !appLink || !qrBackdrop || !qrModal) return;

    let currentUrl = '';

    function openQrModal(url, storeName, qrImgSrc, scanCaption) {
        currentUrl = url;
        qrImg.src = qrImgSrc;
        qrImg.alt = storeName + ' QR code';
        qrTitle.textContent = 'Get the app on ' + storeName;
        qrSub.textContent = scanCaption;
        qrBackdrop.classList.add('open');
        qrModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    if (qrCopyBtn) {
        qrCopyBtn.addEventListener('click', () => copyLinkToClipboard(currentUrl, qrCopyBtn));
    }

    function closeQrModal() {
        qrBackdrop.classList.remove('open');
        qrModal.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (qrClose) qrClose.addEventListener('click', closeQrModal);
    qrBackdrop.addEventListener('click', closeQrModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeQrModal();
    });

    playLink.addEventListener('click', (e) => {
        if (platform !== 'android') {
            e.preventDefault();
            openQrModal(STORE_LINKS.android, 'Google Play', STORE_QR_IMAGES.android, 'Scan to download from PlayStore');
        }
        // On Android, do nothing extra -- the link's own href + target="_blank" handles it.
        // (Chrome for iOS's self-closing-tab bug doesn't apply here: this
        // branch only runs when the visitor is actually on Android.)
    });

    appLink.addEventListener('click', (e) => {
        if (platform !== 'ios') {
            e.preventDefault();
            openQrModal(STORE_LINKS.ios, 'the App Store', STORE_QR_IMAGES.ios, 'Scan to download from AppStore');
        } else if (isChromeIOS()) {
            // Let openStoreLink() handle Chrome-iOS's same-tab workaround
            // instead of the plain target="_blank" click that would
            // otherwise trigger the self-closing-tab bug.
            e.preventDefault();
            openStoreLink(STORE_LINKS.ios);
        }
        // Otherwise (Safari, or any other non-Chrome iOS browser): let the
        // native target="_blank" click proceed as normal.
    });
}

/** "Start Saving Gold" / "Start AutoGold" CTA buttons (a single button,
 *  unlike the two separate header icons):
 *  - Android visitor -> opens Google Play directly (new tab)
 *  - iOS/iPadOS visitor -> opens the App Store directly (new tab)
 *  - Desktop visitor -> shows both store QR codes at once, since there's
 *    no single icon to click that already implies which store they meant.
 */
function initStoreCtaButtons() {
    const buttons = document.querySelectorAll('.js-store-cta');
    if (!buttons.length) return;

    const platform = detectPlatform();
    const dualBackdrop = document.getElementById('dualQrModalBackdrop');
    const dualModal = document.getElementById('dualQrModal');
    const dualClose = document.getElementById('dualQrModalClose');

    if (dualModal) {
        dualModal.querySelectorAll('.qr-copy-btn[data-store]').forEach((btn) => {
            const store = btn.getAttribute('data-store');
            const url = STORE_LINKS[store];
            if (url) btn.addEventListener('click', () => copyLinkToClipboard(url, btn));
        });
    }

    function openDualQrModal() {
        if (!dualBackdrop || !dualModal) return;
        dualBackdrop.classList.add('open');
        dualModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeDualQrModal() {
        if (!dualBackdrop || !dualModal) return;
        dualBackdrop.classList.remove('open');
        dualModal.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (dualClose) dualClose.addEventListener('click', closeDualQrModal);
    if (dualBackdrop) dualBackdrop.addEventListener('click', closeDualQrModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeDualQrModal();
    });

    buttons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (platform === 'android') {
                openStoreLink(STORE_LINKS.android);
            } else if (platform === 'ios') {
                openStoreLink(STORE_LINKS.ios);
            } else {
                openDualQrModal();
            }
        });
    });
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
            const sellprice = parts[4];
            if (id === '1') {
                document.querySelectorAll('#rateGold, .rate-val-gold').forEach(el => {
                    el.innerHTML = '<span class="rupee">₹</span> ' + formatPrice(sellprice) + '/gm';
                });
            } else if (id === '3') {
                document.querySelectorAll('#rateSilver, .rate-val-silver').forEach(el => {
                    el.innerHTML = '<span class="rupee">₹</span> ' + formatPrice(sellprice) + '/gm';
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
