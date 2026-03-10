<!-- 承兑商票凭证打印明细页面-按明细打印-商票拒绝付款理由书-->
<template>
  <div>
    <div v-if="isShow">
      <div class="h-form-search-box">
        <!-- 查询表单 -->
        <h-panel class="clearfix">
          <h-form :model="billManagerFormItem" :label-width="90" ref="billManagerFormItem" cols="4" class="h-form-search">
            <h-form-item prop="billNo" :label="$t('m.i.billInfo.billNo')">
              <h-input v-model="billManagerFormItem.billNo" placeholder=""></h-input>
            </h-form-item>
            <h-form-item class="h-form-operate one-form">
              <h-button type="primary" @click="billManagerHandleSearch()">{{$t('m.i.common.search')}}</h-button>
              <h-button type="ghost" @click="billManagerResetSearch()">{{$t('m.i.common.reset')}}</h-button>
            </h-form-item>
          </h-form>
        </h-panel>
      </div>
      <div class="text-wrap mb-10">
        <div class="text-header"><span class="tit">{{$t('m.i.ce.detailInfo')}}</span></div>
        <div class="text-body">
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.billInfo.drwrCustNo')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.drwrCustNo }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.billInfo.drwrName')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.drwrName }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.billInfo.drwrAcctNo')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.drwrAcctNo }}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.billInfo.acptProtocalNo')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.acptProtocalNo }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.billInfo.remitDt')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.remitDt == null ? "" :
                  this.$moment(viewDetailForm.remitDt,
                  "YYYY-MM-DD").format("YYYY-MM-DD") }}
                </h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.acptType')}}：</h-col>
                <h-col span="15" class="val">{{ getDictValueFromMap(this.dictMap,"AcptType",viewDetailForm.acptType)
                  }}
                </h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.totalCount')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.totalCount }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.totalAmt')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.totalAmt }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.totalFee')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.totalFee }}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.totalCommitFee')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.totalCommitFee }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.guarntrType')}}：</h-col>
                <h-col span="15" class="val">{{
                  getDictValueFromMap(this.dictMap,"GuarntrType",viewDetailForm.guarntrType) }}
                </h-col>
              </h-row>
            </h-col>
          </h-row>
        </div>
      </div>
      <h-datagrid
        :columns="billManagerColumns"
        :autoLoad="false"
        getDataFunc
        @get-data="getBillManagerDataList"
        :gridData="billManagerData"
        :bindForm="billManagerFormItem"
        highlightRow
        :on-current-change="handleRowClick"
        :on-current-change-cancel="handleRowClickCancel"
        ref="billManagerDatagrid">
        <div slot="toolbar" class="pull-left">
          <h-button type="primary" @click="handleVochRePrint()">{{$t("m.i.pe.vochRePrint")}}</h-button>
          <h-button type="primary" @click="handlePrintRecord()">{{$t("m.i.pe.printRecord")}}</h-button>
          <h-button type="ghost" @click="returnMain" >{{$t('m.i.common.goBack')}}</h-button>
        </div>
      </h-datagrid>
    </div>

    <h-msg-box v-model="printWin" width="1000" :maximize="true">
      <p slot="header">
        <span>打印记录</span>
      </p>
      <div class="h-form-search-box">
        <h-panel class="clearfix">
          <h-form :model="printForm" :label-width="90" ref="printForm" cols="3" class="h-form-search">
            <h-form-item :label="$t('m.i.pe.printDt')" prop="createTimeRange" style="width:35%;">
              <h-date-picker placeholder="" type="daterange" :editable=false v-model="printForm.createTimeRange"
                             format="yyyy-MM-dd" showFormat @on-change="handlePrintDtChange"></h-date-picker>
            </h-form-item>
            <h-form-item class="h-form-operate one-form">
              <h-button type="primary" @click="printFormSearch()">{{$t("m.i.common.search")}}</h-button>
              <h-button type="ghost" @click="printFormSearchReset()">{{$t("m.i.common.reset")}}</h-button>
            </h-form-item>
          </h-form>
        </h-panel>
      </div>
      <h-datagrid
        :columns="printColumns"
        highlight-row
        :autoLoad="false"
        url="/pe/print/voucherPrint/voucherPrintManger/queryPrintRecord"
        :bindForm="printForm"
        ref="printgrid">
      </h-datagrid>
      <div slot="footer">
        <h-button type="ghost" style="margin:0 8px" @click="printWin=!printWin">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>

    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo"></bill-info-main>
  </div>
</template>

<script>
  import { accMul, formatNumber, getDictListByGroups, getDictValueFromMap, post,getBusinessParameter } from "@/api/bizApi/commonUtil";

  export default {
    name: "acptCorpVoucherPrintDetail",
    data() {
      return {
        currentSelectRow: [],
        vochId: "",
        printObj: "",
        voucherTypeList: [],
        billManagerData: { rows: [], total: 1 },
        submitInfoMap: new Map(),
        dictMap : new Map(),
        billManagerFormItem: {
          billNo: ""
        },
        billManagerColumns: [
          {
            title: ' ',
            type: 'radio',
            align: 'center',
            width: 50
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
            title: this.$t('m.i.pe.printNum'),
            key: 'printNum',
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.billNo'),
            key: 'billNo',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billNo = "";
              if (params.row.billNo === null || params.row.billNo === "") {
                billNo = this.$t('m.i.ce.showBillInfo');
              }else {
                billNo = params.row.billNo;
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId, "billId");
                  }
                }
              }, billNo);
            }
          },
          {
            title: this.$t('m.i.billInfo.flowStatus'),
            key: 'flowStatusName',
            hiddenCol: false,
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
            title: this.$t('m.i.billInfo.billMoneyByUnit'),
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
            title: this.$t('m.i.billInfo.remitDt'),
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
            title: this.$t('m.i.billInfo.dueDt'),
            key: 'dueDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.dueDt == null || params.row.dueDt === ""){
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.ce.guarntrAmt'),
            key: 'guarntrAmt',
            hiddenCol: false,
            render: (h, params) => {
              let guarntrAmt = formatNumber(params.row.guarntrAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: guarntrAmt
                }
              }, guarntrAmt);
            }
          },
          {
            title: this.$t('m.i.ce.fee'),
            key: 'fee',
            hiddenCol: false,
            render: (h, params) => {
              let fee = formatNumber(params.row.fee, 2, ',');
              return h("span", {
                domProps: {
                  title: fee
                }
              }, fee);
            }
          },
          {
            title: this.$t('m.i.ce.commitFee'),
            key: 'commitFee',
            hiddenCol: false,
            render: (h, params) => {
              let commitFee = formatNumber(params.row.commitFee, 2, ',');
              return h("span", {
                domProps: {
                  title: commitFee
                }
              }, commitFee);
            }
          },
          {
            title: this.$t('m.i.billInfo.pyeeName'),
            key: 'pyeeName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.pyeeAcctNo'),
            key: 'pyeeAcctNo',
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.pyeeBankNo'),
            key: 'pyeeBankNo',
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: 'acptName',
            hiddenCol: false,
            sortable: true,
          }
        ],
        viewDetailForm: {
          drwrCustNo: '',
          drwrName: '',
          drwrAcctNo: '',
          acptProtocalNo: '',
          remitDt: '',
          acptType: '',
          totalCount: '',
          totalAmt: '',
          totalFee: '',
          totalCommitFee: '',
          guarntrType: ''
        },
        //打印记录弹窗
        printWin: false,
        printForm: {
          printStartDt: "",
          printEndDT: "",
          vochId: "",
          createTimeRange: ""
        },
        printColumns: [
          {
            title: " ",
            type: "radio",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.pe.vochId'),
            key: "vochId",
            hiddenCol: false
          }, {
            title: this.$t('m.i.pc.voucherType'),
            key: "voucherType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "VoucherType", params.row.voucherType);
              return h("span", {
                domProps: {
                  title: list
                }
              }, list);
            }
          },
          {
            title: this.$t('m.i.pe.printDt'),
            key: "printDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let date = params.row.printDt == null ? "" : this.$moment(params.row.printDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          }
        ],
        //票号链接
        showBillInfoWin: false,
        billId: "",
        billNo: ""
      }
    },
    props: {
      isShow: {
        type: Boolean,
        default() {
          return false;
        }
      },
      listIds: "",
      batchId: "",
      tempPrintMode: "",
      billManagerParams: {
        type: Object,
        default() {
          return {
            batchNo: "",
            busiType: "",
            voucherType: "",
            rgstDt: "",
            brchNo: ""
          };
        }
      }
    },
    watch: {
      printWin(val) {
        if (!val) {
          this.printForm.printStartDt = "";
          this.printForm.printEndDT = "";
        } else {
          this.$nextTick(() => {
            this.$refs.printgrid.selfAdaption();
          });
        }
      },
    },
    mounted() {
      post({},"/pe/print/voucherPrint/voucherPrintManger/func_queryVouchreTypeDict").then(res=>{
        if (res) {
          if (res.data.retCode === '000000') {
            let dictList = res.data.retData;
            this.voucherTypeList = dictList;
            this.getDictListByGroups("DraftTypeCode,AcptType,GuarntrType,VoucherType").then(res => {
              this.dictMap = res.get("map");
              if (dictList && dictList.length > 0) {
                let voucherTypeMap = new Map();
                for (let i = 0; i < dictList.length; i++) {
                  voucherTypeMap.set(dictList[i].key, dictList[i].value);
                }
                this.dictMap.set("VoucherType", voucherTypeMap);
                this.formSearch();
              }
            });
          }
        }
      });
      this.getPrintNumMap();
      this.getBatchInfo();
    },
    methods: {
      //行选中
      handleRowClick(arr) {
        this.currentSelectRow = arr;
      },
      handleRowClickCancel() {
        this.currentSelectRow = [];
      },
      getPrintNumMap() {
        let url = "/pe/print/voucherPrint/voucherPrintManger/func_queryPrintNumMap";
        post({
          "batchId": this.batchId,
          "listIds": this.listIds,
        }, url).then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.submitInfoMap = res.data.retData;
                this.getBillManagerDataList();
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          }
        );
      },
      getBillManagerDataList() {
        let url = "/pe/print/voucherPrint/voucherPrintManger/func_pageQueryAcptCorpBillList";
        post({
          "batchId": this.batchId,
          "ids": this.listIds,
          "billNoLike": this.billManagerFormItem.billNo,
          "pageNo": this.$refs.billManagerDatagrid.pageInfo.pageNo,
          "pageSize": this.$refs.billManagerDatagrid.pageInfo.pageSize
        }, url).then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                let data = res.data.retData;
                for (let i = 0; i < data.list.length; i++) {
                  if (this.submitInfoMap[data.list[i].id] !== undefined || this.submitInfoMap[data.list[i].id] !== null || this.submitInfoMap[data.list[i].id] !== "") {
                    data.list[i].printNum = this.submitInfoMap[data.list[i].id];
                  }
                }
                this.billManagerData = data;
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          }
        );
      },
      //明细界面查询
      billManagerHandleSearch(){
        this.currentSelectRow = [];
        this.$nextTick(() => {
          this.$refs.billManagerDatagrid.dataChange(1);
        });
      },
      //明细界面重置
      billManagerResetSearch(){
        this.billManagerFormItem.billNo = '';
      },
      showBillInfo(info, type) {
        this.billId = "";
        this.billNo = "";
        if (type === "billId") {
          this.billId = info;
        } else {
          this.billNo = info;
        }
        this.showBillInfoWin = true;
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      //获取批次详细信息
      getBatchInfo() {
        post({id:this.batchId,listIds:this.listIds}, "/pe/print/voucherPrint/voucherPrintManger/func_getAuditAcptBatch").then(res => {
          if(res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if(res.data.retData !== null) {
                this.viewDetailForm.drwrCustNo = res.data.retData.drwrCustNo;
                this.viewDetailForm.drwrName = res.data.retData.drwrName;
                this.viewDetailForm.drwrAcctNo = res.data.retData.drwrAcctNo;
                this.viewDetailForm.acptProtocalNo = res.data.retData.acptProtocalNo;
                this.viewDetailForm.remitDt = res.data.retData.remitDt;
                this.viewDetailForm.acptType = res.data.retData.acptType;
                this.viewDetailForm.guarntrType = res.data.retData.guarntrType;
                this.viewDetailForm.totalCount = res.data.retData.totalCount;
                this.viewDetailForm.totalAmt = res.data.retData.totalAmt;
                this.viewDetailForm.totalFee = res.data.retData.totalFee;
                this.viewDetailForm.totalCommitFee = res.data.retData.totalCommitFee;
                if(this.viewDetailForm.totalAmt !== null && this.viewDetailForm.totalAmt !== ""){
                  this.viewDetailForm.totalAmt = formatNumber(this.viewDetailForm.totalAmt, 2, ',')
                }
                if(this.viewDetailForm.totalFee !== null && this.viewDetailForm.totalFee !== ""){
                  this.viewDetailForm.totalFee = formatNumber(this.viewDetailForm.totalFee, 2, ',')
                }
                if(this.viewDetailForm.totalCommitFee !== null && this.viewDetailForm.totalCommitFee !== ""){
                  this.viewDetailForm.totalCommitFee = formatNumber(this.viewDetailForm.totalCommitFee, 2, ',')
                }
              }else {
                this.viewDetailForm.totalCount = "0";
                this.viewDetailForm.totalAmt = "0";
                this.viewDetailForm.totalFee = "0";
                this.viewDetailForm.totalCommitFee = "0";
              }
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      //凭证补打
      handleVochRePrint() {
        if(this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        post({
          "batchNo": this.billManagerParams.batchNo,
          "busiType": this.billManagerParams.busiType,
          "voucherType": this.billManagerParams.voucherType,
          "rgstDt": this.billManagerParams.rgstDt,
          "brchNo": this.billManagerParams.brchNo,
          "batchId": this.batchId,
          "listId": this.currentSelectRow.id
        }, "/pe/print/voucherPrint/voucherPrintManger/queryVoucherList").then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                if (null == res.data.retData || res.data.retData.list.length === 0) {
                  this.$msgTip.error(this, { info: "未查到相应的补打数据，请确认！" });
                  return;
                }
                this.printObj = res.data.retData.list[0].printObj;
                this.vochId = res.data.retData.list[0].id;
                this.printStart();
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          }
        );
      },
      printStart() {
        let printData = [];
        printData.push(this.printObj);
        let printNum = this.currentSelectRow.printNum;
        this.$hMsgBox.confirm({
          title: "凭证补打",
          content: "此凭证为第"+ (printNum + 1) +"次补打，请注意重复！",
          onOk: () => {
            this.$print.vouchTemplatePrint(this, {
              data: printData,
              callback: () => {
                post({
                  "batchNo": this.billManagerParams.batchNo,
                  "busiType": this.billManagerParams.busiType,
                  "voucherType": this.billManagerParams.voucherType,
                  "rgstDt": this.billManagerParams.rgstDt,
                  "brchNo": this.billManagerParams.brchNo,
                  "batchId": this.batchId,
                  "id": this.vochId,
                }, "/pe/print/voucherPrint/voucherPrintManger/func_savePrintRecordInfo").then(res => {
                    if (res) {
                      let msg = res.data.retMsg;
                      let retCode = res.data.retCode;
                      if (retCode === "000000") {
                        this.currentSelectRow = [];
                        this.getPrintNumMap();
                      } else {
                        this.$msgTip.error(this, { info: msg });
                      }
                    } else {
                      this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                    }
                  }
                );
              },
              closeCallback: () => {
                this.currentSelectRow = [];
                let pageNo =this.$refs.billManagerDatagrid.pageInfo.pageNo;
                this.$refs.billManagerDatagrid.dataChange(pageNo);
              }
            });
          }})
      },
      //打印记录
      handlePrintRecord() {
        if(this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        post({
          "batchNo": this.billManagerParams.batchNo,
          "busiType": this.billManagerParams.busiType,
          "voucherType": this.billManagerParams.voucherType,
          "rgstDt": this.billManagerParams.rgstDt,
          "brchNo": this.billManagerParams.brchNo,
          "batchId": this.batchId,
          "listId": this.currentSelectRow.id
        }, "/pe/print/voucherPrint/voucherPrintManger/queryVoucherList").then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                if (null == res.data.retData || res.data.retData.list.length === 0) {
                  this.$msgTip.error(this, { info: "未查到相应的补打数据，请确认！" });
                  return;
                }
                this.vochId = res.data.retData.list[0].id;
                this.printWin = true;
                this.$nextTick(() => {
                  this.printForm.vochId = this.vochId;
                  this.$refs.printgrid.dataChange(1);
                });
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          }
        );
      },
      printFormSearch() {
        this.$nextTick(() => {
          this.$refs.printgrid.dataChange(1);
        });
      },
      printFormSearchReset() {
        this.printForm.printStartDt = "";
        this.printForm.printEndDT = "";
        this.$refs.printForm.resetFields();
      },
      handlePrintDtChange(arr) {
        if(arr && arr.length === 2){
          this.printForm.printStartDt = arr[0].replace(/-/g, "");
          this.printForm.printEndDT = arr[1].replace(/-/g, "");
        }else{
          this.printForm.printStartDt = "";
          this.printForm.printEndDT = "";
        }
      },
      //跳转界面返回
      returnMain() {
        this.billManagerData = { rows: [], total: 1 };
        this.submitInfoMap = new Map();
        this.currentSelectRow = [];
        this.$emit("returnMain", "");
      },
    }
  }
</script>

<style scoped>

</style>
