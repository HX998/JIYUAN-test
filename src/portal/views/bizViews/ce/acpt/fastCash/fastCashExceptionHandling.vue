<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="billNoLike" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="formItem.billNoLike" :maxlength=60 placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="billClass" :label="$t('m.i.billInfo.billClass')">
                  <h-select v-model="formItem.billClass" placeholder="" showTitle>
                    <h-option v-for="item in BillClassList" :value="item.key" :key="item.value"  v-if="fastCashBillClass.includes(item.key)">{{ item.value}}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="remitDt" :label="$t('m.i.billInfo.remitDt')">
                  <h-date-picker type="daterange" :value="remitDt" format="yyyy-MM-dd" showFormat :editable=false placeholder="" @on-change="remitDtChange" autoPlacement></h-date-picker>
                </h-form-item>
                <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')">
                  <h-date-picker type="daterange" :value="dueDt" format="yyyy-MM-dd" showFormat :editable=false placeholder="" @on-change="dueDtChange" autoPlacement></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.pc.dealStatus')" prop="fastCashStatusList">
                  <h-select v-model="formItem.fastCashStatusList"  placeholder="" multiple showTitle>
                    <h-option v-for="item in FastCashStatusList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="otherBankAcptMark" :label="$t('m.i.ce.otherBankAcptMark')">
                  <h-select v-model="formItem.otherBankAcptMark" placeholder="" showTitle>
                    <h-option v-for="item in YonList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="clearMark" :label="$t('m.i.ce.clearMark')">
                  <h-select v-model="formItem.clearMark" placeholder="" showTitle>
                    <h-option v-for="item in settleTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="prsttnType" :label="$t('m.i.ce.isFinancePrsttn')" class="h-form-long-label">
                  <h-select v-model="formItem.prsttnType" placeholder="" showTitle>
                    <h-option v-for="item in YonList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="prsttnName" :label="$t('m.i.billInfo.prsttnName')" class="h-form-long-label">
                  <h-input v-model="formItem.prsttnName" :maxlength="80" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="prsttnAcctNo" :label="$t('m.i.billInfo.prsttnAcctNo')" class="h-form-long-label">
                  <h-input v-model="formItem.prsttnAcctNo" :maxlength="35" placeholder=""></h-input>
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
                      :row-select="true"
                      :has-select="false"
                      url="/ce/acpt/fastCash/fastCashExceptionHandling/func_queryFastCashData"
                      :bindForm="formItem"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-dropdown trigger="click" @on-click="fastCashHandle">
                <h-button type="primary">{{$t('m.i.ce.fastCash')}}
                  <h-icon name="unfold"></h-icon>
                </h-button>
                <h-dropdown-menu slot="list">
                  <h-dropdown-item name="select">选择秒兑</h-dropdown-item>
                  <h-dropdown-item name="list">批量秒兑</h-dropdown-item>
                </h-dropdown-menu>
              </h-dropdown>
              <h-button type="primary" @click="acctInfoRecheck">{{$t('m.i.ce.acctInfoRecheck')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 收款信息审核 -->
        <h-msg-box v-model="paymentRegisterWin" width="400" @on-close="paymentRegisterWinClose" class="h-form-search-layer" :maximize="true" :mask-closable="false">
          <p slot="header">
            <span>收款信息审核</span>
          </p>
          <div>
            <h-form :model="paymentRegisterForm" :label-width="115" ref="paymentRegisterForm" cols="1" class="h-form-search">
              <h-form-item prop="prsttnAcctNo" :label="$t('m.i.billInfo.prsttnAcctNo')" required  :validRules="prsttnAcctNoRule">
                <h-input v-model="paymentRegisterForm.prsttnAcctNo" placeholder=""  :maxlength="35"></h-input>
              </h-form-item>
              <h-form-item prop="prsttnName" :label="$t('m.i.billInfo.prsttnName')" required>
                <h-input v-model="paymentRegisterForm.prsttnName" placeholder=""  :maxlength="80"></h-input>
              </h-form-item>
              <h-form-item prop="prsttnBankNo" :label="$t('m.i.billInfo.prsttnBankNo')" required :validRules="prsttnBankNoRule">
                <h-input v-model="paymentRegisterForm.prsttnBankNo" placeholder=""  :maxlength="12"></h-input>
              </h-form-item>
              <h-form-item prop="prsttnBankName" :label="$t('m.i.billInfo.prsttnBankName')" required>
                <h-input v-model="paymentRegisterForm.prsttnBankName" placeholder=""  :maxlength="80"></h-input>
              </h-form-item>
              <h-form-item prop="paymentSignOpin" :label="$t('m.i.ce.paymentSignOpin')"  class="h-form-height-auto" required>
                <h-input v-model="paymentRegisterForm.paymentSignOpin" placeholder="" type="textarea" :rows="2" :canResize="false" :maxlength="65"></h-input>
              </h-form-item>
              <h-form-item prop="prsttnRemark" :label="$t('m.i.billInfo.prsttnRemark')">
                <h-input v-model="paymentRegisterForm.prsttnRemark" placeholder="" readonly disabled type="textarea" :rows="3" :canResize="false" :maxlength="100"></h-input>
              </h-form-item>
            </h-form>
          </div>
          <div slot="footer">
            <div slot="footer">
              <h-button type="ghost" @click="paymentRegisterWinClose">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
              <h-button type="primary" v-else @click="paymentRegisterWinSubmit()">{{$t("m.i.ce.fashCashAcct")}}</h-button>
            </div>
          </div>
        </h-msg-box>
        <!-- 票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { getDictListByGroups, off, on, post,getDictValueFromMap,formatNumber,getSingleParamValuesByKeys } from "@/api/bizApi/commonUtil";

  export default {
        name: "fastCashExceptionHandling",
        components: {

        },
        data() {
          return{
            showBillInfoWin: false,
            paymentRegisterWin: false,
            billId: "",
            billNo : "",
            fastCashBillClass : "",
            dictMap: new Map(),
            BillClassList : [],
            statusList : [],
            YonList : [],
            submitFlag: false,
            ifShowMore: false,
            dueDt :[],
            remitDt : [],
            FastCashStatusList : [],
            SettlementMarkList : [],
            settleTypeList:[],
            prsttnAcctNoRule: [{test: /^[0-9a-zA-Z]{1,35}$/, trigger:'blur', message: '由小于或等于35位数字或字母组成'}],
            prsttnBankNoRule: [{test: /^[0-9]{12}$/, trigger:'blur', message: '请输入12位数字的行号'}],
            formItem: {
              billNoLike : '',
              billClass : '',
              minRemitDt: "",
              maxRemitDt: "",
              minDueDt: "",
              maxDueDt: "",
              prsttnName: '',
              prsttnAcctNo: '',
              prsttnType : '',
              clearMark : '',
              fastCashStatusList : ['3'],
              otherBankAcptMark : ""
            },
            paymentRegisterForm: {
              id: '',
              prsttnAcctNo: '',
              prsttnName: '',
              prsttnBankNo: '',
              prsttnBankName: '',
              paymentSignOpin: '同意付款',
              prsttnRemark: '',
            },
            columns :[
              {
                type: "selection",
                hiddenCol: false,
                align: "center",
                width: 60
              },
              {
                type: 'index',
                key: 'numOrder',
                title: this.$t("m.i.common.index"),
                width: 60,
                align: 'center',
                hiddenCol: false,
              },
              {
                title: this.$t("m.i.billInfo.billNo"),
                key: 'billNo',
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
                title: this.$t("m.i.ce.otherBankAcptMark"),
                key: 'otherBankAcptMark',
                hiddenCol: false,
                render: (h, params) => {
                  let dictValue = getDictValueFromMap(this.dictMap,"Yon",params.row.otherBankAcptMark);
                  return h("span", {
                    domProps: {
                      title: dictValue
                    }
                  }, dictValue);
                }
              },
              {
                title: this.$t("m.i.billInfo.flowStatus"),
                key: 'flowStatusName',
                hiddenCol: false,
              },
              {
                title: this.$t("m.i.pc.dealStatus"),
                key: 'fastCashStatus',
                sortable: true,
                hiddenCol: false,
                render: (h, params) => {
                  let list = getDictValueFromMap(this.dictMap,"FastCashStatus",params.row.fastCashStatus);
                  return h("span",
                    {
                      domProps: {
                        title: list
                      }
                    }, list);
                }
              },
              {
                title: this.$t("m.i.billInfo.billClass"),
                key: "billClass",
                hiddenCol: false,
                render: (h, params) => {
                  let list = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
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
                key: 'billType',
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
                title: this.$t("m.i.ce.clearMark"),
                key: 'clearMark',
                hiddenCol: false,
                render: (h, params) => {
                  let dictValue = getDictValueFromMap(this.dictMap,"SettleType",params.row.clearMark);
                  return h("span", {
                    domProps: {
                      title: dictValue
                    }
                  }, dictValue);
                }
              },
              {
                title: this.$t("m.i.ce.isFinancePrsttn"),
                key: 'prsttnType',
                hiddenCol: false,
                render: (h, params) => {
                  let dictValue = getDictValueFromMap(this.dictMap,"Yon",params.row.prsttnType);
                  return h("span", {
                    domProps: {
                      title: dictValue
                    }
                  }, dictValue);
                }
              },
              {
                title: this.$t("m.i.billInfo.acptProtocalNo"),
                key: 'acptProtocalNo',
                hiddenCol: false,
              },
              {
                title: this.$t("m.i.ce.promNoteNo"),
                key: 'promNoteNo',
                hiddenCol: false,
              },
              {
                title: this.$t("m.i.billInfo.billMoney"),
                key: 'billMoney',
                hiddenCol: false,
                sortable: true,
                render: (h, params) => {
                  let billMoney = formatNumber(params.row.billMoney, 2, ',');
                  return h("span", {
                    domProps: {
                      title: billMoney
                    }
                  }, billMoney);
                }
              },
              {
                title: this.$t("m.i.billInfo.pyeeName"),
                key: 'pyeeName',
                sortable: true,
                hiddenCol: false,
              },
              {
                title: this.$t("m.i.billInfo.drwrName"),
                key: 'drwrName',
                sortable: true,
                hiddenCol: false,
              },
              {
                title: this.$t("m.i.billInfo.drwrAcctNo"),
                key: 'drwrAcctNo',
                hiddenCol: false,
              },
              {
                title: this.$t("m.i.billInfo.remitDt"),
                key: 'remitDt',
                hiddenCol: false,
                sortable: true,
                render: (h, params) => {
                  if(params.row.remitDt == null || params.row.remitDt === ""){
                    return "";
                  }
                  let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                  return h("span", date);
                }
              },
              {
                title: this.$t("m.i.billInfo.dueDt"),
                key: 'dueDt',
                hiddenCol: false,
                render: (h, params) => {
                  if(params.row.dueDt == null || params.row.dueDt === ""){
                    return "";
                  }
                  let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                  return h("span", date);
                }
              },
              {
                title: this.$t("m.i.billInfo.prsttnAcctNo"),
                key: 'prsttnAcctNo',
                hiddenCol: false,
              },
              {
                title: this.$t("m.i.billInfo.prsttnName"),
                key: 'prsttnName',
                hiddenCol: false,
              },
              {
                title: this.$t("m.i.billInfo.prsttnBankNo"),
                key: 'prsttnBankNo',
                hiddenCol: false,
              },
              {
                title: this.$t("m.i.billInfo.prsttnBankName"),
                key: 'prsttnBankName',
                hiddenCol: false,
              },
              {
                title: this.$t("m.i.billInfo.prsttnRemark"),
                key: 'prsttnRemark',
                hiddenCol: false,
              },
              {
                title: this.$t("m.i.ce.overdueReason"),
                key: 'overdueReason',
                hiddenCol: false,
              },
              {
                title: this.$t("m.i.common.failReason"),
                key: 'fastCashFailReason',
                hiddenCol: false,
              },
              {
                title: this.$t("m.i.ce.prsttnDtTm"),
                key: 'prsttnDtTm',
                hiddenCol: false,
                render: (h, params) => {
                  let transTm = params.row.prsttnDtTm.toString();
                  if (transTm.length < 6) {
                    for (let i = 0; i < (6 - transTm.length); i++) {
                      transTm = "0" + transTm;
                    }
                  }
                  let date = this.$moment(transTm, "HH:mm:ss").format("HH:mm:ss");
                  return h("span", date);
                }
              }
            ]
          }
        },
      mounted() {
        getDictListByGroups("AcptType,DraftTypeCode,CDMedia,Yon,SettlementMarkCode,FastCashStatus,SettleType").then(res => {
          this.remittanceChannelList = res.get("RemittanceChannel");
          this.dictMap = res.get("map");
          this.BillClassList = res.get("CDMedia");
          this.YonList = res.get("Yon");
          this.FastCashStatusList = res.get('FastCashStatus');
          this.SettlementMarkList =res.get('SettlementMarkCode');
          this.settleTypeList = res.get("SettleType");
        });
        this.getFastCashParams();
      },
      methods: {
        remitDtChange(arr) {
          if(arr && arr.length === 2){
            this.formItem.minRemitDt = arr[0].replace(/-/g, "");
            this.formItem.maxRemitDt = arr[1].replace(/-/g, "");
            this.remitDt = [arr[0], arr[1]];
          } else {
            this.formItem.minRemitDt = "";
            this.formItem.maxRemitDt = "";
            this.remitDt = [];
          }
        },
        dueDtChange(arr) {
          if(arr && arr.length === 2){
            this.formItem.minDueDt = arr[0].replace(/-/g, "");
            this.formItem.maxDueDt = arr[1].replace(/-/g, "");
            this.dueDt = [arr[0], arr[1]];
          } else {
            this.formItem.minDueDt = "";
            this.formItem.maxDueDt = "";
            this.dueDt = [];
          }
        },
        //表单查询
        handleSearch() {
          this.$nextTick(() => {
            this.$refs.datagrid.selects= [];
            this.$refs.datagrid.dataChange(1);
          })
        },
        //重置表单查询结果
        resetSearch() {
          this.$refs.formItem.resetFields();
          this.formItem.fastCashStatusList = ['3'];
          this.formItem.minRemitDt = "";
          this.formItem.maxRemitDt = "";
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.remitDt = "";
          this.dueDt = "";
        },
        fastCashHandle(info){

          let ids = this.$refs.datagrid.selectIds;
          if(info === 'select' && ids.length === 0){
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
            return;
          }
          let tipMsg = "";
          let param = {};
          if(info === 'select'){
            tipMsg = "确定执行秒兑吗？";
            param = {ids : ids};
          }else{
            tipMsg = "确定批量执行秒兑吗？";
            param = this.formItem;
          }
          this.$hMsgBox.confirm({
            title: "确认",
            content: tipMsg,
            onOk: () => {
              this.$loadingbox.open({
                title: "提交中，请稍后..."
              });
              let selectUrl = "/ce/acpt/fastCash/fastCashExceptionHandling/func_excuteFastCashSelect";
              let listUrl = "/ce/acpt/fastCash/fastCashExceptionHandling/func_excuteFastCashList";
              let url = info === "select" ? selectUrl : listUrl;
              post(param,url).then(res => {
                if(res){
                  this.$loadingbox.close();
                  let msg = res.data.retMsg;
                  let retCode = res.data.retCode;
                  if(retCode === "000000"){
                    this.$msgTip.success(this);
                    this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                    this.$refs.datagrid.selects = [];
                  }else {
                    this.$msgTip.error(this, { info: msg });
                  }
                } else {
                  this.$loadingbox.close();
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                }
              });

            }
          });
        },
        getFastCashParams(){
          getSingleParamValuesByKeys("ce.acpt.fast_cash_bill_class").then(res => {
            this.fastCashBillClass = res['ce.acpt.fast_cash_bill_class'];
            if (null == this.fastCashBillClass || this.fastCashBillClass === "" ){
              this.fastCashBillClass = "ME02";
            }
          });
        },
        //收款信息审核
        acctInfoRecheck(){
          let list = this.$refs.datagrid.selects;
          if (list.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
            return;
          }
          if (list.length > 1) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
            return;
          }
          let bill = list[0];
          /*财务公司托收 线下清算 未付款登记 的票据才需要付款信息审核*/
          let statusList = "SN00,SN05,SN07,SN10";
          if(!(bill.prsttnType === '1' && bill.clearMark === "SM01" && statusList.includes(bill.prsttnRespStatus))){
            this.$msgTip.info(this, { info: this.$t("m.i.ce.acctRecheckTipMsg") });
            return;
          }
          /*prsttnRemark: #托收人行号@托收人账号#电话号码*/
          let prsttnRemark = bill.prsttnRemark === undefined || bill.prsttnRemark == null ? '' : bill.prsttnRemark;
          let prsttnBankNo = prsttnRemark.substring(prsttnRemark.indexOf('#') + 1,prsttnRemark.indexOf('@'));
          let prsttnAcctNo = prsttnRemark.substring(prsttnRemark.indexOf('@') + 1,prsttnRemark.lastIndexOf('#'));
          let phoneNo = prsttnRemark.substring(prsttnRemark.lastIndexOf('#') + 1);
          if(bill.prsttnRespStatus === 'SN00'){
            //首次返现提示付款备注
            post({code : prsttnBankNo },"/ce/acpt/fastCash/fastCashExceptionHandling/func_queryBankName").then(res => {
              if(res){
                let retCode = res.data.retCode;
                if(retCode === "000000"){
                  let bankName = res.data.retMsg;
                  this.paymentRegisterForm.prsttnAcctNo = prsttnAcctNo;
                  this.paymentRegisterForm.prsttnBankNo = prsttnBankNo;
                  this.paymentRegisterForm.prsttnBankName = bankName;
                  this.paymentRegisterForm.id = bill.id;
                  this.paymentRegisterForm.prsttnName = bill.prsttnName;
                  this.paymentRegisterForm.prsttnRemark = bill.prsttnRemark;
                  this.paymentRegisterWin = true;
                }else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }else{
            this.paymentRegisterForm.prsttnAcctNo = bill.prsttnAcctNo;
            this.paymentRegisterForm.prsttnBankNo = bill.prsttnBankNo;
            this.paymentRegisterForm.prsttnBankName = bill.prsttnBankName;
            this.paymentRegisterForm.id = bill.id;
            this.paymentRegisterForm.prsttnName = bill.prsttnName;
            this.paymentRegisterForm.prsttnRemark = bill.prsttnRemark;
            this.paymentRegisterWin = true;
          }
        },
        //付款登记弹窗关闭
        paymentRegisterWinClose() {
          this.paymentRegisterWin = false;
          this.$refs.paymentRegisterForm.resetFields();
        },
        //付款登记弹窗确定
        paymentRegisterWinSubmit() {
          this.$refs["paymentRegisterForm"].validate(valid => {
            if (valid) {
              let url = "/ce/acpt/fastCash/fastCashExceptionHandling/func_prsttnInfoRecheck";
              post(this.paymentRegisterForm, url).then(res => {
                if (res) {
                  let msg = res.data.retMsg;
                  let retCode = res.data.retCode;
                  if (retCode === "000000") {
                    this.$msgTip.success(this);
                    this.paymentRegisterWinClose();
                    this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                    this.$refs.datagrid.selects = [];
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
        billInfoWinClose(){
          this.showBillInfoWin = false;
        },
        showBillInfo(billId){
          this.billId = billId;
          this.showBillInfoWin = true;
        },
      }
    }
</script>

<style scoped>

</style>
