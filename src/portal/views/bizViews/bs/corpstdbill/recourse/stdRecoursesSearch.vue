<!--查询可追索对象-->
<template>
  <h-msg-box v-model="tempRecoursesWin" width="1100" :mask-closable="false" @on-close="handleClose" top="10"
             class="h-form-table-layer" :maximize="true" @on-maximize="onMaximize">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <!--数据展示表格-->
    <h-datagrid
      :columns="columns"
      highlight-row
      url="/bs/corpstdbill/recourse/stdRecourseApply/func_queryRecourseAbledInfo"
      :bindForm="formItem"
      :onCurrentChangeCancel="onCurrentChangeCancel"
      :onCurrentChange="onCurrentChange"
      :autoLoad=false
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
  import { on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "stdRecoursesSearch",
    data() {
      return {
        formItem : {},
        columns : [
          {
            type: "radio",
            title: " ",
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
            title: this.$t("m.i.bs.rcvgRoleName"),
            key: "rcvgRoleName",
            hiddenCol: true,
            ellipsis: false,
          },
          {
            title: this.$t("m.i.ce.receiverName"),
            key: "custName",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.ce.rcvgBankNo"),
            key: "bankNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.ce.receiverAcctNo"),
            key: "acctNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
           title: this.$t("m.i.ce.receiveType"),
            key: "partnerType",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.recoursesParam.dictMap,"partnerType",params.row.partnerType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.ce.rcvgOrgCode"),
            key: "orgCode",
            hiddenCol: false,
            ellipsis: false
          }
        ],
        currentSelectRow : null,
      }
    },
    props: {
      showRecoursesWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      title: {
        type: String,
        default: "查询可追索对象"
      },
      recoursesParam: {
        type: Object,
        default: {
          billId: "",
          ecdsAcctNo: "",
          billNo: "",
          dictMap: Map
        }
      }
    },
    comments: {},
    watch: {
      showRecoursesWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.formItem.billId = this.recoursesParam.billId;
            this.formItem.billNo = this.recoursesParam.billNo;
            this.formItem.ecdsAcctNo = this.recoursesParam.ecdsAcctNo;
            this.formSearch();
          });
        }
      }
    },
    computed: {
      tempRecoursesWin: {
        get() {
          return this.showRecoursesWin;
        },
        set() {
        }
      }
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      formSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      onCurrentChangeCancel() {
        this.currentSelectRow = null;
      },
      onCurrentChange(arr, selectInx) {
        this.currentSelectRow = arr;
      },
      handleClose() {
        this.$refs.datagrid.$refs.gridPage.clearElevator();
        this.$emit("showRecoursesWinlose", "");
      },
      submitForm() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$refs.datagrid.$refs.gridPage.clearElevator();
          this.$emit("recoursesChange", this.currentSelectRow);
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      }
    }
  };
</script>

<style scoped>

</style>
