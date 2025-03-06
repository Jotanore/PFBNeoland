import express, { Router } from 'express';
import bodyParser from 'body-parser';
import serverless from 'serverless-http';
import { MongoClient, ObjectId} from 'mongodb';


const URI = process.env.MONGO_ATLAS
const api = express();
const router = Router()

// const USERS_URL = './server/BBDD/users.json'
// const CIRCUITS_URL = './server/BBDD/circuits.json'
// const ARTICLES_URL = './server/BBDD/articles.json'
// const EVENTS_URL = './server/BBDD/events.json'
// const FORUM_TOPICS_URL = './server/BBDD/forum.topics.json'

// router.use(express.static('../PFBNeoland/src'));

// router.use(bodyParser.json({limit: '50mb'}));
// router.use(bodyParser.urlencoded({ extended: true,limit: '50mb' }));




//USERS============
router.post('/create/user', async (req, res) => {
    res.json(await db.users.create(req.body))
})

router.get('/read/users', async (req, res) => {
    res.json(await db.users.get())
});

router.get('/read/user/:id', async (req, res) => {
    res.json((await db.users.get({_id: new ObjectId(req.params.id)}))[0])
});

router.put('/update/user/:id', async (req, res) => {
    res.json(await db.users.update(req.params.id, req.body))
});

router.post('/login', async (req, res) => {
    const user = await db.users.logIn(req.body)
    if (user) {
      // TODO: use OAuth2
      // ...
      // Simulation of authentication (OAuth2)
      user.token = gooogleOauth2()
      // Remove password
      delete user.password
      res.json(user)
    } else {
      // Unauthorized
      res.status(401).send('Unauthorized')
    }
  })



//CIRCUITS=================

router.get('/read/circuits', async (req, res) => {

    let query = [];
    let filter = undefined

    if(req.headers.filters){
        const filters = JSON.parse(req.headers.filters)

        const circuitLocation = await db.circuits.getLocation()

        circuitLocation.forEach(function (circuit){
            const circuitCoords = [
                Number(circuit.location.latitude), 
                Number(circuit.location.longitude)
            ]

            const userCoords = [
                Number(filters.userCoords[0]),
                Number(filters.userCoords[1])
            ]

            const R = 6371; 
            // Destructure coords
            // const {latitude, longitude} = coordsObject
            // Does math
            const dLat = (circuitCoords[0] - userCoords[0]) * Math.PI / 180;
            const dLon = (circuitCoords[1] - userCoords[1]) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(userCoords[0] * Math.PI / 180) * Math.cos(circuitCoords[0] * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

            const d = Math.round(R * c)

            if (Number(d) < Number(filters.distance)){
                
                query.push(circuit._id)
            }  

        })

        filter = { _id: {$in: query}}
    }
    res.json(await db.circuits.get(filter))

});

router.get('/read/circuit/:id', async (req, res) => {
    res.json((await db.circuits.get({_id: new ObjectId(req.params.id)}))[0])
});


//EVENTS=================
router.post('/create/event', requireAuth, async (req, res) => {
    res.json(await db.events.create(req.body))
})

router.post('/join/event/:eventid', requireAuth, async (req, res) => {

    const eventid = req.params.eventid;
    const userId = req.body.user_id;
    console.log(eventid,userId)


        const event = await db.events.getById({ _id: new ObjectId(eventid) }); 

        if (event.participants.length >= Number(event.maxParticipants)){
            return res.status(400).json({ message: "Este evento esta completo" });
        }
        if (!event.participants.includes(userId)) {
            event.participants.push(userId);
        } else {
            return res.status(400).json({ message: "Ya estás inscrito en este evento" });
        }

        await db.events.update( eventid, { participants: event.participants  });

        res.json({ message: "Usuario agregado al evento", event });

})

router.post('/forfeit/event/:eventid', requireAuth, async (req, res) => {

    const eventid = req.params.eventid;
    const userId = req.body.user_id;
    console.log(eventid,userId)
    const event = await db.events.getById({ _id: new ObjectId(eventid) });
    const update = await db.events.deleteParticipant(eventid, userId)
    res.json( { message: "Usuario fuera del evento", event, update })  
})



router.get('/read/events', async (req, res) => {

    let query = {};

    if(req.headers.filters){
        const filters = JSON.parse(req.headers.filters)

        if(filters.circuit && filters.circuit !== 'all'){
            query.location_id = filters.circuit
        }

        if (filters.minDate && filters.maxDate) {
            query.$expr = {
                $and: [
                    { $gte: [{ $toDate: "$date" }, new Date(filters.minDate)] },
                    { $lte: [{ $toDate: "$date" }, new Date(filters.maxDate)] }
                ]
            };
        }

        if (!filters.minDate && filters.maxDate) {
            const today = Date.now()
            query.$expr = {
                $and: [
                    { $gte: [{ $toDate: "$date" }, today] },
                    { $lte: [{ $toDate: "$date" }, new Date(filters.maxDate)] }
                ]
            };
        }

        if (filters.minDate && !filters.maxDate) {
            query.$expr = {
                $and: [
                    { $gte: [{ $toDate: "$date" }, new Date(filters.minDate)] }
                    
                ]
            };
        }
        


    }

    res.json(await db.events.get(query))
}); 

router.get('/read/events/:userid', async (req, res) => {
    const userId = req.params.userid
    res.json(await db.events.get({user_id: userId}))
}); 

router.get('/read/event/:id', async (req, res) => {
    const _id = req.params.id
    res.json((await db.events.get({_id: new ObjectId(_id)}))[0])
}); 

router.delete('/delete/event/:id', async (req, res) => {
    res.json(await db.events.delete(req.params.id))
 })

//MARKET=================

router.post('/create/article', async (req, res) => {
    res.json(await db.market.create(req.body))
})


router.get('/read/articles', async (req, res) => {
    res.json(await db.market.get())
});

router.get('/read/articles/:userid', async (req, res) => {
    const userId = req.params.userid
    res.json(await db.market.get({user_id: userId}))
});

router.delete('/delete/article/:id', async (req, res) => {
    res.json(await db.market.delete(req.params.id))
  })



//RACELINES=============================

router.post('/create/raceline', async (req, res) => {
    res.json(await db.raceLines.create(req.body))
})

router.get('/read/racelines', async (req, res) => {
    res.json(await db.raceLines.get())
});

router.get('/read/raceline/:id', async (req, res) => {
    const id = req.params.id
    res.json((await db.raceLines.get({_id: new ObjectId(id)}))[0])
});

router.get('/read/racelines/:userid', async (req, res) => {
    const userId = req.params.userid
    res.json(await db.raceLines.get({user_id: userId}))

});

//LAPTIME===========================


router.post('/create/laptime', requireAuth, async (req, res) => {
    res.json(await db.lapTimes.create(req.body))
})

router.get('/read/laptimes', async (req, res) => {

    let query = {};

    if(req.headers.filters){
        const filters = JSON.parse(req.headers.filters)
        console.log(filters)

        if(filters.circuit && filters.circuit !== 'all'){
            query.circuit_id = filters.circuit
        }

        if (filters.conditions && filters.lapConditions !== '' ) {
            query.lapCondition = filters.conditions
        }

        if (filters.kartType && filters.kartType !== '' ) {
            query.kartType = filters.kartType
        }
    }

    if(req.headers.filters){
        res.json(await db.lapTimes.get(query, { laptime: -1 }))
    }else{
        res.json(await db.lapTimes.get(query))
    }
    

});

router.get('/read/bestlaptimes/:userid', async (req, res) => {

    const userId = req.params.userid

    let query = {};

    query.user_id = userId
    query.lapCondition = 'Seco'
    query.kartType = 'Rental'

    const personalLaps = (await db.lapTimes.get(query, { laptime: 1} ))

    let result = new Set(personalLaps.map(a => a.circuit_id));

    const bestLaptimes = []

    for (const circuitId of result) { 

        const bestCircuitLap = await db.lapTimes.get({ circuit_id: circuitId, lapCondition: 'Seco', kartType: 'Rental' }, { laptime: 1 })

        const bestLap = personalLaps.find(lap => lap.circuit_id === circuitId)
        bestLaptimes.push({...bestLap, delta: (Number(bestLap.laptime) - Number(bestCircuitLap[0].laptime))})
        
    }
    res.json(bestLaptimes)

});

//MESSAGES================================

router.post('/create/message', requireAuth, async (req, res) => {
    res.json(await db.messages.create(req.body))

})

router.get('/read/messages/:userid', async (req, res) => {
    const userId = req.params.userid
    res.json(await db.messages.get({
        $or: [
            {sender_id: userId},
            {receiver_id: userId}
        ]
    }))

});

router.patch('/update/message/:messageid', async (req, res) => {
    const messageId = req.params.messageid
    const update = req.body
    
    res.json(await db.messages.update(messageId ,update))
    

});
//========================================


function requireAuth(req, res, next) {
    // Simulation of authentication (OAuth2)
    console.log(req.headers)
    if (req.headers.authorization === 'Bearer 123456') {
      next()
    } else {
      // Unauthorized
      res.status(401).send('Unauthorized')
    }
  }

  // for parsing application/json
api.use(bodyParser.json({limit: '50mb' }))
// for parsing application/x-www-form-urlencoded
api.use(bodyParser.urlencoded({ extended: true,limit: '50mb'  }))
api.use('/api/', router)

export const handler = serverless(api);

function gooogleOauth2() {
    return '123456'
  }

  export const db = {
    users: {
        create: createUser,
        get: getUsers,
        update: updateUser,
        logIn: logInUser

    },
    circuits: {
        get: getCircuits,
        getLocation: getCircuitLocation
    },
    events: {
        create: createEvent,
        get: getEvents,
        getById: getEventById,
        deleteParticipant: updatePopParticipantFromArray,
        update: updateEvent,
        delete: deleteEvent
    },
    market: {
        create: createArticle,
        get: getArticles,
        delete: deleteArticle
    },
    raceLines:{
        create: createRaceLine,
        get: getRaceLines
    },
    lapTimes:{
        create: createLapTime,
        get: getLapTimes
    },
    messages:{
      create: createMessage,
      get: getMessages,
      update: updateMessage
    }

}

/*=================================USERS===========================================*/

async function createUser(user) {
    const client = new MongoClient(URI);
    const karthubDB = client.db('karthub');
    const userCollection = karthubDB.collection('users');
    const returnValue = await userCollection.insertOne(user);
    console.log('db createUser', returnValue, user._id)
    return user
}     

async function getUsers(filter) {
    const client = new MongoClient(URI);
    const karthubDB = client.db('karthub');
    const userCollection = karthubDB.collection('users');
    return await userCollection.find(filter).toArray();
  }

/**
 * Updates a user in the 'users' collection in the 'karthub' database.
 * 
 * @param {string} id - The ID of the user to be updated.
 * @param {object} updates - The fields and new values to update the user with.
 * @returns {Promise<UpdateResult>} The result of the update operation.
 */
  async function updateUser(id, updates) {
    const client = new MongoClient(URI);
    const karthubDB = client.db('karthub');
    const userCollection = karthubDB.collection('users');
    const returnValue = await userCollection.updateOne({ _id: new ObjectId(id) }, { $set: updates });
    console.log('db updateUser', returnValue, updates)
    return returnValue
  }

  async function logInUser({email, password}) {
    const client = new MongoClient(URI);
    const karthubDB = client.db('karthub');
    const usersCollection = karthubDB.collection('users');
    return await usersCollection.findOne({ email, password })
  }
/*=================================CIRCUITS===========================================*/

/**
 * Retrieves an array of circuits from the 'circuits' collection in the 'karthub' database.
 * 
 * @param {object} [filter] - The filter to apply to the documents in the collection.
 * @returns {Promise<Array<object>>} - A promise that resolves to an array of circuit objects.
 */

async function getCircuits(filter) {
    const client = new MongoClient(URI);
    const karthubDB = client.db('karthub');
    const circuitCollection = karthubDB.collection('circuits');
    return await circuitCollection.find(filter).toArray();
  }


  async function getCircuitLocation(filter) {
    const client = new MongoClient(URI);
    const karthubDB = client.db('karthub');
    const circuitCollection = karthubDB.collection('circuits');
    return await circuitCollection.find(filter, { projection: { location: 1, _id: 1 } }).toArray();
  }
/*=================================EVENTS===========================================*/

async function createEvent(event) {
    const client = new MongoClient(URI);
    const karthubDB = client.db('karthub');
    const eventCollection = karthubDB.collection('events');
    const returnValue = await eventCollection.insertOne(event);
    console.log('db createEvent', returnValue, event._id)
    return event
}

async function getEvents(filter) {
    const client = new MongoClient(URI);
    const karthubDB = client.db('karthub');
    const eventCollection = karthubDB.collection('events');
    return await eventCollection.find(filter).toArray();
}

async function getEventById(filter) {
    const client = new MongoClient(URI);
    const karthubDB = client.db('karthub');
    const eventCollection = karthubDB.collection('events');
    return await eventCollection.findOne(filter)
}

async function updateEvent(id, updates) {
    const client = new MongoClient(URI);
    const karthubDB = client.db('karthub');
    const eventCollection = karthubDB.collection('events');
    const returnValue = await eventCollection.updateOne({ _id: new ObjectId(id) }, { $set: updates });
    console.log('db updateEvent', returnValue, updates)
    return returnValue
  }

  async function updatePopParticipantFromArray(id, user_id) {
    const client = new MongoClient(URI);
    const karthubDB = client.db('karthub');
    const eventCollection = karthubDB.collection('events');
    const returnValue = await eventCollection.updateOne({ _id: new ObjectId(id) }, { $pull: { participants: user_id } });
    console.log('db updateArrayEvent', returnValue, user_id)
    return returnValue
  }


/**
 * Deletes an article from the 'events' collection in the 'karthub' database.
 *
 * @param {string} id - The ID of the article to be deleted.
 * @returns {Promise<string>} - The ID of the deleted article.
 */
async function deleteEvent(id) {
    const client = new MongoClient(URI);
    const karthubDB = client.db('karthub');
    const eventCollection = karthubDB.collection('events');
    const returnValue = await eventCollection.deleteOne({ _id: new ObjectId(id) });
    console.log('db deleteEvent', returnValue, id)
    return id
  }
/*=================================MARKET===========================================*/

/**
 * Creates a new article in the 'market' collection in the 'karthub' database.
 * 
 * @param {object} article - The article to be created.
 * @returns {Promise<object>} - The created article.
 */
async function createArticle(article) {
    const client = new MongoClient(URI);
    const karthubDB = client.db('karthub');
    const marketCollection = karthubDB.collection('market');
    const returnValue = await marketCollection.insertOne(article);
    console.log('db createArticle', returnValue, article._id)
    return article
}

/**
 * Gets an array of articles from the 'market' collection in the 'karthub' database.
 * 
 * @param {object} [filter] - The filter to apply to the documents in the collection.
 * @returns {Promise<Array<object>>} - The array of articles.
 */
async function getArticles(filter) {
    const client = new MongoClient(URI);
    const karthubDB = client.db('karthub');
    const marketCollection = karthubDB.collection('market');
    return await marketCollection.find(filter).toArray();
}

/**
 * Deletes an article from the 'market' collection in the 'karthub' database.
 *
 * @param {string} id - The ID of the article to be deleted.
 * @returns {Promise<string>} The ID of the deleted article.
 */
async function deleteArticle(id) {
    const client = new MongoClient(URI);
    const karthubDB = client.db('karthub');
    const marketCollection = karthubDB.collection('market');
    const returnValue = await marketCollection.deleteOne({ _id: new ObjectId(id) });
    console.log('db deleteArticle', returnValue, id)
    return id
  }

  /*===========================RACELINE==========================*/

  async function createRaceLine(raceLine) {
    const client = new MongoClient(URI);
    const karthubDB = client.db('karthub');
    const raceLineCollection = karthubDB.collection('racelines');
    const returnValue = await raceLineCollection.insertOne(raceLine);
    console.log('db createRaceLine', returnValue, raceLine._id)
    return raceLine
}

async function getRaceLines(filter) {
    const client = new MongoClient(URI);
    const karthubDB = client.db('karthub');
    const raceLineCollection = karthubDB.collection('racelines');
    return await raceLineCollection.find(filter).toArray();
}

//=================================LAPTIMES========================

async function createLapTime(lapTime) {
    const client = new MongoClient(URI);
    const karthubDB = client.db('karthub');
    const lapTimeCollection = karthubDB.collection('laptimes');
    const returnValue = await lapTimeCollection.insertOne(lapTime);
    console.log('db createlapTime', returnValue, lapTime._id)
    return lapTime
}

async function getLapTimes(filter, direction) {
    const client = new MongoClient(URI);
    const karthubDB = client.db('karthub');
    const lapTimeCollection = karthubDB.collection('laptimes');
    if(direction){
      return await lapTimeCollection.find(filter).sort(direction).toArray();
    }else{
      return await lapTimeCollection.find(filter).toArray();
    }
    
}

//=================================MESSAGES========================


async function createMessage(message) {
  const client = new MongoClient(URI);
  const karthubDB = client.db('karthub');
  const messagesCollection = karthubDB.collection('messages');
  const returnValue = await messagesCollection.insertOne(message);
  console.log('db createMessage', returnValue, message._id)
  return message
}

async function getMessages(filter) {
  const client = new MongoClient(URI);
  const karthubDB = client.db('karthub');
  const messagesCollection = karthubDB.collection('messages');
  return await messagesCollection.find(filter).toArray();
}

async function updateMessage(id, updates) {
  const client = new MongoClient(URI);
  const karthubDB = client.db('karthub');
  const messagesCollection = karthubDB.collection('messages');
  const returnValue = await messagesCollection.updateOne({ _id: new ObjectId(id) }, { $set: updates });
  console.log('db updateMessage', returnValue, updates)
  return returnValue
}