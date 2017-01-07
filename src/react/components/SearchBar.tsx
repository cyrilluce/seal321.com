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
                    onChange={()=>{}} onKeyUp={this.handleEnter.bind(this)}
                />
                <button className="btn_ok" onClick={this.doSearch.bind(this)}>
                    搜索
                </button>
            </div>
        )
    }

    handleEnter(e: KeyboardEvent){
        if(e.which === 13){
            this.doSearch();
        }
    }

    doSearch() {
        const refs = this.refs;
        const node = findDOMNode<HTMLInputElement>(refs['input']);
        const text = node.value.trim();
        this.props.onSearch(text);
    }
}