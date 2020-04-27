import React,{Component} from "react";
import './index.css';

import defaultPhoto from "../../resource/defaultPhoto.png"

import QRcode_1 from "../../resource/menu_icon/QRcode/1.png"
import QRcode_2 from "../../resource/menu_icon/QRcode/2.png"
import QRcode_3 from "../../resource/menu_icon/QRcode/3.png"

import Visitors_1 from "../../resource/menu_icon/Visitors/1.png"
import Visitors_2 from "../../resource/menu_icon/Visitors/2.png"
import Visitors_3 from "../../resource/menu_icon/Visitors/3.png"

import Cards_1 from "../../resource/menu_icon/Cards/1.png"
import Cards_2 from "../../resource/menu_icon/Cards/2.png"
import Cards_3 from "../../resource/menu_icon/Cards/3.png"

import Logistics_1 from "../../resource/menu_icon/Logistics/1.png"
import Logistics_2 from "../../resource/menu_icon/Logistics/2.png"
import Logistics_3 from "../../resource/menu_icon/Logistics/3.png"

import Certificates_1 from "../../resource/menu_icon/Certificates/1.png"
import Certificates_2 from "../../resource/menu_icon/Certificates/2.png"
import Certificates_3 from "../../resource/menu_icon/Certificates/3.png"

import Register_1 from "../../resource/menu_icon/Register/1.png"
import Register_2 from "../../resource/menu_icon/Register/2.png"
import Register_3 from "../../resource/menu_icon/Register/3.png"

import Appointment_1 from "../../resource/menu_icon/Appointment/1.png"
import Appointment_2 from "../../resource/menu_icon/Appointment/2.png"
import Appointment_3 from "../../resource/menu_icon/Appointment/3.png"


export default class Menu extends Component {
    constructor(props){
        super(props)

        this.state= {
            icon:{
                QRcode:{
                    normal:QRcode_1,
                    hidden:QRcode_2,
                    active:QRcode_3
                },
                Visitors:{
                    normal:Visitors_1,
                    hidden:Visitors_2,
                    active:Visitors_3
                },
                Cards:{
                    normal:Cards_1,
                    hidden:Cards_2,
                    active:Cards_3
                },
                Logistics:{
                    normal:Logistics_1,
                    hidden:Logistics_2,
                    active:Logistics_3
                },
                Certificates:{
                    normal:Certificates_1,
                    hidden:Certificates_2,
                    active:Certificates_3
                },
                Register:{
                    normal:Register_1,
                    hidden:Register_2,
                    active:Register_3
                },
                Appointment:{
                    normal:Appointment_1,
                    hidden:Appointment_2,
                    active:Appointment_3
                },
            },
            open: true,     // true-完整菜单 false-缩略菜单
            active: -1,
        }
    }

    componentDidMount(){
        this.changeItem(0,"二维码","qrcode");
        // this.changeItem(0,"物流管理","logistics");
    }

    render(){
        return(
            <div id="menu">
                <div id="menu_change" onClick={this.changeMenuSize.bind(this)} style={{left:this.state.open?"350px":"30px"}}></div>
                <div id="menu_large" style={{display:this.state.open?"block":"none"}}>
                    <div className="gateInfo">
                        <div id="menu_Head">
                            <img src={defaultPhoto} />
                        </div>
                        <p id="menu_Company">
                            {sessionStorage.company}
                        </p>
                        <p id="menu_Opname">
                            {sessionStorage.opname}
                        </p>
                    </div>
                    <ul>
                        <li className="menu_itemGroup0">
                            {this.renderItem("二维码",this.state.icon.QRcode,0, "qrcode")}
                            {this.renderItem("证件扫描",this.state.icon.Certificates,1,"Certificates")}
                        </li>
                        <li className="menu_itemGroup1">
                            {this.renderItem("现场预约",this.state.icon.Appointment,2,"appointment")}
                            {this.renderItem("现场登记",this.state.icon.Register,3,"register")}
                            {this.renderItem("今日访客",this.state.icon.Visitors,4,"visitor")}
                        </li>
                        <li className="menu_itemGroup2">
                            {this.renderItem("物流管理",this.state.icon.Logistics,5,"logistics")}
                            {this.renderItem("临时卡",this.state.icon.Cards,6,"cards")}
                        </li>
                    </ul>
                </div>
                <div id="menu_small" style={{display:!this.state.open?"block":"none"}}>
                    <ul>
                        <li className="menu_itemGroup0">
                            {this.renderItem("二维码",this.state.icon.QRcode,0, "qrcode")}
                            {this.renderItem("证件扫描",this.state.icon.Certificates,1,"Certificates")}
                        </li>
                        <li className="menu_itemGroup1">
                            {this.renderItem("现场预约",this.state.icon.Appointment,2,"appointment")}
                            {this.renderItem("现场登记",this.state.icon.Register,3,"register")}
                            {this.renderItem("今日访客",this.state.icon.Visitors,4,"visitor")}
                        </li>
                        <li className="menu_itemGroup2">
                            {this.renderItem("物流管理",this.state.icon.Logistics,5,"logistics")}
                            {this.renderItem("临时卡",this.state.icon.Cards,6,"cards")}
                        </li>
                    </ul>
                </div>
            </div>
        )
    }

    /**
     * @description [渲染菜单]
     * @param {String} name 
     * @param {Object} icon 
     * @param {Number} i 
     */
    renderItem(name, icon, i, path){
        let className = "menu_item";
        let oIcon = "";
        // 判断icon形态
        if(this.state.active == i){
            className += " action";
            if(this.state.open == true){
                oIcon = icon.hidden
            }else{
                oIcon = icon.active
            }
        }else{
            oIcon = icon.normal
        }
        if(this.state.open){
            return(
                <div className={className} onClick={this.changeItem.bind(this,i,name,path)}>
                    <div style={{display:this.state.active == i?"block":"none"}} className="menu_actionBorder"></div>
                    <img src={oIcon} /> <span>{name}</span>
                </div>
            )
        }else {
            return(
                <div className={className} onClick={this.changeItem.bind(this,i,name,path)}>
                    <div style={{display:this.state.active == i?"block":"none",left:"0"}} className="menu_actionBorder"></div>
                    <img src={oIcon} />
                </div>
            )
        }
    }

    /**
     * @description [更改action]
     * @param {Number} i 
     */
    changeItem(i,name,path){
        this.props.history.push("/home/"+path)
        this.props.changeTitle(name)
        this.setState({
            active: i
        })
    }

    /**
     * @description [修改菜单状态]
     */
    changeMenuSize(){
        let tempBool = !this.state.open
        document.getElementsByClassName("logo")[0].style.display = tempBool?"block":"none";
        this.props.changeSize(tempBool)
        
        this.setState({
            open:tempBool
        })
    }
}
