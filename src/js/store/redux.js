//@ts-check

/**@import {Circuit, MarketItem, ForumCard, EventCard, timeRow, User} from "../../classes/classes.js" */
/**
 * @module redux/store
 */
/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} username
 * @property {string} name 
 * @property {string} email 
 * @property {string} password
 * @property {string} surnames
 * @property {string} location
 * @property {string} bio
 * @property {string} img
 * @property {string} prefCircuit
 * @property {string} kart
 * @property {string} youtube
 * @property {string} instagram
 * @property {string} role
 * @property {string} token
 */
/**
 * @typedef {Object} ActionTypeUser
 * @property {string} type
 * @property {User} [user]
 */
/**
 * @typedef {Object} ActionTypeCircuit
 * @property {string} type
 * @property {Circuit} [circuit]
 */
/**
 * @typedef {Object} ActionTypeTimeRow
 * @property {string} type
 * @property {string} circuitId
 * @property {timeRow} timeRow
 */
/**
 * @typedef {Object} ActionTypeEvent
 * @property {string} type
 * @property {EventCard} [event]
 */
/**
 * @typedef {Object} ActionTypeMarket
 * @property {string} type
 * @property {MarketItem} [item]
 */
/**
 * @typedef {Object} ActionTypeForum
 * @property {string} type
 * @property {ForumCard} [forumcard]
 */




const ACTION_TYPES = {

  INSTANCE_USER: 'INSTANCE_USER',
  LOGOUT: 'LOGOUT',

  CREATE_CIRCUIT: 'CREATE_CIRCUIT',
  UPDATE_RECORD: 'UPDATE_RECORD',

  CREATE_EVENT: 'CREATE_EVENT',
  UPDATE_EVENT_TITLE: 'UPDATE_EVENT_TITLE',
  UPDATE_EVENT_DATE: 'UPDATE_EVENT_DATE',
  UPDATE_EVENT_DESCRIPTION: 'UPDATE_EVENT_DESCRIPTION',
  DELETE_EVENT: 'DELETE_EVENT',

  CREATE_MARKET_ARTICLE: 'CREATE_MARKET_ARTICLE',
  READ_MARKET_LIST: 'READ_MARKET_LIST',
  UPDATE_MARKET_ITEM_NAME: 'UPDATE_MARKET_ITEM_NAME',
  UPDATE_MARKET_ITEM_PRICE: 'UPDATE_MARKET_ITEM_PRICE',
  UPDATE_MARKET_ITEM_LOCATION: 'UPDATE_MARKET_ITEM_LOCATION',
  UPDATE_MARKET_ITEM_DESCRIPTION: 'UPDATE_MARKET_ITEM_DESCRIPTION',
  UPDATE_MARKET_ITEM_IMAGE: 'UPDATE_MARKET_ITEM_IMAGE',
  DELETE_MARKET_ITEM: 'DELETE_MARKET_ITEM',

  CREATE_FORUM: 'CREATE_FORUM',
  CREATE_FORUM_ARTICLE: 'CREATE_FORUM_ARTICLE',
  READ_FORUM_LIST: 'READ_FORUM_LIST',
  UPDATE_FORUM_ARTICLE: 'UPDATE_FORUM_ARTICLE',
  DELETE_FORUM_ARTICLE: 'DELETE_FORUM_ARTICLE'
}

/**
 * @typedef {Object.<(string), any>} State
 * @property {User} user
 * @property {Array<Circuit>} circuits
 * @property {Array<EventCard>} eventList
 * @property {Array<MarketItem>} marketItems
 * @property {Array<ForumCard>} forumItems
 * @property {boolean} isLoading
 * @property {boolean} error
 */
/**
 * @type {State}
 */

const INITIAL_STATE = {
  user: null,
  circuits: [],
  eventList: [], 
  marketItems: [],  
  forumItems: [], 
  isLoading: false,
  error: false
}

/**
 * Reducer for the app state.
 *
 * @param {State} state - The current state
 * @param {ActionTypeUser | ActionTypeCircuit | ActionTypeEvent | ActionTypeMarket | ActionTypeForum | ActionTypeTimeRow} action - The action to reduce
 * @returns {State} The new state
 */
const appReducer = (state = INITIAL_STATE, action) => {
  const actionWithUser = /** @type {ActionTypeUser} */ (action)
  const actionWithCircuit = /** @type {ActionTypeCircuit} */ (action)
  const actionWithEvent = /** @type {ActionTypeEvent} */ (action)
  const actionWithMarket = /** @type {ActionTypeMarket} */ (action)
  const actionWithForum = /** @type {ActionTypeForum} */ (action)
  const actionWithtimeRow = /** @type {ActionTypeTimeRow} */ (action)
  switch (action.type) {

//======================================USER==========================================
              
          case ACTION_TYPES.INSTANCE_USER:
            return {
                ...state,
                user: actionWithUser.user
            };
            case ACTION_TYPES.LOGOUT:
              return {
                ...state,
                user: {}
              };

//======================================CIRCUIT==========================================

          case ACTION_TYPES.CREATE_CIRCUIT:
              return {
                  ...state,
                  circuits: [
                    ...state.circuits,
                    actionWithCircuit.circuit
                  ]
              };

            case ACTION_TYPES.UPDATE_RECORD:
              return {
            ...state,
            circuits: state.circuits.map((/** @type {Circuit} */circuit) => {
              if (circuit.id === actionWithtimeRow?.circuitId) {
                    circuit.timeTable.push(actionWithtimeRow.timeRow)
                    return circuit
              }
        })
      };

//======================================EVENT==========================================

          case ACTION_TYPES.CREATE_EVENT:
            return {
                ...state,
                eventList: [
                  ...state.eventList,
                  actionWithEvent.event
                ]
            };
            case ACTION_TYPES.UPDATE_EVENT_TITLE:
              return {
                ...state,
                eventList: state.eventList.map((/** @type {EventCard} */event) => {
                  if (event.id === actionWithEvent?.event?.id) {
                    //hacer la accion a cambiar
                    event.title = actionWithEvent?.event?.title
                    return actionWithEvent.event
                  }
                })
              };

              case ACTION_TYPES.UPDATE_EVENT_DATE:
              return {
                ...state,
                eventList: state.eventList.map((/** @type {EventCard} */event) => {
                  if (event.id === actionWithEvent?.event?.id) {
                    //hacer la accion a cambiar
                    event.date = actionWithEvent?.event?.date
                    return actionWithEvent.event
                  }
                })
              };

              case ACTION_TYPES.UPDATE_EVENT_DESCRIPTION:
              return {
                ...state,
                eventList: state.eventList.map((/** @type {EventCard} */event) => {
                  if (event.id === actionWithEvent?.event?.id) {
                    //hacer la accion a cambiar
                    event.description = actionWithEvent?.event?.description
                    return actionWithEvent.event
                  }
                })
              };
//======================================MARKET==========================================
          case ACTION_TYPES.CREATE_MARKET_ARTICLE:
            return {
              ...state,
              marketItems: [
                ...state.marketItems,
                actionWithMarket.item
              ]
          };
          case ACTION_TYPES.UPDATE_MARKET_ITEM_NAME:
            return {
              ...state,
              marketItems: state.marketItems.map((/** @type {MarketItem} */item) => {
                if (item.id === actionWithMarket?.item?.id) {
                  //hacer la accion a cambiar
                  item.article = actionWithMarket?.item?.article
                  return actionWithMarket.item
                }
              })
            };

            case ACTION_TYPES.UPDATE_MARKET_ITEM_PRICE:
            return {
              ...state,
              marketItems: state.marketItems.map((/** @type {MarketItem} */item) => {
                if (item.id === actionWithMarket?.item?.id) {
                  //hacer la accion a cambiar
                  item.price = actionWithMarket?.item?.price
                  return actionWithMarket.item
                }
              })
            };

            case ACTION_TYPES.UPDATE_MARKET_ITEM_LOCATION:
            return {
              ...state,
              marketItems: state.marketItems.map((/** @type {MarketItem} */item) => {
                if (item.id === actionWithMarket?.item?.id) {
                  //hacer la accion a cambiar
                  item.location = actionWithMarket?.item?.location
                  return actionWithMarket.item
                }
              })
            };

            case ACTION_TYPES.UPDATE_MARKET_ITEM_DESCRIPTION:
            return {
              ...state,
              marketItems: state.marketItems.map((/** @type {MarketItem} */item) => {
                if (item.id === actionWithMarket?.item?.id) {
                  //hacer la accion a cambiar
                  item.description = actionWithMarket?.item?.description
                  return actionWithMarket.item
                }
              })
            };

            case ACTION_TYPES.UPDATE_MARKET_ITEM_IMAGE:
            return {
              ...state,
              marketItems: state.marketItems.map((/** @type {MarketItem} */item) => {
                if (item.id === actionWithMarket?.item?.id) {
                  //hacer la accion a cambiar
                  item.img = actionWithMarket?.item?.img
                  return actionWithMarket.item
                }
              })
            };

            case ACTION_TYPES.DELETE_MARKET_ITEM:
            return {
              ...state,
              articles: state.marketItems.filter((/** @type {MarketItem} */item) => item.id !== actionWithMarket?.item?.id)
            };

//======================================FORUM==========================================
            case ACTION_TYPES.CREATE_FORUM:
              return {
                  ...state,
                  forumItems: [
                    ...state.forumItems,
                    actionWithForum.forumcard
                  ]
              };
          default:
              return {...state};
      }
}
/**
 * @typedef {Object} Store 
 * 
 * @property {function} getState
 * 
 * @property {function} instanceUser
 * @property {function} logout
 * 
 * @property {function} createCircuit
 * @property {function} getAllCircuits
 * @property {function} getCircuitById
 * @property {function} updateRecord
 *  
 * @property {function} createEvent
 * @property {function} getAllEvents
 * @property {function} updateEventTitle
 * @property {function} updateEventDate
 * @property {function} updateEventDescription
 * 
 * @property {function} createMarketArticle
 * @property {function} getAllMarketArticles
 * @property {function} updateMarketItemName
 * @property {function} updateMarketItemPrice
 * @property {function} updateMarketItemLocation
 * @property {function} updateMarketItemDescription
 * @property {function} updateMarketItemImage
 * @property {function} deleteMarketItem
 * 
 * @property {function} createForum
 * @property {function} getAllForumItems
 *
 *
 *
 */
/**
 * Creates the store singleton.
 * @param {appReducer} reducer
 * @returns {Store}
 */
const createStore = (reducer) => {
  let currentState = INITIAL_STATE
  let currentReducer = reducer

  // Actions


   // Public methods
   const getState = () => { return currentState };

  //==========================================USER==========================================

  /**
   * 
   * @param {User} user 
   * @returns void
   */
  const instanceUser = (user) => _dispatch({ type: ACTION_TYPES.INSTANCE_USER, user });

  const logout = () => _dispatch({ type: ACTION_TYPES.LOGOUT });

  //==========================================CIRCUIT==========================================
  /**
   * 
   * @param {Circuit} circuit 
   * @returns void
   */
  const createCircuit = (circuit) => _dispatch({ type: ACTION_TYPES.CREATE_CIRCUIT, circuit });

  const getAllCircuits = () => currentState.circuits

  /**
   * 
   * @param {string} id 
   * @returns {Circuit | undefined}
   */
  const getCircuitById = (id) => currentState.circuits.find((/** @type {Circuit} */circuit) => circuit.id === id);

  /**
   * 
   * @param {string} circuitId 
   * @param {timeRow} timeRow 
   * @returns 
   */
  const updateRecord = (circuitId, timeRow) => _dispatch({ type: ACTION_TYPES.UPDATE_RECORD, circuitId, timeRow });

  //==========================================EVENT==========================================
  /**
   * 
   * @param {EventCard} event 
   * @returns 
   */
  const createEvent = (event) => _dispatch({ type: ACTION_TYPES.CREATE_EVENT, event });

  const getAllEvents = () => currentState.eventList

   /**
   * 
   * @param {EventCard} event 
   * @returns 
   */
  const updateEventTitle = (event) => _dispatch({ type: ACTION_TYPES.UPDATE_EVENT_TITLE, event });

  /**
   * 
   * @param {EventCard} event 
   * @returns 
   */
  const updateEventDate = (event) => _dispatch({ type: ACTION_TYPES.UPDATE_EVENT_DATE, event });

  /**
   * 
   * @param {EventCard} event 
   * @returns 
   */
  const updateEventDescription = (event) => _dispatch({ type: ACTION_TYPES.UPDATE_EVENT_DESCRIPTION, event });

  //==========================================MARKET==========================================
  /**
   * 
   * @param {MarketItem} item 
   * @returns 
   */
  const createMarketArticle = (item) => _dispatch({ type: ACTION_TYPES.CREATE_MARKET_ARTICLE, item });

  const getAllMarketArticles = () => currentState.marketItems

  /**
   * 
   * @param {MarketItem} item 
   * @returns 
   */
  const updateMarketItemName = (item) => _dispatch({ type: ACTION_TYPES.UPDATE_MARKET_ITEM_NAME, item });

  /**
   * 
   * @param {MarketItem} item 
   * @returns 
   */
  const updateMarketItemPrice = (item) => _dispatch({ type: ACTION_TYPES.UPDATE_MARKET_ITEM_PRICE, item });

  /**
   * 
   * @param {MarketItem} item 
   * @returns 
   */
  const updateMarketItemLocation = (item) => _dispatch({ type: ACTION_TYPES.UPDATE_MARKET_ITEM_LOCATION, item });

  /**
   * 
   * @param {MarketItem} item 
   * @returns 
   */
  const updateMarketItemDescription = (item) => _dispatch({ type: ACTION_TYPES.UPDATE_MARKET_ITEM_DESCRIPTION, item });

  /**
   * 
   * @param {MarketItem} item 
   * @returns 
   */
  const updateMarketItemImage = (item) => _dispatch({ type: ACTION_TYPES.UPDATE_MARKET_ITEM_IMAGE, item });

  /**
   * 
   * @param {MarketItem} item 
   * @returns 
   */
  const deleteMarketItem = (item) => _dispatch({ type: ACTION_TYPES.DELETE_MARKET_ITEM, item });

  //==========================================FORUM==========================================
  /**
   * 
   * @param {ForumCard} forumcard 
   * @returns 
   */
  const createForum = (forumcard) => _dispatch({ type: ACTION_TYPES.CREATE_FORUM, forumcard });

  const getAllForumItems = () => currentState.forumItems

  

  // Private methods
  /**
   *
   * @param {ActionTypeUser | ActionTypeCircuit | ActionTypeEvent | ActionTypeMarket | ActionTypeForum | ActionTypeTimeRow} action
   * @param {Function | undefined} [onEventDispatched]
   */
  const _dispatch = (action, onEventDispatched) => {
    let previousValue = currentState;
    let currentValue = currentReducer(currentState, action);
    currentState = currentValue;
    // TODO: CHECK IF IS MORE ADDECUATE TO SWITCH TO EventTarget: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
    window.dispatchEvent(new CustomEvent('stateChanged', {
        detail: {
          type: action.type,
          changes: _getDifferences(previousValue, currentValue)
        },
        cancelable: true,
        composed: true,
        bubbles: true
    }));
    if (onEventDispatched) {
      console.log('onEventDispatched', onEventDispatched);
      onEventDispatched();
      // onEventDispatched.call(this, {
      //   type: action.type,
      //   changes: _getDifferences(previousValue, currentValue)
      // })
    }
  }


  /**
   * Returns a new object with the differences between the `previousValue` and
   * `currentValue` objects. It's used to create a payload for the "stateChanged"
   * event, which is dispatched by the store every time it changes.
   *
   * @param {State} previousValue - The old state of the store.
   * @param {State} currentValue - The new state of the store.
   * @returns {Object} - A new object with the differences between the two
   *     arguments.
   * @private
   */
  const _getDifferences = (previousValue, currentValue) => {
    return Object.keys(currentValue).reduce((diff, key) => {
        if (previousValue[key] === currentValue[key]) return diff
        return {
            ...diff,
            [key]: currentValue[key]
        };
    }, {});
  }

  return {
    getState,

    instanceUser,
    logout,

    createCircuit,
    getAllCircuits,
    getCircuitById,
    updateRecord,

    createEvent,
    getAllEvents,
    updateEventTitle,
    updateEventDate,
    updateEventDescription,

    createMarketArticle,
    getAllMarketArticles,
    updateMarketItemName,
    updateMarketItemPrice,
    updateMarketItemLocation,
    updateMarketItemDescription,
    updateMarketItemImage,
    deleteMarketItem,

    createForum,
    getAllForumItems,
  }
}

// Export store
export const store = createStore(appReducer)