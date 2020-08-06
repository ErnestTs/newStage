import React,{Component} from "react";
import { Table,Pagination,ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';

import Common from "../../Common/index"

import "./index.css"

// Toast
import Toast from "../../components/ToastPublic/index.jsx"

import search_icon from "../../resource/search_icon.png"


export default class Companylist extends Component {
    constructor(props){
        super(props)
        this.state = {
            columns:[
                {
                  title: '公司（中文）',
                  dataIndex: 'companyName',
                  key: 'companyName',
                  render(data){
                      return(
                        <span>{data.split("#")[0]}</span>
                      )
                  }
                },
                {
                  title: '公司（英文）',
                  dataIndex: 'companyName',
                  key: 'companyName',
                  render(data){
                      return(
                        <span>{data.split("#")[1]}</span>
                      )
                  }
                },
                {
                  title: '房间号',
                  dataIndex: 'roomNumber',
                  key: 'roomNumber',
                },
                {
                  title: '是否可邀请',
                  dataIndex: 'invite',
                  key: 'invite',
                  width:"8%",
                  render(data){
                      return(
                          <span>{data?"是":"否"}</span>
                      )
                  }
                },
                {
                  title: '是否可预约',
                  dataIndex: 'appointment',
                  key: 'appointment',
                  width:"8%",
                  render(data){
                      return(
                          <span>{data?"是":"否"}</span>
                      )
                  }
                },
                {
                  title: '是否需授权',
                  dataIndex: 'authorize',
                  key: 'authorize',
                  width:"8%",
                  render(data){
                      return(
                          <span>{data?"是":"否"}</span>
                      )
                  }
                },
            ],
            dataSource:[],
            defaultList:[],
            originalList:[],

            paginationOption:{
                count:0,
                startIndex:0,
                size:4,
            },

            key:"",

            typeList:[
                {
                    name:"全部",
                    count:0,
                    key:0,
                    stateList:["total","leave","visiting"]
                },
                {
                    name:"不可预约",
                    count:0,
                    key:1,
                    stateList:["appointment","checkIn","noArrived"]
                },
                {
                    name:"需授权",
                    count:0,
                    key:2,
                    stateList:["invite","checkIn","noArrived"]
                }
            ],
            typeListActive:0,

            ifsToast:false

        }
    }

    render(){
        return (
            <div id="component_Companylist">
                <div id="component_Companylist_searchContent">

                    <ul id="component_Companylist_stateList">
                        {
                            this.state.typeList.map((item,i)=>{
                                return (
                                    <li
                                        key={i+"companytype"}
                                        className={this.state.typeListActive == i?"action":""}
                                        onClick={this.changeTag.bind(this,item.key)}
                                    >
                                        {item.name}({item.count})
                                    </li>
                                )
                            })
                        }
                    </ul>

                    <div id="component_Companylist_btn_refresh" onClick={this.refresh.bind(this,0)}>刷新</div>
                    <div id="component_Companylist_inputBox">
                        <img src={search_icon} />
                        <input 
                            type="text" 
                            placeholder="请输入公司名称/房间号"
                            onChange={this.searchInfo.bind(this)}
                            id="searchCompanyInfoInput"
                        />
                    </div>
                </div>
                <div className="component_Companylist_tableBox">
                    <div className="component_Companylist_tableBoard">
                        <Table 
                            className="tableBox"
                            pagination={false}
                            dataSource={this.state.dataSource}
                            columns={this.state.columns}
                            scroll={{y:this.state.tableHeight}}
                            locale={{emptyText: '暂无数据'}}
                        />
                    </div>
                </div>
                <div id="component_Companylist_PaginationBox">
                    <div id="component_Companylist_Pagination">
                        <ConfigProvider locale={zhCN}>
                            <Pagination
                                defaultCurrent={1}
                                total={this.state.defaultList.length}
                                showQuickJumper
                                pageSize={this.state.paginationOption.size}
                                showSizeChanger={false}
                                onChange={this.paginationOnChange.bind(this)}
                            />
                        </ConfigProvider>
                    </div>
                </div>
                <div className="component_Companylist_IFSToast" style={{display:this.state.ifsToast?"block":"none"}}>
                    <i></i><span>刷新成功</span>
                </div>
            </div>
        )
    }

    componentDidMount(){
        

        // 设定表格高度
        this.setState({
            tableHeight:document.getElementsByClassName("component_Companylist_tableBox")[0].offsetHeight*0.8
        })

        this.init()
    }

    /**
     * @description [初始化]
     */
    init(){
        this.getCompanyList()
    }

    /**
     * @description [拉取公司列表]
     */
    getCompanyList(){
        Common.ajaxProcWithoutAsync("getSubAccountByUserid",{"userid":2147483647,"startIndex":0,"requestedCount":999999},sessionStorage.token).done((res)=>{
            if(res.status == 0&&!!res.result) {
                let oList = []
                let countNoApp = 0;
                let countNeedAuthorize = 0;
                for(let i = 0; i < res.result.length;i++){
                    let item = res.result[i];
                    let gList = item.gids.split(",")
                    if(gList.indexOf(sessionStorage.gid)!==-1&&item.isUse == 1){
                        if((item.vaPerm&1)==1){
                            item.invite = true
                        }else {
                            item.invite = false
                        }
                        if((item.vaPerm&2)==2){
                            item.appointment = true
                        }else {
                            item.appointment = false;
                            countNoApp++
                        }
                        if((item.vaPerm&4)==4){
                            item.authorize = true;
                            countNeedAuthorize++
                        }else {
                            item.authorize = false
                        }

                        let roomNumber = item.roomNumber.split("、");
                        let resRoomNumber = [];
                        for(let j = 0; j<roomNumber.length;j++){
                            let itemArr = roomNumber[j].split("|");
                            for(let k = 0;k<itemArr.length;k++){
                                let tempItemArrStr = itemArr[k].split(",")
                                if(tempItemArrStr[0] == sessionStorage.gid){
                                    resRoomNumber.push(tempItemArrStr[1])
                                }else if(tempItemArrStr.length == 1){
                                    resRoomNumber.push(tempItemArrStr[0])
                                }
                            }
                            roomNumber[j] = resRoomNumber.join(",")
                        }
                        item.roomNumber = roomNumber.join("、")
                        oList.push(item)
                    }
                }
                let count = oList.length

                let tempArr= [];
                for( let i = this.state.paginationOption.startIndex; i < oList.length;i++ ){
                    if(i< this.state.paginationOption.startIndex+this.state.paginationOption.size){
                        oList[i].key = i+"companylist"
                        tempArr.push(oList[i])
                    }
                }

                let paginationOption = this.state.paginationOption;
                paginationOption.count = count;

                let typeList = this.state.typeList;
                typeList[0].count = oList.length;
                typeList[1].count = countNoApp;
                typeList[2].count = countNeedAuthorize;
                
                this.setState({
                    defaultList:oList,
                    dataSource:tempArr,
                    originalList:oList,
                    paginationOption:paginationOption,
                    typeList:typeList
                })
            }
        })
    }

    /**
     * @description [跳转页码]
     * @param {Number} page 
     * @param {Number} size 
     */
    paginationOnChange(page){
        let newIndex = (page - 1)*this.state.paginationOption.size;

        let oList = this.state.defaultList;

        let tempArr= [];
        for( let i = newIndex; i < oList.length;i++ ){
            if(i< newIndex+this.state.paginationOption.size){
                oList[i].key = i+"companylist"
                tempArr.push(oList[i])
            }else{
                break;
            }
        }


        let paginationOption = this.state.paginationOption;
        paginationOption.startIndex = newIndex

        this.setState({
            dataSource:tempArr,
            paginationOption:paginationOption
        })
    }

    /**
     * @description [条件搜索]
     * @param {Event} e
     */
    searchInfo(e){
        if(!e){
            e = {
                target:{
                    value:document.getElementById("searchCompanyInfoInput").value
                }
            }
        }
        let key = e.target.value;
        if(!key){
            this.changeTag(this.state.typeListActive)
            return
        }
        let oList = this.state["list"+this.state.typeListActive]||this.state.originalList;
        let tempDefArr = []
        for(let i = 0;i < oList.length; i++){
            if(oList[i].companyName.indexOf(key) !== -1||oList[i].roomNumber.indexOf(key) !== -1){
                tempDefArr.push(oList[i])
            }
        }
        this.setState({
            defaultList:tempDefArr
        },()=>{
            this.paginationOnChange(1)
        })
    }

    refresh(){
        this.setState({
            typeListActive:0
        },()=>{
            this.init();
            this.setState({
                ifsToast:true
            },()=>{
                let _this = this
                setTimeout(()=>{
                    _this.setState({
                        ifsToast:false
                    })
                },3000)
            })
        })
    }

    /**
     * @description [切换列表]
     * @param {Number} type [0-全部] [1-不可预约] [2-需授权]
     */
    changeTag(type){
        if(type == 0){
            this.setState({
                typeListActive:0,
                defaultList:this.state.originalList,
            },()=>{
                this.init()
                if(document.getElementById("searchCompanyInfoInput").value){
                    this.searchInfo()
                }
            })
        }else if(type == 1){
            let oList = this.state.originalList;
            let tempArr = []
            for(let i = 0;i<oList.length;i++){
                if(!oList[i].appointment){
                    tempArr.push(oList[i])
                }
            }
            this.setState({
                list1:tempArr,
                defaultList:tempArr,
                typeListActive:1
            },()=>{
                this.paginationOnChange(1)
                if(document.getElementById("searchCompanyInfoInput").value){
                    this.searchInfo()
                }
            })
        }else if(type == 2){
            let oList = this.state.originalList;
            let tempArr = []
            for(let i = 0;i<oList.length;i++){
                if(oList[i].authorize){
                    tempArr.push(oList[i])
                }
            }
            this.setState({
                list2:tempArr,
                defaultList:tempArr,
                typeListActive:2
            },()=>{
                this.paginationOnChange(1)
                if(document.getElementById("searchCompanyInfoInput").value){
                    this.searchInfo()
                }
            })
        }
    }
}