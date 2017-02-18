/**
 * Created by cyrilluce on 2016/8/14.
 */
///<reference path="../types/window.d.ts" />
import React from 'react';
import { render } from 'react-dom'
import ItemDbStore from '../stores/db';
import getRoot from '../react/getRoot';
import { autorun } from 'mobx';
import { setPage, sendPageView, sendTiming } from '../util';

// 创建新的 mobx store 实例
const store = new ItemDbStore().init(window.__INITIAL_STATE__, true);

let rootInstance = render(getRoot(store), document.getElementById('root'));

// 同步history，低端浏览器就直接不支持了
if (global.IS_BROWSER && window.history && history.pushState) {
  let isHistoryBack = false;
  let lastHistoryParams;
  autorun(() => {
    const {pageTitle, pagePath, historyParams} = store;
    // 如果关键参数有变动，计算为pv
    const marjorChange = JSON.stringify(historyParams) !== JSON.stringify(lastHistoryParams);
    lastHistoryParams = historyParams;
    if (!isHistoryBack) {
      history[marjorChange ? 'pushState' : 'replaceState']({}, pageTitle, pagePath);
    }
    setPage(pagePath);
    // 如果关键参数有变动，计算为pv
    if(marjorChange){
      sendPageView();
    }
  });
  window.addEventListener('popstate', (e) => {
    isHistoryBack = true;
    store.navigatePath(location.pathname+location.search);
    isHistoryBack = false;
  })
}

// 测速
window.addEventListener('load', function(){
  if(window.performance){
      let t = performance.timing;
      // 页面加载总时间 从浏览器开始访问到dom及主要js加载执行完成
      sendTiming('page', 'loadall', t.domContentLoadedEventEnd - t.navigationStart);
      // dns解析时间
      sendTiming('page', 'dns', t.domainLookupEnd - t.domainLookupStart);
      // 从发起请求到请求结束的时间
      sendTiming('page', 'loadhtml', t.responseEnd - t.connectStart);
      // DOM解析、JS加载执行时间
      sendTiming('page', 'loadothers', t.domContentLoadedEventEnd - t.responseEnd);
  }
})

if (module.hot) {
  require('react-hot-loader/Injection').RootInstanceProvider.injectProvider({
    getRootInstances: function () {
      // Help React Hot Loader figure out the root component instances on the page:
      return [rootInstance];
    }
  });
}