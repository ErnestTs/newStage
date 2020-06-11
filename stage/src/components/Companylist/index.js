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
                  title: '公司',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: '房间号',
                  dataIndex: 'credentialNo',
                  key: 'credentialNo',
                },
                {
                  title: '是否可邀请',
                  dataIndex: 'phone',
                  key: 'phone',
                },
                {
                  title: '是否可预约',
                  dataIndex: 'sname',
                  key: 'sname',
                },
                {
                  title: '是否可授权',
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
            <div id="component_Companylist">
                <div id="component_Companylist_searchContent">

                    <ul id="component_Companylist_stateList">
                        <li className="action">
                            全部
                        </li>
                        <li>
                            不可预约
                        </li>
                        <li>
                            需授权
                        </li>
                    </ul>

                    <div id="component_Companylist_btn_refresh">刷新</div>
                    <div id="component_Companylist_inputBox">
                        <input 
                            type="text" 
                            placeholder="请输入公司名称/房间号"
                            onChange={this.searchInfo.bind(this)}
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
                        <Pagination
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
            tableHeight:document.getElementsByClassName("component_Companylist_tableBox")[0].offsetHeight*0.8
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