import React, { Component } from 'react';
import './index.css';

import logo from '../../resource/logo.png';
import exitPng from '../../resource/exit.png';
import Common from "../../Common/index"

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
            exitOnShow:false
        }
    }

    render() {
        return (
            //将实际的导航条套入topbar以控制宽度
            <div id="topBar">
                <div id="navgation">
                    <img src={logo} alt="" className="logo" />
                    <div className="exit" style={{display:this.state.exitOnShow?"block":"none"}}>
                        <span>
                            <img src={exitPng} alt="" />
                        </span>
                        <span id="loginOut" onClick={this.logout.bind(this)}>主页面</span>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount(){
        if(window.location.hash !== "#/login"){
            this.setState({
                exitOnShow:true
            })
        }else{
            this.setState({
                exitOnShow:false
            })
        }

        let _this = this
        
        document.body.onhashchange=function(){
            if(window.location.hash !== "#/login"){
                _this.setState({
                    exitOnShow:true
                })
            }else{
                _this.setState({
                    exitOnShow:false
                })
            }
        }
    }

    /**
     *	@description [注销登出]
     */
    logout() {
        if(Common.$_Get().idcard == "3"){
            window.Android.finish()
        }
        sessionStorage.clear();
        window.location.hash = "/login";
    }
}