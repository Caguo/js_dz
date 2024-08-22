// Literals

const cat = {
   name: "Барсик",
   age: 3,
   breed: "Сибирский кот",
   color: "Белый",
   weight: 3.5
}

// Literals expand

let newObj = {};
let yourKey = prompt("Введіть ключ");
let yourValue = prompt("Введіть значення");
newObj[yourKey] = yourValue;
console.log(newObj)

// Literals copy

let newObj = {};
let yourKeyCopy = prompt("Введіть ключ");
let yourValueCopy = prompt("Введіть значення");
newObj[yourKeyCopy] = yourValueCopy;
let secondObj = {...newObj}
let yourKeyCopy2 = prompt("Введіть ключ");
let yourValueCopy2 = prompt("Введіть значення");
secondObj[yourKeyCopy2] = yourValueCopy2;
console.log(newObj, secondObj)

// Html tree

const body = {
   tagName: "body",
   children: [
      {
         tagName: "div",
         children: [
            {
               tagName: "span",
               text: "Enter a data please:",
               siblings: "br/"
            },
            {
               tagName: "input",
               attrs: 
                  {
                     type: "text",
                     id: "name"
                  }
            },
            {
               tagName: "input",
               attrs: 
                  {
                     type: "text",
                     id: "surname"
                  }
            }
         ]
      },
      {
         tagName: "div",
         children: [
            {
               tagName: "button",
               text: "OK",
               attrs: 
                  {
                     id: "ok"
                  }
            },
            {
               tagName: "button",
               text: "Cancel",
               attrs: 
                  {
                     id: "cancel"
                  }
            }
         ]
      }
   ]
}

// Parent

body.children[0].parent = body;
body.children[1].parent = body;

body.children[0].children[0].parent = body.children[0];
body.children[0].children[1].parent = body.children[0];
body.children[0].children[2].parent = body.children[0];

body.children[1].children[0].parent = body.children[1];
body.children[1].children[1].parent = body.children[1];

// Change OK

let yourChangeName = prompt("Введіть назву атрибута для тега <button id='ok'>:");
let yourChangeValue = prompt(`Введіть значення для атрибута "${yourChangeName}":`);
body.children[1].children[0].attrs[yourChangeName] = yourChangeValue;

// Destructure

const body = {
   tagName: "body",
   children: [
      {
         tagName: "div",
         children: [
            {
               tagName: "span",
               text: "Enter a data please:",
               siblings: "br/"
            },
            {
               tagName: "input",
               attrs: 
                  {
                     type: "text",
                     id: "name"
                  }
            },
            {
               tagName: "input",
               attrs: 
                  {
                     type: "text",
                     id: "surname"
                  }
            }
         ]
      },
      {
         tagName: "div",
         children: [
            {
               tagName: "button",
               text: "OK",
               attrs: 
                  {
                     id: "ok"
                  }
            },
            {
               tagName: "button",
               text: "Cancel",
               attrs: 
                  {
                     id: "cancel"
                  }
            }
         ]
      }
   ]
};

const {children:[{ children: [{ text: spanText }] },{ children: [{ text: secondButtonText }] }]} = body;

const {children: [{},{ children: [{},{ attrs: { id: cancelButtonId } }] }]} = body;


console.log(spanText);
console.log(secondButtonText);
console.log(cancelButtonId);


// Destruct array

let arr = [1,2,3,4,5, "a", "b", "c"]



// Destruct string

let arrString = [1, "abc"];

const [number, str] = arrString;
const [s1, s2, s3] = str;

console.log("Число:", number + "  " + "Літери:", s1, s2, s3);

// Destruct 2

let obj = {name: 'Ivan',
           surname: 'Petrov',
           children: [{name: 'Maria'}, {name: 'Nikolay'}]}

const {children: [{name: name1},{name:name2}]} = obj;
console.log(name1,name2)

// Destruct 3

let arr3 = [1,2,3,4,5,6,7,10]
const {a,b, ...rest} = arr3;
console.log(a,b,arr3.length)

// Copy delete

const catCopy = {
   name: "Барсик",
   age: 3,
   breed: "Сибирский кот",
   color: "Белый",
   weight: 3.5
}

// Currency real rate

fetch('https://open.er-api.com/v6/latest/USD').then(res => res.json())
    .then(data => {
        const fromCurrency = prompt("Введіть вихідну валюту:").toUpperCase();
        const toCurrency = prompt("Введіть валюту, в яку відбувається конвертація:").toUpperCase();
        const buyCost = parseFloat(prompt("Введіть суму у вихідній валюті:"));

        if (!data.rates[fromCurrency] || !data.rates[toCurrency]) {
            console.log("Невідома валюта.");
            document.write("Невідома валюта.");
            return;
        }
        const convertedAmount = (buyCost / data.rates[fromCurrency]) * data.rates[toCurrency];
        const result = convertedAmount.toFixed(2);

        console.log(`Результат конвертації: ${buyCost} ${fromCurrency} = ${result} ${toCurrency}`);
    })

// Currency drop down

fetch('https://open.er-api.com/v6/latest/USD').then(res => res.json())
    .then(data => {
        const currencies = Object.keys(data.rates);

        const dropdown = document.createElement('select');
        dropdown.id = 'currencyDropdown';

        currencies.forEach(currency => {
            const option = document.createElement('option');
            option.value = currency;
            option.textContent = currency;
            dropdown.appendChild(option);
        });

        document.body.appendChild(dropdown);

        dropdown.addEventListener('change', () => {
            const selectedCurrency = dropdown.value;
            console.log(`Вибрана валюта: ${selectedCurrency}`);
        });
    })

// Currency table

fetch('https://open.er-api.com/v6/latest/USD').then(res => res.json())
    .then(data => {
        const currencies = Object.keys(data.rates);
        const ratesTable = document.createElement('table');
        const headerRow = document.createElement('tr');

        const emptyHeader = document.createElement('th');
        headerRow.appendChild(emptyHeader);
        currencies.forEach(currency => {
            const currencyHeader = document.createElement('th');
            currencyHeader.textContent = currency;
            headerRow.appendChild(currencyHeader);
        });
        ratesTable.appendChild(headerRow);

        currencies.forEach(currency1 => {
            const row = document.createElement('tr');
            const currency1Header = document.createElement('th');
            currency1Header.textContent = currency1;
            row.appendChild(currency1Header);

            currencies.forEach(currency2 => {
                const cell = document.createElement('td');
                if (currency1 === currency2) {
                    cell.textContent = '1.00';
                } else {
                    const rate = (1 / data.rates[currency1]) * data.rates[currency2];
                    cell.textContent = rate.toFixed(2);
                }
                row.appendChild(cell);
            });

            ratesTable.appendChild(row);
        });

        document.body.appendChild(ratesTable);
    })

// Form

const car = {
   "Name": "chevrolet chevelle malibu",
   "Cylinders": 8,
   "Displacement": 307,
   "Horsepower": 130,
   "Weight_in_lbs": 3504,
   "Origin": "USA",
   "in_production": false
};

function createForm(obj) {
   let formHTML = "<form>";

   for (let key in obj) {
       let value = obj[key];
       let inputType = typeof value === "boolean" ? "checkbox" : typeof value === "number" ? "number" : "text";

       formHTML += `<label>${key}: `;

       if (inputType === "checkbox") {
           formHTML += `<input type="${inputType}" ${value ? "checked" : ""}/>`;
       } else {
           formHTML += `<input type="${inputType}" value="${value}"/>`;
       }

       formHTML += `</label><br/>`;
   }

   formHTML += "</form>";
   document.write(formHTML);
}

createForm(car);

// Table

const cars = [
   {
       "Name": "chevrolet chevelle malibu",
       "Cylinders": 8,
       "Displacement": 307,
       "Horsepower": 130,
       "Weight_in_lbs": 3504,
       "Origin": "USA"
   },
   {
       "Name": "buick skylark 320",
       "Miles_per_Gallon": 15,
       "Cylinders": 8,
       "Displacement": 350,
       "Horsepower": 165,
       "Weight_in_lbs": 3693,
       "Acceleration": 11.5,
       "Year": "1970-01-01"
   },
   {
       "Miles_per_Gallon": 18,
       "Cylinders": 8,
       "Displacement": 318,
       "Horsepower": 150,
       "Weight_in_lbs": 3436,
       "Year": "1970-01-01",
       "Origin": "USA"
   },
   {
       "Name": "amc rebel sst",
       "Miles_per_Gallon": 16,
       "Cylinders": 8,
       "Displacement": 304,
       "Horsepower": 150,
       "Year": "1970-01-01",
       "Origin": "USA"
   }
];

function createTable(data) {
   let columns = [];

   data.forEach(item => {
       for (let key in item) {
           if (!columns.includes(key)) {
               columns.push(key);
           }
       }
   });

   let tableHTML = "<table border='1'><tr>";

   columns.forEach(column => {
       tableHTML += `<th>${column}</th>`;
   });

   tableHTML += "</tr>";

   data.forEach(item => {
       tableHTML += "<tr>";
       columns.forEach(column => {
           tableHTML += `<td>${item[column] !== undefined ? item[column] : ""}</td>`;
       });
       tableHTML += "</tr>";
   });

   tableHTML += "</table>";
   document.write(tableHTML);
}

createTable(cars);