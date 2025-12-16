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