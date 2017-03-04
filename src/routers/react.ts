/**
 * Created by cyrilluce on 2016/8/14.
 */
import React from 'react';
import { renderToString } from 'react-dom/server';
import { useStaticRendering } from 'mobx-react';
import { when, toJS } from 'mobx';
import getRoot from '../react/getRoot';
import * as localConfig from '../localConfig';
import { ItemDbStore, itemDbParamConfigs } from '../stores';
import logger from '../logger';
import { join } from 'path';
import * as config from '../config';
import * as compose from "koa-compose";
import * as views from "koa-views";
import * as fs from 'mz/fs';

const releaseTagTask = fs.readFile(join(__dirname, '../../releaseTag.txt')).then(data => {
  return data.toString();
}, err => {
  return '' + Date.now();
});

// 防止mobx内存泄漏
useStaticRendering(true);

// 接下来会补充这部分代码
export default compose([
  views(join(__dirname, '../../views'), {
    extension: 'html',
    map: {
      html: 'ejs'
    }/*,
    options : {
      cache: process.env !== 'development',
      filename: 'ejscache'
    }*/
  }),
  async (ctx, next) => {
    const startTime = Date.now();
    const store = new ItemDbStore().init();
    store.navigateParams(ctx.params, ctx.request.query);

    // hack，以后考虑换其它地方
    if (store.gSimulate.book.id) {
      store.gSimulateVisible = true;
    }

    const releaseTag = await releaseTagTask;

    // 如果store加载完成（服务端加载），则渲染之
    await new Promise(resolve => {
      when('加载完成', () => store.initialized, resolve);
    })

    const mobxFinishedTime = Date.now();

    const state = toJS(store);

    const mobxSerializedTime = Date.now();

    const html = renderToString(getRoot(store));

    const reactRenderedTime = Date.now();

    await ctx.render("index", {
      // 把组件渲染成字符串
      title: store.pageTitle,
      html,
      development: process.env.NODE_ENV === 'development',
      releaseTag,
      state,
      staticPath: process.env.NODE_ENV === 'development' ? `http://127.0.0.1:${localConfig.localHotLoadPort}` : ''
    });

    const endTime = Date.now();

    logger.info(`渲染计时，mobx ${mobxFinishedTime - startTime}ms, tojs ${mobxSerializedTime - mobxFinishedTime}ms, toStr ${reactRenderedTime - mobxSerializedTime}ms, pug ${endTime - reactRenderedTime}ms`)
  }
]);