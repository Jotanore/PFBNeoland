import { getUserFromSession, getAPIData, getForeignUserFromSession } from "../utils/utils.js";
import { API_PORT } from "../js/index.js";
/**
 * Rellena el formulario de edición de perfil con los datos del usuario
 * en la sesión actual.
 */
export function fillUserForm(){
    const userData = getUserFromSession()

    const usernameInput = document.getElementById('profile-username');
    // @ts-expect-error Placeholder not existing
    if (usernameInput) usernameInput.placeholder = userData.username || '';

    const nameInput = document.getElementById('profile-name');
    // @ts-expect-error Placeholder not existing
    if (nameInput) nameInput.placeholder = userData.name || '';

    const surnameInput = document.getElementById('profile-surname');
    // @ts-expect-error Placeholder not existing
    if (surnameInput) surnameInput.placeholder = userData.surnames || '';

    const locationInput = document.getElementById('profile-location');
    // @ts-expect-error Placeholder not existing
    if (locationInput) locationInput.placeholder = userData.location || '';

    const prefCircuitInput = document.getElementById('profile-prefCircuit');
    // @ts-expect-error Placeholder not existing
    if (prefCircuitInput) prefCircuitInput.placeholder = userData.prefCircuit || '';

    const kartInput = document.getElementById('profile-kart');
    // @ts-expect-error Placeholder not existing
    if (kartInput) kartInput.placeholder = userData.kart || '';

    const youtubeInput = document.getElementById('profile-youtubeURL');
    // @ts-expect-error Placeholder not existing
    if (youtubeInput) youtubeInput.placeholder = userData.youtube || '';

    const instagramInput = document.getElementById('profile-instagramUser');
    // @ts-expect-error Placeholder not existing
    if (instagramInput) instagramInput.placeholder = userData.instagram || '';

}

/**
 * Logs the user out by removing the user from the session storage and redirecting to index.html
 * @returns {void}
 */
export function userLogOut(){
    sessionStorage.removeItem('user')
    window.location.href = 'index.html'
}

/**
 * Shows the user profile and hides the update form and all other content.
 * It's used when the user clicks on the profile button or the discard button in the update form.
 */
function showProfile(){
    document.getElementById("profile-container")?.classList.remove("__hidden")
    document.getElementById("profile-update-form")?.classList.add("__hidden")

    document.getElementById('event-container')?.classList.remove("__hidden")
    document.getElementById('fastlaps-container')?.classList.remove("__hidden")
    document.getElementById('market-container')?.classList.remove("__hidden")
    document.getElementById('racelines-list')?.classList.remove("__hidden")
    document.getElementById('racelineCanvas-container')?.classList.add("__hidden")
}

/**
 * Fills the user profile page with the information stored in the user session.
 * If no user is logged in, it does nothing.
 * It also assigns the event listeners for the profile page buttons.
 * @function
 */
export function fillUserProfile(){
    const user = getUserFromSession()

    
    if (user) {
        /** @type {HTMLElement | null} */
        const usernameElement = document.getElementById('user-username');
        if (usernameElement) usernameElement.innerHTML = user.username;
    
        /** @type {HTMLElement | null} */
        const nameElement = document.getElementById('user-name');
        if (nameElement) nameElement.innerHTML = user.name;
    
        /** @type {HTMLElement | null} */
        const surnameElement = document.getElementById('user-surname');
        if (surnameElement) surnameElement.innerHTML = user.surnames;
    
        /** @type {HTMLElement | null} */
        const emailElement = document.getElementById('user-email');
        if (emailElement) emailElement.innerHTML = user.email;
    
        /** @type {HTMLElement | null} */
        const locationElement = document.getElementById('user-location');
        if (locationElement) locationElement.innerHTML = user.location;
    
        /** @type {HTMLElement | null} */
        const prefCircuitElement = document.getElementById('user-prefCircuit');
        if (prefCircuitElement) prefCircuitElement.innerHTML = user.prefCircuit;
    
        /** @type {HTMLElement | null} */
        const kartElement = document.getElementById('user-kart');
        if (kartElement) kartElement.innerHTML = user.kart;
    
        /** @type {HTMLElement | null} */
        const youtubeElement = document.getElementById('user-youtubeURL');
        if (youtubeElement) youtubeElement.innerHTML = user.youtube;
    
        /** @type {HTMLElement | null} */
        const instagramElement = document.getElementById('user-instagramUser');
        if (instagramElement) instagramElement.innerHTML = user.instagram;
    }
    
    document.getElementById("edit-profile-btn")?.addEventListener('click', showProfileform)
    document.getElementById("logout-btn")?.addEventListener('click', userLogOut)
    document.getElementById("profile-update-btn")?.addEventListener('click', showProfile)
    document.getElementById('profile-return-btn')?.addEventListener('click', showProfile)
    document.getElementById("discard-btn")?.addEventListener('click',function(e) {
        e.preventDefault();
    
        const form = document.getElementById('profile-update-form');
       
        // @ts-expect-error HTMLElement
        form?.reset(); 
        showProfile(); 
    });
}

/**
 * Shows the user profile update form and hides all other content.
 */
function showProfileform(){
    document.getElementById("profile-update-form")?.classList.remove("__hidden")
    document.getElementById('event-container')?.classList.add("__hidden")
    document.getElementById('fastlaps-container')?.classList.add("__hidden")
    document.getElementById('market-container')?.classList.add("__hidden")
    document.getElementById('racelines-list')?.classList.add("__hidden")
    document.getElementById("profile-container")?.classList.add("__hidden")
    document.getElementById('racelineCanvas-container')?.classList.add("__hidden")
}

/**
 * Handles the user profile update process.
 * 
 * This function listens for the submit event on the profile update form, retrieves
 * the current user data from the session, and updates the user's profile with the 
 * values from the form inputs. If a form input is empty, it retains the existing 
 * user data. It sends an asynchronous PUT request to update the user data on the server 
 * and updates the session storage with the new user data. It also updates the displayed 
 * user profile information on the page if applicable.
 */

export function updateUserProfile(){
    const storedUser = getUserFromSession()  
    document.getElementById('profile-update-form')?.addEventListener('submit', async function (e){
        e.preventDefault()

        const newUser = {
            // @ts-expect-error value not existing
            username: document.getElementById('profile-username')?.value ? document.getElementById('profile-username')?.value : storedUser.username,
            // @ts-expect-error value not existing
            name: document.getElementById('profile-name')?.value ? document.getElementById('profile-name')?.value : storedUser.name,
            // @ts-expect-error value not existing
            surnames: document.getElementById('profile-surname')?.value ? document.getElementById('profile-surname')?.value : storedUser.surnames,    
            //email: document.getElementById('profile-email').value ? document.getElementById('profile-email').value : storedUser.email,
            // @ts-expect-error value not existing
            location: document.getElementById('profile-location')?.value ? document.getElementById('profile-location')?.value : storedUser.location,
            // @ts-expect-error value not existing
            prefCircuit: document.getElementById('profile-prefCircuit')?.value ? document.getElementById('profile-prefCircuit')?.value : storedUser.prefCircuit,
            // @ts-expect-error value not existing
            kart: document.getElementById('profile-kart')?.value ? document.getElementById('profile-kart')?.value : storedUser.kart,
            // @ts-expect-error value not existing
            youtube: document.getElementById('profile-youtubeURL')?.value ? document.getElementById('profile-youtubeURL')?.value : storedUser.youtube,
            // @ts-expect-error value not existing
            instagram: document.getElementById('profile-instagramUser')?.value ? document.getElementById('profile-instagramUser')?.value : storedUser.instagram
        }
        // @ts-expect-error value not existing
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const confirmPassword = document.getElementById('profile-passwordRepeat')?.value

        // if (newUser.password !== confirmPassword){ 
        //     alert("Contraseña no coincide")
        //     return 
        // }
        console.log(newUser)
        // await fetch(`${API_PORT}update/user/${storedUser.id}/PUT/${newUser}`)

        
        console.log("antes de fetch", newUser)
        const payload = JSON.stringify(newUser)
        console.log("payload",payload)
        const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/update/user/${storedUser?._id}`, "PUT", payload);
        console.log("Respuesta del servidor:", apiData);

        // @ts-expect-error assignation
        newUser._id = storedUser?._id
        console.log(newUser)
        sessionStorage.setItem('user', JSON.stringify(newUser))

        const usernameEl = document.getElementById('user-username');
        if (usernameEl) usernameEl.textContent = newUser.username || storedUser?.username;

        const nameEl = document.getElementById('user-name');
        if (nameEl) nameEl.textContent = newUser.name || storedUser?.name;

        const surnameEl = document.getElementById('user-surname');
        if (surnameEl) surnameEl.textContent = newUser.surnames || storedUser?.surnames;

        const locationEl = document.getElementById('user-location');
        if (locationEl) locationEl.textContent = newUser.location || storedUser?.location;

        const prefCircuitEl = document.getElementById('user-prefCircuit');
        if (prefCircuitEl) prefCircuitEl.textContent = newUser.prefCircuit || storedUser?.prefCircuit;

        const kartEl = document.getElementById('user-kart');
        if (kartEl) kartEl.textContent = newUser.kart || storedUser?.kart;

        const youtubeEl = document.getElementById('user-youtubeURL');
        if (youtubeEl) youtubeEl.textContent = newUser.youtube || storedUser?.youtube;

        const instagramEl = document.getElementById('user-instagramUser');
        if (instagramEl) instagramEl.textContent = newUser.instagram || storedUser?.instagram;

        // const searchParams = new URLSearchParams(user).toString()
        // console.log(searchParams)
        // fetch(`${API_PORT}update/user?${searchParams}`)

        // @ts-expect-error reset not existing
        e.target?.reset();
    })
}

/**
 * Populates a list of race lines associated with a specific user.
 * 
 * This asynchronous function retrieves race line data for a given userId
 * from the server and fetches additional information about each race line's
 * circuit. It then updates the race lines list with the fetched data.
 * 
 * @param {string} userId - The ID of the user whose race lines are to be fetched.
 */
export async function fillRaceLinesLit(/** @type {boolean} */ isUser){

    const user = isUser ? getUserFromSession()._id : getForeignUserFromSession()

    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/racelines/${user}` , 'GET')
    /**
     * @type {any[]}
     */
    let racelines = []
    
    await Promise.all(apiData.map(async function (/** @type {RaceLines} */raceline) {
        const lineCircuit = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/circuit/${raceline.circuit_id}`, 'GET')
        //  @ts-expect-error Declaration
        raceline.circuitName = lineCircuit.name
        racelines.push(raceline)
        return lineCircuit
    }))
    updateRaceLineList(racelines)
    
}

/**
 * Updates the race lines list component with the given race lines.
 * 
 * @param {Array<Object>} racelines - The race lines to be displayed.
 */
export function updateRaceLineList(/**  @type {Array<Object>} */ racelines) {
    document.getElementById('racelines-list')?.setAttribute('racelines', JSON.stringify(racelines))
  }

