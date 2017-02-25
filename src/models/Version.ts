import { Result } from '../routers/query/version';
import { ServerId, mainDb } from '../config'
import * as query from '../stores/query';
import { Loadable } from './Loadable';
import { observable, computed, action, reaction, autorun } from 'mobx';

interface Param{
    loc: ServerId;
}
export interface Newest{
    /** 最近更新时间 */
    time: Date;
    /** 最近更新的版本 */
    version: string;
}
export class Version extends Loadable<Param, Result>{
    @observable loc: ServerId;
    @computed get param(): Param{
        return {
            loc: this.loc
        }
    }
    /** 最得最新的版本 */
    @computed get newest(): Newest{
        const data = this.data;
        if(!data){
            return {
                time: new Date(0),
                version: ''
            };
        }
        let newestTime: number = 0;
        let newestType: string;
        Object.keys(data).forEach(type=>{
            const ver = data[type];
            if(ver.time > newestTime){
                newestTime = ver.time;
                newestType = type;
            }
        });

        return {
            time: new Date(newestTime * 1000),
            version: data[newestType].version
        }
    }
    protected async query(param: Param){
        return query.version(param);
    }
    protected isParamValid(param: Param): boolean{
        return !!param.loc;
    }
    protected isDataMatch(param: Param, data: Result): boolean{
        return this.lastParam && this.lastParam.loc === this.loc;
    }
}