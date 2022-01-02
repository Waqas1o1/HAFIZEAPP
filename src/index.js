import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// import swDev from './swDev';
import reducer from './store/reducers/auth';
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import "react-toastify/dist/ReactToastify.css";

const composeEhances = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, composeEhances(applyMiddleware(thunk)))


ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);


// swDev();
