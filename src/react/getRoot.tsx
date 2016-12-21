/**
 * Created by cyrilluce on 2016/8/15.
 */
import * as React from 'react';
import { Provider } from 'react-redux';
import ItemDb from './containers/ItemDb';

export default function getRoot(store){
    return <Provider store={store}>
        <ItemDb />
    </Provider>;
}