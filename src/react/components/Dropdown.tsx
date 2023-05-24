import React from 'react';
import classnames from 'classnames';
import onClickOutside from "react-onclickoutside/decorator";

export interface Props {
    className?: string;
}
export interface State {
    expanded?: boolean;
}
@onClickOutside
export default class Dropdown<TProps extends Props> extends React.Component<TProps, State>{
    handleClickOutside(e: MouseEvent) {
        this.collapse();
    }
    protected collapse() {
        this.setState({ expanded: false });
    }
    protected expand() {
        if (this.state && this.state.expanded) {
            return;
        }
        this.setState({ expanded: true });
    }
    protected toggle(){
        this.setState({
            expanded: !(this.state && this.state.expanded)
        })
    }
    render() {
        const state = this.state || {};
        const { expanded } = state;
        const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
            let target = e.target as HTMLElement;
            let isToggle = false;
            while(!isToggle && target !== e.currentTarget){
                if(target.classList.contains('dropdown-toggle') || "toggle" in target.dataset){
                    isToggle = true;
                }
                target = target.parentElement;
            }
            if (isToggle) {
                this.toggle();
            }else{
                this.collapse();
            }
        }
        return <div onClick={onClick} className={classnames(this.props.className, { open: expanded })} role="group">
            {this.props.children}
        </div>;
    }
}