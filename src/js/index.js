// @ts-nocheck
'use strict'
import {Circuit, EventCard, ForumCard} from '../classes/classes.js'
import {MarketItem} from '../classes/classes.js'
import { store } from './store/redux.js';

/**
 * @type {number[]}
 */
let userCoords = null;
let map  
const NODE_SERVER = `http://127.0.0.1:6431/`

document.addEventListener('DOMContentLoaded', async () => {

    const page = document.getElementsByTagName('body')
    const modalCloseBtn = document.getElementById('modal-close')
    modalCloseBtn?.addEventListener('click', modalCloser)

    await setUserCoords();
    switch (page[0].id){
            case 'index':
                console.log(`Estoy en ${page[0].id}`)
                break
            case 'circuits':
                console.log(`Estoy en ${page[0].id}`)
                await getCircuitData()
                await showCircuitCard()
                createMap()
                break
            case 'events':
                console.log(`Estoy en ${page[0].id}`)
                await getEventData()
                formManager()
                showEventCard()
                modalBuilder()
                break
            case 'market':
                console.log(`Estoy en ${page[0].id}`)
                await getMarketData()
                formManager()
                showMarketCard()
                modalBuilder()
                break
            case 'forum':
                console.log(`Estoy en ${page[0].id}`)
                await getForumData()
                showForumCard()
                break
    }

})


/*=================================HOME===============================================*/



function modalBuilder(){
    const page = document.getElementsByTagName('body')
    switch (page[0].id){
        case 'index':
            break
        case 'circuits':
            circuitModalBinder()
            break
        case 'events':
            eventModalBinder()
            break
        case 'market':
            marketModalBinder()
            break
        case 'forum':
            console.log(`Estoy en ${page[0].id}`) 
            break
    }
    


}

function marketModalBinder(){
    let j
    const modalOpenbtns = document.getElementsByClassName('modal-open')
    const marketInfo = store.getAllMarketArticles()
    j = 0
    for (let i of modalOpenbtns){
        /** @type {HTMLElement} */(i).addEventListener('click', marketModal.bind(i,marketInfo[j] ))
        j++
    } 
}

function eventModalBinder(){
    let j
    const modalOpenbtns = document.getElementsByClassName('modal-open')
    const eventInfo = store.getAllEvents()
    j = 0
    for (let i of modalOpenbtns){
        /** @type {HTMLElement} */(i).addEventListener('click', eventModal.bind(i,eventInfo[j] ))
        j++
    }
}

function circuitModalBinder(){
    let j
    const modalOpenbtns = document.getElementsByClassName('modal-open')
    const circuitInfo = store.getAllCircuits()
    j = 0
    for (let i of modalOpenbtns){
        /** @type {HTMLElement} */(i).addEventListener('click', circuitModal.bind(i,circuitInfo[j] ))
        j++
    } 
}

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

function formManager(e){
    const page = document.getElementsByTagName('body')
    document.getElementById('form').addEventListener('submit', function (e){
        e.preventDefault()


        const description = document.getElementById('description').value
        const user = 'place holder'

        const eventTitle = document.getElementById('eventName')?.value
        const eventDate = document.getElementById('eventDate')?.value
        
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
        switch (page[0].id){
            case 'market':
                    const item = new MarketItem(user, itemName, itemPrice, itemLocation, description, itemImg)
                    store.createMarketArticle(item)
                    console.log(item)
                    showMarketCard()
                break
            case 'events':
                    const event = new EventCard(user, eventTitle, eventDate, description)
                    store.createEvent(event)
                    console.log(event)
                    showEventCard()
                break    
            
        }

        event.target.reset();
    })
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
    modalContent.innerHTML = `<ul>
                                <li>${circuit.name}	</li>
                                <li><a href="${circuit.location}">Ubicación</a></li>
                                <li class="w-[200px] h-auto"><img src="${circuit.map}"></li>
                                <li><a href="${circuit.url}">WebLink</a></li>
                                <li>${circuit.description}</li>
                                <li>Mejor tiempo KH:${circuit.bestlap}</li>
                                <li>Precio: ${circuit.prices}</li>
                            </ul>`
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
        const API_CIRCUITS = 'api/get.circuits.json'
        const apiCircuit = await fetch(NODE_SERVER)
        /** @type {Circuit[]} */
        // Convert to array
        const circuitArray = await apiCircuit.json();
        //Iterate Array, create the Circuit Object and push to store
        circuitArray.forEach(function (/** @type {Circuit} */ a){
            const circuito = new Circuit(a.id, a.name, a.distance, a.location, a.url, a.description, a.bestlap, a.prices, a.map)
            store.createCircuit(circuito)
        })
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

     
   /**
    * Function that creates the circuit cards and rearranges them by distance to user
    * Calls modalBuilder to assign info to modal
    */
    async function showCircuitCard(){
        // Get all circuits from store
        const circuitArray = store.getAllCircuits()
        // Waits for getUserToCircuitDistance to get the distance to each circuit and stores it on circuit.distance
        await circuitArray.forEach(async function (/** @type {Circuit} */ circuit){
            circuit.distance = await getUserToCircuitDistance(circuit.location)
        })
        // Sorts circuits by distance to user
        circuitArray.sort(function (a, b) {
            return a.distance - b.distance;
        });
        const circuitFrame = document.getElementById('card-container')
        // Creates the circuit cards and appends them
        circuitArray.forEach(async function (/** @type {Circuit} */ circuit){            
            const html = `<article class="mb-5 circuit-card zoom-to-marker" data-lat="${circuit.location.latitude}" data-lng="${circuit.location.longitude}">
                                <div class="bg-purple-200 min-h-12 max-h-24 w-full flex items-center ">
                                    <span class="mr-4 pl-2">${circuit.name}</span>
                                    <span class="mr-4 pl-2 ">${circuit.distance}Km</span>
                                    <button class="mr-4 pl-2 modal-open">Ver más</button>
                                </div>
                            </article>`
        circuitFrame?.insertAdjacentHTML('beforeend', html)
        })
        
        modalBuilder()
        bindCircuitCardsFocus()
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
            const coords = [40.187,-4.504]

            // @ts-expect-error External declaration
            map = L.map('map').setView([40.187,-4.504], 6);
            // @ts-expect-error External declaration
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                subdomains: ['a', 'b', 'c'],
                keepBuffer: 8
            }).addTo(map);
            

            const circuitList = store.getAllCircuits()
            
            
            for (let circuit of circuitList){
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

   
/*=================================EVENTS===========================================*/

/**
 * Uses a JSON to get the events
 * Creates a new EventCard Object with the info
 * Pushes them to store
 */
async function getEventData(){
    // Obtain data via JSON
    const API_EVENTS = 'api/get.events.json'
    const apiEvents = await fetch(API_EVENTS)
    /** @type {EventCard[]} */
    // Convert to array
    const eventArray = await apiEvents.json();
    // Create EventCard Object and push to store
    eventArray.forEach(function (/** @type {EventCard} */ a){
        const event = new EventCard(a.title, a.date, a.user, a.description)
        store.createEvent(event)
    })
}    

/**
* Obtains the events via store
* Creates the event cards
* @param {EventCard} event
*/
function showEventCard(event){
    // Get all events from store
    const eventArray = store.getAllEvents()
    // Creates the event cards
    eventArray.forEach(function (/** @type {EventCard} */ event){
        const eventFrame = document.getElementById('__event-container')
        const html =
                `<div class="bg-purple-100 h-24 mx-4 mb-4 flex items-center justify-center modal-open">
                    <span class="mr-4 pl-2">${event.title}</span>
                    <span class="mr-4 pl-2">${event.date}</span>
                    <span class="mr-4 pl-2">${event.user}</span>
                    <span class="mr-4 pl-2">${event.description}</span>
                </div>`
        eventFrame?.insertAdjacentHTML('afterbegin', html)
        
    })
}



/*=================================MARKET===========================================*/

/**
 * Uses a JSON to get the marketItems
 * Creates a new MarketItem Object with the info
 * Pushes them to store
 */
   async function getMarketData(){
        //Get the info via JSON
        const API_MARKET = 'api/get.articles.json'
        const apiMarket = await fetch(API_MARKET)
        /** @type {MarketItem[]} */
        // Convert to array
        const marketArray = await apiMarket.json();
        //Iterate Array, create the MarketItem Object and push to store
        marketArray.forEach(function (/** @type {MarketItem} */ a){
            const item = new MarketItem(a.id, a.user, a.article, a.price, a.location, a.description, a.img)
            store.createMarketArticle(item)
        })
   } 

/**
* Obtains the market items via store
* Creates the market item cards
* @param {MarketItem} item
*/
   function showMarketCard(){
    // Get all marketItems from store
    const marketList = store.getAllMarketArticles()
    console.log(marketList)
    const marketFrame = document.getElementById('__market-container')
    //Clear the marketFrame
    marketFrame.innerHTML = ''
    // Creates the marketItem cards and appends them
    marketList.forEach(function (/** @type {MarketItem} */ item){
        const html = `<div class="bg-purple-100 h-52 mx-4 mb-4 p-7 flex modal-open">
                <div class="mr-5 min-w-[150px]">
                    <img src="${item.img}" alt="${item.img}">
                </div>
                <article class="bg-white px-4 ml-5 h-full">
                    <div class="h-[35%]">                    
                        <span class="text-2xl font-bold mr-4 ">${item.article}</span>
                        <span class="mr-4 pl-2">${item.user}</span>
                        <span class="mr-4 pl-2">${item.location}</span></div>

                    <div class="h-[40%]">
                        <span class="">${item.description}</span>
                    </div>
                </article>
                <span class="bg-slate-500 text-3xl font-bold mr-4">${item.price}€</span>
            </div>`
    marketFrame?.insertAdjacentHTML('afterbegin', html)
    })
    
}

    
/*=================================FORUM===========================================*/

/**
 * Uses a JSON to get the forumItems
 * Creates a new ForumCard Object with the info
 * Pushes them to store
 */
async function getForumData(){
    //Get the info via JSON
    const API_FORUM = 'api/get.forum.topics.json'
    const apiForum = await fetch(API_FORUM)
    /** @type {ForumCard[]} */
    // Convert to array
    const forumArray = await apiForum.json();
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

