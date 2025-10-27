// Constants for water calculations
const OUNCE_PER_LITER = 33.814;
const ML_PER_OUNCE = 29.5735;
const ML_PER_CUP = 240; // Standard cup size
const ML_PER_GLASS = 250; // Standard glass size

// Water intake calculation based on age and weight
function calculateWaterNeeds(age, weight) {
  let baseRatio = 35; // ml per kg body weight

  // Adjust ratio based on age groups
  if (age < 18) {
    baseRatio = 40; // Growing bodies need more water
  } else if (age >= 18 && age < 30) {
    baseRatio = 35;
  } else if (age >= 30 && age < 55) {
    baseRatio = 33;
  } else if (age >= 55 && age < 70) {
    baseRatio = 30;
  } else {
    baseRatio = 28; // Elderly may need slightly less but should consult doctor
  }

  const totalMl = weight * baseRatio;
  const liters = totalMl / 1000;
  const ounces = totalMl / ML_PER_OUNCE;
  const cups = totalMl / ML_PER_CUP;
  const glasses = totalMl / ML_PER_GLASS;

  return {
    milliliters: Math.round(totalMl),
    liters: parseFloat(liters.toFixed(2)),
    ounces: parseFloat(ounces.toFixed(1)),
    cups: Math.round(cups),
    glasses: Math.round(glasses)
  };
}

// Validation functions
function validateInput(weight, age) {
  const errors = [];

  if (isNaN(weight) || weight <= 0) {
    errors.push('Please enter a valid weight greater than 0');
  }
  if (weight > 300) {
    errors.push('Weight seems unusually high. Please verify.');
  }

  if (isNaN(age) || age <= 0) {
    errors.push('Please enter a valid age greater than 0');
  }
  if (age > 120) {
    errors.push('Age seems unusually high. Please verify.');
  }

  return errors;
}

// Display error messages
function showError(message) {
  const errorDiv = document.querySelector('.error');
  const errorText = document.querySelector('.error-text');
  errorText.textContent = message;
  errorDiv.classList.remove('hidden');

  // Auto-hide error after 5 seconds
  setTimeout(() => {
    errorDiv.classList.add('hidden');
  }, 5000);
}

// Hide error messages
function hideError() {
  const errorDiv = document.querySelector('.error');
  errorDiv.classList.add('hidden');
}

// Progress tracking variables
let dailyTarget = 0;
let currentProgress = 0;

// Update progress display
function updateProgress() {
  const progressText = document.getElementById('progressText');
  const progressBar = document.getElementById('progressBar');

  if (dailyTarget > 0) {
    const percentage = Math.min((currentProgress / dailyTarget) * 100, 100);
    progressText.textContent = `${currentProgress} / ${dailyTarget} glasses`;
    progressBar.style.width = `${percentage}%`;

    // Change color based on progress
    if (percentage >= 100) {
      progressBar.className = 'bg-green-500 h-3 rounded-full transition-all duration-300';
    } else if (percentage >= 75) {
      progressBar.className = 'bg-blue-500 h-3 rounded-full transition-all duration-300';
    } else if (percentage >= 50) {
      progressBar.className = 'bg-yellow-500 h-3 rounded-full transition-all duration-300';
    } else {
      progressBar.className = 'bg-red-500 h-3 rounded-full transition-all duration-300';
    }
  }
}

// Main calculation function
function calculateWaterIntake() {
  const weightInput = document.getElementById('weightInput');
  const ageInput = document.getElementById('ageInput');
  const weight = parseFloat(weightInput.value);
  const age = parseFloat(ageInput.value);

  // Validate inputs
  const errors = validateInput(weight, age);
  if (errors.length > 0) {
    showError(errors.join('. '));
    return;
  }

  hideError();

  // Calculate water needs
  const result = calculateWaterNeeds(age, weight);
  dailyTarget = result.glasses;

  // Display results
  displayResults(result, age, weight);

  // Show output section
  document.getElementById('output').classList.remove('hidden');

  // Reset progress for new calculation
  currentProgress = 0;
  updateProgress();
}

// Display calculation results
function displayResults(result, age, weight) {
  const resultElement = document.getElementById('result');

  // Get age group description
  let ageGroup = '';
  if (age < 18) ageGroup = 'Youth (Higher hydration needs)';
  else if (age < 30) ageGroup = 'Young Adult';
  else if (age < 55) ageGroup = 'Adult';
  else if (age < 70) ageGroup = 'Mature Adult';
  else ageGroup = 'Senior (Consult healthcare provider)';

  resultElement.innerHTML = `
    <div class="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-2xl">🥤</span>
        <h4 class="font-semibold text-gray-700">Daily Target</h4>
      </div>
      <p class="text-2xl font-bold text-water-dark">${result.glasses} glasses</p>
      <p class="text-sm text-gray-600">(${result.milliliters} ml)</p>
    </div>
    
    <div class="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-2xl">📏</span>
        <h4 class="font-semibold text-gray-700">Other Measurements</h4>
      </div>
      <div class="space-y-1 text-sm">
        <p><strong>${result.liters}L</strong> (liters)</p>
        <p><strong>${result.ounces} fl oz</strong> (fluid ounces)</p>
        <p><strong>${result.cups} cups</strong> (240ml cups)</p>
      </div>
    </div>
    
    <div class="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-2xl">👤</span>
        <h4 class="font-semibold text-gray-700">Your Profile</h4>
      </div>
      <div class="space-y-1 text-sm">
        <p><strong>Weight:</strong> ${weight} kg</p>
        <p><strong>Age:</strong> ${age} years</p>
        <p><strong>Category:</strong> ${ageGroup}</p>
      </div>
    </div>
  `;
}

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('waterForm');
  const resetBtn = document.getElementById('resetBtn');
  const addGlassBtn = document.getElementById('addGlass');
  const resetProgressBtn = document.getElementById('resetProgress');

  // Form submission
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    calculateWaterIntake();
  });

  // Reset form
  resetBtn.addEventListener('click', function () {
    form.reset();
    document.getElementById('output').classList.add('hidden');
    hideError();
    currentProgress = 0;
    dailyTarget = 0;
  });

  // Add glass to progress
  addGlassBtn.addEventListener('click', function () {
    if (dailyTarget > 0 && currentProgress < dailyTarget) {
      currentProgress++;
      updateProgress();

      // Celebration when target reached
      if (currentProgress === dailyTarget) {
        setTimeout(() => {
          alert('🎉 Congratulations! You\'ve reached your daily water intake goal!');
        }, 300);
      }
    }
  });

  // Reset daily progress
  resetProgressBtn.addEventListener('click', function () {
    currentProgress = 0;
    updateProgress();
  });

  // Input validation on blur
  document.getElementById('weightInput').addEventListener('blur', function () {
    const weight = parseFloat(this.value);
    if (weight && (weight < 1 || weight > 300)) {
      showError('Please enter a realistic weight between 1-300 kg');
    }
  });

  document.getElementById('ageInput').addEventListener('blur', function () {
    const age = parseFloat(this.value);
    if (age && (age < 1 || age > 120)) {
      showError('Please enter a realistic age between 1-120 years');
    }
  });
});