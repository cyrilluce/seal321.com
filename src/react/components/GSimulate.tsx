"use strict";
import * as React from 'react';
import { Component, PropTypes } from 'react'
import { inject, observer } from 'mobx-react';
import { ItemDbStore } from '../../stores';
import { findDOMNode } from 'react-dom';
import { dbs, ServerId } from '../../config';
import { ServerNames } from '../../lang'
import Dropdown from './Dropdown';
import ItemWidget from './Item';
import ItemSlot from './ItemSlot';

interface Props {
    store?: ItemDbStore;
}

@inject('store')
@observer
export default class GSimulate extends Component<Props, {}> {
    render() {
        const {store} = this.props;
        const gSimulate = store.gSimulate;

        return (
            <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-9 col-xs-12">
                    书
                    <ItemSlot data={gSimulate.book.data} canAccept={item=>!gSimulate.tryBookItem(item)} accept={item=>gSimulate.setBookItem(item)}/>
                    必需
                    <ItemSlot data={gSimulate.target.data} canAccept={item=>!gSimulate.tryTargetItem(item)} accept={item=>gSimulate.setTargetItem(item)}/>
                    辅助
                    {[0,1,2,3,4].map(index=>
                        <ItemSlot disabled={!gSimulate.craft.data || index>=gSimulate.craft.data.fieldnum} data={gSimulate.assists[index].data} canAccept={item=>!gSimulate.tryAssistItem(index, item)} accept={item=>gSimulate.setAssistItem(index, item)}/>
                    )}
                    成功率 {gSimulate.finalPercentage.toFixed(2)}%
                </div>
            </div>
        )
    }
}