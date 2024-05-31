// Number: odd

let yourNumber = +prompt("Введіть число");
if (yourNumber === Number(yourNumber)){
   if (yourNumber % 2 === 0) {
      alert("Число парне");
   }
   else {
      alert("Число непарне");
   }
} else {
   alert("Введено не число");
}

// String: lexics

let yourText = prompt("Введіть текст");
const badFirstWord = "жук";
const badSecondWord = "гад";
if (yourText.includes(badFirstWord) || yourText.includes(badSecondWord)) {
   alert("Ви ввели нецензурне слово");
} else {
   alert("Ви ввели нормальний текст");
}

// Boolean

let questionFirst = confirm("Вам більше 20 років?");
let questionSecond = confirm("Ви не курите?");
alert(questionFirst + questionSecond);

// Boolean: if

let questionSex = confirm("Ви чоловік?");
if (questionSex === true){
   alert("Ви чоловік");
} else {
   alert("Ви жінка");
}

// Comparison: sizes

let castopSize = +prompt("Введіть ваш розмір");
if (castopSize >= 63 && castopSize <= 65){
   alert("Ваш розмір - XXS");
} else if (castopSize >= 66 && castopSize <= 69){
   alert("Ваш розмір - XS");
} else if (castopSize >= 70 && castopSize <= 74){
   alert("Ваш розмір - S");
} else if (castopSize >= 75 && castopSize <= 78){
   alert("Ваш розмір - M");
} else if (castopSize >= 79 && castopSize <= 83){
   alert("Ваш розмір - L");
} else if (castopSize >= 84 && castopSize <= 89){
   alert("Ваш розмір - XL");
} else if (castopSize >= 90 && castopSize <= 94){
   alert("Ваш розмір - XXL");
} else if (castopSize >= 95 && castopSize <= 97){
   alert("Ваш розмір - XXXL");
}

// Ternary

let questionTernary = confirm("Ви чоловік?") ?  "Ви чоловік" : "Ви жінка";
alert(questionTernary)

// Prompt: or

let yourAge = prompt("Введіть ваш вік") || alert("Ви не ввели вік");

// Confirm: or this days

let yourRobot = confirm("Шопінг?") || alert("ти - бяка")

// Confirm: if this days

let yourRobotday = confirm("Шопінг?")
if (yourRobotday=== false || yourRobotday === null){
   alert("ти - бяка")
} else {
   alert("Ура")
}

// Default: or

let yourName = prompt("Введіть ім'я") || 'Іван';
let yourSurname = prompt("Введіть прізвище") || 'Іванов';
let yourFatherName = prompt("Введіть по батькові") || 'Іванович';
alert (yourName + ' ' + yourFatherName + ' ' + yourSurname)

// Default: if

let yourNameIf = prompt("Введіть ім'я");
let yourSurnameIf  = prompt("Введіть прізвище");
let yourFatherNameIf  = prompt("Введіть по батькові");
if (yourName === false || yourName === null){
   yourName = 'Іван';
}
if (yourSurname === false || yourSurname === null){
   yourSurname = 'Іванов';
}
if (yourFatherName === false || yourFatherName=== null){
   yourFatherName = 'Іванович';
}
alert (yourName + ' ' + yourFatherName + ' ' + yourSurname)

// Login and password

let enterLog = prompt('Введіть логін');
const myLog = 'admin';
const myPass = 'qwerty';
if (enterLog === myLog){
   let enterPass = prompt('Введіть пароль');
   if (enterPass === myPass){
      alert("Доброго дня " + myLog)
   } else {
      alert("Невірний пароль")
   }
} else {
   alert("Невірний логін")
}

// Currency exchange

let yourCurrency = prompt("Введіть вашу валюту: UAH, USD, EUR").toUpperCase();
let yourCurrencyMoney = +prompt("Кількість валюти");
let buyOrSold = confirm("Купити чи продати?") ? "Купити" : "Продати";
let yourCurrencyChoose = prompt("Оберіть валюту: USD, UAH, EUR").toUpperCase();

let rate;

if (yourCurrency === "UAH" && yourCurrencyChoose === "USD") {
    rate = buyOrSold === "Купити" ?  39.45 : 0.025; 
} else if (yourCurrency === "UAH" && yourCurrencyChoose === "EUR") {
    rate = buyOrSold === "Купити" ?  42.77 : 0.023; 
} else if (yourCurrency === "USD" && yourCurrencyChoose === "UAH") {
    rate = buyOrSold === "Купити" ? 0.025 : 39,45; 
} else if (yourCurrency === "EUR" && yourCurrencyChoose === "UAH") {
    rate = buyOrSold === "Купити" ? 0.023 : 42.77; 
} else if (yourCurrency === "EUR" && yourCurrencyChoose === "USD") {
   rate = buyOrSold === "Купити" ? 0.92 : 0.92; 
} else if (yourCurrency === "USD" && yourCurrencyChoose === "EUR") {
   rate = buyOrSold === "Купити" ? 0.92 : 0.92; 
} else {
    alert("Невідома комбінація валют");
}

if (rate) {
    let result = buyOrSold === "Купити" ? yourCurrencyMoney / rate : yourCurrencyMoney * rate;
    alert(`Ви вирішили ${buyOrSold.toLowerCase()} ${yourCurrencyMoney} ${yourCurrency}. Сума в ${yourCurrencyChoose}: ${result.toFixed(2)}.`);
}



// Scissors

const yourChoose = prompt("Введіть камінь-ножиці-папір");
const randomNumber = Math.floor(Math.random() * 3);
let yourEnemy;

if (randomNumber === 0){
   yourEnemy = 'камінь';
} else if (randomNumber === 1){
   yourEnemy = 'ножиці';
} else if (randomNumber === 2){  
   yourEnemy = 'папір';
}

if (yourChoose === 'камінь' && yourEnemy === 'ножиці'){
   alert('Ви виграли');
} else if (yourChoose === 'камінь' && yourEnemy === 'камінь') {
   alert('нічия');
} else if (yourChoose === 'камінь' && yourEnemy === 'папір'){
   alert('Ви програли');
}
if (yourChoose === 'ножиці' && yourEnemy === 'папір'){
   alert('Ви виграли');
} else if (yourChoose === 'ножиці' && yourEnemy === 'камінь'){
   alert('Ви програли');
} else if (yourChoose === 'ножиці' && yourEnemy === 'ножиці'){
   alert('нічия');
}
if (yourChoose === 'папір' && yourEnemy === 'папір'){
   alert('нічия');
} else if (yourChoose === 'папір' && yourEnemy === 'камінь'){
   alert('Ви виграли');
} else if (yourChoose === 'папір' && yourEnemy === 'ножиці'){
   alert('Ви програли');
}

// Global

let globalDz = prompt("Оберіть завдання");
if (globalDz === "Number: odd"){
   let yourNumber = +prompt("Введіть число");
   if (yourNumber === Number(yourNumber)){
      if (yourNumber % 2 === 0) {
         alert("Число парне");
      }
      else {
         alert("Число непарне");
      }
   } else {
      alert("Введено не число");
   }
} else if (globalDz === "String: lexics"){
   let yourText = prompt("Введіть текст");
   const badFirstWord = "жук";
   const badSecondWord = "гад";
   if (yourText.includes(badFirstWord) || yourText.includes(badSecondWord)) {
      alert("Ви ввели нецензурне слово");
   } else {
      alert("Ви ввели нормальний текст");
   }
} else if (globalDz === "Boolean"){
   let questionFirst = confirm("Вам більше 20 років?");
   let questionSecond = confirm("Ви не курите?");
   alert(questionFirst + questionSecond);
} else if (globalDz === "Boolean: if"){
   let questionSex = confirm("Ви чоловік?");
   if (questionSex === true){
      alert("Ви чоловік");
   } else {
      alert("Ви жінка");
   }
} else if (globalDz === "Comparison: sizes"){
   let castopSize = +prompt("Введіть ваш розмір");
   if (castopSize >= 63 && castopSize <= 65){
      alert("Ваш розмір - XXS");
   } else if (castopSize >= 66 && castopSize <= 69){
      alert("Ваш розмір - XS");
   } else if (castopSize >= 70 && castopSize <= 74){
      alert("Ваш розмір - S");
   } else if (castopSize >= 75 && castopSize <= 78){
      alert("Ваш розмір - M");
   } else if (castopSize >= 79 && castopSize <= 83){
      alert("Ваш розмір - L");
   } else if (castopSize >= 84 && castopSize <= 89){
      alert("Ваш розмір - XL");
   } else if (castopSize >= 90 && castopSize <= 94){
      alert("Ваш розмір - XXL");
   } else if (castopSize >= 95 && castopSize <= 97){
      alert("Ваш розмір - XXXL");
   }
} else if (globalDz === "Ternary"){
   let questionTernary = confirm("Ви чоловік?") ?  "Ви чоловік" : "Ви жінка";
   alert(questionTernary)
} else if (globalDz === "Prompt: or"){
   let yourAge = prompt("Введіть ваш вік") || alert("Ви не ввели вік");
} else if (globalDz === "Confirm: or this days"){
   let yourRobot = confirm("Шопінг?") || alert("ти - бяка")
} else if (globalDz === "Confirm: if this days"){
   let yourRobotday = confirm("Шопінг?")
   if (yourRobotday=== false || yourRobotday === null){
      alert("ти - бяка")
   } else {
      alert("Ура")
   }
} else if (globalDz === "Default: or"){
   let yourName = prompt("Введіть ім'я") || 'Іван';
   let yourSurname = prompt("Введіть прізвище") || 'Іванов';
   let yourFatherName = prompt("Введіть по батькові") || 'Іванович';
   alert (yourName + ' ' + yourFatherName + ' ' + yourSurname)
} else if (globalDz === "Default: if"){
   let yourNameIf = prompt("Введіть ім'я");
   let yourSurnameIf  = prompt("Введіть прізвище");
   let yourFatherNameIf  = prompt("Введіть по батькові");
   if (yourName === false || yourName === null){
      yourName = 'Іван';
   }
   if (yourSurname === false || yourSurname === null){
      yourSurname = 'Іванов';
   }
   if (yourFatherName === false || yourFatherName=== null){
      yourFatherName = 'Іванович';
   }
   alert (yourName + ' ' + yourFatherName + ' ' + yourSurname)
} else if (globalDz === "Login and password"){
   let enterLog = prompt('Введіть логін');
   const myLog = 'admin';
   const myPass = 'qwerty';
   if (enterLog === myLog){
      let enterPass = prompt('Введіть пароль');
      if (enterPass === myPass){
         alert("Доброго дня " + myLog)
      } else {
         alert("Невірний пароль")
      }
   } else {
      alert("Невірний логін")
   }
} else if (globalDz === "Currency exchange"){
   let yourCurrency = prompt("Введіть вашу валюту: UAH, USD, EUR").toUpperCase();
   let yourCurrencyMoney = +prompt("Кількість валюти");
   let buyOrSold = confirm("Купити чи продати?") ? "Купити" : "Продати";
   let yourCurrencyChoose = prompt("Оберіть валюту: USD, UAH, EUR").toUpperCase();
   
   let rate;
   
   if (yourCurrency === "UAH" && yourCurrencyChoose === "USD") {
       rate = buyOrSold === "Купити" ?  39.45 : 0.025; 
   } else if (yourCurrency === "UAH" && yourCurrencyChoose === "EUR") {
       rate = buyOrSold === "Купити" ?  42.77 : 0.023; 
   } else if (yourCurrency === "USD" && yourCurrencyChoose === "UAH") {
       rate = buyOrSold === "Купити" ? 0.025 : 39,45; 
   } else if (yourCurrency === "EUR" && yourCurrencyChoose === "UAH") {
       rate = buyOrSold === "Купити" ? 0.023 : 42.77; 
   } else if (yourCurrency === "EUR" && yourCurrencyChoose === "USD") {
      rate = buyOrSold === "Купити" ? 0.92 : 0.92; 
   } else if (yourCurrency === "USD" && yourCurrencyChoose === "EUR") {
      rate = buyOrSold === "Купити" ? 0.92 : 0.92; 
   } else {
       alert("Невідома комбінація валют");
   }
   
   if (rate) {
       let result = buyOrSold === "Купити" ? yourCurrencyMoney / rate : yourCurrencyMoney * rate;
       alert(`Ви вирішили ${buyOrSold.toLowerCase()} ${yourCurrencyMoney} ${yourCurrency}. Сума в ${yourCurrencyChoose}: ${result.toFixed(2)}.`);
   }
} else if (globalDz === "Scissors"){
   const yourChoose = prompt("Введіть камінь-ножиці-папір");
   const randomNumber = Math.floor(Math.random() * 3);
   let yourEnemy;
   
   if (randomNumber === 0){
      yourEnemy = 'камінь';
   } else if (randomNumber === 1){
      yourEnemy = 'ножиці';
   } else if (randomNumber === 2){  
      yourEnemy = 'папір';
   }
   
   if (yourChoose === 'камінь' && yourEnemy === 'ножиці'){
      alert('Ви виграли');
   } else if (yourChoose === 'камінь' && yourEnemy === 'камінь') {
      alert('нічия');
   } else if (yourChoose === 'камінь' && yourEnemy === 'папір'){
      alert('Ви програли');
   }
   if (yourChoose === 'ножиці' && yourEnemy === 'папір'){
      alert('Ви виграли');
   } else if (yourChoose === 'ножиці' && yourEnemy === 'камінь'){
      alert('Ви програли');
   } else if (yourChoose === 'ножиці' && yourEnemy === 'ножиці'){
      alert('нічия');
   }
   if (yourChoose === 'папір' && yourEnemy === 'папір'){
      alert('нічия');
   } else if (yourChoose === 'папір' && yourEnemy === 'камінь'){
      alert('Ви виграли');
   } else if (yourChoose === 'папір' && yourEnemy === 'ножиці'){
      alert('Ви програли');
   }
}