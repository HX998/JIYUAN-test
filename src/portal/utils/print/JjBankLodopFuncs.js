import {post,formatNumber} from "@/api/bizApi/commonUtil";
var CreatedOKLodop7766 = null, CLodopIsLocal;

//====判断是否需要 Web打印服务CLodop:===
//===(不支持插件的浏览器版本需要用它)===
const  styles = '<style type="text/css">\n' +
  'body, h1, h2, h3, h4, h5, h6, hr, p, ul, ol, li, div, textarea, th, td { margin: 0; padding: 0;}\n' +
  'body {font-family: "Microsoft YaHei", "\\5FAE\\8F6F\\96C5\\9ED1", Arial, sans-serif, "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\\5FAE\\8F6F\\96C5\\9ED1", Arial, sans-serif;font-size: 12px;color: #333333;line-height: 1.5;background-color: #fff;-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;}\n' +
  'html,body{height: 100%;}\n' +
  'h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6 {margin-bottom: 0.5rem;font-weight: 500;line-height: 1.1;color: inherit;}\n' +
  'i, em {font-style: normal;}\n' +
  'ul, ol {list-style: none;}\n' +
  ':focus {outline: 0;}\n' +
  '.clearfix {zoom:1; /* IE < 8 */}\n' +
  '.clearfix:before,.clearfix:after {content:""; display:table;}\n' +
  '.clearfix:after {clear:both;}\n' +
  '* {box-sizing: border-box;-webkit-box-sizing: border-box;box-sizing: border-box;-webkit-tap-highlight-color: rgba(0, 0, 0, 0);}\n' +
  '.list-header{height: 40px;padding: 9px 16px;background: #0c67b0;line-height: 22px;font-size: 14px;color: #ffffff;}\n' +
  '.list-total-info{padding: 20px 10px;}\n' +
  '.list-total-info li{float: left;width: 33.33333%;}\n' +
  '.list-total-info li .label{float: left;width: 35%;padding-right: 10px;margin-bottom: 10px;font-size: 12px;color: #666;text-align: right;line-height: 20px;}\n' +
  '.list-total-info li .val{float: left;width: 65%;margin-bottom: 10px;font-size: 12px;color: #000000;line-height: 20px;word-break: break-all;}\n' +
  '.list-table-box{padding: 10px;}\n' +
  '.list-table{width: 100%;border-collapse: collapse;border-spacing: 0;border: 1px solid #dddddd;}\n' +
  '.list-table th,.list-table td{border: 1px solid #dddddd;font-size: 12px;padding: 5px;line-height: 20px;text-align: left;}\n' +
  '.list-table th{background: #eaedf1;}\n' +
  '.list-table td{ white-space: pre; }\n' +
  '.list-table .ta-c{text-align: center;}\n' +
  '.list-table .ta-r{text-align: right;}\n' +
  '.list-table .ta-c{text-align: center;}\n' +
  '.list-page{padding: 15px 0;text-align: center;}\n' +
  '.list-page span{padding: 0 10px;}\n' +
  '.h-ticket-title {font-size: 20px;font-weight: bold;text-align: center;padding: 20px 0 15px 0;}\n' +
  '.h-ticket-table {margin: 0 20px;border: 1px solid #666666;}\n' +
  '.h-ticket-table table {border-collapse: collapse;border-spacing: 0;width: 100%;}\n' +
  '.h-ticket td {border: 1px solid #666666;height: 40px;padding: 0 12px;color: #000000;}\n' +
  '.h-ticket .th {text-align: right;color: #333333;}\n' +
  '.h-t_blue .th {background: rgba(12, 103, 176, 0.10);}\n' +
  '.h-t_green .th {background: rgba(107, 175, 27, 0.10);}\n' +
  '.h-t_pink .th {background: rgba(179, 60, 90, 0.10);}\n' +
  '.h-t_orange .th {background: rgba(198, 127, 28, 0.10);}\n' +
  '.h-ticket .tac {text-align: center;}\n' +
  '.h-ticket .h-money-cell {height: 59px;padding: 0;}\n' +
  '.h-ticket .h-money-unit {height: 26px;border-bottom: 1px solid #666666;}\n' +
  '.h-money-unit em {width: 8.3%;height: 26px;text-align: center;line-height: 26px;border-right: 1px solid #666666;color: #666666;float: left;}\n' +
  '.h-money-unit .h-last {border-right: none;}\n' +
  '.h-money-num span {width: 8.3%;height: 33px;text-align: center;line-height: 33px;border-right: 1px solid #666666;float: left;font-size: 16px;}\n' +
  '.h-money-num .h-last {border-right: none;}\n' +
  '.h-fs14 {font-size: 14px;font-weight: bold;}\n' +
  '.h-btw2 {border-top: 2px solid #666666;}\n' +
  '.h-ticket-info {margin: -5px 20px 10px 20px;}\n' +
  '.h-ticket-info li {float: left;width: 33.33%;margin-bottom: 5px;}\n' +
  '.h-bz-l {float: left;width: 40%;}\n' +
  '.h-bz-c {float: left;width: 30%;}\n' +
  '.h-bz-r {float: right;width: 130px;}\n' +
  '.h-pj-l {float: left;width: 50%;}\n' +
  '.h-pj-c {float: left;width: 25%;}\n' +
  '.h-pj-r {float: right;width: 140px;}\n' +
  '.h-ticket-dq {color: #238fdc;border: 1px solid rgba(35, 143, 220, 0.60);border-radius: 2px;height: 18px;padding: 0 4px;float: right;line-height: 16px;cursor: default;}\n' +
  '.h-c6 {color: #666666;}\n' +
  '.h-t_white {background: #fff;background-image: none;}\n' +
  '.h-t_white .th {text-align: center;} .h-t_white td {height: auto;padding: 4px 12px;}\n' +
  '.h-idea-box{width: 100%;padding: 5px 0;}\n' +
  '.h-idea-box .idea{height: auto;min-height:20px;}\n' +
  '.h-idea-box .date{text-align: right;padding-right: 20px;}\n' +
  '.h-ticket label{margin-right: 25px;}\n' +
  '.h-ticket .check{vertical-align: bottom;margin: 0 0 2px 4px;}\n' +
  '.h-ticket .money{padding: 0 10px;border-bottom: 1px solid #333;}\n' +
  '.table-record{padding: 0 20px;}' +
  '.timeline-wrap { height: 400px; overflow: auto; border-right: 1px solid #eee; }' +
  '.timeline-wrap .h-timeline { padding: 0 20px 0 70px; }' +
  '.timeline-wrap .h-timeline-item { padding: 20px 0 0 0; }' +
  '.timeline-wrap .h-timeline-item-tail { border-left: 1px solid #eee; left: 3px; height: 111px; float: left; margin-top: -16px;}' +
  '.timeline-wrap .h-timeline-item-head { width: 7px; height: 7px; background: #999; margin-top: 6px; float: left; margin-left: -4px; border: 0; border-radius: 4px; }' +
  '.timeline-wrap .h-timeline-item-content { padding: 1px 1px 10px 18px; }' +
  '.timeline-wrap .time { width: 60px; text-align: right; line-height: 16px; float: left; margin-left: -90px;}' +
  '.timeline-wrap .time p { color: #333; font-size: 14px; }' +
  '.timeline-wrap .time span { color: #666; font-size: 12px; }' +
  '.timeline-wrap .content { color: #666; font-size: 12px; line-height: 20px; }' +
  '.timeline-wrap .user { color: #333; font-size: 14px; line-height: 20px; }' +
  '.timeline-wrap .user span { font-weight: 700; margin-right: 10px; }' +
  '.timeline-wrap .result { line-height:20px; }' +
  '.timeline-wrap .color-blue { color: #238fdc; }' +
  '.timeline-wrap .color-red { color: #ea3a3c; }' +
  '.timeline-wrap .color-orange { color: #f39800; }' +
  '</style>'

 function needCLodop() {
    try {
        var ua = navigator.userAgent;
        if (ua.match(/Windows\sPhone/i))
            return true;
        if (ua.match(/iPhone|iPod|iPad/i))
            return true;
        if (ua.match(/Android/i))
            return true;
        if (ua.match(/Edge\D?\d+/i))
            return true;

        var verTrident = ua.match(/Trident\D?\d+/i);
        var verIE = ua.match(/MSIE\D?\d+/i);
        var verOPR = ua.match(/OPR\D?\d+/i);
        var verFF = ua.match(/Firefox\D?\d+/i);
        var x64 = ua.match(/x64/i);
        if ((!verTrident) && (!verIE) && (x64))
            return true;
        else if (verFF) {
            verFF = verFF[0].match(/\d+/);
            if ((verFF[0] >= 41) || (x64))
                return true;
        } else if (verOPR) {
            verOPR = verOPR[0].match(/\d+/);
            if (verOPR[0] >= 32)
                return true;
        } else if ((!verTrident) && (!verIE)) {
            var verChrome = ua.match(/Chrome\D?\d+/i);
            if (verChrome) {
                verChrome = verChrome[0].match(/\d+/);
                if (verChrome[0] >= 41)
                    return true;
            }
        }
        return false;
    } catch (err) {
        return true;
    }
}

//====页面引用CLodop云打印必须的JS文件,用双端口(8000和18000）避免其中某个被占用：====
if (needCLodop()) {
    var src1 = window.LOCAL_CONFIG.PRINT_CLOUD+":8000/CLodopfuncs.js?priority=1";
    var src2 = window.LOCAL_CONFIG.PRINT_CLOUD+":18000/CLodopfuncs.js?priority=0";

    var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
    var oscript = document.createElement("script");
    oscript.src = src1;
    head.insertBefore(oscript, head.firstChild);
    oscript = document.createElement("script");
    oscript.src = src2;
    head.insertBefore(oscript, head.firstChild);
    CLodopIsLocal = !!((src1 + src2).match(/\/\/localho|\/\/127.0.0./i));
}

//====获取LODOP对象的主过程：====
function getLodop(oOBJECT, oEMBED,_this) {
    var strHtmInstall = "<br><font color='#FF00FF'>打印控件未安装!点击这里<a href='static/print/install_lodop32.exe' download=''>执行安装</a>,安装后请刷新页面或重新进入。</font>";
    var strHtmUpdate = "<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='static/print/install_lodop32.exe' download=''>执行升级</a>,升级后请重新进入。</font>";
    var strHtm64_Install = "<br><font color='#FF00FF'>打印控件未安装!点击这里<a href='static/print/install_lodop64.exe' download=''>执行安装</a>,安装后请刷新页面或重新进入。</font>";
    var strHtm64_Update = "<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='static/print/install_lodop64.exe' download=''>执行升级</a>,升级后请重新进入。</font>";
    var strHtmFireFox = "<br><br><font color='#FF00FF'>（注意：如曾安装过Lodop旧版附件npActiveXPLugin,请在【工具】->【附加组件】->【扩展】中先卸它）</font>";
    var strHtmChrome = "<br><br><font color='#FF00FF'>(如果此前正常，仅因浏览器升级或重安装而出问题，需重新执行以上安装）</font>";
    var strCLodopInstall_1 = "<br><font color='#FF00FF'>Web打印服务CLodop未安装启动，点击这里<a href='static/print/CLodop_Setup_for_Win32NT.exe' download=''>下载执行安装</a>";
    var strCLodopInstall_2 = "<br>（若此前已安装过，可<a href='CLodop.protocol:setup' >点这里直接再次启动</a>）";
    var strCLodopInstall_3 = "，成功后请刷新本页面。</font>";
    var strCLodopUpdate = "<br><font color='#FF00FF'>Web打印服务CLodop需升级!点击这里<a href='static/print/CLodop_Setup_for_Win32NT.exe' download=''>执行升级</a>,升级后请刷新页面。</font>";
    var LODOP;
    try {
        var ua = navigator.userAgent;
        var isIE = !!(ua.match(/MSIE/i)) || !!(ua.match(/Trident/i));
        if (needCLodop()) {
            try {
                LODOP = getCLodop();
            } catch (err) {}
            if (!LODOP && document.readyState !== "complete") {
                alert("网页还没下载完毕，请稍等一下再操作.");
                return;
            }
            if (!LODOP) {
               // document.body.innerHTML = strCLodopInstall_1 + (CLodopIsLocal ? strCLodopInstall_2 : "") + strCLodopInstall_3 + document.body.innerHTML;
               _this.$msgTip.info(_this,{info:strCLodopInstall_1 + (CLodopIsLocal ? strCLodopInstall_2 : "") + strCLodopInstall_3 ,time:0})
                return;
            } else {
                if (CLODOP.CVERSION < "3.0.7.5") {
                   // document.body.innerHTML = strCLodopUpdate + document.body.innerHTML;
                   _this.$msgTip.info(_this,{info:strCLodopUpdate,time:0})
                }
                if (oEMBED && oEMBED.parentNode)
                    oEMBED.parentNode.removeChild(oEMBED);
                if (oOBJECT && oOBJECT.parentNode)
                    oOBJECT.parentNode.removeChild(oOBJECT);
            }
        } else {
            var is64IE = isIE && !!(ua.match(/x64/i));
            //=====如果页面有Lodop就直接使用，没有则新建:==========
            if (oOBJECT || oEMBED) {
                if (isIE){
                    LODOP = oOBJECT;
                }else{
                    LODOP = oEMBED;
                }
            } else if (!CreatedOKLodop7766) {
                LODOP = document.createElement("object");
                LODOP.setAttribute("width", 0);
                LODOP.setAttribute("height", 0);
                LODOP.setAttribute("style", "position:absolute;left:0px;top:-100px;width:0px;height:0px;");
                if (isIE){
                    LODOP.setAttribute("classid", "clsid:2105C259-1E0C-4534-8141-A753534CB4CA");
                }else{
                    LODOP.setAttribute("type", "application/x-print-lodop");
                }
                document.documentElement.appendChild(LODOP);
                CreatedOKLodop7766 = LODOP;
            } else {
                LODOP = CreatedOKLodop7766;
            }
            //=====Lodop插件未安装时提示下载地址:==========
            if ((!LODOP) || (!LODOP.VERSION)) {
                if (ua.indexOf('Chrome') >= 0)
                    // document.body.innerHTML = strHtmChrome + document.body.innerHTML;
                    _this.$msgTip.info(_this,{info:strHtmChrome,time:0})
                if (ua.indexOf('Firefox') >= 0){
                    // document.body.innerHTML = strHtmFireFox + document.body.innerHTML;
                    _this.$msgTip.info(_this,{info:strHtmFireFox,time:0})
                }
                // document.body.innerHTML = (is64IE ? strHtm64_Install : strHtmInstall) + document.body.innerHTML;
                _this.$msgTip.info(_this,{info:(is64IE ? strHtm64_Install : strHtmInstall),time:0})
                return LODOP;
            }
        }
        if (LODOP.VERSION < "6.2.2.6") {
            if (!needCLodop()){
                // document.body.innerHTML = (is64IE ? strHtm64_Update : strHtmUpdate) + document.body.innerHTML;
                _this.$msgTip.info(_this,{info:(is64IE ? strHtm64_Update : strHtmUpdate),time:0})
            }
            return LODOP;
        }
        //===如下空白位置适合调用统一功能(如注册语句、语言选择等):==
        LODOP.SET_LICENSES("恒生电子股份有限公司", "83420CB7AB0D661978D8D05CE036EE47", "恒生电子股份有限公司", "874320063B3CDFDA3958BAEBFBDD1F01");
        LODOP.SET_LICENSES("THIRD LICENSE", "", "The Hang Seng electronic Limited by Share Ltd", "DE03BB4DFEDCD52C434BC881DEAFBC73");
        //=======================================================
        return LODOP;
    } catch (err) {
        alert("getLodop出错:" + err);
    }
}

/**
 * 打印html 超文本内容
 * @param LODOP  控制
 * @param htm   内容
 * @param printName  打印名称
 * @param others  其他内容
 * @returns
 */
function printHtm(_this, htm, printName, others, printStyles=styles){
  let LODOP =  getLodop(null,null,_this);
	LODOP.PRINT_INIT(printName);
 	LODOP.SET_PRINT_PAGESIZE(1, 0, 0,"");
 	if(others === 1){
 	    for(var i = 0; i < htm.length; i++){
 	        LODOP.NewPage();
 	        LODOP.ADD_PRINT_HTM(50,0, 0,"BottomMargin:10mm", printStyles + htm[i]);
 	        LODOP.ADD_PRINT_HTM("280mm","96mm", 0,"BottomMargin:2mm","<span tdata='pageNo' format='#' style='font-size:12px;'>第#页</span>");
 	    }
 	} else {
 	   LODOP.ADD_PRINT_HTM(20,0, 0,"BottomMargin:10mm",printStyles + htm);
 	}
 	LODOP.SET_PRINT_MODE("AUTO_CLOSE_PREWINDOW", 1);// 打印后自动关闭预览窗口
 	// if(getPdfPrintName(LODOP)){
    //    LODOP.PRINT();
    // }
 	LODOP.PREVIEW();// 打印预览
 	return "finish";
}


function printListHtm( _this,headHtml, bodyHtml, options, footerHtml, printStyles=styles) {
    options = options || { bodyTop: "27%", bodyLeft:"1%", bodyWidth:"99%", bodyHeight:"75%" };
    let LODOP =  getLodop(null,null,_this);
    if (LODOP) {
      LODOP.PRINT_INIT("");
      LODOP.SET_PRINT_PAGESIZE(2, 0, 0, "清单打印");
      var strStyle = "<style> table,td,th {border-width: 1px;border-style: solid;border-color:#cccccc;border-collapse: collapse}</style>";
      LODOP.ADD_PRINT_TABLE(options.bodyTop, options.bodyLeft, options.bodyWidth, options.bodyHeight, printStyles + bodyHtml);// 添加表格打印,能自动实现分页
      LODOP.SET_PRINT_STYLEA(0, "Vorient", 3);

      LODOP.ADD_PRINT_HTM('1%', "6%", "90%", "20%", printStyles + headHtml);
      LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
      LODOP.SET_PRINT_STYLEA(0, "LinkedItem", 1);

      if (!!footerHtml) {
        LODOP.ADD_PRINT_HTM(20, "6%", "90%", "5%", printStyles + footerHtml);
        LODOP.SET_PRINT_STYLEA(0, "ItemType", 0);
        LODOP.SET_PRINT_STYLEA(0, "LinkedItem", 1);
      }

      LODOP.SET_PRINT_MODE("FULL_WIDTH_FOR_OVERFLOW",true);//设置宽度方向上的内容溢出自动缩小
      LODOP.SET_SHOW_MODE("LANDSCAPE_DEFROTATED", 1);
      LODOP.SET_PRINT_MODE("AUTO_CLOSE_PREWINDOW", 1);// 打印后自动关闭预览窗口
      //  if(getPdfPrintName(LODOP)){
      //     LODOP.PRINT();
      //  }
      var i = LODOP.PREVIEW();// 获取打印次数
      return i;
    }
};


function printDataHandler(LODOP, printTemplateList, printDataList,_this,options) {
    options = options || {};
    if (!printDataList) {
        _this.$msgTip.info(_this, { info: "获取打印数据失败" });
    }
    if (!printTemplateList) {
        _this.$msgTip.info(_this, { info: "没有可用打印模板" });
    }
    let fieldMap = {};
    let dataSize = printDataList.length;
    let templateSize = printTemplateList.length;
    let taskNum = templateSize;// 多少个模板就有多少个打印任务
    let printNum = 1;
    let currentTask = 0;
    let isPrint = 0;   //记录是否打印
    for (let j = 0; j < dataSize; j++) {
        let rowData = printDataList[j];
        for (let key in rowData) {
            fieldMap[key] = rowData[key];
            if (key === "sumCommitFee") {
              let sumCommitFee = rowData[key];
              if (null !== sumCommitFee || '' !== sumCommitFee || undefined !== sumCommitFee) {
                fieldMap["sumCommitFee"] = formatNumber(sumCommitFee, 2, ',');
              }
            }
            if (key === "billMoney") {
                let billMoney = rowData[key];
                fieldMap["billMoney"] = formatNumber(billMoney, 2, ',');
            }
            if(key === "flowNo"){
                let flowNo = rowData[key];
                if(!!flowNo) {
                  let fs = flowNo.toString().split(",");
                  fieldMap["flowNo"]=fs[0];
                }
            }
        }
        if(options.seal){
          fieldMap['seal'] = options.seal;
          fieldMap['sealPrint'] = options.sealPrint;
        }
        if (1 == templateSize) {
            currentTask++;
            isPrint = vouchPrint(_this, LODOP, dataSize, currentTask, printTemplateList[0].tempContent, fieldMap, false,0,options.recordInfo,options.billInfo);// excute the print task
            printNum++;
        } else {
            if(dataSize > 1){　//打印多张 数据与模板同步
              currentTask++;
              isPrint = vouchPrint(_this, LODOP, dataSize, currentTask, printTemplateList[j].tempContent,fieldMap,0, false,options.recordInfo,options.billInfo);
              printNum++;
            }else{
                let imgs = []; // 存放背景图
                let  recordInfo = options.recordInfo;
                if(recordInfo && templateSize == recordInfo.length){// 必须同界
                    imgs = recordInfo;
                }
                for (let i = 0; i < templateSize; i++) {
                    recordInfo = imgs[i];
                    currentTask++;
                    let k = printNum % templateSize;
                    if (k > 0) {
                      isPrint = vouchPrint(_this, LODOP, taskNum, currentTask, printTemplateList[k - 1].tempContent, fieldMap,0, false,options.recordInfo,options.billInfo);//执行打印任务
                    } else {
                      isPrint = vouchPrint(_this, LODOP, taskNum, currentTask, printTemplateList[templateSize - 1].tempContent,fieldMap,0, false,options.recordInfo,options.billInfo);//执行打印任务
                    }
                    printNum++;
                }
            }

        }
        fieldMap = {};
    }
    return isPrint;
}

/**
 * 有凭证套打,支持连续打,需查询模板
 *
 * @param LODOP
 *            打印对象函数
 * @param printTaskNum
 *            打印总任务数
 * @param currentTaskNum
 *            当前任务数 初始值为:1
 * @param templateInfo
 *            模板内容
 * @param fieldMap打印内容,为new
 *            Object()对象,存储成键值对
 * @param isUpdateMessage
 *            是否更改打印内容true,可更改;false,不可更改 return 不可更改时,返回打印次数
 * @param intOrient
 *            是否横向打印1为是，其他为否
 */
function vouchPrint(_this, LODOP, printTaskNum, currentTaskNum, templateInfo, fieldMap, isUpdateMessage, intOrient,recordInfo,billInfo) {
  if(!!templateInfo) {
    var initInfoLocation = templateInfo.indexOf(";");// 模板信息初始化位置;
    var templateLength = templateInfo.length;// 模板信息长度;
    if (currentTaskNum == 1) {
      var templateInit = templateInfo.substring(0, initInfoLocation + 1);// 模板初始信息
      eval(templateInit);// 执行模板初始信息,在连续打印时初始化模板只能执行一次,不能在循环体内多次执行
    }
    LODOP.NewPage();// 连打时进行强制分页
    var templateBody = templateInfo.substring(initInfoLocation + 1,
      templateLength);// 模板体信息,必须放入循环体内，否则不支持连打内容变更
    for (var key in fieldMap) {
      var value = fieldMap[key];
      if (value == null || "undefined" == typeof (value)) {
        value = "";
      }
      var temp = templateBody.replace(new RegExp(key, "gm"), value);// 取得打印值
      templateBody = temp;
    }
    if(templateBody.indexOf("recordInfo") > 0){
      var ay = templateBody.substring(templateBody.lastIndexOf("(",templateBody.indexOf("recordInfo")),templateBody.indexOf("recordInfo")-2);
      templateBody = templateBody.replace("recordInfo","");
//    	console.log(templateBody)
      var arr = ay.split(",")
      LODOP.ADD_PRINT_HTM((arr[0]).replace(/[^0-9]/ig,""),arr[1], 0,"BottomMargin:10mm",recordInfo);
    }
    var arry = [];
    if(templateBody.indexOf("billList") > 0){
      var axy = templateBody.substring(templateBody.lastIndexOf("(",templateBody.indexOf("billList")),templateBody.indexOf("billList")-2);
      templateBody = templateBody.replace("billList","");
//        	console.log(templateBody)
      arry = axy.split(",");
      if (!!billInfo) {
        billInfo = (billInfo instanceof Array) ? billInfo : [billInfo];
        LODOP.ADD_PRINT_HTM((arry[0]).replace(/[^0-9]/ig,""),arry[1], "RightMargin:5mm",arry[3].replace(/"/ig,""),styles+billInfo[0]);
        let offset2TopIndex = templateBody.indexOf("Offset2Top",templateBody.indexOf("billList"));
        if (offset2TopIndex !== -1) {
          let offset2Top = templateBody.substring(offset2TopIndex,templateBody.indexOf(")",templateBody.indexOf("Offset2Top"))).split(",");
          LODOP.SET_PRINT_STYLEA(0,"Offset2Top",offset2Top[1].replace(/"/ig,""));
        }
      }
    }
    eval(templateBody);// 执行打印内容
    if (printTaskNum == currentTaskNum) {
      var seal = fieldMap["seal"];
      if(seal!="" && seal!=null && seal.length > 10){
        var xywh = fieldMap['sealPrint'];
        var x=500,y=460,w=500,h=200;
        if(xywh && xywh.length ==4){
          x = xywh[0];
          y = xywh[1];
          w = xywh[2];
          h = xywh[3];
        }
        LODOP.ADD_PRINT_IMAGE(x,y,w,h,"<img border='0' src=\"data:image/jpg;base64,"+fieldMap["seal"]+"\"/>");
      }
      if (1 == intOrient) {
        LODOP.SET_PRINT_PAGESIZE(2, -1, -1, "333");
        LODOP.SET_SHOW_MODE("LANDSCAPE_DEFROTATED", 1);
      }
      LODOP.SET_PREVIEW_WINDOW(1, 0, 0, 0, 0, "");// 设置预览窗口
      LODOP.SET_PRINT_MODE("FULL_WIDTH_FOR_OVERFLOW",true);//设置宽度方向上的内容溢出自动缩小
      LODOP.SET_PRINT_MODE("AUTO_CLOSE_PREWINDOW", 1);// 打印后自动关闭预览窗口
      LODOP.SET_PRINT_MODE("PRINT_START_PAGE", 1);// 默认从1开始打印
      LODOP.SET_PRINT_MODE("PRINT_END_PAGE", printTaskNum);// 打印到最后页,设置后支持选定页打印
      LODOP.SET_SHOW_MODE("HIDE_PBUTTIN_SETUP", 1);// 关闭打印维护页面中打印按钮
      if(recordInfo && recordInfo.indexOf(".jpg") > -1 ){
        LODOP.ADD_PRINT_SETUP_BKIMG("<img border='0' src='"+recordInfo+"'>");
        LODOP.SET_SHOW_MODE("BKIMG_PRINT",true);
      }
      if(!!billInfo && billInfo.length > 1){
        LODOP.NewPageA();// 连打时进行强制分页
        LODOP.ADD_PRINT_HTM("60",arry[1], "RightMargin:5mm","BottomMargin:10mm",styles+billInfo[1]);
      }
      if (isUpdateMessage) {
        LODOP.PRINT_DESIGN();// 打印设计,实现打印值更改
        return 0;
      } else {
        // if(getPdfPrintName(LODOP)){
        //     LODOP.PRINT();
        // }else{
        var TaskID = LODOP.PREVIEW();// 直接打印预览
        return TaskID;
        // }
      }
    }
  } else {
    _this.$msgTip.info(_this,{ info:"模板内容不能为空！"});
  }
};

function  getPdfPrintName(LODOP){
   var ind =  LODOP.SELECT_PRINTER();
   var printName = LODOP.GET_PRINTER_NAME(ind);
   //GET_PRINTER_NAME(-1) //已选择的默认打印设备
   if(printName.indexOf("PDF")>-1 || printName.indexOf("XPS")>-1){
    return true;
   }else{
    return false;
   }
}
/**
 *
 * @param _this
 * @param options 存在以下属性
 * exitDataFlag   是否自行传值，true：只查询打印模板，打印数据由界面传值；false：查询模板和打印数据
 * vocherData     exitDataFlag为true时，传入的打印数据，数组类型
 */
function vochPrint(_this,options){
    options = options || {};
    let  exitDataFlag = options.exitDataFlag;
    let url = exitDataFlag ? "/banks/jjbank/pe/print/voucherPrint/voucherPrintManger/queryVoucher" : "/banks/jjbank/pe/print/voucherPrint/voucherPrintManger/printVoucher";
    url = exitDataFlag == 'makeUp' ? "/pe/print/voucherPrint/voucherPrintManger/mutilVocherPrint" : url;
    let lodop = getLodop(null,null,_this);
    let isPrint = 0;
    post(options.params, url).then(res => {
        if (res) {
        let return_code = res.data.retCode;
        if (return_code === "000000") {
            let template = [];
            let datalist = [];
            if (exitDataFlag == true) {
              datalist = options.params.vocherData;
              template.push(res.data.retData)
            } else if(exitDataFlag == "makeUp"){//补打
              template = res.data.retData;
              for(let vh in options.params.vocherData){
                console.log(options.params.vocherData[vh].printObj);
                debugger;
                datalist.push(eval("("+options.params.vocherData[vh].printObj+")"));
              }
            }else{
              datalist.push(eval("("+res.data.retData.printObj+")"));
              template.push(res.data.retData.template);
            }
           if(options.hasSeal){
              sealImg(lodop,template,datalist,_this,options,isPrint);
           }else{
              if(lodop){
                isPrint = printDataHandler(lodop,template,datalist,_this,options);
                if (!!lodop.CVERSION) {
                  lodop.On_Return = function(isPrint,Value){
                    if (Value === "1") {
                      options.callback();
                    }else {
                      options.closeCallback();
                    }
                  };
                } else {
                  if (isPrint !== 0) {
                    // _this.$msgTip.success(_this);
                    options.callback();
                  }else {
                    options.closeCallback();
                  }
                }
              }
            }
        }else{
            _this.$msgTip.error(_this,{info: res.data.retMsg});
            options.errorCallback();
        }
        }else{
            _this.$msgTip.error(_this,{info:_this.$t("m.i.common.netError")});
        }
    })
}

function sealImg(lodop,template,datalist,_this,options,isPrint){
  post({}, "/pe/print/sealImgr/sealImgrManger/querySealImgr").then(res => {
      if (res) {
        let return_code = res.data.retCode;
        if (return_code === "000000") {
          options.seal = res.data.retData.sealData1;
          options.sealPrint  = res.data.retData.sealPrint;
            if(lodop){
              isPrint = printDataHandler(lodop,template,datalist,_this,options);
              if (!!lodop.CVERSION) {
                lodop.On_Return = function(isPrint,Value){
                  if (Value === "1") {
                    options.callback();
                  }
                };
              } else {
                if (isPrint !== 0) {
                  // _this.$msgTip.success(_this);
                  options.callback();
                }
              }
            }
        }else{
            _this.$msgTip.error(_this,{info: res.data.retMsg});
            options.errorCallback();
        }
      }else{
            _this.$msgTip.error(_this,{info:_this.$t("m.i.common.netError")});
      }
  });
}

/**
 *
 * @param _this
 * @param options 存在以下属性
 * exitDataFlag   是否自行传值，true：只查询打印模板，打印数据由界面传值；false：查询模板和打印数据
 * vocherData     exitDataFlag为true时，传入的打印数据，数组类型
 */
function vochPrintWithVoucherType(_this,options){
  options = options || {};
  let  exitDataFlag = options.exitDataFlag;
  let url = exitDataFlag ? "/pe/print/voucherPrint/voucherPrintManger/queryVoucher" : "/pe/print/voucherPrint/voucherPrintManger/printVoucher";
  url = exitDataFlag == 'makeUp' ? "/pe/print/voucherPrint/voucherPrintManger/mutilVocherPrint" : url;
  url = exitDataFlag==='cancelAcctPrint' ? "/pe/print/voucherPrint/voucherPrintManger/cancelAcctPrintVoucher":url;   //撤销记账统一冲正打印
  let saveFlag =  options.saveFlag;
  url = exitDataFlag && saveFlag != null && !saveFlag ? "/pe/print/voucherPrint/voucherPrintManger/queryTempConf" : url;
  let lodop = getLodop(null,null,_this);
  let isPrint = 0;
  post(options.params, url).then(res => {
    if (res) {
      let return_code = res.data.retCode;
      if (return_code === "000000") {
        let template = [];
        let datalist = [];
        if (exitDataFlag == true) {
          datalist = options.params.vocherData;
          template.push(res.data.retData)
        } else if(exitDataFlag == "makeUp"||exitDataFlag ==="cancelAcctPrint"){//补打
          template.push(res.data.retData.template);
          if (res.data.retData.printObj instanceof Array) {
            for(let i = 0; i < res.data.retData.printObj.length; i++){
              datalist.push(eval("("+res.data.retData.printObj[i]+")"));
            }
          } else {
            datalist.push(eval("("+res.data.retData.printObj+")"))
          }
        }else{
          for(let i = 0; i < res.data.retData.printObj.length; i++){
            datalist.push(eval("("+res.data.retData.printObj[i]+")"));
          }
          template.push(res.data.retData.template);
        }
        if(options.hasSeal||template[0].isPrintSeal==="1"){
          sealImgWithVoucherType(lodop,template,datalist,_this,options,isPrint,options.voucherType);
        }else{
          if(lodop){
            isPrint = printDataHandler(lodop,template,datalist,_this,options);
            if (!!lodop.CVERSION) {
              lodop.On_Return = function(isPrint,Value){
                if (Value === "1") {
                  options.callback();
                }else {
                  options.closeCallback();
                }
              };
            } else {
              if (isPrint !== 0) {
                // _this.$msgTip.success(_this);
                options.callback();
              }else {
                options.closeCallback();
              }
            }
          }
        }
      }else{
        _this.$msgTip.error(_this,{info: res.data.retMsg});
        options.errorCallback();
      }
    }else{
      _this.$msgTip.error(_this,{info:_this.$t("m.i.common.netError")});
    }
  })
}

function sealImgWithVoucherType(lodop,template,datalist,_this,options,isPrint,voucherType){
  post({ vouType: voucherType }, "/pe/print/sealImgr/sealImgrManger/querySealImgr").then(res => {
    if (res) {
      let return_code = res.data.retCode;
      if (return_code === "000000") {
        options.seal = res.data.retData.sealData1;
        options.sealPrint  = res.data.retData.sealPrint;
        if(lodop){
          isPrint = printDataHandler(lodop,template,datalist,_this,options);
          if (!!lodop.CVERSION) {
            lodop.On_Return = function(isPrint,Value){
              if (Value === "1") {
                options.callback();
              }else {
                options.closeCallback();
              }
            };
          } else {
            if (isPrint !== 0) {
              // _this.$msgTip.success(_this);
              options.callback();
            }else {
              options.closeCallback();
            }
          }
        }
      }else{
        _this.$msgTip.error(_this,{info: res.data.retMsg});
        options.errorCallback();
      }
    }else{
      _this.$msgTip.error(_this,{info:_this.$t("m.i.common.netError")});
    }
  });

}

export {getLodop,printHtm,printListHtm,printDataHandler,vochPrint,vouchPrint, vochPrintWithVoucherType}
