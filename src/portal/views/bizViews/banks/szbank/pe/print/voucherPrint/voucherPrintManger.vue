<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item label="柜员号" prop="acctTellerNo">
                  <h-input v-model="formItem.acctTellerNo" :maxLength="12"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.transDt')" prop="transDtRange">
                  <h-date-picker placeholder="" type="daterange" :editable=false v-model="formItem.transDtRange"
                                 format="yyyy-MM-dd" showFormat @on-change="handleTransDtChange"></h-date-picker>
                </h-form-item>
                <h-form-item prop="busiType" :label="$t('m.i.common.busiType')" :label-width="96" class="h-form-radio">
                  <h-select v-model="formItem.busiType" placeholder="">
                    <h-option v-for="item in busiTypeList" :value="item.key" :key="item.key">{{item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.foreFlowNo')" prop="foreFlowNo">
                  <h-input v-model="formItem.foreFlowNo" :maxlength="50"></h-input>
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
          <h-datagrid
            :columns="columns"
            :rowSelect=true
            url="/pe/print/voucherPrint/voucherPrintManger/queryVoucherList"
            :bindForm="formItem"
            :hasSelect="hasSelect"
            ref="datagrid">
            <div slot="toolbar" class='pull-left'>
              <h-button type="primary" @click="handlePrint()">{{$t("m.i.pe.vochRePrint")}}</h-button>
              <h-button type="primary" @click="handleQry()">{{$t("m.i.pe.printRecord")}}</h-button>
              <h-button type="primary" @click="exportExcel()">{{$t("m.i.common.exportExcel")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <h-msg-box v-model="printWin" width="1000" :maximize="true" @on-close="printWinClose">
      <p slot="header">
        <span>打印记录</span>
      </p>
      <div class="h-form-search-box">
        <h-panel class="clearfix">
          <h-form :model="printItem" :label-width="90" ref="printItem" cols="2" class="h-form-search">
            <h-form-item :label="$t('m.i.pe.printDt')" prop="createTimeRange">
              <h-date-picker placeholder="" type="daterange" :editable=false v-model="printItem.createTimeRange"
                             format="yyyy-MM-dd" showFormat @on-change="handleDueDtChange"></h-date-picker>
            </h-form-item>
            <h-form-item class="h-form-operate">
              <h-button type="primary" @click="formSearch('record')">{{$t("m.i.common.search")}}</h-button>
              <h-button type="ghost" @click="formSearchReset('record')">{{$t("m.i.common.reset")}}</h-button>
            </h-form-item>
          </h-form>
        </h-panel>
      </div>
      <h-datagrid
        :columns="printColumns"
        highlight-row
        :autoLoad="false"
        url="/pe/print/voucherPrint/voucherPrintManger/queryPrintRecord"
        :bindForm="printItem"
        :showListCkeckBox="false"
        ref="printgrid">
      </h-datagrid>
      <div slot="footer">
        <h-button type="ghost" style="margin:0 8px" @click="printWinClose()">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>
  </div>
</template>
<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "voucherPrintManger",
    data() {
      return {
        tempShowExcelTemplateWin : false,
        param : null,
        rows : null,
        ifShowMore: false,
        dictMap: new Map(),
        busiTypeList:[],
        formItem: {
          acctTellerNo:  this.$store.getters.userInfo.userNo,
          transDtRange:[],
          crtStartTime: "",
          crtEndTime: "",
          busiType:"",
          foreFlowNo:"",
          backFlowNo:""
        },
        columns: [
          {
            title: " ",
            type: "selection",
            width: 50
          }, {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.brchNo'),
            key: "brchNo",
            hiddenCol: false
          },
          {
            title: "柜员号",
            key: "acctTellerNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.transDt'),
            key: "rgstDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let date = params.row.rgstDt == null ? "" : this.$moment(params.row.rgstDt, "YYYY-MM-DD").format("YYYY-MM-DD");
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
            title:this.$t('m.i.common.busiType'),
            key:"busiType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "VoucherBusiType", params.row.busiType);
              return h("span", {
                domProps: {
                  title: list
                }
              }, list);
            }
          },
          {
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
            title: this.$t('m.i.pe.printNum'),
            key: "printNum",
            hiddenCol: false
          }
        ],
        reqUrl: "/pe/print/voucherPrint/voucherPrintManger/",
        printWin: false,
        printItem: {
          printStartDt: "",
          printEndDT: "",
          vochId: "",
          userNo: "",
          printDt: "",
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
        hasSelect: false
      };
    },
    watch: {
      printWin(val) {
        if (!val) {
          this.printItem.printStartDt = "";
          this.printItem.printEndDT = "";
        } else {
          this.$nextTick(() => {
            this.$refs.printgrid.selfAdaption();
          });
        }
      }
    },
    methods: {
      handleTransDtChange(arr) {
        if(arr && arr.length === 2){
          this.formItem.crtStartTime = arr[0].replace(/-/g, "");
          this.formItem.crtEndTime = arr[1].replace(/-/g, "");
        }else{
          this.formItem.crtStartTime = "";
          this.formItem.crtEndTime = "";
        }

      },
      handleQry() {
        let selects = this.$refs.datagrid.selects;
        if (selects.length != 1) {
          this.$msgTip.info(this, { info: "请选择一条记录！" });
          return;
        }
        this.printWin = true;
        this.$nextTick(() => {
          this.printItem.vochId = selects[0].id;
          this.$refs.printgrid.dataChange(1);
        });
      },
      printWinClose() {
        this.printItem.createTimeRange = '',
          this.printWin = false;
      },
      // 凭证补打
      handlePrint() {
        let selects = this.$refs.datagrid.selects;
        if (selects.length != 1) {
          this.$msgTip.info(this, { info: "请选择一条记录！" });
          return;
        }
        post({
          "id": selects[0].id
        }, "/banks/szbank/pe/print/voucherPrint/voucherPrintManger/func_getVoucherData").then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                if (null == res.data.retData || res.data.retData === '') {
                  this.$msgTip.error(this, { info: "未查到相应的补打数据，请确认！" });
                  return;
                }
                this.printStart(res.data.retData,selects[0].id,selects[0].printNum);
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          }
        );
      },
      printStart(printObj,vochId,printNum) {
        let printData = [];
        printData.push(printObj);
        this.$hMsgBox.confirm({
          title: "凭证补打",
          content: "此凭证为第"+ (printNum + 1) +"次补打，请注意重复！",
          onOk: () => {
            this.$print.vouchTemplatePrint(this, {
              data: printData,
              callback: () => {
                post({
                  "id": vochId,
                }, "/pe/print/voucherPrint/voucherPrintManger/func_savePrintRecordInfo").then(res => {
                    if (res) {
                      let msg = res.data.retMsg;
                      let retCode = res.data.retCode;
                      if (retCode === "000000") {
                        this.$refs.datagrid.selectIds = [];
                        this.$refs.datagrid.selects = [];
                        let pageNo = this.$refs.datagrid.pageInfo.pageNo;
                        this.$refs.datagrid.dataChange(pageNo);
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
                this.$refs.datagrid.selectIds = [];
                this.$refs.datagrid.selects = [];
                let pageNo =this.$refs.datagrid.pageInfo.pageNo;
                this.$refs.datagrid.dataChange(pageNo);
              }
            });
          }})
      },
      handleDueDtChange(arr) {
        if(arr && arr.length == 2){
          this.printItem.printStartDt = arr[0].replace(/-/g, "");
          this.printItem.printEndDT = arr[1].replace(/-/g, "");
        }else{
          this.printItem.printStartDt = "";
          this.printItem.printEndDT = "";
        }

      },
      formSearch(arr) {
        if (arr === "record") {
          this.$refs.printgrid.dataChange(1);
        } else {
          this.$refs.datagrid.selectIds = [];
          this.$refs.datagrid.selects = [];
          this.$refs.datagrid.dataChange(1);
        }
      },
      formSearchReset(arr) {
        if (arr === "record") {
          this.printItem.printStartDt = "";
          this.printItem.printEndDT = "";
          this.$refs.printItem.resetFields();
        } else {
          this.formItem.acctTellerNo = this.$store.getters.userInfo.userNo;
          let workDate = this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD").format("YYYY-MM-DD");
          this.formItem.crtStartTime = window.sessionStorage.getItem("workDate");
          this.formItem.crtEndTime = window.sessionStorage.getItem("workDate");
          this.formItem.transDtRange= [workDate,workDate];
          this.formItem.busiType = '';
          this.formItem.foreFlowNo = "";
          this.formItem.backFlowNo = "";
        }
      },
      //导出
      exportExcel() {
        this.param = 'voucherPrintMangerExportInfo';
        if (this.$refs.datagrid.selectIds.length !== 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        }else {
          this.rows = this.$refs.datagrid.total;
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
          if (this.$refs.datagrid.selectIds.length !== 0) {
            params = { ids: this.$refs.datagrid.selectIds, field: field, exportType: exportType, excelName: this.param};
          }else {
            params=Object.assign({field: field, exportType: exportType, excelName: this.param},this.formItem);
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
          if (this.$refs.datagrid.selectIds.length !== 0) {
            let form = document.createElement("form");
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");

            let input1 = document.createElement('input');
            input1.type = 'text';
            input1.name = 'ids';
            input1.value = this.$refs.datagrid.selectIds;
            form.appendChild(input1);
            let input2 = document.createElement('input');
            input2.type = 'text';
            input2.name = 'field';
            input2.value = field;
            form.appendChild(input2);
            let input3 = document.createElement('input')
            input3.type = 'text';
            input3.name = 'exportType';
            input3.value = exportType;
            form.appendChild(input3);
            let input4 = document.createElement('input')
            input4.type = 'text';
            input4.name = 'excelName';
            input4.value = this.param;
            form.appendChild(input4);

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          } else {
            let form = document.createElement("form");
            for (let obj in this.formItem) {
              if (this.formItem.hasOwnProperty(obj)) {
                let input = document.createElement('input');
                input.type = 'text';
                input.name = obj;
                input.value = this.formItem[obj];
                form.appendChild(input)
              }
            }
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");

            let input3 = document.createElement('input')
            input3.type = 'text'
            input3.name = 'field';
            input3.value = field;
            form.appendChild(input3)
            let input4 = document.createElement('input')
            input4.type = 'text'
            input4.name = 'exportType';
            input4.value = exportType;
            form.appendChild(input4)
            let input5 = document.createElement('input')
            input5.type = 'text'
            input5.name = 'excelName';
            input5.value = this.param;
            form.appendChild(input5)

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          }
        }
      },
    },
    created() {
      let workDate = this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD").format("YYYY-MM-DD");
      this.formItem.crtStartTime = window.sessionStorage.getItem("workDate");
      this.formItem.crtEndTime = window.sessionStorage.getItem("workDate");
      this.formItem.transDtRange= [workDate,workDate];
    },
    mounted() {
      post({},"/pe/print/voucherPrint/voucherPrintManger/func_queryVouchreTypeDict").then(res=>{
        if (res) {
          if (res.data.retCode === '000000') {
            let dictList = res.data.retData;
            this.getDictListByGroups("VoucherBusiType").then(res => {
              this.busiTypeList = res.get("VoucherBusiType");
              this.dictMap = res.get("map");
              if (dictList && dictList.length > 0) {
                let voucherTypeMap = new Map();
                for (let i = 0; i < dictList.length; i++) {
                  voucherTypeMap.set(dictList[i].key, dictList[i].value);
                }
                this.dictMap.set("VoucherType", voucherTypeMap);
              }
            });
          }
        }
      });
    }
  };
</script>

