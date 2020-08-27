import React,{Component} from "react"

import Common from "../../Common/index"

import "./index.css"

// Toast
import Toast from "../../components/ToastPublic/index.jsx"

export default class Print extends Component {
    constructor(props){
        super(props)
        this.state= {
            printUrl:"",
            printList:[]
        }
    }

    render(){
        return (
            <div id="component_print">
                <div id="printArea">
                    <div id="mainFrame">
                        <iframe id="viframe" src={this.state.printUrl} >

                        </iframe>
                    </div>
                </div>

                <div id="btn_print" onClick={this.startPrint.bind(this)}>
                    <span>打印</span>
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
        let _this = this;

        let LODOP = document.createElement("object");
        LODOP.setAttribute("id", "lodop");
        LODOP.setAttribute("width", 0);
        LODOP.setAttribute("height", 0);
        LODOP.setAttribute("style", "position:absolute;left:0px;top:-100px;width:0px;height:0px;");
        LODOP.setAttribute("classid", "clsid:2105C259-1E0C-4534-8141-A753534CB4CA");

        document.getElementById("component_print").appendChild(LODOP);

        let printList = this.props.history.location.state.printList;
        
        let printUrl = "";
        if(sessionStorage.badgeMode !== '0'){
            printUrl = Common.customPrintUrl + sessionStorage.badgeCustom + "/index.html?vid=" + printList[0].vid + "&userid=" + sessionStorage.userid + "&token=" + sessionStorage.token
        }else {
            printUrl = Common.printUrl + "?vid=" + printList[0].vid + "&userid=" + sessionStorage.userid + "&token=" + sessionStorage.token;
        }
        this.setState({
            printUrl:printUrl,
            printList :this.props.history.location.state.printList
        })
    }

    printCard(vid) {
        if(vid[0]!="a"&&vid[0]!="v"){
            vid = "v"+vid
        }
        let printUrl = "";
        if(sessionStorage.badgeMode !== '0'){
            printUrl = Common.customPrintUrl + sessionStorage.badgeCustom + "/index.html?vid=" + vid + "&userid=" + sessionStorage.userid + "&token=" + sessionStorage.token
        }else {
            printUrl = Common.printUrl + "?vid=" + vid + "&userid=" + sessionStorage.userid + "&token=" + sessionStorage.token;
        }
        let LODOP = document.getElementById('lodop'),
            cardSize = parseInt(sessionStorage.cardSize),
            url = "URL:" + this.state.printUrl + "&rotate=0";

        LODOP.SET_LICENSES("南京访客乐网络科技有限公司", "F223B2198DEF8B1DA12FDE5F3F7E04F2", "", "");
        if (cardSize === 1 || cardSize === undefined) {
            LODOP.PRINT_INITA(0, 0, "62mm", "100mm", "");
            LODOP.SET_PRINT_PAGESIZE(2, 600, 1000, ""); //这里3表示纵向打印且纸高“按内容的高度”；1385表示纸宽138.5mm；45表示页底空白4.5mm

        } else {
            LODOP.PRINT_INITA(0, 0, "60mm", "86mm", "");
            LODOP.SET_PRINT_PAGESIZE(2, 600, 860, ""); //这里3表示纵向打印且纸高“按内容的高度”；1385表示纸宽138.5mm；45表示页底空白4.5mm
        }

        LODOP.ADD_PRINT_HTML(0, 0, '100%', '100%', url);
        LODOP.SET_PRINT_STYLE('Stretch', 2);
        LODOP.SET_PRINT_STYLEA(0, "HtmWaitMilSecs", 5000);
        LODOP.SET_PRINT_STYLEA(0,"PageIndex","1");
        LODOP.SET_PRINT_MODE('PRINT_PAGE_PERCENT', 'Full-Page');
        LODOP.SET_PRINT_MODE('PRINT_END_PAGE', '1');

        LODOP.PRINT();
    }

    startPrint(){
        if(this.state.printing){
            return;
        }
        if(Common.$_Get().idcard == "3"){
            let printVids = []
            for(let i of this.state.printList) {
                if(i.vid[0]!="a"&&i.vid[0]!="v"){
                    i.vid = "v"+i.vid
                }
                printVids.push(i.vid)
            }
            window.Android.print(printVids.join(","));
            return;
        }
        this.state.printing = true
        for(let i = 0; i < this.state.printList.length;i++){
            let item = this.state.printList[i]
            this.printCard(item.vid)
        }
        this.state.printing = false
    }
}