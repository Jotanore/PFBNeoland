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
    // crud.create(USERS_URL, req.body, (data) => {
    //     res.json(data)
    //   });
})

router.get('/read/users', async (req, res) => {
    res.json(await db.users.get())
    // crud.read(USERS_URL, (data) => {
    //     res.json(data)
    //   });
});

router.get('/read/user/:id', async (req, res) => {
    res.json((await db.users.get({_id: new ObjectId(req.params.id)}))[0])
    // crud.read(USERS_URL, (data) => {
    //     res.json(data)
    //   });
});

router.put('/update/user/:id', async (req, res) => {
    res.json(await db.users.update(req.params.id, req.body))
    // crud.update(USERS_URL, req.params.id, req.body, (data) => {
    //     res.json(data)
    //   });
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
    res.json(await db.circuits.get())
    // crud.read(CIRCUITS_URL, (data) => {
    //     res.json(data)
    //   });
});

router.get('/read/circuit/:id', async (req, res) => {
    res.json((await db.circuits.get({_id: new ObjectId(req.params.id)}))[0])
    // crud.read(USERS_URL, (data) => {
    //     res.json(data)
    //   });
});


//EVENTS=================
router.post('/create/event', requireAuth, async (req, res) => {
    res.json(await db.events.create(req.body))
    // crud.create(EVENTS_URL, req.body, (data) => {
    //     res.json(data)
    // });
})


router.get('/read/events', async (req, res) => {
    res.json(await db.events.get())
    // crud.read(EVENTS_URL, (data) => {
    //     res.json(data)
    //   });
}); 

router.get('/read/events/:userid', async (req, res) => {
    const userId = req.params.userid
    res.json(await db.events.get({user_id: userId}))
    // crud.read(EVENTS_URL, (data) => {
    //     res.json(data)
    //   });
}); 

router.delete('/delete/event/:id', async (req, res) => {
    res.json(await db.events.delete(req.params.id))
//     crud.delete(EVENTS_URL, req.params.id, (data) => {
//      res.json(data)
//    });
 })

//MARKET=================
router.post('/create/article', async (req, res) => {
    res.json(await db.market.create(req.body))
    // crud.create(ARTICLES_URL, req.body, (data) => {
    //     res.json(data)
    // });
})


router.get('/read/articles', async (req, res) => {
    res.json(await db.market.get())
    // crud.read(ARTICLES_URL, (data) => {
    //     res.json(data)
    //   });
});

router.get('/read/articles/:userid', async (req, res) => {
    const userId = req.params.userid
    res.json(await db.market.get({user_id: userId}))
    // crud.read(ARTICLES_URL, (data) => {
    //     res.json(data)
    //   });
});

router.delete('/delete/article/:id', async (req, res) => {
    res.json(await db.market.delete(req.params.id))
    //  crud.delete(ARTICLES_URL, req.params.id, (data) => {
    //   res.json(data)
    // });
  })


//FORUM TODO===(or not, hehe)================
router.get('/read/forum-topics', (req, res) => {
    crud.read(FORUM_TOPICS_URL, (data) => {
        res.json(data)
      });
})



//RACELINES=============================

router.post('/create/raceline', async (req, res) => {
    res.json(await db.raceLines.create(req.body))
    // crud.create(ARTICLES_URL, req.body, (data) => {
    //     res.json(data)
    // });
})

router.get('/read/racelines', async (req, res) => {
    res.json(await db.raceLines.get())
    // crud.read(ARTICLES_URL, (data) => {
    //     res.json(data)
    //   });
});

router.get('/read/racelines/:userid', async (req, res) => {
    const userId = req.params.userid
    res.json(await db.raceLines.get({user_id: userId}))
    // crud.read(ARTICLES_URL, (data) => {
    //     res.json(data)
    //   });
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
        get: getCircuits
    },
    events: {
        create: createEvent,
        get: getEvents,
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