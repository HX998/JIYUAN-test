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
    :z-index="1010">
    <p slot="header">
      <span>查看票样</span>
    </p>
    <h-tabs :animated="false" :value="billPane" @on-click="clickTabs" ref="closetab">
      <h-tab-pane :label="$t('m.i.pc.billFront')" name="billFront" :class="this.tabPaneClass">
        <keep-alive>
          <component :is="this.billClass+'BillFront'" :billInfo="this.billInfo" :chineseMoney="this.chineseMoney" :dictMap="this.dictMap" :format4="format4" ref="billFront"></component>
        </keep-alive>
      </h-tab-pane>
      <h-tab-pane :label="$t('m.i.pc.outEndo')" name="outEndo" :class="this.tabPaneClass">
        <keep-alive>
          <component
            :is="'OutEndo'"
            :endoParams="endoParams"
            ref="outEndo"
            :dictMap="this.dictMap"
          ></component>
        </keep-alive>
      </h-tab-pane>
      <h-tab-pane :label="$t('m.i.pc.inEndo')"  name="inEndo" :class="this.tabPaneClass">
        <keep-alive>
          <component
            :is="'InEndo'"
            :endoParams="endoParams"
            ref="inEndo"
            :dictMap="this.dictMap"
          ></component>
        </keep-alive>
      </h-tab-pane>
      <h-tab-pane :label="$t('m.i.pc.transHis')"  name="transHisStd" :class="this.tabPaneBlankClass">
        <keep-alive>
          <component :is="'TransHisStd'" ref="transHisStd" :dictMap="this.dictMap"></component>
        </keep-alive>
      </h-tab-pane>
      <h-tab-pane :label="$t('m.i.pc.queryAwns')" name="inqrepUpbsStd" :class="this.tabPaneBlankClass">
        <keep-alive>
          <component :is="'InqrepUpbsStd'" ref="inqrepUpbsStd" :billNo="this.billInfo.billNo" :dictMap="this.dictMap" :class="this.tabPaneBlankClass"></component>
        </keep-alive>
      </h-tab-pane>
      <h-tab-pane :label="$t('m.i.pc.imgQuery')" name="imgQueryStd" :class="this.tabPaneBlankClass">
        <keep-alive>
          <component :is="'ImgQueryStd'" ref="imgQueryStd" :dictMap="this.dictMap"></component>
        </keep-alive>
      </h-tab-pane>
    </h-tabs>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" v-if="billPane === 'billFront'" @click="billFrontPrint">{{$t("m.i.pc.billFrontPrint")}}</h-button>
      <h-button type="primary" v-else-if="billPane === 'outEndo'" @click="outEndoPrint">{{$t("m.i.pc.outEndoPrint")}}</h-button>
      <h-button type="primary" v-else-if="billPane === 'inEndo'" @click="inEndoPrint">{{$t("m.i.pc.inEndoPrint")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  import { getDictListByGroups, post } from "@/api/bizApi/commonUtil";

  export default {
    name: "billInfoMainStd",
    data() {
      return {
        queryAnswer:"",
        dictMap : new Map(),
        billInfo : {},
        outEndoInfoMap : [],
        inEndoInfoMap : new Map(),
        chineseMoney : {},
        blueClass : "h-ticket h-t_blue",
        greenClass : "h-ticket h-t_green",
        pinkClass : "h-ticket h-t_pink",
        orangeClass : "h-ticket h-t_orange",
        blankClass : "h-ticket",
        tabPaneClass : "",
        tabPaneBlankClass : "",
        billClass : "ME01",
        billType : "AC01",
        billPane : "",
        endoParams : {},
        showInqrep : false,
        showInqrepUpsb: false,
        printStyles : '<style type="text/css">' +
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
        '.h-t_pink {background-image: url("././../assets/ticket_bg1.png");}' +
        '.h-t_orange {background-image: url("././../assets/ticket_bg2.png");}' +
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
    components: {
    },
    mounted() {
     // this.getDictInfo();
    },
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
      //登记中心ID
      billId: "",
      // showInqrepUpsb:{
      //   type: Boolean,
      //   default: true
      // },
      //票据号码
      billNo: {
        type:String,
        default() {
          return "";
        }
      },
      listId: "",
      creationId:""
    },
    watch: {
      showBillInfoWin(val) {
        if (val) {
          //页面打开
          this.showInqrepUpsb = true;
          getDictListByGroups(
           "Yon,EcdsBillStatusCode,CfmAppType,SignUpMarkCode,Industry,AnlgSspdType,SspdType,CorpScale,BuyBackStatus,ExchgStatus,DishonorCode,StlResult,RefuseReason,Province,ImgType,ImgStatus,BanEndorsementMarkCode,EcdsDishonorCode,UpbsQueryAnswerStatus,UpbsQueryType,CpesFlowStatus,EcdsRecourseType,EcdsRefuseCode"
          ).then(res => {
          this.dictMap = res.get("map");
           this.init();
        });
        } else {
          this.showInqrepUpsb = false;
        }
      }
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          if (this.$refs.transHisStd && this.$refs.transHisStd.$refs.transFormDatagrid != null) {
            this.$refs.transHisStd.$refs.transFormDatagrid.$refs.gridContent.handleResize();
          }
          if (this.$refs.inqrepUpbsStd && this.$refs.inqrepUpbsStd.$refs.sendQueryDatagrid != null && this.$refs.inqrepUpbsStd.$refs.recvQueryDatagrid != null) {
            this.$refs.inqrepUpbsStd.$refs.sendQueryDatagrid.$refs.gridContent.handleResize();
            this.$refs.inqrepUpbsStd.$refs.recvQueryDatagrid.$refs.gridContent.handleResize();
          }
          if (this.$refs.imgQueryStd && this.$refs.imgQueryStd.$refs.imgDatagrid != null) {
            this.$refs.imgQueryStd.$refs.imgDatagrid.$refs.gridContent.handleResize();
          }
        }, 100);
      },
      getDictInfo() {

      },
      //关闭页面处理
      handleClose() {
        this.billInfo = {};
        this.outEndoInfoMap = [];
        this.inEndoInfoMap = new Map();
        this.$emit("billInfoWinClose", "");
      },
      //初始化页面
      init() {
        this.billPane = "billFront";
        //获取票面信息
        let data = {};
        let url = "";
        if (this.billNo) {
          data = { billNo: this.billNo,listId:this.listId,creationId:this.creationId};
          url = "/bs/corpstdbill/common/getBillInfo";
        } else {
          this.$msgTip.error(this, { info: "无法获取票据号码" });
          this.handleClose();
          return;
        }
        post(data, url).then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.billInfo = res.data.retData;
              if (this.billInfo) {
                this.endoParams = {
                  billNo: this.billInfo.billNo,
                  billClass: this.billInfo.billClass,
                  billType: this.billInfo.billType
                };
                this.billClass = this.billInfo.billClass;
                this.billType = this.billInfo.billType;
                this.changeClass(this.billClass, this.billType);
                this.chineseMoney.bigMoney = this.arabia_To_SimplifiedChinese(
                  this.billInfo.billMoney
                );
                this.chineseMoney.smallMoney = this.arabia_To_Char(
                  this.billInfo.billMoney
                );
                let tabArray = this.$refs.closetab.$el.querySelectorAll('.h-tabs-tab');
                if (this.billInfo.billClass === "ME02" && this.$refs.closetab.$children.length > 4) {
                  tabArray[4].style.display = "none";
                  tabArray[5].style.display = "none";
                } else {
                  tabArray[4].style.display = "";
                  tabArray[5].style.display = "";
                }
                // else {
                  // if (this.billInfo.billNo !== null && this.billInfo.billNo !== "") {
                  //   if (this.billNo === null || typeof this.billNo === "undefined" || this.billNo === "") {
                  //     this.billNo = this.billInfo.billNo;
                  //   }
                  // }
                // }
                this.getOtherInfo(this.billInfo.id);
              } else {
                this.$msgTip.error(this, { info: "无法找到票据信息" });
                this.handleClose();
              }
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
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
        if (name === "transHisStd") {
          this.$refs.transHisStd.handleSearch(this.billInfo.id,this.listId,this.creationId);
        }
        //获取影像信息
        if (name === "imgQueryStd") {
          if (typeof this.$refs.imgQueryStd !== "undefined") {
            this.$refs.imgQueryStd.handleSearch(this.billInfo.id,this.listId,this.creationId);
          }
        }
        if(name ==='inqrepUpbsStd'){
            if (this.showInqrepUpsb) {
              this.$refs.inqrepUpbsStd.handleSearch(this.billInfo.billNo,this.listId,this.creationId);
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
            if (part.transNo.charAt(0) !== "3") {
              //场内背书
              outEndoInfoMap.push(part);
            } else {
              //场内背书
              inEndoInfoMap.push(part);
            }
          }
          this.outEndoInfoMap = outEndoInfoMap;
          this.inEndoInfoMap = inEndoInfoMap;
        }
        this.$refs.outEndo.creatEndo(this.outEndoInfoMap);
        this.$refs.inEndo.creatEndo(this.inEndoInfoMap);
      },
      getOtherInfo(billId) {
        let data={billId: billId,listId:this.listId,creationId:this.creationId}
        //获取背书信息
        post(data, "/bs/corpstdbill/common/queryEndrsmtInfo").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.divisionEndoInfo(res.data.retData);
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
        // //获取交易历史信息
        // this.$refs.transHisStd.handleSearch(billId);
        // //获取影像信息
        // if (typeof this.$refs.imgQueryStd !== "undefined") {
        //   this.$refs.imgQueryStd.handleSearch(billId);
        // }
      },
      //打印票据正面
      billFrontPrint() {
        let headHtml = this.$refs.billFront.$refs.head.innerHTML;
        let bodyHtml = this.$refs.billFront.$refs.body.outerHTML;
        let bodyTop = this.billClass === "ME01" ? "13%" : "30%";
        this.$print.printListHtm(this, headHtml, bodyHtml, { bodyTop: bodyTop, bodyLeft: "1%", bodyWidth: "99%", bodyHeight: "BottomMargin:10mm" }, null, this.printStyles);
      },
      //打印场外背书
      outEndoPrint() {
        let headHtml = this.$refs.outEndo.$refs.head.innerHTML;
        let bodyHtml = this.$refs.outEndo.$refs.body.outerHTML;
        let bodyTop = this.billClass === "ME01" ? "16%" : "25%";
        this.$print.printListHtm(this, headHtml, bodyHtml, { bodyTop: bodyTop, bodyLeft: "1%", bodyWidth: "99%", bodyHeight: "BottomMargin:10mm" }, null, this.printStyles);

      },
      //打印场内背书
      inEndoPrint() {
        let headHtml = this.$refs.inEndo.$refs.head.innerHTML;
        let bodyHtml = this.$refs.inEndo.$refs.body.outerHTML;
        let bodyTop = this.billClass === "ME01" ? "16%" : "25%";
        this.$print.printListHtm(this, headHtml, bodyHtml, { bodyTop: bodyTop, bodyLeft: "1%", bodyWidth: "99%", bodyHeight: "BottomMargin:10mm" }, null, this.printStyles);
      }
    }
  };
</script>

<style scoped>
</style>
