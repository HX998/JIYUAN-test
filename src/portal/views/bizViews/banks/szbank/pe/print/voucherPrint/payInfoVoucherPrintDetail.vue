<!-- 托收凭证打印明细页面-托收打印按明细打印 -->
<template>
  <div>
    <div v-if="isShow">
      <!--<div class="h-form-search-box">-->
      <!--</div>-->
      <!--<div class="text-wrap mb-10">-->
        <!--<div class="text-header"><span class="tit">{{$t('m.i.ce.detailInfo')}}</span></div>-->
        <!--<div class="text-body">-->
          <!--<h-row :gutter="8">-->
            <!--<h-col span="8">-->
              <!--<h-row>-->
                <!--<h-col span="9" class="label">业务编号：</h-col>-->
                <!--<h-col span="15" class="val">{{ viewDetailForm.batchNo }}</h-col>-->
              <!--</h-row>-->
            <!--</h-col>-->
            <!--<h-col span="8">-->
              <!--<h-row>-->
                <!--<h-col span="9" class="label">业务类型：</h-col>-->
                <!--<h-col span="15" class="val">{{ viewDetailForm.prodName }}</h-col>-->
              <!--</h-row>-->
            <!--</h-col>-->
            <!--<h-col span="8">-->
              <!--<h-row>-->
                <!--<h-col span="9" class="label">凭证类型：</h-col>-->
                <!--<h-col span="15" class="val">{{ getDictValueFromMap(this.dictMap,"VoucherType",viewDetailForm.voucherType)}}</h-col>-->
              <!--</h-row>-->
            <!--</h-col>-->
          <!--</h-row>-->
        <!--</div>-->
      <!--</div>-->
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
  </div>
</template>

<script>
  import { accMul, formatNumber, getDictListByGroups, getDictValueFromMap, post,getBusinessParameter } from "@/api/bizApi/commonUtil";

  export default {
    name: "payInfoVoucherPrintDetail",
    data() {
      return {
        currentSelectRow: [],
        voucherTypeList: [],
        vochId: "",
        printObj: "",
        billManagerData: { rows: [], total: 1 },
        submitInfoMap: new Map(),
        dictMap : new Map(),
        billManagerFormItem: {
          id: ""
        },
        billManagerColumns : [
          {
            title: ' ',
            type: 'radio',
            align: 'center',
            width: 50
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            key:"xuhao",
            align: "center"
          },
          {
            title: this.$t('m.i.pe.printNum'),
            key: 'printNum',
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.pe.batchIdAndYNo'),
            key: "batchNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.busiType'),
            key: "prodName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.brchName'),
            key: "brchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.operTellerName'),
            key: "operTellerName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.pe.payAmt'),
            key: "payAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.payAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t('m.i.pe.drweName'),
            key: "drweName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.corpDrwrAcctNo'),
            key: "drweAcctNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.corpDrweBankNo'),
            key: "drweBankNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.pyeeName'),
            key: "pyeeName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.pyeeAcctNo'),
            key: "pyeeAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.pyeeBankName'),
            key: "pyeeBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title:this.$t('m.i.billInfo.pyeeBankNo'),
            key: "pyeeBankNo",
            hiddenCol: false
          }, {
            title: this.$t('m.i.pe.clearStatus'),
            key: "clearStatus",
            hiddenCol: true
          }
        ],
        viewDetailForm : {
          "batchNo":"",
          "prodName":"",
          "voucherType":""
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
      };
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
            this.getDictListByGroups("DraftTypeCode,PayType,Yon,AcptType,GuarntrType,VoucherType").then(res => {
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
      // this.getBatchInfo();
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
          "voucherType":this.billManagerParams.voucherType
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
        let url = "/banks/szbank/pe/print/voucherPrint/voucherPrintManger/func_pageQueryPayInfoList";
        post({
          "idList": this.listIds,
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
      //获取批次详细信息
      getBatchInfo() {
        post({id:this.batchId,listIds:this.listIds}, "/banks/szbank/pe/print/voucherPrint/voucherPrintManger/func_getBatchInfo").then(res => {
          if(res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if (null == res.data.retData) {
                this.$msgTip.error(this, { info: "未查到相应的托收批次信息，请重新确认！" });
                return;
              }
              this.viewDetailForm.hldrAcctNo = res.data.retData.hldrAcctNo;
              this.viewDetailForm.hldrName = res.data.retData.hldrName;
              this.viewDetailForm.drweBankName = res.data.retData.drweBankName;
              this.viewDetailForm.drweBankNo = res.data.retData.drweBankNo;
              this.viewDetailForm.drwePostCode = res.data.retData.drwePostCode;
              this.viewDetailForm.drweAddr = res.data.retData.drweAddr;
              this.viewDetailForm.emsNo = res.data.retData.emsNo;
              this.viewDetailForm.totalCount = res.data.retData.totalCount;
              this.viewDetailForm.totalAmt = res.data.retData.totalAmt;
              if(this.viewDetailForm.totalAmt !== null && this.viewDetailForm.totalAmt !== ""){
                this.viewDetailForm.totalAmt = formatNumber(this.viewDetailForm.totalAmt, 2, ',')
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
          "listIds": this.currentSelectRow.id
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
          "listIds": this.currentSelectRow.id
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
