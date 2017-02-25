"use strict";
import * as React from 'react';
import { Component, PropTypes } from 'react'
import { autorun } from 'mobx';
import { inject, observer } from 'mobx-react';
import { ItemDbStore } from '../../stores';
import { findDOMNode } from 'react-dom';
import { dbs, ServerId } from '../../config';
import { ServerNames } from '../../lang'
import { Item as IItem } from '../../types';
import { Item as ItemModel } from '../../models';
import Dropdown from './Dropdown';
import ItemWidget from './Item';
import ItemSlot from './ItemSlot';

interface Props {
    store?: ItemDbStore;
}

interface State {
    detailMode?: boolean;
}
/**
 * 将数字转换为千分制
 */
function humanizeNumber(num: number, len: number = 3, splitter: string = ','): string{
    const str = num.toFixed(0);
    const parts = [];
    for(let i=str.length%len || len, start=0; i<=str.length; i+=len){
        parts.push(str.slice(start, i));
        start = i;
    }
    return parts.join(splitter);
}

@inject('store')
@observer
export default class GSimulate extends Component<Props, State> {
    render() {
        const {store} = this.props;
        if (!store.gSimulateVisible) {
            return null;
        }
        const gSimulate = store.gSimulate;
        const itemDetail = store.itemModel;
        const detailMode = this.state && this.state.detailMode;

        let lastIdHook, lastLevelHook;
        const makeViewItem = (itemModel: ItemModel)=>{
            return (item: IItem)=>{
                // if(lastIdHook){
                //     lastIdHook();
                //     lastLevelHook();
                // }
                store.viewItem(itemModel.data, itemModel.addLevel);
                lastIdHook = autorun(()=>{
                    itemDetail.id;
                    lastIdHook && lastIdHook();
                    lastLevelHook && lastLevelHook();
                })
                lastLevelHook = autorun(()=>{
                    itemModel.addLevel = itemDetail.addLevel;
                })
            }
        }

        const targetInvalid = gSimulate.targetInvalid;

        return (
            <div className="row gsim">
                <div className="col-md-6 col-sm-9 col-xs-12">
                    <div className="panel panel-default">
                        <div className="panel-body">
                            <div className="row">
                                <div className="col-xs-12">
                                    <span className="gsim-cost">制作费 {humanizeNumber(gSimulate.cost)}</span>
                                    <span className="gsim-rate">成功率 {gSimulate.percentage.toFixed(2)}%{gSimulate.skillWork ? `(匠师:${gSimulate.skillPercentage.toFixed(2)}%)` : ''}</span>
                                    <a href="javascript:;" onClick={()=>{this.setState({detailMode: !detailMode})}}>{detailMode ? '简略' : '详情'}</a>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-12">
                                    <ItemSlot onRightClick={makeViewItem(gSimulate.book)} 
                                        onDragAway={()=>gSimulate.book.setId(0)}
                                        data={gSimulate.book.data} 
                                        canAccept={item => !gSimulate.tryBookItem(item)} 
                                        accept={item => gSimulate.setBookItem(item)} />
                                    <div className="gsim-splitter"></div>
                                    <ItemSlot onRightClick={makeViewItem(gSimulate.target)} 
                                        onDragAway={()=>gSimulate.target.setId(0)}
                                        disabled={!gSimulate.craft.isGTSC}
                                        data={gSimulate.target.data} 
                                        className={targetInvalid ? "gsim-slot-invalid" : ''}
                                        title={targetInvalid}
                                        canAccept={item => !gSimulate.tryTargetItem(item)} 
                                        accept={item => gSimulate.setTargetItem(item)}>
                                        {gSimulate.target.data && gSimulate.target.addLevel>0 && <span className="gsim-slot-level">+{gSimulate.target.addLevel}</span>}
                                    </ItemSlot>
                                    <div className="gsim-splitter"></div>
                                    {[0, 1, 2, 3, 4].map(index =>
                                        <ItemSlot onRightClick={makeViewItem(gSimulate.assists[index])} key={index} 
                                            onDragAway={()=>gSimulate.assists[index].setId(0)}
                                            disabled={!gSimulate.craft.data || index >= gSimulate.craft.data.fieldnum} 
                                            data={gSimulate.assists[index].data} 
                                            className={gSimulate.assistInvalids[index] ? "gsim-slot-invalid" : ''}
                                            title={gSimulate.assistInvalids[index]}
                                            canAccept={item => !gSimulate.tryAssistItem(index, item)} 
                                            accept={item => gSimulate.setAssistItem(index, item)} >
                                            {gSimulate.assists[index].data && gSimulate.assists[index].addLevel>0 && <span className="gsim-slot-level">+{gSimulate.assists[index].addLevel}</span>}
                                        </ItemSlot>
                                    )}
                                    <div className="gsim-splitter">
                                        <span className="glyphicon glyphicon-chevron-right" />
                                    </div>
                                    <div className="gsim-splitter gsim-result">
                                        {gSimulate.result.data ? 
                                            <ItemWidget onRightClick={makeViewItem(gSimulate.result)} data={gSimulate.result.data}  /> :
                                            <span className="glyphicon glyphicon-question-sign" />}
                                    </div>
                                </div>
                            </div>
                            {detailMode && <div className="row">
                                <div className="col-xs-12">
                                    {gSimulate.invalid && <div className="gsim-invalid">{gSimulate.invalid}</div>}
                                    <div>必需材料</div>
                                    {[0, 1, 2, 3, 4].map(index =>
                                        gSimulate.needs[index].data && <div key={index}  className="gsim-need">
                                            <span className="gsim-need-num">{gSimulate.craft.data && gSimulate.craft.data[`num${index+1}`]}</span>
                                            <ItemWidget onRightClick={makeViewItem(gSimulate.needs[index])}
                                                data={gSimulate.needs[index].data}  />
                                        </div>
                                    )}
                                </div>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}