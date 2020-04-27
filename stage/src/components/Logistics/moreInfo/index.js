import React,{Component} from "react";

import Common from "../../../Common/index"

import "./index.css"

export default class Logistics_moreInfo extends Component {
    constructor(props){
        super(props)
    }


    render(){
        if(!this.props.data.appointmentDate){
            return (<div></div>)
        }
        return(
            <div id="Logistics_moreInfo" style={{display:this.props.open?"block":"none"}}>
                <div className="Logistics_moreInfo_board">
                    <p className="Logistics_moreInfo_title">更多详情</p>

                    <ul className="Logistics_moreInfo_info">
                        <li className="Logistics_moreInfo_info_item">
                            <p className="label">物流信息</p>
                            <ul className="dataList">
                                <li>
                                    <span>物流类型: {this.props.data.logType}</span>
                                </li>
                                <li>
                                    <span>预约时间: {this.props.data.appointmentDate}</span>
                                </li>
                                <li style={{ display: this.props.data.visitdate === null ? "none" : "inline-block" }}>
                                    <span>到达时间: {this.props.data.visitdate}</span>
                                </li>
                                <li style={{ display: this.props.data.finishTime === null ? "none" : "inline-block" }}>
                                    <span>结束时间: {this.props.data.finishTime}</span>
                                </li>
                                <li style={{ display: this.props.data.leaveTime === null ? "none" : "inline-block" }}>
                                    <span>离开时间: {this.props.data.leaveTime}</span>
                                </li>
                                {
                                    this.props.data.logExtend.map((item, i, arr)=>{
                                        return (
                                            <li key={item.fieldName+i}>
                                                <span>{item.displayName}: {item.inputValue}</span>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </li>
                        <li className="Logistics_moreInfo_info_item">
                            <p className="label">提货人信息</p>
                            <ul className="dataList">

                                <li>
                                    <span>姓名: {this.props.data.sname}</span>
                                </li>
                                <li>
                                    <span>手机号码: {this.props.data.smobile}</span>
                                </li>
                                <li>
                                    <span>身份证号: {this.props.data.scardId}</span>
                                </li>
                            </ul>
                        </li>
                        <li className="Logistics_moreInfo_info_item">
                            <p className="label">车辆信息</p>
                            <ul className="dataList">
                                {
                                    this.props.data.vehicleExtend.map((item, i, arr)=>{
                                        if(item.fieldName == "vehicleAccessPhoto" || item.fieldName == "vehicleLeavingPhoto"){
                                            return
                                        }
                                        return (
                                            <li key={item.fieldName+i}>
                                                <span>{item.displayName}: {item.inputValue}</span>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </li>
                        <li className="Logistics_moreInfo_info_item">
                            <p className="label">司机信息</p>
                            <ul className="dataList">
                                {
                                    this.props.data.driverExtend.map((item, i, arr)=>{
                                        if(item.fieldName == "memberInfo"){
                                            return
                                        }
                                        return (
                                            <li key={item.fieldName+i}>
                                                <span>{item.displayName}: {item.inputValue}</span>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </li>
                        <li className="Logistics_moreInfo_info_item">
                            <p className="label">其他信息</p>
                            <ul className="dataList">
                                {
                                    this.props.data.otherExtend.map((item, i, arr)=>{
                                        return (
                                            <li key={item.fieldName+i}>
                                                <span>{item.displayName}: {item.inputValue}</span>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </li>
                        <li className="Logistics_moreInfo_info_item">
                            <p className="label">跟随人员</p>
                            <ul className="dataList">
                                {
                                    this.props.data.memberInfo.map((item, i, arr)=>{
                                        return <li className="memberItem" key={i+item.cardid}>
                                            <span>姓名:{item.name}</span>
                                            <span>手机号码:{item.mobile}</span>
                                            <span>身份证号:{item.cardid}</span>
                                        </li>
                                    })
                                }
                            </ul>
                        </li>
                        <li className="Logistics_moreInfo_info_item">
                            <p className="label">货物信息</p>
                            <ul className="dataList">
                                {
                                    this.props.data.goodsExtend.map((item, i, arr)=>{
                                        return (
                                            <li key={item.fieldName+i}>
                                                <span>{item.displayName}: {item.inputValue}</span>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                            <ul className="photoList">
                                {
                                    this.props.data.photoInfo.map((item, i, arr)=>{
                                        if(!item){
                                            return
                                        }
                                        return (
                                            <li className="photoItem" key={i}>
                                                <a href={item} target="_blank">
                                                    <img src={item} />
                                                </a>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </li>
                        <li className="Logistics_moreInfo_info_item">
                            <p className="label">物流签到照片</p>
                            <ul className="photoList">
                                {
                                    this.props.data.carLoginPhoto.map((item, i, arr)=>{
                                        if(!item){
                                            return
                                        }
                                        return (
                                            <li className="photoItem" key={i}>
                                                <a href={item} target="_blank">
                                                    <img src={item} />
                                                </a>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </li>
                        <li className="Logistics_moreInfo_info_item">
                            <p className="label">物流签出照片</p>
                            <ul className="photoList">
                                {
                                    this.props.data.carLogoutPhoto.map((item, i, arr)=>{
                                        if(!item){
                                            return
                                        }
                                        return (
                                            <li className="photoItem" key={i}>
                                                <a href={item} target="_blank">
                                                    <img src={item} />
                                                </a>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </li>
                        <li className="Logistics_moreInfo_info_item">
                            <p className="label">备注</p>
                            <ul className="dataList">
                                <li>
                                    {this.props.data.remark}
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}