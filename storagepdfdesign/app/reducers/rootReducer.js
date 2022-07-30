import { combineReducers } from 'redux';
import { bookReducer } from "../container/Home/reducer";

const rootReducer = combineReducers({
    bookReducer
});


export { rootReducer };