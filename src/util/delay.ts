// import promisify from './promisify';

// export default promisify(function(delay, cb){
//     setTimeout(cb, delay);
// });

export default function delay(ms: number = 0){
    return new Promise(resolve=>{
        setTimeout(resolve, ms);
    })
}