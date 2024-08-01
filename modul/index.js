function createStore(reducer){
   let state       = reducer(undefined, {}) //стартовая инициализация состояния, запуск редьюсера со state === undefined
   let cbs         = []                     //массив подписчиков
   
   const getState  = () => state            //функция, возвращающая переменную из замыкания
   const subscribe = cb => (cbs.push(cb),   //запоминаем подписчиков в массиве
                            () => cbs = cbs.filter(c => c !== cb)) //возвращаем функцию unsubscribe, которая удаляет подписчика из списка
                            
   const dispatch  = action => { 
       if (typeof action === 'function'){ //если action - не объект, а функция
           return action(dispatch, getState) //запускаем эту функцию и даем ей dispatch и getState для работы
       }
       const newState = reducer(state, action) //пробуем запустить редьюсер
       if (newState !== state){ //проверяем, смог ли редьюсер обработать action
           state = newState //если смог, то обновляем state 
           for (let cb of cbs)  cb(state) //и запускаем подписчиков
       }
   }
   
   return {
       getState, //добавление функции getState в результирующий объект
       dispatch,
       subscribe //добавление subscribe в объект
   }
};

const actionPromise = (promiseName, promise) => async (dispatch) => {
    dispatch(actionPending(promiseName));
    try{
        const payload = await promise;
        dispatch(actionFulfilled(promiseName, payload));
        return payload;
    } catch (error) {
        dispatch(actionRejected(promiseName, error));
    }
};

const actionPending = (promiseName) =>({
    type: "PROMISE",
    status: "PENDING",
    promiseName,
});

const actionFulfilled = (promiseName, payload) =>({
    type: "PROMISE",
    status: "FULFILLED",
    payload,
    promiseName,
});

const actionRejected = (promiseName, error) =>({
    type: "PROMISE",
    status: "REJECTED",
    error,
    promiseName,
});

const promiseReducer = (
    state = {},
    {type, status, payload, error, promiseName}) => {
    if (type === 'PROMISE') {
        return {
            ...state,
            [promiseName]: { status, payload, error }
        };
    }
    return state;
};

function getGQL(endpoint) {
    function gql(query, variables = {}) {
        return fetch(`${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                ...(store.getState().auth.token ? {authorization: "Bearer " + store.getState().auth.token} : {})
            },
            body: JSON.stringify({ query, variables }),
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
                throw new Error();
            })
            .then((data) => {
                if (!data.data && data.errors){
                    throw new Error( JSON.stringify(data.errors));
                }
                return Object.values(data.data)[0];
            })
    }
    return gql;
};

const endpoint = "http://shop-roles.node.ed.asmer.org.ua/";
const gql = getGQL(endpoint + "graphql");

// gql

const actionRootCategories = () =>
    actionPromise(
        "rootCats",
        gql(
            `query categories{
            CategoryFind(query:"[{\\"parent\\":null}]"){
            name _id
            }
        }`
        )
);

const actionOneCategory = (_id) =>
actionPromise(
    "oneCat",
    gql(
        `query category($q: String) {
            CategoryFindOne(query: $q) {
                name
                goods {
                _id
                name
                price
                images {
                    url
                }
                }
                subCategories {
                    name
                }
            }
        }`,
        { q: JSON.stringify([{ _id }]) }
    )
);

const actionOneGood = (_id) =>
actionPromise(
    "oneGood",
    gql(
        `query good($q: String) {
            GoodFindOne(query: $q) {
                name
                _id
                price
                description
                images {
                    url
                }
            }
        }`,
        { q: JSON.stringify([{ _id }]) }
    )
);

const actionRegister = (login, password) =>
    actionPromise("register", gql(
        `mutation newUser($login: String!, $password: String!) {
            UserUpsert(user: { login: $login, password: $password }) {
                _id
                login
            }
        }`,
        { login, password }
    )
);

const actionLogin = (login, password) =>
    actionPromise("login", gql(
        `query login($login: String!, $password: String!) {
            login(login: $login, password: $password)
        }`,
        { login, password }
    )
);

const actionFullOrder = () =>
    async (dispatch, getState) => {
        const { cart } = getState()
        const orderGoods = (Object.values(cart).map(({count, good: {_id}}) => ({count, good: {_id}})))

        const response = await dispatch(actionNewOrder(orderGoods))
        console.log(response)
        if (response){
            dispatch(actionCartClear())
        }
};

const actionNewOrder = (orderGoods) =>
    actionPromise ("newOrder", gql(
        `mutation newOrder ($orderGoods: [OrderGoodInput]){
            OrderUpsert(order: {
                orderGoods: $orderGoods
            }) {
                _id    
            }
        }`,
        { orderGoods }
    )
);

const actionOrderHistory = () =>
    actionPromise("orderHistory", gql(
        `query orders{
            OrderFind(query: "[{}]"){
                total
                orderGoods{
                    good{
                        _id
                        name
                    }
                    price
                    count
                    total
                }
            }
        }`
    )
);

function combineReducers(reducers){
   function totalReducer(state={}, action){
       const newTotalState = {}
       for (const [reducerName, reducer] of Object.entries(reducers)){
           const newSubState = reducer(state[reducerName], action)
           if (newSubState !== state[reducerName]){
               newTotalState[reducerName] = newSubState
           }
       }
       if (Object.keys(newTotalState).length){
           return {...state, ...newTotalState}
       }
       return state
   }

   return totalReducer
};

const reducers = {
   promise: promiseReducer, //допилить много имен для многих промисо
   auth: authReducer,     //часть предыдущего ДЗ
   cart: localStoredReducer(cartReducer, "cart"),  //часть предыдущего ДЗ
};


const totalReducer = combineReducers(reducers) 
const store = createStore(totalReducer)
store.subscribe(()=>console.log(store.getState()))

const actionSomePeople = () => 
actionPromise(
    "people",
    fetch(`https://swapi.dev/api/people/`).then(res => res.json())
);

// store.dispatch(actionSomePeople());
store.dispatch(actionRootCategories());

store.subscribe(() => {
    const {status, payload, error} = store.getState().promise.rootCats || {}; //.имя третье
    if (status === 'FULFILLED' && payload){
        aside.innerHTML = '';
        for (const { _id, name} of payload){
            aside.innerHTML += `<a href="#/category/${_id}">${name}</a>`;
        }
    }
});

// History

const drawOrderHistory = () => {
    const [, route] = location.hash.split('/');
    if (route !== 'orderHistory') return;

    const main = document.getElementById('main');
    if (!main) return;

    main.innerHTML = "<h1>История заказов</h1>";

    const { status, payload, error } = store.getState().promise.orderHistory || {};
    const user = store.getState().auth.user || {};  
    const userName = user.login || 'Неизвестный пользователь';

    if (status === 'PENDING') {
        main.innerHTML += `<img src='https://cdn.dribbble.com/users/63485/screenshots/1309731/infinite-gif-preloader.gif' />`;
    } else if (status === 'FULFILLED') {
        if (!payload || payload.length === 0) {
            main.innerHTML += "<p>Заказы отсутствуют</p>";
        } else {
            payload.forEach(order => {
                let orderDate;
                if (order.createdAt) {
                    orderDate = new Date(order.createdAt);
                } else {
                    orderDate = new Date(); 
                }

                if (isNaN(orderDate.getTime())) {
                    console.error('Ошибка преобразования даты: Некорректное значение даты');
                    orderDate = new Date(); 
                }
                
                const formattedDate = orderDate.toISOString().replace('T', ' ').replace('Z', ' UTC');

                const orderSection = document.createElement("section");
                orderSection.innerHTML = `<h2>Заказ от ${userName}</h2>`;

                let totalPrice = 0;
                order.orderGoods.forEach(({ good, count, price }) => {
                    orderSection.innerHTML += `<p>Товар: ${good.name}, Количество: ${count}, Цена: ${price}</p>`;
                    totalPrice += count * price;
                });
                orderSection.innerHTML += `<p>Общая стоимость: ${totalPrice}</p>`;
                orderSection.innerHTML += `<p>Дата заказа: ${formattedDate}</p>`;
                main.appendChild(orderSection);
            });
        }
    } else if (status === 'REJECTED') {
        main.innerHTML += "<p>Ошибка загрузки данных: " + error + "</p>";
    }
};

store.subscribe(drawOrderHistory);



// Auth

const actionAuthLogin = token => ({ type: 'AUTH_LOGIN', token });
const actionAuthLogout = () => ({ type: 'AUTH_LOGOUT' });

function authReducer(state = {}, { type, token }) {
    if (type === "AUTH_LOGIN") {
        const decodedToken = jwtDecode(token);
        if (decodedToken) {
            return { token, user: decodedToken.sub };
        }
        return state;
    } else if (type === "AUTH_LOGOUT") {
        return {};
    }
    return state;
}

function jwtDecode(token) {
    try {
        if (typeof token !== "string") return undefined;
        const parts = token.split('.');
        if (parts.length !== 3) return undefined;
        const decodedBase64 = atob(parts[1]);
        return JSON.parse(decodedBase64);
    } catch (e) {
        return undefined;
    }
}

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsiaWQiOiI2Mzc3ZTEzM2I3NGUxZjVmMmVjMWMxMjUiLCJsb2dpbiI6InRlc3Q1IiwiYWNsIjpbIjYzNzdlMTMzYjc0ZTFmNWYyZWMxYzEyNSIsInVzZXIiXX0sImlhdCI6MTY2ODgxMjQ1OH0.t1eQlRwkcP7v9JxUPMo3dcGKprH-uy8ujukNI7xE3A0"
console.log(jwtDecode(token))

const userRegister = async (login, password) => {
    const result = await store.dispatch(actionRegister(login, password));
    if (result) {
        alert("Регистрация успешна");
        location.hash = "#/login";
    } else {
        alert("Ошибка регистрации");
    }
};

const userLogin = async (login, password) => {
    const result = await store.dispatch(actionLogin(login, password));
    if (result) {
        store.dispatch(actionAuthLogin(result));
        alert("Логин успешен");
        location.hash = "#/";
    } else {
        alert("Ошибка логина");
    }
};

const drawRegisterForm = () => {
    const [, route] = location.hash.split('/');
    if (route !== 'register') return;

    const main = document.getElementById('main');
    if (!main) return;

    main.innerHTML = `
        <h1>Регистрация</h1>
        <form id="registerForm">
            <label for="login">Логин:</label>
            <input type="text" id="login" name="login" required>
            <br>
            <label for="password">Пароль:</label>
            <input type="password" id="password" name="password" required>
            <br>
            <button type="submit">Зарегистрироваться</button>
        </form>
    `;

    document.getElementById('registerForm').onsubmit = async (e) => {
        e.preventDefault();
        const login = e.target.login.value;
        const password = e.target.password.value;
        await userRegister(login, password);
    };
};

store.subscribe(drawRegisterForm);

const drawLoginForm = () => {
    const [, route] = location.hash.split('/');
    if (route !== 'login') return;

    const main = document.getElementById('main');
    if (!main) return;

    main.innerHTML = `
        <h1>Логин</h1>
        <form id="loginForm">
            <label for="login">Логин:</label>
            <input type="text" id="login" name="login" required>
            <br>
            <label for="password">Пароль:</label>
            <input type="password" id="password" name="password" required>
            <br>
            <button type="submit">Войти</button>
        </form>
    `;

    document.getElementById('loginForm').onsubmit = async (e) => {
        e.preventDefault();
        const login = e.target.login.value;
        const password = e.target.password.value;
        await userLogin(login, password);
    };
};

store.subscribe(drawLoginForm);

function logout() {
    store.dispatch(actionAuthLogout());
    updateAuthState();
    location.hash = "#/";
}

function updateAuthState() {
    const { auth } = store.getState();
    const loginLink = document.getElementById("loginLink");
    const registerLink = document.getElementById("registerLink");
    const welcomeMessage = document.getElementById("welcomeMessage");
    const logoutButton = document.getElementById("logoutButton");

    if (auth.token) {
        loginLink.style.display = "none";
        registerLink.style.display = "none";
        welcomeMessage.style.display = "inline";
        welcomeMessage.innerText = `Добро пожаловать, ${auth.user.login}`;
        logoutButton.style.display = "inline";
    } else {
        loginLink.style.display = "inline";
        registerLink.style.display = "inline";
        welcomeMessage.style.display = "none";
        logoutButton.style.display = "none";
    }
}

store.subscribe(updateAuthState);



// cartReducer

function cartReducer(state = {}, {type, good, count}){
    if (type === "CART_ADD"){
        if (!state[good._id]){
            return {
                ...state,
                [good._id]: { good, count}
            };
        } else {
            return {
                ...state,
                [good._id]: { good, count: state[good._id].count + count}
            }
        }
    } else if (type === "CART_SUB"){
        if (state[good._id].count - count <= 0){
            const newState = {...state}
            delete newState [good._id];
            return newState
        }
        return{
            ...state,
            [good._id]: { good, count: state[good._id].count - count}
        }
    } else if (type === "CART_DEL"){
        const newState = { ...state };
        delete newState[good._id];
        return newState;
    } else if (type === "CART_SET"){
        if (count <= 0){
            const newState = {...state}
            delete newState [good._id];
            return newState
        }
        return { ...state, [good._id]: { good, count}}
    } else if (type === "CART_CLEAR"){
        return {}
    } else {
        return state
    }
};

const actionCartAdd = (good, count=1) => ({type: 'CART_ADD', count, good})
const actionCartSub = (good, count=1) => ({type: 'CART_SUB', count, good})
const actionCartDel = (good) => ({type: 'CART_DEL', good})
const actionCartSet = (good, count=1) => ({type: 'CART_SET', count, good})
const actionCartClear = () => ({type: 'CART_CLEAR'})

// subscribes

const drawCategory = () => {
    const [,route] = location.hash.split('/')
    if (route !== 'category') return

    const {status, payload, error} = store.getState().promise.oneCat || {}  //.имя другое
    if (status === 'PENDING'){
        main.innerHTML = `<img src='https://cdn.dribbble.com/users/63485/screenshots/1309731/infinite-gif-preloader.gif' />`
    }
    if (status === 'FULFILLED'){
        const {name, goods, subcategories} = payload
        main.innerHTML = `<h1>${name}</h1>`;
        //                  <section>ЖЫРНОСТЬ: ${mass}кг</section>
        //                  <section style="color: ${eye_color}">Цвет глаз</section>
        //                  `
        for (const good of goods){
            const {_id, name, price, images} = good
            main.innerHTML += `
            <section>
            <a style="margin-bottom: 20px; display: inline-block; font-size: 20px;" href="#/good/${_id}">${name}</a>
            <br>
            <img src="${endpoint}${images[0].url}"
            <br>
            <p style="font-size: 20px;"> Ціна = <strong>${price}</strong> грн </p>
            </section>`
        }
    }
};

store.subscribe(drawCategory)

const drawGood = () => {
    const [,route] = location.hash.split('/')
    if (route !== 'good') return

    const {status, payload, error} = store.getState().promise.oneGood || {}  //.имя другое
    if (status === 'PENDING'){
        main.innerHTML = `<img src='https://cdn.dribbble.com/users/63485/screenshots/1309731/infinite-gif-preloader.gif' />`
    }
    if (status === 'FULFILLED'){
        const {_id, name, price, description, images} = payload
        main.innerHTML = `<h1>${name}</h1>`;
        //                  <section>ЖЫРНОСТЬ: ${mass}кг</section>
        //                  <section style="color: ${eye_color}">Цвет глаз</section>
        //                  `
        // for (const good of goods){
            main.innerHTML += `
            <section>
            <h1>${name}</h1>
            <img src="${endpoint}${images[0].url}"
            <br>
            <p style="font-size: 18px;"> Ціна = <strong>${price}</strong> грн </p>
            <p style="font-size: 18px;">${description}</p>
            </section>`
        // }
        const button = document.createElement("button")
        button.innerHTML = "Додати до кошика"
        button.className = "button-cart";
        main.append(button)
        button.onclick = () => store.dispatch(actionCartAdd(payload)) 
    }
};


store.subscribe(drawGood)

const drawCart = () => {
    const [, route] = location.hash.split('/');
    if (route !== 'cart') return;

    const main = document.getElementById('main');
    if (!main) return;

    main.innerHTML = "";

    const cart = store.getState().cart;

    for (const { good, count} of Object.values(cart)){
        const {_id, name, price, images} = good
        const section = document.createElement("section")
        section.innerHTML += `<img src="${endpoint}${images[0].url}" max-height="50px">`
        section.style = "font-size:20px"
        main.append(section)
        const divGood = document.createElement("div")
        section.append(divGood)
        divGood.innerHTML = `<a href="#/good/${_id}">${name}</a>
        <br>
        <strong"> Ціна = ${price} грн </strong>`

        const buttonAdd = document.createElement("button")
        const inputCount = document.createElement("input")
        const buttonSub = document.createElement("button")
        const buttonDel = document.createElement("button")

        buttonAdd.innerHTML = "+"
        inputCount.type = "text"
        inputCount.value = `${count}`
        inputCount.style = "font-size: 15px; width: 30px;"
        buttonAdd.style = "font-size: 15px; margin-left: 5px" 
        buttonSub.style = "font-size: 15px;"
        buttonSub.innerHTML = "-"
        buttonDel.innerText = "Видалити"
        buttonDel.style = "font-size: 15px; margin-left: 10px"

        divGood.append(buttonAdd)
        divGood.append(inputCount)
        divGood.append(buttonSub)
        divGood.append(buttonDel)

        inputCount.onchange =
        inputCount.oninput =
        buttonAdd.onclick = () => store.dispatch(actionCartAdd(good))
        inputCount.onchange =
        inputCount.oninput =
        buttonSub.onclick = () => store.dispatch(actionCartSub(good))
        buttonDel.onclick = () => store.dispatch(actionCartDel(good))
    }

    const buttonOrder = document.createElement("button")
    buttonOrder.innerHTML = "Оформити замовлення"
    buttonOrder.style = "margin: 20px 20px 0 0; font-size: 15px"
    main.append(buttonOrder)
    buttonOrder.onclick = () => store.dispatch(actionFullOrder())

    const buttonClear = document.createElement("button")
    buttonClear.innerHTML = "Очистити кошик"
    buttonClear.style = "font-size: 15px"
    main.append(buttonClear)
    buttonClear.onclick = () => store.dispatch(actionCartClear())
};

store.subscribe(drawCart);

function updateCartCounter() {
    const cartCounter = document.getElementById('cartCounter');
    const cart = store.getState().cart;
    const totalItems = Object.values(cart).reduce((acc, { count }) => acc + count, 0);
    
    if (totalItems > 0) {
        cartCounter.textContent = totalItems;
        cartCounter.style.display = 'inline';
    } else {
        cartCounter.style.display = 'none';
    }
}

store.subscribe(updateCartCounter);


function localStoredReducer(originalReducer, localStorageKey){
    function wrapper(state, action){
        if (state === undefined){
            try{
                return JSON.parse(localStorage[localStorageKey])
            } catch {}
        }

        const newState = originalReducer(state, action)
        localStorage[localStorageKey] = JSON.stringify(newState)
        return originalReducer(state, action)
    }
    
    return wrapper
};

window.onhashchange = () => {
    const [, route, _id] = location.hash.split('/');

    const routes = {
        category() {
            store.dispatch(actionOneCategory(_id));
        },
        good() {
            store.dispatch(actionOneGood(_id));
        },
        login() {
            drawLoginForm()
        },
        register() {
            drawRegisterForm();
        },
        cart() {
            drawCart();
        },
        orderHistory() {
            store.dispatch(actionOrderHistory()); 
            drawOrderHistory(); 
        },
    };

    if (route in routes) {
        routes[route]();
    }
};

window.onhashchange();