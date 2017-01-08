import * as React from "react";

const xSize = 16, ySize = 16, iconWidth = 32, iconHeight = 32;
/**
 * 获取物品图标样式
 * @param iconIndex 图标ID
 */
export function getIconStyle(iconIndex: number): React.CSSProperties{
    // 一排多少个
    // 多少排
    // 256个一张图，从1到16等
    let rest = iconIndex;
    const x = rest % xSize; // 低16位数字
    rest = (rest - x) / xSize; // 向低位移16位，继续计算下一段

    const y = rest % ySize;
    rest = (rest-y) / ySize;
    const imageIndex = rest;

    return {
        width: "32px",
        height: "32px",
        // display: "inline-block",
        backgroundImage: `url(/images/items/itemicon${imageIndex+1}.png)`,
        backgroundPosition: `${-x*iconWidth}px ${-y*iconHeight}px`
    };
}