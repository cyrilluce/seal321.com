/**
 * 搜索栏
 * Created by cyrilluce on 2016/8/14.
 */
"use strict";
import * as React from 'react';
import { Component, PropTypes } from 'react'
import { inject, observer } from 'mobx-react';
import { ItemDbStore } from '../../stores';
import { findDOMNode } from 'react-dom';
import { dbs, ServerId } from '../../config';
import { ServerNames } from '../../lang'
import Dropdown from './Dropdown';

interface Props {
    store?: ItemDbStore;
}

@inject('store')
@observer
export default class SearchBar extends Component<Props, {}> {
    render() {
        const {store} = this.props;
        return (
            <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-9 col-xs-12">
                    <div className="input-group">
                        <Dropdown className="input-group-btn">
                            <button type="button" className="btn btn-default dropdown-toggle">
                                {ServerNames[store.loc]}数据库<span className="caret"></span>
                            </button>
                            <ul className="dropdown-menu">
                                {Object.keys(dbs).map(loc=>
                                    <li key={loc}><a href="javascript:;" onClick={()=>store.changeServer(loc as ServerId)}>{ServerNames[loc]}</a></li>)}
                            </ul>
                        </Dropdown>
                        <input ref="input" type="text" className="form-control" size={50} placeholder="输入物品名称后回车搜索" defaultValue={store.keyword} aria-describedby="basic-addon1"
                            onChange={() => { } } onKeyUp={this.handleEnter.bind(this)}
                            />
                        <span className="input-group-btn">
                            <button className="btn btn-default" type="button" onClick={this.doSearch.bind(this)}>
                                <span className="glyphicon glyphicon-search" aria-hidden="true"></span> 搜索
                            </button>
                        </span>
                    </div>
                </div>

            </div>
        )
    }

    handleEnter(e: KeyboardEvent) {
        if (e.which === 13) {
            this.doSearch();
        }
    }

    doSearch() {
        const refs = this.refs;
        const node = findDOMNode<HTMLInputElement>(refs['input']);
        const text = node.value.trim();
        this.props.store.search(text);
    }
}