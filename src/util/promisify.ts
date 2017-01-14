import {promiseCall} from './promiseCall';
export function promisify<TResult>(fn: Function, host?: any): (...any)=>Promise<TResult>{
    return function(...args): Promise<TResult>{
        return promiseCall<TResult>(fn, host, ...args);
    }
}