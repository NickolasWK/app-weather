const apiKey = 'f112ba2a8d8d4540a28100847242911'
const form = document.querySelector('#form');
const inputLatitude = document.querySelector('#inputLatitude');
const inputLongitude = document.querySelector('#inputLongitude');
const addButton = document.querySelector('#addWidget');

form.onsubmit = async function (event) {
    event.preventDefault();
    removeCard();

    let latitude = inputLatitude.value.trim();
    let longitude = inputLongitude.value.trim();
    if (validateCoords(Number(latitude), Number(longitude))) {
        getErrorCard();
    }
    else {
        const data = await getWeather(latitude, longitude);

        removeCard();

        const weatherData = {
            temp: (typeof(data.current) === 'undefined') ? 'N/A' : data.current.temp_c,
            wind: (typeof(data.current) === 'undefined') ? 'N/A' : data.current.wind_mph,
            icon: (typeof(data.current) === 'undefined') ? 'N/A' : data.current.condition.icon,
        };

        getCard(weatherData);
        document.getElementById('map-iframe').src =`https://yandex.ru/map-widget/v1/?ll=${longitude}%2C${latitude}&z=10`;
    }
};

addButton.onclick = () => {
    const createBlock = document.createElement('section');
    createBlock.className = 'widget';
    addButton.insertAdjacentHTML('afterend',
        `<section class="widget">
                <div class="map">
                    <iframe id="map-iframe" src="https://yandex.ru/map-widget/v1/?ll=66.600726%2C58.840226&z=17.34" width="300" height="300" frameborder="1" allowfullscreen="true" style="position:relative;"></iframe>
                </div>
                <form action="" class="form" id="form">
                    <input id = "inputLatitude" type="text" class="form__input" placeholder="Широта">
                    <input id = "inputLongitude" type="text" class="form__input" placeholder="Долгота"><br>
                    <button type="submit" class="form__btn">Показать погоду</button>
                </form>
            </section>`
    );
}

async function getWeather(latitude, longitude) {
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}`
    const responce = await fetch(url);
    const data = await responce.json();
    return data;
}

function removeCard() {
    const prevCard = document.querySelector('.weather');
    if (prevCard) prevCard.remove();
}

function getCard({temp, wind, icon}) {
    const html = 
        `<div class="weather">
            <div>
                <p class="temperature">${temp}°C</p>
                <p class="wind">${wind} м/с</p>
            </div>
            <img src="${icon}" width="64" height="64">
        </div>`
    form.insertAdjacentHTML('afterend', html)
}

function getErrorCard() {
    const html = 
        `<div class="weather">
            <div>
                <p>Неверный ввод координат</p>
            </div>
        </div>`;
    form.insertAdjacentHTML('afterend', html);
}

function validateCoords (latitude, longitude) {
    return (typeof(latitude) !== "number" || typeof(longitude) !== "number" 
        || latitude > 90 || latitude < -90
        || longitude > 180 || longitude < -180);
}