//@ts-check



/**
 * @typedef {Object} timeRow
 * @property {string} time
 * @property {string} id
 */
export class Circuit{
    id
    name
    distance
    location
    url
    description
    bestlap
    prices
    map
    timeTable
/**
 * 
 * @param {string} id 
 * @param {string} name 
 * @param {number} distance 
 * @param {Object} location
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
    constructor(id, name, distance, location, url, description, bestlap, prices, map, timeTable = []){
        this.id = String(id) //TODO: timestamp
        this.name = name
        this.distance = distance
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
    //TODO: id implement
    id
    user
    article
    price
    location
    description
    img
/**
 * @param {string} id
 * @param {string} user 
 * @param {string} article 
 * @param {number} price 
 * @param {string} location 
 * @param {string} description 
 * @param {string} img 
 */
    constructor(id, user, article, price, location, description, img){
        this.id = id
        this.user = user
        this.article = article
        this.price = price
        this.location = location
        this.description = description
        this.img = img
    }  
}

export class ForumCard{
    //TODO: ID implement
    user
    title
    description
/**
 * 
 * @param {string} user 
 * @param {string} title 
 * @param {string} description 
 */
    constructor(user, title, description){
        this.user = user
        this.title = title
        this.description = description
    }
}

export class EventCard{
    //TODO: id implement
    id
    title    
    date
    user
    description
/**
 * @param {string} id
 * @param {string} title 
 * @param {Date} date 
 * @param {string} user 
 * @param {string} description 
 */
    constructor(id, title, date, user, description){ 
        this.id = id       
        this.title = title
        this.date = date
        this.user = user
        this.description = description
    }
}

export class User{
    id
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
 * @param {string} id
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
    constructor(id,username, name, email, password, surnames, location, bio, img, prefCircuit, kart, youtube, instagram, role, token){
        this.id = id
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