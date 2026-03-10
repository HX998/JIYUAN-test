<template>
  <h-msg-box v-model="tempShowOrgHolderWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
             width="1000" class="h-form-table-layer" @on-maximize="onMaximize">
    <p slot="header">
      <span>{{ title }}</span>
    </p>
    <!--弹出框内容-->
    <div>
      <!--数据展示表格-->
      <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
      </h-form>
    </div>
    <h-datagrid
      :columns="columns"
      highlightRow
      :url="orgHolderUrl"
      :bindForm="formItem"
      :auto-load="false"
      rowSelect
      :hasSelect="false"
      ref="datagrid">
      <div slot="toolbar" class="pull-left">
        <h-button type="primary" @click="stdCreationOperate('add')" v-if="!isShow">{{$t("m.i.common.addition")}}</h-button>
        <h-button type="primary" @click="stdCreationOperate('del')" v-if="!isShow">{{$t("m.i.common.delete")}}</h-button>
      </div>
    </h-datagrid>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
    </div>
    <cust-corp-msg-box title="原始持票人新增" :showCustCorpWin="showCustCorpWin" selectType="check" :custCorpParams="extParam" @custCorpWinClose="showCustCorpWinClose"
                       @custCorpChange="showCustCorpWinSubmit" ref="showCustCorp"></cust-corp-msg-box>
  </h-msg-box>
</template>

<script>
import { post, formatNumber } from "@/api/bizApi/commonUtil";

export default {
  name: "showOrgHolder",
  components: {
    ShowCustCorp: () => import(/* webpackChunkName: "bs/corpstdbill/creation/showCustCorp" */"@/views/bizViews/bs/corpstdbill/creation/showCustCorp"),
  },
  data() {
    let columns = [
      {
        type: "selection",
        width: 50,
        hiddenCol: false,
        align: "center"
      },
      {
        title: this.$t("m.i.common.index"),
        type: "index",
        width: 60,
        align: "center"
      },
      {
        title: this.$t('m.i.common.custNo'),
        key: "custNo",
        hiddenCol: false,
      },
      {
        title: this.$t('m.i.common.custName'),
        key: "custName",
        hiddenCol: false,
      },
      {
        title: this.$t('m.i.common.socCode'),
        key: "socCode",
        hiddenCol: false,
      },
      {
        title: this.$t('m.i.common.orgCode'),
        key: "orgCode",
        hiddenCol: false,
      },
      {
        title: this.$t('m.i.common.custPartnerType'),
        key: "custPartnerType",
        hiddenCol: false,
        render: (h, params) => {
          return h("span","企业");
        }
      },
      {
        title: this.$t('m.i.common.industryCategory'),
        key: "industryCategory",
        hiddenCol: false,
        render: (h, params) => {
          let list = this.getDictValueFromMap(this.dictMap, "Industry", params.row.industryCategory);
          return h("span",
            {
              domProps: {
                title: list
              }
            }, list);
        }
      },
      {
        title: this.$t('m.i.common.corpScale'),
        key: "corpScale",
        hiddenCol: false,
        render: (h, params) => {
          let list = this.getDictValueFromMap(this.dictMap, "CorpScale", params.row.corpScale);
          return h("span",
            {
              domProps: {
                title: list
              }
            }, list);
        }
      },
      {
        title: this.$t('m.i.common.isArc'),
        key: "isArc",
        hiddenCol: false,
        render: (h, params) => {
          let list = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isArc);
          return h("span",
            {
              domProps: {
                title: list
              }
            }, list);
        }
      },
      {
        title: this.$t('m.i.common.isGreenCorp'),
        key: "isGreenCorp",
        hiddenCol: false,
        render: (h, params) => {
          let list = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isGreenCorp);
          return h("span",
            {
              domProps: {
                title: list
              }
            }, list);
        }
      }
    ];
    let formItem = {
      creationId: "",
    };
    return {
      columns: columns,
      formItem: formItem,
      showCustCorpWin: false,
      extParam: {},
      orgHolderUrl:"/bs/corpstdbill/creation/stdCreationApply/func_queryStdCorpOrgHolderPage"
    };
  },
  props: {
    title: "",
    creationId: "",
    showOrgHolderWin: {
      type: Boolean,
      default() {
        return false;
      }
    },
    isShow: false,
    dictMap: { //CorpScale,Industry,partnerType,Yon
      type: Map,
      required: true
    },
    batchParams: {
      type: Object,
      default(){
        return {};
      }
    }
  },
  watch: {
    showOrgHolderWin(val) {
      if (val) {
        this.formItem.creationId = this.creationId;
        if(this.batchParams.orgHolderUrl){
          this.orgHolderUrl = this.batchParams.orgHolderUrl;
        }
        this.$nextTick(() => {
          this.handleSearch();
        });
      }
    }
  },
  computed: {
    tempShowOrgHolderWin: {
      get() {
        return this.showOrgHolderWin;
      },
      set() {
      }
    }
  },
  methods: {
    handleSearch(){
      this.$refs.datagrid.selects = [];
      this.$refs.datagrid.selectIds = [];
      this.$refs.datagrid.dataChange(1);
    },
    handleClose() {
      this.$refs.datagrid.selects = [];
      this.$refs.datagrid.selectIds = [];
      this.$emit("showOrgHolderWinClose", "");
    },
    onMaximize() {
      setTimeout(() => {
        this.$refs.datagrid.$refs.gridContent.handleResize();
      }, 100);
    },
    stdCreationOperate(type){
      if(type === 'add'){
        this.queryStdOrgHolderOrgCodes(retData => {
          this.extParam.notInOrgCodeList = retData;
          this.showCustCorpWin = true;
        });
      }else{
        let list = this.$refs.datagrid.selectIds;
        if(list && list.length > 0){
          post({id: this.creationId, holderIds: list}, "/bs/corpstdbill/creation/stdCreationApply/func_deleteStdCorpOrgHolder").then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$msgTip.success(this, { info: "删除成功" });
              } else {
                this.$msgTip.error(this, { info: msg });
              }
              this.handleSearch();
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        }else{
          this.$msgTip.error(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
        }
      }
    },
    showCustCorpWinClose(){
      this.showCustCorpWin = false;
      this.extParam.notInCustNoList = [];
      this.handleSearch();
    },
    queryStdOrgHolderOrgCodes(callback) {
      post({creationId: this.creationId}, "/bs/corpstdbill/creation/stdCreationApply/func_queryStdOrgHolderOrgCodes").then(res => {
        if (res) {
          let msg = res.data.retMsg;
          let retCode = res.data.retCode;
          let retData=res.data.retData;
          if (retCode === "000000") {
            callback(retData);
          } else {
            this.$msgTip.error(this, { info: msg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    showCustCorpWinSubmit(list){
      let idList = [];
      for (let i = 0; i < list.length; i++) {
        idList.push(list[i].id);
      }
      post({id: this.creationId, custIds: idList}, "/bs/corpstdbill/creation/stdCreationApply/func_addStdCorpOrgHolder").then(res => {
        if (res) {
          let msg = res.data.retMsg;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$msgTip.success(this, { info: "添加成功" });
            // this.showCustCorpWin = false;
          } else {
            this.$msgTip.error(this, { info: msg });
          }
          this.queryStdOrgHolderOrgCodes(retData => {
            this.extParam.notInOrgCodeList = retData;
            this.$refs.showCustCorp.formSearch(1, true);
          });
          this.handleSearch();
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    }
  },
}
</script>

<style scoped>

</style>
