// fetch basic

const container = document.createElement('div');
container.id = 'tableContainer';
document.body.appendChild(container);

function displayAsTable(container, data) {

    let table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    let thead = document.createElement('thead');
    let headerRow = document.createElement('tr');

    for (let key in data) {
        let th = document.createElement('th');
        th.textContent = key;
        th.style.border = '1px solid #000';
        th.style.padding = '8px';
        headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);

    let tbody = document.createElement('tbody');
    let dataRow = document.createElement('tr');

    for (let key in data) {
        let td = document.createElement('td');
        td.textContent = data[key];
        td.style.border = '1px solid #000';
        td.style.padding = '8px';
        dataRow.appendChild(td);
    }
    tbody.appendChild(dataRow);
    table.appendChild(tbody);

    container.innerHTML = '';
    container.appendChild(table);
}

fetch('https://swapi.dev/api/people/1/')
    .then(res => res.json())
    .then(luke => displayAsTable(document.getElementById('tableContainer'), luke))
    .catch(error => console.error('Error:', error));

// fetch improved

const container = document.createElement('div');
container.id = 'tableContainer';
document.body.appendChild(container);

function displayAsTable(container, data) {
    let table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    let thead = document.createElement('thead');
    let headerRow = document.createElement('tr');

    for (let key in data) {
        let th = document.createElement('th');
        th.textContent = key;
        th.style.border = '1px solid #000';
        th.style.padding = '8px';
        th.style.textAlign = 'left';
        headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);

    let tbody = document.createElement('tbody');
    let dataRow = document.createElement('tr');

    for (let key in data) {
        let td = document.createElement('td');
        td.style.border = '1px solid #000';
        td.style.padding = '8px';

        if (typeof data[key] === 'string' && data[key].startsWith('https://swapi.dev/api/')) {
            let button = createButton(data[key]);
            td.appendChild(button);
        } else if (Array.isArray(data[key])) {
            data[key].forEach(item => {
                if (typeof item === 'string' && item.startsWith('https://swapi.dev/api/')) {
                    let button = createButton(item);
                    td.appendChild(button);
                } else {
                    td.appendChild(document.createTextNode(item + ' '));
                }
            });
        } else {
            td.textContent = data[key];
        }

        dataRow.appendChild(td);
    }
    tbody.appendChild(dataRow);
    table.appendChild(tbody);

    container.innerHTML = '';
    container.appendChild(table);
}

function createButton(url) {
    let button = document.createElement('button');
    button.textContent = 'Load Data';
    button.style.margin = '2px';
    button.onclick = () => {
        fetch(url)
            .then(res => res.json())
            .then(data => displayAsTable(button.parentElement, data))
            .catch(error => console.error('Error:', error));
    };
    return button;
}

fetch('https://swapi.dev/api/people/1/')
    .then(res => res.json())
    .then(luke => displayAsTable(document.getElementById('tableContainer'), luke))
    .catch(error => console.error('Error:', error));

// race

function delay(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchData(url) {
   return fetch(url)
       .then(response => response.json())
       .catch(error => console.error('Error:', error));
}

const apiUrl = 'https://swapi.dev/api/people/1/';

const delayTime = Math.floor(Math.random() * 5000) + 1000; // Задержка от 1 до 6 секунд

console.log(`Delay time: ${delayTime} ms`);

Promise.race([
   fetchData(apiUrl),
   delay(delayTime).then(() => 'Delay completed')
])
   .then(result => {
       if (result === 'Delay completed') {
           console.log('Delay was faster than fetch.');
       } else {
           console.log('Fetch was faster than delay.');
       }
});

// Promisify: confirm

function confirmPromise(text) {
   return new Promise((resolve, reject) => {
       const result = confirm(text);
       if (result) {
           resolve(); 
       } else {
           reject(); 
       }
   });
}

confirmPromise('Проміси це складно?')
   .then(() => console.log('не так вже й складно'))
   .catch(() => console.log('respect за посидючість і уважність'));

// Promisify: prompt

function promptPromise(text) {
   return new Promise((resolve, reject) => {
       const result = prompt(text);
       if (result !== null) {
           resolve(result); 
       } else {
           reject(); 
       }
   });
}

promptPromise("Як тебе звуть?")
   .then(name => console.log(`Тебе звуть ${name}`))
   .catch(() => console.log('Ну навіщо морозитися, нормально ж спілкувалися'));

// Promisify: LoginForm

function loginPromise(parent) {
   return new Promise((resolve, reject) => {
       const form = new LoginForm(parent);

       form.onLogin = (login, password) => {
           resolve({ login, password }); 
       };

       form.onCancel = () => {
           reject('User cancelled the login process'); 
       };
   });
}

loginPromise(document.body)
   .then(({ login, password }) => console.log(`Ви ввели ${login} та ${password}`))
   .catch(error => console.log(error));

function LoginForm(parent) {
   const form = document.createElement('form');
   const loginInput = document.createElement('input');
   const passwordInput = document.createElement('input');
   const loginButton = document.createElement('button');
   const cancelButton = document.createElement('button');

   loginInput.type = 'text';
   loginInput.placeholder = 'Login';
   passwordInput.type = 'password';
   passwordInput.placeholder = 'Password';
   loginButton.textContent = 'Login';
   cancelButton.textContent = 'Cancel';

   form.appendChild(loginInput);
   form.appendChild(passwordInput);
   form.appendChild(loginButton);
   form.appendChild(cancelButton);
   
   parent.appendChild(form);

   loginButton.addEventListener('click', (event) => {
       event.preventDefault(); 
       if (this.onLogin) {
           this.onLogin(loginInput.value, passwordInput.value);
       }
   });

   cancelButton.addEventListener('click', (event) => {
       event.preventDefault(); 
       if (this.onCancel) {
           this.onCancel();
       }
   });

   this.onLogin = null;
   this.onCancel = null;
}
