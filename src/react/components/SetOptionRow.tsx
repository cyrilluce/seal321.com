import * as React from 'react';
import { observer } from 'mobx-react'
import { SetOptions, SetOptionModel } from '../../models'
import { SetOption } from '../../types'

interface Props {
    /** 套装属性 */
    model: SetOptionModel;
}

interface State {
    count?: number;
}

@observer
export default class SetOptionRow extends React.Component<Props, State>{
    render() {
        const { model } = this.props;
        const setOptions = model.data;
        if (model.err) {
            return <div className="row no-gutter item-setopt">
                <div className="col-xs-12">{model.err.message}</div>
            </div>;
        }
        if (!setOptions || model.loading) {
            return <div className="row no-gutter item-setopt">
                <div className="col-xs-12">套装属性加载中</div>
            </div>;
        }

        // 套装激活的件数
        const counts = Object.keys(setOptions).map(level => parseInt(level, 10)).sort();
        const state = this.state || {};
        let count = state.count;
        // 默认显示最后的
        if (!count) {
            count = counts[counts.length - 1];
            this.setState({ count });
        }
        const setOption: SetOption = setOptions[count];

        return <div className="row no-gutter item-setopt">
                <div className="col-xs-12">套装属性（{count}件）</div>
                {setOption.attack !== 0 && <div className="col-xs-6">攻击 {setOption.attack}</div>}
                {setOption.magic !== 0 && <div className="col-xs-6">魔法 {setOption.magic}</div>}
                {setOption.defense !== 0 && <div className="col-xs-6">防御 {setOption.defense}</div>}
                {setOption.attackspeed !== 0 && <div className="col-xs-6">攻速 {setOption.attackspeed}</div>}
                {setOption.accuracy !== 0 && <div className="col-xs-6">命中 {setOption.accuracy}</div>}
                {setOption.critical !== 0 && <div className="col-xs-6">必杀 {setOption.critical}</div>}

                {setOption.evade !== 0 && <div className="col-xs-6">回避 {setOption.evade}</div>}
                {setOption.movespeed !== 0 && <div className="col-xs-6">移动速度 +{setOption.movespeed}</div>}
                {setOption.hp !== 0 && <div className="col-xs-6">HP +{setOption.hp}%</div>}
                {setOption.ap !== 0 && <div className="col-xs-6">AP +{setOption.ap}%</div>}
            </div>
    }
}