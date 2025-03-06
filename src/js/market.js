import { MarketItem } from '../classes/classes.js'
import { getUserFromSession, getAPIData, modalOpener} from "../utils/utils.js";
import { API_PORT, userlog } from "./index.js"

/**
 * Uses a JSON to get the marketItems
 * Creates a new MarketItem Object with the info
 * Pushes them to store
 */
export async function getMarketData(){
        const marketArray = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/articles` , 'GET')
        marketArray.forEach(function (/** @type {MarketItem} */ item){
                drawArticle(item)

        })
   } 


/**
 * Draws a single market article card with the given data.
 * @param {MarketItem} item - The market item data to draw.
 */
export async function drawArticle(item){
        console.log(item)
        const itemCreator = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/user/${item.user_id}`, 'GET')
        const marketFrame = document.getElementById('__market-container')
        const html = `<div class="bg-neutral-100 shadow-md rounded-lg overflow-hidden flex items-center p-5 mx-4 mb-4 cursor-pointer border border-gray-200">
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


    const lastCard = marketFrame?.firstElementChild;
    const deleteBtn = lastCard?.querySelector('.delete-item');
    deleteBtn?.addEventListener('click', deleteMarketCard);

    lastCard?.addEventListener('click', function(e){
        const target = e.target;
        if (target instanceof HTMLElement && target.classList.contains('delete-item')) return;
        marketModal(item);
      });
}

/**
 * Deletes a market card
 * @param {Event} event 
 */
async function deleteMarketCard(event) {
    // @ts-expect-error Ignore
    const marketId = event.target?.getAttribute('data-id');
    console.log(marketId)

    event.stopPropagation()

    const target = event.target;
    if (target instanceof HTMLElement) {
    const card = target.closest('.market-card');
    if (card) {
        card.remove();
    }
    }

    try {
        const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/delete/article/${marketId}`, 'DELETE');
        console.log("Respuesta del servidor:", apiData);
    } catch (error) {
        console.error("Error eliminando el evento:", error);
    }
}



/**
 * Shows a modal with the given market item data.
 * @param {MarketItem} item - The market item data to show in the modal.
 * @param {Object} item
 * @param {string} item.user
 * @param {string} item.article
 * @param {number} item.price
 * @param {string} item.location
 * @param {string} item.description
 * @param {string} item.img
 * @param {string} item._id
 * @param {string} item.user_id
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

/**
 * Shows the form for creating a new market item.
 * If the user is not logged in, an alert will be shown.
 */
function openNewMarketForm(){
    if (!userlog){
        alert("Debes iniciar sesión para publicar.");
    }else{
    document.getElementById('new-item-form')?.classList.remove('__hidden')
    }
}

/**
 * Resets the form and hides the "new market item" form.
 * @returns {void}
 */
function closeNewMarketForm(){
    (/** @type {HTMLFormElement} */(document.getElementById('form'))).reset();
    document.getElementById('new-item-form')?.classList.add('__hidden')
}

/**
 * Assigns event listeners to the buttons for managing market forms.
 * - Opens the new market item form when the 'new-item-form-btn' button is clicked.
 * - Closes the new market item form when the 'new-item-close' button is clicked.
 */
export function assignMarketButtons(){
    document.getElementById('new-item-form-btn')?.addEventListener('click', openNewMarketForm)
    document.getElementById('new-item-close')?.addEventListener('click', closeNewMarketForm)
    
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}


/**
 * Handles the form submission event from the market form.
 * Gets the values from the form, and sends them to the API to create a new
 * market item. If the API call is successful, it creates a new MarketItem
 * object, and draws it in the market list.
 * @function
 */
export async function marketFormManager(){
    document.getElementById('form')?.addEventListener('submit', async function (e){
        e.preventDefault()

        // @ts-expect-error value not on HTML
        const description = document.getElementById('description')?.value
        const sessionUser = getUserFromSession()

        // @ts-expect-error value not on HTML
        const itemName = document.getElementById('itemName')?.value
        // @ts-expect-error value not on HTML
        const itemPrice = document.getElementById('itemPrice')?.value
        // @ts-expect-error value not on HTML
        const itemLocation = document.getElementById('itemLocation')?.value
        const itemImg = "imgs/Rotax1.jpeg"
        // @ts-expect-error value not on HTML
        const terms = document.getElementById("terms")?.checked;

        if (!terms) {
            alert("Debes aceptar las normas para publicar.");
            return;
        }
                    const marketItem = {
                        article: itemName,
                        price: itemPrice,
                        user_id: sessionUser?._id,
                        location: itemLocation,
                        description: description,
                        img: itemImg,
                    }
                    
                    console.log("antes de fetch", marketItem)
                    const payload = JSON.stringify(marketItem)
                    console.log(payload)
                    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/create/article`,'POST', payload);

                    const item = new MarketItem(apiData._id, apiData.user_id, apiData.article, apiData.price, apiData.location, apiData.description, apiData.img)
                    // const item = new MarketItem('',user, itemName, itemPrice, itemLocation, description, itemImg)
                    //searchParams = new URLSearchParams(item).toString()
                    console.log(apiData)
                    //fetch(`${API_PORT}create/article?${searchParams}`)


                    drawArticle(item)

            // @ts-expect-error Known
        e.target?.reset();
    })
}