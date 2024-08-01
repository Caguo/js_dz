// while confirm

let answer = true;

while (answer) {
    answer = confirm("Натисніть 'OK', щоб продовжити, або 'Скасувати', щоб завершити цикл.");
}

console.log("Цикл завершено.");

// array fill

let arr = [];

while (true) {
    let input = prompt("Введіть елемент масиву:");

    if (input === null) {
        break; // якщо користувач натиснув "Скасувати", виходимо з циклу
    }

    arr.push(input);
}

console.log("Отриманий масив:", arr);

// array fill nopush

let arrFill = [];
let index = 0;

while (true) {
    let input = prompt("Введіть елемент масиву:");

    if (input === null) {
        break; // якщо користувач натиснув "Скасувати", виходимо з циклу
    }

    arrFill[index] = input;
    index++;
}

console.log("Отриманий масив:", arrFill);


// infinite probability

let iterations = 0;

while (true) {
    iterations++;

    if (Math.random() > 0.9) {
        break;
    }
}

alert("Кількість ітерацій: " + iterations);

// empty loop

while (true) {
   if (!prompt("Натисніть 'OK', щоб продовжити, або 'Скасувати', щоб завершити цикл.")) {
       continue;
   }
   break;
}

// progression sum

let N = +prompt("Введіть значення N:");

let sum = 0;

for (let i = 1; i <= N; i += 3) {
    sum += i;
}

console.log("Сума арифметичної прогресії: " + sum);

// chess one line

let length = 10; // Задайте довжину рядка тут

let chessLine = '';

for (let i = 0; i < length; i++) {
    if (i % 2 === 0) {
        chessLine += '#';
    } else {
        chessLine += '.';
    }
}

console.log(chessLine);

// numbers

let result = '';

for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        result += j;
    }
    result += '\n';
}

console.log(result);

// chess

function chess(rows, cols) {
    let board = "";
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if ((i + j) % 2 === 0) {
          board += ".";
        } else {
          board += "#";
        }
      }
      board += "\n";
    }
    return board;
  }
  
  const rows = 10;
  const cols = 12;
  
  console.log(chess(rows, cols));

// cubes

let ask = prompt("Введіть кількість елементів в масиві:");
let cubesArray = [];

for (let i = 0; i < ask; i++) {
  cubesArray.push(i * i * i);
}

console.log(cubesArray);

// multiply table

let multiRows = prompt("Введіть кількість рядків таблиці множення:");
let multiCols = prompt("Введіть кількість стовпців таблиці множення:");
let multiplyTable = [];

for (let i = 0; i <= rows; i++) {
  multiplyTable[i] = [];
  for (let j = 0; j <= cols; j++) {
    multiplyTable[i][j] = i * j;
  }
}

console.log(multiplyTable);
