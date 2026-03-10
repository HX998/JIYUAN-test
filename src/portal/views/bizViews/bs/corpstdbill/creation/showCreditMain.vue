<template>
  <h-msg-box v-model="tempShowCreditMainWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
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
      :url="creditMainUrl"
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
    <show-std-brch-cre :showStdBrchCreWin="showStdBrchCreWin" :creationId="creationId" :dictMap="dictMap"
                       @showStdBrchCreWinClose="showStdBrchCreWinClose" @showStdBrchCreWinSubmit="showStdCreWinSubmit" ref="showStdBrchCre"></show-std-brch-cre>
    <show-std-corp-cre :showStdCorpCreWin="showStdCorpCreWin" :creationId="creationId" :dictMap="dictMap"
                       @showStdCorpCreWinClose="showStdCorpCreWinClose" @showStdCorpCreWinSubmit="showStdCreWinSubmit" ref="showStdCorpCre"></show-std-corp-cre>
  </h-msg-box>
</template>

<script>
import { post, formatNumber } from "@/api/bizApi/commonUtil";

export default {
  name: "showCreditMain",
  components: {
    ShowStdBrchCre:() => import(/* webpackChunkName: "bs/corpstdbill/creation/showStdBrchCre" */`@/views/bizViews/bs/corpstdbill/creation/showStdBrchCre`),
    ShowStdCorpCre:() => import(/* webpackChunkName: "bs/corpstdbill/creation/showStdCorpCre" */`@/views/bizViews/bs/corpstdbill/creation/showStdCorpCre`),
  },
  data() {
    return {
      columns : [],
      defaultColumns : [
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
      ],
      brchColumns : [
        {
          title: this.$t('m.i.common.memberId'),
          key: "memberId",
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t('m.i.common.memberName'),
          key: "memberName",
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.shcpe.memberTypeCode"),
          key: "memberTypeCode",
          hiddenCol: false,
          ellipsis: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "MemberType", params.row.memberTypeCode);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
      ],
      custColumns : [
        {
          title: this.$t('m.i.common.custName'),
          key: "custName",
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.common.orgCode'),
          key: "orgCode",
          hiddenCol: false,
          sortable: true
        },
      ],
      creditColumns : [
        {
          title: this.$t('m.i.bs.creditRating'),
          key: "creditRating",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "CreditRating", params.row.creditRating);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.bs.ratingExpectation'),
          key: "ratingExpectation",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "RatingExpectationType", params.row.ratingExpectation);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.bs.creditRatingAgen'),
          key: "ratingBrchName",
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.bs.ratingDt'),
          key: "ratingDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            return h('span', params.row.ratingDt ? this.$moment(params.row.ratingDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
          }
        },
      ],
      formItem : {
        creationId: "",
      },
      showStdBrchCreWin: false,
      showStdCorpCreWin: false,
      extParam: {},
      creditMainUrl:"/bs/corpstdbill/creation/stdCreationApply/func_queryStdCreditMainPage",
    };
  },
  props: {
    title: "",
    creationId: "",
    baseAssetType: "",
    showCreditMainWin: {
      type: Boolean,
      default() {
        return false;
      }
    },
    isShow: false,
    dictMap: {
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
    showCreditMainWin(val) {
      if (val) {
        this.formItem.creationId = this.creationId;
        if(this.batchParams.creditMainUrl){
          this.creditMainUrl = this.batchParams.creditMainUrl;
        }
        if(this.baseAssetType === 'UDAC01'){
          this.columns = this.defaultColumns.concat(this.brchColumns.concat(this.creditColumns));
        }else{
          this.columns = this.defaultColumns.concat(this.custColumns.concat(this.creditColumns));
        }
        this.$nextTick(() => {
          this.handleSearch();
        });
      }
    }
  },
  computed: {
    tempShowCreditMainWin: {
      get() {
        return this.showCreditMainWin;
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
      this.$emit("showCreditMainClose", "");
    },
    onMaximize() {
      setTimeout(() => {
        this.$refs.datagrid.$refs.gridContent.handleResize();
      }, 100);
    },
    stdCreationOperate(type){
      if(type === 'add'){
        if(this.baseAssetType === 'UDAC01'){
          //同业
          this.showStdBrchCreWin = true;
        }else{
          //企业
          this.showStdCorpCreWin = true;
        }
      }else{
        let list = this.$refs.datagrid.selectIds;
        if(list && list.length > 0){
          post({id: this.creationId, creditMainIds: list}, "/bs/corpstdbill/creation/stdCreationApply/func_deleteStdCreditMain").then(res => {
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
    showStdBrchCreWinClose(){
      this.showStdBrchCreWin = false;
      this.handleSearch();
    },
    showStdCreWinSubmit(list){
      post({id: this.creationId, creditRatingIds: list}, "/bs/corpstdbill/creation/stdCreationApply/func_addStdCreditMain").then(res => {
        if (res) {
          let msg = res.data.retMsg;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$msgTip.success(this, { info: "添加成功" });
          } else {
            this.$msgTip.error(this, { info: msg });
          }
          if(this.baseAssetType === 'UDAC01'){
            //同业
            this.$refs.showStdBrchCre.handleSearch();
          }else{
            //企业
            this.$refs.showStdCorpCre.handleSearch();
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    showStdCorpCreWinClose(){
      this.showStdCorpCreWin = false;
      this.handleSearch();
    },
  },
}
</script>

<style scoped>

</style>
