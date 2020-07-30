import React,{Component} from "react"
import $ from "jquery"
import { Table,DatePicker,Checkbox } from 'antd';
import moment from 'moment';

import Common from "../../Common/index"

import "./index.css"

// Toast
import Toast from "../../components/ToastPublic/index.jsx"


import defaultImg from "../../resource/defaultPhoto_mini.png"
import printImg from "../../resource/printImg.png"

export default class VisitorList extends Component{
    constructor(props){
        super(props)

        this.state = {
            vType:0,
            vTypelist:[
                {
                    name:"签到访客",
                    interface:"SearchVisitByCondition",
                    stateList:["total","leave","visiting"]
                },
                {
                    name:"预约访客",
                    interface:"SearchAppointmentByCondition",
                    stateList:["appointment","checkIn","noArrived"]
                },
                {
                    name:"邀请访客",
                    interface:"searchInviteByCondition",
                    stateList:["invite","checkIn","noArrived"]
                },
                {
                    name:"常驻访客",
                    interface:"SearchRVisitorByCondition",
                    stateList:["total","leave","visiting"]
                }
            ],
            vStateList:[
                {name:"访客总数",count:0,key:"total"},
                {name:"离开人数",count:0,key:"leave"},
                {name:"正在拜访人数",count:0,key:"visiting"},
                {name:"预约总数",count:0,key:"appointment"},
                {name:"邀请总数",count:0,key:"invite"},
                {name:"签到人数",count:0,key:"checkIn"},
                {name:"未到人数",count:0,key:"noArrived"},
            ],
            vState:0,
            columns:[
                {
                  title: '姓名',
                  key: 'vname',
                  width:"25%",
                  render: (data)=>{
                        return(
                            <div className="tableItem_name">
                                <Checkbox 
                                    checked={data.checked}
                                    style={{display:(this.state.vState==2&&this.state.vType==0)||this.state.vType==1?"inline-block":"none"}}
                                    onClick={()=>{
                                        let tempArr = this.state.dataSource;
                                        for(let i = 0;i < tempArr.length;i++){
                                            if(tempArr[i].key == data.key){
                                                tempArr[i].checked = !tempArr[i].checked
                                                break;
                                            }
                                        }
                                        this.setState({
                                            dataSource:tempArr
                                        })
                                    }} 
                                />
                                <div className="defaultImg">
                                    <img onClick={this.goLogin.bind(this,data)} src={data.vphoto || defaultImg} />
                                    <span onClick={this.goLogin.bind(this,data)}>{data.vname}</span>
                                    <img
                                        className="printIcon"
                                        src={printImg}
                                        style={{display:data.state == 1&&data.visitType !== "常驻访客"?"inline-block":"none"}}
                                        onClick={
                                            ()=>{
                                                this.props.history.replace({pathname:"print",state:{printList:[{vid:"v"+data.vid}]}})
                                            }
                                        }
                                    />
                                </div>
                            </div>
                        )
                  }
                },
                {
                    title: '被访人',
                    dataIndex: 'empName',
                    key: 'empName',
                },
                {
                    title: '手机号',
                    dataIndex: 'vphone',
                    key: 'vphone',
                },
                {
                    title: '拜访事由',
                    dataIndex: 'vTypeOnShow',
                    key: 'vTypeOnShow',
                },
                {
                    title: '签到时间',
                    dataIndex: 'visitdate',
                    key: 'visitdate',
                    width:"15%",
                },
                {
                    title: '签出时间',
                    dataIndex: 'signOutDate',
                    key: 'signOutDate',
                    width:"15%",
                },
                {
                    title: '',
                    dataIndex: 'state',
                    key: 'state',
                    render:(data)=>{
                        switch(data){
                            case 0:
                                return <span className="statusTag yellow">已授权</span>
                            case 1:
                                return <span className="statusTag green">已签到</span>
                            case 2:
                                return <span className="statusTag blue">已签出</span>
                            case 3:
                                return <span className="statusTag red">已拒绝</span>
                            case 4:
                                return <span className="statusTag brown">未授权</span>
                            case 5:
                                return <span className="statusTag coffee">已结束</span>
                            default:
                                return <span className="statusTag"></span>
                        }
                    }
                },
            ],
            baseList:[],
            dataSource:[],
            date:new Date().format('yyyy-MM-dd'),

            goSignIn:false,
            signInInfo:{
                empId:"",
                cardId:"",
                name:"",
                phone:""
            }
        }
    }

    render(){
        return(
            <div id="component_VisitorList">
                <div className="component_VisitorList_btnGroup">
                    <div className="component_VisitorList_topBar1">
                        <ul className="component_VisitorList_btnGroup_vtype">
                            {
                                this.state.vTypelist.map((item,i)=>{
                                    return (
                                        <li className={this.state.vType == i?"action":""} key={i+"vtype"} onClick={this.changeVtype.bind(this,i)}>
                                            <span>{item.name}</span>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        <ul 
                            className="component_VisitorList_btnGroup_actions"
                            style={{display:this.state.vState==2&&this.state.vType==0?"block":"none"}}
                        >
                            <li className="component_VisitorList_btnSelectAll" onClick={this.selectAll.bind(this,true)}>
                                <span>全选</span>
                            </li>
                            <li 
                                className="component_VisitorList_btnSelectAll"
                                onClick={this.goSignIn.bind(this)}
                            >
                                <span>接待</span>
                            </li>
                            <li className="component_VisitorList_btnCheckOut" onClick={this.batchSignOut.bind(this)}>
                                <span>签出</span>
                            </li>
                            <li className="component_VisitorList_btnCancel" onClick={this.selectAll.bind(this,false)}>
                                <span>取消</span>
                            </li>
                        </ul>
                        {/* <ul 
                            className="component_VisitorList_btnGroup_actions"
                            style={{display:this.state.vType==1?"block":"none"}}
                        >
                            <li 
                                className="component_VisitorList_btnSelectAll"
                                onClick={this.goSignIn.bind(this)}
                            >
                                <span>接待</span>
                            </li>
                            <li className="component_VisitorList_btnCancel" onClick={this.selectAll.bind(this,false)}>
                                <span>取消</span>
                            </li>
                        </ul> */}
                    </div>
                    <div className="component_VisitorList_topBar2">
                        <ul className="visitorState">
                            {
                                this.state.vStateList.map((item,i)=>{
                                    if(this.state.vTypelist[this.state.vType].stateList.indexOf(item.key) == -1){
                                        return
                                    }else{
                                        return (
                                            <li key={i+"vstate"} className={this.state.vState == i?"action":""} onClick={this.changeState.bind(this,i)}>
                                                {item.name}({item.count})
                                            </li>
                                        )
                                    }
                                })
                            }
                        </ul>
                        <ul className="searchCriteria">
                            <li className="searchContent">
                                <input 
                                    placeholder="请输入访客的姓名或者公司"
                                    onChange={this.queryRecord.bind(this)}
                                />
                            </li>
                            <li className="DatePickerBox">
                                <DatePicker 
                                    className="DatePicker"
                                    allowClear='true'
                                    defaultValue={moment(new Date(), 'YYYY-MM-DD')}
                                    onChange={(moment,date)=>{this.changeDate(date)}}
                                />
                            </li>
                        </ul>
                    </div>
                </div>
                <div id="component_VisitorList_tableBox">
                    <div id="component_VisitorList_tableBoard">
                        <Table 
                            className="tableBox" 
                            columns={this.state.columns} 
                            dataSource={this.state.dataSource} 
                            scroll={{y:this.state.tableHeight}} 
                            pagination={{ pageSize:Math.round(parseInt(this.state.tableHeight)/90) }}
                            locale={{emptyText: '暂无数据'}}
                        />
                    </div>
                </div>
                <div    
                    id="component_VisitorList_signIn"
                    style={{display:this.state.goSignIn?"block":"none"}}
                >
                    <div id="component_VisitorList_signInBoard">
                        <h3>
                            接待人信息
                        </h3>
                        <ul>
                            <li>
                                <span className="signInBoard_label">
                                    工号：
                                </span>
                                <input 
                                    type="text" 
                                    value={this.state.signInInfo.empId}
                                    ref={(input)=>{this.empIdInput=input}}
                                    onChange={
                                        ((e)=>{
                                            let val = e.target.value;
                                            let obj = this.state.signInInfo;
                                            obj.empId = val
                                            this.setState({
                                                signInInfo:obj
                                            },()=>{
                                                let _this = this;
                                                setTimeout(()=>{
                                                    _this.getEmpNameById()
                                                },1000)
                                            })
                                        }).bind(this)
                                    }
                                />
                                <span className="signInBoard_Btn" onClick={this.getEmpNameById.bind(this)}>读取</span>
                            </li>
                            <li>
                                <span className="signInBoard_label">
                                    身份证号：
                                </span>
                                <input 
                                    type="text"
                                    value={this.state.signInInfo.cardId} 
                                    onChange={
                                        ((e)=>{
                                            let val = e.target.value;
                                            let obj = this.state.signInInfo;
                                            obj.cardId = val
                                            this.setState({
                                                signInInfo:obj
                                            })
                                        }).bind(this)
                                    }
                                />
                                <span 
                                    className="signInBoard_Btn"
                                    onClick={
                                        (()=>{
                                            window.Android.startActivity("id");
                                        }).bind(this)
                                    }
                                >读取</span>
                            </li>
                            <li>
                                <span className="signInBoard_label">
                                    接待人姓名：
                                </span>
                                <input 
                                    type="text" 
                                    value={this.state.signInInfo.name}
                                    onChange={
                                        ((e)=>{
                                            let val = e.target.value;
                                            let obj = this.state.signInInfo;
                                            obj.name = val
                                            this.setState({
                                                signInInfo:obj
                                            })
                                        }).bind(this)
                                    }
                                />
                            </li>
                            <li>
                                <span className="signInBoard_label">
                                    手机号码：
                                </span>
                                <input 
                                    type="text" 
                                    placeholder="（非必填）" 
                                    value={this.state.signInInfo.phone} 
                                    onChange={
                                        ((e)=>{
                                            let val = e.target.value;
                                            let obj = this.state.signInInfo;
                                            obj.phone = val
                                            this.setState({
                                                signInInfo:obj
                                            })
                                        }).bind(this)
                                    }
                                />
                            </li>
                        </ul>
                        <ul className="signInBoard_BTNGroup">
                            <li
                                onClick={
                                    (()=>{
                                        this.setState({
                                            goSignIn:false,
                                            signInInfo:{
                                                empId:"",
                                                cardId:"",
                                                name:"",
                                                phone:""
                                            }
                                        })
                                    }).bind(this)
                                }
                            >
                                取消
                            </li>
                            <li onClick={this.setReceptionist.bind(this)}>
                                确定
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount(){

        // 设定表格高度
        let coefficient = document.body.clientHeight>1000?0.70:0.58
        
        // 设定表格高度
        this.setState({
            tableHeight:document.getElementById("component_VisitorList_tableBox").offsetHeight*coefficient
        })

        // 初始化
        this.init()
    }

    /**
     * @description [初始化]
     */
    init(){
        let _this = this;
        
        // 获取当前表单
        this.getVisitorInfo()

        // 初始化senseid读取身份证
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
            let tempSignInfo = _this.state.signInInfo;
            tempSignInfo.cardId = res.cardId;
            tempSignInfo.name = res.name;
            _this.setState({
                signInInfo:tempSignInfo
            })
		}
    }


    /**
     * @description [修改当前显示访客类型]
     * @param {Number} index [下标]
     */
    changeVtype(index){
        let vState = this.state.vTypelist[index].stateList[0];
        let vTypeIndex = 0
        for(let i = 0; i < this.state.vStateList.length;i++){
            if(this.state.vStateList[i].key == vState){
                vTypeIndex = i
                break;
            }
        }
        this.setState({
            vType:index,
            vState:vTypeIndex
        },()=>{
            // 获取当前表单
            this.getVisitorInfo()
        })
    }

    /**
     * @description [修改当前显示访客状态]
     * @param {Number} index [下标]
     */
    changeState(i){
        let vStateList = this.state.vStateList;
        let tempArr = [];
        switch(vStateList[i].key){
            case "total":
                tempArr = this.state.baseList
                break;
            case "leave":
                for(let i = 0; i <this.state.baseList.length; i++){
                    if(this.state.baseList[i].state !== 2){
                        continue
                    }
                    tempArr.push(this.state.baseList[i])
                }
                break;
            case "visiting":
                for(let i = 0; i <this.state.baseList.length; i++){
                    if(this.state.baseList[i].state !== 1 && this.state.baseList[i].state !== 5){
                        continue
                    }
                    tempArr.push(this.state.baseList[i])
                }
                break;
            case "appointment":
                tempArr = this.state.baseList
                break;
            case "invite":
                tempArr = this.state.baseList
                break;
            case "checkIn":
                for(let i = 0; i <this.state.baseList.length; i++){
                    if(this.state.baseList[i].state == 0||this.state.baseList[i].state == 3||this.state.baseList[i].state == 4){
                        continue
                    }
                    tempArr.push(this.state.baseList[i])
                }
                break;
            case "noArrived":
                for(let i = 0; i <this.state.baseList.length; i++){
                    if(this.state.baseList[i].state == 0||this.state.baseList[i].state == 3||this.state.baseList[i].state == 4){
                        tempArr.push(this.state.baseList[i])
                    }
                }
                break;
            default:
                break;
        }
        this.setState({
            vState:i,
            dataSource: tempArr
        })
    }

    /**
     * @description [修改时间时重新请求数据]
     * @param {String} date [yyyy-MM-dd]
     */
    changeDate(date){
        this.setState({
            date:date
        },()=>{this.getVisitorInfo()})
    }

    /**
     * @description [根据时间查询访客信息]
     * @param {String} date [yyyy-MM-dd]
     */
    getVisitorInfo(){
        let interfaceName = this.state.vTypelist[this.state.vType].interface;
        let sendData = {
            userid: sessionStorage.userid,
            gid: sessionStorage.gid,
            date: this.state.date,
            endDate: this.state.date,
        };
        Common.ajaxProcWithoutAsync(interfaceName, sendData, sessionStorage.token).done((data)=>{
            if(data.status == 0){
                if(!data.result.length){
                    this.setState({
                        dataSource:[],
                        baseList:[],
                        vStateList:[
                            {name:"访客总数",count:0,key:"total"},
                            {name:"离开人数",count:0,key:"leave"},
                            {name:"正在拜访人数",count:0,key:"visiting"},
                            {name:"预约总数",count:0,key:"appointment"},
                            {name:"邀请总数",count:0,key:"invite"},
                            {name:"签到人数",count:0,key:"checkIn"},
                            {name:"未到人数",count:0,key:"noArrived"}
                        ]
                    })
                    return
                }
                let resArr = [];
                let total = data.result.length;
                let leave = 0;
                let visiting = 0;
                let appointment = data.result.length;
                let invite = data.result.length;
                let checkIn = 0;
                let noArrived = 0;

                for(let i = 0; i < data.result.length; i++){
                    let item = data.result[i];
					if (item.appointmentDate !== null) {
						item.appointmentDate = new Date(item.appointmentDate).format("yyyy-MM-dd hh:mm:ss");
					}
					if (item.visitdate !== null) {
						item.visitdate = new Date(item.visitdate).format("yyyy-MM-dd hh:mm:ss");
					}
					if (item.signOutDate !== null) {
						item.signOutDate = new Date(item.signOutDate).format("yyyy-MM-dd hh:mm:ss");
                    }

                    if(!!item.signOutDate){
                        item.state = 2;
                        leave++;
                        checkIn++;
                    }else if(!!item.leaveTime){
                        item.state = 5;
                        visiting++;
                        checkIn++;
                    }else if(!!item.visitdate){
                        item.state = 1;
                        visiting++;
                        checkIn++;
                    }else {
                        if(item.status == 4){
                            item.state = 3;
                        }else{
                            switch (item.permission) {
                                case 0:
                                    item.state = 4;
                                    break;
                                case 1:
                                    item.state = 0;
                                    break;
                                case 2:
                                    item.state = 3;
                                    break;
                            }
                        }
                        noArrived++;
                    }

                    if(!!item.visitType){
                        item.vTypeOnShow = item.visitType.split("#")[0]
                    }else{
                        item.vTypeOnShow = ""
                    }
                    item.checked = false;
                    item.key = i+"#"+interfaceName+Math.random();
                    
                    resArr.push(item)
                }

                let vStateList = this.state.vStateList;
                for(let i = 0; i < vStateList.length; i++){
                    switch(vStateList[i].key){
                        case "total":
                            vStateList[i].count=total
                            break;
                        case "leave":
                            vStateList[i].count=leave
                            break;
                        case "visiting":
                            vStateList[i].count=visiting
                            break;
                        case "appointment":
                            vStateList[i].count=appointment
                            break;
                        case "invite":
                            vStateList[i].count=invite
                            break;
                        case "checkIn":
                            vStateList[i].count=checkIn
                            break;
                        case "noArrived":
                            vStateList[i].count=noArrived
                            break;
                        default:
                            break;
                    }
                }

                this.setState({
                    dataSource:resArr,
                    vStateList:vStateList,
                    baseList:resArr
                })
            }
        })
    }

    /**
     * @description [全选、反选]
     * @param {Boolean} state 
     */
    selectAll(state){
        let tempArr = this.state.dataSource
        tempArr.map((item)=>{
            item.checked = state
        })
        this.setState({
            dataSource:tempArr
        })
    }

    /**
     * @description [批量签出]
     */
    batchSignOut() {
        let sendData = [];
        this.state.dataSource.forEach(function (value, index, array) {
            if (value.checked === true) {
                sendData.push({
                    appid: value.appid,
                    userid: sessionStorage.userid,
                    vid: value.vid,
                    signOutGate: sessionStorage.gateway,
                    signOutOpName: sessionStorage.opname
                });
            }
        });

        if (sendData.length === 0) return;

        Common.ajaxProc('batchSignOut', sendData, sessionStorage.token).done(function (data) {
            if (data.status === 0) {
                this.setState({
                    vState:0,
                    vType:0,
                })
                this.getVisitorInfo();
                Toast.open({
                    type:"success",
                    content: "访客签出成功"
                })
                return;
            }
        }.bind(this));
    }

    /**
     * @description [点击签到]
     */
    goLogin(data){
        if(data.visitType == "常驻访客"){
            return
        }
        if(data.state === 2||data.state === 3||data.state === 4){
            return
        }
        let extendCol = !!data.extendCol?JSON.parse(data.extendCol.replace(/&quot;/g,'"')):{};
        let qrType = this.state.vTypelist[this.state.vType].interface == "searchInviteByCondition"?"a":"v"
        let obj = {
            "visitInfo":{
                "peopleCount":data.peopleCount||"",
                "vname":data.vname||"",
                "vtime":data.appointmentDate||"",
                "vphone":data.vphone||"",
                "vtype":data.visitType||"",
                "vemail":data.vemail||"",
                "vid":data.vid||"",
                "signInGate":data.signInGate||"",
                "signInOpName":data.signInOpName||"",
                "signOutGate":data.signOutGate||"",
                "signOutOpName":data.signOutOpName||"",
                "member":null||"",
                "vcompany":data.vcompany||"",
                "remark":data.remark||"",
                "leaveTime":data.leaveTime||"",
                "gid":data.gid||""
            },
            "empInfo":{
                "ename":data.empName||"",
                "ephone":data.empPhone||"",
                "extendCol":data.extendCol||""
            },
            "idcardContent":{
                "certNumber":extendCol.cardId||"",
                "partyName":data.vname||""
            },
            "tid":data.tid||"",
            "vgroup":data.vgroup||"",
            "appointmentDate":data.appointmentDate||"",
            "action":"list",
            "vType":data.vType||"",
            "permission":data.permission||"",
            "qrtype":qrType,
            "signOutDate":data.signOutDate||"",
            "visitDate":data.visitdate||"",
            "leaveTime":data.leaveTime||"",
            "qrcodeType":data.qrcodeType||"",
            "qrcodeConf":data.qrcodeConf||"",
            "aid":data.aid||"",
            "signin":data.signin
        }
        this.props.history.push({pathname:"/home/appointmentInfo", state:[obj]});
    }

    /**
     * @description [模糊搜索]
     * @param {Event} e
     */
    queryRecord(e){
        let key = e.target.value;
        this.getVisitorInfo()
        if(!key){
            return
        }
        let _this = this;
        setTimeout(()=>{
            let tempArr = this.state.dataSource;
            let resArr = []
            for(let i = 0; i < tempArr.length; i++){
                let item = tempArr[i]
                if(!!item.vcompany){
                    if(item.vname.indexOf(key) !== -1 || item.vcompany.indexOf(key) !== -1){
                        resArr.push(item)
                    }
                }else if(item.vname.indexOf(key) !== -1){
                    resArr.push(item)
                }
            }
            _this.setState({
                dataSource:resArr
            })
        },0)
    }

    /**
     * @description [点击发起接待]
     */
    goSignIn(){
        let dataArr = []
        for(let i = 0;i < this.state.dataSource.length;i++){
            if(this.state.dataSource[i].checked){
                dataArr.push(this.state.dataSource[i])
            }
        }
        if(!dataArr.length){
            Toast.open({
                type:"danger",
                content: "请选择访客"
            })
            return
        }
        console.log(dataArr)
        for(let i = 0; i < dataArr.length;i++){
            this.checkAnswer(dataArr[i])
            if(!this.checkAnswer(dataArr[i])){
                Toast.open({
                    type:"danger",
                    content: "请确认访客已完成答题"
                })
                return
            }
        }
        this.setState({
            goSignIn:true
        },()=>{
            this.empIdInput.focus()
        })
    }

    /**
     * @description [校验答题]
     * @param {String} email 
     * @param {String} phone 
     * @param {String} cardId 
     */
	checkAnswer(target){
        let res = false;
        let infoList = [target.vemail, target.vphone, target.cardId]
		for(let i = 0;i<infoList.length;i++){
			if(sessionStorage.questionnaireSwitch == 0){
                res = true;
                return res
			}
			if(res){
				continue;
			}
			let item = infoList[i];
			if(!item){
				continue;
			}
			if(target.tid == "0"){
                res = false
				return res;
			}
			Common.ajaxProcWithoutAsync("getVisitorTypeByTid",{"tid": target.tid,"userid": sessionStorage.userid},sessionStorage.token).done((data)=>{
				if(!data.result.qid){
                    res = true
                    return res
				}
				let getAnswerResult = Common.ajaxProcWithoutAsync("getAnswerResult",{"identity": item,"userid": sessionStorage.userid},sessionStorage.token);
				getAnswerResult.done((res)=>{
					if(!res.result || !res.result.passDate) {
                        res = false
						return false
					} else if ( new Date().getTime() > new Date(new Date(Number(res.result.passDate)).format("yyyy-MM-dd 00:00:00")).getTime()+Number(data.result.povDays)*24*60*60*1000){
                        res = false
                        return false
					}else {
                        res = true
						return true
					}
                })
			})

        }
        return res
    }

    /**
     * @description [设置接待人]
     */
    setReceptionist(){
        let sendData = {
            rname: this.state.signInInfo.name,
            rempNo: this.state.signInInfo.empId,//工号
            rcardId: this.state.signInInfo.cardId,
            rphone: this.state.signInInfo.phone
        }
        if(!this.state.signInInfo.name){
            Toast.open({
                type:"danger",
                content: "请输入接待人姓名"
            })
            return
        }else {
            Common.ajaxProcWithoutAsync('getSubAccountEmpList', {userid:sessionStorage.userid}, sessionStorage.token).done((res)=>{
                let empList = res.result;
                let flag = false;
                for(let i = 0;i < empList.length;i++){
                    if(this.state.signInInfo.name == empList[i].empName){
                        flag = true;
                        break;
                    }
                }
                if(!flag){
                    Toast.open({
                        type:"danger",
                        content: "无效员工"
                    })
                    return
                }
            })
        }
        Common.ajaxProcWithoutAsync("setReceptionist",sendData, sessionStorage.token).done((res)=>{
            if(res.status==0){
                Toast.open({
                    type:"success",
                    content: "绑定成功"
                })
                this.setState({
                    goSignIn:false,
                    signInInfo:{
                        empId:"",
                        cardId:"",
                        name:"",
                        phone:""
                    }
                })
            }
        })
    }

    /**
     * @description [根据IC卡查员工姓名]
     */
    getEmpNameById(){
        Common.ajaxProcWithoutAsync('getSubAccountEmpList', {userid:sessionStorage.userid}, sessionStorage.token).done((res)=>{
            let empList = res.result;
            let flag = false;
            for(let i = 0;i < empList.length;i++){
                if(this.state.signInInfo.empId == empList[i].empid){
                    flag = true;
                    let obj = this.state.signInInfo;
                    obj.name = empList[i].empName
                    this.setState({
                        signInInfo:obj
                    })
                    break;
                }
            }
            if(!flag){
                Toast.open({
                    type:"danger",
                    content: "无效员工"
                })
                return
            }
        })
    }
}