import * as React from 'react';
// import {findDOMNode} from 'react-dom';
import * as classnames from 'classnames';
import Dropdown, {Props as DropdownProps} from './Dropdown'

interface Props{
    setLevel: (level: number) => void;
    level: number;
    maxLevel?: number;
}

export default class AddLevelTools extends React.Component<Props, {}>{
     setLevel(level){
        const {setLevel} = this.props;
        setLevel(level);
        this.setState({expanded: false});
    }
   
    render() {
        const { level, maxLevel = 12 } = this.props;
        let levels = [], i;
        for(i=0; i<=maxLevel;i++){
            levels.push(i);
        }
        return <div className="btn-group btn-group-xs add-level-tools">
            <button type="button" className="btn btn-default" onClick={() => { this.setLevel(Math.min(maxLevel, level + 1)) } }>
                <span className="glyphicon glyphicon-plus" > </span>
            </button>
            <button type="button" className="btn btn-default" onClick={() => { this.setLevel(Math.min(maxLevel, level - 1)) } }>
                <span className="glyphicon glyphicon-minus" > </span>
            </button>
            <Dropdown className="btn-group btn-group-xs">
                <button type="button" className="btn btn-default dropdown-toggle">
                    <span className="caret"></span>
                </button>
                <ul className="dropdown-menu">
                    {levels.map(level=><li key={level}><a href="javascript:;" onClick={() => { this.setLevel(level) }}>{level && `+${level}`}</a></li>)}
                </ul>
            </Dropdown>
        </div>;
    }
}