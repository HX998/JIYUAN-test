<!--创设业务 投资人明细信息--->
<template>
  <div>
    <h-msg-box v-model="tempStdReexchangeInfoWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1000" class="h-form-table-layer" >
      <p slot="header">
        <span>投资人明细</span>
      </p>
        <div>
          <!-- 查询表单 -->
          <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
            <!--客户名称-->
            <common-input v-model="formItem.custNameLike" :label="$t('m.i.bs.custName')" prop="custNameLike" :maxlength="150"></common-input>
            <query-btn :advanceShow="false" :formSearch="handleSearch" :formSearchReset="resetSearch" formClassAdd="1"></query-btn>
          </h-form>
        </div>
        <!--数据展示表格-->
        <h-datagrid
          :columns="reexchangeInfoColumns"
          highlight-row
          :auto-load="false"
          url="/bs/corpstdbill/underwrite/stdCreationReexchangeTrackQuery/func_queryStdReexchangeInfoDtoByPage"
          :bindForm="formItem"
          rowSelect
          :has-select="false"
          ref="datagrid">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" @click="listExport()">{{$t("m.i.common.listExport")}}</h-button>
          </div>
        </h-datagrid>
        <div slot="footer">
          <h-button type="primary" @click="handleClose()">{{$t('m.i.common.close')}}</h-button>
        </div>
    </h-msg-box>
    <!--导出-->
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import { post, formatNumber, exportList } from "@/api/bizApi/commonUtil";

  export default {
    name: "stdReexchangeInfo",
    data() {
      return {
        batchId: "",
        //清单导出
        param: "",
        rows: "",
        tempShowExcelTemplateWin: false,
        formItem: {
          creationId: "",
          custNameLike:""
        },
        reexchangeInfoColumns: [
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
            title: this.$t('m.i.bs.custAcctNo'),
            key: 'custAcctNo',
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.bs.custName'),
            key: 'custName',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bs.custBankNo'),
            key: 'custBankNo',
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.bs.custBankName'),
            key: 'custBankName',
            hiddenCol: false
          },
          {
            title: this.$t("m.i.bs.reexchangeAmt"),
            key: "reexchangeAmt",
            hiddenCol: false,
            sortable: true,
            align: "right",
            render: (h, params) => {
              return h("p", formatNumber(params.row.reexchangeAmt, 2, ","));
            }
          },
          {
            title: this.$t('m.i.bs.acctStatus'),
            key: "acctStatus",
            hiddenCol: false,
            sortable: false,
            render: (h, params) => {
              let acctStatus = this.formatAcctStatus(params.row.acctStatus);
              return h("span", {
                domProps: {
                  title: acctStatus
                }
              }, acctStatus);
            }
          },
          {
            title: this.$t('m.i.bs.errorMsg'),
            key: 'errorMsg',
            hiddenCol: false
          },
        ],
      };
    },
    props: {
      stdReexchangeInfoWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      batchParams: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    watch: {
      stdReexchangeInfoWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.formItem.creationId = this.batchParams.batchId;
            this.$refs.datagrid.dataChange(1);
          });
        }
      },
      batchId(val) {
        this.batchId = val;
      }
    },
    computed: {
      tempStdReexchangeInfoWin: {
        get() {
          return this.stdReexchangeInfoWin;
        },
        set() {
        }
      }
    },
    methods: {
      showChange(val) {
        this.ifShowMore = val;
      },
      //表单查询
      handleSearch(pageNo) {
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      },
      //关闭弹窗
      handleClose() {
        this.resetSearch();
        this.formItem.creationId="";
        this.batchParams={};
        this.$emit("stdReexchangeInfoWinClose", "");
      },
      //清单导出
      listExport() {
        this.param = "stdReexchangeExportInfo";
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      exportList(field, exportType) {
        let url = window.LOCAL_CONFIG.API_HOME + "/bs/corpstdbill/underwrite/stdCreationReexchangeTrackQuery/func_exportStdReexchangeInfoList";
        let options = {};
        if (this.$refs.datagrid.selectIds.length !== 0) {
          options.params = {
            ids: this.$refs.datagrid.selectIds,
          };
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, url, options);
      },

      //格式化标票退汇记账状态
      formatAcctStatus(acctStatus){
        let acctStatusValue = "";
        if("0" == acctStatus){
          acctStatusValue = "未记账";
        }else if("1" == acctStatus){
          acctStatusValue = "记账成功";
        }else if("2" == acctStatus){
          acctStatusValue = "记账失败";
        }
        return acctStatusValue;
      }
    }
  };
</script>

<style scoped>

</style>
