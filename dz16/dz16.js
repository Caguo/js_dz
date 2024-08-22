// Store Class

class Store {
   #reducer;
   #state;
   #cbs = [];

   constructor(reducer) {
       this.#reducer = reducer;
       this.#state = this.#reducer(undefined, {}); 
   }

   getState() {
       return this.#state;
   }

   get state() {
       return this.#state;
   }

   subscribe(cb) {
       this.#cbs.push(cb);
       return () => {
           this.#cbs = this.#cbs.filter(c => c !== cb);
       };
   }

   dispatch(action) {
       const newState = this.#reducer(this.#state, action);
       if (newState !== this.#state) {
           this.#state = newState;
           for (let cb of this.#cbs) {
               cb();
           }
       }
   }
}

// Password Class

class Password {
   #passwordInput;
   #toggleVisibility;

   constructor(parent, open) {
       this.#passwordInput = document.createElement('input');
       this.#passwordInput.type = 'password';

       this.#toggleVisibility = document.createElement('input');
       this.#toggleVisibility.type = 'checkbox';
       this.#toggleVisibility.checked = open;

       this.#toggleVisibility.addEventListener('change', () => {
           this.#passwordInput.type = this.#toggleVisibility.checked ? 'text' : 'password';
       });

       parent.appendChild(this.#passwordInput);
       parent.appendChild(this.#toggleVisibility);

       this.setOpen(open); 
   }

   setValue(value) {
       this.#passwordInput.value = value;
   }

   getValue() {
       return this.#passwordInput.value;
   }

   setOpen(isOpen) {
       this.#toggleVisibility.checked = isOpen;
       this.#passwordInput.type = isOpen ? 'text' : 'password';
   }

   getOpen() {
       return this.#toggleVisibility.checked;
   }
}

let p = new Password(document.body, true);

p.setValue('qwerty');
console.log(p.getValue()); // 'qwerty'

p.setOpen(false);
console.log(p.getOpen()); // false

// StoreThunk Class

class Store {
   #reducer;
   #state;
   #cbs = [];

   constructor(reducer) {
       this.#reducer = reducer;
       this.#state = this.#reducer(undefined, {});
   }

   getState() {
       return this.#state;
   }

   get state() {
       return this.#state;
   }

   subscribe(cb) {
       this.#cbs.push(cb);
       return () => {
           this.#cbs = this.#cbs.filter(c => c !== cb);
       };
   }

   dispatch(action) {
       const newState = this.#reducer(this.#state, action);
       if (newState !== this.#state) {
           this.#state = newState;
           for (let cb of this.#cbs) {
               cb();
           }
       }
   }
}

class StoreThunk extends Store {
   constructor(reducer) {
       super(reducer);
       this.dispatch = this.dispatch.bind(this);
       this.getState = this.getState.bind(this);
   }

   dispatch(action) {
       if (typeof action === 'function') {
           return action(this.dispatch, this.getState);
       }
       return super.dispatch(action);
   }
}

const reducer = (state = 0, action) => {
   switch (action.type) {
       case 'INCREMENT':
           return state + 1;
       case 'DECREMENT':
           return state - 1;
       default:
           return state;
   }
};

const store = new StoreThunk(reducer);

store.subscribe(() => console.log(store.getState()));

store.dispatch({ type: 'INCREMENT' }); // 1

store.dispatch((dispatch, getState) => {
   if (getState() < 5) {
       dispatch({ type: 'INCREMENT' });
   }
});

// RGB Class

class RGB {
   #r = 0;
   #g = 0;
   #b = 0;

   constructor(r = 0, g = 0, b = 0) {
       this.r = r;
       this.g = g;
       this.b = b;
   }

   get r() {
       return this.#r;
   }

   set r(value) {
       if (typeof value !== 'number' || value < 0 || value > 255) {
           throw new RangeError('r must be a number between 0 and 255');
       }
       this.#r = value;
   }

   get g() {
       return this.#g;
   }

   set g(value) {
       if (typeof value !== 'number' || value < 0 || value > 255) {
           throw new RangeError('g must be a number between 0 and 255');
       }
       this.#g = value;
   }

   get b() {
       return this.#b;
   }

   set b(value) {
       if (typeof value !== 'number' || value < 0 || value > 255) {
           throw new RangeError('b must be a number between 0 and 255');
       }
       this.#b = value;
   }

   get rgb() {
       return `rgb(${this.#r}, ${this.#g}, ${this.#b})`;
   }

   set rgb(value) {
       const match = value.match(/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/);
       if (!match) {
           throw new SyntaxError('Invalid RGB format');
       }

       this.r = parseInt(match[1], 10);
       this.g = parseInt(match[2], 10);
       this.b = parseInt(match[3], 10);
   }

   get hex() {
       return `#${this.#toHex(this.#r)}${this.#toHex(this.#g)}${this.#toHex(this.#b)}`;
   }

   set hex(value) {
       const match = value.match(/^#([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/);
       if (!match) {
           throw new SyntaxError('Invalid HEX format');
       }

       this.r = parseInt(match[1], 16);
       this.g = parseInt(match[2], 16);
       this.b = parseInt(match[3], 16);
   }

   #toHex(value) {
       return value.toString(16).padStart(2, '0').toUpperCase();
   }
}

const rgb = new RGB();

rgb.r = 15;
rgb.g = 128;
rgb.b = 192;
console.log(rgb.hex); //#0F80C0
console.log(rgb.rgb); //rgb(15,128,192)

rgb.hex = '#2030FF';
console.log(rgb.rgb); //rgb(32, 48, 255)

rgb.rgb = 'rgb(100, 90, 50)';
console.log(rgb.r, rgb.g, rgb.b); //100, 90, 50

// RGBA Class

class RGB {
   #r = 0;
   #g = 0;
   #b = 0;

   constructor(r = 0, g = 0, b = 0) {
       this.r = r;
       this.g = g;
       this.b = b;
   }

   get r() {
       return this.#r;
   }

   set r(value) {
       if (typeof value !== 'number' || value < 0 || value > 255) {
           throw new RangeError('r must be a number between 0 and 255');
       }
       this.#r = value;
   }

   get g() {
       return this.#g;
   }

   set g(value) {
       if (typeof value !== 'number' || value < 0 || value > 255) {
           throw new RangeError('g must be a number between 0 and 255');
       }
       this.#g = value;
   }

   get b() {
       return this.#b;
   }

   set b(value) {
       if (typeof value !== 'number' || value < 0 || value > 255) {
           throw new RangeError('b must be a number between 0 and 255');
       }
       this.#b = value;
   }

   get rgb() {
       return `rgb(${this.#r}, ${this.#g}, ${this.#b})`;
   }

   set rgb(value) {
       const match = value.match(/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/);
       if (!match) {
           throw new SyntaxError('Invalid RGB format');
       }

       this.r = parseInt(match[1], 10);
       this.g = parseInt(match[2], 10);
       this.b = parseInt(match[3], 10);
   }

   get hex() {
       return `#${this.#toHex(this.#r)}${this.#toHex(this.#g)}${this.#toHex(this.#b)}`;
   }

   set hex(value) {
       const match = value.match(/^#([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/);
       if (!match) {
           throw new SyntaxError('Invalid HEX format');
       }

       this.r = parseInt(match[1], 16);
       this.g = parseInt(match[2], 16);
       this.b = parseInt(match[3], 16);
   }

   #toHex(value) {
       return value.toString(16).padStart(2, '0').toUpperCase();
   }
}

class RGBA extends RGB {
   #a = 1;

   constructor(r = 0, g = 0, b = 0, a = 1) {
       super(r, g, b);
       this.a = a;
   }

   get a() {
       return this.#a;
   }

   set a(value) {
       if (typeof value !== 'number' || value < 0 || value > 1) {
           throw new RangeError('a must be a number between 0 and 1');
       }
       this.#a = value;
   }

   get rgba() {
       return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.#a})`;
   }

   set rgba(value) {
       const match = value.match(/^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(0?\.\d+|1(\.0)?)\)$/);
       if (!match) {
           throw new SyntaxError('Invalid RGBA format');
       }

       this.r = parseInt(match[1], 10);
       this.g = parseInt(match[2], 10);
       this.b = parseInt(match[3], 10);
       this.a = parseFloat(match[4]);
   }

   get hex() {
       const alphaHex = Math.round(this.#a * 255).toString(16).padStart(2, '0').toUpperCase();
       return `#${super.hex.slice(1)}${alphaHex}`;
   }

   set hex(value) {
       const match = value.match(/^#([0-9A-Fa-f]{6})([0-9A-Fa-f]{2})?$/);
       if (!match) {
           throw new SyntaxError('Invalid HEX format');
       }

       super.hex = `#${match[1]}`;
       if (match[2]) {
           this.a = parseInt(match[2], 16) / 255;
       } else {
           this.a = 1; // якщо альфа відсутня, ставимо прозорість на максимум
       }
   }

   set color(value) {
       if (value.startsWith('rgba')) {
           this.rgba = value;
       } else if (value.startsWith('rgb')) {
           this.rgb = value;
       } else if (value.startsWith('#')) {
           this.hex = value;
       } else {
           throw new SyntaxError('Invalid color format');
       }
   }
}

const rgba = new RGBA();
rgba.hex = '#80808080';
console.log(rgba.a); // 0.5
console.log(rgba.rgba); // rgba(128, 128, 128, 0.5)

rgba.r = 192;
rgba.a = 0.25;
console.log(rgba.hex); // #C0808040

rgba.color = 'rgba(1,2,3,0.70)';
rgba.b *= 10;
console.log(rgba.hex); // #01021EB3
