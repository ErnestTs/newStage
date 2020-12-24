var protocol = window.location.href.split(":")[0] + "://";
var url = protocol + window.location.host + "/qcvisit/";

var url = "http://test3.coolvisit.top/qcvisit/"

Date.prototype.format = function (format) {
    var o = {
      "Y+": this.getFullYear(), //year
      "M+": this.getMonth() + 1, //month
      "d+": this.getDate(),    //day
      "h+": this.getHours(),   //hour
      "m+": this.getMinutes(), //minute
      "s+": this.getSeconds(), //second
      "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
      "S": this.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format))
      format = format.replace(RegExp.$1,
        RegExp.$1.length == 1 ? o[k] :
          ("00" + o[k]).substr(("" + o[k]).length));
    return format;
};

/**
 * 获取url中的参数
 * @returns {Object}
 */
function getUrlProps (){
    let res = {};
    let url = window.location.href;
    let propsStr = url.split("?")[1];
    let strArr = propsStr.split("&");
    for (let i = 0; i < strArr.length; i++) {
        let key = strArr[i].split("=")[0];
        let value = strArr[i].split("=")[1];
        res[key] = value
    }
    return res
}

/**
 * @description [获取数据]
 * @param {*} param0 
 */
function getSupplierInfo({wid, userid, token}){
    let req = {
        wid:wid,
        userid:userid
        }
    $.ajax({
        method: "post",
        url: url + "getResidentVisitorByWs",
        contentType: "application/json",
        headers: {
            'X-COOLVISIT-TOKEN': token
        },
        async:false,
        data: JSON.stringify(req),
        success:(res)=>{
            $("#staff").html(res.result.length)


            let staffList = res.result;
            for(let i = 0; i < staffList.length; i++){
                let item = staffList[i]
                let jsx = "<li><div>姓名："+item.name+"</div><div>手机号码："+item.phone+"</div><div>身份证号："+item.cardid+"</div></li>"
                $("#staffList").append(jsx)
            }
        }
    })
    $.ajax({
        method: "post",
        url: url + "getWorkSheet",
        contentType: "application/json",
        headers: {
            'X-COOLVISIT-TOKEN': token
        },
        data: JSON.stringify(req),
        success:(res)=>{
            $("#leader").html(res.result.leader)
            $("#phone").html(res.result.phone)
            $("#rcName").html(res.result.rcName)
            $("#workArea").html(res.result.workArea)
            $("#startDate").html(new Date(res.result.startDate).format("yyyy-MM-dd hh:mm:ss"))
            $("#endDate").html(new Date(res.result.endDate).format("yyyy-MM-dd hh:mm:ss"))

            
        }
    })
}

var props = getUrlProps();
const wid = props.wid;
const userid = props.userid;
const token = props.token;
getSupplierInfo({
    wid:wid,
    userid:userid,
    token:token
})