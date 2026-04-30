/**
 * StartGOLD — Viewport Scale Bridge
 * 
 * Problem: Client demands fixed pixel sizes (no clamp/%), but layout breaks 
 * between media query breakpoints when window is resized inch-by-inch.
 * 
 * Solution: Use CSS `zoom` to proportionally scale the entire page when the 
 * viewport falls between breakpoints. This preserves every fixed px value 
 * exactly as-is — it just "zooms" the rendered page to fit the viewport width.
 * 
 * How it works:
 * - Each breakpoint has a "design width" — the viewport width the CSS was designed for.
 * - When the viewport is between two breakpoints, we calculate a zoom factor
 *   so the page renders at the upper breakpoint's design width, then zooms down to fit.
 * - Uses screen.width on mobile to avoid the zoom feedback loop with window.innerWidth.
 */
(function () {
    'use strict';

    // Define breakpoint ranges: [max-width threshold, design width for that range]
    // Sorted descending — first match wins
    var BREAKPOINTS = [
        { max: 1299, design: 1300 },
        { max: 1199, design: 1200 },
        { max: 1050, design: 1050 },
        { max: 991,  design: 992  },
        { max: 900,  design: 900  },
        { max: 767,  design: 768  },
        { max: 750,  design: 750  },
        { max: 730,  design: 730  },
        { max: 650,  design: 650  },
        { max: 480,  design: 480  },
        { max: 400,  design: 400  }
    ];

    // Minimum zoom to prevent text from becoming unreadable
    var MIN_ZOOM = 0.75;

    // Get the REAL viewport width, compensating for zoom applied
    function getRealViewportWidth() {
        var currentZoom = parseFloat(document.documentElement.style.zoom) || 1;
        // When zoom is applied, window.innerWidth reports the zoomed width,
        // so we need to multiply by zoom to get the real CSS pixel width
        return Math.round(window.innerWidth * currentZoom);
    }

    function getDesignWidth(viewportWidth) {
        for (var i = 0; i < BREAKPOINTS.length; i++) {
            if (viewportWidth <= BREAKPOINTS[i].max) {
                return BREAKPOINTS[i].design;
            }
        }
        return null;
    }

    function applyScale() {
        var vw = getRealViewportWidth();

        var designWidth = getDesignWidth(vw);
        
        if (!designWidth || vw >= designWidth) {
            // Viewport is at or above the design width — no zoom needed
            document.documentElement.style.zoom = '';
            return;
        }

        // Calculate zoom factor: viewport / design width
        var zoomFactor = vw / designWidth;

        // Clamp to minimum zoom
        if (zoomFactor < MIN_ZOOM) {
            zoomFactor = MIN_ZOOM;
        }

        // Round to 4 decimal places to avoid sub-pixel jitter
        zoomFactor = Math.round(zoomFactor * 10000) / 10000;

        document.documentElement.style.zoom = zoomFactor;
    }

    // Debounce resize events for performance
    var resizeTimer = null;
    function onResize() {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(applyScale, 50);
    }

    // Apply on resize and orientation change
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', function () {
        setTimeout(applyScale, 100);
    });

    // Initial apply
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyScale);
    } else {
        applyScale();
    }
})();
