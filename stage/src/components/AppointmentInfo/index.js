import React,{Component} from "react"
import $ from "jquery"

import Common from "../../Common/index"

import "./index.css"

// Toast
import Toast from "../../components/ToastPublic/index.jsx"


//img
import scanCard from "../../resource/scanCard.png"
import defaultPhoto from "../../resource/defaultPhoto.png"
import defaultCard from "../../resource/idcardimg.jpeg"

export default class AppointmentInfo extends Component {
    constructor(props){
        super(props)

        this.state= {
            infoOnShow:0,
            answerState:0,
            showCardMask:true,
            visitInfo:{},
            idcardContent:{},
            empInfo:{},
            cardInfo:{
                name:"",
                cardId:"",
                address:""
            },
            extendCol:{},
            qrcodeConf:0,
            extendList:[],
            onLogin: true,
            regElementArr: [
                "appointmentDate", 
                "name", 
                "phone", 
                "visitType", 
                "empid", 
                "access", 
                "meetContent", 
                "meetAddress", 
                "qrcodeConf", 
                "cardId", 
                "email", 
                "gatein", 
                "gateout", 
                "guardin", 
                "guardout", 
                "remark", 
                "vcompany",
                "peopleCount", 
                "sname", 
                "mobile" 
            ],			// 已注册表单单元
            gatein:false,
            guardin:false,
            gateout:false,
            guardout:false,
        }
    }

    render(){
        // 渲染当前访客状态
        var appointmentState_val = 1;
        if(!!this.state.visitInfo.signOutDate){
            appointmentState_val = 3
            this.state.onLogin = false
        }else if(!!this.state.visitDate){
            appointmentState_val = 2
            this.state.onLogin = false
        }else if(this.state.permission == 0){
            appointmentState_val = 0
            this.state.onLogin = false
        }else{
            this.state.onLogin = true
        }
        var appointmentState = this.renderItemState({type:1,value:appointmentState_val})
        return (
            <div id="component_AppointmentInfo">
                <div className="topBar">
                    <div className="fll arrow" onClick={this.changeInfo.bind(this,-1)}></div>
                    <div className="fll">来访信息
                    {appointmentState}
                    </div>
                    <div className="fll">身份信息</div>
                    <div className="flr arrow" onClick={this.changeInfo.bind(this,1)}></div>
                </div>
                <div className="component_AppointmentInfo_mainBoard">
                    <div className="component_AppointmentInfo_appInfo fll">
                        <ul>
                            {this.renderItem("来访人姓名",this.state.visitInfo.vname,"vname",{type:0,value:this.state.answerState})}
                            {this.renderItem("预约时间",new Date(this.state.visitInfo.vtime).format("yyyy-MM-dd hh:mm:ss"))}
                            {this.renderItem("来访事由",this.state.visitInfo.vtype)}
                            {this.renderItem("离开时间",this.state.visitInfo.leaveTime)}
                            {this.renderItem("来访人电话",this.state.visitInfo.vphone)}
                            {this.renderItem("被访人姓名",this.state.empInfo.ename)}
                            {this.renderItem("被访人电话",this.state.empInfo.ephone)}
                            {this.renderItem("被访人部门",this.state.empInfo.dept)}
                            {this.renderItem("被访人位置",this.state.empInfo.workbay)}
                            {this.renderItem("同行人数",this.state.visitInfo.peopleCount,"peopleCount")}
                            {this.renderItem("来访单位",this.state.visitInfo.vcompany, "vcompany")}
                            {this.renderItem("门禁权限","1,2,3,4", "access")}
                            {this.renderItem("会面内容",this.state.extendCol.meetContent, "meetContent")}
                            {this.renderItem("会面地点",this.state.extendCol.meetAddress, "meetAddress")}
                            {this.renderItem("权限时间(天)",this.state.qrcodeConf, "meetAddress")}
                            {this.renderItem("身份证号",this.state.idcardContent.certNumber, "cardId")}
                            {this.renderItem("邮箱",this.state.visitInfo.vemail, "email")}
                        </ul>
                        <ul>
                            {
                                this.state.extendList.map((item,i,arr)=>{

                                    if(this.state.regElementArr.indexOf(item.fieldName) !== -1){
                                        if(item.fieldName == "gatein"||item.fieldName == "guardin"||item.fieldName == "gateout"||item.fieldName == "guardout"){
                                            this.state[item.fieldName] = true
                                        }
                                        return
                                    }
                                    if((item.isDisplay&1) != 1){
                                        return
                                    }
                                    
                                    return (
                                        this.renderExtendItem(item.displayName.split("#")[0],item.fieldName,item) 
                                    )
                                })
                            }
                        </ul>
                        <ul>
                            {
                                (()=>{
                                    if(appointmentState_val != 1){
                                        return this.renderItem("备注", this.state.visitInfo.remark, {},"remark")
                                    }else {
                                        return this.renderExtendItem("备注","remark",{})
                                    }
                                })()
                                
                            }
                        </ul>
                    </div>

                    <div className="component_AppointmentInfo_cardInfo fll">
                        <div id="component_AppointmentInfo_cardInfo_mask" style={{display:!!this.state.cardInfo.address?"block":"none"}}>
                            <img src={scanCard} />
                            <p>暂无身份信息</p>
                            <div className="btn_box">
                                <div onClick={this.getCardInfo.bind(this)}>
                                    <span>读取证件</span>
                                </div>
                            </div>
                        </div>

                        <div id="component_AppointmentInfo_cardInfo_board" style={{display:!this.state.cardInfo.address?"block":"none"}}>
                            <div className="headerBox">
                                <img src={defaultPhoto} />
                            </div>
                            <div className="cardForm">
                                <div className="cardForm_item">
                                    <span className="cardForm_item_key">姓名:</span>
                                    <input type="text" disabled defaultValue={this.state.cardInfo.name} />
                                    <div className="btn">查询</div>
                                </div>
                                <div className="cardForm_item">
                                    <span className="cardForm_item_key">证件号码:</span>
                                    <input type="text" disabled defaultValue={this.state.cardInfo.cardId} />
                                </div>
                                <div className="cardForm_item">
                                    <span className="cardForm_item_key">地址:</span>
                                    <span className="cardForm_item_address">
                                        {this.state.cardInfo.address}
                                    </span>
                                </div>
                                <div className="cardForm_item" style={{height:"auto"}}>
                                    <span className="cardForm_item_key">证件截图:</span>
                                    <div className="cardForm_item_card">
                                        <img src={defaultCard} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="component_AppointmentInfo_loginBTN" style={{display:appointmentState_val==1||appointmentState_val==2?"block":"none"}} onClick={this.nextStep.bind(this)}>
                    <span>下一步</span>
                </div>
            </div>
        )
    }

    componentDidMount(){
        // 守卫返回
        if(!this.props.history.location.state){
            this.props.history.push("/home/qrcode");
            return
        }
        let _this = this


        this.routerData = this.props.history.location.state[this.state.infoOnShow];

        console.log(this.routerData)

        this.getExtendCol(this.routerData.vType)
        let extendCol = {}
        try {
            extendCol = JSON.parse(_this.routerData.empInfo.extendCol.replace(/&quot;/g,'"'))
        } catch (error) {
            extendCol = {}
        }
        
        this.setState({
            visitInfo:this.routerData.visitInfo,
            empInfo:this.routerData.empInfo,
            idcardContent:this.routerData.idcardContent,
            extendCol:extendCol,
            qrcodeConf:this.routerData.qrcodeConf,
            visitDate: this.routerData.visitDate,
            appointmentDate: this.routerData.appointmentDate,
            leaveTime: this.routerData.leaveTime,
            tid: this.routerData.tid,
            action: this.routerData.action,
            qrtype: this.routerData.qrtype,
            vgroup: this.routerData.vgroup,
            vType: this.routerData.vType,
            signin:this.routerData.signin,
            cardInfo:{
                name: this.routerData.idcardContent.partyName,
                cardId: this.routerData.idcardContent.certNumber,
                address: this.routerData.idcardContent.address||""
            }
        })

        // 校验答题
        this.checkAnswer(this.routerData.visitInfo.vemail,this.routerData.visitInfo.vphone,this.routerData.idcardContent.certNumber)


        // 获取受访人信息
        this.getEmpInfo(this.routerData.empInfo.ename)

        // 加载对应的读卡模块
        switch(Common.$_Get().idcard){
            case "1":
                Common.initPassPort()
                break;
            case "3":
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
                    let cardInfo = {
                        name: res.name,
                        cardId: res.cardId,
                        address: res.address||""
                    }
                    _this.setState({
                        cardInfo:cardInfo
                    })
                }
                break;
            default:
                Common.initIdCard()
                break;
        }
    }

    /**
     * @description [渲染节点]
     * @param {String} name [中文名称]
     * @param {String} val [值]
     * @param {Object} state [状态{type:"",value:""}]
     * @param {*} key [识别]
     */
    renderItem( name, val, key, state){
        var state = !!state?this.renderItemState(state):"";
        return (
            <li>
                <span className="component_AppointmentInfo_appInfo_key">
                    {name}:
                </span>
                <span className="component_AppointmentInfo_appInfo_value">
                    {val}
                </span>
                {state}
            </li>
        )
    }


    /**
     * @description []
     * @param {*} name 
     * @param {*} key 
     * @param {*} required 
     */
    renderExtendItem(name, key, required){
        let cls = (required%1)==1?"required":"";
        let elem;

        if(key == "remark"){
            elem = <input id={key} className={"component_AppointmentInfo_appInfo_input "+cls} onChange={this.setExtendValue.bind(this,key)} value={this.state.visitInfo.remark||""} />
        }else {
            elem = <input id={key} className={"component_AppointmentInfo_appInfo_input "+cls} onChange={this.setExtendValue.bind(this,key)} value={this.state.extendCol[key]||""} />
        }

        return (
            <li key={key}>
                <span className="component_AppointmentInfo_appInfo_key">
                    {name}:
                </span>
                {elem}
            </li>
        )
    }

    /**
     * @description [修改扩展字段值]
     */
    setExtendValue(key,e){
        let tempObj;
        switch(key){
            case "remark":
                tempObj = this.state.visitInfo;
                tempObj[key] = e.target.value;
                this.setState({
                    visitInfo:tempObj
                })
                break;
            default:
                tempObj = this.state.extendCol;
                tempObj[key] = e.target.value;
                this.setState({
                    extendCol:tempObj
                })
                break;
        }
    }

    /**
     * @description [渲染节点中的特殊状态]
     * @param {Object} state 
     * @param {Number} state.type [答题-0,签到状态-1]
     * @param {Number} state.value [该状态的状态值]
     */
    renderItemState(state){
        // state.type -0 答题
        let cls = ""
        let str = ""
        switch(state.type){
            case 0:
                cls = "answerState"
                if(state.value == 0){
                    str = "未培训"
                    cls += " err"
                }else if(state.value == 1) {
                    str = "已培训"
                    cls += " success"
                }else if(state.value == 2) {
                    str = "免培训"
                    cls += " exemption"
                }
                break;
            case 1:
                cls = "appintmentState"
                if(state.value == 0){
                    str = "未授权"
                    cls += " err"
                }else if(state.value == 1) {
                    str = "已授权"
                    cls += " authorize"
                }else if(state.value == 2) {
                    str = "已签到"
                    cls += " signIn"
                }else if(state.value == 3) {
                    str = "已签出"
                    cls += " finish"
                }
                break;
            default:
                break;
        }
        return (
            <span className={cls}>{str}</span>
        )
    }

    /**
     * @description [根据受访人姓名获取受访人信息]
     * @param {String} name 
     */
    getEmpInfo(name){
        Common.ajaxProcWithoutAsync("getEmpByName", { userid: sessionStorage.userid, name: name }, sessionStorage.token).done((res)=>{
            if(!res.result.length){
                Toast.open({
                    type:"danger",
                    content: "无此受访人，请核对邀请信息!"
                })
                this.props.history.push("/home/qrcode");
                return
            }else {
				let workbay = res.result[0].workbay,
                    empid = res.result[0].empid;

                Common.ajaxProcWithoutAsync("getDeptByEmpid", { empid: empid, userid: sessionStorage.userid }, sessionStorage.token).done((data)=>{
                    let tempObj = this.routerData.empInfo;
                    if(!!data.result.length){
                        tempObj.dept = data.result[0].deptName;
                    }else{
                        tempObj.dept = "";
                    }
                    tempObj.workbay = !workbay?workbay:"";
                    this.setState({
                        empInfo: tempObj
                    })
                })
            }

        })
    }


	/**
	 * 根据访客类型获取扩展字段
	 * @param {String} type [访客类型]
	 */
	getExtendCol(type){
		Common.ajaxProcWithoutAsync("getExtendTypeInfo",{"userid": sessionStorage.userid,"eType": type},sessionStorage.token).done((res)=>{
			sessionStorage.extendCol = JSON.stringify(res.result);
			this.setState({
                extendList:res.result
            })
		})
    }
    
    /**
     * @description [下一步]
     */
    nextStep(){
        // 签到
        if(this.state.onLogin) {
            // 根据门岗判断是否可以签到
            if(!!$("#gateType").length){
                if(typeof(sessionStorage.gid) != "undefined" && $("#gateType option:selected").val() != sessionStorage.gid){
                    Toast.open({
                        type:"danger",
                        content: "请选择正确的门岗进行签到"
                    })
                    return;
                }
            }else{
                if(typeof(sessionStorage.gid) != "undefined" && (this.state.visitInfo.gid != sessionStorage.gid)&& !!sessionStorage.gateList.length){
                    Toast.open({
                        type:"danger",
                        content: "当前门岗不支持本次签到"
                    })
                    return;
                }
            }

            // 查看必填项
            let required = document.getElementsByClassName('required'),
            reqlength = required.length;
            for (let j = 0; j < reqlength; j++) {
                let item = required[j];
                if (item.value.length === 0) {
                    item.style.borderColor = 'red';
                    Toast.open({
                        type:"danger",
                        content: "请输入完整登记信息"
                    })
                    return;
                }
            }
            
            let sendData = {
                vid: this.state.visitInfo.vid,
                photoUrl: "",
                cardId: this.routerData.idcardContent.certNumber,
                idcontent: this.routerData,
                signin: this.state.visitInfo.signin,
                vcompany: this.state.visitInfo.vcompany,
                visit: this.state.visitInfo,
                extendCol: [],
                action: this.routerData.action,
                qrtype: this.routerData.qrtype,
                remark: this.state.visitInfo.remark
            };

            // 处理扩展字段
            let extendColGroup = this.state.extendCol;
            extendColGroup.empid = this.state.empInfo.ename;
            extendColGroup.visitType = this.state.visitInfo.vtype;
            extendColGroup.phone = this.state.visitInfo.vphone;
            extendColGroup.name = this.state.visitInfo.vname;
            // 20200413 多门岗时 根据被访人的权限进行分配
            if(!extendColGroup.hasOwnProperty("access")){
                if(sessionStorage.sid==0){
                    extendColGroup.access = !sessionStorage.EquipmentAccess?"\"\"":sessionStorage.EquipmentAccess
                }else{
                    extendColGroup.access = !this.state.empInfo.egids?"\"\"":this.state.empInfo.egids
                }
            }
            if(this.state.gatein){
                extendColGroup.gatein= sessionStorage.gname;
                sendData.signInGate = sessionStorage.gname
            }			
            if(this.state.guardin){
                extendColGroup.guardin= sessionStorage.opname;
                sendData.signInOpName = sessionStorage.opname
            }

            let extendColList = []
            for(let i in extendColGroup){
                if(extendColGroup[i] === ""){
                    extendColGroup[i] = "\"\""
                }
                extendColList.push(i+"="+extendColGroup[i])
            }

            sendData.extendCol = extendColList;


            this.props.history.push({pathname:"face",state:sendData})


        }
        // 签出
        else {

            if (this.routerData.qrtype === 'a') {
                this.state.remark = !this.state.remark? "":this.state.remark;
                if (!!this.state.visitInfo.vid) {
                    let sendData ;
                    if(this.routerData.action == 'list'){
                        sendData= {
                            vid: this.state.visitInfo.vid,
                            signOutGate: sessionStorage.gateway,
                            signOutOpName: sessionStorage.opname,
                            remark:this.state.remark
                        }
                    }else {
                        sendData= {
                            aid: this.state.visitInfo.vid,
                            signOutGate: sessionStorage.gateway,
                            signOutOpName: sessionStorage.opname,
                            remark:this.state.remark
                        }
                    }
                    let jqXHR = Common.ajaxProc("VisitorSignOutByVid", sendData, sessionStorage.token);
                    jqXHR.done(function (data) {
                        if (data.status === 0) {
                            Toast.open({
                                type:"success",
                                content: "访客签出成功"
                            })
                        }
                        setTimeout(function () {
                            this.props.history.replace("/home/qrcode")
                            window.changeItem(0,"二维码","qrcode");
                        }.bind(this), 1500);
                    }.bind(this));
                }
                else if (!!this.routerData.visitInfo.vphone) {
                    let sendData = {
                        userid: sessionStorage.userid,
                        phone: this.routerData.visitInfo.vphone,
                        signOutGate: sessionStorage.gateway,
                        signOutOpName: sessionStorage.opname,
                        remark:this.state.remark
                    };
                    let jqXHR = Common.ajaxProc("VisitorSignOut", sendData, sessionStorage.token);
                    jqXHR.done(function (data) {
                        if (data.status === 0) {
                            Toast.open({
                                type:"success",
                                content: "访客签出成功"
                            })

                            window.changeItem(0,"二维码","qrcode");
                        }
                        setTimeout(function () {
                            if(Common.$_Get().idcard == "3"){
                                this.props.history.replace("/home/qrcode")
                                window.changeItem(0,"二维码","qrcode");
                            }else{
                                this.props.history.replace("/home/qrcode")
                                window.changeItem(0,"二维码","qrcode");
                            }
                        }.bind(this), 1500);
                    }.bind(this));
                }
                else {
                    Toast.open({
                        type:"danger",
                        content: "签出失败"
                    })
                }
            }
            else {
                this.state.remark = !this.state.remark? "":this.state.remark;
                let sendData = {
                    vid: this.state.visitInfo.vid,
                    signOutGate: sessionStorage.gateway,
                    signOutOpName: sessionStorage.opname,
                    remark:this.state.remark
                }
                let jqXHR = Common.ajaxProc("VisitorSignOutByVid", sendData, sessionStorage.token);
                jqXHR.done(function (data) {
                    if (data.status === 0) {
                        Toast.open({
                            type:"success",
                            content: "访客签出成功"
                        })

                        window.changeItem(0,"二维码","qrcode");
                    }
                    else {
                        Toast.open({
                            type:"danger",
                            content: "签出失败"
                        })
                    }
                    setTimeout(function () {
                        // $(".menuItem").removeClass("action");
                        if(Common.$_Get().idcard == "3"){
                            // this.props.routerCallback("vistorlist");
                            // $("#vistorlist").addClass("action");
                        }else{
                            // this.props.routerCallback("qrcode");
                            // $("#qrcode").addClass("action");
                        }
                    }.bind(this), 1500);
                }.bind(this));
            }
        }
    }

    /**
     * @description [校验答题]
     * @param {String} email 
     * @param {String} phone 
     * @param {String} cardId 
     */
	checkAnswer(email, phone, cardId){
		if(this.state.answerState){
			return
		}
		let flag = false;
		for(let i = 0;i<arguments.length;i++){
			if(sessionStorage.questionnaireSwitch == 0||((this.routerData.visitDate == this.routerData.appointmentDate)&&this.routerData.visitDate!=null)){
				this.setState({
					answerState:3
				});
				return;
			}
			if(flag){
				continue;
			}
			let item = arguments[i];
			if(!item){
				continue;
			}
			if(this.routerData.tid == "0"||!!this.state.answerState){
				this.setState({
					answerState: 0
				})
				return;
			}
			let _this = this;
			if((typeof item).toLocaleLowerCase() == "object"){
				item = $("#idCardInput").val()
			}
			Common.ajaxProcWithoutAsync("getVisitorTypeByTid",{"tid": _this.routerData.tid,"userid": sessionStorage.userid},sessionStorage.token).done((data)=>{
				if(!data.result.qid){
					flag = true
					this.setState({
						answerState:2
					})
					return
				}
				let getAnswerResult = Common.ajaxProcWithoutAsync("getAnswerResult",{"identity": item,"userid": sessionStorage.userid},sessionStorage.token);
				getAnswerResult.done((res)=>{
					if(!res.result || !res.result.passDate) {
						_this.setState({
							answerState: 0
						})
					} else if ( new Date().getTime() > new Date(new Date(Number(res.result.passDate)).format("yyyy-MM-dd 00:00:00")).getTime()+Number(data.result.povDays)*24*60*60*1000){
						_this.setState({
							answerState: 0
						})
					}else {
						flag = true
						_this.setState({
							answerState: 1
						})
					}
				})
			})

		}
    }
    
    changeInfo(step){
        let count=0
        if(step==1){
            count = this.state.infoOnShow+1;
            count = this.props.history.location.state.length <= count?this.props.history.location.state.length-1:count
            this.routerData = this.props.history.location.state[count];
        }else{
            count = this.state.infoOnShow-1<=0?0:this.state.infoOnShow-1;
            this.routerData = this.props.history.location.state[count];
        }
        this.getExtendCol(this.routerData.vType)
        this.setState({
            infoOnShow: count,
            visitInfo:this.routerData.visitInfo,
            empInfo:this.routerData.empInfo,
            idcardContent:this.routerData.idcardContent,
            extendCol:JSON.parse(this.routerData.empInfo.extendCol.replace(/&quot;/g,'"')),
            qrcodeConf:this.routerData.qrcodeConf,
            visitDate: this.routerData.visitDate,
            appointmentDate: this.routerData.appointmentDate,
            leaveTime: this.routerData.leaveTime,
            tid: this.routerData.tid,
            action: this.routerData.action,
            qrtype: this.routerData.qrtype,
            vgroup: this.routerData.vgroup,
            vType: this.routerData.vType,
            signin:this.routerData.signin,
            cardInfo:{
                name: this.routerData.idcardContent.partyName,
                cardId: this.routerData.idcardContent.certNumber,
                address: this.routerData.idcardContent.address||""
            }
        })

        // 校验答题
        this.checkAnswer(this.routerData.visitInfo.vemail,this.routerData.visitInfo.vphone,this.routerData.idcardContent.certNumber)


        // 获取受访人信息
        this.getEmpInfo(this.routerData.empInfo.ename)
    }

    /**
     * @description [读取卡片信息]
     */
    getCardInfo(){
        let cardInfo;
        switch(Common.$_Get().idcard){
            case "1":
                cardInfo = Common.scanByPassPort();
                this.setState({
                    cardInfo:{
                        name: cardInfo.partyName,
                        cardId: cardInfo.certNumber,
                        address: cardInfo.address||""
                    }
                })
                break;
            case "3":
                window.Android.startActivity("id")
                break;
            default:
                cardInfo = Common.getIdCardInfo();
                this.setState({
                    cardInfo:{
                        name: cardInfo.partyName,
                        cardId: cardInfo.certNumber,
                        address: cardInfo.address||""
                    }
                })
                break;
        }
    }
}