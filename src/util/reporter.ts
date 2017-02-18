const ga = function(...any){
    if(!global.IS_BROWSER){
        return;
    }
    const ga = window.ga;
    if(!ga){
        return;
    }
    ga(...arguments);
}
/**
 * 设置页面
 */
export function setPage(path: string): void{
    ga('set', 'page', path);
}

/**
 * 发送PV
 */
export function sendPageView(): void{
    ga('send', 'pageview');
}

/**
 * 发送事件
 * @param eventCategory 通常是用户与之互动的对象（例如 'Video'）
 * @param eventAction 互动类型（例如 'play'）
 * @param eventLabel 用于对事件进行分类（例如 'Fall Campaign'）
 * @param eventValue 与事件相关的数值（例如 42）
 */
export function sendEvent(eventCategory: string, eventAction: string, eventLabel?: string, eventValue?: number): void{
    ga('send', 'event', ...arguments)
}