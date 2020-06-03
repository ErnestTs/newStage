import React,{Component} from "react"

import Common from "../../Common/index"

import "./index.css"

// Toast
import Toast from "../../components/ToastPublic/index.jsx"

export default class IdCard extends Component {

    IDCARD_STATUS_1 = "idStatus1";
    
    constructor(props){
        super(props)
        this.state= {
            componentName : "IdCard",
			action: this.IDCARD_STATUS_1
        }
    }

    render(){
        return (
            <div id="component_idCard">
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
        Common.initIdCard()
    }

    /**
     * @description [扫描证件]
     */
    scanCard(){
        // 0-获取身份证信息
        let cardInfo = Common.getIdCardInfo();
        this.state.cardInfo = cardInfo
        // let cardInfo={certNumber:"320911198301036314",partyName:"方超"}
        console.log(cardInfo)
        if(cardInfo.partyName == "err0"){
            Toast.open({
                type:"danger",
                content: "请允许读卡器插件运行"
            })
            return
        }else if(cardInfo.partyName == "err1"){
            Toast.open({
                type:"danger",
                content: "读取错误,请确认读卡器状态"
            })
            return
        }

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
                        "address": this.state.cardInfo.address
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
                                "partyName":item.vname||"",
                                "address": this.state.cardInfo.address
                            },
                            "tid":item.tid||"",
                            "vgroup":item.vgroup||"",
                            "appointmentDate":item.appointmentDate||"",
                            "action":"list",
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