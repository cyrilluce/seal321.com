/**
 * 简单抽象一个基类，有以下通用功能
 *  * 加载器，通过loc+id来加载数据，涉及属性： id, data, err, dataLoading
 * 
 */
import { ServerId, mainDb } from '../config'
import { observable, computed, action, reaction } from 'mobx';
import { delay } from '../util';

type Options = any;

export abstract class Base{
    init(options?: Options, restoreFromData = false) {
        if (!restoreFromData) {
            this.initReactions();
        }

        this.initOptions(options || {}, restoreFromData);

        if (restoreFromData) {
            this.initReactions();
        }
    }
    /** 初始化属性，以后可以在这里初始化子Model、数据联动，以及它们的reaction */
    protected initOptions(options: Options, skipReaction = false) {
        Object.keys(options).forEach(key => {
            if (key in this) {
                this[key] = options[key];
            }
        });
    }
    /**
     * 初始化Reactions
     */
    protected initReactions() {
        
    }
}