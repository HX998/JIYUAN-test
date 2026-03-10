<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.busiType')" prop="prodNo">
                  <h-select v-model="formItem.prodNo" placeholder="">
                    <h-option v-for="item in prodNoList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="minStartDt" :label="$t('m.i.common.beginDt')">
                  <h-date-picker :value="startDt" type="daterange" autoPlacement placeholder="" @on-change="handleBeginDtChange"
                                 :editable=false showFormat></h-date-picker>
                </h-form-item>
                <h-form-item prop="minEndDt" :label="$t('m.i.shcpe.endDt')">
                  <h-date-picker :value="endDt" type="daterange" autoPlacement placeholder="" @on-change="handleEndDtChange"
                                 :editable=false showFormat></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="">
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.status')" prop="status">
                  <h-select v-model="formItem.status" placeholder="">
                    <h-option v-for="item in TransAuthStatusList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-row>
            <h-col span="24">
              <h-datagrid :columns="columns"
                          highlight-row
                          url="/pc/risk/transAuthorization/transAuthorizationSearch/func_pageQueryTransAuthRuleList"
                          :bindForm="formItem"
                          :onCurrentChange="onCurrentChange"
                          :onCurrentChangeCancel="onCurrentChangeCancel"
                          ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="ruleViewTransAuth()" >{{$t('m.i.common.ruleView')}}</h-button>
                </div>
              </h-datagrid>
            </h-col>
          </h-row>
        </div>
      </h-col>
    </h-row>

    <!-- 规则查看弹出框 -->
    <h-msg-box v-model="ruleViewWin" width="800" class="h-form-table-layer" :maximize="true"
               @on-close="ruleViewWinClose()" :mask-closable="false">
      <p slot="header">
        <span>规则查看</span>
      </p>
      <div>
        <!-- 数据展示表格 -->
        <h-datagrid :columns="ruleViewColumns"
                    highlight-row
                    :autoLoad="false"
                    url="/pc/risk/transAuthorization/transAuthorizationSearch/func_pageQueryTransAuthParamList"
                    :bindForm="ruleViewFormItem"
                    ref="ruleViewDatagrid" class="pl-5 pr-5">
          <div slot="toolbar" class="pull-left">
          </div>
        </h-datagrid>
      </div>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="ruleViewWinClose()">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>


  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap,formatNumber,accMul } from "@/api/bizApi/commonUtil";

  export default {
    name: "transAuthorizationSearch",
    data() {
      return {
        dictMap: new Map(),
        billTypeList: [],
        prodNoList: [],
        TransAuthStatusList:[],
        type:'',
        ifShowMore: false,
        formItem:{
          prodNo:"",
          billType:"",
          minStartDt:"",
          maxStartDt:"",
          minEndDt:"",
          maxEndDt:"",
          status:"1"
        },
        startDt: [],
        endDt: [],
        currentSelectRow : [],
        ruleMaintainCurrentSelectRow: [],
        columns:[
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
            title: this.$t("m.i.common.busiType"),
            key: "prodNo",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "TransAuthProdNo", params.row.prodNo);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.beginDt'),
            key: "startDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.startDt == null || params.row.startDt === ""){
                return "";
              }
              let date = this.$moment(params.row.startDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.shcpe.endDt'),
            key: "endDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.endDt == null || params.row.endDt === ""){
                return "";
              }
              let date = this.$moment(params.row.endDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.totalBillMoney'),
            key: 'totalAmt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let totalAmt = formatNumber(params.row.totalAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: totalAmt
                }
              }, totalAmt);
            }
          },
          {
            title: this.$t('m.i.common.usedTransAuthAmt'),
            key: 'usedTotalAmt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let totalAmt = formatNumber(params.row.usedTotalAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: totalAmt
                }
              }, totalAmt);
            }
          },
          {
            title: this.$t('m.i.common.createDt'),
            key: "createDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.createDt == null || params.row.createDt === "") {
                return "";
              }
              let date = this.$moment(params.row.createDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.common.status'),
            key: "status",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "TransAuthStatus", params.row.status);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
        ],
        ruleViewWin:false,
        ruleViewFormItem: {
          transAuthRuleId: "",
        },
        ruleViewColumns: [
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
            title: this.$t("m.i.billInfo.acptTopBankLevel"),
            key: "acptBankLevels",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = "";
              if (params.row.acptBankLevels === "" || params.row.acptBankLevels === null
                || params.row.acptBankLevels === undefined) {
                return h("span", { domProps: { title: dictValue } }, dictValue);
              } else {
                let split = params.row.acptBankLevels.split(",");
                for (let i=0; i < split.length; i++) {
                  if (i === split.length-1) {
                    dictValue = dictValue + getDictValueFromMap(this.dictMap, "bankLevel", split[i])
                  } else {
                    dictValue = dictValue + getDictValueFromMap(this.dictMap, "bankLevel", split[i])+","
                  }
                }
                return h("span", { domProps: { title: dictValue } }, dictValue);
              }
            }
          },
          {
            title: this.$t('m.i.billInfo.distClass'),
            key: "discBankLevels",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = "";
              if (params.row.discBankLevels === "" || params.row.discBankLevels === null
                || params.row.discBankLevels === undefined) {
                return h("span", { domProps: { title: dictValue } }, dictValue);
              } else {
                let split = params.row.discBankLevels.split(",");
                for (let i=0; i < split.length; i++) {
                  if (i === split.length-1) {
                    dictValue = dictValue + getDictValueFromMap(this.dictMap, "bankLevel", split[i])
                  } else {
                    dictValue = dictValue + getDictValueFromMap(this.dictMap, "bankLevel", split[i])+","
                  }
                }
                return h("span", { domProps: { title: dictValue } }, dictValue);
              }

            }
          },
          {
            title: this.$t('m.i.billInfo.minDueDate'),
            key: "minDueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.minDueDt == null || params.row.minDueDt === "") {
                return "";
              }
              let date = this.$moment(params.row.minDueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.billInfo.maxDueDate'),
            key: "maxDueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.maxDueDt == null || params.row.maxDueDt === "") {
                return "";
              }
              let date = this.$moment(params.row.maxDueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.pl.minBillAmt"),
            key: "minBillAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let totalAmt = formatNumber(params.row.minBillAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: totalAmt
                }
              }, totalAmt);
            }
          },
          {
            title: this.$t("m.i.pl.maxBillAmt"),
            key: "maxBillAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let totalAmt = formatNumber(params.row.maxBillAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: totalAmt
                }
              }, totalAmt);
            }
          },
          {
            title: this.$t('m.i.common.minRate'),
            key: "minRate",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.maxRate'),
            key: "maxRate",
            hiddenCol: false
          },
        ],


      }
    },
    mounted() {
      getDictListByGroups("DraftTypeCode,bankLevel,TransAuthProdNo,TransAuthStatus").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.prodNoList = res.get("TransAuthProdNo");
        this.TransAuthStatusList = res.get("TransAuthStatus");
        this.dictMap = res.get("map");
      });
    },

    methods: {
      handleBeginDtChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minStartDt = arr[0].replace(/-/g, "");
          this.formItem.maxStartDt = arr[1].replace(/-/g, "");
          this.startDt = [arr[0],arr[1]];
        } else {
          this.formItem.minStartDt = "";
          this.formItem.maxStartDt = "";
          this.startDt = [];
        }
      },
      handleEndDtChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minEndDt = arr[0].replace(/-/g, "");
          this.formItem.maxEndDt = arr[1].replace(/-/g, "");
          this.endDt = [arr[0],arr[1]];
        } else {
          this.formItem.minEndDt = "";
          this.formItem.maxEndDt = "";
          this.endDt = [];
        }
      },
      //表单查询
      handleSearch() {
        this.currentSelectRow = [];
        this.$nextTick(() => {
          this.$refs.datagrid.dataChange(1);
        });
      },
      //重置表单查询结果
      resetSearch() {
        this.$nextTick(() => {
          this.formItem.prodNo = '';
          this.formItem.billType = '';
          this.formItem.minStartDt = '';
          this.formItem.maxStartDt = '';
          this.formItem.minEndDt = '';
          this.formItem.maxEndDt = '';
          this.formItem.status = '1';
          this.startDt = "";
          this.endDt = "";
        });
      },
      onCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      onCurrentChangeCancel() {
        this.currentSelectRow = [];
      },

      //规则查看
      ruleViewTransAuth() {
        if(this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.ruleViewFormItem.transAuthRuleId = this.currentSelectRow.id;
        this.ruleViewWin = true;
        this.$nextTick(() => {
          this.$refs.ruleViewDatagrid.dataChange(1);
        });
      },
      //规则查看弹窗
      //规则查看弹窗-关闭
      ruleViewWinClose() {
        this.ruleViewFormItem.transAuthRuleId = "";
        this.ruleViewWin = false;
      },

    },
  }

</script>

<style scoped>

</style>

