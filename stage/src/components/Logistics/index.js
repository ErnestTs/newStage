import React,{Component} from "react";
import { Table,DatePicker } from 'antd';
import moment from 'moment';

import Common from "../../Common/index"

import MoreInfo from "./moreInfo/index"

import "./index.css"

// Toast
import Toast from "../../components/ToastPublic/index.jsx"

export default class Logistics extends Component {
    constructor(props){
        super(props)
        this.state={
            columns:[
                {
                  title: '姓名',
                  dataIndex: 'sname',
                  key: 'sname',
                },
                {
                  title: '车牌',
                  dataIndex: 'plateNum',
                  key: 'plateNum',
                },
                {
                  title: '预达时间',
                  dataIndex: 'appointmentDate',
                  key: 'appointmentDate',
                },
                {
                  title: '到达时间',
                  dataIndex: 'visitdate',
                  key: 'visitdate',
                },
                {
                  title: '签出时间',
                  dataIndex: 'leaveTime',
                  key: 'leaveTime',
                },
                {
                  title: '物流类型',
                  dataIndex: 'logType',
                  key: 'logType',
                },
                {
                  title: '状态',
                  dataIndex: '',
                  key: '',
                  width:"22%",
                  render: (data)=>{
                        var state = data.state
                        var tag = "";
                        switch(state){
                            case(0):
                                tag = "noSignIn"
                                break;
                            case(1):
                                tag = "noCheckOut"
                                break;
                            case(2):
                                tag = "checkedOut"
                                break;
                            default:
                                break;
                        }
                        return(
                            <div>
                                <span className={"logisticState "+tag}></span>
                                <span className={"logisticBtn "+tag} onClick={this.checkInfo.bind(this,data)}></span>
                                <span className="logisticInfo" onClick={()=>{this.setState({moreInfo:true,moreInfoData:data})}}>更多详情</span>
                            </div>
                        )
                  }
                }
            ],
            dataSource:[{}],
            date:new Date().format('yyyy-MM-dd'),
            // date:"2020-03-13",
            moreInfo: false,
            startIndex:0,
            pageSize:5,
            moreInfoData:{}
        }
    }

    render(){
        
        return (
            <div id="component_Logistics">
                <div className="component_Logistics_tableBoard">
                    <Table className="tableBox" dataSource={this.state.dataSource} columns={this.state.columns} scroll={{y:this.state.tableHeight}} />
                </div>
                <DatePicker 
                    className="DatePicker"
                    allowClear='true'
                    defaultValue={moment(new Date(), 'YYYY-MM-DD')}
                    onChange={(moment,date)=>{this.changeDate(date)}}
                />
                <MoreInfo open={this.state.moreInfo} data={this.state.moreInfoData} />
                <div className="mask" style={{display:this.state.moreInfo?"block":"none"}} onClick={()=>{this.setState({moreInfo:false})}}>
                </div>
            </div>
        )
    }
    
    componentDidMount(){
        // 请求数据
        this.getLogisticsInfo(this.state.date)

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

    /**
     * @description [修改时间时重新请求数据]
     * @param {String} date [yyyy-MM-dd]
     */
    changeDate(date){
        this.getLogisticsInfo(date)
    }

    /**
     * @description [根据时间获取物流记录]
     * @param {String} date [yyyy-MM-dd]
     */
    getLogisticsInfo(date){
        let _this = this;
		let sendData = {
			startDate: date,
			endDate: date,
			psList: [1,3],
			startIndex: this.state.startIndex,
			requestedCount: 5,
			userid: sessionStorage.userid
		};
		Common.ajaxProcWithoutAsync('getLogisticsInfo', sendData, sessionStorage.token).done(function(data) {
			if (data.status === 0) {
				var datalist = data.result.list;
							
				for (var i = 0; i < datalist.length; i++) {
					if (datalist[i].appointmentDate !== null) {
						datalist[i].appointmentDate = new Date(datalist[i].appointmentDate).format("yyyy-MM-dd hh:mm:ss");
					}
					if (datalist[i].visitdate !== null) {
						datalist[i].visitdate = new Date(datalist[i].visitdate).format("yyyy-MM-dd hh:mm:ss");
					}
					if (datalist[i].leaveTime !== null) {
						datalist[i].leaveTime = new Date(datalist[i].leaveTime).format("yyyy-MM-dd hh:mm:ss");
					}
					if (datalist[i].finishTime !== null) {
						datalist[i].finishTime = new Date(datalist[i].finishTime).format("yyyy-MM-dd hh:mm:ss");
                    }
                    

                    if(!!datalist[i].leaveTime){
                        datalist[i].state = 2;
                    }else if(!!datalist[i].visitdate){
                        datalist[i].state = 1;
                    }else {
                        datalist[i].state = 0;
                    }
				}			
				let totalPage = Math.ceil(data.result.count / _this.state.pageSize);
				for(var i =0;i < datalist.length; i++){
					datalist[i].logExtend = datalist[i].logExtend !== null?JSON.parse(datalist[i].logExtend.replace(/&quot;/g, '"')):[];
					datalist[i].driverExtend = datalist[i].driverExtend !== null?JSON.parse(datalist[i].driverExtend.replace(/&quot;/g, '"')):[];
					datalist[i].vehicleExtend = datalist[i].vehicleExtend !== null?JSON.parse(datalist[i].vehicleExtend.replace(/&quot;/g, '"')):[];
					datalist[i].goodsExtend = datalist[i].goodsExtend !== null?JSON.parse(datalist[i].goodsExtend.replace(/&quot;/g, '"')):[];
					datalist[i].memberInfo = datalist[i].memberInfo !== null?JSON.parse(datalist[i].memberInfo.replace(/&quot;/g, '"')):[];
					datalist[i].otherExtend = datalist[i].otherExtend !== null?JSON.parse(datalist[i].otherExtend.replace(/&quot;/g, '"')):[];
					if(!datalist[i].otherExtend){
						datalist[i].otherExtend = []
                    }
                    
					datalist[i].photoInfo = datalist[i].photoInfo.split(",");
					
					// datalist[i].carLoginPhoto = _this.getCarPhoto(datalist[i].logNum,1)
                    // datalist[i].carLogoutPhoto = _this.getCarPhoto(datalist[i].logNum,2)
					datalist[i].carLoginPhoto = datalist[i].photoInfo;
					datalist[i].carLogoutPhoto = datalist[i].photoInfo;
                    

                    datalist[i].key = "l"+datalist[i].appointmentDate
                }

				_this.setState({
					dataSource: datalist,
					totalPage: totalPage,
				})
			}
		})
    }

    /**
     * @description [获取车辆进出照片]
     * @param {Number} logNum [物流id]
     * @param {Number} state [1-进，2-出]
     */
	getCarPhoto(logNum, state) {
        let resUrl = "";
        let sendData = {
            sType: state,
            userid: sessionStorage.userid,
            vsid: logNum,
        }
		Common.ajaxProcWithoutAsync("getVehicleRecordByVid", sendData,sessionStorage.token).then((res)=>{
			if(!res.result){
				res.result = {
					photoUrl:""
				}
			}
			resUrl = res.result.photoUrl
		})
		return resUrl
    }
    
    /**
     * 
     */
    checkInfo(data){
        this.props.history.push({pathname:"logisticsInfo",state:data})
    }
}