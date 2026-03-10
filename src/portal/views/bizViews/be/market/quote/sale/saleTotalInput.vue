<template>
  <div>
    <h-form-item :label="$t('m.i.common.busiType')" prop="busiType" required class="h-form-three">
      <h-select v-model="formItem.busiType" placeholder="请选择" readonly>
        <h-option v-for="item in dictMap['busiTypeList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
      </h-select>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.quoteNo')" prop="quoteNo" class="h-form-three">
      <h-input v-model="formItem.quoteNo" placeholder="" readonly></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.brchName')" prop="buyBrchName" required class="h-form-three">
      <h-input v-model="formItem.buyBrchName" placeholder="" readonly></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.traderName')" prop="buyTraderName" required class="h-form-three h-form-long-label">
      <h-input v-model="formItem.buyTraderName" placeholder="" readonly></h-input>
    </h-form-item>
    <show-cpes-branch :label="$t('m.i.be.otherBrchName')" :required="true" class="h-form-three"
                      :brchCode.sync="formItem.saleBrchCode"  :cpesBrchName.sync="formItem.saleBrchName"
                      :clearable="false"  placeholder=""  :msgBoxWin="saleTotalChangeWin"
                      prop="saleBrchName"  :cpesBrchParams="{'memberId':this.formItem.memberId}"
                      datagridUrl="/cpes/branch/queryBranchList"  @cpesBranchChange="saleBrchNameChange($event)"
                      queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>


    <h-form-item :label="$t('m.i.be.custBrchCode')" prop="saleBrchCode" required class="h-form-three">
      <h-input v-model="formItem.saleBrchCode" placeholder="" readonly></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.custProductNo')" prop="saleProductName" :required="brchType==='5'" class="h-form-three  h-form-long-label">
      <h-input v-if="brchType==='5'" v-model="formItem.saleProductName" placeholder="" readonly icon="android-search"
               @on-click="queryBranchName"></h-input>
      <h-input v-else v-model="formItem.saleProductName" placeholder="" readonly></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.custTraderName')" prop="saleTraderName" required class="h-form-three h-form-long-label">
      <h-input v-model="formItem.saleTraderName" placeholder="" readonly icon="android-search"
               @on-click="queryTrader"></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.custTraderNo')" prop="saleTraderNo" required class="h-form-three h-form-long-label">
      <h-input v-model="formItem.saleTraderNo" placeholder="" readonly></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.subDeal')" prop="subDeal" required class="h-form-three">
      <h-select v-model="formItem.subDeal" placeholder="">
        <h-option v-for="item in dictMap['YonList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
      </h-select>
    </h-form-item>
    <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType" required class="h-form-three">
      <h-select v-model="formItem.billType" placeholder="">
        <h-option v-for="item in dictMap['billTypeList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
      </h-select>
    </h-form-item>
    <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass" required class="h-form-three">
      <h-select v-model="formItem.billClass" placeholder="">
        <h-option v-for="item in dictMap['billClassList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
      </h-select>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.clearType')" prop="clearType" required class="h-form-three">
      <h-select v-model="formItem.clearType" placeholder="">
        <h-option v-for="item in dictMap['ClearTypeList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
      </h-select>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.settleMode')" prop="settleMode" required class="h-form-three">
      <h-select v-model="formItem.settleMode" placeholder="">
        <h-option v-for="item in dictMap['SettleType']" :value="item.key" :key="item.key">{{item.value }}</h-option>
      </h-select>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.clearSpeed')" prop="clearSpeed" required class="h-form-three">
      <h-select v-model="formItem.clearSpeed" placeholder="" @on-change="changeSpeed">
        <h-option v-for="item in dictMap['clearSpeed']" :value="item.key" :key="item.key">{{item.value }}</h-option>
      </h-select>
    </h-form-item>
    <keep-alive>
      <component :is="busiType" :formItem="formItem" :dictMap="dictMap">
      </component>
    </keep-alive>
    <slot name="save"></slot>
    <!-- 查询票交机构代码 -->
    <show-cpes-branch-old :showCpesBranch="showCpesBranch" :memberId="memberId" :showMemberId="showMemberId"
                      @showCpesBranchClose="showCpesBranchClose" :params="unLeagelForm" :brchType="productBrchType"
                      @showCpesBranchSubmit="showCpesBranchSubmit"></show-cpes-branch-old>
    <trader-user :userTraderWin="userTraderWin" :brchCode="saleBrchCode" :memberId="memberId"
                 @userTraderChange="userTraderChange" @userTraderWinClose="userTraderWinClose">
    </trader-user>
  </div>
</template>
<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "saleTotalInput",
    data() {
      return {
        isCurChange: this.isChange,
        YonList: [],
        acptBankTypesList: [],
        billTypeList: [],
        showCpesBranch: false,
        userTraderWin: false,
        saleBrchCode: "",
        memberId: "",
        productBrchType : "4",//资管非法人产品机构类型
        showMemberId: false,
        unLeagelForm: {
          qryUnincorporatedProductFlag: "1",
          memberId: ""
        }

      };
    },
    components: {
      BT01:()=>import(/* webpackChunkName: "be/market/quote/sale/BT01" */`@/views/bizViews/be/market/quote/sale/BT01`),
      BT02:()=>import(/* webpackChunkName: "be/market/quote/sale/BT02" */`@/views/bizViews/be/market/quote/sale/BT02`),
      BT03:()=>import(/* webpackChunkName: "be/market/quote/sale/BT03" */`@/views/bizViews/be/market/quote/sale/BT03`),
      ShowCpesBranchOld:()=>import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
      traderUser:()=>import(/* webpackChunkName: "sm/auth/branch/userTraderByBrchNoSearch" */`@/views/bizViews/sm/auth/branch/userTraderByBrchNoSearch`)
    },
    props: {
      busiType: String,
      brchType: String,
      formItem: {
        type: Object
      },
      dictMap: {
        type: Object
      },
      saleTotalChangeWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      isChange: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    watch: {
      busiType(val) {
        this.isCurChange = this.isChange;
        this.formItem.busiType = val;
      }
    },
    methods: {
      showCpesBranchClose() {
        this.memberId = null;
        this.showCpesBranch = false;
      },
      saleBrchNameChange(info){
        if(info.length>0){
          this.formItem.saleProductNo = null;
          this.formItem.saleProductName = null;
          this.formItem.saleTraderNo = null;
          this.formItem.saleTraderName = null;
          this.saleBrchCode = this.formItem.saleBrchCode;
          this.brchType = info[0].brchType;
          this.unLeagelForm.memberId = info[0].memberId;
          this.memberId = null;
          this.$parent.validateField('saleBrchName');
          this.$parent.validateField('saleBrchCode');
          this.getQuoteParameter();
        }
      },
      //根据弹框所选数据进行赋值
      showCpesBranchSubmit(info) {
        if (info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.saleProductNo = info.brchCode;
        this.formItem.saleProductName = info.brchFullNameZh;
        this.$parent.validateField('saleProductName');
        this.showCpesBranch = false;
      },
      // 挑选机构名称
      queryBranchName() {
        this.memberId = this.formItem.memberId;
        this.showCpesBranch = true;
      },
      // 挑选交易员
      queryTrader() {
        this.memberId = this.formItem.memberId;
        this.saleBrchCode = this.formItem.saleBrchCode;
        this.userTraderWin = true;
      },
      userTraderChange(info) {
        if (info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.saleTraderNo = info.traderId;
        this.formItem.saleTraderName = info.traderName;
        this.formItem.saleBrchCode = info.brchCode;
        this.formItem.saleBrchName = info.brchFullNameZh;
        this.brchType = info.brchType;
        this.userTraderWin = false;
        this.memberId = null;
        this.$parent.validateField('saleTraderName');
        this.$parent.validateField('saleTraderNo');
        this.getQuoteParameter();
      },
      userTraderWinClose() {
        this.memberId = null;
        this.userTraderWin = false;
      },
      //选择清算速度， 在清算速度改变后修改结算日期
      changeSpeed(currVal) {
        if (!this.isCurChange) {
          this.isCurChange = true;
          return;
        }
        // T+1 情况
        let dueSettleDt = this.formItem.dueSettleDt;
        if (currVal === "CS01") {
          let workDate = this.$moment(this.formItem.workDate, "YYYYMMDD").format("YYYY/MM/DD");
          workDate = new Date(workDate);
          let workDatePlus = workDate.valueOf() + (1 * 24 * 60 * 60 * 1000);
          workDatePlus = new Date(workDatePlus);
          workDatePlus = this.$moment(workDatePlus, "YYYYMMDD").format("YYYYMMDD");
          post({ code: workDatePlus }, "/sm/oper/holiday/getWorkDate").then(res => {
            if (res && res.data.retCode === "000000") {
              this.formItem.firstSettleDt = this.$moment(res.data.retData, "YYYYMMDD").format("YYYY-MM-DD");
              if (this.formItem.busiType !== "BT01" && dueSettleDt) {
                dueSettleDt = Date.parse(dueSettleDt.replace(/-/g, "/"));
                let firstSettleDt = Date.parse(this.formItem.firstSettleDt.replace(/-/g, "/"));
                dueSettleDt = new Date(dueSettleDt);
                firstSettleDt = new Date(firstSettleDt);
                let days = (dueSettleDt.getTime() - firstSettleDt.getTime()) / (24 * 60 * 60 * 1000);
                this.formItem.tenorDays = days;
              }
            }
          });
        } else {
          this.formItem.firstSettleDt = this.$moment(this.formItem.workDate, "YYYYMMDD").format("YYYY-MM-DD");
          if (this.formItem.busiType !== "BT01" && dueSettleDt) {
            dueSettleDt = Date.parse(dueSettleDt.replace(/-/g, "/"));
            let firstSettleDt = Date.parse(this.formItem.firstSettleDt.replace(/-/g, "/"));
            dueSettleDt = new Date(dueSettleDt);
            firstSettleDt = new Date(firstSettleDt);
            let days = (dueSettleDt.getTime() - firstSettleDt.getTime()) / (24 * 60 * 60 * 1000);
            this.formItem.tenorDays = days;
          }
        }

      },
      getQuoteParameter() {
        let busiType = this.formItem.busiType;
        let reqBranchCode = this.formItem.saleBrchCode;
        let cpBranchCode = this.formItem.buyBrchCode;
        let url = "/be/market/quote/sale/saleTotalColl/func_getQuoteSaleParameterInfo";
        post({ busiType: busiType, reqBranchCode: reqBranchCode, cpBranchCode: cpBranchCode }, url).then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            let obj = res.data.retData;
            if (retCode == "000000") {
              this.formItem.productMapDict=obj.productMap;
              this.formItem.quoteTm = obj.quoteTm;
              this.formItem.settleMode = obj.settleMode;
              this.formItem.setTm = obj.setTm;
              this.formItem.prodNo = obj.prodNo;
              this.formItem.isInner = obj.isInner;
              this.$parent.validateField('prodNo');
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      }
    }


  };
</script>

