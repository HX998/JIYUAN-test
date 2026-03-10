<!--匿名点击授信扣除系数文件查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <common-select v-model="formItem.creditMainMemberId" :label="$t('m.i.billInfo.creditMainBankType')" prop="creditMainMemberId"
                               :dictList="creditMainBankTypeList"></common-select>
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
            url="/shcpe/cpes/anonycoeffdata/queryAnonyCoeffDataPage"
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
    name: "anonyCoeffData",
    data() {
      return {
        formItem: {
          creditMainMemberId: "",
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
            title: this.$t("m.i.common.brchName"),
            key: "brchName",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.creditMainBankType'),
            key: 'creditMainMemberId',
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "bankType", params.row.creditMainMemberId);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.be.tenorVarieties"),
            key: "tenorVarieties",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "TenorVarieties", params.row.tenorVarieties);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.pc.creditType'),
            key: 'creditType',
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CreParamType", params.row.creditType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.deductCoeffPer'),
            key: 'deductCoeff',
            hiddenCol: false,
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
      this.getDictListByGroups("CreParamType,bankType,TenorVarieties").then(res => {
        this.creditMainBankTypeList = res.get("bankType");
        this.creditMainBankTypeList = this.creditMainBankTypeList.filter(item => item.key !== "101");
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
/*      viewRebuySubBatch(){
        this.$hMsgBox.confirm({
          title: "删除信息",
          content: "确定要删除吗？",
          onOk: () => {
            let params={preWorkDate:"20200114"};
            let url="/shcpe/cpes/draftFileDeal";
            this.sendPost(params,url);
          }
        });
      },
      sendPost(params, url) {
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      }*/
    }
  };
</script>

<style scoped>

</style>
