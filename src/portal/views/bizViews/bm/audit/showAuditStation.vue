<!--机构查询-->
<template>
  <h-msg-box v-model="tempShowAuditStationWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
             width="1000" class="h-form-table-layer" :z-index=1200>
    <p slot="header">
      <span>{{ title }}</span>
    </p>
    <!--弹出框内容-->
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="showColumns"
            highlight-row
            getDataFunc
            :bindForm="auditParams"
            :gridData="AuditUserData"
            :row-select="true"
            :has-select="true"
            url="/bm/audit/showAuditUser/func_queryAuditUserByAuditStation"
            :on-select-change="selectChange"
            :onRowDbClick="doubleHandleClick"
            :autoLoad="false"
            ref="datagrid">
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{ $t("m.i.common.close") }}</h-button>
      <h-button type="primary" @click="submitForm">{{ $t("m.i.common.commit") }}</h-button>
    </div>
  </h-msg-box>
</template>
<script>
import {post} from "@/api/bizApi/commonUtil";
import checkAllBtn from "../../../../components/bemp/button/checkAllBtn";

export default {
  name: "showAuditStation",
  data() {
    let isCheckHidden = true;
    if (this.selectType === "apply") {
      isCheckHidden = false;
    }
    let columns = [
      {
        type: "selection",
        key: "multiSelect",
        width: 60,
        hiddenCol: false
      },
      {
        title: this.$t("m.i.common.index"),
        type: "index",
        key: "xuhao",
        width: 60,
        align: "center",
        hiddenCol: false
      },
      {
        key: "id",
        hiddenCol: true
      },
      {
        title: this.$t('m.i.common.userNo'),
        key: "userNo",
        hiddenCol: false
      },
      {
        title: this.$t('m.i.common.userName'),
        key: "userName",
        hiddenCol: false
      },
      {
        title: this.$t('m.i.bm.auditStationName'),
        key: "auditStationName",
        hiddenCol: false
      },
      {
        title: this.$t('m.i.common.brchName'),
        key: "brchName",
        hiddenCol: false
      }
    ];
    return {
      chooseAll: true,
      expandDisabled: false,
      showLoading: true,
      hasSelect: true,
      checkAll1: true,
      selectData: [],
      showColumns: columns,
      AuditUserData: {rows: [], total: 1},
      submitWin: false,
      submitMsg: "",
      submitTitle: "",
      selectIds: [], // 分页多选数据记录id
      oldSelects: {}, //用于存储分页全选的数据对象
      retMsg: "",
      ifShowMore: false
    };
  },
  props: {
    title: String,
    showAuditStationWin: {
      type: Boolean,
      default() {
        return false;
      }
    },
    auditParams: {
      auditStationId: ""
    },
    paramId: {
      type: String,
      default: "id"
    },
    selectType: String
  },
  watch: {
    showAuditStationWin(val) {
      if (val == true) {
        this.$nextTick(() => {
          this.$refs.datagrid.dataChange(1);
        });
      }
    }
  },
  computed: {
    tempShowAuditStationWin: {
      get() {
        return this.showAuditStationWin;
      },
      set() {
      }
    }
  },
  methods: {
    doubleHandleClick(arr) {
      this.selectData = arr;
      this.submitForm();
    },
    selectChange() {
      this.chooseAll = false;
    },
    getAuditStationList() {
      if (!this.showAuditStationWin) {
        return;
      }
      post({
        pageNo: this.$refs.datagrid.pageInfo.pageNo, pageSize: this.$refs.datagrid.pageInfo.pageSize,
        auditStationId: this.auditParams.auditStationId
      }, "/bm/audit/showAuditUser/func_queryAuditUserByAuditStation").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.AuditUserData = res.data.retData;
              this.$refs.datagrid.selects = res.data.retData.list;
            } else {
              // 查询失败
              // this.submitMsg = "查询失败";
              this.$msgTip.error(this, {info: res.data.retMsg, zIndex: 1300});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError"), zIndex: 1300});
          }
        }
      );
    },
    submitForm() {
      if (!this.selectData) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData"), zIndex: 1300});
        return;
      }
      let object = {};
      let userIds = "";
      let userName = "";
      let length = this.$refs.datagrid.selects.length;
      for (let i = 0; i < length; i++) {
        userIds += this.$refs.datagrid.selects[i].id
        userName += this.$refs.datagrid.selects[i].userName
        if (i < length - 1) {
          userIds += ",";
          userName += ",";
        }
      }
      object = {"userIds": userIds, "userName": userName};
      // 选择客户
      this.$emit("auditSelect", object);
      this.selectData = [];
      this.selectIds = [];
      this.$refs.datagrid.selects = [];
    },
    handleClose() {
      this.$emit("showAuditStationWinClose", "");
    },
  }
};
</script>
<style>

</style>
