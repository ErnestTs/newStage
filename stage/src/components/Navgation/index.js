import React, { Component } from 'react';
import './index.css';

import logo from '../../resource/logo.png';
import exitPng from '../../resource/exit.png';

/**
 * @author 方超 qq978070462
 * @description [顶部导航条]
 * @returns {React.Component}
 * @version [重构v0.01]
 */
export default class Navgation extends Component {
    constructor(props){
        super(props)

        this.state={
            onShow:false
        }
    }

    render() {
        return (
            //将实际的导航条套入topbar以控制宽度
            <div id="topBar">
                <div id="navgation">
                    <img src={logo} alt="" className="logo" />
                    <div style={{display:this.state.onShow?"block":"none"}} className="exit">
                        <span>
                            <img src={exitPng} alt="" />
                        </span>
                        <span id="loginOut" onClick={this.logout.bind(this)}>退出系统</span>
                    </div>
                </div>
            </div>
        );
    }

    componentWillMount(){
        let _this = this;
        window.addEventListener("hashchange",()=>{
            if(window.location.hash == "#/login"){
                _this.setState({
                    onShow:false
                })
            }else{
                _this.setState({
                    onShow:true
                })
            }
        })
    }

    /**
     *	@description [注销登出]
     */
    logout() {
        sessionStorage.clear();
        window.location.hash = "/login";
    }
}