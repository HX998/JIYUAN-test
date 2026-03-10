<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')">
                  <h-input v-model="formItem.drwrName" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="drwrAcctNo" :label="$t('m.i.billInfo.drwrAcctNo')">
                  <h-input v-model="formItem.drwrAcctNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="reverseBillNo" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="formItem.reverseBillNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="remitDt" :label="$t('m.i.billInfo.remitDt')">
                  <h-date-picker type="daterange" :value="formItemRemitDt" format="yyyy-MM-dd" showFormat :editable=false placeholder="" @on-change="handleRemitDtChange" autoPlacement></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                      url="/ce/acpt/outerBusiBill/busiPaymentDue/busiPaymentRegisterMain/func_pageQueryCorpPaperPaymentRgstList"
                      :bindForm="formItem"
                      :on-current-change="handleRowClick"
                      :on-current-change-cancel="handleRowClickCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="paymentRegister" >{{$t('m.i.ce.paymentRegister')}}</h-button>
              <h-button type="primary" @click="refuseRegister" >{{$t('m.i.ce.refuseRegister')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 付款登记弹框 -->
        <h-msg-box v-model="paymentRegisterWin" width="400" @on-close="paymentRegisterWinClose" class="h-form-search-layer" :maximize="true" :mask-closable="false">
          <p slot="header">
            <span>付款登记</span>
          </p>
          <div>
            <h-form :model="paymentRegisterForm" :label-width="115" ref="paymentRegisterForm" cols="1" class="h-form-search">
              <!--<h-form-item prop="prsttnType" :label="$t('m.i.ce.entrustType')" required>-->
                <!--<h-select v-model="paymentRegisterForm.prsttnType" placeholder="" readonly>-->
                  <!--<h-option value="1" key="1">企业</h-option>-->
                  <!--<h-option value="2" key="2">同业</h-option>-->
                <!--</h-select>-->
              <!--</h-form-item>-->
              <!--<h-form-item prop="prsttnBankNo" :label="$t('m.i.ce.entrustBankNo')" required :validRules="prsttnBankNoRule">
                <h-input v-model="paymentRegisterForm.prsttnBankNo" placeholder="" :maxlength="12" icon="android-search"  @on-click="brchCodeWinOpen('agree')"></h-input>
              </h-form-item>
              <h-form-item prop="prsttnBankName" :label="$t('m.i.ce.entrustBankName')" required>
                <h-input v-model="paymentRegisterForm.prsttnBankName" placeholder="" :maxlength="80"></h-input>
              </h-form-item>-->
              <show-cpes-branch :label="$t('m.i.ce.entrustBankName')"
                                :bankNo.sync="paymentRegisterForm.prsttnBankNo" :cpesBrchName.sync="paymentRegisterForm.prsttnBankName"
                                prop="prsttnBankName" :isInitValueClearable="true"
                                :required="true" :msgBoxWin="paymentRegisterWin" :isQueryByBankNo="true"
                                datagridUrl="/cpes/branch/queryBranchList"
                                queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

              <h-form-item prop="prsttnBankNo" :label="$t('m.i.ce.entrustBankNo')" required :validRules="prsttnBankNoRule">
                <h-input v-model="paymentRegisterForm.prsttnBankNo" placeholder="" :maxlength="12" readonly></h-input>
              </h-form-item>

              <h-form-item prop="prsttnAcctNo" :label="$t('m.i.ce.entrustAcctNo')" required :validRules="prsttnAcctNoRule">
                <h-input v-model="paymentRegisterForm.prsttnAcctNo" placeholder="" :maxlength="35" icon="android-search" @on-click="queryCustAcctNo('agree')"></h-input>
              </h-form-item>
              <h-form-item prop="prsttnName" :label="$t('m.i.ce.entrustName')" required>
                <h-input v-model="paymentRegisterForm.prsttnName" placeholder="" :maxlength="80"></h-input>
              </h-form-item>
              <h-form-item prop="paymentSignOpin" :label="$t('m.i.ce.paymentSignOpin')" required>
                <h-input v-model="paymentRegisterForm.paymentSignOpin" placeholder="" type="textarea" :rows="2" :canResize="false" :maxlength="65"></h-input>
              </h-form-item>
            </h-form>
          </div>
          <div slot="footer">
            <div slot="footer">
              <h-button type="ghost" @click="paymentRegisterWinClose">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
              <h-button type="primary" v-else @click="paymentRegisterWinSubmit()">{{$t("m.i.ce.paymentRegister")}}</h-button>
            </div>
          </div>
        </h-msg-box>

        <!-- 拒付登记弹窗 -->
        <h-msg-box v-model="refuseRegisterWin" width="400"  @on-close="refuseRegisterWinClose" class="h-form-search-layer" :maximize="true" :mask-closable="false">
          <p slot="header">
            <span>拒付登记</span>
          </p>
          <div>
            <h-form :model="refuseRegisterForm" :label-width="115" ref="refuseRegisterForm" cols="1" class="h-form-search">
              <!--<h-form-item prop="prsttnBankNo" :label="$t('m.i.ce.entrustBankNo')" required :validRules="prsttnBankNoRule">
                <h-input v-model="refuseRegisterForm.prsttnBankNo" placeholder="" :maxlength="12" icon="android-search" @on-click="brchCodeWinOpen('refuse')"></h-input>
              </h-form-item>
              <h-form-item prop="prsttnBankName" :label="$t('m.i.ce.entrustBankName')" required>
                <h-input v-model="refuseRegisterForm.prsttnBankName" placeholder="" :maxlength="80"></h-input>
              </h-form-item>-->
              <show-cpes-branch :label="$t('m.i.ce.entrustBankName')"
                                :bankNo.sync="refuseRegisterForm.prsttnBankNo" :cpesBrchName.sync="refuseRegisterForm.prsttnBankName"
                                prop="prsttnBankName" :isInitValueClearable="true"
                                :required="true" :msgBoxWin="refuseRegisterWin" :isQueryByBankNo="true"
                                datagridUrl="/cpes/branch/queryBranchList"
                                queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

              <h-form-item prop="prsttnBankNo" :label="$t('m.i.ce.entrustBankNo')" required :validRules="prsttnBankNoRule">
                <h-input v-model="refuseRegisterForm.prsttnBankNo" placeholder="" :maxlength="12" readonly></h-input>
              </h-form-item>

              <h-form-item prop="prsttnAcctNo" :label="$t('m.i.ce.entrustAcctNo')" required :validRules="prsttnAcctNoRule">
                <h-input v-model="refuseRegisterForm.prsttnAcctNo" placeholder="" :maxlength="35" icon="android-search" @on-click="queryCustAcctNo('refuse')"></h-input>
              </h-form-item>
              <h-form-item prop="prsttnName" :label="$t('m.i.ce.entrustName')" required>
                <h-input v-model="refuseRegisterForm.prsttnName" placeholder="" :maxlength="80"></h-input>
              </h-form-item>
              <h-form-item prop="rejectReason" :label="$t('m.i.ce.rejectReason')" required class="h-form-height-auto">
                <h-input v-model="refuseRegisterForm.rejectReason" placeholder="" type="textarea"  :rows="10" :canResize="false" :maxlength="200"></h-input>
              </h-form-item>
            </h-form>
          </div>
          <div slot="footer">
            <div slot="footer">
              <h-button type="ghost" @click="refuseRegisterWinClose">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
              <h-button type="primary" v-else @click="refuseRegisterWinSubmit()">{{$t("m.i.ce.refuseRegister")}}</h-button>
            </div>
          </div>
        </h-msg-box>
        <!-- 查询客户账号信息弹窗 -->
        <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.drwrCustNo"  :isSearch="true"
                           @showCustAcctNoWinClose="showCustAcctNoWinClose" @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>

        <!--<brch-code-search :brchCodeWin="brchCodeWin" @brchCodeWinClose="brchCodeWin=false"
                          @brchCodeChange="brchCodeChange" optType="2"></brch-code-search>-->
        <!-- 票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>
      </h-col>
    </h-row>
  </div>
</template>

<script>
import {formatNumber, getDictListByGroups, getDictValueFromMap, post} from "@/api/bizApi/commonUtil";

export default {
    name: "busiPaymentRegisterMain",
    components: {
      //BrchCodeSearch:()=>import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`),

    },
    data() {
      return {
        type:"",
        openCustWinType:"",
        //brchCodeWin:false,
        showBillInfoWin: false,
        billId: "",
        prsttnAcctNoRule: [{ test: /^[0-9a-zA-Z]{1,35}$/, trigger: "blur", message: "由小于或等于35位数字或字母组成" }],
        prsttnBankNoRule: [{ test: /^[0-9]{12}$/, trigger: "blur", message: "请输入12位数字的行号" }],
        formItem: {
          createBrchNo: this.$store.getters.userInfo.brchNo,
          billNoLike:"",
          minRemitDt: "",
          drwrName:"",
          drwrAcctNo:"",
          maxRemitDt: "",
          minDueDt: "",
          maxDueDt: "",
          acptStatus: "1",
          billClass: "ME01",
          prsttnRespStatusList: "0000,SN05,SN06,SN12",
          reverseBillNo: ''
        },
        formItemRemitDt: [],
        formItemDueDt: "",
        paymentRegisterForm: {
          id: "",
          prsttnAcctNo: "",
          prsttnName: "",
          prsttnBankNo: "",
          prsttnBankName: "",
          paymentSignOpin: "同意付款",
          // prsttnType:"1"
        },
        refuseRegisterForm: {
          ids: "",
          billClass: "ME01",
          prsttnAcctNo:"",
          prsttnName:"",
          prsttnBankNo:"",
          prsttnBankName:"",
          rejectReason: ""
        },
        columns: [
          {
            title: " ",
            type: "radio",
            align: "center",
            width: 50
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
           title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.flowStatus"),
            key: "prsttnRespStatus",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.riskStatus"),
            key: "riskStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"RiskStatus",params.row.riskStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
          title: this.$t("m.i.billInfo.billMoneyByUnit"),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ",");
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            sortable: true,
            hiddenCol: false
          },
          {
           title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            sortable: true,
            hiddenCol: false
          },
          {
           title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: "drwrAcctNo",
            hiddenCol: false
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
           title: this.$t("m.i.ce.entrustAcctNo"),
            key: "prsttnAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.entrustName"),
            key: "prsttnName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.entrustBankNo"),
            key: "prsttnBankNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.entrustBankName"),
            key: "prsttnBankName",
            sortable: true,
            hiddenCol: false
          },
          // {
          //   title: this.$t("m.i.ce.entrustType"),
          //   key: "prsttnType",
          //   sortable: true,
          //   hiddenCol: false,
          //   render: (h, params) => {
          //     if (params.row.prsttnType === '1') return h('span', '企业')
          //   }
          // },
          {
            title: this.$t("m.i.ce.paymentSignOpin"),
            key: "paymentSignOpin",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.payRefuseReason"),
            key: "rejectReason",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.paymentReturnReason"),
            key:"paymentRgstReturnReason",
            hiddenCol:false
          }
        ],
        submitFlag: false,
        dictMap: new Map(),
        YonList: [],
        currentSelectRow: [],
        showCustAcctNoWin: false,
        paymentRegisterWin: false,
        refuseRegisterWin: false,
        ifShowMore: false
      }
    },
    mounted() {
      getDictListByGroups("Yon,DraftTypeCode,AcptType,RiskStatus,DraftTypeCode,").then(res => {
        this.YonList = res.get("Yon");
        this.dictMap = res.get("map");
      });
      this.getParams();
    },
    methods: {
      /*brchCodeWinOpen(type){
        this.type=type;
        this.brchCodeWin=true;
      },*/
      /*brchCodeChange(info){
        if (this.type==="agree"){
          this.paymentRegisterForm.prsttnBankNo = info.transBrchBankNo;
          this.paymentRegisterForm.prsttnBankName = info.brchFullNameZh;
        }else {
          this.refuseRegisterForm.prsttnBankNo = info.transBrchBankNo;
          this.refuseRegisterForm.prsttnBankName = info.brchFullNameZh;
        }
        this.brchCodeWin = false;
      },*/
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(billId){
        this.billId = billId;
        this.showBillInfoWin = true;
      },
      handleRemitDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minRemitDt = arr[0].replace(/-/g, "");
          this.formItem.maxRemitDt = arr[1].replace(/-/g, "");
          this.formItemRemitDt = [arr[0], arr[1]];
        } else {
          this.formItem.minRemitDt = "";
          this.formItem.maxRemitDt = "";
          this.formItemRemitDt = [];
        }
      },
      handleDueDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.formItemDueDt = [arr[0], arr[1]];
        } else {
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.formItemDueDt = [];
        }
      },
      //表单查询
      handleSearch() {
        this.$nextTick(() => {
          this.currentSelectRow = [];
          this.$refs.datagrid.dataChange(1);
        })
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.minRemitDt = "";
        this.formItem.maxRemitDt = "";
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.formItemRemitDt = "";
        this.formItemDueDt = "";
      },
      //行选中
      handleRowClick(arr) {
        this.currentSelectRow = arr;
      },
      handleRowClickCancel() {
        this.currentSelectRow = [];
      },
      //查询客户账号信息
      //触发弹窗
      queryCustAcctNo(info) {
        this.openCustWinType=info;
        this.showCustAcctNoWin = true;
      },
      //赋值
      custAcctNoSelectSubmit(info) {
        if (this.openCustWinType==="agree"){
          this.paymentRegisterForm.prsttnAcctNo=info.custAcctNo;
          this.paymentRegisterForm.prsttnName=info.custName;
        }else {
          this.refuseRegisterForm.prsttnAcctNo=info.custAcctNo;
          this.refuseRegisterForm.prsttnName=info.custName;
        }
        this.showCustAcctNoWin = false;
      },
      //关闭弹窗
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },

      //付款登记
      paymentRegister() {
        if(this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if(this.currentSelectRow.riskStatus === "RS06") {
          this.$msgTip.info(this, { info: "除权判决的票不允许付款登记！" });
          return;
        }
        // this.paymentRegisterForm.prsttnType = "1";
        this.paymentRegisterForm.prsttnAcctNo = this.currentSelectRow.prsttnAcctNo;
        this.paymentRegisterForm.prsttnName = this.currentSelectRow.prsttnName;
        this.paymentRegisterForm.prsttnBankNo = this.currentSelectRow.prsttnBankNo;
        this.paymentRegisterForm.prsttnBankName = this.currentSelectRow.prsttnBankName;
        // this.paymentRegisterForm.prsttnType = "1";
        if(this.currentSelectRow.paymentSignOpin){
          this.paymentRegisterForm.paymentSignOpin = this.currentSelectRow.paymentSignOpin;
        }
        if(this.currentSelectRow.riskStatus === "RS01" || this.currentSelectRow.riskStatus === "RS02" ||
          this.currentSelectRow.riskStatus === "RS03"  || this.currentSelectRow.riskStatus === "RS05") {
          this.$hMsgBox.confirm({
            title: "确认",
            content: "该票据为风险票据，确定要付款登记吗？",
            onOk: () => {
              this.paymentRegisterWin = true;
            },
          });
        }else {
          this.paymentRegisterWin = true;
        }
      },
      //付款登记弹窗确定
      paymentRegisterWinSubmit() {
        this.paymentRegisterForm.id = this.currentSelectRow.id;
        this.$refs["paymentRegisterForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            post(this.paymentRegisterForm, "/ce/acpt/outerBusiBill/busiPaymentDue/busiPaymentRegisterMain/func_submitPaymentRgst").then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.paymentRegisterWinClose();
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.currentSelectRow = [];
                } else {
                  this.$msgTip.error(this, { info: msg });
                  // this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  // this.currentSelectRow = [];
                }
              }
            }).catch(error => {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });
          }
        })
      },
      //付款登记弹窗关闭
      paymentRegisterWinClose() {
        this.paymentRegisterWin = false;
        this.$refs.paymentRegisterForm.resetFields();
      },
      //拒付登记
      refuseRegister() {
        if(this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.refuseRegisterWin = true;
      },
      //拒付登记弹窗确定
      refuseRegisterWinSubmit() {
        this.refuseRegisterForm.ids = this.currentSelectRow.id;
        this.$refs["refuseRegisterForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            post(this.refuseRegisterForm, "/ce/acpt/outerBusiBill/busiPaymentDue/busiPaymentRegisterMain/func_submitRefusePayment").then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                    // //打印拒付理由书
                    // let dataList = [];
                    // let data = {};
                    // data.rejectReason = this.refuseRegisterForm.rejectReason;
                    // data.billNo = this.currentSelectRow.billNo;
                    // data.billMoney = this.currentSelectRow.billMoney;
                    // data.refuseMoney = this.currentSelectRow.billMoney;
                    // data.drweName = this.currentSelectRow.acptName;
                    // data.drweAcctNo = this.currentSelectRow.acptAcctNo;
                    // data.drweBankName = this.currentSelectRow.acptBankName;
                    // data.pyeeName = this.currentSelectRow.pyeeName;
                    // data.pyeeAcctNo = this.currentSelectRow.pyeeAcctNo;
                    // data.pyeeBankName = this.currentSelectRow.pyeeBankName;
                    // let refuseDt = window.sessionStorage.getItem("workDate");
                    // data.year = refuseDt.slice(0,4);
                    // data.month = refuseDt.slice(4,6);
                    // data.date = refuseDt.slice(6,8);
                    // data.printObj = JSON.stringify(data);
                    // dataList.push(data);
                    // this.refusePayPrint(dataList);
                  this.refuseRegisterWinClose();
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.currentSelectRow = [];
                } else {
                  this.$msgTip.error(this, { info: msg });
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.currentSelectRow = [];
                }
              }
            }).catch(error => {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });
          }
        })
      },
      //打印拒付理由书
      refusePayPrint(dataList){
          this.$print.vochPrint(this, {
              exitDataFlag: true, params: { voucherType: "PE031604", vocherData: dataList },
              callback: () => {
              },
              errorCallback: () => {
              }
          });
      },
      //拒付登记弹窗关闭
      refuseRegisterWinClose() {
        this.refuseRegisterWin = false;
        this.$refs.refuseRegisterForm.resetFields();
      },
      getParams(){
        if (this.$route.path === "/ce/acpt/paper/paymentDue/paymentRegisterMain") {
          if (this.$route.query.dueDt) {
            let dueDt = this.$moment(this.$route.query.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            this.formItemDueDt = [dueDt, dueDt];
            this.$nextTick(() => {
              this.handleSearch();
            });
          }
        }
      }
    },
    watch: {
      "$route": "getParams"
    },
  };
</script>

<style scoped>

</style>
