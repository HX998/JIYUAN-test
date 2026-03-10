<template>
  <h-msg-box v-model="tempShowStdCorpCreWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
             width="1000" class="h-form-table-layer" @on-maximize="onMaximize">
    <p slot="header">
      <span>企业评级信息</span>
    </p>
    <!--弹出框内容-->
    <div>
      <!--数据展示表格-->
      <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
        <!--客户名称-->
        <common-input v-model="formItem.custNameLike" :label="$t('m.i.common.custName')" prop="custNameLike"
                      :maxlength="60" ></common-input>
        <!--信用评级机构-->
        <common-input v-model="formItem.ratingBrchNameLike" :label="$t('m.i.bs.creditRatingAgen')" prop="ratingBrchNameLike"
                      :maxlength="60" ></common-input>
        <h-form-item class="h-form-operate">
          <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
          <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
        </h-form-item>
      </h-form>
    </div>
    <h-datagrid
      :columns="columns"
      highlightRow
      url="/bs/corpstdbill/creation/stdCreationApply/func_selectCorpCreRatingPage"
      :bindForm="formItem"
      :auto-load="false"
      rowSelect
      :hasSelect="false"
      ref="datagrid">
    </h-datagrid>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
export default {
  name: "showStdCorpCre",
  components: {
    MemberIdSearch: () => import(/* webpackChunkName: "sm/auth/legalperson/memberIdSearch" */`@/views/bizViews/sm/auth/legalperson/memberIdSearch`)
  },
  data(){
    return {
      columns : [  //客户名称 客户组织机构代码	信用评级	评级展望	信用评级机构	评定日期
        {
          type: "selection",
          width: 50,
          hiddenCol: false,
          align: "center"
        },
        {
          type: "index",
          title: this.$t("m.i.common.index"),
          width: 60,
          align: "center"
        },
        {
          title: this.$t("m.i.common.custName"),
          key: "custName",
          hiddenCol: false,
          ellipsis: false,
          sortable: true
        },
        {
          title: this.$t("m.i.common.orgCode"),
          key: "orgCode",
          hiddenCol: false,
          ellipsis: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.bs.creditRating"),
          key: "creditRating",
          hiddenCol: false,
          ellipsis: false,
          sortable: true,
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
          title: this.$t("m.i.bs.ratingExpectation"),
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
          title: this.$t("m.i.bs.creditRatingAgen"),
          key: "ratingBrchName",
          hiddenCol: false,
          ellipsis: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.bs.ratingDt"),
          key: "ratingDt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h('span', params.row.ratingDt ? this.$moment(params.row.ratingDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
          }
        },
        {
          title: this.$t("m.i.bs.operDt"),
          key: "operDt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h('span', params.row.operDt ? this.$moment(params.row.operDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
          }
        }
      ],
      formItem : {
        custNameLike:"",
        ratingBrchNameLike:"",
      },
      //客户弹出框
      showCustMessageWin: false,
    }
  },
  props: {
    showStdCorpCreWin: false,
    creationId: "",
    dictMap: { //MemberType, CreditRating
      type: Map,
      required: true
    },
  },
  watch: {
    showStdCorpCreWin(val) {
      if (val) {
        this.formItem.creationId = this.creationId;
        this.$nextTick(() => {
          this.handleSearch();
        });
      }
    }
  },
  computed: {
    tempShowStdCorpCreWin: {
      get() {
        return this.showStdCorpCreWin;
      },
      set() {
      }
    }
  },
  methods: {
    handleSearch() {
      this.$refs.datagrid.selects = [];
      this.$refs.datagrid.selectIds = [];
      this.$refs.datagrid.dataChange(1);
    },
    handleClose() {
      this.formSearchReset();
      this.$refs.datagrid.selects = [];
      this.$refs.datagrid.selectIds = [];
      this.$emit("showStdCorpCreWinClose", "");
    },
    onMaximize() {
      setTimeout(() => {
        this.$refs.datagrid.$refs.gridContent.handleResize();
      }, 100);
    },
    formSearchReset() {
      this.$refs.formItem.resetFields();
      this.formItem.memberName = "";
      this.formItem.memberId = "";
      this.formItem.ratingBrchName = "";
    },
    submitForm() {
      let list = this.$refs.datagrid.selectIds;
      if (list && list.length > 0) {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$emit("showStdCorpCreWinSubmit", list);
        this.$refs.datagrid.$refs.gridPage.clearElevator();
        this.$refs.formItem.resetFields();
      } else {
        this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
      }
    },
  }
}
</script>

<style scoped>

</style>
