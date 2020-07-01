import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

let defaultState = {
    content: "提示文字",
    display: "hide",
    type: "danger"
}

class ToastPublic extends Component {
    state = {
        ...defaultState,
        taskQueue:[]
    }
    
    open(options){
        if(this.state.display === "show"){
            this.state.taskQueue.push(options)
            return
        }
        options = options || {};
        options.display = "show";
        this.state.display = "show"
        this.setState({
          ...defaultState,
          ...options
        }, function fadeout(){
            setTimeout(()=>{
                if(this.state.display === "hide"){
                    return;
                }else{
                    options.display = "fadeout";
                    this.setState({
                        ...defaultState,
                        ...options
                    },()=>{
                        if(!!this.state.taskQueue.length){
                            this.open(this.state.taskQueue[0])
                            this.state.taskQueue.shift()
                        }
                    })
                }
            }, 3000)
        })
    }

    close(){
        defaultState.display = "hide";
        this.setState({
          ...defaultState
        })
    }
    
	render() {
		return (
			<div
                id="toast"
                className={this.state.type + ' ' + this.state.display}
                onClick={this.close.bind(this)}
            >
				{this.state.content}
			</div>
		);
	}
}

 
let div = document.createElement('div');
let props = {
   
};

document.body.appendChild(div);
 
let Box = ReactDOM.render(React.createElement(
    ToastPublic,
    props
),div);

export default Box;