export function promiseCall<TResult>(fn, host, ...args) {
    return new Promise<TResult>((resolve, reject) => {
        args.push((err, result: TResult) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });
        fn.apply(host, args);
    });
}