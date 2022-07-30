const START_FETCHING_GET_BOOK       = "START_FETCHING_GET_BOOK";
const SUCCESS_GET_BOOK              = "SUCCESS_GET_BOOK";
const ERROR_GET_BOOK                = "ERROR_GET_BOOK";
const GET_DETAIL_BOOK               = "GET_DETAIL_BOOK";
const RESET_DETAIL_BOOK             = "RESET_DETAIL_BOOK";
const RESET_BOOK                    = "RESET_BOOK";
const LOGINED                       = "LOGINED";
const UPDATE_USER                   = "UPDATE_USER";
const FIRST_LOGIN                   = "FIRST_LOGIN";



export const ENUM_BOOK = {
    START_FETCHING_GET_BOOK,
    SUCCESS_GET_BOOK,
    ERROR_GET_BOOK,
    RESET_BOOK,
    GET_DETAIL_BOOK,
    RESET_DETAIL_BOOK,
    LOGINED,
    UPDATE_USER,
    FIRST_LOGIN
}

export const getListBook = function () {
    return async function (dispatch, getState) {
    }
}

export const searchTutorials = function (keyword) {
    return async function (dispatch, getState) {
        const listData = getState().bookReducer.data ;
        let newList = [];
        listData.forEach(element => {
            const index = element.title.search(keyword) ; 
            if(index !== -1){
                newList.push(element)
            }
        });
        dispatch({ type : ENUM_BOOK.SUCCESS_GET_BOOK,data : newList })
    }
}

export const getDetailBook = function (data) {
    return async function (dispatch, getState) {
        dispatch({ type : GET_DETAIL_BOOK,data });
    }
}

export const updatedInfoUser = function () {
    return function (dispatch, getState) {
        dispatch({ type : LOGINED });
    }
}

export const updateInfo = function (data) {
    return function (dispatch, getState) {
        dispatch({ type : ENUM_BOOK.UPDATE_USER,data });
    }
}

export const updateFirstLogin = function () {
    return function (dispatch, getState) {
        dispatch({ type : ENUM_BOOK.FIRST_LOGIN});
    }
}

export const resetData = function () {
    return function (dispatch, getState) {
        dispatch({ type : ENUM_BOOK.RESET_BOOK});
    }
}

export const resetDetailBook = function () {
    return async function (dispatch, getState) {
        dispatch({ type : RESET_DETAIL_BOOK});
    }
}







