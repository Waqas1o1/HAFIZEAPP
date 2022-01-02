import * as actionTypes from "../actions/actionTypes";
import { updateObject } from '../utils'

const initialStates = {
    loading : false,
    error: null,
    token: null,
};

export const authStart =  (state, action) => {
    return updateObject(state,{
        loading: true,
        error: null
    });
};
export const authSuccess =  (state, action) => {
    return updateObject(state,{
        loading: false,
        token: action.token,
        group: action.group
    });
};
export const authFail =  (state, action) => {
    return updateObject(state,{
        error: action.error,
        loading: false
    });
};
export const authLogout =  (state, action) => {
    return updateObject(state,{
        token: null,
    });;
}

const reducer = (state = initialStates, action) => {
    switch (action.type){
        case actionTypes.AUTH_START:return authStart(state, action)
        case actionTypes.AUTH_SUCCESS:return authSuccess(state, action)
        case actionTypes.AUTH_FAIL:return authFail(state, action)
        case actionTypes.AUTH_LOGOUT:return authLogout(state, action)
        default: 
            return initialStates;
    }
};
export default reducer;