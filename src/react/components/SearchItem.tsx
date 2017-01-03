/**
 * 搜索结果条目
 * Created by cyrilluce on 2016/8/14.
 */
"use strict";
import * as React from 'react';
import {Component, PropTypes} from 'react'
import {getIconStyle} from '../util';

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
        return (
            <li onClick={this.onClick.bind(this)}>
                <div style={getIconStyle(data.displayid)} />
                {data.name}
            </li>
        )
    }
}