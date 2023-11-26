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

        const dropdown = document.getElementById("countryDropdown");
        const phoneNumberInput = document.getElementById("phoneNumber");
        const currencySelect = document.getElementById("currency_select");
        const nationSelect = document.getElementById("nation_select");

        data.forEach((country) => {
            const { country_code, country_name, dialling_code, country_emoji } =
                country;
            const option = createDropdownOption(
                country_code,
                `${country_emoji} ${country_name} (${dialling_code})`,
                {
                    "country-name": country_name,
                    "flag-icon-class": country_code.toLowerCase(),
                    "dial-code": dialling_code,
                }
            );
            dropdown.add(option);
        });

        data.forEach((money) => {
            const { currency, country_emoji } = money;
            const option = createDropdownOption(
                currency,
                `${country_emoji} ${currency}`,
                {}
            );
            currencySelect.add(option);
        });

        data.forEach((nationality) => {
            const { country_name, country_emoji } = nationality;
            const option = createDropdownOption(
                country_name,
                `${country_emoji} ${country_name}`,
                {}
            );
            nationSelect.add(option);
        });

        dropdown.addEventListener("change", function () {
            const selectedOption = this.options[this.selectedIndex];
            const dialCode = selectedOption.getAttribute("data-dial-code");

            phoneNumberInput.value = `${dialCode}`; // Set input value to the dial code
            console.log("Selected Country Code:", selectedOption.value);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

init();
