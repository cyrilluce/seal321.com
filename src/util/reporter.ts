const gtag = function(...any){
    if(!global.IS_BROWSER){
        return;
    }
    const gtag = window.gtag;
    if(!gtag){
        return;
    }
    gtag(...arguments);
}
/**
 * 设置页面
 * 
 * @deprecated GA4自动收集，不需要了
 */
export function setPage(path: string): void{
    // ga('set', 'page', path);
}

/**
 * 发送PV
 * @deprecated GA4自动收集，不需要了
 */
export function sendPageView(): void{
    // ga('send', 'pageview');
}

/**
 * 发送事件
 * @param eventCategory 通常是用户与之互动的对象（例如 'Video'）
 * @param eventAction 互动类型（例如 'play'）
 * @param eventLabel 用于对事件进行分类（例如 'Fall Campaign'）
 * @param eventValue 与事件相关的数值（例如 42）
 */
export function sendEvent(event_category: string, event_action: string, event_label?: string, eventValue?: number): void{
    gtag('event', {
        event_category,
        event_action,
        event_label
    })
}

/**
 * 发送计时
 * @param timingCategory 用于将所有用户计时变量归类到相应逻辑组的字符串（例如 'JS Dependencies'）。
 * @param timingVar 用于标识要记录的变量（例如 'load'）的字符串。
 * @param timingValue 向 Google Analytics（分析）报告的，以毫秒为单位的历时时间（例如 20）。
 * @param timingLabel 可用于提高报告中显示用户计时数据灵活性的字符串（例如 'Google CDN'）。
 */
export function sendTiming(timingCategory: string, timingVar: string, timingValue: number, timingLabel?: string): void{
    // 大于1小时的应该是脏数据，无视
    if(timingValue > 60 * 60 * 1000){
        return
    }
    gtag('event', 'timing_complete', {
        'name': timingVar,
        'value': timingValue,
        'event_category': timingCategory,
        'event_label': timingLabel
      })
}