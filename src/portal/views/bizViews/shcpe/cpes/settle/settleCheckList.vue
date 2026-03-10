<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item label="交割单编号:" prop="dlvOrderNo">
                  <h-input v-model="formItem.dlvOrderNo"></h-input>
                </h-form-item>
                <h-form-item label="业务种类" prop="settleBusiType">
                  <h-select v-model="formItem.settleBusiType" placeholder="">
                    <h-option v-for="item in busiTypeList" :value="item.key" :key="item.value">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item label="对账日期:" prop="compareDt">
                  <h-date-picker type="date" v-model="formItem.compareDt" format="yyyy-MM-dd" showFormat
                                 placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item label="对账结果:" prop="listCheckResult">
                  <h-select v-model="formItem.listCheckResult" placeholder="">
                    <h-option v-for="item in resultList" :value="item.key" :key="item.value">{{ item.value }}</h-option>
                  </h-select>
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
    name: "settleCheckList",
    data() {
      return {
        dictMap: new Map(),
        formItem: {
          dlvOrderNo: "",
          settleBusiType: "",
          compareDt: "",
          listCheckResult: ""
        },
        columns: [
          {
            type: "radio",
            width: 50,
            align: "center",
            title: " ",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center",
            hiddenCol: false
          }, {
            title: this.$t('m.i.common.memberName'),
            key: "memberName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.pc.compareDt'),
            key: "compareDt",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.compareDt ? this.$moment(params.row.compareDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "-");
            }
          },
          {
            title: this.$t('m.i.shcpe.listCheckResult'),
            key: "listCheckResult",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", this.formatResult(params.row.listCheckResult));
            }
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
            }
          },
          {
            title: this.$t('m.i.shcpe.dlvOrderNo'),
            key: "dlvOrderNo",
            hiddenCol: false
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
            title: this.$t('m.i.be.clearType'),
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
              return h("p", formatNumber(params.row.settleAmt, 2, ","));
            }
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
            title: this.$t('m.i.common.createTime'),
            key: "createTime",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let date = params.row.createTime == null ? "" :this.$moment(params.row.createTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
              return h("span", date);
            }
          }
        ],
        url: "/shcpe/cpes/settle/settleCheckList/func_querySettleCheckList",
        busiTypeList: [],
        resultList: [
          {
            key: "0",
            value: "初始"
          }, {
            key: "1",
            value: "正常"
          }, {
            key: "2",
            value: "BEMP多"
          }, {
            key: "3",
            value: "CPES多"
          }
        ],
        ifShowMore: false
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
        this.formItem.compareDt = this.formItem.compareDt.replace(/-/g, "");
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      formatResult(data) {
        if (data == "0") return "初始";
        else if (data == "1") return "正常";
        else if (data == "2") return "BEMP多";
        else if (data == "3") return "CPES多";
        else return "-";
      }
    }
  };

</script>
