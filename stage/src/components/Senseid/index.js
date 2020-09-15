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
                    <div onClick={this.getCardInfoBySenseId.bind(this)}>
                        <span>读取证件</span>
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount(){
        console.log("senseid")
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
            if(res.result.list.length == 0||res.status !== 0){
                resObj.state = false
            }else{
                resObj.state = true
                var datalist = res.result.list;
                let _this = this
                            
                for (var i = 0; i < datalist.length; i++) {
                    if (datalist[i].appointmentDate !== null) {
                        datalist[i].appointmentDate = new Date(datalist[i].appointmentDate).format("yyyy-MM-dd hh:mm:ss");
                    }
                    if (datalist[i].visitdate !== null) {
                        datalist[i].visitdate = new Date(datalist[i].visitdate).format("yyyy-MM-dd hh:mm:ss");
                    }
                    if (datalist[i].leaveTime !== null) {
                        datalist[i].leaveTime = new Date(datalist[i].leaveTime).format("yyyy-MM-dd hh:mm:ss");
                    }
                    if (datalist[i].finishTime !== null) {
                        datalist[i].finishTime = new Date(datalist[i].finishTime).format("yyyy-MM-dd hh:mm:ss");
                    }
                    

                    if(!!datalist[i].leaveTime){
                        datalist[i].state = 2;
                    }else if(!!datalist[i].visitdate){
                        datalist[i].state = 1;
                    }else {
                        datalist[i].state = 0;
                    }
                }			
                let totalPage = Math.ceil(res.result.count / _this.state.pageSize);
                for(var i =0;i < datalist.length; i++){
                    datalist[i].logExtend = datalist[i].logExtend !== null?JSON.parse(datalist[i].logExtend.replace(/&quot;/g, '"')):[];
                    datalist[i].driverExtend = datalist[i].driverExtend !== null?JSON.parse(datalist[i].driverExtend.replace(/&quot;/g, '"')):[];
                    datalist[i].vehicleExtend = datalist[i].vehicleExtend !== null?JSON.parse(datalist[i].vehicleExtend.replace(/&quot;/g, '"')):[];
                    datalist[i].goodsExtend = datalist[i].goodsExtend !== null?JSON.parse(datalist[i].goodsExtend.replace(/&quot;/g, '"')):[];
                    datalist[i].memberInfo = datalist[i].memberInfo !== null?JSON.parse(datalist[i].memberInfo.replace(/&quot;/g, '"')):[];
                    datalist[i].otherExtend = datalist[i].otherExtend !== null?JSON.parse(datalist[i].otherExtend.replace(/&quot;/g, '"')):[];
                    if(!datalist[i].otherExtend){
                        datalist[i].otherExtend = []
                    }
                    
                    datalist[i].photoInfo = datalist[i].photoInfo.split(",");
                    datalist[i].carLoginPhoto = datalist[i].photoInfo;
                    datalist[i].carLogoutPhoto = datalist[i].photoInfo;
                    

                    datalist[i].key = "l"+datalist[i].appointmentDate
                }
                this.props.history.push({pathname:"logisticsInfo",state:datalist[0]})
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
                        "address":this.state.address||""
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
                if(this.checkExtendTime(item)){
                    this.props.history.push({pathname:"/home/appointmentInfo", state:[obj]});
                }
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
                        if(this.checkExtendTime(item)){
                            this.state.routerData.push(obj)
                        }
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
}