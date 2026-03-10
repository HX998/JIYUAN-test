<template>
  <div>
    <h-form-item :label="$t('m.i.common.busiType')" prop="innerBusiType" required class="h-form-three">
      <h-select v-model="formItem.innerBusiType" placeholder="请选择" readonly >
        <h-option v-for="item in this.dictMap['busiTypeList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
      </h-select>
    </h-form-item>

    <show-branch v-model="formItem.saleBrchName"  :label="$t('m.i.be.brchName')"  :msgBoxWin="quoteChangeWin"   prop="saleBrchName"
                 :filterable="this.licenseFlag"       :showCheckBox="false"     :brchNo.sync="formItem.ownedBrchNo" :brchName.sync="formItem.saleBrchName"
                 :params="{authPath:this.$route.path}"  @brchNoChange="licenseBrchNoChange($event)"
                 url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                 queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
    </show-branch>
    <h-form-item :label="$t('m.i.be.traderName')" prop="saleTraderName" required class="h-form-three h-form-long-label">
      <h-input v-model="formItem.saleTraderName" placeholder="" readonly ></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.innerBuyBrchName')" prop="innerBuyBrchName" required class="h-form-three">
      <h-input v-model="formItem.innerBuyBrchName" placeholder="" readonly :icon="this.isInnerBuyBrch===false?'android-search':''" @on-click="queryInnerBranchName"></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.innerBuyBrchCode')" prop="innerBuyBrchCode" required class="h-form-three">
      <h-input v-model="formItem.innerBuyBrchCode" placeholder="" readonly ></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.innerBuyTraderName')" prop="innerBuyTraderName" required class="h-form-three h-form-long-label">
      <h-input v-model="formItem.innerBuyTraderName" placeholder="" readonly :icon="this.isInnerBuyTrader===false?'android-search':''"   @on-click="queryInnerSaleTrader"></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.innerBuyTraderNo')" prop="innerBuyTraderNo" required class="h-form-three">
      <h-input v-model="formItem.innerBuyTraderNo" placeholder="" readonly ></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.outBuyBrchName')" prop="outBuyBrchName" required class="h-form-three">
      <h-input v-model="formItem.outBuyBrchName" placeholder="" readonly icon="android-search" @on-click="queryBranchName"></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.outBuyBrchCode')" prop="outBuyBrchCode" required class="h-form-three">
      <h-input v-model="formItem.outBuyBrchCode" placeholder="" readonly :icon="this.licenseFlag===true?'android-search':''"></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.outBuyTraderName')" prop="outBuyTraderName" required class="h-form-three h-form-long-label">
      <h-input v-model="formItem.outBuyTraderName" placeholder="" readonly icon="android-search"    @on-click="queryTrader"></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.outBuyTraderNo')" prop="outBuyTraderNo" required class="h-form-three">
      <h-input v-model="formItem.outBuyTraderNo" placeholder="" readonly :icon="this.licenseFlag===true?'android-search':''"></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.subDeal')" prop="subDeal" required class="h-form-three">
      <h-select v-model="formItem.subDeal" placeholder="" showTitle readonly>
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
    <h-form-item :label="$t('m.i.be.innerClearType')" prop="innerClearType" required class="h-form-three">
      <h-select v-model="formItem.innerClearType" placeholder="" showTitle>
        <h-option v-for="item in dictMap['ClearTypeList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
      </h-select>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.outClearType')" prop="outClearType" required class="h-form-three">
      <h-select v-model="formItem.outClearType" placeholder="" showTitle>
        <h-option v-for="item in dictMap['ClearTypeList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
      </h-select>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.innerSettleMode')" prop="innerSettleMode" required class="h-form-three">
      <h-select v-model="formItem.innerSettleMode" placeholder="" showTitle readonly>
        <h-option v-for="item in dictMap['SettleType']" :value="item.key" :key="item.key">{{item.value }}</h-option>
      </h-select>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.outSettleMode')" prop="outSettleMode" :required="!(formItem.isTemStorage&&formItem.isTemStorage=='1'&&!formItem.quoteNo)" class="h-form-three">
      <h-select v-model="formItem.outSettleMode" placeholder="" showTitle>
        <h-option v-for="item in dictMap['SettleType']" :value="item.key" :key="item.key">{{item.value }}</h-option>
      </h-select>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.innerClearSpeed')" prop="innerClearSpeed" required class="h-form-three">
      <h-select v-model="formItem.innerClearSpeed" placeholder="" @on-change="changeInnerSpeed" showTitle>
        <h-option v-for="item in dictMap['clearSpeed']" :value="item.key" :key="item.key">{{item.value }}</h-option>
      </h-select>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.outClearSpeed')" prop="outClearSpeed" required class="h-form-three">
      <h-select v-model="formItem.outClearSpeed" placeholder="" @on-change="changeOutSpeed" showTitle>
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
      <component :is="busiType" :formItem="formItem" :dictMap="dictMap">
      </component>
    </keep-alive>
    <slot name="save"></slot>
    <!-- 查询票交机构代码 -->
    <show-cpes-branch :showCpesBranch="showCpesInnerBranch" @showCpesBranchClose="showCpesInnerBranchClose"
                      @showCpesBranchSubmit="showCpesInnerBranchSubmit"></show-cpes-branch>
    <show-cpes-branch :showCpesBranch="showCpesBranch" @showCpesBranchClose="showCpesBranchClose"
                      @showCpesBranchSubmit="showCpesBranchSubmit"></show-cpes-branch>
    <show-cpes-branch :showCpesBranch="showCpesProductBranch" @showCpesBranchClose="showCpesProductBranchClose"
                      :showMemberId="false" :memberId="memberId" :brchType="productBrchType"
                      @showCpesBranchSubmit="showCpesProductBranchSubmit"></show-cpes-branch>
    <trader-user :userTraderWin="userTraderWin" :brchCode="outBuyBrchCode" @userTraderChange="userTraderChange"
                 @userTraderWinClose="userTraderWinClose">
    </trader-user>

    <trader-user :userTraderWin="userTraderSaleWin" :brchCode="innerBuyBrchCode" @userTraderChange="userTraderSaleChange"
                 @userTraderWinClose="userTraderSaleWinClose">
    </trader-user>
    <show-pass-pre-audit :showPassPreAuditWin="showPassPreAuditWin" :batchURL="auditBatchURL" :prodNo="formItem.prodNo" :brchCode="formItem.saleBrchCode"
                         @showPassPreAuditWinClose="showPassPreAuditWinClose" @pickPassPreAudit="pickPassPreAudit" :busiType="formItem.busiType"
                         :billClass="formItem.billClass" :billType="formItem.billType"></show-pass-pre-audit>

    <!-- 授权机构查询 -->
    <!-- <show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="licenseBrchNoChange" :authPath="authPath"
                          @showBranchWinClose="brchNoWinClose" :ifcheck="false"></show-license-branch>-->

  </div>
</template>
<script>
  import {post} from "@/api/bizApi/commonUtil";

  export default {
    name: "quoteSaleInput",
    data() {
      return {
        isCurChange: this.isChange,
        isOutCurChange: this.isOutChange,
        YonList: [],
        acptBankTypesList: [],
        billTypeList: [],
        showCpesBranch: false,
        showCpesInnerBranch: false,
        showCpesProductBranch: false,
        memberId: "",
        userTraderWin: false,
        userTraderSaleWin: false,
        buyBrchCode: "",
        saleBrchCode: "",
        innerBuyBrchCode: "",
        outBuyBrchCode: "",
        brchType: "",
        productBrchType: "4",//资管非法人产品机构类型
        showPassPreAuditWin: false,
        //授权机构
        //brchNoWin:false,
        auditBatchURL:"/be/market/quote/quoteManager/func_findPassBatchByPage",
      };
    },
    components: {
      BT01:()=>import(/* webpackChunkName: "be/market/quote/innerMoveBill/BT01" */`@/views/bizViews/be/market/quote/innerMoveBill/BT01`),
      ShowCpesBranch:()=>import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
      traderUser:()=>import(/* webpackChunkName: "sm/auth/branch/userTraderByBrchNoSearch" */`@/views/bizViews/sm/auth/branch/userTraderByBrchNoSearch`),
      ShowPassPreAudit:()=>import(/* webpackChunkName: "be/market/quote/innerMoveBill/showPassPreAudit" */`@/views/bizViews/be/market/quote/innerMoveBill/showPassPreAudit`),

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
      isInnerBuyBrch: {
        type: Boolean,
        default() {
          return false;
        }
      },
      isInnerBuyTrader: {
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
      isOutChange: {
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
        this.isOutCurChange = this.isOutChange;
        this.formItem.innerBusiType = val;
        this.formItem.outBusiType = val;
        this.buyBrchCode = null;
      }

    },
    methods: {
      showCpesBranchClose() {
        this.showCpesBranch = false;
      },
      showCpesInnerBranchClose() {
        this.showCpesInnerBranch = false;
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
        this.formItem.outBuyBrchCode = info.brchCode;
        this.formItem.outBuyBrchName = info.brchFullNameZh;
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
          this.formItem.innerBuyBrchName = "";
          this.formItem.innerBuyTraderNo = null;
          this.formItem.innerBuyTraderName = null;
          this.formItem.outBuyBrchName = "";
          this.formItem.outBuyTraderNo = null;
          this.formItem.outBuyTraderName = null;
        }
      },

      //根据弹框所选数据进行赋值
      showCpesInnerBranchSubmit(info) {
        if (info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.innerBuyBrchName = info.brchFullNameZh;
        this.formItem.innerBuyBrchCode = info.brchCode;
        this.showCpesInnerBranch = false;
      },
      // 挑选机构名称
      queryInnerBranchName() {
        this.showCpesInnerBranch = true;
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
        this.outBuyBrchCode = this.formItem.outBuyBrchCode;
        this.userTraderWin = true;
      },
      queryInnerSaleTrader() {
        this.innerBuyBrchCode = this.formItem.innerBuyBrchCode;
        this.userTraderSaleWin = true;
      },

      userTraderChange(info) {
        if (info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.outBuyTraderName = info.traderName;
        this.formItem.outBuyTraderNo = info.traderId;
        this.userTraderWin = false;
      },
      userTraderWinClose() {
        this.userTraderWin = false;
      },
      userTraderSaleChange(info) {
        if (info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.innerBuyTraderNo = info.traderId;
        this.formItem.innerBuyTraderName = info.traderName;
        this.userTraderSaleWin = false;
      },
      userTraderSaleWinClose() {
        this.userTraderSaleWin = false;
      },
      //选择内转清算速度， 在内转清算速度改变后修改内转结算日期
      changeInnerSpeed(currVal) {
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
              this.formItem.innerFirstSettleDt = this.$moment(res.data.retData, "YYYYMMDD").format("YYYY-MM-DD");
              if (this.formItem.innerBusiType !== "BT01" && dueSettleDt) {
                dueSettleDt = Date.parse(dueSettleDt.replace(/-/g, "/"));
                let innerFirstSettleDt = Date.parse(this.formItem.innerFirstSettleDt.replace(/-/g, "/"));
                dueSettleDt = new Date(dueSettleDt);
                innerFirstSettleDt = new Date(innerFirstSettleDt);
                let days = (dueSettleDt.getTime() - innerFirstSettleDt.getTime()) / (24 * 60 * 60 * 1000);
                this.formItem.innerTenorDays = days;
              }
              this.changeOutSpeed(this.formItem.outClearSpeed);
            }
          });
        } else {
          this.formItem.innerFirstSettleDt = this.$moment(this.formItem.workDate, "YYYYMMDD").format("YYYY-MM-DD");
          if (this.formItem.innerBusiType !== "BT01" && dueSettleDt) {
            dueSettleDt = Date.parse(dueSettleDt.replace(/-/g, "/"));
            let innerFirstSettleDt = Date.parse(this.formItem.innerFirstSettleDt.replace(/-/g, "/"));
            dueSettleDt = new Date(dueSettleDt);
            innerFirstSettleDt = new Date(innerFirstSettleDt);
            let days = (dueSettleDt.getTime() - innerFirstSettleDt.getTime()) / (24 * 60 * 60 * 1000);
            this.formItem.innerTenorDays = days;
          }
          this.changeOutSpeed(this.formItem.outClearSpeed);
        }

      },
      //选择清算速度， 在清算速度改变后修改结算日期
      changeOutSpeed(currVal) {
        if (!this.isOutCurChange) {
          this.isOutCurChange = true;
          return;
        }
        // T+1 情况
        let dueSettleDt = this.formItem.dueSettleDt;
        if(this.formItem.innerFirstSettleDt){
          if (currVal === "CS01") {
            let workDate = this.$moment(this.formItem.innerFirstSettleDt, "YYYYMMDD").format("YYYY/MM/DD");
            workDate = new Date(workDate);
            let workDatePlus = workDate.valueOf() + (1 * 24 * 60 * 60 * 1000);
            workDatePlus = new Date(workDatePlus);
            workDatePlus = this.$moment(workDatePlus, "YYYYMMDD").format("YYYYMMDD");
            post({ code: workDatePlus }, "/sm/oper/holiday/getWorkDate").then(res => {
              if (res && res.data.retCode === "000000") {
                this.formItem.outFirstSettleDt = this.$moment(res.data.retData, "YYYYMMDD").format("YYYY-MM-DD");
                if (this.formItem.innerBusiType !== "BT01" && dueSettleDt) {
                  dueSettleDt = Date.parse(dueSettleDt.replace(/-/g, "/"));
                  let outFirstSettleDt = Date.parse(this.formItem.outFirstSettleDt.replace(/-/g, "/"));
                  dueSettleDt = new Date(dueSettleDt);
                  outFirstSettleDt = new Date(outFirstSettleDt);
                  let days = (dueSettleDt.getTime() - outFirstSettleDt.getTime()) / (24 * 60 * 60 * 1000);
                  this.formItem.outTenorDays = days;
                }
              }
            });
          } else {
            this.formItem.outFirstSettleDt = this.$moment(this.formItem.innerFirstSettleDt, "YYYYMMDD").format("YYYY-MM-DD");
            if (this.formItem.innerBusiType !== "BT01" && dueSettleDt) {
              dueSettleDt = Date.parse(dueSettleDt.replace(/-/g, "/"));
              let outFirstSettleDt = Date.parse(this.formItem.outFirstSettleDt.replace(/-/g, "/"));
              dueSettleDt = new Date(dueSettleDt);
              outFirstSettleDt = new Date(outFirstSettleDt);
              let days = (dueSettleDt.getTime() - outFirstSettleDt.getTime()) / (24 * 60 * 60 * 1000);
              this.formItem.outTenorDays = days;
            }
          }
        }
      },
      getQuoteParameter() {
        let busiType = this.formItem.innerBusiType;
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
        /*this.formItem.saleBrchCode = info[0].orgCode;
        this.formItem.saleBrchName = info[0].title;
        this.formItem.ownedBrchNo = info[0].id;
        this.formItem.saleBrchName = info[0].title;
        this.formItem.saleTraderNo = '';
        this.formItem.saleTraderName = '';
        this.$parent.validateField('saleBrchName');
        this.brchNoWin = false;*/

          if(info.length>0){
              this.formItem.saleBrchCode = info[0].orgCode;
              this.formItem.saleTraderNo = '';
              this.formItem.saleTraderName = '';
              this.$parent.validateField('saleBrchName');
          }
      },
     /* //根据弹框所选数据进行赋值
      brchNoWinOpen() {this.brchNoWin = true;},
      brchNoWinClose() {
        this.brchNoWin = false;
      },*/
    }


  };
</script>

