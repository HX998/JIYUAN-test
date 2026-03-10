<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <div class="clearfix">
                  <h-form-item :label="'业务种类'" prop="settleBusiType">
                    <h-select v-model="formItem.settleBusiType" placeholder="">
                      <h-option v-for="item in settleBusiTypeList" :value="item.key" :key="item.key">{{ item.value }}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="'核对日期'" prop="compareDt">
                    <h-date-picker type="date" v-model="formItem.compareDt" format="yyyy-MM-dd"
                                   showFormat placeholder=""></h-date-picker>
                  </h-form-item>
                  <h-form-item :label="'对账结果'" prop="summryCheckResult">
                    <h-select v-model="formItem.summryCheckResult" placeholder="">
                      <h-option v-for="item in summryCheckResultList" :value="item.key" :key="item.key">{{ item.value
                        }}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                    <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            :url="url"
            :bindForm="formItem"
            :onRowClick="handlelRowClick"
            :onSelectChange="handleSelectClick"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "settleCheckSumMain",
    components: {},
    data() {
      return {
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.shcpe.compareDt"),
            key: "compareDt",
            hiddenCol: false,
            render: (h, params) => {
              let compareDt = this.$moment(params.row.compareDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", compareDt);
            }
          },
          {
            title: this.$t("m.i.shcpe.defectFlag"),
            key: "summryCheckResult",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "SummryCheckResult", params.row.summryCheckResult);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.common.settleBusiType"),
            key: "settleBusiType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "StlRequestType", params.row.settleBusiType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.common.brchName'),
            key: "brchName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.settleDt"),
            key: "settleDt",
            hiddenCol: false,
            render: (h, params) => {
              let settleDt = this.$moment(params.row.settleDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", settleDt);
            }
          },
          {
            title: this.$t("m.i.be.settleMode"),
            key: "settleMode",

            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "SettleType", params.row.settleMode);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.settleType"),
            key: "settleType",

            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "ClearType", params.row.settleType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.shcpe.settleResult"),
            key: "settleResult",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "StlResult", params.row.settleResult);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.shcpe.payRcvFlag"),
            key: "payRcvFlag",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "PayRcvFlag", params.row.payRcvFlag);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.common.totalAmtBillPackage"),
            key: "totalAmt",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.totalNumBillPackage"),
            key: "totalNum",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pc.settleAmt"),
            key: "settleAmt",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pc.settleNum"),
            key: "settleNum",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pc.fileSumAmt"),
            key: "fileSumAmt",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pc.fileSumNum"),
            key: "fileSumNum",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pc.fileSettleAmt"),
            key: "fileSettleAmt",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pc.fileSettleNum"),
            key: "fileSettleNum",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.createTime'),
            key: "createTime",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let createTime = this.$moment(params.row.createTime, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", createTime);
            }
          }
        ],
        formItem: {
          settleBusiType: "",
          compareDt: "",
          summryCheckResult: ""
        },

        settleBusiTypeList: [],
        summryCheckResultList: [],

        currentSelectRow: [],
        currentSelectList: [],
        currentSelectRowInx: [],
        readonly: false,
        ifShowMore: false,
        url: "shcpe/cpes/settle/settleCheckSumMain/func_querySettleCheckSum"
      };
    },
    watch: {},
    computed: {},
    methods: {
      handlelRowClick(arr) {
        this.currentSelectRow = arr;
      },
      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
        if (arr.length == 0) return;
      },
      formSearch() {
        this.formItem.compareDt = this.formItem.compareDt.replace(/-/g, "");
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      }
    },
    mounted() {
      this.getDictListByGroups("StlRequestType,SummryCheckResult,SettleType,ClearType,StlResult,PayRcvFlag").then(res => {
        this.settleBusiTypeList = res.get("StlRequestType");
        this.summryCheckResultList = res.get("SummryCheckResult");
        this.dictMap = res.get("map");
      });
    }

  };
</script>

<style scoped>

</style>
