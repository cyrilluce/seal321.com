/**
 * 搜索栏
 * Created by cyrilluce on 2016/8/14.
 */
"use strict";
import React from 'react';
import { Component, PropTypes } from 'react'
import { inject, observer } from 'mobx-react';
import { ItemDbStore } from '../../stores';
import { findDOMNode } from 'react-dom';
import { dbs, ServerId } from '../../config';
import { ServerNames, HumanizeTypeNames } from '../../lang'
import classnames from 'classnames';
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
                <div className="col-md-6 col-sm-9 col-xs-12">
                    <div className="input-group">
                        <Dropdown className="input-group-btn">
                            <button type="button" className="btn btn-default dropdown-toggle">
                                {ServerNames[store.loc]}<span className="caret"></span>
                            </button>
                            <ul className="dropdown-menu">
                                {Object.keys(dbs).map(loc=>
                                    <li key={loc}><a href="javascript:;" onClick={()=>store.changeServer(loc as ServerId)}>{ServerNames[loc]}</a></li>)}
                            </ul>
                        </Dropdown>
                        <input ref="input" type="text" className="form-control" size={50} placeholder="输入物品名称后回车搜索" defaultValue={store.keyword} aria-describedby="basic-addon1"
                            onChange={() => { } } onKeyUp={this.handleEnter.bind(this)}
                            />
                        <Dropdown className="input-group-btn">
                            <button data-toggle type="button" className="btn btn-default dropdown-toggle">
                                <span className="glyphicon glyphicon-filter" aria-hidden="true"></span>
                                <span className="hidden-xs">
                                    {HumanizeTypeNames[store.type]}<span className="caret"></span>
                                </span>
                            </button>
                            <ul className="dropdown-menu">
                                {Object.keys(HumanizeTypeNames).map(type=>
                                    <li key={type}><a href="javascript:;" onClick={()=>store.setType(+type)}>{HumanizeTypeNames[type]}</a></li>)}
                            </ul>
                            <button className="btn btn-default" type="button" onClick={e=>{e.stopPropagation();this.doSearch()}}>
                                <span className="glyphicon glyphicon-search" aria-hidden="true"></span> <span className="hidden-xs">搜索</span>
                            </button>
                            <button className={classnames("btn btn-default", {active: store.gSimulateVisible})} type="button" onClick={()=>{store.setGSimulateVisiblility()}}>
                                <span className="glyphicon glyphicon-wrench" aria-hidden="true"></span> <span className="hidden-xs">制作模拟</span>
                            </button>
                        </Dropdown>
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