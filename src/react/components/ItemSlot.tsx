import * as React from "react";
import { observer } from "mobx-react";
import { getIconStyle } from "../util";
import { Item as ItemModel } from "../../models";
import {
  Item as IItem,
  ItemInstance as IItemInstance,
  SetOption,
  TYPE
} from "../../types";
import * as classnames from "classnames";
import { DropTarget, DropTargetMonitor, DropTargetConnector } from "react-dnd";
import ItemInstance from "./ItemInstance";

interface Props {
  /** 放置的物品 */
  data?: ItemModel;
  onRightClick?: (item: IItem) => void;
  disabled?: boolean;
  canAccept: (item: IItemInstance) => boolean;
  accept: (item: IItemInstance) => void;
  connectDropTarget?: (...any) => any;
  isOver?: boolean;
  canDrop?: boolean;
  className?: string;
  title?: string;
  onDragAway?: () => void;
  /** 快速选择 */
  quickSelect?: () => void;
}

interface State {}

const itemTarget = {
  canDrop(props: Props, monitor: DropTargetMonitor): boolean {
    const itemInstance = monitor.getItem() as IItemInstance;
    return !props.disabled && props.canAccept(itemInstance);
  },
  drop(props: Props, monitor: DropTargetMonitor): IItemInstance {
    const itemInstance = monitor.getItem() as IItemInstance;
    const cur = props.data.plain;
    // 原地移动，无视
    if (
      cur &&
      itemInstance.loc === cur.loc &&
      itemInstance.data === cur.data &&
      itemInstance.addLevel === cur.addLevel
    ) {
      return itemInstance;
    }
    props.accept(itemInstance);
    return cur || undefined;
  }
};

function collect(connect: DropTargetConnector, monitor: DropTargetMonitor) {
  const isOver = monitor.isOver();
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: isOver && monitor.canDrop()
  };
}

@DropTarget([TYPE.ITEM, TYPE.ITEM_INSTANCE], itemTarget, collect)
@observer
export default class ItemSlot extends React.Component<Props, State> {
  render() {
    const {
      data,
      onRightClick,
      onDragAway,
      accept,
      connectDropTarget,
      isOver,
      disabled,
      canDrop,
      className,
      title,
      quickSelect,
      children
    } = this.props;

    return connectDropTarget(
      <div
        title={title}
        className={classnames("item-slot", className, {
          disabled: disabled,
          accept: isOver && canDrop,
          reject: isOver && !canDrop
        })}
        onClick={quickSelect}
      >
        {!disabled && !data.data && quickSelect && <div className="glyphicon glyphicon-plus quick-select" title="点击快速选择" />}
        {data.data &&
          <ItemInstance
            disabled={disabled}
            data={data}
            onRightClick={onRightClick}
            onSwitch={accept}
            onDragAway={onDragAway}
          />}
        {children}
      </div>
    );
  }
}
