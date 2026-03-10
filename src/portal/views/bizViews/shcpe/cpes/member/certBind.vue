<!--证书绑定-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <!--右侧数据展示表格-->
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.memberName')" prop="memberName">
                  <h-input v-model="formItem.memberName" :maxlength="60"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.shcpe.memberStatus')" prop="memberStatus">
                  <h-select v-model="formItem.memberStatus" placeholder="" showTitle>
                    <h-option v-for="item in memberStatusList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate two-form">
                  <h-button type="primary" @click="formSearch('1')">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/shcpe/cpes/member/certBind/func_queryCertMemberList"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleCertBind()">{{$t("m.i.shcpe.certiBind")}}</h-button>
              <h-button type="primary" @click="handleRevokeBind()">{{$t("m.i.shcpe.cancelBind")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--点击绑定证书弹出窗-->
    <h-msg-box v-model="editWin" width="500" :mask-closable="false" @on-close="handleWinClose"
                :maximize="true">
      <p slot="header">
        <span>证书绑定DN码</span>
      </p>
      <h-form :model="certBindForm" :label-width="80" ref="certBindForm" cols="1" class="h-form-search">
        <div class="h-search-form-row">
          <h-form-item :label="$t('m.i.shcpe.certDn')" prop="certDn">
            <h-input v-model="certBindForm.certDn"></h-input>
          </h-form-item>
        </div>
      </h-form>
      <div slot="footer">
        <h-button type="ghost" @click="editWin=!editWin">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm">{{$t("m.i.common.commit")}}</h-button>

      </div>
    </h-msg-box>
  </div>
</template>
<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "certBind",
    data() {
      return {
        formItem: {
          memberId: "",
          memberName: "",
          memberTypeCode: "",
          memberStatus: "",
          isPlatform: ""
        },
        certBindForm: {
          id: "",
          certDn: ""
        },

        pageInfo: {
          pageNo: 1,
          pageSize: 10
        },
        spanLeft: 4,
        spanRight: 20,
        tableRef: "selfTable",
        columns: [
          {
            type: "radio",
            width: 50,
            align: "center",
            title: " ",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: "id",
            key: "id",
            hiddenCol: true
          },
          {
            title: this.$t("m.i.common.memberId"),
            key: "memberId",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.memberName"),
            key: "memberName",
            hiddenCol: false,

            sortable: true
          },
          {
            title: this.$t("m.i.shcpe.memberTypeCode"),
            key: "memberTypeCode",
            hiddenCol: false,

            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "MemberType", params.row.memberTypeCode);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.common.memberBankNo"),
            key: "memberBankNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.shcpe.clearMode"),
            key: "clearMode",
            hiddenCol: false,

            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "ClearMode", params.row.clearMode);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.shcpe.isClearCheck"),
            key: "isClearCheck",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isClearCheck);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.shcpe.memberStatus"),
            key: "memberStatus",

            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "UserBrchStatus", params.row.memberStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.shcpe.changeCode"),
            key: "changeCode",

            hiddenCol: false,
            render: (h, params) => {
              return h("div", [
                h("span", this.formatterChangeCode(params.row.changeCode, params.row))
              ]);
            }
          },
          {
            title: this.$t("m.i.shcpe.aplStatus"),
            key: "aplStatus",

            hiddenCol: false,
            render: (h, params) => {
              return h("div", [
                h("span", this.formatterAplStatus(params.row.aplStatus, params.row))
              ]);
            }
          }
        ],
        dictMap: new Map(),
        currentSelectRow: [],
        currentSelectList: [],
        currentSelectRowInx: [],
        memberTypeList: [],
        clearModeList: [],
        memberStatusList: [],
        type: null,
        readonly: false,
        isRequired: true,
        editWin: false,
        ifShowMore: false,
        submitFlag: false,
        id: null
      };
    },
    components: {},
    watch: {},

    computed: {},
    methods: {
      formSearch() {
        this.currentSelectRow = [];
        this.currentSelectList = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      handleCurrentChange(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = [];
      },
      //证书绑定
      handleCertBind() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (this.currentSelectRow.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        this.certBindForm.id = this.currentSelectRow.id;
        this.certBindForm.certDn = this.currentSelectRow.certDn;
        this.certBindForm.certDn = "";
        this.editWin = true;
      },
      //撤销绑定
      handleRevokeBind() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (this.currentSelectRow.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        this.$hMsgBox.confirm({
          title: "撤销绑定",
          content: "确认要撤销吗？",
          onOk: () => {
            let id = this.currentSelectRow.id;
            post({ id: id }, "/shcpe/cpes/member/certBind/func_unCertDn").then(res => {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode == "000000") {
                    this.$msgTip.success(this, { info: "撤销成功" });
                    this.$refs.datagrid.dataChange(1);
                    this.currentSelectRow = [];
                    this.currentSelectList = [];
                  } else {
                    this.$msgTip.error(this, { info: res.data.retMsg });
                  }
                }
              }
            ).catch(error => {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            });
          }
        });
      },
      submitForm() {
        this.$refs["certBindForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = "/shcpe/cpes/member/certBind/func_sendCertMsg";
            let msg = this.$t("m.i.common.modifySuccess");
            let id = this.certBindForm.id;
            let certDn = this.certBindForm.certDn;
            post({ id: id, code: certDn }, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this, { info: msg });
                  this.editWin = false;
                  this.$refs.datagrid.dataChange(1);
                  this.currentSelectRow = [];
                  this.currentSelectList = [];
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      handleWinClose() {
        this.$refs.certBindForm.resetFields();
      },
      formatterChangeCode(value) {
        if (value == null || value == "") {
          return "";
        }
        switch (value) {
          case "CC00":
            return "新增";
          case "CC02":
            return "撤销";
        }
      },
      formatterAplStatus(value) {
        if (value == null || value == "") {
          return "";
        }
        switch (value) {
          case "0":
            return "初始";
          case "1":
            return "申请中";
          case "2":
            return "成功";
          case "3":
            return "失败";
        }
      }
    },
    mounted() {
      this.getDictListByGroups("MemberType,ClearMode,Yon,UserBrchStatus").then(res => {
        this.memberTypeList = res.get("MemberType");
        this.clearModeList = res.get("ClearMode");
        this.yonList = res.get("Yon");
        this.memberStatusList = res.get("UserBrchStatus");
        this.dictMap = res.get("map");
      });
    }
  };
</script>
