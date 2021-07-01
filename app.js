import Gun from 'gun/gun';
const gun = new Gun({peers: ['https://gunjs-server.herokuapp.com/gun']});

const nameDomElement = document.getElementById('name')
const inputDomElement = document.getElementById("input")

inputDomElement.addEventListener('input', () => {
    const name = inputDomElement.value;
    gun.get('main').put({ name });
})

gun.get('main').on((data) => {
    nameDomElement.innerText = data.name;
    inputDomElement.value = data.name;
})