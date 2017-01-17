import * as React from 'react';
import * as classnames from 'classnames';

export interface Props {
    className?: string;
}
export interface State {
    expanded?: boolean;
}
export default class Dropdown<TProps extends Props> extends React.Component<TProps, State>{
    /** document click监听 */
    private handler: () => void;
    private expanding: boolean;
    componentWillMount() {
        if (!global.IS_BROWSER) {
            return
        }
        this.handler = this.handleOuterClick.bind(this);
        document.addEventListener('click', this.handler, false);
    }
    componentWillUnmount() {
        if (!global.IS_BROWSER) {
            return
        }
        document.removeEventListener('click', this.handler, false);
    }
    handleOuterClick(e: MouseEvent) {
        if (!this.expanding) {
            this.setState({ expanded: false });
        }
    }
    protected expand() {
        if(this.state && this.state.expanded){
            return;
        }
        this.expanding = true;
        this.setState({ expanded: true });
        setTimeout(() => {
            this.expanding = false;
        }, 0);
    }
    render() {
        const state = this.state || {};
        const {expanded} = state;
        return <div onClick={()=>this.expand()} className={classnames(this.props.className, { open: expanded })} role="group">
            {this.props.children}
        </div>;
    }
}