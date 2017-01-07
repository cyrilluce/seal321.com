/**
 * Created by cyrilluce on 2016/8/14.
 */
///<reference path="../types/window.d.ts" />
import React from 'react';
import { render } from 'react-dom'
import ItemDbStore from '../stores/db';
import getRoot from '../react/getRoot';

// 创建新的 Redux store 实例
const store = ItemDbStore.fromJS(window.__INITIAL_STATE__);

let rootInstance = render(getRoot(store), document.getElementById('root'));

if(module.hot){
    require('react-hot-loader/Injection').RootInstanceProvider.injectProvider({
    getRootInstances: function () {
      // Help React Hot Loader figure out the root component instances on the page:
      return [rootInstance];
    }
  });
}