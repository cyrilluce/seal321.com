export interface Response{
    success: boolean;
    data?: any;
    msg?: string;
}

export function success(data:any=undefined): Response{
    return {
        success : true,
        data
    }
}

export function failure(msg:string="请求出错"): Response{
    return {
        success : false,
        msg
    }
}

export * from './koa-logger';