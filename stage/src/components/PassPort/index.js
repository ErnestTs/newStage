import React,{Component} from "react"

import Common from "../../Common/index"

import "./index.css"

// Toast
import Toast from "../../components/ToastPublic/index.jsx"

export default class PassPort extends Component {
    constructor(props){
        super(props)
        this.state= {
            routerData:[]
        }
    }

    render(){
        return (
            <div id="component_PassPort">
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
        Common.initPassPort()
    }

    /**
     * @description [扫描证件]
     */
    scanCard(){
        // 0-获取身份证信息
        // let cardInfo = Common.scanByPassPort();
        let cardInfo={certNumber:"37020219921104351X",partyName:"方超",address:"山东省青岛市市南区湖南路七号九户"}
        this.state.cardInfo = cardInfo

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
			startIndex:0,
			requestedCount:999,
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