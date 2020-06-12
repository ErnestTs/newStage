import React,{Component} from "react";
import { Table,Pagination } from 'antd';
import moment from 'moment';

import Common from "../../Common/index"

import "./index.css"

// Toast
import Toast from "../../components/ToastPublic/index.jsx"


export default class Blacklist extends Component {
    constructor(props){
        super(props)
        this.state = {
            columns:[
                {
                  title: '姓名',
                  dataIndex: 'name',
                  key: 'name',
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
                {
                  title: '企业',
                  dataIndex: 'sname',
                  key: 'sname',
                },
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
                size:5,
            },

            key:""

        }
    }

    render(){
        return (
            <div id="component_Blacklist">
                <div id="component_Blacklist_searchContent">
                    <div id="component_Blacklist_inputBox">
                        <input 
                            type="text" 
                            placeholder="请输入姓名/手机号/身份证搜索"
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
                        <Pagination
                            defaultCurrent={1}
                            total={this.state.defaultList.length}
                            showQuickJumper
                            pageSize={this.state.paginationOption.size}
                            showSizeChanger={false}
                            onChange={this.paginationOnChange.bind(this)}
                        />
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
                for( let i = this.state.paginationOption.startIndex; i < oList.length;i++ ){
                    if(i< this.state.paginationOption.startIndex+this.state.paginationOption.size){
                        oList[i].key = i+"blackList"
                        tempArr.push(oList[i])
                    }
                }

                let paginationOption = this.state.paginationOption;
                paginationOption.count = count

                this.setState({
                    defaultList:oList,
                    dataSource:tempArr,
                    originalList:oList,
                    paginationOption:paginationOption
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
            if(oList[i].name.indexOf(key) !== -1||oList[i].credentialNo.indexOf(key) !== -1||oList[i].phone.indexOf(key) !== -1){
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