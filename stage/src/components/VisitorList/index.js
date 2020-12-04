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
import warningImg from "../../resource/warning.png"
import loadingGif from "../../resource/loading.gif"

export default class VisitorList extends Component{
    constructor(props){
        super(props)

        this.state = {
            vType:0,
            vTypelist:[
                {
                    name:"签到访客",
                    interface:"SearchVisitByCondition",
                    stateList:["noReceived","Received","visiting","leave","total"]
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
                    stateList:["visiting","leave","total"]
                },
                // {
                //     name:"供应商打印",
                //     interface:"",
                //     stateList:[]
                // }
            ],
            vStateList:[
                {name:"待接待人数",count:0,key:"noReceived"},
                {name:"已接待人数",count:0,key:"Received"},
                {name:"正在拜访人数",count:0,key:"visiting"},
                {name:"离开人数",count:0,key:"leave"},
                {name:"预约总数",count:0,key:"appointment"},
                {name:"邀请总数",count:0,key:"invite"},
                {name:"签到人数",count:0,key:"checkIn"},
                {name:"未到人数",count:0,key:"noArrived"},
                {name:"访客总数",count:0,key:"total"},
            ],
            vState:0,
            columns:[
                {
                  title: '姓名',
                  key: 'vname',
                  width:"14%",
                  render: (data)=>{
                        return(
                            <div className="tableItem_name">
                                <Checkbox 
                                    checked={data.checked}
                                    style={{display:((this.state.vState==0||this.state.vState==2)&&this.state.vType==0)||this.state.vType==1?"inline-block":"none"}}
                                    onClick={()=>{
                                        return
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
                    render:(data)=>{
                        return data.slice(0,3)+"****"+data.slice(data.length-4,data.length)
                    }
                },
                {
                    title: '拜访事由',
                    dataIndex: 'vTypeOnShow',
                    key: 'vTypeOnShow',
                },
                {
                    title: '访客单位',
                    dataIndex: 'vcompany',
                    key: 'vcompany',
                },
                {
                    title: '接待人姓名',
                    dataIndex: 'rname',
                    key: 'rname',
                },
                {
                    title: '是否进入实验室',
                    dataIndex: 'secret',
                    key: 'secret',
                    width:"12%",
                    render:(data)=>{
                        let content = data?"是":"否"
                        return <span>{content}</span>
                    }
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
            subColumns:[
                {
                  title: '项目名称',
                  key: 'vname',
                  width:"14%",
                  render: (data)=>{
                        return(
                            <div className="tableItem_name">
                                <Checkbox 
                                    checked={data.checked}
                                />
                                <div className="defaultImg">
                                    <span>{data.vname}</span>
                                </div>
                            </div>
                        )
                  }
                },
                {
                    title: '工作单位',
                    dataIndex: 'signOutDate',
                    key: 'signOutDate'
                },
                {
                    title: '项目负责人',
                    dataIndex: 'signOutDate',
                    key: 'signOutDate'
                },
                {
                    title: '联系电话',
                    dataIndex: 'signOutDate',
                    key: 'signOutDate'
                },
                {
                    title: '作业日期与时间',
                    dataIndex: 'signOutDate',
                    key: 'signOutDate'
                },
            ],
            baseList:[],
            dataSource:[],
            date:new Date().format('yyyy-MM-dd'),

            goSignIn:false,     // 接待弹窗开关
            signInRetuen:false, // 未答题驳回
            signInRetuen_Name:"王师傅",
            signInInfo:{        // 接待信息
                empId:"",
                cardId:"",
                name:"",
                phone:""
            },

            empList:[],         // 员工列表

            maskSwitch: false,   // 遮罩开关
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
                                        <li 
                                            className={this.state.vType == i?"action":""}
                                            key={i+"vtype"}
                                            onClick={this.changeVtype.bind(this,i)}
                                            style={{width:100/this.state.vTypelist.length+"%"}}
                                        >
                                            <span>{item.name}</span>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        <ul 
                            className="component_VisitorList_btnGroup_actions"
                            style={{display:(this.state.vState==0||this.state.vState==2)&&this.state.vType==0?"block":"none"}}
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
                        <ul 
                            className="component_VisitorList_btnGroup_actions"
                            style={{display:this.state.vType == 4?"block":"none"}}
                        >
                            <li 
                                className="component_VisitorList_btnSelectAll"
                            >
                                <span>打印</span>
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
                                            <li key={i+"vstate"}
                                                style={{width:100/this.state.vTypelist[this.state.vType].stateList.length+"%"}}
                                                className={this.state.vState == i?"action":""}
                                                onClick={this.changeState.bind(this,i)}
                                            >
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
                                    placeholder="请输入访客的姓名"
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
                            columns={this.state.vType!=4?this.state.columns:this.state.subColumns}
                            dataSource={this.state.dataSource} 
                            scroll={{y:this.state.tableHeight}} 
                            pagination={{ pageSize:Math.round(parseInt(this.state.tableHeight)/90) }}
                            locale={{emptyText: '暂无数据'}}
                            onRow={(record)=>{
                                return {
                                    onClick:(e)=>{
                                        let oArr = this.state.dataSource
                                        for(let i = 0;i < oArr.length;i++){
                                            if(oArr[i].vid === record.vid){
                                                oArr[i].checked = !oArr[i].checked
                                            }
                                        }
                                        this.setState({
                                            dataSource:oArr
                                        })
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
                <div    
                    id="component_VisitorList_signIn"
                    style={{display:this.state.goSignIn?"block":"none"}}
                >
                    <div id="component_VisitorList_signInRetuen" style={{display:this.state.signInRetuen?"block":"none"}}>
                        <div>
                            <img src={warningImg} />
                        </div>
                        <div id="component_VisitorList_signInRetuen_content">
                            {this.state.signInRetuen_Name}暂不可接待，请先进行培训答题。
                        </div>
                        <div>
                            <div
                                id="component_VisitorList_signInRetuen_btn"
                                onClick={
                                    (()=>{
                                        this.setState({
                                            goSignIn:false,
                                            signInRetuen:false,
                                            signInRetuen_Name:"",
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
                                知道了
                            </div>
                        </div>
                    </div>
                    <div id="component_VisitorList_signInBoard"
                        style={{display:!this.state.signInRetuen?"block":"none"}}
                    >
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
                                                },300)
                                            })
                                        }).bind(this)
                                    }
                                />
                                {/* <span className="signInBoard_Btn" onClick={this.getEmpNameById.bind(this)}>读取</span> */}
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

                <div id="visitorList_mask" style={{display:this.state.maskSwitch?"block":"none"}}>
                    <div>
                        <img src={loadingGif} />
                        正在提交
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

        // 获取员工表单
        this.getEmpList()

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
     * @description [获取员工列表]
     */
    getEmpList(){
        Common.ajaxProc('getSubAccountEmpList', {userid:sessionStorage.userid}, sessionStorage.token).done((res)=>{
            if(res.status == 0){
                this.setState({
                    empList: res.result
                })
            }
        })
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
        if(arguments.length ==0 ){
            i = this.state.vState
        }
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
                for(let i = 0; i < tempArr.length;i++){
                    for(let j = i+1;j < tempArr.length;j++){
                        if(new Date(tempArr[i].signOutDate.replace(/-/g,"/")).getTime()<new Date(tempArr[j].signOutDate.replace(/-/g,"/")).getTime()){
                            let temp = tempArr[i];
                            tempArr[i] = tempArr[j];
                            tempArr[j] = temp
                        }
                    }
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
            case "noReceived":
                for(let i = 0; i <this.state.baseList.length; i++){
                    if(!this.state.baseList[i].rname){
                        tempArr.push(this.state.baseList[i])
                    }
                }
                break;
            case "Received":
                for(let i = 0; i <this.state.baseList.length; i++){
                    if(!!this.state.baseList[i].rname){
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
        Common.ajaxProc(interfaceName, sendData, sessionStorage.token).done((data)=>{
            if(data.status == 0){
                if(!data.result.length){
                    this.setState({
                        dataSource:[],
                        baseList:[],
                        vStateList:[
                            {name:"待接待人数",count:0,key:"noReceived"},
                            {name:"已接待人数",count:0,key:"Received"},
                            {name:"正在拜访人数",count:0,key:"visiting"},
                            {name:"离开人数",count:0,key:"leave"},
                            {name:"预约总数",count:0,key:"appointment"},
                            {name:"邀请总数",count:0,key:"invite"},
                            {name:"签到人数",count:0,key:"checkIn"},
                            {name:"未到人数",count:0,key:"noArrived"},
                            {name:"访客总数",count:0,key:"total"},
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
                let noReceived = 0;
                let Received = 0;

                for(let i = 0; i < data.result.length; i++){
                    let item = data.result[i];
                    let extendCol = !!data.result[i].extendCol?JSON.parse(data.result[i].extendCol.replace(/&quot;/g,'"')):{};
                    let secret = !!extendCol.secret;

                    item.secret = secret

                    
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
                    if(!!item.rname){
                        Received++
                    }else{
                        noReceived++
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
                        case "noReceived":
                            vStateList[i].count=noReceived
                            break;
                        case "Received":
                            vStateList[i].count=Received
                            break;
                        default:
                            break;
                    }
                }

                this.setState({
                    dataSource:resArr,
                    vStateList:vStateList,
                    baseList:resArr
                },()=>{
                    this.changeState()
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
        return
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
                    if(item.vname.indexOf(key) !== -1){
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
        for(let i = 0; i < dataArr.length;i++){
            if(!this.checkAnswer(dataArr[i])){
                this.setState({
                    goSignIn:true,
                    signInRetuen:true,
                    signInRetuen_Name:dataArr[i].vname
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
        let resBool = false;
        let infoList = [target.vemail, target.vphone, target.cardId]
		for(let i = 0;i<infoList.length;i++){
			if(sessionStorage.questionnaireSwitch == 0){
                resBool = true;
                return resBool
            }
			if(resBool){
				continue;
			}
			let item = infoList[i];
			if(!item){
				continue;
			}
			if(target.tid == "0"){
                resBool = false
				return resBool;
			}
			Common.ajaxProcWithoutAsync("getVisitorTypeByTid",{"tid": target.tid,"userid": sessionStorage.userid},sessionStorage.token).done((data)=>{
				if(!data.result.qid){
                    resBool = true
                    return resBool
				}
				let getAnswerResult = Common.ajaxProcWithoutAsync("getAnswerResult",{"identity": item,"userid": sessionStorage.userid},sessionStorage.token);
				getAnswerResult.done((res)=>{
					if(!res.result || !res.result.passDate) {
                        resBool = false
						return false
					} else if ( new Date().getTime() > new Date(new Date(Number(res.result.passDate)).format("yyyy-MM-dd 00:00:00")).getTime()+Number(data.result.povDays)*24*60*60*1000){
                        resBool = false
                        return false
					}else {
                        resBool = true
						return true
					}
                })
			})

        }
        return resBool
    }

    /**
     * @description [设置接待人]
     */
    async setReceptionist(){
        await this.asyceSetState({
            maskSwitch:true
        })
        if(!this.state.signInInfo.name){
            Toast.open({
                type:"danger",
                content: "请输入接待人姓名"
            })
            this.setState({
                maskSwitch:false
            })
            return
        }else {
            let empList = this.state.empList;
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
                this.setState({
                    maskSwitch:false
                })
                return
            }
        }
        let selectedList = []
        for(let i = 0;i < this.state.dataSource.length;i++){
            if(this.state.dataSource[i].checked){
                selectedList.push(this.state.dataSource[i])
            }
        }
        let printList = []
        for(let i = 0;i < selectedList.length;i++){
            let item = selectedList[i]
            let sendData = {
                vid:item.vid
            }
            if(!!this.state.signInInfo.name){
                sendData.rname=this.state.signInInfo.name
            }
            if(!!this.state.signInInfo.empId){
                sendData.rempNo=this.state.signInInfo.empId
            }
            if(!!this.state.signInInfo.cardId){
                sendData.rcardId=this.state.signInInfo.cardId
            }
            if(!!this.state.signInInfo.phone){
                sendData.rphone=this.state.signInInfo.phone
            }
            Common.ajaxProc("setReceptionist",sendData, sessionStorage.token).done((res)=>{
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
                    printList.push({vid:"v"+item.vid})
                    if(++i >= selectedList.length){
                        this.asyceSetState({
                            maskSwitch:false
                        })
                        this.props.history.replace({pathname:"print",state:{printList:printList}})
                    }
                }else{
                    Toast.open({
                        type:"danger",
                        content: "绑定失败"
                    })
                }
            })
        }
    }
    async asyceSetState(state) {
        new Promise((resolve, reject) => {
          this.setState(state, () => { resolve() })
        })
    }
    /**
     * @description [根据IC卡查员工姓名]
     */
    getEmpNameById(){
        let _this = this
        
        setTimeout(()=>{
            if(!_this.state.signInInfo.empId){
                return
            }
            let empList = _this.state.empList;
            let flag = false;
            for(let i = 0;i < empList.length;i++){
                if((_this.state.signInInfo.empId == empList[i].empNo||_this.state.signInInfo.empId == empList[i].cardNo)){
                    flag = true;
                    let obj = _this.state.signInInfo;
                    obj.name = empList[i].empName;
                    obj.empId = empList[i].empNo||"";
                    _this.setState({
                        signInInfo:obj,
                    })
                    break;
                }
            }
            if(!flag){
                let obj = _this.state.signInInfo;
                obj.name = ""
                _this.setState({
                    signInInfo:obj
                })
                // Toast.open({
                //     type:"danger",
                //     content: "无效员工"
                // })
                return
            }
        },1000)
    }

    /**
     *  @description [16进制转10进制]
     */
    hex2int(hex){
        var len = hex.length, a = new Array(len), code;
        for (var i = 0; i < len; i++) {
            code = hex.charCodeAt(i);
            if (48<=code && code < 58) {
                code -= 48;
            } else {
                code = (code & 0xdf) - 65 + 10;
            }
            a[i] = code;
        }
         
        return a.reduce(function(acc, c) {
            acc = 16 * acc + c;
            return acc;
        }, 0);
    }
}