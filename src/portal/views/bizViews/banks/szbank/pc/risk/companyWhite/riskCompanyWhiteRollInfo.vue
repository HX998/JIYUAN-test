<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.pc.whiteBusiType')" prop="companyWhiteBusiType">
                  <h-select v-model="formItem.companyWhiteBusiType" placeholder=" ">
                    <h-option v-for="item in companyWhiteBusiType" :value="item.key" :key="item.key">{{
                        item.value
                      }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.custName')" prop="custName">
                  <h-input v-model="formItem.custName" :maxlength=60></h-input>
                </h-form-item>
                <h-form-item :label="this.$t('m.i.common.operStatus')" prop="operStatus">
                  <h-select v-model="formItem.operStatus" placeholder=" ">
                    <h-option v-for="item in operStatusList" :value="item.key" :key="item.key">{{
                        item.value
                      }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
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
            url="pc/risk/companyWhite/riskCompanyWhiteRollInfo/func_queryRiskCompanyWhiteRollHisIndexPage"
            :bindForm="formItem"
            :onCurrentChange="onCurrentChange"
            :onCurrentChangeCancel="onCurrentChangeCancle"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleAddForm('add')" v-if="authObj.bizSetRoleAdd">
                {{ $t('m.i.common.add') }}
              </h-button>
              <!--<h-button type="ghost" @click="handleAddForm('view')">{{$t('m.i.common.view')}}</h-button>-->
              <h-button type="primary" @click="handleAddForm('modify')" v-if="authObj.bizSetRoleAdd">
                {{ $t('m.i.common.modify') }}
              </h-button>
              <h-button type="primary" @click="handleComfirm()" v-if="authObj.bizSetRoleDelete"
                        :disabled="deletDisabled">{{ $t('m.i.common.delete') }}
              </h-button>
              <h-button type="primary" @click="commitComfirm()" v-if="authObj.bizSetRoleDelete" :disabled="!auditMode">
                {{ $t('m.i.common.submitCheck') }}
              </h-button>
              <h-button type="primary" @click="rollbackComfirm()" v-if="authObj.bizSetRoleDelete"
                        :disabled="!auditMode">{{ $t('m.i.common.cancelCheckAuth') }}
              </h-button>
              <h-button type="primary" @click="exportByExcel()" v-if="authObj.bizSetRoleDelete"
                        :disabled="deletDisabled">{{ $t('m.i.common.batchImport') }}
              </h-button>
              <h-button type="primary" @click="downModel()" v-if="authObj.bizSetRoleDelete" :disabled="deletDisabled">
                {{ $t('m.i.common.templateDownload') }}
              </h-button>
              <h-button type="primary" @click="showHist()">{{ $t('m.i.common.showHist') }}</h-button>
            </div>

          </h-datagrid>

        </div>
      </h-col>
    </h-row>

    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="400" class="h-form-search-layer" :maximize="true" :mask-closable="false">
      <p slot="header">
        <span v-if="type==='add'">新增白名单信息</span>
        <span v-if="type==='modify'">修改白名单信息</span>
        <span v-if="type==='view'">查看白名单信息</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="1" class="h-form-search">

          <h-form-item :label="$t('m.i.pc.whiteBusiType')" prop="companyWhiteBusiType" :required="isRequired">
            <h-select v-if="type==='view'" v-model="addForm.companyWhiteBusiType" class="input-boder-0" readonly
                      :title="addForm.companyWhiteBusiType" @on-change="whiteBusiTypeChange">
              <h-option v-for="item in companyWhiteBusiType" :value="item.key" :key="item.key">{{
                  item.value
                }}
              </h-option>
            </h-select>
            <h-select v-else-if="type==='modify'" v-model="addForm.companyWhiteBusiType" readonly
                      :title="addForm.companyWhiteBusiType"
                      @on-change="whiteBusiTypeChange">
              <h-option v-for="item in companyWhiteBusiType" :value="item.key" :key="item.key">{{
                  item.value
                }}
              </h-option>
            </h-select>
            <h-select v-else v-model="addForm.companyWhiteBusiType" @on-change="whiteBusiTypeChange">
              <h-option v-for="item in companyWhiteBusiType" :value="item.key" :key="item.key">{{
                  item.value
                }}
              </h-option>
            </h-select>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.custNo')" prop="custNo" :required="isRequired">
            <h-input v-if="type==='view'" v-model="addForm.custNo" class="input-boder-0" readonly
                     :title="addForm.custNo"></h-input>
            <h-input v-else-if="type==='modify'" v-model="addForm.custNo" :maxlength=50 readonly
            ></h-input>
            <h-input v-else v-model="addForm.custNo" :maxlength=50 readonly
                     icon="android-search" @on-click="custNoWinOpen"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.custName')" prop="custName" :required="isRequired">
            <h-input v-if="type==='view'" v-model="addForm.custName" class="input-boder-0" readonly
                     :title="addForm.custName"></h-input>
            <h-input v-else v-model="addForm.custName" :maxlength=60 readonly></h-input>
          </h-form-item>
          <h-form-item prop="custAcctNo" :label="$t('m.i.common.custAcctNo')" v-if="custAcctNoReadOnly" :required="isRequired">
            <h-input v-if="type==='view'" v-model="addForm.custAcctNo" readonly
                     :title="addForm.custAcctNo"></h-input>
            <h-input v-if="type==='modify'" v-model="addForm.custAcctNo" readonly
                     :title="addForm.custAcctNo"></h-input>
            <h-input v-else v-model="addForm.custAcctNo" placeholder="" icon="android-search"
                     @on-click="queryCustAcctNo()" readonly clearable @on-clear="clearVal('custAcctNo')"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.custMgrNo')" prop="custMgrNo" :required="isRequired">
            <h-input v-if="type==='view'" v-model="addForm.custMgrNo" class="input-boder-0"
                     :title="addForm.custMgrNo"></h-input>
            <h-input v-else-if="type==='modify'" v-model="addForm.custMgrNo" :maxlength=20 readonly
                     icon="android-search" @on-click="custMgrNoWinOpen"></h-input>
            <h-input v-else v-model="addForm.custMgrNo" :maxlength=20 readonly
                     icon="android-search" @on-click="custMgrNoWinOpen"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.custMgrName')" prop="custMgrName" :required="isRequired">
            <h-input v-if="type==='view'" v-model="addForm.custMgrName" class="input-boder-0" readonly
                     :title="addForm.custMgrName"></h-input>
            <h-input v-else v-model="addForm.custMgrName" :maxlength=16 readonly></h-input>
          </h-form-item>


          <h-form-item label="客户经理手机号" prop="phoneNo" :required="isRequired" :validRules="phoneNoRule" >
            <h-input v-if="type==='view'" v-model="addForm.phoneNo" class="input-boder-0"
                     :title="addForm.phoneNo"></h-input>
            <h-input v-else v-model="addForm.phoneNo" :maxlength=11 placeholder="小于等于11位数字"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.pc.riskRemark')" prop="riskRemark" cols="2">
            <h-input v-if="type==='view'" type="textarea" v-model="addForm.riskRemark" class="input-boder-0"
                     :title="addForm.riskRemark" readonly></h-input>
            <h-input v-else type="textarea" v-model="addForm.riskRemark" :maxlength=300></h-input>
          </h-form-item>

        </h-form>
      </h-panel>
      <div slot="footer" v-if="type!=='view'">
        <!--<h-button type="ghost" style="margin:0 8px"  @click="addFormReset()">{{$t('m.i.common.reset')}}</h-button>-->
        <h-button type="primary" @click="addOrEditWin=!addOrEditWin;addFormReset();">{{ $t('m.i.common.close') }}
        </h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{ $t('m.i.common.submiting') }}</h-button>
        <h-button type="primary" v-else @click="submitForm()">{{ $t('m.i.common.commit') }}</h-button>

      </div>
      <div slot="footer" v-else>
        <h-button type="primary" @click="addOrEditWin=!addOrEditWin;addFormReset();">{{ $t('m.i.common.close') }}
        </h-button>
      </div>
    </h-msg-box>

    <!-- 批量导入弹出框-->
    <h-msg-box title="批量导入" v-model="importWin" height="150" :footerHide="true" :maximize="true" :mask-closable="false">
      <h-upload :action="uploadUrl"
                :format="['xls','xlsx']"
                :max-size="2048"
                :with-credentials="true"
                :on-progress="handleProgress"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :on-format-error="handleFormatError"
                :on-preview="clickLink"
                :on-remove="handleRemove"
                @on-goto-add="selectData"
                ref="upload"
                selfConfig
                uploadAll
                :class="{'h-upload-goto-add': selectDataFirst}">
        <h-button type="primary" icon="ios-cloud-upload-outline" slot="chooseFile" v-if="importSelect">
          {{ $t("m.i.common.chooseImportFile") }}
        </h-button>
        <h-button type="primary" icon="ios-cloud-upload-outline" slot="postFile" v-if="!importSelect">
          {{ $t("m.i.common.submit") }}
        </h-button>
      </h-upload>
    </h-msg-box>

    <c-white-hist :showHistWin="showHistWin" title="查看历史维护记录" :whiteId="whiteId"
                  @showHistWinClose="showHistWinClose"></c-white-hist>
    <show-cust-corp :showCustCorpWin="custNoWin" :title="'查看企业客户'"
                    @showCustCorpWinClose="showCustWinClose" @custSelect="selectCustNo"></show-cust-corp>

    <select-cust-manager :showCustManagerWin="custMgrNoWin" :title="'选择客户经理'"
                         @showCustManagerWinClose="showCustMgrWinClose"
                         @custManagerSelect="selectCustMgrNo"></select-cust-manager>
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.addForm.custNo"
                       @showCustAcctNoWinClose="showCustAcctNoWinClose"
                       @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>

  </div>
</template>

<script>

import {post, on, off, getMoreParamValuesByKeys, getBusinessParameter} from "@/api/bizApi/commonUtil";

export default {
  name: "riskCompanyWhiteRollInfo",
  components: {
    CWhiteHist: () => import(/* webpackChunkName: "banks/szbank/pc/risk/companyWhite/riskCompanyWhiteRollHist" */`@/views/bizViews/banks/szbank/pc/risk/companyWhite/riskCompanyWhiteRollHist.vue`),
    ShowCustCorp: () => import(/* webpackChunkName: "bm/cust/corp/showCustCorp"*/`@/views/bizViews/bm/cust/corp/showCustCorp.vue`),
    // showCustManager: () => import(/* webpackChunkName: "bm/cust/manager/showCustManager"*/`@/views/bizViews/bm/cust/manager/showCustManager.vue`),
    selectCustManager: () => import(/* webpackChunkName: "bm/cust/manager/selectCustManager"*/`@/views/bizViews/bm/cust/manager/selectCustManager.vue`),
  },
  data() {
    return {
      columns: [
        {
          title: ' ',
          type: "radio",
          width: 60,
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
          title: 'ID',
          key: "id",
          hiddenCol: true,
        },
        {
          title: this.$t("m.i.pc.whiteBusiType"),
          key: "companyWhiteBusiType",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "CompanyWhiteBusiType", params.row.companyWhiteBusiType);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t("m.i.common.custNo"),
          key: "custNo",
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.common.custName"),
          key: "custName",
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.common.custAcctNo"),
          key: "custAcctNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.custMgrNo"),
          key: "custMgrNo",
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.common.custMgrName"),
          key: "custMgrName",
          hiddenCol: false,
          sortable: true,
        },
        {
          title: "客户经理手机号",
          key: "phoneNo",
          width: 130,
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.pc.riskRemark"),
          key: "riskRemark",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.pc.newUpdateTime"),
          key: "operDtTm",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            let operDtTm = params.row.operDtTm == null ? "" : this.$moment(params.row.operDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
            return h("span", {domProps: {title: operDtTm}}, operDtTm);
          }
        },
        {
          title: this.$t("m.i.common.operStatus"),
          key: "operStatus",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "RiskOperStatus", params.row.operStatus);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
      ],
      formItem: {
        custName: "",
        companyWhiteBusiType: '',
        operStatus: ''
      },
      addForm: {
        id: "",
        custNo: "",
        custName: "",
        custAcctNo: "",
        custMgrNo: "",
        custMgrName: "",
        phoneNo: "",
        companyWhiteBusiType: "",
        riskRemark: "",
        operStatus: ""
      },
      phoneNoRule : [{ test: /^[0-9]{0,11}$/, trigger: "blur", message: "只能输入11位以下数字" }],
      //给按钮增加权限
      authObj: {
        bizSetRoleAdd: true, //角色添加
        bizSetRoleDelete: true, //角色删除
        bizSetRoleORight: true, //角色操作权限
        bizSetRoleARight: true, //角色授权权限
        bizRoleRightSet: true, //角色权限处理
        bizRoleRightCopy: true, //角色权限复制
        bizSetRoleDownload: true, //角色信息下载
      },
      // 是否显示新增或修改窗口
      addOrEditWin: false,
      type: null,
      readonly: false,
      isRequired: true,
      tableRef: "selfTable",
      deletDisabled: false,
      auditMode: true,
      submitFlag: false,
      copyWin: false,
      brchCodeWin: false,
      custNoWin: false,
      custMgrNoWin: false,
      showCustAcctNoWin : false,
      uploadFileName: "",
      fileId: "",
      uploadWin: false,
      riskLevelList: [
        {value: '1', label: '提示'},
        {value: '0', label: '禁止'},
      ],
      showHistWin: false,
      whiteId: '',
      ifShowMore: false,
      companyWhiteBusiType: [],
      operStatusList: [],
      branchTypes: [],
      custTypes: [],
      operStatuss: [],
      brchClasses: [],
      brchTypeList: [],
      transBrchClassList: [],
      uploadUrl: window.LOCAL_CONFIG.API_HOME + "/banks/szbank/pc/risk/companyWhite/importCompanyWhiteRollInfo",
      importSelect: true,
      selectDataFirst: false,
      importWin: false,
      dictMap: new Map(),
      headBranch: false,
      modifyOneFlag: false,
      custAcctNoReadOnly : true
    };
  },
  watch: {
    selectDataFirst(val) {
      if (val) {
        this.importSelect = false;
      }
    }

  },
  methods: {
    addFormReset() {
      this.$refs.addForm.resetFields();
      this.addForm.id = '';
      this.custAcctNoReadOnly = true;
    },
    handleAddForm(str) {
      this.type = str;
      this.readonly = false;
      this.isRequired = true;
      if (this.type === "modify" || this.type === "view") {
        if (this.currentSelectRow == null || this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, {info: '请先选择记录'});
          return;
        }
        if (this.currentSelectRow.operStatus === '12' || this.currentSelectRow.operStatus === '22'
          || this.currentSelectRow.operStatus === '32' || this.currentSelectRow.operStatus === '33') {
          this.$msgTip.info(this, {info: this.$t('m.i.pc.updateError')});
          return;
        } else {
          this.$nextTick(() => {
            this.queryObjById(this.currentSelectRow.id);
            if (this.type === "modify") {
              this.readonly = true;
            }
            if (this.type === "view") {
              this.isRequired = false
            }
          });
        }
      } else {
        this.$nextTick(() => {
          this.addFormReset();
        });
      }
      this.addOrEditWin = true;
    },

    queryObjById(id) {
      post({id: id}, "pc/risk/companyWhite/riskCompanyWhiteRollInfoHis/func_queryCompanyWhiteHisById").then(res => {
        this.submitFlag = false;
        if (res) {
          let retCode = res.data.retCode
          if (retCode === "000000" && res.data.retData) {
            this.modifyOneFlag = true;
            this.addForm.id = res.data.retData.id;
            this.addForm.custNo = res.data.retData.custNo;
            this.addForm.custName = res.data.retData.custName;
            this.addForm.custAcctNo = res.data.retData.custAcctNo;
            this.addForm.companyWhiteBusiType = res.data.retData.companyWhiteBusiType;
            this.addForm.custMgrNo = res.data.retData.custMgrNo;
            this.addForm.custMgrName = res.data.retData.custMgrName;
            this.addForm.phoneNo = res.data.retData.phoneNo;
            this.addForm.riskRemark = res.data.retData.riskRemark;
            this.addForm.operStatus = res.data.retData.operStatus;
          } else {
            this.$msgTip.error(this, {info: "请修改最新的记录"})
            this.addOrEditWin = false;
          }
        } else {
          this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
        }
      });

    },

    onCurrentChange(currentRow, oldCurrentRow, _index) {
      this.currentSelectRow = currentRow;
    },
    onCurrentChangeCancle(currentRow, oldCurrentRow, _index) {
      this.currentSelectRow = null;
    },
    unDisabled() {
      this.deletDisabled = false
    },
    formSearch() {
      this.unDisabled()
      this.currentSelectRow = null;
      this.$refs.datagrid.dataChange(1);
    },
    formSearchReset() {
      this.currentSelectRow = null;
      this.$refs.formItem.resetFields();
    },
    submitForm() {
      let btnType = this.type
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          // 新增或修改的url
          let url = this.type === "add" ? 'pc/risk/companyWhite/riskCompanyWhiteRollInfo/func_addRiskCompanyWhiteRollInfo' : 'pc/risk/companyWhite/riskCompanyWhiteRollInfo/func_updateRiskCompanyWhiteRollInfo'
          let msg = this.type === "add" ? this.$t('m.i.common.addSuccess') : this.$t('m.i.common.modifySuccess')
          this.submitFlag = true;
          post(this.addForm, url).then(res => {
            this.submitFlag = false;
            if (res) {
              let retCode = res.data.retCode
              if (retCode === "000000") {
                this.$msgTip.success(this)
                this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                this.addFormReset();
                this.addOrEditWin = false;
                this.currentSelectRow = [];
                this.custAcctNoReadOnly = true;
              } else {
                // this.$hMessage.error(this.type=="add"?this.$t('m.i.common.addFailed')+res.data.retMsg:this.$t('m.i.common.modifyFailed')+res.data.retMsg);
                this.$msgTip.error(this, {info: res.data.retMsg})
              }
            } else {
              // this.$hMessage.error(this.$t('m.i.common.netError'))
              this.$msgTip.error(this, {info: this.$t('m.i.common.netError')})
            }

          });
        }
      });

    },
    //白名单删除
    handleComfirm() {
      if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
        if (this.currentSelectRow.operStatus === '12' || this.currentSelectRow.operStatus === '22'
          || this.currentSelectRow.operStatus === '32' || this.currentSelectRow.operStatus === '33') {
          this.$msgTip.info(this, {info: this.$t('m.i.pc.deleteError')});
          return;
        } else {
          this.$hMsgBox.confirm({
            title: '删除白名单信息',
            content: this.$t('m.i.common.isConfirmDelete') + '?',
            onOk: () => {
              this.handledel();
            }
          })
        }
      } else {
        this.$msgTip.info(this, {info: '请先选择记录'});
      }

    },
    handledel() {
      let delId = this.currentSelectRow.id;
      let blackFlag = this.currentSelectRow.blackFlag;
      post({
        id: delId,
        blackFlag: blackFlag
      }, 'pc/risk/companyWhite/riskCompanyWhiteRollInfo/func_deleteRiskCompanyWhiteRollInfo').then(res => {
        if (res) {
          let retCode = res.data.retCode
          if (retCode == "000000") {
            this.$msgTip.success(this)
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            this.currentSelectRow = [];
            this.currentSelectList = [];
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg})
          }
        } else {
          this.$msgTip.error(this, {info: this.$t('m.i.common.netError')})
        }
      });
    },

    //提交复核确认
    commitComfirm() {
      if (this.currentSelectRow != null && this.currentSelectRow.length != 0) {
        let operStatus = this.currentSelectRow.operStatus;
        if (operStatus !== '11' && operStatus !== '21' && operStatus !== '31') {
          this.$msgTip.info(this, {info: '只有待提交状态才能提交复核'});
          return
        }
        this.$hMsgBox.confirm({
          title: '白名单提交复核',
          content: this.$t('m.i.common.isConfirmCommit') + '?',
          onOk: () => {
            this.commitCheck();
          }
        })
      } else {
        this.$msgTip.info(this, {info: '请先选择记录'});
      }
    },
    /**提交复核**/
    commitCheck() {
      if (this.currentSelectRow == null || this.currentSelectRow.length == 0) {
        this.$msgTip.info(this, {info: '请先选择记录'});
        return
      }

      let checkId = this.currentSelectRow.id;
      post({id: checkId}, 'pc/risk/companyWhite/riskCompanyWhiteRollInfo/func_submitRiskCompanyWhiteRollInfo').then(res => {
        if (res) {
          let retCode = res.data.retCode
          if (retCode == "000000") {
            this.$msgTip.success(this)
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            this.currentSelectRow = [];
            this.currentSelectList = [];
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg})
          }
        } else {
          this.$msgTip.error(this, {info: this.$t('m.i.common.netError')})
        }
      });

    },
    rollbackComfirm() {
      if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
        let operStatus = this.currentSelectRow.operStatus;

        if (operStatus !== '12' && operStatus !== '22' && operStatus !== '32') {
          this.$msgTip.info(this, {info: '只有待复核状态才能撤销'});
          return
        }
        this.$hMsgBox.confirm({
          title: '撤销白名单',
          content: this.$t('m.i.common.isConfirmRollBack') + '?',
          onOk: () => {
            this.rollback();
          }
        })
      } else {
        this.$msgTip.info(this, {info: '请先选择记录'});
      }
    },
    /**撤销**/
    rollback() {
      if (this.currentSelectRow == null || this.currentSelectRow.length == 0) {
        this.$msgTip.info(this, {info: '请先选择记录'});
        return
      }

      let rollId = this.currentSelectRow.id;
      post({id: rollId}, 'pc/risk/companyWhite/riskCompanyWhiteRollInfo/func_rollbackRiskCompanyWhiteRollInfo').then(res => {
        if (res) {
          let retCode = res.data.retCode
          if (retCode == "000000") {
            this.$msgTip.success(this)
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            this.currentSelectRow = [];
            this.currentSelectList = [];
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg})
          }
        } else {
          this.$msgTip.error(this, {info: this.$t('m.i.common.netError')})
        }
      });
    },

    /**批量导入**/
    exportByExcel() {
      this.importWin = true;
      this.$nextTick(() => {
        this.$refs.upload.clearFiles();
        this.importSelect = true;
        this.selectDataFirst = false;
      });
    },
    selectData(status) {
      this.selectDataFirst = status;
    },
    handleProgress() {
      this.$hMessage.loading({
        content: '文件正在上传中...'
      })
    },
    uploadSuccess(file) {
      // this.$hMessage.success('已上传成功');
      this.importWin = false;
      let retCode = file.retCode;
      if (retCode === "000000") {
        this.$msgTip.success(this, {info: this.$t('m.i.common.importSuccess')});
      } else {
        this.$msgTip.error(this, {info: this.$t('m.i.common.importFailed') + ':' + file.retMsg});
      }
      this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);

    },
    handleFormatError(file) {
      this.$msgTip.error(this, {info: "文件 " + file.name + " 格式不正确，请上传xls或xlsx格式的文件"});
    },
    uploadError(file) {
      // this.$hMessage.error(file.name+'上传失败')
      this.$msgTip.error(this, {info: file.name + '上传失败'})
    },
    clickLink(file) {
      this.$hNotice.info({
        title: '点击上传文件事件',
        desc: '点击已上传的文件链接时的事件'
      })
    },
    handleRemove(file) {
      // this.$hMessage.success(file.name+'已移除');
      this.$msgTip.success(this)
      this.importSelect = true;
      this.selectDataFirst = false;
    },

    /**模板下载**/
    downModel() {
      let url = window.LOCAL_CONFIG.API_HOME + "/banks/szbank/pc/risk/companyWhite/download";
      let form = document.createElement('form');
      form.setAttribute("id", "formId");
      form.setAttribute('action', url);
      form.setAttribute("method", "post");
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    },
    custNoWinOpen() {
      this.custNoWin = true;
    },
    clearVal(type){
      if(type === 'custName'){
        this.addForm.custNo = '';
      }else{
        this.addForm.custAcctNo = '';
      }
    },
    //查询客户账号信息
    queryCustAcctNo() {
      if (this.formItem.custNo === "") {
        this.$msgTip.info(this, { info: "请先选择客户号！" });
        return;
      }
      this.showCustAcctNoWin = true;
    },
    //赋值
    custAcctNoSelectSubmit(info) {
      this.addForm.custAcctNo = info.custAcctNo;
      this.showCustAcctNoWin = false;
    },
    //关闭弹窗
    showCustAcctNoWinClose() {
      this.showCustAcctNoWin = false;
    },
    custMgrNoWinOpen() {
      this.custMgrNoWin = true;
    },
    showCustWinClose() {
      this.custNoWin = false;
    },
    showCustMgrWinClose() {
      this.custMgrNoWin = false;
    },
    selectCustNo(info) {
      this.addForm.custNo = info.custNo;
      this.addForm.custName = info.custName;
      this.addForm.custMgrNo = info.custMgrNo;
      this.addForm.custMgrName = info.custMgrName;
      this.addForm.custAcctNo = null;
      this.custNoWin = false;
      post({custMgrNo: this.addForm.custMgrNo}, '/banks/szbank/pc/risk/companyWhite/riskCompanyWhiteRollInfo/func_queryCustManagerByCustMgrNo').then(res => {
        if (res) {
          let retCode = res.data.retCode
          if (retCode == "000000") {
            this.addForm.phoneNo = res.data.retData.tel;
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg})
          }
        } else {
          this.$msgTip.error(this, {info: this.$t('m.i.common.netError')})
        }
      });
    },
    selectCustMgrNo(info) {
      this.addForm.custMgrNo = info.custMgrNo;
      this.addForm.custMgrName = info.custMgrName;
      this.addForm.phoneNo = info.tel;
      this.custMgrNoWin = false;
    },
    whiteBusiTypeChange(val) {
      if (this.modifyOneFlag === false) {
        if (val === '8' && this.headBranch) {
          this.addForm.id = '';
          this.addForm.custNo = '';
          this.addForm.custAcctNo = '';
          this.addForm.custName = '';
          this.addForm.companyWhiteBusiType = '';
          this.addForm.custMgrNo = '';
          this.addForm.custMgrName = '';
          this.addForm.phoneNo = '';
          this.addForm.riskRemark = '';
          this.addForm.operStatus = '';
        }
      } else {
        this.modifyOneFlag = false;
      }
      if (val === '1' || val === '2') {
        this.custAcctNoReadOnly = false;
        this.addForm.custAcctNo = null;
      } else {
        this.custAcctNoReadOnly = true;
      }
    },
    getBusiness(res) {
      if (res.data.retData === '1') {
        this.headBranch = true;
      }
    },
    showHist() {
      if (this.currentSelectRow == null || this.currentSelectRow.length === 0) {
        this.$msgTip.info(this, {info: '请先选择记录'});
        return
      }
      this.whiteId = this.currentSelectRow.id;
      this.showHistWin = true;
    },
    showHistWinClose() {
      this.showHistWin = false;
    },

  },

  mounted() {
    getBusinessParameter({paramKey: 'ce.disc.fastdisc_acptbank_white_type'}, this.getBusiness);
    this.getDictListByGroups("CompanyWhiteBusiType,BrchType,BrchClass,RiskOperStatus").then(res => {
      this.companyWhiteBusiType = res.get("CompanyWhiteBusiType");
      this.operStatusList = res.get("RiskOperStatus");
      this.brchTypeList = res.get("BrchType");
      this.transBrchClassList = res.get("BrchClass");
      this.dictMap = res.get("map");
    });
    getMoreParamValuesByKeys("pc.risk.company_white_audit_mode").then(res => {
      let idAudit = res['pc.risk.company_white_audit_mode'];
      if (idAudit === '0') {
        this.auditMode = false;
      } else {
        this.auditMode = true;
      }
    });
  }

};
</script>

<style scoped>

</style>
