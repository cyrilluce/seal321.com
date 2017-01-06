import {resolve as urlResolve} from 'url';
import * as config from '../config';

/**
 * 异步加载
 * @param path 请求相对路径
 * @param params 请求参数，对象，以json格式传给后台
 */
export default async function fetch<T>(path: string, params: any) : Promise<T>{
    if(global.IS_BROWSER) { // 浏览器端，直接用jQuery？
        return new Promise<T>((resolve, reject)=> {
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
        });
    }else{ // 服务端，这个咋办？用request库？
        // 这里判断如果是本服务，可以自动加上sessionId
        let res = await require('node-fetch')(urlResolve(`http://${config.deployServer}`, path), {
            method: 'POST',
            body : JSON.stringify(params)
        });
        let json = res.json();
        if(!json.success){
            throw json;
        }
        return json.data;
    }
}