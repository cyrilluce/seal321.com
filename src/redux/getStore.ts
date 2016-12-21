import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import * as createLogger from 'redux-logger';
import rootSaga from './sagas';
import reducers from './actions';

// store factory
export default function getStore(initialState){
    // create the saga middleware
    const sagaMiddleware = createSagaMiddleware();
    // mount it on the Store
    const store = createStore(
        combineReducers(reducers),
        initialState,
        process.env.NODE_ENV === 'development' ? 
            applyMiddleware(sagaMiddleware, createLogger()) : 
            applyMiddleware(sagaMiddleware)
    )

    // then run the saga
    sagaMiddleware.run(<any>rootSaga)

    return store;
}