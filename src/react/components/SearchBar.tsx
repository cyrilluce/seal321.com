/**
 * 搜索栏
 * Created by cyrilluce on 2016/8/14.
 */
"use strict";
import * as React from 'react';
import {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom';

interface Props{
    keyword?: string;
    onSearch?: (keyword: string) => void;
}

export default class SearchBar extends Component<Props, {}> {
    render() {
        return (
            <div>
                <input ref="input" type="text" size={50} placeholder="输入物品名称回车搜索" defaultValue={this.props.keyword}
                    onChange={()=>{}}
                />
                <button className="btn_ok" onClick={(e) => this.handleClick(e)}>
                    搜索
                </button>
            </div>
        )
    }

    handleClick(e) {
        const refs = this.refs;
        const node = findDOMNode<HTMLInputElement>(refs['input']);
        const text = node.value.trim();
        this.props.onSearch(text);
    }
}