<!--电票质押申请-新增/修改申请-->
<template>
  <div>
    <h-msg-box v-model="tempImpawnAddOrEditWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1000" class="h-form-search-layer" top="10" @on-maximize="onMaximize">
      <p slot="header">
        <span v-if="batchParams.batchType==='add'">新增申请</span>
        <span v-else-if="batchParams.batchType==='modify' && batchParams.isCommit === 'noCommit'">修改申请</span>
        <span v-else-if="batchParams.batchType==='modify' && batchParams.isCommit === 'hasCommit'">撤销申请</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="3" class="h-form-search">
          <div>
            <!-- <h-form-item :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNo" v-show="this.licenseFlag" required>
               <h-input v-model="addOrEditForm.ownedBrchName" :icon="batchParams.batchType==='add' ? 'android-search' : ''" @on-click="brchNoWinOpen"
                        readonly clearable @on-clear="clearVal1('license')" :title="addOrEditForm.ownedBrchName" ></h-input>
             </h-form-item>-->
            <show-branch v-model="addOrEditForm.ownedBrchNo" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNo"
                         title="机构名称"
                         :filterable="batchParams.batchType==='add'" required :showCheckBox="false"
                         v-show="this.licenseFlag" :msgBoxWin="tempImpawnAddOrEditWin"
                         :brchNo.sync="addOrEditForm.ownedBrchNo" :brchName.sync="addOrEditForm.ownedBrchName"
                         :params="{authPath: this.$route.path}"
                         url="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                         queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
            </show-branch>
            <h-form-item prop="custNo" :label="$t('m.i.common.custNo')" required>
              <h-input v-model="addOrEditForm.custNo" placeholder=""
                       :icon="batchParams.batchType==='add' ? 'android-search' : ''" @on-click="queryCustName()"
                       readonly></h-input>
            </h-form-item>
            <h-form-item prop="custName" :label="$t('m.i.common.custName')" required>
              <h-input v-model="addOrEditForm.custName" placeholder="" readonly></h-input>
            </h-form-item>
            <h-form-item prop="custAcctNo" :label="$t('m.i.common.custAcctNo')" required>
              <h-input v-model="addOrEditForm.custAcctNo" placeholder="" readonly
                       :icon="batchParams.batchType==='add' ? 'android-search' : ''"
                       @on-click="queryCustAcctNo()"></h-input>
            </h-form-item>
            <h-form-item prop="bailAcctNo" :label="$t('m.i.common.bailAcctNo')" required
                         v-if="this.buttonAuth.showBailAcctInput === undefined ? false : this.buttonAuth.showBailAcctInput.isShow">
              <h-input v-model="addOrEditForm.bailAcctNo" placeholder=""
                       :icon="batchParams.batchType==='add' ? 'android-search' : ''" @on-click="queryCustBailAcctNo()"
                       readonly></h-input>
            </h-form-item>
            <h-form-item prop="billType" :label="$t('m.i.billInfo.billType')" required>
              <h-select v-model="addOrEditForm.billType" placeholder="" :readonly="batchParams.batchType==='modify'">
                <h-option v-for="item in batchParams.billTypeList" :value="item.key" :key="item.key">{{
                    item.value
                  }}
                </h-option>
              </h-select>
            </h-form-item>
            <h-form-item prop="transCtrctNo" :label="$t('m.i.ce.impawnCtrctNo')">
              <h-input v-model="addOrEditForm.transCtrctNo" :maxlength=60></h-input>
            </h-form-item>
            <h-form-item prop="custMgrName" :label="$t('m.i.common.custMgrName')">
              <h-input v-model="addOrEditForm.custMgrName" placeholder="" readonly
                       :icon="isCustMgrAllow ? 'android-search' : ''" @on-click="queryCustManager()"></h-input>
            </h-form-item>
            <h-form-item prop="impawnDt" :label="$t('m.i.ce.impawnDt')" required>
              <h-date-picker type="date" v-model="addOrEditForm.impawnDt" placeholder=""
                             @on-change="handleImpawnDtChange" showFormat :editable=false></h-date-picker>
            </h-form-item>
            <!--
              <h-form-item prop="reserve1" :label="$t('m.i.ce.collectionAccount')" required>
                <h-input v-model="addOrEditForm.reserve1" placeholder="" readonly
                       :icon="batchParams.batchType==='add' ? 'android-search' : ''"
                       @on-click="queryCollectionAcctNo()"></h-input>
             </h-form-item>
            -->
            <h-form-item prop="reserve1" :label="$t('m.i.ce.collectionAccount')" required>
                <h-input v-model="addOrEditForm.reserve1" :maxlength=40></h-input>
             </h-form-item>
            <h-form-item :label="$t('m.i.billInfo.billOrigin')" required key="billOriginArray" prop="billOriginArray">
              <h-select v-model="addOrEditForm.billOriginArray" :multiple="batchParams.isMixPack1"
                        :readonly="batchParams.batchType==='modify'">
                <h-option v-for="item in batchParams.billOriginList" :value="item.key" :key="item.key">{{
                    item.value
                  }}
                </h-option>
              </h-select>
            </h-form-item>
          </div>
        </h-form>
        <div style="text-align: right">
          <h-button type="primary" @click="formSave()" v-if="this.batchParams.isCommit === 'noCommit'">保存</h-button>
        </div>
        <!--数据展示表格-->
        <h-datagrid
          :columns="columns"
          highlight-row
          :auto-load="false"
          url="/ce/impawn/elec/elecImpawn/eImpawnApplyMain/func_pageQueryImpawnBillList"
          :bindForm="formItem"
          :has-select="false"
          :rowSelect="true"
          ref="datagrid">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'" @click="impawnPickBill">
              {{ $t("m.i.ce.pickBill") }}
            </h-button>
            <!--<h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'" @click="impawnBillDelete">{{$t("m.i.common.delete")}}</h-button>-->
            <h-dropdown placement="bottom-start" @on-click="impawnBillDelete"
                        v-if="this.batchParams.isCommit === 'noCommit'">
              <h-button type="primary">{{ $t('m.i.common.delete') }}
                <h-icon name="unfold"></h-icon>
              </h-button>
              <h-dropdown-menu slot="list">
                <h-dropdown-item name="selectDelete">{{ $t('m.i.be.chooseDelete') }}</h-dropdown-item>
                <h-dropdown-item name="listDelete">{{ $t('m.i.be.batchListDelete') }}</h-dropdown-item>
              </h-dropdown-menu>
            </h-dropdown>
            <h-dropdown placement="bottom-start" @on-click="submit" v-if="this.batchParams.isCommit === 'noCommit'">
              <h-button type="primary">{{ $t("m.i.common.submit") }}
                <h-icon name="unfold"></h-icon>
              </h-button>
              <h-dropdown-menu slot="list">
                <h-dropdown-item name="select">{{ $t("m.i.ce.selectSubmit") }}</h-dropdown-item>
                <h-dropdown-item name="batch">{{ $t("m.i.ce.batchSubmit") }}</h-dropdown-item>
              </h-dropdown-menu>
            </h-dropdown>
            <h-button type="primary" v-if="this.batchParams.isCommit === 'hasCommit'" @click="impawnBillCancel">
              {{ $t("m.i.common.cancel") }}
            </h-button>
          </div>
        </h-datagrid>
      </div>
      <div slot="footer">
      </div>
    </h-msg-box>
    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                       :licenseFlag="this.licenseFlag" :ownedBrchNo="this.addOrEditForm.ownedBrchNo"
                       @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.addOrEditForm.custNo"
                       :isAllBankAcct=true @showCustAcctNoWinClose="showCustAcctNoWinClose"
                       @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>

    <!-- 查询客户保证金账号弹窗-->
    <show-cust-acct-no :show-cust-acct-no-win="showCustBailAcctNoWin" :cust-no="this.addOrEditForm.custNo"
                       @custAcctNoSelectSubmit="custBailAcctNoSelectSubmit" custAcctKind="2"
                       title="查询客户保证金账号信息窗口"></show-cust-acct-no>

    <!-- 查询回款账号信息弹窗 -->
    <show-collection-acct-no :show-cust-acct-no-win="showCollectionAcctNoWin" :cust-no="this.addOrEditForm.custNo"
                       @showCollectionAcctNoWinClose="showCollectionAcctNoWinClose"
                       @collectionAcctNoSelectSubmit="collectionAcctNoSelectSubmit"></show-collection-acct-no>

    <!-- 查询回款保证金账号弹窗-->
    <show-collection-acct-no :show-cust-acct-no-win="showCustBailAcctNoWin" :cust-no="this.addOrEditForm.custNo"
                       @showCollectionAcctNoWinClose="showCustBailAcctNoWin = false"
                       @custAcctNoSelectSubmit="collectionBailAcctNoSelectSubmit" custAcctKind="2"
                       title="查询客户保证金信息窗口"></show-collection-acct-no>
    <!--查询客户经理-->
    <show-cust-manager :showCustManagerWin="showCustManagerWin" :title="$t('m.i.ce.selectManager')"
                       @showCustManagerWinClose="showCustManagerWinClose"
                       @custManagerSelect="custManagerSelect"></show-cust-manager>
    <!--挑票窗口-->
    <impawn-pick-bill :impawnPickBillWin="impawnPickBillWin" @impawnPickBillChange="impawnPickBillChange"
                      :impawnPickBillParams="impawnPickBillParams"
                      @impawnPickBillWinClose="impawnPickBillWinClose"></impawn-pick-bill>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo" :billRangeEnd="this.billRangeEnd"
                    :billRangeStart="this.billRangeStart"></bill-info-main>
    <!--风险信息-->
    <risk-check :riskCheckWin="riskCheckWin" :riskParams="riskParams" @riskCheckWinClose="riskCheckWinClose"
                @riskCheckSubmit="riskCheckSubmit"></risk-check>
  </div>
</template>

<script>
import {post, on, off, formatNumber, formatBillRange} from "@/api/bizApi/commonUtil";

export default {
  name: "eImpawnApplyAdd",
  components: {
    ImpawnPickBill: () => import(/* webpackChunkName: "ce/impawn/elec/elecImpawn/eImpawnPickBill" */`@/views/bizViews/ce/impawn/elec/elecImpawn/eImpawnPickBill`),
    ShowCustManager: () => import(/* webpackChunkName: "bm/cust/manager/showCustManager" */`@/views/bizViews/bm/cust/manager/showCustManager`),
    // ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`),

  },
  data() {
    return {
      showCustBailAcctNoWin: false,
      batchId: "",
      addOrEditForm: {
        id: "",
        billClass: "ME02",
        billType: "",
        custNo: "",
        custName: "",
        custAcctNo: "",
        ownedBrchNo: this.$store.getters.userInfo.brchNo,
        ownedBrchName: this.$store.getters.userInfo.brchName,
        licenseFlag: false,
        custMgrNo: "",
        custMgrName: "",
        impawnType: "",
        transCtrctNo: "",
        impawnDt: "",
        bailAcctNo: "",
        sumMoney: "",
        sumCount: "",
        billOrigin: "",
        billOriginArray: [],
        multiBillOrigin: [],
        reserve1: "",
      },
      formItem: {
        batchId: "",
        funcNo: "",
        billClass: "ME02",

      },
      columns: [
        {
          type: "selection",
          key: "multiSelect",
          width: 60,
          hiddenCol: false
        },
        {
          type: "index",
          key: "numOrder",
          title: this.$t("m.i.common.index"),
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.billOrigin"),   //票据来源
          key: "billOrigin",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.batchParams.dictMap, "BillOrigin", params.row.billOrigin);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.billInfo.billPackageNo"),   //票据(包)号码
          key: "billNo",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let info = "", type = "";
            if (!!params.row.billId) {
              info = params;
              type = "billId";
            } else {
              info = params;
              type = "billNo";
            }
            return h("a", {
              on: {
                click: () => {
                  this.showBillInfo(params.row, type);
                }
              }
            }, params.row.billNo);
          }
        },
        {
          title: this.$t("m.i.billInfo.billRange"),   //子票区间
          key: "billRange",
          hiddenCol: false,
          render: (h, params) => {
            let billOrigin = params.row.billOrigin;
            let billRangeStart = params.row.billRangeStart;
            let billRangeEnd = params.row.billRangeEnd;
            return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
          }
        },
        {
          title: this.$t('m.i.billInfo.billPackageMoney'),   //票据(包)金额
          key: "billMoney",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h('span', formatNumber(params.row.billMoney, 2, ','))
          }
        },

        {
          title: this.$t("m.i.billInfo.flowStatus"),
          key: "flowStatusName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.billType"),
          key: "billType",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.batchParams.dictMap, "DraftTypeCode", params.row.billType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.billInfo.remitDt"),
          key: "remitDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.remitDt == null || params.row.remitDt === "") {
              return "";
            }
            let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.billInfo.dueDt"),
          key: "dueDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.dueDt == null || params.row.dueDt === "") {
              return "";
            }
            let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.billInfo.drwrName"),
          key: "drwrName",
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.billInfo.drwrAcctNo"),
          key: "drwrAcctNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.drwrBankNo"),
          key: "drwrBankNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.pyeeName"),
          key: "pyeeName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.pyeeAcctNo"),
          key: "pyeeAcctNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.pyeeBankNo"),
          key: "pyeeBankNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.acptName"),
          key: "acptName",
          sortable: true,
          hiddenCol: false
        }
      ],
      showCustMessageWin: false,
      showCustAcctNoWin: false,
      showCollectionAcctNoWin: false,
      //记录批次是否已保存
      hadBatchSave: false,
      //通过参数控制客户经理是否可选
      isCustMgrAllow: false,
      showCustManagerWin: false,
      //授权机构
      // brchNoWin:false,
      //质押挑票窗口
      impawnPickBillWin: false,
      impawnPickBillParams: {},
      showBillInfoWin: false,
      billId: "",
      billNo: "",
      billRangeStart: "",
      billRangeEnd: "",
      //风险信息窗口
      riskCheckWin: false,
      riskParams: {},
      submitType: "",
      // TODO
      //是否允许混包交易，用来控制票据来源的单选多选
      mixedPackageExchange: true,
    }
  },
  props: {
    licenseFlag: "",
    authPath: "",
    /*isMixPack1:{
      type: Boolean,
      default() {
        return false;
      }
    },*/
    impawnAddOrEditWin: {
      type: Boolean,
      default() {
        return false;
      }
    },
    batchParams: {
      type: Object,
      default: {
        dictMap: new Map(),
        billTypeList: [],
        YonList: [],
        impawnBatchId: "",
        batchType: "",
        isCommit: "",
        funcNo: "",
        billOriginList: [],
        isMixPack1: "",
      }
    },
    buttonAuth: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    tempImpawnAddOrEditWin: {
      get() {
        return this.impawnAddOrEditWin;
      },
      set() {
      }
    }
  },
  watch: {
    impawnAddOrEditWin(val) {
      if (val) {
        this.getIsAllowOtherCustMgr();
        this.$nextTick(() => {
          this.batchId = this.batchParams.impawnBatchId;
          this.formItem.batchId = this.batchId;
          this.formItem.funcNo = this.batchParams.funcNo;
          if (this.batchParams.batchType === "modify") {
            this.queryObjById();
            this.handleSearch();
          }
          if (this.batchParams.batchType === "add") {
            this.$refs.datagrid.tData = [];
            this.addOrEditForm.ownedBrchNo = this.$store.getters.userInfo.brchNo;
            this.addOrEditForm.ownedBrchName = this.$store.getters.userInfo.brchName;
            this.addOrEditForm.impawnDt = this.$moment(window.sessionStorage.getItem("workDate"), "YYYY-MM-DD").format("YYYY-MM-DD");
          }
        });
      }
    },
    batchId(val) {
      this.batchId = val;
    }
  },
  methods: {
    onMaximize() {
      setTimeout(() => {
        this.$refs.datagrid.$refs.gridContent.handleResize();
      }, 100);
    },
    //获取系统参数（控制客户经理是否可选）
    getIsAllowOtherCustMgr() {
      post({}, "/ce/impawn/elec/elecImpawn/eImpawnApplyMain/func_getCustMgrforConfigCenter").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            let isAllowOtherCustMgr = res.data.retData.isAllowOtherCustMgr;
            this.isCustMgrAllow = isAllowOtherCustMgr === "1";
            this.$nextTick(() => {
              this.addOrEditForm.custMgrNo = this.$store.getters.userInfo.userNo;
              this.addOrEditForm.custMgrName = this.$store.getters.userInfo.userName;
            });
          } else {
            this.isCustMgrAllow = false;
            this.$nextTick(() => {
              this.addOrEditForm.custMgrNo = this.$store.getters.userInfo.userNo;
              this.addOrEditForm.custMgrName = this.$store.getters.userInfo.userName;
            });
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    },
    //关闭弹窗
    handleClose() {
      let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
      this.addOrEditForm.ownedBrchNo = userInfo.brchNo;
      this.addOrEditForm.ownedBrchName = userInfo.brchName;
      this.$refs.addOrEditForm.resetFields();
      this.addOrEditForm.id = "";
      this.addOrEditForm.custMgrNo = "";
      this.hadBatchSave = false;
      this.$emit("impawnAddOrEditWinClose", "");
    },
    //表单查询
    handleSearch(pageNo) {
      this.$refs.datagrid.selects = [];
      this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
    },
    //修改时根据票据批次Id查询票据批次信息
    queryObjById() {
      let params = {id: this.batchId, billClass: "ME02", funcNo: this.batchParams.funcNo};
      post(params, "/ce/impawn/elec/elecImpawn/eImpawnApplyMain/func_getImpawnBatchInfo").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            let obj = res.data.retData;
            this.addOrEditForm.id = obj.id;
            this.addOrEditForm.billType = obj.billType;
            this.addOrEditForm.custNo = obj.custNo;
            this.addOrEditForm.custName = obj.custName;
            this.addOrEditForm.custAcctNo = obj.custAcctNo;
            this.addOrEditForm.custMgrNo = obj.custMgrNo;
            this.addOrEditForm.custMgrName = obj.custMgrName;
            this.addOrEditForm.impawnType = obj.impawnType;
            this.addOrEditForm.transCtrctNo = obj.transCtrctNo;
            this.addOrEditForm.ownedBrchNo = obj.ownedBrchNo;
            this.addOrEditForm.ownedBrchName = obj.ownedBrchName;
            this.addOrEditForm.bailAcctNo = obj.bailAcctNo;
            this.addOrEditForm.reserve1 = obj.reserve1;
            if (obj.billOriginArray === "" || obj.billOriginArray === null) {
              this.addOrEditForm.billOriginArray = [];
            } else {
              let _billOriginArray = obj.billOriginArray.indexOf("!") >= 0 ? obj.billOriginArray.substring(0, obj.billOriginArray.length - 1) : obj.billOriginArray;
              this.addOrEditForm.billOriginArray = _billOriginArray.split(",");
            }
            if (!!obj.impawnDt) {
              this.addOrEditForm.impawnDt = this.$moment(obj.impawnDt, "YYYYMMDD").format("YYYY-MM-DD");
            }
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    },
    //查询客户信息
    queryCustName() {
      this.showCustMessageWin = true;
    },
    //赋值
    custCorpSelectSubmit(info) {
      this.addOrEditForm.custName = info.custName;
      this.addOrEditForm.custNo = info.custNo;
      if (info.custAcctNo !== "") {
        this.addOrEditForm.custAcctNo = info.custAcctNo;
        this.addOrEditForm.custNo = info.custNo;
        //this.addOrEditForm.reserve1 = info.custAcctNo;
      } else {
        this.addOrEditForm.custAcctNo = "";
        this.addOrEditForm.reserve1 = "";
      }
      this.showCustMessageWin = false;
    },
    //关闭
    custCorpWinClose() {
      this.showCustMessageWin = false;
    },
    //查询客户账号信息
    queryCustAcctNo() {
      if (this.addOrEditForm.custNo === "") {
        this.$msgTip.info(this, {info: "请先选择客户"});
        return;
      }
      this.showCustAcctNoWin = true;
    },
    queryCollectionAcctNo() {
      if (this.addOrEditForm.custNo === "") {
        this.$msgTip.info(this, {info: "请先选择客户"});
        return;
      }
      this.showCollectionAcctNoWin = true;
    },
    //赋值
    custAcctNoSelectSubmit(info) {
      this.addOrEditForm.custAcctNo = info.custAcctNo;
      this.showCustAcctNoWin = false;
    },
    collectionAcctNoSelectSubmit(info) {
      this.addOrEditForm.reserve1 = info.custAcctNo;
      this.showCollectionAcctNoWin = false;
    },
    //查询客户保证金账号信息
    queryCustBailAcctNo() {
      if (this.addOrEditForm.custNo === "") {
        this.$msgTip.info(this, {info: "请先选择客户"});
        return;
      }
      this.showCustBailAcctNoWin = true;
    },
    custBailAcctNoSelectSubmit(info) {
      this.addOrEditForm.bailAcctNo = info.custAcctNo;
      this.addOrEditForm.reserve1 = info.custAcctNo;
      this.showCustBailAcctNoWin = false;
    },
    collectionBailAcctNoSelectSubmit(info) {
      this.addOrEditForm.bailAcctNo = info.custAcctNo;
      this.addOrEditForm.reserve1 = info.custAcctNo;
      this.showCustBailAcctNoWin = false;
    },
    //关闭弹窗
    showCustAcctNoWinClose() {
      this.showCustAcctNoWin = false;
    },
    showCollectionAcctNoWinClose() {
      this.showCollectionAcctNoWin = false;
    },
    //查询客户经理
    queryCustManager() {
      this.showCustManagerWin = true;
    },
    //赋值
    custManagerSelect(info) {
      this.addOrEditForm.custMgrNo = info.custMgrNo;
      this.addOrEditForm.custMgrName = info.custMgrName;
      this.showCustManagerWin = false;
    },
    //关闭弹窗
    showCustManagerWinClose() {
      this.showCustManagerWin = false;
    },
    handleImpawnDtChange(value) {
      this.addOrEditForm.impawnDt = value.replace(/-/g, "");
    },
    //保存批次信息
    formSave() {
      //if (this.batchParams.batchType === "add") {
       // if (this.$refs.datagrid.tData.length > 0) {
          //this.$msgTip.info(this, {info: "该批次下已存在票据明细，不允许修改批次信息！"});
         // return;
        //}
      //}
      this.addOrEditForm.impawnDt = this.addOrEditForm.impawnDt.replace(/-/g, "");
      if (this.addOrEditForm.impawnDt < window.sessionStorage.getItem("workDate")) {
        this.$msgTip.info(this, {info: "质押日期必须大于或等于当前营业日期"});
        return;
      }
      //往后台传授权标志
      this.addOrEditForm.licenseFlag = this.licenseFlag;
      this.$refs["addOrEditForm"].validate(valid => {
        if (valid) {
          let url = this.batchParams.batchType === "add" ? "/ce/impawn/elec/elecImpawn/eImpawnApplyMain/func_insertImpawnBatch" : "/ce/impawn/elec/elecImpawn/eImpawnApplyMain/func_updateImpawnBatch";
          if (this.hadBatchSave) {
            url = "/ce/impawn/elec/elecImpawn/eImpawnApplyMain/func_updateImpawnBatch";
          }
          post(this.addOrEditForm, url).then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$msgTip.success(this);
                if (this.batchParams.batchType === "add" && this.hadBatchSave === false) {
                  this.batchId = res.data.retData.id;
                  this.formItem.batchId = res.data.retData.id;
                  this.addOrEditForm.id = res.data.retData.id;
                }
                this.$refs.datagrid.dataChange(1);
                this.$refs.datagrid.selects = [];
                this.hadBatchSave = true;
              } else {
                this.$msgTip.error(this, {info: msg});
              }
            } else {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            }
          });
        }
      });
    },
    //弹出挑票窗口
    impawnPickBill() {
      if (this.batchParams.batchType === "add") {
        if (this.hadBatchSave) {
          this.jumpToPickBillWin();
        } else {
          this.$msgTip.info(this, {info: "请先保存批次"});
          return;
        }
      }
      if (this.batchParams.batchType === "modify") {
        this.jumpToPickBillWin();
      }
    },
    //跳转到挑票界面
    jumpToPickBillWin() {
      this.impawnPickBillParams.batchId = this.batchId;
      this.impawnPickBillParams.dictMap = this.batchParams.dictMap;
      this.impawnPickBillParams.billType = this.addOrEditForm.billType;
      this.impawnPickBillParams.licenseFlag = this.licenseFlag;
      this.impawnPickBillParams.ownedBrchNo = this.addOrEditForm.ownedBrchNo;
      this.impawnPickBillParams.billOriginList = this.batchParams.billOriginList;
      this.impawnPickBillWin = true;
    },
    //挑票界面根据弹框所选票进行赋值
    impawnPickBillChange(info) {
      let transIds = [];
      for (let i = 0; i < info.length; i++) {
        transIds.push(info[i].transId);
      }
      post({
        transIds: transIds.join(","),
        batchId: this.batchId
      }, "/ce/impawn/elec/elecImpawn/eImpawnApplyMain/func_pickDiscBillInfoElec").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$msgTip.success(this);
            this.impawnPickBillParams.batchId = {};
            this.impawnPickBillWin = false;
            this.$refs.datagrid.dataChange(1);
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
            this.$refs.datagrid.dataChange(1);
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    },
    //挑票界面取消按钮
    impawnPickBillWinClose() {
      this.impawnPickBillParams = {};
      this.impawnPickBillWin = false;
    },
    //删除质押明细
    impawnBillDelete(type) {
      if (type === "selectDelete") {
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
          return;
        }
        let list = this.$refs.datagrid.selects;
        let impawnIds = [];
        for (let i = 0; i < list.length; i++) {
          impawnIds.push(list[i].id);
        }
        let params = {
          impawnIds: impawnIds.join(","),
          batchId: this.batchId,
        };
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.be.confirmDelBill") + "?",
          onOk: () => {
            this.handleDelete(params);
          }
        });
      } else if (type === "listDelete") {
        if (this.batchId === "") {
          this.$msgTip.info(this, {info: "请先保存批次"});
          return;
        }
        if (this.$refs.datagrid.tData.length === 0) {
          this.$msgTip.info(this, {info: "该批次下无数据"});
          return;
        }
        let params = {
          batchId: this.batchId,
        };
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.be.confirmDelBill") + "?",
          onOk: () => {
            this.handleDelete(params);
          }
        });
      }
      /*if (this.$refs.datagrid.selects.length === 0) {
        this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        return;
      }
      this.$hMsgBox.confirm({
        title: this.$t("m.i.common.confirm"),
        content: this.$t("m.i.common.isConfirmDelete") + "?",
        onOk: () => {
          this.handleDelete();
        }
      });*/
    },
    handleDelete(params) {
      //post({ batchId: this.batchId,impawnIds: impawnIds.join(",") }, "/ce/impawn/elec/elecImpawn/eImpawnApplyMain/func_deleteImpawnBill").then(res => {
      post(params, "/ce/impawn/elec/elecImpawn/eImpawnApplyMain/func_deleteImpawnBill").then(res => {
        if (res) {
          let msg = res.data.retMsg;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$msgTip.success(this);
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            this.$refs.datagrid.selects = [];
          } else {
            this.$refs.datagrid.dataChange(1);
            this.$msgTip.error(this, {info: msg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    },
    //批次提交或选择提交
    submit(type) {
      this.submitType = type;
      if (type === "select") {
        let list = this.$refs.datagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
          return;
        }
        let impawnIds = [];
        for (let i = 0; i < list.length; i++) {
          impawnIds.push(list[i].id);
        }
        let params = {
          batchId: this.batchId, impawnIds: impawnIds.join(","),
          ownedBrchNo: this.addOrEditForm.ownedBrchNo,
          licenseFlag: this.licenseFlag,
          custNo: this.addOrEditForm.custNo,
          reserve1: this.addOrEditForm.reserve1
        };
        this.getRiskBillNo(params);
      } else if (type === "batch") {
        if (this.batchId === "") {
          this.$msgTip.info(this, {info: "请先保存批次"});
          return;
        }
        if (this.$refs.datagrid.tData.length === 0) {
          this.$msgTip.info(this, {info: "该批次下无数据"});
          return;
        }
        let params = {
          batchId: this.batchId,
          ownedBrchNo: this.addOrEditForm.ownedBrchNo,
          licenseFlag: this.licenseFlag,
          custNo: this.addOrEditForm.custNo,
          reserve1: this.addOrEditForm.reserve1
        };
        this.getRiskBillNo(params);
      }
    },
    //提交前先调用风险检查接口
    getRiskBillNo(params) {
      post(params, "/ce/impawn/elec/elecImpawn/eImpawnApplyMain/func_getRiskBillNo").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          let data = res.data.retData;
          if (retCode === "000000") {
            if (Object.keys(data).length > 0) {
              this.riskCheckWin = true;
              this.riskParams.gridDatas = data;
              this.riskParams.submitParams = params;
              this.riskParams.YonList = this.batchParams.YonList;
            } else {
              this.$hMsgBox.confirm({
                title: this.$t("m.i.common.confirm"),
                content: "确定提交申请吗?",
                onOk: () => {
                  this.handleSubmit(params);
                }
              });
            }
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
          }
        }
      }).catch(error => {
        this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
      });
    },
    handleSubmit(params, isRiskCkeck) {
      post(params, "/ce/impawn/elec/elecImpawn/eImpawnApplyMain/func_submitFlow").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$msgTip.success(this);
            if (this.submitType === 'select') {
              if (this.$refs.datagrid.total === this.$refs.datagrid.selects.length) {
                this.handleClose();
              } else {
                this.handleSearch(this.$refs.datagrid.pageInfo.pageNo);
              }
            } else if (this.submitType === 'batch') {
              this.handleClose();
            }
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
          }
          if (isRiskCkeck) {
            this.riskCheckWinClose();
          }
        }
      }).catch(error => {
        this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
      });
    },
    //撤销申请
    impawnBillCancel() {
      // if (this.$refs.datagrid.selects.length === 0) {
      //   this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
      //   return;
      // }
      this.$hMsgBox.confirm({
        title: this.$t("m.i.common.confirm"),
        content: "确定撤销申请吗？",
        onOk: () => {
          this.handleCancelApplyBatch();
        }
      });
    },
    handleCancelApplyBatch() {
      // let list = this.$refs.datagrid.selects;
      // let impawnIds = [];
      // for (let i = 0; i < list.length; i++) {
      //   impawnIds.push(list[i].id);
      // }
      post({batchId: this.batchId}, "/ce/impawn/elec/elecImpawn/eImpawnApplyMain/func_cancelFlow").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$msgTip.success(this);
            this.handleClose();
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    },
    billInfoWinClose() {
      this.showBillInfoWin = false;
    },
    showBillInfo(row, type) {
      this.billId = "";
      this.billNo = "";
      this.billRangeStart = "";
      this.billRangeEnd = "";
      if (type === "billId") {
        this.billId = row.billId;
      } else {
        this.billNo = row.billNo;
      }
      this.billRangeStart = row.billRangeStart;
      this.billRangeEnd = row.billRangeEnd;
      this.showBillInfoWin = true;
    },
    riskCheckWinClose() {
      this.riskCheckWin = false;
      this.riskParams = {};
    },
    riskCheckSubmit(info) {
      this.handleSubmit(info, true);
    },
    /* licenseBrchNoChange(info) {
       this.addOrEditForm.ownedBrchNo = info[0].id;
       this.addOrEditForm.ownedBrchName = info[0].title;
       this.addOrEditForm.custNo = '';
       this.addOrEditForm.custName = '';
       this.brchNoWin = false;
     },
     //根据弹框所选数据进行赋值
     brchNoWinOpen() {this.brchNoWin = true;},
     brchNoWinClose() {
       this.brchNoWin = false;
     },*/
  }
};
</script>

<style scoped>

</style>
