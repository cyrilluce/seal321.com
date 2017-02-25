/**
 * 列表
 * Created by cyrilluce on 2016/8/14.
 */
"use strict";

import * as React from 'react';
import { Component, PropTypes } from 'react'
import { inject, observer } from 'mobx-react';
import {ItemDbStore} from '../../stores';
import SearchItem from './SearchItem'
import * as classnames from 'classnames';

interface Props {
    store?: ItemDbStore,
    onItemClick?: (...any) => void;
}

@inject('store')
@observer
export default class SearchList extends Component<Props, {}> {
    onItemClick(index: number) {
        const {onItemClick, store} = this.props;
        if (onItemClick) {
            onItemClick(store.data.list[index]);
        }
    }
    render() {
        const {onItemClick, store} = this.props;
        let content, message: string, cls: string;
        
        if (store.dataLoading) {
            //message = '搜索中...';
        } else if(store.err){
            message = store.err.message;
            cls = "alert alert-danger";
        }else if (!store.data) {
            message = store.keyword ? `未查到匹配“${store.keyword}”的物品` : '请输入关键字开始搜索物品';
        } else if(!store.data.list.length) {
            message = '此页无数据'
        }

        content = store.data && store.data.list.map((data, index) =>
            <SearchItem data={data}
                key={index}
                onClick={this.onItemClick.bind(this, index)} />
        );

        return (
            <table className="item-list table table-striped table-condensed table-hover">
                <colgroup>
                    <col style={{minWidth:"40px", width:"5%"}} />
                    <col style={{minWidth:"260px", width:"20%"}} />
                    <col style={{minWidth:"100px", width:"15%"}} />
                    <col style={{minWidth:"100px", width:"10%"}} />
                    <col style={{maxWidth:"300px", width:"50%"}} />
                </colgroup>
                <thead>
                    <tr>
                        <th></th>
                        <th>名称</th>
                        <th>类别</th>
                        <th>等级</th>
                        <th>描述</th>
                    </tr>
                </thead>
                <tbody>
                    {message && <tr className="active"><td colSpan={5}><p className={classnames("text-center", cls)}>{message}</p></td></tr>}
                    {content}
                </tbody>
            </table>
        )
    }
}