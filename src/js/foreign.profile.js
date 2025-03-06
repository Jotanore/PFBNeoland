import { getUserFromSession, getAPIData, getNowDate, getForeignUserFromSession, modalOpener } from "../utils/utils.js"
import { API_PORT } from "./index.js"

/**
 * Adds an event listener to the "Send message" button to open a modal
 * window for composing a new message when clicked.
 */
export function assignForeignProfileListeners(){
    document.getElementById('create-message-btn')?.addEventListener('click', messageModal)
console.log(document.getElementById('create-message-btn'))
}

/**
 * Opens a modal window for composing a new message and adds an event listener
 * to the "Send" button to send the message when clicked.
 * @function
 */
function messageModal(){
    modalOpener()

    const modal = document.getElementById('modal-content')

    if(modal){
    modal.innerHTML = `<h2 class="text-2xl font-bold text-gray-800 mb-4">Nuevo mensaje</h2>
                <form id="message-form" class="w-full max-w-md mx-auto">
                  <div class="mb-4">
                    <label for="message-title" class="block text-gray-700 font-bold mb-2">Título:</label>
                    <input id="message-title" name="message-title" class="w-full border border-gray-300 rounded-md p-2" />
                  </div>
                  <div class="mb-4">
                    <label for="message" class="block text-gray-700 font-bold mb-2">Mensaje:</label>
                    <textarea id="message" name="message" rows="4" class="w-full border border-gray-300 rounded-md p-2"></textarea>
                  </div>
                  <div class="flex justify-center">
                    <button id="message-submit-btn" type="button" class="bg-amber-400 hover:bg-amber-500 text-white font-bold py-2 px-6 rounded-full shadow-md">
                      Enviar
                    </button>
                  </div>
                </form>`

    document.getElementById('message-submit-btn')?.addEventListener('click', createMessage)
    }
}


/**
 * Creates a new message with the data provided in the message modal and sends it to the
 * API to be stored in the database.
 * @function
 */
async function createMessage(){

    /** @type {HTMLElement | null} */
    const title = document.getElementById('message-title');

    if (title instanceof HTMLInputElement) {
    console.log(title.value); 
    }
    /** @type {HTMLElement | null} */
    const message = document.getElementById('message');

    if (message instanceof HTMLInputElement) {
    console.log(message.value); 
    }


    const user = getUserFromSession()
    const foreignUser = getForeignUserFromSession()

    console.log(foreignUser)

    const messageData = {
        title: title.value,
        message: message.value,
        sender_id: user?._id,
        receiver_id: foreignUser,
        date: getNowDate(),
        isNew: true
    }

    console.log(messageData)
    const payload = JSON.stringify(messageData)

    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const APIData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/create/message`, 'POST', payload)
    
}




/**
 * Loads the data of a foreign user from the API and fills the foreign profile HTML
 * elements with the received data.
 *
 * @returns {Promise<void>}
 */
export async function loadForeignProfile(){
    const foreignID = sessionStorage.getItem('foreignId')
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/user/${foreignID}`, 'GET')

    fillForeignProfile(apiData)
}

  /**
   * Opens the profile of a foreign user.
   * If the foreign user ID matches the current user ID, redirects to the profile page.
   * Otherwise, stores the foreign user ID in session storage and redirects to the foreign profile page.
   *
   * @param {String} idname - The ID attribute of the HTML element containing the foreign user's ID.
   */
  
  export function openForeignProfile(/** @type {String} */ idname){
  
    const foreignID = document.getElementById(`${idname}`)?.getAttribute('data-id')
    const user = getUserFromSession()

    if(foreignID === user?._id){
        window.location.href = `profile.html`
    }else{
        sessionStorage.setItem('foreignId', foreignID ?? '');
        window.location.href = `foreign-profile.html`
    }
    
}


/**
 * Fills the foreign profile HTML elements with the data of a foreign user.
 *
 * @param {User} user - The user data to fill the foreign profile elements with.
 *
 * @returns {void}
 */
function fillForeignProfile(user){

    const foreignUsernameEl = document.getElementById('foreign-username');
    const foreignNameEl = document.getElementById('foreign-name');
    const foreignSurnameEl = document.getElementById('foreign-surname');
    const foreignEmailEl = document.getElementById('foreign-email');
    const foreignLocationEl = document.getElementById('foreign-location');
    const foreignPrefCircuitEl = document.getElementById('foreign-prefCircuit');
    const foreignKartEl = document.getElementById('foreign-kart');
    const foreignYoutubeEl = document.getElementById('foreign-youtubeURL');
    const foreignInstagramEl = document.getElementById('foreign-instagramUser');

    if (foreignUsernameEl) {
      foreignUsernameEl.innerHTML = user.username;
    }
    
    if (foreignNameEl) {
      foreignNameEl.innerHTML = user.name;
    }
    
    if (foreignSurnameEl) {
      foreignSurnameEl.innerHTML = user.surnames;
    }
    
    if (foreignEmailEl) {
      foreignEmailEl.innerHTML = user.email;
    }
    
    if (foreignLocationEl) {
      foreignLocationEl.innerHTML = user.location;
    }
    
    if (foreignPrefCircuitEl) {
      foreignPrefCircuitEl.innerHTML = user.prefCircuit;
    }
    
    if (foreignKartEl) {
      foreignKartEl.innerHTML = user.kart;
    }
    
    if (foreignYoutubeEl) {
      foreignYoutubeEl.innerHTML = user.youtube;
    }
    
    if (foreignInstagramEl) {
      foreignInstagramEl.innerHTML = user.instagram;
    }
    
}