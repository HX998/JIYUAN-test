<!--解质押申请-新增/修改申请-->
<template>
  <div>
    <h-msg-box v-model="tempImpawnAddOrEditWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1000" class="h-form-search-layer" :footerHide="true" top="10" @on-maximize="onMaximize">
      <p slot="header">
        <span v-if="batchParams.batchType==='add'">新增申请</span>
        <span v-else-if="batchParams.batchType==='modify' && batchParams.isCommit === 'noCommit'">修改申请</span>
        <span v-else-if="batchParams.batchType==='modify' && batchParams.isCommit === 'hasCommit'">撤销申请</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="3" class="h-form-search">
          <div>
            <!--<h-form-item :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNo" v-show="this.licenseFlag">
              <h-input v-model="addOrEditForm.ownedBrchName" :icon="batchParams.batchType==='add' ? 'android-search' : ''" @on-click="brchNoWinOpen"
                       readonly clearable @on-clear="clearVal1('license')" :title="addOrEditForm.ownedBrchName" ></h-input>
            </h-form-item>-->
            <show-branch v-model="addOrEditForm.ownedBrchNo" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNo" title="机构名称"
                         :filterable="batchParams.batchType==='add'" :required="isRequired" :showCheckBox="false" v-show="this.licenseFlag" :msgBoxWin="addOrEditWin"
                         :brchNo.sync="addOrEditForm.ownedBrchNo" :brchName.sync="addOrEditForm.ownedBrchName" :params="{authPath: this.$route.path}"
                         url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree" queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
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
            <h-form-item prop="billType" :label="$t('m.i.billInfo.billType')" required>
              <h-select v-model="addOrEditForm.billType" placeholder="" :readonly="batchParams.batchType==='modify'||this.hadBatchSave" showTitle>
                <h-option v-for="item in batchParams.billTypeList" :value="item.key" :key="item.key">{{ item.value
                  }}
                </h-option>
              </h-select>
            </h-form-item>
            <h-form-item prop="unimpawnDt" :label="$t('m.i.common.unImpawnDt')" required>
              <h-date-picker type="date" v-model="addOrEditForm.unimpawnDt" placeholder=""
                             @on-change="handleImpawnDtChange" showFormat :editable=false></h-date-picker>
            </h-form-item>
            <h-form-item prop="getWay" :label="$t('m.i.ce.releaseUse')" v-if="this.batchParams.billClass === 'ME01'">
              <h-input v-model="addOrEditForm.getWay" placeholder="" :canResize="false" :maxLength="100"  :lengthByByte="false"></h-input>
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
          url="/ce/impawn/elec/elecUnImpawn/eUnImpawnApplyMain/func_billlist"
          :bindForm="formItem"
          :has-select="false"
          :rowSelect="true"
          :onSelectChange="onCurrentBillChange"
          ref="datagrid">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'" @click="impawnPickBill">挑票
            </h-button>
            <!--<h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'" @click="impawnBillDelete">删除
            </h-button>-->
            <h-dropdown placement="bottom-start" @on-click="impawnBillDelete" v-if="this.batchParams.isCommit === 'noCommit'">
              <h-button type="primary" >{{$t('m.i.common.delete')}}<h-icon name="unfold"></h-icon></h-button>
              <h-dropdown-menu slot="list">
                <h-dropdown-item name="selectDelete">{{$t('m.i.be.chooseDelete')}}</h-dropdown-item>
                <h-dropdown-item name="listDelete">{{$t('m.i.be.batchListDelete')}}</h-dropdown-item>
              </h-dropdown-menu>
            </h-dropdown>
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit' && (this.buttonAuth.editTransAmt === undefined ? true : this.buttonAuth.editTransAmt.isShow)"
                      @click="updateTransAmtBtn" :disabled="hasAmtDisabled">{{$t('m.i.be.editTransAmt')}}</h-button>
            <h-dropdown placement="bottom-start" @on-click="submit" v-if="this.batchParams.isCommit === 'noCommit'">
              <h-button type="primary">{{$t("m.i.common.submit")}}
                <h-icon name="unfold"></h-icon>
              </h-button>
              <h-dropdown-menu slot="list">
                <h-dropdown-item name="select">{{$t("m.i.ce.selectSubmit")}}</h-dropdown-item>
                <h-dropdown-item name="batch">{{$t("m.i.ce.batchSubmit")}}</h-dropdown-item>
              </h-dropdown-menu>
            </h-dropdown>
            <h-button type="primary" v-if="this.batchParams.isCommit === 'hasCommit'" @click="impawnBillCancel">{{$t("m.i.common.cancel")}}
            </h-button>
          </div>
        </h-datagrid>
      </div>
    </h-msg-box>

    <h-msg-box v-model="editTransAmtWin" class="h-form-table-layer"
               @on-close="editTransAmtClose" :maximize="true" @on-maximize="onMaximize">
      <p slot="header">
        <span>调整票据交易金额</span>
      </p>

      <h-form :model="splitMoneyForm" :label-width="120" ref="addForm2" cols="1" class="h-form-search">
        <common-input v-model="splitMoneyForm.billNo" :label="$t('m.i.billInfo.billPackageNo')" prop="billNo" :required="true"  readonly></common-input>

        <common-type-field v-model="splitMoneyForm.billPackageMoney" :label="$t('m.i.billInfo.billPackageMoney')" prop="billPackageMoney"
                           :required="true" readonly></common-type-field>
        <h-form-item :label="$t('m.i.be.editTransAmt')" prop="transAmt" :required="isRequired" >
          <h-typefield type="money" v-model="splitMoneyForm.transAmt" placeholder="" integerNum="10"></h-typefield>
        </h-form-item>
      </h-form>

      <div slot="footer">
        <h-button type="primary" @click="editTransAmtClose()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="cancelSplit" >{{$t("m.i.common.cancelSplit")}}</h-button>
        <h-button type="primary" @click="editTransAmSubmit()">{{$t("m.i.common.split")}}</h-button>
      </div>
    </h-msg-box>

    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                       @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :busiOwnBrchNo='busiOwnBrchNo' :cust-no="this.addOrEditForm.custNo" :isAllBankAcct=true
                       @showCustAcctNoWinClose="showCustAcctNoWinClose"
                       @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
    <!--挑票窗口-->
    <e-un-impawn-pick-bill :unImpawnPickBillWin="unImpawnPickBillWin" @unImpawnPickBillChange="unImpawnPickBillChange"
                         :unImpawnPickBillParams="unImpawnPickBillParams"
                         @unImpawnPickBillWinClose="unImpawnPickBillWinClose"></e-un-impawn-pick-bill>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo" :billRangeEnd = "this.billRangeEnd" :billRangeStart = "this.billRangeStart"></bill-info-main>

    <!--<show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="licenseBrchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="false"></show-license-branch>-->

  </div>
</template>

<script>
  import { post, on, off, formatNumber ,getSingleParamValuesByKeys,formatBillRange} from "@/api/bizApi/commonUtil";

  export default {
    name: "eUnImpawnApplyAdd",
    components: {
      EUnImpawnPickBill:()=>import(/* webpackChunkName: "ce/impawn/elec/elecUnImpawn/eUnImpawnPickBill" */`@/views/bizViews/ce/impawn/elec/elecUnImpawn/eUnImpawnPickBill`),
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`),

    },
    data() {
      return {
        isRequired:true,
        busiOwnBrchNo : '',
        isMarketMode : false,
        batchId: "",
        addOrEditForm: {
          id: "",
          billClass: "",
          billType: "",
          custNo: "",
          custName: "",
          custAcctNo: "",
          unimpawnDt: "",
          getWay: "",
          ownedBrchNo:this.$store.getters.userInfo.brchNo,
          ownedBrchName:this.$store.getters.userInfo.brchName,
          licenseFlag:false,
          billOrigin: "",
        },
        formItem: {
          batchId: "",
          funcNo: "",
          billClass: ""
        },
        splitMoneyForm:{
          billNo:"",
          billPackageMoney:"",
          transAmt:"",
          billOrigin:"",
          billRangeStart:"",
          billRangeEnd:"",
          impawnIds:"",
          batchId:"",
          unImpawnIds:"",
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
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : this.getDictValueFromMap(this.batchParams.dictMap, "BillOrigin", params.row.billOrigin);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
           title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            ellipsis: false,
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
            render:(h,params) => {
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
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            ellipsis: false,
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
            ellipsis: false,
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
            ellipsis: false,
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
          // {
          // title: this.$t("m.i.billInfo.billMoneyByUnit"),
          //   key: "billMoney",
          //   ellipsis: false,
          //   hiddenCol: false,
          //   sortable: true,
          //   render: (h, params) => {
          //     let billMoney = formatNumber(params.row.billMoney, 2, ",");
          //     return h("span", {
          //       domProps: {
          //         title: billMoney
          //       }
          //     }, billMoney);
          //   }
          // },
          {
           title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            ellipsis: false,
            sortable: true,
            hiddenCol: false
          },
          {
           title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: "drwrAcctNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrBankNo"),
            key: "drwrBankNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            sortable: true,
            ellipsis: false,
            hiddenCol: false
          },
          {
           title: this.$t("m.i.billInfo.pyeeAcctNo"),
            key: "pyeeAcctNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
             title: this.$t("m.i.billInfo.pyeeBankNo"),
            key: "pyeeBankNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            sortable: true,
            ellipsis: false,
            hiddenCol: false
          }
        ],
        //授权机构
        // brchNoWin:false,
        showCustMessageWin: false,
        showCustAcctNoWin: false,
        //记录批次是否已保存
        hadBatchSave: false,
        //解质押挑票窗口
        unImpawnPickBillWin: false,
        unImpawnPickBillParams: {},
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        submitType : "",
        hasAmtDisabled:true,
        //调整交易金额窗口
        editTransAmtWin:false,
        transAmt:"",
        billRangeStart:"",
        billRangeEnd:"",
      }
    },
    props: {
      licenseFlag:"",
      authPath:"",
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
          impawnBatchId: "",
          batchType: "",
          isCommit: "",
          funcNo: "",
          billClass: "",
          billOriginList: [],
        }
      },
      buttonAuth:{
        type:Object,
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
          this.$nextTick(() => {
            this.batchId = this.batchParams.impawnBatchId;
            this.addOrEditForm.billClass = this.batchParams.billClass;
            this.formItem.batchId = this.batchId;
            this.formItem.funcNo = this.batchParams.funcNo;
            this.formItem.billClass = this.batchParams.billClass;
            if (this.batchParams.batchType === "modify") {
              this.queryObjById();
              this.handleSearch();
            }
            if (this.batchParams.batchType === "add") {
              this.$refs.datagrid.tData = [];
              this.addOrEditForm.ownedBrchNo = this.$store.getters.userInfo.brchNo,
                this.addOrEditForm.ownedBrchName = this.$store.getters.userInfo.brchName,
                this.addOrEditForm.unimpawnDt = this.$moment(window.sessionStorage.getItem("workDate"), "YYYY-MM-DD").format("YYYY-MM-DD");
            }
          });
        }
      },
      batchId(val) {
        this.batchId = val;
      }
    },
    methods: {
      onCurrentBillChange(arr, selectInx) {
        this.currentSelectList = arr;
        if(this.currentSelectList.length == 0 || this.currentSelectList.length > 1){
          this.hasAmtDisabled = true;
        }else{
          let billNo = this.currentSelectList[0].billNo;
          let billClass = this.currentSelectList[0].billClass;
          let billPackageMoney = this.currentSelectList[0].originBillMoney;
          let transAmt = this.currentSelectList[0].billMoney;
          let billOrigin = this.currentSelectList[0].billOrigin;
          let billRangeStart = this.currentSelectList[0].billRangeStart;
          let billRangeEnd = this.currentSelectList[0].billRangeEnd;
          if(billClass == "ME01" || billOrigin == "CS01") {
            this.hasAmtDisabled = true;
            return;
          }
          if(billRangeEnd == 0){
            this.hasAmtDisabled = true;
            return;
          }
          if(billRangeEnd == billRangeStart){
            this.hasAmtDisabled = true;
            return;
          }
          this.hasAmtDisabled = false;
        }
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      //关闭弹窗
      handleClose() {
        let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
        this.addOrEditForm.ownedBrchNo = userInfo.brchNo;
        this.addOrEditForm.ownedBrchName = userInfo.brchName;
        this.$refs.addOrEditForm.resetFields();
        this.addOrEditForm.id = "";
        this.addOrEditForm.getWay = "";
        this.hadBatchSave = false;
        this.$emit("impawnAddOrEditWinClose", "");
      },
      editTransAmtClose(){
        this.editTransAmtWin = false;

      },
      //表单查询
      handleSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      //修改时根据票据批次Id查询票据批次信息
      queryObjById() {
        let params = { id: this.batchId, billClass: this.batchParams.billClass, funcNo: this.batchParams.funcNo };
        post(params, "/ce/impawn/elec/elecUnImpawn/eUnImpawnApplyMain/func_getUnImpawnBatch").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.addOrEditForm.id = obj.id;
              this.addOrEditForm.billType = obj.billType;
              this.addOrEditForm.custNo = obj.custNo;
              this.addOrEditForm.custName = obj.custName;
              this.addOrEditForm.custAcctNo = obj.custAcctNo;
              this.addOrEditForm.ownedBrchNo = obj.ownedBrchNo;
              this.addOrEditForm.ownedBrchName = obj.ownedBrchName;
              if (!!obj.unimpawnDt) {
                this.addOrEditForm.unimpawnDt = this.$moment(obj.unimpawnDt, "YYYYMMDD").format("YYYY-MM-DD");
              }
              if (this.batchParams.billClass === "ME01") {
                this.addOrEditForm.getWay = obj.getWay;
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
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
        } else {
          this.addOrEditForm.custAcctNo = "";
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
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustAcctNoWin = true;
      },
      //赋值
      custAcctNoSelectSubmit(info) {
        this.addOrEditForm.custAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //关闭弹窗
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },
      handleImpawnDtChange(value) {
        this.addOrEditForm.unimpawnDt = value.replace(/-/g, "");
      },
      //保存批次信息
      formSave() {
        if(this.batchParams.batchType === "add"){
          if (this.$refs.datagrid.tData.length > 0) {
            this.$msgTip.info(this, { info: "该批次下已存在票据明细，不允许修改批次信息！" });
            return;
          }
        }
        this.addOrEditForm.unimpawnDt = this.addOrEditForm.unimpawnDt.replace(/-/g, "");
        if (this.addOrEditForm.unimpawnDt < window.sessionStorage.getItem("workDate")) {
          this.$msgTip.info(this, { info: "解质押日期必须大于或等于当前营业日期" });
          return;
        }
        //往后台传授权标志
        this.addOrEditForm.licenseFlag = this.licenseFlag;
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            let url = this.batchParams.batchType === "add" ? "/ce/impawn/elec/elecUnImpawn/eUnImpawnApplyMain/func_addBatch" : "/ce/impawn/elec/elecUnImpawn/eUnImpawnApplyMain/func_updateBatch";
            if (this.hadBatchSave) {
              url = "/ce/impawn/elec/elecUnImpawn/eUnImpawnApplyMain/func_updateBatch";
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
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
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
            this.$msgTip.info(this, { info: "请先保存批次" });
            return;
          }
        }
        if (this.batchParams.batchType === "modify") {
          this.jumpToPickBillWin();
        }
      },
      //跳转到挑票界面
      jumpToPickBillWin() {
        this.unImpawnPickBillParams.dictMap = this.batchParams.dictMap;
        this.unImpawnPickBillParams.billClass = this.batchParams.billClass;
        this.unImpawnPickBillParams.billType = this.addOrEditForm.billType;
        this.unImpawnPickBillParams.custNo = this.addOrEditForm.custNo;
        this.unImpawnPickBillParams.custName = this.addOrEditForm.custName;
        this.unImpawnPickBillParams.custAcctNo = this.addOrEditForm.custAcctNo;
        this.unImpawnPickBillParams.licenseFlag = this.licenseFlag;
        this.unImpawnPickBillParams.ownedBrchNo = this.addOrEditForm.ownedBrchNo;
        this.unImpawnPickBillParams.billOriginList = this.batchParams.billOriginList;
        this.unImpawnPickBillWin = true;
      },
      //挑票界面根据弹框所选票进行赋值
      unImpawnPickBillChange(info) {
        this.currentSelectList = info;
        let listIds = [];
        /*for (let i = 0; i < info.length; i++) {
          listIds.push(info[i].listId);
        }*/
        let unImpawnPbApplDtos = [];
        for (let billIds of this.currentSelectList) {
          let ids = billIds.billId ;
          let hldrId = billIds.hldrId;
          //this.addForm.impawnPbApplDto.billId += billIds.billId + ",";
          let param = {billId:ids,hldrId: hldrId};
          unImpawnPbApplDtos.push(param);
        }
        let params = { batchId: this.batchId, unImpawnPbApplDtos: unImpawnPbApplDtos };
        post(params, "/ce/impawn/elec/elecUnImpawn/eUnImpawnApplyAdd/func_addBill").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.unImpawnPickBillWin = false;
              this.$refs.datagrid.dataChange(1);
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.$refs.datagrid.dataChange(1);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //挑票界面取消按钮
      unImpawnPickBillWinClose() {
        this.unImpawnPickBillParams = {};
        this.unImpawnPickBillWin = false;
      },
      //删除解质押明细
      impawnBillDelete(type) {
        if(type === "selectDelete"){
          if (this.$refs.datagrid.selects.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
            return;
          }
          let list = this.$refs.datagrid.selects;
          let unImpawnIds = [];
          for (let i = 0; i < list.length; i++) {
            unImpawnIds.push(list[i].id);
          }
          let params = {
            unImpawnIds: unImpawnIds.join(","),
            batchId: this.batchId,
          };
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.be.confirmDelBill") + "?",
            onOk: () => {
              this.handleDelete(params);
            }
          });
        } else if (type === "listDelete"){
          if (this.batchId === "") {
            this.$msgTip.info(this, { info: "请先保存批次" });
            return;
          }
          if (this.$refs.datagrid.tData.length === 0) {
            this.$msgTip.info(this, { info: "该批次下无数据" });
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
      },
      handleDelete(params) {
        post(params, "/ce/impawn/elec/elecUnImpawn/eUnImpawnApplyMain/func_deleteBill").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.selects = [];
            } else {
              this.$refs.datagrid.dataChange(1);
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      /* 修改交易金额点击事件 */
      updateTransAmtBtn() {
        this.currentSelectBillList = this.$refs.datagrid.selects;
        if (this.currentSelectBillList.length == 1) {
          this.editTransAmtWin = true;
        } else if(this.currentSelectBillList.length == 0){
          this.$msgTip.error(this, { info: this.$t("m.i.common.chooseOneData") });
          return false;
        } else{
          this.$msgTip.error(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return false;
        }
        this.splitMoneyForm.billNo = this.currentSelectBillList[0].billNo;
        this.splitMoneyForm.billPackageMoney = this.currentSelectBillList[0].originBillMoney;
        this.splitMoneyForm.transAmt = this.currentSelectBillList[0].billMoney;
        this.splitMoneyForm.billOrigin = this.currentSelectBillList[0].billOrigin;
        this.splitMoneyForm.billRangeStart = this.currentSelectBillList[0].billRangeStart;
        this.splitMoneyForm.billRangeEnd = this.currentSelectBillList[0].billRangeEnd;
      },
      editTransAmSubmit() {
        this.$refs["addForm2"].validate(valid => {
          if (valid) {
            if (!(this.splitMoneyForm.billOrigin=="CS02"||this.splitMoneyForm.billOrigin=="CS03")){
              this.$msgTip.error(this, { info: "只有票据来源为金融机构票据或供应链票据可以拆包" });
              return;
            }
            if (this.splitMoneyForm.billRangeEnd == 0){
              this.$msgTip.error(this, { info: "该票为零票，不能进行拆包" });
              return;
            }
            if (this.splitMoneyForm.billRangeStart == this.splitMoneyForm.billRangeEnd){
              this.$msgTip.error(this, { info: "票据包子票区间不可拆" });
              return;
            }
            let billMoney = this.splitMoneyForm.billPackageMoney;
            let transAmt = this.splitMoneyForm.transAmt;
            if(transAmt <= 0){
              this.$msgTip.error(this, { info: "交易金额输入非法" });
              return;
            }
            if (billMoney == transAmt){
              this.$msgTip.error(this, { info: "交易金额和票据包金额相同，不需要拆包" });
              return;
            }

            this.splitMoneyForm.batchId = this.batchId;
            this.currentSelectBillList = this.$refs.datagrid.selects;
            let list = this.currentSelectBillList;
            this.splitMoneyForm.unImpawnIds = "";
            for (let i = 0; i < list.length; i++) {
              this.splitMoneyForm.unImpawnIds += list[i].id;
              if (i < list.length - 1) {
                this.splitMoneyForm.unImpawnIds += ",";
              }
            }
            //this.addForm.unimpawnDt = this.$moment(this.addForm.unimpawnDt).format("YYYYMMDD");
            post(this.splitMoneyForm, "pb/trust/unImpawn/unImpawnApplyAccount/func_adjustTransAmt").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.editTransAmtWin = false;
                  this.$msgTip.success(this, { info: this.$t("m.i.common.modifySuccess") });
                  this.currentSelectBillList = [];
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
                  this.splitMoneyForm.unImpawnIds = null;
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  //let obj = Object.assign(this.formItem, { batchId: this.batchId });
                  //this.queryBillList(obj);
                } else {
                  this.splitMoneyForm.unImpawnIds = null;
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.$msgTip.error(this, { info: this.$t("m.i.common.modifyFailed") + res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      cancelSplit(){
        this.splitMoneyForm.batchId = this.batchId;
        this.currentSelectBillList = this.$refs.datagrid.selects;
        let list = this.currentSelectBillList;
        this.splitMoneyForm.unImpawnIds = "";
        for (let i = 0; i < list.length; i++) {
          this.splitMoneyForm.unImpawnIds += list[i].id;
          if (i < list.length - 1) {
            this.splitMoneyForm.unImpawnIds += ",";
          }
        }
        post(this.splitMoneyForm, "pb/trust/unImpawn/unImpawnApplyAccount/func_cancelAdjustTransAmt").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.currentSelectBillList = [];
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.selectIds = [];
              this.splitMoneyForm.unImpawnIds = null;
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.editTransAmtWin = false;
            } else {
              this.splitMoneyForm.unImpawnIds = null;
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError")});
          }
        });
      },
      //批次提交或选择提交
      submit(type) {
        this.submitType = type;
        if (type === "select") {
          let list = this.$refs.datagrid.selects;
          if (list.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
            return;
          }
          let unImpawnIds = [];
          for (let i = 0; i < list.length; i++) {
            unImpawnIds.push(list[i].id);
          }
          let params = { batchId: this.batchId, unImpawnIds: unImpawnIds.join(","),
            ownedBrchNo : this.addOrEditForm.ownedBrchNo,
            licenseFlag : this.licenseFlag,};
          this.handleSubmit(params);
        } else if (type === "batch") {
          if (this.batchId === "") {
            this.$msgTip.info(this, { info: "请先保存批次" });
            return;
          }
          if(this.$refs.datagrid.tData.length === 0){
            this.$msgTip.info(this,{info:"该批次下无数据"});
            return;
          }
          let params = { batchId: this.batchId,
            ownedBrchNo : this.addOrEditForm.ownedBrchNo,
            licenseFlag : this.licenseFlag,};
          this.handleSubmit(params);
        }
      },
      handleSubmit(params) {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定提交申请吗?",
          onOk: () => {
            post(params, "/ce/impawn/elec/elecUnImpawn/eUnImpawnApplyMain/func_submitApply").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  if (this.submitType === "batch") {
                    this.handleClose();
                  } else if (this.submitType === "select") {
                    if (this.$refs.datagrid.total === this.$refs.datagrid.selects.length) {
                      this.handleClose();
                    } else {
                      this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                      this.$refs.datagrid.selects = [];
                    }
                  }
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                }
              }
            }).catch(error => {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });
          }
        });
      },
      //撤销申请
      impawnBillCancel() {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定撤销申请吗？",
          onOk: () => {
            this.handleCancelApplyBatch();
          }
        });
      },
      handleCancelApplyBatch() {
        post({ id: this.batchId }, "/ce/impawn/elec/elecUnImpawn/eUnImpawnApplyMain/func_cancelApply").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.handleClose();
              // this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.selects = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      billInfoWinClose(){
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
        this.billRangeStart=row.billRangeStart;
        this.billRangeEnd=row.billRangeEnd;
        this.showBillInfoWin = true;
      },
      /*licenseBrchNoChange(info) {
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
    },
    mounted(){
      getSingleParamValuesByKeys("pc.is_marketing_bank_mode").then(res => {
        let flag = res["pc.is_marketing_bank_mode"];
        this.isMarketMode = flag === '1';
        if(this.isMarketMode){
          this.busiOwnBrchNo = this.$store.getters.userInfo.brchNo;
        }
      });
    }
  };
</script>

<style scoped>

</style>
