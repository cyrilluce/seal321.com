import { Craft } from '../types';
import * as query from '../stores/query';
import { IDLoadable, Param } from './IDLoadable';


export class CraftModel extends IDLoadable<Craft>{
    protected async query(param: Param){
        const map = await query.craft(param);
        return map[param.id];
    }
    protected isDataMatch(param: Param, data: Craft): boolean{
        return param.id === data.id && super.isDataMatch(param, data);
    }
}