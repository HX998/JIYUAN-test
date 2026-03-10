<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.be.isCommit')" prop="isCommit">
                  <h-radio-group v-model="formItem.isCommit">
                    <h-radio label="0" @on-click="noCommitButton">
                      <span>未提交</span>
                    </h-radio>
                    <h-radio label="1" @on-click="hasCommitButton">
                      <span>已提交</span>
                    </h-radio>
                  </h-radio-group>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.rediscountApplNo')" prop="rediscountApplNo">
                  <h-input v-model="formItem.rediscountApplNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.busiType')" prop="busiType">
                  <h-select v-model="formItem.busiType" placeholder="">
                    <h-option v-for="item in rediscBusiTypeList" :value="item.key" :key="item.key">{{item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="billType" :label="$t('m.i.billInfo.billType')">
                  <h-select v-model="formItem.billType" placeholder="">
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="billClass" :label="$t('m.i.billInfo.billClass')">
                  <h-select v-model="formItem.billClass" placeholder="">
                    <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.clearSpeed')" prop="clearSpeed">
                  <h-select v-model="formItem.clearSpeed" placeholder="">
                    <h-option v-for="item in clearSpeedList" :value="item.key" :key="item.key">{{item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.clearType')" prop="clearType">
                  <h-select v-model="formItem.clearType" placeholder="">
                    <h-option v-for="item in clearTypeList" :value="item.key" :key="item.key">{{item.value}}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.settleMode')" prop="settleMode">
                  <h-select v-model="formItem.settleMode" placeholder="">
                    <h-option v-for="item in settleTypeList" :value="item.key" :key="item.key">{{item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <common-type-field-range v-model="formItem" :label="$t('m.i.be.tradRate')" :integerNum="3" :suffixNum="4" :bigTips="false"
                                         :rangeProps="['minRate','maxRate']"></common-type-field-range>
                <show-cpes-branch :label="$t('m.i.be.pedBrchName')"
                                  :brchCode.sync="formItem.buyBrchCode"  :cpesBrchName.sync="formItem.buyBrchName"
                                  datagridUrl="/cpes/branch/queryBranchList" prop="buyBrchName"
                                  :cpesBrchParams="{'memberId':100000}"
                                  queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                <h-form-item prop="buyBrchCode" v-show="false">
                  <h-input v-model="formItem.buyBrchCode">
                  </h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
              <h-datagrid
                          :columns="columns"
                          url="/be/market/rediscount/redSaleApplyMain/func_queryRedSaleBatchList"
                          :bindForm="formItem"
                          highlight-row
                          :onCurrentChange="onCurrentChange"
                          :onCurrentChangeCancel="onCurrentChangeCancle"
                          ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-dropdown placement="bottom-start" @on-click="createQuote">
                    <h-button type="primary" :disabled="hasCommit">
                      {{$t('m.i.common.add')}}
                      <h-icon name="unfold"></h-icon>
                    </h-button>
                    <h-dropdown-menu slot="list">
                      <h-dropdown-item name="RBT01" :disabled="hasCommit">再贴现买断</h-dropdown-item>
                      <h-dropdown-item name="RBT02" :disabled="hasCommit">再贴现质押式回购</h-dropdown-item>
                    </h-dropdown-menu>
                  </h-dropdown>
                  <h-button type="primary" :disabled="hasCommit" @click="editQuote()">{{$t('m.i.common.modify')}}</h-button>
                  <h-button type="primary" :disabled="hasCommit" @click="handleComfirm()"
                            v-if="authObj.bizSetRoleDelete">{{$t("m.i.common.delete")}}
                  </h-button>
                  <h-button type="primary" :disabled="hasCommit" @click="abolishApply()">{{$t('m.i.be.abolishApply')}}</h-button>
                  <h-button type="primary" @click="cancelApplyBatch()" :disabled="noCommit">{{$t('m.i.common.revoke')}}</h-button>
                </div>

              </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--点击作废申请单弹出窗-->
    <h-msg-box v-model="abolishChangeWin" width="400" :mask-closable="false" @on-close="abolishChangeWinClose"
                :maximize="true">
      <p slot="header">
        <span>作废申请说明描述</span>
      </p>
      <h-form :model="agencyForm" :label-width="120" ref="agencyForm" cols="2" class="h-form-search">
        <h-form-item label="申请说明" prop="applRemark" cols="2" :validRules="applRemarkRule">
          <h-input v-model="agencyForm.applRemark" type="textarea" :maxlength="600"
                   placeholder="说点什么...."></h-input>
        </h-form-item>
      </h-form>
      <div slot="footer">
        <h-button type="ghost" @click="abolishChangeWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm">{{$t("m.i.common.commit")}}</h-button>

      </div>
    </h-msg-box>
    <redis-bill-detil :showBills="showDetilWin"
                      :batchid="redisBatchId"
                      :dealStatus="dealStatus"
                      :dictMap="dictMap"
                      :busi-type="busiType"
                      batchUrl="/be/market/rediscount/redSaleApplyMain/func_queryBatchById"
                      billsUrl="/be/market/rediscount/redSaleApplyMain/func_queryBills"
                      billImgsUrl="/be/market/rediscount/redSaleApplyMain/func_queryRediscountSaleImagePage"
                      @closeMsgBox="showDetilWin = false">
    </redis-bill-detil>
    <quote-change
        :title="changeTitle"
        :dictMap="dictList"
        :bt="busiType"
        :batchId="batchId"
        :dealStatus="dealStatus"
        @quoteChangeWinClose="quoteChangeWinClose"
        @rediscountSubmit="rediscountSubmit"
        :quoteChangeWin="quoteChangeWin"
        :showNoticeFirstStationItem="this.showNoticeFirstStationItem"
        :isNoticeFirstAudit="this.isNoticeFirstAudit">
    </quote-change>
  </div>
</template>

<script>
  import { post, on, off ,formatNumber} from "@/api/bizApi/commonUtil";

  export default {
    name: "redSaleApplyMain",
    components: {
       //BrchCodeSearch:()=>import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
      QuoteChange:()=>import(/* webpackChunkName: "be/market/rediscount/redSaleApplChange" */`@/views/bizViews/be/market/rediscount/redSaleApplChange`),
      RedisBillDetil:()=>import(/* webpackChunkName: "be/market/rediscount/redisBillDetil" */`@/views/bizViews/be/market/rediscount/redisBillDetil`)
    },
    data() {
      return  {
        columns : [
          {
            type: "radio",
            width: 50,
            align: "center",
            title: " "
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t('m.i.common.batchNo'),
            key: "batchNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showDetilBox(params.row.id, params.row.busiType,params.row.dealStatus);
                  }
                }
              }, params.row.batchNo);
            }
          },
          {
            title: this.$t('m.i.be.rediscountApplNo'),
            key: "rediscountApplNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.applRelId'),
            key: "applRelId",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.busiType'),
            key: "busiType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
          let list = this.getDictValueFromMap(this.dictMap,"RediscBusiType",params.row.busiType);
          return h("span",
            {
            domProps: {
              title: list
            }
          }, list);
            }
          },
          {
            title: this.$t('m.i.common.dealStatus'),
            key: "dealStatus",

            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
          let list = this.getDictValueFromMap(this.dictMap,"RediscApplyStatus",params.row.dealStatus);
          return h("span",
            {
            domProps: {
              title: list
            }
          }, list);
            }
          },
          {
            title: this.$t('m.i.be.preTradeBhvr'),
            key: "preTradeBhvr",

            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
          let list = this.getDictValueFromMap(this.dictMap,"PreTradeBhvr",params.row.preTradeBhvr);
          return h("span",
            {
            domProps: {
              title: list
            }
          }, list);
            }
          },
          {
            title: this.$t('m.i.be.pedBrchName'),
            key: "buyBrchName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.humanDecencyTrader'),
            key: "buyTraderName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.humanDecencyCheck'),
            key: "buyCheckTraderName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.humanDecencyApproval'),
            key: "buyApproveTraderName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.billClass'),
            key: "billClass",
            align: "left",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
          let list = this.getDictValueFromMap(this.dictMap,"CDMedia",params.row.billClass);
          return h("span",
            {
            domProps: {
              title: list
            }
          }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            align: "left",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
          let list = this.getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
          return h("span",
            {
            domProps: {
              title: list
            }
          }, list);
            }
          },
          {
            title: this.$t('m.i.be.tradRate'),
            key: "ratePct",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.clearSpeed'),
            key: "clearSpeed",

            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
          let list = this.getDictValueFromMap(this.dictMap,"ClearSpeed",params.row.clearSpeed);
          return h("span",
            {
            domProps: {
              title: list
            }
          }, list);
            }
          },
          {
            title: this.$t('m.i.be.clearType'),
            key: "clearType",

            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
          let list = this.getDictValueFromMap(this.dictMap,"ClearType",params.row.clearType);
          return h("span",
            {
            domProps: {
              title: list
            }
          }, list);
            }
          },
          {
            title: this.$t('m.i.be.settleMode'),
            key: "settleMode",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
          let list = this.getDictValueFromMap(this.dictMap,"SettleType",params.row.settleMode);
          return h("span",
            {
            domProps: {
              title: list
            }
          }, list);
            }
          },
          {
            title: this.$t('m.i.be.firstSettleDate'),
            key: "firstSettleDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", params.row.firstSettleDt ? this.$moment(params.row.firstSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t('m.i.be.dueSettleDt'),
            key: "dueSettleDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.dueSettleDt ? this.$moment(params.row.dueSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t('m.i.common.totalAmtBillPackage'),
            key: "totalAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.totalAmt, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.returnBuyTotalAmtByUnit'),
            key: "buyBackTotalAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.buyBackTotalAmt, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.payInterestByUnit'),
            key: "firstPayInterest",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.firstPayInterest, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.firstSettleAmtByUnit'),
            key: "firstSettleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.firstSettleAmt, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.dueSettleAmtByUnit'),
            key: "dueSettleAmt",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.repoTermOrTenorDays'),
            key: "tenorDays",

            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.totalNumBillPackage'),
            key: "totalNum",

            hiddenCol: false
          }
        ],

        formItem : {
          billNo: "",
          clearSpeed: "",
          clearType: "",
          settleMode: "",
          minRatePct: "",
          maxRatePct: "",
          buyBrchName: "",
          buyBrchCode: "",
          billType: "",
          billClass: "",
          batchNo: "",
          trDir: "",
          busiType: "",
          isCommit: "0",
          applyNo: "",
          minRate: '',
          maxRate: ''
        },
        addForm : {
          id: "",
          batchId: "",
          acctFlowId: "",
          legalNo: "",
          memberId: "",
          billNo: "",
          billMoney: "",
          dueDt: "",
          dueMatDt: "",
          remitDt: "",
          drwrName: "",
          acptName: "",
          acptBrchCode: "",
          acptBankNo: "",
          acptBankName: "",
          cfmAppBrchCode: "",
          cfmAppBankNo: "",
          cfmAppBankName: "",
          acptGuarntrBrchCode: "",
          acptGuarntrBankNo: "",
          acptGuarntrBankName: "",
          discBrchCode: "",
          discBankNo: "",
          discBankName: "",
          discGuarntrBrchCode: "",
          discGuarntrBankNo: "",
          discGuarntrBankName: "",
          guarntrTrustBrchCode: "",
          guarntrTrustBankNo: "",
          guarntrTrustBankName: "",
          isDiscount: "",
          isAllopatric: "",
          isMeetPolicy: "",
          remainDays: "",
          dueRemainDays: "",
          firstPayInterest: "",
          dueInterest: "",
          firstSettleAmt: "",
          dueSettleAmt: "",
          preRelationFlag: "",
          billId: "",
          stockId: "",
          orgnlSourceProd: "",
          orgnlListId: "",
          lastSourceProd: "",
          lastListId: "",
          creditFlag: "",
          creditFlowNo: "",
          duePayAmt: "",
          duePayInterest: "",
          galeDt: "",
          transplantFlag: "",
          impawnStatus: "",
          ftpPrice: "",
          createTime: "",
          updateTime: "",
          rediscountApplNo: "",
          saleTraderName: "",
          saleCheckTraderName: "",
          buyBrchName: "",
          buyBrchCode: "",
          firstSettleDt: "",
          termType: ""
        },
        agencyForm : {
          id: "",
          brchCode: "",
          custName: "",
          certifyType: "",
          certifyNo: "",
          applRemark: "",
          custNo: "",
          checkType: ""
        },
        authObj : {
          bizSetRoleAdd: true, //角色添加
          bizSetRoleDelete: true, //角色删除
          bizSetRoleORight: true, //角色操作权限
          bizSetRoleARight: true, //角色授权权限
          bizRoleRightSet: true, //角色权限处理
          bizRoleRightCopy: true, //角色权限复制
          bizSetRoleDownload: true //角色信息下载
        },
        // 是否显示新增或修改窗口
        addOrEditWin : false,
        type : null,
        readonly : false,
        isRequired : true,
        deletDisabled : false,
        submitFlag : false,
        copyWin : false,
        brchCodeWin : false,
        showDetilWin : false,
        redisBatchId : {
          batchId : ""
        },
        settleTypeList : [],
        clearTypeList : [],
        clearSpeedList : [],
        showCpesBranch : false,
        pickBillWin : false,
        submitTitle : "",
          direct : "",
          retMsg : "",
        ifShowMore : false,
        dealStatus : "",
        selectData : null,
        //showbrch : false,
        busiType: "",
        trDir: "",
        quoteChangeWin: false,
        abolishChangeWin: false,
        trDirList: [],
        billClassList: [],
        rediscBusiTypeList: [],
        busiTypeList: [],
        imgStatusList: [],
        billTypeList: [],
        acctStatusList: [],
        dealStatusList: [],
        clearStatusList: [],
        isDisabled: false,
        dictList: {},
        dictMap: new Map(),
        batchId: null,
        url: null,
        hasCommit: false,
        noCommit: true,
        changeTitle: "新增批次",
        applRemarkRule: [{ test: this.validateApplRemark, trigger: "blur,change" }],
        isNoticeFirstAudit:"0",
        showNoticeFirstStationItem:false
      }
    },
    methods: {
      validateApplRemark(rule, value, callback) {
        if(value){
          if(value.length>300){
            callback(new Error("申请说明长度不能超过300个字符"));
          }else{
            callback();
          }
        }else{
          callback();
        }
      },
      minRateVaild() {
        this.formItem.minRate = this.formItem.minRate.trim();
        if (this.formItem.minRate.length != 0 && Number(this.formItem.minRate)) {
          let min = Number(this.formItem.minRate)
          if (min < 0 || min > 100) {
            this.$msgTip.info(this,{info:"利率：0~100(最多4位小数)"});
            this.formItem.minRate = ''
          }
          if (this.formItem.maxRate.length != 0 && Number(this.formItem.maxRate)) {
            let max = Number(this.formItem.maxRate)
            if (min > max) {
              this.$msgTip.info(this, {info:"最大值不能小于最小值"});
              this.formItem.minRate = ''
            }
          }
        }
        else {
          this.formItem.minRate = ''
        }
      },
      maxRateVaild() {
        if (this.formItem.maxRate.length != 0 && Number(this.formItem.maxRate)) {
          let max = Number(this.formItem.maxRate)
          if (max < 0 || max > 100) {
            this.$msgTip.info(this, {info:"利率：0~100(最多4位小数)"});
            this.formItem.maxRate = ''
          }
          if (this.formItem.minRate.length != 0 && Number(this.formItem.minRate)) {
            let min = Number(this.formItem.minRate)
            if (min > max) {
              this.$msgTip.info(this, {info:"最大值不能小于最小值"});
              this.formItem.maxRate = ''
            }
          }
        }
        else {
          this.formItem.maxRate = ''
        }
      },
      pickBillChange() {

      },
      addFormReset() {
        this.$refs.addForm.resetFields();
        this.addForm.id = "";
      },
      handleAddForm(str) {
        this.type = str;
        this.readonly = false;
        this.isRequired = true;
        this.addForm.schemeId = "";
        this.addForm.schemeName = "";
        if (this.type == "modify" || this.type == "view") {
          let list = this.currentSelectList;
          if (list != null && list.length == 1) {
            this.currentSelectRow = this.currentSelectList[0];
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.chooseOneData") });
            return;
          }
          this.addForm.id = this.currentSelectRow.id;
          this.addForm.batchId = this.currentSelectRow.batchId;
          this.addForm.acctFlowId = this.currentSelectRow.acctFlowId;
          this.addForm.legalNo = this.currentSelectRow.legalNo;
          this.addForm.memberId = this.currentSelectRow.memberId;
          this.addForm.billNo = this.currentSelectRow.billNo;
          this.addForm.billMoney = this.currentSelectRow.billMoney;
          this.addForm.dueDt = this.currentSelectRow.dueDt;
          this.addForm.dueMatDt = this.currentSelectRow.dueMatDt;
          this.addForm.remitDt = this.currentSelectRow.remitDt;
          this.addForm.drwrName = this.currentSelectRow.drwrName;
          this.addForm.acptName = this.currentSelectRow.acptName;
          this.addForm.acptBrchCode = this.currentSelectRow.acptBrchCode;
          this.addForm.acptBankNo = this.currentSelectRow.acptBankNo;
          this.addForm.acptBankName = this.currentSelectRow.acptBankName;
          this.addForm.cfmAppBrchCode = this.currentSelectRow.cfmAppBrchCode;
          this.addForm.cfmAppBankNo = this.currentSelectRow.cfmAppBankNo;
          this.addForm.cfmAppBankName = this.currentSelectRow.cfmAppBankName;
          this.addForm.acptGuarntrBrchCode = this.currentSelectRow.acptGuarntrBrchCode;
          this.addForm.acptGuarntrBankNo = this.currentSelectRow.acptGuarntrBankNo;
          this.addForm.acptGuarntrBankName = this.currentSelectRow.acptGuarntrBankName;
          this.addForm.discBrchCode = this.currentSelectRow.discBrchCode;
          this.addForm.discBankNo = this.currentSelectRow.discBankNo;
          this.addForm.discBankName = this.currentSelectRow.discBankName;
          this.addForm.discGuarntrBrchCode = this.currentSelectRow.discGuarntrBrchCode;
          this.addForm.discGuarntrBankNo = this.currentSelectRow.discGuarntrBankNo;
          this.addForm.discGuarntrBankName = this.currentSelectRow.discGuarntrBankName;
          this.addForm.guarntrTrustBrchCode = this.currentSelectRow.guarntrTrustBrchCode;
          this.addForm.guarntrTrustBankNo = this.currentSelectRow.guarntrTrustBankNo;
          this.addForm.guarntrTrustBankName = this.currentSelectRow.guarntrTrustBankName;
          this.addForm.isDiscount = this.currentSelectRow.isDiscount;
          this.addForm.isAllopatric = this.currentSelectRow.isAllopatric;
          this.addForm.isMeetPolicy = this.currentSelectRow.isMeetPolicy;
          this.addForm.remainDays = this.currentSelectRow.remainDays;
          this.addForm.dueRemainDays = this.currentSelectRow.dueRemainDays;
          this.addForm.firstPayInterest = this.currentSelectRow.firstPayInterest;
          this.addForm.dueInterest = this.currentSelectRow.dueInterest;
          this.addForm.firstSettleAmt = this.currentSelectRow.firstSettleAmt;
          this.addForm.dueSettleAmt = this.currentSelectRow.dueSettleAmt;
          this.addForm.preRelationFlag = this.currentSelectRow.preRelationFlag;
          this.addForm.billId = this.currentSelectRow.billId;
          this.addForm.stockId = this.currentSelectRow.stockId;
          this.addForm.orgnlSourceProd = this.currentSelectRow.orgnlSourceProd;
          this.addForm.orgnlListId = this.currentSelectRow.orgnlListId;
          this.addForm.lastSourceProd = this.currentSelectRow.lastSourceProd;
          this.addForm.lastListId = this.currentSelectRow.lastListId;
          this.addForm.creditFlag = this.currentSelectRow.creditFlag;
          this.addForm.creditFlowNo = this.currentSelectRow.creditFlowNo;
          this.addForm.duePayAmt = this.currentSelectRow.duePayAmt;
          this.addForm.duePayInterest = this.currentSelectRow.duePayInterest;
          this.addForm.galeDt = this.currentSelectRow.galeDt;
          this.addForm.transplantFlag = this.currentSelectRow.transplantFlag;
          this.addForm.impawnStatus = this.currentSelectRow.impawnStatus;
          this.addForm.ftpPrice = this.currentSelectRow.ftpPrice;
          this.addForm.createTime = this.currentSelectRow.createTime;
          this.addForm.updateTime = this.currentSelectRow.updateTime;
          this.addForm.reserve1 = this.currentSelectRow.reserve1;
          this.addForm.reserve2 = this.currentSelectRow.reserve2;
          this.addForm.reserve3 = this.currentSelectRow.reserve3;
          if (this.type == "modify") {
            this.readonly = true;
          }
          if (this.type == "view") {
            this.isRequired = false;
          }
        } else {
          this.addFormReset();
        }
        this.addOrEditWin = true;
      },
      rediscountSubmit() {
        this.quoteChangeWin = false;
        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
      },
      //未提交
      noCommitButton() {
        this.noCommit = true;
        this.hasCommit = false;
        this.formItem.isCommit = "0";
        this.formSearch();
      },
      //已提交
      hasCommitButton() {
        this.hasCommit = true;
        this.noCommit = false;
        this.formItem.isCommit = "1";
        this.formSearch();
      },
      //撤销
      cancelApplyBatch() {
        let list = this.selectData;
        if (null === list) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.discBatchId = list.id;
        let url = "/be/market/rediscount/redSaleApplyMain/func_redCancelApply";
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("确认要撤销申请吗") + "?",
          onOk: () => {
            let id = list.id;
            post({ id: id }, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.selectData = null;
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //保存
      addFormSave() {
        this.$hMsgBox.confirm({
          title: "保存",
          content: "确认保存吗？",
          onOk: () => {
            this.$refs["addForm"].validate(valid => {
              if (valid) {
                let btnType = this.type;
                if (btnType == "add") {
                  this.addForm.id = null;
                }
                let url = "/be/market/rediscount/redSaleApplyMain/func_addRediscountSaleBatch";
                let msg = this.$t("m.i.common.addSuccess");
                // let applDt = this.addForm.applDt;
                // this.addForm.applDt = moment(applDt).format("YYYYMMDD");
                this.submitFlag = true;
                post(this.addForm, url).then(res => {
                  this.submitFlag = false;
                  if (res) {
                    let retCode = res.data.retCode;
                    if (retCode == "000000") {
                      this.$msgTip.success(this, { info: msg });
                      // this.addOrEditWin = false;
                      this.selectData = null;
                      this.canPick = true;
                    } else {
                      this.$msgTip.error(this, { info: res.data.retMsg });
                    }
                    this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  } else {
                    this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                  }

                });
              }
            });
          }
        });
      },
      onCurrentChange(currentRow, oldCurrentRow, _index) {
        this.selectData = currentRow;
      },
      onCurrentChangeCancle(currentRow, oldCurrentRow, _index) {
        this.selectData = null;
      },
      // handleSelectClick(arr, selectInx) {
      //   this.unDisabled();
      //   this.currentSelectList = arr;
      //   this.currentSelectRowInx = selectInx;
      //   if (arr.length == 0) return;
      //   if (arr[0].role_code == "admin") {
      //     this.deletDisabled = true;
      //   }
      // },
      queryBranchCode() {
        this.showCpesBranch = true;
      },
      showCpesBranchClose() {
        this.showCpesBranch = false;
      },
      //修改
      editQuote() {
        let list = this.selectData;
        if (null === list) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.batchId = list.id;
        this.busiType = list.busiType;
        this.dealStatus = list.dealStatus;
        this.quoteChangeWin = true;
        this.selectData = null;
        this.changeTitle = "修改批次";
      },
      abolishApply() {
        let list = this.selectData;
        if (null === list) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.batchId = list.id;
        this.abolishChangeWin = true;
      },

      unDisabled() {
        this.deletDisabled = false;
      },
      formSearch() {
        this.unDisabled();
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.minRate='';
        this.formItem.maxRate='';
        this.noCommitButton();
        this.formItem.buyBrchCode = "";
        this.formItem.buyBrchName = "";
      },
      submitForm() {
        let list = this.selectData;
        if (null === list) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        let delId = list.id;
        this.agencyForm.id = delId;
        let remark = this.agencyForm.applRemark;
        this.$refs["agencyForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            post({
              "id": delId,
              "aplRemark": remark
            }, "/be/market/rediscount/redSaleApplyMain/func_abolishApply").then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this, { info: "操作成功" });
                  this.retMsg = "";
                  this.selectData = null;
                  this.abolishChangeWin = false;
                  this.agencyForm.applRemark="";
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      handleComfirm() {
        let list = this.selectData;
        if (null === list) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?",
          onOk: () => {
            this.handledel();
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
          }
        });
      },
      handledel() {
        let list = this.selectData;
        let delId = list.id;
        post({ id: delId }, "/be/market/rediscount/redSaleApplyMain/func_deleteRediscountSaleBatch").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this, { info: this.$t("m.i.common.deleteSuccess") });
              this.retMsg = "";
              this.selectData = null;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      createQuote(bt) {
        this.busiType = bt;
        this.batchId = null;
        this.quoteChangeWin = true;
      },
      quoteChangeWinClose() {
        this.quoteChangeWin = false;
        this.busiType = "";
        this.direct = "";
        this.changeTitle = "新增批次";
        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
      },
      abolishChangeWinClose() {
        this.abolishChangeWin = false;
        this.agencyForm.applRemark="";
        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
      },
      showDetilBox(redisBatchId, busiType) {
        this.redisBatchId.batchId = redisBatchId;
        this.busiType = busiType;
        this.showDetilWin = true;
      },
    },
    mounted() {
      this.getDictListByGroups("TenorCode,SettleType,BookType,AssetIndustryManage,AssetIndustry,CDMedia,DraftTypeCode,TermType,ClearType,ClearSpeed,RediscBusiType,RediscApplyStatus,PreTradeBhvr,ImgStatus,PreRelationFlag,CreditMajor,Yon,CorpScale,Industry,BillOrigin").then(res => {
        this.billClassList = res.get("CDMedia");
        this.billTypeList = res.get("DraftTypeCode");
        this.settleTypeList = res.get("SettleType");
        this.clearTypeList = res.get("ClearType");
        this.clearSpeedList = res.get("ClearSpeed");
        this.rediscBusiTypeList = res.get("RediscBusiType");
        this.busiTypeList = res.get("RediscBusiType");
        this.tenorCodeList = res.get("TenorCode");
        this.imgStatusList = res.get("ImgStatus");
        this.dictList = {
          busiTypeList: this.busiTypeList,
          rediscBusiTypeList: this.rediscBusiTypeList,
          billClassList: this.billClassList,
          settleTypeList: this.settleTypeList,
          clearTypeList: this.clearTypeList,
          clearSpeedList: this.clearSpeedList,
          termTypeList: res.get("TermType"),
          imgStatusList: this.imgStatusList,
          billTypeList: this.billTypeList,
          tenorCodeList:this.tenorCodeList,
          preRelationFlagList: res.get("PreRelationFlag"),
          corpScaleList : res.get("CorpScale"),
          yonLst : res.get("Yon"),
          assetIndustryList: res.get("AssetIndustryManage"),
          bookTypeList: res.get("BookType"),
          industryList : res.get("Industry")
        };
        this.dictMap = res.get("map");
      });
      this.formItem.isCommit='0';
      //控制是否通知审批第一岗的显隐
      post({ paramKey: "pc.flow.is_show_notice_input_when_audit_appl" }, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.showNoticeFirstStationItem = res.data.retData === "1";
          } else {
            this.showNoticeFirstStationItem = false;
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
      //获取是否通知审批第一岗的默认值
      post({ paramKey: "pc.flow.default_notice_value_when_audit_appl" }, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.isNoticeFirstAudit = res.data.retData?res.data.retData:"0";
          } else {
            this.isNoticeFirstAudit="0";
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });

    }
  };
</script>

<style scoped>

</style>
