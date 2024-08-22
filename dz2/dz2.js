// assign: evaluation

var a = 5;
var b, c;

b = (a * 5);
b = (c = (b/2)); // додав душки до b/2

// Number: age

let  age = prompt("Введіть ваш вік");
let birthday = 2024;
let yourBirthday = birthday - age;
alert('Ви народилися у ' + yourBirthday + ' році.');

// Number: temperature

let degreesCelsius = prompt('Введіть градуси по цельсію');
let degreesFahrenheit = prompt('Введіть градуси по фарингейту');
let resultCelsius = degreesCelsius * 9/5 + 32;
let resultFahrenheit = (degreesFahrenheit - 32) * 5/9;
alert('Цельсій в Фаренгейт = '+ resultCelsius);
alert('Фаренгейт в Цельсій = '+ resultFahrenheit);

// Number: divide

let fisrtNubmer = prompt('Введіть перше число');
let secondNubmer = prompt('Введіть друге число');
let result = Math.floor(fisrtNubmer / secondNubmer);
alert('Результат поділу = ' + result);

// Number: currency

let moneyUsd = prompt('Введіть вашу кількість долларів')
const rateUa = 39.35;
const resultRate = Math.floor (moneyUsd * rateUa);
alert('Ваша сумма у гривнях = ' + resultRate + ' грн.'); 

// Number: RGB

let redNumber = +prompt('Введіть число червоного кольору');
let greenNumber = +prompt('Введіть число зеленого кольору');
let blueNumber = +prompt('Введіть число синього кольору');

let redHex = redNumber.toString(16).padStart(2,0);
let greenHex = redNumber.toString(16).padStart(2,0);
let blueHex = redNumber.toString(16).padStart(2,0);
alert ('CSS колір = #' + redHex + greenHex + blueHex);

// Number: flats

const floors = Number(prompt("Введите количество этажей в доме:"));
const flatsPerFloor = Number(prompt("Введите количество квартир на этаже:"));
const flatNumber = Number(prompt("Введите номер квартиры:"));

const flatsPerEntrance = floors * flatsPerFloor;

const entrance = Math.ceil(flatNumber / flatsPerEntrance);

const floor = Math.ceil((flatNumber - (entrance - 1) * flatsPerEntrance) / flatsPerFloor);

alert(`Квартира №${flatNumber} находится в подъезде №${entrance} на ${floor}-м этаже.`);

