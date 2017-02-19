/**
 * 搜索结果条目
 * Created by cyrilluce on 2016/8/14.
 */
"use strict";
import * as React from 'react';
import {Component, PropTypes} from 'react'
import {getIconStyle} from '../util';
import {Item} from '../../types';
import * as lang from '../../lang';
import ItemWidget from './Item';

interface Props{
    data: Item,
    onClick: (...any)=>void;
}

export default class SearchItem extends Component<Props, {}> {
    onClick(){
        const {data, onClick} = this.props;
        if(onClick){
            onClick(data);
        }
    }
    render() {
        const {data} = this.props;
        return <tr className="item" onClick={this.onClick.bind(this)}>
            <td><ItemWidget data={data} /></td>
            <td>{data.name}</td>
            <td>{lang.ItemTypeNames[data.type]}</td>
            <td>{data.level || '-'}</td>
            <td>{data.description}</td>
        </tr>
        // return (
        //     <li onClick={this.onClick.bind(this)}>
        //         <div style={getIconStyle(data.displayid)} />
        //         {data.name}
        //     </li>
        // )
    }
}