// Temperature

const yCel = (a) => a * 9/5 + 32;
const yFah = (a) => (a - 32) * 5/9;

// RGB

const yRGB = (r, g, b) => '#' + r.toString(16).padStart(2,0) + g.toString(16).padStart(2,0) + b.toString(16).padStart(2,0);

// Credentials

const capitalize = str => {
   let result = str[0].toUpperCase() + str.slice(1).toLowerCase();
   return result;
}

const credentials = () => {
    const name = capitalize(prompt("Введіть ваше ім'я:"));
    const surname = capitalize(prompt("Введіть ваше прізвище:"));
    const fatherName = capitalize(prompt("Введіть ваше по батькові:"));
    const fullName = `${name} ${surname} ${fatherName}`;

    return {
        name: name,
        surname: surname,
        fatherName: fatherName,
        fullName: fullName
    };
}

const person = credentials();
console.log(person);

// New line

const lineText = prompt("Введіть текст:");

const yLine = (text) => {
   const sliceLineText = text.split('\\n');
   const resultLineText = sliceLineText.join('\n');
   return resultLineText;
}

const result = yLine(lineText);
console.log(result);

// Prompt OR

const yPrompt = () => prompt("Введіть текст") || console.log("Все ясно")

alert(yPrompt())

// Login And Password

const logPass = (log,pass) =>{
    let yLog = prompt('Введіть ваш логін');

    if (yLog === log){
        let yPass = prompt('Введіть пароль');
        if (yPass === pass){
            alert('Ви увійшли в систему');
        } else{
            alert('Пароль не вірний');
        }
    } else {
        alert('Ви ввели невірний логін');
    }
}

logPass('admin','qwerty')

// For Table

const yourTable = (array) => {
    const table = document.createElement('table');

    for (let i = 0; i < array.length; i++) {
        const tr = document.createElement('tr');
        tr.style.backgroundColor = i % 2 === 0 ? 'lightgray' : 'white';

        for (let j = 0; j < array[i].length; j++) {
            const td = document.createElement('td');
            td.style.border = '1px solid black';
            td.style.padding = '5px';
            td.style.textAlign = 'center';
            td.textContent = array[i][j];
            tr.appendChild(td);
        }

        table.appendChild(tr);
    }

    return table;
};

const array = [
    [0, 0, 0, 0, 0],
    [0, 1, 2, 3, 4],
    [0, 2, 4, 6, 8],
    [0, 3, 6, 9, 12],
    [0, 4, 8, 12, 16]
];

document.body.appendChild(yourTable(array));

// Filter Lexics

const filterLexics = (yourLexString, forbiddenWords) => {
    const words = yourLexString.split(' ');

    const filteredWords = words.filter(word => !forbiddenWords.includes(word.toLowerCase()));

    return filteredWords.join(' ');
};

const yourLexString = prompt("Введіть рядок:");
const forbiddenWords = ['бляха', 'муха', 'пляшка', 'шабля'];

const filteredString = filterLexics(yourLexString, forbiddenWords);

console.log(filteredString);

// Currency Table

const displayCurrencyTable = () => {
    fetch('https://open.er-api.com/v6/latest/USD').then(res => res.json())
        .then(data => {
            const currencies = Object.keys(data.rates);
            const currencyTable = [];

            currencyTable.push(['', ...currencies]);
            currencies.forEach(currency1 => {
                const row = [currency1];
                currencies.forEach(currency2 => {
                    if (currency1 === currency2) {
                        row.push('1.00');
                    } else {
                        const rate = (1 / data.rates[currency1]) * data.rates[currency2];
                        row.push(rate.toFixed(2));
                    }
                });
                currencyTable.push(row);
            });

            displayTable(currencyTable);
        })
}

const displayTable = (tableData) => {
    const table = document.createElement('table');

    tableData.forEach(rowData => {
        const row = document.createElement('tr');
        rowData.forEach(cellData => {
            const cell = document.createElement('td');
            cell.textContent = cellData;
            row.appendChild(cell);
        });
        table.appendChild(row);
    });

    document.body.appendChild(table);
}

displayCurrencyTable();

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
 
        formHTML += `<label>${key}: <input type="${inputType}" ${inputType === "checkbox" ? (value ? "checked" : "") : `value="${value}"`}/></label><br/>`;
    }
 
    formHTML += "</form>";
    document.write(formHTML);
}
 
createForm(car);
 

// Array of objects sort

const sort = (array, field, ascending = true) => {
    array.sort((a, b) => {
        if (a === undefined || b === undefined) {
            console.error('Поле пусте');
            return 0;
        }

        const znachA = typeof a[field] === 'string' ? a[field].toUpperCase() : a[field];
        const znachB = typeof b[field] === 'string' ? b[field].toUpperCase() : b[field];

        let comparison = 0;
        if (znachA > znachB) {
            comparison = 1;
        } else if (znachA < znachB) {
            comparison = -1;
        }

        return ascending ? comparison : comparison * -1;
    });

    return array;
}

var persons = [
    {name: "Іван", age: 17},
    {name: "Марія", age: 35},
    {name: "Олексій", age: 73},
    {name: "Яків", age: 12},
];

sort(persons, "age"); 
console.log(persons);

sort(persons, "name", false);
console.log(persons);

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

function createTable(data, sortBy, sortOrder) {
    const sortedData = [...data];
    
    sortedData.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const columns = new Set();
    sortedData.forEach(item => {
        Object.keys(item).forEach(key => columns.add(key));
    });

    let tableHTML = "<table border='1'><tr>";
    
    columns.forEach(column => {
        tableHTML += `<th>${column}</th>`;
    });
    
    tableHTML += "</tr>";

    sortedData.forEach(item => {
        tableHTML += "<tr>";
        columns.forEach(column => {
            tableHTML += `<td>${item[column] !== undefined ? item[column] : ""}</td>`;
        });
        tableHTML += "</tr>";
    });

    tableHTML += "</table>";
    document.write(tableHTML);
}

createTable(cars, 'Horsepower', 'asc');  

// Divide html file

// Calc Func

function divideNumbers(dividend, divisor) {
    const result = {};

    if (divisor === 0) {
        result.error = "На нуль ділити не можна.";
        return result;
    }

    // Выполняем деление
    result.division = dividend / divisor;
    result.quotient = result.division.toFixed(2);

    return result;
}

const dividend = 10;
const divisor = 2;
const calculationResult = divideNumbers(dividend, divisor);

console.log(calculationResult); // { division: 5, quotient: '5.00' }


// Calc Live in html file