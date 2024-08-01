// Person Constructor

function Person(name, surname) {
   this.name = name;
   this.surname = surname;
   this.fatherName = '';
   
   this.getFullName = function() {
       return this.fatherName ? `${this.name} ${this.fatherName} ${this.surname}` : `${this.name} ${this.surname}`;
   };
   
   this.setFullName = function(newFullName) {
       const parts = newFullName.split(' ');
       if (parts.length === 3) {
           this.name = parts[0];
           this.fatherName = parts[1];
           this.surname = parts[2];
       } else if (parts.length === 2) {
           this.name = parts[0];
           this.surname = parts[1];
           this.fatherName = '';
       }
       return this.getFullName();
   };
   
   this.setFatherName = function(newFatherName) {
       if (typeof newFatherName === 'string' && newFatherName.length > 0) {
           this.fatherName = newFatherName;
       }
       return this.fatherName;
   };
}

const a = new Person("Вася", "Пупкін");
const b = new Person("Ганна", "Іванова");
const c = new Person("Єлизавета", "Петрова");

console.log(a.getFullName()); // Вася Пупкін
a.setFatherName('Іванович');
console.log(a.getFullName()); // Вася Іванович Пупкін

console.log(b.getFullName()); // Ганна Іванова


// Person Prototype

function Person(name, surname) {
   this.name = name;
   this.surname = surname;
   this.fatherName = '';
}

Person.prototype.getFullName = function() {
   return this.fatherName ? `${this.name} ${this.fatherName} ${this.surname}` : `${this.name} ${this.surname}`;
};

Person.prototype.setFullName = function(newFullName) {
   const parts = newFullName.split(' ');
   if (parts.length === 3) {
       this.name = parts[0];
       this.fatherName = parts[1];
       this.surname = parts[2];
   } else if (parts.length === 2) {
       this.name = parts[0];
       this.surname = parts[1];
       this.fatherName = '';
   }
   return this.getFullName();
};

Person.prototype.setFatherName = function(newFatherName) {
   if (typeof newFatherName === 'string' && newFatherName.length > 0) {
       this.fatherName = newFatherName;
   }
   return this.fatherName;
};

const a = new Person("Вася", "Пупкін");
const b = new Person("Ганна", "Іванова");
const c = new Person("Єлизавета", "Петрова");

console.log(a.getFullName()); // Вася Пупкін
a.setFatherName('Іванович');
console.log(a.getFullName()); // Вася Іванович Пупкін

console.log(b.getFullName()); // Ганна Іванова

// Password

function Password(parent, open) {
   const passwordInput = document.createElement('input');
   passwordInput.type = 'password'; // Починаємо з типу 'password' для приховання тексту

   const toggleVisibility = document.createElement('input');
   toggleVisibility.type = 'checkbox';
   toggleVisibility.checked = open; // Встановлюємо стартовий стан відкритості пароля

   toggleVisibility.addEventListener('change', () => {
      passwordInput.type = toggleVisibility.checked ? 'text' : 'password';
   });

   parent.appendChild(passwordInput);
   parent.appendChild(toggleVisibility);

   this.setValue = function(value) {
      passwordInput.value = value;
   };

   this.getValue = function() {
      return passwordInput.value;
   };

   this.setOpen = function(isOpen) {
      toggleVisibility.checked = isOpen;
      passwordInput.type = isOpen ? 'text' : 'password';
   };

   this.getOpen = function() {
      return toggleVisibility.checked;
   };
}

// Приклад використання
let p = new Password(document.body, true);

p.setValue('qwerty');
console.log(p.getValue());

p.setOpen(false);
console.log(p.getOpen());

// LoginForm

function Password(parent, open) {
   const passwordInput = document.createElement('input');
   passwordInput.type = 'password'; 

   const toggleVisibility = document.createElement('input');
   toggleVisibility.type = 'checkbox';
   toggleVisibility.checked = open; 

   toggleVisibility.addEventListener('change', () => {
       passwordInput.type = toggleVisibility.checked ? 'text' : 'password';
   });

   parent.appendChild(passwordInput);
   parent.appendChild(toggleVisibility);

   this.setValue = function(value) {
       passwordInput.value = value;
   };

   this.getValue = function() {
       return passwordInput.value;
   };

   this.setOpen = function(isOpen) {
       toggleVisibility.checked = isOpen;
       passwordInput.type = isOpen ? 'text' : 'password';
   };

   this.getOpen = function() {
       return toggleVisibility.checked;
   };
}

const loginForm = document.createElement('form');
document.body.appendChild(loginForm);

const loginInput = document.createElement('input');
loginInput.type = 'text';
loginInput.placeholder = 'Логін';
loginForm.appendChild(loginInput);

const password = new Password(loginForm, false);

const submitButton = document.createElement('button');
submitButton.textContent = 'Увійти';
loginForm.appendChild(submitButton);

loginForm.addEventListener('input', () => {
   const loginValue = loginInput.value.trim();
   const passwordValue = password.getValue().trim();
   submitButton.disabled = loginValue === '' || passwordValue === '';
});

loginForm.addEventListener('submit', (event) => {
   event.preventDefault();
   alert(`Логін: ${loginInput.value}\nПароль: ${password.getValue()}`);
});
