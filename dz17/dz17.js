function createStore(reducer) {
   let state = reducer(undefined, {});
   let cbs = [];

   const getState = () => state;
   const subscribe = cb => {
       cbs.push(cb);
       return () => cbs = cbs.filter(c => c !== cb);
   };
   const dispatch = action => {
       const newState = reducer(state, action);
       if (newState !== state) {
           state = newState;
           for (let cb of cbs) cb();
       }
   };

   return {
       getState,
       dispatch,
       subscribe
   };
}

const initialState = {
   items: {
       пиво: { quantity: 100, price: 45.00 }, // Цена в гривнах
       чіпси: { quantity: 100, price: 20.00 }, // Цена в гривнах
       сіги: { quantity: 100, price: 90.00 } // Цена в гривнах
   },
   cashRegister: 0
};

function reducer(state, action) {
   if (!state) return initialState;

   switch (action.type) {
       case 'BUY':
           const item = state.items[action.item];
           if (!item) return state;

           if (item.quantity < action.quantity) {
               console.error(`Недостаточно ${action.item} на складе`);
               return state;
           }

           const totalCost = item.price * action.quantity;
           if (action.money < totalCost) {
               alert('Недостаточно денег для совершения покупки.');
               return state;
           }

           const change = action.money - totalCost;

           return {
               ...state,
               items: {
                   ...state.items,
                   [action.item]: {
                       ...item,
                       quantity: item.quantity - action.quantity
                   }
               },
               cashRegister: state.cashRegister + totalCost,
               change // Добавляем сдачу в состояние
           };

       default:
           return state;
   }
}

const store = createStore(reducer);

function render() {
   const state = store.getState();
   const itemsDiv = document.getElementById('items');
   const productSelect = document.getElementById('product');
   const statusDiv = document.getElementById('status');
   let options = '';

   for (const [item, { quantity, price }] of Object.entries(state.items)) {
       options += `<option value="${item}">${item}</option>`;
   }

   itemsDiv.innerHTML = `
       <h2>Товары</h2>
       <ul>
           ${Object.entries(state.items).map(([item, { quantity, price }]) => 
               `<li>${item}: ${quantity} (Цена: ${price.toFixed(2)} грн)</li>`
           ).join('')}
       </ul>
   `;

   productSelect.innerHTML = options;
   statusDiv.textContent = `Касса: ${state.cashRegister.toFixed(2)} грн`;
   document.title = `Касса: ${state.cashRegister.toFixed(2)} грн`;
}

document.getElementById('buy').addEventListener('click', () => {
   const product = document.getElementById('product').value;
   const quantity = parseInt(document.getElementById('quantity').value, 10);
   const money = parseFloat(document.getElementById('money').value);

   store.dispatch({
       type: 'BUY',
       item: product,
       quantity,
       money
   });

   const state = store.getState();
   const item = state.items[product];
   const totalCost = item ? item.price * quantity : 0;
   const change = money - totalCost;

   if (change >= 0) {
       console.log(`Попытка купить ${quantity} ${product} на сумму ${money.toFixed(2)} грн. Сдача: ${change.toFixed(2)} грн`);
   } else {
       console.log(`Попытка купить ${quantity} ${product} на сумму ${money.toFixed(2)} грн`);
   }
});

store.subscribe(render);
render();