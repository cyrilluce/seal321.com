/**
 * Created by cyrilluce on 2016/8/14.
 */
import React from 'react';
import { renderToString } from 'react-dom/server';
import { useStaticRendering } from 'mobx-react';
import { when, toJS } from 'mobx';
import getRoot from '../react/getRoot';
import * as localConfig from '../localConfig';
import ItemDbStore from '../stores/db';
import logger from '../logger';
import { join } from 'path';
import * as config from '../config';
import * as compose from "koa-compose";
import * as views from "koa-views";

// 防止mobx内存泄漏
useStaticRendering(true);

// 接下来会补充这部分代码
export default compose([
  views(join(__dirname, '../../views'), {
    extension: 'pug',
    map: {
      pug: 'pug'
    }
  }),
  async (ctx, next) => {
    const store = new ItemDbStore({
      loc: ctx.request.query.db || config.mainDb,
      keyword: ctx.request.query.keyword || '',
      page: +ctx.request.query.page || 1,
      itemId: +ctx.request.query.id || 0,
      itemLevel: +ctx.request.query.level || 0
    });

    // 如果store加载完成（服务端加载），则渲染之
    await new Promise(resolve => {
      when('加载完成', () => store.initialized, resolve);
    })

    const state = toJS(store);
    await ctx.render("index", {
      // 把组件渲染成字符串
      html: renderToString(getRoot(store)),
      development: process.env.NODE_ENV === 'development',
      state,
      staticPath: process.env.NODE_ENV === 'development' ? `http://127.0.0.1:${localConfig.localHotLoadPort}` : ''
    });
  }
]);