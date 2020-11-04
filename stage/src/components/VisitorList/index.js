import React,{Component} from "react"
import $ from "jquery"
import { Table,DatePicker,Checkbox,Select } from 'antd';
import moment from 'moment';

import Common from "../../Common/index"

import "./index.css"

// Toast
import Toast from "../../components/ToastPublic/index.jsx"


import defaultImg from "../../resource/defaultPhoto_mini.png"
import printImg from "../../resource/printImg.png"
import search_icon from "../../resource/search_icon.png"

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
                    stateList:["total","leave","visiting"]
                },
                {
                    name:"预约访客",
                    interface:"SearchAppointmentByConditionPage",
                    async:"SearchAppointmentByCondition",
                    stateList:["appointment","checkIn","noArrived"]
                },
                {
                    name:"邀请访客",
                    interface:"searchInviteByConditionPage",
                    async:"searchInviteByCondition",
                    stateList:["invite","checkIn","noArrived"]
                },
                {
                    name:"待发卡访客",
                    interface:"getNotSendCardVisitPage",
                    async:"getNotSendCardVisit",
                    stateList:["PAD","wechat","invitation","stage","QL_FK"]
                }
            ],
            vStateList:[
                {name:"访客总数",count:0,key:"total",type:0},
                {name:"离开人数",count:0,key:"leave",type:2},
                {name:"正在拜访人数",count:0,key:"visiting",type:1},
                {name:"预约总数",count:0,key:"appointment",type:0},
                {name:"邀请总数",count:0,key:"invite",type:0},
                {name:"签到人数",count:0,key:"checkIn",type:1},
                {name:"未到人数",count:0,key:"noArrived",type:2},
                {name:"PAD",count:0,key:"PAD",type:5},
                {name:"小程序",count:0,key:"wechat",type:1},
                {name:"邀请函",count:0,key:"invitation",type:2},
                {name:"礼宾台",count:0,key:"stage",type:3},
                {name:"访客机",count:0,key:"QL_FK",type:4},
            ],
            vState:0,
            columns:[
                {
                  title: '姓名',
                  key: 'vname',
                  width:"8%",
                  render: (data)=>{
                        return(
                            <div className="tableItem_name">
                                <Checkbox 
                                    checked={data.checked}
                                    // style={{display:this.state.vState==2&&this.state.vType==0?"inline-block":"none"}}
                                    style={{display:"none"}}
                                    onClick={()=>{
                                        let tempArr = this.state.dataSource;
                                        tempArr[data.key].checked = !tempArr[data.key].checked;
                                        this.setState({
                                            dataSource:tempArr
                                        })
                                    }} 
                                />
                                <div className="defaultImg">
                                    {/* <img onClick={this.goLogin.bind(this,data)} src={data.vphoto || defaultImg} /> */}
                                    <span onClick={this.goLogin.bind(this,data)}>{data.vname}</span>
                                    {/* <img
                                        className="printIcon"
                                        src={printImg}
                                        style={{display:data.state == 1&&data.visitType !== "常驻访客"?"inline-block":"none"}}
                                        onClick={
                                            ()=>{
                                                this.props.history.replace({pathname:"print",state:{printList:[{vid:"v"+data.vid}]}})
                                            }
                                        }
                                    /> */}
                                </div>
                            </div>
                        )
                  }
                },
                {
                    title: '性别',
                    dataIndex: 'sex',
                    key: 'sex',
                    render:(data)=>{
                        return <span>{data==0?"女":"男"}</span>
                    }
                },
                {
                    title: '手机号',
                    dataIndex: 'vphone',
                    key: 'vphone',
                    width:"10%",
                    render:(data)=>{
                        if(!!data){
                            return <span>{data.substring(0,3)+"****"+data.substring(7,11)}</span>
                        }else{
                            return <span></span>
                        }
                    }
                },
                {
                    title: '拜访事由',
                    dataIndex: 'vTypeOnShow',
                    key: 'vTypeOnShow',
                },
                {
                    title: "被访人",
                    dataIndex: 'empName',
                    key: 'empName',
                    width:"11%",
                },
                {
                    // title: '被访公司（中文）',
                    title: ()=>{
                        if(this.state.vState==0||this.state.vState==3||this.state.vState==4){
                            return '被访公司'
                        }else{
                            return '被访公司（中文）'
                        }
                    },
                    dataIndex: 'company',
                    key: 'company',
                    width:"11%",
                    render:(data)=>{
                        return data.split("#")[0]
                    }
                },
                {
                    title: ()=>{
                        if(this.state.vState==0||this.state.vState==3||this.state.vState==4){
                            return '临时卡号'
                        }else{
                            return '被访公司（英文）'
                        }
                    },
                    key: 'company',
                    width:"11%",
                    render:(data)=>{
                        if(this.state.vState==0||this.state.vState==3||this.state.vState==4){
                            return data.cardNo
                        }else{
                            return data.company.split("#")[1]
                        }
                    }
                },
                {
                    title: '签到时间',
                    dataIndex: 'visitdate',
                    key: 'visitdate',
                    width:"11%",
                },
                {
                    title: '签出时间',
                    dataIndex: 'signOutDate',
                    key: 'signOutDate',
                    width:"11%",
                },
                {
                    title: '状态',
                    dataIndex: 'state',
                    key: 'state',
                    width:"8%",
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
                            case 6:
                                return <span className="statusTag red">已取消</span>
                            default:
                                return <span className="statusTag"></span>
                        }
                    }
                },
            ],
            tempCardColumns:[
                {
                  title: '姓名',
                  key: 'vname',
                  width:"8%",
                  render: (data)=>{
                        return(
                            <div className="tableItem_name">
                                <Checkbox 
                                    checked={data.checked}
                                    // style={{display:this.state.vState==2&&this.state.vType==0?"inline-block":"none"}}
                                    style={{display:"none"}}
                                    onClick={()=>{
                                        let tempArr = this.state.dataSource;
                                        tempArr[data.key].checked = !tempArr[data.key].checked;
                                        this.setState({
                                            dataSource:tempArr
                                        })
                                    }} 
                                />
                                <div className="defaultImg">
                                    {/* <img onClick={this.goLogin.bind(this,data)} src={data.vphoto || defaultImg} /> */}
                                    <span onClick={this.goLogin.bind(this,data)}>{data.vname}</span>
                                    {/* <img
                                        className="printIcon"
                                        src={printImg}
                                        style={{display:data.state == 1&&data.visitType !== "常驻访客"?"inline-block":"none"}}
                                        onClick={
                                            ()=>{
                                                this.props.history.replace({pathname:"print",state:{printList:[{vid:"v"+data.vid}]}})
                                            }
                                        }
                                    /> */}
                                </div>
                            </div>
                        )
                  }
                },
                {
                    title: '性别',
                    dataIndex: 'sex',
                    key: 'sex',
                    render:(data)=>{
                        return <span>{data==0?"女":"男"}</span>
                    }
                },
                {
                    title: '手机号',
                    dataIndex: 'vphone',
                    key: 'vphone',
                    render:(data)=>{
                        // return <span>{data.replace(/(?<=[\d]{3})[\d](?=[\d]{4})/g, "*")}</span>
                        if(!!data){
                            return <span>{data.substring(0,3)+"****"+data.substring(7,11)}</span>
                        }else{
                            return <span></span>
                        }
                    }
                },
                {
                    title: '拜访事由',
                    dataIndex: 'vTypeOnShow',
                    key: 'vTypeOnShow',
                },
                {
                    title: '被访人',
                    dataIndex: 'empName',
                    key: 'empName',
                },
                {
                    title: '被访公司（中文）',
                    dataIndex: 'company',
                    key: 'company',
                    width:"15%",
                    render:(data)=>{
                        return data.split("#")[0]
                    }
                },
                {
                    title: '被访公司（英文）',
                    dataIndex: 'company',
                    key: 'company',
                    width:"15%",
                    render:(data)=>{
                        return data.split("#")[1]
                    }
                },
                {
                    title: '已授权楼层',
                    dataIndex: 'floors',
                    key: 'floors',
                    render:(data)=>{
                        if(!!data&&data[data.length-1]=="/"){
                            data = data.slice(0,data.length-1)
                        }
                        return <span>{data}</span>
                    }
                },
                {
                    title: '状态',
                    dataIndex: 'state',
                    key: 'state',
                    render:()=>{
                        return <span className="statusTag brown">待发卡</span>
                    }
                },
            ],
            baseList:[],
            dataSource:[],
            date:new Date().format('yyyy-MM-dd'),
            onSelectList:[],
            selectedRowKeys:[],
            openToast:0,
            tempCard:"",
            notSendCardVisits:0,
            floorsList:[],
            floorsListOnShow:[],
            targetFloorName:"",

            page: 1,
            totalPage:0,

            keyword:""
        }
    }

    render(){
        const { onSelectList,selectedRowKeys } = this.state;
        const rowSelection = {
            onSelectList,
            selectedRowKeys,
            type:'radio',
            preserveSelectedRowKeys:false,
            onChange: this.selectedRow.bind(this)
        };
        const { Option } = Select;
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
                                            <span>{item.name}<span style={{display:i==3?"inline":"none"}}>({this.state.notSendCardVisits})</span></span>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        <ul 
                            className="component_VisitorList_btnGroup_actions"
                            // style={{display:this.state.vState==2&&this.state.vType==0?"block":"none"}}
                            style={{display:"none"}}
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
                        <ul 
                            className="component_VisitorList_btnGroup_actions"
                            style={{display:this.state.vType==3||this.state.vType==0?"block":"none"}}
                        >
                            <li className="component_VisitorList_setTempCard" onClick={this.getVisitorInfo.bind(this)}>
                                <span>刷新</span>
                            </li>
                            <li className="component_VisitorList_setTempCard" onClick={this.sendCard.bind(this)}>
                                <span>发卡</span>
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
                                        let length = this.state.vTypelist[this.state.vType].stateList.length
                                        return (
                                            <li style={{width:100/length+"%"}}
                                                key={i+"vstate"}
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
                                <img src={search_icon} />
                                <input
                                    placeholder="请输入访客的姓名/公司/手机号"
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
                            rowSelection={this.state.vType == 3||this.state.vType == 0?rowSelection:null}
                            className="tableBox" 
                            columns={this.state.vType !== 3?this.state.columns:this.state.tempCardColumns}
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
                            onRow={(record)=>{
                                return {
                                    onClick:(e)=>{
                                        this.selectedRow([record.key],[record])
                                    }
                                }
                            }}
                        />
                    </div>
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
                        <div className="inputBox selectBox" style={{marginTop:"3vh"}}>
                            <span>门禁权限：</span>
                            
                            <Select
                                showSearch
                                style={{ width: '14vw' }}
                                placeholder="请选择门禁权限"
                                value={this.state.targetFloorName||""}
                                onChange={(val)=>{
                                    this.setState({
                                        targetFloorName:val
                                    })
                                }}
                            >
                                {
                                    this.state.floorsListOnShow.map((item)=>{
                                        return(
                                            <Option 
                                                value={item.name} 
                                                key={item.egid}
                                                className={ item.def?"defAccess":"" }
                                            >
                                                <span>{item.name}</span>
                                            </Option>
                                        )
                                    })
                                }
                            </Select>
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
                </div>
            </div>
        )
    }

    componentDidMount(){

        // 设定表格高度
        let coefficient = document.body.clientHeight>1000?0.70:0.58
        // this.setState({
        //     tableHeight:document.body.clientHeight*coefficient
        // })
        
        // 设定表格高度
        this.state.tableHeight = document.getElementById("component_VisitorList_tableBox").offsetHeight*coefficient

        // 初始化
        this.init()
    }

    /**
     * @description [初始化]
     */
    init(){
        // 获取当前表单
        this.getVisitorInfo()
        this.getTempCardCount()
        Common.ajaxProc("getEquipmentGroupByUserid",{userid: sessionStorage.userid}).done((res)=>{
            if(res.status == 0){
                let eList = res.result;
                let resArr = []
                for(let i = 0;i < eList.length; i++){
                    if(!eList[i].gids||eList[i].egname.indexOf("FACE")==0||!eList[i].gids||eList[i].egname.indexOf("人脸")==0){
                        continue;
                    }
                    if(eList[i].gids.indexOf(sessionStorage.gid) !== -1){
                        eList[i].egname = eList[i].egname.replace(/&amp;/g, "&");
                        resArr.push({name:eList[i].egname,egid:eList[i].egid})
                    }
                }
                this.setState({
                    floorsList:resArr,
                    floorsListOnShow:resArr,
                })
            }
        })
    }


    /**
     * @description [修改当前显示访客类型]
     * @param {Number} index [下标]
     */
    changeVtype(index){
        if(index==this.state.vType){
            return
        }
        let colArr = this.state.columns
        if(index == 2){
            colArr[4].title = "邀请人"
        }else{
            colArr[4].title = "被访人"
        }
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
            onSelectList:[],
            columns:colArr,
            page:1
        },()=>{
            // 获取当前表单
            this.getVisitorInfo()
            // this.queryRecord()
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
            this.getVisitorInfo();
            // this.queryRecord()
        })
    }

    /**
     * @description [根据时间查询访客信息]
     * @param {Boolean} noRefresh [是否刷新]
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
        if(interfaceName == "getNotSendCardVisitPage"){
            sendData.searchType = 0;
            sendData.clientNo = this.state.vStateList[this.state.vState].type;
        }
        Common.ajaxProc(interfaceName, sendData, sessionStorage.token).done((data)=>{
            if(data.status == 0){
                this.getTempCardCount()
                if(!data.result.list || !data.result.list.length){
                    this.setState({
                        dataSource:[],
                        baseList:[],
                        vStateList:[
                            {name:"访客总数",count:0,key:"total",type:0},
                            {name:"离开人数",count:0,key:"leave",type:2},
                            {name:"正在拜访人数",count:0,key:"visiting",type:1},
                            {name:"预约总数",count:0,key:"appointment",type:0},
                            {name:"邀请总数",count:0,key:"invite",type:0},
                            {name:"签到人数",count:0,key:"checkIn",type:1},
                            {name:"未到人数",count:0,key:"noArrived",type:2},
                            {name:"PAD",count:0,key:"PAD",type:5},
                            {name:"小程序",count:0,key:"wechat",type:1},
                            {name:"邀请函",count:0,key:"invitation",type:2},
                            {name:"礼宾台",count:0,key:"stage",type:3},
                            {name:"访客机",count:0,key:"QL_FK",type:4},
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
                    if(interfaceName == "getNotSendCardVisitPage"){
                        let toady = new Date().format("yyyy-MM-dd")
                        let pCardDate = (JSON.parse(item.extendCol.replace(/&quot;/g,'"'))).pCardDate
                        if(pCardDate==toady){
                            // continue;
                        }
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
                        }
                        else if(item.status == 5){
                            item.state = 6;
                        }
                        else{
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
                                case 3:
                                    item.state = 6;
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
                this.selectedRow([resArr[0].key],[resArr[0]])
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
     * @description [选中访客]
     * @param {*} keys 
     * @param {*} rows 
     */
    selectedRow(keys, rows){
        this.setState({
            selectedRowKeys:keys,
            onSelectList:rows
        })
    }

    /**
     * @description [发卡]
     */
    sendCard(){
        let oList = this.state.onSelectList;
        if(!oList.length){
            Toast.open({
                type:"danger",
                content: "请选择访客"
            })
            return;
        }else{
            let _this = this
            window.tempSerCard = function(e){
                if(e.keyCode == 13){
                    _this.setTempCard()
                }
            }
            document.body.addEventListener("keyup",
                window.tempSerCard
            )
            this.getDefAccess(oList)
            this.setToast(1)
        }
    }

    /**
     * @description [关闭临时卡弹窗]
     */
    closeTempCardBox(){
        this.setState({
            tempCard:"",
            targetFloorName:""
        })
        document.body.removeEventListener("keyup",
            window.tempSerCard
        )
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
        if(!this.state.targetFloorName){
            Toast.open({
                type:"danger",
                content: "请选择楼层"
            })
            return
        }
        let oList = this.state.onSelectList;
        oList.map((item,i)=>{
            let egid = "";
            for(let i = 0; i < this.state.floorsList.length;i++){
                if(this.state.floorsList[i].name == this.state.targetFloorName){
                    egid += this.state.floorsList[i].egid
                }
            }
            Common.ajaxProc("updateVisitorCardNo",
                {
                    vid:item.vid,
                    cardNo:this.state.tempCard,
                    cardOpName:sessionStorage.opname,
                    access:egid,
                    appid:item.appid
                },sessionStorage.token).done((res)=>{
                if (res.status === 0) {
                    Toast.open({
                        type:"success",
                        content: "发卡成功"
                    })
                    this.setState({
                        onSelectList:[]
                    })
                    this.closeTempCardBox()
                    this.getVisitorInfo()
                }
            })
        })
        this.setToast(0)
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
     * @description [获取临时卡计数]
     */
    getTempCardCount(){
        let sendData = {
            userid: sessionStorage.userid,
            gid: sessionStorage.gid,
            date: this.state.date,
            endDate: this.state.date,
            searchType:1,
            clientNo:0,
            startIndex:this.state.page,
            requestedCount:Math.round(parseInt(this.state.tableHeight)/90),
            reception:""
        };
        Common.ajaxProc("getNotSendCardVisitPage", sendData, sessionStorage.token).done((res)=>{
            if(res.status == 0){
                if(!!res.result.count){
                    // let tempCount = 0;
                    // let toady = new Date().format("yyyy-MM-dd")
                    // for(let i = 0;i < res.result.length;i++){
                    //     let pCardDate = (JSON.parse(res.result[i].extendCol.replace(/&quot;/g,'"'))).pCardDate;
                    //     if(pCardDate==toady){
                    //         continue;
                    //     }
                    //     if(!!res.result[i].clientNo){
                    //         tempCount++
                    //     }
                    // }
                    this.setState({
                        notSendCardVisits:res.result.count
                    })
                }else{
                    this.setState({
                        notSendCardVisits:0
                    })
                }
            }
        })
    }

    /**
     * @description [获取默认门禁]
     */
    getDefAccess(oList){
        Common.ajaxProcWithoutAsync('getSubAccountByUserid', {userid:sessionStorage.userid}, sessionStorage.token).done((data)=>{
            if (data.status === 0 && data.result.length !== 0) {
                for(let i = 0;i<data.result.length;i++){
                    if(data.result[i].companyName === oList[0].company){
                        let sendData = { userid: sessionStorage.userid, subaccountId: data.result[i].id }
                        Common.ajaxProcWithoutAsync('getSubAccountEmpList', sendData, sessionStorage.token).done((data)=>{
                            if (data.status === 0 && data.result.length !== 0) {
                                for(let i = 0;i<data.result.length;i++){
                                    if(data.result[i].empName === oList[0].empName){
                                        let oTargetSex = oList[0].sex==0?false:true;
                                        let oTargetAccess = JSON.parse(oList[0].extendCol.replace(/&quot;/g, '"')).access
                                        let egids = oTargetAccess;
                                        let floorsListOnShow = [];
                                        var defGname = "";
                                        for(let i = 0; i<this.state.floorsList.length;i++){
                                            if(this.state.floorsList[i].egid == egids){
                                                if(oTargetSex){
                                                    defGname = this.state.floorsList[i].name.replace(/F/g, "M");
                                                }else{
                                                    defGname = this.state.floorsList[i].name.replace(/M/g, "F");
                                                }
                                                break;
                                            }
                                        }
                                        for(let i = 0; i<this.state.floorsList.length;i++) {
                                            if(defGname == this.state.floorsList[i].name){
                                                this.state.floorsList[i].def = true
                                                floorsListOnShow.unshift(this.state.floorsList[i])
                                            }else{
                                                this.state.floorsList[i].def = false
                                                floorsListOnShow.push(this.state.floorsList[i])
                                            }
                                        }
                                        this.setState({
                                            targetFloorName:floorsListOnShow[0].name,
                                            floorsListOnShow:floorsListOnShow 
                                        })
                                        break;
                                    }
                                }
                            }
                        })
                        break;
                    }
                }
            }
        })
    }

    /**
     * @description [修改分页]
     * @param {Number} page [页码]
     */
    pageChange(page) {
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
}