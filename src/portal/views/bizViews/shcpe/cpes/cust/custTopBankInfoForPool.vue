<!--总行信息管理-->
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
                <h-form-item :label="$t('m.i.common.memberId')" prop="memberId" :validRules="memberIdRule">
                  <h-input v-model="formItem.memberId" :maxlength="6"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.memberBankNo')" prop="memberBankNo"
                             :validRules="memberBankNoRule">
                  <h-input v-model="formItem.memberBankNo" :maxlength="12"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.bankLevel')" prop="poolBankLevel">
                  <h-select v-model="formItem.poolBankLevel" placeholder="">
                    <h-option v-for="item in poolBankLevelList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.memberBankName')" prop="memberBankName">
                  <h-input v-model="formItem.memberBankName"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.bankType')" prop="poolBankType">
                  <h-select v-model="formItem.poolBankType" placeholder="">
                    <h-option v-for="item in poolBankTypeList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch('1')">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            :row-select="true"
            :hasSelect="false"
            url="/shcpe/cust/bankinfo/queryCustTopBankInfo"
            :bindForm="formItem"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleEditForm()">{{$t("m.i.common.modify")}}</h-button>
              <h-button type="primary" @click="handlepoolBankLevelForm()">{{$t("m.i.shcpe.mainTainBankLevel")}}</h-button>
              <h-button type="primary" @click="handlepoolBankTypeForm()">{{$t("m.i.shcpe.mainTainBankType")}}</h-button>
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen()" >{{$t('m.i.common.listExport')}}</h-button>
              <h-button type="primary" @on-click="batchImport" >{{$t('m.i.common.import')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--点击修改弹出窗-->
    <h-msg-box v-model="editWin" width="800" :mask-closable="false" @on-close="editWinClose"
               :maximize="true">
      <p slot="header">
        <span>修改总行信息</span>
      </p>
      <h-form :model="editForm" :label-width="130" ref="editForm" cols="2" class="h-form-search">
        <div class="h-search-form-row">
          <h-form-item :label="$t('m.i.common.memberId')" prop="memberId" :required="isRequired">
            <h-input :value="editForm.memberId" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.memberBankNo')" prop="memberBankNo"
                       :validRules="memberBankNoRule">
            <h-input v-model="editForm.memberBankNo"></h-input>
          </h-form-item>
        </div>
        <div class="h-search-form-row">
          <h-form-item :label="$t('m.i.common.memberBankName')" prop="memberBankName">
            <h-input v-model="editForm.memberBankName" :maxlength="60"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.bankLevel')" prop="poolBankLevel" :required="isRequired">
            <h-select v-model="editForm.poolBankLevel" placeholder="">
              <h-option v-for="item in poolBankLevelList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
        </div>
        <div class="h-search-form-row">
          <h-form-item :label="$t('m.i.shcpe.creditAgreementNo')" prop="creditAgreementNo"
                       :validRules="creditAgreementNoRule">
            <h-input v-model="editForm.creditAgreementNo"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.socCode')" prop="socCode" :required="isRequired"
                       :validRules="socCodeRule">
            <h-input v-model="editForm.socCode"></h-input>
          </h-form-item>
        </div>
      </h-form>
      <div slot="footer">
        <h-button type="ghost" @click="editWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm">{{$t("m.i.common.commit")}}</h-button>

      </div>
    </h-msg-box>
    <!--批量维护银行级别弹出窗-->
    <h-msg-box v-model="poolBankLevelWin" width="400" :mask-closable="false" @on-close="poolBankLevelWinClose"
               :maximize="true">
      <p slot="header">
        <span>批量维护银行级别</span>
      </p>
      <h-form :model="editForm" :label-width="80" ref="poolBankLevelForm" cols="1" class="h-form-search">
        <div class="h-search-form-row">
          <h-form-item :label="$t('m.i.common.bankLevel')" prop="poolBankLevel" :required="isRequired">
            <h-select v-model="editForm.poolBankLevel" placeholder="">
              <h-option v-for="item in poolBankLevelList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
        </div>
      </h-form>
      <div slot="footer">
        <h-button type="ghost" @click="poolBankLevelWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitpoolBankLevelFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="poolBankLevelSubmitForm">{{$t("m.i.common.commit")}}</h-button>

      </div>
    </h-msg-box>
    <!--批量维护银行类型弹出窗-->
    <h-msg-box v-model="poolBankTypeWin" width="400" :mask-closable="false" @on-close="poolBankTypeWinClose"
               :maximize="true">
      <p slot="header">
        <span>批量维护银行类型</span>
      </p>
      <h-form :model="editForm" :label-width="80" ref="poolBankTypeForm" cols="1" class="h-form-search">
        <div class="h-search-form-row">
          <h-form-item :label="$t('m.i.common.bankType')" prop="poolBankType" :required="isRequired">
            <h-select v-model="editForm.poolBankType" placeholder="">
              <h-option v-for="item in poolBankTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
        </div>
      </h-form>
      <div slot="footer">
        <h-button type="ghost" @click="poolBankTypeWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitpoolBankTypeFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="poolBankTypeSubmitForm">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>

    <!-- 批量导入 -->
    <common-file-upload-no-show :import-win="this.importWin" :fileParams="fileParams" @importWinClose="importWinClose"
                                @importSuccess="importSuccess"></common-file-upload-no-show>
  </div>
</template>
<script>
  import { post, on, off,exportList } from "@/api/bizApi/commonUtil";

  export default {
    name: "custTopBankInfo",
    data() {
      return {
        formItem: {
          memberId: "",
          memberBankNo: "",
          poolBankLevel: "",
          isForPool: "1",
        },
        editForm: {
          id: "",
          legalNo: "",
          memberId: "",
          memberBankNo: "",
          memberBankName: "",
          brchType: "",
          transBrchClass: "",
          brchScope: "",
          applTellerNo: "",
          applDt: "",
          checkTellerNo: "",
          checkDt: "",
          status: "",
          poolBankLevel: "",
          creditAgreementNo: "",
          poolBankLevelName: "",
          socCode: "",
          createTime: "",
          updateTime: "",
          memberIdStr: ""
        },

        pageInfo: {
          pageNo: 1,
          pageSize: 10
        },
        memberIdRule: [{ test: /^[0-9a-zA-Z]{6}$/, trigger: "blur", message: "会员代码为6位" }],
        memberBankNoRule: [{ test: /^[0-9]{12}$/, trigger: "blur", message: "大额行号由12位数字组成" }],
        socCodeRule: [{ test: /^[A-Z0-9]{18}$/, trigger: "blur", message: "统一社会信用代码由18位数字或大写字母组成" }],
        creditAgreementNoRule: [{ test: /^[A-Za-z0-9]{0,32}$/, trigger: "blur", message: "额度协议编号不能超过32位，由数字和字母组成" }],
        spanLeft: 4,
        spanRight: 20,
        tableRef: "selfTable",
        columns: [
          {
            type: "selection",
            width: 60,
            hiddenCol: false,
            align: "center"
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
            title: this.$t("m.i.common.memberBankNo"),
            key: "memberBankNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.memberBankName"),
            key: "memberBankName",
            sortable: true,
            hiddenCol: false

          },
          {
            title: this.$t("m.i.common.bankLevel"),
            key: "poolBankLevel",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "bankLevel", params.row.poolBankLevel);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.common.bankType"),
            key: "poolBankType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "bankType", params.row.poolBankType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.shcpe.creditAgreementNo"),
            key: "creditAgreementNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.socCode"),
            key: "socCode",
            hiddenCol: false
          }
          //,
          // {
          //   title: this.$t("m.i.common.applTellerNo"),
          //   key: "applTellerNo",
          //   hiddenCol: false
          // },
          // {
          //   title: this.$t("m.i.common.applDt"),
          //   key: "applDt",
          //   sortable: true,
          //   hiddenCol: false,
          //   render: (h, params) => {
          //     let date = params.row.applDt == null ? "" : this.$moment(params.row.applDt, "YYYY-MM-DD").format("YYYY-MM-DD");
          //     return h("span", date);
          //   }
          // },
          // {
          //   title: this.$t("m.i.common.checkTellerNo"),
          //   key: "checkTellerNo",
          //   hiddenCol: false
          // },
          // {
          //   title: this.$t("m.i.common.checkDt"),
          //   key: "checkDt",
          //   hiddenCol: false,
          //   sortable: true,
          //   render: (h, params) => {
          //     let date = params.row.checkDt == null ? "" : this.$moment(params.row.checkDt, "YYYY-MM-DD").format("YYYY-MM-DD");
          //     return h("span", date);
          //   }
          // }
        ],
        dictMap: new Map(),
        currentSelectRow: [],
        currentSelectList: [],
        currentSelectRowInx: [],
        type: null,
        readonly: false,
        isRequired: true,
        editWin: false,
        poolBankLevelWin: false,
        poolBankTypeWin: false,
        poolBankLevel: "",
        poolBankType: "",
        ifShowMore: false,
        submitFlag: false,
        submitpoolBankLevelFlag: false,
        submitpoolBankTypeFlag: false,
        poolBankLevelList: [],
        poolBankTypeList: [],
        id: null,
        param: null,
        rows: null,
        tempShowExcelTemplateWin: false,
        importWin: false,
        fileParams: {
          fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/shcpe/cust/bankinfo/func_batchPoolAdd",  //excel数据导入接口
          uploadParams: {isForPool:"1"}       //调用excel数据解析接口时附带的额外参数
        },
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
      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
        if (arr.length == 0) {
          return;
        }
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      //修改
      handleEditForm() {
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (this.$refs.datagrid.selects.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        this.editForm.id = this.$refs.datagrid.selects[0].id;
        this.editForm.memberId = this.$refs.datagrid.selects[0].memberId;
        this.editForm.memberBankNo = this.$refs.datagrid.selects[0].memberBankNo;
        this.editForm.memberBankName = this.$refs.datagrid.selects[0].memberBankName;
        this.editForm.poolBankLevel = this.$refs.datagrid.selects[0].poolBankLevel;
        this.editForm.poolBankLevelName = this.$refs.datagrid.selects[0].poolBankLevelName;
        this.editForm.creditAgreementNo = this.$refs.datagrid.selects[0].creditAgreementNo;
        this.editForm.socCode = this.$refs.datagrid.selects[0].socCode;
        this.editForm.applTellerNo = this.$refs.datagrid.selects[0].applTellerNo;
        this.editForm.applDt = this.$refs.datagrid.selects[0].applDt;
        this.editForm.checkTellerNo = this.$refs.datagrid.selects[0].checkTellerNo;
        this.editForm.checkDt = this.$refs.datagrid.selects[0].checkDt;
        this.editWin = true;
      },
      handlepoolBankLevelForm() {
        let list = this.$refs.datagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        let memberIdStr = "";
        for (let i = 0; i < list.length; i++) {
          let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
          let userType = userInfo.userType;
          memberIdStr += list[i].memberId;
          if (i < list.length - 1) {
            memberIdStr += ",";
          }
        }
        if (list.length === 1) {
            this.editForm.bankLevel = this.$refs.datagrid.selects[0].bankLevel;
        }else {
          this.editForm.bankLevel = "";
        }
        this.editForm.memberIdStr = memberIdStr;
        this.poolBankLevelWin = true;
      },
      handlepoolBankTypeForm() {
        let list = this.$refs.datagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        let memberIdStr = "";
        for (let i = 0; i < list.length; i++) {
          let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
          let userType = userInfo.userType;
          memberIdStr += list[i].memberId;
          if (i < list.length - 1) {
            memberIdStr += ",";
          }
        }
        if (list.length === 1) {
            this.editForm.bankType = this.$refs.datagrid.selects[0].bankType
        }else {
          this.editForm.bankType = "";
        }
        this.editForm.memberIdStr = memberIdStr;
        this.poolBankTypeWin = true;
      },
      submitForm() {
        this.$refs["editForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = "/shcpe/cust/bankinfo/custTopBankInfo/func_updateCustTopBankInfo";
            let msg = this.$t("m.i.common.modifySuccess");
            post(this.editForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this, { info: msg });
                  this.editWin = false;
                  this.$refs.datagrid.dataChange(1);
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
                } else {
                  let msg = this.$t("m.i.common.modifyFailed");
                  this.$msgTip.error(this, { info: msg + ":" + res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      poolBankLevelSubmitForm() {
        this.$refs["poolBankLevelForm"].validate(valid => {
          if (valid) {
            this.submitpoolBankLevelFlag = true;
            let url = "/shcpe/cust/bankinfo/func_updatePoolBankLevelBatch";
            let msg = this.$t("m.i.common.modifySuccess");
            post(this.editForm, url).then(res => {
              this.submitpoolBankLevelFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this, { info: msg });
                  this.poolBankLevelWin = false;
                  this.$refs.datagrid.dataChange(1);
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
                  this.$refs.poolBankLevelForm.resetFields();
                } else {
                  let msg = this.$t("m.i.common.modifyFailed");
                  this.$msgTip.error(this, { info: msg + ":" + res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      poolBankTypeSubmitForm() {
        this.$refs["poolBankTypeForm"].validate(valid => {
          if (valid) {
            this.submitpoolBankTypeFlag = true;
            let url = "/shcpe/cust/bankinfo/func_updatePoolBankTypeBatch";
            let msg = this.$t("m.i.common.modifySuccess");
            post(this.editForm, url).then(res => {
              this.submitpoolBankTypeFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this, { info: msg });
                  this.poolBankTypeWin = false;
                  this.$refs.datagrid.dataChange(1);
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
                  this.$refs.poolBankTypeForm.resetFields();
                } else {
                  let msg = this.$t("m.i.common.modifyFailed");
                  this.$msgTip.error(this, { info: msg + ":" + res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //清单导出
      tempShowExcelTemplateWinOpen() {
        this.param = "custTopBankInfoForPoolListExport";
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        }else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //清单导出
      exportList(field, exportType) {
        let exportUrl = window.LOCAL_CONFIG.API_HOME + "/shcpe/cust/bankinfo/func_exportCustTopBankInfo";
        let options = {};
        if (this.$refs.datagrid.selectIds.length !== 0) {
          options.params = {
            ids: this.$refs.datagrid.selectIds,
            isForPool : "1"
          };
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, exportUrl, options);
      },
      //批量导入
      batchImport() {
        this.importWin = true;
      },
      importWinClose() {
        this.importWin = false;
      },
      importSuccess() {
        this.importWin = false;
        this.$refs.datagrid.dataChange(1);
      },
      editWinClose() {
        this.editWin = false;
        this.$refs.editForm.resetFields();
      },
      poolBankLevelWinClose() {
        this.poolBankLevelWin = false;
        this.$refs.poolBankLevelForm.resetFields();
      },
      poolBankTypeWinClose() {
        this.poolBankTypeWin = false;
        this.$refs.poolBankTypeForm.resetFields();
      }
    },
    mounted() {
      this.getDictListByGroups("bankLevel,bankType").then(res => {
        this.poolBankLevelList = res.get("bankLevel");
        this.poolBankTypeList = res.get("bankType");
        this.dictMap = res.get("map");
      });
    }
  };
</script>
