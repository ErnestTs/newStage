import React,{Component} from "react"

import Common from "../../Common/index"

import "./index.css"

// Toast
import Toast from "../../components/ToastPublic/index.jsx"

export default class FaceRecognition extends Component {
    uploadBlob;
    
    constructor(props){
        super(props)
        this.state= {
			photo:false,
			photoURL:"",
			faceLoading:false
        }
    }

    render(){
        return (
            <div id="component_Face">
                <div id="facePhoto">
					<video id="video" autoPlay="autoplay"></video>
					<canvas id="canvas" width="600px" height="450px"></canvas> 
                </div>
                <div id="faceBtn">
                    <div id="faceRepeatBtn" onClick={this.takePhoto.bind(this)}>
                        {this.state.photo === false ? "拍照" : "重拍"}
                    </div>
                    <div id="faceNextBtn" onClick={this.nextStep.bind(this)}>
                        下一步
                    </div>
                </div>
            </div>  
        )
    }

    componentDidMount(){
        // 守卫返回
        if(!this.props.history.location.state){
            this.props.history.push("/home/qrcode");
            return
        }
		this.routerData = this.props.history.location.state;
		
		// console.log(this.routerData)
        
		this.initCamera();
    }

    initCamera(){
		let _this = this

		const video = document.getElementById("video")

		function success(stream){
			//兼容webkit内核浏览器
			var CompatibleURL = window.URL || window.webkitURL;
			//将视频流设置为video元素的源
			try{
				video.src = CompatibleURL.createObjectURL(stream);
			} catch(e){
				video.srcObject = stream;
			}
			//播放视频
			video.play();
		}
		//异常的回调函数
		function error(error){
			console.log("访问用户媒体设备失败：",error.name,error.message);
		}

		if (navigator.mediaDevices.getUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia){
			//调用用户媒体设备，访问摄像头
			this.getUserMedia({
				video:true
			},success,error);
		
		} else {
			// errorCamera();
		}

		if (sessionStorage.photoSwitch === 'false') {
			var sendData = this.routerData;
			sendData.photoUrl = "";
			if (sendData.action !== "logistics") sessionStorage.vid = sendData.vid;
			this.appointmentSignin(sendData);
		}
		
		if(Common.$_Get().idcard == "3" && Common.$_Get().photo == "1"){
			window.callbackCamera = function(res){
				var sendData = _this.routerData;
				sendData.photoUrl = res;
				if(sendData.action !== "logistics")	sessionStorage.vid = sendData.vid;
				_this.appointmentSignin(sendData);
			}
			if(sessionStorage.cameraReady == 'true'){
				sessionStorage.cameraReady = 'false'
				window.Android.startActivity("camera");
			}else{
				window.Android.updateImage();
			}
		}
    }

    nextStep(){
		let _this = this;
		if(this.state.faceLoading){
			return
		}else {
			this.state.faceLoading = true
		}
		if (this.uploadBlob === undefined && sessionStorage.photoSwitch === 'true') {
            Toast.open({
                type:"danger",
                content: "请拍照后进行下一步操作"
            })
			return;
		}
		if(Common.$_Get().idcard == "3"){
			window.callbackCamera = function(res){
				var sendData = _this.routerData;
				sendData.photoUrl = res;
				if(sendData.action !== "logistics")	sessionStorage.vid = sendData.vid;
				_this.appointmentSignin(sendData);
			}
			window.Android.startActivity("camera");
		}else{
			let formData = new FormData();

			formData.append('filename', this.uploadBlob, 'avatar.png');

			Common.uploadForm('Upload', formData, sessionStorage.token).done(function (data) {
				if (data.status === 0) {
					// var sendData = this.routerData;
					// sendData.photoUrl = data.result.url;
					// this.appointmentSignin(sendData);
                    let photoUrl = {"photoUrl":data.result.url};
                    Common.ajaxProcWithoutAsync("uploadFace",photoUrl,sessionStorage.token)
                    let count = 0;
                    window.interval = setInterval(() => {
                        if(count >= 20) {
                            clearInterval(window.interval)
                            window.interval = null
                            Toast.open({
                                type:"danger",
                                content: "未检测到人脸。1.请注意拍摄正面照片。2.请避免刘海、帽子等遮挡额头。3.请避免口罩遮挡至鼻梁处。"
                            })
                            this.state.faceLoading = false
                            return
                        }else {
                            this.state.faceLoading = true
                            this.getFaceStatus(data.result.url)
                            count++
                        }
                    }, 1000);
				}
			}.bind(this));
		}
    }
    
    /**
     * @description [校验人脸]
     * @param {String} url 
     */
    getFaceStatus(url) {
        let sendData = {photoUrl:url};
        Common.ajaxProc("getFaceStatus",sendData,sessionStorage.token).done((res)=>{
            if(res.result == 0) {
                this.setState({
                    faceLoading:false,
                    faceState:true
                })
                clearInterval(window.interval)
				var sendData = this.routerData;
				sendData.photoUrl = url;
				this.appointmentSignin(sendData);
            }else if(res.result == 2){
                Toast.open({
                    type:"danger",
                    content: "未检测到人脸。1.请注意拍摄正面照片。2.请避免刘海、帽子等遮挡额头。3.请避免口罩遮挡至鼻梁处。"
                })
                clearInterval(window.interval)
                window.interval = null
                this.state.faceLoading = false
            }
        });
    }

    takePhoto(){
        let camera = document.getElementById('video');
        let baseCode;
		let canvas = document.getElementById('canvas'),
			ctx = canvas.getContext('2d');

		canvas.setAttribute("width", camera.offsetWidth);
		canvas.setAttribute("height", camera.offsetHeight);

		ctx.drawImage(camera, 0, 0, camera.offsetWidth, camera.offsetHeight);

		baseCode = canvas.toDataURL('image/jpg');

		if (!this.state.photo) {
			camera.style.display = 'none';
			canvas.style.display = 'inline';
			this.state.photo = true;
		}

		else {
			camera.style.display = 'inline';
			canvas.style.display = 'none';

			baseCode = undefined;
			this.state.photo = false;
			return
		}

		this.setState({});

		/**
		 * 	将base64转换成二进制流
		 */
		if (baseCode != undefined) {
			this.uploadBlob = Common.convertBase64UrlToBlob(baseCode);
		}
		else {
			this.uploadBlob = undefined;
		}
		if(Common.$_Get().idcard !== "3"){
			let formData = new FormData();
	
			formData.append('filename', this.uploadBlob, 'avatar.png');
	
			Common.uploadForm('Upload', formData, sessionStorage.token).done(function (data) {
				if (data.status === 0) {
					this.setState({
						photoURL:data.result.url
					})
				}
			}.bind(this));
		}
    }

	/**
	 * 访客签到
	 * 1 需要拍照
	 * 2 需要身份证ID
	 * @param {*} sendData 
	 */
	appointmentSignin(sendData) {
		this.setState({
			onSignin:true
		})
		//物流签到
		if(sendData.action === "logistics"){
			let memberInfo = JSON.stringify(this.routerData.memberInfo);
			let otherExtend = JSON.stringify(this.routerData.otherExtend);
			let sendData = {
				userid:this.routerData.userid,
				sid :this.routerData.sid,
				scardId:this.routerData.cardid,
				visitdate:this.routerData.visitdate,
				memberInfo: memberInfo,
				otherExtend: otherExtend
			}
			Common.ajaxProc('updateLogisticsInfo', sendData, sessionStorage.token).done(function (data) {
				this.setState({
					onSignin:false
				})
				if (data.status === 0) {
                    Toast.open({
                        type:"success",
                        content: "签到成功"
                    })
					
					setTimeout(function () {
                        this.props.history.replace("/home/logistics")
					}.bind(this), 3000);
				}else {
                    Toast.open({
                        type:"danger",
                        content: "签到失败"
                    })
				}				
			}.bind(this))
        }else{
            // 	/**邀请函签到 */
        	if ((sendData.action === 'qrcode' || sendData.action === 'list') && sendData.qrtype === 'a') {
        		sessionStorage.vid = "a" + sendData.vid;
				this.aSignin("appointmentSignin", sendData);
        	}else {
				/**邀请签到 */
				if (sendData.signin == "1") {
					sessionStorage.vid = "a" + sendData.vid;
					this.aSignin("appointmentSignin", sendData);
				}else{
					sessionStorage.vid = "v" + sendData.vid;
					this.vSignin("VisitAppointmentSignin", sendData);
				}
            }
        }
    }
    
    
	aSignin(method, sendData) {
		var msendData = {
			userid: sessionStorage.userid,
			phone: sendData.visit.vphone,
			photoUrl: sendData.photoUrl,
			id: sendData.vid,
			cardId: sendData.cardId,
			extendCol: this.routerData.extendCol,
			remark: this.routerData.remark,
			plateNum: this.routerData.plateNum,
			signInGate: this.routerData.signInGate,
			signOutGate: this.routerData.signOutGate,
			signInOpName: this.routerData.signInOpName,
			signOutOpName: this.routerData.signOutOpName
		};

		let remark = sessionStorage.remark;
		try {
			if (remark !== null && remark.length !== 0 && remark !== "null") {
				msendData.remark = remark;
			}
		} catch (error) {
			
        }

		Common.ajaxProc(method, msendData, sessionStorage.token).done(function (data) {
			this.setState({
				onSignin:false
			})
			if (data.status === 0) {
				if (this.state.isEng) {
                    Toast.open({
                        type:"success",
                        content: "Visitor Check-in Success"
                    })
				}
				else {
                    Toast.open({
                        type:"success",
                        content: "访客签到成功"
                    })
				}
				// sessionStorage.vid = "a" + sendData.vid;
				sessionStorage.vid = "v" + data.result.vid;
				sessionStorage.aid = "v" + data.result.vid;

				sessionStorage.sign = "1";
				// sessionStorage.aid = data.result.aid;
				console.log(sessionStorage.vid, sessionStorage.aid);

				// this.updateRemark(data.result.vid);
				setTimeout(function () {
					this.props.history.push({pathname:"print",state:{printList:[{vid:"v" + data.result.vid}]}})
				}.bind(this), 3000);
			}
			else if (data.status === 69) {
                Toast.open({
                    type:"danger",
                    content: "请参加考试"
                })
				// $(".menuItem").removeClass("action");
				if(Common.$_Get().idcard == "3"){
					// this.props.routerCallback("vistorlist");
					// $("#vistorlist").addClass("action");
				}else{
					// this.props.routerCallback("qrcode");
					// $("#qrcode").addClass("action");
				}
			}		
			else {
                Toast.open({
                    type:"danger",
                    content: "访客签到失败"
                })
			}
		}.bind(this));
    }
    
    
	vSignin(method, sendData) {
		let temp = {
			vid : sendData.vid,
			phone : sendData.visit.vphone,
			email : sendData.visit.vemail,
			photoUrl : sendData.photoUrl,
			cardId : this.routerData.cardId,
			extendCol : this.routerData.extendCol,
			remark: this.routerData.remark,
			plateNum : this.routerData.plateNum,
			signInGate: this.routerData.signInGate,
			signOutGate: this.routerData.signOutGate,
			signInOpName: this.routerData.signInOpName,
			signOutOpName: this.routerData.signOutOpName
		};
		let jqXHR = Common.ajaxProc(method, temp, sessionStorage.token);
		jqXHR.done(function (data) {
			if (data.status === 0) {
				if (this.state.isEng) {
                    Toast.open({
                        type:"success",
                        content: "Visitor Check-in Success"
                    })
				}
				else {
                    Toast.open({
                        type:"success",
                        content: "访客签到成功"
                    })
				}

				sessionStorage.vid = "v" + sendData.vid;
				sessionStorage.sign = "2";

				let length = data.result.glist.length,
					glist = [];
				if (length !== 0) {
					for (let i = 0; i < length; i++) {
						let item = data.result.glist[i];
						glist.push(item.vid);
					}
					sessionStorage.glist = glist;
				}
				else {
					sessionStorage.glist = "";
				}

				setTimeout(function () {
					this.props.history.push({pathname:"print",state:{printList:[{vid:"v" + sendData.vid}]}})
				}.bind(this), 3000);
			}
			else if (data.status === 64) {
                Toast.open({
                    type:"danger",
                    content: "该预约尚未到来访时间"
                })
			}
			else if (data.status === 65) {
                Toast.open({
                    type:"danger",
                    content: "该预约已超过来访时间"
                })
			}
			else if (data.status === 66) {
                Toast.open({
                    type:"danger",
                    content: "该用户已被禁止预约来访"
                })
			}
			else if (data.status === 69) {
                Toast.open({
                    type:"danger",
                    content: "请参加考试"
                })
				// $(".menuItem").removeClass("action");
				if(Common.$_Get().idcard == "3"){
					// this.props.routerCallback("vistorlist");
					// $("#vistorlist").addClass("action");
				}else{
					// this.props.routerCallback("qrcode");
					// $("#qrcode").addClass("action");
				}
			}
		}.bind(this));
	}

	/**
	 * @description [获取用户设备]
	 * @param {*} constrains 
	 * @param {*} success 
	 * @param {*} error 
	 */
	getUserMedia(constrains,success,error){
		if(navigator.mediaDevices.getUserMedia){
			//最新标准API
			navigator.mediaDevices.getUserMedia(constrains).then(success).catch(error);
		} else if (navigator.webkitGetUserMedia){
			//webkit内核浏览器
			navigator.webkitGetUserMedia(constrains).then(success).catch(error);
		} else if (navigator.mozGetUserMedia){
			//Firefox浏览器
			navigator.mozGetUserMedia(constrains).then(success).catch(error);
		} else if (navigator.getUserMedia){
			//旧版API
			navigator.getUserMedia(constrains).then(success).catch(error);
		}
	}
}