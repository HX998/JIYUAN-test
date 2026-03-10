<!--全市场机构信息维护-->
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
                <h-form-item :label="$t('m.i.common.brchFullNameZh')" prop="brchFullNameZh">
                  <h-input v-model="formItem.brchFullNameZh" :maxlength="60"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.brchCode')" prop="brchCode">
                  <h-input v-model="formItem.brchCode" :maxlength="9"></h-input>
                </h-form-item>
                <!--<h-form-item :label="$t('m.i.common.transBrchBankNo')" prop="transBrchBankNo" class="h-form-long-label">
                  <h-input v-model="formItem.transBrchBankNo" :maxlength="12"
                           :placeholder="$t('m.i.common.transBrchBankNo')"></h-input>
                </h-form-item>-->
                <h-form-item :label="$t('m.i.common.brchType')" prop="brchType">
                  <h-select v-model="formItem.brchType" placeholder="">
                    <h-option v-for="item in brchTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.memberName')" prop="memberName">
                  <h-input v-model="formItem.memberName" :maxlength="60"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.shcpe.brchStatus')" prop="brchStatus">
                  <h-select v-model="formItem.brchStatus" placeholder="">
                    <h-option v-for="item in brchStatusList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <!--新增承接机构全称查询条件-->
                <h-form-item label="承接机构全称" prop="continueBranchName">
                  <h-input v-model="formItem.continueBranchName" :maxlength="20"></h-input>
                </h-form-item>
                <!--修改省份为下拉框-->
                <h-form-item :label="$t('m.i.common.bankProv')" prop="transProvinceCode">
                  <h-select v-model="formItem.transProvinceCode" placeholder="">
                    <h-option v-for="item in provinceCodeList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.shcpe.custNo')" prop="custNo">
                  <h-input v-model="formItem.custNo" :maxlength="20"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
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
            url="/cpes/branch/queryBranchList"
            :bindForm="formItem"
            :onSelectChange="handleSelectClick"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="branchDetail()">{{$t("m.i.common.viewDatail")}}</h-button>
              <h-button type="primary" @click="handleEditForm()">{{$t("m.i.common.modify")}}</h-button>
              <h-button type="primary" @click="handleAgencyForm()">{{$t("m.i.shcpe.supplement")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--点击查看详情弹出窗-->
    <branch-detail :viewDatailWin="viewDatailWin" :id="id" @branchDatailWinClose="branchDatailWinClose">
    </branch-detail>
    <!--点击修改弹出窗-->
    <h-msg-box v-model="editWin" width="800" :mask-closable="false" @on-close="handleWinClose"
                :maximize="true">
      <p slot="header">
        <span>修改票交所机构</span>
      </p>
      <h-form :model="editForm" :label-width="130" ref="editForm" cols="2" class="h-form-search">
        <div class="h-search-form-row">
          <h-form-item :label="$t('m.i.common.brchCode')" prop="brchCode">
            <h-input :value="editForm.brchCode" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.brchFullNameZh')" prop="brchFullNameZh">
            <h-input :value="editForm.brchFullNameZh" readonly></h-input>
          </h-form-item>
        </div>
        <div class="h-search-form-row">
          <h-form-item :label="$t('m.i.common.transBrchBankNo')" prop="transBrchBankNo">
            <h-input :value="editForm.transBrchBankNo" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.brchNum')" prop="brchNum">
            <h-input :value="editForm.brchNum" readonly></h-input>
          </h-form-item>
        </div>
        <div class="h-search-form-row">
          <h-form-item :label="$t('m.i.common.brchType')" prop="brchType">
            <h-select v-model="editForm.brchType" readonly placeholder="">
              <h-option v-for="item in brchTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.transBrchClass')" prop="transBrchClass">
            <h-select v-model="editForm.transBrchClass" readonly placeholder="">
              <h-option v-for="item in transBrchClassList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
        </div>
        <div class="h-search-form-row">
          <h-form-item :label="$t('m.i.shcpe.brchStatus')" prop="brchStatus">
            <h-select v-model="editForm.brchStatus" readonly placeholder="">
              <h-option v-for="item in brchStatusList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.transAcctStatus')" prop="transAcctStatus">
            <h-select v-model="editForm.transAcctStatus" readonly placeholder="">
              <h-option v-for="item in brchStatusList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
        </div>
        <div class="h-search-form-row">
          <h-form-item :label="$t('m.i.shcpe.regAcctStatus')" prop="regAcctStatus">
            <h-select v-model="editForm.regAcctStatus" readonly placeholder="">
              <h-option v-for="item in brchStatusList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.socCode')" prop="socCode" :validRules="socCodeRule" required>
            <h-input v-model="editForm.socCode" :maxlength="18" placeholder="18位数字或大写字母"></h-input>
          </h-form-item>
        </div>
        <div>
          <h-form-item :label="$t('m.i.common.address')" prop="address" style="height:60px; width:380px;">
            <h-input :value="editForm.address" disabled type="textarea"></h-input>
          </h-form-item>

          <h-form-item label="是否总行" prop="isCenterBrch">
            <h-select v-model="editForm.isCenterBrch" placeholder="请选择">
              <h-option v-for="item in isCenterBrchList" :value="item.value" :key="item.value">{{ item.label }}
              </h-option>
            </h-select>
          </h-form-item>

        </div>
      </h-form>
      <div slot="footer">
        <h-button type="ghost" @click="handleWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm">{{$t("m.i.common.commit")}}</h-button>

      </div>
    </h-msg-box>
    <!--点击补录弹出窗-->
    <h-msg-box v-model="agencyWin" width="400" :mask-closable="false" @on-close="agencyWinClose"
                :maximize="true">
      <p slot="header">
        <span>补录同业客户信息</span>
      </p>
      <h-form :model="agencyForm" :label-width="80" ref="agencyForm" cols="2" class="h-form-search">
        <h-form-item :label="$t('m.i.shcpe.custNo')" :validRules="custNoRule" prop="custNo" cols="2"
                     style="height: 46px">
          <h-row>
            <h-col span="17">
              <h-input v-model="agencyForm.custNo" type="text"></h-input>
            </h-col>
            <h-col span="4" offset="1">
              <h-button type="ghost" @click="agencySupply()" class="pull-left">{{$t("m.i.common.synch")}}</h-button>
            </h-col>
          </h-row>
        </h-form-item>

        <h-form-item :label="$t('m.i.common.remark')" prop="cpesBrchRemark" cols="2">
          <h-input v-model="agencyForm.cpesBrchRemark" type="textarea" :maxlength="250"></h-input>
        </h-form-item>
      </h-form>
      <div slot="footer">
        <h-button type="ghost" @click="agencyWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="agencySubmitForm">{{$t("m.i.common.commit")}}</h-button>

      </div>
    </h-msg-box>
  </div>
</template>
<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "branchManage",
    data() {
      return {
        formItem: {
          brchFullNameZh: "",
          brchCode: "",
          transBrchBankNo: "",
          brchType: "",
          memberName: "",
          brchStatus: "",
          continueBranchName: "",
          custNo: "",
          transProvinceCode: ""
        },
        editForm: {
          id: "",
          memberId: "",
          memberName: "",
          brchCode: "",
          brchNum: "",
          brchType: "",
          transBrchClass: "",
          brchFullNameZh: "",
          brchFullNameEn: "",
          brchShortNameZh: "",
          brchShortNameEn: "",
          socCode: "",
          transProvinceCode: "",
          transCorpClass: "",
          prodBeginDt: "",
          prodEndDt: "",
          brchStatus: "",
          transAcctStatus: "",
          regAcctStatus: "",
          transCorpReg: "",
          transRegistCapital: "",
          address: "",
          linkMan: "",
          phone: "",
          custFax: "",
          postCode: "",
          transBrchBankNo: "",
          brchBankName: "",
          eAgentBankNo: "",
          ecdsAcctNo: "",
          cpesBrchRemark: "",
          operTm: "",
          brLv: "",
          operType: "",
          brchInternalAcctNo: "",
          brchInternalAcctName: "",
          memberTxAcctNo: "",
          memberRegAcctNo: "",
          cpesAcctNo: "",
          outAcctBankNo: "",
          outAcctNo: "",
          outAcctName: "",
          firstAdminId: "",
          firstAdminName: "",
          firstAdminStatus: "",
          secondAdminId: "",
          secondAdminName: "",
          secondAdminStatus: "",
          continueBrchCode: "",
          createTime: "",
          updateTime: "",
          custNo: "",
          reserve1: "",
          customerName: "",
          certifyType: "",
          certifyNo: "",
          isPlatform: "",
          continueBranchName: "",
          isCenterBrch: ""
        },
        agencyForm: {
          id: "",
          brchCode: "",
          customerName: "",
          certifyType: "",
          certifyNo: "",
          cpesBrchRemark: "",
          custNo: "",
          checkType: ""
        },
        checkForm: {
          socCode: "",
          bankNo: "",
          custNo: "",
          custName: "",
          brchCode: "",
          certifyType: "",
          certifyNo: ""
        },
        viewDatailForm: {
          id: "",
          memberId: "",
          memberName: "",
          brchCode: "",
          brchNum: "",
          brchType: "",
          brchTypeName: "",
          transBrchClass: "",
          transBrchClassName: "",
          brchFullNameZh: "",
          brchFullNameEn: "",
          brchShortNameZh: "",
          brchShortNameEn: "",
          socCode: "",
          transProvinceCode: "",
          transProvince: "",
          transCorpClass: "",
          transCorpClassName: "",
          prodBeginDt: "",
          prodEndDt: "",
          brchStatus: "",
          brchStatusName: "",
          transAcctStatus: "",
          transAcctStatusName: "",
          regAcctStatus: "",
          regAcctStatusName: "",
          transCorpReg: "",
          transRegistCapital: "",
          address: "",
          linkMan: "",
          phone: "",
          custFax: "",
          postCode: "",
          transBrchBankNo: "",
          brchBankName: "",
          eAgentBankNo: "",
          ecdsAcctNo: "",
          cpesBrchRemark: "",
          operTm: "",
          brLv: "",
          operType: "",
          brchInternalAcctNo: "",
          brchInternalAcctName: "",
          memberTxAcctNo: "",
          memberRegAcctNo: "",
          cpesAcctNo: "",
          outAcctBankNo: "",
          outAcctNo: "",
          outAcctName: "",
          firstAdminId: "",
          firstAdminName: "",
          firstAdminStatus: "",
          secondAdminId: "",
          secondAdminName: "",
          secondAdminStatus: "",
          continueBrchCode: "",
          createTime: "",
          updateTime: "",
          custNo: "",
          reserve1: "",
          customerName: "",
          certifyType: "",
          certifyNo: "",
          isPlatform: "",
          continueBranchName: ""
        },

        pageInfo: {
          pageNo: 1,
          pageSize: 10
        },
        socCodeRule: [{ test: /^[A-Za-z0-9\-]{18}$/, trigger: "blur", message: "统一社会信用代码为18位只含a-z,A-Z,0-9,-字符" }],
        custNoRule: [{ test: /^[a-zA-Z0-9#]{0,20}$/, trigger: "blur", message: "由小于或等于20位数字或字母组成" }],
        spanLeft: 4,
        spanRight: 20,
        tableRef: "selfTable",
        //给按钮增加权限
        authObj: {
          viewDatail: true //查看详情
        },
        columns: [
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
            title: "id",
            key: "id",
            hiddenCol: true
          },
          {
            title: this.$t("m.i.common.brchCode"),
            key: "brchCode",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          /*{
            title: this.$t("m.i.common.transBrchBankNo"),
            key: "transBrchBankNo",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },*/
          {
            title: this.$t("m.i.common.memberName"),
            key: "memberName",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.common.brchFullNameZh"),
            key: "brchFullNameZh",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.common.brchType"),
            key: "brchType",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "BrchType", params.row.brchType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.common.bankProv"),
            key: "transProvinceCode",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "Province", params.row.transProvinceCode);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.shcpe.brchStatus"),
            key: "brchStatus",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "UserBrchStatus", params.row.brchStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          //新增承接机构全称
          {
            title: "承接机构全称",
            key: "continueBranchName",
            hiddenCol: false,
            ellipsis: false
          },
          //新增同业客户号
          {
            title: this.$t("m.i.shcpe.custNo"),
            key: "custNo",
            hiddenCol: false,
            ellipsis: false
          }
        ],
        currentSelectRow: [],
        currentSelectList: [],
        currentSelectRowInx: [],
        dictMap: new Map(),
        brchTypeList: [],
        brchStatusList: [],
        provinceCodeList: [],
        transBrchClassList: [],
        type: null,
        isRequired: true,
        editWin: false,
        agencyWin: false,
        viewDatailWin: false,
        ifShowMore: false,
        submitFlag: false,
        id: null,
        isCenterBrchList: [{
          value: "1",
          label: "是"
        }, {
          value: "0",
          label: "否"
        }]
      };
    },
    components: {
      BranchDetail: () => import(/* webpackChunkName: "shcpe/cpes/branch/branchDetail" */`@/views/bizViews/shcpe/cpes/branch/branchDetail`)
    },
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
      handleCurrentChange(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = [];
      },
      submitForm() {
        this.$refs["editForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = "/cpes/branch/branchManage/func_updateBranchInfo";
            let msg = this.$t("m.i.common.modifySuccess");
            post(this.editForm, url).then(res => {
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
      agencySubmitForm() {
        this.$refs["agencyForm"].validate(valid => {
          if (valid) {
            if (this.checkForm === null) {
              this.submit();
              return;
            }
            let checkType = this.agencyForm.checkType;
            let coreCustName = this.checkForm.custName;
            let custName = this.currentSelectRow.brchFullNameZh;
            if ("1" === checkType) {
              if (coreCustName !== custName) {
                this.$msgTip.error(this, { info: "直连系统客户名称：" + custName + " 与核心客户名称：" + coreCustName + " 不一致，不允许保存。" });
              } else {
                this.submit();
              }
            } else if ("2" === checkType) {
              if (coreCustName !== custName) {
                this.$hMsgBox.confirm({
                  title: "核心校验",
                  content: "直连系统客户名称：" + custName + "与核心客户名称：" + coreCustName + "不一致，是否提交?",
                  onOk: () => {
                    this.submit();
                  }
                });
              } else {
                this.submit();
              }
            } else {
              this.submit();
            }
          }
        });
      },
      submit() {
        this.submitFlag = true;
        let url = "/cpes/branch/branchManage/func_updateBranchInfo";
        let msg = this.$t("m.i.common.modifySuccess");
        post(this.agencyForm, url).then(res => {
          this.submitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this, { info: msg });
              this.agencyWin = false;
              this.$refs.datagrid.dataChange(1);
              this.currentSelectRow = [];
              this.currentSelectList = [];
            } else {
              let msg = this.$t("m.i.common.modifyFailed");
              this.$msgTip.error(this, { info: msg + ":" + res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      // 查看详情
      branchDetail() {
        if (this.currentSelectRow != null && this.currentSelectRow.length != 0) {
          this.viewDatailWin = true;
          this.id = this.currentSelectRow.id;
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      //修改全市场机构
      handleEditForm() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (this.currentSelectRow.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        let id = this.currentSelectRow.id;
        post({ id: id }, "/cpes/branch/queryBranchInfo").then(res => {
          if (res.data.retCode === "000000") {
            this.editForm = res.data.retData;
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
        this.editWin = true;
      },
      //补录同业客户信息
      handleAgencyForm() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (this.currentSelectRow.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        let id = this.currentSelectRow.id;
        post({ id: id }, "/cpes/branch/branchManage/func_agencyInformationSupply").then(res => {
          if (res.data.retCode === "000000") {
            this.agencyForm = res.data.retData;
            this.agencyForm.custNo="";
            this.agencyForm.cpesBrchRemark="";
            this.checkForm = null;
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
        this.agencyWin = true;
      },
      //同步
      agencySupply() {
        let brchCode = this.agencyForm.brchCode;
        post({ brchCode: brchCode }, "/cpes/branch/branchManage/func_queryMemberCustomerNo").then(res => {
          if (res.data.retCode === "000000") {
            this.agencyForm.custNo = res.data.retData.custNo;
            this.agencyForm.customerName = res.data.retData.custName;
            // this.agencyForm.certifyType = res.data.retData.certifyType;
            // this.agencyForm.certifyNo = res.data.retData.certifyNo;
            this.checkForm = res.data.retData;
            this.checkForm.custName = res.data.retData.custName;
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      handleWinClose() {
        this.editWin = false;
        this.$refs.editForm.resetFields();
      },
      agencyWinClose() {
        this.agencyWin = false;
        this.$refs.agencyForm.resetFields();
      },
      branchDatailWinClose() {
        this.viewDatailWin = false;
      }
    },
    mounted() {
      //新增省份下拉框
      this.getDictListByGroups("BrchType,UserBrchStatus,Province,BrchClass").then(res => {
        this.brchTypeList = res.get("BrchType");
        this.brchStatusList = res.get("UserBrchStatus");
        this.provinceCodeList = res.get("Province");
        this.transBrchClassList = res.get("BrchClass");
        this.dictMap = res.get("map");
      });
    }
  };
</script>
