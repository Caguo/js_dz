// blocks

let a = 10;
{
    let b = 20;
    {
        let c = 30;
        // a = 10, b = 21, c = 30, d - не оголошено
        
        b++;
        a *= 10;
    }
    {
        let c = 50;
        // a = 100, b = 521, c = 50, d - не оголошено
        b += 500;
    }
    {
        const a = 100500;
        const d = "value";
        // a = 100500, b - не доступна, c - не доступна, d = "value"
        {
            let a = -50;
            b = 1000;
            // a = -50, b = 1000, c - не доступна, d = "value"
        }
        // a = 100500, b = 1000, c - не доступна, d = "value"
    }
    // a = 100, b = 1000, c - не доступна, d - не доступна
}
// a = 100, b = 1000, c - не доступна, d - не доступна



// comparison if

let age = + prompt ("Скільки вам років?", "");
if (age < 0)
   alert("Ви не народилися ще");
else if (age < 18)
   alert("школяр");
else if (age < 30)
   alert("молодь");
else if (age < 45)
   alert("зрілість");
else if (age < 60)
   alert("захід сонця");
else if (age >= 60)
   alert("як пенсія?");
else
   alert("чи кіборг, чи KERNESS");

// switch: sizes

let castopSize = +prompt("Введіть ваш розмір");

switch (true) {
    case (castopSize >= 63 && castopSize <= 65):
        alert("Ваш розмір - XXS");
        break;
    case (castopSize >= 66 && castopSize <= 69):
        alert("Ваш розмір - XS");
        break;
    case (castopSize >= 70 && castopSize <= 74):
        alert("Ваш розмір - S");
        break;
    case (castopSize >= 75 && castopSize <= 78):
        alert("Ваш розмір - M");
        break;
    case (castopSize >= 79 && castopSize <= 83):
        alert("Ваш розмір - L");
        break;
    case (castopSize >= 84 && castopSize <= 89):
        alert("Ваш розмір - XL");
        break;
    case (castopSize >= 90 && castopSize <= 94):
        alert("Ваш розмір - XXL");
        break;
    case (castopSize >= 95 && castopSize <= 97):
        alert("Ваш розмір - XXXL");
        break;
    default:
        alert("Розмір не знайдено");
        break;
}

// switch: if

let color = prompt("Введіть колір", "");

if (color === "red") {
    document.write("<div style='background-color: red;'>червоний</div>");
    document.write("<div style='background-color: black; color: white;'>чорний</div>");
} else if (color === "black") {
    document.write("<div style='background-color: black; color: white;'>чорний</div>");
} else if (color === "blue") {
    document.write("<div style='background-color: blue;'>синій</div>");
    document.write("<div style='background-color: green;'>зелений</div>");
} else if (color === "green") {
    document.write("<div style='background-color: green;'>зелений</div>");
} else {
    document.write("<div style='background-color: gray;'>Я не зрозумів</div>");
}

// noswitch

const noSwitch = (key, cases, defaultKey = 'default') => {
   if (key in cases) {
       const action = cases[key];
       return action();
   } else {
       const defaultAction = cases[defaultKey];
       return defaultAction();
   }
}

const drink = prompt("Що ви любите пити");

noSwitch(drink, {
   воду: () => console.log('Найздоровіший вибір!'),
   чай() {
       console.log('Смачна та корисна штука. Не перестарайтеся з цукром');
   },
   "пиво": () => console.log('Добре влітку, та в міру'),
   віскі: function () {
       console.log('Та ви, батечку, естет! Не забудьте лід і сигару');
   },
   default() {
       console.log('шото я не зрозумів');
   }
});
