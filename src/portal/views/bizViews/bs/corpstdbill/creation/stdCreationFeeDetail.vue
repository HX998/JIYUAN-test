<!--创设业务 费用收取--->
<template>
  <div>
    <h-msg-box v-model="tempStdCreationFeeDetailWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1000" class="h-form-search-layer" >
      <p slot="header">
        <span>客户收费明细</span>
      </p>
      <div>
        <!--数据展示表格-->
        <h-datagrid
          :columns="columns"
          highlight-row
          :auto-load="false"
          url="/bs/corpstdbill/creation/stdCreationFeeAccount/func_queryStdCreationFeeDetail"
          :bindForm="feeDetailFormItem"
          :has-select="false"
          ref="datagrid">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" @click="listExport1()">{{$t('m.i.common.listExport')}}</h-button>
          </div>
        </h-datagrid>
      </div>
      <div slot="footer">
      </div>
    </h-msg-box>

    <common-excel-download @handleSubmit="exportTable" @showExcelTemplateWinClose="showExcelTemplateWinClose" :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.excelParam" :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import { post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "stdCreationFeeDetail",
    components: {
    },
    data() {
      return {
        batchId: "",

        //清单导出
        excelParam:null,
        rows: null,
        tempShowExcelTemplateWin: false,

        feeDetailFormItem: {
          id: ""
        },
        columns: [
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.custName"),
            key: "custName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.custAcctNo"),
            key: "custPyeeAcctNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.bs.custBankNo"),
            key: "custPyeeBankNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.be.totalAmt'),
            key: 'totalAmt',
            hiddenCol: false,
            align: "right",
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.totalAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.bs.creationNum"),
            key: "totalNum",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.bs.totalFeeAmt"),
            key: "feeAmt",
            hiddenCol: false,
            align: "right",
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.feeAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.bs.totalSellFeeAmt"),
            key: "sellFeeAmt",
            hiddenCol: false,
            align: "right",
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.sellFeeAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.bs.totalSettleAmt"),
            key: "settleAmt",
            hiddenCol: false,
            align: "right",
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.settleAmt, 2, ","));
            }
          },
        ],
      };
    },
    props: {
      stdCreationFeeDetailWin: {
        type: Boolean,
        default: false
      },
      feeDetailParams: {
        type: Object,
        default: {}
      },
      dictMap: { //CorpScale,Industry,partnerType,Yon
        type: Map
      },
    },
    watch: {
      stdCreationFeeDetailWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.feeDetailFormItem.id = this.feeDetailParams.batchId;
            this.$refs.datagrid.dataChange(1);
          });
        }
      },
      batchId(val) {
        this.batchId = val;
      }
    },
    computed: {
      tempStdCreationFeeDetailWin: {
        get() {
          return this.stdCreationFeeDetailWin;
        },
        set() {
        }
      }
    },
    methods: {
      //关闭弹窗
      handleClose() {
        this.feeDetailFormItem.id="";
        this.feeDetailParams={};
        this.$emit("stdCreationFeeDetailWinClose", "");
      },

      listExport1() {
        this.excelParam = 'stdCreationCounterExport';
        this.rows = this.$refs.datagrid.total;
        this.tempShowExcelTemplateWin = true;
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      tempShowExcelTemplateWinOpen() {
        this.excelParam = 'stdCreationCounterExport';
        this.rows = this.$refs.datagrid.total;
        this.tempShowExcelTemplateWin = true;
      },
      //清单导出
      exportTable(field, exportType) {
        //exportType: 0-同步 1-异步
        if(exportType === "1"){
          let url = window.LOCAL_CONFIG.API_HOME + '/bs/corpstdbill/creation/stdCreationFeeAccount/func_exportCounterData'
          let params = null;
          params = { id:this.feeDetailParams.batchId,
            field: field, exportType: exportType, excelName: this.excelParam};

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
          let url = window.LOCAL_CONFIG.API_HOME + '/bs/corpstdbill/creation/stdCreationFeeAccount/func_exportCounterData'
          let form = document.createElement("form");
          form.setAttribute("id", "formId");
          form.setAttribute("action", url);
          form.setAttribute("method", "post");
          let key;
          for (key in this.tmpForm) {
            let input = document.createElement('input')
            input.type = 'text'
            input.name = key
            input.value = this.tmpForm[key]
            form.appendChild(input);
          }
          let input1 = document.createElement('input')
          input1.type = 'text'
          input1.name = "id"
          input1.value = this.feeDetailParams.batchId;
          form.appendChild(input1);
          let input2 = document.createElement('input')
          input2.type = 'text'
          input2.name = 'field';
          input2.value = field;
          form.appendChild(input2)
          let input3 = document.createElement('input')
          input3.type = 'text'
          input3.name = 'exportType';
          input3.value = exportType;
          form.appendChild(input3)
          let input4 = document.createElement('input')
          input4.type = 'text'
          input4.name = 'excelName';
          input4.value = this.excelParam;
          form.appendChild(input4)
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        }
      },
    }
  };
</script>

<style scoped>

</style>
