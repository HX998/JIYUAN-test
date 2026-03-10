<!--会员弹出框-->
<template>
  <h-msg-box v-model="tempMemberWin" width="1000" @on-close="handleClose" class="h-form-table-layer" :maximize="true"
             :mask-closable="false" :z-index=1200>
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <!--查询表单-->
    <div>
      <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
        <h-form-item :label="$t('m.i.common.memberId')" prop="memberId">
          <h-input v-model="formItem.memberId" :maxlength="6"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.common.memberName')" prop="memberName">
          <h-input v-model="formItem.memberName" :maxlength="60"></h-input>
        </h-form-item>
        <h-form-item label="会员大额行号" prop="memberBankNo" v-if="isShowBankNo">
          <h-input v-model="formItem.memberBankNo" :maxlength="60"></h-input>
        </h-form-item>
        <h-form-item class="h-form-operate" :class="isShowBankNo ? '' : 'two-form'">
          <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
          <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
        </h-form-item>
      </h-form>
    </div>
    <h-datagrid
      :columns="columns"
      highlightRow
      :autoLoad="false"
      url="/cpes/member/queryMemberList"
      :bindForm="formItem"
      :onRowClick="handleRowClick"
      :onRowDbClick="doubleHandleClick"
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
    name: "showMember",
    data() {
      return {
        formItem: {
          memberId: "",
          memberName: "",
          memberBankNo: "",
          memberTypeCode : "",
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
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.memberId"),
            key: "memberId",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.memberName"),
            key: "memberName",
            hiddenCol: false,

            sortable: true
          },
          {
            title: this.$t("m.i.common.memberBankNo"),
            key: "memberBankNo",
            hiddenCol: false
          }
        ],
        currentSelectRow: null,
        dictMap: new Map()
      };
    },
    props: {
      title: {
        type: String,
        default: "查看会员"
      },
      showMemberWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      isShowBankNo: {
        type: Boolean,
        default() {
          return false;
        }
      },
      memberTypeCode : "",
    },
    watch: {
      tempMemberWin(val) {
        if (val == true) {
          this.$nextTick(() => {
            this.currentSelectRow = [];
            this.$refs.formItem.resetFields();
            this.formItem.memberTypeCode = this.memberTypeCode;
            this.$refs.datagrid.dataChange(1);
          });
        }
      }
    },
    computed: {
      tempMemberWin: {
        get() {
          return this.showMemberWin;
        },
        set() {
        }
      }
    },
    methods: {
      doubleHandleClick(arr) {
        this.currentSelectRow = arr;
        this.$emit("memberSelect", this.currentSelectRow);
      },
      //查询
      formSearch() {
        this.currentSelectRow = null;
        this.$refs.datagrid.dataChange(1);
      },
      //重置
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      //行选中
      handleRowClick(arr) {
        this.currentSelectRow = arr[0];
      },
      //确定
      submitForm() {
        if (this.currentSelectRow === null || this.currentSelectRow === "" || this.currentSelectRow === undefined) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.$emit("memberSelect", this.currentSelectRow);
      },
      //关闭
      handleClose() {
        this.$emit("memberWinClose", "");
      },
    },
    mounted() {
      this.getDictListByGroups("ClearMode").then(res => {
        this.dictMap = res.get("map");
      });
    },
  };
</script>

<style scoped>

</style>
