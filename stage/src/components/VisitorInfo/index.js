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
import scanFace from "../../resource/scanFace.png"
import toastIcon from "../../resource/toastIcon.png"

export default class VisitorInfo extends Component {
    uploadBlob;

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

            empCompanyFloorList:[],
            empCompanyFloorListOnShow:[],
            empCompanyFloor:"",
            empCompanyFloorFocus:false,
            empCompanyFloorKey:"",

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

            photoURL:"",
            faceState:false,
            tempCard:"",
            openToast:0, // 1-发卡 2-其他提示 3-提示发卡
            toastContent:"",

            elevatorContro_time:false,  // 梯控

            sexType:1, // 0-女 1-男

            vaPerm:3,
            faceLoading:false,

            remark:"",
			regElementArr: ["name","vname", "empid", "empId","empCompany","visitorType", "visitType", "phone","vphone", "gatein", "gateout", "guardin", "guardout","remark","appointmentDate","pCardDate"],			// 已注册表单单元
			// regElementArr: ["name", "empid", "phone",  "gatein", "gateout", "guardin", "guardout","remark"],			// 已注册表单单元
        }
    }

    render(){
        return (
            <div id="component_Register">
                <div className="topBar">
                    <div className="fll">来访信息
                    {this.renderItemState({type:2,value:this.state.vaPerm})}
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
                                            value={this.state.empCompany.split("#")[0]||""}
                                            onChange={this.setCompanyInfo.bind(this)} 
                                            onFocus={(e)=>{
                                                if(!!this.state.empCompany){
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
                                                onClick={this.selectCompany.bind(this,item)}
                                            >
                                                {item.companyName.split("#")[0]}
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
                                        {this.state.empidRequired?<span className="required">*</span>:""}门禁权限:
                                    </span>
                                    <span className="component_Register_appInfo_value">
                                        <input type="text"
                                            value={this.state.empCompanyFloor||""}
                                            onChange={this.changeFloor.bind(this)}
                                            onFocus={(e)=>{
                                                if(!!this.state.empNameList.length){
                                                    this.setState({
                                                        empCompanyFloorFocus:true
                                                    })
                                                }
                                            }}
                                        />
                                    </span>
                                </div>
                                <ul className="companylist" style={{display:this.state.empCompanyFloorFocus?"block":"none"}}>
                                    {this.state.empCompanyFloorListOnShow.map((item,i)=>{
                                        return (
                                            <li 
                                                value={item.name||""}
                                                key={i+"li"}
                                                className={item.def?"defAccess":""}
                                                onClick={
                                                    (e)=>{
                                                        this.setState({
                                                            empCompanyFloor:item.name,
                                                            empCompanyFloorFocus:false,
                                                            empCompanyFloorKey:item.egid,
                                                            elevatorContro_time:Common.checkPassConfig([item.name])
                                                        })
                                                    }
                                                }
                                            >
                                                {item.name}
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
                                            onBlur={this.vphoneOnBlur.bind(this)}
                                        />
                                    </span>
                                </div>
                            </li>

                            <li style={{display:this.state.sexType ==2?"none":"block"}} className="component_Register_Item vtypeBox">
                                <span className="component_Register_appInfo_key">
                                    <span className="required">*</span>访客性别：
                                </span>
                                <ul className="component_Register_appInfo_sexTypeBox">
                                    <li 
                                        className={this.state.sexType == 1?"action":""}
                                        onClick={
                                            (e)=>{
                                                this.setState({
                                                    sexType:1
                                                })
                                            }
                                        }
                                    >
                                        男
                                    </li>
                                    <li 
                                        className={this.state.sexType == 0?"action":""}
                                        onClick={
                                            (e)=>{
                                                this.setState({
                                                    sexType:0
                                                })
                                            }
                                        }
                                    >
                                        女
                                    </li>
                                </ul>
                            </li>

                            {/* <li className="component_Register_Item vtypeBox component_Register_memberBox">
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
                            </li> */}

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
                                                    {item.name.split("#")[0]}
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
                            <div id="component_Register_cardInfo_mask_photoBox">
                                <div id="Register_facePhoto" style={{ display: this.state.photoSwitch ? 'block' : 'none' }}>
                                    <div id="cameraPanel">
                                        <img alt="" id="Register_camera_img" />
                                    </div>
                                </div>
                                <img style={{ opacity: !this.state.photoSwitch ? '1' : '0' }} src={scanFace} />
                            </div>
                            <p>{!this.state.tempCard?"请告知访客采集人脸注意事项并询问是否同意采集人脸":"已发卡号："+this.state.tempCard}</p>
                            <div className="btn_box">
                                <div onClick={this.openCamera.bind(this)}>
                                    <span>{this.state.photoSwitch ?"拍照":"调用摄像头"}</span>
                                </div>
                                <div onClick={this.sendCard.bind(this)}>
                                    <span>发卡</span>
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
                    <span>确定</span>
                </div>

                <div style={{display:this.state.openToast?"block":"none"}} id="component_Register_Toast">
                    <div style={{display:this.state.openToast == 1?"block":"none"}} id="component_Register_tempCardBox">
                        <p className="title">发卡</p>
                        <div className="inputBox">
                            <span>申请卡号：</span>
                            <input 
                                type="text"
                                value={this.state.tempCard}
                                onChange={(e)=>{this.setState({tempCard:e.target.value})}}
                                ref={(input) => this.inputRef = input}
                            />
                        </div>
                        <ul className="btnGroup">
                            <li onClick={this.closeTempCardBox.bind(this)}>
                                取消
                            </li>
                            <li onClick={this.setTempCard.bind(this,0)}>
                                确定
                            </li>
                        </ul>
                    </div>
                    <div style={{display:this.state.openToast == 2?"block":"none"}} id="component_Register_ToastBox">
                        <p id="component_Register_tempCardBox_icon">
                            <img src={toastIcon} style={{width:"100%"}} />
                        </p>
                        <div className="inputBox">
                            {this.state.toastContent}
                        </div>
                        <ul className="btnGroup">
                            <li onClick={this.setToast.bind(this,0)}>
                                知道了
                            </li>
                        </ul>
                    </div>
                    <div style={{display:this.state.openToast == 3?"block":"none"}} id="component_Register_ToastBox">
                        <p id="component_Register_tempCardBox_icon">
                            <img src={toastIcon} style={{width:"100%"}} />
                        </p>
                        <div className="inputBox">
                            该时段需要梯控
                        </div>
                        <ul className="btnGroup">
                            <li onClick={this.setToast.bind(this,1)}>
                                发卡
                            </li>
                        </ul>
                    </div>
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
                        {(item.required&2) == 2?<span className="required">*</span>:""}{name}:
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

        }

		let flash = document.createElement("embed");
		flash.setAttribute("src", Common.cameraUrl);
		flash.setAttribute("style", "z-index:100");
		flash.setAttribute("pluginspage", "http://www.macromedia.com/go/getflashplayer");
		flash.setAttribute("quality", "high");
		flash.setAttribute("allowscriptaccess", "sameDomain");
		flash.setAttribute("wmode", "transparent");
		flash.setAttribute("type", "application/x-shockwave-flash");
		flash.setAttribute("id", "camera");
		flash.setAttribute("align", "middle");
		flash.setAttribute("name", "My_Cam");
		
        document.getElementById("cameraPanel").appendChild(flash);
        
        let cameraOffsetWidth = document.getElementById("component_Register_cardInfo_mask_photoBox").offsetWidth+"px"
        document.getElementById("component_Register_cardInfo_mask_photoBox").style.height = cameraOffsetWidth;
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
                if((res.result[i].isDisplay&2) != 2){
                    continue;
                }else{
                    if((res.result[i].required&2) == 2 && this.state.regElementArr.indexOf(res.result[i].fieldName)!== -1){
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
                visitorType:tempArr[0].name,
                vTypeList:tempArr,
                extendColList:tempExtendColList
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
					if(gids.indexOf(gid)!== -1&&data.result[i].isUse == 1){
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
                empCompanyId:"",
                empCompanyFocus:false,
                empNameFocus:false,
                empCompanyList: [],
                empNameList:[],
                empNamePool:[],
                empName:"",
                empId:"",
                empCompanyFloor:"",
                empCompanyFloorList:[],
                empCompanyFloorListOnShow:[]
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
                    empCompanyFocus: true,
                    empCompanyFloor:"",
                    empCompanyFloorList:[],
                    empCompanyFloorListOnShow:[]
                });
            }
            else {
                this.setState({
                    empCompany:key,
                    empCompanyFocus: false,
                    empCompanyFloor:"",
                    empCompanyFloorList:[],
                    empCompanyFloorListOnShow:[]
                });
            }
        }
    }
    
    /**
     * @description [点击选择公司]
     */
    selectCompany(item){
        let _this = this
        let value = item.companyName;
        let id = item.id;
        let floor = item.floor
        this.setState({
            vaPerm:(item.vaPerm&4)==4?0:1
        });
		Common.ajaxProc('getSubAccountEmpList', { userid: sessionStorage.userid, subaccountId: id }, sessionStorage.token).done(function (data) {
			if (data.status === 0 && data.result.length !== 0 && !!id) {
                let tempArr = [];
                for(let i = 0; i < data.result.length;i++){
                    if(data.result[i].empType === 1||data.result[i].empType === 0){
                        tempArr.push(data.result[i])
                    }
                }
				_this.setState({
                    empName:"",
					empNamePool: data.result,
                    empNameList: tempArr,
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
                empNameFocus:false,
                empCompanyFloor:"",
                empCompanyFloorList:[],
                empCompanyFloorListOnShow:[]
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
                    empNameFocus: true,
                    empCompanyFloor:"",
                    empCompanyFloorList:[],
                    empCompanyFloorListOnShow:[]
                });
            }
            else {
                this.setState({
                    empName:key,
                    empNameFocus: false,
                    empCompanyFloor:"",
                    empCompanyFloorList:[],
                    empCompanyFloorListOnShow:[]
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
			gids = tempEgids.join(",");
		}else{
			gids = egids
        }
        this.setState({
            empName: value,
            empId:id,
            empPhone:phone,
            empNameFocus:false,
			egids: gids
        },()=>{
            Common.ajaxProc("getEquipmentGroupByUserid",{userid: sessionStorage.userid}).done((res)=>{
                if(res.status == 0){
                    let eList = res.result;
                    let resArr = []
                    let egids = this.state.egids.split(",");
                    if(Common.strict){
                        for(let i = 0;i < eList.length; i++){
                            if(!!eList[i].gids&&eList[i].gids.indexOf(sessionStorage.gid) !== -1){
                                if(eList[i].egname.indexOf("FACE")==0||eList[i].egname.indexOf("人脸")==0){
                                    continue;
                                }
                                if(egids.indexOf(eList[i].egid+"")!==-1){
                                    resArr.push({name:eList[i].egname,egid:eList[i].egid})
                                }
                            }
                        }
                    }else{
                        for(let i = 0;i < eList.length; i++){
                            if(!!eList[i].gids&&eList[i].gids.indexOf(sessionStorage.gid) !== -1){
                                if(eList[i].egname.indexOf("FACE")==0||eList[i].egname.indexOf("人脸")==0){
                                    continue;
                                }
                                if(egids.indexOf(eList[i].egid+"")!==-1){
                                    resArr.unshift({name:eList[i].egname,egid:eList[i].egid,def:true})
                                }else{
                                    resArr.push({name:eList[i].egname,egid:eList[i].egid,def:false})
                                }
                            }
                        }
                    }
                    let item = resArr[0]
                    this.setState({
                        empCompanyFloorList:resArr,
                        empCompanyFloorListOnShow:resArr,
                        empCompanyFloor:item.name,
                        empCompanyFloorFocus:false,
                        empCompanyFloorKey:item.egid,
                        elevatorContro_time:Common.checkPassConfig([item.name])
                    })
                }
            })
        })
    }

    /**
     * @description [修改信息]
     * @param {String} name 
     * @param {Event} e 
     */
    setInfo(name,e){
        if(name == "vphone"&&!!e.target.value){
            let sendData = {
                userid: sessionStorage.userid,
                sids:this.state.empCompanyId,
                phone:e.target.value
            }
            Common.ajaxProc("checkBlacklist",sendData,sessionStorage.token).done((res)=>{
                if(!!res.result.length){
                    this.setState({
                        toastContent:"您好，"+res.result[0].name+"为黑名单人员，不可邀请预约",
                        openToast:2
                    })
                }
            })
        }
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
        if(this.state.faceLoading){
            Toast.open({
                type:"danger",
                content: "当前人脸正在进行校验，请等待结果。"
            })
            return
        }
        if(this.state.elevatorContro_time&&!this.state.tempCard&&this.state.vaPerm){
            this.setState({
                toastContent:"",
                openToast:3
            })
            return
        }
        if(!this.state.faceState&&!this.state.tempCard){
            Toast.open({
                type:"danger",
                content: "请记录人脸或发卡"
            })
            return
        }
        if(!this.state.empCompanyFloorKey){
            Toast.open({
                type:"danger",
                content: "请选择门禁权限"
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
            this.state.appointmentDate = new Date().format("yyyy-MM-dd hh:mm:ss");
            if((item.required&2) == 2){
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
            extendColGroup.push("access=" +this.state.empCompanyFloorKey);
        }
        
        if(this.state.gatein){
            extendColGroup.push("gatein=" + sessionStorage.gname);
        }
        if(this.state.guardin){
            extendColGroup.push("guardin=" + sessionStorage.opname);
        }
        // 添加发卡时间
        if(!!this.state.tempCard){
            extendColGroup.push("pCardDate=" + new Date().getTime());
        }
        let card = {
            cardId:this.state.cardId||"",
            name:this.state.vname||"",
            sex:this.state.sex||"",
            image:this.state.photoURL||""
        };

        let sendData = {
            userid:sessionStorage.userid,
            email: "",
            extendCol: extendColGroup,
            company: this.state.empCompany||"",
            name: this.state.vname||"",
            visitType: this.state.visitorType||"",
            empid: this.state.empId||"",
            empName:this.state.empName||"",
            remark: this.state.remark||"",
            signInGate: sessionStorage.gname,
            signInOpName: sessionStorage.opname,
            gid:sessionStorage.gid,
            tid:this.state.tid,
            vType:this.state.vType,
            cardNo:this.state.tempCard,
            card:card,
            appointmentDate: this.state.appointmentDate,
            empPhone:this.state.empPhone,
            clientNo: 3,    // 0-pad 1-小程序 2-邀请函 3-礼宾台 4-访客机
            ctype: sessionStorage.sid=="0"?'u':"s",
            floors:this.state.empCompanyFloor
        };

        if(!!this.state.plateNum) {
            sendData.plateNum = this.state.plateNum
        }

        if(this.state.sexType != 2) {
            sendData.sex = this.state.sexType
        }

        if(!!this.state.vphone) {
            sendData.phone = this.state.vphone
        }

        if(!!this.state.meetAddress) {
            sendData.meetingPoint = this.state.meetAddress
        }

        if(!!this.state.vcompany) {
            sendData.vcompany = this.state.vcompany
        }

        if(!!this.state.photoURL) {
            sendData.photoUrl = this.state.photoURL
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
                    sendData.peopleCount = tempArr.length+1;
                    sendData.memberName=JSON.stringify(tempArr)
                }else {
                    sendData.extendCol.push("peopleCount="+1);
                    sendData.peopleCount = 1
                }
            }else{
                sendData.extendCol.push("peopleCount="+1);
                sendData.peopleCount = 1
            }
        }else {
            // sendData.peopleCount = this.state.peopleCount
        }
        
        /**设置为提交状态 */
        this.state.inSubmit = true
        Common.ajaxProc("addVisitorApponintmnet", sendData, sessionStorage.token).done(function (data) {
            if (data.status === 0) {
                if(this.state.elevatorContro_time&&!this.state.tempCard&&!this.state.vaPerm){
                    this.setState({
                        toastContent:"此时段有梯控，请等待被访人授权后在“今日访客”中发卡。",
                        openToast:2
                    })
                }
                // else if(!this.state.vaPerm&&!this.state.tempCard){
                //     this.setState({
                //         toastContent:"请等待被访人授权后在“今日访客”中发卡。",
                //         openToast:2
                //     })
                // }
                Toast.open({
                    type:"success",
                    content: "现场预约成功"
                })
                if(!!this.state.tempCard){
                    Common.ajaxProcWithoutAsync("updateVisitorCardNo",
                        {
                            access:this.state.empCompanyFloorKey,
                            vid:data.result,
                            cardNo:this.state.tempCard,
                            cardOpName:sessionStorage.opname,
                        },sessionStorage.token).done((res)=>{
                            if (res.status === 0) {
                                Toast.open({
                                    type:"success",
                                    content: "发卡成功"
                                })
                            }else{
                                Toast.open({
                                    type:"danger",
                                    content: "发卡失败"
                                })
                            }
                    })
                }
                
                setTimeout(() => {
                    window.changeItem(0,"公司列表","companylist")
                }, 2000);
            }else if(data.status === 66){
                this.setState({
                    toastContent:"您好，"+this.state.vphone+"为黑名单人员，不可邀请预约",
                    openToast:2
                })
                this.setState({
                    inSubmit: false,
                    vistorName: "",
                    vistorPhone: ''
                });
            }else if(data.status === 43){
                Toast.open({
                    type:"danger",
                    content: "当前访客已超过预约限度"
                })
                this.setState({
                    inSubmit: false,
                    vistorName: "",
                    vistorPhone: ''
                });
                return
            }
        }.bind(this));
    }

    /**
     * @description [打开摄像头]
     */
    openCamera(){
        if(!this.state.photoSwitch){
            this.setState({
                photoSwitch:true
            })
        }else {
            let camera = document.getElementById('camera');
            let capture = document.getElementById('Register_camera_img');
            let baseCode;
            try {
                baseCode = "data:image/png;base64," + camera.GetBase64Code();
            } catch (error) {
                baseCode = "data:image/png;base64,";
            }
    
            if (!this.state.photo) {
                camera.style.display = 'none';
                capture.style.display = 'inline';
                capture.setAttribute('src', baseCode);
    
                this.state.photo = true;
            }
    
            else {
                camera.style.display = 'inline';
                capture.style.display = 'none';
                capture.setAttribute('src', '');
    
                baseCode = undefined;
                this.state.photo = false;
            }
    
            /**
             * 使用canvas裁剪图片为300x300
             */
            let canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d');
    
            canvas.width = 300;
            canvas.height = 300;
    
            ctx.drawImage(capture, -50, 0, capture.offsetWidth - 50, capture.offsetHeight);
            // ctx.drawImage(img, -100, 0, img.width, img.height);
    
            // baseCode = canvas.toDataURL();
    
            /**
             * 	将base64转换成二进制流
             */
            if (baseCode != undefined) {
                this.uploadBlob = Common.convertBase64UrlToBlob(baseCode);
            }
            else {
                this.uploadBlob = undefined;
            }
            let formData = new FormData();
            formData.enctype = "multipart/form-data";
            formData.append('action', 'upload');
            formData.append('filename', this.uploadBlob, 'avatar.png');
            Common.uploadForm('Upload', formData, sessionStorage.token).done(function (data) {
                if (data.status === 0) {
                    this.state.photoURL = data.result.url
                    this.setState({
                        photoURL:data.result.url
                    })
                    if(this.state.faceLoading){
                        return
                    }
                    let sendData = {"photoUrl":data.result.url};
                    Common.ajaxProcWithoutAsync("uploadFace",sendData,sessionStorage.token)
                    let count = 0;
                    window.interval = setInterval(() => {
                        if(count >= 20) {
                            clearInterval(window.interval)
                            window.interval = null
                            Toast.open({
                                type:"danger",
                                content: "未通过人脸校验，请重新抓拍人脸"
                            })
                            this.state.faceLoading = false
                            return
                        }else {
                            this.getFaceStatus(data.result.url)
                            count++
                        }
                    }, 1000);
                }
            }.bind(this));
        }
    }
    
    /**
     * @description [校验人脸]
     * @param {String} url 
     */
    getFaceStatus(url) {
        let sendData = {photoUrl:url};
        Common.ajaxProc("getFaceStatus",sendData,sessionStorage.token).done((res)=>{
            if(res.result == 0) {
                this.setState({
                    faceState:true,
                    faceLoading:false
                })
                clearInterval(window.interval)
            }
        });
    }

    /**
     * @description [更改弹窗状态]
     * @param {Number} type 
     */
    setToast(type){
        this.setState({
            openToast:type
        },()=>{
            if(type == 1){
                this.inputRef.focus();
            }
        })
    }

    /**
     * @description [关闭临时卡弹窗]
     */
    closeTempCardBox(){
        this.setState({
            tempCard:""
        })
        this.setToast(0)
    }

    /**
     * @description [保存临时卡]
     */
    setTempCard(){
        if(!this.state.tempCard){
            Toast.open({
                type:"danger",
                content: "请填写卡号"
            })
            return
        }
        this.setToast(0)
    }

    /**
     * @description [渲染节点中的特殊状态]
     * @param {Object} state 
     * @param {Number} state.type [答题-0,签到状态-1,是否授权-2]
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
            // state.type -1 状态
            case 1:
                cls = "appintmentState"
                if(state.value == 0){
                    str = "待审批"
                    cls += " err"
                }else if(state.value == 1) {
                    str = "已授权"
                    cls += " authorize"
                }else if(state.value == 2) {
                    str = "已签到"
                    cls += " signIn"
                }else if(state.value == 3) {
                    str = "已签出"
                    cls += " signout"
                }else if(state.value == 4){
                    str = "已结束"
                    cls += " finish"
                }
                break;
            
            case 2:
                cls = "appintmentState"
                if(state.value == 0){
                    str = "未授权"
                    cls += " err"
                }else if(state.value == 1) {
                    str = "已授权"
                    cls += " authorize"
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
     * @description [发卡]
     */
    sendCard(){
        if(!this.state.empCompanyId){
            Toast.open({
                type:"danger",
                content: "请选择公司"
            })
            return
        }
        if(!this.state.vaPerm){
            this.setState({
                toastContent:"请等待被访人授权后在“今日访客”中发卡。",
                openToast:2
            })
            return
        }
        // else if(this.state.elevatorContro_time&&!this.state.vaPerm){
        //     this.setState({
        //         toastContent:"请等待被访人授权后在“今日访客”中发卡。",
        //         openToast:2
        //     })
        // }
        this.setToast(1)
    }

    /**
     * @description [修改楼层]
     * @param {Event} e 
     */
    changeFloor(e){
        let key = e.target.value;
        if(!key){
            this.setState({
                empCompanyFloor:"",
                empCompanyFloorListOnShow:this.state.empCompanyFloorList,
                empCompanyFloorKey:"",
            })
        }else{
            let empCompanyFloorListOnShow = []
            this.state.empCompanyFloorList.map((item)=>{
                if(item.name.indexOf(key)!=-1){
                    empCompanyFloorListOnShow.push(item)
                }
            })
            this.setState({
                empCompanyFloor:key,
                empCompanyFloorKey:"",
                empCompanyFloorListOnShow:empCompanyFloorListOnShow
            })
        }
    }

    /**
     * @description[手机号码输入框移除焦点]
     */
    vphoneOnBlur(){
        if(!!this.state.vphone&& !this.checkPhoneNum(this.state.vphone)){
            Toast.open({
                type:"danger",
                content: "手机号码填写有误，请核实！"
            })
        }
    }
}