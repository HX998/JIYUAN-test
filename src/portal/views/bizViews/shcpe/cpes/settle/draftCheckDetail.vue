<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item label="业务种类" prop="settleBusiType">
                  <h-select v-model="formItem.settleBusiType"  placeholder="">
                    <h-option v-for="item in busiTypeList" :value="item.key" :key="item.value">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item label="结算日期" prop="settleDate">
                  <h-date-picker type="date" v-model="formItem.settleDate" format="yyyy-MM-dd"
                                 showFormat  placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="formSearch()">查询</h-button>
                  <h-button type="ghost" @click="formSearchReset()">重置</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid :columns="columns" highlight-row :url="url" :bindForm="formItem" ref="datagrid">
            <div slot="toolbar" class="pull-left">
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
  </div>
</template>
<script>
  import { getDictListByGroups, getDictValueFromMap, post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "draftCheckDetail",
    data() {
      return {
        dictMap : new Map(),
        formItem : {
          settleBusiType: '',
          settleDate: '',
        },
        columns : [
          {
            type: "radio",
            width: 50,
            align: "center",
            title: ' ',
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center",
            hiddenCol: false
          }, {
            title: this.$t('m.i.shcpe.dlvOrderNo'),
            key: "dlvOrderNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.settleBusiType'),
            key: "settleBusiType",
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "StlRequestType", params.row.settleBusiType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            },
          },

          {
            title: this.$t('m.i.be.settleMode'),
            key: "settleMode",
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "SettleType", params.row.settleMode);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.pe.clearType'),
            key: "clearType",
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "ClearType", params.row.clearType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.pc.settleAmt'),
            key: "settleAmt",
            hiddenCol: false,
            render: (h, params) => {
              return h('p', formatNumber(params.row.settleAmt, 2, ','))
            },
          },
          {
            title: this.$t('m.i.shcpe.payRcvFlag'),
            key: "payRcvFlag",
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "PayRcvFlag", params.row.payRcvFlag);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.shcpe.settleResult'),
            key: "settleResult",
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "StlResult", params.row.settleResult);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.pc.settleDate'),
            key: "settleDt",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.settleDt ? this.$moment(params.row.settleDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
        ],
        url : "/shcpe/cpes/settle/draftCheckDetail/func_queryExtSettleListStatement",
        busiTypeList : [],
        ifShowMore : false
      };
    },
    mounted() {
      getDictListByGroups("StlRequestType,ClearType,SettleType,PayRcvFlag,StlResult").then(res => {
        this.dictMap = res.get("map");
        this.busiTypeList = res.get("StlRequestType");
      });
    },
    methods: {
      formSearch() {
        this.formItem.settleDate = this.formItem.settleDate.replace(/-/g, "");
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      }
    }
  };

</script>
