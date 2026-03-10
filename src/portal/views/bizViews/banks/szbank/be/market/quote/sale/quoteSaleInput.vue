<template>
  <div>
    <h-form-item :label="$t('m.i.common.busiType')" prop="busiType" required class="h-form-three">
      <h-select v-model="formItem.busiType" placeholder="请选择" readonly showTitle>
        <h-option v-for="item in dictMap['busiTypeList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
      </h-select>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.quoteNo')" prop="quoteNo" class="h-form-three">
      <h-input v-model="formItem.quoteNo" placeholder="" readonly></h-input>
    </h-form-item>
    <show-branch v-model="formItem.saleBrchName"  :label="$t('m.i.be.brchName')"  :msgBoxWin="quoteChangeWin"   prop="saleBrchName"
                 :filterable="this.licenseFlag"       :showCheckBox="false"     :brchNo.sync="formItem.ownedBrchNo" :brchName.sync="formItem.saleBrchName"
                 :params="{authPath:this.$route.path}"  @brchNoChange="licenseBrchNoChange($event)"
                 url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                 queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
    </show-branch>
    <h-form-item :label="$t('m.i.be.traderName')" prop="saleTraderName" required class="h-form-three h-form-long-label">
      <h-input v-model="formItem.saleTraderName" placeholder="" readonly :icon="this.licenseFlag===true?'android-search':''"
               @on-click="querySaleTrader"></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.custBrchCode')" prop="buyBrchCode" :required="!(formItem.isTemStorage&&formItem.isTemStorage=='1'&&!formItem.quoteNo)"   class="h-form-three">
      <h-input v-if="formItem.quoteNo" v-model="formItem.buyBrchCode" placeholder="" readonly></h-input>
      <h-input v-else v-model="formItem.buyBrchCode" placeholder=""  :maxlength="9" @on-change="getBranchName" icon="android-search" @on-click="queryBranchName"></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.otherBrchName')" prop="buyBrchName" :required="!(formItem.isTemStorage&&formItem.isTemStorage=='1'&&!formItem.quoteNo)"  class="h-form-three">
      <h-input v-if="formItem.quoteNo" v-model="formItem.buyBrchName" placeholder="" readonly></h-input>
      <h-input v-else v-model="formItem.buyBrchName" placeholder="" readonly  :title="formItem.buyBrchName"></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.custProductNo')" prop="buyProductName" :required="brchType==='5'||formItem.brchType==='5'"
                 class="h-form-three" :class="{'h-form-long-label':brchType==='5'||formItem.brchType==='5'}">
      <h-input v-if="formItem.quoteNo||(brchType!=='5'&&formItem.brchType!=='5')" v-model="formItem.buyProductName"
               placeholder="" readonly></h-input>
      <h-input v-else v-model="formItem.buyProductName" placeholder="" readonly icon="android-search"
               @on-click="queryProductName"></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.custTraderName')" prop="buyTraderName" :required="!(formItem.isTemStorage&&formItem.isTemStorage=='1'&&!formItem.quoteNo)"
                 class="h-form-three"  :class="{'h-form-long-label':!(formItem.isTemStorage&&formItem.isTemStorage=='1'&&!formItem.quoteNo)}">
      <h-input v-if="formItem.quoteNo" v-model="formItem.buyTraderName" placeholder="" readonly></h-input>
      <h-input v-else v-model="formItem.buyTraderName" placeholder="" readonly icon="android-search"
               @on-click="queryTrader"></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.custTraderNo')" prop="buyTraderNo" :required="!(formItem.isTemStorage&&formItem.isTemStorage=='1'&&!formItem.quoteNo)"
                 class="h-form-three h-form-parentheses-label">
      <h-input v-model="formItem.buyTraderNo" placeholder="" readonly></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.subDeal')" prop="subDeal" required class="h-form-three">
      <h-select v-model="formItem.subDeal" placeholder="" showTitle :readonly="formItem.isSendDraft==='0'">
        <h-option v-for="item in dictMap['YonList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
      </h-select>
    </h-form-item>
    <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType" required class="h-form-three">
      <h-select v-if="formItem.quoteNo" v-model="formItem.billType" placeholder="" readonly showTitle>
        <h-option v-for="item in dictMap['billTypeList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
      </h-select>
      <h-select v-else v-model="formItem.billType" placeholder="" showTitle>
        <h-option v-for="item in dictMap['billTypeList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
      </h-select>
    </h-form-item>
    <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass" required class="h-form-three">
      <h-select v-if="formItem.quoteNo" v-model="formItem.billClass" placeholder="" readonly showTitle>
        <h-option v-for="item in dictMap['billClassList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
      </h-select>
      <h-select v-else v-model="formItem.billClass" placeholder="" showTitle>
        <h-option v-for="item in dictMap['billClassList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
      </h-select>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.clearType')" prop="clearType" required class="h-form-three">
      <h-select v-model="formItem.clearType" placeholder="" showTitle>
        <h-option v-for="item in dictMap['ClearTypeList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
      </h-select>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.settleMode')" prop="settleMode" :required="!(formItem.isTemStorage&&formItem.isTemStorage=='1'&&!formItem.quoteNo)" class="h-form-three">
      <h-select v-model="formItem.settleMode" placeholder="" showTitle>
        <h-option v-for="item in dictMap['SettleType']" :value="item.key" :key="item.key">{{item.value }}</h-option>
      </h-select>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.clearSpeed')" prop="clearSpeed" required class="h-form-three">
      <h-select v-model="formItem.clearSpeed" placeholder="" @on-change="changeSpeed" showTitle :readonly="formItem.isSendDraft==='0'">
        <h-option v-for="item in dictMap['clearSpeed']" :value="item.key" :key="item.key">{{item.value }}</h-option>
      </h-select>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.preAuditNo')" prop="auditNo" class="h-form-three" v-if="formItem.isPreAudit==='1'">
      <h-input v-model="formItem.auditNo" placeholder="" readonly icon="android-search" @on-click="queryPreAudit"></h-input>
    </h-form-item>
    <h-form-item prop="isNoticeFirstAudit" label="是否通知审批第一岗" required class="h-form-long-label" v-if="formItem.showNoticeFirstStationItem">
      <h-select v-model="formItem.isNoticeFirstAudit" :label-in-value="true" placeholder="">
        <h-option value="1">是</h-option>
        <h-option value="0">否</h-option>
      </h-select>
    </h-form-item>
    <keep-alive>
      <component :is="busiType" :formItem="formItem" :dictMap="dictMap" :quoteChangeWin="quoteChangeWin">
      </component>
    </keep-alive>
    <slot name="save"></slot>
    <!-- 查询票交机构代码 -->
    <show-cpes-branch :showCpesBranch="showCpesBranch" @showCpesBranchClose="showCpesBranchClose"
                      @showCpesBranchSubmit="showCpesBranchSubmit"></show-cpes-branch>
    <show-cpes-branch :showCpesBranch="showCpesProductBranch" @showCpesBranchClose="showCpesProductBranchClose"
                      :showMemberId="false" :memberId="memberId" :brchType="productBrchType"
                      @showCpesBranchSubmit="showCpesProductBranchSubmit"></show-cpes-branch>
    <trader-user :userTraderWin="userTraderWin" :brchCode="buyBrchCode" @userTraderChange="userTraderChange"
                 @userTraderWinClose="userTraderWinClose">
    </trader-user>

    <trader-user :userTraderWin="userTraderSaleWin" :brchCode="saleBrchCode" @userTraderChange="userTraderSaleChange"
                 @userTraderWinClose="userTraderSaleWinClose">
    </trader-user>
    <show-pass-pre-audit :showPassPreAuditWin="showPassPreAuditWin" :batchURL="auditBatchURL" :prodNo="formItem.prodNo" :brchCode="formItem.saleBrchCode"
                         @showPassPreAuditWinClose="showPassPreAuditWinClose" @pickPassPreAudit="pickPassPreAudit" :busiType="formItem.busiType"
                         :billClass="formItem.billClass" :billType="formItem.billType"></show-pass-pre-audit>
  </div>
</template>
<script>
  import {post} from "@/api/bizApi/commonUtil";

  export default {
    name: "quoteSaleInput",
    data() {
      return {
        isCurChange: this.isChange,
        YonList: [],
        acptBankTypesList: [],
        billTypeList: [],
        showCpesBranch: false,
        showCpesProductBranch: false,
        memberId: "",
        userTraderWin: false,
        userTraderSaleWin: false,
        buyBrchCode: "",
        saleBrchCode: "",
        brchType: "",
        productBrchType: "4",//资管非法人产品机构类型
        showPassPreAuditWin: false,
        auditBatchURL:"/be/market/quote/quoteManager/func_findPassBatchByPage",
      };
    },
    components: {
      BT01:()=>import(/* webpackChunkName: "banks/szbank/be/market/quote/sale/BT01" */`@/views/bizViews/banks/szbank/be/market/quote/sale/BT01`),
      BT02:()=>import(/* webpackChunkName: "be/market/quote/sale/BT02" */`@/views/bizViews/be/market/quote/sale/BT02`),
      BT03:()=>import(/* webpackChunkName: "be/market/quote/sale/BT03" */`@/views/bizViews/be/market/quote/sale/BT03`),
      ShowCpesBranch:()=>import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
      traderUser:()=>import(/* webpackChunkName: "sm/auth/branch/userTraderByBrchNoSearch" */`@/views/bizViews/sm/auth/branch/userTraderByBrchNoSearch`),
      ShowPassPreAudit:()=>import(/* webpackChunkName: "be/market/preaudit/showPassPreAudit" */`@/views/bizViews/be/market/preaudit/showPassPreAudit`),
    },
    props: {
      busiType: String,
      authPath:"",
      formItem: {
        type: Object
      },
      dictMap: {
        type: Object
      },
      licenseFlag: {
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
      },
      quoteChangeWin: {
        type: Boolean,
        default:false
      }
    },
    watch: {
      busiType(val) {
        this.isCurChange = this.isChange;
        this.formItem.busiType = val;
        this.buyBrchCode = null;
      }
    },
    methods: {
      showCpesBranchClose() {
        this.showCpesBranch = false;
      },
      showCpesProductBranchClose() {
        this.showCpesProductBranch = false;
      },

      //根据弹框所选数据进行赋值
      showCpesBranchSubmit(info) {
        if (info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.buyBrchCode = info.brchCode;
        this.formItem.buyBrchName = info.brchFullNameZh;
        this.formItem.buyProductNo = null;
        this.formItem.buyProductName = null;
        this.formItem.buyTraderNo = null;
        this.formItem.buyTraderName = null;
        this.buyBrchCode = this.formItem.buyBrchCode;
        this.brchType = info.brchType;
        this.formItem.brchType = info.brchType;
        if (this.brchType === "5") {
          this.memberId = info.memberId;
        }
        this.showCpesBranch = false;
        this.$parent.validateField('buyBrchName');
        this.$parent.validateField('buyBrchCode');
        this.getQuoteParameter();
      },
      // 挑选机构名称
      queryBranchName() {
        this.showCpesBranch = true;
      },
      getBranchName(){
        if (this.formItem.buyBrchCode.trim().length == 9) {
          post({brchCode:this.formItem.buyBrchCode}, "/cpes/branch/queryBranchList").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                if (res.data.retData.list.length > 0) {
                  this.showCpesBranchSubmit(res.data.retData.list[0]);
                }
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            }
          }).catch(error => {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
          });
        } else {
          this.formItem.buyBrchName = "";
          this.formItem.buyTraderNo = null;
          this.formItem.buyTraderName = null;
        }
      },
      // 根据弹框所选数据进行赋值
      showCpesProductBranchSubmit(info) {
        if (info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.buyProductNo = info.brchCode;
        this.formItem.buyProductName = info.brchFullNameZh;
        this.$parent.validateField('buyProductName');
        this.showCpesProductBranch = false;
      },
      queryProductName() {
        this.showCpesProductBranch = true;
      },
      // 挑选交易员
      queryTrader() {
        this.buyBrchCode = this.formItem.buyBrchCode;
        this.userTraderWin = true;
      },
      querySaleTrader() {
        this.saleBrchCode = this.formItem.saleBrchCode;
        this.userTraderSaleWin = true;
      },

      userTraderChange(info) {
        if (info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.buyTraderNo = info.traderId;
        this.formItem.buyTraderName = info.traderName;
        this.formItem.buyBrchCode = info.brchCode;
        this.formItem.buyBrchName = info.brchFullNameZh;
        this.brchType = info.brchType;
        this.formItem.brchType = info.brchType;
        if (this.brchType === "5") {
          this.memberId = info.memberId;
        }
        this.$parent.validateField('buyTraderName');
        this.$parent.validateField('buyTraderNo');
        this.userTraderWin = false;
        this.getQuoteParameter();
      },
      userTraderWinClose() {
        this.userTraderWin = false;
      },
      userTraderSaleChange(info) {
        if (info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.saleTraderNo = info.traderId;
        this.formItem.saleTraderName = info.traderName;
        this.formItem.memberId = info.memberId;
        this.$parent.validateField('saleTraderName');
        this.userTraderSaleWin = false;
      },
      userTraderSaleWinClose() {
        this.userTraderSaleWin = false;
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
        let url = "/be/market/quote/quoteManager/func_getQuoteSaleParameterInfo";
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
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      queryPreAudit(){
        this.showPassPreAuditWin = true;
      },
      showPassPreAuditWinClose(){
        this.showPassPreAuditWin = false;
      },
      pickPassPreAudit(data){
        if(data){
          this.formItem.auditNo = data.preAuditNo;
        }else {
          this.formItem.auditNo = "";
        }
        this.showPassPreAuditWin = false;
      },

      licenseBrchNoChange(info) {
          if(info.length>0){
              this.formItem.saleBrchCode = info[0].orgCode;
              this.formItem.saleTraderNo = '';
              this.formItem.saleTraderName = '';
              this.$parent.validateField('saleBrchName');
          }
      },
    }


  };
</script>

