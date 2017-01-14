import * as config from '../config';
import * as isomorphicFetch from 'isomorphic-fetch';

/**
 * 异步加载
 * @param path 请求相对路径
 * @param params 请求参数，对象，以json格式传给后台
 */
export async function fetch<T>(path: string, params: any) : Promise<T>{
    if(!global.IS_BROWSER){
        let server = config.deployServer;
        let port = config.nginxWebPort;

        if(process.env.NODE_ENV === 'development'){
            server = '127.0.0.1';
        }
        path = require('url').resolve(`http://${server}`, path);
    }
    // 这里判断如果是本服务，可以自动加上sessionId
    let res = await isomorphicFetch(path, {
        method: 'POST',
        headers : {
            "Content-Type": "application/json"
        },
        body : JSON.stringify(params)
    });
    let json = await res.json();
    if(!json.success){
        throw json;
    }
    return json.data;
}