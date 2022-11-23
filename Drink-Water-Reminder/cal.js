const WEIGHT = parseFloat(prompt("What's your Weight (KG)? "));
const AGE = parseFloat(prompt("What's your Age? "));

const OUNCE_PER_LITER = 33.814;

function glassesPerDay(age, weight) {
    let ratioPerAge = 0;
    if (age < 30) {
        ratioPerAge = 40;
    }
    else if (age <= 30 || age >= 55) {
        ratioPerAge = 35;
    }
    else {
        ratioPerAge = 30;
    }
    const ounces = (weight * ratioPerAge) / 28.3;
    const cups = ounces / 8;
    const l = ounces / OUNCE_PER_LITER;

    return parseFloat(ounces).toFixed(2) + ' ozs' + "<br>" + parseFloat(l).toFixed(3) + ' L' + "<br>" + parseInt(cups) + ' cups';
}

function main() {
    document.write('<div id="output">'+glassesPerDay(AGE, WEIGHT)+'</div');
}
main()
