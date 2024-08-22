// makeProfileTimer

function makeProfileTimer() {
   const startTime = performance.now();

   return function() {
      const endTime = performance.now();
      return endTime - startTime;
   };
}

const timer1 = makeProfileTimer();
alert('Вимірюємо час роботи цього alert');
alert(`Час виконання alert: ${timer1()} мс`);

const timer2 = makeProfileTimer();
prompt('');
alert(`Час роботи двох alert та одного prompt: ${timer2()} мс`);


alert(`Час роботи prompt та попереднього alert: ${timer1()} мс`);

// makeSaver

function makeSaver(func) {
   let result;
   let called = false;

   return function() {
       if (!called) {
           result = func();
           called = true;
       }
       return result;
   };
}

let saver = makeSaver(Math.random);
let value1 = saver();
let value2 = saver();
alert(`Random: ${value1} === ${value2}`); 

let saver2 = makeSaver(() => {
   console.log('saved function called');
   return [null, undefined, false, '', 0, Math.random()][Math.floor(Math.random()*6)];
});
let value3 = saver2();
let value4 = saver2();
console.log(value3 === value4); 

let namePrompt = prompt.bind(window, 'Як тебе звуть?');
let nameSaver = makeSaver(namePrompt);
alert(`Привіт! Prompt ще не було!`);
alert(`Привіт ${nameSaver()}. Щойно запустився prompt, перший та останній раз`);
alert(`Слухай, ${nameSaver()}, го пити пиво. Адже prompt був лише один раз`);

// myBind

function myBind(func, context, defaults) {
    return function(...args) {
        let mergedArgs = [];
        
        for (let i = 0; i < defaults.length; i++) {
            if (defaults[i] === undefined) {
                mergedArgs.push(args.shift());
            } else {
                mergedArgs.push(defaults[i]);
            }
        }
 
        mergedArgs = mergedArgs.concat(args);
 
        return func.apply(context, mergedArgs);
    };
}
 


let pow5 = myBind(Math.pow, Math, [undefined, 5]);
console.log(pow5(2)); 
console.log(pow5(4)); 

let cube = myBind(Math.pow, Math, [undefined, 3]);
console.log(cube(3)); 

let chessMin = myBind(Math.min, Math, [undefined, 4, undefined, 5, undefined, 8, undefined, 9]);
console.log(chessMin(-1, -5, 3, 15)); 

let zeroPrompt = myBind(prompt, window, [undefined, "0"]);
let someNumber = zeroPrompt("Введіть число");
console.log(someNumber);

const bindedJoiner = myBind((...params) => params.join(''), null, [undefined, 'b', undefined, undefined, 'e', 'f']);
console.log(bindedJoiner('a', 'c', 'd')); 
console.log(bindedJoiner('1', '2', '3')); 

// checkResult

function checkResult(original, validator) {
    function wrapper(...params) {
        let result;
        do {
            result = original.apply(this, params);
        } while (!validator(result));
        return result;
    }
    return wrapper;
}

// numberPrompt: запрашивает число до тех пор, пока пользователь не введет корректное значение
const numberPrompt = checkResult(prompt, x => !isNaN(+x));
let number = +numberPrompt("Введіть число", "0");

// gamePrompt: запрашивает одно из указанных слов до тех пор, пока пользователь не введет корректное значение
const gamePrompt = checkResult(prompt, x => ['камінь', 'ножиці', 'папір'].includes(x.toLowerCase()));
const turn = gamePrompt("Введіть щось зі списку: 'камінь', 'ножиці', 'папір'");

// RandomHigh: возвращает случайное число от 0.5 до 1
const RandomHigh = checkResult(() => Math.random() * 0.5 + 0.5, x => x >= 0.5 && x <= 1);
const randomValue = RandomHigh();

// AlwaysSayYes: запрашивает подтверждение до тех пор, пока пользователь не согласится
const AlwaysSayYes = checkResult(() => confirm("Ви впевнені?"), x => x);
AlwaysSayYes();

// respectMe: запрашивает данные до тех пор, пока какое-либо из полей не заполнено
const respectMe = checkResult(() => {
    const name = prompt("Ваше ім'я");
    const age = prompt("Ваш вік");
    return name && age;
}, x => x);

respectMe();