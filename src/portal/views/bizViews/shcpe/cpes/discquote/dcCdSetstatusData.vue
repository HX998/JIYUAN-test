<!--贴现通票据结算结果对账文件查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <common-input v-model="formItem.dealNo" :label="$t('m.i.be.dealNo')" prop="dealNo" :maxlength="20"></common-input>
                <bill-no v-model="formItem.billNo"></bill-no>
                <h-form-item :label="$t('m.i.common.operDt')" prop="operDt" >
                  <h-date-picker v-model="formItem.operDt" type="date" placeholder=""
                                 :editable=false :showFormat=true @on-change="handleDateChange"></h-date-picker>
                </h-form-item>
                <query-btn :advanceShow="false" @showChange="showChange" :formSearch="handleSearch"
                           :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/shcpe/cpes/discquote/dcCdSetstatusData/queryDcCdSetstatusDataPage"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
           <!-- <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="viewRebuySubBatch()">{{$t("m.i.be.viewSubBatch")}}</h-button>
            </div>-->
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

  </div>
</template>

<script>
  import { post, accMul, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "dcCdSetstatusData",
    data() {
      return {
        formItem: {
          dealNo:"",
          billNo: "",
          operDt: window.sessionStorage.getItem("workDate"),
        },
        columns: [
          /*{
            type: "radio",
            title: " ",
            key: "multiSelect",
            width: 60,
            hiddenCol: false
          },*/
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.memberName"),
            key: "memberName",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.be.dealNo'),
            key: 'dealNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.shcpe.settleResult'),
            key: 'settleResult',
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "DiscStlResult", params.row.settleResult);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.common.operDt'),
            key: 'operDt',
            hiddenCol: false,
            render: (h, params) => {
              return h('span', params.row.operDt ? this.$moment(params.row.operDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          }
        ],
        currentSelectRow: [],
        //是否显示更多查询项
        ifShowMore: false,
        dictMap: new Map(),
        creditMainBankTypeList:{}
      };
    },
    mounted() {
      this.getDictListByGroups("DiscStlResult").then(res => {
        // this.creditMainBankTypeList = res.get("bankType");
        // this.creditMainBankTypeList = this.creditMainBankTypeList.filter(item => item.key !== "101");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      showChange(val) {
        this.ifShowMore = val;
      },
      //表单查询
      handleSearch(pageNo) {
        this.currentSelectRow = [];
        this.formItem.operDt = this.formItem.operDt.replace(/-/g, "");
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      handleDateChange(value) {
        this.formItem.operDt = value.replace(/-/g, "");
      },
    }
  };
</script>

<style scoped>

</style>
