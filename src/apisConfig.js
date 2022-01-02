import axios from 'axios'

// const baseURL = 'http://127.0.0.1:8000/';

const baseURL = 'https://hafiz-enterprises.herokuapp.com/';


const getAxiosIncetent = () =>{
    const token = localStorage.getItem('token');
    if ( token ===  null || token === undefined){
        return (
            axios.create({
            baseURL: baseURL,
            timeout: 5000,
            headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                }
            })
        )
    }
    else{
        return (
            axios.create({
            baseURL: baseURL,
            timeout: 6000,
            headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                }
            })
        )
    }
}

const axiosInstance = getAxiosIncetent();


export default axiosInstance;