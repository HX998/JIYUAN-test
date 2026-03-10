<template>
  <h-msg-box
      maximize
      v-model="tempBillInfoWin"
      width="1000"
      :height="getHeight"
      @on-close="handleClose"
      class="h-ticket-layer"
      top="10"
      :z-index="1010">
    <p slot="header">
      <span>查看票样</span>
    </p>
    <h-tabs :animated="false" :value="billPane" @on-click="clickTabs" ref="closetab">
      <h-tab-pane :label="$t('m.i.pc.billFront')" name="billFront" :class="this.tabPaneClass">
        <keep-alive>
          <component :is="'bopp'+this.billClass+'BillFront'" :billInfo="this.billInfo" :chineseMoney="this.chineseMoney"
                     :dictMap="this.dictMap" :format4="format4" ref="billFront"></component>
        </keep-alive>
      </h-tab-pane>
      <h-tab-pane :label="$t('m.i.pc.billEndo')" name="outEndo" :class="this.tabPaneClass">
        <keep-alive>
          <component
              :is="'boppOutEndo'"
              :endoParams="endoParams"
              ref="outEndo"
              :dictMap="this.dictMap"
          ></component>
        </keep-alive>
      </h-tab-pane>
    </h-tabs>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{ $t("m.i.common.close") }}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
import {getDictListByGroups, post} from "@/api/bizApi/commonUtil";

export default {
  name: "billInfoMain",
  data() {
    return {
      dictMap: new Map(),
      billInfo: {},
      chineseMoney: {},
      pinkClass: "h-ticket h-t_pink",
      orangeClass: "h-ticket h-t_orange",
      tabPaneClass: "",
      billClass: "ME02",
      billType: "AC01",
      billPane: "",
      endoParams: {},
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
    //登记中心ID
    billId: "",
  },
  watch: {
    showBillInfoWin(val) {
      if (val) {
        //页面打开
        getDictListByGroups("BanEndorsementMarkCode,BillStatusCode,BillCirStatusCode,IsAllowSplitBill").then(res => {
          this.dictMap = res.get("map");
          this.init();
        });
      }
    }
  },
  methods: {
    //关闭页面处理
    handleClose() {
      this.billInfo = {};
      this.$emit("billInfoWinClose", "");
    },
    //初始化页面
    init() {
      this.billPane = "billFront";
      //获取票面信息
      let data = {};
      let url = "";
      if (this.billId) {
        data = {billId: this.billId};
        url = "/pay/payment/billInfo/billInfoMain/queryPayBillInfoDtoById";
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
                billRange: this.billInfo.billRange,
                billClass: "ME02",
                billType: this.billInfo.billType
              };
              this.billClass = "ME02";
              this.billType = this.billInfo.billType;
              this.changeClass(this.billType);
              this.chineseMoney.bigMoney = this.arabia_To_SimplifiedChinese(
                  this.billInfo.billMoney
              );
              this.chineseMoney.smallMoney = this.arabia_To_Char(
                  this.billInfo.billMoney
              );
              this.getOtherInfo(this.billInfo.id);
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
    changeClass(billType) {
      if (billType === "AC01") {
        //银票
        this.tabPaneClass = this.pinkClass;
      } else {
        //商票
        this.tabPaneClass = this.orangeClass;
      }
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
    },
    //获取背书信息中的场内场外背书
    divisionEndoInfo(data) {
      this.$refs.outEndo.creatEndo(data);
    },
    getOtherInfo(billId) {
      //获取背书信息
      post({billId: billId}, "/pay/payment/billInfo/billInfoMain/queryPayEndoInfoDtoListByBillId").then(res => {
        if (res) {
          let msg = res.data.retMsg;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            if (res.data.retData){
              this.divisionEndoInfo(res.data.retData);
            }
          } else {
            this.$msgTip.error(this, {info: msg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    },
  }
};
</script>

<style scoped>
</style>
