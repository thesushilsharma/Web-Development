const OUNCE_PER_LITER = 33.814;
const OUNCE_PER_GRAM = 28.3;
function glassesPerDay(age, weight) {
  let ratioPerAge = 0;
  if (age < 30) {
    ratioPerAge = 40;
  } else if (age >= 30 && age < 55) {
    ratioPerAge = 35;
  } else {
    ratioPerAge = 30;
  }
  const ounces = (weight * ratioPerAge) / OUNCE_PER_GRAM;
  const cups = ounces / 8; //US cup (236.6mL)
  const liters = ounces / OUNCE_PER_LITER;

  return {
    ounces: ounces.toFixed(2),
    liters: liters.toFixed(3),
    cups: parseInt(cups),
  };
}

function calculateWaterIntake() {
  const weightInput = document.getElementById('weightInput');
  const ageInput = document.getElementById('ageInput');
  const weight = parseFloat(weightInput.value);
  const age = parseFloat(ageInput.value);

  const error = document.querySelector('.error');

  if (isNaN(weight) || isNaN(age)) {
    error.textContent = 'Please enter valid weight and age.';
    return;
  }
  const result = glassesPerDay(age, weight);
  const resultElement = document.getElementById('result');
  error.style.display = 'none';
  resultElement.innerHTML = `
    <p class="text-lg font-bold">Water Intake:</p>
    <p>${result.ounces} ozs</p>
    <p>${result.liters} L</p>
    <p>${result.cups} cups</p>
  `;
}