// Рекурсія: HTML tree

function htmlTree(node) {
   let html = `<${node.tagName}`;
   if (node.attrs) {
       for (const attr in node.attrs) {
           html += ` ${attr}="${node.attrs[attr]}"`;
       }
   }
   html += '>';

   if (node.children) {
       for (const child of node.children) {
           if (typeof child === 'string') {
               html += child;
           } else {
               html += htmlTree(child);
           }
       }
   }

   html += `</${node.tagName}>`;
   return html;
}

const table = {
   tagName: 'table',
   attrs: {
       border: "1",
   },
   children: [
       {
           tagName: 'tr',
           children: [
               {
                   tagName: "td",
                   children: ["1x1"],
               },
               {
                   tagName: "td",
                   children: ["1x2"],
               },
           ]
       },
       {
           tagName: 'tr',
           children: [
               {
                   tagName: "td",
                   children: ["2x1"],
               },
               {
                   tagName: "td",
                   children: ["2x2"],
               },
           ]
       }
   ]
};

const htmlString = htmlTree(table);
console.log(htmlString); //поверне <table border='1' ....

document.body.innerHTML = htmlString;


// Рекурсія: DOM tree

function domTree(parent, node) {
   const element = document.createElement(node.tagName);

   if (node.attrs) {
       for (const attr in node.attrs) {
           element.setAttribute(attr, node.attrs[attr]);
       }
   }

   if (node.children) {
       for (const child of node.children) {
           if (typeof child === 'string') {
               element.appendChild(document.createTextNode(child));
           } else {
               domTree(element, child);
           }
       }
   }

   parent.appendChild(element);
}

const table = {
   tagName: 'table',
   attrs: {
       border: "1",
   },
   children: [
       {
           tagName: 'tr',
           children: [
               {
                   tagName: "td",
                   children: ["1x1"],
               },
               {
                   tagName: "td",
                   children: ["1x2"],
               },
           ]
       },
       {
           tagName: 'tr',
           children: [
               {
                   tagName: "td",
                   children: ["2x1"],
               },
               {
                   tagName: "td",
                   children: ["2x2"],
               },
           ]
       }
   ]
};

domTree(document.body, table);

// Рекурсія: Deep Copy

function deepCopy(obj) {
   if (obj === null || obj === undefined) {
       return obj;
   }

   if (typeof obj !== "object") {
       return obj;
   }

   if (Array.isArray(obj)) {
       const arrCopy = [];
       for (let i = 0; i < obj.length; i++) {
           arrCopy[i] = deepCopy(obj[i]);
       }
       return arrCopy;
   }

   const objCopy = {};
   for (const key in obj) {
       if (obj.hasOwnProperty(key)) {
           objCopy[key] = deepCopy(obj[key]);
       }
   }
   return objCopy;
}

// Приклад використання
const arr  = [1, "string", null, undefined, {a: 15, b: 10, c: [1, 2, 3, 4], d: undefined, e: true}, true, false];
const arr2 = deepCopy(arr); // arr2 та всі його вкладені масиви та об'єкти - інші об'єкти, які можна змінювати без ризику поміняти щось у arr
console.log(arr2);

const table = {
   tagName: 'table',
   attrs: {
       border: "1",
   },
   children: [
       {
           tagName: 'tr',
           children: [
               {
                   tagName: "td",
                   children: ["1x1"],
               },
               {
                   tagName: "td",
                   children: ["1x2"],
               },
           ]
       },
       {
           tagName: 'tr',
           children: [
               {
                   tagName: "td",
                   children: ["2x1"],
               },
               {
                   tagName: "td",
                   children: ["2x2"],
               },
           ]
       }
   ]
};

const table2 = deepCopy(table); // Аналогічно
console.log(table2);

// Рекурсия: My Stringify

function stringify(value) {
   if (value === undefined || typeof value === 'function') {
       return undefined;
   }
   
   if (value === null) {
       return 'null';
   }
   
   if (typeof value === 'number' || typeof value === 'boolean') {
       return String(value);
   }
   
   if (typeof value === 'string') {
       return `"${value}"`;
   }
   
   if (Array.isArray(value)) {
       const arrayElements = value.map(element => stringify(element) ?? 'null');
       return `[${arrayElements.join(',')}]`;
   }
   
   if (typeof value === 'object') {
       const objectProperties = [];
       for (const key in value) {
           if (value.hasOwnProperty(key)) {
               const keyValue = stringify(value[key]);
               if (keyValue !== undefined) {
                   objectProperties.push(`"${key}":${keyValue}`);
               }
           }
       }
       return `{${objectProperties.join(',')}}`;
   }
   
   return undefined;
}

const arr  = [1, "string", null, undefined, {a: 15, b: 10, c: [1, 2, 3, 4], d: undefined, e: true}, true, false];
const jsonString = stringify(arr);
console.log(jsonString); // Перевірка JSON-рядка
console.log(JSON.parse(jsonString)); // Не повинно поламатися і повернути структуру, у всьому схожу з оригінальним arr
console.log(jsonString === JSON.stringify(arr)); // Повинно бути true

const table = {
   tagName: 'table',
   attrs: {
       border: "1",
   },
   children: [
       {
           tagName: 'tr',
           children: [
               {
                   tagName: "td",
                   children: ["1x1"],
               },
               {
                   tagName: "td",
                   children: ["1x2"],
               },
           ]
       },
       {
           tagName: 'tr',
           children: [
               {
                   tagName: "td",
                   children: ["2x1"],
               },
               {
                   tagName: "td",
                   children: ["2x2"],
               },
           ]
       }
   ]
};

const jsonString2 = stringify(table);
console.log(jsonString2); // Перевірка JSON-рядка
console.log(JSON.parse(jsonString2)); // Не повинно поламатися і повернути структуру, у всьому схожу з оригінальним table
console.log(jsonString2 === JSON.stringify(table)); // Повинно бути true
