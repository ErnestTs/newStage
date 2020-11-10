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
                    name:"登记访客",
                    interface:"SearchVisitByConditionPage",
                    async:"SearchVisitByCondition",
                    stateList:["total","leave","visiting"],
                    type:0
                },
                {
                    name:"预约访客",
                    interface:"SearchAppointmentByConditionPage",
                    async:"SearchAppointmentByCondition",
                    stateList:["appointment","checkIn","noArrived"],
                    type:2
                },
                {
                    name:"邀请访客",
                    interface:"searchInviteByConditionPage",
                    async:"searchInviteByCondition",
                    stateList:["invite","checkIn","noArrived"],
                    type:1
                },
                {
                    name:"常驻访客",
                    interface:"SearchRVisitorByConditionPage",
                    stateList:["total","leave","visiting"],
                    type:0
                }
            ],
            vStateList:[
                {name:"访客总数",count:0,key:"total",type:0},
                {name:"离开人数",count:0,key:"leave",type:3},
                {name:"正在拜访人数",count:0,key:"visiting",type:1},
                {name:"预约总数",count:0,key:"appointment",type:0},
                {name:"邀请总数",count:0,key:"invite",type:0},
                {name:"签到人数",count:0,key:"checkIn",type:4},
                {name:"未到人数",count:0,key:"noArrived",type:2},
            ],
            vState:0,
            columns:[
                {
                  title: '姓名',
                  key: 'vname',
                  width:"17%",
                  align:'center',
                  render: (data)=>{
                        return(
                            <div className="tableItem_name">
                                <Checkbox 
                                    checked={data.checked}
                                    style={{display:this.state.vState==2&&this.state.vType==0?"inline-block":"none",float:"left"}}
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
                                    {/* <img onClick={this.goLogin.bind(this,data)} src={data.vphoto || defaultImg} /> */}
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

            page: 1,
            totalPage:0,

            keyword:""
        }
    }

    render(){
        return(
            <div id="component_VisitorList">
                <div className="component_VisitorList_btnGroup">
                    <div className="component_VisitorList_topBar1">
                        <ul className="component_VisitorList_btnGroup_vtype">
                            {
                                this.state.vTypelist.map((item,i,arr)=>{
                                    return (
                                        <li 
                                            style={{width:100/arr.length+"%"}} 
                                            className={this.state.vType == i?"action":""} 
                                            key={i+"vtype"} 
                                            onClick={this.changeVtype.bind(this,i)}
                                        >
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
                                <span>批量签出</span>
                            </li>
                            <li className="component_VisitorList_btnCheckOut" onClick={this.batchSignOut.bind(this)}>
                                <span>签出</span>
                            </li>
                            <li className="component_VisitorList_btnCancel" onClick={this.selectAll.bind(this,false)}>
                                <span>取消</span>
                            </li>
                        </ul>
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
                                    placeholder="请输入访客的姓名"
                                    onChange={this.queryRecord.bind(this)}
                                    id="visitorListQuery"
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
                            pagination={{ 
                                pageSize:Math.round(parseInt(this.state.tableHeight)/90),
                                total:this.state.totalPage,
                                current:this.state.page,
                                onChange:this.pageChange.bind(this),
                                showSizeChanger:false
                            }}
                            locale={{emptyText: '暂无数据'}}
                        />
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount(){

        // 设定表格高度
        let coefficient = document.body.clientHeight>1000?0.70:0.58
        
        // 设定表格高度
        this.state.tableHeight=document.getElementById("component_VisitorList_tableBox").offsetHeight*coefficient;

        // 初始化
        this.init()
    }

    /**
     * @description [初始化]
     */
    init(){
        // 获取当前表单
        this.getVisitorInfo()
        this.getVisitorStatistics()
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
            vState:vTypeIndex,
            page:1
        },()=>{
            // 获取当前表单
            this.getVisitorInfo()
            this.getVisitorStatistics()
        })
    }

    /**
     * @description [修改当前显示访客状态]
     * @param {Number} index [下标]
     */
    changeState(i){
        this.setState({
            vState:i,
            page:1
        },()=>{
            this.getVisitorInfo()
        })
    }

    /**
     * @description [修改时间时重新请求数据]
     * @param {String} date [yyyy-MM-dd]
     */
    changeDate(date){
        this.setState({
            date:date
        },()=>{
            this.getVisitorInfo()
            // this.queryRecord()
            this.getVisitorStatistics()
        })
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

            searchType: this.state.vStateList[this.state.vState].type,

            startIndex:(this.state.page-1)*Math.round(parseInt(this.state.tableHeight)/90),
            requestedCount:Math.round(parseInt(this.state.tableHeight)/90),
            reception: this.state.keyword
        };
        Common.ajaxProcWithoutAsync(interfaceName, sendData, sessionStorage.token).done((data)=>{
            if(data.status == 0){
                if(!data.result.list || !data.result.list.length){
                    this.setState({
                        dataSource:[],
                        baseList:[],
                        vStateList:[
                            {name:"访客总数",count:0,key:"total",type:0},
                            {name:"离开人数",count:0,key:"leave",type:3},
                            {name:"正在拜访人数",count:0,key:"visiting",type:1},
                            {name:"预约总数",count:0,key:"appointment",type:0},
                            {name:"邀请总数",count:0,key:"invite",type:0},
                            {name:"签到人数",count:0,key:"checkIn",type:4},
                            {name:"未到人数",count:0,key:"noArrived",type:2},
                        ]
                    },()=>{
                        this.getListInfoWithAsync()
                    })
                    return
                }
                let resArr = [];

                for(let i = 0; i < data.result.list.length; i++){
                    let item = data.result.list[i];
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
                    }else if(!!item.leaveTime){
                        item.state = 5;
                    }else if(!!item.visitdate){
                        item.state = 1;
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
                    }

                    if(!!item.visitType){
                        item.vTypeOnShow = item.visitType.split("#")[0]
                    }else{
                        item.vTypeOnShow = ""
                    }
                    item.checked = false;
                    item.key = item.appointmentDate+interfaceName+item.vphone+item.vid+i;
                    
                    resArr.push(item)
                }

                let totalPage = data.result.count
                this.setState({
                    dataSource:resArr,
                    baseList:resArr,
                    totalPage:totalPage
                },()=>{
                    this.getListInfoWithAsync()
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
        if(this.state.vTypelist[this.state.vType].async=="searchInviteByCondition"){
           obj.signin = 1
        }
        this.props.history.push({pathname:"/home/appointmentInfo", state:[obj]});
    }

    /**
     * @description [模糊搜索]
     * @param {Event} e
     */
    queryRecord(e){
        if(e.target.value == this.state.keyword){
            return
        }
        let _this = this
        let target = e.target
        setTimeout(()=>{
            _this.state.keyword = target.value
            _this.getVisitorInfo()
        },2000)
    }

    /**
     * @description [修改分页]
     * @param {Number} page [页码]
     */
    pageChange(page){
        this.setState({
            page: page
        },()=>{
            this.getVisitorInfo()
        })
    }

    /**
     * @description [异步获取页面信息]
     */
    getListInfoWithAsync(){
        return
        let type = this.state.vTypelist[this.state.vType]
        let vStateList = this.state.vStateList

        let stateList = type.stateList;
        
        for(let i = 0; i < stateList.length; i++){
            let item = stateList[i]
            let typeNumber = null;
            let index = undefined
            for(let j = 0; j < vStateList.length; j++){
                if(vStateList[j].key == item){
                    typeNumber = this.state.vStateList[j].type;
                    index = j
                    break;
                }
            }
            
            let sendData = {
                userid: sessionStorage.userid,
                gid: sessionStorage.gid,
                date: this.state.date,
                endDate: this.state.date,
                searchType:typeNumber,
                startIndex:0,
                requestedCount:1,
                reception:""
            };
            if(type.interface == "getNotSendCardVisitPage"){
                sendData.searchType = 0;
                sendData.clientNo = this.state.vStateList[index].type;
            }
            Common.ajaxProcWithoutAsync(type.interface, sendData, sessionStorage.token).done((res)=>{
                if(index != undefined){
                    vStateList[index].count = res.result.count  
                }
            })
        }
        this.setState({
            vStateList:vStateList
        })
    }

    /**
     * @description [单接口获取访客数]
     */
    getVisitorStatistics(){
        let type = this.state.vTypelist[this.state.vType].type
        let sendData = {
            userid: sessionStorage.userid,
            gid: sessionStorage.gid,
            date: this.state.date,
            endDate: this.state.date,
            signinType:type
        };
        Common.ajaxProcWithoutAsync("getVisitorStatistics", sendData, sessionStorage.token).done((res)=>{
            if(!!res.result){
                let vStateList = this.state.vStateList
                for(let i of vStateList){
                    switch (i.key) {
                        case "total":
                            i.count = res.result.totalVisitor
                            break;
                    
                        case "leave":
                            i.count = res.result.signOutCount
                            break;
                
                        case "visiting":
                            i.count = res.result.nowVCount
                            break;
            
                        case "appointment":
                            i.count = res.result.totalVisitor
                            break;
        
                        case "invite":
                            i.count = res.result.totalVisitor
                            break;
    
                        case "checkIn":
                            i.count = res.result.arrivedCount
                            break;

                        case "noArrived":
                            i.count = res.result.noArrivedCount
                            break;
                        default:
                            break;
                    }
                }
                this.setState({
                    vStateList:vStateList
                })
            }
        })
    }
}