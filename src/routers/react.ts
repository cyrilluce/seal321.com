/**
 * Created by cyrilluce on 2016/8/14.
 */
import React from 'react';
import { renderToString } from 'react-dom/server';
import { useStaticRendering } from 'mobx-react';
import { when, toJS } from 'mobx';
import getRoot from '../react/getRoot';
import * as config from '../config';
import ItemDbStore from '../stores/db';
import {Request, Response} from 'express';
import logger from '../logger';

// 防止mobx内存泄漏
useStaticRendering(true);

// 接下来会补充这部分代码
export default function handleRender(req: Request, res: Response) {
    const store = new ItemDbStore({
      keyword : req.query.keyword,
      page: +req.query.page
    });

    // 如果store加载完成（服务端加载），则渲染之
    when('加载完成', ()=>store.initialized, ()=>{
      const state = toJS(store);
      res.render("index", {
        // 把组件渲染成字符串
        html: renderToString(getRoot(store)),
        development : process.env.NODE_ENV === 'development',
        state,
        staticPath : process.env.NODE_ENV === 'development' ? `http://127.0.0.1:${config.localHotLoadPort}` : ''
      });
    })
}