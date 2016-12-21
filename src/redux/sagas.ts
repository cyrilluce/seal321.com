import {takeEvery, takeLatest, delay} from 'redux-saga';
import {take, put, select, call, fork, cancel} from 'redux-saga/effects';
import * as types from './actions';
import 'babel-polyfill';
import {resolve as urlResolve} from 'url';
import * as config from '../config';
///<reference path="../types/global.d.ts" />
// 异步加载
function fetch(path, params){
    if(global.IS_BROWSER) { // 浏览器端，直接用jQuery？
        return new Promise((resolve, reject)=> {
            window.jQuery.ajax({
                url: path,
                data: params,
                type: 'post',
                dataType: 'json'
            }).then(json=>{
                if(!json.success){
                    return reject(json);
                }
                resolve(json.data);
            }, reject);
            // resolve({
            //     total : 100,
            //     list : [
            //         {
            //             name : '物品a'
            //         }
            //     ]
            // })
        });
    }else{ // 服务端，这个咋办？用request库？
        // 这里判断如果是本服务，可以自动加上sessionId
        return require('node-fetch')(urlResolve(`http://${config.deployServer}`, path), {
            method: 'POST',
            body : JSON.stringify(params)
        }).then(res => res.json()).then(json=>{
            if(!json.success){
                throw json;
            }
            return json.data;
        });
        // resolve({
        //     total : 100,
        //     list : [
        //         {
        //             name : '物品aaa'
        //         }
        //     ]
        // })
    }
}

// 包装一下，防止说没有catch报错
function wrap(promise){
    return promise.then(data=>({data}),err=>({err}));
}

// 标记为loading，但设计为异步，如果立即完成了，则并不会loading
function* markLoading(type){
    yield delay(0);
    yield put({
        type : type+types.ASYNC_SUFFIXS.START
    });
}

// 以某actionType为基础进行异步任务请求
function* fetchWith(type, promise){
    const task = yield fork(markLoading, type); 
    const {data, err} = yield wrap(promise);
    yield cancel(task);
    if(err){
        yield put({
            type : type+types.ASYNC_SUFFIXS.FAIL,
            value : err
        });
        return;
    }
    yield put({
        type : type+types.ASYNC_SUFFIXS.DONE,
        value : data
    });
}

// 执行搜索
function* doSearch(){
    const {keyword, page, size} = yield select();

    yield fetchWith(types.SEARCH, fetch('/node/query/list', {
        keyword,
        page,
        size
    }));
}
// TODO 执行翻页
// TODO 执行查看详情

function* init(){
    const {initialized, keyword} = yield select();
    if(initialized){
        return;
    }
    // 初始化
    if(keyword){
        yield put({type: types.SEARCH, value: keyword});
    }
    yield delay(0);
    yield put({type: types.INITIAL});
}
export default function* rootSaga(){
    yield [
        // 搜索联动
        takeLatest([types.SEARCH, types.PAGING], doSearch),
        // 初始化
        init()
    ];

}