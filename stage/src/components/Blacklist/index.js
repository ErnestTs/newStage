import React,{Component} from "react";
import { Table,Pagination,ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';

import Common from "../../Common/index"

import "./index.css"

// Toast
import Toast from "../../components/ToastPublic/index.jsx"

import search_icon from "../../resource/search_icon.png"


export default class Blacklist extends Component {
    constructor(props){
        super(props)
        this.state = {
            columns:[
                {
                  title: '姓名',
                  dataIndex: 'name',
                  key: 'name',
                  width:"10%"

                },
                {
                  title: '身份证号',
                  dataIndex: 'credentialNo',
                  key: 'credentialNo',
                },
                {
                  title: '手机号',
                  dataIndex: 'phone',
                  key: 'phone',
                },
                // {
                //   title: '禁止访问企业（中文）',
                //   dataIndex: 'sname',
                //   key: 'sname',
                //   width:"30%"
                // },
                // {
                //   title: '禁止访问企业（英文）',
                //   dataIndex: 'sname_eng',
                //   key: 'sname_eng',
                //   width:"30%"
                // },
                {
                  title: '备注',
                  dataIndex: 'remark',
                  key: 'remark',
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

            key:""

        }
    }

    render(){
        return (
            <div id="component_Blacklist">
                <div id="component_Blacklist_searchContent">
                    <div id="component_Blacklist_inputBox">
                        <img src={search_icon} />
                        <input 
                            type="text" 
                            placeholder="请输入姓名/手机号/备注搜索"
                            onChange={this.searchInfo.bind(this)}
                        />
                    </div>
                </div>
                <div className="component_Blacklist_tableBox">
                    <div className="component_Blacklist_tableBoard">
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
                <div id="component_Blacklist_PaginationBox">
                    <div id="component_Blacklist_Pagination">
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
            </div>
        )
    }

    componentDidMount(){


        // 设定表格高度
        this.setState({
            tableHeight:document.getElementsByClassName("component_Blacklist_tableBox")[0].offsetHeight*0.8
        })

        this.init()
    }

    /**
     * @description [初始化]
     */
    init(){
        this.getBlackList()
    }

    /**
     * @description [拉取黑名单]
     */
    getBlackList(){
        Common.ajaxProcWithoutAsync("getBlacklist",{"userid":2147483647,"startIndex":0,"requestedCount":999999},sessionStorage.token).done((res)=>{
            if(res.status == 0) {
                let oList = res.result.list
                let count = res.result.count

                let tempArr= [];
                for( let i = 0; i < oList.length;i++ ){

                    oList[i].key = i+"blackList"
                    if(!oList[i].sname){
                        oList[i].sname = "全部企业"
                        oList[i].sname_eng = "all"
                    }else{
                        let snameArr = oList[i].sname.split("，");
                        let sname_engArr = []
                        for(let i =0; i< snameArr.length;i++) {
                            sname_engArr.push(snameArr[i].split('#')[1])
                            snameArr[i] = snameArr[i].split('#')[0];
                        }
                        oList[i].sname = snameArr.join("，");
                        oList[i].sname_eng = sname_engArr.join("，");
                    }
                    tempArr.push(oList[i])
                }


                let paginationOption = this.state.paginationOption;
                paginationOption.count = count

                this.setState({
                    defaultList:oList,
                    dataSource:tempArr,
                    originalList:oList,
                    paginationOption:paginationOption
                },()=>{
                    this.paginationOnChange(1)
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
                oList[i].key = i+"blackList"
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
        let key = e.target.value;
        if(!key){
            this.init();
            return
        }
        let oList = this.state.originalList;
        let tempDefArr = []
        for(let i = 0;i < oList.length; i++){
            if(
                oList[i].name.indexOf(key) !== -1||
                oList[i].remark.indexOf(key) !== -1||
                oList[i].phone.indexOf(key) !== -1
                // oList[i].sname_eng.indexOf(key) !== -1||
                // oList[i].sname.indexOf(key) !== -1
            ){
                tempDefArr.unshift(oList[i])
            }else if(oList[i].sname_eng == "all"){
                tempDefArr.push(oList[i])
            }
        }
        this.setState({
            defaultList:tempDefArr
        },()=>{
            this.paginationOnChange(1)
        })
    }
}