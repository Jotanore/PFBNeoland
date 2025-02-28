/**
 * Returns a Promise that resolves to an array with the user's latitude and longitude
 * @returns {Promise<[number, number]>} - A Promise that resolves to an array with the user's latitude and longitude
 * @throws {Error} - If the user's browser does not support geolocation
 */
export function getUserCoords() {
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


/**
 * Calculates the distance in kilometers from the user's coordinates to the given
 * circuit coordinates using the Haversine formula.
 * @param {Object} coordsObject - Object with latitude and longitude properties
 * to calculate the distance to.
 * @returns {Promise<number>} - A promise that resolves to the calculated distance
 * in kilometers, rounded to one decimal place.
 */
export async function getUserToCircuitDistance(coordsObject, userCoords){
    // Earth radius
    const R = 6371; 
    // Destructure coords
    // @ts-expect-error naming
    const {latitude, longitude} = coordsObject
    // Does math
    if(userCoords){
    const dLat = (latitude - userCoords[0]) * Math.PI / 180;
    const dLon = (longitude - userCoords[1]) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(userCoords[0] * Math.PI / 180) * Math.cos(latitude * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    // Stores the distance fixing to 1 decimal
    const d = (R * c).toFixed(1);
    return Number(d)
    }
    return 0

}

