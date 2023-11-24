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
        const data = await fetchData('assets/countries.json');

        const dropdown = document.getElementById('countryDropdown');
        const flagIconSpan = document.getElementById('flagIcon');
        const phoneNumberInput = document.getElementById('phoneNumber');
        const currencySelect = document.getElementById('currency_select');
        const nationSelect = document.getElementById('nation_select');

        data.forEach(country => {
            const { country_code, country_name, dialling_code } = country;
            const option = createDropdownOption(country_code, `${country_name} (${dialling_code})`, {
                'country-name': country_name,
                'flag-icon-class': country_code.toLowerCase(),
                'dial-code': dialling_code,
            });
            dropdown.add(option);
        });

        data.forEach(currency => {
            const option = createDropdownOption(currency.currency, currency.currency, {});
            currencySelect.add(option);
        });

        data.forEach(nationality => {
            const option = createDropdownOption(nationality.country_name, nationality.country_name, {});
            nationSelect.add(option);
        });

        dropdown.addEventListener('change', function () {
            const selectedOption = this.options[this.selectedIndex];
            const flagIconClass = selectedOption.getAttribute('data-flag-icon-class');
            const flagName = selectedOption.getAttribute('data-country-name');
            const dialCode = selectedOption.getAttribute('data-dial-code');

            flagIconSpan.innerHTML = `<img src="https://flagcdn.com/${flagIconClass}.svg" class="inline-block w-7" alt="${flagName}"/>`;
            phoneNumberInput.value = `${dialCode}`; // Set input value to the dial code
            console.log('Selected Country Code:', selectedOption.value);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

init();
