//@ts-check
const ACTION_TYPES = {

  CREATE_CIRCUIT: 'CREATE_CIRCUIT',
  CREATE_CIRCUIT_LIST: 'CREATE_CIRCUIT_LIST',
  READ_CIRCUIT_LIST: 'READ_CIRCUIT_LIST',
  UPDATE_CIRCUIT_LIST: 'UPDATE_CIRCUIT_LIST',
  UPDATE_CIRCUIT: 'UPDATE_CIRCUIT',
  DELETE_CIRCUIT: 'DELETE_CIRCUIT',

  CREATE_EVENT: 'CREATE_EVENT',
  CREATE_EVENT_LIST: 'CREATE_EVENT_LIST',
  READ_EVENT_LIST: 'READ_EVENT_LIST',
  UPDATE_EVENT_LIST: 'UPDATE_EVENT_LIST',
  UPDATE_EVENT: 'UPDATE_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',

  CREATE_MARKET_ARTICLE: 'CREATE_MARKET_ARTICLE',
  READ_MARKET_LIST: 'READ_MARKET_LIST',
  UPDATE_MARKET_LIST: 'UPDATE_MARKET_LIST',
  UPDATE_MARKET_ARTICLE: 'UPDATE_MARKET_ARTICLE',
  DELETE_MARKET_ARTICLE: 'DELETE_MARKET_ARTICLE',

  CREATE_FORUM: 'CREATE_FORUM',
  CREATE_FORUM_ARTICLE: 'CREATE_FORUM_ARTICLE',
  READ_FORUM_LIST: 'READ_FORUM_LIST',
  UPDATE_FORUM_LIST: 'UPDATE_FORUM_LIST',
  UPDATE_FORUM_ARTICLE: 'UPDATE_FORUM_ARTICLE',
  DELETE_FORUM_ARTICLE: 'DELETE_FORUM_ARTICLE'
}

/**
 * @typedef {Object.<(string), any>} State
 * @property {Array<>} circuits
 * @property {Array<>} eventList
 * @property {Array<>} marketItems
 * @property {Array<>} forumItems
 * @property {boolean} isLoading
 * @property {boolean} error
 */
/**
 * @type {State}
 */

const INITIAL_STATE = {
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
 * @param {} action - The action to reduce
 * @returns {State} The new state
 */
const appReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
          case ACTION_TYPES.CREATE_CIRCUIT:
              return {
                  ...state,
                  articles: [
                    ...state.articles,
                    action.article
                  ]
              };
          case ACTION_TYPES.CREATE_CIRCUIT_LIST:
              return {
                  ...state,
                  articles: [
                    ...state.articles,
                    action.article
                  ]
            };
          case ACTION_TYPES.READ_CIRCUIT_LIST:
              return {
                  ...state,
                  articles: [
                    ...state.articles,
                    action.article
                  ]
              };
          case ACTION_TYPES.UPDATE_CIRCUIT_LIST:
            return {
                ...state,
                articles: [
                  ...state.articles,
                  action.article
                ]
            };
          case ACTION_TYPES.UPDATE_CIRCUIT_LIST:
            return {
                ...state,
                articles: [
                  ...state.articles,
                  action.article
                ]
            };
          case ACTION_TYPES.DELETE_CIRCUIT:
            return {
                ...state,
                articles: [
                  ...state.articles,
                  action.article
                ]
            };
          
          case ACTION_TYPES.CREATE_EVENT:
            return {
                ...state,
                articles: [
                  ...state.articles,
                  action.article
                ]
            };
          case ACTION_TYPES.CREATE_EVENT_LIST:
          return {
              ...state,
              articles: [
                ...state.articles,
                action.article
              ]
          };
          case ACTION_TYPES.READ_EVENT_LIST:
            return {
                ...state,
                articles: [
                  ...state.articles,
                  action.article
                ]
            };
          case ACTION_TYPES.UPDATE_EVENT_LIST:
            return {
                ...state,
                articles: [
                  ...state.articles,
                  action.article
                ]
            };
          case ACTION_TYPES.UPDATE_EVENT:
            return {
                ...state,
                articles: [
                  ...state.articles,
                  action.article
                ]
            };
          case ACTION_TYPES.DELETE_EVENT:
            return {
                ...state,
                articles: [
                  ...state.articles,
                  action.article
                ]
            };


          case ACTION_TYPES.CREATE_MARKET_ARTICLE:
          return {
              ...state,
              articles: [
                ...state.articles,
                action.article
              ]
          };
          case ACTION_TYPES.READ_MARKET_LIST:
          return {
              ...state,
              articles: [
                ...state.articles,
                action.article
              ]
          };
          case ACTION_TYPES.UPDATE_MARKET_LIST:
            return {
                ...state,
                articles: [
                  ...state.articles,
                  action.article
                ]
            };
          case ACTION_TYPES.UPDATE_MARKET_ARTICLE:
            return {
                ...state,
                articles: [
                  ...state.articles,
                  action.article
                ]
            };
          case ACTION_TYPES.DELETE_MARKET_ARTICLE:
            return {
                ...state,
                articles: [
                  ...state.articles,
                  action.article
                ]
            };


            case ACTION_TYPES.CREATE_FORUM:
              return {
                  ...state,
                  articles: [
                    ...state.articles,
                    action.article
                  ]
              };
            case ACTION_TYPES.CREATE_FORUM_ARTICLE:
            return {
                ...state,
                articles: [
                  ...state.articles,
                  action.article
                ]
            };
            case ACTION_TYPES.READ_FORUM_LIST:
              return {
                  ...state,
                  articles: [
                    ...state.articles,
                    action.article
                  ]
              };
            case ACTION_TYPES.UPDATE_FORUM_LIST:
              return {
                  ...state,
                  articles: [
                    ...state.articles,
                    action.article
                  ]
              };
            case ACTION_TYPES.UPDATE_FORUM_ARTICLE:
              return {
                  ...state,
                  articles: [
                    ...state.articles,
                    action.article
                  ]
              };
            case ACTION_TYPES.DELETE_FORUM_ARTICLE:
              return {
                  ...state,
                  articles: [
                    ...state.articles,
                    action.article
                  ]
              };
          default:
              return state;
      }
}
/**
 * Creates the store singleton.
 * @param {appReducer} reducer
 * @returns {Object}
 */
const createStore = (reducer) => {
  let currentState = INITIAL_STATE
  let currentReducer = reducer

  // Actions
  const createCircuitList = (article) => _dispatch({ type: INITIAL_STATE.CREATE_CIRCUIT_LIST, article });

  // Public methods
  const getState = () => { return currentState };

  // Private methods
  const _dispatch = (action, onEventDispatched) => {
    let previousValue = currentState;
    let currentValue = currentReducer(currentState, action);
    currentState = currentValue;
    // TODO: CHECK IF IS MORE ADDECUATE TO SWITCH TO EventTarget: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
    window.dispatchEvent(new CustomEvent('stateChanged', {
        detail: {
            changes: _getDifferences(previousValue, currentValue)
        },
        cancelable: true,
        composed: true,
        bubbles: true
    }));
    if (onEventDispatched) {
        onEventDispatched();
    }
  }
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
    createCircuitList
  }
}

// Export store
export const store = createStore(appReducer)