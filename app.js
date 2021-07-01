const gun = new window.Gun({peers: ['https://gunjs-server.herokuapp.com/gun']});

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

const user = gun.user()

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
    const id = signupId.value;
    const password = signupPassword.value;
    user.auth(id, password)
})

gun.on('auth', () => {
    console.log('auth')
    secretInput.addEventListener('input', () => {
        user.get('message').put( secretInput.value)
    })
    user.get('message').on(data => {
        secret.innerText = data;
    })
})