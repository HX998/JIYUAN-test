<template>
  <!--大额行号弹出框-->
  <h-msg-box v-model="tempBankWin" width="800" @on-close="handleClose" :maximize="true" :z-index="zIndex">
    <p slot="header">
      <span>{{$t('m.i.branch.searchBank')}}</span>
    </p>
    <!--查询表单-->
    <div>
      <h-form :label-width="90" :model="formItem" cols="3" ref="formItem" class="h-form-search">
        <h-form-item :label="$t('m.i.branch.bankName')" prop="bankName" >
          <h-input v-model="formItem.actorBrchName" placeholder="" :maxlength="60"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.branch.bankNo')" prop="bankNo" :validRules="bankNoRule" >
          <h-input type="int" v-model="formItem.actorBrchBankNo" placeholder="" :maxlength="12"></h-input>
        </h-form-item>
        <h-form-item class="h-form-operate one-form">
          <h-button type="primary" @click="formSearch()">{{ $t("m.i.common.search") }}</h-button>
          <h-button type="ghost" @click="formSearchReset()">{{ $t("m.i.common.reset") }}</h-button>
        </h-form-item>
      </h-form>
    </div>
    <!--数据展示表格-->
    <h-datagrid :columns="columns"
                highlightRow
                url="/shcpe/cpes/hvpsbank/hvpsBank/func_queryHvpsBank"
                :bindForm="formItem"
                :onCurrentChange="handleCurrentChange"
                :onCurrentChangeCancel="handleCurrentChangeCancel"
                :onRowDbClick="doubleHandleClick"
                ref="datagrid">
    </h-datagrid>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{ $t("m.i.common.close") }}</h-button>
      <h-button type="primary" @click="submitForm">{{ $t("m.i.common.commit") }}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  import {post, on, off} from "@/api/bizApi/commonUtil";

  export default {
    name: "bankSearch",
    data() {
      return {
        bankNoRule: [{ test: /^[0-9]{12}$/, trigger: "blur", message: this.$t('m.i.ruleTip.formItemRule2') }],
        formItem: {
          actorBrchBankNo: "",
          actorBrchName: "",
        },
        pageInfo: {
          pageNo: 1,
          pageSize: 10
        },
        columns: [
          {
            type: "radio",
            title: " ",
            width: 60,
            hiddenCol: false
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.branch.bankName'),
            key: "actorBrchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.branch.bankNo'),
            key: "actorBrchBankNo",
            hiddenCol: false
          },
        ],
        currentSelectRow: null,
      };
    },
    props: {
      bankNo: "",
      bankName: "",
      bankWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      zIndex: {
        type: Number
      }
    },
    watch: {
      tempBankWin(val) {
        if (val == true) {
          this.$nextTick(() => {
            this.$refs.formItem.resetFields();
            this.currentSelectRow = null;
            this.$refs.datagrid.dataChange(1);
          });
        }
      }
    },

    computed: {
      tempBankWin: {
        get() {
          return this.bankWin;
        },
        set() {
        }
      }
    },
    methods: {
      doubleHandleClick(arr) {
        this.currentSelectRow = arr;
        this.$refs.formItem.resetFields();
        this.formItem.actorBrchBankNo = '';
        this.formItem.actorBrchName = '';
        this.$emit("bankWinSubmit", this.currentSelectRow);
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      //查询
      formSearch() {
        this.$refs.datagrid.dataChange(1);
        this.currentSelectRow = null;
      },
      //重置
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.actorBrchBankNo = '';
        this.formItem.actorBrchName = '';

      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = null;
      },
      //确定
      submitForm() {
        if (this.currentSelectRow === null || this.currentSelectRow === "" || this.currentSelectRow === undefined) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
          return;
        }
        this.$refs.formItem.resetFields();
        this.formItem.actorBrchBankNo = '';
        this.formItem.actorBrchName = '';
        this.$emit("bankWinSubmit", this.currentSelectRow);
      },
      //关闭
      handleClose() {
        this.$refs.formItem.resetFields();
        this.formItem.actorBrchBankNo = '';
        this.formItem.actorBrchName = '';
        this.$emit("bankWinClose", "");

      },
    },
    mounted() {
    }
  };
</script>

<style scoped>

</style>
