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

// Store

function Store(initialState, reducer) {
    let state = initialState;
    const cbs = [];

    this.subscribe = function(callback) {
        cbs.push(callback);
        return function() {
            const index = cbs.indexOf(callback);
            if (index > -1) {
                cbs.splice(index, 1);
            }
        };
    };

    this.getState = function() {
        return state;
    };

    this.dispatch = function(action) {
        state = reducer(state, action);
        cbs.forEach(callback => callback());
    };
}

function reducer(state, action) {
    switch (action.type) {
        case 'INCREMENT':
            return { count: state.count + 1 };
        case 'DECREMENT':
            return { count: state.count - 1 };
        default:
            return state;
    }
}

const store = new Store({ count: 0 }, reducer);

const unsubscribe = store.subscribe(() => {
    console.log('State changed:', store.getState());
});

store.dispatch({ type: 'INCREMENT' });
store.dispatch({ type: 'DECREMENT' });

unsubscribe();

console.log('Final state:', store.getState());


// Password

function Password(parent, open, onChange, onOpenChange) {
    const passwordInput = document.createElement('input');
    passwordInput.type = 'password'; 

    const toggleVisibility = document.createElement('input');
    toggleVisibility.type = 'checkbox';
    toggleVisibility.checked = open; 

    toggleVisibility.addEventListener('change', () => {
        const isOpen = toggleVisibility.checked;
        passwordInput.type = isOpen ? 'text' : 'password';
        if (onOpenChange) {
            onOpenChange(isOpen);
        }
    });

    // Обработчик изменения значения пароля
    passwordInput.addEventListener('input', () => {
        if (onChange) {
            onChange(passwordInput.value);
        }
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

// LoginForm Constructor

function LoginForm(parent) {
    const form = document.createElement('form');
    const loginInput = document.createElement('input');
    const passwordInput = document.createElement('input');
    const toggleVisibility = document.createElement('input');
    const submitButton = document.createElement('button');

    loginInput.type = 'text';
    loginInput.placeholder = 'Логін';
    
    passwordInput.type = 'password';
    
    toggleVisibility.type = 'checkbox';
    toggleVisibility.checked = false; 

    submitButton.textContent = 'Увійти';

    form.appendChild(loginInput);
    form.appendChild(passwordInput);
    form.appendChild(toggleVisibility);
    form.appendChild(submitButton);

    parent.appendChild(form);

    this.setLoginValue = function(value) {
        loginInput.value = value;
    };

    this.getLoginValue = function() {
        return loginInput.value;
    };

    this.setPasswordValue = function(value) {
        passwordInput.value = value;
    };

    this.getPasswordValue = function() {
        return passwordInput.value;
    };

    this.setPasswordVisible = function(isVisible) {
        toggleVisibility.checked = isVisible;
        passwordInput.type = isVisible ? 'text' : 'password';
    };

    this.isPasswordVisible = function() {
        return toggleVisibility.checked;
    };

    toggleVisibility.addEventListener('change', () => {
        passwordInput.type = toggleVisibility.checked ? 'text' : 'password';
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        alert(`Логін: ${this.getLoginValue()}\nПароль: ${this.getPasswordValue()}`);
    });

    form.addEventListener('input', () => {
        const loginValue = this.getLoginValue().trim();
        const passwordValue = this.getPasswordValue().trim();
        submitButton.disabled = loginValue === '' || passwordValue === '';
    });
}

const loginForm = new LoginForm(document.body);

// Password Verify

function Password(parent, open, onChange, onOpenChange) {
    const passwordInput = document.createElement('input');
    passwordInput.type = 'password'; 

    const toggleVisibility = document.createElement('input');
    toggleVisibility.type = 'checkbox';
    toggleVisibility.checked = open; 

    toggleVisibility.addEventListener('change', () => {
        const isOpen = toggleVisibility.checked;
        passwordInput.type = isOpen ? 'text' : 'password';
        if (onOpenChange) {
            onOpenChange(isOpen);
        }
    });

    passwordInput.addEventListener('input', () => {
        if (onChange) {
            onChange(passwordInput.value);
        }
    });

    parent.appendChild(passwordInput);
    parent.appendChild(toggleVisibility);

    this.passwordInput = passwordInput; 
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

function PasswordChecker(parent) {
    const container = document.createElement('div');
    parent.appendChild(container);

    const password1 = new Password(container, false, updateMatching, updateOpenStatus);
    const password2 = document.createElement('input');
    password2.type = 'password';
    password2.style.borderColor = 'black'; 

    container.appendChild(password2);

    function updateMatching(value) {
        if (password2.value !== value) {
            password1.passwordInput.style.borderColor = 'red';
            password2.style.borderColor = 'red';
        } else {
            password1.passwordInput.style.borderColor = 'black';
            password2.style.borderColor = 'black';
        }
    }

    function updateOpenStatus(isOpen) {
        if (isOpen) {
            password2.style.display = 'none';
        } else {
            password2.style.display = 'block';
        }
    }

    password2.addEventListener('input', () => {
        updateMatching(password1.getValue());
    });
}

const passwordChecker = new PasswordChecker(document.body);
