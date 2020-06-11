import React,{Component} from "react";
import { Table,DatePicker } from 'antd';
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
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: '手机号',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: '企业',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: '备注',
                  dataIndex: 'name',
                  key: 'name',
                },
            ],
            dataSource:[
                {}
            ]

        }
    }

    render(){
        return (
            <div id="component_Blacklist">
                <div className="component_Logistics_tableBoard">
                    <Table 
                        className="tableBox"
                        dataSource={this.state.dataSource}
                        columns={this.state.columns}
                        scroll={{y:this.state.tableHeight}}
                        locale={{emptyText: '暂无数据'}}
                    />
                </div>
            </div>
        )
    }

    componentDidMount(){


        // 设定表格高度
        let coefficient =0
        if(document.body.clientHeight>=1000){
            coefficient = 0.57
        }else if(document.body.clientHeight<1000&&document.body.clientHeight >= 800){
            coefficient = 0.48
        }else if(document.body.clientHeight<800){
            coefficient = 0.42
        }
        this.setState({
            tableHeight:document.body.clientHeight*coefficient
        })
    }
}