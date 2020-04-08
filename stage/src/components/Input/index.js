import React, { Component } from 'react';
import './index.css';

/**
 * @author 方超 qq978070462
 * @description [输入框]
 * @returns {React.Component}
 */

export default class Input extends Component {
    constructor(props){
        super(props)
        this.state = {
            focus:false
        }
    }
    render(){ 
        return (
            <div 
                className={"Input_box "+this.props.state + (this.state.focus?" action":" blur")}
                style={this.props.style}
            >
                <span className="Input_title">
                    {this.props.title}
                </span>
                
                <input
                    id={!!!!this.props.id?this.props.id:""}
                    type={!!this.props.type?this.props.type:"text"} 
                    placeholder={!this.props.placeholder?"":this.props.placeholder}
                    onFocus={()=>{this.setState({focus:true})}}
                    onBlur={()=>{this.setState({focus:false})}}
                    onChange={this.props.onChange}
                />
            </div>
        )
    }
}