/**
 * Created by cyrilluce on 2016/8/14.
 */
///<reference path="../types/window.d.ts" />
import React from 'react';
import { render } from 'react-dom'
import ItemDbStore from '../stores/db';
import getRoot from '../react/getRoot';
import { autorun } from 'mobx';
import { setPage, sendPageView } from '../util';

// 创建新的 mobx store 实例
const store = new ItemDbStore().init(window.__INITIAL_STATE__, true);

let rootInstance = render(getRoot(store), document.getElementById('root'));

// 同步history，低端浏览器就直接不支持了
if (global.IS_BROWSER && window.history && history.pushState) {
  let isHistoryBack = false;
  autorun(() => {
    const {pageTitle, pagePath} = store;
    if (!isHistoryBack) {
      history.pushState({}, pageTitle, pagePath);
    }
    setPage(pagePath);
  });
  // 计算pv
  autorun(()=>{
    const {historyParams} = store;
    sendPageView();
  });
  window.addEventListener('popstate', (e) => {
    isHistoryBack = true;
    store.navigatePath(location.pathname+location.search);
    isHistoryBack = false;
  })
}

if (module.hot) {
  require('react-hot-loader/Injection').RootInstanceProvider.injectProvider({
    getRootInstances: function () {
      // Help React Hot Loader figure out the root component instances on the page:
      return [rootInstance];
    }
  });
}