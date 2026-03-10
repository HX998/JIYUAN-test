<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="reverseBillNo" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="formItem.reverseBillNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="remitDt" :label="$t('m.i.billInfo.remitDt')">
                  <h-date-picker type="daterange" :value="formItemRemitDt" format="yyyy-MM-dd" showFormat :editable=false placeholder="" @on-change="handleRemitDtChange" autoPlacement></h-date-picker>
                </h-form-item>
                <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')">
                  <h-date-picker type="daterange" :value="formItemDueDt" format="yyyy-MM-dd" showFormat :editable=false placeholder="" @on-change="handleDueDtChange" autoPlacement></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="handleSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                      url="/ce/acpt/paper/paymentDue/paymentRegisterMain/func_pageQueryPaperPaymentRgstList"
                      :bindForm="formItem"
                      :on-current-change="handleRowClick"
                      :on-current-change-cancel="handleRowClickCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="paymentRegister" :disabled="payRgstBtn">{{$t('m.i.ce.paymentRegister')}}</h-button>
              <h-button type="primary" @click="refuseRegister" :disabled="refuseRgstBtn">{{$t('m.i.ce.refuseRegister')}}</h-button>
              <h-button type="primary" @click="inStock" v-if="entityStock" :disabled="inStockBtn" >{{$t('m.i.ce.inStock')}}</h-button>
              <h-button type="primary" @click="outStock" v-if="entityStock" :disabled="outStockBtn">{{$t('m.i.ce.outStock')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 付款登记弹框 -->
        <h-msg-box v-model="paymentRegisterWin" width="400" @on-close="paymentRegisterWinClose" class="h-form-search-layer" :maximize="true" :mask-closable="false">
          <p slot="header">
            <span>付款登记</span>
          </p>
          <div>
            <h-form :model="paymentRegisterForm" :label-width="115" ref="paymentRegisterForm" cols="1" class="h-form-search" >
              <h-form-item prop="prsttnAcctNo" :label="$t('m.i.ce.entrustAcctNo')" required :validRules="prsttnAcctNoRule">
                <h-input v-model="paymentRegisterForm.prsttnAcctNo" placeholder="" :maxlength="35"  @on-blur="queryCustAcctByCustNo('agree')"></h-input>
              </h-form-item>
              <h-form-item prop="prsttnName" :label="$t('m.i.ce.entrustName')" required>
                <h-input v-model="paymentRegisterForm.prsttnName" placeholder="" :maxlength="80"></h-input>
              </h-form-item>
              <h-form-item prop="prsttnBankNo" :label="$t('m.i.ce.entrustBankNo')" required :validRules="prsttnBankNoRule">
                <h-input v-model="paymentRegisterForm.prsttnBankNo" placeholder="" :maxlength="12" @on-blur="queryBankNameByBankNo('agree')"></h-input>
              </h-form-item>
              <h-form-item prop="prsttnBankName" :label="$t('m.i.ce.entrustBankName')" required>
                <h-input v-model="paymentRegisterForm.prsttnBankName" placeholder="" :maxlength="80"></h-input>
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

        <h-msg-box v-model="inStockWin" width="400" @on-close="inStockWinClose" class="h-form-search-layer" :maximize="true" :mask-closable="false">
          <p slot="header">
            <span>提交入库</span>
          </p>
          <div>
            <h-form :model="inStockForm" :label-width="115" ref="inStockForm" cols="1" class="h-form-search" onlyBlurRequire>
              <cust-name :formItem = "inStockForm" @queryCustMessage="queryCustMessage" :isReadonly="false" :required="true"></cust-name>
            </h-form>
          </div>
          <div slot="footer">
            <div slot="footer">
              <h-button type="ghost" @click="inStockWinClose">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
              <h-button type="primary" v-else @click="inStockWinSubmit">{{$t("m.i.common.commit")}}</h-button>
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
        <!-- 查询客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showCustMessageWin"
                           @custCorpWinClose="custCorpWinClose" @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
        <!-- 查询客户账号信息弹窗 -->
        <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.drwrCustNo"
                           @showCustAcctNoWinClose="showCustAcctNoWinClose" @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
        <!-- 票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>
      </h-col>
    </h-row>
  </div>
</template>

<script>
import {
  formatNumber,
  getDictListByGroups,
  getDictValueFromMap,
  getSingleParamValuesByKeys,
  post
} from "@/api/bizApi/commonUtil";

export default {
    name: "paymentRegisterMain",
    components: {
    },
    data() {
      return {
        showBillInfoWin: false,
        billId: "",
        prsttnAcctNoRule: [{ test: /^(?!^\-*$)([0-9a-zA-Z\-]{1,32})$/, trigger: "blur", message: "由小于或等于32位数字或字母或-组成,不能全为-" }],
        prsttnBankNoRule: [{ test: /^[0-9]{12}$/, trigger: "blur", message: "请输入12位数字的行号" }],
        formItem: {
          paymentBrchNo: this.$store.getters.userInfo.brchNo,
          billNoLike: "",
          minRemitDt: "",
          maxRemitDt: "",
          minDueDt: "",
          maxDueDt: "",
          acptStatus: "1",
          billClass: "ME01",
          isLock:'0',
          prsttnRespStatusList: "0000,SN05,SN06,SU01",
          reverseBillNo:''
        },
        formItemRemitDt: "",
        formItemDueDt: "",
        inStockForm:{
          custNo:"",
          custName:""
        },
        paymentRegisterForm: {
          id: "",
          prsttnAcctNo: "",
          prsttnName: "",
          prsttnBankNo: "",
          prsttnBankName: "",
          paymentSignOpin: "同意付款",
          billClass: "ME01",
          prsttnRespStatusList: "0000,SN05,SN06,SU01"
        },
        refuseRegisterForm: {
          ids: "",
          billClass: "ME01",
          rejectReason: "",
          prsttnRespStatusList: "0000,SN05,SN06,SU01"
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
            title: this.$t("m.i.ce.acptType"),
            key: "acptType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "AcptType", params.row.acptType);
              return h("span", {
                domProps: {
                  title: list
                }
              }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.flowStatus"),
            key: "flowStatusName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.stockStatus"),
            key: "stockStatus",
            hiddenCol: true,
            render: (h, params) => {
              let list = "";
              if (params.row.stockStatus === null || params.row.stockStatus === "") {
                list = "未入库";
              } else {
                list = getDictValueFromMap(this.dictMap, "EntityStockFlowStatus", params.row.stockStatus);
              }
              return h("span", {
                domProps: {
                  title: list
                }
              }, list);
            }
          },
          {
            title: this.$t("m.i.ce.fastCashStatus"),
            key: 'fastCashStatus',
            hiddenCol: true,
            render: (h, params) => {
              let dict = "";
              if(params.row.fastCashStatus === '1' || params.row.fastCashStatus === '2' || params.row.fastCashStatus === '3'){
                dict = "可秒兑";
              }else if (params.row.fastCashStatus === '5'){
                dict = "不可秒兑";
              }else if(params.row.fastCashStatus === '6'){
                dict = "秒兑失败（人工介入）";
              }
              return h("span",
                {
                  domProps: {
                    title: dict
                  }
                }, dict);
            }
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
            title: this.$t("m.i.billInfo.acptProtocalNo"),
            key: "acptProtocalNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.promNoteNo"),
            key: "promNoteNo",
            hiddenCol: false
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
          {
            title: this.$t("m.i.ce.paymentSignOpin"),
            key: "paymentSignOpin",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.rejectReason"),
            key: "rejectReason",
            hiddenCol: false
          }, {
            title: this.$t("m.i.ce.paymentReturnReason"),
            key: "paymentReturnReason",
            hiddenCol: false
          },
        ],
        submitFlag: false,
        dictMap: new Map(),
        YonList: [],
        currentSelectRow: [],
        showCustAcctNoWin: false,
        showCustMessageWin: false,
        paymentRegisterWin: false,
        refuseRegisterWin: false,
        ifShowMore: false,
        payRgstBtn:false,
        refuseRgstBtn:false,
        inStockBtn:false,
        outStockBtn:false,
        entityStock:false,
        inStockWin:false,
        entityStockParam:""
      }
    },
    mounted() {
      getDictListByGroups("Yon,DraftTypeCode,AcptType,RiskStatus,EntityStockFlowStatus,DraftTypeCode,FastCashStatus").then(res => {
        this.YonList = res.get("Yon");
        this.dictMap = res.get("map");
      });
      post({ paramKey: "pc.stock.open_scren" }, "/sm/auth/systemParameter/findSystemParameter").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.entityStockParam = res.data.retMsg;
            if(this.entityStockParam.indexOf("01") >= 0){//包含01兑付
              this.entityStock = true;
              this.$refs.datagrid.controlColumnsHidden("stockStatus", false);
            }
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
      this.getParams();
      this.fastCastFailReasonShow();
    },
    methods: {
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
        this.formItem.reverseBillNo = '';
      },
      //行选中
      handleRowClick(arr) {
        if(this.entityStock){//库存模式下，判断按钮是否可用
          if(arr.stockStatus === null || arr.stockStatus === "" || arr.stockStatus === "EN12"){//库存状态为空或入库退回，仅可入库
            this.payRgstBtn = true;
            this.refuseRgstBtn = true;
            this.inStockBtn = false;
            this.outStockBtn = true;
          }
          if(arr.stockStatus === "EN01" || arr.stockStatus === "EN06"
            || arr.stockStatus === "EN04" || arr.stockStatus === "EN05"
            || arr.stockStatus === "EN09" || arr.stockStatus === "EN10"){//待入库、待出库、或处于记账授权中，按钮均不可操作
            this.payRgstBtn = true;
            this.refuseRgstBtn = true;
            this.inStockBtn = true;
            this.outStockBtn = true;
          }
          if(arr.stockStatus === "EN02" || arr.stockStatus === "EN14"){//已入库或出库退回，可付款登记+出库
            this.payRgstBtn = false;
            this.refuseRgstBtn = true;
            this.inStockBtn = true;
            this.outStockBtn = false;
          }
          if(arr.stockStatus === "EN07"){//已出库，可入库+拒付登记
            this.payRgstBtn = true;
            this.refuseRgstBtn = false;
            this.inStockBtn = false;
            this.outStockBtn = true;
          }
        }
        this.currentSelectRow = arr;
      },
      handleRowClickCancel() {
        this.currentSelectRow = [];
        this.payRgstBtn = false;
        this.refuseRgstBtn = false;
        this.inStockBtn = false;
        this.outStockBtn = false;
      },
      //查询客户账号信息
      //触发弹窗
      queryCustAcctByCustNo(type) {
        let form;
        if (type === "agree") {
          form = this.paymentRegisterForm;
        }else {
          form = this.refuseRegisterForm;
        }
        let custAcctNo = form.prsttnAcctNo;
        let url = "";
        if (custAcctNo) {
          url = "/ce/acpt/AcptCustAcctMain/func_queryAcptCustAcctByCustNo";
          {
            post({custAcctNo:custAcctNo}, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  form.prsttnName= res.data.retData.custName;
                  form.prsttnBankNo = res.data.retData.bankAcctNo;
                  form.prsttnBankName = res.data.retData.bankName;
                } else {
                  form.prsttnName= "";
                  form.prsttnBankNo = "";
                  form.prsttnBankName = "";
                }
              }
            }).catch(error => {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });
          }
        } else {
          this.$msgTip.error(this, { info:"托收人账号不能为空！"}) ;
        }
      },
      //查询托收行行名信息根据托收行行号
      //触发弹窗
      queryBankNameByBankNo(type) {
        let form;
        if (type === "agree") {
          form = this.paymentRegisterForm;
        }else {
          form = this.refuseRegisterForm;
        }
        let transBrchBankNo = form.prsttnBankNo;
        let url = "";
        if (transBrchBankNo) {
          url = "/cpes/branch/queryBranchList";
          {
            post({transBrchBankNo:transBrchBankNo}, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  let list = res.data.retData.list;
                  form.prsttnBankName = list[0].brchFullNameZh;
                } else {
                  form.prsttnBankName = "";
                }
              }
            }).catch(error => {
              this.$msgTip.info(this, { info: this.$t("根据行号【")+transBrchBankNo+this.$t("】在票交所基础数据中未查询到对应行名信息，请手动输入行名")});
            });
          }
        } else {
          this.$msgTip.error(this, { info:"托收行行号不能为空！"}) ;
        }
      },
      //赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.drwrAcctNo = info.custAcctNo;
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
        this.paymentRegisterForm.id = this.currentSelectRow.id;
        this.paymentRegisterForm.prsttnAcctNo = this.currentSelectRow.prsttnAcctNo;
        this.paymentRegisterForm.prsttnName = this.currentSelectRow.prsttnName;
        this.paymentRegisterForm.prsttnBankNo = this.currentSelectRow.prsttnBankNo;
        this.paymentRegisterForm.prsttnBankName = this.currentSelectRow.prsttnBankName;
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
        this.$refs["paymentRegisterForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            post(this.paymentRegisterForm, "/ce/acpt/paper/paymentDue/paymentRegisterMain/func_submitPaymentDueRgst").then(res => {
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
      //查询客户信息
      queryCustMessage() {
        this.showCustMessageWin = true;
      },
      //根据客户信息查询框所选数据进行赋值
      custCorpSelectSubmit(info) {
        this.$refs.inStockForm.resetFields();
        this.inStockForm.custName = info.custName;
        this.inStockForm.custNo = info.custNo;
        this.showCustMessageWin = false;
      },
      //客户信息查询框关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      inStockWinClose(){
        this.inStockWin = false;
        this.inStockForm.custName = "";
        this.inStockForm.custNo = "";
        this.$refs.inStockForm.resetFields();
      },
      inStockWinSubmit(){
        this.$refs["inStockForm"].validate(valid => {
            if (valid) {
               post({id:this.currentSelectRow.id,custName:this.inStockForm.custName,custNo:this.inStockForm.custNo}, "/ce/acpt/paper/paymentDue/paymentRegisterMain/func_submitInStock").then(res => {
               this.submitFlag = false;
               if (res) {
                 let msg = res.data.retMsg;
                 let retCode = res.data.retCode;
                 if (retCode === "000000") {
                   this.$msgTip.success(this);
                   this.$refs.datagrid.dataChange(1);
                   this.currentSelectRow = [];
                   this.inStockWinClose();
               } else {
                   this.$msgTip.error(this, { info: msg });
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
      inStock(){//入库
        if(this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.inStockWin = true;
      },
      outStock(){//出库
        if(this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: "确认",
          content: "确定提交出库？",
          onOk: () => {
            post({id:this.currentSelectRow.id}, "/ce/acpt/paper/paymentDue/paymentRegisterMain/func_submitOutStock").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(1);
                  this.currentSelectRow = [];
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              }
            }).catch(error => {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });
          },
        });
      },
      //拒付登记
      refuseRegister() {
        if(this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.refuseRegisterForm.ids = this.currentSelectRow.id;
        this.refuseRegisterWin = true;
      },
      //拒付登记弹窗确定
      refuseRegisterWinSubmit() {
        this.$refs["refuseRegisterForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            post(this.refuseRegisterForm, "/ce/acpt/paper/paymentDue/paymentRegisterMain/func_submitPaymentDueRefuseRgst").then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  //打印拒付理由书
                  let dataList = [];
                  let data = {};
                  data.rejectReason = this.refuseRegisterForm.rejectReason;
                  data.billNo = this.currentSelectRow.billNo;
                  data.billMoney = this.currentSelectRow.billMoney;
                  data.refuseMoney = this.currentSelectRow.billMoney;
                  data.drweName = this.currentSelectRow.acptName;
                  data.drweAcctNo = this.currentSelectRow.acptAcctNo;
                  data.drweBankName = this.currentSelectRow.acptBankName;
                  data.pyeeName = this.currentSelectRow.pyeeName;
                  data.pyeeAcctNo = this.currentSelectRow.pyeeAcctNo;
                  data.pyeeBankName = this.currentSelectRow.pyeeBankName;
                  let refuseDt = window.sessionStorage.getItem("workDate");
                  data.year = refuseDt.slice(0,4);
                  data.month = refuseDt.slice(4,6);
                  data.date = refuseDt.slice(6,8);
                  data.printObj = JSON.stringify(data);
                  dataList.push(data);
                  this.refusePayPrint(dataList);
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
      },
      fastCastFailReasonShow(){
        //查询业务参数
        getSingleParamValuesByKeys("ce.acpt.fast_cash_bill_class,ce.acpt.fast_cash_mode").then(res => {
          let fastCashBillClass = res['ce.acpt.fast_cash_bill_class'];
          let fastCashMode = res['ce.acpt.fast_cash_mode'];
          if(fastCashMode === '1' && fastCashBillClass !== undefined && fastCashBillClass !== null && fastCashBillClass.includes("ME01")){
            this.$refs.datagrid.controlColumnsHidden("fastCashStatus", false);
          } else {
            this.$refs.datagrid.controlColumnsHidden("fastCashStatus", true);
          }
        });
      },
    },
    watch: {
      "$route": "getParams"
    },
  };
</script>

<style scoped>

</style>
