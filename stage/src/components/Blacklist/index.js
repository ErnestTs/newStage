import React,{Component} from "react";
import { Table,DatePicker } from 'antd';
import moment from 'moment';

import Common from "../../Common/index"

import "./index.css"

// Toast
import Toast from "../../components/ToastPublic/index.jsx"

export default class Blacklist extends Component {
    consturctor(props){
        super(props)
        this.state = {

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