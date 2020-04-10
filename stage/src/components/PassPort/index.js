import React,{Component} from "react"

import Common from "../../Common/index"

import "./index.css"

// Toast
import Toast from "../../components/ToastPublic/index.jsx"

export default class PassPort extends Component {
    constructor(props){
        super(props)
        this.state= {
            componentName : "PassPort"
        }
    }

    render(){
        return (
            <div id="component_PassPort">
                <div className="scanCard_background">
                </div>
                <p>请扫描证件信息</p>
                <div className="btn_box">
                    <div>读取证件</div>
                </div>
            </div>
        )
    }

    componentDidMount(){
        console.log(this.state.componentName)
    }
}