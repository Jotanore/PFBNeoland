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
export const API_PORT = location.port ? `:${location.port}` : ''
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
                    updateRaceLineList([])
                    fillMarketList()
                    updateUserProfile()
                }
                break
            case 'index':
                window.addEventListener('login-form-submit', onLoginComponentSubmit)
                assignIndexListeners()
                credentialsBtnManager()
                checkSignRedirectionFlag()
                userRegister()
               // userLogin()
                console.log(`Estoy en ${page[0].id}`)
                break
            case 'circuits':
                console.log(`Estoy en ${page[0].id}`)
                credentialsBtnManager()
                await getCircuitData()
                assignCircuitListeners()
                createMap()
                modalManager()
                break
            case 'events':
                console.log(`Estoy en ${page[0].id}`)
                credentialsBtnManager()
                await getEventData()
                formManager()
                fillSelectable('opciones-filtro')
                fillSelectable('opciones')
                assignEventButtons()
                modalManager()
                break
            case 'market':
                console.log(`Estoy en ${page[0].id}`)
                credentialsBtnManager()
                await getMarketData()
                formManager()
                assignMarketButtons()
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
                fillSelectable('opciones')
                activateCanvas()
            break
            case 'laptimes':
            document.getElementById("laptimeKartSelect").addEventListener("change", function() {
                const input = document.getElementById("laptimeKart");
                const selectedValue = this.value;
            
                // Cambia el placeholder según la opción seleccionada
                switch (selectedValue) {
                    case "Rental":
                        input.placeholder = "Número de kart";
                        break;
                    case "Particular":
                        input.placeholder = "Modelo de tu kart";
                        break;
                    default:
                        input.placeholder = "Selecciona una opción";
                }
            });
            credentialsBtnManager()
            createNewlaptime()
            getLapTimes()
            assignLapTimeButtons()
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

async function formManager(e){
    const page = document.getElementsByTagName('body')
    document.getElementById('form').addEventListener('submit', async function (e){
        e.preventDefault()



        const description = document.getElementById('description').value
        const sessionUser = getUserFromSession()

        const eventTitle = document.getElementById('eventName')?.value
        const eventDate = document.getElementById('eventDate')?.value
        const eventLocation = document.getElementById('opciones')?.value
        const eventMaxParticipants = document.getElementById('eventMaxParticipants')?.value

        if (eventLocation == "0") {
            alert("Selecciona un circuito.");
            return;
        }

        // if (eventDate < Date.now) {
        //     alert("Selecciona una fecha válsida.");
        //     return;
        // }

        const circuit = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/circuit/${eventLocation}`, 'GET') 
        
        const itemName = document.getElementById('itemName')?.value
        const itemPrice = document.getElementById('itemPrice')?.value
        const itemLocation = document.getElementById('itemLocation')?.value
        const itemImg = "imgs/Rotax1.jpeg"
        const terms = document.getElementById("terms")?.checked;

        if (eventLocation == "0") {
            alert("Selecciona un circuito.");
            return;
        }

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
                        user_id: sessionUser._id,
                        location: itemLocation,
                        description: description,
                        img: itemImg,
                    }
                    
                    console.log("antes de fetch", marketItem)
                    payload = JSON.stringify(marketItem)
                    console.log(payload)
                    apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/create/article`,'POST', payload);

                    const item = new MarketItem(apiData._id, apiData.user_id, apiData.article, apiData.price, apiData.location, apiData.description, apiData.img)
                    // const item = new MarketItem('',user, itemName, itemPrice, itemLocation, description, itemImg)
                    //searchParams = new URLSearchParams(item).toString()
                    console.log(apiData)
                    //fetch(`${API_PORT}create/article?${searchParams}`)


                    drawArticle(item)
                break
            case 'events':
                    payload = ''
                    apiData = ''

                    const eventObject = {
                        user_id: sessionUser._id,
                        user_username: sessionUser.username,
                        title: eventTitle,
                        date: new Date(eventDate),
                        location_id: circuit._id,
                        location: circuit.name,
                        description: description,
                        participants: [],
                        maxParticipants: eventMaxParticipants
                    }

                    console.log("antes de fetch", eventObject)
                    payload = JSON.stringify(eventObject)
                    console.log(payload)
                    apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/create/event`,'POST', payload);

                    console.log(apiData)

                    const event = new EventCard(apiData._id, apiData.title, apiData.date, apiData.user_id, apiData.description, apiData.location, apiData.participants, apiData.maxParticipants, apiData.location_id, apiData.user_username)
                    //searchParams = new URLSearchParams(event).toString()
                    console.log(event)
                    //fetch(`${API_PORT}create/event?${searchParams}`)
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

export async function getAPIData(apiURL, method, data, filters) {
    let apiData
    try {
      let headers = new Headers()
      headers.append('Content-Type', 'application/json')
      headers.append('Access-Control-Allow-Origin', '*')
      if (data) {
        headers.append('Content-Length', String(JSON.stringify(data).length))
      }

      if (filters) {
        headers.append('Filters', filters)
      }

      if (isUserLoggedIn()) {
        const userData = getUserFromSession()
        headers.append('Authorization', `Bearer ${userData?.token}`)
      }
      apiData = await simpleFetch(apiURL, {
        // Si la petición tarda demasiado, la abortamos
        signal: AbortSignal.timeout(10000),
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
    return userData?.token
  }

  async function fillSelectable(dropdown){

    circuitArray = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/circuits` , 'GET')

    let selectDropdown = document.getElementById(`${dropdown}`)

    circuitArray.forEach(function (circuit){

        const html = `<option value="${circuit._id}">${circuit.name}</option>`

        selectDropdown.insertAdjacentHTML('beforeend', html)
    })

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
        // await fetch(`${API_PORT}update/user/${storedUser.id}/PUT/${newUser}`)

        
        console.log("antes de fetch", newUser)
        const payload = JSON.stringify(newUser)
        console.log("payload",payload)
        const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/update/user/${storedUser._id}`, "PUT", payload);
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
        // fetch(`${API_PORT}update/user?${searchParams}`)

        e.target.reset();
    })
}

// async function fillRaceLinesList(){

//     const user = getUserFromSession()
//     console.log(user)

//     const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/racelines/${user._id}` , 'GET')
//     console.log(apiData)
//     apiData.forEach(async function (raceline){
       
//         const lineCircuit = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/circuit/${raceline.circuit_id}`, 'GET')
//         const html = `<li>Linea:${lineCircuit.name} Fecha: XD</li>`

//         document.getElementById('race-line-list').insertAdjacentHTML('afterbegin', html)
//     })

    
    
// }

async function fillMarketList(){

    const user = getUserFromSession()

    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/articles/${user._id}` , 'GET')
    apiData.forEach(function (article){
       
        const html = `<li>Articulo:${article.article} Fecha: ${article.price}</li>`

        document.getElementById('article-list').insertAdjacentHTML('afterbegin', html)
    })

    
    
}

async function fillEventList(){

    const user = getUserFromSession()

    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/events/${user._id}` , 'GET')
    apiData.forEach(function (event){
       
        const html = `<li>Evento:${event.title} Fecha: ${event.date}</li>`

        document.getElementById('event-list').insertAdjacentHTML('afterbegin', html)
    })
    
}

async function fillRaceLinesList(){



    const user = getUserFromSession()

    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/racelines/${user._id}` , 'GET')
    let racelines = []
    // apiData.forEach(async function (raceline){
       
    //     const lineCircuit = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/circuit/${raceline.circuit_id}`, 'GET')
    //     // const html = `<li>Linea:${lineCircuit.name} Fecha: XD</li>`
    //     raceline.circuitName = lineCircuit.name
    //     raceline.img = ''
    //     racelines.push(raceline)
    //     // document.getElementById('race-line-list').insertAdjacentHTML('afterbegin', html)
    // })
    // updateRaceLineList(racelines)


    await Promise.all(apiData.map(async function (raceline) {
        const lineCircuit = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/circuit/${raceline.circuit_id}`, 'GET')
        // const html = `<li>Linea:${lineCircuit.name} Fecha: XD</li>`
        raceline.circuitName = lineCircuit.name
        raceline.img = ''
        racelines.push(raceline)
        return lineCircuit
        // document.getElementById('race-line-list').insertAdjacentHTML('afterbegin', html)
    }))
    updateRaceLineList(racelines)
    
}

function updateRaceLineList(racelines) {
    // Propagate article list to article-list component
    console.log(racelines[0],Array.isArray(racelines) ,JSON.stringify(racelines[0]))
    document.getElementById('racelines-list')?.setAttribute('racelines', JSON.stringify(racelines))
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
        let apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/create/user`,'POST', payload );
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
        // fetch(`${API_PORT}create/user?${searchParams}`)



        
        payload = JSON.stringify(userFill)
        console.log(payload)
        apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/update/user/${apiData._id}`,'PUT', payload );

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

// function userLogin() {
//     document.getElementById('login-form').addEventListener('submit', async function (event) {
//         event.preventDefault()

//         const loginCredentials = {
//             email: document.getElementById('login-email').value,
//             password: document.getElementById('login-password').value
//         }

//         if (loginCredentials.email !== '' && loginCredentials.password !== '') {
//             const payload = JSON.stringify(loginCredentials)
//             const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/login`, 'POST', payload)
        
//             if (!apiData) {
//               // Show error
//               alert('El usuario no existe')
//             } else {
//               if ('_id' in apiData
//                 && 'name' in apiData
//                 && 'email' in apiData
//                 && 'token' in apiData
//                 && 'role' in apiData) {
//                 const userData = /** @type {User} */(apiData)
//                 // store.user.login(userData, setSessionStorageFromStore)
//                 // setSessionStorageFromStore()
//                 updateSessionStorage(userData)
//                 alert('Bienvenido')
//                 window.location.href = 'profile.html'
//               } else {
//                 alert('Usuario no encontrado')
//               }
//             }
//           }

// })
// }


        // const users = await getAPIData(`${location.protocol}//${API_PORT}read/users`, 'GET')
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


/**
 * Handles a successful login from the login component
 * @param {CustomEvent} customEvent - The user data returned from the API
 * @returns void
 */
function onLoginComponentSubmit(customEvent) {
    const apiData = customEvent.detail
    console.log(`DESDE FUERA DEL COMPONENTE:`, apiData);

    if (!apiData) {
        // Show error
        alert('El usuario no existe')
        return
      } 
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
        alert('Estructura inválida')
      }
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
        circuitArray = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/circuits` , 'GET')
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
                                    <p>${circuit.description}</p>
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

function assignCircuitListeners(){
    const rangeInput = document.getElementById('distance-range');
    const valueDisplay = document.getElementById('value');

    rangeInput.addEventListener('input', function() {
        valueDisplay.textContent = rangeInput.value; // Muestra el valor actual del control deslizante
    });
}

   
/*=================================EVENTS===========================================*/

/**
 * Uses a JSON to get the events
 * Creates a new EventCard Object with the info
 * Pushes them to store
 */
async function getEventData(filters){
    document.getElementById('__event-container').innerHTML = ''
    const eventArray = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/events` , 'GET',undefined ,filters)
    console.log(eventArray)
    eventArray.forEach(function (/** @type {EventCard} */ event){
        drawEvent(event)
    })
}    

async function drawEvent(event){
    const date = new Date(event.date)
    const eventFrame = document.getElementById('__event-container')
        const html =
                `<div class="bg-white shadow-md rounded-lg overflow-hidden flex items-center p-5 mb-4 border border-gray-200 w-full cursor-pointer event-card">
                <div class="flex flex-col flex-1">
                <h3 class="text-xl font-bold text-gray-800 truncate">${event.title}</h3>
                <p data-id="${event.location}" class="text-sm text-gray-600">${date.toLocaleDateString("es-ES")} - ${event.location} - ${event.user_username}</p>
                <p class="text-gray-700 text-sm my-2 line-clamp-2">${event.description}</p>
                </div>
                <p class="px-4"><span class="participant-count">${event.participants.length}</span>/${event.maxParticipants} inscritos</p>
                <button data-id="${event._id}" class="border-2 border-black bg-green-200 hover:bg-green-500 text-white font-bold py-1 px-3 m-4 rounded join-event">
                    Me apunto
                </button>
                <button data-id="${event._id}" class="border-2 border-black bg-yellow-200 hover:bg-yellow-500 text-white font-bold py-1 px-3 m-4 rounded forfeit-event">
                    Desapuntarse
                </button>
                <button data-id="${event._id}" class="border-2 border-black bg-gray-400 hover:bg-red-500 text-white font-bold py-1 px-3 rounded delete-event">
                    Delete
                </button>
                </div>`
        eventFrame?.insertAdjacentHTML('afterbegin', html)
        
    const lastCard = eventFrame.firstElementChild;
    const deleteBtn = lastCard.querySelector('.delete-event');
    const joinBtn = lastCard.querySelector('.join-event');
    const forfeitBtn = lastCard.querySelector('.forfeit-event');

    joinBtn.addEventListener('click', joinEvent)
    forfeitBtn.addEventListener('click', forfeitEvent)
    deleteBtn.addEventListener('click', deleteEventCard);

    if (event.participants.includes(getUserFromSession()._id)){
        joinBtn.classList.add('hidden')
        forfeitBtn.classList.remove('hidden')
    }else{
        joinBtn.classList.remove('hidden')
        forfeitBtn.classList.add('hidden')
    }

    lastCard.addEventListener('click', async function(e){
        if (e.target.classList.contains('delete-event' || 'join-event')) return;
        const eventUpdated = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/event/${event._id}`, 'GET');
        console.log(eventUpdated)
        eventModal(eventUpdated);
    });
}

async function joinEvent(event){
    event.stopPropagation()

    const eventId = event.target.getAttribute('data-id');
    const userId = getUserFromSession()._id

    const card = event.target.closest('.event-card');

    const joinBtn = card.querySelector('.join-event');
    const forfeitBtn = card.querySelector('.forfeit-event');

    console.log(joinBtn, forfeitBtn)

    const payload = JSON.stringify({
        user_id: userId
    })

    console.log(payload)

    try {
        const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/join/event/${eventId}`, 'POST', payload);
        console.log("Respuesta del servidor:", apiData);
    } catch (error) {
        console.error("Error eliminando el evento:", error);
    }

    updateParticipantCount(eventId, 1)

    
    joinBtn.classList.add('hidden')
    forfeitBtn.classList.remove('hidden')

}

async function forfeitEvent(event){

    event.stopPropagation()

    const card = event.target.closest('.event-card');

    const joinBtn = card.querySelector('.join-event');
    const forfeitBtn = card.querySelector('.forfeit-event');


    const eventId = event.target.getAttribute('data-id');
    const userId = getUserFromSession()._id

    const payload = JSON.stringify({
        user_id: userId
    })

    console.log(payload)

    try {
        const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/forfeit/event/${eventId}`, 'POST', payload);
        console.log("Respuesta del servidor:", apiData);
    } catch (error) {
        console.error("Error eliminando el evento:", error);
    }

    updateParticipantCount(eventId, -1)

    joinBtn.classList.remove('hidden')
    forfeitBtn.classList.add('hidden')
}

async function deleteEventCard(event) {
    
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
        const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/delete/event/${eventId}`, 'DELETE');
        console.log("Respuesta del servidor:", apiData);
    } catch (error) {
        console.error("Error eliminando el evento:", error);
    }
}

function updateParticipantCount(eventId, count) {
    const eventCard = document.querySelector(`.event-card button[data-id="${eventId}"]`)?.closest('.event-card');
    console.log(eventCard)
    if (eventCard) {
        let participantCountElement = Number(eventCard.querySelector('.participant-count').textContent);
        console.log(participantCountElement);
        participantCountElement += count;
        eventCard.querySelector('.participant-count').textContent = participantCountElement;
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
async function eventModal(event){
    modalOpener()
    const users = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/users/`, 'GET')

    const eventCreator = users.find(user => user._id === event.user_id)

    const participantsArray = users
    .filter(user => event.participants.includes(user._id))
    .map(user => ( user.username));

    console.log(participantsArray)

    const modalContent = document.getElementById('modal-content')
    console.log(modalContent)
    console.log(event)
    if (modalContent){
    modalContent.innerHTML = `<ul class="space-y-3 text-gray-800 font-medium">
                                <li class="text-xl font-semibold">${event.title}</li>
                                <li class="text-gray-600">Creado por: <span class="font-semibold">${eventCreator.username}</span></li>
                                <li class="text-gray-600">Fecha: <span class="font-semibold">${event.date}</span></li>
                                <li class="text-gray-600">Descripción: <span class="font-semibold">${event.description}</span></li>
                                <li class="text-gray-600">Ubicación: <span class="font-semibold">${event.location}</span></li>
                                <li class="text-gray-600">Participantes: 
                                    <span class="font-semibold">${participantsArray.join(', ')}</span>
                                </li>
                                <li class="text-gray-600">Máximo de Participantes: <span class="font-semibold">${event.maxParticipants}</span></li>
                            </ul>`
    }
}

function openNewEventForm(){
    if (!userlog){
        alert("Debes iniciar sesión para publicar.");
    }else{
    document.getElementById('new-event-form').classList.remove('__hidden')
    }
}

function closeNewEventForm(){
    document.getElementById('form').reset()
    document.getElementById('new-event-form').classList.add('__hidden')
}

async function filterEvents(e){

    e.preventDefault()

    const circuit = document.getElementById('opciones-filtro').value
    const minDate = document.getElementById('filterEventDate1').value
    const maxDate = document.getElementById('filterEventDate2').value

    if (minDate > maxDate){
        alert("La fecha final debe ser posterior a la inicial.");
    }

    const filters = {
        circuit: circuit,
        minDate: minDate,
        maxDate: maxDate
    }
    const payload = JSON.stringify(filters)
    console.log("he llegado a filterEvents: ", payload)
    await getEventData(payload)

}



function assignEventButtons(){
    document.getElementById('new-event-form-btn').addEventListener('click', openNewEventForm)
    document.getElementById('new-event-close').addEventListener('click', closeNewEventForm)
    document.getElementById('filter-btn').addEventListener('click', filterEvents)
}

/*=================================MARKET===========================================*/

/**
 * Uses a JSON to get the marketItems
 * Creates a new MarketItem Object with the info
 * Pushes them to store
 */
   async function getMarketData(){
        const marketArray = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/articles` , 'GET')
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
        const itemCreator = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/user/${item.user_id}`, 'GET')
        const marketFrame = document.getElementById('__market-container')
        const html = `<div class="bg-white shadow-md rounded-lg overflow-hidden flex items-center p-5 mx-4 mb-4 cursor-pointer border border-gray-200">
    <!-- Imagen del artículo -->
    <div class="w-36 h-36 flex-shrink-0 rounded-lg overflow-hidden border">
        <img src="${item.img}" alt="${item.article}" class="w-full h-full object-cover">
    </div>

    <!-- Contenido de la tarjeta -->
    <article class="flex flex-col justify-between flex-1 ml-5">
        <!-- Información principal -->
        <div>
            <h3 class="text-xl font-bold text-gray-800 truncate">${item.article}</h3>
            <p class="text-sm text-gray-600">${itemCreator.username} - ${item.location}</p>
        </div>

        <!-- Descripción -->
        <p class="text-gray-700 text-sm my-2 line-clamp-2">${item.description}</p>

        <!-- Precio y botones -->
        <div class="flex justify-between items-center mt-3">
            <span class="text-lg font-bold text-amber-500">${item.price}€</span>
            <button data-id="${item._id}" class="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition delete-item">
                Eliminar
            </button>
        </div>
    </article>
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
    const marketId = event.target.getAttribute('data-id');
    console.log(marketId)

    event.stopPropagation()
    const card = event.target.closest('.market-card');
    if (card) {
        card.remove(); // Elimina la tarjeta del DOM
    }

    try {
        const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/delete/article/${marketId}`, 'DELETE');
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
async function marketModal(item){
    const itemCreator = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/user/${item.user_id}`, 'GET')
    modalOpener()
    const modalContent = document.getElementById('modal-content')

    if (modalContent){
    modalContent.innerHTML = `<ul class="space-y-4 text-gray-800">
                                    <li class="text-2xl font-bold text-gray-900">${item.article}</li>
                                    <li class="text-gray-600"><span class="font-semibold">Vendedor:</span> ${itemCreator.username}</li>
                                    <li class="text-gray-600">
                                        <span class="font-semibold">Ubicación:</span>
                                        <a href="${item.location}" class="text-blue-500 hover:underline">${item.location}</a>
                                    </li>
                                    <li class="flex justify-center">
                                        <img src="${item.img}" alt="Imagen de ${item.article}" class="w-[250px] h-auto rounded-lg shadow-md border border-gray-300">
                                    </li>
                                    <li class="text-gray-700"><span class="font-semibold">Descripción:</span> ${item.description}</li>
                                    <li class="text-lg font-semibold text-green-600">Precio: ${item.price}€</li>
                                </ul>`
    }
}

function openNewMarketForm(){
    if (!userlog){
        alert("Debes iniciar sesión para publicar.");
    }else{
    document.getElementById('new-item-form').classList.remove('__hidden')
    }
}

function closeNewMarketForm(){
    document.getElementById('form').reset()
    document.getElementById('new-item-form').classList.add('__hidden')
}
function assignMarketButtons(){
    document.getElementById('new-item-form-btn').addEventListener('click', openNewMarketForm)
    document.getElementById('new-item-close').addEventListener('click', closeNewMarketForm)
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
    const forumArray = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/forum-topics` , 'GET')
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

    // Cargar la imagen de fondo y bloquearla
    fabric.Image.fromURL('./imgs/kotar.jpg', function(img) {
        img.scaleToWidth(1000);
        img.selectable = false;
        img.evented = false;
        editCanvas.setBackgroundImage(img, editCanvas.renderAll.bind(editCanvas));
    });

    //Pincel
    const brush = new fabric.PencilBrush(editCanvas);
    editCanvas.freeDrawingBrush = brush;
    brush.color = '#40ff00';
    brush.width = 3;
    editCanvas.isDrawingMode = true;

    // Variables para el panning
    let isDragging = false;
    let lastPosX = 0;
    let lastPosY = 0;
    let panMode = false;
    let straightLineMode = false
    let isDrawing = false; // Variable para controlar si estamos dibujando
    let line; // Variable para almacenar la línea

    // Botón limpiar solo trazos
    const clearButton = document.getElementById("clear");
    clearButton.addEventListener("click", clearTraces);

    // Crear una flecha en el canvas
    

    const apexButton = document.getElementById("apex");
    apexButton.addEventListener("click", function() {
        const triangle = new fabric.Triangle({
            left: 40,
            top: 50,
            width: 40,
            height: 40,
            fill: 'white',
            stroke: 'blue', 
            strokeWidth: 5,
        });
        editCanvas.add(triangle);

        //TODO, FUNCION SELECT
        editCanvas.isDrawingMode = false;
        panMode = false
        editCanvas.selection = true;

        selectModeBtn.style.backgroundColor ='rgb(37 99 235)'

        drawModeBtn.style.backgroundColor ='rgb(59 130 246)'
        togglePanButton.style.backgroundColor ='rgb(59 130 246)'
        redBrushBtn.style.backgroundColor = 'rgb(59 130 246)'
        yellowBrushBtn.style.backgroundColor = 'rgb(59 130 246)'
        greenBrushBtn.style.backgroundColor = 'rgb(59 130 246)'
 
    });

    document.getElementById('text').addEventListener('click', function () {
        const text = new fabric.IText('Nuevo Texto', {
            left: 100,
            top: 100,
            fontSize: 36,
            fill: 'white',
            stroke: 'black',
            strokeWidth: 1,
            fontFamily: 'Arial',
            editable: true
        });
    
        editCanvas.add(text);
        editCanvas.setActiveObject(text);
        text.enterEditing();
    });


    // ON MOUSEDOWN
    editCanvas.on('mouse:down', function(opt) {
        const e = opt.e;

        //panmode
        if (panMode) {

        isDragging = true;
        editCanvas.selection = false;
        lastPosX = e.clientX;
        lastPosY = e.clientY;
        }
        
        //straightlinemode
        if (straightLineMode){
            isDragging = true;
            isDrawing = true;
            editCanvas.isDrawingMode = false
    
            const pointer = editCanvas.getPointer(e); // Obtener coordenadas del mouse
            const points = [pointer.x, pointer.y, pointer.x, pointer.y]; // Coordenadas iniciales de la línea
    
            line = new fabric.Line(points, {
                stroke: '#40ff00',    // Color de la línea
                strokeWidth: 3,     // Grosor de la línea
                selectable: false,  // No seleccionable mientras se dibuja
                evented: false      // No reaccionar a eventos mientras se dibuja
            });
    
            editCanvas.add(line); // Agregar la línea al canvas
        }
        
    });

    //ON MOUSEMOVE
    editCanvas.on('mouse:move', function(opt) {

        const e = opt.e;
        //panmode
        if (panMode && isDragging){
            
            const vpt = editCanvas.viewportTransform;
            vpt[4] += e.clientX - lastPosX;
            vpt[5] += e.clientY - lastPosY;
            editCanvas.requestRenderAll();
            lastPosX = e.clientX;
            lastPosY = e.clientY;
        }


        //straightlinemode
        if (straightLineMode && isDragging) {
            const pointer = editCanvas.getPointer(e); 
            console.log(pointer) 
            line.set({ x2: pointer.x, y2: pointer.y });
            editCanvas.renderAll();
        }
        
    });
        

    // ON MOUSEUP
    editCanvas.on('mouse:up', function(opt) {
        if (panMode){
            isDragging = false;
            clampViewport(editCanvas);
        }

        if(straightLineMode){

            isDragging = false; 
            line.set({ selectable: true, evented: true }); 

        }


    });

    // Zoom con la rueda del mouse 
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

    // Cambiar color del pincel
    const redBrushBtn = document.getElementById('red-brush')
    redBrushBtn.addEventListener('click', () => {
        brush.color = 'red';

        panMode = false
        editCanvas.selection = false;
        editCanvas.isDrawingMode = true;
 
        drawModeBtn.style.backgroundColor ='rgb(37 99 235)'
        redBrushBtn.style.backgroundColor = 'rgb(37 99 235)'

        yellowBrushBtn.style.backgroundColor = 'rgb(59 130 246)'
        greenBrushBtn.style.backgroundColor = 'rgb(59 130 246)'
        selectModeBtn.style.backgroundColor = 'rgb(59 130 246)'
        togglePanButton.style.backgroundColor ='rgb(59 130 246)'
    });

    const yellowBrushBtn = document.getElementById('yellow-brush')
    yellowBrushBtn.addEventListener('click', () => {
        brush.color = 'yellow';

        panMode = false
        editCanvas.selection = false;
        editCanvas.isDrawingMode = true;
 
        drawModeBtn.style.backgroundColor ='rgb(37 99 235)'
        yellowBrushBtn.style.backgroundColor = 'rgb(37 99 235)'

        redBrushBtn.style.backgroundColor = 'rgb(59 130 246)'
        greenBrushBtn.style.backgroundColor = 'rgb(59 130 246)'
        selectModeBtn.style.backgroundColor = 'rgb(59 130 246)'
        togglePanButton.style.backgroundColor ='rgb(59 130 246)'
    });

    const greenBrushBtn = document.getElementById('green-brush')
    greenBrushBtn.style.backgroundColor ='rgb(37 99 235)'
    greenBrushBtn.addEventListener('click', () => {
        brush.color = '#40ff00';
        panMode = false
        editCanvas.selection = false;
        editCanvas.isDrawingMode = true;
 

        drawModeBtn.style.backgroundColor ='rgb(37 99 235)'
        greenBrushBtn.style.backgroundColor = 'rgb(37 99 235)'

        redBrushBtn.style.backgroundColor = 'rgb(59 130 246)'
        yellowBrushBtn.style.backgroundColor = 'rgb(59 130 246)'
        selectModeBtn.style.backgroundColor = 'rgb(59 130 246)'
        togglePanButton.style.backgroundColor ='rgb(59 130 246)'
    });

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
        redBrushBtn.style.backgroundColor = 'rgb(59 130 246)'
        yellowBrushBtn.style.backgroundColor = 'rgb(59 130 246)'
        greenBrushBtn.style.backgroundColor = 'rgb(59 130 246)'
 
         // También puedes, si lo deseas, habilitar la selección de objetos (esto ya está activado por defecto)
         
     });

     const drawModeBtn = document.getElementById('toggle-draw-mode');
     drawModeBtn.style.backgroundColor ='rgb(37 99 235)'
     drawModeBtn.addEventListener('click', () => {
         // Desactivar el modo de dibujo para poder seleccionar y mover objetos
        panMode = false
        editCanvas.selection = false;
        editCanvas.isDrawingMode = true;
 
        switch (brush.color) {
            case 'red':
                redBrushBtn.style.backgroundColor = 'rgb(37 99 235)'
                break;
            case 'yellow':
                yellowBrushBtn.style.backgroundColor = 'rgb(37 99 235)'
                break;
            case '#40ff00':
                greenBrushBtn.style.backgroundColor = 'rgb(37 99 235)'
                break;
        }
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
        redBrushBtn.style.backgroundColor = 'rgb(59 130 246)'
        yellowBrushBtn.style.backgroundColor = 'rgb(59 130 246)'
        greenBrushBtn.style.backgroundColor = 'rgb(59 130 246)'

    });
    

    const straightLineBtn = document.getElementById('straight-line');
    straightLineBtn.addEventListener('click', () => {
        straightLineMode = true
        editCanvas.selection = false;
    })





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

    document.addEventListener('keydown', function(event) {
        if (event.key === "Delete") {
          if (editCanvas.getActiveObject()) {
            editCanvas.remove(editCanvas.getActiveObject());
          } else if (editCanvas.getActiveObjects()) {
            const selectedObjects = editCanvas.getActiveObjects();
            selectedObjects.forEach(obj => {
              editCanvas.remove(obj);
            });
          }
          editCanvas.renderAll();
        }
      });
}

async function uploadToWeb(){

    if (!userlog){
        alert("Debes iniciar sesión para guardar tu trazada en perfil.");
    }else{
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

        const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/create/raceline/`, "POST", payload);
        console.log("Respuesta del servidor:", apiData);
    }


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
//     const apiData = await getAPIData(`${API_PORT}read/racelines` , 'GET')
//     console.log(apiData)

//     const imageURI = apiData[1].img

//     const imageContainer = document.getElementById('imageDisplay')
//     imageContainer.src = imageURI
// }


function raceLineButtonsAssign(){
    document.getElementById('map-selection-confirm').addEventListener('click', loadCircuitImage)
}

async function loadCircuitImage(){

    const canvasContainer = document.getElementById('edit-canvas-container')
    const canvas = document.getElementById('circuitCanvas')
    const circuitID = document.getElementById('opciones').value

    if (circuitID == 0) return

    const circuit = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/circuit/${circuitID}`, 'GET') 
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

/*===============================LAPTIMES=====================*/

async function getLapTimes(){
    const lapTimeArray = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/laptimes` , 'GET')
    lapTimeArray.forEach(function (/** @type {LapTime} */ laptime){
            drawLapTimes(laptime)

    })
} 


async function drawLapTimes(laptime){
    console.log(laptime)
    // const lapTimeCreator = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/user/${item.user_id}`, 'GET')
    const lapTimeFrame = document.getElementById('laptime-table-body')
                const html = `
                <tr class="hover:bg-gray-50">
                        <td class="border border-gray-300 px-4 py-2">${laptime.circuit}</td>
                        <td class="border border-gray-300 px-4 py-2">0.55,233</td>
                        <td class="border border-gray-300 px-4 py-2">${laptime.lapCondition}</td>
                        <td class="border border-gray-300 px-4 py-2">${laptime.kartType}</td>
                        <td class="border border-gray-300 px-4 py-2">${laptime.kartInfo}</td>
                        <td class="border border-gray-300 px-4 py-2">${laptime.lapTimeDate}</td>
                    </tr>`
lapTimeFrame?.insertAdjacentHTML('afterbegin', html)

const lastCard = lapTimeFrame.firstElementChild;
// const deleteBtn = lastCard.querySelector('.delete-item');
// deleteBtn.addEventListener('click', deleteMarketCard);

// lastCard.addEventListener('click', function(e){
//     // If click on delete button return
//     if (e.target.classList.contains('delete-item')) return;
//     marketModal(item); // O bien, openMarketModal(item)
// });
}


function createNewlaptime(){
    document.getElementById('laptime-form').addEventListener('submit', async function (e){
        e.preventDefault()

        const sessionUser = getUserFromSession()
        const user = sessionUser._id

        const circuit = document.getElementById('laptimeCircuitName')?.value
        const laptimeDate = document.getElementById('laptimeDate')?.value
        const kartType = document.getElementById('laptimeKartSelect')?.value
        const kartInfo = document.getElementById('laptimeKart')?.value
        const lapCondition = document.getElementById('laptimeConditions')?.value

        const timeSheet = 'img'
        const lapLink = document.getElementById('laptimelink')?.value

        const terms = document.getElementById("terms")?.checked;


        if (!terms) {
            alert("Debes aceptar las normas para publicar.");
            return;
        }

        const lapTime = {
            user_id: user,
            circuit: circuit,
            lapTimeDate: laptimeDate,
            kartType: kartType,
            kartInfo: kartInfo,
            lapCondition: lapCondition,
            timeSheet: timeSheet,
            lapLink: lapLink
        }

        console.log("antes de fetch", lapTime)
        const payload = JSON.stringify(lapTime)
        console.log(payload)
        const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/create/laptime`,'POST', payload);


})

}

function openNewLapTimeForm(){
    if (!userlog){
        alert("Debes iniciar sesión para publicar.");
    }else{
    document.getElementById('new-laptime-form').classList.remove('__hidden')
    }
}

function closeNewLapTimeForm(){
    document.getElementById('laptime-form').reset()
    document.getElementById('new-laptime-form').classList.add('__hidden')
}


function assignLapTimeButtons(){
    document.getElementById('new-laptime-form-btn').addEventListener('click', openNewLapTimeForm)
    document.getElementById('new-laptime-close').addEventListener('click', closeNewLapTimeForm)
}
  




