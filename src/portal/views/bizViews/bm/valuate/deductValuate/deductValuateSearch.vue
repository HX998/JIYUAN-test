<!-- 减值管理-减值数据查询 -->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.brchNos" :label="$t('m.i.common.brchName')" prop="brchNos"

                             title="机构名称" :brchNo.sync="formItem.brchNos" :brchName.sync="formItem.branchName">
                </show-branch>
                <common-select v-model="formItem.prodNo" prop="prodNo" :dictList="prodNoList"
                               :label="$t('m.i.common.prodName')"></common-select>
                <common-date-picker v-model="operDt" :label="$t('m.i.bm.valuateOperDt')"
                                    type="daterange" :rangeValue="['minOperDt','maxOperDt']"
                                    :minOperDt.sync="formItem.minOperDt" :maxOperDt.sync="formItem.maxOperDt">
                </common-date-picker>
                <query-btn :advanceShow="false" :formSearch="handleSearch" :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      url="/bm/valuate/deductValuate/func_queryDeductValuateInfoPageData"
                      :bindForm="formItem"
                      :row-select="true"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="deductValuateExport" >{{$t('m.i.common.export')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 明细导出 -->
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import {formatNumber, formatTime, exportList ,post} from "@/api/bizApi/commonUtil";

  export default {
    name: "deductValuateSearch",
    data() {
      return {
        ifShowMore: false,
        formItem: {
          brchNos:"",
          brchNo: "",
          branchName: "",
          prodNo: "",
          prodName: "",
          minOperDt: "",
          maxOperDt: ""
        },
        operDt: [],
        columns: [
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
            title: this.$t("m.i.common.brchNo"),
            key: "brchNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.brchName"),
            key: "brchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.prodName"),
            key: "prodNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "DeductProduct", params.row.prodNo);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.bm.currentDeductBalanceAmt"),
            key: "currentDeductBalanceAmt",
            hiddenCol: false,
            render: (h, params) => {
              let amt = formatNumber(params.row.currentDeductBalanceAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: amt
                }
              }, amt);
            }
          },
          {
            title: this.$t("m.i.bm.previousDeductDiffAmt"),
            key: "previousDeductDiffAmt",
            hiddenCol: false,
            render: (h, params) => {
              let amt = formatNumber(params.row.previousDeductDiffAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: amt
                }
              }, amt);
            }
          },
          {
            title: this.$t("m.i.bm.valuateOperTm"),
            key: "operDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let operDt = params.row.operDt ? this.$moment(params.row.operDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
              let operTm = formatTime(this, params.row.operTm);
              return h("span", operDt + " " + operTm);
            }
          },
          {
            title: this.$t("m.i.bm.valuateCreateTellerName"),
            key: "createTellerName",
            hiddenCol: false
          }
        ],
        dictMap: new Map(),
        prodNoList: [],
        //导出
        tempShowExcelTemplateWin : false,
        param : null,
        rows : null,
      }
    },
    methods: {
      handleSearch(pageNo) {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(pageNo ? pageNo : 1);
      },
      resetSearch() {
        this.$refs.formItem.resetFields();
        let workDate = this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD").format("YYYY-MM-DD");
        this.operDt = [workDate, workDate];
        this.formItem.minOperDt = window.sessionStorage.getItem("workDate");
        this.formItem.maxOperDt = window.sessionStorage.getItem("workDate");
      },
      deductValuateExport() {
        this.param = 'deductValuateExportInfo';
        if (this.$refs.datagrid.selectIds.length !== 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        }else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      exportList(field, exportType) {
        let url = window.LOCAL_CONFIG.API_HOME + "/bm/valuate/deductValuate/func_exportDeductValuate";
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
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      }
    },
    created() {
      let workDate = this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD").format("YYYY-MM-DD");
      this.operDt = [workDate, workDate];
      this.formItem.minOperDt = window.sessionStorage.getItem("workDate");
      this.formItem.maxOperDt = window.sessionStorage.getItem("workDate");
    },
    mounted() {
      this.getDictListByGroups("DeductProduct").then(res => {
        this.prodNoList = res.get("DeductProduct");
        this.dictMap = res.get("map");
      });
    }
  }
</script>

<style scoped>

</style>
