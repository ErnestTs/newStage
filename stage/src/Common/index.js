import $ from 'jquery';
import Base64Code from './Base64';

export default class Common {
	static protocol = window.location.href.split(":")[0] + "://";
	static url = Common.protocol + window.location.host + "/qcvisit/";
	static printUrl = Common.protocol + window.location.host + "/card/index.html";
	static cameraUrl = Common.protocol + window.location.host + "/stage/MyCamera.swf";
	static customPrintUrl = Common.protocol + window.location.host + "/card/custom/";

	// static url = "http://www.coolvisit.top/qcvisitBase/";
	static url = "http://www.coolvisit.top/wmd/qcvisit/";
	// static url = "http://www.coolvisit.top/ykt/qcvisit/";
	// static url = "http://139.217.223.183/qcvisit/";
	// static printUrl = "http://www.coolvisit.top/card/index.html";
	static cameraUrl = "http://www.coolvisit.top/wmd/stage/MyCamera.swf";
	static customPrintUrl = "http://www.coolvisit.top/card/custom/";
	
	static Version = "2.4.8"

	static FreshToken = 6

	static ajaxProc(action, data, token) {
		let jqXHR = $.ajax({
			url: this.url + action,
			contentType: 'application/json',
			data: JSON.stringify(data),
			type: 'post',
			timeout: 10000,
			headers: {
				'X-COOLVISIT-TOKEN': token
			},
			success: function(data){
				if(data.status == 27) {
					setTimeout(()=>{
						sessionStorage.clear()
						window.history.go(0)
					}, 2000)
					return;
				}
			}
		});
		return jqXHR;
	}

	static ajaxProcWithoutAsync(action, data, token) {
		let jqXHR = $.ajax({
			url: this.url + action,
			contentType: 'application/json',
			data: JSON.stringify(data),
			type: 'post',
			timeout: 10000,
			async: false,
			headers: {
				'X-COOLVISIT-TOKEN': token
			},
			success: function(data){
				if(data.status == 27) {
					setTimeout(()=>{
						sessionStorage.clear()
						window.history.go(0)
					}, 2000)
					return;
				}
			}
		});
		return jqXHR;
	}

	static ajaxSenseidProc(action, data, token) {
		let jqXHR = $.ajax({
			url: this.url + action,
			contentType: 'application/json',
			data: JSON.stringify(data),
			type: 'post',
			timeout: 10000,
			headers: {
				'User-Agent':'android_senseid'
			},
			success: function(data){
				if(data.status == 27) {
					setTimeout(()=>{
						sessionStorage.clear()
						window.history.go(0)
					}, 2000)
					return;
				}
			}
		});
		return jqXHR;
	}

	static uploadForm(method, data, token) {
		let jqXHR = $.ajax({
			type: 'POST',
			url: this.url + method,
			data: data,
			processData: false, // 不会将 data 参数序列化字符串
			contentType: false, // 根据表单 input 提交的数据使用其默认的 contentType
			headers: {
				'X-COOLVISIT-TOKEN': token
			}
		});

		return jqXHR;
	}

	static convertBase64UrlToBlob(urlData) {
		//去掉url的头，并转换为byte
		let bytes = window.atob(urlData.split(',')[1]);
		//处理异常,将ascii码小于0的转换为大于0
		let ab = new ArrayBuffer(bytes.length);
		let ia = new Uint8Array(ab);
		for (let i = 0; i < bytes.length; i++) {
			ia[i] = bytes.charCodeAt(i);
		}

		return new Blob([ab], { type: 'image/jpeg' });
	}

	static getid(id) {
		return document.getElementById(id);
	}

	static $_Get() {
		let url = window.document.location.href.toString();
		let u = url.split("?");
		if (typeof (u[1]) === "string") {
			u[1] = u[1].split("#")[0];
			u = u[1].split("&");
			let get = {};
			for (let i in u) {
				let j = u[i].split("=");
				get[j[0]] = j[1];
			}
			return get;
		} else {
			return {};
		}
	}

	
	static checkIdCard(idcard) {
		var Y, JYM
		var S, M
		var ereg
		var idcard_array = new Array()
		idcard_array = idcard.split('')
		var area = {
		  11: '北京',
		  12: '天津',
		  13: '河北',
		  14: '山西',
		  15: '内蒙古',
		  21: '辽宁',
		  22: '吉林',
		  23: '黑龙江',
		  31: '上海',
		  32: '江苏',
		  33: '浙江',
		  34: '安徽',
		  35: '福建',
		  36: '江西',
		  37: '山东',
		  41: '河南',
		  42: '湖北',
		  43: '湖南',
		  44: '广东',
		  45: '广西',
		  46: '海南',
		  50: '重庆',
		  51: '四川',
		  52: '贵州',
		  53: '云南',
		  54: '西藏',
		  61: '陕西',
		  62: '甘肃',
		  63: '青海',
		  64: '宁夏',
		  65: '新疆',
		  71: '台湾',
		  81: '香港',
		  82: '澳门',
		  91: '国外'
		}
		var Errors = new Array(
			{state:true, errMsg:"验证通过!"},
			{state:false, errMsg:"身份证号码位数不对!"},
			{state:false, errMsg:'身份证号码出生日期超出范围或含有非法字符!'},
			{state:false, errMsg:"身份证号码校验错误!"},
			{state:false, errMsg:"身份证地区非法!"},
			{state:false, errMsg:"验证通过!"},
			{state:false, errMsg:"验证通过!"}
	  
		)
		// 地区检验
		if (area[parseInt(idcard.substr(0, 2))] == null) {
		  return Errors[4]
		}
		// 身份号码位数及格式检验
		switch (idcard.length) {
		  case 15:
	  
			if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0)) {
			  ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/ // 测试出生日期的合法性
			} else {
			  ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/ // 测试出生日期的合法性
			}
	  
			if (ereg.test(idcard)) {
			  return Errors[0]
			} else {
			  return Errors[2]
			}
	  
			break
	  
		  case 18:
	  
			// 18位身份号码检测
	  
			// 出生日期的合法性检查
	  
			// 闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
	  
			// 平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
	  
			if (parseInt(idcard.substr(6, 4)) % 4 == 0 || (parseInt(idcard.substr(6, 4)) % 100 == 0 && parseInt(idcard.substr(6, 4)) % 4 == 0)) {
			  ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/ // 闰年出生日期的合法性正则表达式
			} else {
			  ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/ // 平年出生日期的合法性正则表达式
			}
	  
			if (ereg.test(idcard)) { // 测试出生日期的合法性
			  // 计算校验位
	  
			  S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 +
				(parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 +
				(parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 +
				(parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 +
				(parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 +
				(parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 +
				(parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 +
				parseInt(idcard_array[7]) * 1 +
				parseInt(idcard_array[8]) * 6 +
				parseInt(idcard_array[9]) * 3
	  
			  Y = S % 11
	  
			  M = 'F'
	  
			  JYM = '10X98765432'
	  
			  M = JYM.substr(Y, 1) // 判断校验位
	  
			  if (M == idcard_array[17]) {
				return Errors[0] // 检测ID的校验位
			  } else {
				return Errors[3]
			  }
			} else {
			  return Errors[2]
			}
	  
			break
	  
		  default:
	  
			return Errors[1]
	  
			break
		}
      }

	static randomString(e) {
		e = e || 32;
		var a = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
			n = a.length,
			s = "";
		for (let i = 0; i < e; i++) s += a.charAt(Math.floor(Math.random() * n));
		return s
	}

	static codeEnBase(str) {
		var enstr = Base64Code.encode(str);
		return enstr;
	}
      
    static lftPwdRule(e, a, n) {
		var s = e.split("");
		s.splice(a, 0, Common.randomString(5));
		var t = s.join("").split("").reverse(),
			o = Common.codeEnBase(t.join("")).split("");
		return o.splice(n, 0, Common.randomString(5)), o.join("");
	}


/**
 * @description [处理转译字符串]
 * @param {String} str
 * @returns {String}
 */
	static compileStr(str) {
		if(!str){
			return
		}
		let resStr = str;
		resStr = resStr.replace(/&amp;/g,'&');
		resStr = resStr.replace(/&lt;/g,'<');
		resStr = resStr.replace(/&gt;/g,'>');
		resStr = resStr.replace(/\\/g,'');
		resStr = resStr.replace(/&quot;/g,'"');
		resStr = resStr.replace(/&reg;/g,'®');
		resStr = resStr.replace(/&nbsp;/g,"&nbsp;");
		return resStr
	}

	/**
	 * @description [初始化证照通]
	 */
	static initPassPort(){
		// add by 方 添加读卡器驱动 用于读取身份证信息
		$("#page_home_mainView").append(
			'<object id="objIDCard" classid="clsid:10EC554B-357B-4188-9E5E-AC5039454D8B"></object>'
		);
		$("#page_home_mainView").append(
			'<object classid="clsid:2DEFFB1F-4F4C-41B6-930A-63BE16732D61" id="objIDCard2" width="0" height="0"></object>'
		);
	}

	static initIdCard(){
		$("#page_home_mainView").append(
			'<embed id="CertCtl" type="application/cert-reader" />'
		);
	}

	static scanByPassPort() {
		let objIDCard = document.getElementById("objIDCard");
		/**
		 * 如果没有IDCard的识别核心没有加在成功则重新初始化一下
		 */
		if (!objIDCard.IsLoaded()) {
			let nRet = objIDCard.InitIDCard("53574805357523480961", 1);
			if (nRet !== 0) {
				this.props.toastCallback(2, "show", "证件通驱动加载失败,请检查设备");
				return;
			}
		}

		/**
		 * 设置RecogIDCard识别的证件类型。
		 */

		objIDCard.SetIDCardType(2, 0);

		objIDCard.AddIDCardType(1, 0);
		objIDCard.AddIDCardType(2, 0);
		objIDCard.AddIDCardType(3, 0);
		objIDCard.AddIDCardType(4, 0);
		objIDCard.AddIDCardType(5, 0);
		objIDCard.AddIDCardType(5, 0);
		objIDCard.AddIDCardType(6, 0);
		objIDCard.AddIDCardType(7, 0);
		objIDCard.AddIDCardType(9, 0);
		objIDCard.AddIDCardType(10, 0);
		objIDCard.AddIDCardType(11, 0);
		objIDCard.AddIDCardType(12, 0);
		objIDCard.AddIDCardType(13, 0);
		objIDCard.AddIDCardType(14, 0);
		objIDCard.AddIDCardType(15, 0);
		objIDCard.AddIDCardType(16, 0);
		objIDCard.AddIDCardType(22, 0);
		objIDCard.AddIDCardType(25, 0);
		objIDCard.AddIDCardType(26, 0);

		/**
		 * ClassifyIDCard
		 * 对即将识别的证件自动分类。
		 * 返回值：1表示是芯片卡，2表示普通的MRZ证件，3代表不含有MRZ的证件，其它 失败。
		 * 说明：调用该接口前已经通过调用SetIDCardID和AddIDCardID设置了要分类的证
		 * 件类型，具体该分类接口要采集什么图像根据情况确定，内部采集图像。
		 */
		let nCardType = objIDCard.ClassifyIDCard();

		let nDG = 3,
			nViz = 1,
			nImg = 15,
			nResult = "";

		if (nCardType === 1) {
			/**
			 * RecogChipCard
			 * 功能：采集图象并识别带电子芯片的证件。
			 */
			nResult = objIDCard.RecogChipCard(nDG, nViz, nImg);
		}
		else if (nCardType === 2) {
			/**
			 * RecogGeneralMRZCard
			 * 功能：采集图像并根据模板识别带有MRz的证件
			 */
			nResult = objIDCard.RecogGeneralMRZCard(nViz, nImg);
		}

		else if (nCardType === 3) {
			/**
			 * RecogCommonCard
			 * 采集图像并对指定类型的证件进行识别
			 */
			nResult = objIDCard.RecogCommonCard(nImg);
		}

		/**
		 * 如果nResult>0 则保存有效,根据识别字段进行自动归类
		 */
		if (nResult > 0) {
			let nFieldNum = objIDCard.GetRecogFieldNum();
			let result = [];
			if (nFieldNum > 0) {
				for (let i = 1; i <= nFieldNum; ++i) {
					let temp = "";
					temp += objIDCard.GetFieldName(i);
					temp += ":";
					temp += objIDCard.GetRecogResult(i);
					result.push(temp);
				}
			}

			objIDCard.SaveImageEx("C:\\head.jpg", 15);
			let cardcode = objIDCard.EncodeToBase64("C:\\head.jpg");
			let headcode = objIDCard.EncodeToBase64("C:\\headHead.jpg");

			let count = result.length;
			if (count === 6) {
				let item = result[5];
				if (item.substring(0, 6) === "公民身份号码") {
					return this.readProcess(result, 1, headcode, cardcode);
				}
			}
			else if (count === 13) {
				let item = result[8];
				if (item.substring(0, 6) === "港澳证件号码") {
					return this.readProcess(result, 2, headcode, cardcode);
				}
			}
			else if (count === 30) {
				let item = result[0];
				if (item.substring(0, 4) === "护照号码") {
					return this.readProcess(result, 3, headcode, cardcode);
				}
			}
			else if (count === 10) {
				let item = result[6];
				if (item.substring(0, 4) === "准驾车型") {
					return this.readProcess(result, 4, headcode, cardcode);
				}
			}
			else if (count === 19) {
				let item = result[16];
				if (item.substring(0, 4) === "签发次数") {
					return this.readProcess(result, 5, headcode, cardcode);
				}
			}
		}
	}

	static readProcess(result, type, head, card) {
		let partyName = "",
			certNumber = "",
			certAddress = "",
			effDate = "",
			cardType = "",
			expDate = "",
			sex = "",
			nationality = "",
			birthday = "";


		switch (type) {
			case 1:
				partyName = this.getCardColumn(result, 0, 3);
				certNumber = this.getCardColumn(result, 5, 7);
				certAddress = this.getCardColumn(result, 4, 3);
				sex = this.getCardColumn(result, 1, 3);
				nationality = this.getCardColumn(result, 2, 3);
				birthday = this.getCardColumn(result, 3, 3);
				effDate = "";
				expDate = "";
				cardType = 1;
				break;
			case 2:
				partyName = this.getCardColumn(result, 1, 5);
				certNumber = this.getCardColumn(result, 0, 5);
				certAddress = "";
				effDate = this.getCardColumn(result, 9, 5) + ' ';
				expDate = this.getCardColumn(result, 10, 5);
				cardType = 2;
				break;
			case 3:
				partyName = this.getCardColumn(result, 1, 5);
				certNumber = this.getCardColumn(result, 0, 8);
				certAddress = this.getCardColumn(result, 13, 5);
				effDate = this.getCardColumn(result, 15, 5);
				expDate = this.getCardColumn(result, 26, 8);
				cardType = 3;
				break;
			case 4:
				partyName = this.getCardColumn(result, 1, 3);
				certNumber = this.getCardColumn(result, 0, 3);
				certAddress = this.getCardColumn(result, 3, 3);
				effDate = this.getCardColumn(result, 5, 7);
				expDate = this.getCardColumn(result, 9, 7);
				cardType = 4;
				break;
			case 5:
				partyName = this.getCardColumn(result, 2, 5);
				certNumber = this.getCardColumn(result, 1, 5);
				certAddress = this.getCardColumn(result, 17, 4);
				effDate = this.getCardColumn(result, 15, 5);
				expDate = this.getCardColumn(result, 6, 5);
				cardType = 5;
				break;
			default:
		}
		return {certNumber:certNumber,partyName:partyName,address:certAddress}
	}

	
	/**
	 * 从读卡结果中获取字段值
	 * @param {*} result 读卡结果
	 * @param {*} index 字段索引
	 * @param {*} start 截取字符串的初始位置
	 */
	static getCardColumn(result, index, start) {
		let item = result[index],
			count = item.length;

		return item.substring(start, count);
	}

	/**
	 * @description [获取身份证信息]
	 */
	static getIdCardInfo() {
		try {
			let CertCtlObj = document.getElementById("CertCtl"); //Routon Card Reader
			let jsonStr = CertCtlObj.connect();   //连接读卡器
			jsonStr = this.transformStr(jsonStr);

			if (jsonStr.resultFlag === 0) {
				jsonStr = CertCtlObj.getStatus();   //得到读卡器状态
				jsonStr = this.transformStr(jsonStr);

				if (jsonStr.status === 0) {
					jsonStr = CertCtlObj.readCert();      //读身份证信息
					jsonStr = this.transformStr(jsonStr);
					jsonStr.resultContent.head = ""
					jsonStr.resultContent.card = ""
					let data = {
						idcardContent: jsonStr.resultContent,
						action: this.state.action
										};
										return {certNumber:data.idcardContent.certNumber,partyName:data.idcardContent.partyName,address:data.idcardContent.cardAddress}
				}
			}
			else {
								console.log("CertCtl:"+jsonStr.resultFlag)
								return {certNumber:"",partyName:"err1",address:""};
			}
		}
		catch (e) {
						console.log("CertCtl:"+e)
						return {certNumber:"",partyName:"err0",address:""};
		}
	}

	/**
	 * @description [处理读卡器返回内容第一个字符乱码的问题]
	 * @param {*} str 
	 */
	static transformStr(str) {
		let first = str.substring(0, 1);

		if (first !== '{') {
			str = '{"' + str;
		}
		return JSON.parse(str);
	}

	/**
	 * @description [校验通行策略]
	 * @param {Array} floor [楼层]
	 */
	static checkPassConfig(floor){
		if(!floor){
			return false
		}
		let resBoolean = false
		let gNamesList = [];
		let gName = sessionStorage.gname
		for(let i =0; i < floor.length;i++){
			gNamesList.push(gName+"-"+floor[i])
		}
		let sendData = {
			"reqDate":new Date().getTime(),
			"userid": sessionStorage.userid,
			// "gNames":["T1-10F12F","T2-10F12F16F"]
			"gNames":gNamesList
		}
		this.ajaxProcWithoutAsync("getSendCardStatus",sendData,sessionStorage.token).done((res)=>{
			if(res.status == 0){
				resBoolean = true
			}
		})
		return resBoolean
	}

}

