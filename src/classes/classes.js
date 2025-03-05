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

/**
 * 
 * @param {string} _id 
 * @param {string} name 
 * @param {Object} location
 * @param {string} location.province
 * @param {string} location.latitude
 * @param {string} location.longitude
 * @param {string} location.googleUrl
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
    participants
    maxParticipants
    location_id
/**
 * @param {string} _id
 * @param {string} title 
 * @param {Date} date 
 * @param {string} user_id 
 * @param {string} description
 * @param {string} location 
 * @param {Array<string>} participants
 * @param {string} maxParticipants
 * @param {string} location_id
 * @param {string} user_username
 */
    constructor(_id, title, date, user_id, description, location, participants, maxParticipants, location_id, user_username){
        this._id = _id       
        this.title = title
        this.date = date
        this.user_id = user_id
        this.description = description
        this.location = location
        this.participants = participants
        this.maxParticipants = maxParticipants
        this.location_id = location_id
        this.user_username = user_username
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
    sentMessages
    receivedMessages

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
 * @param {Array<string>} sentMessages
 * @param {Array<string>} receivedMessages
 */
    constructor(_id,username, name, email, password, surnames, location, bio, img, prefCircuit, kart, youtube, instagram, role, token, sentMessages, receivedMessages){
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
        this.sentMessages = sentMessages
        this.receivedMessages = receivedMessages
    }
}

export class LapTime{

    _id
    user_id
    username
    circuit
    circuit_id
    lapTimeDate
    kartType
    kartInfo
    lapCondition
    laptime
    timeSheet
    lapLink

/**
 * 
 * @param {string} _id
 * @param {string} user_id
 * @param {string} username
 * @param {string} circuit
 * @param {string} circuit_id
 * @param {string} lapTimeDate
 * @param {string} kartType
 * @param {string} kartInfo
 * @param {string} lapCondition
 * @param {string} laptime
 * @param {string} timeSheet
 * @param {string} lapLink
 */

    constructor(_id, user_id, username, circuit, circuit_id, lapTimeDate, kartType, kartInfo, lapCondition, laptime, timeSheet, lapLink){
        this._id = _id
        this.user_id = user_id
        this.username = username
        this.circuit = circuit
        this.circuit_id = circuit_id
        this.lapTimeDate = lapTimeDate
        this.kartType = kartType
        this.kartInfo = kartInfo
        this.lapCondition = lapCondition
        this.laptime = laptime
        this.timeSheet = timeSheet
        this.lapLink = lapLink
    }
}

export class RaceLines{

    _id
    user_id
    circuit_id 
    img
    date

/** 
 * 
 * @param {string} _id  
 * @param {string} user_id
 * @param {string} circuit_id
 * @param {string} img
 * @param {string} date
 */
    constructor(_id, user_id, circuit_id, img, date){
        this._id = _id  
        this.user_id = user_id
        this.circuit_id = circuit_id
        this.img = img
        this.date = date
    }
}

export class Message{

    _id
    sender_id
    receiver_id
    title
    message
    date
    isNew
    receiver_username
    sender_username


/**
 * 
 * @param {string} _id
 * @param {string} sender_id
 * @param {string} receiver_id
 * @param {string} title
 * @param {string} message
 * @param {string} date
 * @param {boolean} isNew
 * @param {string} receiver_username
 * @param {string} sender_username
 */

    constructor(_id, sender_id, receiver_id, title, message, date, isNew, receiver_username, sender_username){
        this._id = _id
        this.sender_id = sender_id
        this.receiver_id = receiver_id
        this.title = title
        this.message = message
        this.date = date
        this.isNew = isNew
        this.receiver_username = receiver_username
        this.sender_username = sender_username

    }

}