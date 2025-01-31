import { navroutes } from '../config/navroutes.js';
//import { environment } from '../config/environment.js';

/**
 * SIMPLE REDUX STORE
 */
// Vars
export const defaultPage = '/';
export const roles = [
    { id: 0, name: 'admin' },
    { id: 1, name: 'user' },
];
export const loadingMessages = {
    loading: 'Loading...',
    signingIn: 'Signing In...',
    signingOut: 'Signing Out...',
};
const ActionTypes = {
    INIT: 'INIT',
    NAVIGATE: 'NAVIGATE',
    UPDATE_OFFLINE: 'UPDATE_OFFLINE',
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    SHOW_NOTIFICATION: 'SHOW_NOTIFICATION',
    UPDATE_LOADING_STATE: 'UPDATE_LOADING_STATE',
    IS_LOADING: 'IS_LOADING',
    IS_NOT_LOADING: 'IS_NOT_LOADING',
    SHOW_MESSAGE: 'SHOW_MESSAGE',
};
// Initial State
const INITIAL_STATE = {
    pathname: undefined,
    offline: undefined,
    navroutes: [],
    loggedIn: undefined,
    auth: null,
    message: null,
    userrole: 'User',
    loadingMessage: loadingMessages.loading,
    isLoading: [],
};
// TODO: CHECK this solution: https://gist.github.com/DavidWells/54f9dd1af4a489e5f1358f33ce59e8ad
/*
const handleErrors = (response) => {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
};
*/
// Reducers:
const appReducer = (state = INITIAL_STATE, action) => {
    //let tempUser, tempUsers, tempBox;
    switch (action.type) {
        case ActionTypes.NAVIGATE:
            return {
                ...state,
                pathname: action.pathname
            };
        case ActionTypes.UPDATE_OFFLINE:
            return {
                ...state,
                offline: action.offline
            };
        case ActionTypes.GET_NAV_ROUTES:
            return {
                ...state,
                navroutes: action.navroutes
            };
        case ActionTypes.SHOW_NOTIFICATION:
            return {
                ...state,
                message: action.message
            };
        case ActionTypes.LOGIN:
            return {
                ...state,
                loggedIn: true,
                auth: action.user
            };
        case ActionTypes.LOGOUT:
            return {
                ...state,
                loggedIn: false,
                auth: null
            };
        case ActionTypes.SHOW_MESSAGE:
            return {
                ...state,
                showMessage: action.showMessage
            };
        case ActionTypes.IS_LOADING:
            return {
                ...state,
                isLoading: [
                    ...state.isLoading,
                    action.query
                ]
            };
        case ActionTypes.IS_NOT_LOADING:
            return {
                ...state,
                isLoading: state.isLoading.filter(value => value !== action.query )
            };
        default:
            return state;
    }
};// Store creator
const createStore = (reducer) => {
    let currentState = INITIAL_STATE;
    let currentReducer = reducer;

    // Actions
    const navigateTo = (pathname) => _dispatch({ type: ActionTypes.NAVIGATE, pathname });
    const updateOffline = (offline) => _dispatch({ type: ActionTypes.UPDATE_OFFLINE, offline });
    const getNavRoutes = () => _dispatch({ type: ActionTypes.GET_NAV_ROUTES, navroutes: navroutes });
    const logIn = (user) => _dispatch({ type: ActionTypes.LOGIN, user: user });
    const logOut = () => _dispatch({ type: ActionTypes.LOGOUT });
    const showNotification = (message) => _dispatch({ type: ActionTypes.SHOW_NOTIFICATION, message: message }, _dispatch({ type: ActionTypes.SHOW_NOTIFICATION, message: '' }));
    const showMessage = (showMessage) => _dispatch({ type: ActionTypes.SHOW_MESSAGE, showMessage: showMessage });
    const startLoading = (query) => _dispatch({ type: ActionTypes.IS_LOADING, query: query });
    const endLoading = (query) => _dispatch({ type: ActionTypes.IS_NOT_LOADING, query: query });
    const updateLoadingState = (loadingMessage) => _dispatch({ type: ActionTypes.UPDATE_LOADING_STATE, loadingMessage: loadingMessage });
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
    };
    /*const _tokenItemsSelector = (state) => {
        return (state.auth) ? state.auth.jwtToken : null;
    };*/
    return {
        navigateTo,
        updateOffline,
        getNavRoutes,
        logIn,
        logOut,
        showNotification,
        showMessage,
        startLoading,
        endLoading,
        updateLoadingState,
        getState,
    };
};
// Store:
export const store = createStore(appReducer);