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

export default class Register extends Component {
    constructor(props){
        super(props)

        this.state= {
            cardInfo:{
                name:"",
                cardId:"",
                address:""
            },
            qrcodeConf:0,
            showCardMask:true,


            visitorType:"",
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
            memberList:[
                {name:"",mobile:""}
            ],

            vTypeList: [],
            vType:"",

            inSubmit:false,

            extendColList:[],

            remark:"",
			regElementArr: ["name","vname", "empid", "empId","empCompany","visitorType", "visitType", "phone","vphone", "gatein", "gateout", "guardin", "guardout","remark"],			// 已注册表单单元
			// regElementArr: ["name", "empid", "phone",  "gatein", "gateout", "guardin", "guardout","remark"],			// 已注册表单单元
        }
    }

    render(){
        return (
            <div id="component_Register">
                <div className="topBar">
                    <div className="fll">来访信息
                    </div>
                    <div className="fll">身份信息</div>
                </div>
                <div className="component_Register_mainBoard">
                    <div className="component_Register_appInfo fll">
                        <ul>
                            <li>
                                <div>
                                    <span className="component_Register_appInfo_key">
                                        {this.state.empidRequired?<span className="required">*</span>:""}被访人公司:
                                    </span>
                                    <span className="component_Register_appInfo_value">
                                        <input type="text" 
                                            value={this.state.empCompany||""}
                                            onChange={this.setCompanyInfo.bind(this)} 
                                            onFocus={(e)=>{
                                                if(!!this.state.empCompany && sessionStorage.sid != 0){
                                                    this.setState({
                                                        empCompanyFocus:true
                                                    })
                                                }
                                            }}
                                            onBlur={(e)=>{
                                                if(!this.state.empCompany){
                                                    this.setState({
                                                        empCompanyFocus:false
                                                    })
                                                }
                                            }}
                                        />
                                    </span>
                                </div>
                                <ul className="companylist" style={{display:this.state.empCompanyFocus?"block":"none"}}>
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
                            </li>
                            <li>
                                <div>
                                    <span className="component_Register_appInfo_key">
                                        {this.state.empidRequired?<span className="required">*</span>:""}被访人姓名:
                                    </span>
                                    <span className="component_Register_appInfo_value">
                                        <input type="text"
                                            value={this.state.empName||""}
                                            onChange={this.setEmpNameInfo.bind(this)}
                                            onFocus={(e)=>{
                                                if(!!this.state.empNameList.length){
                                                    this.setState({
                                                        empNameFocus:true
                                                    })
                                                }
                                            }}
                                        />
                                    </span>
                                </div>
                                <ul className="companylist" style={{display:this.state.empNameFocus?"block":"none"}}>
                                    {this.state.empNameList.map((item,i)=>{
                                        return (
                                            <li 
                                                value={item.empName||""} 
                                                key={i+"li"}
                                                onClick={this.selectEmp.bind(this,item.empName,item.empid,item.empPhone,item.egids)}
                                            >
                                                {item.empName}
                                                <span style={{ display: item.empType === 1 ? "inline" : "none" }}>（默认接待人）</span>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </li>

                            <li>
                                <div>
                                    <span className="component_Register_appInfo_key">
                                        {this.state.nameRequired?<span className="required">*</span>:""}访客姓名:
                                    </span>
                                    <span className="component_Register_appInfo_value">
                                        <input type="text"
                                            value={this.state.vname||""}
                                            onChange={this.setInfo.bind(this, "vname")}
                                        />
                                    </span>
                                </div>
                            </li>

                            <li>
                                <div>
                                    <span className="component_Register_appInfo_key">
                                        {this.state.phoneRequired?<span className="required">*</span>:""}访客手机号:
                                    </span>
                                    <span className="component_Register_appInfo_value">
                                        <input type="text"
                                            value={this.state.vphone||""} 
                                            onChange={this.setInfo.bind(this, "vphone")}
                                        />
                                    </span>
                                </div>
                            </li>

                            <li className="component_Register_Item vtypeBox component_Register_memberBox">
                                <span className="component_Register_appInfo_key">
                                    随访人员：
                                </span>
                                <ul>
                                    {
                                        this.state.memberList.map((item,i)=>{
                                            return (
                                                <li className="memberItem" key={i+"memberItem"}>
                                                    <input type="text" value={item.name} onChange={this.setMember.bind(this,i,'name')} placeholder="随访人员姓名" />
                                                    <input type="text" value={item.mobile} onChange={this.setMember.bind(this,i,'mobile')} placeholder="随访人员手机号" />
                                                </li>
                                            )
                                        })
                                    }
                                    <li id="addMember" onClick={this.addMember.bind(this)}>
                                            添加随访人员
                                    </li>
                                </ul>
                            </li>

                            <li className="component_Register_Item vtypeBox">
                                <span className="component_Register_appInfo_key">
                                    {this.state.visitTypeRequired?<span className="required">*</span>:""}拜访事由：
                                </span>
                                <ul className="component_Register_appInfo_vtypeItemBox">
                                    {
                                        this.state.vTypeList.map((item,i)=>{
                                            return (
                                                <li 
                                                    className={this.state.visitorType == item.name?"action":""}
                                                    key={i+"vType"}
                                                    onClick={
                                                        (e)=>{
                                                            this.setState({
                                                                visitorType:item.name
                                                            })
                                                        }
                                                    }
                                                >
                                                    {item.name}
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </li>
                        </ul>
                        <ul>
                            {
                                this.state.extendColList.map((item,i,arr)=>{

                                    if(this.state.regElementArr.indexOf(item.fieldName) !== -1){
                                        if(item.fieldName == "gatein"||item.fieldName == "guardin"||item.fieldName == "gateout"||item.fieldName == "guardout"){
                                            this.state[item.fieldName] = true
                                        }
                                        return
                                    }
                                    
                                    if(item.inputType == "button"){
                                        return (
                                            this.renderExtendItem_select(item.displayName.split("#")[0],item.fieldName,item) 
                                        )
                                    }else{
                                        return (
                                            this.renderExtendItem(item.displayName.split("#")[0],item.fieldName,item) 
                                        )
                                    }
                                })
                            }
                        </ul>
                        <ul>
                            {this.renderExtendItem("备注","remark",{})}
                        </ul>
                    </div>

                    <div className="component_Register_cardInfo fll">
                        <div id="component_Register_cardInfo_mask" style={{display:this.state.showCardMask?"block":"none"}}>
                            <img src={scanCard} />
                            <p>暂无身份信息</p>
                            <div className="btn_box">
                                <div>
                                    <span>读取证件</span>
                                </div>
                            </div>
                        </div>

                        <div id="component_Register_cardInfo_board" style={{display:!this.state.showCardMask?"block":"none"}}>
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

                <div id="component_Register_loginBTN" onClick={this.updatePhoto.bind(this)}>
                    <span>下一步</span>
                </div>
            </div>
        )
    }

    componentDidMount(){
        this.init()
    }


    /**
     * @description []
     * @param {*} name 
     * @param {*} key 
     * @param {*} required 
     */
    renderExtendItem(name, key, item){
        return (
            <li key={key}>
                <div>
                    <span className="component_Register_appInfo_key">
                        {(item.required&8) == 8?<span className="required">*</span>:""}{name}:
                    </span>
                    <span className="component_Register_appInfo_value">
                        <input type="text"
                            value={this.state[key]||""}
                            onChange={this.setInfo.bind(this, key)}
                        />
                    </span>
                </div>
            </li>
        )
    }
    /**
     * @description []
     * @param {*} name 
     * @param {*} key 
     * @param {*} required 
     */
    renderExtendItem_select(name, key, item){
        let options = item.inputValue.split(",")
        return (
            <li key={key}>
                <div>
                    <span className="component_Register_appInfo_key">
                        {name}:
                    </span>
                    <span className="component_Register_appInfo_value">
                        <select type="text"
                            value={this.state[key]||""}
                            onChange={this.setInfo.bind(this, key)}
                        >
                            {
                                options.map((item, i)=>{
                                    return (
                                        <option value={item} key={i+key+"_option"}>
                                            {item}
                                        </option>
                                    )
                                })
                            }
                        </select>
                    </span>
                </div>
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
     * @description [初始化]
     */
    init(){
        // 获取默认访客类型
        this.getVisitorType();

        if(sessionStorage.sid != 0){
			this.getEmpListByGid()
        }else{
            this.getMainCompanyInfo()
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
	 * @description [根据访客类型获取扩展字段]
	 * @param {String} type [访客类型]
	 */
	getExtendCol(type){
		Common.ajaxProcWithoutAsync("getExtendTypeInfo",{"userid": sessionStorage.userid,"eType": type},sessionStorage.token).done((res)=>{
            let tempArr = [];
            let tempExtendColList = [];
			for(let i = 0; i < res.result.length; i++) {
                if((res.result[i].isDisplay&8) != 8){
                    continue;
                }else{
                    if((res.result[i].required&8) == 8 && this.state.regElementArr.indexOf(res.result[i].fieldName)!== -1){
                        this.state[res.result[i].fieldName+"Required"] = true
                    }
                    tempExtendColList.push(res.result[i])
                }
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
                visitorType:tempArr.length?tempArr[0].name:"",
                vTypeList:tempArr,
                extendColList:tempExtendColList
			})
		})
    }
    
    /**
     * @description [获取主公司员工列表]
     */
    getMainCompanyInfo(){
		Common.ajaxProcWithoutAsync('getSubAccountEmpList', {userid:sessionStorage.userid}, sessionStorage.token).done((data)=>{
			if (data.status === 0 && data.result.length !== 0) {
                let tempArr = [];
                let onShowArr=[]
                for(let i = 0; i < data.result.length;i++){
                    let endDate = 0
                    if(!!data.result[i].endDate){
                        endDate = new Date(data.result[i].endDate.slice(0,4)+"-"+data.result[i].endDate.slice(4,6)+"-"+data.result[i].endDate.slice(6,8)+" 23:59:59").getTime();
                    }
                    if(data.result[i].empType === 1){
                        onShowArr.push(data.result[i])
                    }
                    if(data.result[i].empType === 1||data.result[i].empType === 0||data.result[i].empType === 2){
                        if(new Date().getTime()<endDate||!data.result[i].endDate){
                            tempArr.push(data.result[i])
                        }
                    }
                }
				this.setState({
                    empName:"",
					empNamePool: tempArr,
					empNameList: onShowArr,
                });
                
                // 由于代码更新 暂停使用
				// for(var i = 0; i < data.result.length; i++){
                //     if (data.status === 0 && data.result.length !== 0) {
                //         let tempArr = [];
                //         for(let i = 0; i < data.result.length;i++){
                //             if(data.result[i].empType === 1){
                //                 tempArr.push(data.result[i])
                //             }
                //         }
                //         this.setState({
                //             empName:"",
                //             empNamePool: data.result,
                //             empNameList: tempArr,
                //         });
                //     }
                // }
            }
            this.setState({
                empCompany: sessionStorage.mainCompany,
                empCompanyId:"",
                empCompanyFocus:false
            })
            this.setCompanyInfo = ()=>{}
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
                empName:"",
                empId:""
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
     * @description [点击选择公司]
     */
    selectCompany(value,id){
        let _this = this
		Common.ajaxProc('getSubAccountEmpList', { userid: sessionStorage.userid, subaccountId: id }, sessionStorage.token).done(function (data) {
			if (data.status === 0 && data.result.length !== 0 && !!id) {
                let tempArr = [];
                let onShowArr=[]
                for(let i = 0; i < data.result.length;i++){
                    let endDate = 0
                    if(!!data.result[i].endDate){
                        endDate = new Date(data.result[i].endDate.slice(0,4)+"-"+data.result[i].endDate.slice(4,6)+"-"+data.result[i].endDate.slice(6,8)+" 23:59:59").getTime();
                    }
                    if(data.result[i].empType === 1){
                        onShowArr.push(data.result[i])
                    }
                    if(data.result[i].empType === 1||data.result[i].empType === 0||data.result[i].empType === 2){
                        if(new Date().getTime()<endDate||!data.result[i].endDate){
                            tempArr.push(data.result[i])
                        }
                    }
                }
				_this.setState({
                    empName:"",
					empNamePool: tempArr,
					empNameList: onShowArr,
				});
			}else{
				_this.setState({
                    empName:"",
					empNamePool: [],
					empNameList: [],
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
                empId:"",
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
    selectEmp(value,id,phone,egids){
		let gids = ""
		if(!!sessionStorage.VisitorAccess){
			egids = egids.split(",")
			let VisitorAccess = sessionStorage.VisitorAccess.split(",");
			let tempEgids = []
			for(let i = 0; i < egids.length; i++){
				if(VisitorAccess.indexOf(egids[i]) !== -1){
					tempEgids.push(egids[i])
				}
			}
			gids = tempEgids.join(",")
		}else{
			gids = egids
		}
        this.setState({
            empName: value,
            empId:id,
            empPhone:phone,
            empNameFocus:false,
			egids: gids
        })
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
	 * @description [添加随访人员]
	 */
	addMember(){
        let tempArr = this.state.memberList;
		tempArr.push({name:"",mobile:""})
		this.setState({
			memberList:tempArr
		})
	}
    
	/**
	 * @description [修改随访人员]
	 */
	setMember(index, key, e){
		let tempArr = this.state.memberList;
		tempArr[index][key] = e.target.value
		this.setState({
			memberList:tempArr
		})
	}

    updatePhoto(){
        if(this.state.inSubmit){
            Toast.open({
                type:"danger",
                content: "提交中，请勿重复点击。"
            })
            return
        }
        for(let i = 0;i<this.state.extendColList.length;i++){
            let item = this.state.extendColList[i];
            switch(item.fieldName){
                case "name":
                    item.fieldName = "vname"
                    break;
                
                case "phone":
                    item.fieldName = "vphone"
                    break;
                
                case "visitType":
                    item.fieldName = "visitorType"
                    break;

                case "empid":
                    item.fieldName = "empId"
                    break;
                default:
                    break;
            }
            if((item.required&8) == 8){
                if(!this.state[item.fieldName]){
                    Toast.open({
                        type:"danger",
                        content: "请填入完整的登记信息!"
                    })
                    return
                }
            }
        }

        if(!!this.state.vphone&& !this.checkPhoneNum(this.state.vphone)){
            Toast.open({
                type:"danger",
                content: "手机号码填写有误，请核实！"
            })
            return
        }

        let extendColGroup = [];
        for(let i = 0; i < this.state.extendColList.length;i++){
            let item = this.state.extendColList[i];
            if(!!this.state[item.fieldName]){
                extendColGroup.push(
                    item.fieldName+"="+this.state[item.fieldName]
                )
            }
        }
        if(!!this.state.empId){
            extendColGroup.push("empid=" + this.state.empId);
        }
        if(!!this.state.visitorType){
            extendColGroup.push("visitType=" + this.state.visitorType);
        }
        if(!!this.state.vphone){
            extendColGroup.push("phone=" + this.state.vphone);
        }
        if(!!this.state.vname){
            extendColGroup.push("name=" + this.state.vname);
        }
        if(sessionStorage.sid==0){
            extendColGroup.push("access=" + sessionStorage.EquipmentAccess);
        }else{
            extendColGroup.push("access=" + "\""+this.state.egids+ "\"");
        }
        
        if(this.state.gatein){
            extendColGroup.push("gatein=" + sessionStorage.gname);
        }			
        if(this.state.guardin){
            extendColGroup.push("guardin=" + sessionStorage.opname);
        }


        let card = {
            cardId: this.state.cardInfo.cardId,
            name: this.state.cardInfo.name,
            address: this.state.cardInfo.address,
            issue:"",
            indate:"",
            image:""
        };

        let sendData = {
            email: "",
            extendCol: extendColGroup,
            company: this.state.empCompany||"",
            name: this.state.vname||"",
            visitType: this.state.visitorType||"",
            phone: this.state.vphone||"",
            empid: this.state.empId||"",
            remark: this.state.remark||"",
            signInGate: sessionStorage.gname,
            signInOpName: sessionStorage.opname,
            gid:sessionStorage.gid,
            tid:this.state.tid,
            vType:this.state.vType,
            card: null,
            clientNo: 3,    // 0-pad 1-小程序 2-邀请函 3-礼宾台 4-访客机
        };

        if(!this.state.showCardMask){
            sendData.card = card
        }

        if(!!this.state.plateNum) {
            sendData.plateNum = this.state.plateNum
        }

        if(!!this.state.meetAddress) {
            sendData.meetingPoint = this.state.meetAddress
        }

        if(!!this.state.vcompany) {
            sendData.vcompany = this.state.vcompany
        }

        // if(!($("#peopleCount").length && $("#peopleCount").val())){
        if(!this.state.peopleCount){
            if(!!this.state.memberList.length){
                let tempArr = [];
                for(let i = 0; i < this.state.memberList.length; i++){
                    if(!!this.state.memberList[i].name){
                        tempArr.push(this.state.memberList[i])
                    }
                }
                if(!!tempArr.length){
                    sendData.extendCol.push("peopleCount="+(tempArr.length+1));
                    sendData.peopleCount = tempArr.length+1
                }else {
                    sendData.extendCol.push("peopleCount="+1);
                    sendData.peopleCount = 1
                }
                if(!!tempArr.length){
                    sendData.memberName=JSON.stringify(tempArr)
                }
            }else{
                sendData.extendCol.push("peopleCount="+1);
                sendData.peopleCount = 1
            }
        }else {
            sendData.peopleCount = this.state.peopleCount
        }
			
        /**设置为提交状态 */
        this.state.inSubmit = true
        Common.ajaxProc("UpdatePhoto", sendData, sessionStorage.token).done(function (data) {
            if (data.status === 0) {
                sessionStorage.vid = data.result.vid;
                Toast.open({
                    type:"success",
                    content: "现场登记成功！!"
                })
                sessionStorage.memberList = JSON.stringify(data.result.glist)
                let tempArr = data.result.glist;
                tempArr.unshift({vid:data.result.vid})
                
                setTimeout(() => {
                    this.props.history.replace({pathname:"print",state:{printList:tempArr}})
                }, 2000);
            }else if(data.status === 66){
                Toast.open({
                    type:"danger",
                    content: "该访客已在黑名单中!"
                })
            }
            this.setState({
                inSubmit: false,
                vistorName: "",
                vistorPhone: ''
            });
        }.bind(this));
    }
}