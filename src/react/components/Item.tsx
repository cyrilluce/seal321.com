import React from 'react';
import { observer } from 'mobx-react'
import { DragSource, DragSourceMonitor } from 'react-dnd';
import { getIconStyle } from '../util';
import { ServerId } from '../../config';
import { Item as ItemModel } from '../../models'
import { Item as IItem, ItemInstance, SetOption, TYPE } from '../../types'
import classnames from 'classnames';

interface Props {
	/** 服务器 */
	loc: ServerId;
	/** 物品 */
	data: IItem;
	connectDragSource?: (...any) => any;
	isDragging?: boolean;
	onRightClick?: (item: IItem) => void;
  onDragAway?: ()=>void;
}

interface State {
}
const itemSource = {
	beginDrag(props: Props): ItemInstance {
		return {
			loc: props.loc,
			data : props.data,
			addLevel: 0
		};
	},
  endDrag(props: Props, monitor: DragSourceMonitor){
    if(props.onDragAway && monitor.didDrop()){
      props.onDragAway();
    }
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
		const { data: item, connectDragSource, isDragging, onRightClick } = this.props;
		let handler: (...any) => any;
		if (onRightClick) {
			handler = (e: React.MouseEvent<HTMLDivElement>) => {
				onRightClick(item);
        e.preventDefault();
			}
		}

		return connectDragSource(<div onContextMenu={handler} className="item-prototype" style={getIconStyle(item.displayid)}></div>);
	}
}