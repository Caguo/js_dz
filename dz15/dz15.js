// Chat

function jsonPost(url, data) {
    return new Promise((resolve, reject) => {
        var x = new XMLHttpRequest();   
        x.onerror = () => reject(new Error('jsonPost failed'));
        // x.setRequestHeader('Content-Type', 'application/json'); // Закомментирован для теста
        x.open("POST", url, true);
        x.send(JSON.stringify(data));

        x.onreadystatechange = () => {
            if (x.readyState == XMLHttpRequest.DONE && x.status == 200) {
                resolve(JSON.parse(x.responseText));
            } else if (x.status != 200) {
                reject(new Error('status is not 200'));
            }
        };
    });
}

let nextMessageId = 0;

async function getMessages() {
    try {
        const response = await jsonPost("http://students.a-level.com.ua:10012", { func: 'getMessages', messageId: nextMessageId });
        console.log('Messages received:', response);

        if (response && response.data) {
            nextMessageId = response.nextMessageId;
            const messagesDiv = document.getElementById('messages');
            if (messagesDiv) {
                response.data.forEach(msg => {
                    console.log('Adding message:', msg); 
                    const timestamp = new Date(msg.timestamp);
                    const formattedDate = timestamp.toLocaleString(); 

                    const messageDiv = document.createElement('div');
                    messageDiv.className = 'message';
                    messageDiv.innerHTML = `[${formattedDate}] <strong>${msg.nick}</strong>: ${msg.message}`;
                    messagesDiv.appendChild(messageDiv);
                });
                messagesDiv.scrollTop = messagesDiv.scrollHeight; 
            } else {
                console.error('Messages container not found');
            }
        } else {
            console.error('No data in response');
        }
    } catch (error) {
        console.error('Failed to get messages:', error.message);
    }
}

async function sendMessage(nick, message) {
    try {
        const result = await jsonPost("http://students.a-level.com.ua:10012", { func: 'addMessage', nick, message });
        console.log('Message sent:', result);
        return result;
    } catch (error) {
        console.error('Failed to send message:', error.message);
    }
}

async function sendAndCheck() {
    const nick = document.getElementById('nickInput').value;
    const message = document.getElementById('messageInput').value;
    if (nick && message) {
        console.log('Sending message:', { nick, message });
        await sendMessage(nick, message);
        document.getElementById('messageInput').value = '';
        await getMessages();
    } else {
        console.warn('Nickname and message cannot be empty');
    }
}

function createChatInterface() {
    const body = document.body;

    const messagesDiv = document.createElement('div');
    messagesDiv.id = 'messages';
    messagesDiv.style.border = '1px solid #ccc';
    messagesDiv.style.height = '300px';
    messagesDiv.style.overflowY = 'scroll';
    messagesDiv.style.marginBottom = '10px';
    messagesDiv.style.backgroundColor = '#f9f9f9'; 
    body.appendChild(messagesDiv);

    const nickInput = document.createElement('input');
    nickInput.id = 'nickInput';
    nickInput.placeholder = 'Enter your nickname';
    nickInput.style.marginRight = '5px';
    body.appendChild(nickInput);

    const messageInput = document.createElement('input');
    messageInput.id = 'messageInput';
    messageInput.placeholder = 'Enter your message';
    messageInput.style.marginRight = '5px';
    body.appendChild(messageInput);

    const sendButton = document.createElement('button');
    sendButton.textContent = 'Send';
    sendButton.addEventListener('click', sendAndCheck);
    body.appendChild(sendButton);
}

async function checkLoop() {
    while (true) {
        await getMessages();
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
}

createChatInterface();
checkLoop();

// SWAPI Links

async function swapiLinks(url) {
   const response = await fetch(url);
   if (!response.ok) {
       throw new Error('Network response was not ok');
   }
   const data = await response.json();
   return data;
}
swapiLinks("https://swapi.dev/api/people/20/")
    .then(yodaWithLinks => console.log(JSON.stringify(yodaWithLinks, null, 4)))
    .catch(error => console.error('Error:', error));
