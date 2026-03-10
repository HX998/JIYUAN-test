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
      <span>纸票登记信息详情</span>
    </p>
    <keep-alive>
      <component :is="this.rgstClass+'BillFront'" :billInfo="this.billInfo" :chineseMoney="this.chineseMoney" :dictMap="this.dictMap" :format4="format4" ref="rgstBillFront"></component>
    </keep-alive>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  import { post, getParamValuesByKeys } from "@/api/bizApi/commonUtil";

  export default {
    name: "rgstBillInfoMain",
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
        rgstClass: "RI00",
        billPane : "",
        endoParams : {},
        showInqrepUpsb: false,


      };
    },
    components: {
    },
    mounted() {},
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
      //票据号码
      billNo: {
        type:String,
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
          this.getDictListByGroups("Yon,DraftTypeCode,EcdsBillStatusCode,CfmAppType,SignUpMarkCode,Industry,AnlgSspdType,SspdType,CorpScale,BuyBackStatus,ExchgStatus,DishonorCode,StlResult,RefuseReason,Province,ImgType,ImgStatus,BanEndorsementMarkCode,EcdsDishonorCode,UpbsQueryAnswerStatus,UpbsQueryType,CpesFlowStatus,EcdsRecourseType,EcdsRefuseCode").then(res => {
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
        this.$emit("billInfoWinClose", "");
      },
      //初始化页面
      init() {
        this.billPane = "billFront";
        //获取票面信息
        let data = {};
        let url = "";
        if (this.billId) {
          data = { id: this.billId };
          url = "/ce/cpesrgst/billInfo/rgstBillInfo/func_queryPaperRgstById";
        }  else {
          this.$msgTip.error(this, { info: "无法获取登记ID" });
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
                this.billClass = this.billInfo.billClass;
                this.billType = this.billInfo.billType;
                this.rgstClass = this.billInfo.rgstClass;
                if(this.rgstClass === "RI08"){
                  data = { id: this.billId };
                  url = "/ce/cpesrgst/cancelStopPaymentRgst/cancelStopPaymentRgstApply/func_queryPaperRgstById";
                  post(data, url).then(res => {
                    if (res) {
                      this.billInfo = res.data.retData;
                    }else {
                      this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                    }
                  });
                }
                this.changeClass(this.billClass, this.billType);
                this.chineseMoney.bigMoney = this.arabia_To_SimplifiedChinese(
                  this.billInfo.billMoney
                );
                this.chineseMoney.smallMoney = this.arabia_To_Char(
                  this.billInfo.billMoney
                );
                // let tabArray = this.$refs.closetab.$el.querySelectorAll('.h-tabs-tab');
                // if (this.billInfo.billClass === "ME02" && this.$refs.closetab.$children.length > 4) {
                //   tabArray[4].style.display = "none";
                //   tabArray[5].style.display = "none";
                // } else {
                //   tabArray[4].style.display = "";
                //   tabArray[5].style.display = "";
                // }
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
    }
  };
</script>

<style scoped>
</style>
