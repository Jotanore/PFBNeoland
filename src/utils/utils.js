import { simpleFetch } from '../js/lib/simpleFetch.js';
import { HttpError } from '../classes/HttpError.js';
import { API_PORT, userlog } from '../js/index.js';
import { showCredentialsForm } from '../js/index.page.js';

/**
 * Returns the current date in the format dd/mm/yyyy
 * @returns {string} The current date
 */
export function getNowDate(){

    const now = new Date()
    const day = String(now.getDate()).padStart(2, '0')
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const year = now.getFullYear();

    return `${day}/${month}/${year}`
}

export function getFormattedDate(milliseconds) {
  const now = new Date(milliseconds);
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Opens the modal window by removing the '__hidden' class from the modal element.
 */

export function modalOpener(){
    const modalWindow = document.getElementById('modal')
    modalWindow?.classList.remove('__hidden')
}

/**
 * Closes the modal window and removes the content from the modal
 * @function
 */
export function modalCloser(){
    const modalWindow = document.getElementById('modal')
    const modalContent = document.getElementById('modal-content')

    modalWindow?.classList.add('__hidden')
    if (modalContent) modalContent.innerHTML = ''
}

/**
 * Handles the modal window's closing and opening. Listens for clicks on the close
 * button and the modal window itself, and hides the modal window if either of
 * those elements are clicked.
 */
export function modalManager(){
    const modalCloseBtn = document.getElementById('modal-close')
    modalCloseBtn?.addEventListener('click', function(e) {
        e.stopPropagation()
        modalCloser()
    });
    document.getElementById('modal')?.addEventListener('click', function(e) {
        if (e.target === this) {
            modalCloser()
        }
    })
}

/**
 * Retrieves the user data stored in the session storage.
 * 
 * @returns {User|null} The user data as a JavaScript object or null if no data is found.
 */

export function getUserFromSession(){
    // @ts-expect-error Known
    return JSON.parse(sessionStorage.getItem('user'))
}

/**
 * Devuelve el id del usuario extranjero que se ha guardado en una variable de sesión
 * cuando se accede a su perfil
 * @returns {string | null} id del usuario extranjero
 */
export function getForeignUserFromSession(){
    return sessionStorage.getItem('foreignId')
}


/**
 * Hace una petición a la API y devuelve el resultado
 * 
 * @param {string} apiURL - URL de la API a la que se va a hacer la petición
 * @param {string} method - Método HTTP a utilizar. Por defecto es GET
 * @param {string} [data] - Si se va a hacer una petición con body, se pasa aquí el contenido del body como string
 * @param {string} [filters] - Filtros a aplicar a la petición. Se envían en el header "Filters"
 * @returns {Promise<any>} - El resultado de la petición. Si falla, se devuelve undefined
 */
export async function getAPIData(/**  @type {string} */ apiURL, /**  @type {string} */ method, /**  @type {string} */ data, /**  @type {string} */ filters) {
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

  /**
   * Checks if there is a user logged in by verifying the presence of a token
   * in the session storage.
   *
   * @returns {string | undefined} True if the user is logged in, false otherwise.
   */
  
    export function isUserLoggedIn() {
      const userData = getUserFromSession()
      return userData?.token
    }

/**
 * Rellena un elemento select con los circuitos disponibles
 * @param {string} dropdown - El id del elemento select que se va a rellenar
 */
export async function fillSelectable(/**  @type {string} */dropdown){

    const circuitArray = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/circuits` , 'GET')

    let selectDropdown = document.getElementById(`${dropdown}`)

    circuitArray.forEach(function (circuit){

    const html = `<option value="${circuit._id}">${circuit.name}</option>`

    selectDropdown?.insertAdjacentHTML('beforeend', html)
    })

}

/**
 * Restricts the viewport translation of the given canvas to ensure that
 * the background image remains fully visible within the canvas boundaries.
 * The function adjusts the viewport's horizontal and vertical translation
 * values based on the current zoom level and background image dimensions.
 * @param {{ setBackgroundImage?: (arg0: any, arg1: any) => void; renderAll?: { (): void; (): void; bind: any; }; isDrawingMode?: boolean; selection?: boolean; on?: (arg0: string, arg1: { (opt: any): void; (opt: any): void; (): void; (opt: any): void; }) => void; viewportTransform: any; requestRenderAll?: () => void; getPointer?: (arg0: any) => any; getZoom: any; backgroundImage: any; getWidth: any; getHeight: any; zoomToPoint?: (arg0: any, arg1: any) => void; add?: (arg0: any) => void; setViewportTransform?: any; }} canvas
 */
export function clampRacelineViewport(canvas) {
    const bg = canvas.backgroundImage;
    if (!bg) return;
    
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    const zoom = canvas.getZoom();
    
    const bgWidth = bg.width * bg.scaleX * zoom;
    const bgHeight = bg.height * bg.scaleY * zoom;
    
    const vt = canvas.viewportTransform; 
    
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
    
    canvas.setViewportTransform(vt);
}

/**
 * Saves a user object in session storage
 * @param {User} value - The user object to be saved
 * @returns void
 */
export function updateSessionStorage(/** @type {User} */ value) {
    sessionStorage.setItem('user', JSON.stringify(value))
  }

  /**
 * Formatea un tiempo en milisegundos como una cadena de tiempo mm:ss,mmm
 * @param {number} time - Tiempo en milisegundos
 * @returns {string} - Tiempo formateado como mm:ss,mmm
 */
export function formatTime(time) {
    console.log(time)
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = time % 1000;

    console.log(minutes, seconds, milliseconds)
  
    return `${minutes.toString().padStart(2, '0')}.${seconds.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`;
}

/**
 * Manages the button to show the login/register form.
 * If the button is clicked and the user is in the index page, it shows the form.
 * If the button is clicked and the user is not in the index page, it sets a flag and redirects to index.html.
 * Also, it hides or shows the buttons to show the login/register form or the profile page, depending on whether a user is logged in or not.
 * 
 * @returns {void}
 */
export function credentialsBtnManager(){
    document.getElementById('credentials-btn')?.addEventListener('click', () => {

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
        document.getElementById('credentials-btn')?.classList.add('__hidden')
        document.getElementById('profile-btn')?.classList.remove('__hidden')
        document.getElementById('messages')?.classList.remove('__hidden')  
    }else{
        document.getElementById('credentials-btn')?.classList.remove('__hidden')
        document.getElementById('profile-btn')?.classList.add('__hidden')    
        document.getElementById('messages')?.classList.add('__hidden')    
}

}


  
