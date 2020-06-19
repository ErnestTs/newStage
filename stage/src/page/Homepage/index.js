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
            title:""
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
                                <Route path="/home/companylist" component={Companylist} />
                                <Route path="/home/blacklist" component={Blacklist} />
                                <Route path="/home/qrcode" component={Qrcode} />
                                <Route path="/home/Certificates" component={this.state.Certificates} />
                                <Route path="/home/appointmentInfo" component={AppointmentInfo} />
                                <Route path="/home/logistics" component={Logistics} />
                                <Route path="/home/register" component={Register} />
                                <Route path="/home/logisticsInfo" name="LogisticsInfo" component={LogisticsInfo} />
                                <Route path="/home/face" name="face" component={FaceRecognition} />
                                <Route path="/home/visitorInfo" name="VisitorInfo" component={VisitorInfo} />
                                <Route path="/home/print" name="print" component={Print} />
                                <Route path="/home/visitor" name="visitor" component={VisitorList} />
                                <Route path="/home/cards" component={TempCards} />
                                <Route path="/home/resident" component={Resident} />
                                <Redirect to="/home/companylist" />
                            </Switch>
                        </Router>
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount(){
        if(!sessionStorage.token){
            this.props.history.push("/login")
            return;
        }
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

        this.getPassConfigList()
        this.refreshToken()
        let _this = this

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
		let result = JSON.parse(sessionStorage.result),
			email = sessionStorage.email,
			token = sessionStorage.token,
			sendData = {
				email: sessionStorage.pemail,
				oldToken: token
			};
			if(sessionStorage.loginType != "LoginManager"){
				sendData.email = sessionStorage.un
			}

		if (email === undefined || token === undefined) return;

		Common.ajaxProc("refreshToken", sendData, sessionStorage.token).done(function (data) {
			if (data.status === 0) {
				/**存储结果用于刷新token,其他session暂不修改 */
				sessionStorage.result = JSON.stringify(result);

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

    /**
     * @description [获取通行策略]
     */
    getPassConfigList(){
        let sendData = {
            ctype:"3",    // 0-pad 1-小程序 2-邀请函 3-前台 4-访客机
            userid:sessionStorage.userid
        }
        Common.ajaxProc("getPassConfigList",sendData,sessionStorage.token).done((res)=>{
            if(res.status == 0){
                let oList = res.result;
                let passConfigList = [];
                for(let i = 0;i < oList.length;i++){
                    let item = oList[i];
                    item.conditions = item.conditions.replace(/&quot;/g, '"')
                    item.conditions = item.conditions.replace(/，/g, ',')
                    item.conditions = JSON.parse(item.conditions)
                    
                    let startDate = new Date(item.pr.startDate).getTime();
                    let endDate = new Date(item.pr.endDate).getTime();
                    let today = new Date()

                    if((item.conditions.gid == sessionStorage.gid) && (startDate<=today.getTime()&&today.getTime()<=endDate)){
                        passConfigList.push(item)
                    }
                }
                sessionStorage.setItem("passConfigList",JSON.stringify(passConfigList))
            }
        })
    }
}
