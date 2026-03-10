<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">

                <h-form-item :label="$t('m.i.pc.warteeName')" prop="warteeName">
                  <h-input v-model="formItem.warteeName" :maxlength=60></h-input>
                </h-form-item>

                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{ $t('m.i.common.searchAdvanced') }}<i
                    class="icon iconfont"
                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{ $t('m.i.common.search') }}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{ $t('m.i.common.reset') }}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="pc/risk/guarntrtrust/guarntrTrustCheck/func_query"
            :bindForm="formItem"
            :row-select="true"
            :has-select="false"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="askPass">{{ $t('m.i.bs.recoursePass') }}</h-button>
              <h-button type="primary" @click="askReject">{{ $t('m.i.bs.recourseRefuse') }}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

  </div>
</template>

<script>
import {
  formatNumber,
  getDictListByGroups,
  getDictValueFromMap,
  post,
  getBusinessParameter
} from "@/api/bizApi/commonUtil";

export default {
  name: "guarntrTrustCheck",
  components: {},
  data() {
    return {
      param: '',
      rows: null,
      ifShowMore: false,
      tempShowExcelTemplateWin: false,
      busiTypeMap: new Map(),
      custTypeMap: new Map(),
      opTypeMap: new Map(),
      flowStatusMap: new Map(),
      busiTypeList:[],
      flowStatusList:[],
      brchNo: "",
      showCustCorpWin: false,
      addForm : false,

      formItem: {
        warteeName: '',
      },
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
          key: "xuhao",
          align: "center"
        },
        {
          title: this.$t("m.i.pc.busiType"),
          key: "busiType",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let dictValue = this.busiTypeMap.get(params.row.busiType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.common.custType"),
          key: "custType",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let dictValue = this.custTypeMap.get(params.row.custType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.pc.warteeCustNo"),
          key: 'warteeCustNo',
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.pc.warteeName"),
          key: 'warteeName',
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.pc.warteeBrchCode"),
          key: 'warteeBrchCode',
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.pc.guarntrAmt"),
          key: "guarntrAmt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let guarntrAmt = formatNumber(params.row.guarntrAmt, 2, ",");
            return h("span", {
              domProps: {
                title: guarntrAmt
              }
            }, guarntrAmt);
          }
        },
        {
          title: this.$t("m.i.common.remark"),
          key: "remark",
          hiddenCol: false,
          sortable: false,
        },
        {
          title: this.$t("m.i.common.applTellerNo"),
          key: "applTellerNo",
          hiddenCol: false,
          sortable: false,
        },

        {
          title: this.$t("m.i.common.operStatus"),
          key: "flowStatus",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let dictValue = this.opTypeMap.get(params.row.rgstType);
            dictValue = dictValue + ":" + this.flowStatusMap.get(params.row.flowStatus);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.common.dealPrcMsg"),
          key: "dealPrcMsg",
          hiddenCol: false,
          sortable: false,
        },
      ],
    }
  },
  methods: {
    formSearch() {
      this.$refs.datagrid.selects = [];
      this.$refs.datagrid.selectIds = [];
      this.$refs.datagrid.dataChange(1);
    },
    formSearchReset() {
      this.$refs.datagrid.selects = [];
      this.$refs.datagrid.selectIds = [];
      this.formItem.warteeName = "";
    },
    askPass() {
      let selects = this.$refs.datagrid.selects;
      if (selects.length === 0) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
        return;
      }
      this.$hMsgBox.confirm({
        title: "确认",
        content: "确定要通过吗？",
        onOk: () => {
          this.passSubmit(selects);
        }
      });
    },
    passSubmit(selects) {
      let ids = "";
      /*for (var index in selects){
        if (ids === ""){
          ids = selects[index].id;
        }else {
          ids = ids + "," + selects[index].id;
        }
      }*/
      ids = this.$refs.datagrid.selectIds;
      post({ids:ids}, "pc/risk/guarntrtrust/guarntrTrustCheck/func_auditPass").then(res => {
        if (res) {
          let msg = res.data.retMsg;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$msgTip.success(this);
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
          } else {
            this.$msgTip.error(this, {info: msg});
          }
        }
      }).catch(error => {
        this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
      });
    },
    askReject(){
      let selects = this.$refs.datagrid.selects;
      if (selects.length === 0) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
        return;
      }
      this.$hMsgBox.confirm({
        title: "确认",
        content: "确认要驳回吗？",
        onOk: () => {
          this.confirmSubmit(selects);
        }
      });
    },
    confirmSubmit(selects){
      let ids = "";
      /*for (var index in selects){
        if (ids === ""){
          ids = selects[index].id;
        }else {
          ids = ids + "," + selects[index].id;
        }
      }*/
      ids = this.$refs.datagrid.selectIds;
      post({ids:ids}, "/pc/risk/guarntrtrust/guarntrTrustCheck/func_auditReject").then(res => {
        if (res) {
          let msg = res.data.retMsg;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$msgTip.success(this);
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
          } else {
            this.$msgTip.error(this, {info: msg});
          }
        }
      }).catch(error => {
        this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
      });
    },
  },
  mounted() {
    this.getDictListByGroups("CreditCustType,GuarntrTrustFlowStatusCode,GuarntrTrustType,GuarntrTrustOpTypeCode").then(res => {
      this.busiTypeMap = res.get("map").get("GuarntrTrustType");
      this.custTypeMap = res.get("map").get("CreditCustType");
      this.flowStatusMap = res.get("map").get("GuarntrTrustFlowStatusCode");
      this.opTypeMap = res.get("map").get("GuarntrTrustOpTypeCode");
      this.custTypeList = res.get("CreditCustType");
      this.busiTypeList = res.get("GuarntrTrustType");
      this.flowStatusList = res.get("GuarntrTrustFlowStatusCode");
      this.dictMap = res.get("map");
    })
  }
}
</script>

<style scoped>

</style>
