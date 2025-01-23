
export class Circuit{
    id
    name
    distance

    constructor(id, name, distance){
        this.id = id
        this.name = name
        this.distance = distance
    }
}

export class MarketItem{
    user
    article
    price
    location
    description
    img

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
    user
    title
    description

    constructor(user, title, description){
        this.user = user
        this.title = title
        this.description = description
    }
}

export class EventCard{
    user
    date
    title
    description

    constructor(user, date, title, description){        
        this.user = user
        this.date = date
        this.title = title
        this.description = description
    }
}