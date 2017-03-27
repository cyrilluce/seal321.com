import * as React from "react";

const xSize = 16, ySize = 16, iconWidth = 32, iconHeight = 32;
/*
https://cloudinary.com/console/media_library

JSON.stringify($('[data-actions-permissions]').toArray()
    .map(el => JSON.parse($(el).attr('data-info')))
    .filter(o=>{ 
        if(!/^itemicon\d+/.test(o.public_id)){
            return;
        }
        o.order = parseInt(o.public_id.slice(8));
        return true;
    })
    .sort((a, b) => a.order-b.order).map(o => o.url.slice(5)), null, '\t')
    
*/
/** 使用外部cdn加速 */
const itemIconUrls: string[] = [
	"//res.cloudinary.com/cyrilluce/image/upload/v1490620125/itemicon1.png",
	"//res.cloudinary.com/cyrilluce/image/upload/v1490620128/itemicon2.png",
	"//res.cloudinary.com/cyrilluce/image/upload/v1490620127/itemicon3.png",
	"//res.cloudinary.com/cyrilluce/image/upload/v1490620127/itemicon4.png",
	"//res.cloudinary.com/cyrilluce/image/upload/v1490620128/itemicon5.png",
	"//res.cloudinary.com/cyrilluce/image/upload/v1490620128/itemicon6.png",
	"//res.cloudinary.com/cyrilluce/image/upload/v1490620130/itemicon7.png",
	"//res.cloudinary.com/cyrilluce/image/upload/v1490620130/itemicon8.png",
	"//res.cloudinary.com/cyrilluce/image/upload/v1490620130/itemicon9.png",
	"//res.cloudinary.com/cyrilluce/image/upload/v1490620131/itemicon10.png",
	"//res.cloudinary.com/cyrilluce/image/upload/v1490620125/itemicon11.png",
	"//res.cloudinary.com/cyrilluce/image/upload/v1490620125/itemicon12.png",
	"//res.cloudinary.com/cyrilluce/image/upload/v1490620125/itemicon13.png",
	"//res.cloudinary.com/cyrilluce/image/upload/v1490620126/itemicon14.png",
	"//res.cloudinary.com/cyrilluce/image/upload/v1490620126/itemicon15.png",
	"//res.cloudinary.com/cyrilluce/image/upload/v1490620123/itemicon16.png"
]
/**
 * 获取物品图标样式
 * @param iconIndex 图标ID
 */
export function getIconStyle(iconIndex: number): React.CSSProperties {
    // 一排多少个
    // 多少排
    // 256个一张图，从1到16等
    let rest = iconIndex;
    const x = rest % xSize; // 低16位数字
    rest = (rest - x) / xSize; // 向低位移16位，继续计算下一段

    const y = rest % ySize;
    rest = (rest - y) / ySize;
    const imageIndex = rest;
    const url = itemIconUrls[imageIndex] || `/images/items/itemicon${imageIndex + 1}.png`;

    return {
        width: "32px",
        height: "32px",
        // display: "inline-block",
        backgroundImage: `url(${url})`,
        backgroundPosition: `${-x * iconWidth}px ${-y * iconHeight}px`
    };
}