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
 * @description [获取url中的参数]
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

function getWid({createTime,wid}){
    let wStr = ""
    let tStr = new Date(createTime).format("yyyyMMddhhmmss")
    if(wid < 10){
        wStr = "0"+wid
    }else if(wid < 100){
        wStr = ""+wid
    }else {
        wStr = ""+parseInt(wid/10)
    }
    return tStr+wStr
}

/**
 * @description [获取数据]
 * @param {*} param0 
 */
function getSupplierInfo({wid, userid, token,gid}){
    let today = new Date().format("yyyy-MM-dd")
    let reqForSearchVisitByCondition = {
        userid:userid,
        date:today,
        endDate:today,
        gid:gid||""
    }
    $.ajax({
        method: "post",
        url: url + "SearchVisitByCondition",
        contentType: "application/json",
        headers: {
            'X-COOLVISIT-TOKEN': token
        },
        async:false,
        data: JSON.stringify(reqForSearchVisitByCondition),
        success:(res)=>{
            let staffList = res.result;
            let count = 0
            for(let i = 0; i < staffList.length; i++){
                let item = staffList[i];
                item.extendCol = item.extendCol.replace(/&quot;/g,'"')
                item.extendCol = item.extendCol.replace(/"\[{/g, "[{");
                item.extendCol = item.extendCol.replace(/}]"/g, "}]");
                let extendCol = !!item.extendCol?JSON.parse(item.extendCol):{};
                if(extendCol.wid == wid) {
                    count++
                    let jsx = "<li><div>姓名："+item.vname+"</div><div>手机号码："+item.vphone+"</div>"+(!!item.cardId?"<div>身份证号："+item.cardId+"</div>":"")+"</li>"
                    $("#staffList").append(jsx)
                }
            }
            $("#staff").html(count)
        }
    })

    let reqForGetWorkSheet = {
        wid:wid,
        userid:userid
    }
    $.ajax({
        method: "post",
        url: url + "getWorkSheet",
        contentType: "application/json",
        headers: {
            'X-COOLVISIT-TOKEN': token
        },
        data: JSON.stringify(reqForGetWorkSheet),
        success:(res)=>{
            $("#leader").html(res.result.leader)
            $("#phone").html(res.result.phone)
            $("#rcName").html(res.result.rcName)
            $("#workArea").html(res.result.workArea)
            $("#workContent").html(res.result.workContent)
            $("#startDate").html(new Date(res.result.startDate).format("yyyy-MM-dd hh:mm:ss"))
            $("#endDate").html(new Date(res.result.endDate).format("yyyy-MM-dd hh:mm:ss"))
            $("#rid").html(getWid({createTime:res.result.createTime,wid:res.result.wid}))

            let subWorkTypes = JSON.parse(res.result.subWorkType.replace(/&quot;/g, '"'))
            let length = subWorkTypes.length;
            if(length < 4){
                length = 4
            }else if(!!((length-4)%5)){
                length += (5-(length-4)%5)
            }
            for(let i = 0; i < length; i++){
                if(!subWorkTypes[i]) {
                    subWorkTypes[i] = {
                        selected:"",
                        name:""
                    }
                }
                let jsx = '<div><span class="checkBox'+(subWorkTypes[i].selected?" checked":"")+'"></span><span>'+subWorkTypes[i].name+'</span></div>'
                $("#subWork").append(jsx)
            }

            $("#subWork").append('<div style="width:100%;border:0"><span>其他:</span></div>')
        }
    })
}

var props = getUrlProps();
const wid = props.wid;
const userid = props.userid;
const token = props.token;
const gid = props.gid
getSupplierInfo({
    wid:wid,
    userid:userid,
    token:token,
    gid:gid
})