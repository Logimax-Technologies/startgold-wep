# StartGOLD Website — Development Rules & Standards

> This document defines the design system, HTML structure patterns, CSS architecture, and coding conventions for the StartGOLD website. **All pages must follow these rules exactly.**

---

## 1. Project Structure

```
startgold-wep/
├── index.html              # Home / Landing page
├── about.html              # About Us page (REFERENCE for all inner pages)
├── features.html           # Features page
├── contact.html            # Contact page
├── privacy-policy.html     # Privacy Policy
├── terms-conditions.html   # Terms & Conditions
├── refund-policy.html      # Refund Policy
├── faq.html                # Frequently Asked Questions
├── css/
│   ├── style.css           # Base styles & desktop design system
│   └── media.css           # ALL responsive breakpoints
├── js/
│   ├── common.js           # Shared header/footer loader, live rates, scroll animations
│   └── viewport-scale.js   # Viewport scaling logic
├── components/
│   ├── header.html         # Shared header component
│   └── footer.html         # Shared footer component
├── vendor/
│   ├── bootstrap/          # Bootstrap 5 CSS + JS bundle
│   ├── bootstrap-icons/    # Bootstrap Icons
│   └── fonts/              # Custom fonts (NumberFont, Playfair Display)
└── img/                    # All images and assets
```

---

## 2. Design System (CSS Variables)

All colors and typography values are defined in `:root` in `style.css`. **Never hardcode values — always use CSS variables.**

### Colors
| Variable       | Value       | Usage                      |
|---------------|-------------|----------------------------|
| `--dk-green`  | `#003716`   | Primary dark green          |
| `--mid-green` | `#055e32`   | Secondary green             |
| `--nav-green` | `#022a16`   | Navigation background       |
| `--gold`      | `#d4a017`   | Gold accent                 |
| `--cream`     | `#fcebbb`   | Body/section backgrounds    |
| `--red`       | `#e02a2a`   | Error/alert                 |

### Typography
| Variable               | Desktop Value | Usage                        |
|------------------------|---------------|------------------------------|
| `--serif`              | Playfair Display | Headings, hero text        |
| `--sans`               | Playfair Display | Body text, descriptions    |
| `--m-h1-size`          | `42px`        | H1 headings                  |
| `--m-sub-size`         | `22px`        | Sub-headings                 |
| `--m-body-size`        | `18px`        | Body text                    |
| `--m-small-size`       | `14px`        | Small text                   |
| `--m-xsmall-size`      | `12px`        | Extra small text             |
| `--m-tagline-size`     | `16px`        | Taglines                     |
| `--m-faq-text-size`    | `16px`        | FAQ answer text              |
| `--m-sf-text-size`     | `13px`        | Feature description text     |

---

## 3. HTML Page Template (Mandatory Structure)

Every inner page (About, Privacy, Terms, Refund, FAQ, Features, Contact) **MUST** follow this exact HTML skeleton:

### Head Section
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>[Page Title] - StartGOLD | Digital Gold Investment Platform</title>
    <meta name="description" content="[Page-specific description]">
    <link rel="icon" href="favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="vendor/fonts/fonts.css">
    <link href="vendor/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="vendor/bootstrap-icons/bootstrap-icons.css">
    <link rel="stylesheet" href="css/style.css?v=3">
    <link rel="stylesheet" href="css/media.css?v=3">
    <script src="js/viewport-scale.js"></script>
</head>
```

### Body Structure (CRITICAL — follow exactly)
```html
<body>
    <!-- Header MUST be OUTSIDE about-top-wrapper -->
    <div id="header-slot"></div>

    <!-- Hero wrapper with golden background -->
    <div class="about-top-wrapper">
        <section class="about-hero">
            <div class="container">
                <!-- Breadcrumb navigation -->
                <nav class="breadcrumb-nav" aria-label="breadcrumb">
                    <a href="index.html">Home</a>
                    <span class="breadcrumb-sep">›</span>
                    <span class="breadcrumb-current">[Page Name]</span>
                </nav>
                <!-- Two-column hero layout -->
                <div class="row align-items-center">
                    <div class="col-lg-7 col-md-7">
                        <h1 class="about-hero-heading">[Page Heading]</h1>
                        <p class="about-hero-desc">[Description text]</p>
                    </div>
                    <div class="col-lg-5 col-md-5 text-lg-end text-center">
                        <img src="img/logobody.png" alt="startGOLD" class="about-hero-logo">
                    </div>
                </div>
            </div>
        </section>
    </div>

    <!-- Page-specific content sections go here -->

    <!-- Footer MUST be OUTSIDE all wrappers -->
    <div id="footer-slot"></div>

    <script src="vendor/bootstrap/bootstrap.bundle.min.js"></script>
    <script src="js/common.js"></script>
</body>
</html>
```

> [!CAUTION]
> **`#header-slot` must ALWAYS be placed OUTSIDE the `.about-top-wrapper` div.** Placing it inside breaks the hero background and layout. The About Us page (`about.html`) is the canonical reference.

> [!IMPORTANT]
> **The logo column MUST always use `col-lg-5 col-md-5`** — both classes are required. Missing `col-md-5` breaks the layout at tablet widths.

---

## 4. Hero Section Rules

The hero section (`.about-top-wrapper` + `.about-hero`) is the golden banner at the top of every inner page.

### Structure Requirements
- **Background**: Golden/cream textured via `url(../img/why_body1.png)` in `.about-top-wrapper`
- **Border radius**: `60px` bottom corners (desktop), `35px` (mobile ≤767px)
- **Padding**: Left `30px` on desktop, `0px` on mobile
- **Logo image**: `img/logobody.png` — `max-height: 200px` desktop, `140px` at `767px`, `150px` at smaller

### Responsive Behavior
| Breakpoint      | Heading        | Description     | Logo         | Layout            |
|-----------------|----------------|-----------------|--------------|-------------------|
| > 767px         | Left-aligned   | Left-aligned    | Right column | Side-by-side      |
| ≤ 767px         | Centered       | Centered        | Centered     | Stacked (natural) |

### Mobile Overrides (≤ 767px)
```css
.about-hero { padding: 20px 0 0px; }
.about-hero-heading { text-align: center; padding-left: 0px; }
.about-hero-desc { font-size: var(--m-sf-text-size); text-align: center; padding-left: 0px; }
.about-hero-logo { max-height: 150px; margin-bottom: 40px; }
.about-top-wrapper { padding-left: 0px; border-bottom-right-radius: 35px; border-bottom-left-radius: 35px; }
.breadcrumb-nav { padding-left: 0px; }
```

---

## 5. Policy / Content Pages (Privacy, Terms, Refund)

These pages follow the hero section with a `.policy-content` section:

```html
<section class="policy-content">
    <div class="container">
        <div class="policy-card">
            <!-- Introduction -->
            <div class="policy-intro">
                <p>Introduction text...</p>
            </div>

            <!-- Numbered sections -->
            <div class="policy-section" id="[section-id]">
                <h1 class="policy-heading">
                    <span class="policy-num">1.</span> Section Title
                </h1>
                <p>Content...</p>
            </div>
            <!-- More sections... -->
        </div>
    </div>
</section>
```

### CSS Classes
| Class                  | Purpose                                    |
|-----------------------|---------------------------------------------|
| `.policy-content`     | Wrapper section for policy body              |
| `.policy-card`        | White card container with padding/radius     |
| `.policy-intro`       | Introduction paragraph block                 |
| `.policy-section`     | Each numbered section                        |
| `.policy-heading`     | Section heading (uses `<h1>`)                |
| `.policy-num`         | Styled number prefix (e.g., "1.")            |
| `.policy-list`        | Styled `<ul>` for bullet points              |
| `.policy-subheading`  | Sub-heading within a section (`<h3>`)        |
| `.policy-highlight`   | Highlighted callout with icon                |
| `.policy-contact-card`| Contact info grid card                       |
| `.policy-contact-item`| Individual contact entry (icon + text)       |

---

## 6. FAQ Page Rules

The FAQ page uses the same hero section, followed by an accordion:

```html
<section class="faq-section faq-sectionpage" style="padding-top: 50px; padding-bottom: 100px;">
    <div class="container">
        <div class="faq-accordion">
            <div class="faq-item active">
                <button class="faq-question">
                    <span>Question text</span>
                    <span class="faq-icon"></span>
                </button>
                <div class="faq-answer">
                    <p>Answer text</p>
                </div>
            </div>
            <!-- More items... -->
        </div>
    </div>
</section>
```

> [!NOTE]
> `.faq-sectionpage` overrides the negative `top` offset applied to the FAQ section on the home page (`top: 0px !important; margin-bottom: 0px !important;`).

---

## 7. CSS Architecture

### File Responsibilities
| File          | Responsibility                                                |
|---------------|---------------------------------------------------------------|
| `style.css`   | All base/desktop styles, design tokens, component styles      |
| `media.css`   | ALL responsive breakpoints (max-width AND min-width)          |

### Breakpoint System (max-width, descending)
| Breakpoint | Target                                    |
|-----------|-------------------------------------------|
| 1299px    | Large desktop tweaks                       |
| 1199px    | Standard laptop                            |
| 1050px    | Small laptop / section padding             |
| 991px     | Tablet portrait                            |
| 900px     | Small tablet                               |
| 767px     | **Mobile breakpoint** (major layout shift) |
| 750px     | Mobile fine-tuning                         |
| 730px     | Mobile fine-tuning                         |
| 556px     | Small mobile                               |
| 520px     | Small mobile                               |
| 480px     | Extra small mobile                         |
| 430px     | iPhone mini                                |
| 400px     | Smallest supported                         |

### Breakpoint System (min-width, ascending)
| Breakpoint | Target                                    |
|-----------|-------------------------------------------|
| 1200px    | Desktop enhancements                       |
| 1300px    | Wide desktop                               |
| 1400px    | Full HD                                    |
| 1440px    | 1440p                                      |
| 1500px    | Large monitors                             |
| 1920px    | Full HD scaling                            |
| 2560px    | 2K/QHD displays                            |
| 3840px    | 4K displays                                |

> [!WARNING]
> **Never add styles outside media queries** in `media.css` unless they are intentionally global overrides. Some legacy code exists outside queries near line 380-466 — avoid repeating this pattern.

---

## 8. Heading Font Size Cascade

Headings scale down through breakpoints. The selectors are grouped together at each breakpoint:

```css
/* Selector group used at every breakpoint */
.hero-h1,
.why-choose-title,
.stable-invest-title,
.sip-title,
.faq-title,
.about-hero-heading,
.about-mv-heading,
.about-why-title,
.feat-showcase-heading,
.slide-heading,
.digi-gold-heading { ... }
```

| Breakpoint | Font Size |
|-----------|-----------|
| Desktop   | 42px      |
| ≤ 1050px  | 36px      |
| ≤ 991px   | 27px      |
| ≤ 767px   | 26px      |

---

## 9. Component Loading (common.js)

Header and footer are loaded dynamically from `components/` via `common.js`:

- `components/header.html` → injected into `#header-slot`
- `components/footer.html` → injected into `#footer-slot`

### After Load
1. Header scroll effects initialized (background color changes per section)
2. Hamburger menu toggled
3. Live gold/silver rates via WebSocket (`wss://sgbackoffice.startgold.com/ws/`)
4. Scroll animations applied (IntersectionObserver + data-anim attributes)
5. Scroll-to-top button created

---

## 10. Scroll Animations

Elements are auto-annotated with `data-anim` attributes by `common.js`. Available animation types:

| Animation      | Usage                              |
|---------------|-------------------------------------|
| `fade-up`     | Cards, headings, sections           |
| `fade-in`     | Marquee, breadcrumb                 |
| `zoom-in`     | Phone images, logos                  |
| `slide-left`  | Left-side content                   |
| `slide-right` | Right-side content                  |
| `scale-in`    | Visual elements                     |

> [!TIP]
> Staggered animations use `data-anim-delay` (1–6) to offset reveal timing.

---

## 11. High-Resolution Scaling (2K/4K)

The site uses a CSS custom property `--sf` (scale factor) for high-DPI displays:

| Resolution | Scale Factor |
|-----------|-------------|
| ≥ 1440px  | 1.0         |
| ≥ 1920px  | 1.15        |
| ≥ 2560px  | Calculated  |
| ≥ 3840px  | Calculated  |

Scale can be tested via URL: `?scale=2` (applies via `common.js`).

---

## 12. Coding Conventions

### HTML
- Use semantic HTML5 elements (`<section>`, `<nav>`, `<article>`)
- Every `<img>` must have a meaningful `alt` attribute
- Use `aria-label` on navigation elements
- Keep `<h1>` per page — one in hero, numbered headings in policy pages use `<h1>` with `.policy-heading` class
- Bootstrap grid: `col-lg-*` for desktop, `col-md-*` for tablet — **always include both**

### CSS
- **No inline styles** except where absolutely necessary (e.g., FAQ section padding override)
- Use CSS variables for all colors and sizes
- Group related properties together
- Comment section headers with `/* ======== SECTION NAME ======== */`
- Media queries in `media.css` only — never in `style.css`

### JavaScript
- All shared logic lives in `common.js`
- Page-specific scripts go inline or in `js/[page].js`
- No jQuery — vanilla JS only
- Use `async/await` for fetch calls

---

## 13. Common Pitfalls & Rules

> [!CAUTION]
> 1. **`#header-slot` placement**: ALWAYS outside `.about-top-wrapper`. Putting it inside breaks the golden hero background on scroll.
> 2. **Logo column**: Must have BOTH `col-lg-5` AND `col-md-5`. Missing `col-md-5` causes the logo to stack below 992px unexpectedly.
> 3. **CSS cache busting**: Stylesheets use `?v=3` query param. Bump this when deploying CSS changes.
> 4. **Don't duplicate media queries**: The `media.css` file is large (~7600 lines). Search before adding new breakpoint blocks.
> 5. **`.faq-sectionpage` class**: Required on FAQ page to override the home page's negative positioning hack.
> 6. **Scale factor testing**: Use `?scale=X` URL param — don't hardcode test overrides in CSS.

---

## 14. Reference Pages

| Page              | File                       | Role                           |
|-------------------|----------------------------|--------------------------------|
| **About Us**      | `about.html`               | ✅ CANONICAL reference for hero section |
| **Privacy Policy**| `privacy-policy.html`      | Policy content template         |
| **Terms**         | `terms-conditions.html`    | Policy content template         |
| **Refund**        | `refund-policy.html`       | Policy content template         |
| **FAQ**           | `faq.html`                 | FAQ accordion template          |
| **Features**      | `features.html`            | Feature showcase template       |
| **Contact**       | `contact.html`             | Contact form template           |
| **Home**          | `index.html`               | Landing page (unique layout)    |
