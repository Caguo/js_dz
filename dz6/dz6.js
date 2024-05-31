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
