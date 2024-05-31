// Temperature

const yCel = (a) => a * 9/5 + 32;
const yFah = (a) => (a - 32) * 5/9;

// RGB

const yRGB = (r, g, b) => '#' + r.toString(16).padStart(2,0) + g.toString(16).padStart(2,0) + b.toString(16).padStart(2,0);

// Flats



// Credentials

const capitalize = str => {
   let result = str[0].toUpperCase() + str.slice(1).toLowerCase();
   return result;
}

const credentials = () => {
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

const person = credentials();
console.log(person);

// New line

const lineText = prompt("Введіть текст:");

const yLine = (text) => {
   const sliceLineText = text.split('\\n');
   const resultLineText = sliceLineText.join('\n');
   return resultLineText;
}

const result = yLine(lineText);
console.log(result);

// Prompt OR

const yPrompt = () => prompt("Введіть текст") || console.log("Все ясно")

alert(yPrompt())

// Login And Password

const logPass = (log,pass) =>{
    let yLog = prompt('Введіть ваш логін');

    if (yLog === log){
        let yPass = prompt('Введіть пароль');
        if (yPass === pass){
            alert('Ви увійшли в систему');
        } else{
            alert('Пароль не вірний');
        }
    } else {
        alert('Ви ввели невірний логін');
    }
}

logPass('admin','qwerty')

// For Table



