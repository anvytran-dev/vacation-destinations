document.querySelector('#desForm').addEventListener('submit', addSubmission);


let nameDes;
let locationDes;
let descDes;
let city;
const sectionCardGroup = document.querySelector('.container');
const url = 'https://api.unsplash.com/photos/random/?client_id=QsPtItqyx9-VpUsYx2K7DlLKcxJ-Kg6EthZ1LimBMy8&query=';
const weatherUrl = `api.openweathermap.org/data/2.5/weather?q={${city}}&appid={e89c759b0eeedfb883f2c032ba235e16}`;

function addSubmission(event) {
    event.preventDefault();
    getData();
    createCard(nameDes, locationDes, descDes);
}

function getData() {
    nameDes = document.querySelector('#nameDes').value;
    locationDes = document.querySelector('#locationDes').value;
    descDes = document.querySelector('#descDes').value;

    return nameDes, locationDes, descDes;
}

function createCard(nameDestination, locationDestination, descDestination) {

    addCard();
    addImg(nameDestination, url);
    addText(nameDestination, locationDestination, descDestination);
    addButtons();
    changeTitle();
    resetForm()
}


async function fetchCurrentTemp(location) {

    let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=e89c759b0eeedfb883f2c032ba235e16`;

    let response = await fetch(weatherUrl);
    let data = await response.json();

    return data.main.temp;

}


function changeTitle() {
    if (sectionCardGroup.childElementCount == 0) {
        document.querySelector('.destinationDetails').innerHTML = 'Enter Destination Details';
    } else {
        document.querySelector('.destinationDetails').innerHTML = 'My Wish List';
    }
}
function addCard() {

    let section = document.createElement('section');
    section.className = 'card';
    section.style = 'width: 20rem';


    sectionCardGroup.append(section);

}

async function addImg(query, url) {

    let lastElement = sectionCardGroup.lastElementChild;
    let img;

    if (lastElement.querySelector('img') == null) {
        //create img element
        img = document.createElement('img');
        img.className = 'card-img-top';
        img.style = 'height: 20rem';

    } else {
        img = lastElement.querySelector('img');
    }

    //fetch
    let randomPhoto = await fetchImg(query, url);
    //set img src
    img.setAttribute('src', `${randomPhoto}`);
    //insert node as first child
    lastElement.insertBefore(img, lastElement.firstChild);

}

async function fetchImg(query, urlApi) {
    let link = `${urlApi}${query}`;

    let response = await fetch(link);
    let data = await response.json();

    //error handling
    let defaultImg = 'https://i.ibb.co/Y7qtpP2/1621538136664.jpg';
    if (data.errors) {
        return defaultImg;
    }
    //success handling
    let obj = data.urls;
    //{raw: 'https://images.unsplash.com/photo-1551634979-2b11f…HJhbmRvbXx8fHx8fHx8fDE2MzcxMzIwNjI&ixlib=rb-1.2.1', full: 'https://images.unsplash.com/photo-1551634979-2b11f…RvbXx8fHx8fHx8fDE2MzcxMzIwNjI&ixlib=rb-1.2.1&q=85', regular: 'https://images.unsplash.com/photo-1551634979-2b11f…Hx8fHx8fDE2MzcxMzIwNjI&ixlib=rb-1.2.1&q=80&w=1080', small: 'https://images.unsplash.com/photo-1551634979-2b11f…fHx8fHx8fDE2MzcxMzIwNjI&ixlib=rb-1.2.1&q=80&w=400', thumb: 'https://images.unsplash.com/photo-1551634979-2b11f…fHx8fHx8fDE2MzcxMzIwNjI&ixlib=rb-1.2.1&q=80&w=200'}
    let { raw, full, regular, small, thumb } = obj;

    return small;
}

async function addText(nameDestination, locationDestination, descDestination) {

    let lastElement = sectionCardGroup.lastElementChild;

    //append card-body
    let div = document.createElement('div');
    div.className = 'card-body';
    lastElement.appendChild(div);

    //append card-title with destination name
    let nameH3 = document.createElement('h3');
    nameH3.className = 'nameDestination';
    nameH3.innerHTML = nameDestination;
    div.appendChild(nameH3);

    //append card text with location
    let locationP = document.createElement('p');
    locationP.className = 'locationDestination';
    locationP.innerHTML = locationDestination;
    div.appendChild(locationP);

    //append span with current temp
    let spanTemp = document.createElement('span');
    spanTemp.className = 'tempDestination';
    div.append(spanTemp);

    //append card text with description
    let descP = document.createElement('p');
    descP.className = 'descDestination';
    descP.innerHTML = descDestination;
    div.appendChild(descP);

    spanTemp.innerHTML = `${await fetchCurrentTemp(locationDestination)} Farenheit`;

}

function addButtons() {

    let lastElement = sectionCardGroup.lastElementChild.lastElementChild;

    //Edit Button
    let buttonEdit = document.createElement('button');
    buttonEdit.className = 'btn btn-warning btnEdit';
    buttonEdit.innerHTML = 'Edit';
    lastElement.appendChild(buttonEdit);

    buttonEdit.addEventListener('click', editCard);

    //Remove Button
    let buttonRemove = document.createElement('button');
    buttonRemove.className = 'btn btn-danger btnRemove';
    buttonRemove.innerHTML = 'Remove';
    lastElement.appendChild(buttonRemove);

    buttonRemove.addEventListener('click', removeCard);


}

async function editCard(e) {

    let closestCard = e.target.closest('.card-body')

    //edit destination name
    let currentName = closestCard.querySelector('.nameDestination');
    console.log(currentName)
    let nameEdit = prompt('Enter new name');
    currentName.innerHTML = nameEdit;

    //edit location
    let currentLocation = closestCard.querySelector('.locationDestination');
    let locationEdit = prompt('Enter new location');
    currentLocation.innerHTML = locationEdit;

    //edit description
    let currentDescription = closestCard.querySelector('.descDestination');
    let descEdit = prompt('Enter new description');
    currentDescription.innerHTML = descEdit;

    //update image
    addImg(nameEdit, url);

    //update temp
    let currentTemp = closestCard.querySelector('.tempDestination');
    
    currentTemp.innerHTML = `${await fetchCurrentTemp(locationEdit)} Farenheit`;

}


function removeCard(e) {

    e.target.closest('.card').remove();
    changeTitle();

}

function resetForm() {
    document.querySelector('form').reset();
}






