/**
 * Created by cyrilluce on 2016/8/14.
 */
import React from 'react';
import { renderToString } from 'react-dom/server';
import { useStaticRendering } from 'mobx-react';
import getRoot from '../react/getRoot';
import * as config from '../config';
import ItemDbStore from '../stores/db';
import {Request, Response} from 'express';

// 防止mobx内存泄漏
useStaticRendering(true);

// 接下来会补充这部分代码
export default function handleRender(req: Request, res: Response) {
    // 创建新的 Redux store 实例
    // const store = getStore({
    //     path: req.path,
    //     keyword : req.query.keyword
    // });
    const store = new ItemDbStore({
      keyword : req.query.keyword
    });

    // 如果store加载完成（服务端加载），则渲染之
    let unsubscribe;
    let ifLoaded = function(){
      let state = store.getState();
      if(state.initialized && (!state.result || !state.result.loading)){
        // 把渲染后的页面内容发送给客户端
        res.render("index", {
          // 把组件渲染成字符串
          html: renderToString(getRoot(store)),
          development : process.env.NODE_ENV === 'development',
          store : store,
          staticPath : process.env.NODE_ENV === 'development' ? `http://127.0.0.1:${config.localHotLoadPort}` : ''
        });
        if(unsubscribe){
          unsubscribe();
        }
        return true;
      }
    }
    
    if(!ifLoaded()){
      unsubscribe = store.subscribe(ifLoaded);
    }
}