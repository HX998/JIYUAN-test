<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">

                <h-form-item :label="$t('m.i.common.custNo')" prop="custNo">
                  <h-input v-model="formItem.discCustNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.custName')" prop="custName">
                  <h-input v-model="formItem.discCustName" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.grantCreditAmount')" prop="grantCreditAmount">
                  <h-row>
                    <h-col span="11">
                      <h-typefield v-model="formItem.minGrantCreditAmount" integerNum="16" placeholder="" type="money"
                                   bigTips></h-typefield>
                    </h-col>
                    <h-col span="2" style="text-align: center">至</h-col>
                    <h-col span="11">
                      <h-typefield v-model="formItem.maxGrantCreditAmount" integerNum="16" placeholder="" type="money"
                                   bigTips></h-typefield>
                    </h-col>
                  </h-row>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.acptorCustName')" prop="acptorCustName">
                  <h-input v-model="formItem.acptorCustName" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.acptorSocCode')" prop="acptorSocCode" class="h-form-long-label">
                  <h-input v-model="formItem.acptorSocCode" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.discLimitAmount')" prop="discLimitAmount">
                  <h-row>
                    <h-col span="11">
                      <h-typefield v-model="formItem.minDiscLimitAmount" integerNum="16" placeholder="" type="money"
                                   bigTips></h-typefield>
                    </h-col>
                    <h-col span="2" style="text-align: center">至</h-col>
                    <h-col span="11">
                      <h-typefield v-model="formItem.maxDiscLimitAmount" integerNum="16" placeholder="" type="money"
                                   bigTips></h-typefield>
                    </h-col>
                  </h-row>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}
                            <i class="icon iconfont"  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlight-row
                      :bindForm="formItem"
                      url="/banks/szbank/ce/disc/elec/whiteroll/discCreditLimitShow/func_queryDiscCreditLimitInfo"
                      :onCurrentChange="onCurrentChange"
                      :onCurrentChangeCancel="onCurrentChangeCancel"
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
  import { post, on, off, accMul, formatNumber, getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "discCreditLimitShow",
    data() {
      let formItem = {
        discCustNo: "",
        discCustName: "",
        acptorCustName: "",
        acptorSocCode: "",
        minGrantCreditAmount: "",
        maxGrantCreditAmount: "",
        minDiscLimitAmount: "",
        maxDiscLimitAmount: "",
      };
      let columns = [
        {
          title: " ",
          type: "radio",
          align: "center",
          width: 50
        },
        {
          type: "selection",
          key: "multiSelect",
          width: 60,
          hiddenCol: true,
          align: "center"
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
          title: this.$t("m.i.ce.discCustNo"),
          key: "discCustNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.discCustName1"),
          key: "discCustName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.grantCreditAmount"),
          key: "grantCreditAmount",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            let amount = formatNumber(params.row.grantCreditAmount, 2, ",");
            return h("span", {
              domProps: {
                title: amount
              }
            }, amount);
          }
        },
        {
          title: this.$t("m.i.ce.acptorCustName"),
          key: "acptorCustName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.acptorSocCode"),
          key: "acptorSocCode",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.discLimitAmount"),
          key: "discLimitAmount",
          hiddenCol: false,
          render: (h, params) => {
            let amount = formatNumber(params.row.discLimitAmount, 2, ",");
            return h("span", {
              domProps: {
                title: amount
              }
            }, amount);
          }
        },
        {
          title: this.$t("m.i.ce.availLimit"),
          key: "availLimit",
          hiddenCol: false,
          render: (h, params) => {
            let amount = formatNumber(params.row.availLimit, 2, ",");
            return h("span", {
              domProps: {
                title: amount
              }
            }, amount);
          }
        },
        {
          title: this.$t("m.i.ce.usedLimitAmount"),
          key: "usedLimit",
          hiddenCol: false,
          render: (h, params) => {
            let amount = formatNumber(params.row.usedLimit, 2, ",");
            return h("span", {
              domProps: {
                title: amount
              }
            }, amount);
          }
        },
        {
          title: this.$t("m.i.ce.approvalNo"),
          key: "approvalNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.approvalStatus"),
          key: "approvalStatus",
          hiddenCol: false,
          render: (h, params) => {
            return h("span", getDictValueFromMap(this.dictMap, "ApproveStatus", params.row.approvalStatus));
          }
        },
        {
          title: this.$t("m.i.ce.approvalActiveDt"),
          key: "approvalActiveDt",
          hiddenCol: false,
          render: (h, params) => {
            let date = params.row.approvalActiveDt == null ? "" : this.$moment(params.row.approvalActiveDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.ce.approvalFailureDt"),
          key: "approvalFailureDt",
          hiddenCol: false,
          render: (h, params) => {
            let date = params.row.approvalFailureDt == null ? "" : this.$moment(params.row.approvalFailureDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        }
      ];
      return {
        formItem: formItem,
        columns: columns,
        selectData:null,
        //是否显示更多查询项
        ifShowMore: false,
        dictMap: new Map(),
        isList: [],
        approveStatusList: [],
      };
    },
    computed: {

    },
    created() {
    },
    mounted() {
      this.getDictListByGroups("Yon,ApproveStatus").then(res => {
        this.isList = res.get("Yon");
        this.approveStatusList = res.get("ApproveStatus");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      onCurrentChange(currentRow, oldCurrentRow, _index) {
        this.selectData = currentRow;
      },
      onCurrentChangeCancel(currentRow, oldCurrentRow, _index) {
        this.selectData = null;
      },
      //表单查询
      handleSearch() {
        this.selectData = null;
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.discCustNo="";
        this.formItem.discCustName="";
        this.formItem.acptorCustName="";
        this.formItem.acptorSocCode="";
        this.formItem.minGrantCreditAmount="";
        this.formItem.maxGrantCreditAmount="";
        this.formItem.minDiscLimitAmount="";
        this.formItem.maxDiscLimitAmount="";
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },

    }
  };
</script>
