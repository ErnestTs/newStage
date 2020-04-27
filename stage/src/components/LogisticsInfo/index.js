import React,{Component} from "react"
import $ from 'jquery';

import Common from "../../Common/index"

import "./index.css"

// Toast
import Toast from "../../components/ToastPublic/index.jsx"

export default class logisticsInfo extends Component {
    constructor(props){
        super(props)
        this.state= {
            type:0,
            data:{
                logType:""
            },
            extendTypeInfo:[],
            questionSwitch:true,
            questionIndate:0,
            checkOutRemark:""
        }
    }

    render(){
        if(!this.state.data.logType){
            return(
                <div></div>
            );
        }
        return (
            <div id="component_logisticsInfo">
                <div className="component_logisticsInfo_title">
                    {this.state.type?"签出":"签入"}
                    <div className="border"></div>
                </div>

                <div id="component_logisticsInfo_board">
                    <ul className="LogisticsInfo">
                        <li className="LogisticsInfo_item">
                            <p className="label">物流信息</p>
                            <ul className="dataList">
                                <li>
                                    <span>物流类型: {this.state.data.logType}</span>
                                </li>
                                <li>
                                    <span>预约时间: {this.state.data.appointmentDate}</span>
                                </li>
                                <li style={{ display: this.state.data.visitdate === null ? "none" : "inline-block" }}>
                                    <span>到达时间: {this.state.data.visitdate}</span>
                                </li>
                                <li style={{ display: this.state.data.finishTime === null ? "none" : "inline-block" }}>
                                    <span>结束时间: {this.state.data.finishTime}</span>
                                </li>
                                <li style={{ display: this.state.data.leaveTime === null ? "none" : "inline-block" }}>
                                    <span>离开时间: {this.state.data.leaveTime}</span>
                                </li>
                                {
                                    this.state.data.logExtend.map((item, i, arr)=>{
                                        return (
                                            <li key={item.fieldName+i}>
                                                <span>{item.displayName}: {item.inputValue}</span>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </li>
                        <li className="LogisticsInfo_item">
                            <p className="label">提货人信息</p>
                            <ul className="dataList">

                                <li>
                                    <span>姓名: {this.state.data.sname}
                                        <span className={"memberState "+this.state.data.sState} style={{marginLeft:"2%"}}>{
                                            (()=>{
                                                let str = "";
                                                switch(this.state.data.sState){
                                                    case "readed":
                                                        str="已答题"
                                                        break;
                                                    case "unread":
                                                        str="未答题"
                                                        break;
                                                    case "noneed":
                                                        str="免答题"
                                                        break;
                                                    default:
                                                        break;
                                                }
                                                return <span>{str}</span>
                                            })()
                                        }</span>
                                    </span>
                                </li>
                                <li>
                                    <span>手机号码: {this.state.data.smobile}</span>
                                </li>
                                <li>
                                    <span>身份证号: {this.state.data.scardId}</span>
                                </li>
                            </ul>
                        </li>
                        <li className="LogisticsInfo_item">
                            <p className="label">车辆信息</p>
                            <ul className="dataList">
                                {
                                    this.state.data.vehicleExtend.map((item, i, arr)=>{
                                        if(item.fieldName == "vehicleAccessPhoto" || item.fieldName == "vehicleLeavingPhoto"){
                                            return
                                        }
                                        return (
                                            <li key={item.fieldName+i}>
                                                <span>{item.displayName}: {item.inputValue}</span>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </li>
                        <li className="LogisticsInfo_item">
                            <p className="label">司机信息</p>
                            <ul className="dataList">
                                {
                                    this.state.data.driverExtend.map((item, i, arr)=>{
                                        if(item.fieldName == "memberInfo"){
                                            return
                                        }
                                        return (
                                            <li key={item.fieldName+i}>
                                                <span>{item.displayName}: {item.inputValue}
                                                    <span className={"memberState "+this.state.data.sState} style={{marginLeft:"2%"}}>{
                                                        (()=>{
                                                            if(i != 0){
                                                                return;
                                                            }
                                                            let str = "";
                                                            switch(this.state.data.sState){
                                                                case "readed":
                                                                    str="已答题"
                                                                    break;
                                                                case "unread":
                                                                    str="未答题"
                                                                    break;
                                                                case "noneed":
                                                                    str="免答题"
                                                                    break;
                                                                default:
                                                                    break;
                                                            }
                                                            return <span>{str}</span>
                                                        })()
                                                    }</span>
                                                </span>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </li>
                        <li className="LogisticsInfo_item">
                            <p className="label">其他信息</p>
                            <ul className="dataList">
                                {
                                    this.state.extendTypeInfo.map((item, i, arr)=>{
										if(item.inputType == "text"){
											return <div className="otherExtendBoxItem" key={i+item.fieldName}>
												<label>{item.displayName}：</label>
												<div className="inputBox">
													<input type="text" id={item.fieldName} disabled={this.state.type?"disabled":false} />
												</div>
											</div>
										}else{
											let renderOptions = ()=>{
												return (
													item.inputValue.split(",").map(option => (
														<option key={ option } value={ option }>{ option }</option>
													))
												)
											}
											return <div className="otherExtendBoxItem" key={i+item.fieldName}>
												<label>{item.displayName}：</label>
												<div className="inputBox">
													<select type="text" id={item.fieldName} disabled={this.state.type?"disabled":false}>
														{renderOptions()}
													</select>
												</div>
											</div>
										}
									})
                                }
                            </ul>
                        </li>
                        <li className="LogisticsInfo_item">
                            <p className="label">跟随人员</p>
                            <ul className="dataList">
                                {
                                    this.state.data.memberInfo.map((item, i, arr)=>{
                                        return <li className="memberItem" key={"memberItem"+i}>
                                            <input
                                                placeholder="姓名"
                                                value={item.name}
                                                onChange={this.setMemberInfo.bind(this,"name", i)} 
                                            />
                                            <span className={"memberState "+item.state}>{
                                                (()=>{
                                                    let str = "";
                                                    switch(item.state){
                                                        case "readed":
                                                            str="已答题"
                                                            break;
                                                        case "unread":
                                                            str="未答题"
                                                            break;
                                                        case "noneed":
                                                            str="免答题"
                                                            break;
                                                        default:
                                                            break;
                                                    }
                                                    return <span>{str}</span>
                                                })()
                                            }</span>
                                            <input
                                                placeholder="手机号码"
                                                value={item.mobile}
                                                onChange={this.setMemberInfo.bind(this,"mobile", i)} 
                                            />
                                            <input
                                                placeholder="身份证号"
                                                value={item.cardid}
                                                onChange={this.setMemberInfo.bind(this,"cardid", i)} 
                                            />
                                            <span 
                                                className="btn_delete" 
                                                onClick={this.deleteMember.bind(this,i)}
                                                style={{display: !this.state.type?"block":"none"}}
                                            >删除</span>
                                        </li>
                                    })
                                }
                            </ul>
                            <ul className="btnGroup" style={{display: !this.state.type?"block":"none"}}>
                                <li className="btn_blue" onClick={this.checkAnswer.bind(this)}>校验答题</li>
                                <li className="btn_blue" onClick={this.scanCard.bind(this)}>读取证件</li>
                                <li className="btn_white" onClick={this.addMember.bind(this)}>手动添加</li>
                            </ul>
                        </li>
                        <li className="LogisticsInfo_item">
                            <p className="label">货物信息</p>
                            <ul className="dataList">
                                {
                                    this.state.data.goodsExtend.map((item, i, arr)=>{
                                        return (
                                            <li key={item.fieldName+i}>
                                                <span>{item.displayName}: {item.inputValue}</span>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                            <ul className="photoList">
                                {
                                    this.state.data.photoInfo.map((item, i, arr)=>{
                                        if(!item){
                                            return
                                        }
                                        return (
                                            <li className="photoItem" key={i}>
                                                <a href={item} target="_blank">
                                                    <img src={item} />
                                                </a>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </li>
                        <li className="LogisticsInfo_item">
                            <p className="label">物流签到照片</p>
                            <ul className="photoList">
                                {
                                    this.state.data.carLoginPhoto.map((item, i, arr)=>{
                                        if(!item){
                                            return
                                        }
                                        return (
                                            <li className="photoItem" key={i}>
                                                <a href={item} target="_blank">
                                                    <img src={item} />
                                                </a>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </li>
                        <li className="LogisticsInfo_item">
                            <p className="label">物流签出照片</p>
                            <ul className="photoList">
                                {
                                    this.state.data.carLogoutPhoto.map((item, i, arr)=>{
                                        if(!item){
                                            return
                                        }
                                        return (
                                            <li className="photoItem" key={i}>
                                                <a href={item} target="_blank">
                                                    <img src={item} />
                                                </a>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </li>
                        <li className="LogisticsInfo_item">
                            <p className="label">备注</p>
                            <ul className="dataList">
                                <li>
                                    {this.state.data.remark}
                                </li>
                            </ul>
                        </li>
                        <li style={{display:!!this.state.type?"block":"none"}} className="LogisticsInfo_item logoutRemark">
                            <p className="label">签出备注</p>
                            <ul className="dataList">
                                <li>
                                    <textarea value={this.state.checkOutRemark} onChange={(evt)=>{this.setState({checkOutRemark:evt.target.value})}} />
                                </li>
                            </ul>
                        </li>
                    </ul>
                
                </div>

                <div id="component_logisticsInfo_loginBTN" onClick={this.nextStep.bind(this)}>
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

        let logInfo = this.props.history.location.state;
        console.log("data",logInfo)


        // 设置类型 -0签到 -1签出
        let type;
        if(!logInfo.visitdate){
            type = 0
        }else{
            type = 1
        }
        this.setState({
            type:type,
            data:logInfo
        }, ()=>{
            // 获取扩展字段
            this.getExtendTypeInfo(logInfo.logType)
            this.getQuestionInfo()
        })

        // 判断读卡设备 -0||null 身份证阅读器 -1证照通 -3senseId
        if(Common.$_Get().idcard == 1){
            Common.initPassPort()
        }else if(Common.$_Get().idcard == 3){

        }else {
            Common.initIdCard()
        }
    }

    /**
     * @description [删除随访人员]
     * @param {Number} i [index]
     */
    deleteMember(i){
		let tempObj = this.state.data;
		tempObj.memberInfo.splice(i,1);
		this.setState({data:tempObj});
    }

    /**
     * @description [添加随访人员]
     */
    addMember({certNumber,partyName}){
        let tempObj = this.state.data;
        let info = {name:"", mobile:"", cardid:"", state:""};
        if(!!certNumber&&!!partyName){
            info.name = partyName;
            info.cardid = certNumber
        }
		tempObj.memberInfo.push(info);
		this.setState({data:tempObj});
    }

    /**
     * @description [修改随访信息]
     * @param {String} item [key]
     * @param {Number} i [index]
     * @param {Event} evt 
     */
    setMemberInfo(item,i,evt){
        if(!!this.state.type){
            return;
        }
		let tempObj = this.state.data;
		tempObj.memberInfo[i][item] = evt.target.value;
		this.setState({data:tempObj});
    }


    /**
     * @description [根据物流类型请求扩展字段]
     * @param {String} type [物流类型]
     */
    getExtendTypeInfo(type){
        let _this = this;
		let sendData = {
			"userid": sessionStorage.userid,
			"eType": type
		}
		Common.ajaxProcWithoutAsync('getExtendTypeInfo',sendData, sessionStorage.token).done((data)=>{
            if(data.status === 0){
                let tempArr = []
                // 根据条件进行迭代筛选 
                for(let i = 0; i <data.result.length; i++){
                    if(data.result[i].isDisplay & "1" == 1 && data.result[i].placeholder === "其他信息") {
                        tempArr.push(data.result[i])
                    }
                }
                
                // 将扩展字段的值赋到节点中
                setTimeout(()=>{
                    _this.state.data.otherExtend.map((item)=>{
                        $("#"+item.fieldName).val(item.inputValue)
                    })
                },0)

                this.setState({
                    extendTypeInfo: tempArr
                })
            }
        })
    }


    /**
     * @description [扫描证件]
     */
    scanCard(){
        var cardInfo = {}
        if(Common.$_Get().idcard == 1){
            cardInfo = Common.scanByPassPort()
        }else if(Common.$_Get().idcard == 3){

        }else {
            
        }
        this.addMember(cardInfo)
    }


    /**
     * @description [获取答题相关配置]
     */
    getQuestionInfo(){
		let indate = 0;
        let logType = this.state.data.logType;
        let logisticsNoQ = true
		// 查询题库有效期
		Common.ajaxProcWithoutAsync("getVisitorType",{category: 1,userid: sessionStorage.userid},sessionStorage.token).done((data)=>{
			for(let i = 0; i < data.result.length; i++){
				if(data.result[i].vType == logType){
					if(!data.result[i].qid){
						logisticsNoQ= true
						return;
					}else{
						logisticsNoQ= false
						indate = data.result[i].povDays
					}
				}
			}
        })
        this.setState({
            questionSwitch: logisticsNoQ,
            questionIndate:indate
        },()=>{
            this.checkAnswer()
        })
    }

    /**
     * @description [校验提货人、司机、随访人员答题情况]
     */
    checkAnswer(){
        let _this = this;
        let res;
        let cardArr = [
            {
                role:"sState",
                name:"",
                cardid: this.state.data.scardId
            },
            {
                role:"dState",
                name:"",
                cardid: this.state.data.dcardId
            }
        ]
        for(let i = 0; i < this.state.data.memberInfo.length; i++) {
            if(this.state.data.memberInfo[i].name && this.state.data.memberInfo[i].cardid){
                cardArr.push(
                    this.state.data.memberInfo[i])
            }
        }
        function setState(state,i){
            if(!cardArr[i].name){
                let tempObj = _this.state.data;
                tempObj[cardArr[i].role] = state
                _this.setState({
                    data:tempObj
                })
            }else {
                let tempObj = _this.state.data;
                tempObj.memberInfo[i-2].state = state;
                _this.setState({data:tempObj});
            }
        }

        for(let i = 0; i < cardArr.length; i++){
            Common.ajaxProcWithoutAsync("getAnswerResult",{identity: cardArr[i].cardid,"userid": sessionStorage.userid},sessionStorage.token).done((data)=>{
                if(_this.state.questionSwitch || sessionStorage.questionnaireSwitch == 0){
                    setState("noneed",i)
                    res = true
                }else {
                    if(!data.result || !data.result.passDate) {
                        setState("unread",i)
                        res = false
                    }else if( new Date().getTime() >  new Date(new Date(Number(data.result.passDate)).format("yyyy-MM-dd 00:00:00")).getTime()+Number(_this.state.questionIndate)*24*60*60*1000){
                        setState("unread",i)
                        res = false
                    }else {
                        setState("readed",i)
                        res = true
                    }
                }
            })
        }
        return res
    }

    /**
     * @description [获取扩展字段信息]
     */
    getOtherExtendData(){
        let resArr = [];
        for(let i = 0; i < this.state.extendTypeInfo.length; i++){
            let tempObj = {};
            tempObj.displayName = this.state.extendTypeInfo[i].displayName
            tempObj.fieldName = this.state.extendTypeInfo[i].fieldName
            tempObj.inputValue = $("#"+this.state.extendTypeInfo[i].fieldName).val()
            resArr.push(tempObj);
        }
        return resArr
    }

    /**
     * @description [下一步]
     */
    nextStep(){
        let data = this.state.data;
        // this.state.type -0 签到
        if(!this.state.type){
            // 如果日期不是今天 禁止签到
            if(new Date(data.appointmentDate).toDateString() !=new Date().toDateString()){
                Toast.open({
                    type:"danger",
                    content: "签入失败，请检查预约时间是否为今天"
                })
                return
            }

            // 校验随访人员信息
            for(let i = 0, len = data.memberInfo.length; i < len; i++){
                if(!data.memberInfo[i].name && !data.memberInfo[i].cardid && !data.memberInfo[i].mobile) {
                    Toast.open({
                        type:"danger",
                        content: "请删除空白随访人员栏"
                    })
                    return
                }else if(!data.memberInfo[i].name || !data.memberInfo[i].cardid) { 
                    Toast.open({
                        type:"danger",
                        content: "请完善随访人员的姓名与证件号码"
                    })
                    return;
                }
            }

            // 校验答题
            if(!this.checkAnswer()){
                Toast.open({
                    type:"danger",
                    content: "请确认此次相关人员是否完成答题"
                })
                return
            }

            let sendData = {
                photoUrl: "",	
                action: "logistics",										
                userid:data.userid,
                sid :data.sid,
                cardid:data.scardId,
                visitdate:new Date().getTime(),
                memberInfo: data.memberInfo,
                otherExtend: this.getOtherExtendData()
            };
            this.props.history.push({pathname:"face",state:sendData})
        }
        // 签出
        else{
            if(!data.finishTime){
                Toast.open({
                    type:"danger",
                    content: "签出失败,当前物流流程未结束"
                })
                return
            }
            data.remark = !data.remark? "":data.remark;
            let checkOutRemark = ""
            if(!!this.state.checkOutRemark){
                checkOutRemark = "签出备注："+this.state.checkOutRemark
                if(!!data.remark){
                    data.remark += "；"
                }
            }
            let thisDate = new Date();
            let	sendData = {
                userid:data.userid,
                sid :data.sid,
                scardId:data.scardId,
                visitdate:new Date(data.visitdate).getTime(),
                leaveTime:thisDate,
                pstatus:3,
                remark:data.remark+checkOutRemark
            }
            Common.ajaxProc('updateLogisticsInfo', sendData, sessionStorage.token).done(function (data) {
                if (data.status === 0) {
                    Toast.open({
                        type:"success",
                        content: "签出成功"
                    })
                }else {
                    Toast.open({
                        type:"danger",
                        content: "签出失败"
                    })
                }
                setTimeout(function () {
                    this.props.history.replace("/home/qrcode")
                }.bind(this), 1500);
            }.bind(this))

        }
    }
}