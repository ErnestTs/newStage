import React,{Component} from "react"

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
            answerState:0,
            showCardMask:true,
            visitInfo:{},
            idcardContent:{},
            empInfo:{},
            cardInfo:{
                name:"方超",
                cardId:"370202199211043333",
                address:"山东省青岛市市南区江苏路七号9户"
            },
            extendCol:{},
            qrcodeConf:0,
            extendList:[],
			regElementArr: ["appointmentDate", "name", "phone", "visitType", "empid", "access", "meetContent", "meetAddress", "qrcodeConf", "cardId", "email", "gatein", "gateout", "guardin", "guardout", "remark", "vcompany","peopleCount", "sname", "mobile" ],			// 已注册表单单元
        }
    }

    render(){
        // 渲染当前访客状态
        var appointmentState_val = 1;
        if(!!this.state.leaveTime){
            appointmentState_val = 3
        }else if(!!this.state.visitDate){
            appointmentState_val = 2
        }else if(this.state.permission == 0){
            appointmentState_val = 0
        }
        var appointmentState = this.renderItemState({type:1,value:appointmentState_val})
        return (
            <div id="component_AppointmentInfo">
                <div className="topBar">
                    <div className="fll">来访信息
                    {appointmentState}
                    </div>
                    <div className="fll">身份信息</div>
                </div>
                <div className="component_AppointmentInfo_mainBoard">
                    <div className="component_AppointmentInfo_appInfo fll">
                        <ul>
                            {this.renderItem("来访人姓名",this.state.visitInfo.vname,"vname",{type:0,value:this.state.answerState})}
                            {this.renderItem("预约时间",this.state.visitInfo.vtime)}
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
                                        return
                                    }
                                    if((item.isDisplay&1) != 1){
                                        return
                                    }
                                    console.log(item)
                                    return (
                                        this.renderExtendItem(item.displayName.split("#")[0],item.fieldName) 
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
                                        return this.renderExtendItem("备注","remark")
                                    }
                                })()
                                
                            }
                        </ul>
                    </div>

                    <div className="component_AppointmentInfo_cardInfo fll">
                        <div id="component_AppointmentInfo_cardInfo_mask" style={{display:this.state.showCardMask?"block":"none"}}>
                            <img src={scanCard} />
                            <p>暂无身份信息</p>
                            <div className="btn_box">
                                <div>读取证件</div>
                            </div>
                        </div>

                        <div id="component_AppointmentInfo_cardInfo_board" style={{display:!this.state.showCardMask?"block":"none"}}>
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

                <div id="component_AppointmentInfo_loginBTN" onClick={this.nextStep.bind(this)}>
                    下一步
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


        this.routerData = this.props.history.location.state;
        // console.log(JSON.stringify(this.routerData))

        console.log(this.routerData)

        this.getExtendCol(this.routerData.vType)
        this.setState({
            visitInfo:this.props.history.location.state.visitInfo,
            empInfo:this.props.history.location.state.empInfo,
            idcardContent:this.props.history.location.state.idcardContent,
            extendCol:JSON.parse(Common.compileStr(_this.props.history.location.state.empInfo.extendCol).replace("\"\"\"\"","\"\'\'\"")),
            qrcodeConf:this.props.history.location.state.qrcodeConf
        })


        // 获取受访人信息
        this.getEmpInfo(this.routerData.empInfo.ename)
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
     * @param {*} value 
     */
    renderExtendItem(name, key, value){
        value = !!value?value:"";
        return (
            <li key={key}>
                <span className="component_AppointmentInfo_appInfo_key">
                    {name}:
                </span>
                <input id={key} className="component_AppointmentInfo_appInfo_input" onChange={this.setExtendValue.bind(this,key)} value={this.state.extendCol[key]} />
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
                    tempObj.dept = data.result[0].deptName;
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
}