import * as React from 'react';
import { observer } from 'mobx-react'
import { DragSource } from 'react-dnd';
import { getIconStyle } from '../util';
import { Item as ItemModel } from '../../models'
import { Item as IItem, SetOption, TYPE } from '../../types'
import * as classnames from 'classnames';

interface Props {
    /** 物品 */
    data: IItem;
    connectDragSource?: (...any)=>any;
    isDragging?: boolean;
}

interface State {
}
const itemSource = {
  beginDrag(props: Props) {
    return props.data;
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

@DragSource(TYPE.ITEM, itemSource, collect)
@observer
export default class Item extends React.Component<Props, State>{
    render() {
        const { data : item, connectDragSource, isDragging } = this.props;

        return connectDragSource(<div className="item-prototype" style={getIconStyle(item.displayid)}></div>);
    }
}