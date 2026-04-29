const fs = require('fs');
const text = fs.readFileSync('faq_text.txt', 'utf8');

const lines = text.split('\n').map(l => l.trim()).filter(l => l && !l.includes('Page ('));

let currentHeading = '';
let faqs = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.match(/^Q\d*:/)) {
        let q = line.replace(/^Q\d*:\s*/, '').trim();
        let a = [];
        let j = i - 1;
        while (j >= 0 && !lines[j].match(/^Q\d*:/) && !lines[j].match(/^(General Questions|Investment & Purchasing|Future & Benefits|Account & KYC|Fees & Charges|Selling & Redemption|Security & Ownership|Technical & Support)/)) {
            a.push(lines[j]);
            j--;
        }
        faqs.push({ q, a: a.join(' ') });
    }
}

// Since the PDF parser messed up the order of Q & A (the answer comes BEFORE the question in the text output), my logic above grabs the lines BEFORE the question as the answer.
// Let's reverse the array of FAQs because they might be in reverse order overall.
faqs.reverse();

let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>StartGOLD - FAQ</title>
    <link rel="icon" href="favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="vendor/fonts/fonts.css">
    <link href="vendor/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="vendor/bootstrap-icons/bootstrap-icons.css">
    <link rel="stylesheet" href="css/style.css?v=3">
    <link rel="stylesheet" href="css/media.css">
</head>
<body>
    <div id="header-slot"></div>
    
    <!-- Top Wrapper to match index styling -->
    <div class="top-wrapper about-top-wrapper" style="min-height: auto; padding-bottom: 50px;">
        <div class="marquee-bar">
            <div class="marquee-track">
                <span>Welcome to startGold&nbsp; ✦ &nbsp;Welcome to startGold&nbsp; ✦ &nbsp;Welcome to startGold&nbsp; ✦ &nbsp;Welcome to startGold&nbsp; ✦ &nbsp;Welcome to startGold&nbsp; ✦ &nbsp;Welcome to startGold&nbsp; ✦ &nbsp;Welcome to startGold&nbsp; ✦ &nbsp;Welcome to startGold&nbsp; ✦ &nbsp;Welcome to startGold&nbsp; ✦ &nbsp;Welcome to startGold&nbsp; ✦ &nbsp;Welcome to startGold&nbsp; ✦ &nbsp;Welcome to startGold&nbsp; ✦ &nbsp;</span>
            </div>
        </div>
        <div class="container hero-inner" style="padding-top: 150px; text-align: center;">
            <h1 class="hero-h1">Frequently Asked <span class="clr-gold">Questions</span></h1>
            <p class="hero-p" style="color: rgba(255, 255, 255, 0.7); max-width: 600px; margin: 0 auto;">Everything you need to know about the product and billing.</p>
        </div>
    </div>

    <section class="faq-section" style="padding-top: 50px; padding-bottom: 100px;">
        <div class="container">
            <div class="faq-accordion">
`;

faqs.forEach((faq, idx) => {
    // Basic formatting for bullet points if any
    let ans = faq.a.replace(/•\s*/g, '<br>• ');
    if(ans.startsWith('<br>')) ans = ans.substring(4);
    
    html += `                <div class="faq-item ${idx === 0 ? 'active' : ''}">
                    <button class="faq-question">
                        <span>${faq.q}</span>
                        <span class="faq-icon"></span>
                    </button>
                    <div class="faq-answer">
                        <p>${ans}</p>
                    </div>
                </div>\n`;
});

html += `            </div>
        </div>
    </section>

    <!-- Footer -->
    <div id="footer-slot"></div>

    <script src="vendor/bootstrap/bootstrap.bundle.min.js"></script>
    <script>
        // FAQ Accordion
        document.querySelectorAll('.faq-question').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = btn.closest('.faq-item');
                const isActive = item.classList.contains('active');

                // Close all items
                document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

                // Toggle clicked item
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    </script>
    <script src="js/common.js"></script>
</body>
</html>`;

fs.writeFileSync('faq.html', html);
console.log('Done!');
