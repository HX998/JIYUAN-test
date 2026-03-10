<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.pc.busiType')" prop="busiType">
                  <h-select v-model="formItem.busiType" placeholder="">
                    <h-option v-for="item in busiTypeList" :value="item.key" :key="item.value">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.pc.warteeName')" prop="warteeName">
                  <h-input v-model="formItem.warteeName"></h-input>
                </h-form-item>

                <h-form-item :label="$t('m.i.common.operStatus')" prop="flowStatus">
                  <h-select v-model="formItem.flowStatus" placeholder="">
                    <h-option v-for="item in flowStatusList" :value="item.key" :key="item.value">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>

                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{ $t('m.i.common.searchAdvanced') }}<i
                    class="icon iconfont"
                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{ $t('m.i.common.search') }}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{ $t('m.i.common.reset') }}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="pc/risk/guarntrtrust/guarntrTrustMain/func_queryGuarntrTrustInfo"
            :bindForm="formItem"
            :row-select="false"
            :has-select="false"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="showAdd">{{ $t('m.i.common.add') }}</h-button>
              <h-button type="primary" @click="showModify" :disabled="this.buttonConfig.editDisable">{{ $t('m.i.common.modify') }}</h-button>
              <h-button type="primary" @click="askDelete" :disabled="this.buttonConfig.deleteDisable">{{ $t('m.i.common.delete') }}</h-button>
              <h-button type="primary" @click="askSubmit" :disabled="this.buttonConfig.submitDisable">{{ $t('m.i.common.submit') }}</h-button>
              <h-button type="primary" @click="askCancel" :disabled="this.buttonConfig.cancelDisable">{{ $t('m.i.common.cancel') }}</h-button>
              <batch-import-btn @batchImport="batchImport"></batch-import-btn>
              <h-button type="primary" @click="templateDownload()">{{$t('m.i.common.templateDownload')}}</h-button>
              <h-button type="primary" @click="showHistory">{{ $t('m.i.common.showHist') }}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--查看企业客户-->
    <show-cust-corp :showCustCorpWin="showCustCorpWin" :title="'查询客户信息窗口'" @showCustCorpWinClose="showCustCorpWinClose"
                    @custSelect="custCorpSelect"></show-cust-corp>

    <!-- 票交机构弹出框 -->
    <show-cpes-branch :showCpesBranch="brchCodeWin" @showCpesBranchClose="brchCodeWinClose" :memberId="memberId"
                      @showCpesBranchSubmit="brchCodeChange" :showMemberId="false" :isShowBankNo="true"></show-cpes-branch>

    <h-msg-box v-model="addWin" width="800" :mask-closable="false" @on-close="closeAddWin"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span>新增增信信息</span>
      </p>
      <div>
        <h-form :model="addFormItem" :label-width="115" ref="addFormItem" cols="2" class="h-form-search">

          <h-form-item :label="$t('m.i.pc.busiType')" prop="busiType" :required="true">
            <h-select v-model="addFormItem.busiType" placeholder="">
              <h-option v-for="item in busiTypeList" :value="item.key" :key="item.value">{{ item.value }}
              </h-option>
            </h-select>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.custType')" prop="custType" :required="true">
            <h-select v-model="addFormItem.custType" @on-change="changeCustType" placeholder="">
              <h-option v-for="item in custTypeList" :value="item.key" :key="item.value">{{ item.value }}
              </h-option>
            </h-select>
          </h-form-item>

          <h-form-item prop="warteeCustNo" :label="$t('m.i.pc.warteeCustNo')" v-show="addFormItem.custType === '2'">
            <h-input v-model="addFormItem.warteeCustNo" placeholder="" icon="android-search"
                     @on-click="queryCustNo()" clearable @on-clear="custClearVal()"
                     readonly></h-input>
          </h-form-item>

          <h-form-item prop="warteeBrchCode" :label="$t('m.i.pc.warteeBrchCode')" v-show="addFormItem.custType === '1'" class="h-form-long-label">
            <h-input v-model="addFormItem.warteeBrchCode" placeholder="" readonly :title="addFormItem.warteeBrchCode"
                     icon="android-search" @on-click="queryCpesBrchCode()" @on-clear="brchClearVal()"></h-input>
          </h-form-item>

          <h-form-item prop="warteeName" :label="$t('m.i.pc.warteeName')" :required="true">
            <h-input v-model="addFormItem.warteeName" placeholder="" :title="addFormItem.warteeName" readonly></h-input>
          </h-form-item>

          <h-form-item prop="guarntrAmt" :label="$t('m.i.pc.guarntrAmt')" :required="true">
            <h-typefield v-model="addFormItem.guarntrAmt" integerNum="10" placeholder="" type="money"
                         bigTips></h-typefield>
          </h-form-item>

          <h-form-item prop="remark" :label="$t('m.i.common.remark')">
            <h-input type="textarea" :rows=2 v-model="addFormItem.remark" :canResize="false" :maxlength="150"></h-input>
          </h-form-item>
        </h-form>

      </div>
      <div slot="footer">
        <h-button type="primary" @click="closeAddWin">{{ $t("m.i.common.close") }}</h-button>
        <h-button type="primary" @click="addSubmit">{{ $t("m.i.common.commit") }}</h-button>
      </div>
    </h-msg-box>


    <h-msg-box v-model="editWin" width="800" :mask-closable="false" @on-close="closeEditWin"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span>修改增信信息</span>
      </p>
      <div>
        <h-form :model="editFormItem" :label-width="115" ref="editFormItem" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.pc.busiType')" prop="busiType" :required="true">
            <h-select v-model="editFormItem.busiType" placeholder="" disabled="true">
              <h-option v-for="item in busiTypeList" :value="item.key" :key="item.value">{{ item.value }}
              </h-option>
            </h-select>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.custType')" prop="custType" :required="true">
            <h-select v-model="editFormItem.custType" placeholder="" disabled="true">
              <h-option v-for="item in custTypeList" :value="item.key" :key="item.value">{{ item.value }}
              </h-option>
            </h-select>
          </h-form-item>

          <h-form-item prop="warteeCustNo" :label="$t('m.i.pc.warteeCustNo')" v-show="editFormItem.custType === '2'">
            <h-input v-model="editFormItem.warteeCustNo" placeholder="" readonly></h-input>
          </h-form-item>

          <h-form-item prop="warteeBrchCode" :label="$t('m.i.pc.warteeBrchCode')" class="h-form-long-label"
                       v-show="editFormItem.custType === '1'">
            <h-input v-model="editFormItem.warteeBrchCode" placeholder="" readonly
                     :title="editFormItem.warteeBrchCode"></h-input>
          </h-form-item>

          <h-form-item prop="warteeName" :label="$t('m.i.pc.warteeName')" :required="true">
            <h-input v-model="editFormItem.warteeName" placeholder="" :title="addFormItem.warteeName"
                     readonly></h-input>
          </h-form-item>

          <h-form-item prop="guarntrAmt" :label="$t('m.i.pc.guarntrAmt')" :required="true">
            <h-typefield v-model="editFormItem.guarntrAmt" integerNum="14" placeholder="" type="money"
                         bigTips></h-typefield>
          </h-form-item>

          <h-form-item prop="remark" :label="$t('m.i.common.remark')">
            <h-input v-if="editFormItem.listId" type="textarea" :rows=2 v-model="editFormItem.remark" :canResize="false"
                     :maxlength="150" readonly disabled="true"></h-input>
            <h-input v-else type="textarea" :rows=2 v-model="editFormItem.remark" :canResize="false" :maxlength="150"></h-input>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="primary" @click="closeEditWin">{{ $t("m.i.common.close") }}</h-button>
        <h-button type="primary" @click="editSubmit">{{ $t("m.i.common.commit") }}</h-button>
      </div>
    </h-msg-box>

    <!--文件批量导入-->
    <common-file-upload :importWin="importWin" :fileParams="fileParams" @importWinClose="importWinClose"
                        @importSuccess="importSuccess"></common-file-upload>

    <!--查看历史维护记录弹出窗-->
    <h-msg-box v-model="showHistWin" width="1100" class="h-form-search-layer" :maximize="true" :mask-closable="false">
      <p slot="header">
        <span>查看历史维护记录</span>
      </p>
      <h-datagrid
        :columns="showHistColumns"
        highlight-row
        url="/pc/risk/guarntrtrust/guarntrTrustMain/func_queryGuarntrTrustInfoHis"
        :bindForm="showHistFormItem"
        ref="showHistDatagrid">
        <div slot="toolbar" class="pull-left">
        </div>
      </h-datagrid>
      <div slot="footer">
      </div>
    </h-msg-box>

  </div>
</template>

<script>
import {
  formatNumber,
  getDictListByGroups,
  getDictValueFromMap,
  post,
  getBusinessParameter
} from "@/api/bizApi/commonUtil";

export default {
  name: "guarntrTrustMain",
  components: {
    ShowCustCorp: () => import(/* webpackChunkName: "bm/cust/corp/showCustCorp" */`@/views/bizViews/bm/cust/corp/showCustCorp`),
    ShowCpesBranch:()=>import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
  },
  data() {
    return {
      param: '',
      rows: null,
      ifShowMore: false,
      tempShowExcelTemplateWin: false,
      busiTypeMap: new Map(),
      custTypeMap: new Map(),
      opTypeMap: new Map(),
      flowStatusMap: new Map(),
      busiTypeList: [],
      flowStatusList: [],
      custTypeList: [],
      brchNo: "",
      showHistWin: false,
      showCustCorpWin: false,
      editWin: false,
      addWin: false,
      currentSelectRow: null,
      brchCodeWin: false,

      buttonConfig:{
        editDisable:false,
        deleteDisable:false,
        submitDisable:false,
        cancelDisable:false,
      },

      addFormItem: {
        busiType: "",
        warteeName: '',
        flowStatus: "",
        warteeCustNo: "",
        warteeBrchCode: "",
        guarntrAmt: "",
        remark: "",
        custType: "2",
      },
      editFormItem: {
        busiType: "",
        warteeName: '',
        flowStatus: "",
        warteeCustNo: "",
        warteeBrchCode: "",
        guarntrAmt: "",
        remark: "",
        custType: "",
        id: "",
        listId: "",
        busiTypeName: "",
        custTypeName: "",
        dataSource:"",
      },

      formItem: {
        busiType: "",
        warteeName: '',
        flowStatus: ""
      },

      showHistFormItem: {
        listId: '',
      },
      columns: [
        {
          title: " ",
          type: "radio",
          width: 50,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          width: 60,
          key: "xuhao",
          align: "center"
        },
        {
          title: this.$t("m.i.pc.busiType"),
          key: "busiType",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let dictValue = this.busiTypeMap.get(params.row.busiType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.common.custType"),
          key: "custType",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let dictValue = this.custTypeMap.get(params.row.custType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.pc.warteeCustNo"),
          key: 'warteeCustNo',
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.pc.warteeName"),
          key: 'warteeName',
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.pc.warteeBrchCode"),
          key: 'warteeBrchCode',
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.pc.guarntrAmt"),
          key: "guarntrAmt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let guarntrAmt = formatNumber(params.row.guarntrAmt, 2, ",");
            return h("span", {
              domProps: {
                title: guarntrAmt
              }
            }, guarntrAmt);
          }
        },
        {
          title: this.$t("m.i.common.remark"),
          key: "remark",
          hiddenCol: false,
          sortable: false,
        },
        {
          title: this.$t("m.i.pc.newUpdateTime"),
          key: "updateTime",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.updateTime == null || params.row.updateTime === "") {
              return "";
            }
            let date = this.$moment(params.row.updateTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.common.operStatus"),
          key: "rgstType",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let dictValue = this.opTypeMap.get(params.row.rgstType) + ":" + this.flowStatusMap.get(params.row.flowStatus);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
      ],

      showHistColumns: [
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          width: 60,
          key: "xuhao",
          align: "center"
        },
        {
          title: this.$t("m.i.pc.busiType"),
          key: "busiType",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let dictValue = this.busiTypeMap.get(params.row.busiType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.common.custType"),
          key: "custType",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let dictValue = this.custTypeMap.get(params.row.custType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.pc.warteeCustNo"),
          key: 'warteeCustNo',
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.pc.warteeName"),
          key: 'warteeName',
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.pc.warteeBrchCode"),
          key: 'warteeBrchCode',
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.pc.guarntrAmt"),
          key: "guarntrAmt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let guarntrAmt = formatNumber(params.row.guarntrAmt, 2, ",");
            return h("span", {
              domProps: {
                title: guarntrAmt
              }
            }, guarntrAmt);
          }
        },
        {
          title: this.$t("m.i.pc.applTellerName"),
          key: "applTellerName",
          hiddenCol: false,
          sortable: false,
        },
        {
          title: this.$t("m.i.pc.updateTime"),
          key: "operDtTm",
          hiddenCol: false,
          sortable: false,
          render: (h, params) => {
            if (params.row.operDtTm == null || params.row.operDtTm === "") {
              return "";
            }
            let date = this.$moment(params.row.operDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.pc.checkDtTm"),
          key: "checkDtTm",
          hiddenCol: false,
          sortable: false,
          render: (h, params) => {
            if (params.row.checkDtTm == null || params.row.checkDtTm === "") {
              return "";
            }
            let date = this.$moment(params.row.checkDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.common.remark"),
          key: "remark",
          hiddenCol: false,
          sortable: false,
        },
        {
          title: this.$t("m.i.common.operStatus"),
          key: "flowStatus",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let dictValue = this.opTypeMap.get(params.row.rgstType);
            dictValue = dictValue + ":" + this.flowStatusMap.get(params.row.flowStatus);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
      ],
      importWin: false,
      fileParams: {
        loadExcelUrl: window.LOCAL_CONFIG.API_HOME + "/pc/risk/guarntrtrust/guarntrTrustMain/func_loadExcelData",  //导入excel数据解析接口
        fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/pc/risk/guarntrtrust/guarntrTrustMain/func_submitExcelData",  //excel数据导入接口
        formItem: {},           //请求表格数据时附带参数
        extraGridDatas: {},
        uploadParams: {},       //调用excel数据解析接口时附带的额外参数
        columns: [
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.pc.busiType"),
            key: "busiType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.busiTypeMap.get(params.row.busiType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.custType"),
            key: "custType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.custTypeMap.get(params.row.custType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.pc.warteeCustNo"),
            key: 'warteeCustNo',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.pc.warteeName"),
            key: 'warteeName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.pc.warteeBrchCode"),
            key: 'warteeBrchCode',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.pc.guarntrAmt"),
            key: "guarntrAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let guarntrAmt = formatNumber(params.row.guarntrAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: guarntrAmt
                }
              }, guarntrAmt);
            }
          },
          {
            title: this.$t("m.i.common.remark"),
            key: "remark",
            hiddenCol: false,
            sortable: false,
          },
        ],
        paramKey: "guarntrTrustInfoApplDtos"
      }
    }
  },
  methods: {
    formSearch() {
      this.$refs.datagrid.selects = [];
      this.$refs.datagrid.selectIds = [];
      this.currentSelectRow = null;
      this.$refs.datagrid.dataChange(1);
    },
    formSearchReset() {
      this.currentSelectRow = null;
      this.$refs.datagrid.selects = [];
      this.$refs.datagrid.selectIds = [];
      this.formItem.busiType = "";
      this.formItem.warteeName = "";
      this.formItem.flowStatus = "";
    },
    askDelete() {
      if (!this.currentSelectRow) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
        return;
      }

      let obj = this.currentSelectRow;
      this.$hMsgBox.confirm({
        title: "确认",
        content: "确认要删除吗？",
        onOk: () => {
          this.submitDelete(obj);
        }
      });
    },
    submitDelete(obj) {
      post(obj, "/pc/risk/guarntrtrust/guarntrTrustMain/func_delGuarntrTrustInfo").then(res => {
        if (res) {
          let msg = res.data.retMsg;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$msgTip.success(this);
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
          } else {
            this.$msgTip.error(this, {info: msg});
          }
        }
      }).catch(error => {
        this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
      });
    },
    askSubmit() {
      if (!this.currentSelectRow) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
        return;
      }
      let obj = this.currentSelectRow;
      if (obj.flowStatus !== '0' && obj.flowStatus !== '3'){
        this.$msgTip.error(this, {info: '只有未提交、复核不通过状态才能提交！'});
        return;
      }
      this.$hMsgBox.confirm({
        title: "确认",
        content: "确认要提交吗？",
        onOk: () => {
          this.confirmSubmit(obj);
        }
      });
    },
    confirmSubmit(obj) {
      post(obj, "/pc/risk/guarntrtrust/guarntrTrustMain/func_submitGuarntrTrustInfo").then(res => {
        if (res) {
          let msg = res.data.retMsg;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$msgTip.success(this);
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
          } else {
            this.$msgTip.error(this, {info: msg});
          }
        }
      }).catch(error => {
        this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
      });
    },
    askCancel() {
      if (!this.currentSelectRow) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
        return;
      }
      let obj = this.currentSelectRow;
      if (obj.flowStatus !== '1' ){
        this.$msgTip.error(this, {info: '只有已提交状态才能撤销！'});
        return;
      }
      this.$hMsgBox.confirm({
        title: "确认",
        content: "确认要撤销吗？",
        onOk: () => {
          this.cancelSubmit(obj);
        }
      });
    },
    cancelSubmit(obj) {
      post(obj, "/pc/risk/guarntrtrust/guarntrTrustMain/func_cancelSubmitGuarntrTrustInfo").then(res => {
        if (res) {
          let msg = res.data.retMsg;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$msgTip.success(this);
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
          } else {
            this.$msgTip.error(this, {info: msg});
          }
        }
      }).catch(error => {
        this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
      });
    },
    // 查询客户信息
    queryCustNo(custType) {
      this.showCustCorpWin = true;
    },
    // 关闭客户查询窗口
    showCustCorpWinClose() {
      this.showCustCorpWin = false;
    },
    // 客户信息选择完毕
    custCorpSelect(info) {
      this.showCustCorpWin = false;
      this.addFormItem.warteeCustNo = info.custNo;
      this.addFormItem.warteeName = info.custName;
    },
    custClearVal() {
      this.addFormItem.warteeCustNo = "";
      this.addFormItem.warteeName = "";
    },
    //票交机构弹出框
    queryCpesBrchCode() {
      this.brchCodeWin = true;
    },
    //关闭查询票交机构窗口
    brchCodeWinClose() {
      this.brchCodeWin = false;
    },
    //根据弹框所选数据进行赋值
    brchCodeChange(info) {
      if (info === null) {
        this.$msgTip.error(this, {info: "请先选择记录！"});
        return;
      }
      this.addFormItem.warteeBrchCode = info.brchCode;
      this.addFormItem.warteeName = info.brchFullNameZh;
      this.brchCodeWin = false;
    },
    brchClearVal() {
      this.formItem.warteeBrchCode = '';
      this.formItem.warteeName = '';
      this.brchCodeWin = false;
    },
    showAdd() {
      this.addFormItem.busiType = "";
      this.addFormItem.warteeName = '';
      this.addFormItem.flowStatus = "";
      this.addFormItem.warteeCustNo = "";
      this.addFormItem.warteeBrchCode = "";
      this.addFormItem.guarntrAmt = "";
      this.addFormItem.remark = "";
      this.addFormItem.custType = "2";
      this.addWin = true;
    },
    closeAddWin() {
      this.$refs.addFormItem.resetFields();
      this.addFormItem.busiType = "";
      this.addFormItem.warteeName = '';
      this.addFormItem.flowStatus = "";
      this.addFormItem.warteeCustNo = "";
      this.addFormItem.warteeBrchCode = "";
      this.addFormItem.guarntrAmt = "";
      this.addFormItem.remark = "";
      this.addFormItem.custType = "2";
      this.addWin = false;
    },
    showModify() {
      if (!this.currentSelectRow) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
        return;
      }
      let row = this.currentSelectRow;
      this.editFormItem.busiType = row.busiType;
      this.editFormItem.warteeName = row.warteeName;
      this.editFormItem.flowStatus = row.flowStatus;
      this.editFormItem.warteeCustNo = row.warteeCustNo;
      this.editFormItem.warteeBrchCode = row.warteeBrchCode;
      this.editFormItem.guarntrAmt = row.guarntrAmt;
      this.editFormItem.remark = row.remark;
      this.editFormItem.custType = row.custType;
      this.editFormItem.id = row.id;
      this.editFormItem.listId = row.listId;
      this.editFormItem.dataSource = row.dataSource;
      this.editWin = true;
    },
    closeEditWin() {
      this.$refs.editFormItem.resetFields();
      this.editFormItem.busiType = "";
      this.editFormItem.warteeName = "";
      this.editFormItem.flowStatus = "";
      this.editFormItem.warteeCustNo = "";
      this.editFormItem.warteeBrchCode = "";
      this.editFormItem.guarntrAmt = "";
      this.editFormItem.remark = "";
      this.editFormItem.custType = "";
      this.editFormItem.id = "";
      this.editFormItem.listId = "";
      this.editFormItem.dataSource = "";
      this.editWin = false;
    },
    editSubmit() {
      this.$refs["editFormItem"].validate(valid => {
        if (valid) {
          post(this.editFormItem, "/pc/risk/guarntrtrust/guarntrTrustMain/func_editGuarntrTrustInfo").then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$msgTip.success(this);
                this.editWin = false;
                this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              } else {
                this.$msgTip.error(this, {info: msg});
              }
            }
          }).catch(error => {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
          });
        }
      })
    },
    addSubmit() {
      this.$refs["addFormItem"].validate(valid => {
        if (valid) {
          post(this.addFormItem, "/pc/risk/guarntrtrust/guarntrTrustMain/func_addGuarntrTrustInfo").then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$msgTip.success(this);
                this.addWin = false;
                this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              } else {
                this.$msgTip.error(this, {info: msg});
              }
            }
          }).catch(error => {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
          });
        }
      });

    },
    batchImport() {
      this.importWin = true;
    },
    importSuccess(isSuccess) {
        this.importWin = false;
        this.$refs.datagrid.dataChange(1);
    },
    importWinClose() {
      this.importWin = false;
    },
    templateDownload() {
      let url = window.LOCAL_CONFIG.API_HOME + "/pc/risk/guarntrtrust/guarntrTrustMain/func_download";
      let form = document.createElement("form");
      form.setAttribute("id", "formId");
      form.setAttribute("action", url);
      form.setAttribute("method", "get");
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    },
    showHistory() {
      if (!this.currentSelectRow) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
        return;
      }
      let listId = this.currentSelectRow.listId;
      // 如果listId为空，代表为申请表中记录，历史记录查询空记录
      if (!listId){
        listId = 0;
      }
      this.showHistFormItem.listId = listId;
      this.showHistWin = true;
      this.$refs.showHistDatagrid.dataChange(1);
    },
    closeAddtWin() {
      this.addWin = false;
    },

    handleCurrentChange(currentRow) {
      this.currentSelectRow = currentRow;
      // 未提交、复核不通过
      if (currentRow.flowStatus === '0' || currentRow.flowStatus === '3'){
        this.buttonConfig.cancelDisable=true;
        this.buttonConfig.editDisable=false;
        this.buttonConfig.submitDisable=false;
        this.buttonConfig.deleteDisable=false;
      }
      // 已提交
      else if (currentRow.flowStatus === '1'){
        this.buttonConfig.cancelDisable=false;
        this.buttonConfig.editDisable=true;
        this.buttonConfig.submitDisable=true;
        this.buttonConfig.deleteDisable=true;
      }
      // 登记中
      else if (currentRow.flowStatus === '2'){
        this.buttonConfig.cancelDisable=true;
        this.buttonConfig.editDisable=true;
        this.buttonConfig.submitDisable=true;
        this.buttonConfig.deleteDisable=true;
      }
      // 登记成功
      else if (currentRow.flowStatus === '4'){
        this.buttonConfig.cancelDisable=true;
        this.buttonConfig.editDisable=false;
        this.buttonConfig.submitDisable=true;
        this.buttonConfig.deleteDisable=false;
      }
    },
    handleCurrentChangeCancel() {
      this.currentSelectRow = null;
      this.resetButtonConfig();
    },
    resetButtonConfig(){
      this.buttonConfig.cancelDisable = false;
      this.buttonConfig.editDisable = false;
      this.buttonConfig.submitDisable = false;
      this.buttonConfig.deleteDisable = false;
    },
    changeCustType(value){
      this.addFormItem.warteeCustNo = '';
      this.addFormItem.warteeName = '';
      this.addFormItem.warteeBrchCode = '';
    },


  },
  mounted() {
    this.getDictListByGroups("CreditCustType,GuarntrTrustFlowStatusCode,GuarntrTrustType,GuarntrTrustOpTypeCode").then(res => {
      this.busiTypeMap = res.get("map").get("GuarntrTrustType");
      this.custTypeMap = res.get("map").get("CreditCustType");
      this.flowStatusMap = res.get("map").get("GuarntrTrustFlowStatusCode");
      this.opTypeMap = res.get("map").get("GuarntrTrustOpTypeCode");
      this.custTypeList = res.get("CreditCustType");
      this.busiTypeList = res.get("GuarntrTrustType");
      this.flowStatusList = res.get("GuarntrTrustFlowStatusCode");
      this.dictMap = res.get("map");
    })
  }
}
</script>

<style scoped>

</style>
