<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.custNo')" prop="custNo">
                  <h-input v-model="formItem.custNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.custName')" prop="custName">
                  <h-input v-model="formItem.custName" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.bm.custAcctNo')" prop="custAcctNo">
                  <h-input v-model="formItem.custAcctNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.bm.signStatus')" prop="signStatus">
                  <h-select v-model="formItem.signStatus" placeholder="" @on-change="changeStatus()" :clearable="false" showTitle>
                    <h-option value="2">未签约</h-option>
                    <h-option value="1">已签约</h-option>
                    <h-option value="0">已解约</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid :columns="columns"
                      highlight-row
                      getDataFunc
                      @get-data="getElecSignBusiList"
                      :bindForm="formItem"
                      :gridData="elecSignBusiData"
                      :onCurrentChange="onCurrentChange"
                      :onCurrentChangeCancel="onCurrentChangeCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="signOn" v-if="this.btnAuth.signOnMultipleButton === undefined ? true : !this.btnAuth.signOnMultipleButton.isShow" :disabled="signOnDisabled">{{$t('m.i.bm.signOn')}}</h-button>
              <h-button type="primary" @click="signOnMultiple" v-if="this.btnAuth.signOnMultipleButton === undefined ? false : this.btnAuth.signOnMultipleButton.isShow" :disabled="signOnMultipleDisabled">{{$t('m.i.bm.signOn')}}</h-button>
              <h-button type="primary" @click="signOut" :disabled="signOutDisabled">{{$t('m.i.bm.signOut')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="selectSignWin" width="400" class="h-form-search-layer" :maximize="false" :mask-closable="false" @on-close="selectSignWinClose">
      <p slot="header">
        <span>选择签约业务</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="120" ref="addForm" cols="1" class="h-form-search">
          <h-form-item :label="'签约业务类型'" prop="signBusiTypes" :required="isMustSelect">
            <h-select v-model="addForm.signBusiTypes" :maxlength=60 multiple placeholder="">
              <h-option v-for="item in signBusiTypeList" :value="item.key" :key="item.value">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="selectSignWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="submitForm()">{{$t("m.i.common.confirm")}}</h-button>
      </div>
    </h-msg-box>

  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "elecSignBusi",
    data() {
      let formItem = {
        custNo: "",
        custName: "",
        custAcctNo: "",
        signStatus: "2"
      };
      let firstColumns = [
        {
          title: " ",
          type: "radio",
          align: "center",
          width: 50
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
          title: this.$t('m.i.common.custNo'),
          key: "custNo",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.custName'),
          key: "custName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.bm.custAcctNo'),
          key: "custAcctNo",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.openBankNo'),
          key: "openBankNo",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.custAcctType'),
          key: "custAcctType",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "custAcctType", params.row.custAcctType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t('m.i.common.custAcctKind'),
          key: "custAcctKind",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "custAcctKind", params.row.custAcctKind);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t('m.i.bm.accountActiveFlag'),
          key: "activeFlag",
          hiddenCol: false,
          render: (h, params) => {
            let flag = "";
            if (params.row.activeFlag === "0") {
              flag = "未生效";
            } else if (params.row.activeFlag === "1") {
              flag = "生效";
            }
            return h("span", flag);
          }
        }
      ];
      let nextColumns = [
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
          title: this.$t('m.i.common.custNo'),
          key: "custNo",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.custName'),
          key: "custName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.bm.custAcctNo'),
          key: "custAcctNo",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.openBankNo'),
          key: "openBankNo",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.bm.signStatus'),
          key: "signStatus",
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.signStatus === "" || params.row.signStatus == null) {
              return "";
            }
            switch (params.row.signStatus) {
              case "1":
                return h("span", "已签约");
              case "0":
                return h("span", "已解约");
            }
          }
        },
        {
          title: this.$t('m.i.bm.eSignStartDt'),
          key: "eSignStartDt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.eSignStartDt === "" || params.row.eSignStartDt == null || params.row.eSignStartDt === 0) {
              return h("span", "---");
            } else {
              let date = this.$moment(params.row.eSignStartDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          }
        },
        {
          title: this.$t('m.i.bm.eSignCancelDt'),
          key: "eSignCancelDt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.eSignCancelDt === "" || params.row.eSignCancelDt == null || params.row.eSignCancelDt === 0) {
              return h("span", "---");
            } else {
              let date = this.$moment(params.row.eSignCancelDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          }
        },
        {
          title: this.$t('m.i.common.operBrchNo'),
          key: "operBrchNo",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.operBrchName'),
          key: "operBrchName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.operTellerNo'),
          key: "operTellerNo",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.operTellerName'),
          key: "operTellerName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.bm.eSignEcdsBankNo'),
          key: "ecdsSignBankNo",
          sortable: true,
          hiddenCol: false
        }
      ];
      let addForm = {
        custAcctNo: "",
        signBusiTypes: []
      };
      return {
        formItem: formItem,
        firstColumns: firstColumns,
        nextColumns: nextColumns,
        elecSignBusiData: { rows: [], total: 1 },
        selectData: null,
        ifShowMore: false,
        signOnDisabled: false,
        signOnMultipleDisabled: false,
        signOutDisabled: true,
        columns: [],
        dictMap: new Map(),
        signBusiTypeList: [],
        btnAuth: {},
        selectSignWin: false,
        isMustSelect: true,
        addForm: addForm
      };
    },
    mounted() {
      this.getDictListByGroups("signBusiType,custAcctType,custAcctKind,bailType,depositStyle").then(res => {
        this.signBusiTypeList = res.get("signBusiType");
        this.dictMap = res.get("map");
      });

      //按钮权限查询 控制按钮显隐
      let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;//2111101
      post({ authId: id }, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          let retMsg = res.data.retMsg;
          if (retCode === "000000") {
            this.btnAuth = JSON.parse(res.data.retData);
          } else {
            this.$msgTip.error(this, { info: retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    methods: {
      onCurrentChange(currentRow, oldCurrentRow, _index) {
        this.selectData = currentRow;
      },
      onCurrentChangeCancel(currentRow, oldCurrentRow, _index) {
        this.selectData = null;
      },
      //修改签约状态时刷新
      changeStatus() {
        this.handleSearch();
        this.signOnDisabled = false;
        this.signOnMultipleDisabled = false;
        this.signOutDisabled = true;
        this.isMustSelect = true;
        if (this.formItem.signStatus === "1") {
          this.signOnDisabled = true;
          this.signOnMultipleDisabled = false;
          this.signOutDisabled = false;
          this.isMustSelect = false;
        } else if (this.formItem.signStatus === "2") {
          this.signOnDisabled = false;
          this.signOnMultipleDisabled = false;
          this.signOutDisabled = true;
          this.isMustSelect = true;
        } else if (this.formItem.signStatus === "0") {
          this.signOnDisabled = true;
          this.signOnMultipleDisabled = true;
          this.signOutDisabled = true;
          this.isMustSelect = false;
        }
      },
      //表单查询
      handleSearch() {
        this.selectData = null;
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      },
      getElecSignBusiList(pageInfo) {
        this.columns = [];
        if (this.formItem.signStatus === "2") {
          let url = "/bm/sign/elecBusi/elecSignBusi/func_pageQueryCustAcctAndSign";
          let custNo = this.formItem.custNo;
          let custName = this.formItem.custName;
          let custAcctNo = this.formItem.custAcctNo;
          this.columns = this.firstColumns;
          post({
            custNo: custNo, custName: custName, custAcctNo: custAcctNo,
            pageNo: pageInfo.pageNo, pageSize: pageInfo.pageSize
          }, url).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.elecSignBusiData = res.data.retData;
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            }
          );
        } else if (this.formItem.signStatus === "1" || this.formItem.signStatus === "0") {
          let url = "/bm/sign/pageQueryCustElecSign";
          let custNo = this.formItem.custNo;
          let custName = this.formItem.custName;
          let custAcctNo = this.formItem.custAcctNo;
          let signStatus = this.formItem.signStatus;
          this.columns = this.nextColumns;
          post({
            custNo: custNo, custName: custName, custAcctNo: custAcctNo, signStatus: signStatus,
            pageNo: this.$refs.datagrid.pageInfo.pageNo, pageSize: this.$refs.datagrid.pageInfo.pageSize
          }, url).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.elecSignBusiData = res.data.retData;
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            }
          );
        }

      },

      //签约
      signOn() {
        if (!this.selectData) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定签约电票业务吗？",
          onOk: () => {
            this.handleSignOn();
          }
        });
      },
      //签约确定
      handleSignOn() {
        let url = "/bm/sign/elecBusi/elecSignBusi/func_saveCustElecSign";
        post({ custAcctNos: this.selectData.custAcctNo }, url).then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.selectData = null;
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      signOnMultiple() {
        //开启选择签约
        if (!this.selectData) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if(this.selectData.length >= 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        if(this.formItem.signStatus === "1"){
          //根据客户账号获得已签约的业务类型集合
          post({ custAcctNo: this.selectData.custAcctNo }, "/bm/sign/elecBusi/elecSignBusi/func_querySignedBusiType").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.addForm.signBusiTypes = res.data.retData;
              } else {
                this.selectSignWinClose();
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        }
        this.selectSignWin = true;
      },
      //选择签约弹出框关闭
      selectSignWinClose() {
        this.selectSignWin = false;
        this.$refs.addForm.resetFields();
      },
      //提交表单
      submitForm() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            if (this.formItem.signStatus === "1" && this.addForm.signBusiTypes.length === 0) {
              this.signOut();
              return;
            }
            this.addForm.custAcctNo = this.selectData.custAcctNo;
            let url = "/bm/sign/elecBusi/elecSignBusi/func_changeCustElecSign";
            post(this.addForm, url).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.selectSignWinClose();
                  this.selectData = null;
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },

      //解约
      signOut() {
        if (!this.selectData) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定解约电票业务吗？",
          onOk: () => {
            this.handleSignOut();
          }
        });
      },
      //解约确定
      handleSignOut() {
        let url = "/bm/sign/elecBusi/elecSignBusi/func_updateCustElecSignStatus";
        post({ ids: this.selectData.id, opeType: "1" }, url).then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.selectSignWinClose();
              this.selectData = null;
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      }

    }
  };


</script>

<style scoped>

</style>
