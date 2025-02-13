// @ts-noheck
'use strict'
import {Circuit, EventCard, ForumCard, User } from '../classes/classes.js'
import { HttpError } from '../classes/HttpError.js';
import {MarketItem} from '../classes/classes.js'
import { store } from './store/redux.js';
import { simpleFetch } from './lib/simpleFetch.js';
/**
 * @type {number[]}
 */
let userCoords = null;
let map
let editCanvas
let userlog = false
const NODE_SERVER = `127.0.0.1:6431/`
let circuitArray

/*
const NODE_SERVER_GET_CIRCUITS =`http://127.0.0.1:6431/get.circuits.json`
const NODE_SERVER_GET_MARKET_ITEMS =`http://127.0.0.1:6431/get.articles.json`
const NODE_SERVER_GET_EVENTS =`http://127.0.0.1:6431/get.events.json`
const NODE_SERVER_GET_FORUM_TOPICS =`http://127.0.0.1:6431/get.forum.topics.json`
*/
document.addEventListener('DOMContentLoaded', async () => {

    const page = document.getElementsByTagName('body')

    
    console.log("user: ", getUserFromSession())
    if (getUserFromSession() != null) {
        userlog = true
    }

    

    await setUserCoords();
    switch (page[0].id){
            case 'profile':
                console.log(`Estoy en ${page[0].id}`)
                if (userlog) {
                    fillUserProfile()
                    fillUserForm()
                    fillEventList()
                    fillRaceLinesList()
                    fillMarketList()
                    updateUserProfile()
                }
                break
            case 'index':
                assignIndexListeners()
                credentialsBtnManager()
                checkSignRedirectionFlag()
                userRegister()
                userLogin()
                console.log(`Estoy en ${page[0].id}`)
                break
            case 'circuits':
                console.log(`Estoy en ${page[0].id}`)
                credentialsBtnManager()
                await getCircuitData()
                createMap()
                modalManager()
                break
            case 'events':
                console.log(`Estoy en ${page[0].id}`)
                credentialsBtnManager()
                await getEventData()
                formManager()
                modalManager()
                break
            case 'market':
                console.log(`Estoy en ${page[0].id}`)
                credentialsBtnManager()
                await getMarketData()
                formManager()
                modalManager()
                break
            case 'forum':
                console.log(`Estoy en ${page[0].id}`)
                credentialsBtnManager()
                await getForumData()
                showForumCard()
                break
            case 'raceline':
                console.log(`Estoy en ${page[0].id}`)
                credentialsBtnManager()
                raceLineButtonsAssign()
                fillSelectable()
                activateCanvas()
            break
    }

})


/*=================================GENERIC FUNCTIONS===============================================*/

// function modalBuilder(){
//     const page = document.getElementsByTagName('body')
//     switch (page[0].id){
//         case 'index':
//             break
//         case 'circuits':
//             circuitModalBinder()
//             break
//         case 'events':
//             eventModalBinder()
//             break
//         case 'market':
//             break
//         case 'forum':
//             console.log(`Estoy en ${page[0].id}`) 
//             break
//     }
    


// }

// function marketModalBinder(){
//     let j
//     const modalOpenbtns = document.getElementsByClassName('modal-open')
//     const marketInfo = store.getAllMarketArticles()
//     j = 0
//     for (let i of modalOpenbtns){
//         /** @type {HTMLElement} */(i).addEventListener('click', marketModal.bind(i, marketInfo[j] ))
//         j++
//     } 
// }


// function eventModalBinder(){
//     let j
//     const modalOpenbtns = document.getElementsByClassName('modal-open')
//     const eventInfo = store.getAllEvents()
//     j = modalOpenbtns.length-1
//     for (let i of modalOpenbtns){
//         /** @type {HTMLElement} */(i).addEventListener('click', eventModal.bind(i,eventInfo[j] ))
//         j--
//     }
// }

// function circuitModalBinder(){
//     let j
//     const modalOpenbtns = document.getElementsByClassName('modal-open')
//     const circuitInfo = store.getAllCircuits()
//     j = modalOpenbtns.length-1
//     for (let i of modalOpenbtns){
//         /** @type {HTMLElement} */(i).addEventListener('click', circuitModal.bind(i,circuitInfo[j] ))
//         j--
//     } 
// }

window.openCircuitModal = function (circuit){
    modalOpener()
    circuitModal(circuit)
}

function modalOpener(){
    const modalWindow = document.getElementById('modal')
    modalWindow?.classList.remove('__hidden')
}

function modalCloser(){
    const modalWindow = document.getElementById('modal')
    const modalContent = document.getElementById('modal-content')

    modalWindow?.classList.add('__hidden')
    if (modalContent) modalContent.innerHTML = ''
}

function modalManager(){
    const modalCloseBtn = document.getElementById('modal-close')
    modalCloseBtn?.addEventListener('click', function(e) {
        e.stopPropagation()
        modalCloser()
    });
    document.getElementById('modal').addEventListener('click', function(e) {
        if (e.target === this) {
            modalCloser()
        }
    })
}

function formManager(e){
    const page = document.getElementsByTagName('body')
    document.getElementById('form').addEventListener('submit', async function (e){
        e.preventDefault()


        const description = document.getElementById('description').value
        const sessionUser = getUserFromSession()
        const user = sessionUser._id

        const eventTitle = document.getElementById('eventName')?.value
        const eventDate = document.getElementById('eventDate')?.value
        const eventLocation = 'location'//document.getElementById('eventLocation')?.value
        
        const itemName = document.getElementById('itemName')?.value
        const itemPrice = document.getElementById('itemPrice')?.value
        const itemLocation = document.getElementById('itemLocation')?.value
        const itemImg = "imgs/Rotax1.jpeg"
        const terms = document.getElementById("terms")?.checked;


        if (!terms) {
            alert("Debes aceptar las normas para publicar.");
            return;
        }

        /*let imageUrl = "";
        if (itemImg) {
        imageUrl = URL.createObjectURL(itemImg);
        }*/
        let apiData = ''
        let payload = ''
        switch (page[0].id){
            case 'market':
                    payload = ''
                    apiData = ''

                    const marketItem = {
                        article: itemName,
                        price: itemPrice,
                        user_id: user,
                        location: itemLocation,
                        description: description,
                        img: itemImg
                    }
                    
                    console.log("antes de fetch", marketItem)
                    payload = JSON.stringify(marketItem)
                    console.log(payload)
                    apiData = await getAPIData(`${location.protocol}//${NODE_SERVER}create/article`,'POST', payload);

                    const item = new MarketItem(apiData._id, apiData.user_id, apiData.article, apiData.price, apiData.location, apiData.description, apiData.img)
                    // const item = new MarketItem('',user, itemName, itemPrice, itemLocation, description, itemImg)
                    //searchParams = new URLSearchParams(item).toString()
                    console.log(apiData)
                    //fetch(`${NODE_SERVER}create/article?${searchParams}`)


                    drawArticle(item)
                break
            case 'events':
                    payload = ''
                    apiData = ''

                    const eventObject = {
                        user_id: user,
                        title: eventTitle,
                        date: eventDate,
                        location: eventLocation,
                        description: description,
                    }

                    console.log("antes de fetch", eventObject)
                    payload = JSON.stringify(eventObject)
                    console.log(payload)
                    apiData = await getAPIData(`${location.protocol}//${NODE_SERVER}create/event`,'POST', payload);

                    const event = new EventCard(apiData._id, apiData.title, apiData.date, apiData.user_id, apiData.description, apiData.location)
                    //searchParams = new URLSearchParams(event).toString()
                    console.log(event)
                    //fetch(`${NODE_SERVER}create/event?${searchParams}`)




                    drawEvent(event)
                break    
            
        }

        e.target.reset();
    })
}

function credentialsBtnManager(){
    document.getElementById('credentials-btn').addEventListener('click', () => {

        if(document.body.id === 'index'){
            // Si ya estás en index, muestra el formulario directamente
            showCredentialsForm();
        } else {
            // Si no estás en index, establece el flag y redirige a index.html
            sessionStorage.setItem('showSigninForm', 'true');
            window.location.href = 'index.html';
        }
        
    });
    if (userlog){
        document.getElementById('credentials-btn').classList.add('__hidden')
        document.getElementById('profile-btn').classList.remove('__hidden')
    }else{
        document.getElementById('credentials-btn').classList.remove('__hidden')
        document.getElementById('profile-btn').classList.add('__hidden')    
}

}

function getUserFromSession(){
    return JSON.parse(sessionStorage.getItem('user'))
}

async function getAPIData(apiURL, method, data) {
    let apiData
  
    try {
      let headers = new Headers()
      headers.append('Content-Type', 'application/json')
      headers.append('Access-Control-Allow-Origin', '*')
      if (data) {
        headers.append('Content-Length', String(JSON.stringify(data).length))
      }

      if (isUserLoggedIn()) {
        const userData = getDataFromSessionStorage()
        headers.append('Authorization', `Bearer ${userData?.user?.token}`)
      }
      apiData = await simpleFetch(apiURL, {
        // Si la petición tarda demasiado, la abortamos
        signal: AbortSignal.timeout(3000),
        method: method,
        body: data ?? undefined,
        headers: headers
      });
    } catch (/** @type {any | HttpError} */err) {
      if (err.name === 'AbortError') {
        console.error('Fetch abortado');
      }
      if (err instanceof HttpError) {
        if (err.response.status === 404) {
          console.error('Not found');
        }
        if (err.response.status === 500) {
          console.error('Internal server error');
        }
      }
    }
  
    return apiData
  }

  function isUserLoggedIn() {
    const userData = getUserFromSession()
    return userData?.user?.token
  }

/*=================================PROFILE===============================================*/
function fillUserForm(){
    const userData = getUserFromSession()
    document.getElementById('profile-username').placeholder = userData.username || '';
    document.getElementById('profile-name').placeholder = userData.name || '';
    document.getElementById('profile-surname').placeholder = userData.surnames || '';
    document.getElementById('profile-location').placeholder = userData.location || '';
    document.getElementById('profile-prefCircuit').placeholder = userData.prefCircuit || '';
    document.getElementById('profile-kart').placeholder = userData.kart || '';
    document.getElementById('profile-youtubeURL').placeholder = userData.youtube || '';
    document.getElementById('profile-instagramUser').placeholder = userData.instagram || '';

}

function userLogOut(){
    sessionStorage.removeItem('user')
    window.location.href = 'index.html'
}

function fillUserProfile(){
    const user = getUserFromSession()
    if (user){
        document.getElementById('user-username').innerHTML = user.username
        document.getElementById('user-name').innerHTML = user.name
        document.getElementById('user-surname').innerHTML = user.surnames
        document.getElementById('user-email').innerHTML = user.email
        document.getElementById('user-location').innerHTML = user.location
        document.getElementById('user-prefCircuit').innerHTML = user.prefCircuit
        document.getElementById('user-kart').innerHTML = user.kart
        document.getElementById('user-youtubeURL').innerHTML = user.youtube
        document.getElementById('user-instagramUser').innerHTML = user.instagram
    }
    document.getElementById("edit-profile-btn").addEventListener('click', showProfileform)
    document.getElementById("logout-btn").addEventListener('click', userLogOut)
    document.getElementById("profile-update-btn").addEventListener('click', showProfile)
    document.getElementById("discard-btn").addEventListener('click',function(e) {
        e.preventDefault();
    
        const form = document.getElementById('profile-update-form');
        form.reset(); 
        showProfile(); 
    });
}

function showProfileform(){
    document.getElementById("profile-update-form").classList.remove("__hidden")
    document.getElementById("profile-container").classList.add("__hidden")
}

function showProfile(){
    document.getElementById("profile-container").classList.remove("__hidden")
    document.getElementById("profile-update-form").classList.add("__hidden")
}

function updateUserProfile(){
    const storedUser = getUserFromSession()  
    document.getElementById('profile-update-form').addEventListener('submit', async function (e){
        e.preventDefault()

        const newUser = {
            username: document.getElementById('profile-username').value ? document.getElementById('profile-username').value : storedUser.username,
            name: document.getElementById('profile-name').value ? document.getElementById('profile-name').value : storedUser.name,
            surnames: document.getElementById('profile-surname').value ? document.getElementById('profile-surname').value : storedUser.surnames,    
            //email: document.getElementById('profile-email').value ? document.getElementById('profile-email').value : storedUser.email,
            location: document.getElementById('profile-location').value ? document.getElementById('profile-location').value : storedUser.location,
            prefCircuit: document.getElementById('profile-prefCircuit').value ? document.getElementById('profile-prefCircuit').value : storedUser.prefCircuit,
            kart: document.getElementById('profile-kart').value ? document.getElementById('profile-kart').value : storedUser.kart,
            youtube: document.getElementById('profile-youtubeURL').value ? document.getElementById('profile-youtubeURL').value : storedUser.youtube,
            instagram: document.getElementById('profile-instagramUser').value ? document.getElementById('profile-instagramUser').value : storedUser.instagram
        }

        const confirmPassword = document.getElementById('profile-passwordRepeat').value

        // if (newUser.password !== confirmPassword){ 
        //     alert("Contraseña no coincide")
        //     return 
        // }
        console.log(newUser)
        // await fetch(`${NODE_SERVER}update/user/${storedUser.id}/PUT/${newUser}`)

        
        console.log("antes de fetch", newUser)
        const payload = JSON.stringify(newUser)
        console.log("payload",payload)
        const apiData = await getAPIData(`${location.protocol}//${NODE_SERVER}update/user/${storedUser._id}`, "PUT", payload);
        console.log("Respuesta del servidor:", apiData);

        newUser._id = storedUser._id
        console.log(newUser)
        sessionStorage.setItem('user', JSON.stringify(newUser))

        document.getElementById('user-username').textContent ? document.getElementById('user-username').textContent = newUser.username : storedUser.username
        document.getElementById('user-name').textContent ? document.getElementById('user-name').textContent = newUser.name : storedUser.name
        document.getElementById('user-surname').textContent ? document.getElementById('user-surname').textContent = newUser.surnames : storedUser.surnames
        //document.getElementById('user-email').textContent ? document.getElementById('user-email').textContent = newUser.email : storedUser.email
        document.getElementById('user-location').textContent ? document.getElementById('user-location').textContent = newUser.location : storedUser.location
        document.getElementById('user-prefCircuit').textContent ? document.getElementById('user-prefCircuit').textContent = newUser.prefCircuit : storedUser.prefCircuit
        document.getElementById('user-kart').textContent ? document.getElementById('user-kart').textContent = newUser.kart : storedUser.kart
        document.getElementById('user-youtubeURL').textContent ? document.getElementById('user-youtubeURL').textContent = newUser.youtube : storedUser.youtube
        document.getElementById('user-instagramUser').textContent ? document.getElementById('user-instagramUser').textContent = newUser.instagram : storedUser.instagram

        // const searchParams = new URLSearchParams(user).toString()
        // console.log(searchParams)
        // fetch(`${NODE_SERVER}update/user?${searchParams}`)

        e.target.reset();
    })
}

async function fillRaceLinesList(){

    const user = getUserFromSession()
    console.log(user)

    const apiData = await getAPIData(`${location.protocol}//${NODE_SERVER}read/racelines/${user._id}` , 'GET')
    console.log(apiData)
    apiData.forEach(async function (raceline){
       
        const lineCircuit = await getAPIData(`${location.protocol}//${NODE_SERVER}read/circuit/${raceline.circuit_id}`, 'GET')
        const html = `<li>Linea:${lineCircuit.name} Fecha: XD</li>`

        document.getElementById('race-line-list').insertAdjacentHTML('afterbegin', html)
    })

    
    
}

async function fillMarketList(){

    const user = getUserFromSession()
    console.log(user)

    const apiData = await getAPIData(`${location.protocol}//${NODE_SERVER}read/articles/${user._id}` , 'GET')
    console.log(apiData)
    apiData.forEach(function (article){
       
        const html = `<li>Articulo:${article.article} Fecha: ${article.price}</li>`

        document.getElementById('article-list').insertAdjacentHTML('afterbegin', html)
    })

    
    
}

async function fillEventList(){

    const user = getUserFromSession()
    console.log(user)

    const apiData = await getAPIData(`${location.protocol}//${NODE_SERVER}read/events/${user._id}` , 'GET')
    console.log(apiData)
    apiData.forEach(function (event){
       
        const html = `<li>Evento:${event.title} Fecha: ${event.date}</li>`

        document.getElementById('event-list').insertAdjacentHTML('afterbegin', html)
    })

    
    
}

/*=================================INDEX===========================================*/

function assignIndexListeners(){

    document.getElementById('credentials-btn').addEventListener('click', showCredentialsForm)

    document.getElementById('signup-link').addEventListener('click', showRegisterForm)

    document.getElementById('login-link').addEventListener('click', showLoginForm)
}

function showLoginForm(){
    document.getElementById('login-form').classList.remove('__hidden')
    document.getElementById('signup-form').classList.add('__hidden')

}

function showCredentialsForm(){
    document.getElementById('credentials-container').classList.remove('__hidden')
    document.getElementById('landing-container').classList.add('__hidden')
    document.getElementById('credentials-btn').classList.add('__hidden')
}

function showRegisterForm(){
    document.getElementById('login-form').classList.add('__hidden')
    document.getElementById('signup-form').classList.remove('__hidden')
    document.getElementById('credentials-btn').classList.add('__hidden')
}

function userRegister(){
    document.getElementById('signup-form').addEventListener('submit', async function (e){
        e.preventDefault()

        const newUser = {
            username: document.getElementById('username').value,
            email: document.getElementById('sign-email').value,
            password: document.getElementById('sign-password').value
        }

        console.log("antes de fetch", newUser)
        let payload = JSON.stringify(newUser)
        console.log(payload)
        let apiData = await getAPIData(`${location.protocol}//${NODE_SERVER}create/user`,'POST', payload );
        console.log(apiData)

        const userFill = {
            username: apiData.username,
            name: 'Nombre',
            email: apiData.email,
            password: apiData.password,
            surnames: 'Apellidos',
            location: 'Ubicación',
            bio: 'Bio',
            img: '',
            prefCircuit: 'Circuito Preferido',
            kart: 'Kart',
            youtube: 'Youtube Link',
            instagram: 'Instagram User',
            role: 'user',
            token: ''

        }

        // const searchParams = new URLSearchParams(user).toString()
        // console.log(searchParams)
        // fetch(`${NODE_SERVER}create/user?${searchParams}`)



        //TODO SIMPLEFETCH FUNCTION
        
        payload = JSON.stringify(userFill)
        console.log(payload)
        apiData = await getAPIData(`${location.protocol}//${NODE_SERVER}update/user/${apiData._id}`,'PUT', payload );

        const userWithoutPassword = { ...userFill }
            delete userWithoutPassword.password
            sessionStorage.setItem('user', JSON.stringify(userWithoutPassword))
            alert('Bienvenido')
            window.location.href = 'profile.html'
    })
}

function checkSignRedirectionFlag(){
    if (sessionStorage.getItem('showSigninForm') === 'true') {
        showCredentialsForm();
        // Una vez mostrado, eliminas el flag para evitar ejecuciones repetidas
        sessionStorage.removeItem('showSigninForm');
    }
}

function userLogin() {
    document.getElementById('login-form').addEventListener('submit', async function (event) {
        event.preventDefault()

        const loginCredentials = {
            email: document.getElementById('login-email').value,
            password: document.getElementById('login-password').value
        }

        if (loginCredentials.email !== '' && loginCredentials.password !== '') {
            const payload = JSON.stringify(loginCredentials)
            const apiData = await getAPIData(`${location.protocol}//${NODE_SERVER}login`, 'POST', payload)
        
            if (!apiData) {
              // Show error
              alert('El usuario no existe')
            } else {
              if ('_id' in apiData
                && 'name' in apiData
                && 'email' in apiData
                && 'token' in apiData
                && 'role' in apiData) {
                const userData = /** @type {User} */(apiData)
                // store.user.login(userData, setSessionStorageFromStore)
                // setSessionStorageFromStore()
                updateSessionStorage(userData)
                alert('Bienvenido')
                window.location.href = 'profile.html'
              } else {
                alert('Usuario no encontrado')
              }
            }
          }

        // const users = await getAPIData(`${location.protocol}//${NODE_SERVER}read/users`, 'GET')
        // console.log(users)

        // const userFound = users.find(user => user.email === loginCredentials.email && user.password === loginCredentials.password)

        // if (userFound) {
        //     const userWithoutPassword = { ...userFound }
        //     delete userWithoutPassword.password
        //     sessionStorage.setItem('user', JSON.stringify(userWithoutPassword))
        //     alert('Bienvenido')
        //     window.location.href = 'profile.html'
        // } else {
        //     alert('Usuario no encontrado')
        // }
    })
}

function updateSessionStorage(value) {
    sessionStorage.setItem('user', JSON.stringify(value))
  }

/*=================================CIRCUITS===========================================*/

/**
 * Uses Geolocation to determine use coords
 * Returns a promise with the coords
 */
    function getUserCoords() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error("La geolocalización no está soportada en este navegador"));
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    resolve([latitude, longitude]); //  Coords Array
                },
                (error) => reject(error) // Error if no coords
            );
        });
    }

    async function setUserCoords() {
        try {
            userCoords = await getUserCoords(); // Espera la promesa y guarda el resultado
            console.log("Coordenadas guardadas:", userCoords);
        } catch (error) {
            console.error("Error obteniendo coordenadas:", error);
        }
    }

    /**
     * Uses a JSON to get the circuits
     * Creates a new Circuit Object with the info
     * Pushes them to store
     */
    async function getCircuitData(){
        //Get the info via JSON
        //const API_CIRCUITS = 'api/get.circuits.json'
        circuitArray = await getAPIData(`${location.protocol}//${NODE_SERVER}read/circuits` , 'GET')
        //Iterate Array, create the Circuit Object and push to store
        // Waits for getUserToCircuitDistance to get the distance to each circuit and stores it on circuit.distance
        await circuitArray.forEach(async function (/** @type {Circuit} */ circuit){
            circuit.distance = await getUserToCircuitDistance(circuit.location)
        })
        // Sorts circuits by distance to user
        circuitArray.sort(function (a, b) {
            return a.distance - b.distance;
        });
        // Creates the circuit cards and appends them
        circuitArray.forEach(async function (/** @type {Circuit} */ circuit){            
            drawCircuitCard(circuit)
        })
        bindCircuitCardsFocus()
    }

/**
 * Uses userCoords to get the distance to each circuit from user
 * Does math to get the distance
 * Returns the distance in km with 1 decimal
 * 
 * @param {Array<number>} circuitCoords 
 * @returns number
 */
    async function getUserToCircuitDistance(coordsObject){
        // Earth radius
        const R = 6371; 
        // Destructure coords
        const {latitude, longitude} = coordsObject
        // Does math
        const dLat = (latitude - userCoords[0]) * Math.PI / 180;
        const dLon = (longitude - userCoords[1]) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(userCoords[0] * Math.PI / 180) * Math.cos(latitude * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        // Stores the distance fixing to 1 decimal
        const d = (R * c).toFixed(1);
        return d

   }

     

    function drawCircuitCard(circuit){
        const circuitFrame = document.getElementById('card-container')
        const html = `<article class="mb-5 circuit-card zoom-to-marker" data-lat="${circuit.location.latitude}" data-lng="${circuit.location.longitude}">
                            <div class="bg-amber-200 min-h-[3rem] max-h-[6rem] w-full flex items-center p-3 rounded shadow-md hover:bg-amber-300">
                                <span class="mr-4 pl-2 font-bold text-gray-800">${circuit.name}</span>
                                <span class="mr-4 pl-2 text-gray-600">${circuit.distance} Km</span>
                                <button class="mr-4 pl-2 modal-open border border-black bg-gray-400 hover:bg-gray-500 text-white rounded px-3 py-1">
                                Ver más
                                </button>
                            </div>
                        </article>`
        circuitFrame?.insertAdjacentHTML('beforeend', html)

        
        const lastCard = circuitFrame.lastElementChild;
        const modalButton = lastCard.querySelector('.modal-open');

        modalButton.addEventListener('click', function(event){
            event.stopPropagation();
            circuitModal(circuit)
        });
    
    }

    function bindCircuitCardsFocus(){
        const circuitCards = document.getElementsByClassName('circuit-card')
        console.log(circuitCards)
        for (let i of circuitCards){
            i.addEventListener('click', (e) => {
                // Navegar hacia el contenedor de la tarjeta
                const card = e.target.closest('.circuit-card');
                if (!card) return;
                
                // Obtener las coordenadas desde atributos data
                const lat = parseFloat(card.getAttribute('data-lat'));
                const lng = parseFloat(card.getAttribute('data-lng'));
            
                // Opciones de animación (opcional)
                const zoomLevel = 12; // Ajusta el nivel de zoom según necesites
                map.flyTo([lat, lng], zoomLevel, { animate: true, duration: 2 });
                // También puedes usar: map.flyTo([lat, lng], zoomLevel, { animate: true, duration: 1 });
              })
        }
        
    }   
    function createMap(){
            //const coords = [40.187,-4.504]

            // @ts-expect-error External declaration
            map = L.map('map').setView([40.187,-4.504], 6);
            // @ts-expect-error External declaration
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                subdomains: ['a', 'b', 'c'],
                keepBuffer: 8
            }).addTo(map);
            

            
            
            for (let circuit of circuitArray){
                const markerCoords = [circuit.location.latitude, circuit.location.longitude]
                // @ts-expect-error External declaration
                L.marker(markerCoords).addTo(map)
                    .bindPopup(`
                                <div>
                                    <h3>${circuit.name}</h3>
                                    <button 
                                        onclick='window.openCircuitModal(${JSON.stringify(circuit)})'
                                        class="bg-blue-500 text-white p-2 rounded">
                                        Ver más
                                    </button>
                                </div>
                            `)
                .bindTooltip(`${circuit.name}`, {
                                    direction: "top",
                                    permanent: false,
                                    offset: [-15, -20] })
                                    

            }
            /* const circuitoVito = circuitList.find(c => c.id === 'circuit_1')
            const markerCoords = [circuitoVito.location.latitude, circuitoVito.location.longitude]
            console.log(markerCoords)
            L.marker(markerCoords).addTo(map)
                .bindPopup(`${circuitoVito.name}`)
                    .openPopup();*/

    }

    /**
 * 
 * @param {Object} circuit
 * @param {string} circuit.name
 * @param {string} circuit.location
 * @param {string} circuit.url
 * @param {string} circuit.map
 * @param {string} circuit.description
 * @param {string} circuit.bestlap
 * @param {string} circuit.prices
 *  
 */
function circuitModal(circuit){
    modalOpener()
    const modalContent = document.getElementById('modal-content')

    if (modalContent){
    modalContent.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
                <h2 class="text-2xl font-bold text-gray-800 text-center mb-4">Información del Circuito</h2>
                <ul class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                    <li>
                        <strong class="text-gray-900">Nombre:</strong>
                        <span>${circuit.name}</span>
                    </li>
                    <li>
                        <strong class="text-gray-900">Ubicación:</strong>
                        <a href="${circuit.location}" class="text-blue-500 hover:underline" target="_blank">Ver ubicación</a>
                    </li>
                    <li class="md:col-span-2">
                        <strong class="text-gray-900">Mapa:</strong>
                        <img class="w-full h-auto rounded-md mt-2" src="${circuit.map}" alt="Mapa del circuito">
                    </li>
                    <li class="md:col-span-2">
                        <strong class="text-gray-900">WebLink:</strong>
                        <a href="${circuit.url}" class="text-blue-500 hover:underline" target="_blank">${circuit.url}</a>
                    </li>
                    <li class="md:col-span-2">
                        <strong class="text-gray-900">Descripción:</strong>
                        <span>${circuit.description}</span>
                    </li>
                    <li>
                        <strong class="text-gray-900">Mejor tiempo:</strong>
                        <span>${circuit.bestlap}</span>
                    </li>
                    <li>
                        <strong class="text-gray-900">Precio:</strong>
                        <span>${circuit.prices}</span>
                    </li>
                </ul>
            </div>
        `;
    }
}

   
/*=================================EVENTS===========================================*/

/**
 * Uses a JSON to get the events
 * Creates a new EventCard Object with the info
 * Pushes them to store
 */
async function getEventData(){
    const eventArray = await getAPIData(`${location.protocol}//${NODE_SERVER}read/events` , 'GET')
    console.log(eventArray)
    eventArray.forEach(function (/** @type {EventCard} */ event){
        drawEvent(event)
    })
}    

async function drawEvent(event){
    const eventCreator = await getAPIData(`${location.protocol}//${NODE_SERVER}read/user/${event.user_id}`, 'GET')
    console.log(eventCreator)
    const eventFrame = document.getElementById('__event-container')
        const html =
                `<div class="bg-purple-100 h-24 mx-4 mb-4 flex items-center justify-center modal-open event-card">
                    <span class="mr-4 pl-2">${event.title}</span>
                    <span class="mr-4 pl-2">${event.date}</span>
                    <span class="mr-4 pl-2">${eventCreator.username}</span>
                    <span class="mr-4 pl-2">${event.description}</span>
                    <button data-id="${event._id}" class="border-2 border-black bg-gray-400 delete-event">Delete</button>
                </div>`
        eventFrame?.insertAdjacentHTML('afterbegin', html)
        
    const lastCard = eventFrame.firstElementChild;
    const deleteBtn = lastCard.querySelector('.delete-event');

    deleteBtn.addEventListener('click', deleteEventCard);

    lastCard.addEventListener('click', function(e){
        // If click on delete button return
        if (e.target.classList.contains('delete-event')) return;
        eventModal(event); // O bien, openMarketModal(item)
    });
}

async function deleteEventCard(event) {
    // Encuentra el contenedor de la tarjeta (por ejemplo, con la clase 'event-card')
    event.stopPropagation()

    const eventId = event.target.getAttribute('data-id');

    if (!eventId) {
        console.error("No se encontró el ID del evento.");
        return;
    }

    const card = event.target.closest('.event-card');
    if (card) {
        card.remove(); // Elimina la tarjeta del DOM
    }


    try {
        const apiData = await getAPIData(`${location.protocol}//${NODE_SERVER}delete/event/${eventId}`, 'DELETE');
        console.log("Respuesta del servidor:", apiData);
    } catch (error) {
        console.error("Error eliminando el evento:", error);
    }
}

/**
 * 
 * @param {Object} event
 * @param {string} event.user
 * @param {Date} event.date
 * @param {string} event.title
 * @param {string} event.description
 */
function eventModal(event){
    modalOpener()
    const modalContent = document.getElementById('modal-content')
    console.log(modalContent)

    if (modalContent){
    modalContent.innerHTML = `<ul>
                                <li>${event.title}</li>
                                <li>${event.user}</li>
                                <li><a href="${event.date}">Ubicación</a></li>
                                <li>${event.description}</li>
                            </ul>`
    }
}

/*=================================MARKET===========================================*/

/**
 * Uses a JSON to get the marketItems
 * Creates a new MarketItem Object with the info
 * Pushes them to store
 */
   async function getMarketData(){
        const marketArray = await getAPIData(`${location.protocol}//${NODE_SERVER}read/articles` , 'GET')
        marketArray.forEach(function (/** @type {MarketItem} */ item){
                drawArticle(item)

        })
   } 

/**
 * Draws a market item card
 * @param {MarketItem} item
 */
    async function drawArticle(item){
        console.log(item)
        const itemCreator = await getAPIData(`${location.protocol}//${NODE_SERVER}read/user/${item.user_id}`, 'GET')
        const marketFrame = document.getElementById('__market-container')
        const html = `<div class="bg-purple-100 h-52 mx-4 mb-4 p-7 flex modal-open market-card">
                <div class="mr-5 min-w-[150px]">
                    <img src="${item.img}" alt="${item.img}">
                </div>
                <article class="bg-white px-4 ml-5 h-full">
                    <div class="h-[35%]">                    
                        <span class="text-2xl font-bold mr-4 ">${item.article}</span>
                        <span class="mr-4 pl-2">${itemCreator.username}</span>
                        <span class="mr-4 pl-2">${item.location}</span>
                        <button data-id="${item._id}" class="border-2 border-black bg-gray-400 delete-item">Delete</button>
                        </div>

                    <div class="h-[40%]">
                        <span class="">${item.description}</span>
                    </div>
                </article>
                <span class="bg-slate-500 text-3xl font-bold mr-4">${item.price}€</span>
            </div>`
    marketFrame?.insertAdjacentHTML('afterbegin', html)

    const lastCard = marketFrame.firstElementChild;
    const deleteBtn = lastCard.querySelector('.delete-item');
    deleteBtn.addEventListener('click', deleteMarketCard);

    lastCard.addEventListener('click', function(e){
        // If click on delete button return
        if (e.target.classList.contains('delete-item')) return;
        marketModal(item); // O bien, openMarketModal(item)
    });
}

/**
 * Deletes a market card
 * @param {Event} event 
 */
async function deleteMarketCard(event) {
    // Encuentra el contenedor de la tarjeta (por ejemplo, con la clase 'market-card')
    const marketId = event.target.getAttribute('data-id');
    console.log(marketId)

    event.stopPropagation()
    const card = event.target.closest('.market-card');
    if (card) {
        card.remove(); // Elimina la tarjeta del DOM
    }

    try {
        const apiData = await getAPIData(`${location.protocol}//${NODE_SERVER}delete/article/${marketId}`, 'DELETE');
        console.log("Respuesta del servidor:", apiData);
    } catch (error) {
        console.error("Error eliminando el evento:", error);
    }
}

/**
 * 
 * @param {Object} item
 * @param {string} item.user
 * @param {string} item.article
 * @param {number} item.price
 * @param {string} item.location
 * @param {string} item.description
 * @param {string} item.img
 */
function marketModal(item){
    modalOpener()
    const modalContent = document.getElementById('modal-content')

    if (modalContent){
    modalContent.innerHTML = `<ul>
                                <li>${item.article}</li>
                                <li>${item.user}</li>
                                <li><a href="${item.location}">Ubicación</a></li>
                                <li class="w-[200px] h-auto"><img src="${item.img}"></li>
                                <li>${item.description}</li>
                                <li>Precio: ${item.price}</li>
                            </ul>`
    }
}
    
/*=================================FORUM===========================================*/

/**
 * Uses a JSON to get the forumItems
 * Creates a new ForumCard Object with the info
 * Pushes them to store
 */
async function getForumData(){
    //Get the info via JSON
    //const API_FORUM = 'api/get.forum.topics.json'
    const forumArray = await getAPIData(`${location.protocol}//${NODE_SERVER}read/forum-topics` , 'GET')
    //Iterate Array, create the ForumCard Object and push to store
    forumArray.forEach(function (/** @type {ForumCard} */ a){
        const item = new ForumCard(a.user, a.title, a.description)
        store.createForum(item)
    })
}    

/**
* Obtains the event list via store
* Creates the event item cards
* @param {ForumCard} item
*/
function showForumCard(item){
    // Get all forumItems from store
    const forumArray = store.getAllForumItems()
    // Creates the forumItem cards
    forumArray.forEach(function (/** @type {ForumCard} */ item){
        const forumFrame = document.getElementById('__forum-container')
        const html = `<div class="bg-purple-100 h-24 mx-4 mb-4 flex items-center justify-center">
                    <span class="mr-4 pl-2">Titulo</span>
                    <span class="mr-4 pl-2">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quas voluptates, omnis, voluptatum illo error ipsum dolor ut iusto beatae, quam dolores odit? Dolorem rerum, molestiae veritatis quos placeat quam architecto!</span>
                </div>`
    forumFrame?.insertAdjacentHTML('beforeend', html)
    })
    
    }

/*=================================RACELINE CREATOR===========================================*/
function activateCanvas() {
    editCanvas = new fabric.Canvas('circuitCanvas');

    // Cargar la imagen de fondo y bloquearla para evitar que se mueva
    fabric.Image.fromURL('./imgs/kotar.jpg', function(img) {
        img.scaleToWidth(1000);
        img.selectable = false;
        img.evented = false;
        editCanvas.setBackgroundImage(img, editCanvas.renderAll.bind(editCanvas));
    });

    // Configurar el pincel de dibujo
    const brush = new fabric.PencilBrush(editCanvas);
    editCanvas.freeDrawingBrush = brush;
    brush.color = '#40ff00';
    brush.width = 5;
    editCanvas.isDrawingMode = true;

    // Variables para el panning
    let isDragging = false;
    let lastPosX = 0;
    let lastPosY = 0;
    let panMode = false;

    // Botón para limpiar trazos (se mantiene la imagen de fondo)
    const clearButton = document.getElementById("clear");
    clearButton.addEventListener("click", clearTraces);

    

    const clearBgButton = document.getElementById("clearbg");
    clearBgButton.addEventListener("click", function() {
        editCanvas.setBackgroundImage(null, editCanvas.renderAll.bind(editCanvas));
        
    });

    // Modo pan activado con ALT: si se presiona ALT, se desactiva el dibujo y se permite el pan
    editCanvas.on('mouse:down', function(opt) {
        const e = opt.e;
        if (e.altKey) {
            editCanvas.isDrawingMode = false;
            isDragging = true;
            editCanvas.selection = false;
            lastPosX = e.clientX;
            lastPosY = e.clientY;
            
        }
    });

    editCanvas.on('mouse:move', function(opt) {
        const e = opt.e;
        if (isDragging) {
            const vpt = editCanvas.viewportTransform;
            vpt[4] += e.clientX - lastPosX;
            vpt[5] += e.clientY - lastPosY;
            editCanvas.requestRenderAll();
            lastPosX = e.clientX;
            lastPosY = e.clientY;
        }
    });

    editCanvas.on('mouse:up', function(opt) {
        if (isDragging) {
            isDragging = false;
            editCanvas.selection = true;
            clampViewport(editCanvas);
        }
    });

    

    // Pan con arrastre (solo en modo pan/zoom)
    editCanvas.on('mouse:down', function(opt) {
        const e = opt.e;
        if (!panMode) return; // Solo en modo pan/zoom

        isDragging = true;
        editCanvas.selection = false;
        lastPosX = e.clientX;
        lastPosY = e.clientY;
    });

    editCanvas.on('mouse:move', function(opt) {
        if (!panMode || !isDragging) return;
        const e = opt.e;
        const vpt = editCanvas.viewportTransform;
        vpt[4] += e.clientX - lastPosX;
        vpt[5] += e.clientY - lastPosY;
        editCanvas.requestRenderAll();
        lastPosX = e.clientX;
        lastPosY = e.clientY;
    });

    editCanvas.on('mouse:up', function(opt) {
        if (!panMode) return;
        isDragging = false;
        editCanvas.selection = true;
    });

    // Zoom con la rueda del mouse (solo cuando no se hace pan)
    editCanvas.on('mouse:wheel', function(opt) {
        opt.e.preventDefault();
        opt.e.stopPropagation();
        const pointer = editCanvas.getPointer(opt.e);
        let zoom = editCanvas.getZoom();

        // Aumentar o disminuir el zoom según la dirección del scroll
        zoom = opt.e.deltaY < 0 ? zoom * 1.1 : zoom / 1.1;

        // Calcular el zoom mínimo permitido basado en el fondo para que, 
        // cuando la imagen completa se vea en su lado más corto, no se pueda hacer más zoom out.
        if (editCanvas.backgroundImage) {
            const bg = editCanvas.backgroundImage;
            const minZoomWidth = editCanvas.getWidth() / (bg.width * bg.scaleX);
            const minZoomHeight = editCanvas.getHeight() / (bg.height * bg.scaleY);
            const minZoom = Math.max(minZoomWidth, minZoomHeight);
            if (zoom < minZoom) {
                zoom = minZoom;
            }
        }
        
        if (zoom > 20) zoom = 20;  // Zoom máximo arbitrario

        editCanvas.zoomToPoint(new fabric.Point(pointer.x, pointer.y), zoom);
        clampViewport(editCanvas);
    });

    // Cambiar el color del pincel
    document.getElementById('red-brush').addEventListener('click', () => {
        brush.color = 'red';
    });

    document.getElementById('yellow-brush').addEventListener('click', () => {
        brush.color = 'yellow';
    });

    document.getElementById('green-brush').addEventListener('click', () => {
        brush.color = '#40ff00';
    });

     // Botón para cambiar al modo de selección (salir del modo de dibujo)
     const selectModeBtn = document.getElementById('toggle-select-mode');
     selectModeBtn.addEventListener('click', () => {
         // Desactivar el modo de dibujo para poder seleccionar y mover objetos
         editCanvas.isDrawingMode = false;
         panMode = false
         editCanvas.selection = true;
 
         // Opcional: Cambiar el texto del botón para indicar el modo actual
         selectModeBtn.style.backgroundColor ='rgb(37 99 235)'

         drawModeBtn.style.backgroundColor ='rgb(59 130 246)'
         togglePanButton.style.backgroundColor ='rgb(59 130 246)'
 
         // También puedes, si lo deseas, habilitar la selección de objetos (esto ya está activado por defecto)
         
     });

     const drawModeBtn = document.getElementById('toggle-draw-mode');
     drawModeBtn.addEventListener('click', () => {
         // Desactivar el modo de dibujo para poder seleccionar y mover objetos
        panMode = false
        editCanvas.selection = false;
        editCanvas.isDrawingMode = true;
 
         // Opcional: Cambiar el texto del botón para indicar el modo actual
        drawModeBtn.style.backgroundColor ='rgb(37 99 235)'

        selectModeBtn.style.backgroundColor = 'rgb(59 130 246)'
        togglePanButton.style.backgroundColor ='rgb(59 130 246)'
         // También puedes, si lo deseas, habilitar la selección de objetos (esto ya está activado por defecto)
     });

     const togglePanButton = document.getElementById('toggle-pan-mode');
    togglePanButton.addEventListener('click', () => {
        editCanvas.isDrawingMode = false;
        editCanvas.selection = false;
        panMode = true 

        togglePanButton.style.backgroundColor ='rgb(37 99 235)'

        drawModeBtn.style.backgroundColor ='rgb(59 130 246)'
        selectModeBtn.style.backgroundColor = 'rgb(59 130 246)'

    });

    const saveBtn = document.getElementById('save-btn');
    saveBtn.addEventListener('click', function() {
        // Obtener la imagen en formato DataURL (PNG por defecto)
        const dataURL = editCanvas.toDataURL({
            format: 'png',
            quality: 1  // Calidad máxima
        });
        
        // Crear un enlace temporal para descargar la imagen
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'circuito.png'; // Nombre del archivo a descargar
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    const uploadToWebBtn = document.getElementById('upload')
    uploadToWebBtn.addEventListener('click', uploadToWeb)
}

async function uploadToWeb(){

    const bg = editCanvas.backgroundImage;
    editCanvas.setBackgroundImage(null, editCanvas.renderAll.bind(editCanvas));

    const imgURL = editCanvas.toDataURL({
        format: 'png', 
        quality: 1     
    })

    editCanvas.setBackgroundImage(bg, editCanvas.renderAll.bind(editCanvas));

    let user = getUserFromSession()

    const circuitId = document.getElementById('circuitCanvas').getAttribute('data-id')


    const raceLine = {
        user_id: userlog ? user._id : "0",
        circuit_id: circuitId,
        img: imgURL
    }
    console.log(raceLine)

    const payload = JSON.stringify(raceLine)
    console.log(payload)

    const apiData = await getAPIData(`${location.protocol}//${NODE_SERVER}create/raceline/`, "POST", payload);
    console.log("Respuesta del servidor:", apiData);


}

function clearTraces(){
    editCanvas.getObjects().forEach(function(obj) {
        if (obj.type !== 'image') {
            editCanvas.remove(obj);
        }
    });
}


function clampViewport(editCanvas) {
    const bg = editCanvas.backgroundImage;
    if (!bg) return;
    
    const canvasWidth = editCanvas.getWidth();
    const canvasHeight = editCanvas.getHeight();
    const zoom = editCanvas.getZoom();
    
    // Dimensiones efectivas del fondo (imagen) con el zoom actual
    const bgWidth = bg.width * bg.scaleX * zoom;
    const bgHeight = bg.height * bg.scaleY * zoom;
    
    const vt = editCanvas.viewportTransform; // [a, b, c, d, tx, ty]
    
    // Limitar la traslación horizontal (vt[4])
    if (vt[4] > 0) {
        vt[4] = 0;
    } else if (vt[4] < canvasWidth - bgWidth) {
        vt[4] = canvasWidth - bgWidth;
    }
    
    // Limitar la traslación vertical (vt[5])
    if (vt[5] > 0) {
        vt[5] = 0;
    } else if (vt[5] < canvasHeight - bgHeight) {
        vt[5] = canvasHeight - bgHeight;
    }
    
    editCanvas.setViewportTransform(vt);
}

// async function showRaceLine(){
//     const apiData = await getAPIData(`${NODE_SERVER}read/racelines` , 'GET')
//     console.log(apiData)

//     const imageURI = apiData[1].img

//     const imageContainer = document.getElementById('imageDisplay')
//     imageContainer.src = imageURI
// }

async function fillSelectable(){

    circuitArray = await getAPIData(`${location.protocol}//${NODE_SERVER}read/circuits` , 'GET')

    const optionsDropdown = document.getElementById('opciones')

    circuitArray.forEach(function (circuit){

        const html = `<option value="${circuit._id}">${circuit.name}</option>`

        optionsDropdown.insertAdjacentHTML('beforeend', html)
    })

}

function raceLineButtonsAssign(){
    document.getElementById('map-selection-confirm').addEventListener('click', loadCircuitImage)
}

async function loadCircuitImage(){

    const canvasContainer = document.getElementById('edit-canvas-container')
    const canvas = document.getElementById('circuitCanvas')
    const circuitID = document.getElementById('opciones').value

    if (circuitID == 0) return

    const circuit = await getAPIData(`${location.protocol}//${NODE_SERVER}read/circuit/${circuitID}`, 'GET') 
    console.log(circuitID)
    console.log(circuit)

    fabric.Image.fromURL(circuit.map, function(img) {
        // Ajusta la imagen al ancho del canvas (puedes ajustar según necesites)
        img.scaleToWidth(editCanvas.getWidth());
        // Asigna la imagen como fondo y vuelve a renderizar el canvas
        editCanvas.setBackgroundImage(img, editCanvas.renderAll.bind(editCanvas));
    });

    canvasContainer.classList.remove('__hidden')
    canvas.setAttribute('data-id', circuit._id)

    console.log(canvas)
    clearTraces()


}

  




