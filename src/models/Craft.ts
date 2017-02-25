import { Craft, CraftType } from '../types';
import * as query from '../stores/query';
import { IDLoadable, Param } from './IDLoadable';
import { observable, computed, action, reaction, autorun } from 'mobx';


export class CraftModel extends IDLoadable<Craft>{
    /** 是否是G/T/S/C强化书 */
    @computed get isGTSC(): boolean{
        const craft = this.data;
        if(!craft){
            return false;
        }
        return craft.type === CraftType.G || craft.type === CraftType.T || craft.type === CraftType.S || craft.type === CraftType.C
    }
    protected async query(param: Param){
        const map = await query.craft(param);
        return map[param.id];
    }
    protected isDataMatch(param: Param, data: Craft): boolean{
        return param.id === data.id && super.isDataMatch(param, data);
    }
}