import * as React from 'react';
import { observer } from 'mobx-react'
import { DragSource, DragSourceMonitor } from 'react-dnd';
import { getIconStyle } from '../util';
import { Item as ItemModel } from '../../models'
import { Item as IItem, SetOption, TYPE } from '../../types'
import * as classnames from 'classnames';

interface Props {
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
	beginDrag(props: Props) {
		return props.data;
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