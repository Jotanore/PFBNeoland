import { getAPIData, formatTime, getUserFromSession} from "../utils/utils.js";
import { API_PORT, userlog } from "./index.js"

/**
 * Asigna los eventos de apertura y cierre del formulario de creacion de vueltas rapidas,
 * asi como el evento de filtrado de vueltas rapidas.
 */
export function assignLapTimeButtons(){
    document.getElementById('new-laptime-form-btn')?.addEventListener('click', openNewLapTimeForm)
    document.getElementById('new-laptime-close')?.addEventListener('click', closeNewLapTimeForm)
    document.getElementById('laptime-filter-btn')?.addEventListener('click', filterLapTimes)
}

/**
 * Fetches and displays lap times based on provided filters.
 *
 * Clears the existing lap time table body, retrieves a list of lap times
 * from the API using the provided filters, and then draws each lap time
 * into the table.
 *
 * @param {String} [filters] - The criteria used to filter lap times.
 */

export async function getLapTimes(filters){
    console.log(filters)

    const laptimeTableBody = document.getElementById('laptime-table-body')
    if (laptimeTableBody) laptimeTableBody.innerHTML = ''
    const lapTimeArray = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/laptimes` , 'GET', undefined, filters)
    lapTimeArray.forEach(function (/** @type {LapTime} */ laptime){
            drawLapTimes(laptime)

    })
}

/**
 * Retrieves and displays the personal best lap times for the currently logged in user.
 *
 * Clears the existing personal best lap times table body, retrieves a list of personal
 * best lap times from the API for the current user, and then draws each lap time
 * into the table.
 */
export async function getBestLapTimes(){

    const user = getUserFromSession()

    const personalTableBody = document.getElementById('personal-table-body')
    if(personalTableBody) personalTableBody.innerHTML = ''
    const lapTimeArray = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/bestlaptimes/${user?._id}` , 'GET')

    console.log(lapTimeArray)
    lapTimeArray.forEach(function (/** @type {LapTime} */ laptime){
         drawBestLapTimes(laptime)

    })
} 

/**
 * Draws a lap time row in the personal best lap times table.
 *
 * @param {LapTime} laptime - The lap time to draw.
 */
function drawBestLapTimes(laptime){
    console.log(laptime)

    const formattedTime = formatTime(Number(laptime.laptime))
    // @ts-expect-error Backend addition
    const formattedDelta = formatTime(laptime.delta)
    const lapTimeFrame = document.getElementById('personal-table-body')

    const html = `
            <tr class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-2">${laptime.circuit}</td>
                <td class="border border-gray-300 px-4 py-2">${formattedTime}</td>
                <td class="border border-gray-300 px-4 py-2 ${laptime.
                    // @ts-expect-error Backend addition
                delta > 0 ? 'text-red-500' : 'text-green-500'}">${laptime.delta > 0 ? '+' : ''}${formattedDelta}</td>
            </tr>`
lapTimeFrame?.insertAdjacentHTML('afterbegin', html)

}

/**
 * Draws a lap time row in the lap times table.
 *
 * @param {LapTime} laptime - The lap time to draw.
 */
function drawLapTimes(laptime){
    console.log(laptime)

    const formattedTime = formatTime(Number(laptime.laptime))
    const lapTimeFrame = document.getElementById('laptime-table-body')
                const html = `
                <tr class="hover:bg-gray-50">
                        <td class="border border-gray-300 px-4 py-2">${laptime.circuit}</td>
                        <td class="border border-gray-300 px-4 py-2">${laptime.lapTimeDate}</td>
                        <td class="border border-gray-300 px-4 py-2">${laptime.userName}</td>
                        <td class="border border-gray-300 px-4 py-2">${formattedTime}</td>
                        <td class="border border-gray-300 px-4 py-2">${laptime.lapCondition}</td>
                        <td class="border border-gray-300 px-4 py-2">${laptime.kartType}</td>
                        <td class="border border-gray-300 px-4 py-2">${laptime.kartInfo}</td>
                        
                    </tr>`
lapTimeFrame?.insertAdjacentHTML('afterbegin', html)

}


/**
 * Filtra las vueltas rapidas en la base de datos segun los filtros de circuito,
 * condiciones y tipo de kart.
 * @returns {Promise<void>}
 */
async function filterLapTimes(){

    const circuit = /** @type {HTMLFormElement} */(document.getElementById('opciones-filtro')).value
    // @ts-expect-error casting
    let conditions = document.querySelector('input[name="condiciones"]:checked')?.value;
    // @ts-expect-error casting
    let kartType = document.querySelector('input[name="tipoKart"]:checked')?.value;

    console.log(circuit, conditions, kartType)

    switch(conditions){
        case 'dry':
            conditions = 'Seco'
            break
        case 'wet':
            conditions = 'Mojado'
            break
        case 'mix':
            conditions = 'Mixto'
            break
        case '0':
            conditions= ''
            break
        default : 
        conditions = ''
        break
    }

    switch(kartType){
        case 'rental':
            kartType = 'Rental'
            break
        case 'own':
            kartType = 'Particular'
            break
        case '0':
            kartType = ''
            break
        default : 
        kartType = ''
        break
    }

    const filters = {
        circuit: circuit,
        conditions: conditions,
        kartType: kartType
    }

    const payload = JSON.stringify(filters)
    console.log("he llegado a filterLaptimes: ", payload)
    await getLapTimes(payload)

}


/**
 * Abre el formulario de creacion de vueltas rapidas si el usuario ha iniciado sesion.
 * Si no ha iniciado sesion, muestra un mensaje de alerta.
 */
function openNewLapTimeForm(){
    if (!userlog){
        alert("Debes iniciar sesión para publicar.");
    }else{
    document.getElementById('new-laptime-form')?.classList.remove('__hidden')
    }
}

/**
 * Cierra el formulario de creacion de vueltas rapidas y resetea el contenido del formulario.
 */
function closeNewLapTimeForm(){
    /** @type {HTMLFormElement} */ (document.getElementById('laptime-form'))?.reset()
    document.getElementById('new-laptime-form')?.classList.add('__hidden')
}


export function createNewlaptime(){
    document.getElementById('laptime-form')?.addEventListener('submit', async function (e){
        e.preventDefault()

        const sessionUser = getUserFromSession()

        // @ts-expect-error value not on HTML
        const circuit_id = document.getElementById('opciones')?.value
        // @ts-expect-error value not on HTML
        const laptimeDate = document.getElementById('laptimeDate')?.value
        // @ts-expect-error value not on HTML
        const kartType = document.getElementById('laptimeKartSelect')?.value
        // @ts-expect-error value not on HTML
        const kartInfo = document.getElementById('laptimeKart')?.value
        // @ts-expect-error value not on HTML
        const lapCondition = document.getElementById('laptimeConditions')?.value

        // @ts-expect-error value not on HTML
        const lapMinutes = document.getElementById('laptime-minutes')?.value.padStart(2, '0')
        // @ts-expect-error value not on HTML
        const lapSeconds = document.getElementById('laptime-seconds')?.value.padStart(2, '0')
        // @ts-expect-error value not on HTML
        const lapMilliseconds = document.getElementById('laptime-milliseconds')?.value.padEnd(3, '0')

    
        const actualLaptime = Number(lapMinutes * 60000) + Number(lapSeconds * 1000) + Number(lapMilliseconds)

        console.log(lapMinutes, lapSeconds, lapMilliseconds, actualLaptime)

        const circuit = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/circuit/${circuit_id}`, 'GET') 

        const timeSheet = 'img'
        // @ts-expect-error checked not on HTML
        const lapLink = document.getElementById('laptimelink')?.value

        // @ts-expect-error checked not on HTML
        const terms = document.getElementById("terms")?.checked;


        if (!terms) {
            alert("Debes aceptar las normas para publicar.");
            return;
        }

        const lapTime = {
            user_id: sessionUser?._id,
            userName: sessionUser?.username,
            circuit: circuit.name,
            circuit_id: circuit._id,
            lapTimeDate: laptimeDate,
            kartType: kartType,
            kartInfo: kartInfo,
            lapCondition: lapCondition,
            laptime: actualLaptime,
            timeSheet: timeSheet,
            lapLink: lapLink
        }

        console.log("antes de fetch", lapTime)
        const payload = JSON.stringify(lapTime)
        console.log(payload)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/create/laptime`,'POST', payload);


})

}



