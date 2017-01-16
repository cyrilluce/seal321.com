import * as React from 'react';
import { observer, inject } from 'mobx-react'
import { Item as ItemModel } from '../../models'
import { SetOption } from '../../types'
import { ItemDbStore } from '../../stores'
import * as classnames from 'classnames';

interface Props {
    /** 转换后的物品 */
    model: ItemModel;
    /** 转换方式 */
    name: string;
    store?: ItemDbStore;
}

@inject('store')
@observer
export default class ConvertRow extends React.Component<Props, {}>{
    render() {
        const { store, model, name } = this.props;
        const item = model.data;
        if (!model.id) {
            return <noscript />
        }
        if (model.loading || !item) {
            return <div className="row no-gutter item-convert">
                <div className="col-xs-12">{name}加载中</div>
            </div>;
        }
        if (model.err) {
            return <div className="row no-gutter item-convert">
                <div className="col-xs-12">{model.err.message}</div>
            </div>;
        }
        return <div className="row no-gutter item-convert">
            <div className="col-xs-12">
                {name}: <a href={`?id=${item.id}`} onClick={e => { store.viewItem(item, store.itemModel.addLevel); e.preventDefault(); } }>{item.name}</a>
            </div>
        </div>
    }
}