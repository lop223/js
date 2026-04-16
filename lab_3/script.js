function calcSumFirst(n) {
    let sum = 0;
    let i = 1;
    while (i <= n) {
        sum += i;
        i++;
    }
    return sum;
}      

function factorial(n) {
    let factorial = 1;
    for (let i = 1; i <= n; i++) {
        factorial *= i;
    }
    return factorial;
}

function getMonthName(monthNumber) {
    switch (monthNumber) {
        case 1: return "January";
        case 2: return "February";
        case 3: return "March";
        case 4: return "April";
        case 5: return "May";
        case 6: return "June";
        case 7: return "July";
        case 8: return "August";
        case 9: return "September";
        case 10: return "October";
        case 11: return "November";
        case 12: return "December";
        default: return "Error: Please enter a number between 1 and 12";
    }
}

function calcPairArrSum(arr) {
    return arr.reduce((sum, el) => (el % 2 === 0 ? sum + el : sum), 0);
}

const isVowel = (char) => {
    const vowels = "aeyuioуеоїаоієюяи";
    return vowels.includes(char.toLowerCase());
}

const calcVowelCount = (string) => {
    return [...string].reduce((count, char) => isVowel(char) ? count + 1 : count, 0);
}

function power(base, exponent) {
    return base ** exponent;
} 

console.log(calcSumFirst(50));
console.log(factorial(5));
console.log(getMonthName(3));
console.log(calcPairArrSum([2, 5, 6, 7, 4, 9, 10, 2]))
console.log(calcVowelCount("saddsaeasd"));
console.log(power(5, 4))