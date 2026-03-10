<template>

  <h-msg-box
    maximize
    v-model="tempBillInfoWin"
    width="1000"
    :height="getHeight"
    @on-close="handleClose"
    class="h-ticket-layer"
    @on-maximize="onMaximize"
    top="10"
    :z-index="1010"
    style="display: none"
  >
    <p slot="header">
      <span>批量打印</span>
    </p>

    <h-tabs :animated="false" :value="billPane" @on-click="clickTabs" ref="closetab">
      <template>
        <h-tab-pane :label="$t('m.i.pc.billFront')" name="billFront">
          <div v-for="billInfo in this.billInfos">
            <div :class="billInfo.tabPaneClass">
              <component :is="billInfo.billClass+'BillFront'" :billInfo="billInfo"
                         :chineseMoney="billInfo.chineseMoney"
                         :dictMap="billInfo.dictMap" :format4="format4" ref="billsFront"></component>
            </div>
          </div>
        </h-tab-pane>
      </template>
      <!-- 场外背书-->
      <h-tab-pane :label="$t('m.i.pc.outEndo')" name="outEndo" :class="this.tabPaneClass">
        <div v-for="(endoParams,index) in endosParams" :class="endoParams.tabPaneClass">
          <keep-alive>
            <component
              :is="'OutEndos'"
              :endoParams="endoParams"
              :endoInfo="endoInfos[index]"
              ref="outEndo"
              :dictMap="endoParams.dictMap"
            ></component>
          </keep-alive>
        </div>
      </h-tab-pane>
    </h-tabs>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{ $t("m.i.common.close") }}</h-button>
      <h-button type="primary" v-if="billPane === 'billFront'" @click="billFrontPrint">
        {{ $t("m.i.pc.billFrontPrint") }}
      </h-button>
      <h-button type="primary" v-else-if="billPane === 'outEndo'" @click="outEndoPrint">
        {{ $t("m.i.pc.outEndoPrint") }}
      </h-button>
    </div>
  </h-msg-box>
</template>
<script>
  import {post, getParamValuesByKeys} from "@/api/bizApi/commonUtil";
  import { printListsHtm,printListsHtmVertical }from '@/utils/print/qsBankLodopFuncs.js';

  export default {
    name: "billInfosMain",
    data() {
      return {
        queryAnswer: "",
        dictMap: new Map(),
        billInfo: {},
        billInfos: [],
        rmap: [],
        outEndoInfoMap: [],
        inEndoInfoMap: [],
        chineseMoney: {},
        bulkPrint: false,
        blueClass: "h-ticket h-t_blue",
        greenClass: "h-ticket h-t_green",
        pinkClass: "h-ticket h-t_pink",
        orangeClass: "h-ticket h-t_orange",
        blankClass: "h-ticket",
        tabPaneClass: "",
        tabPaneBlankClass: "",
        billClass: "ME01",
        billType: "AC01",
        billPane: "",
        endosParams: [],
        endoParams: {},
        endoInfo: [],
        endoInfos:[],
        indosParams: [],
        indoParams: {},
        indoInfo: {},
        indoInfos:[],
        showInqrep: false,
        showInqrepUpsb: false,
        //虚拟打印机名称
        printerName: "Microsoft Print to PDF",
        //生成pdf下拉框是否展示
        dropdownVisible: false,
        //生成pdf下拉框数据源
        dropdownItemProps: [{label: this.$t('m.i.pc.billFront'), name: 'billFront'}, {
          label: this.$t('m.i.pc.outEndo'),
          name: 'outEndo'
        }, {label: this.$t('m.i.pc.inEndo'), name: 'inEndo'}],
        tempDropdownItemProps: null,
        //打印按钮是否可用
        printPdfDisabled: true,
        timeout: null,
        printStyles: '<style type="text/css">' +
          'body, h1, h2, h3, h4, h5, h6, hr, p, ul, ol, li, div, textarea, th, td { margin: 0; padding: 0;}' +
          'body {font-family: "Microsoft YaHei", "\\5FAE\\8F6F\\96C5\\9ED1", Arial, sans-serif, "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\\5FAE\\8F6F\\96C5\\9ED1", Arial, sans-serif;font-size: 12px;color: #333333;line-height: 1.5;background-color: #fff;-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;}' +
          'html,body{height: 100%;}' +
          'h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6 {margin-bottom: 0.5rem;font-weight: 500;line-height: 1.1;color: inherit;}' +
          'i, em {font-style: normal;}' +
          'ul, ol {list-style: none;}' +
          ':focus {outline: 0;}' +
          '.clearfix {zoom:1; /* IE < 8 */}' +
          '.clearfix:before,.clearfix:after {content:""; display:table;}' +
          '.clearfix:after {clear:both;}' +
          '* {box-sizing: border-box;-webkit-box-sizing: border-box;box-sizing: border-box;-webkit-tap-highlight-color: rgba(0, 0, 0, 0);}' +
          '.h-ticket {background-repeat:  no-repeat;min-height: 100%; width: 100%;padding-bottom: 30px;}' +
          '.space {padding: 10px 50px 30px 50px;}' +
          '.h-t_blue {background-color: #e9f3fb;}' +
          '.h-t_green {background-color: #f3fff3; }' +
          '.h-t_pink {background-image: url("src/assets/ticket_bg1.png");}' +
          '.h-t_orange {background-image: url("src/assets/ticket_bg2.png");}' +
          '.h-ticket-title {font-size: 20px;font-weight: bold;text-align: center;padding: 5px 0 15px 0;}' +
          '.h-ticket-table {margin: 0 20px;border: 1px solid #666666;}' +
          '.h-ticket-table table {border-collapse: collapse;border-spacing: 0;width: 100%;}' +
          'td {border: 1px solid #666666;height: 40px;padding: 0 7px;color: #000000;}' +
          '.th {text-align: right;color: #333333;}' +
          '.tac {text-align: center;}' +
          '.h-bigMoney-num {font-size: 14px;line-height: 35px;}' +
          '.h-money-cell {height: 59px;padding: 0;}' +
          '.h-money-unit {height: 26px;border-bottom: 1px solid #666666;}' +
          '.h-money-unit em {width: 8.3%;height: 26px;text-align: center;line-height: 26px;border-right: 1px solid #666666;color: #666666;float: left;}' +
          '.h-money-unit .h-last {border-right: none;}' +
          '.h-money-num span {width: 8.3%;height: 33px;text-align: center;line-height: 33px;border-right: 1px solid #666666;float: left;font-size: 16px;}' +
          '.h-money-num .h-last {border-right: none;}' +
          '.h-fs14 {font-size: 14px;font-weight: bold;}' +
          '.h-btw2 {border-top: 2px solid #666666;}' +
          '.h-ticket-info {margin: -5px 20px 10px 20px;}' +
          '.h-ticket-info li {float: left;width: 50%;margin-bottom: 5px;}' +
          '.h-bz-l {float: left;width: 40%;}' +
          '.h-bz-c {float: left;width: 30%;}' +
          '.h-bz-r {float: right;width: 130px;}' +
          '.h-pj-l {float: left;width: 50%;}' +
          '.h-pj-c {float: left;width: 25%;}' +
          '.h-pj-r {float: right;width: 25%;}' +
          '.h-ticket-dq {float: right;margin-right: 10px;color: #000000;}' +
          '.h-c6 {color: #666666;}' +
          '.h-t_date{margin: 16px 20px 0 20px;}' +
          '.h-t_logo{margin: 12px 0 0 20px;}' +
          '.h-row {position: relative; margin-left: 0;margin-right: 0;height: auto;zoom: 1;display: block; }' +
          '.h-col {position: relative;display: block; }' +
          '.h-col-span-1, .h-col-span-2, .h-col-span-3, .h-col-span-4, .h-col-span-5, .h-col-span-6, .h-col-span-7, .h-col-span-8, .h-col-span-9, .h-col-span-10, .h-col-span-11, .h-col-span-12, .h-col-span-13, .h-col-span-14, .h-col-span-15, .h-col-span-16, .h-col-span-17, .h-col-span-18, .h-col-span-19, .h-col-span-20, .h-col-span-21, .h-col-span-22, .h-col-span-23, .h-col-span-24 {float: left;flex: 0 0 auto; }' +
          '.h-col-span-3 {display: block;width: 12.5%; }.h-col-span-21 {display: block;width: 87.5%; }</style>',
      };
    },
    components: {},

    computed: {
      tempBillInfoWin: {
        get() {
          return this.showBillInfoWin;
        },
        set() {
        }
      },
      getHeight() {
        return window.innerHeight - 130;
      }
    },
    props: {
      //页面是否展示
      showBillInfoWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      billRangeStart: "",
      billRangeEnd: "",
      //登记中心ID
      billIds: {
        type: Array,
        default() {
          return [];
        }
      },
      // showInqrepUpsb:{
      //   type: Boolean,
      //   default: true
      // },
      //票据号码
      billNos: {
        type: Array,
        default() {
          return [];
        }
      },
      billRangeStarts: {
        type: Array,
        default() {
          return [];
        }
      },
      billRangeEnds: {
        type: Array,
        default() {
          return [];
        }
      },
      bulkPrintBillFlag: {
        type: Boolean,
        default() {
          return false;
        }
      },
      bulkPrintOutEndoFlag: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    watch: {
      showBillInfoWin(val) {
        if (val) {
          //页面打开
          this.showInqrepUpsb = true;

          getParamValuesByKeys("printer_name_to_pdf").then(res => {
            this.printerName = !!res["printer_name_to_pdf"] ? res["printer_name_to_pdf"] : this.printerName;
          });
          this.tempDropdownItemProps = this.deepClone(this.dropdownItemProps);
          this.printPdfDisabled = true;
        } else {
          this.showInqrepUpsb = false;
          if (this.$refs.transHis && this.$refs.transHis.$refs.transFormDatagrid != null) {
            this.$refs.transHis.$refs.transFormDatagrid.tData = [];
            this.$refs.transHis.$refs.transFormDatagrid.total = 0;
          }
          if (this.$refs.imgQuery && this.$refs.imgQuery.$refs.imgDatagrid != null) {
            this.$refs.imgQuery.$refs.imgDatagrid.tData = [];
            this.$refs.imgQuery.$refs.imgDatagrid.total = 0;
          }
        }
      },
      dropdownVisible(val) {
        if (!val) {
          this.tempDropdownItemProps = this.deepClone(this.dropdownItemProps);
          this.printPdfDisabled = true;
        }
      },
      endoInfos(newValue, oldValue) {
        this.$nextTick(() => {
          if(this.bulkPrintOutEndoFlag){
            this.outEndoPrint();
          }

        });
      }
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          if (this.$refs.transHis && this.$refs.transHis.$refs.transFormDatagrid != null) {
            this.$refs.transHis.$refs.transFormDatagrid.$refs.gridContent.handleResize();
          }
          if (this.$refs.inqrepUpbs && this.$refs.inqrepUpbs.$refs.sendQueryDatagrid != null && this.$refs.inqrepUpbs.$refs.recvQueryDatagrid != null) {
            this.$refs.inqrepUpbs.$refs.sendQueryDatagrid.$refs.gridContent.handleResize();
            this.$refs.inqrepUpbs.$refs.recvQueryDatagrid.$refs.gridContent.handleResize();
          }
          if (this.$refs.imgQuery && this.$refs.imgQuery.$refs.imgDatagrid != null) {
            this.$refs.imgQuery.$refs.imgDatagrid.$refs.gridContent.handleResize();
          }
        }, 100);
      },
      //关闭页面处理
      handleClose() {
        this.billInfos = [];
        this.billRangeStarts = [];
        this.billRangeEnds = [];
        this.endosParams = [];
        this.indosParams = [];
        this.outEndoInfoMap = [];
        this.inEndoInfoMap = [];
        this.bulkPrint = false;
        this.$emit("billInfosWinClose", "");
      },
      //初始化页面
      init() {
        this.billPane = "billFront";
        //获取票面信息
        let data = {};
        let url = "";
        if (this.billIds) {
          data = { billIdList: this.billIds,billReserve1:this.billRangeStarts,billReserve2:this.billRangeEnds};
          url = "/pc/btrc/common/getBillInfoByIds";

        } else if (this.billNos) {
          data = { billIdList: this.billNos,billReserve1:this.billRangeStarts,billReserve2:this.billRangeEnds};
          url = "/pc/btrc/common/getBillInfoByIds";
        } else {
          this.$msgTip.error(this, {info: "无法获取票据号码或者登记中心ID"});
          this.handleClose();
          return;
        }
        post(data, url).then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              // for 组装每张票
              this.billInfos = res.data.retData;
              if (this.billInfos) {
                for (let i = 0; i < this.billInfos.length; i++) {
                  //电票正面
                  this.changeBillClass(this.billInfos[i], this.billInfos[i].billClass, this.billInfos[i].billType);
                  // if ( i%2==0)this.billInfos[i].tabPaneClass = this.orangeClass
                  this.billInfos[i].chineseMoney = {};
                  this.billInfos[i].chineseMoney.bigMoney = this.arabia_To_SimplifiedChinese(this.billInfos[i].billMoney);
                  this.billInfos[i].chineseMoney.smallMoney = this.arabia_To_Char(this.billInfos[i].billMoney)
                  this.billInfos[i].dictMap = this.dictMap;

                  //场外背书
                  let endoParams = {
                    billNo: this.billInfos[i].billNo,
                    billRangeStart: this.billInfos[i].billRangeStart,
                    billRangeEnd: this.billInfos[i].billRangeEnd,
                    billClass: this.billInfos[i].billClass,
                    billType: this.billInfos[i].billType,
                    tabPaneClass: this.billInfos[i].tabPaneClass,
                    dictMap: this.dictMap
                  };
                  this.endosParams.push(endoParams)

                }
                if(this.bulkPrintOutEndoFlag){
                  console.log('this.bulkPrintOutEndoFlag:'+this.bulkPrintOutEndoFlag);
                  this.getOtherInfo();
                }
              } else {
                this.$msgTip.error(this, {info: "无法找到票据信息"});
                this.handleClose();
              }
            } else {
              this.$msgTip.error(this, {info: msg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
          //批量打印
          this.bulkPrint = true;
        });

      },
      //改变样式
      changeClass(billClass, billType) {
        if (billType === "AC01") {
          //银票
          this.tabPaneClass = this.pinkClass;
        } else {
          //商票
          this.tabPaneClass = this.orangeClass;
        }
        this.tabPaneBlankClass = this.blankClass;
      },

      //批量时改变单张电票样式
      changeBillClass(bill, billClass, billType) {
        if (billType === "AC01") {
          //银票
          bill.tabPaneClass = this.pinkClass;
        } else {
          //商票
          bill.tabPaneClass = this.orangeClass;
        }
        bill.tabPaneBlankClass = this.blankClass;
      },

      //金额转成大写中文金额
      arabia_To_SimplifiedChinese(money) {
        if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(money)) {
          return "数据非法";
        }
        let unit = "仟佰拾亿仟佰拾万仟佰拾元角分",
          str = "";
        money += "00";
        let p = money.indexOf(".");
        if (p >= 0) {
          money = money.substring(0, p) + money.substr(p + 1, 2);
        }
        unit = unit.substr(unit.length - money.length);
        for (let i = 0; i < money.length; i++) {
          str += "零壹贰叁肆伍陆柒捌玖".charAt(money.charAt(i)) + unit.charAt(i);
        }
        return str
          .replace(/零([仟佰拾角])/g, "零")
          .replace(/(零)+/g, "零")
          .replace(/零([万亿元])/g, "$1")
          .replace(/(亿)万/g, "$1")
          .replace(/^元零?|零分/g, "")
          .replace(/元$/g, "元整");
      },
      //金额单位字符分割
      arabia_To_Char(money) {
        let smallMoney = [];
        let part = String(money).split(".");
        if (part.length > 1) {
          if (part[1].length === 2) {
            smallMoney.push(part[1].charAt(1));
            smallMoney.push(part[1].charAt(0));
          } else {
            smallMoney.push("0");
            smallMoney.push(part[1].charAt(0));
          }
        } else {
          smallMoney.push("0");
          smallMoney.push("0");
        }
        for (let i = part[0].length - 1; i > part[0].length - 15; i--) {
          let perchar = part[0].charAt(i);
          if (-1 === i) {
            smallMoney.push("￥");
          } else if (-1 > i) {
            smallMoney.push("");
          } else {
            smallMoney.push(perchar);
          }
        }
        return smallMoney;
      },
      //每4位分割
      format4(val) {
        if (!val) {
          return "";
        }
        let part = val.split("");
        let formatVal = "";
        for (let i = part.length - 1, j = 0; i >= 0; i--, j++) {
          if (j % 4 === 0 && j !== 0) {
            formatVal = part[i] + " " + formatVal;
          } else {
            formatVal = part[i] + formatVal;
          }
        }
        return formatVal;
      },
      //table点击切换事件
      clickTabs(name) {
        this.billPane = name;
        //获取交易历史信息
        if (name === "transHis") {
          this.$refs.transHis.handleSearch(this.billInfo.id);
        }
        //获取影像信息
        if (name === "imgQuery") {
          if (typeof this.$refs.imgQuery !== "undefined") {
            this.$refs.imgQuery.handleSearch();
          }
        }
        if (name === 'inqrepUpbs') {
          if (this.showInqrepUpsb) {
            this.$refs.inqrepUpbs.handleSearch(this.billInfo.billNo);
            this.showInqrepUpsb = false;
          }
        }
      },
      //获取背书信息中的场内场外背书
      divisionEndoInfo(data) {
        if (data && data.length > 0) {
          let length = data.length;
          let outEndoInfoMap = [];
          let inEndoInfoMap = [];
          for (let i = 0; i < length; i++) {
            let part = data[i];
            if (part.inOutFlag === "2") {
              //场内背书
              inEndoInfoMap.push(part);
            } else {
              //场外背书
              outEndoInfoMap.push(part);
            }
          }
          this.outEndoInfoMap = outEndoInfoMap;
          this.inEndoInfoMap = inEndoInfoMap;
        }

      },
      formatDate(value) {
        if (this.endoParams.billClass === "ME01") {
          return this.formatDateFun(value, "YYYY / MM / DD");
        } else {
          return this.formatDateFun(value, "YYYY-MM-DD");
        }
      },
      formatDateFun(value, format) {
        return value ? this.$moment(value, format).format(format) : "";
      },
      /*creatEndo(endoInfoMap) {
        console.log(endoInfoMap);
        let isRecourse = false;
        endoInfoMap.forEach((endo,index)=>{
          let tBodyInfo = {};
          let tColumn = [];
          console.log('endo.endorType:'+endo.endorType);
          if (endo.endorType === "ET01") {
            tBodyInfo.tHead = "承兑背书";
            tColumn.push({ tHead: "承兑日期", tText: this.formatDate(endo.signDt) });
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET18") {
            tBodyInfo.tHead = "权属初始登记背书";
            tColumn.push(
              { tHead: "权属登记日期", tText: this.formatDate(endo.applDt) },
              { tHead: "登记机构代码", tText: endo.transFromBrchCode },
              { tHead: "登记机构名称", tText: endo.transFromBrchName },
              { tHead: "备注", tText: endo.transFromRemark }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          }else if (endo.endorType === "ET02") {
            tBodyInfo.tHead = "保证";
            tColumn.push(
              { tHead: "保证日期", tText: this.formatDate(endo.signDt) },
              { tHead: "被保证人名称", tText: endo.transFromName },
              { tHead: "被保证人账号", tText: endo.transFromAcctNo },
              { tHead: "被保证人开户行行号", tText: endo.transFromBankNo },
              { tHead: "被保证人统一社会信用代码", tText: endo.transFromSocCode },
              { tHead: "被保证人备注", tText: endo.transFromRemark },
              { tHead: "保证人名称", tText: endo.transToName },
              { tHead: "保证人账号", tText: endo.transToAcctNo },
              { tHead: "保证人开户行行号", tText: endo.transToBankNo },
              { tHead: "保证人统一社会信用代码", tText: endo.transToSocCode },
              { tHead: "保证人地址", tText: endo.otherInfo },
              { tHead: "保证人备注", tText: endo.transToRemark }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET05") {
            if(endo.transToAcctNo === "0"){
              tBodyInfo.tHead = "买断式贴现背书";
            }else {
              tBodyInfo.tHead = "转让背书";
            }
            tColumn.push(
              { tHead: "背书人名称", tText: endo.transFromName },
              { tHead: "被背书人名称", tText: endo.transToName },
              {
                tHead: this.$t("m.i.billInfo.banEndrsmtMark"),
                tText: this.format("BanEndorsementMarkCode", endo.banEndrsmtMark)
              },
              { tHead: "背书日期", tText: this.formatDate(endo.signDt) }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET02") {
            tBodyInfo.tHead = "保证";
            tColumn.push(
              { tHead: "被保证人名称", tText: endo.transFromName },
              { tHead: "保证人名称", tText: endo.transToName },
              { tHead: "保证人地址", tText: endo.otherInfo },
              { tHead: "保证日期", tText: this.formatDate(endo.signDt) }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET03") {
            tBodyInfo.tHead = "质押背书";
            tColumn.push(
              { tHead: "出质人名称", tText: endo.transFromName },
              { tHead: "质权人名称", tText: endo.transToName },
              { tHead: "出质日期", tText: this.formatDate(endo.signDt) }
            );
            if (!!endo.unimpawnDt) {
              tColumn.push({ tHead: this.$t("m.i.common.unImpawnDt"), tText: this.formatDate(endo.unimpawnDt) });
            }
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          }  else if (endo.endorType === "ET04") {
            tBodyInfo.tHead = "解质押背书";
            tColumn.push(
              { tHead: "出质人名称", tText: endo.transToName },
              { tHead: "质权人名称", tText: endo.transFromName },
              { tHead: "出质日期", tText: this.formatDate(endo.signDt) }
            );
            if (!!endo.unimpawnDt) {
              tColumn.push({ tHead: this.$t("m.i.common.unImpawnDt"), tText: this.formatDate(endo.unimpawnDt) });
            }
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          }/!*else if (endo.endorType === "201102") {
            tBodyInfo.tHead = "买断式贴现背书";
            tColumn.push(
              { tHead: "背书人名称", tText: endo.transFromName },
              { tHead: "被背书人名称", tText: endo.transToName },
              {
                tHead: this.$t("m.i.billInfo.banEndrsmtMark"),
                tText: this.format("BanEndorsementMarkCode", endo.banEndrsmtMark)
              },
              { tHead: "背书日期", tText: this.formatDate(endo.signDt) }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } *!/else if (endo.endorType === "ET14") {
            tBodyInfo.tHead = "回购式贴现背书";
            tColumn.push(
              { tHead: "背书人名称", tText: endo.transFromName },
              { tHead: "被背书人名称", tText: endo.transToName },
              { tHead: "背书日期", tText: this.formatDate(endo.signDt) },
              { tHead: "赎回开放日", tText: this.formatDate(endo.redeemOpenDt) },
              { tHead: "赎回截止日", tText: this.formatDate(endo.redeemDueDt) }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET15") {
            tBodyInfo.tHead = "回购式贴现赎回背书";
            tColumn.push(
              { tHead: "背书人名称", tText: endo.transFromName },
              { tHead: "被背书人名称", tText: endo.transToName },
              {
                tHead: this.$t("m.i.billInfo.banEndrsmtMark"),
                tText: this.format("BanEndorsementMarkCode", endo.banEndrsmtMark)
              },
              { tHead: "背书日期", tText: this.formatDate(endo.signDt) }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET09") {
            tBodyInfo.tHead = "提示付款";
            tColumn.push(
              { tHead: "提示付款人名称", tText: endo.transFromName },
              { tHead: "提示付款日期", tText: this.formatDate(endo.applDt) },
              {
                tHead: "付款或拒付",
                tText: this.format("SignUpMarkCode", endo.signFlag)
              },
              { tHead: "付款或拒付日期", tText: this.formatDate(endo.signDt) },
              { tHead: "拒付理由", tText: this.getRefulseMsg(endo) },
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET10") {
            if (isRecourse) {
              tBodyInfo.tHead = "再追索清偿";
            } else {
              tBodyInfo.tHead = "追索清偿";
              isRecourse = true;
            }
            tColumn.push(
              { tHead: "追索人名称", tText: endo.transFromName },
              { tHead: "清偿人名称", tText: endo.transToName },
              { tHead: "追索日期", tText: this.formatDate(endo.applDt) },
              {
                tHead: "追索类型",
                tText: this.ecdsRecourseTypeFormat(endo.subEndorType)
              },
              { tHead: "清偿日期", tText: this.formatDate(endo.signDt) }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          }
          if(!!endo.tBodyInfo){
            this.rmap.push(endo);
          }
        });
        console.log(this.rmap);
        console.log("表格数据");
        console.log(this.endoInfo);
      },*/
      creatEndo(endoInfoMap) {
        console.log(endoInfoMap);
        let isRecourse = false;
        endoInfoMap.forEach((endo,index)=>{
          let tBodyInfo = {};
          let tColumn = [];
          console.log('endo.endorType:'+endo.endorType);
          if (endo.endorType === "ET05_01") {
            tBodyInfo.tHead = endo.billEndorTypeName;
            tColumn.push(
              {tHead: "背书人名称", tText: endo.transFromName},
              {tHead: "被背书人名称", tText: endo.transToName},
              {tHead: "不得转让标记", tText: this.format("BanEndorsementMarkCode", endo.banEndrsmtMark)},
              {tHead: "背书日期", tText: this.formatDate(endo.signDt)},
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET02") {
            tBodyInfo.tHead = endo.billEndorTypeName;
            tColumn.push(
              {tHead: "被保证人名称", tText: endo.transFromName},
              {tHead: "保证人名称", tText: endo.transToName},
              {tHead: "保证人地址", tText: endo.otherInfo},
              {tHead: "保证日期", tText: this.formatDate(endo.signDt)},
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET03") {
            tBodyInfo.tHead = endo.billEndorTypeName;
            tColumn.push(
              {tHead: "出质人名称", tText: endo.transFromName},
              {tHead: "质权人名称", tText: endo.transToName},
              {tHead: "出质日期", tText: this.formatDate(endo.signDt)},
              {tHead: "质押解除日期", tText: this.formatDate(endo.assBusiInfo1)}
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET05_02") {
            tBodyInfo.tHead = endo.billEndorTypeName;
            tColumn.push(
              {tHead: "背书人名称", tText: endo.transFromName},
              {tHead: "被背书人名称", tText: endo.transToName},
              {tHead: "不得转让标记", tText: this.format("BanEndorsementMarkCode", endo.banEndrsmtMark)},
              {tHead: "背书日期", tText: this.formatDate(endo.signDt)}
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET14") {
            tBodyInfo.tHead = endo.billEndorTypeName;
            tColumn.push(
              {tHead: "背书人名称", tText: endo.transFromName},
              {tHead: "被背书人名称", tText: endo.transToName},
              {tHead: "背书日期", tText: this.formatDate(endo.signDt)},
              {tHead: "赎回开放日", tText: this.formatDate(endo.assBusiInfo1)},
              {tHead: "赎回截止日", tText: this.formatDate(endo.assBusiInfo2)}
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET15") {
            tBodyInfo.tHead = endo.billEndorTypeName;
            tColumn.push(
              {tHead: "背书人名称", tText: endo.transFromName},
              {tHead: "被背书人名称", tText: endo.transToName},
              {tHead: "不得转让标记", tText: this.format("BanEndorsementMarkCode", endo.banEndrsmtMark)},
              {tHead: "背书日期", tText: this.formatDate(endo.signDt)}
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET05_03") {
            tBodyInfo.tHead = endo.billEndorTypeName;
            tColumn.push(
              {tHead: "背书人名称", tText: endo.transFromName},
              {tHead: "被背书人名称", tText: endo.transToName},
              {tHead: "背书日期", tText: this.formatDate(endo.signDt)}
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET19") {
            tBodyInfo.tHead = endo.billEndorTypeName;
            tColumn.push(
              {tHead: "正回购方名称", tText: endo.transFromName},
              {tHead: "逆回购方名称", tText: endo.transToName},
              {tHead: "成交日期", tText: this.formatDate(endo.signDt)}
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET20") {
            tBodyInfo.tHead = endo.billEndorTypeName;
            tColumn.push(
              {tHead: "正回购方名称", tText: endo.transFromName},
              {tHead: "逆回购方名称", tText: endo.transToName},
              {tHead: "赎回日期", tText: this.formatDate(endo.signDt)}
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET13") {
            tBodyInfo.tHead = endo.billEndorTypeName;
            tColumn.push(
              {tHead: "正回购方名称", tText: endo.transFromName},
              {tHead: "逆回购方名称", tText: endo.transToName},
              {tHead: "成交日期", tText: this.formatDate(endo.signDt)}
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET17") {
            tBodyInfo.tHead = endo.billEndorTypeName;
            tColumn.push(
              {tHead: "正回购方名称", tText: endo.transFromName},
              {tHead: "逆回购方名称", tText: endo.transToName},
              {tHead: "赎回日期", tText: this.formatDate(endo.signDt)}
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET05_04") {
            tBodyInfo.tHead = endo.billEndorTypeName;
            tColumn.push(
              {tHead: "背书人名称", tText: endo.transFromName},
              {tHead: "被背书人名称", tText: endo.transToName},
              {tHead: "背书日期", tText: this.formatDate(endo.signDt)}
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET21") {
            tBodyInfo.tHead = endo.billEndorTypeName;
            tColumn.push(
              {tHead: "正回购方名称", tText: endo.transFromName},
              {tHead: "逆回购方名称", tText: endo.transToName},
              {tHead: "成交日期", tText: this.formatDate(endo.signDt)}
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET22") {
            tBodyInfo.tHead = endo.billEndorTypeName;
            tColumn.push(
              {tHead: "正回购方名称", tText: endo.transFromName},
              {tHead: "逆回购方名称", tText: endo.transToName},
              {tHead: "赎回日期", tText: this.formatDate(endo.signDt)}
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET09") {
            tBodyInfo.tHead = endo.billEndorTypeName;
            tColumn.push(
              {tHead: "提示付款人名称", tText: endo.transFromName},
              {tHead: "提示付款日期", tText: this.formatDate(endo.applDt)},
              {
                tHead: "付款或拒付",
                tText: this.format("SignUpMarkCode", endo.signFlag)
              },
              {tHead: "付款或拒付日期", tText: this.formatDate(endo.signDt)},
              {tHead: "拒付理由", tText: this.getRefulseMsg(endo, endo.billOrigin, endo.inOutFlag)},
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET10_01" || endo.endorType === "ET10_02") {
            tBodyInfo.tHead = endo.billEndorTypeName;
            tColumn.push(
              {tHead: "追索人名称", tText: endo.transFromName},
              {tHead: "清偿人名称", tText: endo.transToName},
              {tHead: "追索日期", tText: this.formatDate(endo.applDt)},
              {
                tHead: "追索类型",
                tText: this.recourseTypeFormat(endo.subEndorType)
              },
              {tHead: "清偿日期", tText: this.formatDate(endo.signDt)}
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          }
          if(!!endo.tBodyInfo){
            this.rmap.push(endo);
          }
        });
        console.log(this.rmap);
        console.log("表格数据");
        console.log(this.endoInfo);
      },
      creatIndo(endoInfoMap) {
        endoInfoMap.forEach((endo,index)=>{
          let tBodyInfo = {};
          let tColumn = [];
          if (endo.endorType === "ET01") {
            tBodyInfo.tHead = "承兑背书";
            tColumn.push(
            {tHead: "承兑日期", tText: this.formatDate(endo.signDt) });
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET02") {
            tBodyInfo.tHead = "保证";
            tColumn.push(
              { tHead: "保证日期", tText: this.formatDate(endo.signDt) },
              { tHead: "被保证人名称", tText: endo.transFromName },
              { tHead: "被保证人账号", tText: endo.transFromAcctNo },
              { tHead: "被保证人开户行行号", tText: endo.transFromBankNo },
              { tHead: "被保证人统一社会信用代码", tText: endo.transFromSocCode },
              { tHead: "被保证人备注", tText: endo.transFromRemark },
              { tHead: "保证人名称", tText: endo.transToName },
              { tHead: "保证人账号", tText: endo.transToAcctNo },
              { tHead: "保证人开户行行号", tText: endo.transToBankNo },
              { tHead: "保证人统一社会信用代码", tText: endo.transToSocCode },
              { tHead: "保证人地址", tText: endo.otherInfo },
              { tHead: "保证人备注", tText: endo.transToRemark }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          }  else if (endo.endorType === "ET03") {
            tBodyInfo.tHead = "质押背书";
            tColumn.push(
              { tHead: "质押日期", tText: this.formatDate(endo.signDt) },
              {
                tHead: this.$t("m.i.common.unImpawnDt"),
                tText: this.formatDate(endo.unimpawnDt)
              },
              { tHead: "出质人名称", tText: endo.transFromName },
              { tHead: "出质人账号", tText: endo.transFromAcctNo },
              { tHead: "出质人开户行行号", tText: endo.transFromBankNo },
              { tHead: "出质人统一社会信用代码", tText: endo.transFromSocCode },
              { tHead: "出质人备注1", tText: endo.transFromRemark },
              { tHead: "出质人备注2", tText: "" },
              { tHead: "质权人名称", tText: endo.transToName },
              { tHead: "质权人账号", tText: endo.transToAcctNo },
              { tHead: "质权人开户行行号", tText: endo.transToBankNo },
              { tHead: "质权人统一社会信用代码", tText: endo.transToSocCode },
              { tHead: "质权人备注1", tText: endo.otherInfo },
              { tHead: "质权人备注2", tText: "" }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET05") {
            tBodyInfo.tHead = "转让背书";
            tColumn.push(
              { tHead: "背书日期", tText: this.formatDate(endo.signDt) },
              { tHead: "背书人名称", tText: endo.transFromName },
              { tHead: "背书人账号", tText: endo.transFromAcctNo },
              { tHead: "背书人开户行行号", tText: endo.transFromBankNo },
              { tHead: "背书人统一社会信用代码", tText: endo.transFromSocCode },
              { tHead: "背书人备注", tText: endo.transFromRemark },
              { tHead: "被背书人名称", tText: endo.transToName },
              { tHead: "被背书人账号", tText: endo.transToAcctNo },
              { tHead: "被背书人开户行行号", tText: endo.transToBankNo },
              { tHead: "被背书人统一社会信用代码", tText: endo.transToSocCode },
              { tHead: "被背书人备注", tText: endo.transToRemark }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET06") {
            tBodyInfo.tHead = "止付/冻结";
            tColumn.push(
              { tHead: "登记日期", tText: this.formatDate(endo.signDt) },
              { tHead: "止付日期", tText: this.formatDate(endo.signDt) },
              { tHead: "止付类型", tText: this.format("SspdType",endo.suspendType) },
              { tHead: "止付原因", tText: endo.suspendReason },
              { tHead: this.$t("m.i.ce.sspdName"), tText: endo.transFromName },
              { tHead: this.$t("m.i.ce.sspdAcctNo"), tText: endo.transFromAcctNo },
              { tHead: "止付申请人开户行行号", tText: endo.transFromBankNo },
              { tHead: "止付申请人统一社会信用代码", tText: endo.transFromOrgCode },
              { tHead: "止付登记人备注", tText: endo.transFromRemark }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET07") {
            tBodyInfo.tHead = "解除止付/冻结";
            tColumn.push(
              { tHead: "登记日期", tText: this.formatDate(endo.applDt) },
              { tHead: "解止付日期", tText: this.formatDate(endo.applDt) },
              { tHead: "解止付类型", tText: this.format("AnlgSspdType",endo.suspendType) },
              { tHead: "解止付原因", tText: endo.suspendReason },
              { tHead: "解除止付登记人备注", tText: endo.transFromRemark }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          }/* else if (endo.endorType === "300308") {
            tBodyInfo.tHead = "贴现背书";
            tColumn.push(
              { tHead: "贴现日期", tText: this.formatDate(endo.signDt) },
              { tHead: "贴出人名称", tText: endo.transFromName },
              { tHead: "贴出人账号", tText: endo.transFromAcctNo },
              { tHead: "贴出人开户行行号", tText: endo.transFromBankNo },
              { tHead: "贴出人统一社会信用代码", tText: endo.transFromSocCode },
              { tHead: "贴出人行业分类", tText: this.format("Industry",endo.transFromIndustry) },
              { tHead: "贴出人企业规模", tText: this.format("CorpScale",endo.transFromCorpScale) },
              { tHead: "贴出人是否涉农企业", tText: this.format("Yon",endo.isTransFromArc) },
              { tHead: "地区", tText: this.format("Province",endo.transFromArea) },
              { tHead: "贴出人是否绿色企业", tText: this.format("Yon",endo.isTransFromGrn) },
              { tHead: "贴出人备注", tText: endo.transFromRemark },
              { tHead: "贴入人名称", tText: endo.transToName },
              { tHead: "贴入人账号", tText: endo.transToAcctNo },
              { tHead: "贴入人开户行行号", tText: endo.transToBankNo },
              { tHead: "贴入人开户行机构代码", tText: endo.transToBrchCode },
              { tHead: "贴入人开户行行名", tText: endo.transToBrchName },
              { tHead: "贴入人统一社会信用代码", tText: endo.transToSocCode },
              { tHead: "贴入人备注", tText: endo.transToRemark }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } */else if (endo.endorType === "ET18") {
            tBodyInfo.tHead = "权属初始登记背书";
            tColumn.push(
              { tHead: "权属登记日期", tText: this.formatDate(endo.applDt) },
              { tHead: "登记机构代码", tText: endo.transFromBrchCode },
              { tHead: "登记机构名称", tText: endo.transFromBrchName },
              { tHead: "备注", tText: endo.transFromRemark }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } /*else if (endo.endorType === "300310") {
            tBodyInfo.tHead = "付款确认背书";
            tColumn.push(
              { tHead: "付款确认日期", tText: this.formatDate(endo.signDt) },
              { tHead: "付款确认类型", tText: this.format("CfmAppType",endo.cfmAppType) },
              { tHead: "应答标识", tText: this.format("SignUpMarkCode",endo.cfmAppStatus) },
              { tHead: "付款确认拒绝原因", tText: this.format("RefuseReason",endo.payRefuseFlag) },
              { tHead: "付款确认申请备注", tText: endo.transFromRemark },
              { tHead: "付款确认应答备注", tText: endo.transToRemark }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "300311") {
            tBodyInfo.tHead = "移库背书";
            tColumn.push(
              { tHead: "库存移出日期", tText: this.formatDate(endo.applDt) },
              { tHead: "库存移入日期", tText: this.formatDate(endo.moveInDt) },
              { tHead: "库存移出机构代码", tText: endo.transFromBrchCode },
              { tHead: "库存移出机构名称", tText: endo.transFromBrchName },
              { tHead: "库存移入机构代码", tText: endo.transToBrchCode },
              { tHead: "库存移入机构名称", tText: endo.transToBrchName },
              { tHead: "库存移出申请备注", tText: endo.transFromRemark },
              { tHead: "库存移入应答备注", tText: endo.transToRemark }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          }*/ else if (endo.endorType === "ET08") {
            tBodyInfo.tHead = "保证增信背书";
            tColumn.push(
              { tHead: "保证增信日期", tText: this.formatDate(endo.signDt) },
              { tHead: "保证增信行机构代码", tText: endo.transToBrchCode },
              { tHead: "保证增信行机构名称", tText: endo.transToBrchName },
              { tHead: "保证增信申请备注", tText: endo.transFromRemark },
              { tHead: "保证增信应答备注", tText: endo.transToRemark }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET16") {
            tBodyInfo.tHead = "增信背书";
            tColumn.push(
              { tHead: "增信日期", tText: this.formatDate(endo.signDt) },
              { tHead: "增信行机构代码", tText: endo.transToBrchCode },
              { tHead: "增信行机构名称", tText: endo.transToBrchName },
              { tHead: "增信申请备注", tText: endo.transFromRemark },
              { tHead: "增信应答备注", tText: endo.transToRemark }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          }/* else if (endo.endorType === "300313") {
            tBodyInfo.tHead = "贴现后质押背书";
            tColumn.push(
              { tHead: "质押日期", tText: this.formatDate(endo.applDt) },
              { tHead: this.$t("m.i.common.unImpawnDt"), tText: this.formatDate(endo.unimpawnDt) },
              { tHead: "出质人机构代码", tText: endo.transFromBrchCode },
              { tHead: "出质人机构名称", tText: endo.transFromBrchName },
              { tHead: "质权人机构代码", tText: endo.transToBrchCode },
              { tHead: "质权人机构名称", tText: endo.transToBrchName },
              { tHead: "质押申请备注", tText: endo.transFromRemark },
              { tHead: "质押应答备注", tText: endo.transToRemark },
              { tHead: "解除质押申请备注", tText: endo.unImpawnAplRemark },
              { tHead: "解除质押应答备注", tText: endo.unImpawnRvRemark }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "300314") {
            tBodyInfo.tHead = "贴现后保证背书";
            tColumn.push(
              { tHead: "保证日期", tText: this.formatDate(endo.applDt) },
              { tHead: "被保证人机构代码", tText: endo.transFromBrchCode },
              { tHead: "被保证人机构名称", tText: endo.transFromBrchName },
              { tHead: "保证人机构代码", tText: endo.transToBrchCode },
              { tHead: "保证人机构名称", tText: endo.transToBrchName },
              { tHead: "保证申请备注", tText: endo.transFromRemark },
              { tHead: "保证应答备注", tText: endo.transToRemark }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } *//*else if (endo.endorType === "300315") {
            tBodyInfo.tHead = "转贴现背书";
            tColumn.push(
              { tHead: "结算日期", tText: this.formatDate(endo.signDt) },
              { tHead: "交易类型", tText: "转贴现" },
              { tHead: "卖出方机构代码", tText: endo.transFromBrchCode },
              { tHead: "卖出方机构名称", tText: endo.transFromBrchName },
              { tHead: "买入方机构代码", tText: endo.transToBrchCode },
              { tHead: "买入方机构名称", tText: endo.transToBrchName }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          }*/  else if (endo.endorType === "300316") {
            tBodyInfo.tHead = "质押式回购背书";
            tColumn.push(
              { tHead: "首期结算日", tText: this.formatDate(endo.signDt) },
              { tHead: "交易类型", tText: "质押式回购" },
              { tHead: "正回购方机构代码", tText: endo.transFromBrchCode },
              { tHead: "正回购方机构名称", tText: endo.transFromBrchName },
              { tHead: "逆回购方机构代码", tText: endo.transToBrchCode },
              { tHead: "逆回购方机构名称", tText: endo.transToBrchName },
              { tHead: "到期结算日", tText: this.formatDate(endo.dueSettleDt) },
              { tHead: "回购状态", tText: this.format("BuyBackStatus",endo.buyBackStatus) },
              { tHead: "置换状态", tText: this.format("ExchgStatus",endo.changeStatus) }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          }  else if (endo.endorType === "ET19") {
            tBodyInfo.tHead = "质押式回购背书";
            tColumn.push(
              { tHead: "首期结算日", tText: this.formatDate(endo.signDt) },
              { tHead: "交易类型", tText: "质押式回购" },
              { tHead: "正回购方机构代码", tText: endo.transFromBrchCode },
              { tHead: "正回购方机构名称", tText: endo.transFromBrchName },
              { tHead: "逆回购方机构代码", tText: endo.transToBrchCode },
              { tHead: "逆回购方机构名称", tText: endo.transToBrchName },
              { tHead: "到期结算日", tText: this.formatDate(endo.dueSettleDt) },
              { tHead: "回购状态", tText: this.format("BuyBackStatus",endo.buyBackStatus) },
              { tHead: "置换状态", tText: this.format("ExchgStatus",endo.changeStatus) }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET20") {
            tBodyInfo.tHead = "质押式回购赎回";
            tColumn.push(
              { tHead: "背书人名称", tText: endo.transFromName },
              { tHead: "被背书人名称", tText: endo.transToName },
              { tHead: "背书日期", tText: this.formatDate(endo.signDt) }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          }   else if (endo.endorType === "ET13") {
            tBodyInfo.tHead = "买断式回购（首期）背书";
            tColumn.push(
              { tHead: "首期结算日", tText: this.formatDate(endo.signDt) },
              { tHead: "交易类型", tText: "买断式回购" },
              { tHead: "正回购方机构代码", tText: endo.transFromBrchCode },
              { tHead: "正回购方机构名称", tText: endo.transFromBrchName },
              { tHead: "逆回购方机构代码", tText: endo.transToBrchCode },
              { tHead: "逆回购方机构名称", tText: endo.transToBrchName },
              { tHead: "到期结算日", tText: this.formatDate(endo.dueSettleDt) }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "ET17") {
            tBodyInfo.tHead = "买断式回购（到期）背书";
            tColumn.push(
              { tHead: "首期结算日", tText: this.formatDate(endo.signDt) },
              { tHead: "交易类型", tText: "买断式回购" },
              { tHead: "正回购方机构代码", tText: endo.transFromBrchCode },
              { tHead: "正回购方机构名称", tText: endo.transFromBrchName },
              { tHead: "逆回购方机构代码", tText: endo.transToBrchCode },
              { tHead: "逆回购方机构名称", tText: endo.transToBrchName },
              { tHead: "到期结算日", tText: this.formatDate(endo.dueSettleDt) }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "300319") {
            tBodyInfo.tHead = "再贴现质押式回购背书";
            tColumn.push(
              { tHead: "首期结算日", tText: this.formatDate(endo.signDt) },
              { tHead: "交易类型", tText: "再贴现质押式回购" },
              { tHead: "再贴现申请机构代码", tText: endo.transFromBrchCode },
              { tHead: "再贴现申请机构名称", tText: endo.transFromBrchName },
              { tHead: "人行再贴现机构代码", tText: endo.transToBrchCode },
              { tHead: "人行再贴现机构名称", tText: endo.transToBrchName },
              { tHead: "到期结算日", tText: this.formatDate(endo.dueSettleDt) },
              { tHead: "回购状态", tText: this.format("BuyBackStatus",endo.buyBackStatus) },
              { tHead: "置换状态", tText: this.format("ExchgStatus",endo.changeStatus) }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          }  else if (endo.endorType === "ET21") {
            tBodyInfo.tHead = "再贴现质押式回购背书";
            tColumn.push(
              { tHead: "首期结算日", tText: this.formatDate(endo.signDt) },
              { tHead: "交易类型", tText: "再贴现质押式回购" },
              { tHead: "再贴现申请机构代码", tText: endo.transFromBrchCode },
              { tHead: "再贴现申请机构名称", tText: endo.transFromBrchName },
              { tHead: "人行再贴现机构代码", tText: endo.transToBrchCode },
              { tHead: "人行再贴现机构名称", tText: endo.transToBrchName },
              { tHead: "到期结算日", tText: this.formatDate(endo.dueSettleDt) },
              { tHead: "回购状态", tText: this.format("BuyBackStatus",endo.buyBackStatus) },
              { tHead: "置换状态", tText: this.format("ExchgStatus",endo.changeStatus) }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          }  else if (endo.endorType === "ET22") {
            tBodyInfo.tHead = "再贴现质押式回购赎回";
            tColumn.push(
              { tHead: "背书人名称", tText: endo.transFromName },
              { tHead: "被背书人名称", tText: endo.transToName },
              { tHead: "背书日期", tText: this.formatDate(endo.signDt) }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          }   else if (endo.endorType === "300320") {
            tBodyInfo.tHead = "再贴现买断背书";
            tColumn.push(
              { tHead: "结算日期", tText: this.formatDate(endo.signDt) },
              { tHead: "交易类型", tText: "再贴现买断" },
              { tHead: "再贴现申请机构代码", tText: endo.transFromBrchCode },
              { tHead: "再贴现申请机构名称", tText: endo.transFromBrchName },
              { tHead: "人行再贴现机构代码", tText: endo.transToBrchCode },
              { tHead: "人行再贴现机构名称", tText: endo.transToBrchName }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "300321") {
            tBodyInfo.tHead = "非交易过户背书";
            tColumn.push(
              { tHead: "非交易过户日期", tText: this.formatDate(endo.signDt) },
              { tHead: "业务发起方机构代码", tText: endo.transFromBrchCode },
              { tHead: "业务发起方机构名称", tText: endo.transFromBrchName },
              { tHead: "业务接收方机构代码", tText: endo.transToBrchCode },
              { tHead: "业务接收方机构名称", tText: endo.transToBrchName },
              { tHead: "过户原因", tText: endo.returnMsg }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "300322") {
            tBodyInfo.tHead = "提示付款背书";
            tColumn.push(
              { tHead: "提示付款申请日期", tText: this.formatDate(endo.signDt) },
              { tHead: "提示付款申请机构代码", tText: endo.transFromBrchCode },
              { tHead: "提示付款申请机构名称", tText: endo.transFromBrchName },
              { tHead: "提示付款应答结果", tText: this.format("SignUpMarkCode",endo.prsttnSignCode) },
              { tHead: "提示付款拒绝原因", tText: this.format("DishonorCode",endo.payRefuseFlag) },
              { tHead: "提示付款结算结果", tText: this.format("StlResult",endo.prsttnSettleResult) },
              { tHead: "提示付款申请备注", tText: endo.transFromRemark },
              { tHead: "提示付款应答备注", tText: endo.transToRemark }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "300323") {
            tBodyInfo.tHead = "电票转入背书";
            tColumn.push(
              { tHead: "转入日期", tText: this.formatDate(endo.signDt) },
              { tHead: "ECDS持有机构代码", tText: endo.transFromBrchCode },
              { tHead: "ECDS持有机构名称", tText: endo.transFromBrchName },
              { tHead: "权属转入机构代码", tText: endo.transToBrchCode },
              { tHead: "权属转入机构名称", tText: endo.transToBrchName }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          }  else if (endo.endorType === "ET11") {
            tBodyInfo.tHead = "电票转入背书";
            tColumn.push(
              { tHead: "转入日期", tText: this.formatDate(endo.signDt) },
              { tHead: "ECDS持有机构代码", tText: endo.transFromBrchCode },
              { tHead: "ECDS持有机构名称", tText: endo.transFromBrchName },
              { tHead: "权属转入机构代码", tText: endo.transToBrchCode },
              { tHead: "权属转入机构名称", tText: endo.transToBrchName }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          } else if (endo.endorType === "300324") {
            tBodyInfo.tHead = "追偿背书";
            tColumn.push(
              { tHead: "追偿日期", tText: this.formatDate(endo.signDt) },
              { tHead: "追偿人机构代码", tText: endo.transFromBrchCode },
              { tHead: "追偿人机构名称", tText: endo.transFromBrchName },
              { tHead: "被追偿人机构代码", tText: endo.transToBrchCode },
              { tHead: "被追偿人机构名称", tText: endo.transToBrchName }

            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          }else if (endo.endorType === "300325") {
            tBodyInfo.tHead = "转让背书（存托）信息";
            tColumn.push(
              { tHead: "转让日期", tText: this.formatDate(endo.signDt) },
              { tHead: "背书企业名称", tText: endo.transFromName },
              { tHead: "背书企业账号", tText: endo.transFromAcctNo },
              { tHead: "背书企业统一社会信用代码", tText: endo.transFromSocCode },
              { tHead: "背书人机构代码", tText: endo.transFromBrchCode },
              { tHead: "背书人机构名称", tText: endo.transFromBrchName },
              { tHead: "被背书人机构代码", tText: endo.transToBrchCode },
              { tHead: "被背书人机构名称", tText: endo.transToBrchName }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          }else if (endo.endorType === "ET12") {
            tBodyInfo.tHead = "转让背书（存托）信息";
            tColumn.push(
              { tHead: "转让日期", tText: this.formatDate(endo.signDt) },
              { tHead: "背书企业名称", tText: endo.transFromName },
              { tHead: "背书企业账号", tText: endo.transFromAcctNo },
              { tHead: "背书企业统一社会信用代码", tText: endo.transFromSocCode },
              { tHead: "背书人机构代码", tText: endo.transFromBrchCode },
              { tHead: "背书人机构名称", tText: endo.transFromBrchName },
              { tHead: "被背书人机构代码", tText: endo.transToBrchCode },
              { tHead: "被背书人机构名称", tText: endo.transToBrchName }
            );
            tBodyInfo.tColumn = tColumn;
            endo.tBodyInfo = tBodyInfo;
          }
          if(!!endo.tBodyInfo){
            this.rmap.push(endo);
          }

        });
      },
      format(groupcode, key) {
        let group = this.dictMap.get(groupcode);
        if (group && key) {
          return group.get(key);
        }
        return "";
      },
      getRefulseMsg(object, billOrigin, inOutFlag) {
        if (billOrigin === 'CS01' && inOutFlag == "1") {
          if (object.signCode !== "DC09") {
            return this.format("EcdsDishonorCode", object.signCode);
          } else {
            return object.otherInfo;
          }
        } else {
          if (object.signCode !== "CP06") {
            return this.format("DishonorCode", object.signCode);
          } else {
            return object.otherInfo;
          }
        }
      },
      recourseTypeFormat(subEndorType) {
        if (subEndorType == "NES.013.20.10P" || subEndorType == "NES.012.20.32P") {
          return "拒付追索";
        } else if (subEndorType == "NES.013.20.11P" || subEndorType == "NES.013.20.01P") {
          return "非拒付追索";
        } else {
          return "";
        }
      },
      ecdsRecourseTypeFormat(subEndorType) {
        if (subEndorType == "NES.013.20.10P") {
          return "拒付追索";
        } else if (subEndorType == "NES.013.20.11P"){
          return "非拒付追索";
        } else {
          return "";
        }
      },
      getOtherInfo() {
        //获取背书信息
        post({billNo: this.billIds,transFromSocCode:this.billRangeStarts,transToSocCode:this.billRangeEnds}, "/pc/btrc/common/queryEndrsmtInfo").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              console.log('res.data.retData:'+res.data.retData);
              let infos = res.data.retData;
              for (let i = 0; i < infos.length; i++) {
                this.divisionEndoInfo(infos[i]);
                this.creatEndo(this.outEndoInfoMap);
                this.creatEndo(this.inEndoInfoMap);
                // this.creatIndo(this.inEndoInfoMap);
                this.endoInfos.push(this.rmap);

                this.rmap = [];
                this.outEndoInfoMap = [];
                this.inEndoInfoMap = [];
              }
            } else {
              this.$msgTip.error(this, {info: msg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
        // //获取交易历史信息
        // this.$refs.transHis.handleSearch(billId);
        // //获取影像信息
        // if (typeof this.$refs.imgQuery !== "undefined") {
        //   this.$refs.imgQuery.handleSearch(billId);
        // }
      },
      //打印票据正面
      billFrontPrint() {
        let headHtml = [];
        let bodyHtml = [];
        let options = [];
        for (let i = 0; i < this.billInfos.length; i++) {
          headHtml.push(this.$refs.billsFront[i].$refs.head.innerHTML);
          bodyHtml.push(this.$refs.billsFront[i].$refs.body.outerHTML);
          options.push({
            headTop: "-7%",
            headHeight: "27%",
            bodyTop: this.billInfos[i].billClass === "ME01" ? "13%" : "28%",
            bodyLeft: "1%",
            bodyWidth: "99%",
            bodyHeight: "BottomMargin:10mm",
            linkedItem: -1
          });
        }
        let t = 100 + 400 * this.billInfos.length;
        let obj = this;
        let num = printListsHtm(this, headHtml, bodyHtml, options, null, this.printStyles);
        //todo 把循环打印放进上面循环里
      },
      //批量打印场外背书
      outEndoPrint() {
        let headHtml = [];
        let bodyHtml = [];
        let options = [];
        for (let i = 0; i < this.endosParams.length; i++) {
          console.log(this.endoInfos[i]);
          headHtml.push(this.$refs.outEndo[i].$refs.head.innerHTML);
          //console.log('outEndo[i]:'+outEndo[i]);
          // let bodyStr=this.$refs.outEndo[i].$refs.body;
          // bodyHtml.push('<table data-v-256140ff="" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid rgb(0, 0, 0);"><tbody data-v-256140ff=""><tr data-v-256140ff=""><td data-v-256140ff="" colspan="2" class="th tac h-fs14">权属初始登记背书</td></tr> <tr data-v-256140ff=""><td data-v-256140ff="" class="th">权属登记日期</td> <td data-v-256140ff="">2021-04-22</td></tr><tr data-v-256140ff=""><td data-v-256140ff="" class="th">登记机构代码</td> <td data-v-256140ff="">000000054</td></tr><tr data-v-256140ff=""><td data-v-256140ff="" class="th">登记机构名称</td> <td data-v-256140ff=""></td></tr><tr data-v-256140ff=""><td data-v-256140ff="" class="th">备注</td> <td data-v-256140ff=""></td></tr></tbody></table>')

          // bodyHtml.push(this.$refs.outEndo[i].$refs.body);
          options.push({
            headTop: this.billInfos[i].billClass === "ME01" ? "-5%" : "-8%",
            bodyTop: this.billInfos[i].billClass === "ME01" ? "10%" : "22%",
            bodyLeft: "1%",
            bodyWidth: "99%",
            bodyHeight: "BottomMargin:20mm",
            linkedItem: -1
          })

          bodyHtml.push(this.$refs.outEndo[i].$refs.body.outerHTML);
        }

        let num = printListsHtmVertical(this, headHtml, bodyHtml, options, null, this.printStyles);

        this.handleClose();

        //this.inEndoPrint();
      },
      //批量打印场内背书
      inEndoPrint() {
        let headHtml = [];
        let bodyHtml = [];
        let options = [];
        for (let i = 0; i < this.indosParams.length; i++) {
          headHtml.push(this.$refs.inEndo[i].$refs.head.innerHTML)

          options.push({
            headTop: this.billInfos[i].billClass === "ME01" ? "-5%" : "-8%",
            bodyTop: this.billInfos[i].billClass === "ME01" ? "10%" : "17%",
            bodyLeft: "1%",
            bodyWidth: "99%",
            bodyHeight: "BottomMargin:20mm",
            linkedItem: -1
          })
          bodyHtml.push(this.$refs.inEndo[i].$refs.body.outerHTML);
        }

        let num = printListsHtmVertical(this, headHtml, bodyHtml, options, null, this.printStyles);
        this.handleClose();
      },
      // //打印场内背书
      // inEndoPrint() {
      //   let headHtml = this.$refs.inEndo.$refs.head.innerHTML;
      //   let bodyHtml = this.$refs.inEndo.$refs.body.outerHTML;
      //   let bodyTop = this.billClass === "ME01" ? "10%" : "17%";
      //   let headTop = this.billClass === "ME01" ? "-5%" : "-8%";
      //   this.$print.printListHtmVertical(this, headHtml, bodyHtml, {
      //     headTop: headTop,
      //     bodyTop: bodyTop,
      //     bodyLeft: "1%",
      //     bodyWidth: "99%",
      //     bodyHeight: "BottomMargin:20mm"
      //   }, null, this.printStyles);
      // },
      printPdf() {
        let headHtmlList = [];
        let bodyHtmlList = [];
        let options = [];
        this.tempDropdownItemProps.forEach((item) => {
          if (item.isDropdownItemChecked) {
            headHtmlList.push(this.$refs[item.name].$refs.head.innerHTML);
            bodyHtmlList.push(this.$refs[item.name].$refs.body.outerHTML);
            item.isDropdownItemChecked = false;
            let bodyTop = this.billClass === "ME01" ? "10%" : "17%";
            let headTop = this.billClass === "ME01" ? "-5%" : "-8%";
            if (item.name === "billFront") {
              headTop = this.billClass === "ME01" ? "-2%" : "-12%";
            }
            options.push({
              setPrinter: this.printerName,
              headTop: headTop,
              bodyTop: bodyTop,
              bodyLeft: "1%",
              bodyWidth: "99%",
              bodyHeight: "BottomMargin:20mm"
            })
          }
        })
        let printStyles = this.printStyles;
        printStyles = printStyles.replace(".h-col-span-3 {display: block;width: 12.5%; }.h-col-span-21 {display: block;width: 87.5%; }", ".h-col-span-3 {display: block;width: 16.66667%; }.h-col-span-21 {display: block;width: 83.33333%; }")
        this.$print.detailListPrint(this, headHtmlList, bodyHtmlList, options, printStyles);
        this.dropdownVisible = false;
      },
      handleMouseenter() {
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.dropdownVisible = true;
        }, 250);
      },
      handleMouseleave() {
        if (this.timeout) {
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            this.dropdownVisible = false;
          }, 150);
        }
      },
      dropdownChange(event, item) {
        event.target.checked = !item.isDropdownItemChecked;
        this.$refs[item.name + 'CheckBox'][0].change(event);
      },
      checkBoxChange() {
        this.printPdfDisabled = !this.tempDropdownItemProps.some(item => {
          return item.isDropdownItemChecked === true
        })
      },
    },
    created(){
      // this.getDictListByGroups("Yon,EcdsBillStatusCode,CfmAppType,SignUpMarkCode,Industry,AnlgSspdType,SspdType,CorpScale,BuyBackStatus,ExchgStatus,DishonorCode,StlResult,RefuseReason,Province,ImgType,ImgStatus,BanEndorsementMarkCode,EcdsDishonorCode,UpbsQueryAnswerStatus,UpbsQueryType,CpesFlowStatus,EcdsRecourseType,EcdsRefuseCode").then(res => {
      this.getDictListByGroups("Yon,EcdsBillStatusCode,CpesBillStatus,CfmAppType,SignUpMarkCode,Industry,AnlgSspdType,SspdType,CorpScale,BuyBackStatus,ExchgStatus,DishonorCode,StlResult,RefuseReason," +
        "Province,ImgType,ImgStatus,BanEndorsementMarkCode,EcdsDishonorCode,UpbsQueryAnswerStatus,UpbsQueryType,CpesFlowStatus,EcdsRecourseType,EcdsRefuseCode,TransStatusCode,TransBusiStatusCode,BillStatusCode,TransTypeCode,BillCirStatusCode,IsAllowSplitBill,IsAllowSplitBillCirc,BanEndorsementMarkFlag,HistBillStatus,BillEndorType").then(res => {
        this.dictMap = res.get("map");
        this.init();
      });

    },
    updated() {
      if(this.bulkPrint) {
        if (this.bulkPrintBillFlag) {
          this.billFrontPrint();
          this.handleClose();
        }
        // else if (this.bulkPrintOutEndoFlag) {
        //   this.outEndoPrint();
        //   this.handleClose();
        // }
      }
    }
  };
</script>
<style scoped>
</style>
