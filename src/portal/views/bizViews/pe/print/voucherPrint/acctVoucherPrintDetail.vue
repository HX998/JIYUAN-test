<!-- 记账凭证打印明细页面-按明细打印 -->
<template>
  <div>
    <div v-if="isShow">
      <div class="h-form-search-box">
        <!-- 查询表单 -->
        <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
          <h-form :model="billManagerFormItem" :label-width="90" ref="billManagerFormItem" cols="4" class="h-form-search">
            <h-form-item prop="foreFlowNo" :label="$t('m.i.common.foreFlowNo')">
              <h-input v-model="billManagerFormItem.foreFlowNo" placeholder=""></h-input>
            </h-form-item>
            <h-form-item prop="backFlowNo" :label="$t('m.i.common.backFlowNo')">
              <h-input v-model="billManagerFormItem.backFlowNo" placeholder=""></h-input>
            </h-form-item>
            <h-form-item prop="acctTellerNo" :label="$t('m.i.common.operTellerNo')">
              <h-input v-model="billManagerFormItem.acctTellerNo" placeholder=""></h-input>
            </h-form-item>
            <h-form-item prop="printNum" :label="$t('m.i.pe.printNum')">
              <h-input v-model="billManagerFormItem.printNum" placeholder=""></h-input>
            </h-form-item>
            <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                                                   :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
              <h-button type="primary" @click="billManagerHandleSearch()">{{$t('m.i.common.search')}}</h-button>
              <h-button type="ghost" @click="billManagerResetSearch()">{{$t('m.i.common.reset')}}</h-button>
            </h-form-item>
          </h-form>
        </h-panel>
      </div>
      <div class="text-wrap mb-10">
        <div class="text-body">
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.pe.busiNo')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.batchNo }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.common.busiType')}}：</h-col>
                <h-col span="15" class="val">{{ getDictValueFromMap(this.dictMap,"VoucherBusiType",viewDetailForm.busiType)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.pc.voucherType')}}：</h-col>
                <h-col span="15" class="val">{{ getDictValueFromMap(this.dictMap,"VoucherType",viewDetailForm.voucherType)}}</h-col>
              </h-row>
            </h-col>
          </h-row>
        </div>
      </div>
      <h-datagrid :columns="billManagerColumns"
                  :autoLoad="false"
                  getDataFunc
                  @get-data="getBillManagerDataList"
                  :gridData="billManagerData"
                  :bindForm="billManagerFormItem"
                  :row-select="true"
                  :has-select="false"
                  ref="billManagerDatagrid">
        <div slot="toolbar" class="pull-left">
          <h-button type="primary" @click="handleVochRePrint()">{{$t("m.i.pe.vochRePrint")}}</h-button>
          <h-button type="primary" @click="handlePrintRecord()">{{$t("m.i.pe.printRecord")}}</h-button>
          <h-button type="primary" @click="handleShowBillInfo()">{{$t("m.i.pc.showBillInfo")}}</h-button>
          <h-button type="primary" @click="handleListExport()">{{$t("m.i.common.listExport")}}</h-button>
          <h-button type="ghost" @click="returnMain" >{{$t('m.i.common.goBack')}}</h-button>
        </div>
      </h-datagrid>
    </div>

    <h-msg-box v-model="printWin" width="1000" :maximize="true" @on-close="printWinClose">
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
        <h-button type="ghost" style="margin:0 8px" @click="printWinClose">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>

    <show-print-bill-info-detail :bill-detail-win="billDetailWin" :fore-flow-no="this.billDetailForeFlowNo" :tempPrintMode="this.tempPrintMode" :rgst-dt="this.billDetailRgstDt" @billDetailWinClose="billDetailWinClose" listUrl="/pe/print/voucherPrint/voucherPrintManger/func_queryBillInfoByFlowNo"></show-print-bill-info-detail>

    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap,formatNumber,accMul,exportList } from "@/api/bizApi/commonUtil";

  export default {
    name: "acctVoucherPrintDetail",
    components: {
      ShowPrintBillInfoDetail:()=>import(/* webpackChunkName: "pe/print/voucherPrint/showPrintBillInfoDetail" */`@/views/bizViews/pe/print/voucherPrint/showPrintBillInfoDetail`),
    },
    data() {
      return {
        billDetailForeFlowNo: "",
        billDetailRgstDt: "",
        billManagerData: { rows: [], total: 1 },
        billManagerFormItem: {
          foreFlowNo: "",
          backFlowNo: "",
          acctTellerNo: "",
          printNum: ""
        },
        billManagerColumns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            key:"duoxuan",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.foreFlowNo"),
            key: "foreFlowNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.backFlowNo"),
            key: "backFlowNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.pc.acctGroupName'),
            key: "acctGroupName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.transDt"),
            key: 'rgstDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.rgstDt == null || params.row.rgstDt === ""){
                return "";
              }
              let date = this.$moment(params.row.rgstDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.common.transTm"),
            key: 'transTm',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.transTm == null || params.row.transTm === "") {
                return "";
              }
              let transTm = params.row.transTm.toString();
              if (params.row.transTm.toString().length < 6) {
                for(let i=0; i<(6-params.row.transTm.toString().length); i++) {
                  transTm = "0" + transTm;
                }
              }
              let date = this.$moment(transTm, "HH:mm:ss").format("HH:mm:ss");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.common.operTellerNo'),
            key: "acctTellerNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.pe.printNum'),
            key: "printNum",
            hiddenCol: false
          }
        ],
        //清单导出
        tempShowExcelTemplateWin : false,
        param : null,
        rows : null,

        ifShowMore: false,
        dictMap: new Map(),
        voucherTypeList: [],
        busiTypeList: [],
        viewDetailForm: {
          batchNo: "",
          busiType: "",
          voucherType: ""
        },
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
            title: this.$t('m.i.pe.printTm'),
            key: "printDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.createTime == null || params.row.createTime === "") {
                return "";
              }
              let dt = this.$moment(params.row.printDt,"YYYY-MM-DD").format("YYYY-MM-DD");
              let tm = this.$moment(params.row.createTime,"YYYY-MM-DD HH:mm:ss").format("HH:mm:ss");
              return h("span", dt + " " + tm);
            }
          }
        ],
        billDetailWin: false,
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
      }
    },
    mounted() {
      post({},"/pe/print/voucherPrint/voucherPrintManger/func_queryVouchreTypeDict").then(res=>{
        if (res) {
          if (res.data.retCode === '000000') {
            let dictList = res.data.retData;
            this.voucherTypeList = dictList;
            this.getDictListByGroups("DraftTypeCode,AcptType,GuarntrType,VoucherType,VoucherBusiType").then(res => {
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
      this.getBillManagerDataList();
      this.getBatchInfo();
    },
    methods: {
      printWinClose() {
        this.printForm.createTimeRange = '',
        this.printWin = false;
      },
      getBatchInfo() {
        this.viewDetailForm.batchNo = this.billManagerParams.batchNo;
        this.viewDetailForm.busiType = this.billManagerParams.busiType;
        this.viewDetailForm.voucherType = this.billManagerParams.voucherType;
      },
      getBillManagerDataList() {
        let url = "/pe/print/voucherPrint/voucherPrintManger/func_queryVoucherRePrintInfo";
        post({
          "batchNo": this.billManagerParams.batchNo,
          "busiType": this.billManagerParams.busiType,
          "voucherType": this.billManagerParams.voucherType,
          "foreFlowNo": this.billManagerFormItem.foreFlowNo,
          "backFlowNo": this.billManagerFormItem.backFlowNo,
          "acctTellerNo": this.billManagerFormItem.acctTellerNo,
          "brchNo":this.billManagerParams.brchNo,
          "rgstDt":this.billManagerParams.rgstDt,
          "tempPrintMode":this.tempPrintMode,
          "printNum": this.billManagerFormItem.printNum,
          "pageNo": this.$refs.billManagerDatagrid.pageInfo.pageNo,
          "pageSize": this.$refs.billManagerDatagrid.pageInfo.pageSize
        }, url).then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.billManagerData = res.data.retData;
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
        this.$refs.billManagerDatagrid.selects = [];
        this.$refs.billManagerDatagrid.selectIds = [];
        this.$nextTick(() => {
          this.$refs.billManagerDatagrid.dataChange(1);
        });
      },
      //明细界面重置
      billManagerResetSearch(){
        this.$nextTick(() => {
          this.billManagerFormItem.foreFlowNo = '';
          this.billManagerFormItem.backFlowNo = '';
          this.billManagerFormItem.acctTellerNo = '';
          this.billManagerFormItem.printNum = '';
        });
      },

      //凭证补打
      handleVochRePrint() {
        let list = this.$refs.billManagerDatagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if (list.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        let printData = [];
        printData.push(list[0].printObj);
        let printNum = list[0].printNum;
        this.$hMsgBox.confirm({
          title: "凭证补打",
          content: "此凭证为第"+ (printNum + 1) +"次补打，请注意重复！",
          onOk: () => {
            this.$print.vouchTemplatePrint(this, {
              data: printData,
              callback: () => {
                post({
                  "id": list[0].id,
                  "voucherType": this.billManagerParams.voucherType,
                }, "/pe/print/voucherPrint/voucherPrintManger/func_savePrintRecordInfo").then(res => {
                    if (res) {
                      let msg = res.data.retMsg;
                      let retCode = res.data.retCode;
                      if (retCode === "000000") {
                        this.$refs.billManagerDatagrid.selectIds = [];
                        this.$refs.billManagerDatagrid.selects = [];
                        let pageNo = this.$refs.billManagerDatagrid.pageInfo.pageNo;
                        this.$refs.billManagerDatagrid.dataChange(pageNo);
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
                this.$refs.billManagerDatagrid.selectIds = [];
                this.$refs.billManagerDatagrid.selects = [];
                let pageNo =this.$refs.billManagerDatagrid.pageInfo.pageNo;
                this.$refs.billManagerDatagrid.dataChange(pageNo);
              }
            });
          }})
      },

      //打印记录
      handlePrintRecord() {
        let list = this.$refs.billManagerDatagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if (list.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        this.printWin = true;
        this.$nextTick(() => {
          this.printForm.vochId = list[0].id;
          this.$refs.printgrid.dataChange(1);
        });

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

      //查看票据明细
      handleShowBillInfo() {
        let list = this.$refs.billManagerDatagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if (list.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        this.billDetailForeFlowNo = list[0].foreFlowNo;
        this.billDetailRgstDt = list[0].rgstDt;
        this.billDetailWin = true;
      },
      billDetailWinClose() {
        this.billDetailWin = false;
      },

      //清单导出
      handleListExport() {
        this.param = 'voucherRePrintAcctInfo';
        if (this.$refs.billManagerDatagrid.selectIds.length !== 0) {
          this.rows = this.$refs.billManagerDatagrid.selectIds.length;
        }else {
          this.rows = this.$refs.billManagerDatagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //清单导出
      exportList(field, exportType){
        //exportType: 0-同步 1-异步
        let url = window.LOCAL_CONFIG.API_HOME + "/pe/print/voucherPrint/voucherPrintManger/func_exportVoucherRePrintInfoExcel";
        let options = {
          params: {}
        };
        if (this.$refs.billManagerDatagrid.selectIds.length !== 0) {
          options.params.ids = this.$refs.billManagerDatagrid.selectIds;
          options.pageSize = this.$refs.billManagerDatagrid.selectIds.length;
        } else {
          options.params = this.billManagerFormItem;
          options.pageSize = this.$refs.billManagerDatagrid.total;
        }
        options.params.rgstDt  = this.billManagerParams.rgstDt;
        options.params.voucherType = this.billManagerParams.voucherType;
        options.params.batchNo = this.billManagerParams.batchNo;
        options.params.brchNo = this.billManagerParams.brchNo;
        options.params.busiType = this.billManagerParams.busiType;
        options.params.tempPrintMode = this.tempPrintMode;
        exportList(this, this.param, field, exportType, url, options);
      },
      //跳转界面返回
      returnMain() {
        this.billManagerData = { rows: [], total: 1 };
        this.$refs.billManagerDatagrid.selects = [];
        this.$emit("returnMain", "");
      },
    },
  }
</script>

<style scoped>

</style>
