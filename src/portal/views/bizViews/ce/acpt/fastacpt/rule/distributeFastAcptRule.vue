<template>
  <!--分配极速开票规则弹出框-->
  <h-msg-box v-model="tempDistributeAcptRuleWin" width="1000" :mask-closable="false" @on-close="handleClose" top="10"
             class="h-form-table-layer" :maximize="true" @on-maximize="onMaximize">
    <p slot="header">
      <span>分配极速开票规则</span>
    </p>
    <!--查询表单-->
    <div>
      <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
        <h-form-item prop="legalNo" :label="$t('m.i.common.legalNo')">
          <h-input v-model="formItem.legalNo" :maxlength="6"></h-input>
        </h-form-item>
        <h-form-item prop="legalpersonName" :label="$t('m.i.common.legalpersonName')">
          <h-input v-model="formItem.legalpersonName" :maxlength="60"></h-input>
        </h-form-item>
        <h-form-item class="h-form-operate two-form">
          <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
          <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
        </h-form-item>
      </h-form>
    </div>
    <!--数据展示表格-->
    <h-datagrid
      :columns="columns"
      :highlight-row="false"
      url="/sm/auth/legalperson/getLegalPersonList"
      :bindForm="formItem"
      :border="true"
      :autoLoad=false
      :row-select="true"
      ref="datagrid">
      <div slot="toolbar" class="pull-left"></div>
    </h-datagrid>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "distributeFastAcptRule",
    data() {
      return {
        formItem : {
          legalNo: "",
          legalpersonName: ""
        },
        columns : [
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
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.legalNo'),
            key: "legalNo",
            align: "center",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.legalpersonName'),
            key: "legalpersonName",
            align: "center",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.createDt'),
            key: "createTime",
            align: "center",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.createTime == null ? "" : this.$moment(params.row.createTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
              return h("span", date);
            }
          }
        ],
        currentSelectList : []
      };
    },
    props: {
      distributeAcptRuleWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      fastAcptRuleIds: "",

    },
    comments: {},
    watch: {
      distributeAcptRuleWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.$refs.formItem.resetFields();
            this.formSearch();
          });
        }
      },
    },

    computed: {
      tempDistributeAcptRuleWin: {
        get() {
          return this.distributeAcptRuleWin;
        },
        set() {
        }
      },
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      formSearch() {
        this.currentSelectList = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      handleClose() {
        this.$refs.datagrid.$refs.gridPage.clearElevator();
        this.$emit("distributeAcptRuleWinClose", "");
      },
      submitForm() {
        this.currentSelectList = this.$refs.datagrid.selects;
        let list = this.currentSelectList;
        if (list != null && list.length > 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确定提交吗?",
            onOk: () => {
              let legalNo = [];
              for (let i = 0; i < list.length; i++) {
                legalNo.push(list[i].legalNo);
              }

              let params = { ids: this.fastAcptRuleIds, legalNo: legalNo.join(",") };
              let url = "/ce/acpt/fastacpt/rule/fastAcptRule/func_allocationRule";
              post(params, url).then(res => {
                this.submitFlag = false;
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode === "000000") {
                    this.$msgTip.success(this);
                    this.$emit("distributeAcptRuleSubmit", null);
                  } else {
                    this.$msgTip.error(this, { info: res.data.retMsg });
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                }
              });
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
        }
      }
    }
  };
</script>

<style scoped>

</style>
