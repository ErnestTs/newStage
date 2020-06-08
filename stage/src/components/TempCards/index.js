import React,{Component} from "react"
import { Table,DatePicker,Checkbox } from 'antd';
import moment from 'moment';

import Common from "../../Common/index"

import "./index.css"

// Toast
import Toast from "../../components/ToastPublic/index.jsx"

export default class TempCards extends Component {
    constructor(props){
        super(props)

        this.state = {
            cardType:0,
            cardTypelist:[
                {
                    name:"申请中",
                    count:0,
                    key:"applying"
                },
                {
                    name:"借用中",
                    count:0,
                    key:"borrowing"
                },
                {
                    name:"申请记录",
                    count:0,
                    key:"record"
                }
            ],
            columns:[
                {
                    title: '姓名',
                    dataIndex: 'name',
                    key: 'name',
                    width:"12%",
                },
                {
                    title: '申请时间',
                    dataIndex: 'submitTime',
                    key: 'submitTime',
                    // width:"15%",
                },
                {
                    title: '申请卡号',
                    dataIndex: 'cardNo',
                    key: 'cardNo',
                    // width:"15%",
                },
                {
                    title: '归还时间',
                    dataIndex: 'returnTime',
                    key: 'returnTime',
                    // width:"15%",
                },
                {
                    title: '状态',
                    dataIndex: '',
                    key: '',
                    render:(data)=>{
                        switch(data.icStatus){
                            case(0):
                                return
                            case(1):
                                return(
                                    <span className="cards_state borrowing">借用中</span>
                                )
                            case(2):
                                return(
                                    <span className="cards_state returned">已归还</span>
                                )
                            case(3):
                                return(
                                    <span className="cards_state rejected">已拒绝</span>
                                )
                            default:
                                break
                        }
                    }
                },
                {
                    title: '',
                    dataIndex: '',
                    key: '',
                    render:(data)=>{
                        // icStatus 1-借用中 2-已归还 3-已拒绝
                        return(
                            <ul className="buttonsBox">
                                <li style={{display:data.icStatus == 0?"block":"none"}}
                                    onClick={()=>{
                                        this.setState({
                                            onReject:true,
                                            targetInfo:data
                                        }
                                    )}}
                                
                                >
                                    <span>拒绝申请</span>
                                </li>
                                <li 
                                    className="blue" 
                                    style={{display:data.icStatus == 0?"block":"none"}}
                                    onClick={()=>{
                                        this.setState({
                                            onSubmit:true,
                                            targetInfo:data
                                        }
                                    )}}
                                >
                                    <span>通过申请</span>
                                </li>
                                <li 
                                    className="blue" 
                                    style={{display:data.icStatus == 1?"block":"none"}}
                                    onClick={()=>{
                                        this.setState({
                                            onReturn:true,
                                            targetInfo:data
                                        }
                                    )}}
                                >
                                    <span>确认归还</span>
                                </li>
                            </ul>
                        )
                    }
                }
            ],
            baseList:[],
            dataSource:[],
            onSubmitNum:"",
            onSubmit:false,
            rejectionReason:"",
            onReject:false,
            onReturn:false,
            targetInfo:{},
            keyword:"",
            date:new Date().format('yyyy-MM-dd'),
        }
    }

    render(){
        return(
            <div id="component_TempCards">
                <div className="component_TempCards_btnGroup">
                    <ul className="component_TempCards_btnGroup_vtype">
                        {
                            this.state.cardTypelist.map((item,i)=>{
                                return (
                                    <li 
                                        className={this.state.cardType == i?"action":""} 
                                        key={i+"vtype"}
                                        onClick={()=>{
                                            this.setState({
                                                cardType:i
                                            },()=>{
                                                this.searchRecord(this.state.date, this.state.date, this.state.keyword, i)
                                            })
                                        }}
                                    >
                                        <span>{item.name}({item.count})</span>
                                    </li>
                                )
                            })
                        }
                    </ul>
                    <ul className="searchCriteria">
                        <li className="searchContent">
                            <input placeholder="请输入员工姓名或者申请卡号" onChange={this.searchContent.bind(this)} />
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
                <div className="component_TempCards_tableBox">
                    <div id="component_VisitorList_tableBoard">
                        <Table 
                            className="tableBox" 
                            columns={this.state.columns} 
                            dataSource={this.state.dataSource} 
                            scroll={{y:this.state.tableHeight}} 
                            pagination={{ pageSize: 5 }}
                            locale={{emptyText: '暂无数据'}}
                        />
                    </div>
                </div>

                <div style={{display:this.state.onSubmit||this.state.onReject||this.state.onReturn?"block":"none"}} className="component_TempCards_mask"></div>

                <div id="component_TempCards_submit" style={{display:this.state.onSubmit?"block":"none"}}>
                    <div className="title">
                        通过申请
                    </div>
                    <div className="inputBox">
                        <span>申请卡号：</span>
                        <input type="text" value={this.state.onSubmitNum} onChange={(e)=>{this.setState({onSubmitNum:e.target.value})}} />
                    </div>
                    <ul className="btnGroup">
                        <li onClick={()=>{this.setState({onSubmitNum:"",onSubmit:false})}}>
                            取消
                        </li>
                        <li onClick={this.passSubmit.bind(this)}>
                            确定
                        </li>
                    </ul>
                </div>

                <div id="component_TempCards_refuseSubmit" style={{display:this.state.onReject?"block":"none"}}>
                    <div className="title">
                        拒绝申请
                    </div>
                    <div className="inputBox">
                        <span>拒绝理由：</span>
                        <input type="text"
                            value={this.state.rejectionReason} 
                            onChange={(e)=>{this.setState({rejectionReason:e.target.value})}}
                            placeholder="非必填"
                        />
                    </div>
                    <ul className="btnGroup">
                        <li onClick={()=>{this.setState({rejectionReason:"",onReject:false})}}>
                            取消
                        </li>
                        <li onClick={this.refuseSubmit.bind(this)}>
                            确定
                        </li>
                    </ul>
                </div>

                <div id="component_TempCards_onreturn" style={{display:this.state.onReturn?"block":"none"}}>
                    <div className="title">
                        确认归还
                    </div>
                    <div className="inputBox">
                        <span>请确认卡号：{this.state.targetInfo.cardNo} 临时卡已归还</span>
                    </div>
                    <ul className="btnGroup">
                        <li onClick={()=>{this.setState({onReturn:false})}}>
                            取消
                        </li>
                        <li onClick={this.returnCards.bind(this)}>
                            确定
                        </li>
                    </ul>
                </div>
            </div>
        )
    }

    componentDidMount(){

        // 设定表格高度
        let coefficient =0
        if(document.body.clientHeight>=1000){
            coefficient = 0.5
        }else if(document.body.clientHeight<1000&&document.body.clientHeight >= 800){
            coefficient = 0.45
        }else if(document.body.clientHeight<800){
            coefficient = 0.4
        }
        this.setState({
            tableHeight:document.body.clientHeight*coefficient
        })

        // 初始化
        this.init()
    }

    /**
     * @description [初始化]
     */
    init(){
        this.searchRecord(this.state.date, this.state.date, this.state.keyword, this.state.cardType)
    }

    /**
     * @description [搜索临时卡]
     * @param {*} from 
     * @param {*} end 
     * @param {*} val 
     * @param {*} type 
     */
    searchRecord(from, end, val, type) {
        if(!!from){
            from = new Date(from).format('yyyy-MM-dd');
        }

        let sendData = {
            "startIndex": 1,
            "requestedCount": 100,
            "userid": sessionStorage.userid,
            "startDate": from,
            "endDate": end,
            "empid": ""
        };
        
        if(/[0-9]/.test(val)) {
            sendData.cardNo = val
        }else {
            sendData.name = val
        }

        Common.ajaxProc("getInterimCard", sendData, sessionStorage.token).done(function (data) {
            if(data.status == 0){
                let tempArr = data.result.list;
                let resArr = [];
                let applyingCount= 0;
                let borrowingCount= 0;
                let recordCount= 0;
                for(let i = 0; i < tempArr.length; i++){
                    tempArr[i].submitTime = tempArr[i].submitTime !== null ? new Date(tempArr[i].submitTime).format('yyyy-MM-dd hh:mm:ss') : "";
                    tempArr[i].returnTime = tempArr[i].returnTime !== null ? new Date(tempArr[i].returnTime).format('yyyy-MM-dd hh:mm:ss') : "";
                    tempArr[i].visitorEndDate = tempArr[i].visitorEndDate !== null ? new Date(tempArr[i].visitorEndDate).format('yyyy-MM-dd hh:mm:ss') : "";
                    tempArr[i].display = true;
                    tempArr[i].key = tempArr[i].cid+i;

                    // icStatus 1-借用中 2-已归还 3-已拒绝
                    if(tempArr[i].icStatus == 0){
                        applyingCount++
                    }else if(tempArr[i].icStatus == 1){
                        borrowingCount++
                    }else{
                        recordCount++;
                    }

                    if(tempArr[i].icStatus == type || (type == 2&&tempArr[i].icStatus==3)){
                        resArr.push(tempArr[i])
                    }
                }

                for(let i = 0; i<this.state.cardTypelist.length;i++){
                    if(this.state.cardTypelist[i].key == "applying"){
                        this.state.cardTypelist[i].count = applyingCount
                    }else if(this.state.cardTypelist[i].key == "borrowing"){
                        this.state.cardTypelist[i].count = borrowingCount
                    }else{
                        this.state.cardTypelist[i].count = recordCount
                    }
                }

                this.setState({
                    dataSource:resArr,
                    baseList:data.result.list
                })
            }
        }.bind(this));
    }

    /**
     * @description [修改时间时重新请求数据]
     * @param {String} date [yyyy-MM-dd]
     */
    changeDate(date){
        this.setState({
            date:date
        },()=>{
            this.searchRecord(date, date, this.state.keyword, this.state.cardType)
        })
    }

    /**
     * @description [提交申请]
     */
    passSubmit(){
        let _this = this
        if(!this.state.onSubmitNum){
            Toast.open({
                type:"danger",
                content: "请输入临时卡卡号"
            })
            return
        }
        Common.ajaxProc(
            "updateInterimCard", 
            { 
                userid: sessionStorage.userid,
                cid: this.state.targetInfo.cid, 
                cardNo: this.state.onSubmitNum,
                icStatus:1,
                visitorEndDate: this.state.targetInfo.endDate
            }, 
            sessionStorage.token
        ).done((res)=>{
            if(res.status == 0){
                Toast.open({
                    type:"success",
                    content: "临时卡申请成功"
                })
            }else {
                Toast.open({
                    type:"danger",
                    content: "申请失败，请核对临时卡信息"
                })
            }
            _this.searchRecord(this.state.date, this.state.date, this.state.keyword, this.state.cardType)
            _this.setState({
                onSubmit:false,
                onReject:false,
                onReturn:false,
                onSubmitNum:""
            })
        })
    }
    
    /**
     * @description [拒绝申请]
     */
    refuseSubmit(){
        let _this = this;
        if(this.state.rejectionReason.length > 50) {
            Toast.open({
                type:"danger",
                content: "拒绝原因过长，请控制在50字内"
            })
            return
        }
        let sendData = {
            cid : this.state.targetInfo.cid,
            email : this.state.targetInfo.email,
            phone : this.state.targetInfo.phone,
            userid: sessionStorage.userid,
            refuseReason: this.state.rejectionReason
        }
        Common.ajaxProc("refuseInterimCard", sendData, sessionStorage.token).done(function (data) {
            if(data.status === 0) {
                Toast.open({
                    type:"danger",
                    content: "临时卡申请已拒绝"
                })
            }else {
                Toast.open({
                    type:"danger",
                    content: "临时卡拒绝失败"
                })
            }
            _this.searchRecord(_this.state.date, _this.state.date, _this.state.keyword, _this.state.cardType)
            _this.setState({
                onSubmit:false,
                onReject:false,
                onReturn:false,
                rejectionReason:""
            })
        }.bind(this));
    }

    /**
     * @description [归还临时卡]
     */
    returnCards(){
        let _this = this
        Common.ajaxProc("returnInterimCard", { userid: sessionStorage.userid, cid: this.state.targetInfo.cid }, sessionStorage.token).done(function (data) {
            if(data.status == 0){
                Toast.open({
                    type:"success",
                    content: "确认归还成功"
                })
            } else {
                Toast.open({
                    type:"danger",
                    content: "归还失败"
                })
            }
            _this.searchRecord(_this.state.date, _this.state.date, _this.state.keyword, _this.state.cardType)
            _this.setState({
                onSubmit:false,
                onReject:false,
                onReturn:false
            })
        }.bind(this));
    }

    /**
     * @description [搜索内容]
     */
    searchContent(e){
        let keyword = e.target.value;

        this.setState({
            keyword:keyword
        },()=>{
            this.searchRecord(this.state.date, this.state.date, this.state.keyword, this.state.cardType)
        })
    }
}