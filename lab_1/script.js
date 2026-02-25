let listItems = document.querySelectorAll("ul li");

listItems.forEach(function(item) {
    console.log(item.innerText);
});


let button = document.getElementById("myButton");

button.onmousedown = function() {
    if (this.innerText == "Натисни мене") {
        this.innerText = "Максим Сергійович Долгий";
    } else {
        this.innerText = "Натисни мене";
    }
    
};