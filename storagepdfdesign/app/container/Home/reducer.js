import * as _state from './state';
import * as _action from './action';


const bookReducer = function (state = _state.bookState, action) {
    switch (action.type) {
        case _action.ENUM_BOOK.START_FETCHING_GET_BOOK : 
        return {
            ...state,
            isFetching : true,
        }
        case _action.ENUM_BOOK.SUCCESS_GET_BOOK : 
        return {
            ...state,
            isFetching : false,
            isSuccess : true,
            isError : false,
            descriptionError : "",
            data : action.data
        }
        case _action.ENUM_BOOK.ERROR_GET_BOOK : 
        return {
            ...state,
            isFetching : false,
            isSuccess : false,
            isError : true,
            descriptionError : action.error,
            data : []
        }
        case _action.ENUM_BOOK.GET_DETAIL_BOOK : 
        return {
            ...state,
            bookDetail : action.data
        }
        case _action.ENUM_BOOK.RESET_DETAIL_BOOK : 
        return {
            ...state,
            bookDetail : {}
        }
        case _action.ENUM_BOOK.LOGINED : 
        return {
            ...state,
            isLogined : true
        }

        case _action.ENUM_BOOK.FIRST_LOGIN : 
        return {
            ...state,
            isFirstLogin : true
        }

        case _action.ENUM_BOOK.UPDATE_USER : 
        return {
            ...state,
            infoUser : action.data
        }

        case _action.ENUM_BOOK.RESET_BOOK : 
        return {
            isFetching : false,
            isSuccess : false,
            data : [],
            isError : false,
            descriptionError : "",
            bookDetail : {},
            isLogined  : false,
            isFirstLogin : false,
            infoUser : {
                userName : "",
                password : ""
            }
        }

        default:
            return state;
            break;
    }
}

export { bookReducer };