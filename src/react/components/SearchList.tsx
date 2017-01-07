/**
 * 列表
 * Created by cyrilluce on 2016/8/14.
 */
"use strict";

import * as React from 'react';
import { Component, PropTypes } from 'react'
import { inject, observer } from 'mobx-react';
import ItemDbStore from '../../stores/db';
import SearchItem from './SearchItem'

interface Props {
    store?: ItemDbStore,
    onItemClick?: (...any) => void;
}

@inject('store')
@observer
export default class SearchList extends Component<Props, {}> {
    onItemClick(index: number) {
        if (this.props.onItemClick) {
            this.props.onItemClick(index);
        }
    }
    render() {
        const {onItemClick, store} = this.props;
        let content, message;
        if (store.searching) {
            message = '搜索中...';
        } else if (!store.list.length) {
            message = store.keyword ? `未查到匹配“${store.keyword}”的物品` : '请输入关键字开始搜索物品';
        } else {
            content = store.list.map((data, index) =>
                <SearchItem data={data}
                    key={index}
                    onClick={this.onItemClick.bind(this)} />
            );
        }
        return (
            <table>
                <thead>
                    <tr>
                        <th width="40"></th>
                        <th width="200">名称</th>
                        <th width="100">类别</th>
                        <th width="100">等级</th>
                        <th>描述</th>
                    </tr>
                </thead>
                <tbody>
                    {message && <tr><td colSpan={5}>{message}</td></tr>}
                    {content}
                </tbody>
            </table>
        )
    }
}