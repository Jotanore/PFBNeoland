// @ts-check
'use strict'
import {Circuit, EventCard, ForumCard} from '../classes/classes.js'
import {MarketItem} from '../classes/classes.js'

document.addEventListener('DOMContentLoaded', async () => {

    const page = document.getElementsByTagName('body')

   switch (page[0].id){
        case 'index':
            console.log(`Estoy en ${page[0].id}`)
            break
        case 'circuits':
            console.log(`Estoy en ${page[0].id}`)
            await getCircuitData()
            assignCircuitListeners()
            createMap()
            break
        case 'events':
            console.log(`Estoy en ${page[0].id}`)
            await getEventData()
            break
        case 'market':
            console.log(`Estoy en ${page[0].id}`)
            await getMarketData()
            break
        case 'forum':
            console.log(`Estoy en ${page[0].id}`)
            await getForumData()
            break
   }


/*=================================HOME===============================================*/


/*=================================CIRCUITS===========================================*/


    async function getCircuitData(){
        const API_CIRCUITS = 'api/get.circuits.json'
        const apiCircuit = await fetch(API_CIRCUITS)
        /** @type {Circuit[]} */
        const circuitArray = await apiCircuit.json();
        circuitArray.forEach(function (/** @type {Circuit} */ a){
            const circuito = new Circuit(a.id, a.name, a.distance)
            showCircuitCard(circuito)
        })
   }

   function assignCircuitListeners(){
    /** @type {HTMLCollectionOf<Element>} */
    const circuitCard = document.getElementsByClassName('__circuit-header-card')
    for (let i of circuitCard){
        /** @type {HTMLElement} */(i).addEventListener('click', showCircuitExtendedCard)
    }      
 }

     /**
    * 
    * @param {MouseEvent} e 
    */
     function showCircuitExtendedCard(e){
        const eventTarget = /** @type {HTMLElement} */(e.target)
        const extendedInfo = eventTarget?.closest('article')?.children[1]
        console.log(extendedInfo)
        if (extendedInfo?.classList.contains('__hidden')){
            extendedInfo.classList.remove('__hidden')
        }else{
            extendedInfo?.classList.add('__hidden')
        }
      
       }

   function createMap(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(
            function (position){
                const {latitude} = position.coords;
                const {longitude} = position.coords;
    
                console.log(`https://www.google.es/maps/@${latitude},${longitude}`)
    
                const coords = [latitude,longitude]

                // @ts-ignore
                const map =  L.map('map').setView(coords, 13);
                // @ts-ignore
                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);
                            }
            )   
       }
   }

     
   /**
    * 
    * @param {Circuit} n
    */
   function showCircuitCard(n){
    const circuitFrame = document.getElementById('card-container')
    const html = `<article class="mb-5">
                <div class="bg-purple-200 min-h-12 max-h-24 w-full flex items-center __circuit-header-card">
                    <span class="mr-4 pl-2">${n.name}</span>
                    <span class="mr-4 pl-2 ">${n.distance}Km</span>
                </div>

                <div class="bg-purple-100 flex flex-wrap h-48 p-5 pt-7 w-full __hidden">
                    <span class="mr-4 pl-2 w-[40%]">Nombre sitio:</span>
                    <span class="mr-4 pl-2 w-[40%]"><a class="font-bold" href="#">Ubicación</a></span>
                    <span class="mr-4 pl-2 w-[40%]">Mejor tiempo KartHub:</span>
                    <span class="mr-4 pl-2 w-[40%]">Alquiler:</span>
                    <span class="mr-4 pl-2 w-[40%]"><a class="font-bold" href="#">Sitio Web</a></span>
                </div>
            </article>`
    circuitFrame?.insertAdjacentHTML('beforeend', html)
}
/*=================================EVENTS===========================================*/

async function getEventData(){
    const API_EVENTS = 'api/get.events.json'
    const apiEvents = await fetch(API_EVENTS)
    /** @type {EventCard[]} */
    const eventArray = await apiEvents.json();
    eventArray.forEach(function (/** @type {EventCard} */ a){
        const event = new EventCard(a.title, a.date, a.user, a.description)
        console.log(event)
        showEventCard(event)
    })
}    

/**
* 
* @param {EventCard} event
*/
function showEventCard(event){
const eventFrame = document.getElementById('__event-container')
console.log(eventFrame)
const html =
            `<div class="bg-purple-100 h-24 mx-4 mb-4 flex items-center justify-center">
                <span class="mr-4 pl-2">${event.title}</span>
                <span class="mr-4 pl-2">${event.date}</span>
                <span class="mr-4 pl-2">${event.user}</span>
                <span class="mr-4 pl-2">${event.description}</span>
            </div>`
eventFrame?.insertAdjacentHTML('beforeend', html)
}



/*=================================MARKET===========================================*/

   async function getMarketData(){
        const API_MARKET = 'api/get.articles.json'
        const apiMarket = await fetch(API_MARKET)
        /** @type {MarketItem[]} */
        const marketArray = await apiMarket.json();
        marketArray.forEach(function (/** @type {MarketItem} */ a){
            const item = new MarketItem(a.user, a.article, a.price, a.location, a.description, a.img)
            console.log(item)
            showMarketCard(item)
        })
   } 

/**
* 
* @param {MarketItem} item
*/
   function showMarketCard(item){
    const marketFrame = document.getElementById('__market-container')
    const html = `<div class="bg-purple-100 h-52 mx-4 mb-4 p-7 flex ">
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
    marketFrame?.insertAdjacentHTML('beforeend', html)
}

/*=================================FORUM===========================================*/

async function getForumData(){
    const API_FORUM = 'api/get.forum.topics.json'
    const apiForum = await fetch(API_FORUM)
    /** @type {ForumCard[]} */
    const forumArray = await apiForum.json();
    forumArray.forEach(function (/** @type {ForumCard} */ a){
        const item = new ForumCard(a.user, a.title, a.description)
        console.log(item)
        showForumCard(item)
    })
}    

/**
* 
* @param {ForumCard} item
*/
function showForumCard(item){
const forumFrame = document.getElementById('__forum-container')
const html = `<div class="bg-purple-100 h-24 mx-4 mb-4 flex items-center justify-center">
                <span class="mr-4 pl-2">Titulo</span>
                <span class="mr-4 pl-2">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quas voluptates, omnis, voluptatum illo error ipsum dolor ut iusto beatae, quam dolores odit? Dolorem rerum, molestiae veritatis quos placeat quam architecto!</span>
            </div>`
forumFrame?.insertAdjacentHTML('beforeend', html)
}

});