<!--挂牌挑选贴现申请人页面-->
<template>
  <div>
    <h-msg-box v-model="tempCustInfoSearchWin" :mask-closable="false" @on-close="custInfoSearchClose" :maximize="true" width="1000"
               class="h-form-table-layer" top="10" @on-maximize="onMaximize">
      <p slot="header">
        <span>{{title}}</span>
      </p>
      <div :class="{'h-form-overhd':!ifShowMore}">
        <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
          <common-input v-model="formItem.discCustName" :label="$t('m.i.common.enterpriseName')" prop="discCustName"  ></common-input>
          <common-input v-model="formItem.discSocCode" :label="$t('m.i.be.discOutSocCode')" prop="discSocCode" :validRules="discOutSocCodeRule"></common-input>
          <query-btn :advanceShow="false" @showChange="showChange" :formSearch="handleSearch" :formSearchReset="resetSearch"></query-btn>
        </h-form>
        <h-datagrid
          :columns="columns"
          highlight-row
          :url="custInfoUrl"
          :bindForm="formItem"
          :onCurrentChange="onCurrentChange"
          :onCurrentChangeCancel="onCurrentChangeCancle"
          :onRowDbClick="doubleHandleClick"
          :auto-load="false"
          ref="custInfoDatagrid">
        </h-datagrid>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="custInfoSearchClose()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="custInfoSubmit()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "custInfoSearch",
    components:{},
    data() {
      return {
        discOutSocCodeRule:[{
          test: /^[A-Z0-9]{0,18}$/,
          trigger: "blur",
          message: "社会信用代码不能超过18位字符或使用不合法的字符"
        }],
        submitFlag: false,
        ifShowMore: false,
        formItem: {
          discCustName:"",
          discSocCode:"",
          brokerBrchCode:"",
          optType:"0"
        },
        columns: [
          {
            type: "radio",
            title: " ",
            width: 60,
            align: "center",
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
            title: this.$t("m.i.common.enterpriseName"),
            key: "discCustName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.socCode"),
            key: "discSocCode",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.corpScale"),
            key: "discCorpScale",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.batchParams.dictMap, "CorpScale", params.row.discCorpScale);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.industryCategory"),
            key: "discIndustry",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.batchParams.dictMap, "Industry", params.row.discIndustry);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.isArc"),
            key: "isDiscArc",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.batchParams.dictMap, "Yon", params.row.isDiscArc);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.isGreenCorp"),
            key: "isDiscGreenCorp",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.batchParams.dictMap, "Yon", params.row.isDiscGreenCorp);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.isSciCorp"),
            key: "isDiscTechnologyCorp",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.batchParams.dictMap, "Yon", params.row.isDiscTechnologyCorp);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.isPrivateCorp"),
            key: "isDiscPrivateCorp",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.batchParams.dictMap, "Yon", params.row.isDiscPrivateCorp);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.area"),
            key: "area",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.batchParams.dictMap, "Province", params.row.area);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.rgstBrchName"),
            key: "brokerBrchName",
            sortable: false,
            hiddenCol: false
          }
        ],
        currentSelectRow: null,
        currentSelectList: [],
        currentSelectRowInx: [],
        custInfoUrl: ""
      };
    },
    props: {
      title: {
        type: String,
        default: "查询贴现申请人页面"
      },
      custSearchWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      batchParams: {
        type: Object,
        default: {}
      },
      brchCode: String
    },
    computed: {
      tempCustInfoSearchWin: {
        get() {
          return this.custSearchWin;
        },
        set() {

        }
      }
    },
    watch: {
      custSearchWin(val) {
        if (val) {
          this.custInfoUrl = this.batchParams.custInfoUrl + "func_queryDiscCustInfoPage"
          this.$nextTick(() => {
            this.formItem.brokerBrchCode = this.brchCode;
            if(this.batchParams.optType){
              this.formItem.optType=this.batchParams.optType;
            }else{
              this.formItem.optType="0";
            }
            this.$refs.custInfoDatagrid.dataChange(1);
          });
        }
      }
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.custInfoDatagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      showChange(val) {
        this.ifShowMore = val;
      },
      //表单查询
      handleSearch(pageNo) {
        this.currentSelectRow = [];
        this.currentSelectList = [];
        this.$refs.custInfoDatagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      },
      onCurrentChange(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = currentRow;
      },
      onCurrentChangeCancle(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = null;
      },
      doubleHandleClick(arr) {
        this.currentSelectRow = arr;
        this.$emit("custSearchChange", this.currentSelectRow);
        this.custInfoSearchClose();
      },
      custInfoSearchClose() {
        this.currentSelectRow = [];
        this.currentSelectList = [];
        this.formItem.discCustName="";
        this.formItem.discSocCode="";
        this.formItem.brokerBrchCode="";
        this.$refs.custInfoDatagrid.$refs.gridPage.clearElevator();
        this.$emit("custSearchWinClose", "");
      },
      custInfoSubmit() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$emit("custSearchChange", this.currentSelectRow);
          this.custInfoSearchClose();
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      }
    }
  };
</script>

<style scoped>

</style>
