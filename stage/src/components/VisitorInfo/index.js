import React,{Component} from "react"

import Common from "../../Common/index"

import "./index.css"

// Toast
import Toast from "../../components/ToastPublic/index.jsx"

/**
 * @author 方超 qq978070462
 * @description [现场预约组件]
 * @returns {React.Component}
 */


export default class VisitorInfo extends Component {
    constructor(props){
        super(props)
        this.state= {
            visitorType:"",
            visitorTypeList: [],

            empCompanyFocus:false,
            empCompany:"",
            empCompanyId:"",
            empCompanyPool:[],
            empCompanyList:[],

            empNameFocus:false,
            empName:"",
            empId:"",
            empPhone:"",
            empNamePool:[],
            empNameList:[],

            vname:"",
            vphone:"",

            vType:"",
            tid:"",

            inSubmit:false
        }
    }

    render(){
        return (
            <div id="component_VisitorInfo">
                {/* <div className="titleBox">
                    <p className="title">预约信息</p>
                    <p>请填写下面的信息</p>
                </div> */}
                <div className="component_VisitorInfo_board">
                    <ul>
                        <li className="component_VisitorInfo_Item">
                            <p>
                                您的姓名：
                            </p>
                            <input 
                                placeholder="请输入您的姓名"
                                value={this.state.vname||""}
                                onChange={this.setInfo.bind(this, "vname")}
                                onFocus={(e)=>{
                                    e.target.classList.add("action");
                                }}
                                onBlur={(e)=>{
                                    e.target.classList.remove("action");
                                }}
                            />
                        </li>
                        <li 
                            className="component_VisitorInfo_Item"
                        >
                            <p>
                                您要拜访的公司：
                            </p>
                            <input 
                                className=""
                                placeholder="请输入您要拜访公司的名称" value={this.state.empCompany||""}  onChange={this.setCompanyInfo.bind(this)} 
                                onClick={(e)=>{
                                    e.target.classList.add("action");
                                    if(!!this.state.empCompany){
                                        this.setState({
                                            empCompanyFocus:true
                                        })
                                    }
                                }}
                                onBlur={(e)=>{
                                    e.target.classList.remove("action");
                                    if(!this.state.empCompany){
                                        this.setState({
                                            empCompanyFocus:false
                                        })
                                    }
                                }}
                            />
                            <div className="itemBoard">
                                <ul className="list" style={{display:this.state.empCompanyFocus?"block":"none"}}>
                                    {this.state.empCompanyList.map((item,i)=>{
                                        return (
                                            <li 
                                                value={item.id||""} 
                                                key={i+"li"}
                                                onClick={this.selectCompany.bind(this,item.companyName,item.id)}
                                            >
                                                {item.companyName}
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </li>
                        <li 
                            className="component_VisitorInfo_Item"
                        >
                            <p>
                                您要拜访的人：
                            </p>
                            <input 
                                className=""
                                placeholder="请输入您要拜访人的姓名" value={this.state.empName||""}  onChange={this.setEmpNameInfo.bind(this)}
                                onFocus={(e)=>{
                                    e.target.classList.add("action");
                                    if(!!this.state.empNameList.length){
                                        this.setState({
                                            empNameFocus:true
                                        })
                                    }
                                }}
                                onBlur={(e)=>{
                                    e.target.classList.remove("action");
                                }}
                            />
                            <div className="itemBoard">
                                <ul className="list" style={{display:this.state.empNameFocus?"block":"none"}}>
                                    {this.state.empNameList.map((item,i)=>{
                                        return (
                                            <li 
                                                value={item.empName||""} 
                                                key={i+"li"}
                                                onClick={this.selectEmp.bind(this,item.empName,item.empid,item.empPhone)}
                                            >
                                                {item.empName}
                                                <span style={{ display: item.empType === 1 ? "inline" : "none" }}>（默认接待人）</span>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </li>

                        <li className="component_VisitorInfo_Item">
                            <p>
                                拜访事由：
                            </p>
                            <select 
                                value={this.state.visitorType||""} 
                                onChange={(e)=>{
                                    this.setState({visitorType:e.target.value})
                                }}
                            >
                                {
                                    this.state.visitorTypeList.map((item,i)=>{
                                        return (
                                            <option key={i+"vType"} value={item.value}>
                                                {item.name}
                                            </option>
                                        )
                                    })
                                }
                            </select>
                        </li>
                        <li className="component_VisitorInfo_Item">
                            <p>
                                您的电话：
                            </p>
                            <input 
                                placeholder="请输入您的电话"
                                value={this.state.vphone||""} 
                                onChange={this.setInfo.bind(this, "vphone")}
                                onFocus={(e)=>{
                                    e.target.classList.add("action");
                                }}
                                onBlur={(e)=>{
                                    e.target.classList.remove("action");
                                }}
                            />
                        </li>
                    </ul>
                </div>


                <div id="component_VisitorInfo_loginBTN" onClick={this.nextStep.bind(this)}>
                    <span>下一步</span>
                </div>
            </div>
        )
    }

    componentDidMount(){
        this.init()
    }

    /**
     * @description [下一步]
     */
    nextStep(){
        if(this.state.inSubmit){
            Toast.open({
                type:"danger",
                content: "提交中，请勿重复点击。"
            })
            return
        }
        let {vname,vphone,vType,empCompany,empName,empPhone,empId,visitorType,tid} = this.state;

        if(!vname||!vphone||!visitorType||!empCompany||!empName){
            Toast.open({
                type:"danger",
                content: "请填入完整的登记信息!"
            })
            return
        }

		if(!this.checkPhoneNum(vphone)){
            Toast.open({
                type:"danger",
                content: "手机号码填写有误，请核实！"
            })
			return;
		}

		let sendData = {
			company: empCompany,
			userid: sessionStorage.userid,
			ctype: sessionStorage.sid=="0"?'u':"s",
			name: vname,
			phone: vphone,
			empPhone: empPhone,
			empName: empName,
			empid: empId,
			appointmentDate: new Date().format("yyyy-MM-dd hh:mm:ss"),
			visitType: visitorType,
			peopleCount: 1,
			memberName: "",
			gid:sessionStorage.gid,
            vType:vType,
            tid:tid
        };
        
        this.state.inSubmit = true

        Common.ajaxProc("addVisitorApponintmnet", sendData, sessionStorage.token).done((data)=>{
			if (data.status === 0) {
                Toast.open({
                    type:"success",
                    content: "现场预约提交成功!"
                })
				setTimeout(function (data) {
					if(Common.$_Get().idcard == "3"){
                        window.changeItem(4, "今日访客", "visitor")
                        this.props.history.push("/home/visitor")
					}else{
                        window.changeItem(0,"二维码","qrcode")
                        this.props.history.push("/home/qrcode")
					}
				}.bind(this), 3000);
			}
			else if (data.status === 43) {
                Toast.open({
                    type:"danger",
                    content: "该访客当天预约次数已用完"
                })
                return;
			}
			else if (data.status === 1119) {
                Toast.open({
                    type:"danger",
                    content: "被访人手机信息不完全"
                })
                return;
			}else if(data.status === 66){
                Toast.open({
                    type:"danger",
                    content: "该访客已在黑名单中"
                })
                return;
			}
			else {
                Toast.open({
                    type:"danger",
                    content: "预约失败,请联系管理员"
                })
                return;
			}
			this.setState({
				vistorName: "",
				vistorPhone: "",
				inSubmit: false
			});
        })


    }
	
	/**
	 * @description [校验手机号码是否合法]
	 * @param {String} phone 
	 * @returns {Boolean} true-合法手机号 false-非法手机号
	 */
	checkPhoneNum(phone) {
		if(!(/^1[3456789]\d{9}$/.test(phone))){
			return false; 
		}else{
			return true
		}
	}

    /**
     * @description [修改信息]
     * @param {String} name 
     * @param {Event} e 
     */
    setInfo(name,e){
        let tempObj = this.state
        tempObj[name] = e.target.value
        this.setState(tempObj)
    }

    /**
     * @description [输入受访公司]
     */
    setCompanyInfo(e){
        let key = e.target.value
        if(!key.length){
            this.setState({
                empCompany:"",
                empCompanyFocus:false,
                empNameFocus:false,
                empCompanyList: [],
                empNameList:[],
                empNamePool:[],
                empName:""
            })
        }else {
            this.state.empCompanyList = [];
            for (let i = 0; i < this.state.empCompanyPool.length; i++) {
                let item = this.state.empCompanyPool[i];
                let company = item.companyName;
                if (company.indexOf(key) !== -1) {
                    this.state.empCompanyList.push(item);
                }
            }
            if (this.state.empCompanyList.length !== 0) {
                this.setState({
                    empCompany:key,
                    empCompanyFocus: true
                });
            }
            else {
                this.setState({
                    empCompany:key,
                    empCompanyFocus: false
                });
            }
        }
    }

    /**
     * @description [初始化]
     */
    init(){
        // 获取默认访客类型
        this.getVisitorType();

        if(sessionStorage.sid != 0){
			this.getEmpListByGid()
        }else{

        }
    }

    /**
     * @description [获取默认访客类型]
     */
	getVisitorType (){
		Common.ajaxProcWithoutAsync("getVisitorType ",{"userid": sessionStorage.userid, 'category':2},sessionStorage.token).done((res)=>{
            if(res.status == 0 && !!res.result.length){
                this.state.vType = res.result[0].vType
                this.state.tid = res.result[0].tid
                this.getExtendCol(res.result[0].vType)
            }
		})
    }

    /**
     * @description [获取字段下标]
     * @param {*} type 
     */
    getItemIndex(key){
        let res = 0;
        let tempArr = this.state.itemList;
        for(let i = 0; i < tempArr.length; i++){
            if(tempArr[i].name == key){
                res = i;
                break;
            }
        }
        return res
    }
    
	/**
	 * @description [根据访客类型获取扩展字段]
	 * @param {String} type [访客类型]
	 */
	getExtendCol(type){
		Common.ajaxProcWithoutAsync("getExtendTypeInfo",{"userid": sessionStorage.userid,"eType": type},sessionStorage.token).done((res)=>{
            let tempArr = [];
			for(let i = 0; i < res.result.length; i++) {
				if(res.result[i].fieldName == "visitType"){
                    let optionArr = res.result[i].inputValue.split(",");
                    for(let j = 0; j < optionArr.length; j++){
                        tempArr.push({
                            name: optionArr[j],
                            value: optionArr[j]
                        })
                    }
				}
			}
			this.setState({
                visitorTypeList:tempArr,
                visitorType:tempArr[0].name
			})
		})
    }
    

	/**
	 * @description [根据门岗获取公司]
	 */
	getEmpListByGid(){
		var _this = this;
		Common.ajaxProcWithoutAsync('getSubAccountByUserid', {userid:sessionStorage.userid}, sessionStorage.token).done(function (data) {
			if (data.status === 0 && data.result.length !== 0) {
				var tempArr = [];
                var gid = sessionStorage.gid;
				for(var i = 0; i < data.result.length; i++){
					if(!data.result[i].gids||(data.result[i].vaPerm&2)!==2){
						continue;
                    }
					let gids = data.result[i].gids.split(",")
					if(gids.indexOf(gid)!== -1){
						tempArr.push(data.result[i])
					}
                }
				_this.setState({
                    empCompanyPool: tempArr,
                    empCompanyList: []
				});
			}
		})
    }
    
    /**
     * @description [点击选择公司]
     */
    selectCompany(value,id){
        let _this = this
		Common.ajaxProc('getSubAccountEmpList', { userid: sessionStorage.userid, subaccountId: id }, sessionStorage.token).done(function (data) {
			if (data.status === 0 && data.result.length !== 0 && !!id) {
                let tempArr = [];
                for(let i = 0; i < data.result.length;i++){
                    if(data.result[i].empType === 1){
                        tempArr.push(data.result[i])
                    }
                }
				_this.setState({
                    empName:"",
					empNamePool: data.result,
					empNameList: tempArr,
				});
			}
		})
        this.setState({
            empCompany: value,
            empCompanyId:id,
            empCompanyFocus:false
        })
    }


    /**
     * @description [输入受访员工]
     */
    setEmpNameInfo(e){
        let key = e.target.value
        if(!key.length){
            this.setState({
                empName:"",
                empNameFocus:false
            })
        }else {
            this.state.empNameList = [];
            for (let i = 0; i < this.state.empNamePool.length; i++) {
                let item = this.state.empNamePool[i];
                let empName = item.empName;
                if (empName.indexOf(key) !== -1||item.empType === 1) {
                    this.state.empNameList.push(item);
                }
            }
            if (this.state.empNameList.length !== 0) {
                this.setState({
                    empName:key,
                    empNameFocus: true
                });
            }
            else {
                this.setState({
                    empName:key,
                    empNameFocus: false
                });
            }
        }
    }

    
    /**
     * @description [点击选择员工]
     */
    selectEmp(value,id,phone){
        this.setState({
            empName: value,
            empId:id,
            empPhone:phone,
            empNameFocus:false
        })
    }
}