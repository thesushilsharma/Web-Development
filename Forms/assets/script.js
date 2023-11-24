async function fetchData(url) {
    const response = await fetch(url);
    return response.json();
}

function createDropdownOption(value, text, attributes) {
    const option = document.createElement('option');
    option.value = value;
    option.text = text;

    for (const [key, val] of Object.entries(attributes)) {
        option.setAttribute(`data-${key}`, val);
    }

    return option;
}

async function init() {
    try {
        const data = await fetchData('assets/countries.json'); // temporary

        const dropdown = document.getElementById('countryDropdown');
        const flagIconSpan = document.getElementById('flagIcon');
        const phoneNumberInput = document.getElementById('phoneNumber');
        const currencySelect = document.getElementById('currency_select');

        data.forEach(country => {
            const { cca2, name, callingCode } = country;
            const option = createDropdownOption(cca2, `${name} (+${callingCode})`, {
                'country-name': name,
                'flag-icon-class': cca2.toLowerCase(),
                'dial-code': callingCode,
            });
            dropdown.add(option);
        });

        data.forEach(currency => {
            const option = createDropdownOption(currency.currency, currency.currency, {});
            currencySelect.add(option);
        });

        dropdown.addEventListener('change', function () {
            const selectedOption = this.options[this.selectedIndex];
            const flagIconClass = selectedOption.getAttribute('data-flag-icon-class');
            const flagName = selectedOption.getAttribute('data-country-name');
            const dialCode = selectedOption.getAttribute('data-dial-code');

            flagIconSpan.innerHTML = `<img src="https://flagcdn.com/${flagIconClass}.svg" class="inline-block h-10 w-10" alt="${flagName}"/>`;
            phoneNumberInput.value = `+${dialCode}`; // Set input value to the dial code
            console.log('Selected Country Code:', selectedOption.value);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

init();