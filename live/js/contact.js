/**
 * Contact page — intl-tel-input + cascading dropdowns + full validation.
 * - Phone: numbers only, country-based length validation via intl-tel-input
 * - Email: RFC-compliant regex validation
 * - Names: letters only (no spaces), min 2 chars
 * - Pincode: numbers only, 4-10 digits
 * - Inline error messages on each field
 */
(function () {
    const API_BASE = 'https://countriesnow.space/api/v0.1/countries';
    const DEFAULT_COUNTRY = 'India';

    // ===== DOM Elements =====
    const form = document.getElementById('contactForm');
    const countryEl = document.getElementById('country');
    const stateEl = document.getElementById('state');
    const cityEl = document.getElementById('city');
    const townEl = document.getElementById('town');
    const phoneEl = document.getElementById('phone');
    const emailEl = document.getElementById('email');
    const firstNameEl = document.getElementById('firstName');
    const lastNameEl = document.getElementById('lastName');
    const pincodeEl = document.getElementById('pincode');
    const addressEl = document.getElementById('address');
    const messageEl = document.getElementById('message');
    const captchaEl = document.getElementById('captcha');
    const captchaNum1El = document.getElementById('captchaNum1');
    const captchaNum2El = document.getElementById('captchaNum2');
    const captchaRefreshBtn = document.getElementById('captchaRefresh');

    if (!countryEl || !stateEl || !cityEl || !form) return;

    // ===== MATH CAPTCHA =====
    let captchaExpected = 0;

    function generateCaptcha() {
        const a = Math.floor(Math.random() * 20) + 1;
        const b = Math.floor(Math.random() * 15) + 1;
        captchaExpected = a + b;
        if (captchaNum1El) captchaNum1El.textContent = a;
        if (captchaNum2El) captchaNum2El.textContent = b;
        if (captchaEl) { captchaEl.value = ''; clearError('captcha'); }
    }

    generateCaptcha();
    if (captchaRefreshBtn) captchaRefreshBtn.addEventListener('click', generateCaptcha);

    // ===== INTL TEL INPUT =====
    let iti = null;
    // Country name → ISO2 mapping (built from intl-tel-input data)
    let countryNameToISO2 = {};

    if (phoneEl && window.intlTelInput) {
        iti = window.intlTelInput(phoneEl, {
            initialCountry: 'in',
            preferredCountries: ['in', 'us', 'gb', 'ae', 'sg', 'ca', 'au'],
            separateDialCode: true,
            utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js'
        });

        // Build country name → ISO2 map from intl-tel-input's data
        if (window.intlTelInputGlobals) {
            const allCountries = window.intlTelInputGlobals.getCountryData();
            allCountries.forEach(c => {
                countryNameToISO2[c.name.toLowerCase()] = c.iso2;
                // Also map without parenthetical suffixes: "India" from "India (भारत)"
                const baseName = c.name.replace(/\s*\(.*\)\s*$/, '').trim().toLowerCase();
                if (baseName) countryNameToISO2[baseName] = c.iso2;
            });
        }
    }

    /**
     * Sync phone flag/dial-code when a country is selected in the dropdown.
     * Fuzzy-matches country name from dropdown to intl-tel-input's ISO2 code.
     */
    function syncPhoneToCountry(countryName) {
        if (!iti || !countryName) return;
        const name = countryName.trim().toLowerCase();

        // Direct match
        let iso2 = countryNameToISO2[name];

        // Fuzzy: find first key that starts with or contains the name
        if (!iso2) {
            const keys = Object.keys(countryNameToISO2);
            const found = keys.find(k => k.startsWith(name) || name.startsWith(k));
            if (found) iso2 = countryNameToISO2[found];
        }

        if (iso2) {
            iti.setCountry(iso2);
            // Clear phone input when country changes so old digits don't persist
            if (phoneEl) {
                phoneEl.value = '';
                clearError('phone');
            }
        }
    }

    // ===== VALIDATION HELPERS =====
    const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    const NAME_REGEX = /^[a-zA-Z'.]+$/;

    function showError(fieldId, message) {
        const errorEl = document.getElementById(fieldId + 'Error');
        const fieldEl = document.getElementById(fieldId);
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('visible');
        }
        if (fieldEl) fieldEl.classList.add('input-error');
        // For phone group, target the iti wrapper
        if (fieldId === 'phone') {
            const itiWrap = phoneEl?.closest('.iti');
            if (itiWrap) itiWrap.classList.add('input-error');
        }
    }

    function clearError(fieldId) {
        const errorEl = document.getElementById(fieldId + 'Error');
        const fieldEl = document.getElementById(fieldId);
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.classList.remove('visible');
        }
        if (fieldEl) fieldEl.classList.remove('input-error');
        if (fieldId === 'phone') {
            const itiWrap = phoneEl?.closest('.iti');
            if (itiWrap) itiWrap.classList.remove('input-error');
        }
    }

    function clearAllErrors() {
        document.querySelectorAll('.field-error').forEach(el => {
            el.textContent = '';
            el.classList.remove('visible');
        });
        document.querySelectorAll('.input-error').forEach(el => {
            el.classList.remove('input-error');
        });
    }

    // ===== FIELD VALIDATORS =====
    function validateName(fieldId, label) {
        const el = document.getElementById(fieldId);
        const val = el ? el.value.trim() : '';
        if (!val) { showError(fieldId, `${label} is required`); return false; }
        if (val.length < 2) { showError(fieldId, `${label} must be at least 2 characters`); return false; }
        if (val.length > 20) { showError(fieldId, `${label} must not exceed 20 characters`); return false; }
        if (/\s/.test(val)) { showError(fieldId, `${label} should not contain spaces`); return false; }
        if (!NAME_REGEX.test(val)) { showError(fieldId, `${label} should contain only letters`); return false; }
        clearError(fieldId);
        return true;
    }

    function validatePhone() {
        const val = phoneEl ? phoneEl.value.replace(/\D/g, '') : '';
        if (!val) { showError('phone', 'Phone number is required'); return false; }
        if (iti && window.intlTelInputUtils) {
            if (!iti.isValidNumber()) {
                showError('phone', 'Please enter a valid phone number for the selected country');
                return false;
            }
        } else {
            // Fallback: basic length check when utils hasn't loaded
            if (val.length < 7 || val.length > 15) {
                showError('phone', 'Phone number must be 7-15 digits');
                return false;
            }
        }
        clearError('phone');
        return true;
    }

    function validateEmail() {
        const val = emailEl ? emailEl.value.trim() : '';
        if (!val) { showError('email', 'Email is required'); return false; }
        if (!EMAIL_REGEX.test(val)) { showError('email', 'Enter a valid email address'); return false; }
        clearError('email');
        return true;
    }

    function validateSelect(fieldId, label) {
        const el = document.getElementById(fieldId);
        if (!el || !el.value) { showError(fieldId, `Please select a ${label}`); return false; }
        clearError(fieldId);
        return true;
    }

    function validatePincode() {
        const val = pincodeEl ? pincodeEl.value.trim() : '';
        if (!val) { clearError('pincode'); return true; } // optional
        if (!/^\d+$/.test(val)) { showError('pincode', 'Pincode must contain only numbers'); return false; }
        if (val.length < 4 || val.length > 10) { showError('pincode', 'Pincode must be 4-10 digits'); return false; }
        clearError('pincode');
        return true;
    }

    function validateAddress() {
        const val = addressEl ? addressEl.value.trim() : '';
        if (!val) { showError('address', 'Address is required'); return false; }
        clearError('address');
        return true;
    }

    function validateMessage() {
        const val = messageEl ? messageEl.value.trim() : '';
        if (val.length > 300) { showError('message', 'Message must not exceed 300 characters'); return false; }
        clearError('message');
        return true;
    }

    function validateCaptcha() {
        const val = captchaEl ? captchaEl.value.trim() : '';
        if (!val) { showError('captcha', 'Please answer the CAPTCHA'); return false; }
        if (parseInt(val, 10) !== captchaExpected) { showError('captcha', 'Incorrect answer. Please try again'); return false; }
        clearError('captcha');
        return true;
    }

    // ===== INPUT RESTRICTIONS =====

    /**
     * Get the max number of digits allowed for the current phone country.
     * Uses intl-tel-input's placeholder (example number) to determine length.
     */
    function getPhoneMaxDigits() {
        if (!iti) return 15; // fallback
        const placeholder = iti.getNumber ? '' : '';
        // Get the placeholder/example number for the selected country
        const countryData = iti.getSelectedCountryData();
        if (countryData && countryData.iso2 && window.intlTelInputUtils) {
            const example = window.intlTelInputUtils.getExampleNumber(
                countryData.iso2, false, window.intlTelInputUtils.numberType.MOBILE
            );
            // Extract only digits from the example (without country code)
            const dialCode = countryData.dialCode || '';
            let nationalDigits = example.replace(/\D/g, '');
            // Remove the country code prefix from the example
            if (nationalDigits.startsWith(dialCode)) {
                nationalDigits = nationalDigits.substring(dialCode.length);
            }
            return nationalDigits.length || 15;
        }
        return 15;
    }

    // Phone: allow only digits, enforce country-based max length
    if (phoneEl) {
        phoneEl.addEventListener('keypress', e => {
            const allowed = /[0-9]/;
            if (!allowed.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
                e.preventDefault();
                return;
            }
            // Block if already at max digits
            const currentDigits = phoneEl.value.replace(/\D/g, '');
            const maxDigits = getPhoneMaxDigits();
            if (allowed.test(e.key) && currentDigits.length >= maxDigits) {
                e.preventDefault();
            }
        });
        phoneEl.addEventListener('input', () => {
            // Strip non-digits
            let digits = phoneEl.value.replace(/[^0-9]/g, '');
            // Enforce max length
            const maxDigits = getPhoneMaxDigits();
            if (digits.length > maxDigits) {
                digits = digits.substring(0, maxDigits);
            }
            phoneEl.value = digits;
            clearError('phone');
        });
    }

    // Pincode auto-fill using API
    if (pincodeEl) {
        pincodeEl.addEventListener('keypress', e => {
            if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
                e.preventDefault();
            }
        });
        
        function forceSelectOption(selectEl, value) {
            if (!selectEl) return;
            let found = Array.from(selectEl.options).some(opt => opt.value.toLowerCase() === value.toLowerCase());
            if (!found) {
                const newOpt = document.createElement('option');
                newOpt.value = value;
                newOpt.textContent = value;
                selectEl.appendChild(newOpt);
            }
            selectEl.disabled = false;
            selectEl.value = Array.from(selectEl.options).find(opt => opt.value.toLowerCase() === value.toLowerCase()).value;
            clearError(selectEl.id);
        }

        pincodeEl.addEventListener('input', async () => {
            pincodeEl.value = pincodeEl.value.replace(/[^0-9]/g, '');
            clearError('pincode');
            
            const pc = pincodeEl.value;
            if (pc.length === 6) {
                try {
                    const res = await fetch(`https://api.postalpincode.in/pincode/${pc}`);
                    const data = await res.json();
                    
                    if (data && data[0] && data[0].Status === 'Success') {
                        const postOffices = data[0].PostOffice;
                        const info = postOffices[0];
                        
                        if (info) {
                            if (info.Country && countryEl) forceSelectOption(countryEl, info.Country);
                            if (info.State && stateEl) forceSelectOption(stateEl, info.State);
                            
                            // District acts as City
                            const cityVal = info.District || info.Region || info.Division;
                            if (cityVal && cityEl) forceSelectOption(cityEl, cityVal);
                            
                            // Populate Town Dropdown with all PostOffice Names in this Pincode
                            if (townEl && postOffices.length > 0) {
                                townEl.innerHTML = '<option value="" disabled selected>Select Town</option>';
                                postOffices.forEach(po => {
                                    const opt = document.createElement('option');
                                    opt.value = po.Name;
                                    opt.textContent = po.Name;
                                    townEl.appendChild(opt);
                                });
                                townEl.disabled = false;
                                // Auto-select the first town
                                townEl.value = postOffices[0].Name;
                                clearError('town');
                            }
                        }
                    } else {
                        showError('pincode', 'Invalid Pincode or no records found');
                    }
                } catch (err) {
                    console.error('Pincode fetch failed:', err);
                }
            }
        });
    }

    // Names: strip spaces, enforce maxlength, clear error on input
    [firstNameEl, lastNameEl].forEach(el => {
        if (el) el.addEventListener('input', () => {
            el.value = el.value.replace(/\s/g, '').slice(0, 20);
            clearError(el.id);
        });
    });

    // Message: strip leading spaces on input
    if (messageEl) {
        messageEl.addEventListener('input', () => {
            if (messageEl.value.startsWith(' ')) {
                messageEl.value = messageEl.value.trimStart();
            }
            clearError('message');
        });
    }

    // Email: clear error on input
    if (emailEl) emailEl.addEventListener('input', () => clearError('email'));

    // Captcha: numbers only, max 2 digits
    if (captchaEl) {
        captchaEl.addEventListener('keypress', e => {
            if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
                e.preventDefault();
            }
        });
        captchaEl.addEventListener('input', () => {
            captchaEl.value = captchaEl.value.replace(/[^0-9]/g, '').slice(0, 2);
            clearError('captcha');
        });
    }

    // Selects: clear error on change
    [countryEl, stateEl, cityEl, townEl].forEach(el => {
        if (el) el.addEventListener('change', () => clearError(el.id));
    });

    // ===== BLUR VALIDATION (real-time) =====
    if (firstNameEl) firstNameEl.addEventListener('blur', () => validateName('firstName', 'First name'));
    if (lastNameEl) lastNameEl.addEventListener('blur', () => validateName('lastName', 'Last name'));
    if (phoneEl) phoneEl.addEventListener('blur', () => validatePhone());
    if (emailEl) emailEl.addEventListener('blur', () => validateEmail());
    if (pincodeEl) pincodeEl.addEventListener('blur', () => validatePincode());
    if (addressEl) addressEl.addEventListener('blur', () => validateAddress());
    if (captchaEl) captchaEl.addEventListener('blur', () => validateCaptcha());

    // ===== CASCADING DROPDOWNS =====
    function resetSelectEl(el, placeholder) {
        el.innerHTML = `<option value="" disabled selected>${placeholder}</option>`;
        el.disabled = true;
    }

    function populateSelectEl(el, items, placeholder) {
        el.innerHTML = `<option value="" disabled selected>${placeholder}</option>`;
        items.sort().forEach(item => {
            const opt = document.createElement('option');
            opt.value = item;
            opt.textContent = item;
            el.appendChild(opt);
        });
        el.disabled = false;
    }

    async function loadCountries() {
        try {
            const res = await fetch(`${API_BASE}/positions`);
            const json = await res.json();
            if (!json.error && json.data) {
                const names = json.data.map(c => c.name).sort();
                populateSelectEl(countryEl, names, 'Select a Country');
                countryEl.value = DEFAULT_COUNTRY;
                loadStates(DEFAULT_COUNTRY);
            }
        } catch (err) {
            console.error('Countries API failed:', err);
            if (typeof LOCATION_DATA !== 'undefined') {
                populateSelectEl(countryEl, Object.keys(LOCATION_DATA), 'Select a Country');
                countryEl.value = DEFAULT_COUNTRY;
                loadStatesFallback(DEFAULT_COUNTRY);
            }
        }
    }

    async function loadStates(country) {
        resetSelectEl(stateEl, 'Loading...');
        resetSelectEl(cityEl, 'Select City');
        try {
            const res = await fetch(`${API_BASE}/states`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ country })
            });
            const json = await res.json();
            if (!json.error && json.data && json.data.states) {
                populateSelectEl(stateEl, json.data.states.map(s => s.name), 'Select State');
            } else {
                resetSelectEl(stateEl, 'No states found');
            }
        } catch (err) {
            loadStatesFallback(country);
        }
    }

    async function loadCities(country, state) {
        resetSelectEl(cityEl, 'Loading...');
        try {
            const res = await fetch(`${API_BASE}/state/cities`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ country, state })
            });
            const json = await res.json();
            if (!json.error && json.data) {
                const cities = json.data.filter(c => c && c.trim());
                cities.length ? populateSelectEl(cityEl, cities, 'Select City') : resetSelectEl(cityEl, 'No cities found');
            } else {
                resetSelectEl(cityEl, 'No cities found');
            }
        } catch (err) {
            loadCitiesFallback(country, state);
        }
    }

    function loadStatesFallback(country) {
        if (typeof LOCATION_DATA === 'undefined' || !LOCATION_DATA[country]) return resetSelectEl(stateEl, 'Select State');
        populateSelectEl(stateEl, Object.keys(LOCATION_DATA[country]), 'Select State');
    }

    function loadCitiesFallback(country, state) {
        if (typeof LOCATION_DATA === 'undefined' || !LOCATION_DATA[country]?.[state]) return resetSelectEl(cityEl, 'Select City');
        populateSelectEl(cityEl, LOCATION_DATA[country][state], 'Select City');
    }

    countryEl.addEventListener('change', () => {
        const selectedCountry = countryEl.value;
        loadStates(selectedCountry);
    });
    stateEl.addEventListener('change', () => loadCities(countryEl.value, stateEl.value));
    // ===== SUCCESS MESSAGE =====
    function showSuccessMessage() {
        alert('Thanks for contacting us. We will get back to you shortly.');
        window.location.href = 'index.html';

        // Reset form
        form.reset();
        if (iti) iti.setCountry('in');
        resetSelectEl(stateEl, 'Select State');
        resetSelectEl(cityEl, 'Select City');
        resetSelectEl(townEl, 'Select Town');
        countryEl.value = DEFAULT_COUNTRY;
        loadStates(DEFAULT_COUNTRY);
        clearAllErrors();
        generateCaptcha();
        const btn = document.getElementById('contactSubmitBtn');
        btn.textContent = 'Submit';
        btn.disabled = false;
    }

    // ===== FORM SUBMIT =====
    form.addEventListener('submit', async e => {
        e.preventDefault();
        clearAllErrors();

        // Run all validations
        const results = [
            validateName('firstName', 'First name'),
            validateName('lastName', 'Last name'),
            validatePhone(),
            validateEmail(),
            validateSelect('country', 'country'),
            validateSelect('state', 'state'),
            validateSelect('city', 'city'),
            validateSelect('town', 'town'),
            validatePincode(),
            validateAddress(),
            validateMessage(),
            validateCaptcha()
        ];

        const isValid = results.every(Boolean);
        if (!isValid) {
            // Scroll to first error
            const firstErr = form.querySelector('.input-error');
            if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        const btn = document.getElementById('contactSubmitBtn');
        btn.textContent = 'Sending...';
        btn.disabled = true;

        // Collect form data
        const countryData = iti ? iti.getSelectedCountryData() : {};
        const payload = {
            firstName: firstNameEl.value.trim(),
            lastName: lastNameEl.value.trim(),
            phone: phoneEl ? phoneEl.value.trim() : '',
            phoneCode: countryData.dialCode || '',
            email: emailEl ? emailEl.value.trim() : '',
            country: countryEl.value,
            state: stateEl.value,
            city: cityEl.value,
            town: townEl ? townEl.value : '',
            pincode: pincodeEl ? pincodeEl.value.trim() : '',
            address: addressEl ? addressEl.value.trim() : '',
            message: messageEl ? messageEl.value.trim() : '',
            captchaAnswer: String(captchaExpected),
            captchaExpected: String(captchaExpected)
        };

        try {
            const res = await fetch('sendmail.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            // Handle response — PHP may output warnings before JSON
            const text = await res.text();
            let result;
            try {
                // Try to extract JSON from the response (skip any PHP warnings)
                const jsonMatch = text.match(/\{[\s\S]*\}$/);
                result = jsonMatch ? JSON.parse(jsonMatch[0]) : { success: false, message: text };
            } catch (parseErr) {
                console.error('Response parse error:', text);
                result = { success: false, message: 'Server returned an invalid response.' };
            }

            if (result.success) {
                showSuccessMessage();
            } else {
                if (result.debug) console.error('SMTP Debug:', result.debug);
                alert(result.message || 'Failed to send. Please try again.');
                btn.textContent = 'Submit';
                btn.disabled = false;
                generateCaptcha();
            }
        } catch (err) {
            console.error('Submit error:', err);
            alert('Network error. Please check your connection and try again.');
            btn.textContent = 'Submit';
            btn.disabled = false;
            generateCaptcha();
        }
    });

    // ===== INIT =====
    loadCountries();
})();
