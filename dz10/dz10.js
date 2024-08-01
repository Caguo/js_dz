// Arrow to Functions
// Temperature

function yCel(a) {
   return a * 9 / 5 + 32;
}

function yFah(a) {
   return (a - 32) * 5 / 9;
}

// RGB

function yRGB(r, g, b) {
   return '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
}
 
// Credentials

function capitalize(str) {
   let result = str[0].toUpperCase() + str.slice(1).toLowerCase();
   return result;
}

function credentials() {
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

// New line

const lineText = prompt("Введіть текст:");

function yLine(text) {
   const sliceLineText = text.split('\\n');
   const resultLineText = sliceLineText.join('\n');
   return resultLineText;
}

const result = yLine(lineText);
console.log(result);


// Prompt OR

function yPrompt() {
   const input = prompt("Введіть текст");
   if (input) {
      return input;
   } else {
      console.log("Все ясно");
   }
}

alert(yPrompt());

// createPerson

function createPerson(name, surname) {
   return {
       name: name,
       surname: surname,
       getFullName: function() {
           if (this.fatherName) {
               return `${this.name} ${this.fatherName} ${this.surname}`;
           } else {
               return `${this.name} ${this.surname}`;
           }
       }
   };
}

const a = createPerson("Вася", "Пупкін");
const b = createPerson("Ганна", "Іванова");
const c = createPerson("Єлизавета", "Петрова");

console.log(a.getFullName()); 

a.fatherName = 'Іванович';
console.log(a.getFullName());

console.log(b.getFullName()); 

// createPersonClosure

function createPersonClosure(name, surname) {
   let fatherName;
   let age;

   function getFullName() {
      return `${surname} ${name} ${fatherName || ''}`;
   }

   function setFullName(newFullName) {
      const parts = newFullName.split(' ');
      if (parts.length === 3) {
         const [newSurname, newName, newFatherName] = parts;
         surname = newSurname;
         name = newName;
         fatherName = newFatherName;
      }
      return getFullName();
   }

   function getAge() {
      return age;
   }

   function setAge(newAge) {
      if (typeof newAge === 'number' && newAge >= 0 && newAge <= 100) {
         age = newAge;
      }
      return getAge();
   }

   return {
      getFullName,
      setFullName,
      getAge,  
      setAge
   };
}

const a = createPersonClosure("Вася", "Пупкін");
const b = createPersonClosure("Ганна", "Іванова");

console.log(a.getFullName()); 
a.setAge(15);
console.log(a.getAge()); 
a.setAge(150); 
console.log(a.getAge()); 

b.setFullName("Петрова Ганна Миколаївна");
console.log(b.getFullName()); 

// createPersonClosureDestruct

function createPerson(name, surname) {
   return { name, surname };
}

function createPersonClosureDestruct({ name = '', surname = '', fatherName = '', age = 0 } = {}) {
  function getFullName() {
     return `${surname} ${name} ${fatherName || ''}`;
  }

  function setFullName(newFullName) {
     const parts = newFullName.split(' ');
     if (parts.length === 3) {
        const [newSurname, newName, newFatherName] = parts;
        surname = newSurname;
        name = newName;
        fatherName = newFatherName;
     }
     return getFullName();
  }

  function getAge() {
     return age;
  }

  function setAge(newAge) {
     if (typeof newAge === 'number' && newAge >= 0 && newAge <= 100) {
        age = newAge;
     }
     return getAge();
  }

  return {
     getFullName,
     setFullName,
     getAge,
     setAge
  };
}

const a = createPersonClosureDestruct(createPerson("Вася", "Пупкін"));
const b = createPersonClosureDestruct({ name: 'Миколай', age: 75 });

console.log(a.getFullName()); 
a.setAge(15);
console.log(a.getAge()); 
a.setAge(150); 
console.log(a.getAge()); 

console.log(b.getFullName()); 
console.log(b.getAge()); 

// isSorted

function isSorted(...args) {
   if (args.length <= 1) {
       return true; 
   }

   for (let i = 1; i < args.length; i++) {
       if (typeof args[i] !== 'number' || args[i] <= args[i - 1]) {
           return false;
       }
   }

   return true;
}

// Test isSorted

function isSorted(...args) {
   if (args.length <= 1) {
       return true;
   }

   for (let i = 1; i < args.length; i++) {
       if (typeof args[i] !== 'number' || args[i] <= args[i - 1]) {
           return false;
       }
   }

   return true;
}

const inputArray = [];
for (let i = 1; i <= 5; i++) {
   const number = prompt(`Введіть число ${i}:`);
   inputArray.push(number);
}

console.log("Введений масив:", inputArray);
console.log("Чи впорядкований масив?", isSorted(...inputArray));
