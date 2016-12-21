/**
 * Created by cyrilluce on 2016/8/14.
 */
import * as React from 'react';
import { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

class App extends Component<any, any> {
    render() {
        // Injected by connect() call:
        const { dispatch } = this.props
        return (
            <div>Empty App</div>
        )
    }
}
// Which props do we want to inject, given the global state?
// Note: use https://github.com/faassen/reselect for better performance.
function select(state) {
    return {

    }
}



// 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
export default connect(select)(App)