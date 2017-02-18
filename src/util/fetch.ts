import * as localConfig from '../localConfig';
import * as isomorphicFetch from 'isomorphic-fetch';
import { sendTiming } from '.'

/**
 * 异步加载
 * @param path 请求相对路径
 * @param params 请求参数，对象，以json格式传给后台
 */
export async function fetch<T>(path: string, params: any) : Promise<T>{
    if(!global.IS_BROWSER){
        let server = localConfig.deployServer;
        let port = localConfig.nginxWebPort;

        if(process.env.NODE_ENV === 'development'){
            server = '127.0.0.1';
        }
        path = require('url').resolve(`http://${server}`, path);
    }
    // 计时
    let start = new Date().getTime();
    // 这里判断如果是本服务，可以自动加上sessionId
    let res = await isomorphicFetch(path, {
        method: 'POST',
        headers : {
            "Content-Type": "application/json"
        },
        body : JSON.stringify(params)
    });
    let json = await res.json();
    let cost = new Date().getTime() - start;
    sendTiming('fetch', path, cost);
    if(!json.success){
        throw json;
    }
    return json.data;
}