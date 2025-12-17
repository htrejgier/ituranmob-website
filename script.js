// --- FUNCTIONS DEFINED GLOBALLY TO FIX CLICK BUGS ---

// ROI Logic
function toggleAssumptions() {
    const hiddenSection = document.getElementById('roi-assumptions');
    if (hiddenSection) {
        hiddenSection.classList.toggle('active');
    } else {
        console.error('Assumptions div not found!');
    }
}

function updateROI() {
    const fleetInput = document.getElementById('fleet-size');
    const vehicleValueInput = document.getElementById('vehicle-value');
    const rentalInput = document.getElementById('rental-rate');
    const staffRateInput = document.getElementById('staff-rate');
    const theftRateInput = document.getElementById('theft-rate');
    const staffHoursInput = document.getElementById('staff-hours');
    const utilizationInput = document.getElementById('utilization-rate');

    // Default values if empty
    const fleet = parseInt(fleetInput.value) || 50;
    const vehicleValue = parseInt(vehicleValueInput.value) || 25000;
    const dailyRate = parseInt(rentalInput.value) || 45;
    const staffRate = parseInt(staffRateInput.value) || 15;
    
    // Assumptions (Dynamic)
    const theftRate = parseFloat(theftRateInput.value) || 1; 
    const staffHoursSaved = parseFloat(staffHoursInput.value) || 2; 
    const utilizationIncrease = (parseFloat(utilizationInput.value) || 10) / 100;

    // Calculations
    const expectedThefts = fleet * (theftRate / 100);
    const preventedThefts = expectedThefts * 0.80; 
    const theftSavings = preventedThefts * vehicleValue;
    
    const staffSavings = staffHoursSaved * 365 * staffRate;
    const utilizationBenefit = fleet * dailyRate * 365 * utilizationIncrease;
    const totalBenefit = theftSavings + staffSavings + utilizationBenefit;
    
    // Update DOM
    document.getElementById('theft-savings').textContent = formatMoney(theftSavings);
    document.getElementById('staff-savings').textContent = formatMoney(staffSavings);
    document.getElementById('utilization-benefit').textContent = formatMoney(utilizationBenefit);
    document.getElementById('total-benefit').textContent = formatMoney(totalBenefit);
}

function formatMoney(amount) {
    return '$' + Math.round(amount).toLocaleString();
}

// Modal Logic
function openModal(context) {
    const modal = document.getElementById('leadModal');
    if(modal) {
        modal.classList.add('active');
        const title = document.getElementById('modalTitle');
        if(title) title.innerText = context || "Request Demo";
    }
}

function closeModal() {
    const modal = document.getElementById('leadModal');
    if(modal) modal.classList.remove('active');
}

// FAQ Logic
function toggleFAQ(element) {
    const wasActive = element.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    if (!wasActive) element.classList.add('active');
}

function toggleMoreFAQs() {
    const moreFaqs = document.getElementById('faq-more');
    const btn = document.getElementById('faq-toggle-btn');
    if (moreFaqs.style.display === 'none') {
        moreFaqs.style.display = 'block';
        btn.textContent = 'Show Fewer Questions';
    } else {
        moreFaqs.style.display = 'none';
        btn.textContent = 'Show More Questions';
    }
}

function scrollToSection(id) {
    const element = document.getElementById(id);
    if(element) element.scrollIntoView({ behavior: 'smooth' });
}

// --- EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
            if(navMenu.style.display === 'flex') {
                navMenu.style.flexDirection = 'column';
                navMenu.style.position = 'absolute';
                navMenu.style.top = '70px';
                navMenu.style.left = '0';
                navMenu.style.width = '100%';
                navMenu.style.backgroundColor = '#0c1c33';
                navMenu.style.padding = '2rem';
            }
        });
    }

    // Modal Close Click
    window.onclick = function(event) {
        const modal = document.getElementById('leadModal');
        if (event.target === modal) closeModal();
    }

    // Initialize ROI Listeners
    const allInputs = [
        document.getElementById('fleet-size'),
        document.getElementById('vehicle-value'),
        document.getElementById('rental-rate'),
        document.getElementById('staff-rate'),
        document.getElementById('theft-rate'),
        document.getElementById('staff-hours'),
        document.getElementById('utilization-rate')
    ];

    allInputs.forEach(input => {
        if(input) input.addEventListener('input', updateROI);
    });

    // Initial Run
    if(document.getElementById('fleet-size')) {
        updateROI();
    }
});

/* ========== FINAL ROI CALCULATOR LOGIC ========== */

const segmentData = {
    rental: {
        staffLabel: "Counter Time Saved (Mins/Rental)",
        staffHint: "Time saved on physical handover, paperwork & key exchange.",
        staffDefault: 20, 
        bonusLabel: "Utilization Increase (%)",
        bonusHint: "Additional rental days gained via 24/7 self-service access.",
        bonusDefault: 6, // Lowered from 10 to balance total ROI
        resStaff: "⚡ Counter Automation",
        resBonus: "📈 Utilization Boost"
    },
    gig: {
        staffLabel: "Admin Hours Saved (Hrs/Car/Mo)",
        staffHint: "Time saved on recurring billing, contract renewals & onboarding.",
        staffDefault: 1.5,
        bonusLabel: "Payment Default Rate (%)",
        bonusHint: "Percentage of drivers who miss payments or default.",
        bonusDefault: 7, // Increased from 5 to balance total ROI
        resStaff: "⚡ Admin Automation",
        resBonus: "💰 Bad Debt Recovered"
    },
    corporate: {
        staffLabel: "Mgmt Time Saved (Mins/Car/Mo)",
        staffHint: "Time saved per vehicle on key logs, scheduling & dispatch.",
        staffDefault: 30,
        bonusLabel: "Fleet Reduction Potential (%)",
        bonusHint: "Percentage of vehicles you can sell due to better sharing.",
        bonusDefault: 5,
        resStaff: "⚡ Mgmt Efficiency",
        resBonus: "📉 CapEx Savings"
    }
};

// HELPER: Gets value, allows 0, but uses default if Empty/NaN
function getValue(id, defaultValue) {
    const el = document.getElementById(id);
    if (!el) return defaultValue;
    
    // If the field is empty, return default (to prevent crash)
    if (el.value === "") return defaultValue;
    
    // If it's a number (including 0), return it
    const val = parseFloat(el.value);
    return isNaN(val) ? defaultValue : val;
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
}

function setValue(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
}

function toggleSegmentFields() {
    const typeEl = document.getElementById('business-type');
    const type = typeEl ? typeEl.value : 'gig'; 
    const data = segmentData[type];

    if(!data) return;

    // 1. Update Text Labels
    setText('staff-label', data.staffLabel);
    setText('staff-hint', data.staffHint);
    setText('bonus-label', data.bonusLabel);
    setText('bonus-hint', data.bonusHint);
    
    // 2. Update Result Labels
    setText('res-label-staff', data.resStaff);
    setText('res-label-bonus', data.resBonus);

    // 3. Update Default Values (Only if not manually changed by user recently? 
    // For simplicity, we reset to optimized defaults when switching segments)
    setValue('staff-metric', data.staffDefault);
    setValue('bonus-metric', data.bonusDefault);

    // 4. HIDE/SHOW Monthly Revenue for Corporate
    // Corporate fleets don't earn revenue, so we hide this input to avoid confusion.
    const revInput = document.getElementById('monthly-revenue');
    if(revInput) {
        // We need to hide the whole container (.input-group), not just the input box
        const container = revInput.closest('.input-group');
        if(container) {
             // If Corporate, Hide. Else, Show.
             container.style.display = (type === 'corporate') ? 'none' : 'block';
        }
    }

    calculateROI();
}

function calculateROI() {
    const typeEl = document.getElementById('business-type');
    const type = typeEl ? typeEl.value : 'gig'; 

    // 1. Get Inputs (Allowing 0)
    const fleet = getValue('fleet-size', 50);
    const vehicleValue = getValue('vehicle-value', 25000);
    const staffRate = getValue('staff-rate', 20); 
    const monthlyRev = getValue('monthly-revenue', 1200); 
    const theftRate = getValue('theft-rate', 1); 
    
    const staffMetric = getValue('staff-metric', 0);
    const bonusMetric = getValue('bonus-metric', 0);

    let assetSavings = 0;
    let staffSavings = 0;
    let bonusSavings = 0;

    // --- MATH LOGIC ---

    // A. Asset Protection (Standard)
    const theftRisk = fleet * (theftRate / 100);
    const recoveryDelta = 0.40; 
    assetSavings = theftRisk * vehicleValue * recoveryDelta;

    // B. Segment Specific
    if (type === 'rental') {
        // Staff: Mins/Rental -> Annualized (Assumes 4 rentals/mo)
        const rentalsPerMonth = fleet * 4; 
        const hoursSaved = (rentalsPerMonth * staffMetric) / 60;
        staffSavings = hoursSaved * staffRate * 12;
        
        // Bonus: Utilization Increase
        bonusSavings = fleet * monthlyRev * (bonusMetric / 100) * 12;
    } 
    else if (type === 'gig') {
        // Staff: Admin Hours/Car -> Annualized
        staffSavings = fleet * staffMetric * staffRate * 12;
        
        // Bonus: Bad Debt Recovery (High Uplift)
        const collectionUplift = 0.85; 
        const potentialBadDebt = fleet * (bonusMetric / 100) * monthlyRev;
        bonusSavings = potentialBadDebt * collectionUplift * 12;
    } 
    else if (type === 'corporate') {
        // Staff: Mins/Car -> Annualized
        const totalHoursSaved = (staffMetric * fleet) / 60;
        staffSavings = totalHoursSaved * staffRate * 12;
        
        // Bonus: Fleet Reduction (Total Asset Value Released)
        const carsSold = fleet * (bonusMetric / 100);
        bonusSavings = carsSold * vehicleValue;
    }

    const total = assetSavings + staffSavings + bonusSavings;

    // C. Render Results
    setText('res-asset', formatMoney(assetSavings));
    setText('res-staff', formatMoney(staffSavings));
    setText('res-bonus', formatMoney(bonusSavings));
    setText('res-total', formatMoney(total));
}

function formatMoney(x) {
    return '$' + Math.round(x).toLocaleString();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    toggleSegmentFields(); // Run once on load
    
    const container = document.querySelector('.roi-wrapper');
    if (container) {
        container.addEventListener('input', calculateROI);
    }
});