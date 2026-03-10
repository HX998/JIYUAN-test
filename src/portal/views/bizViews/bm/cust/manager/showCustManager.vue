<!--机构查询-->
<template>
  <h-msg-box v-model="tempshowCustManagerWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1000" class="h-form-table-layer" :z-index=1200>
      <p slot="header">
        <span>{{title}}</span>
      </p>
      <!--查询表单-->
      <div class="h-form-search-box" :class="{'h-form-overhd':!ifShowMore}">
          <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
            <h-form-item :label="$t('m.i.common.custMgrNo')" prop="custMgrNo">
              <h-input v-model="formItem.custMgrNo" :maxlength=50></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.common.custMgrName')" prop="custMgrName">
              <h-input v-model="formItem.custMgrName" :maxlength=60></h-input>
            </h-form-item>
            <h-form-item class="h-form-operate two-form">
              <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
              <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
            </h-form-item>
          </h-form>
      </div>
      <!--弹出框内容-->
      <h-row name="flex" class="layout-menu-wrapper">
        <h-col span="24">
          <div>
            <!--数据展示表格-->
            <h-datagrid
                :columns="showColumns"
                highlight-row
                getDataFunc
                @get-data="getCustManagerList"
                :gridData="custManagerData"
                :bindForm="formItem"
                :onCurrentChange="onCurrentChange"
                :onCurrentChangeCancel="onCurrentChangeCancle"
                :onRowDbClick="doubleHandleClick"
                :autoLoad="false"
                ref="datagrid">
            </h-datagrid>
          </div>
        </h-col>
      </h-row>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
</template>
<script>
  import { post } from "@/api/bizApi/commonUtil";

  export default {
    name: "showCustManager",
    data() {
      let isCheckHidden = true;
      if (this.selectType === "apply") {
        isCheckHidden = false;
      }
      let columns = [
        {
          title: " ",
          type: "radio",
          key: "danxuan",
          width: 60,
          align: "center",
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
          title: this.$t('m.i.common.custMgrNo'),
          key: "custMgrNo",

          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.custMgrName'),
          key: "custMgrName",

          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.custMgrTeam'),
          key: "custMgrTeam",

          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.custMgrBrchNo'),
          key: "custMgrBrchNo",

          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.custMgrBrchName'),
          key: "custMgrBrchName",

          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.custMgrDeptName'),
          key: "custMgrDeptName",

          hiddenCol: false
        }
      ];
      let formItem = {
        custMgrNo: "",
        custMgrName: ""
      };
      return {
        expandDisabled: false,
        showLoading: true,
        selectData:null,
        showColumns: columns,
        formItem: formItem,
        custManagerData: { rows: [], total: 1 },
        submitWin: false,
        submitMsg: "",
        submitTitle: "",
        retMsg: "",
        ifShowMore: false
      };
    },
    props: {
      title: String,
      showCustManagerWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      selectType: String
    },
    watch: {
      showCustManagerWin(val) {
        if (val == true) {
          this.$nextTick(() => {
            this.formSearchReset();
            this.$refs.datagrid.dataChange(1);
          });
        }
      }
    },
    computed: {
      tempshowCustManagerWin: {
        get() {
          return this.showCustManagerWin;
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
      onCurrentChange(currentRow, oldCurrentRow, _index) {
        this.selectData = currentRow;
      },
      onCurrentChangeCancle(currentRow, oldCurrentRow, _index) {
        this.selectData = null;
      },
      getCustManagerList() {
        if (!this.showCustManagerWin) {
          return;
        }
        post({
          pageNo: this.$refs.datagrid.pageInfo.pageNo, pageSize: this.$refs.datagrid.pageInfo.pageSize,
          custMgrNo: this.formItem.custMgrNo, custMgrName: this.formItem.custMgrName
        }, "/bm/cust/manager/showCustManager/func_pageQueryCustManagerList").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode == "000000") {
                this.custManagerData = res.data.retData;
              } else {
                // 查询失败
                // this.submitMsg = "查询失败";
                this.$msgTip.error(this, { info: res.data.retMsg, zIndex: 1300 });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError"), zIndex: 1300 });
            }
          }
        );
      },
      submitForm() {
        if (!this.selectData) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData"), zIndex: 1300 });
          return;
        }
        this.$emit("custManagerSelectList", this.selectData);
        let obj = {
          "custMgrNo": this.selectData.custMgrNo,
          "custMgrName": this.selectData.custMgrName
        };
        // 选择客户
        this.$emit("custManagerSelect", obj);

      },
      handleClose() {
        this.formSearchReset();
        this.$emit("showCustManagerWinClose", "");
      },
      formSearch() {
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      }
    }
  };
</script>
<style>

</style>
