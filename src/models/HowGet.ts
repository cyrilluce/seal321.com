import * as query from '../stores/query';
import { Result } from '../routers/query/howget';
import { IDLoadable, Param } from './IDLoadable';
import { observable, computed, action, reaction, autorun } from 'mobx';


export class HowGetModel extends IDLoadable<Result>{
    protected async query(param: Param){
        return await query.howget(param);
    }
    protected isDataMatch(param: Param, data: Result): boolean{
        return param.id === data.id && super.isDataMatch(param, data);
    }
}