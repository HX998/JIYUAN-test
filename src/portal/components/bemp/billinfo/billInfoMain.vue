<template>
  <h-msg-box
    maximize
    v-model="tempBillInfoWin"
    width="1250"
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
      <h-tab-pane :label="$t('m.i.pc.billFront')" name="billFront" :class="this.tabPaneClass"
                  v-if="this.billClass==='ME01'">
        <keep-alive>
          <component :is="'ME01BillFront'" :billInfo="this.billInfo" :chineseMoney="this.chineseMoney"
                     :dictMap="this.dictMap" :format4="format4" ref="billFront"></component>
        </keep-alive>
      </h-tab-pane>
      <h-tab-pane :label="$t('m.i.pc.billFront')" name="billFront" :class="this.tabPaneClass"
                  v-if="this.billClass==='ME02'&&this.billInfo.billOrigin==='CS01'">
        <keep-alive>
          <component :is="'ME02CS01BillFront'" :billInfo="this.billInfo" :chineseMoney="this.chineseMoney"
                     :dictMap="this.dictMap" :format4="format4" ref="billFront"></component>
        </keep-alive>
      </h-tab-pane>
      <h-tab-pane :label="$t('m.i.pc.billFront')" name="billFront" :class="this.tabPaneClass"
                  v-if="this.billClass==='ME02'&&this.billInfo.billOrigin!=='CS01'">
        <keep-alive>
          <component :is="'ME02BillFront'" :billInfo="this.billInfo" :chineseMoney="this.chineseMoney"
                     :dictMap="this.dictMap" :format4="format4" ref="billFront"></component>
        </keep-alive>
      </h-tab-pane>
      <h-tab-pane :label="$t('m.i.pc.billAdditionalInfo')" name="billAdditionalInfo" :class="this.tabPaneClass">
        <keep-alive>
          <component :is="'billAdditionalInfo'" :extParams="this.extParams" :dictMap="this.dictMap" :format4="format4"
                     ref="billAdditionalInfo" :key="key"></component>
        </keep-alive>
      </h-tab-pane>
      <h-tab-pane :label="$t('m.i.pc.billEndo')" name="endo" :class="this.tabPaneClass">
        <keep-alive>
          <component
            :is="'endo'"
            :endoParams="endoParams"
            ref="endo"
            :dictMap="this.dictMap"
          ></component>
        </keep-alive>
      </h-tab-pane>
      <!--      <h-tab-pane :label="$t('m.i.pc.inEndo')"  name="inEndo" :class="this.tabPaneClass" v-if = "this.billClass === 'ME01'||(this.billClass==='ME02'&&this.billInfo.billOrigin==='CS01')">-->
      <!--        <keep-alive>-->
      <!--          <component-->
      <!--            :is="'InEndo'"-->
      <!--            :endoParams="endoParams"-->
      <!--            ref="inEndo"-->
      <!--            :dictMap="this.dictMap"-->
      <!--          ></component>-->
      <!--        </keep-alive>-->
      <!--      </h-tab-pane>-->
      <!--      <h-tab-pane :label="$t('m.i.pc.outEndo')" name="outEndo" :class="this.tabPaneClass" v-if = "this.billClass === 'ME01'||(this.billClass==='ME02'&&this.billInfo.billOrigin==='CS01')">-->
      <!--        <keep-alive>-->
      <!--          <component-->
      <!--            :is="'OutEndo'"-->
      <!--            :endoParams="endoParams"-->
      <!--            ref="outEndo"-->
      <!--            :dictMap="this.dictMap"-->
      <!--          ></component>-->
      <!--        </keep-alive>-->
      <!--      </h-tab-pane>-->
      <h-tab-pane :label="$t('m.i.pc.transHis')" :disabled="transHisDisabled" name="transHis"
                  :class="this.tabPaneBlankClass">
        <keep-alive>
          <component :is="'TransHis'" ref="transHis" :dictMap="this.dictMap"></component>
        </keep-alive>
      </h-tab-pane>
      <h-tab-pane :label="$t('m.i.pc.queryAwns')" name="inqrepUpbs" :class="this.tabPaneBlankClass">
        <keep-alive>
          <component :is="'InqrepUpbs'" ref="inqrepUpbs" :billNo="this.billInfo.billNo" :dictMap="this.dictMap"
                     :class="this.tabPaneBlankClass"></component>
        </keep-alive>
      </h-tab-pane>
      <h-tab-pane :label="$t('m.i.pc.imgQuery')" name="imgQuery" :class="this.tabPaneBlankClass">
        <keep-alive>
          <component :is="'ImgQuery'" ref="imgQuery" :dictMap="this.dictMap" :billId="this.billInfo.id"></component>
        </keep-alive>
      </h-tab-pane>
    </h-tabs>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{ $t("m.i.common.close") }}</h-button>
      <h-button type="primary" v-if="billPane === 'billFront'" @click="billFrontPrint">
        {{ $t("m.i.pc.billFrontPrint") }}
      </h-button>
      <h-button type="primary" v-else-if="billPane === 'billAdditionalInfo'" @click="billAdditionalInfoPrint">{{ $t("m.i.pc.billAdditionalInfoPrint") }}
      </h-button>
      <h-button type="primary" v-else-if="billPane === 'outEndo'" @click="outEndoPrint">
        {{ $t("m.i.pc.outEndoPrint") }}
      </h-button>
      <h-button type="primary" v-else-if="billPane === 'inEndo'" @click="inEndoPrint">{{ $t("m.i.pc.inEndoPrint") }}
      </h-button>
      <h-button type="primary" v-else-if="billPane === 'endo'" @click="endoPrint">{{ $t("m.i.pc.endoPrint") }}
      </h-button>
      <common-dropdown trigger="custom" :visible="dropdownVisible"
                       :isShowDropdown="billPane === 'billFront' || billPane === 'outEndo' || billPane === 'inEndo'">
        <h-button type="primary" @mouseenter.native="handleMouseenter" @mouseleave.native="handleMouseleave">
          {{ $t('m.i.common.createPdf') }}
          <h-icon name="unfold"></h-icon>
        </h-button>
        <h-dropdown-menu slot="list" @mouseenter.native="handleMouseenter" @mouseleave.native="handleMouseleave">
          <h-dropdown-item v-for="item in tempDropdownItemProps" :key="item.name" :name="item.name ? item.name : ''"
                           @click.native.self="dropdownChange($event, item)">
            <h-checkbox v-model="item.isDropdownItemChecked" @on-change="checkBoxChange" :ref="item.name + 'CheckBox'">
              <span>{{ item.label ? item.label : "" }}</span>
            </h-checkbox>
          </h-dropdown-item>
          <div style="margin: 0 5px 5px 5px;font-size: 14px;">
            <a @click="printPdf" :disabled="printPdfDisabled">{{ $t("m.i.bm.print") }}</a>
          </div>
        </h-dropdown-menu>
      </common-dropdown>
    </div>
  </h-msg-box>
</template>

<script>
  import {post, getParamValuesByKeys} from "@/api/bizApi/commonUtil";

  export default {
    name: "billInfoMain",
    data() {
      return {
        key: false,
        queryAnswer: "",
        dictMap: new Map(),
        billInfo: {},
        outEndoInfoMap: [],
        inEndoInfoMap: new Map(),
        chineseMoney: {},
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
        endoParams: {},
        extParams: {},
        transHisDisabled: true,
        showInqrep: false,
        showInqrepUpsb: false,
        //虚拟打印机名称
        printerName: "Microsoft Print to PDF",
        //生成pdf下拉框是否展示
        dropdownVisible: false,
        //生成pdf下拉框数据源
        dropdownItemProps: [{label: this.$t('m.i.pc.billFront'), name: 'billFront'},
          {label: this.$t('m.i.pc.billEndo'), name: 'endo'}],
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
          '.h-tooltip {display: inline-block;}' +
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
    mounted() {
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
      billRangeStart: "",
      billRangeEnd: "",
      // showInqrepUpsb:{
      //   type: Boolean,
      //   default: true
      // },
      //票据号码
      billNo: {
        type: String,
        default() {
          return "";
        }
      }
    },
    watch: {
      showBillInfoWin(val) {
        if (val) {
          //页面打开
          this.showInqrepUpsb = true;
          this.getDictListByGroups("Yon,EcdsBillStatusCode,CpesBillStatus,CfmAppType,SignUpMarkCode,Industry,AnlgSspdType,SspdType,CorpScale,BuyBackStatus,ExchgStatus,DishonorCode,StlResult,RefuseReason," +
            "Province,ImgType,ImgStatus,BanEndorsementMarkCode,EcdsDishonorCode,UpbsQueryAnswerStatus,UpbsQueryType,CpesFlowStatus,EcdsRecourseType,EcdsRefuseCode,TransStatusCode,TransBusiStatusCode,BillStatusCode,TransTypeCode,BillCirStatusCode,IsAllowSplitBill,SettleType").then(res => {
            this.dictMap = res.get("map");
            this.init();
          });
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
        this.billInfo = {};
        this.outEndoInfoMap = [];
        this.inEndoInfoMap = new Map();
        this.transHisDisabled = true;
        this.$emit("billInfoWinClose", "");
      },
      //初始化页面
      init() {
        this.billPane = "billFront";
        //获取票面信息
        let data = {};
        let url = "/pc/btrc/bill/func_getBillFront";
        if (this.billId) {
          data = {
            billId: this.billId,
            billRangeStart: this.billRangeStart,
            billRangeEnd: this.billRangeEnd,
          };
        } else if (this.billNo) {
          data = {
            billNo: this.billNo,
            billRangeStart: this.billRangeStart,
            billRangeEnd: this.billRangeEnd,
          };
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
              this.billInfo = res.data.retData;
              if (this.billInfo) {
                this.endoParams = {
                  billNo: this.billInfo.billNo,
                  billId: this.billInfo.billId,
                  billRangeStart: this.billInfo.billRangeStart,
                  billRangeEnd: this.billInfo.billRangeEnd,
                  billClass: this.billInfo.billClass,
                  billType: this.billInfo.billType,
                  billOrigin: this.billInfo.billOrigin,
                  inOutFlag: this.billInfo.inOutFlag,
                  acptBankType: this.billInfo.acptBankType,
                };
                this.extParams = {
                  billType: this.billInfo.billType,
                  acptBankType: this.billInfo.acptBankType,
                  relevantInfolist: [],
                  drwrName: this.billInfo.drwrName,
                  pyeeName: this.billInfo.pyeeName,
                  acptName: this.billInfo.acptName,
                  drwrSocCode: this.billInfo.drwrSocCode,
                  pyeeSocCode: this.billInfo.pyeeSocCode,
                  acptSocCode: this.billInfo.acptSocCode,
                  drwrAcctName: this.billInfo.drwrAcctName,
                  pyeeAcctName: this.billInfo.pyeeAcctName,
                  acptAcctName: this.billInfo.acptAcctName,
                  drwrMemberName: this.billInfo.drwrMemberName,
                  pyeeMemberName: this.billInfo.pyeeMemberName,
                  acptMemberName: this.billInfo.acptMemberName,
                  drwrBankName: this.billInfo.drwrBankName,
                  pyeeBankName: this.billInfo.pyeeBankName,
                  acptBankName: this.billInfo.acptBankName,
                  drwrBankNo: this.billInfo.drwrBankNo,
                  pyeeBankNo: this.billInfo.pyeeBankNo,
                  acptBankNo: this.billInfo.acptBankNo,
                  drwrAcctNo: this.billInfo.drwrAcctNo,
                  pyeeAcctNo: this.billInfo.pyeeAcctNo,
                  acptAcctNo: this.billInfo.acptAcctNo,
                  guarntrList: [],
                };
                this.transHisDisabled = false;
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
                if (this.billInfo.billClass === "ME02") {
                  if (this.$refs.closetab.$children.length > 4) {
                    tabArray[5].style.display = "none";
                    tabArray[4].style.display = "none";
                  }
                  if (this.billInfo.billOrigin === 'CS01'){
                    tabArray[1].style.display = "none";
                  } else {
                    tabArray[1].style.display = "";
                  }
                } else {
                  tabArray[1].style.display = "none";
                  if (this.$refs.closetab.$children.length > 4) {
                    tabArray[5].style.display = "";
                    tabArray[4].style.display = "";
                  }
                }
                // else {
                // if (this.billInfo.billNo !== null && this.billInfo.billNo !== "") {
                //   if (this.billNo === null || typeof this.billNo === "undefined" || this.billNo === "") {
                //     this.billNo = this.billInfo.billNo;
                //   }
                // }
                // }
                this.getOtherInfo(this.billInfo.id);
                this.getExtInfo(this.billInfo.id, this.billInfo.billRangeStart, this.billInfo.billRangeEnd);
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
        if (name === "transHis") {
          this.$refs.transHis.handleSearch(this.billInfo.billId, this.billInfo.billRangeStart, this.billInfo.billRangeEnd);
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
        // if (this.billClass === 'ME01') {
        //   this.$refs.outEndo.creatEndo(this.outEndoInfoMap);
        //   this.$refs.inEndo.creatEndo(this.inEndoInfoMap);
        // } else {
        this.$refs.endo.creatEndo(data);
        // }
      },
      getOtherInfo(billId) {
        //获取背书信息
        post({
          billId: billId,
          billRangeStart: this.billRangeStart,
          billRangeEnd: this.billRangeEnd,
          pageNo: 1,
          pageSize: 100
        }, "/pc/btrc/bill/func_pagingQueryBillEndorInfo").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.divisionEndoInfo(res.data.retData);
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
      getExtInfo(billId, billRangeStart, billRangeEnd) {
        //获取背书信息
        post({
          billId: billId,
          billRangeStart: billRangeStart,
          billRangeEnd: billRangeEnd
        }, "/pc/btrc/bill/func_getBillExtInfo").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.composeBillExtInfo(res.data.retData);
            } else {
              this.$msgTip.error(this, {info: msg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
      composeBillExtInfo(retData) {
        let billMarkInfoList = retData.billMarkInfoList;
        let list = retData.guarntrList;
        let relevantInfolist = [];
        let guarntrList = [];
        if (billMarkInfoList != null && billMarkInfoList.length > 0) {
          let count = 0;
          let length = Math.ceil(billMarkInfoList.length / 3)
          for (let i = 0; i < length; i++) {
            let relevantInfo = {};
            if (count < billMarkInfoList.length) {
              let busiInfoOne = {};
              relevantInfo.keyOne = billMarkInfoList[count].key;
              relevantInfo.valueOne = billMarkInfoList[count].value;
              if (billMarkInfoList[count].value != '0') {
                busiInfoOne.name = billMarkInfoList[count].name;
                busiInfoOne.socCode = billMarkInfoList[count].socCode;
                busiInfoOne.amt = billMarkInfoList[count].amt;
                busiInfoOne.dt = billMarkInfoList[count].dt;
                busiInfoOne.memberName = billMarkInfoList[count].memberName;
                busiInfoOne.acctName = billMarkInfoList[count].acctName;
                busiInfoOne.brchCode = billMarkInfoList[count].brchCode;
                busiInfoOne.acctNo = billMarkInfoList[count].acctNo;
                busiInfoOne.bankName = billMarkInfoList[count].bankName;
                busiInfoOne.bankNo = billMarkInfoList[count].bankNo;
                relevantInfo.busiInfoOne = busiInfoOne;
              } else {
                busiInfoOne = null;
              }
              count = count + 1;
            }
            if (count < billMarkInfoList.length) {
              let busiInfoTwo = {};
              relevantInfo.keyTwo = billMarkInfoList[count].key;
              relevantInfo.valueTwo = billMarkInfoList[count].value;
              if (billMarkInfoList[count].value != '0') {
                busiInfoTwo.name = billMarkInfoList[count].name;
                busiInfoTwo.socCode = billMarkInfoList[count].socCode;
                busiInfoTwo.amt = billMarkInfoList[count].amt;
                busiInfoTwo.dt = billMarkInfoList[count].dt;
                busiInfoTwo.memberName = billMarkInfoList[count].memberName;
                busiInfoTwo.acctName = billMarkInfoList[count].acctName;
                busiInfoTwo.brchCode = billMarkInfoList[count].brchCode;
                busiInfoTwo.acctNo = billMarkInfoList[count].acctNo;
                busiInfoTwo.bankName = billMarkInfoList[count].bankName;
                busiInfoTwo.bankNo = billMarkInfoList[count].bankNo;
                relevantInfo.busiInfoTwo = busiInfoTwo;
              } else {
                busiInfoTwo = null;
              }
              count = count + 1;
            }
            if (count < billMarkInfoList.length) {
              let busiInfoThree = {};
              relevantInfo.keyThree = billMarkInfoList[count].key;
              relevantInfo.valueThree = billMarkInfoList[count].value;
              if (billMarkInfoList[count].value != '0') {
                busiInfoThree.name = billMarkInfoList[count].name;
                busiInfoThree.socCode = billMarkInfoList[count].socCode;
                busiInfoThree.amt = billMarkInfoList[count].amt;
                busiInfoThree.dt = billMarkInfoList[count].dt;
                busiInfoThree.memberName = billMarkInfoList[count].memberName;
                busiInfoThree.acctName = billMarkInfoList[count].acctName;
                busiInfoThree.brchCode = billMarkInfoList[count].brchCode;
                busiInfoThree.acctNo = billMarkInfoList[count].acctNo;
                busiInfoThree.bankName = billMarkInfoList[count].bankName;
                busiInfoThree.bankNo = billMarkInfoList[count].bankNo;
                relevantInfo.busiInfoThree = busiInfoThree;
              } else {
                busiInfoThree = null;
              }
              count = count + 1;
            }
            relevantInfolist.push(relevantInfo);
          }
        }
        this.extParams.relevantInfolist = relevantInfolist;
        if (list != null && list.length > 0) {
          let count = 0;
          let length = Math.ceil(list.length / 3);
          for (let i = 0; i < length; i++) {
            let guarntr = {};
            if (count < list.length) {
              guarntr.transNoOne = list[count].transNo;
              guarntr.nameOne = list[count].guarntrName;
              guarntr.socCodeOne = list[count].socCode;
              guarntr.acctNameOne = list[count].acctName;
              guarntr.memberNameOne = list[count].memberName;
              guarntr.bankNameOne = list[count].bankName;
              guarntr.bankNoOne = list[count].bankNo;
              guarntr.acctNoOne = list[count].acctNo;
              count = count + 1;
            }
            if (count < list.length) {
              guarntr.transNoTwo = list[count].transNo;
              guarntr.nameTwo = list[count].guarntrName;
              guarntr.socCodeTwo = list[count].socCode;
              guarntr.acctNameTwo = list[count].acctName;
              guarntr.memberNameTwo = list[count].memberName;
              guarntr.bankNameTwo = list[count].bankName;
              guarntr.bankNoTwo = list[count].bankNo;
              guarntr.acctNoTwo = list[count].acctNo;
              count = count + 1;
            }
            if (count < list.length) {
              guarntr.transNoThree = list[count].transNo;
              guarntr.nameThree = list[count].guarntrName;
              guarntr.socCodeThree = list[count].socCode;
              guarntr.acctNameThree = list[count].acctName;
              guarntr.memberNameThree = list[count].memberName;
              guarntr.bankNameThree = list[count].bankName;
              guarntr.bankNoThree = list[count].bankNo;
              guarntr.acctNoThree = list[count].acctNo;
              count = count + 1;
            }
            guarntrList.push(guarntr);
          }
        }
        this.extParams.guarntrList = guarntrList;
        if (null == this.extParams.drwrMemberName) {
          this.extParams.drwrMemberName = retData.drwrMemberName;
        }
        if (null == this.extParams.acptMemberName) {
          this.extParams.acptMemberName = retData.acptMemberName;
        }
        if (null == this.extParams.pyeeMemberName) {
          this.extParams.pyeeMemberName = retData.pyeeMemberName;
        }
      },
      //打印票据正面
      billFrontPrint() {
        let headHtml = this.$refs.billFront.$refs.head.innerHTML;
        let bodyHtml = this.$refs.billFront.$refs.body.outerHTML;
        let bodyTop = this.billClass === "ME01" ? "13%" : "27%";
        let headTop = this.billClass === "ME01" ? "-1%" : "-4%";
        this.$print.printListHtm(this, headHtml, bodyHtml, {
          bodyTop: bodyTop,
          headTop: headTop,
          headHeight: "27%",
          bodyLeft: "1%",
          bodyWidth: "99%",
          bodyHeight: "BottomMargin:10mm",
          bodyHtmlHeight:this.$refs.billFront.$refs.body.offsetHeight,
          bodyHtmlWidth:this.$refs.billFront.$refs.body.offsetWidth,
          headHtmlHeight:this.$refs.billFront.$refs.head.offsetHeight
        }, null, this.printStyles);
      },
      //打印场外背书
      outEndoPrint() {
        let headHtml = this.$refs.outEndo.$refs.head.innerHTML;
        let bodyHtml = this.$refs.outEndo.$refs.body.outerHTML;
        let bodyTop = this.billClass === "ME01" ? "10%" : "17%";
        let headTop = this.billClass === "ME01" ? "-5%" : "-8%";
        this.$print.printListHtmVertical(this, headHtml, bodyHtml, {
          headTop: headTop,
          bodyTop: bodyTop,
          bodyLeft: "1%",
          bodyWidth: "99%",
          bodyHeight: "BottomMargin:20mm",
          bodyHtmlHeight:this.$refs.outEndo.$refs.body.offsetHeight,
          bodyHtmlWidth:this.$refs.outEndo.$refs.body.offsetWidth,
          headHtmlHeight:this.$refs.outEndo.$refs.head.offsetHeight
        }, null, this.printStyles);
      },
      //打印场内背书
      inEndoPrint() {
        let headHtml = this.$refs.inEndo.$refs.head.innerHTML;
        let bodyHtml = this.$refs.inEndo.$refs.body.outerHTML;
        let bodyTop = this.billClass === "ME01" ? "10%" : "17%";
        let headTop = this.billClass === "ME01" ? "-5%" : "-8%";
        this.$print.printListHtmVertical(this, headHtml, bodyHtml, {
          headTop: headTop,
          bodyTop: bodyTop,
          bodyLeft: "1%",
          bodyWidth: "99%",
          bodyHeight: "BottomMargin:20mm",
          bodyHtmlHeight:this.$refs.inEndo.$refs.body.offsetHeight,
          bodyHtmlWidth:this.$refs.inEndo.$refs.body.offsetWidth,
          headHtmlHeight:this.$refs.inEndo.$refs.head.offsetHeight
        }, null, this.printStyles);
      },
      //打印票据背面
      endoPrint() {
        let headHtml = this.$refs.endo.$refs.head.innerHTML;
        let bodyHtml = this.$refs.endo.$refs.body.outerHTML;
        let bodyTop = "17%";
        let headTop = this.billClass === "ME01" ? "-9%" : "-13%";
        this.$print.printListHtmVertical(this, headHtml, bodyHtml, {
          headTop: headTop,
          headHeight: "27%",
          bodyTop: bodyTop,
          bodyLeft: "1%",
          bodyWidth: "99%",
          bodyHeight: "BottomMargin:20mm",
          bodyHtmlHeight:this.$refs.endo.$refs.body.offsetHeight,
          bodyHtmlWidth:this.$refs.endo.$refs.body.offsetWidth,
          headHtmlHeight:this.$refs.endo.$refs.head.offsetHeight
        }, null, this.printStyles);
      },
      billAdditionalInfoPrint() {
        let headHtml = this.$refs.billAdditionalInfo.$refs.head.innerHTML;
        let bodyHtml = this.$refs.billAdditionalInfo.$refs.body.outerHTML;
        let printStyles = this.printStyles;
        printStyles = printStyles.replace( "</style>",".under { margin-top: 20px;border-collapse: collapse;border-spacing: 0;width: 100%;}.th1 {text-align: left;color: #333333;}.busi-info {float: left;width: 100%}</style>");
        this.$print.printHtmLandscape(this, headHtml, bodyHtml, "票据附加信息",0,printStyles);
      },
      printPdf() {
        let headHtmlList = [];
        let bodyHtmlList = [];
        let options = [];
        this.tempDropdownItemProps.forEach((item) => {
          if (item.isDropdownItemChecked) {
            headHtmlList.push(this.$refs[item.name].$refs.head.innerHTML);
            bodyHtmlList.push(this.$refs[item.name].$refs.body.outerHTML);
            item.isDropdownItemChecked = false;
            let bodyTop = this.billClass === "ME01" ? "20%" : "25%";
            let headTop = this.billClass === "ME01" ? "-5%" : "-8%";
            // if (item.name === "billFront") {
            //   headTop = "4%";
            //   bodyTop = this.billClass === "ME01" ? "13%" : "27%";
            // }
            options.push({
              setPrinter: this.printerName,
              headTop: headTop,
              headHeight: "27%",
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
      }
    }
  };
</script>

<style scoped>
</style>
