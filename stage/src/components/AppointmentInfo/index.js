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
            visitInfo:{
                peopleCount:0,
                vname:"",
                vtime:"",
                vphone:"",
                vtype:"",
                vemail:"",
                vid:"",
                signInGate:"",
                signInOpName:"",
                signOutGate:"",
                signOutOpName:"",
                member:"",
                vcompany:"",
                remark:"",
                leaveTime:"",
                gid:0
            },
            cardInfo:{
                name:"方超",
                cardId:"370202199211043333",
                address:"山东省青岛市市南区湖南路七号平房9户"
            },
			regElementArr: ["appointmentDate", "name", "phone", "visitType", "empid", "access", "meetContent", "meetAddress", "qrcodeConf", "cardId", "email", "gatein", "gateout", "guardin", "guardout", "remark", "vcompany","peopleCount", "sname", "mobile" ],			// 已注册表单单元
        }
    }

    render(){
        // 渲染当前访客状态
        var appointmentState = this.renderItemState({type:1,value:3})

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
                            {this.renderItem("来访人姓名","二牛",{type:0,value:this.state.answerState})}
                            {this.renderItem("预约时间",new Date().format("yyyy-MM-dd hh:mm:ss"),{})}
                            {this.renderItem("来访事由","商务",{})}
                            {this.renderItem("离开时间",new Date().format("yyyy-MM-dd hh:mm:ss"),{})}
                            {this.renderItem("来访人电话","商务",{})}
                            {this.renderItem("被访人姓名","Bárbara Cotilla",{})}
                            {this.renderItem("被访人电话","13853276319",{})}
                            {this.renderItem("被访人部门","测试部",{})}
                            {this.renderItem("被访人位置","B6-B502",{})}
                            {this.renderItem("同行人数","1",{},"peopleCount")}
                            {this.renderItem("来访单位","vcompany",{}, "vcompany")}
                            {this.renderItem("门禁权限","1,2,3,4",{}, "access")}
                            {this.renderItem("会面内容","meetContent",{}, "meetContent")}
                            {this.renderItem("会面地点","meetAddress",{}, "meetAddress")}
                            {this.renderItem("权限时间(天)","1",{}, "meetAddress")}
                            {this.renderItem("身份证号","37020219921104351X",{}, "cardId")}
                            {this.renderItem("邮箱","978070462@gmail.com",{}, "email")}
                        </ul>
                        <ul>
                            {this.renderItem("备注", "我是备注", {},"remark")}
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

                <div id="component_AppointmentInfo_loginBTN">
                    下一步
                </div>
            </div>
        )
    }

    componentDidMount(){
        this.routerData = this.props.history.location.state;
        console.log(JSON.stringify(this.routerData));
    }

    /**
     * @description [渲染节点]
     * @param {String} name [中文名称]
     * @param {String} val [值]
     * @param {Object} state [状态{type:"",value:""}]
     * @param {*} key [识别]
     */
    renderItem( name, val, state, key){
        var state = this.renderItemState(state)
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

}