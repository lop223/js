function findMinMax(arr) {
    let min = arr[0];
    let max = arr[0];

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < min) {
            min = arr[i];
        }
        if (arr[i] > max) {
            max = arr[i];
        }
    }

    return { min: min, max: max };
}
 
function compare(obj1, obj2) {
    if (obj1.name === obj2.name && obj1.price === obj2.price) {
        return "The objects are the same.";
    } else {
        return "Objects are different.";
    }
}

function isInRange(number, min, max) {
    return number >= min && number <= max;
}

function getGradeText(grade) {
    if (grade >= 90) {
        return "Відмінно";
    } else if (grade >= 75) {
        return "Добре";
    } else if (grade >= 60) {
        return "Задовільно";
    } else {
        return "Незадовільно";
    }
}

function getGradeTextTernary(grade) {
    return grade >= 90 ? "Відмінно" :
           grade >= 75 ? "Добре" :
           grade >= 60 ? "Задовільно" :
           "Незадовільно";
}

function getSeason(month) {
    if (month >= 1 && month <= 12) {
        if (month === 12 || month === 1 || month === 2) {
            return "Winter";
        } else if (month >= 3 && month <= 5) {
            return "Spring";
        } else if (month >= 6 && month <= 8) {
            return "Summer";
        } else {
            return "Fall";
        }
    } else {
        return "Incorect month";
    }
}

function getSeasonTernary(month) {
    return (month < 1 || month > 12) ? "Incorect month" :
           (month === 12 || month === 1 || month === 2) ? "Winter" :
           (month >= 3 && month <= 5) ? "Spring" :
           (month >= 6 && month <= 8) ? "Summer" :
           "Fall";
}


console.log(findMinMax([3, 7, 1, 9, 4]));

let product1 = { name: "cheese", price: 20 };
let product2 = { name: "meat", price: 20 };
console.log(compare(product1, product2));

console.log(isInRange(5, 1, 10));

let flag = true;
flag = !flag;
console.log(flag);

console.log(getGradeText(85));
console.log(getGradeTextTernary(61));

console.log(getSeason(4));
console.log(getSeasonTernary(6));