/**
 * Created by cyrilluce on 2016/8/15.
 */
import React from 'react';
import { Provider } from 'mobx-react';
import ItemDb from './containers/ItemDb';

export default function getRoot(store){
    return <Provider store={store}>
        <ItemDb />
    </Provider>;
}