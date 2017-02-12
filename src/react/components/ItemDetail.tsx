import * as React from 'react';
import { inject, observer } from 'mobx-react';
import * as Draggable from 'react-draggable';
import { getIconStyle } from '../util';
import { Item, ItemType, Job, BattlePetJob } from '../../types';
import { ItemDbStore } from '../../stores';
import * as lang from '../../lang';
import AddLevelTools from './AddLevelTools';
import SetOptionRow from './SetOptionRow';
import ConvertRow from './ConvertRow';

interface Props {
    store?: ItemDbStore
}

/** 玩家总结的是水晶=1PT，但实际上水晶的价值为2 */
const crystalPoint = 2;

@inject('store')
@observer
export default class ItemDetail extends React.Component<Props, {}>{
    private lastPos = {x: 50, y: 50};
    /** 渲染职业需求 */
    private renderJobs(jobs: (Job | BattlePetJob)[], isBattlePet: boolean) {
        if (isBattlePet) {
            return jobs.map(job => lang.BattlePetJobNames[job]);
        }
        if (jobs.some(job => job === Job.ALL)) {
            return '适合所有职业使用';
        }
        jobs = jobs.filter(job => job !== Job.GAME_MASTER);
        if (!jobs.length) {
            return '禁止任何职业使用';
        }
        return jobs.map(job => lang.JobNames[job]).join(' ');
    }
    render() {
        const { store } = this.props;
        const { itemModel } = store;
        if(!itemModel || !itemModel.data){
            return <noscript />;
        }
        const { data: item, addLevel: itemLevel, setOptionModel } = itemModel;
        // 是否为精炼模拟模式
        const addMode = itemLevel > 0;
        // 是否可以精炼，不能精炼的，不显示成长
        const addable = itemModel.maxAddLevel>0;
        const additional = itemModel.additional;
        // return  <Draggable><div>testestset</div></Draggable>;
        return <Draggable handle=".handler" bounds="parent" defaultPosition={this.lastPos} onStop={(e, data)=>{this.lastPos = data;}}>
            <div className="item-popover">
                <img className="item-popover-close glyphicon glyphicon-off" src="/images/close.png" onClick={() => { store.viewItem(null) } } />
                <div className="row handler">
                    <div className="col-xs-12">
                        <p className="text-center"><strong>希尔特国家地理 物品查看 {lang.ServerNames[itemModel.loc]}</strong></p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-2">
                        <div className="icon">
                            <div style={getIconStyle(item.displayid)} />
                        </div>
                    </div>
                    <div className="col-xs-10">
                        <p className="item-popover-name">
                            <strong>{item.name} {addMode && `+${itemModel.addLevel}`}</strong>
                        </p>
                        {itemModel.maxAddLevel > 0 && <AddLevelTools setLevel={level => store.setItemLevel(level)} level={itemLevel} maxLevel={itemModel.maxAddLevel} />}
                        <div className="row no-gutter">
                            <div className="col-xs-5 no-wrap">类别：{lang.ItemTypeNames[item.type] || '未知'}</div>
                            {itemModel.equipable && <div className="col-xs-7 no-wrap">装备位置：{lang.EquipPositionNames[item.posid] || '未知'}</div>}
                        </div>
                    </div>
                </div>
                <div className="row no-gutter item-property">
                    {item.type === ItemType.FOOD && [
                        item.cure_hp !== 0 && <div key="cure_hp" className="col-xs-6 no-wrap">恢复HP {item.cure_hp}</div>,
                        item.cure_ap !== 0 && <div key="cure_ap" className="col-xs-6 no-wrap">恢复AP {item.cure_ap}</div>
                    ]}
                    {item.type !== ItemType.TASK && item.type !== ItemType.CHEST && item.type !== ItemType.CHEST_KEY && item.type !== ItemType.CHEST_VIP && [
                        (item.attack !== 0 || item.attack_step !== 0) && <div key="attack" className="col-xs-6 no-wrap">攻击力 {item.attack + additional.attack}{addable && !addMode && `(${item.attack_step})`}</div>,
                        (item.magic !== 0 || item.magic_step !== 0) && <div key="magic" className="col-xs-6 no-wrap">魔法力 {item.magic + additional.magic}{addable && !addMode && `(${item.magic_step})`}</div>,
                        (item.defense !== 0 || item.defense_step !== 0) && <div key="defense" className="col-xs-6 no-wrap">防御力 {item.defense + additional.defense}{addable && !addMode && `(${item.defense_step})`}</div>,
                        item.attackspeed !== 0 && <div key="attackspeed" className="col-xs-6 no-wrap">攻击速度 {item.attackspeed}</div>,
                        item.critical !== 0 && <div key="critical" className="col-xs-6 no-wrap">必杀技 {item.critical}</div>,
                        item.accuracy !== 0 && <div key="accuracy" className="col-xs-6 no-wrap">命中率 {item.accuracy}</div>,
                        item.evade !== 0 && <div key="evade" className="col-xs-6 no-wrap">回避率 {item.evade}</div>,
                        item.demageinc !== 0 && <div key="demageinc" className="col-xs-6 no-wrap">增加伤害力 {item.demageinc + additional.demageinc}%</div>,
                        item.demagedec !== 0 && <div key="demagedec" className="col-xs-6 no-wrap">减少伤害力 {item.demagedec + additional.demagedec}%</div>,
                        item.movespeed !== 0 && <div key="movespeed" className="col-xs-6 no-wrap">移动速度 {item.movespeed}</div>,
                    ]}

                    {item.type === ItemType.TASK && [
                        item.task_fame !== 0 && <div key="task_fame" className="col-xs-6 no-wrap">获得声望 {item.task_fame}</div>,
                        item.magic !== 0 && <div key="magic" className="col-xs-6 no-wrap">获得经验 {item.magic}</div>,
                        item.task_money !== 0 && <div key="task_money" className="col-xs-6 no-wrap">获得金钱 {item.task_money}</div>,
                    ]}

                    {item.type !== ItemType.FOOD && [
                        item.cure_hp !== 0 && <div key="cure_hp" className="col-xs-6 no-wrap">HP提高 {item.cure_hp}</div>,
                        item.cure_ap !== 0 && <div key="cure_ap" className="col-xs-6 no-wrap">AP提高 {item.cure_ap}</div>,
                    ]}
                </div>



                {(itemModel.equipable || itemModel.usable) && <div className="row no-gutter item-require">
                    {[
                        itemModel.equipable && item.jobid !== 0 && <div key="jobs" className="col-xs-12">{this.renderJobs(itemModel.jobs, item.type === ItemType.BATTLE_PET_EQUIPMENT)}</div>,
                        (item.level !== 0 || item.level_step !== 0) && <div key="level" className="col-xs-12 no-wrap">等級限制 {item.level + additional.level}{addable && !addMode && `(${item.level_step})`}</div>,
                        item.fame !== 0 && <div key="fame" className="col-xs-12 no-wrap">声望限制 {item.fame}</div>,
                        (item.needstrength !== 0 || item.needstrength_step !== 0) && <div key="needstrength" className="col-xs-6 no-wrap">力量 {item.needstrength + additional.needstrength}{addable && !addMode && `(${item.needstrength_step})`}</div>,
                        (item.needagile !== 0 || item.needagile_step !== 0) && <div key="needagile" className="col-xs-6 no-wrap">敏捷 {item.needagile + additional.needagile}{addable && !addMode && `(${item.needagile_step})`}</div>,
                        (item.needwisdom !== 0 || item.needwisdom_step !== 0) && <div key="needwisdom" className="col-xs-6 no-wrap">智力 {item.needwisdom + additional.needwisdom}{addable && !addMode && `(${item.needwisdom_step})`}</div>,
                        (item.needvit !== 0 || item.needvit_step !== 0) && <div key="needvit" className="col-xs-6 no-wrap">体力 {item.needvit + additional.needvit}{addable && !addMode && `(${item.needvit_step})`}</div>,
                        (item.needint !== 0 || item.needint_step !== 0) && <div key="needint" className="col-xs-6 no-wrap">精神 {item.needint + additional.needint}{addable && !addMode && `(${item.needint_step})`}</div>,
                        (item.needluck !== 0 || item.needluck !== 0) && <div key="needluck" className="col-xs-6 no-wrap">感觉 {item.needluck + additional.needluck}{addable && !addMode && `(${item.needluck_step})`}</div>,
                    ]}
                </div>}

                {!itemModel.description && <div className="row">
                    <div className="col-xs-12 item-description">
                        {item.description}
                    </div>
                </div>}
                {itemModel.description && <div className="row">
                    {itemModel.description.properties.map((str, index) => <div key={index} className="col-xs-12 item-require">{str}</div>)}
                    <div className="col-xs-12 item-description">{itemModel.description.description}</div>
                </div>}
                {item.buyprice !== 0 && <div className="row">
                    <div className="col-xs-12 item-description">购买价格 - {item.buyprice + additional.buyprice}s</div>
                </div>}
                {item.sellprice !== 0 && <div className="row">
                    <div className="col-xs-12 item-description">出售价格 - {item.sellprice + additional.sellprice}s</div>
                </div>}
                {item.type === ItemType.ITEM_PET && <div className="row">
                    <div className="col-xs-12 item-description">宠物需求经验 - {item.petpoint + additional.petpoint}</div>
                </div>}
                {item.type !== ItemType.ITEM_PET && item.petpoint !== 0 && <div className="row">
                    <div className="col-xs-12 item-description">喂养值 - {item.petpoint}</div>
                </div>}

                {setOptionModel && !addMode && <SetOptionRow model={setOptionModel} />}
                
                {item.type === ItemType.GEM && <div className="row">
                    <div className="col-xs-12 item-description">PT - {item.pt / crystalPoint}</div>
                </div>}
                {item.type !== ItemType.GEM && itemModel.gAssistable && <div className="row no-gutter">
                    {addMode && <div className="col-xs-12 item-description">{itemLevel in itemModel.ptTable ? `PT - ${itemModel.ptTable[itemLevel] / crystalPoint}` : `（精炼等级不足，无法作为G辅助材料）`}</div>}
                    {!addMode && <div className="col-xs-12 item-pt-table">
                        <span>各等級PT值表</span>
                        {this.renderPtTable(itemModel.ptTable, false)}
                    </div>}
                </div>}
                {itemModel.equipable && (item.g_item !== 0 || item.t_item !== 0 || item.s_item !== 0 || item.c_item !== 0) && <div className="row no-gutter">
                    {addMode && <div className="col-xs-12 item-description">{itemLevel in itemModel.ptNeedTable ? `G化所需PT - ${Math.round(itemModel.ptNeedTable[itemLevel] * 100 / crystalPoint) / 100}` : `（精炼等级不足，无法G化）`}</div>}
                    {!addMode && <div className="col-xs-12 item-pt-table">
                        <span>各等級G化所需PT值表</span>
                        {this.renderPtTable(itemModel.ptNeedTable, true)}
                    </div>}
                </div>}

                <ConvertRow name="G化产物" model={itemModel.gItem} />
                <ConvertRow name="命中强化产物" model={itemModel.tItem} />
                <ConvertRow name="攻速强化产物" model={itemModel.sItem} />
                <ConvertRow name="必杀强化产物" model={itemModel.cItem} />
            </div>
        </Draggable>
    }
    private renderPtTable(ptTable: { [level: number]: number }, isNeedTable: boolean) {
        const levels = isNeedTable ? [7, 8, 9, 10, 11, 12] : [5, 6, 7, 8, 9, 10, 11, 12];
        return <table>
            <tbody>
                <tr>
                    <td>等級</td>
                    {levels.map(level => <td key={level}>{level}</td>)}
                </tr>
                <tr>
                    <td>{isNeedTable ? '需PT' : 'PT值'}</td>
                    {levels.map(level => <td key={level}>{Math.round(ptTable[level] / crystalPoint * 100) / 100}</td>)}
                </tr>
            </tbody>
        </table>
    }
}