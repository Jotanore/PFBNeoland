'use strict'

// @ts-check
// import { store } from './store/redux.js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Circuit, EventCard, RaceLines} from '../classes/classes.js'
import { getUserCoords, getUserToCircuitDistance} from './circuits.js';
import { modalOpener, modalManager, getUserFromSession, getForeignUserFromSession, getAPIData, fillSelectable, clampRacelineViewport, credentialsBtnManager, getFormattedDate} from '../utils/utils.js';
import { fillUserForm, fillUserProfile, updateUserProfile, fillRaceLinesLit, updateRaceLineList} from './profile.js';
import { assignIndexListeners, userRegister, checkSignRedirectionFlag, onLoginComponentSubmit } from './index.page.js';
import { assignEventButtons, eventFormManager, getEventData } from './events.js';
import { loadForeignProfile, assignForeignProfileListeners } from './foreign.profile.js';
import { getMarketData, assignMarketButtons, marketFormManager } from './market.js';
import { getLapTimes, assignLapTimeButtons, getBestLapTimes, createNewlaptime} from './laptimes.js' 
import { getMessages, assignMessageListeners } from './messages.js';




/**
 * @type {number[] | null}
 */
let userCoords = null;
// @ts-expect-error leaflet map
let map
// @ts-expect-error fabric canvas
let canvas
// @ts-expect-error fabric canvas
let editCanvas
export let userlog = false
export const API_PORT = location.port ? `:${location.port}` : ''
/**
 * @type {Circuit[]}
 */
let circuitArray



document.addEventListener('DOMContentLoaded', async () => {

    const page = document.getElementsByTagName('body')

    window.addEventListener('open-raceline-event', (event) => {
        console.log('open-raceline-event', /** @type {CustomEvent} */(event).detail)
        openRaceLine(/** @type {CustomEvent} */(event).detail)
      })
    
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
                    fillEventList(true)
                    fillRaceLinesLit(true)
                    updateRaceLineList([])
                    fillMarketList(true)
                    updateUserProfile()
                    credentialsBtnManager()
                }
                break
            case 'messages':{
                getMessages()
                assignMessageListeners()
                credentialsBtnManager()
            }
                break
            case 'foreign-profile':
                loadForeignProfile()
                credentialsBtnManager()
                fillEventList(false)
                fillRaceLinesList(false)
                fillMarketList(false)
                assignForeignProfileListeners()
                modalManager()
            break
            case 'index':
                // @ts-expect-error web Component Event
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
                eventFormManager()
                fillSelectable('opciones-filtro')
                fillSelectable('opciones')
                assignEventButtons()
                modalManager()
                break
            case 'market':
                console.log(`Estoy en ${page[0].id}`)
                credentialsBtnManager()
                await getMarketData()
                marketFormManager()
                assignMarketButtons()
                modalManager()
                break
            case 'raceline':
                console.log(`Estoy en ${page[0].id}`)
                credentialsBtnManager()
                raceLineButtonsAssign()
                fillSelectable('opciones')
                activateCanvas()
            break
            case 'laptimes':
                /**
                 * @type {HTMLSelectElement}
                 */
            document.getElementById("laptimeKartSelect")?.addEventListener("change", function() {
                // @ts-expect-error not on HTML
                const selectedValue = this.value;
            
                /** @type {HTMLElement | null} */
                const input = document.getElementById('laptimeKart');

                if (input instanceof HTMLInputElement) {
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
                }
            });
            fillSelectable('opciones')
            fillSelectable('opciones-filtro')
            credentialsBtnManager()
            createNewlaptime()
            getLapTimes()
            getBestLapTimes()
            assignLapTimeButtons()
            break
    }

})


/*=================================GENERIC FUNCTIONS===============================================*/


/**
 * Opens the modal window and fills it with the information of the given circuit.
 * @param {Circuit} circuit The circuit to be shown in the modal
 * @function
 */// @ts-expect-error Window declaration
window.openCircuitModal = function (circuit){
    modalOpener()
    circuitModal(circuit)
}



/*=================================PROFILE===============================================*/

/**
 * Populates a list of articles associated with a specific user.
 * 
 * This asynchronous function retrieves article data for a given userId
 * from the server and populates the HTML element with id 'article-list'
 * with the article name and price for each article.
 * 
 * @param {string | undefined | null} userId - The ID of the user whose articles are to be fetched.
 */
async function fillMarketList(/** @type {boolean} */ isUser){

    const user = isUser ? getUserFromSession()._id : getForeignUserFromSession()

    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/articles/${user}` , 'GET')
    apiData.forEach(function (/** @type {MarketItem} */article){
       
        const html = `<li>${article.article} | ${article.price}€</li>`

        document.getElementById('article-list')?.insertAdjacentHTML('afterbegin', html)
    })
    
}

/**
 * Fills the event list with events associated with a specific user.
 * 
 * This function fetches event data from the server for a given userId
 * and populates the HTML element with id 'event-list' with the event
 * title and date for each event.
 * 
 * @param {string} userId - The ID of the user whose events are to be fetched.
 */
async function fillEventList(/** @type {boolean} */ isUser){

    const user = isUser ? getUserFromSession()._id : getForeignUserFromSession()
    
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/events/${user}` , 'GET')
    apiData.forEach(function (/** @type {EventCard} */event){
       
        const html = `<li>${event.title} | ${event.date}</li>`

        document.getElementById('event-list')?.insertAdjacentHTML('afterbegin', html)
    })
    
}


/**
 * Populates a list of race lines associated with a specific user.
 * 
 * This asynchronous function retrieves race line data for a given userId
 * from the server and fetches additional information about each race line's
 * circuit. It then updates the race lines list with the fetched data.
 * 
 * @param {string | null } userId - The ID of the user whose race lines are to be fetched.
 */
async function fillRaceLinesList(/** @type {boolean} */ isUser){

    const user = isUser ? getUserFromSession()._id : getForeignUserFromSession()

    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/racelines/${user}` , 'GET')
    let racelines = []
    apiData.forEach(async function (/**  @type {RaceLines} */ raceline){
       
        const date = getFormattedDate(raceline.date)
        const lineCircuit = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/circuit/${raceline.circuit_id}`, 'GET')
        const html = `<li>${lineCircuit.name} | Fecha: ${date}</li>`
        //  @ts-expect-error Declaration
        raceline.circuitName = lineCircuit.name
        raceline.img = ''
        racelines.push(raceline)
        document.getElementById('race-line-list')?.insertAdjacentHTML('afterbegin', html)
    })    
}


/**
 * Hides all other containers and displays the race line canvas container with the requested race line.
 * 
 * @param {RaceLines} raceLine - The race line to be displayed.
 */
function openRaceLine(/**  @type {RaceLines} */ raceLine){

    document.getElementById('event-container')?.classList.add("__hidden")
    document.getElementById('fastlaps-container')?.classList.add("__hidden")
    document.getElementById('market-container')?.classList.add("__hidden")
    document.getElementById('racelines-list')?.classList.add("__hidden")
    document.getElementById("profile-container")?.classList.add("__hidden")

    activateRaceLineCanvas()
    loadCircuitLineImage(raceLine.circuit_id)
    loadRaceLine(raceLine._id)
    document.getElementById('racelineCanvas-container')?.classList.remove('__hidden')
}

/**
 * Initializes the raceline canvas for drawing and interaction.
 * 
 * This function sets up a Fabric.js canvas with a background image and
 * configures panning and zooming interactions. The background image is
 * loaded and scaled to width, and panning is enabled by default. The
 * function handles mouse events for panning and zooming, ensuring the
 * background image remains fully visible by clamping the viewport.
 * 
 * Mouse Event Handlers:
 * - 'mouse:down': Enables panning mode on mouse down.
 * - 'mouse:move': Updates the canvas viewport position while panning.
 * - 'mouse:up': Disables panning mode and clamps the viewport.
 * - 'mouse:wheel': Zooms in or out at the mouse pointer location,
 *   adjusting the zoom level within set limits and clamping the viewport
 *   to ensure the background image remains visible.
 */

function activateRaceLineCanvas() {
    // @ts-expect-error External declaration
    // eslint-disable-next-line no-undef
    canvas = new fabric.Canvas('racelineCanvas');

    // @ts-expect-error External declaration
    // eslint-disable-next-line no-undef
    // fabric.Image.fromURL('./imgs/kotar.jpg', function(img) {
    //     img.scaleToWidth(1000);
    //     img.selectable = false;
    //     img.evented = false;
    //     // @ts-expect-error external declaration
    //     canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
    // });


    // Variables para el panning
    let isDragging = false;
    let lastPosX = 0;
    let lastPosY = 0;
    let panMode = true
    canvas.isDrawingMode = false;
    canvas.selection = false;
    

    // ON MOUSEDOWN
    canvas.on('mouse:down', function(/**  @type {*} */ opt) {
        const e = opt.e;

        //panmode
        if (panMode) {

        isDragging = true;
        // @ts-expect-error external declaration
        canvas.selection = false;
        lastPosX = e.clientX;
        lastPosY = e.clientY;
        }
        
        
    });

    //ON MOUSEMOVE
    canvas.on('mouse:move', function(/**  @type {*} */ opt) {

        const e = opt.e;
        //panmode
        if (panMode && isDragging){
            
            // @ts-expect-error external declaration
            const vpt = canvas.viewportTransform;
            vpt[4] += e.clientX - lastPosX;
            vpt[5] += e.clientY - lastPosY;
            // @ts-expect-error external declaration
            canvas.requestRenderAll();
            lastPosX = e.clientX;
            lastPosY = e.clientY;
        }

    });
        

    // ON MOUSEUP
    canvas.on('mouse:up', function() {
        if (panMode){
            isDragging = false;
            // @ts-expect-error external declaration
            clampRacelineViewport(canvas);
        }


    });

    canvas.on('mouse:wheel', function(/**  @type {*} */ opt) {
        opt.e.preventDefault();
        opt.e.stopPropagation();
        // @ts-expect-error external declaration
        const pointer = canvas.getPointer(opt.e);
        // @ts-expect-error external declaration
        let zoom = canvas.getZoom();

        zoom = opt.e.deltaY < 0 ? zoom * 1.1 : zoom / 1.1;

        // @ts-expect-error external declaration
        if (canvas.backgroundImage) {
            // @ts-expect-error external declaration
            const bg = canvas.backgroundImage;
            // @ts-expect-error external declaration
            const minZoomWidth = canvas.getWidth() / (bg.width * bg.scaleX);
            // @ts-expect-error external declaration
            const minZoomHeight = canvas.getHeight() / (bg.height * bg.scaleY);
            const minZoom = Math.max(minZoomWidth, minZoomHeight);
            if (zoom < minZoom) {
                zoom = minZoom;
            }
        }
        
        if (zoom > 20) zoom = 20; 

        // @ts-expect-error External declaration
        // eslint-disable-next-line no-undef
        canvas.zoomToPoint(new fabric.Point(pointer.x, pointer.y), zoom);
        // @ts-expect-error external declaration
        clampRacelineViewport(canvas);
    });


}




/**
 * Loads the background image of the circuit specified by the given id
 * and sets it as the background image of the canvas. If the id is 0, the
 * function does nothing.
 * @param {string} id - The id of the circuit to load.
 */
async function loadCircuitLineImage(/**  @type {string} */ id){

    console.log(id)
    const circuitID = id

    if (Number(circuitID) === 0) return

    const circuit = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/circuit/${circuitID}`, 'GET') 
    console.log(circuitID)
    console.log(circuit)

    // @ts-expect-error External declaration
    // eslint-disable-next-line no-undef
    fabric.Image.fromURL(circuit.map, function(img) {
        // @ts-expect-error external declaration
        img.scaleToWidth(canvas.getWidth());
        // @ts-expect-error external declaration
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
    });

}


/**
 * Loads the background image of the race line specified by the given id
 * and sets it as the background image of the canvas. If the id is 0, the
 * function does nothing.
 * @param {string} id - The id of the race line to load.
 */
async function loadRaceLine(/**  @type {string} */ id){

    try{
    const raceline = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/raceline/${id}`, 'GET') 

    console.log(raceline)

    // @ts-expect-error External declaration
    // eslint-disable-next-line no-undef
    fabric.Image.fromURL(raceline.img, function(/** @type {fabric.Image} */ img) {
        // @ts-expect-error external declaration
        img.scaleToWidth(canvas.getWidth());
        // @ts-expect-error external declaration
        canvas.add(img)
        // @ts-expect-error external declaration
        canvas.renderAll();
    });} catch (error) {
        console.error("Error obteniendo coordenadas:", error);
    }
}

/*===============================FOREIGN PROFILE=================================*/




/*=================================INDEX===========================================*/




/*=================================CIRCUITS===========================================*/


async function setUserCoords() {
    try {
        userCoords = await getUserCoords(); // Espera la promesa y guarda el resultado
        console.log("Coordenadas guardadas:", userCoords);
    } catch (error) {
        console.error("Error obteniendo coordenadas:", error);
    }
}


/**
 * Retrieves an array of circuits from the 'circuits' collection in the 'karthub' database.
 * 
 * @param {string} [filters] - The filter to apply to the documents in the collection.
 * @return {Promise<void>} - A promise that resolves to an array of circuit objects.
 */
    
async function getCircuitData(filters){
    //Get the info via JSON
    const cardContainer = document.getElementById('card-container')
    if(cardContainer) cardContainer.innerHTML = ''
    circuitArray = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/circuits` , 'GET', undefined, filters)
    //Iterate Array, create the Circuit Object and push to store
    // Waits for getUserToCircuitDistance to get the distance to each circuit and stores it on circuit.distance
    await circuitArray.forEach(async function (/** @type {Circuit} */ circuit){
        //
        // @ts-expect-error asignation
        circuit.distance = await getUserToCircuitDistance(circuit.location, userCoords)
    })
    // Sorts circuits by distance to user
    circuitArray.sort(function (a, b) {
        // @ts-expect-error asignation
        return a.distance - b.distance;
    });
    // Creates the circuit cards and appends them
    circuitArray.forEach(async function (/** @type {Circuit} */ circuit){            
        drawCircuitCard(circuit)
    })
    bindCircuitCardsFocus()
}


     

/**
 * Draws a circuit card based on the circuit object
 * @param {Circuit} circuit - The circuit object with the following properties:
 *  - name: string
 *  - location: { latitude: number, longitude: number }
 *  - distance: number
 */
function drawCircuitCard(circuit){
    const circuitFrame = document.getElementById('card-container')
    const html = `<article class="mb-5 circuit-card zoom-to-marker" data-lat="${circuit.location.latitude}" data-lng="${circuit.location.longitude}">
                        <div class="bg-amber-200 min-h-[3rem] max-h-[6rem] w-full flex items-center p-3 rounded shadow-md hover:bg-amber-300">
                            <span class="mr-4 pl-2 font-bold text-gray-800">${circuit.name}</span>
                            <span class="mr-4 pl-2 text-gray-600">${circuit.
                                // @ts-expect-error asignation
                            distance} Km</span>
                            <button class="mr-4 pl-2 modal-open border border-black bg-gray-400 hover:bg-gray-500 text-white rounded px-3 py-1">
                            Ver más
                            </button>
                        </div>
                    </article>`
    circuitFrame?.insertAdjacentHTML('beforeend', html)

    
    const lastCard = circuitFrame?.lastElementChild;
    const modalButton = lastCard?.querySelector('.modal-open');

    modalButton?.addEventListener('click', function(event){
        event.stopPropagation();
        circuitModal(circuit)
    });

}

/**
 * Asigna un evento de click a cada tarjeta de circuito (clase .circuit-card),
 * que cuando se dispara, navega en el mapa hacia el circuito correspondiente
 * con una animación. La función utiliza los atributos data-lat y data-lng de
 * cada tarjeta para obtener las coordenadas del circuito.
 * 
 * @returns {void}
 */
function bindCircuitCardsFocus(){
    const circuitCards = document.getElementsByClassName('circuit-card')
    console.log(circuitCards)
    for (let i of circuitCards){
        i.addEventListener('click', (e) => {
            const card = /** @type {HTMLElement} */ (e.target).closest('.circuit-card');
            if (!card) return;
            
            // @ts-expect-error possible null
            const lat = parseFloat(card.getAttribute('data-lat'));
            // @ts-expect-error possible null
            const lng = parseFloat(card.getAttribute('data-lng'));
        
            const zoomLevel = 12;
            // @ts-expect-error external declaration
            map.flyTo([lat, lng], zoomLevel, { animate: true, duration: 2 });
            })
    }
    
}  
     
/**
 * Crea un mapa en el contenedor con id 'map' y agrega
 * una capa de OpenStreetMap con zoom 6 y centrado en
 * las coordenadas [40.187,-4.504].
 *
 * @returns {void}
 */
function createMap(){
        //const coords = [40.187,-4.504]

        // @ts-expect-error External declaration
        // eslint-disable-next-line no-undef
        map = L.map('map').setView([40.187,-4.504], 6);
        // @ts-expect-error External declaration
        // eslint-disable-next-line no-undef
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            subdomains: ['a', 'b', 'c'],
            keepBuffer: 8
        }).addTo(map);
        

            renderMarkers()


}
    

/**
 * Removes all markers from the map and then adds a new marker for each circuit in the circuitArray.
 * The marker is added at the location of the circuit and a popup is bound to it with the circuit's name
 * and a button to open the circuit modal.
 * Also a tooltip is added with the circuit's name.
 */
function renderMarkers(){
    // @ts-expect-error external declaration
    map.eachLayer(layer => {
    // @ts-expect-error External declaration
        // eslint-disable-next-line no-undef
        if (layer instanceof L.Marker) {
            // @ts-expect-error external declaration
            map.removeLayer(layer);
        }
    });
    for (let circuit of circuitArray){
        const markerCoords = [circuit.location.latitude, circuit.location.longitude]
        // @ts-expect-error External declaration
        // eslint-disable-next-line no-undef
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
}



/**
 * Shows a modal with the given circuit's data.
 * @param {Circuit} circuit - The circuit data to show in the modal.
 */
function circuitModal(circuit){
    modalOpener()
    const modalContent = document.getElementById('modal-content')

    if (modalContent){
    modalContent.innerHTML = `
            <div class="bg-neutral-100 p-6  w-full h-full mx-auto">
                <h2 class="text-2xl font-bold text-gray-800 text-center mb-4 pb-4">Información del Circuito</h2>
                <ul class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                    <li>
                        <strong class="text-gray-900">Nombre:</strong>
                        <span>${circuit.name}</span>
                    </li>
                    <li>
                        <strong class="text-gray-900">Ubicación:</strong>
                        <a href="${circuit.location.googleUrl}" class="text-blue-500 hover:underline" target="_blank">Ver ubicación</a>
                    </li>
                    <li class="md:col-span-2">
                        <strong class="text-gray-900">Descripción:</strong>
                        <span>${circuit.description}</span>
                    </li>
                                        <li class="">
                        <strong class="text-gray-900">Web:</strong>
                        <a href="${circuit.url}" class="text-blue-500 hover:underline" target="_blank">${circuit.url}</a>
                    </li>
                    
                    <li class="md:col-span-2 ">
                        <strong class="text-gray-900">Mapa:</strong>
                        <img class="w-[100%] rounded-md mt-2" src="${circuit.map}" alt="Mapa del circuito">
                    </li>
                </ul>
            </div>
        `;

                    // <li>
                    //     <strong class="text-gray-900">Mejor tiempo:</strong>
                    //     <span>${circuit.bestlap}</span>
                    // </li>
    }
}


/**
     * Handles the filter circuit button click event.
     * Retrieves the range input value (distance in km) and the user's coordinates.
     * Creates a filter object to be passed to getCircuitData.
     * Waits for getCircuitData to load the circuits with the given filter.
     * Flies the map to a default location and zoom, then renders the circuit markers.
     * @param {Event} e - The event object.
     */
async function filterCircuits(e){
    e.preventDefault()

    // @ts-expect-error Ignore
    const rangeInputValue = document.getElementById('distance-range')?.value;

    const filters = {
        distance: rangeInputValue,
        userCoords: userCoords
    }

    const payload = JSON.stringify(filters)
    await getCircuitData(payload)
    // @ts-expect-error external declaration
    map.flyTo([40.187,-4.504], 6, { animate: true, duration: 2 });
    renderMarkers()

}

/**
 * Assigns event listeners to the circuit filter button and range input.
 * The button click event triggers the filterCircuits function which
 * fetches the circuits with the given distance filter and renders them
 * in the map.
 * The range input change event updates the displayed value of the range input.
 */
function assignCircuitListeners(){
    const rangeInput = document.getElementById('distance-range');
    const valueDisplay = document.getElementById('value');
    const filterButton = document.getElementById('circuit-filter')

    filterButton?.addEventListener('click', filterCircuits)

    rangeInput?.addEventListener('input', function() {
        // @ts-expect-error intput not on HTMLElement
        if(valueDisplay) valueDisplay.textContent = rangeInput.value; 
    });

    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

   
/*=================================EVENTS===========================================*/





/*=================================MARKET===========================================*/







/*=================================RACELINE CREATOR===========================================*/


/**
 * Inicializa el canvas de dibujo, carga la imagen de fondo, 
 * crea un pincel y configura los eventos para dibujar y 
 * seleccionar objetos.
 */
function activateCanvas() {
    // @ts-expect-error External declaration
    // eslint-disable-next-line no-undef
    editCanvas = new fabric.Canvas('circuitCanvas');

    // fabric.Image.fromURL('./imgs/kotar.jpg', function(img) {
    //     img.scaleToWidth(1000);
    //     img.selectable = false;
    //     img.evented = false;
    //     // @ts-expect-error external declaration
    //     editCanvas.setBackgroundImage(img, editCanvas.renderAll.bind(editCanvas));
    // });

    // @ts-expect-error External declaration
    // eslint-disable-next-line no-undef
    const brush = new fabric.PencilBrush(editCanvas);
    editCanvas.freeDrawingBrush = brush;
    brush.color = '#40ff00';
    brush.width = 3;
    editCanvas.isDrawingMode = false;

    let isDragging = false;
    let lastPosX = 0;
    let lastPosY = 0;
    let panMode = false;
    let straightLineMode = false
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let isDrawing = false
    /**
     * @type {Object}
     */
    let line; 

    const clearButton = document.getElementById("clear");
    clearButton?.addEventListener("click", clearTraces);

    const apexButton = document.getElementById("apex");
    apexButton?.addEventListener("click", function() {
        // @ts-expect-error External declaration
        // eslint-disable-next-line no-undef
        const triangle = new fabric.Triangle({
            left: 40,
            top: 50,
            width: 40,
            height: 40,
            fill: 'white',
            stroke: 'blue', 
            strokeWidth: 5,
        });
        // @ts-expect-error external declaration
        editCanvas.add(triangle);

        //TODO, FUNCION SELECT
        // @ts-expect-error external declaration
        editCanvas.isDrawingMode = false;
        panMode = false
        // @ts-expect-error external declaration
        editCanvas.selection = true;

        if (selectModeBtn) {
            selectModeBtn.style.backgroundColor = 'rgb(37 99 235)';
          }
          
          if (drawModeBtn) {
            drawModeBtn.style.backgroundColor = 'rgb(59 130 246)';
          }
          
          if (togglePanButton) {
            togglePanButton.style.backgroundColor = 'rgb(59 130 246)';
          }
          
          if (redBrushBtn) {
            redBrushBtn.style.backgroundColor = 'rgb(59 130 246)';
          }
          
          if (yellowBrushBtn) {
            yellowBrushBtn.style.backgroundColor = 'rgb(59 130 246)';
          }
          
          if (greenBrushBtn) {
            greenBrushBtn.style.backgroundColor = 'rgb(59 130 246)';
          }
 
    });

    document.getElementById('text')?.addEventListener('click', function () {
        // @ts-expect-error External declaration
        // eslint-disable-next-line no-undef
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
        // @ts-expect-error external declaration
        editCanvas.add(text);
        // @ts-expect-error external declaration
        editCanvas.setActiveObject(text);
        text.enterEditing();
    });


    // ON MOUSEDOWN
    // @ts-expect-error external declaration
    editCanvas.on('mouse:down', function(opt) {
        const e = opt.e;

        //straightlinemode
        if (straightLineMode){
            e.preventDefault();
            e.stopPropagation();

            isDrawing = false;
            isDragging = true;
            // @ts-expect-error external declaration
            editCanvas.isDrawingMode = false
            editCanvas.selection = false;
    
            // @ts-expect-error external declaration
            const pointer = editCanvas.getPointer(e); 
            const points = [pointer.x, pointer.y, pointer.x, pointer.y]; 
    
            // @ts-expect-error External declaration
            // eslint-disable-next-line no-undef
            line = new fabric.Line(points, {
                stroke: '#40ff00',   
                strokeWidth: 3,    
                selectable: false,  
                evented: false      
            });
    
            // @ts-expect-error external declaration
            editCanvas.add(line); 
        }else if (panMode) {

            isDragging = true;
            // @ts-expect-error external declaration
            editCanvas.selection = false;
            lastPosX = e.clientX;
            lastPosY = e.clientY;
            }
        
    });

    //ON MOUSEMOVE
    // @ts-expect-error external declaration
    editCanvas.on('mouse:move', function(opt) {

        const e = opt.e;
        //panmode
        if (panMode && isDragging){
            
            // @ts-expect-error external declaration
            const vpt = editCanvas.viewportTransform;
            vpt[4] += e.clientX - lastPosX;
            vpt[5] += e.clientY - lastPosY;
            // @ts-expect-error external declaration
            editCanvas.requestRenderAll();
            lastPosX = e.clientX;
            lastPosY = e.clientY;
        }


        //straightlinemode
        if (straightLineMode && isDragging) {
            // @ts-expect-error external declaration
            const pointer = editCanvas.getPointer(e); 
            // @ts-expect-error External declaration
            line.set({ x2: pointer.x, y2: pointer.y });
            // @ts-expect-error external declaration
            editCanvas.renderAll();
        }
        
    });
        

    // ON MOUSEUP
    editCanvas.on('mouse:up', function() {
        isDragging = false;
        
        if (panMode) {
            clampViewport(editCanvas);
        }
        
        if (straightLineMode) {
            line.set({ selectable: true, evented: true });

            editCanvas.isDrawingMode = false;
            editCanvas.selection = false;
        }
    });
    
 
    // @ts-expect-error external declaration
    editCanvas.on('mouse:wheel', function(opt) {
        opt.e.preventDefault();
        opt.e.stopPropagation();
        // @ts-expect-error external declaration
        const pointer = editCanvas.getPointer(opt.e);
        // @ts-expect-error external declaration
        let zoom = editCanvas.getZoom();

        zoom = opt.e.deltaY < 0 ? zoom * 1.1 : zoom / 1.1;

        // @ts-expect-error external declaration
        if (editCanvas.backgroundImage) {
            // @ts-expect-error external declaration
            const bg = editCanvas.backgroundImage;
            // @ts-expect-error external declaration
            const minZoomWidth = editCanvas.getWidth() / (bg.width * bg.scaleX);
            // @ts-expect-error external declaration
            const minZoomHeight = editCanvas.getHeight() / (bg.height * bg.scaleY);
            const minZoom = Math.max(minZoomWidth, minZoomHeight);
            if (zoom < minZoom) {
                zoom = minZoom;
            }
        }
        
        if (zoom > 20) zoom = 20; 


        // @ts-expect-error External declaration
        // eslint-disable-next-line no-undef
        editCanvas.zoomToPoint(new fabric.Point(pointer.x, pointer.y), zoom);
        // @ts-expect-error external declaration
        clampViewport(editCanvas);
    });

    const redBrushBtn = document.getElementById('red-brush');
    redBrushBtn?.addEventListener('click', () => {
    brush.color = 'red';
    panMode = false;
    straightLineMode = false;
    isDragging = false;
    editCanvas.isDrawingMode = true;


    if (drawModeBtn) drawModeBtn.style.backgroundColor = 'rgb(37 99 235)';
    redBrushBtn.style.backgroundColor = 'rgb(37 99 235)';
    if (yellowBrushBtn) yellowBrushBtn.style.backgroundColor = 'rgb(59 130 246)';
    if (greenBrushBtn) greenBrushBtn.style.backgroundColor = 'rgb(59 130 246)';
    if (selectModeBtn) selectModeBtn.style.backgroundColor = 'rgb(59 130 246)';
    if (togglePanButton) togglePanButton.style.backgroundColor = 'rgb(59 130 246)';
});



    const yellowBrushBtn = document.getElementById('yellow-brush')
    yellowBrushBtn?.addEventListener('click', () => {
        brush.color = 'yellow';

        panMode = false
        // @ts-expect-error external declaration
        editCanvas.selection = false;
        // @ts-expect-error external declaration
        editCanvas.isDrawingMode = true;
        straightLineMode = false
 
        if(drawModeBtn) drawModeBtn.style.backgroundColor ='rgb(37 99 235)'
        yellowBrushBtn.style.backgroundColor = 'rgb(37 99 235)'

        if(redBrushBtn) redBrushBtn.style.backgroundColor = 'rgb(59 130 246)'
        if(greenBrushBtn) greenBrushBtn.style.backgroundColor = 'rgb(59 130 246)'
        if(selectModeBtn) selectModeBtn.style.backgroundColor = 'rgb(59 130 246)'
        if(togglePanButton) togglePanButton.style.backgroundColor ='rgb(59 130 246)'
    });

    const greenBrushBtn = document.getElementById('green-brush')
        if(greenBrushBtn) greenBrushBtn.style.backgroundColor ='rgb(37 99 235)'
        greenBrushBtn?.addEventListener('click', () => {
        brush.color = '#40ff00';
        panMode = false
        // @ts-expect-error external declaration
        editCanvas.selection = false;
        // @ts-expect-error external declaration
        editCanvas.isDrawingMode = true;
        straightLineMode = false
 

        if(drawModeBtn) drawModeBtn.style.backgroundColor ='rgb(37 99 235)'
        greenBrushBtn.style.backgroundColor = 'rgb(37 99 235)'

        if(redBrushBtn) redBrushBtn.style.backgroundColor = 'rgb(59 130 246)'
        if(yellowBrushBtn) yellowBrushBtn.style.backgroundColor = 'rgb(59 130 246)'
        if(selectModeBtn) selectModeBtn.style.backgroundColor = 'rgb(59 130 246)'
        if(togglePanButton) togglePanButton.style.backgroundColor ='rgb(59 130 246)'
    });

     const selectModeBtn = document.getElementById('toggle-select-mode');
        selectModeBtn?.addEventListener('click', () => {

            // @ts-expect-error external declaration
        editCanvas.isDrawingMode = false;
        panMode = false
        // @ts-expect-error external declaration
        editCanvas.selection = true;
        straightLineMode = false


        selectModeBtn.style.backgroundColor ='rgb(37 99 235)'

        if (drawModeBtn) drawModeBtn.style.backgroundColor = 'rgb(59 130 246)';
        if (togglePanButton) togglePanButton.style.backgroundColor = 'rgb(59 130 246)';
        if (redBrushBtn) redBrushBtn.style.backgroundColor = 'rgb(59 130 246)';
        if (yellowBrushBtn) yellowBrushBtn.style.backgroundColor = 'rgb(59 130 246)';
        if (greenBrushBtn) greenBrushBtn.style.backgroundColor = 'rgb(59 130 246)';

         
     });

     const drawModeBtn = document.getElementById('toggle-draw-mode');
     if (drawModeBtn) drawModeBtn.style.backgroundColor ='rgb(37 99 235)'
     drawModeBtn?.addEventListener('click', () => {
        panMode = false;
        straightLineMode = false; 
        isDragging = false; 
        if (line) { 
            line = null;
         }
        // @ts-expect-error external declaration
        editCanvas.selection = false;
        // @ts-expect-error external declaration
        editCanvas.isDrawingMode = true;
        straightLineMode = false
 
        switch (brush.color) {
            case 'red':
                if(redBrushBtn) redBrushBtn.style.backgroundColor = 'rgb(37 99 235)';
                break;
            case 'yellow':
                if(yellowBrushBtn) yellowBrushBtn.style.backgroundColor = 'rgb(37 99 235)';
                break;
            case '#40ff00':
                if(greenBrushBtn) greenBrushBtn.style.backgroundColor = 'rgb(37 99 235)';
                break;
        }
        
        drawModeBtn.style.backgroundColor ='rgb(37 99 235)'

        if (selectModeBtn) selectModeBtn.style.backgroundColor = 'rgb(59 130 246)'
        if (togglePanButton) togglePanButton.style.backgroundColor ='rgb(59 130 246)'
     });

        const togglePanButton = document.getElementById('toggle-pan-mode');
        togglePanButton?.addEventListener('click', () => {
            // @ts-expect-error external declaration
        editCanvas.isDrawingMode = false;
        // @ts-expect-error external declaration
        editCanvas.selection = false;
        panMode = true 
        straightLineMode = false

        if (togglePanButton) togglePanButton.style.backgroundColor = 'rgb(37 99 235)';
        if (drawModeBtn) drawModeBtn.style.backgroundColor = 'rgb(59 130 246)';
        if (selectModeBtn) selectModeBtn.style.backgroundColor = 'rgb(59 130 246)';
        if (redBrushBtn) redBrushBtn.style.backgroundColor = 'rgb(59 130 246)';
        if (yellowBrushBtn) yellowBrushBtn.style.backgroundColor = 'rgb(59 130 246)';
        if (greenBrushBtn) greenBrushBtn.style.backgroundColor = 'rgb(59 130 246)';
    });
    

    const straightLineBtn = document.getElementById('straight-line');
    straightLineBtn?.addEventListener('click', () => {
        straightLineMode = true
        editCanvas.freeDrawingBrush.color = 'rgba(0, 0, 0, 0)';
        // @ts-expect-error external declaration
        editCanvas.selection = false;
        
    })


    const saveBtn = document.getElementById('save-btn');
    saveBtn?.addEventListener('click', function() {
        // @ts-expect-error external declaration
        const dataURL = editCanvas.toDataURL({
            format: 'png',
            quality: 1  // Calidad máxima
        });
        
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'circuito.png'; 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    const uploadToWebBtn = document.getElementById('upload')
    uploadToWebBtn?.addEventListener('click', uploadToWeb)

    document.addEventListener('keydown', function(event) {
        if (event.key === "Delete") {
            // @ts-expect-error external declaration
          if (editCanvas.getActiveObject()) {
            // @ts-expect-error external declaration
            editCanvas.remove(editCanvas.getActiveObject());
            // @ts-expect-error external declaration
          } else if (editCanvas.getActiveObjects()) {
            // @ts-expect-error external declaration
            const selectedObjects = editCanvas.getActiveObjects();
            // @ts-expect-error external declaration
            selectedObjects.forEach(obj => {
                // @ts-expect-error external declaration
              editCanvas.remove(obj);
            });
          }
          // @ts-expect-error external declaration
          editCanvas.renderAll();
        }
      });
}

/**
 * Sube la trazada actual a la sección de perfiles.
 * Si no se ha iniciado sesión, muestra un aviso.
 * @async
 */
async function uploadToWeb(){

    if (!userlog){
        alert("Debes iniciar sesión para guardar tu trazada en perfil.");
    }else{
        // @ts-expect-error external declaration
        const bg = editCanvas.backgroundImage;
        // @ts-expect-error external declaration
        editCanvas.setBackgroundImage(null, editCanvas.renderAll.bind(editCanvas));

        // @ts-expect-error external declaration
        const imgURL = editCanvas.toDataURL({
            format: 'png', 
            quality: 1     
        })

        // @ts-expect-error external declaration
        editCanvas.setBackgroundImage(bg, editCanvas.renderAll.bind(editCanvas));

        let user = getUserFromSession()

        const circuitId = document.getElementById('circuitCanvas')?.getAttribute('data-id')


        const raceLine = {
            user_id: userlog ? user?._id : "0",
            circuit_id: circuitId,
            img: imgURL,
            date: Date.now()
        }
        console.log(raceLine)

        const payload = JSON.stringify(raceLine)
        console.log(payload)

        const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/create/raceline/`, "POST", payload);
        console.log("Respuesta del servidor:", apiData);
    }
    alert("Trazada guardada en tu perfil!")
}

/**
 * Elimina todos los objetos que no sean la imagen de fondo del canvas.
 * @function
 */
function clearTraces(){
    // @ts-expect-error external declaration
    editCanvas.getObjects().forEach(function(obj) {
        if (obj.type !== 'image') {
            // @ts-expect-error external declaration
            editCanvas.remove(obj);
        }
    });
}




/**
 * Restricts the viewport translation of the given canvas to ensure that
 * the background image remains fully visible within the canvas boundaries.
 * The function adjusts the viewport's horizontal and vertical translation
 * values based on the current zoom level and background image dimensions.
 *
 */
// @ts-expect-error External declaration
function clampViewport(editCanvas) {
    const bg = editCanvas.backgroundImage;
    if (!bg) return;
    
    const canvasWidth = editCanvas.getWidth();
    const canvasHeight = editCanvas.getHeight();
    const zoom = editCanvas.getZoom();
    
    const bgWidth = bg.width * bg.scaleX * zoom;
    const bgHeight = bg.height * bg.scaleY * zoom;
    
    const vt = editCanvas.viewportTransform; 
    
    if (vt[4] > 0) {
        vt[4] = 0;
    } else if (vt[4] < canvasWidth - bgWidth) {
        vt[4] = canvasWidth - bgWidth;
    }
    
    if (vt[5] > 0) {
        vt[5] = 0;
    } else if (vt[5] < canvasHeight - bgHeight) {
        vt[5] = canvasHeight - bgHeight;
    }
    
    editCanvas.setViewportTransform(vt);
}

/**
 * Assigns the event listener to the 'map-selection-confirm' button that loads the selected circuit background image
 * when clicked.
 */
function raceLineButtonsAssign(){
    document.getElementById('map-selection-confirm')?.addEventListener('click', loadCircuitImage)

    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

/**
 * Loads the background image of the circuit specified by the value of the 'opciones' form
 * and sets it as the background image of the canvas. If the value of the form is 0, the function
 * does nothing. The function also removes the '__hidden' class from the canvas container and
 * sets the 'data-id' attribute of the canvas to the id of the circuit.
 */
async function loadCircuitImage(){

    const canvasContainer = document.getElementById('edit-canvas-container')
    const canvas = document.getElementById('circuitCanvas')
    const circuitID = /** @type {HTMLFormElement} */(document.getElementById('opciones')).value

    if (circuitID == 0) return

    const circuit = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/circuit/${circuitID}`, 'GET') 
    console.log(circuitID)
    console.log(circuit)

    // @ts-expect-error External declaration
    // eslint-disable-next-line no-undef
    fabric.Image.fromURL(circuit.map, function(img) {
        // @ts-expect-error external declaration
        img.scaleToWidth(editCanvas.getWidth());
        // @ts-expect-error external declaration
        editCanvas.setBackgroundImage(img, editCanvas.renderAll.bind(editCanvas));
    });

    canvasContainer?.classList.remove('__hidden')
    canvas?.setAttribute('data-id', circuit._id)

    console.log(canvas)
    clearTraces()


}

/*===============================LAPTIMES=====================*/




/*======================MESSAGES======================*/






