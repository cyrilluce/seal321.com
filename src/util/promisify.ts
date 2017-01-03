
export default function promisify<TResult>(fn: Function, host?: any): (...any)=>Promise<TResult>{
    return function(...args): Promise<TResult>{
        return new Promise<TResult>((resolve, reject)=>{
            args.push((err, result: TResult)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(result);
            });
            fn.apply(host, args);
        });
    }
}