import * as React from 'react';
// import {findDOMNode} from 'react-dom';
import * as classnames from 'classnames';

interface Props {
    setLevel: (level: number) => void;
    level: number;
    maxLevel?: number;
}

interface State {
    expanded?: boolean;
}

export default class AddLevelTools extends React.Component<Props, State>{
    /** document click监听 */
    private handler: ()=>void;
    private expanding: boolean;
    componentWillMount(){
        this.handler = this.handleOuterClick.bind(this);
        document.addEventListener('click', this.handler, false);
    }
    componentWillUnmount(){
        document.removeEventListener('click', this.handler, false);
    }
    handleOuterClick(e: MouseEvent){
        if(!this.expanding){
            this.setState({expanded: false});
        }
        // const refs = this.refs;
        // const node = findDOMNode<HTMLDivElement>(refs['dropdown']);
        // // dropdown内点击的不算
        // if(e.target){

        // }
    }
    setLevel(level){
        const {setLevel} = this.props;
        setLevel(level);
        this.setState({expanded: false});
    }
    private expand(){
        this.expanding = true;
        this.setState({expanded: true});
        setTimeout(()=>{
            this.expanding = false;
        }, 0);
    }
    render() {
        const { level, maxLevel = 12 } = this.props;
        const state = this.state || {};
        const {expanded} = state;
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
            <div className={classnames("btn-group btn-group-xs", { open: expanded })} ref="dropdown" role="group">
                <button type="button" className="btn btn-default dropdown-toggle" onClick={()=>{this.expand()}}>
                    <span className="caret"></span>
                </button>
                <ul className="dropdown-menu">
                    {levels.map(level=><li key={level}><a href="javascript:;" onClick={() => { this.setLevel(level) }}>{level && `+${level}`}</a></li>)}
                </ul>
            </div>
        </div>;
    }
}