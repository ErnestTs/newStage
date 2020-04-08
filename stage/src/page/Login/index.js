import React, { Component } from 'react';
import './index.css';

import Input from "../../components/Input/index"
import Common from "../../Common/index"

// Toast
import Toast from "../../components/ToastPublic/index.jsx"


/**
 * @author 方超 qq978070462
 * @description [登录页面]
 * @returns {React.Component}
 */

export default class Login extends Component {
    constructor(props){
        super(props)
        this.state={
            username:"",
            password:"",
            code:"",
            digest:"",
            validcode:""
        }
    }
    render(){
        return (
            <div className="page_login">
                <div className="form_box">
                    <p className="title">
                        用户登录
                    </p>
                    
                    <Input 
                        title="账号" 
                        style={{marginBottom:"30px"}}
                        placeholder="请输入用户名/邮箱地址" 
                        onChange={this.setValue.bind(this,"username")}
                        state=""
                    />
                    <Input 
                        title="密码" 
                        type="password"
                        style={{marginBottom:"30px"}}
                        placeholder="请输入密码" 
                        onChange={this.setValue.bind(this,"password")} 
                    />
                    <Input 
                        title="验证码"
                        style={{width:"223px",display:"inline-block","verticalAlign": "middle"}}
                        placeholder="请输入验证码" 
                        id="valideCode"
                        onChange={this.setValue.bind(this,"code")} 
                    />
                    <img id="code-img" src={this.state.validcode} />
                    <span id="refreshCode"  onClick={this.getValideCode.bind(this)}>刷新验证码</span>

                    <div>
                        <div className="btn_login" onClick={this.login.bind(this)}>
                            登录
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    componentDidMount(){
        this.getValideCode();
    }

    /**
     * @description [获取值并渲染至页面]
     * @param {String} key 
     * @param {Event} e 
     */
    setValue(key,e){
        let tempObj = {};
        tempObj[key] = e.target.value
        this.setState(tempObj)
        
    }

    /**
     * @description [获取验证码]
     */
	getValideCode() {
		Common.ajaxProc("getValidationCode", {}).done((data) => {
			this.setState({
				validcode: "data:image/png;base64," + data.result.base64Str,
                digest: data.result.digest,
                code:""
            });
            document.getElementById("valideCode").value = ""
		});
    }
    
    /**
     * @description [登录]
     */
    login(){
        if(!this.state.username){
            Toast.open({
                type:"danger",
                content: "用户名不能为空"
            })
            return
        }else if(!this.state.password){
            Toast.open({
                type:"danger",
                content: "密码不能为空"
            })
            return
        }else if(!this.state.code){
            Toast.open({
                type:"danger",
                content: "验证码不能为空"
            })
            return
        }


        if(this.checkValideCode()){
            var sendData = {
                account: this.state.username,
                password: Common.lftPwdRule(this.state.password, 3, 5),
                digest: this.state.digest
            }
            Common.ajaxProcWithoutAsync("LoginManager",sendData).done((data)=>{
                if (data.status === 0) {
                    let result = data.result;
                    sessionStorage.userid = result.userid;
                    sessionStorage.loginType = "LoginManager";
                    sessionStorage.un = this.state.userName;
                    sessionStorage.ps = this.state.userPwd;
                    sessionStorage.leaveExpiryTime = result.leaveExpiryTime;
                    sessionStorage.badgeMode = result.badgeMode;
                    sessionStorage.badgeCustom = result.badgeCustom;

                    sessionStorage.token = sendData.account + '-' + result.token;
                    sessionStorage.gid = result.gid;
                    sessionStorage.gname = result.gname;
                    

                    /**存储结果用于刷新token,其他session暂不修改 */
                    sessionStorage.result = JSON.stringify(result);


                    this.getCompayInfo(result.userid,result.pemail,this.state.username)

                    this.setState({
                        username: "",
                        password: "",
                        code:"",
                    })
                }
                else if (data.status == 1) {
                    Toast.open({
                        type:"danger",
                        content: "无效的用户 请重新登录"
                    });
                    this.getValideCode()
                }
                else {
                    Toast.open({
                        type:"danger",
                        content: "登录失败 请重新登录"
                    });
                    this.getValideCode()
                }
            })
        }
    }


    /**
     * @description [校验验证码]
     */
    checkValideCode(){
        let sendData = {
            email: this.state.username,
            phone:"",
            digest: this.state.digest,
            vcode: this.state.code
        }
        let res = false
        Common.ajaxProcWithoutAsync('validationCode',sendData).done((data)=>{
            if (data.status !== 0) {
                Toast.open({
                    type:"danger",
                    content: "验证码错误 请重新输入"
                })
                this.getValideCode();
            }else{
                res = true
            }
        })

        return res
    }

    /**
     * @description [获取公司信息]
     * @param {*} userid 
     * @param {*} email 
     * @param {*} method 
     * @param {*} sname 
     */
	getCompayInfo(userid, email, sname) {
		Common.ajaxProcWithoutAsync("GetUserInfo", { userid: userid, email: email }, sessionStorage.token).done(function (data) {
			let result;
			if (data.status === 0) {
				result = data.result;
				sessionStorage.permissionSwitch = result.permissionSwitch;
				sessionStorage.logo = result.logo;
				sessionStorage.offDuty = result.offDuty;
				sessionStorage.cardType = result.cardType;
				sessionStorage.cardSize = result.cardSize;
				sessionStorage.email = result.email;
				sessionStorage.sid = result.subAccount;
				sessionStorage.preExtendTime = result.preExtendTime;
				sessionStorage.latExtendTime = result.latExtendTime;
				sessionStorage.badgeMode = result.badgeMode;
				sessionStorage.badgeCustom = result.badgeCustom;
				sessionStorage.mainCompany = result.company;
				sessionStorage.questionnaireSwitch = result.questionnaireSwitch;
                sessionStorage.jumpSwitch = "1";
                
			}else {
                Toast.open({
                    type:"danger",
                    content: "无效的用户 请重新登录"
                });
                this.getValideCode();
				return;
            }
            
            this.getManagerName(sname, userid);

			let value = Common.$_Get().photo;
			if (value !== '0') {
				sessionStorage.photoSwitch = true;
			}
			else {
				sessionStorage.photoSwitch = false;
			}
		}.bind(this));
    }
    
    

	/**
     * 
     * @param {*} sname 
     * @param {*} userid 
     */
	getManagerName(sname, userid) {
		Common.ajaxProcWithoutAsync("GetManager", { account: sname }, sessionStorage.token).done(function (data) {
			sessionStorage.opname = data.result.sname;
			sessionStorage.company = data.result.company
			this.getExtendVisitor(userid);
		}.bind(this));
    }
    
	/**
	* 获取扩展信息
	* @param {*} userid 
	*/

	getExtendVisitor(userid) {
		Common.ajaxProcWithoutAsync("GetExtendVisitor", { userid: userid }, sessionStorage.token).done(function (data) {
			let result;
			if (data.status === 0) {
				result = data.result;
				sessionStorage.extendCol = JSON.stringify(result);
				this.getGateway();
			}
		}.bind(this));
    }
    
    
	/**
	 * 获取门岗信息
	 */
	getGateway() {
		Common.ajaxProcWithoutAsync("getGate", {userid:sessionStorage.userid}, sessionStorage.token).done(function (data) {
			// 替代为
			if(data.status === 0 && data.result.length !== 0){
				sessionStorage.gateway = sessionStorage.gname
			}else{
				sessionStorage.gateway = "noGate";
			}
			sessionStorage.gateList = JSON.stringify(data.result);
            this.getVisitorTypeByTid();
            
		}.bind(this));
		this.getEquipmentGroupByUserid()
	}

	/**
	 * 添加答题有效日期 tid默认为38 普通访客
	 */
	getVisitorTypeByTid(){
		Common.ajaxProcWithoutAsync("getVisitorTypeByTid", {"userid": sessionStorage.userid,tid: 38}, sessionStorage.token).done((data)=>{
			if(data.result != null){
				sessionStorage.setItem("povDays", data.result.povDays)
			}else {
				sessionStorage.setItem("povDays", 1)
			}
		})
	}

	/**
	 * 获取门岗组信息
	 */
	getEquipmentGroupByUserid(){
		Common.ajaxProcWithoutAsync("getEquipmentGroupByUserid", {"userid": sessionStorage.userid}, sessionStorage.token).done((data)=>{
			let tempArr = data.result;
			let resStr = []
			for(let i = 0; i < tempArr.length; i++){
				// 0-全部 1-员工 2-访客 3-特殊
				if(tempArr[i].etype == 0 || tempArr[i].etype == 2) {

					let gidList = tempArr[i].gids.split(",")
					if(gidList.indexOf(sessionStorage.gid) != -1 || sessionStorage.loginType =="Login"){
						resStr.push(tempArr[i].egid)
					}
				}
			}
            sessionStorage.setItem("EquipmentAccess",resStr.join(","))
            this.props.history.push("/home")
		})
	}
}