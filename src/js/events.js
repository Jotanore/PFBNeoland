import { EventCard} from '../classes/classes.js'
import { getUserFromSession, getAPIData, modalOpener} from "../utils/utils.js";
import { openForeignProfile } from "./foreign.profile.js";
import { userlog, API_PORT } from "./index.js";

/**
 * Assigns event listeners to the buttons for managing event forms.
 * - Opens the new event form when the 'new-event-form-btn' button is clicked.
 * - Closes the new event form when the 'new-event-close' button is clicked.
 * - Filters events when the 'filter-btn' button is clicked.
 */
export function assignEventButtons(){
    document.getElementById('new-event-form-btn')?.addEventListener('click', openNewEventForm)
    document.getElementById('new-event-close')?.addEventListener('click', closeNewEventForm)
    document.getElementById('filter-btn')?.addEventListener('click', filterEvents)
    
}

/**
 * Fetches event data from the API using the provided filters.
 * Clears the current event container content and populates it with
 * new events obtained from the API response.
 * 
 * @param {String} [filters] - The filters to apply when fetching events.
 *                           This should be a JSON string containing filter criteria.
 * 
 * @returns {Promise<void>} A promise that resolves once the events are fetched
 *                          and rendered in the event container.
 */

export async function getEventData(filters){
    const eventContainer = document.getElementById('__event-container')
    if(eventContainer) eventContainer.innerHTML = ''
    const eventArray = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/events` , 'GET', undefined ,filters)
    console.log(eventArray)
    eventArray.forEach(function (/** @type {EventCard} */ event){
        drawEvent(event)
    })
}    


/**
 * Handles the event filtering process upon the filter button click event.
 * Prevents the default form submission behavior, retrieves the filter criteria
 * from the form inputs, and constructs a filter object.
 * The function creates a JSON string payload of the filters and
 * sends it to the getEventData function to fetch and display the filtered events.
 * 
 * @param {Event} e - The event object associated with the click event.
 */

async function filterEvents(e){

    e.preventDefault()

    const circuit = /** @type {HTMLSelectElement} */ (document.getElementById('opciones-filtro')).value;
    const minDate = /** @type {HTMLInputElement} */ (document.getElementById('filterEventDate1')).value;
    const maxDate = /** @type {HTMLInputElement} */ (document.getElementById('filterEventDate2')).value;

    // if (minDate > maxDate){
    //     alert("La fecha final debe ser posterior a la inicial.");
    // }

    const filters = {
        circuit: circuit,
        minDate: minDate,
        maxDate: maxDate
    }
    const payload = JSON.stringify(filters)
    console.log("he llegado a filterEvents: ", payload)
    await getEventData(payload)

}



/**
 * Pinta un evento en el contenedor de eventos, con los
 * botones de apuntarse, desapuntarse y eliminar.
 * @param {EventCard} event - Objeto con la información
 *                           del evento.
 */
export async function drawEvent(event){
    const date = new Date(event.date)
    const eventFrame = document.getElementById('__event-container')
        const html =
                `<div class="bg-gray-100 shadow-md rounded-lg overflow-hidden flex items-center p-5 mb-4 border border-gray-200 w-full cursor-pointer event-card">
                <div class="flex flex-col flex-1">
                <h3 class="text-xl font-bold text-gray-800 truncate">${event.title}</h3>
                <p data-id="${event.location}" class="text-sm text-gray-600">${date.toLocaleDateString("es-ES")} - ${event.location} - ${event.user_username}</p>
                <p class="text-gray-700 text-sm my-2 line-clamp-2">${event.description}</p>
                </div>
                <p class="px-4"><span class="participant-count">${event.participants.length}</span>/${event.maxParticipants} inscritos</p>
                <p class="font-bold mr-4 log-warn">Debes estar logueado para unirte</p>
                <button data-id="${event._id}" class="border-2 border-black bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 m-4 rounded join-event">
                    Me apunto
                </button>
                <button data-id="${event._id}" class="border-2 border-black bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 m-4 rounded forfeit-event">
                    Desapuntarse
                </button>
                <button data-id="${event._id}" class="border-2 border-black bg-gray-400 hover:bg-red-500 text-white font-bold py-1 px-3 rounded delete-event hidden">
                    Delete
                </button>
                </div>`
        eventFrame?.insertAdjacentHTML('afterbegin', html)
        
    const lastCard = eventFrame?.firstElementChild;
    const deleteBtn = lastCard?.querySelector('.delete-event');
    const joinBtn = lastCard?.querySelector('.join-event');
    const forfeitBtn = lastCard?.querySelector('.forfeit-event');
    const logWarn = lastCard?.querySelector('.log-warn');

    joinBtn?.addEventListener('click', joinEvent)
    forfeitBtn?.addEventListener('click', forfeitEvent)
    deleteBtn?.addEventListener('click', deleteEventCard);

    if(userlog){
        logWarn?.classList.add('hidden')
        const user = getUserFromSession()

        if(event.user_id === user?._id){
            deleteBtn?.classList.remove('hidden')
        }

        // @ts-expect-error typing miss
        if (event.participants.includes(getUserFromSession()._id)){
            joinBtn?.classList.add('hidden')
            forfeitBtn?.classList.remove('hidden')
        }else{
            joinBtn?.classList.remove('hidden')
            forfeitBtn?.classList.add('hidden')
        }

    }else{
        deleteBtn?.classList.add('hidden')
        joinBtn?.classList.add('hidden')
        forfeitBtn?.classList.add('hidden')
    }

    

    lastCard?.addEventListener('click', async function(e){
        // @ts-expect-error classlist on event target
        // eslint-disable-next-line no-constant-binary-expression
        if (e.target?.classList.contains('delete-event' || 'join-event')) return;
        const eventUpdated = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/event/${event._id}`, 'GET');
        console.log(eventUpdated)
        eventModal(eventUpdated);
    });
}

/**
 * Event listener for the "Join" button in an event card.
 *
 * Makes a POST request to the API to join the event with the provided event ID and the logged-in user's ID.
 * Updates the participant count in the event card and toggles the visibility of the "Join" and "Forfeit" buttons.
 *
 * @param {Event} event - The event triggered when the user clicks the "Join" button.
 */
async function joinEvent(event){

    

    event.stopPropagation()

    const eventId = /** @type {HTMLElement} */ (event.target).getAttribute('data-id');
    const userId = getUserFromSession()?._id

    const card = /** @type {HTMLElement} */ (event.target).closest('.event-card');

    const joinBtn = card?.querySelector('.join-event');
    const forfeitBtn = card?.querySelector('.forfeit-event');

    console.log(joinBtn, forfeitBtn)

    const payload = JSON.stringify({
        user_id: userId
    })

    console.log(payload)

    try {
        const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/join/event/${eventId}`, 'POST', payload);
        console.log("Respuesta del servidor:", apiData);
    } catch (error) {
        console.error("Error al unirse:", error);
    }

    updateParticipantCount(eventId ?? '', 1)

    
    joinBtn?.classList.add('hidden')
    forfeitBtn?.classList.remove('hidden')

}


/**
 * Handles the forfeiting of an event by the user.
 * 
 * Stops the event propagation to prevent any parent handlers from being triggered.
 * Retrieves the event and user IDs, and sends a POST request to the server to forfeit the event.
 * Updates the participant count by decrementing it.
 * Toggles the visibility of the join and forfeit buttons on the event card.
 *
 * @param {Event} event - The event object associated with the click action.
 */
async function forfeitEvent(event){

    event.stopPropagation()

    const card = /** @type {HTMLElement} */ (event.target).closest('.event-card');

    const joinBtn = card?.querySelector('.join-event');
    const forfeitBtn = card?.querySelector('.forfeit-event');


    const eventId = /** @type {HTMLElement} */ (event.target).getAttribute('data-id');
    const userId = getUserFromSession()?._id

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

    updateParticipantCount(eventId ?? '', -1)

    joinBtn?.classList.remove('hidden')
    forfeitBtn?.classList.add('hidden')
}


/**
 * Deletes an event card from the DOM and requests the server to delete the event.
 * 
 * Stops the event propagation to prevent any parent handlers from being triggered.
 * Retrieves the event ID from the target element's data attributes.
 * Logs an error if the event ID is not found.
 * Removes the event card element from the DOM if it exists.
 * Sends a DELETE request to the server to delete the event based on its ID.
 * Logs the server response or any error encountered during the request.
 *
 * @param {Event} event - The event object associated with the click action.
 */
async function deleteEventCard(event) {
    
    event.stopPropagation()

    const eventId = /** @type {HTMLElement} */ (event.target).getAttribute('data-id');

    if (!eventId) {
        console.error("No se encontró el ID del evento.");
        return;
    }

    const card = /** @type {HTMLElement} */ (event.target).closest('.event-card');
    if (card) {
        card.remove(); 
    }


    try {
        const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/delete/event/${eventId}`, 'DELETE');
        console.log("Respuesta del servidor:", apiData);
    } catch (error) {
        console.error("Error eliminando el evento:", error);
    }
}

/**
 * Actualiza el contador de participantes en una tarjeta de evento.
 * @param {string} eventId - El ID del evento que se va a actualizar.
 * @param {number} count - El número de participantes que se va a agregar o eliminar.
 */
function updateParticipantCount(eventId, count) {
    const eventCard = document.querySelector(`.event-card button[data-id="${eventId}"]`)?.closest('.event-card');
    console.log(eventCard)
    if (eventCard) {
        const participantElement = eventCard.querySelector('.participant-count');
        if (participantElement) { 
            let participantCount = Number(participantElement.textContent);
            console.log(participantCount);
            participantCount += count;
            participantElement.textContent = String(participantCount);
        }
    }
}

/**
 * Opens a modal displaying the details of a given event.
 * Fetches user data to determine the event creator and participants.
 * Populates and displays the event details in a modal,
 * including title, creator, date, description, location, participants, and max participants.
 * Sets up an event listener to open the foreign profile of the event creator.
 *
 * @param {Object} event - The event data to display in the modal.
 * @param {string} event.title - The title of the event.
 * @param {string} event.user_id - The ID of the user who created the event.
 * @param {Date} event.date - The date of the event.
 * @param {string} event.description - The description of the event.
 * @param {string} event.location - The location of the event.
 * @param {Array<string>} event.participants - The list of participant IDs.
 * @param {number} event.maxParticipants - The maximum number of participants for the event.
 */
async function eventModal(event){
    modalOpener()
    const users = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/users/`, 'GET')

    const eventCreator = users.find(/** @param {User} user */ user => user._id === event.user_id)

    const participantsArray = users
    .filter(/** @param {User} user */ user => event.participants.includes(user._id))
    .map(/** @param {User} user */ user => ( user.username));

    console.log(participantsArray)

    const modalContent = document.getElementById('modal-content')
    console.log(modalContent)
    console.log(event)
    if (modalContent){
    modalContent.innerHTML = `<ul class="space-y-6 text-gray-800 font-medium">
    <li class="text-4xl font-extrabold text-black">${event.title}</li>

    <li class="flex justify-between items-center text-lg text-gray-700">
        <span><span class="font-semibold">Creado por:</span> 
            <button id="foreign-button" data-id="${event.user_id}" class="font-semibold text-blue-500 hover:text-blue-700 transition-colors" type="button">
                ${eventCreator.username}
            </button>
        </span>
        <span><span class="font-semibold"></span> </span>
    </li>

    <li class="text-lg text-gray-700">
        <p class="text-gray-600">${event.date}</p>
    </li>


    <!-- Ubicación -->
    <li class="text-lg text-gray-700">
        <span class="font-semibold">Ubicación:</span>
        <span class="text-gray-600">${event.location}</span>
    </li>

    <!-- Participantes -->
    <li class="text-lg text-gray-700">
        <span class="font-semibold">Participantes:</span>
        <span class="text-gray-600">${participantsArray.join(', ')}</span>
    </li>

    <!-- Máximo de Participantes -->
    <li class="text-lg text-gray-700">
        <span class="font-semibold">Máximo de Participantes:</span>
        <span class="text-gray-600">${event.maxParticipants}</span>
    </li>
    <li class="text-lg text-gray-700">
        <span class="font-semibold">Descripción:</span>
        <p class="text-gray-600">${event.description}</p>
    </li>
</ul>

`
    }
    document.getElementById('foreign-button')?.addEventListener('click', () => openForeignProfile('foreign-button'))
}

/**
 * Handles the form submission event from the events form.
 * Gets the values from the form, and sends them to the API to create a new
 * event. If the API call is successful, it creates a new EventCard object,
 * and draws it in the events list.
 * @function
 */
export async function eventFormManager(){
    document.getElementById('form')?.addEventListener('submit', async function (e){
        e.preventDefault()


        // @ts-expect-error value not on HTML
        const description = document.getElementById('description')?.value
        const sessionUser = getUserFromSession()

        // @ts-expect-error value not on HTML
        const eventTitle = document.getElementById('eventName')?.value
        // @ts-expect-error value not on HTML
        const eventDate = document.getElementById('eventDate')?.value
        // @ts-expect-error value not on HTML
        const eventLocation = document.getElementById('opciones')?.value
        // @ts-expect-error value not on HTML
        const eventMaxParticipants = document.getElementById('eventMaxParticipants')?.value

        if (eventLocation == "0") {
            alert("Selecciona un circuito.");
            return;
        }

        const circuit = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/circuit/${eventLocation}`, 'GET') 

        // @ts-expect-error value not on HTML
        const terms = document.getElementById("terms")?.checked;

        if (eventLocation == "0") {
            alert("Selecciona un circuito.");
            return;
        }

        if (!terms) {
            alert("Debes aceptar las normas para publicar.");
            return;
        }

                    const eventObject = {
                        user_id: sessionUser?._id,
                        user_username: sessionUser?.username,
                        title: eventTitle,
                        date: new Date(eventDate),
                        location_id: circuit._id,
                        location: circuit.name,
                        description: description,
                        participants: [],
                        maxParticipants: eventMaxParticipants
                    }

                    console.log("antes de fetch", eventObject)
                    const payload = JSON.stringify(eventObject)
                    console.log(payload)
                    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/create/event`,'POST', payload);

                    console.log(apiData)

                    const event = new EventCard(apiData._id, apiData.title, apiData.date, apiData.user_id, apiData.description, apiData.location, apiData.participants, apiData.maxParticipants, apiData.location_id, apiData.user_username)
                    //searchParams = new URLSearchParams(event).toString()
                    console.log(event)
                    //fetch(`${API_PORT}create/event?${searchParams}`)
                    drawEvent(event)
            
            // @ts-expect-error Known
        e.target?.reset();
    })
}

/**
 * Displays the form for creating a new event.
 * If the user is not logged in, an alert is shown to prompt the user to log in.
 */
function openNewEventForm(){
    if (!userlog){
        alert("Debes iniciar sesión para publicar.");
    }else{
    document.getElementById('new-event-form')?.classList.remove('__hidden')
    }
}

/**
 * Resets the form and hides the "new event" form.
 * @returns {void}
 */
function closeNewEventForm(){
    // @ts-expect-error Reset
    document.getElementById('form')?.reset()
    document.getElementById('new-event-form')?.classList.add('__hidden')
}




