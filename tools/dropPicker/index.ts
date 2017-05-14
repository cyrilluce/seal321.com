/**
 * 马服泄漏服务端的掉落提取脚本，生成到： sampleDir/rel_drop.json中
 */
import { readFile, writeFile } from 'mz/fs';
import { join as pathJoin } from 'path';
import { Relation } from '../../src/types';
import { samplesDir } from '../config';

/** drop_?.scr中的行数据定义 */
interface DropItem{
    /** 物品ID */
    id: number;
    rate: number;
}
interface DropList{
    /** 编号 */
    id: number;
    /** 掉落列表 */
    drops: DropItem[];
}

/** 活动物品，排除 */
const tmpActItems = {
    5192 : 1,
    11462 : 1
}

/**
 * @param serverPath 服务端的路径，用到的文件会在 scripts/drop_1.scr
 */
export default async function pickup(serverPath: string): Promise<Relation[]>{
    let relations: Relation[] = [];
    // 解析3个文件
    const lists = await Promise.all([
        'drop_1.scr',
        'drop_2.scr',
        'drop_3.scr'
    ].map(async file=>{
        return parseDrop(await readFile(pathJoin(serverPath, 'scripts', file)));
    }));

    // 合并概率
    let list: DropList[] = [];
    for(let i=0; i<lists[0].length; i++){
        let map: {[id:number]:number} = {};
        lists.forEach(list=>{
            list[i].drops.forEach(drop=>{
                // 如果该物品已经有了，则累加概率
                if(drop.id in map){
                    map[drop.id] += drop.rate;
                }else{
                    map[drop.id] = drop.rate;
                }
            })
        });
        list.push({
            id: i,
            drops: Object.keys(map).
                map(id=>parseInt(id, 10)).
                map(id=>({id, rate: map[id]}))
        })
    }

    // 转换为relation格式
    list.map(dropList=>{
        dropList.drops.forEach(dropItem=>{
            if(dropItem.id<=0 || (dropItem.id in tmpActItems)){
                // 无效数据或活动物品，无视
                return;
            }
            // 概率为零，无视
            if(dropItem.rate<=0){
                return;
            }
            relations.push({
                a: dropList.id,
                b: dropItem.id,
                value: dropItem.rate,
                desc: ''
            })
        })
    })

    return relations;
}

/**
 * 解析scr文件，输出行列表
 */
type Line = string[];
type ScrData = Line[];
async function parseScr(data: Buffer): Promise<ScrData>{
    const content = data.toString();
    const rawLines = content.split(/\r?\n/);
    const count = parseInt(rawLines[0], 10) || 0;
    const lines = rawLines.slice(1);

    let output: ScrData = lines.filter(line=>line).map(line=>{
        // 行数据形如： 0|0|0|0|
        let lineData: Line = line.split('|');
        // 去掉最后一个“|”的影响
        if(!lineData[lineData.length-1]){
            lineData.pop();
        }
        return lineData
    });

    if(output.length !== count){
        throw new Error(`scr文件解析有误，行数不符，预期 ${count}，实际 ${output.length}`)
    }

    return output;
}

/**
 * 解析drop.scr
 */
async function parseDrop(scrData: Buffer): Promise<DropList[]>{
    const data = await parseScr(scrData);
    
    return data.map((line, index)=>{
        let drops: DropItem[] = [];
        let lastRate = 0;
        for(let i=0; i<line.length; i+=2){
            const id = parseInt(line[i], 10);
            const rawRate = parseInt(line[i+1], 10);
            drops.push({
                id,
                rate: rawRate - lastRate
            })
            lastRate = rawRate;
        }
        return {
            id: index,
            drops
        };
    })
}


if(require.main === module){
    const args = require('minimist')(process.argv.slice(2));

    pickup(args._[0] || 'F:\\seal server').
        then(list=>writeFile(pathJoin(samplesDir, 'rel_drop.json'), JSON.stringify(list, null, '\t'))).
        then(() => {
            console.log('-------- 提取完成 ---------');
        }, err => {
            console.log('-------- 提取失败！ ---------', err);
        });
}



