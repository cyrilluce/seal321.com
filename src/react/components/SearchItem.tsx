/**
 * 搜索结果条目
 * Created by cyrilluce on 2016/8/14.
 */
"use strict";
import * as React from 'react';
import {Component, PropTypes} from 'react'

interface Props{
    data: Item,
    onClick: (...any)=>void;
}

export default class SearchItem extends Component<Props, {}> {
    render() {
        return (
            <li onClick={this.props.onClick}>
                {this.props.data.name}
            </li>
        )
    }
}