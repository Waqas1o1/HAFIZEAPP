import *  as actionTypes from "./actionTypes";
import axiosInstance from '../../apisConfig';


export const authStart = () =>{
    return {
        type:actionTypes.AUTH_START
    };
};

export const  authSuccess = (token,group) =>{
    return {
        type: actionTypes.AUTH_SUCCESS,
        token:token,
        group:group
    }
};

export const authFail = (error) =>{
    return {
        type: actionTypes.AUTH_FAIL,
        error,
    }
};


export const authLogout = () =>{
    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
    return {
        type: actionTypes.AUTH_LOGOUT
    }
};

export const authLogin = (username, password) =>{
    return dispatch =>{
        dispatch(authStart());
        localStorage.removeItem('token');
        axiosInstance.post('/auth/login/',{
            username,
            password
        })
        .then((res)=>{
            const token = res.data.data.token;
            const expiry = res.data.data.expiry;
            const group = res.data.data.group;
            let displayname = 'Superuser';
            if (res.data.data.salesofficer ){
                localStorage.setItem('salesofficer',JSON.stringify(res.data.data.salesofficer));
                displayname = res.data.data.salesofficer.name;
            }
            else if (res.data.data.dispatcher){
                displayname = res.data.data.dispatcher.name;
            }
            else{
                localStorage.removeItem('salesofficer');
            }
            localStorage.setItem('token',token);
            localStorage.setItem('displayname',displayname);
            localStorage.setItem('group',group);
            localStorage.setItem('expiry',expiry);
            window.location.replace("/");
        })
        .catch((err =>{
            dispatch(authFail(err));
            alert('Login Criedentials Fail !!!');
        }))   
    }
};


export const authSignup = (username, email, password, role) =>{
    return dispatch =>{
        dispatch(authStart());
        axiosInstance.post('/auth/register/',{
            username,
            email,
            password,
            role
        })
        .then((res)=>{
            const token = res.data.key;
            const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
            localStorage.setItem('token',token);
            localStorage.setItem('expirationDate',expirationDate);
            window.location.replace("/");
        })
        .catch((err =>{
            dispatch(authFail(err))
        }));   
    };
};

export const authCheckState = () =>{
    return dispatch =>{
        const token = localStorage.getItem('token');
        const group = localStorage.getItem('group');
        var expiry = localStorage.getItem('expiry');
        if (token === undefined || token  === null){
            dispatch(authLogout())
            if (window.location.pathname !== '/login'){
                window.location.replace('/login');
            }
        }
        else{
            expiry = new Date(expiry);
            if ( expiry <= new Date()){
                dispatch(authLogout());
            }else{
                dispatch(authSuccess(token,group));
            }
        };
    }
};