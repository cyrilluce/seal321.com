// import promisify from './promisify';

// export default promisify(function(delay, cb){
//     setTimeout(cb, delay);
// });

export function delay(ms: number = 0){
    return new Promise(resolve=>{
        setTimeout(resolve, ms);
    })
}

export async function timeout<T>(promise: Promise<T>, ms: number){
    let timer;
    const wrapped = Promise.race([
        new Promise((resolve, reject)=>{
            timer = setTimeout(()=>{
                reject(new Error(`${ms}毫秒超时`));
            }, ms);
        }),
        promise
    ]);

    // 清除定时器
    const clear = ()=>{
        clearTimeout(timer);
    }
    wrapped.then(clear, clear);

    return wrapped;
}