import React,{Component} from "react"

import Common from "../../Common/index"

import "./index.css"

// Toast
import Toast from "../../components/ToastPublic/index.jsx"


/**
 * @author 方超 qq978070462
 * @description [扫描二维码组件]
 * @returns {React.Component}
 */

export default class Qrcode extends Component {
    constructor(props){
        super(props)
    }

    render(){
        return (
            <div id="component_qrcode">
                <div id="qrcode_scanInput">
                    <input id="qrcode_input" ref={(input)=>{this.qrcodeInput=input}} onChange={this.getQrcode.bind(this)} autoFocus="autofocus" onBlur={this.getFocus.bind(this)} />
                </div>
                <p>二维码扫描</p>
            </div>
        )
    }

    componentDidMount(){
		this.getFocus()
	}

    /**
     * @description [获取二维码]
     */
    getQrcode(){
        let _this = this;
		setTimeout(function () {
            _this.analysisCode(_this.qrcodeInput.value);
            try {
                _this.qrcodeInput.value = ""
            }catch(err){
                console.log(err)
            }
		}, 1000);
    }

    /**
     * @description [获取焦点]
     */
    getFocus(){
        this.qrcodeInput.focus()
    }

    /**
     * @description [解析二维码对应访客类型]
     * @param {String} qrcode 
     */
    analysisCode(qrcode){
        if(qrcode.length > 44){
			let str = qrcode;
			let code = str.substr(16);
			let emp = code.substr(3, 2);
			let type = code.substr(5, 2);
			let vid = str.substr(44);

			if (emp === '03') {
				let routerData = {
					rid: "c" + vid
                };
                
                // 跳转至常驻访客！
                this.props.history.push("/home/resident")

			}
			else {
				if (type === "23") {
					vid = 'a' + vid;
				}
				else if (type === "25") {
					vid = 'v' + vid;
				}
				this.getVisitorByVid(vid);
			}
        }
    }

    /**
     * @description [通过vid获取预约信息]
     * @param {String} vid 
     */
    getVisitorByVid(vid){
		var sendData = {
			vid: vid
        };
        
		Common.ajaxProcWithoutAsync("GetVisitorByVid", sendData, sessionStorage.token).done(function (data) {
            if(data.status == 27) {
                Toast.open({
                    type:"danger",
                    content: "登录已失效，请重新登录"
                })
                return;
            }
			if (data.status === 0 && data.result !== null) {
				let result = data.result;

				if (result.visitdate === undefined || result.visitdate === null) {
					if (!this.checkExtendTime(data.result)) {
						return;
					}
                }
                this.routerData = {
					visitInfo:{
						peopleCount:result.peopleCount,
						vname: result.vname,
						vtime: new Date(result.appointmentDate).format("yyyy-MM-dd hh:mm:ss"),
						vphone: result.vphone,
						vtype: result.visitType,
						vemail: result.vemail,
						vid: vid.substring(1),
						signInGate: result.signInGate,
						signInOpName: result.signInOpName,
						signOutGate: result.signOutGate,
						signOutOpName: result.signOutOpName,
						member: result.memberName,
						vcompany: result.vcompany,
						remark: result.remark,
						leaveTime: data.result.leaveTime === undefined ? null : data.result.leaveTime,
						gid: result.gid
					},
					empInfo:{
						ename: result.empName,
						ephone: result.empPhone,
						dept: result.dept,
						workbay: result.workbay,
						extendCol: result.extendCol
					},
					idcardContent: {
						certNumber: this.cardId,
						partyName: result.vname,
						certNumber: result.cardId
					},
					tid: result.tid,
					vgroup: result.vgroup,
					appointmentDate: result.appointmentDate,
					action: "qrcode",
					vType: data.result.vType,
					permission: data.result.permission,
					qrtype: vid.substring(0, 1)
                }
				if (this.routerData.signOutDate === undefined || this.routerData.signOutDate === null) {
					this.routerData.signOutDate = data.result.signOutDate;
				}


				// 处理多日签到 方
				let visited = new Date(data.result.visitdate).getDate();
				let today = new Date().getDate();
				if(visited != today && this.checkExtendTime(data.result)){
					this.routerData.visitDate = null;
					this.routerData.leaveTime = data.result.leaveTime;
				}else{
					this.routerData.visitDate = data.result.visitdate;
					this.routerData.leaveTime = data.result.leaveTime;
				}
				// 结束

				if (this.routerData.qrtype === 'a') {
					this.routerData.qrcodeType = data.result.qrcodeType;
					this.routerData.qrcodeConf = data.result.qrcodeConf;
					this.routerData.aid = data.result.aid;
					this.routerData.appointmentDate = data.result.appointmentDate;
					this.getSignOp(this.routerData.visitInfo.vphone, this.routerData.visitInfo.vemail, result.signOutDate, result.appid);
				}

				this.props.history.push({pathname:"/home/appointmentInfo", state:this.routerData});
			}
		}.bind(this));
    }


    /**
     * @description [校验签到时间是否合法]
     * @param {Object} data 
     */
	checkExtendTime(data) {
		// 将预约时间转为毫秒
		let appTime = new Date(data.appointmentDate).getTime(),
		// 获取当前时间毫秒
			today = new Date().getTime(),
			preTime, latTime;

		// 获取最早和最晚签到时间 为预约当天的上班和下班时间
		preTime = new Date(appTime - (parseInt(sessionStorage.preExtendTime) * 60000)).getTime();
		latTime = new Date(appTime + (parseInt(sessionStorage.latExtendTime) * 60000)).getTime();
		if(sessionStorage.latExtendTime == 0) {
			latTime = new Date(new Date(appTime).format("yyyy-MM-dd 23:59:59")).getTime();
		}
		if(sessionStorage.preExtendTime == 0) {
			latTime = new Date(new Date(appTime).format("yyyy-MM-dd 00:00:00")).getTime();
		}

		// 当前时间的年-月-日 舍去时分秒
		let early = new Date(today).format('yyyy-MM-dd'),
			later = "";
		// 当前天的毫秒  early为当天0点 later为当天23点
		early = new Date(early).getTime();
		early = early - 8 * 60 * 60000;
		later = early + 23 * 60 * 60000;

		
		// qrcodeType 二维码有效期类型 0 天数 1次数
		if(data.qrcodeType == 0){
			// early = data.appointmentDate;
			// later = data.appointmentDate + 24 * 60 * 60000 * data.qrcodeConf;
			data.qrcodeConf = data.qrcodeConf == 0? 1: data.qrcodeConf;			// add by 方 预约时默认天数为0 修改为1
			early = new Date(new Date(data.appointmentDate).format("yyyy-MM-dd")).getTime();
			later = new Date(new Date(data.appointmentDate + data.qrcodeConf * 86400000).format("yyyy-MM-dd")).getTime();
			if(today > later){
                Toast.open({
                    type:"danger",
                    content: "该预约已过期"
                })
				return false
			}else if(today < early){
                Toast.open({
                    type:"danger",
                    content: "该预约尚未到来访时间"
                })
				return false
			}else if(!!data.visitDate && new Date(data.visitDate).getDate() != new Date(today).getDate()){
                Toast.open({
                    type:"danger",
                    content: "今日已签到，请勿重复签到"
                })
				return false
			}
		}

		if (sessionStorage.preExtendTime === '0' || sessionStorage.latExtendTime === '0') {
			if (appTime < early) {
                Toast.open({
                    type:"danger",
                    content: "该预约已过期"
                })
				return false;
			}
			else if (appTime > later) {
                Toast.open({
                    type:"danger",
                    content: "该预约尚未到来访时间"
                })
				return false;
			}
		}
		else if (today < preTime) {
			if(data.qrcodeConf > 1){
				return true
			}
            Toast.open({
                type:"danger",
                content: "该预约尚未到签入时间"
            })
			return false;
		}
		else if (today > latTime) {
			if(data.qrcodeConf > 1){
				return true
			}
            Toast.open({
                type:"danger",
                content: "该预约已超过来访时间"
            })
			return false;
		}

		return true;
    }
    
    

	getSignOp(phone, email, signOutDate, appid) {
		let _phone = phone,
			_email = email;

		let sendData = {
			userid: sessionStorage.userid
		};

		if (_phone !== null) {
			sendData.vphone = _phone;
		}
		else {
			sendData.vemail = _email;
		}
		Common.ajaxProcWithoutAsync("getTodayAppointmentByPhone", sendData, sessionStorage.token, false).done(function (data) {
			if (data.result !== null && data.result !== undefined) {
				this.routerData.visitInfo.signInGate = data.result.signInGate;
				this.routerData.visitInfo.signInOpName = data.result.signInOpName;
				this.routerData.visitInfo.signOutGate = data.result.signOutGate;
				this.routerData.visitInfo.signOutOpName = data.result.signOutOpName;
				this.routerData.visitInfo.signOutDate = !!signOutDate?signOutDate: null;
				if(data.result.appid === appid){
					this.routerData.empInfo.extendCol = data.result.extendCol;
					this.routerData.empInfo.ephone = data.result.empPhone;
				}
			}
			else {
				this.routerData.visitInfo.signInGate = "";
				this.routerData.visitInfo.signInOpName = "";
				this.routerData.visitInfo.signOutGate = "";
				this.routerData.visitInfo.signOutOpName = "";
			}
		}.bind(this));
	}
    
}