<!--点击成交-授信关系查看-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <trans-brch-type v-model="formItem.transBrchTypesName" @on-click="transBrchTypesWinOpen('query')"
                                 :clearVal="clearVal"></trans-brch-type>
                <query-btn :advanceShow="false" formClassAdd="1" :formSearch="handleSearch" :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/be/market/clickdeal/credit/creditSearch/func_queryCreditTradeBatchPage"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="creditRelationDetail('show')">{{$t("m.i.common.viewDatail")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 机构类型选择弹窗框 -->
    <common-tree :commonTreeWin="showTransBrchTypeWin" title="查询机构类型" :ifcheck="true" :isFilterChildren="true"
                 @treeSelectedChange="transBrchTypeChange" @commonTreeWinClose="showTransBrchTypeWinClose" :checkedDataArr="transBrchTypesArr"
                 url="/be/market/clickdeal/credit/creditSearch/func_buildBrchTypeTree"></common-tree>
    <!-- 新增修改弹窗 -->
    <credit-manage-add :creditManageAddOrEditWin="creditManageAddOrEditWin" :batchParams="batchParams"
                       @creditManageAddOrEditWinClose="creditManageAddOrEditWinClose"
                       ref="creditManageAdd"></credit-manage-add>
  </div>
</template>

<script>
  import { post } from "@/api/bizApi/commonUtil";

  export default {
    name: "creditSearch",
    components: {
      CreditManageAdd: () => import(/* webpackChunkName: "be/market/clickdeal/credit/creditManageAdd" */`@/views/bizViews/be/market/clickdeal/credit/creditManageAdd`)
    },
    data() {
      return {
        formItem: {
          transBrchTypes: "",
          transBrchTypesName: ""
        },
        columns: [
          {
            type: "radio",
            title: " ",
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
            title: this.$t("m.i.common.memberId"),
            key: "memberId",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.memberName"),
            key: "memberName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.headCpesBrchCode"),
            key: "headBrchCode",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.headCpesBrchName"),
            key: "headBrchName",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.transBrchType"),
            key: "transBrchTypes",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let keyList = params.row.transBrchTypes.split(",");
              let valueList = [];
              for (let i = 0; i < keyList.length; i++) {
                valueList.push(this.getDictValueFromMap(this.dictMap, "BrchClass", keyList[i]));
              }
              return h("span", {
                domProps: {
                  title: valueList.join(",")
                }
              }, valueList.join(","));
            }
          },
          {
            title: this.$t("m.i.be.creditRelationModel"),
            key: "creditRelationModel",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "CreditRelationModel", params.row.creditRelationModel);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.validFlag"),
            key: "validFlag",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "ValidFlag", params.row.validFlag);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.status"),
            key: "status",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "CreditSendStatus", params.row.status);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.result"),
            key: "errorMsg",
            ellipsis: false,
            hiddenCol: false
          }
        ],
        currentSelectRow: [],
        //是否显示更多查询项
        ifShowMore: false,
        dictMap: new Map(),
        creditRelationModelList: [],
        isList: [],
        creditManageAddOrEditWin: false,
        showTransBrchTypeWin: false,
        transBrchTypesArr: [],
        brchTypesOptType: null,
        batchParams: {}
      };
    },
    mounted() {
      this.getDictListByGroups("CreditRelationModel,ValidFlag,BrchClass,CreditSendStatus,CreditOperStatus").then(res => {
        this.creditRelationModelList = res.get("CreditRelationModel");
        this.isList = res.get("ValidFlag");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      clearVal() {
        this.formItem.transBrchTypes = "";
        this.formItem.transBrchTypesName = "";
      },
      //表单查询
      handleSearch(pageNo) {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //重置表单查询结果
      resetSearch() {
        this.formItem.transBrchTypes = "";
        this.$refs.formItem.resetFields();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      //详情查看
      creditRelationDetail(str) {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.batchParams.creditId = this.currentSelectRow.id;
        this.assembleParams(str);
      },
      assembleParams(optType) {
        this.batchParams.batchType = optType;
        this.batchParams.dictMap = this.dictMap;
        this.batchParams.creditRelationModelList = this.creditRelationModelList;
        this.batchParams.isList = this.isList;
        this.creditManageAddOrEditWin = true;
      },
      //关闭新增、修改弹窗
      creditManageAddOrEditWinClose() {
        this.creditManageAddOrEditWin = false;
        let pageNo = this.$refs.datagrid.pageInfo.pageNo;
        this.handleSearch(pageNo);
        this.batchParams = {};
      },
      transBrchTypesWinOpen(optType) {
        this.brchTypesOptType = optType;
        if (optType === "query") {
          this.transBrchTypesArr = !!this.formItem.transBrchTypes ? this.formItem.transBrchTypes.split(",") : [];
        } else {
          this.transBrchTypesArr = !!this.addOrEditForm.transBrchTypes ? this.addOrEditForm.transBrchTypes.split(",") : [];
        }
        this.showTransBrchTypeWin = true;
      },
      showTransBrchTypeWinClose() {
        this.showTransBrchTypeWin = false;
      },
      //根据弹框所选数据进行赋值
      transBrchTypeChange(info) {
        let objs = [];
        if (info instanceof Array) {
          objs = info;
        } else {
          objs[0] = info;
        }
        let transBrchTypes = "";
        let transBrchTypesName = "";
        for (var i = 0; i < objs.length; i++) {
          transBrchTypes += objs[i].id + ",";
          transBrchTypesName += objs[i].title + ",";
        }
        if (this.brchTypesOptType === "query") {
          this.formItem.transBrchTypes = transBrchTypes.substring(0, transBrchTypes.length - 1);
          this.formItem.transBrchTypesName = transBrchTypesName.substring(0, transBrchTypesName.length - 1);
        }
        // else if (this.brchTypesOptType === "add") {
        //   this.$refs.creditManageAdd.addOrEditForm.transBrchTypes = transBrchTypes.substring(0, transBrchTypes.length - 1);
        //   this.$refs.creditManageAdd.addOrEditForm.transBrchTypesName = transBrchTypesName.substring(0, transBrchTypesName.length - 1);
        // }
        this.showTransBrchTypeWin = false;
      }
    }
  };
</script>

<style scoped>

</style>
