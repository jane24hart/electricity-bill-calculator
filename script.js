// Tamil Nadu Electricity Bill Calculator
// Using TANGEDCO tariff rates (Residential LT Tariff I-A)

// DOM Elements
const unitsInput = document.getElementById('units');
const unitSlider = document.getElementById('unit-slider');
const sliderValue = document.getElementById('slider-value');
const calculateBtn = document.getElementById('calculate-btn');
const resultContainer = document.getElementById('result-container');
const billAmount = document.getElementById('bill-amount');
const resultUnits = document.getElementById('result-units');
const breakdown1 = document.getElementById('breakdown-1');
const breakdown2 = document.getElementById('breakdown-2');
const breakdown3 = document.getElementById('breakdown-3');
const breakdown4 = document.getElementById('breakdown-4');
const breakdownSubtotal = document.getElementById('breakdown-subtotal');
const fixedCharges = document.getElementById('fixed-charges');
const taxAmount = document.getElementById('tax-amount');
const breakdownTotal = document.getElementById('breakdown-total');
const infoLink = document.getElementById('info-link');

// Tamil Nadu Electricity Tariff Rates (as per TANGEDCO)
const TN_TARIFF = {
  slab1: { limit: 100, rate: 3.50 },    // 0-100 units
  slab2: { limit: 200, rate: 4.60 },    // 101-200 units
  slab3: { limit: 500, rate: 6.90 },    // 201-500 units
  slab4: { rate: 7.10 },                // Above 500 units
  fixedCharge: 25.00,                   // Monthly fixed charges
  taxRate: 0.08                         // 8% tax and surcharge
};

// Initialize the calculator
function initCalculator() {
  // Set initial values
  updateSliderValue();
  
  // Calculate initial bill
  calculateTNBill();
  
  // Add event listeners
  unitsInput.addEventListener('input', handleUnitsInput);
  unitSlider.addEventListener('input', handleSliderInput);
  calculateBtn.addEventListener('click', calculateTNBill);
  infoLink.addEventListener('click', showTNBInfo);
  
  // Add keyboard support
  unitsInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
      calculateTNBill();
    }
  });
}

// Handle units input change
function handleUnitsInput() {
  let value = parseInt(this.value) || 0;
  
  // Validate and limit to reasonable value
  if (value > 1000) {
    value = 1000;
    this.value = 1000;
  }
  
  // Update slider
  unitSlider.value = Math.min(value, 500);
  updateSliderValue();
  
  // Auto-calculate if value is valid
  if (value > 0) {
    calculateTNBill();
  }
}

// Handle slider input change
function handleSliderInput() {
  unitsInput.value = this.value;
  updateSliderValue();
  calculateTNBill();
}

// Update slider value display
function updateSliderValue() {
  sliderValue.textContent = `${unitSlider.value} kWh`;
}

// Calculate Tamil Nadu electricity bill
function calculateTNBill() {
  let units = parseInt(unitsInput.value);
  
  // Validate input
  if (!units || units < 0) {
    showError("Please enter a valid number of units (0 or more)");
    unitsInput.focus();
    return;
  }
  
  // Calculate bill based on Tamil Nadu tariff
  let billBreakdown = calculateTNTariff(units);
  
  // Update result display
  updateResultDisplay(units, billBreakdown);
  
  // Show result container with animation
  resultContainer.classList.add('show');
}

// Calculate Tamil Nadu tariff
function calculateTNTariff(units) {
  let breakdown = {
    slab1: 0,  // 0-100 units
    slab2: 0,  // 101-200 units
    slab3: 0,  // 201-500 units
    slab4: 0   // Above 500 units
  };
  
  // Calculate for each slab
  if (units <= TN_TARIFF.slab1.limit) {
    // Only slab 1
    breakdown.slab1 = units * TN_TARIFF.slab1.rate;
  } else if (units <= TN_TARIFF.slab2.limit) {
    // Slab 1 + slab 2
    breakdown.slab1 = TN_TARIFF.slab1.limit * TN_TARIFF.slab1.rate;
    breakdown.slab2 = (units - TN_TARIFF.slab1.limit) * TN_TARIFF.slab2.rate;
  } else if (units <= TN_TARIFF.slab3.limit) {
    // Slab 1 + slab 2 + slab 3
    breakdown.slab1 = TN_TARIFF.slab1.limit * TN_TARIFF.slab1.rate;
    breakdown.slab2 = (TN_TARIFF.slab2.limit - TN_TARIFF.slab1.limit) * TN_TARIFF.slab2.rate;
    breakdown.slab3 = (units - TN_TARIFF.slab2.limit) * TN_TARIFF.slab3.rate;
  } else {
    // All slabs including slab 4
    breakdown.slab1 = TN_TARIFF.slab1.limit * TN_TARIFF.slab1.rate;
    breakdown.slab2 = (TN_TARIFF.slab2.limit - TN_TARIFF.slab1.limit) * TN_TARIFF.slab2.rate;
    breakdown.slab3 = (TN_TARIFF.slab3.limit - TN_TARIFF.slab2.limit) * TN_TARIFF.slab3.rate;
    breakdown.slab4 = (units - TN_TARIFF.slab3.limit) * TN_TARIFF.slab4.rate;
  }
  
  // Calculate subtotal
  let subtotal = breakdown.slab1 + breakdown.slab2 + breakdown.slab3 + breakdown.slab4;
  
  // Add fixed charges
  let fixedCharge = TN_TARIFF.fixedCharge;
  
  // Calculate tax (8% of subtotal)
  let tax = subtotal * TN_TARIFF.taxRate;
  
  // Calculate total
  let total = subtotal + fixedCharge + tax;
  
  return {
    breakdown,
    subtotal: parseFloat(subtotal.toFixed(2)),
    fixedCharge: parseFloat(fixedCharge.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    total: parseFloat(total.toFixed(2))
  };
}

// Update result display
function updateResultDisplay(units, billData) {
  // Update units display
  resultUnits.textContent = units;
  
  // Update bill amount
  billAmount.textContent = `₹${billData.total.toFixed(2)}`;
  
  // Update breakdown values
  breakdown1.textContent = `₹${billData.breakdown.slab1.toFixed(2)}`;
  breakdown2.textContent = `₹${billData.breakdown.slab2.toFixed(2)}`;
  breakdown3.textContent = `₹${billData.breakdown.slab3.toFixed(2)}`;
  breakdown4.textContent = `₹${billData.breakdown.slab4.toFixed(2)}`;
  
  // Update subtotal and additional charges
  breakdownSubtotal.textContent = `₹${billData.subtotal.toFixed(2)}`;
  fixedCharges.textContent = `₹${billData.fixedCharge.toFixed(2)}`;
  taxAmount.textContent = `₹${billData.tax.toFixed(2)}`;
  
  // Update total
  breakdownTotal.textContent = `₹${billData.total.toFixed(2)}`;
  
  // Add color coding for high consumption
  if (units > 300) {
    billAmount.style.color = '#ff6b6b';
  } else if (units > 200) {
    billAmount.style.color = '#ffa726';
  } else {
    billAmount.style.color = '#ffd700';
  }
}

// Show error message
function showError(message) {
  alert(message);
}

// Show Tamil Nadu electricity info
function showTNBInfo(event) {
  event.preventDefault();
  alert("Tamil Nadu Electricity Board (TNEB/TANGEDCO)\n\nOfficial Website: https://www.tneb.gov.in\n\nFor latest tariff rates and official information, please visit the official TNEB website.");
}

// Format currency
function formatCurrency(amount) {
  return '₹' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// Initialize calculator when page loads
document.addEventListener('DOMContentLoaded', initCalculator);