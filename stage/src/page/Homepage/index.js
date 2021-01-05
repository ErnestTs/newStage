import React, { Component } from 'react';
import { Link, Redirect, Route, HashRouter as Router, Switch } from "react-router-dom"
import 'antd/dist/antd.css';
import './index.css';

import Common from "../../Common/index"

// Toast
import Toast from "../../components/ToastPublic/index.jsx"


// components
import Qrcode from "../../components/Qrcode/index"
import IdCard from "../../components/IdCard/index"
import Register from "../../components/Register/index"
import PassPort from "../../components/PassPort/index"
import Huashi from "../../components/Huashi/index"
import Senseid from "../../components/Senseid/index"
import AppointmentInfo from  "../../components/AppointmentInfo/index"
import Logistics from "../../components/Logistics/index"
import LogisticsInfo from "../../components/LogisticsInfo/index"
import FaceRecognition from "../../components/FaceRecognition/index"
import VisitorInfo from "../../components/VisitorInfo/index"
import Print from "../../components/Print/index"
import VisitorList from "../../components/VisitorList/index"
import TempCards from "../../components/TempCards/index"
import Resident from "../../components/Resident/index"
import Blacklist from "../../components/Blacklist/index"
import Companylist from "../../components/Companylist/index"
import Register_officeBuilding from "../../components/Register_officeBuilding/index"
import VisitorInfo_officeBuilding from "../../components/VisitorInfo_officeBuilding/index"
import h5Video from "../../components/H5Video/index"

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
            open: true,
            title:"",
            defaultPath:"/home/qrcode",

            // Certificates:{},
            // VisitorInfoCom:{},
            // RegisterCom:{}
        }
    }

    render(){
        return (
            <div className="page_home">
                <Menu changeSize={this.changeSize.bind(this)} changeTitle={this.changeTitle.bind(this)} history={this.props.history} />
                <div 
                    className="page_home_routeView"
                    style={{left:this.state.open?"16.66666vw":"84px"}}
                >
                    <p className="page_home_title">{this.state.title}</p>
                    <div id="page_home_mainView">
                        <Router>
                            <Switch>
                                <Route path="/home/qrcode" component={Qrcode} />
                                <Route path="/home/Certificates" component={this.state.Certificates} />
                                <Route path="/home/appointmentInfo" component={AppointmentInfo} />
                                <Route path="/home/logistics" component={Logistics} />
                                <Route path="/home/register" component={this.state.RegisterCom} />
                                <Route path="/home/logisticsInfo" name="LogisticsInfo" component={LogisticsInfo} />
                                <Route path="/home/face" name="face" component={FaceRecognition} />
                                <Route path="/home/visitorInfo" name="VisitorInfo" component={this.state.VisitorInfoCom} />
                                <Route path="/home/print" name="print" component={Print} />
                                <Route path="/home/visitor" name="visitor" component={VisitorList} />
                                <Route path="/home/cards" component={TempCards} />
                                <Route path="/home/resident" component={Resident} />
                                <Route path="/home/companylist" component={Companylist} />
                                <Route path="/home/blacklist" component={Blacklist} />
                                <Route path="/home/video" component={h5Video} />
                                <Redirect to={Common.$_Get().idcard==3?"/home/visitor":this.state.defaultPath} />
                            </Switch>
                        </Router>
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount(){
        // 守卫
        if(!sessionStorage.token){
            this.props.history.push("/login")
            return;
        }

        // 切换组件
        // 切换读卡设备 1-证照通 2-华视 3-senseid def-读卡器
        switch(Common.$_Get().idcard){
            case "1":
                this.setState({
                    Certificates: PassPort
                })
                break;
            case "2":
                this.setState({
                    Certificates: Huashi
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
        
        // 多企业模式切换 0-单企业 1-多企业
        switch(sessionStorage.sid){
            case "0":
                this.setState({
                    VisitorInfoCom: VisitorInfo,
                    RegisterCom: Register,
                })
                break;
            case "1":
                this.setState({
                    VisitorInfoCom: VisitorInfo_officeBuilding,
                    RegisterCom : Register_officeBuilding
                })
                break;
            default:
                this.setState({
                    VisitorInfoCom: VisitorInfo,
                    RegisterCom: Register,
                })
                break;
        }


        let _this = this
        this.refreshToken()

        setInterval(()=>{
            _this.refreshToken()
        },Common.FreshToken*60*60*1000)
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

    /**
     * @description [刷新token]
     */
	refreshToken() {
        if(Common.$_Get().idcard==3){
            return
        }
		let email = sessionStorage.email,
			token = sessionStorage.token;
		let sendData = {
                // email: sessionStorage.pemail||sessionStorage.email,
                email: sessionStorage.email,
                
				oldToken: token
            };
			if(sessionStorage.loginType != "LoginManager"){
				sendData.email = sessionStorage.un
			}

		if (email === undefined || token === undefined) return;

		Common.ajaxProc("refreshToken", sendData, sessionStorage.token).done(function (data) {
			if (data.status === 0) {
				/**存储结果用于刷新token,其他session暂不修改 */
				// sessionStorage.result = JSON.stringify(result);

				/**
				 * 拼接token格式
				 * 管理员 userid-token
				 * 前台 account-token
				 */
				if (sessionStorage.loginType === "LoginManager") {
					// sessionStorage.token = sessionStorage.un + '-' + data.result.token;
					sessionStorage.token = sessionStorage.userid + '-' + data.result.token;
				}
				else {
					sessionStorage.token = sessionStorage.userid + '-' + data.result.token;
				}
			}
		});
	}
}
