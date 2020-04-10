import React, { Component } from 'react';
import { Link, Redirect, Route, HashRouter as Router, Switch } from "react-router-dom"
import './index.css';

import Common from "../../Common/index"

// Toast
import Toast from "../../components/ToastPublic/index.jsx"


// components
import Qrcode from "../../components/Qrcode/index"
import IdCard from "../../components/IdCard/index"
import PassPort from "../../components/PassPort/index"
import Senseid from "../../components/Senseid/index"
import AppointmentInfo from  "../../components/AppointmentInfo/index"

import Menu from "../../components/Menu/index"


/**
 * @author 方超 qq978070462
 * @description [主功能页面]
 * @returns {React.Component}
 */

export default class Homepage extends Component {
    constructor(props){
        super(props)
        this.state= {
            open: false,
            title:""
        }
    }

    render(){
        return (
            <div className="page_home">
                <Menu changeSize={this.changeSize.bind(this)} changeTitle={this.changeTitle.bind(this)} history={this.props.history} />
                <div 
                    className="page_home_routeView"
                    style={{left:this.state.open?"320px":"84px"}}
                >
                    <p className="page_home_title">{this.state.title}</p>
                    <div id="page_home_mainView">
                        <Router>
                            <Switch>
                                <Route path="/home/qrcode" component={Qrcode} />
                                <Route path="/home/Certificates" component={this.state.Certificates} />
                                <Route path="/home/appointmentInfo" component={AppointmentInfo} />
                            </Switch>
                        </Router>
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount(){
        switch(Common.$_Get().idcard){
            case "1":
                this.setState({
                    Certificates: PassPort
                })
                break;
            case "3":
                this.setState({
                    Certificates : Senseid
                })
                break;
            default:
                this.setState({
                    Certificates : IdCard
                })
                break;
        }
    }

    /**
     * @description [菜单展开回调]
     * @param {Boolean} open 
     */
    changeSize(open){
        this.setState({
            open:open
        })
    }

    /**
     * @description [菜单单元切换回调]
     * @param {String} tite 
     */
    changeTitle(title){
        this.setState({
            title:title
        })
    }
}
