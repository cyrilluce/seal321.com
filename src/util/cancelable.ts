// 使用generator实现cancelable？类似co框架
type ICancelableTask = Promise<any> | any;
type ICancelable = (...args: any[])=>IterableIterator<ICancelableTask>
function* test(){

}
export default function cancelable(generator: ICancelable): ()=>void{
    return function(){
        let iterator = generator();
        let result: IteratorResult<ICancelableTask>;
        do{
            result = iterator.next();
            if(Array.isArray(result)){
                
            }
        }while(!result.done)
    }
}