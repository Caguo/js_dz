// String: greeting

let yourName = prompt("Введіть ваше ім'я");
alert('Привіт ' + yourName);

// String: gopni4ek

let yourText = prompt("Введіть текст");
let sliceText = yourText.split(',');
let resultText = sliceText.join(' блін,');
alert(resultText);

// String: capitalize

let str = "cANBerRa";
let result = str[0].toUpperCase() + str.slice(1).toLowerCase();
console.log(result); //Canberra

// String: word count

let wordText = prompt("Введіть текст");
let wordSplit = wordText.split(' ');
let wordCount = wordSplit.length;
alert(wordCount)

// String: credentials

let credentialsName = prompt("Введіть ім'я");
let credentialsSurname = prompt("Введіть прізвище");
let credentialsBatko = prompt("Введіть по батькові");
let credentialsTrim = credentialsName.trim + credentialsSurname.trim + credentialsBatko.trim;
let fullName = credentialsName[0].toUpperCase() + credentialsName.slice(1).toLowerCase() + " " + credentialsSurname[0].toUpperCase() + credentialsSurname.slice(1).toLowerCase() + " " + credentialsBatko[0].toUpperCase() + credentialsBatko.slice(1).toLowerCase();
alert(fullName);

// String: beer

let strBeer = "Було жарко. Василь пив пиво вприкуску з креветками"
let resultBeer = strBeer.split("пиво").join("чай");
console.log(resultBeer) //"Було жарко. Василь пив чай уприкуску з креветками"

// String: no tag

let strTag = "якийсь текст, в якому є один тег <br /> і всяке інше"
const tagName = '<br /> '
let findTag = strTag.indexOf(tagName); 
let resultTag = strTag.slice(0, findTag) + strTag.slice(findTag + tagName.length);
console.log(resultTag) //якийсь текст, в якому є один тег і всяке інше

// String: big tag

let strBigTag = "якийсь текст, в якому є один тег <br /> і всяке інше"
let findBigTag = strTag.indexOf("<br />");
let resultBigTag = strTag.slice(0, findBigTag) + strTag.slice(findBigTag, findBigTag + 7).toUpperCase() + str.slice(findBigTag + 6);
console.log(resultBigTag) //якийсь текст, в якому є один тег і всяке інше

// String: new line

let lineText = prompt("Введіть текст");
let sliceLineText = lineText.split('\\n');
let resultLineText = sliceLineText.join('\n');
alert(resultLineText);