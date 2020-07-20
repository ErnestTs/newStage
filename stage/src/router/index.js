import React, { Component } from "react"
import { Link, Redirect, Route, HashRouter as Router, Switch } from "react-router-dom"
import Common from "../Common/index"

// Navgation
import Navgation from "../components/Navgation/index.js"

// // 登录页
import Login from "../page/Login/index"
// // Sensid登录页
import SensidLogin from "../page/SensidLogin/index"
// // 首页页
import Homepage from "../page/Homepage/index"
import IdCard from "../components/IdCard";




export default class RouterIndex extends Component {
    constructor(props){
        super(props)
    }

    render(){
        console.log(Common.Version)

        let loginPage = Common.$_Get().idcard==3?SensidLogin:Login;
        

        return (
            <Router>
                <div>
                    <Navgation />
                    <Switch>
                        <Route path="/login" component={ loginPage } />
                        <Route path="/home" component={ Homepage } />
                        <Redirect path="/" to={{ pathname: "/login" }} />
                    </Switch>
                </div>
            </Router>
        )
    }
}