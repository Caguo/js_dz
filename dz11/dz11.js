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
       let defaultIndex = 0;

       for (let i = 0; i < defaults.length; i++) {
           if (defaults[i] === undefined) {
               mergedArgs.push(args.shift());
           } else {
               mergedArgs.push(defaults[i]);
               defaultIndex++;
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
