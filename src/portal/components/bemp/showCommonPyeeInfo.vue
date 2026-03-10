<template>
  <div>
    <h-msg-box v-model="tempShowCommonPyeeInfoWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="800" class="h-form-table-layer" :z-index=1202 @on-maximize="onMaximize">
      <p slot="header">
        <span>{{title}}</span>
      </p>
      <h-datagrid
        :columns="columns"
        highlight-row
        :url="url"
        :auto-load="false"
        :bindForm="formItem"
        :onCurrentChange="handleCurrentChange"
        :onCurrentChangeCancel="handleCurrentChangeCancel"
        :onRowDbClick="doubleHandleClick"
        ref="datagrid">
      </h-datagrid>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>
<script>
import { getDictListByGroups,getDictValueFromMap } from "@/api/bizApi/commonUtil";
  export default {
      name: "showCommonPyeeInfo",
    data() {
      return {
        dictMap: new Map(),
        columns: [
          {
            title: " ",
            type: "radio",
            align: "center",
            width: 50
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.common.legalNo"),
            key: "legalNo",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.brchNo"),
            key: "brchNo",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName", hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.pyeeAcctNo"),
            key: "pyeeAcctNo",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.pyeeBankName"),
            key: "pyeeBankName",
          },
          {
            title: "创建柜员号",
            key: "createTellerNo",
          },
          {
            title: this.$t('m.i.common.createDt'),
            key: 'createTime',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.createTime == null || params.row.createTime === "") {
                return "";
              }
              let createTime = params.row.createTime.toString().substring(0,8);
              let date = this.$moment(createTime, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.common.createTime'),
            key: 'createTime',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.createTime == null || params.row.createTime === "") {
                return "";
              }
              let createTime = params.row.createTime.toString().substring(8,14);
              let date = this.$moment(createTime, "HH:mm:ss").format("HH:mm:ss");
              return h("span", date);
            }
          },

        ],
        formItem: {

        }
      };
    },
    props: {
      url: {
        type: String,
        default() {
          return "/bm/cust/commonPyeeInfo/pageQueryCommonPyeeInfoList";
        }
      },
      title: {
        type: String,
        default: "常用收款人信息"
      },
      showCommonPyeeInfoWin: {
        type: Boolean,
        default: false
      },

    },
    watch: {
      showCommonPyeeInfoWin(val) {
        if (val) {
          this.formItem.brchNo = this.brchNo;
          this.currentSelectRow = null;
          this.$nextTick(() => {
            this.$refs.datagrid.dataChange(1);
          });
        }
      }
    },
    computed: {
      tempShowCommonPyeeInfoWin: {
        get() {
          return this.showCommonPyeeInfoWin;
        },
        set() {
        }
      }
    },
    methods: {
      doubleHandleClick(arr) {
        this.currentSelectRow = arr;
        this.$emit("commonPyeeInfoSelect", this.currentSelectRow);
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = null;
      },
      submitForm() {
        if (this.currentSelectRow != null) {
          this.$emit("commonPyeeInfoSelect", this.currentSelectRow);
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      handleClose() {
        this.$emit("showCommonPyeeInfoWinClose", "");
      }
    },
    mounted() {

    }
  };
</script>
<style>

</style>
