document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('bmiForm');
    const heightUnitSelect = document.getElementById('heightUnit');
    const heightFeetDiv = document.getElementById('heightFeet');
    const heightInput = document.getElementById('height');
    const resultsDiv = document.getElementById('results');
    const ageWarningDiv = document.getElementById('ageWarning');

    // Chart description toggle functionality
    const chartDescriptionToggle = document.getElementById('chartDescriptionToggle');
    const chartDescription = document.getElementById('chartDescription');
    const chevronIcon = document.getElementById('chevronIcon');

    if (chartDescriptionToggle) {
        chartDescriptionToggle.addEventListener('click', function () {
            const isHidden = chartDescription.classList.contains('hidden');

            if (isHidden) {
                chartDescription.classList.remove('hidden');
                chevronIcon.style.transform = 'rotate(180deg)';
            } else {
                chartDescription.classList.add('hidden');
                chevronIcon.style.transform = 'rotate(0deg)';
            }
        });
    }

    // Toggle height input based on unit selection
    heightUnitSelect.addEventListener('change', function () {
        if (this.value === 'ft') {
            heightFeetDiv.classList.remove('hidden');
            heightInput.classList.add('hidden');
        } else {
            heightFeetDiv.classList.add('hidden');
            heightInput.classList.remove('hidden');
        }
    });

    // Calculate age from date of birth
    function calculateAge(dob) {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    }

    // Convert height to centimeters
    function convertHeightToCm(height, unit, feet = 0, inches = 0) {
        if (unit === 'cm') {
            return parseFloat(height);
        } else if (unit === 'ft') {
            const totalInches = (parseFloat(feet) * 12) + parseFloat(inches);
            return totalInches * 2.54;
        }
        return 0;
    }

    // Convert weight to kilograms
    function convertWeightToKg(weight, unit) {
        if (unit === 'kg') {
            return parseFloat(weight);
        } else if (unit === 'lbs') {
            return parseFloat(weight) * 0.453592;
        }
        return 0;
    }

    // Calculate BMI
    function calculateBMI(weightKg, heightCm) {
        const heightM = heightCm / 100;
        return weightKg / (heightM * heightM);
    }

    // Get BMI category and color
    function getBMICategory(bmi, ethnicity) {
        // Adjusted thresholds for Asian populations
        const isAsian = ethnicity === 'asian';

        if (bmi < 18.5) {
            return {
                category: 'Underweight',
                color: 'text-blue-600',
                risk: 'low',
                thresholds: { healthy: isAsian ? 23 : 25, overweight: isAsian ? 27.5 : 30 }
            };
        } else if (bmi < (isAsian ? 23 : 25)) {
            return {
                category: 'Healthy weight',
                color: 'text-green-600',
                risk: 'low',
                thresholds: { healthy: isAsian ? 23 : 25, overweight: isAsian ? 27.5 : 30 }
            };
        } else if (bmi < (isAsian ? 27.5 : 30)) {
            return {
                category: 'Overweight',
                color: 'text-yellow-600',
                risk: 'moderate',
                thresholds: { healthy: isAsian ? 23 : 25, overweight: isAsian ? 27.5 : 30 }
            };
        } else {
            return {
                category: 'Obese',
                color: 'text-red-600',
                risk: 'high',
                thresholds: { healthy: isAsian ? 23 : 25, overweight: isAsian ? 27.5 : 30 }
            };
        }
    }

    // Calculate weight recommendations
    function calculateWeightRecommendations(currentBmi, heightCm, ethnicity, weightUnit) {
        const category = getBMICategory(currentBmi, ethnicity);
        const heightM = heightCm / 100;

        if (category.risk === 'low') {
            return null; // No weight loss needed
        }

        // Calculate target weight for healthy BMI
        const targetBmi = category.thresholds.healthy - 0.1; // Slightly below threshold
        const targetWeightKg = targetBmi * (heightM * heightM);
        const currentWeightKg = currentBmi * (heightM * heightM);
        const weightToLoseKg = currentWeightKg - targetWeightKg;

        // Convert to user's preferred unit
        let weightToLose, unit;
        if (weightUnit === 'lbs') {
            weightToLose = weightToLoseKg * 2.20462;
            unit = 'lbs';
        } else {
            weightToLose = weightToLoseKg;
            unit = 'kg';
        }

        return {
            weightToLose: Math.round(weightToLose * 10) / 10,
            unit: unit,
            targetBmi: Math.round(targetBmi * 10) / 10,
            category: category.category
        };
    }

    // Update BMI chart with horizontal marker
    function updateBMIChart(bmi, ethnicity) {
        const isAsian = ethnicity === 'asian';
        const bmiMarker = document.getElementById('bmiMarker');
        const bmiMarkerValue = document.getElementById('bmiMarkerValue');

        // Update thresholds for Asian populations
        const threshold2 = document.getElementById('threshold2');
        const threshold3 = document.getElementById('threshold3');

        if (isAsian) {
            threshold2.textContent = '23';
            threshold3.textContent = '27.5';
            // Adjust section widths for Asian thresholds
            document.getElementById('healthy-section').style.width = '18.5%'; // 23-18.5 = 4.5, scaled
            document.getElementById('overweight-section').style.width = '18%'; // 27.5-23 = 4.5, scaled
        } else {
            threshold2.textContent = '25';
            threshold3.textContent = '30';
            // Reset to standard widths
            document.getElementById('healthy-section').style.width = '23.5%';
            document.getElementById('overweight-section').style.width = '16.5%';
        }

        // Calculate BMI marker position based on chart segments
        // Chart segments: Underweight (0-18.5), Healthy (18.5-23/25), Overweight (23/25-27.5/30), Obese (27.5/30+)
        let bmiPosition;
        const thresholds = {
            underweight: 18.5,
            healthy: isAsian ? 23 : 25,
            overweight: isAsian ? 27.5 : 30
        };

        if (bmi <= thresholds.underweight) {
            // Underweight section: 0 to 18.5% of chart width
            bmiPosition = (bmi / thresholds.underweight) * 18.5;
        } else if (bmi <= thresholds.healthy) {
            // Healthy section starts at 18.5% and has width based on ethnicity
            const sectionStart = 18.5;
            const sectionWidth = isAsian ? 18.5 : 23.5; // Adjusted widths from HTML
            const bmiInSection = bmi - thresholds.underweight;
            const sectionRange = thresholds.healthy - thresholds.underweight;
            bmiPosition = sectionStart + (bmiInSection / sectionRange) * sectionWidth;
        } else if (bmi <= thresholds.overweight) {
            // Overweight section
            const sectionStart = isAsian ? 37 : 42; // End of healthy section
            const sectionWidth = isAsian ? 18 : 16.5; // Adjusted widths from HTML
            const bmiInSection = bmi - thresholds.healthy;
            const sectionRange = thresholds.overweight - thresholds.healthy;
            bmiPosition = sectionStart + (bmiInSection / sectionRange) * sectionWidth;
        } else {
            // Obese section - remaining width
            const sectionStart = isAsian ? 55 : 58.5; // End of overweight section
            const remainingWidth = 100 - sectionStart;
            const maxDisplayBMI = 40; // Cap for visualization
            const bmiInSection = Math.min(bmi, maxDisplayBMI) - thresholds.overweight;
            const sectionRange = maxDisplayBMI - thresholds.overweight;
            bmiPosition = sectionStart + (bmiInSection / sectionRange) * remainingWidth;
        }

        // Ensure position stays within reasonable bounds
        bmiPosition = Math.max(1, Math.min(bmiPosition, 98));

        // Position the marker
        bmiMarker.style.left = `${bmiPosition}%`;
        bmiMarkerValue.textContent = bmi.toFixed(1);
        bmiMarker.classList.remove('hidden');

        // Add pulsing animation to marker
        bmiMarker.classList.add('animate-pulse');
        setTimeout(() => {
            bmiMarker.classList.remove('animate-pulse');
        }, 2000);
    }

    // Get health information based on ethnicity and BMI
    function getHealthInfo(bmi, ethnicity, age, gender) {
        const category = getBMICategory(bmi, ethnicity);
        let info = '';

        if (ethnicity === 'asian') {
            info += '<p class="mb-2"><strong>Note for Asian populations:</strong> Lower BMI thresholds are used as Asian populations may have higher health risks at lower BMI values.</p>';
        }

        switch (category.risk) {
            case 'low':
                info += '<p>Your BMI is in the healthy range. Maintain your current lifestyle with regular exercise and a balanced diet.</p>';
                break;
            case 'moderate':
                info += '<p>Your BMI indicates you may be overweight. Consider consulting with a healthcare provider about healthy weight management strategies.</p>';
                break;
            case 'high':
                info += '<p>Your BMI indicates obesity, which may increase health risks. We recommend consulting with a healthcare professional for personalized advice.</p>';
                break;
        }

        if (age >= 65) {
            info += '<p class="mt-2 text-sm"><strong>Senior Health Note:</strong> For adults over 65, slightly higher BMI values may be associated with better health outcomes. Consult your healthcare provider for personalized guidance.</p>';
        }

        return info;
    }

    // Form submission handler
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form values
        const ageVerification = document.querySelector('input[name="ageVerification"]:checked').value;
        const dob = document.getElementById('dob').value;
        const gender = document.getElementById('gender').value;
        const ethnicity = document.getElementById('ethnicity').value;
        const heightUnit = document.getElementById('heightUnit').value;
        const weightUnit = document.getElementById('weightUnit').value;

        // Calculate age
        const age = calculateAge(dob);

        // Show age warning if under 18
        if (ageVerification === 'no' || age < 18) {
            ageWarningDiv.classList.remove('hidden');
        } else {
            ageWarningDiv.classList.add('hidden');
        }

        // Get height
        let heightCm;
        if (heightUnit === 'cm') {
            heightCm = convertHeightToCm(document.getElementById('height').value, 'cm');
        } else {
            const feet = document.getElementById('feet').value || 0;
            const inches = document.getElementById('inches').value || 0;
            heightCm = convertHeightToCm(0, 'ft', feet, inches);
        }

        // Get weight
        const weightKg = convertWeightToKg(document.getElementById('weight').value, weightUnit);

        // Calculate BMI
        const bmi = calculateBMI(weightKg, heightCm);
        const category = getBMICategory(bmi, ethnicity);

        // Display results
        document.getElementById('bmiValue').textContent = bmi.toFixed(1);
        document.getElementById('bmiValue').className = `text-4xl font-bold ${category.color}`;
        document.getElementById('bmiCategory').textContent = category.category;
        document.getElementById('healthInfo').innerHTML = getHealthInfo(bmi, ethnicity, age, gender);

        // Update BMI chart
        updateBMIChart(bmi, ethnicity);

        // Show weight recommendations if needed
        const weightRecommendations = calculateWeightRecommendations(bmi, heightCm, ethnicity, weightUnit);
        const weightRecommendationsDiv = document.getElementById('weightRecommendations');
        const weightLossInfo = document.getElementById('weightLossInfo');

        if (weightRecommendations) {
            weightLossInfo.innerHTML = `
                <p class="mb-2"><strong>Your BMI is in the ${weightRecommendations.category.toLowerCase()} category.</strong></p>
                <p class="mb-2">To reach a healthy weight range, you would need to lose approximately <strong>${weightRecommendations.weightToLose} ${weightRecommendations.unit}</strong>.</p>
                <p class="mb-2">This would bring your BMI to approximately <strong>${weightRecommendations.targetBmi}</strong>, which is in the healthy range.</p>
                <p class="text-xs mt-3 text-orange-600">
                    <strong>Important:</strong> This is a general estimate. Please consult with a healthcare professional before starting any weight loss program. They can provide personalized advice based on your individual health needs.
                </p>
            `;
            weightRecommendationsDiv.classList.remove('hidden');
        } else {
            weightRecommendationsDiv.classList.add('hidden');
        }

        // Show results
        resultsDiv.classList.remove('hidden');
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    });
});