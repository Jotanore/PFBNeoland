import { getAPIData, updateSessionStorage } from "../utils/utils.js"
import { API_PORT } from "./index.js"

/**
 * Displays the login form by removing the '__hidden' class from it
 * and hides the signup form by adding the '__hidden' class.
 */
export function showLoginForm(){
    document.getElementById('login-form')?.classList.remove('__hidden')
    document.getElementById('signup-form')?.classList.add('__hidden')

}

/**
 * Assigns event listeners to the index page buttons.
 * - Opens the credentials form when the 'credentials-btn' button is clicked.
 * - Opens the signup form when the 'signup-link' button is clicked.
 * - Opens the login form when the 'login-link' button is clicked.
 */
export function assignIndexListeners(){
    document.getElementById('credentials-btn')?.addEventListener('click', showCredentialsForm)
    document.getElementById('signup-link')?.addEventListener('click', showRegisterForm)
    document.getElementById('login-link')?.addEventListener('click', showLoginForm)
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

/**
 * Displays the signup form by removing the '__hidden' class from it
 * and hides the login form by adding the '__hidden' class.
 * Also hides the credentials button.
 */
function showRegisterForm(){
    document.getElementById('login-form')?.classList.add('__hidden')
    document.getElementById('signup-form')?.classList.remove('__hidden')
    document.getElementById('credentials-btn')?.classList.add('__hidden')
}

/**
 * Displays the credentials form by revealing the credentials container
 * and hiding the landing container. Also hides the credentials button.
 */
export function showCredentialsForm(){
    document.getElementById('credentials-container')?.classList.remove('__hidden')
    document.getElementById('landing-container')?.classList.add('__hidden')
    document.getElementById('credentials-btn')?.classList.add('__hidden')
}

/**
 * Handles the register form submission.
 * Gets the data from the form, creates a new user and updates it with the
 * default data.
 * Stores the user without the password in the session storage and redirects
 * to the profile page.
 */
export function userRegister(){
    document.getElementById('signup-form')?.addEventListener('submit', async function (e){
        e.preventDefault()

        const newUser = {
            
            // @ts-expect-error type known
            username: document.getElementById('username')?.value,
            // @ts-expect-error type known
            email: document.getElementById('sign-email')?.value,
            // @ts-expect-error type known
            password: document.getElementById('sign-password')?.value
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

/**
 * Checks if the session storage contains a flag indicating that the sign-in form
 * should be shown. If the flag is present, it displays the credentials form and 
 * removes the flag to prevent repeated executions.
 */

export function checkSignRedirectionFlag(){
    if (sessionStorage.getItem('showSigninForm') === 'true') {
        showCredentialsForm();
        sessionStorage.removeItem('showSigninForm');
    }
}

/**
 * Handles a successful login from the login component
 * @param {CustomEvent} customEvent - The user data returned from the API
 * @returns void
 */
export function onLoginComponentSubmit(customEvent) {
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
