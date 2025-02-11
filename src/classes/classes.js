//@ts-check



/**
 * @typedef {Object} timeRow
 * @property {string} time
 * @property {string} _id
 */
export class Circuit{
    _id
    name
    location
    url
    description
    bestlap
    prices
    map
    //timeTable
    //raceLines
/**
 * 
 * @param {string} _id 
 * @param {string} name 
 * @param {Object} location
 * @param {string} location.province
 * @param {string} location.latitude
 * @param {string} location.longitude 
 * @param {string} url 
 * @param {string} description
 * @param {string} bestlap
 * @param {object} prices
 * @param {string} map
 * @param {Array<timeRow>} timeTable
 * 
 */
    constructor(_id, name, location, url, description, bestlap, prices, map, timeTable = []){
        this._id = String(_id) 
        this.name = name
        this.location = location
        this.url = url
        this.description = description
        this.bestlap = bestlap
        this.prices = prices
        this.map = map
        this.timeTable = timeTable
    }
}

export class MarketItem{
    _id
    user_id
    article
    price
    location
    description
    img
/**
 * @param {string} _id
 * @param {string} user_id
 * @param {string} article 
 * @param {number} price 
 * @param {string} location 
 * @param {string} description 
 * @param {string} img 
 */
    constructor(_id, user_id, article, price, location, description, img){
        this._id = _id
        this.user_id = user_id
        this.article = article
        this.price = price
        this.location = location
        this.description = description
        this.img = img
    }  
}

export class ForumCard{
    //TODO: ID implement
    _id
    user_id
    title
    description
/**
 * @param {string} _id 
 * @param {string} user_id 
 * @param {string} title 
 * @param {string} description 
 */
    constructor(_id, user_id, title, description){
        this._id = _id
        this.user_id = user_id
        this.title = title
        this.description = description
    }
}

export class EventCard{
    _id
    title    
    date
    user_id
    description
    location
/**
 * @param {string} _id
 * @param {string} title 
 * @param {Date} date 
 * @param {string} user_id 
 * @param {string} description
 * @param {string} location 
 */
    constructor(_id, title, date, user_id, description, location){
        this._id = _id       
        this.title = title
        this.date = date
        this.user_id = user_id
        this.description = description
        this.location = location
    }
}

export class User{
    _id
    username
    name
    email
    password
    surnames
    location
    bio
    img
    prefCircuit
    kart
    youtube
    instagram
    role
    token

/**
 * 
 * @param {string} _id
 * @param {string} username
 * @param {string} name 
 * @param {string} email 
 * @param {string} password
 * @param {string} surnames
 * @param {string} location
 * @param {string} bio
 * @param {string} img
 * @param {string} prefCircuit
 * @param {string} kart
 * @param {string} youtube
 * @param {string} instagram
 * @param {string} role
 * @param {string} token
 */
    constructor(_id,username, name, email, password, surnames, location, bio, img, prefCircuit, kart, youtube, instagram, role, token){
        this._id = _id
        this.username = username
        this.name = name
        this.email = email
        this.password = password
        this.surnames = surnames
        this.location = location
        this.bio = bio
        this.img = img
        this.prefCircuit = prefCircuit
        this.kart = kart
        this.youtube = youtube
        this.instagram = instagram
        this.role = role
        this.token = token
    }
}

export class Timetable{

    _id
    user_id
    lapTime
    circuit_id
    lapRecord 

/**
 * 
 * @param {string} _id
 * @param {string} user_id
 * @param {string} lapTime  
 * @param {string} circuit_id
 * @param {string} lapRecord
 */

    constructor(_id, user_id, lapTime, circuit_id, lapRecord){
        this._id = _id
        this.user_id = user_id
        this.lapTime = lapTime
        this.circuit_id = circuit_id
        this.lapRecord = lapRecord
    }
}

export class RaceLines{

    _id
    user_id
    circuit_id 
    img

/** 
 * 
 * @param {string} _id  
 * @param {string} user_id
 * @param {string} circuit_id
 * @param {string} img
 */
    constructor(_id, user_id, circuit_id, img){
        this._id = _id  
        this.user_id = user_id
        this.circuit_id = circuit_id
        this.img = img
    }
}