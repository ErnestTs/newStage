/**
 * Created by duronal on 17/4/20.
 */
import $ from 'jquery';
import Base64Code from './Base64';

export default class Common {
	static protocol = window.location.href.split(":")[0] + "://";
	static url = Common.protocol + window.location.host + "/qcvisit/";
	static printUrl = Common.protocol + window.location.host + "/card/index.html";
	static cameraUrl = Common.protocol + window.location.host + "/stage/MyCamera.swf";
	static customPrintUrl = Common.protocol + window.location.host + "/card/custom/";

	static url = "http://www.coolvisit.top/qcvisitBase/";
	// static url = "http://www.coolvisit.top/ykt/qcvisit/";
	// static url = "http://139.217.223.183/qcvisit/";
	// static printUrl = "http://www.coolvisit.top/card/index.html";
	// static cameraUrl = "http://www.coolvisit.top/qcvisitBase/stage/MyCamera.swf";
	// static customPrintUrl = "http://www.coolvisit.top/ykt/card/custom/";

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
}

