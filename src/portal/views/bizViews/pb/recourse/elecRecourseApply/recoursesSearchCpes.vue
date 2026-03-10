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
      url="/pb/recourse/elecRecourseApply/recoursesSearchCpes/func_queryRecourseAbledInfo"
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

  export default {
    name: "recoursesSearchCpes",
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
            title: this.$t("m.i.ce.rcvgName"),
            key: "custName",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.ce.rcvgMemberId"),
            key: "memberId",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.ce.rcvgBrchCode"),
            key: "brchCode",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.ce.rcvgAcctNo"),
            key: "acctNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.ce.rcvgAcctName"),
            key: "acctName",
            hiddenCol: false,
            ellipsis: false
          },
          {
           title: this.$t("m.i.ce.rcvgDistType"),
            key: "distType",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.recoursesParam.dictMap,"DistTypeCode",params.row.distType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.ce.rcvgSocCode"),
            key: "socCode",
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
          billNo: "",
          billId: "",
          hldrId: "",
          billRangeStart: "",
          billRangeEnd: "",
          hldrBrchNo: "",
          ownedBrchNo:"",
          isRecourse: "",
          licenseFlag: false,
          dictMap: Map,
          hldrType: "",
          hldrSocCode: "",
        }
      }
    },
    comments: {},
    watch: {
      showRecoursesWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.formItem.billNo = this.recoursesParam.billNo;
            this.formItem.hldrId = this.recoursesParam.hldrId;
            this.formItem.billId = this.recoursesParam.billId;
            this.formItem.billRangeStart = this.recoursesParam.billRangeStart;
            this.formItem.billRangeEnd= this.recoursesParam.billRangeEnd;
            this.formItem.transBrchNo = this.recoursesParam.hldrBrchNo;
            this.formItem.isRecourse = this.recoursesParam.isRecourse;
            this.formItem.ownedBrchNo = this.recoursesParam.ownedBrchNo;
            this.formItem.licenseFlag = this.recoursesParam.licenseFlag;
            debugger
            if (this.recoursesParam.hldrType && this.recoursesParam.hldrType !== ""){
              this.formItem.hldrType = this.recoursesParam.hldrType;
            }else {
              this.formItem.hldrType = "2";
            }
            if (this.recoursesParam.hldrType === "1"){
              this.formItem.transToSocCode = this.recoursesParam.hldrSocCode;
            }
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
        this.formItem = {};
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
