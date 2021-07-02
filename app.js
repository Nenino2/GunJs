const gun = new window.Gun({peers: ['https://gunjs-server.herokuapp.com/gun']});
const SEA = window.Gun.SEA;

const nameDomElement = document.getElementById('name')
const inputDomElement = document.getElementById("input")
const signupId = document.getElementById('signup-id')
const signupPassword = document.getElementById('signup-password')
const signupButton = document.getElementById('signup-button')
const loginId = document.getElementById('login-id')
const loginPassword = document.getElementById('login-password')
const loginButton = document.getElementById('login-button')
const secret = document.getElementById('secret');
const secretInput = document.getElementById('secret-input')
const receiverInput = document.getElementById('receiver-input')
const receiverEncryptInput = document.getElementById('encrypt-input')
const secretButton = document.getElementById('secret-button')
const userListDom = document.getElementById('user-list')

const user = gun.user()

user.recall({sessionStorage: true})

inputDomElement.addEventListener('input', () => {
    const name = inputDomElement.value;
    gun.get('main').put({ name });
})

gun.get('main').on((data) => {
    nameDomElement.innerText = data.name;
    inputDomElement.value = data.name;
})

signupButton.addEventListener('click', () => {
    const id = signupId.value;
    const password = signupPassword.value;
    user.create(id, password)
})

loginButton.addEventListener('click', () => {
    const id = loginId.value;
    const password = loginPassword.value;
    user.auth(id, password)
})

gun.on('auth', () => {
    alert('Auth successful')
    gun.get('user-list').set(user)
})

let connected = false;

secretButton.addEventListener('click', () => {
    connected = true;
    gun.user(receiverInput.value).get('message').on(async data => {
        if (data && receiverEncryptInput.value && user._.sea) {
            const secretKey = await SEA.secret(receiverEncryptInput.value, user._.sea)
            const decrytpedMessage = await SEA.decrypt(data, secretKey);
            secret.innerText = decrytpedMessage;
        }
    })
})

secretInput.addEventListener('input', async () => {
    secretMessage = secretInput.value;
    if (receiverEncryptInput.value && user._.sea && secretMessage && connected) {
        const secretKey = await SEA.secret(receiverEncryptInput.value, user._.sea)
        const encryptedMessage = await SEA.encrypt(secretMessage, secretKey)
        user.get('message').put(encryptedMessage)
    }
})


const userNames = []

gun.get('user-list').map().once((data) => {
    if (!userNames.includes(data.alias)) {
        userListDom.insertAdjacentHTML('beforeend', `<li><p>${data.alias}</p><p><b>Public key</b> ${data.pub}</p><p><b>Encrypt Public Key</b> ${data.epub}</p></li>`)
        userNames.push(data.alias)
    }
})