/**
 * 列表
 * Created by cyrilluce on 2016/8/14.
 */
"use strict";

import * as React from 'react';
import {Component, PropTypes} from 'react'
import SearchItem from './SearchItem'

interface Props{
    searching: boolean;
    list: Item[];
    onItemClick?: (...any)=>void;
}

export default class SearchList extends Component<Props, {}> {
    render() {
        let content;
        if(this.props.searching){
            content = '搜索中...';
        }else{
            content = this.props.list.map((data, index) =>
                <SearchItem data={data}
                            key={index}
                            onClick={() => this.props.onItemClick(index)} />
            );
        }
        return (
            <ul>{content}</ul>
        )
    }
}