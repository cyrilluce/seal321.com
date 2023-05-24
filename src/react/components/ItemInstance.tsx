import React from 'react';
import { observer } from 'mobx-react'
import { DragSource, DragSourceMonitor } from 'react-dnd';
import { getIconStyle } from '../util';
import { Item as ItemModel } from '../../models'
import { Item as IItem, ItemInstance as IItemInstance, SetOption, TYPE } from '../../types'
import classnames from 'classnames';

interface Props {
	/** 物品 */
	data: ItemModel;
	/** 不允许修改 */
	disabled?: boolean;
	connectDragSource?: (...any) => any;
	isDragging?: boolean;
	onRightClick?: (item: IItem) => void;
	onDragAway?: () => void;
	onSwitch?: (item: IItemInstance) => void;
}

interface State {
}
const itemSource = {
	beginDrag(props: Props): IItemInstance {
		const itemModel = props.data;

		// if(props.onDragAway){
		//   props.onDragAway();
		// }

		return itemModel.plain;
	},
	endDrag(props: Props, monitor: DragSourceMonitor) {
		// 如果已经放置了，有以下情况
		const begin = monitor.getItem();
		const onDragAway = props.onDragAway || (()=>{});

		if (monitor.didDrop()) {
			const result = monitor.getDropResult() as IItemInstance;
			if (result) { 
				if (result === begin) { // 1. 原地放置，啥也不干
					
				} else if (props.onSwitch) { // 3. 放到其它非空slot，有返回原结果，表示交换
					props.onSwitch(result);
				}else{
					onDragAway()
				}
			} else { // 2. 放到其它空slot了
				onDragAway()
			}
		} else {
			// 如果没放置，则表明是丢开了，直接清空
			onDragAway()
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
export default class ItemInstance extends React.Component<Props, State>{
	render() {
		const { data: item, disabled, connectDragSource, isDragging, onRightClick } = this.props;
		let handler: (...any) => any;
		if (onRightClick) {
			handler = (e: React.MouseEvent<HTMLDivElement>) => {
				onRightClick(item.data);
				e.preventDefault();
			}
		}

		const element = <div onContextMenu={handler} className={classnames("item-prototype", { disabled })} style={getIconStyle(item.data.displayid)}></div>;
		return disabled ? element : connectDragSource(element);
		// return connectDragSource(element);
	}
}