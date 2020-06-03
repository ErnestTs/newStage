import React,{Component} from "react"

import Common from "../../Common/index"

import "./index.css"

// Toast
import Toast from "../../components/ToastPublic/index.jsx"

export default class Senseid extends Component {
    constructor(props){
        super(props)
        this.state= {
            componentName : "Senseid",
            cardInfo:{}
        }
    }

    render(){
        return (
            <div id="component_Senseid">
                <div className="scanCard_background">
                </div>
                <p>请扫描证件信息</p>
                <div className="btn_box">
                    <div onClick={this.scanCard.bind(this)}>读取证件</div>
                </div>
            </div>
        )
    }

    componentDidMount(){
		let _this = this;
		window.callbackId = function(res){
            if(!res){
                return
            }
            if(typeof(res) == "string"){
                try {
                    res = JSON.parse(res)
                } catch (error) {
                    console.log(error)
                }
            }
            let cardInfo = {certNumber:res.cardId,partyName:res.name,address:res.address}
            _this.state.cardInfo = cardInfo
			_this.scanCard(cardInfo)
		}
    }

    getCardInfoBySenseId(){
        window.Android.startActivity("id")
    }

    /**
     * @description [扫描证件]
     */
    scanCard(cardInfo){
        // 0-获取身份证信息
        // let cardInfo={certNumber:"320911198301036314",partyName:"方超"}
        // 1-获取物流信息
        if(this.getLogisticsInfo(cardInfo.certNumber).state){

        }
        // 2-查询访客信息
        else{
            // 2-0-查询是否有未签出记录
            if(this.getVisitorSignOutByCardId(cardInfo.certNumber).state){

            }
            // 2-0-查询访客来访记录
            else {
                this.getAppointmentByName(cardInfo.partyName)
            }
        }

    }

    /**
     * @description [根据身份证号获取物流信息]
     * @param {Strinf} cardId 
     */
    getLogisticsInfo(cardId){
		let sendData = {
			psList:[1,3],
			startIndex:1,
			requestedCount:10,
			userid: sessionStorage.userid,
			cardid: cardId
        };
        let resObj = {}
        Common.ajaxProcWithoutAsync("getLogisticsInfo", sendData, sessionStorage.token).done((res)=>{
            if(res.result.list.length == 0){
                resObj.state = false
            }else{

            }
        })

        return resObj
    }

    /**
     * @deprecated [根据身份证号查询访客签出记录]
     * @param {String} cardId 
     */
    getVisitorSignOutByCardId(cardId){
		let sendData = {
			userid: sessionStorage.userid,
			phone: "",
			cardId: cardId
		};
        let resObj = {}
        Common.ajaxProcWithoutAsync("getVisitorSignOutByPhone", sendData, sessionStorage.token).done((data)=>{
			let arr = [];
			for(let i = 0;i < data.result.length;i++){
				if(!!data.result[i].visitdate){
					arr.push(data.result[i])
				}
			}
			if (arr.length !== 0) {
                let item = data.result[0]
                let extendCol = JSON.parse(item.extendCol.replace(/&quot;/g,'"'));
                let qrType = item.status==3?"a":"v"
                let obj = {
                    "visitInfo":{
                        "peopleCount":item.peopleCount||"",
                        "vname":item.vname||"",
                        "vtime":item.appointmentDate||"",
                        "vphone":item.vphone||"",
                        "vtype":item.visitType||"",
                        "vemail":item.vemail||"",
                        "vid":item.vid||"",
                        "signInGate":item.signInGate||"",
                        "signInOpName":item.signInOpName||"",
                        "signOutGate":item.signOutGate||"",
                        "signOutOpName":item.signOutOpName||"",
                        "member":null||"",
                        "vcompany":item.vcompany||"",
                        "remark":item.remark||"",
                        "leaveTime":item.leaveTime||"",
                        "gid":item.gid||""
                    },
                    "empInfo":{
                        "ename":item.empName||"",
                        "ephone":item.empPhone||"",
                        "extendCol":item.extendCol||""
                    },
                    "idcardContent":{
                        "certNumber":extendCol.cardId||"",
                        "partyName":item.vname||"",
                        "address":this.state.address
                    },
                    "tid":item.tid||"",
                    "vgroup":item.vgroup||"",
                    "appointmentDate":item.appointmentDate||"",
                    "action":"card",
                    "vType":item.vType||"",
                    "permission":item.permission||"",
                    "qrtype":qrType,
                    "signOutDate":item.signOutDate||"",
                    "visitDate":item.visitdate||"",
                    "leaveTime":item.leaveTime||"",
                    "qrcodeType":item.qrcodeType||"",
                    "qrcodeConf":item.qrcodeConf||"",
                    "aid":item.aid||"",
                    "signin":item.signin
                }
                this.props.history.push({pathname:"/home/appointmentInfo", state:[obj]});
            }else {
                resObj.state = false
            }
        })

        return resObj
    }

    /**
     * 
     * @param {String} name 
     */
    getAppointmentByName(name){
		let sendData = {
			userid: sessionStorage.userid,
			name: name,
			tag: 1,
			gid:sessionStorage.gid
        };
        Common.ajaxProc("getVisitorAppointmentByName", sendData, sessionStorage.token).done((data)=>{
            if(data.status == 0){
                if(!!data.result.length){
                    for(let i = 0; i < data.result.length; i++){
                        let item = data.result[i];
                        if(item.permission == 0){
                            continue;
                        }
                        let extendCol = JSON.parse(item.extendCol.replace(/&quot;/g,'"'));
                        let qrType = item.status==3?"a":"v"
                        let obj = {
                            "visitInfo":{
                                "peopleCount":item.peopleCount||"",
                                "vname":item.vname||"",
                                "vtime":item.appointmentDate||"",
                                "vphone":item.vphone||"",
                                "vtype":item.visitType||"",
                                "vemail":item.vemail||"",
                                "vid":item.vid||"",
                                "signInGate":item.signInGate||"",
                                "signInOpName":item.signInOpName||"",
                                "signOutGate":item.signOutGate||"",
                                "signOutOpName":item.signOutOpName||"",
                                "member":null||"",
                                "vcompany":item.vcompany||"",
                                "remark":item.remark||"",
                                "leaveTime":item.leaveTime||"",
                                "gid":item.gid||""
                            },
                            "empInfo":{
                                "ename":item.empName||"",
                                "ephone":item.empPhone||"",
                                "extendCol":item.extendCol||""
                            },
                            "idcardContent":{
                                "certNumber":extendCol.cardId||"",
                                "partyName":item.vname||""
                            },
                            "tid":item.tid||"",
                            "vgroup":item.vgroup||"",
                            "appointmentDate":item.appointmentDate||"",
                            "action":"card",
                            "vType":item.vType||"",
                            "permission":item.permission||"",
                            "qrtype":qrType,
                            "signOutDate":item.signOutDate||"",
                            "visitDate":item.visitdate||"",
                            "leaveTime":item.leaveTime||"",
                            "qrcodeType":item.qrcodeType||"",
                            "qrcodeConf":item.qrcodeConf||"",
                            "aid":item.aid||"",
                            "signin":item.signin
                        }
                        this.state.routerData.push(obj)
                    }
                    if(!!this.state.routerData.length){
                        this.props.history.push({pathname:"/home/appointmentInfo", state:this.state.routerData});
                    }else{
                        Toast.open({
                            type:"danger",
                            content: "没有查询到可用的预约记录"
                        })
                        return;
                    }
                }else{
                    Toast.open({
                        type:"danger",
                        content: "没有查询到可用的预约记录"
                    })
                    return;
                }
            }
        })
    }
}