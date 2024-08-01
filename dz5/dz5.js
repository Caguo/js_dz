// Confirms

let confirmsQuestionFirst = [confirm("Ви сьогодні снідали 1?")];
let confirmsQuestionSecond = [confirm("Ви сьогодні снідали 2?")];
let confirmsQuestionThird = [confirm("Ви сьогодні снідали 3?")];
let confirmsQuestionFourth = [confirm("Ви сьогодні снідали 4?")];
let arr = [...confirmsQuestionFirst,...confirmsQuestionSecond,...confirmsQuestionThird,...confirmsQuestionFourth];
console.log(arr);

// Prompts

let arrPrompts = []
arrPrompts[0] = prompt("Привіт");
arrPrompts[1] = prompt("Пока");
arrPrompts[2] = prompt("Як справи");
arrPrompts[3] = prompt("До зустрічі");
console.log(arrPrompts);

// Item access

const arrAccess = ['qwe','ert','werd','sdfh'];
let yourAccess = prompt("Введіть індекс");
if (yourAccess === "length"){
   console.log(arrAccess.length);
}
console.log(arrAccess[yourAccess]);

// Item change

const arrChange = ['qwe','ert','werd','sdfh'];
let yourChange = +prompt("Введіть індекс");
let yourСhangeName = prompt("Введіть значення");
arrChange[yourChange] = yourСhangeName;
console.log(arrChange);

// Multiply table

const arrMultiply = [[1, 2, 3, 4, 5],[2, 4, 6, 8, 10],[3, 6, 9, 12, 15],[4, 8, 12, 16, 20],[5, 10, 15, 20, 25]];
arrMultiply[2][3] === 6

// Multiply table slice

const arrMultiplySlice = [[1, 2, 3, 4, 5],[2, 4, 6, 8, 10],[3, 6, 9, 12, 15],[4, 8, 12, 16, 20],[5, 10, 15, 20, 25]];
const newArrSlice = arrMultiplySlice.slice(1).map(row => row.slice(1));
console.log(newArrSlice);

// IndexOf Word

const yourStringWord = prompt("Введіть рядок").split(" ");
const yourWord = prompt("Введіть ваше слово");
const yourIndexOf = yourStringWord.indexOf(yourWord);
if (yourIndexOf >= 0){
   console.log(yourIndexOf);
} else {
   console.log("Такого слова немає");
}

// Reverse

const arrReverse = [];
arrReverse.push(prompt("Введіть слово 1"));
arrReverse.push(prompt("Введіть слово 2"));
arrReverse.push(prompt("Введіть слово 3"));
arrReverse.push(prompt("Введіть слово 4"));
arrReverse.push(prompt("Введіть слово 5"));
const arrNewReverse = [];
let yourArrWord5 = arrReverse.pop();
arrNewReverse.push(yourArrWord5);
let yourArrWord4 = arrReverse.pop();
arrNewReverse.push(yourArrWord4);
let yourArrWord3 = arrReverse.pop();
arrNewReverse.push(yourArrWord3);
let yourArrWord2 = arrReverse.pop();
arrNewReverse.push(yourArrWord2);
let yourArrWord1 = arrReverse.pop();
arrNewReverse.push(yourArrWord1);
console.log(arrNewReverse);

// Reverse 2

const arrReverse2 = [];
arrReverse2.push(prompt("Введіть слово 1"));
arrReverse2.push(prompt("Введіть слово 2"));
arrReverse2.push(prompt("Введіть слово 3"));
arrReverse2.push(prompt("Введіть слово 4"));
arrReverse2.push(prompt("Введіть слово 5"));

const arrNewReverse2 = [];
let yourArrReverseWord5 = arrReverse2.pop();
arrNewReverse2.push(yourArrReverseWord5);
let yourArrReverseWord4 = arrReverse2.pop();
arrNewReverse2.push(yourArrReverseWord4);
let yourArrReverseWord3 = arrReverse2.pop();
arrNewReverse2.push(yourArrReverseWord3);
let yourArrReverseWord2 = arrReverse2.pop();
arrNewReverse2.push(yourArrReverseWord2);
let yourArrReverseWord1 = arrReverse2.pop();
arrNewReverse2.push(yourArrReverseWord1);

const arrFinal = []
let arrVutyag1 = arrNewReverse2.shift();
arrFinal.unshift(arrVutyag1);
let arrVutyag2 = arrNewReverse2.shift();
arrFinal.unshift(arrVutyag2);
let arrVutyag3 = arrNewReverse2.shift();
arrFinal.unshift(arrVutyag3);
let arrVutyag4 = arrNewReverse2.shift();
arrFinal.unshift(arrVutyag4);
let arrVutyag5 = arrNewReverse2.shift();
arrFinal.unshift(arrVutyag5);
console.log(arrFinal);

// Copy

const arrMultiplySliceCopy = [[1, 2, 3, 4, 5],[2, 4, 6, 8, 10],[3, 6, 9, 12, 15],[4, 8, 12, 16, 20],[5, 10, 15, 20, 25]];
const arrCopy = arrMultiplySliceCopy.slice()
console.log(arrCopy);

// Deep Copy

const arrMultiplySliceDeepCopy = [[1, 2, 3, 4, 5],[2, 4, 6, 8, 10],[3, 6, 9, 12, 15],[4, 8, 12, 16, 20],[5, 10, 15, 20, 25]];
const arrDeepCopy = arrMultiplySliceCopy.slice();
const arrFinalCopy = [...arrDeepCopy, ...arrMultiplySliceDeepCopy];
console.log(arrFinalCopy);

// Array Equals

const arr1 = ['привіт'];
const arr2 = arr1
arr1 === arr2

// Flat

const arrMultiplySliceDeepCopy = [[1, 2, 3, 4, 5],[2, 4, 6, 8, 10],[3, 6, 9, 12, 15],[4, 8, 12, 16, 20],[5, 10, 15, 20, 25]];
const arrDeepCopy = arrMultiplySliceCopy.slice();
const arrFinalCopy = [...arrDeepCopy, ...arrMultiplySliceDeepCopy];
const arrFlat = [...arrMultiplySliceDeepCopy, ...arrDeepCopy, ...arrFinalCopy]
console.log(arrFlat);

// Destruct

let arrDestruct = prompt('Введіть рядок');
let [a,,,,b,,,,c] = arrDestruct
console.log([a,b,c])

// Destruct default

let arrDestruct = prompt('Введіть рядок');
let [a="!",,,,b="!",,,,c="!"] = arrDestruct
console.log([a,b,c])

// Multiply table rest
const multiplicationTable = [
   [1, 2, 3, 4, 5],
   [2, 4, 6, 8, 10],
   [3, 6, 9, 12, 15],
   [4, 8, 12, 16, 20],
   [5, 10, 15, 20, 25]
 ];
 
 const [[firstRowElement, ...firstRowRest],[secondRowElement, ...secondRowRest],[thirdRowElement, ...thirdRowRest],[fourthRowElement, ...fourthRowRest]] = multiplicationTable;
 
 const combinedArray = [...firstRowRest, ...secondRowRest, ...thirdRowRest, ...fourthRowRest];
 
 const resultArray = combinedArray.filter(element => element !== 0);
 
 console.log(resultArray);

//  For Alert

const names = ["John", "Paul", "George", "Ringo"]
for (const name of names) {
     alert(`Hello, ${name}`)
}

// For Select Option

const currencies = ["USD", "EUR", "GBP", "UAH"]
let   yourOption = "<select>"
for (const currency of currencies){
   yourOption += `<option value="${currency}">${currency}</option>`;
}
yourOption+= "</select>"
document.write(yourOption) //document.write відобразить ваш HTML на сторінці

// For Table Horizontal

const namesHorizontal = ["John", "Paul", "George", "Ringo"]
let   strHorizontal = "<table>"
for (const name of namesHorizontal){
   strHorizontal += `<td>${name}</td>`;
}
strHorizontal+= "</table>"
document.write(strHorizontal) //document.write отобразит ваш HTML на странице

// For Table Vertical

const namesVertical = ["John", "Paul", "George", "Ringo"]
let   strVertical = "<table>"
for (const name of namesVertical){
   strVertical += `<tr><td>${name}</td></tr>`;
}
strVertical+= "</table>"
document.write(strVertical) //document.write відобразить ваш HTML на сторінці


// For Table Letters

const currencies = ["USD", "EUR", "GBP", "UAH"]
let   str = "<table>"
for (const currency of currencies){ //цикл створює рядки
     // Одна ітерація циклу створює ОДНИЙ РЯДОК
    console.log(currency)
    for (const letter of currency){ //цикл створює осередки в одному рядку
         //одна ітерація циклу створює ОДИН осередок
        console.log(letter)
    }
}
str+= "</table>"
document.write(str) //document.write відобразить ваш HTML на сторінці

// For Multiply Table

const table = document.createElement('table');

for (let i = 0; i <= 4; i++) {
    const tr = document.createElement('tr');

    tr.style.backgroundColor = i % 2 === 0 ? 'lightgray' : 'white';

    for (let j = 0; j <= 4; j++) {
        const td = document.createElement('td');
        td.textContent = i * j;
        tr.appendChild(td);
    }
    
    table.appendChild(tr);
}

document.body.appendChild(table);



// Function Capitalize

const capitalize = str => {
   let result = str[0].toUpperCase() + str.slice(1).toLowerCase();
   return result //саме цей код забезпечить повернення результату функції
}
console.log(capitalize("cANBerRa")) //Canberra

// Map Capitalize

const yourInput = prompt("Введіть рядок:");
const mapCapitalize = (word) => word[0].toUpperCase() + word.slice(1).toLowerCase();

const mapCapitalizedString = yourInput.split(' ').map(mapCapitalize).join(' ');

console.log(mapCapitalizedString);

// Filter Lexics

const badWords = ["чих", "пык", "атата"];
const yourLexInput = prompt("Введіть рядок:").split(' ');
const filteredWords = yourLexInput.filter(userInput => !badWords.includes(userInput.toLowerCase()));
const filteredString = filteredWords.join(' ');

console.log(filteredString);
