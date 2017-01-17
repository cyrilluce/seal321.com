import { SetOption } from '../types';
import * as query from '../stores/query';
import { IDLoadable, Param } from './IDLoadable';

export interface SetOptions{
    [count: number]: SetOption;
}

export class SetOptionModel extends IDLoadable<SetOptions>{
    protected async query(param: Param){
        const map = await query.setopt(param);
        return map[param.id];
    }
    protected isDataMatch(param: Param, data: SetOptions): boolean{
        return false;
        // return param.id && !!data;
    }
}