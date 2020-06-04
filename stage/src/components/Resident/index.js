import React,{Component} from "react"
import $ from "jquery"

import Common from "../../Common/index"

import "./index.css"

// Toast
import Toast from "../../components/ToastPublic/index.jsx"

export default class Resident extends Component {
    constructor(props){
        super(props)
        this.state={
            rid:"",
            visitor:{}
        }
    }

    render (){
        let visitor = this.state.visitor,
            sex = visitor.sex;
        if (sex !== undefined && sex !== null) {
            sex = sex === 0 ? "女" : "男"
        }
        return (
            <div id="component_Resident">
                <div id="residentAvatar">
                    <img src={visitor.avatar} alt="" />
                </div>

                <div id="residentContent">
                    <div id="residentleft">
                        <div className="residentList">
                            <span>访客姓名:</span>
                            <span className={"residentitem"}>{visitor.name}</span>
                        </div>
                        <div className="residentList">
                            <span>访客年龄:</span>
                            <span className={"residentitem"}>{visitor.age}</span>
                        </div>
                        <div className="residentList">
                            <span>访客性别:</span>
                            <span className={"residentitem"}>{sex}</span>
                        </div>
                        <div className="residentList">
                            <span>工作单位:</span>
                            <span className={"residentitem"}>{visitor.company}</span>
                        </div>
                        <div className="residentList">
                            <span>访问区域:</span>
                            <span className={"residentitem"}>{visitor.area}</span>
                        </div>
                        <div className="residentList">
                            <span>有效日期:</span>
                            <span className={"residentitem"}>{visitor.endDate}</span>
                        </div>
                    </div>
                    <div id="residentright">
                        <div className="residentList">
                            <span>负责人:</span>
                            <span className={"residentitem"}>{visitor.leader}</span>
                        </div>
                        <div className="residentList">
                            <span>联系方式:</span>
                            <span className={"residentitem"}>{visitor.phone}</span>
                        </div>
                        <div className="residentList">
                            <span>业务部门:</span>
                            <span className={"residentitem"}>{visitor.department}</span>
                        </div>
                        <div className="residentList">
                            <span>常驻项目:</span>
                            <span className={"residentitem"}>{visitor.pName}</span>
                        </div>
                        <div className="residentList">
                            <span>工作内容:</span>
                            <span className={"residentitem"}>{visitor.job}</span>
                        </div>
                        <div className="residentList">
                            <span>备注:</span>
                            <span className={"residentitem"}>{visitor.remark}</span>
                        </div>
                    </div>
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
        this.setState({
            rid:this.routerData.rid
        },()=>{
            this.getResidentVisitorByRid(this.routerData.rid)
        })
    }

    /**
     * @description [通过rid获取常驻人员]
     * @param {*} rid 
     */
    getResidentVisitorByRid(rid) {
        let sendData = {
            rid: rid,
            userid: sessionStorage.userid
        };
        let _this = this;

        Common.ajaxProc("getResidentVisitorByRid", sendData, sessionStorage.token).done(function (data) {
            if (data.status === 0 && data.result !== null) {
                if(data.result.rstatus != 1) {
                    Toast.open({
                        type:"danger",
                        content: "该访客未授权，请联系负责人进行审批!"
                    })
                    return;
                }else{
                    _this.getVisitorSignOut(data.result);
                }
            }else{
                Toast.open({
                    type:"danger",
                    content: "没有查询到常驻访客信息!"
                })
                return;
            }
        })
    }


    /**
     * 使用rid替代phone进行签出记录查询
     */
    getVisitorSignOut(result) {
        let sendData = {
            userid: result.userid,
            cardId: result.rid
        };
        Common.ajaxProc("getVisitorSignOutByPhone", sendData, sessionStorage.token).done(function (data) {
            /**有预约记录 */
            if (data.result.length !== 0) {
                this.setState({
                    status: 0,
                    visitor: result,
                    vid: data.result[0].vid
                });
                this.residentSignOut();
                
            }
            /**无预约记录 */
            else {
                let endDate = new Date(result.endDate).getTime();
                let nowDate = new Date().getTime();
                if (nowDate > endDate) {
                    Toast.open({
                        type:"danger",
                        content: "该访客的常驻权限已到期!"
                    })
                    return;
                }
                else {
                    this.setState({
                        visitor: result
                    });
                    this.residentSignin();
                }
            }
        }.bind(this));
    }


    /** 常驻访客签到 */
    residentSignin() {
        let visitor = this.state.visitor;
        let sendData = {
            name: visitor.name,
            visitType: "常驻访客",
            userid: sessionStorage.userid,
            empName: visitor.leader,
            photoUrl: visitor.avatar,
            extendCol: [],
            vcompany: visitor.company,
            peopleCount: 1,
            cardId: visitor.rid,
			signInOpName: sessionStorage.opname,            
            signInGate: sessionStorage.gateway,
            gid:sessionStorage.gid
        }
        Common.ajaxProc("ResidentVisitorSignIn", sendData, sessionStorage.token).done(function (data) {
            if (data.status === 0) {
                Toast.open({
                    type:"success",
                    content: "常驻访客签入成功!"
                })
                setTimeout(()=>{
                    window.changeItem(0,"二维码","qrcode");
                },3000)
                return;
            }
        }.bind(this));
    }

    /**
     * 常驻访客签出
     */
    residentSignOut() {
        let sendData = {
            vid: this.state.vid,
            signOutGate: sessionStorage.gateway,
            signOutOpName: sessionStorage.opname
        };
        Common.ajaxProc("VisitorSignOutByVid", sendData, sessionStorage.token).done(function (data) {
            if (data.status === 0) {
                Toast.open({
                    type:"success",
                    content: "常驻访客已签出!"
                })
                setTimeout(()=>{
                    window.changeItem(0,"二维码","qrcode");
                },3000)
                return;
            }
        }.bind(this));
    }
}