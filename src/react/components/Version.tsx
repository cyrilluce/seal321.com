/**
 * 搜索栏
 * Created by cyrilluce on 2016/8/14.
 */
"use strict";
import * as React from 'react';
import { Component, PropTypes } from 'react'
import { inject, observer } from 'mobx-react';
import { Version as VersionModel } from '../../models';
import { dbs, ServerId } from '../../config';
import * as classnames from 'classnames';

interface Props {
    version: VersionModel;
}

@observer
export default class Version extends Component<Props, {}> {
    render() {
        const {version} = this.props;
        const newest = version.newest;
        return (
            <span className="label label-success version">
                {newest.version ? `当前版本：${newest.version}
最后更新：${newest.time.toISOString().slice(0, 10)}` : `版本信息加载中...`}
            </span>
        )
    }
}