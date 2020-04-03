import React, { Component } from 'react';
import './index.css';

import Common from "../../Common/index"

// Toast
import Toast from "../../components/ToastPublic/index.jsx"


/**
 * @author 方超 qq978070462
 * @description [主功能页面]
 * @returns {React.Component}
 */

export default class Homepage extends Component {
    constructor(props){
        super(props)
    }

    render(){
        return (
            <div className="page_home">
                i am Homepage
            </div>
        )
    }
}
