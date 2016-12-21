
import { combineReducers } from 'redux';

// 把action type与reducer合并写？

// 用户操作
export const SEARCH = 'SEARCH'; // 搜索
export const PAGING = 'PAGING'; // 翻页
export const DETAIL = 'DETAIL'; // 查看物品详情

// 内部操作
export const SEARCH_START = 'SEARCH_START';
export const INITIAL = 'INITIAL'; // 初始化，如果已初始化，则浏览器端不再初始化
export const SET_READY = 'SET_READY'; // 设置加载完成状态

// 异步操作前后缀 --- TODO 待定
export const ASYNC_PREFIX = 'FETCH';
export const ASYNC_SUFFIXS = {
    START : '_START',
    DONE : '_DONE',
    FAIL : '_FAIL'
}
export const fetchStart = type=>[ASYNC_PREFIX, type, ASYNC_SUFFIXS.START].join('_');

// action creator
export const search = keyword => ({type: SEARCH, value:keyword});
export const paging = (page, size) => ({type: PAGING, page, size});

// reducers
const staticReducer = (state=null)=>state;
const createAsyncReducer = (type, initValue)=>{
    return combineReducers({
        loading : (state=false, action)=>{
            const subType = action.type.slice(type.length);
            switch(subType){
                case ASYNC_SUFFIXS.START:
                    return true;
                case ASYNC_SUFFIXS.DONE:
                case ASYNC_SUFFIXS.FAIL:
                    return false;
                default:
                    return state;
            }
        },
        data : (state=initValue, action)=>{
            const subType = action.type.slice(type.length);
            switch(subType){
                case ASYNC_SUFFIXS.DONE:
                    return action.value;
                default:
                    return state;
            }
        },
        error : (state=null, action)=>{
            const subType = action.type.slice(type.length);
            switch(subType){
                case ASYNC_SUFFIXS.FAIL:
                    return action.value;
                default:
                    return state;
            }
        }
    });
}
const reducers = {
    // 初始path
    path : staticReducer,
    // 初始params
    params : staticReducer,
    // 是否进行过初始化
    initialized : (state=false, action)=>{
        switch(action.type){
            case INITIAL:
                return true;
            default:
                return state;
        }
    },
    // 当前页面是否处于加载完成状态
    ready : (state=false, action)=>{
        switch(action.type){
            case SET_READY:
                return action.value;
            default:
                return state;
        }
    },
    // 搜索关键字
    keyword : (state='', action)=>{
        switch(action.type){
            case SEARCH:
                return action.value;
            default:
                return state;
        }
    },
    // 是否处于搜索状态
    searching : (state=false, action)=>{
        switch(action.type){
            case SEARCH:
                return true;
            default:
                return state;
        }
    },
    // 分页信息
    page : (state=1, action)=>{
        switch(action.type){
            case SEARCH:
                return 1;
            case PAGING:
                return action.page || state;
            default:
                return state;
        }
    },
    // 页面大小
    size : (state=20, action)=>{
        switch(action.type){
            case PAGING:
                return action.size || state;
            default:
                return state;
        }
    },
    // 搜索结果
    result : createAsyncReducer(SEARCH, {total:0,list:[]})
};

export default reducers;