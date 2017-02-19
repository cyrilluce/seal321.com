import * as React from 'react';
import { observer } from 'mobx-react'
import { getIconStyle } from '../util';
import { Item as ItemModel } from '../../models'
import { Item as IItem, SetOption, TYPE } from '../../types'
import * as classnames from 'classnames';
import { DropTarget, DropTargetMonitor, DropTargetConnector } from 'react-dnd';
import Item from './Item';


interface Props {
    /** 放置的物品 */
    data?: IItem;
    disabled?: boolean;
    canAccept: (item: IItem)=>boolean;
    accept: (item: IItem)=>void;
    connectDropTarget?: (...any) => any;
    isOver?: boolean;
    canDrop?: boolean;
}

interface State {
}

const itemTarget = {
    canDrop(props: Props, monitor: DropTargetMonitor): boolean {
        return !props.disabled && props.canAccept(monitor.getItem() as IItem);
    },
    drop(props: Props, monitor: DropTargetMonitor): void {
        props.accept(monitor.getItem() as IItem);
    }
};

function collect(connect: DropTargetConnector, monitor: DropTargetMonitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    };
}

@DropTarget(TYPE.ITEM, itemTarget, collect)
@observer
export default class ItemSlot extends React.Component<Props, State>{
    render() {
        const { data, connectDropTarget, isOver, disabled, canDrop } = this.props;

        return connectDropTarget(<div className={classnames("item-slot", {disabled: disabled, accept: isOver && canDrop, reject: isOver && !canDrop})}>
            {data && <Item data={data} />}
        </div>);
    }
}