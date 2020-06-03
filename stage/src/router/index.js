import React, { Component } from "react"
import { Link, Redirect, Route, HashRouter as Router, Switch } from "react-router-dom"
import Common from "../Common/index"

// Navgation
import Navgation from "../components/Navgation/index.js"

// // 登录页
import Login from "../page/Login/index"
// // 首页页
import Homepage from "../page/Homepage/index"




export default class RouterIndex extends Component {
    constructor(props){
        super(props)
    }

    render(){
        console.log(Common.Version)

        return (
            <Router>
                <div>
                    <Navgation />
                    <Switch>
                        <Route path="/login" component={ Login } />
                        <Route path="/home" component={ Homepage } />
                        <Redirect path="/" to={{ pathname: "/login" }} />
                    </Switch>
                </div>
            </Router>
        )
    }
}