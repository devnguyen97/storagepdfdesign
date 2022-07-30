import { createStore, applyMiddleware, compose } from "redux";
import thunk from 'redux-thunk';
import { rootReducer } from "./reducers/rootReducer";
import logger from 'redux-logger';
import { createLogger } from "redux-logger";


const middleware = [
    thunk,
    __DEV__ && logger,
].filter(Boolean);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const loggerMiddleware = createLogger();
export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk, loggerMiddleware)));
// export const store = createStore(rootReducer, applyMiddleware(...middleware,loggerMiddleware));

