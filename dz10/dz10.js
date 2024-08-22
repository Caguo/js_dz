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
   return input || "Все ясно";
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
      return `${surname} ${name} ${fatherName || ''}`.trim();
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

   function getName() {
      return name;
   }

   function setName(newName) {
      name = newName;
      return getName();
   }

   function getSurname() {
      return surname;
   }

   function setSurname(newSurname) {
      surname = newSurname;
      return getSurname();
   }

   function getFatherName() {
      return fatherName;
   }

   function setFatherName(newFatherName) {
      fatherName = newFatherName;
      return getFatherName();
   }

   return {
      getFullName,
      setFullName,
      getAge,  
      setAge,
      getName,
      setName,
      getSurname,
      setSurname,
      getFatherName,
      setFatherName
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

b.setName("Олена");
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

// personForm in html file

// getSetForm

function getSetForm(parent, getSet) {
   const inputs = {}; 

   const updateInputs = () => {
       for (const key in inputs) {
           const input = inputs[key];
           const getMethod = `get${key}`;
           if (typeof getSet[getMethod] === 'function') {
               input.value = getSet[getMethod]();
           }
       }
   };

   for (const method in getSet) {
       if (method.startsWith('get')) {
           const fieldName = method.slice(3); 
           const setMethod = `set${fieldName}`;
           
           if (!inputs[fieldName]) {
               const input = document.createElement('input');
               input.placeholder = fieldName;
               input.dataset.field = fieldName;
               input.dataset.type = fieldName === 'Age' ? 'number' : 'text';
               parent.appendChild(input);
               inputs[fieldName] = input;
               
               input.type = input.dataset.type;
               if (typeof getSet[method] === 'function') {
                   input.value = getSet[method]();
               }
               
               input.addEventListener('input', () => {
                   if (typeof getSet[setMethod] === 'function') {
                       const value = input.value;
                       const result = getSet[setMethod](value);
                       input.value = result; 
                       updateInputs(); 
                   }
               });
               
               if (typeof getSet[setMethod] !== 'function') {
                   input.disabled = true;
               }
           }
       }
   }

   updateInputs();
}


let car;
{
   let brand = 'BMW', model = 'X5', volume = 2.4;
   car = {
       getBrand() { return brand; },
       setBrand(newBrand) { if (newBrand && typeof newBrand === 'string') { brand = newBrand; } return brand; },
       getModel() { return model; },
       setModel(newModel) { if (newModel && typeof newModel === 'string') { model = newModel; } return model; },
       getVolume() { return volume; },
       setVolume(newVolume) { newVolume = +newVolume; if (newVolume && newVolume > 0 && newVolume < 20) { volume = newVolume; } return volume; },
       getTax() { return volume * 100; }
   };
}

function createPersonClosure(name, surname) {
   let personName = name;
   let personSurname = surname;
   let fatherName = '';
   let age = 0;

   function getFullName() {
       return `${personSurname} ${personName} ${fatherName || ''}`;
   }

   function setFullName(newFullName) {
       const parts = newFullName.split(' ');
       if (parts.length === 3) {
           [personSurname, personName, fatherName] = parts;
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

getSetForm(document.body, car);
getSetForm(document.body, createPersonClosure('Анон', 'Анонов'));