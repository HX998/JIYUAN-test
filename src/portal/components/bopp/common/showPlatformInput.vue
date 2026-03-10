<template>
  <div>
    <common-input v-model="itemValue" :label="label" @on-click="openPlatformWin" :showIcon="true"
                  :readonly="true" :clearVal="clearVal" :clearValTag="clearValTag" :clearable="true" :prop="prop"
                  :required="required" :className="className"></common-input>
    <!--平台信息查询界面-->
    <h-msg-box v-model="platformWin" width="1000" :mask-closable="false" @on-close="handleClose" top="10"
               class="h-form-table-layer" :maximize="true" @on-maximize="onMaximize" :z-index='1010'>
      <p slot="header">
        <span>平台信息查询</span>
      </p>
      <!--查询表单-->
      <div :class="{'h-form-overhd':!ifShowMore}">
        <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
          <common-input v-model="formItem.memberName" :label="$t('s.i.odps.platformName')"
                        prop="memberName"></common-input>
          <query-btn :formSearch="formSearch" :formSearchReset="formSearchReset" :advanceShow='false'></query-btn>
        </h-form>
      </div>
      <!--数据展示表格-->
      <h-datagrid
          :columns="columns"
          highlight-row
          url="/cpes/member/queryMemberList"
          :bindForm="formItem"
          :onCurrentChange="onCurrentChange"
          :onCurrentChangeCancel="onCurrentChangeCancle"
          :onRowDbClick="doubleHandleClick"
          :autoLoad=false
          ref="datagrid">
        <div slot="toolbar" class="pull-left">
        </div>
      </h-datagrid>
      <div slot="footer">
        <h-button type="ghost" @click="handleClose">{{ $t("m.i.common.close") }}</h-button>
        <h-button type="primary" @click="submitForm">{{ $t("m.i.common.commit") }}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
export default {
  name: "showPlatformInput",
  data() {
    return {
      formItem: {
        memberName: "",
        memberTypeCode : ""
      },
      columns: [
        {
          type: "radio",
          title: " ",
          align: "center",
          width: 60,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: this.$t('s.i.odps.platformNo'),
          key: "memberId",
          hiddenCol: false,
          ellipsis: false,
          sortable: true
        },
        {
          title: this.$t('s.i.odps.platformName'),
          key: "memberName",
          hiddenCol: false,
          ellipsis: false,
          sortable: false
        },
        // {
        //   title: this.$t('s.i.odps.platformFullName'),
        //   key: "platformFullName",
        //   hiddenCol: false
        // },
        // {
        //   title: this.$t('s.i.odps.socCode'),
        //   key: "socCode",
        //   hiddenCol: false,
        //   sortable: true
        // }

      ],
      ifShowMore: false,
      platformWin: false,
      currentSelectRow: null,
    }
  },
  props: {
    label: {
      type: String,
      default: "$t('s.i.pay.platformName')"
    },
    prop: {
      type: String,
      default: "platformName"
    },
    required: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: ""
    },
    clearVal: {
      type: Function,
      default() {
        return "";
      }
    },
    clearValTag: {
      type: String,
      default: ""
    },
    value: {
      type: String,
      default: ""
    },
  },
  watch: {
    platformWin(val) {
      if (val === true) {
        this.formItem.memberName= "";
        this.formItem.memberTypeCode= "";
        this.$nextTick(() => {
          this.formSearch();
        });
      }
    }
  },
  computed: {
    itemValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  methods: {
    openPlatformWin() {
      this.platformWin = true;
    },
    onMaximize() {
      setTimeout(() => {
        this.$refs.datagrid.$refs.gridContent.handleResize();
      }, 100);
    },
    formSearch() {
      this.$refs.datagrid.dataChange(1);
    },
    formSearchReset() {
      this.$refs.formItem.resetFields();
    },
    onCurrentChange(currentRow, oldCurrentRow, _index) {
      this.currentSelectRow = currentRow;
    },
    onCurrentChangeCancle(currentRow, oldCurrentRow, _index) {
      this.currentSelectRow = null;
    },
    doubleHandleClick(arr) {
      this.currentSelectRow = arr;
      this.submitForm();
    },
    handleClose() {
      this.platformWin = false;
      this.$emit("closeShowPlatformWin", "");
    },
    //根据弹框所选数据进行赋值
    submitForm() {
      if (this.currentSelectRow) {
        this.platformChange(this.currentSelectRow);
      } else {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
      }
    },
    platformChange(info) {
      //debugger
      if (info === null) {
        this.$msgTip.info(this, {info: "请先选择记录！"});
        return;
      }
      this.itemValue = info.memberName;
      this.$emit("platformChange", info);
      this.platformWin = false;
    }
  }
}
</script>

<style scoped>

</style>
