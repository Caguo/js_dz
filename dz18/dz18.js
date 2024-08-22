// Світлофор
// Stage 1

const delay = ms => new Promise(ok => setTimeout(() => ok(ms), ms));

async function trafficLight() {
    while (true) {
        // Включаємо зелений
        console.log("Зеленый свет");
        await delay(3000); 
        
        // Включаем желтый
        console.log("Желтый свет");
        await delay(1000); 
        
        // Включаем красный
        console.log("Красный свет");
        await delay(2000); 
    }
}

trafficLight();

// Stage 2

const delay = ms => new Promise(ok => setTimeout(() => ok(ms), ms));

async function trafficLight(element, greenTime, yellowTime, redTime) {
    while (true) {
        // Включаем зеленый
        element.style.backgroundColor = 'green';
        console.log("Зеленый свет");
        await delay(greenTime);

        // Включаем желтый
        element.style.backgroundColor = 'yellow';
        console.log("Желтый свет");
        await delay(yellowTime);

        // Включаем красный
        element.style.backgroundColor = 'red';
        console.log("Красный свет");
        await delay(redTime);
    }
}

let trafficLightElement = document.getElementById('traffic-light');
if (!trafficLightElement) {
    trafficLightElement = document.createElement('div');
    trafficLightElement.id = 'traffic-light';
    trafficLightElement.style.width = '100px';
    trafficLightElement.style.height = '100px';
    document.body.appendChild(trafficLightElement);
}

trafficLight(trafficLightElement, 3000, 1000, 2000);

// PedestrianTrafficLight
// Stage 1

const delay = ms => new Promise(ok => setTimeout(() => ok(ms), ms));

async function pedestrianTrafficLight() {
    // Создаем и добавляем элемент для отображения светофора
    const lightElement = document.createElement('div');
    lightElement.id = 'pedestrian-light';
    lightElement.style.width = '100px';
    lightElement.style.height = '100px';
    lightElement.style.backgroundColor = 'black';
    lightElement.style.position = 'relative';
    document.body.appendChild(lightElement);

    const colors = ['red', 'green'];
    const lightStyles = colors.map(color => {
        const div = document.createElement('div');
        div.style.width = '100%';
        div.style.height = '50%';
        div.style.position = 'absolute';
        div.style.bottom = color === 'red' ? '50%' : '0';
        div.style.backgroundColor = color;
        lightElement.appendChild(div);
        return div;
    });

    while (true) {
        // Включаем зеленый
        lightStyles[1].style.opacity = '1';
        lightStyles[0].style.opacity = '0.3';
        await delay(5000); // Зеленый свет

        // Включаем красный
        lightStyles[1].style.opacity = '0.3';
        lightStyles[0].style.opacity = '1';
        await delay(5000); // Красный свет
    }
}

pedestrianTrafficLight();

// Stage 2

const delay = ms => new Promise(ok => setTimeout(() => ok(ms), ms));
const domEventPromise = (element, eventName) => 
    new Promise(resolve => element.addEventListener(eventName, resolve, { once: true }));

async function pedestrianTrafficLight(button) {
    const lightElement = document.createElement('div');
    lightElement.id = 'pedestrian-light';
    lightElement.style.width = '100px';
    lightElement.style.height = '100px';
    lightElement.style.backgroundColor = 'black';
    lightElement.style.position = 'relative';
    document.body.appendChild(lightElement);

    const colors = ['red', 'green'];
    const lightStyles = colors.map((color, index) => {
        const div = document.createElement('div');
        div.style.width = '100%';
        div.style.height = '50%';
        div.style.position = 'absolute';
        div.style.bottom = index === 0 ? '50%' : '0';
        div.style.backgroundColor = color;
        lightElement.appendChild(div);
        return div;
    });

    while (true) {
        lightStyles[1].style.opacity = '1';
        lightStyles[0].style.opacity = '0.3';
        await delay(5000); 

        await Promise.race([
            domEventPromise(button, 'click'),
            delay(5000) 
        ]);

        // Включаем красный
        lightStyles[1].style.opacity = '0.3';
        lightStyles[0].style.opacity = '1';
        await delay(5000); 
    }
}

// Создаем и добавляем кнопку
const pedestrianButton = document.createElement('button');
pedestrianButton.id = 'pedestrian-button';
pedestrianButton.textContent = 'Press Me';
pedestrianButton.style.display = 'block';
pedestrianButton.style.margin = '20px';
document.body.appendChild(pedestrianButton);

pedestrianTrafficLight(pedestrianButton);


// Stage 3

const delay = ms => new Promise(ok => setTimeout(() => ok(ms), ms));
const domEventPromise = (element, eventName) => 
    new Promise(resolve => element.addEventListener(eventName, resolve, { once: true }));

async function pedestrianTrafficLight(button) {
    // Создаем и добавляем элемент для отображения светофора
    const lightElement = document.createElement('div');
    lightElement.id = 'pedestrian-light';
    lightElement.style.width = '100px';
    lightElement.style.height = '100px';
    lightElement.style.backgroundColor = 'black';
    lightElement.style.position = 'relative';
    document.body.appendChild(lightElement);

    const colors = ['red', 'green'];
    const lightStyles = colors.map((color, index) => {
        const div = document.createElement('div');
        div.style.width = '100%';
        div.style.height = '50%';
        div.style.position = 'absolute';
        div.style.bottom = index === 0 ? '50%' : '0';
        div.style.backgroundColor = color;
        lightElement.appendChild(div);
        return div;
    });

    let buttonEnabled = false;

    async function waitForButtonPress() {
        // Добавляем задержку перед активацией кнопки
        if (!buttonEnabled) {
            await delay(5000); // Задержка перед активацией кнопки (5 секунд)
            buttonEnabled = true;
        }
        // Ожидание нажатия кнопки или истечения времени
        await Promise.race([
            domEventPromise(button, 'click'),
            delay(5000) // Время до автоматического переключения
        ]);
    }

    while (true) {
        // Включаем зеленый
        lightStyles[1].style.opacity = '1';
        lightStyles[0].style.opacity = '0.3';
        await delay(5000);

        await waitForButtonPress();

        // Включаем красный
        lightStyles[1].style.opacity = '0.3';
        lightStyles[0].style.opacity = '1';
        await delay(5000); 
    }
}

const pedestrianButton = document.createElement('button');
pedestrianButton.id = 'pedestrian-button';
pedestrianButton.textContent = 'Press Me';
pedestrianButton.style.display = 'block';
pedestrianButton.style.margin = '20px';
document.body.appendChild(pedestrianButton);

pedestrianTrafficLight(pedestrianButton);

// speedtest

const delay = ms => new Promise(ok => setTimeout(ok, ms));

async function speedtest(getPromise, count, parallel = 1) {
    const startTime = Date.now(); 

    for (let i = 0; i < count; i++) {
        const promises = [];
        for (let j = 0; j < parallel; j++) {
            promises.push(getPromise());
        }
        await Promise.all(promises); 
    }

    const duration = Date.now() - startTime; 
    const queryDuration = duration / count;
    const querySpeed = 1 / queryDuration; 
    const parallelSpeed = (count * parallel) / duration; 
    const parallelDuration = queryDuration / parallel; 

    return {
        duration,
        querySpeed,
        queryDuration,
        parallelSpeed,
        parallelDuration
    };
}

speedtest(() => delay(1000), 10, 10).then(result => console.log(result));
speedtest(() => fetch('http://swapi.dev/api/people/1').then(res => res.json()), 10, 5).then(result => console.log(result));


// gql

async function gql(endpoint, query, variables = {}) {
   const response = await fetch(endpoint, {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json',
           'Accept': 'application/json'
       },
       body: JSON.stringify({ query, variables })
   });

   const result = await response.json();
   return result.data; 
}

(async () => {
   const catQuery = `query cats($q: String){
       CategoryFind(query: $q){
           _id name
       }
   }`;

   const cats = await gql("http://shop-roles.node.ed.asmer.org.ua/graphql", catQuery, { q: "[{}]" });
   console.log(cats); 

   const loginQuery = `query login($login:String, $password:String){
       login(login:$login, password:$password)
   }`;

   const token = await gql("http://shop-roles.node.ed.asmer.org.ua/graphql", loginQuery, { login: "test457", password: "123123" });
   console.log(token); 
})();

// jwtDecode

function jwtDecode(token) {
   try {
       const parts = token.split('.');

       if (parts.length !== 3) {
           return undefined;
       }

       const payload = atob(parts[1]);

       return JSON.parse(payload);
   } catch (e) {
       return undefined;
   }
}

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsiaWQiOiI2MzIyMDVhZWI3NGUxZjVmMmVjMWEzMjAiLCJsb2dpbiI6InRlc3Q0NTciLCJhY2wiOlsiNjMyMjA1YWViNzRlMWY1ZjJlYzFhMzIwIiwidXNlciJdfSwiaWF0IjoxNjY4MjcyMTYzfQ.rxV1ki9G6LjT2IPWcqkMeTi_1K9sb3Si8vLB6UDAGdw";
console.log(jwtDecode(token)); 
// Вывод:
// {
//   "sub": {
//     "id": "632205aeb74e1f5f2ec1a320",
//     "login": "test457",
//     "acl": [
//       "632205aeb74e1f5f2ec1a320",
//       "user"
//     ]
//   },
//   "iat": 1668272163
// }

try {
   console.log(jwtDecode());         
   console.log(jwtDecode("дічь"));   
   console.log(jwtDecode("ey.ey.ey")); 
   
   console.log('до сюди допрацювало, а значить jwtDecode не матюкався в консоль червоним кольором');
} finally {
   console.log('ДЗ, мабуть, закінчено');
}

