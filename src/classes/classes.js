//@ts-check


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
/**
 * 
 * @param {string} id 
 * @param {string} name 
 * @param {number} distance 
 * @param {string} location 
 * @param {string} url 
 * @param {string} description
 * @param {string} bestlap
 * @param {object} prices
 * @param {string} map
 * 
 * 
 */
    constructor(id, name, distance, location, url, description, bestlap, prices, map){
        this.id = String(id) //TODO: timestamp
        this.name = name
        this.distance = distance
        this.location = location
        this.url = url
        this.description = description
        this.bestlap = bestlap
        this.prices = prices
        this.map = map
    }
}

export class MarketItem{
    //TODO: id implement
    user
    article
    price
    location
    description
    img
/**
 * 
 * @param {string} user 
 * @param {string} article 
 * @param {number} price 
 * @param {string} location 
 * @param {string} description 
 * @param {string} img 
 */
    constructor(user, article, price, location, description, img){
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
    title    
    date
    user
    description
/**
 * 
 * @param {string} title 
 * @param {Date} date 
 * @param {string} user 
 * @param {string} description 
 */
    constructor(title, date, user, description){        
        this.title = title
        this.date = date
        this.user = user
        this.description = description
    }
}