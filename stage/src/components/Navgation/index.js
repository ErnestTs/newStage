import React, { Component } from 'react';
import './index.css';

import logo from '../../resource/logo.png';
// import exitPng from '../../resource/exit.png';

/**
 * @author 方超 qq978070462
 * @description [顶部导航条]
 * @returns {React.Component}
 * @version [重构v0.01]
 */
export default class Navgation extends Component {
    constructor(props){
        super(props)
    }

    render() {
        return (
            //将实际的导航条套入topbar以控制宽度
            <div id="topBar">
                <div id="navgation">
                    <img src={logo} alt="" className="logo" />
                    <div className="exit">
                        <span>
                            {/* <img src={exitPng} alt="" /> */}
                        </span>
                        <span id="loginOut" onClick={this.logout.bind(this)}>退出系统</span>
                    </div>
                </div>
            </div>
        );
    }

    /**
     *	@description [注销登出]
     */
    logout() {
        sessionStorage.clear();
        window.location.reload(true)
    }
}