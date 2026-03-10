<!-- 统一冲正凭证打印明细页面-按流水打印 -->
<template>
  <div>
    <div v-if="isShow">
      <div class="h-form-search-box">
        <!-- 查询表单 -->
        <h-panel class="clearfix">
          <h-form :model="billManagerFormItem" :label-width="90" ref="billManagerFormItem" cols="4" class="h-form-search">
            <h-form-item prop="foreFlowNo" :label="$t('m.i.common.foreFlowNo')">
              <h-input v-model="billManagerFormItem.foreFlowNo" placeholder=""></h-input>
            </h-form-item>
            <h-form-item prop="backFlowNo" :label="$t('m.i.common.backFlowNo')">
              <h-input v-model="billManagerFormItem.backFlowNo" placeholder=""></h-input>
            </h-form-item>
            <h-form-item prop="operTellerNo" :label="$t('m.i.common.operTellerNo')">
              <h-input v-model="billManagerFormItem.operTellerNo" placeholder=""></h-input>
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
                <h-col span="9" class="label">{{$t('m.i.pe.flowNo')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.flowNo }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.common.busiType')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.busiType }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.pc.voucherType')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.voucherType }}</h-col>
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

    <h-msg-box v-model="printWin" width="1000" :maximize="true">
      <p slot="header">
        <span>打印记录</span>
      </p>
      <div class="h-form-search-box">
        <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
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

    <show-print-bill-info-detail :bill-detail-win="billDetailWin" :id="this.billManagerId" @billDetailWinClose="billDetailWinClose" listUrl=""></show-print-bill-info-detail>

    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap,formatNumber,accMul } from "@/api/bizApi/commonUtil";

  export default {
    name: "cancelAcctVoucherPrintDetail",
    components: {
      ShowPrintBillInfoDetail:()=>import(/* webpackChunkName: "pe/print/voucherPrint/showPrintBillInfoDetail" */`@/views/bizViews/pe/print/voucherPrint/showPrintBillInfoDetail`),
    },
    data() {
      return {
        billManagerData: { rows: [], total: 1 },
        submitInfoMap: new Map(),
        billManagerFormItem: {
          batchId: "",
          foreFlowNo: "",
          backFlowNo: "",
          operTellerNo: "",
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
            key: 'acctDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.acctDt == null || params.row.acctDt === ""){
                return "";
              }
              let date = this.$moment(params.row.acctDt, "YYYY-MM-DD").format("YYYY-MM-DD");
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
            key: "operTellerNo",
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
          flowNo: "",
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
        billDetailWin: false,
        billManagerId: "",



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
      billManagerParams: {
        type: Object,
        default() {
          return {
            flowNo: "",
            busiType: "",
            voucherType: ""
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
      isShow(val) {
        if (val) {
          this.billManagerFormItem.batchId = this.batchId;
          this.billManagerFormItem.ids = this.listIds;
        }
      }
    },
    created() {
      this.billManagerFormItem.batchId = this.batchId;
      this.billManagerFormItem.ids = this.listIds;
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,PayType,Yon,AcptType,GuarntrType").then(res => {
        this.dictMap = res.get("map");
      });
      this.getPrintNumMap();
      this.getBatchInfo();
    },
    methods: {
      getPrintNumMap() {
        let url = "";
        post({
          "batchId": this.billManagerFormItem.batchId,
          "listIds": this.billManagerFormItem.listIds,
        }, url).then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.submitInfoMap = res.data.retData;
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
        let url = "/pe/print/voucherPrint/voucherPrintManger/func_pageQueryVoucherPrint";
        post({
          "batchId": this.billManagerFormItem.batchId,
          "foreFlowNo": this.billManageFormItem.foreFlowNo,
          "backFlowNo": this.billManageFormItem.backFlowNo,
          "operTellerNo": this.billManageFormItem.operTellerNo,
          "printNum": this.billManageFormItem.printNum,
          "pageNo": this.$refs.billManagerDatagrid.pageInfo.pageNo,
          "pageSize": this.$refs.billManagerDatagrid.pageInfo.pageSize
        }, url).then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                let data = res.data.retData;
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
        this.$refs.billManagerDatagrid.selects = [];
        this.$refs.billManagerDatagrid.selectIds = [];
        this.$nextTick(() => {
          this.$refs.billManagerDatagrid.dataChange(1);
        });
      },
      //明细界面重置
      billManagerResetSearch(){
        this.$refs.billManagerFormItem.resetFields();
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
        let voucherType = this.billManagerParams.voucherType;
        let printNum = list[0].printNum;
        this.$hMsgBox.confirm({
          title: "凭证补打",
          content: "此凭证为第"+ (printNum + 1) +"次补打，请注意重复！",
          onOk: () => {
            let voucherTypes = [];
            post({ paramKey: "pe.voch.makeup_is_need_seal" }, "/sm/auth/findArraySystemParameter").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  voucherTypes = res.data.retData;
                  let hasSeal = false;
                  if(voucherTypes.indexOf(voucherType) >= 0) {
                    hasSeal = true;
                  }
                  this.$print.vochPrint(this, {
                    exitDataFlag: "makeUp", params: { vocherData: list },hasSeal: hasSeal,
                    callback: () => {
                      this.$refs.billManagerDatagrid.selectIds = [];
                      this.$refs.billManagerDatagrid.selects = [];
                      let pageNo = this.$refs.billManagerDatagrid.pageInfo.pageNo;
                      this.$refs.billManagerDatagrid.dataChange(pageNo);
                    },
                    closeCallback: () => {
                      this.$refs.billManagerDatagrid.selectIds = [];
                      this.$refs.billManagerDatagrid.selects = [];
                      let pageNo =this.$refs.billManagerDatagrid.pageInfo.pageNo;
                      this.$refs.billManagerDatagrid.dataChange(pageNo);
                    }
                  });
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
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
          this.printForm.vochId = selects[0].id;
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
        this.billManagerId = list[0].id;
        this.billDetailWin = true;
      },
      billDetailWinClose() {
        this.billDetailWin = false;
      },

      //清单导出
      handleListExport() {
        this.param = 'voucherPrintMangerExportInfo';
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
        let url = window.LOCAL_CONFIG.API_HOME + "/pe/print/voucherPrint/voucherPrintManger/func_exportExcel";
        if(exportType === "1"){
          let params = null;
          if (this.$refs.billManagerDatagrid.selectIds.length !== 0) {
            params = { ids: this.$refs.billManagerDatagrid.selectIds, field: field, exportType: exportType, excelName: this.param};
          }else {
            params=Object.assign({field: field, exportType: exportType, excelName: this.param},this.billManagerFormItem);
          }
          post(params, url).then(res => {
            if(res.status === 200 && res.data === null){
              this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            }else if(res.status === 200 && res.data === ""){
              this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            } else{
              this.$msgTip.error(this, { info: "异步导出失败" });
            }
          });
        }else {
          if (this.$refs.billManagerDatagrid.selectIds.length !== 0) {
            let form = document.createElement("form");
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");

            let input1 = document.createElement('input');
            input1.type = 'text';
            input1.name = 'ids';
            input1.value = this.$refs.billManagerDatagrid.selectIds;
            form.appendChild(input1);
            let input2 = document.createElement('input');
            input2.type = 'text';
            input2.name = 'field';
            input2.value = field;
            form.appendChild(input2);
            let input3 = document.createElement('input');
            input3.type = 'text';
            input3.name = 'exportType';
            input3.value = exportType;
            form.appendChild(input3);
            let input4 = document.createElement('input');
            input4.type = 'text';
            input4.name = 'excelName';
            input4.value = this.param;
            form.appendChild(input4);

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          } else {
            let form = document.createElement("form");
            for (let obj in this.billManagerFormItem) {
              if (this.billManagerFormItem.hasOwnProperty(obj)) {
                let input = document.createElement('input');
                input.type = 'text';
                input.name = obj;
                input.value = this.billManagerFormItem[obj];
                form.appendChild(input)
              }
            }
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");

            let input3 = document.createElement('input');
            input3.type = 'text';
            input3.name = 'field';
            input3.value = field;
            form.appendChild(input3);
            let input4 = document.createElement('input');
            input4.type = 'text';
            input4.name = 'exportType';
            input4.value = exportType;
            form.appendChild(input4);
            let input5 = document.createElement('input');
            input5.type = 'text';
            input5.name = 'excelName';
            input5.value = this.param;
            form.appendChild(input5);

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          }
        }
      },
      //跳转界面返回
      returnMain() {
        this.billManagerData = { rows: [], total: 1 };
        this.submitInfoMap = new Map();
        this.$refs.billManagerDatagrid.selects = [];
        this.$emit("returnMain", "");
      },
    },
  }
</script>

<style scoped>

</style>
