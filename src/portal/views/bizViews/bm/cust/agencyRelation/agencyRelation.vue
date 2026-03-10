<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.byAgencyBankNo')" prop="byAgencyBankNo">
                  <h-input v-model="formItem.byAgencyBankNo" :maxlength=12 placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.byAgencyBankName')" prop="byAgencyBankName">
                  <h-input v-model="formItem.byAgencyBankName" :maxlength=60 placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.byAgencyBankAcctNo')" prop="byAgencyBankAcctNo">
                  <h-input v-model="formItem.byAgencyBankAcctNo" :maxlength=32 placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.agencyBankNo')" prop="agencyBankNo">
                  <h-input v-model="formItem.agencyBankNo" :maxlength=12 placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.agencyBankName')" prop="agencyBankName">
                  <h-input v-model="formItem.agencyBankName" :maxlength=60 placeholder=""></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
              :columns="columns"
              highlight-row
              url="/bm/cust/agencyrelation/agencyRelation/func_queryPageAgencyRelation"
              :bindForm="formItem"
              :hasSelect="false"
              rowSelect
              ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleAddForm('add')" v-if="authObj.bizSetRoleAdd">
                {{$t("m.i.common.add")}}
              </h-button>
              <h-button type="primary" @click="handleAddForm('modify')" v-if="authObj.bizSetRoleAdd">
                {{$t("m.i.common.modify")}}
              </h-button>
              <h-button type="primary" @click="handleComfirm()" v-if="authObj.bizSetRoleDelete"
                        :disabled="deletDisabled">{{$t("m.i.common.delete")}}
              </h-button>
            </div>

          </h-datagrid>

        </div>
      </h-col>
    </h-row>

    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" class="h-form-search-layer" :maximize="true" :mask-closable="false">
      <p slot="header">
        <span v-if="type=='add'">新增代理关系</span>
        <span v-if="type=='modify'">修改代理关系</span>
        <span v-if="type=='view'">查看代理关系</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="120" ref="addForm" cols="2" class="h-form-search">
          <!--
          <h-form-item :label="$t('m.i.common.byAgencyBankName')" prop="byAgencyBankName" :required="isRequired">
            <h-input v-if="type=='view'" :value="addForm.byAgencyBankName" class="input-boder-0"
                     :title="addForm.byAgencyBankName"></h-input>
            <h-input v-else v-model="addForm.byAgencyBankName" :maxlength=60 :placeholder="''"></h-input>
          </h-form-item>-->
          <show-cpes-branch :label="$t('m.i.common.byAgencyBankName')"
                            :bankNo.sync="addForm.byAgencyBankNo" :cpesBrchName.sync="addForm.byAgencyBankName"
                            :filterable="type!=='view'" prop="byAgencyBankNo" :isInitValueClearable="true"
                            :required="isRequired" :msgBoxWin="addOrEditWin" :isQueryByBankNo="true"
                            datagridUrl="/cpes/branch/queryBranchList"
                            queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

          <h-form-item :label="$t('m.i.common.byAgencyBankNo')" prop="byAgencyBankNo" :required="isRequired" :validRules="bankNoRule">
            <h-input v-if="type=='view'" :value="addForm.byAgencyBankNo" class="input-boder-0"
                     :title="addForm.byAgencyBankNo" readonly></h-input>
            <h-input v-else v-model="addForm.byAgencyBankNo" :maxlength=12 :placeholder="'12位数字'" readonly></h-input>
          </h-form-item>


          <h-form-item :label="$t('m.i.common.byAgencyBankAcctNo')" prop="byAgencyBankAcctNo" :required="isRequired" :validRules="acctNoRule">
            <h-input v-if="type=='view'" :value="addForm.byAgencyBankAcctNo" class="input-boder-0"
                     :title="addForm.byAgencyBankAcctNo"></h-input>
            <h-input v-else v-model="addForm.byAgencyBankAcctNo" :maxlength=32 :placeholder="'32位以下字母或数字'"></h-input>
          </h-form-item>

          <!--<h-form-item :label="$t('m.i.common.agencyBankNo')" prop="agencyBankNo" :required="isRequired" :validRules="bankNoRule">
            <h-input v-if="type=='view'" :value="addForm.agencyBankNo" class="input-boder-0"
                     :title="addForm.agencyBankNo"></h-input>
            <h-input v-else v-model="addForm.agencyBankNo" :maxlength=12 :placeholder="'12位数字'" icon="android-search" @on-click="brchCodeWinOpen('agencyBankNo')"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.agencyBankName')" prop="agencyBankName" :required="isRequired">
            <h-input v-if="type=='view'" :value="addForm.agencyBankName" class="input-boder-0"
                     :title="addForm.agencyBankName"></h-input>
            <h-input v-else v-model="addForm.agencyBankName" :maxlength=60 :placeholder="''"></h-input>
          </h-form-item>-->
          <show-cpes-branch :label="$t('m.i.common.agencyBankName')"
                            :bankNo.sync="addForm.agencyBankNo" :cpesBrchName.sync="addForm.agencyBankName"
                            :filterable="type!=='view'" prop="agencyBankName" :isInitValueClearable="true"
                            :required="isRequired" :msgBoxWin="addOrEditWin" :isQueryByBankNo="true"
                            datagridUrl="/cpes/branch/queryBranchList"
                            queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

          <h-form-item :label="$t('m.i.common.agencyBankNo')" prop="agencyBankNo" :required="isRequired" :validRules="bankNoRule">
            <h-input v-if="type=='view'" :value="addForm.agencyBankNo" class="input-boder-0"
                     :title="addForm.agencyBankNo" readonly></h-input>
            <h-input v-else v-model="addForm.agencyBankNo" :maxlength=12 :placeholder="'12位数字'" readonly></h-input>
          </h-form-item>


        </h-form>
      </h-panel>
      <div slot="footer" v-if="type!='view'">
        <!--<h-button type="ghost" style="margin:0 8px"  @click="addOrEditWin=!addOrEditWin">{{$t("m.i.common.close")}}</h-button>-->
        <h-button type="ghost" @click="addOrEditWin=!addOrEditWin">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm()">{{$t("m.i.common.confirm")}}</h-button>
      </div>
      <div slot="footer" v-else>
        <h-button type="primary" @click="addOrEditWin=!addOrEditWin">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>

    <!--<brch-code-search :brchCodeWin="brchCodeWin" @brchCodeWinClose="brchCodeWin=false"
                      @brchCodeChange="brchCodeChange" optType="2"></brch-code-search>-->

  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "agencyRelation",
    components: {
      //BrchCodeSearch:()=>import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`)
    },
    data() {
      return {
        authObj: {
          bizSetRoleAdd: true, //角色添加
          bizSetRoleDelete: true, //角色删除
          bizSetRoleORight: true, //角色操作权限
          bizSetRoleARight: true, //角色授权权限
          bizRoleRightSet: true, //角色权限处理
          bizRoleRightCopy: true, //角色权限复制
          bizSetRoleDownload: true //角色信息下载
        },
        // 是否显示新增或修改窗口
        addOrEditWin: false,
        formItem: {
          byAgencyBankNo : '',
          byAgencyBankName : '',
          byAgencyBankAcctNo : '',
          agencyBankNo : '',
          agencyBankName : '',
        },
        addForm: {
          id: "",
          legalNo: "",
          byAgencyBankNo: "",
          byAgencyBankName: "",
          byAgencyBankAcctNo: "",
          agencyBankNo: "",
          agencyBankName: "",
          createTellerName: "",
          createBrchNo: "",
          createBrchName: "",
          reserve1: "",
          reserve2: "",
          reserve3: "",
          createTime: "",
          updateTime: ""
        },
        columns: [
          {
            type: "selection",
            width: 60,
            key: "duoxuan",
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
            title: this.$t('m.i.common.byAgencyBankNo'),
            key: "byAgencyBankNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.byAgencyBankName'),
            key: "byAgencyBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.byAgencyBankAcctNo'),
            key: "byAgencyBankAcctNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.agencyBankNo'),
            key: "agencyBankNo",
            sortable: true,
            hiddenCol: false

          },
          {
            title: this.$t('m.i.common.agencyBankName'),
            key: "agencyBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.createDt'),
            key: "createTime",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = "";
              if (params.row.createTime != null) {
                date = params.row.createTime.toString().substring(0, 8);
              }
              return h("span", this.$moment(date, "YYYY-MM-DD").format("YYYY-MM-DD"));
            }
          },
          {
            title: this.$t('m.i.common.createTellerName'),
            key: "createTellerName",
            hiddenCol: false

          },
          {
            title: this.$t('m.i.common.createBrchNo'),
            key: "createBrchNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.createBrchName'),
            key: "createBrchName",
            hiddenCol: false
          }
        ],
        type: null,
        readonly: false,
        isRequired: true,
        deletDisabled: false,
        submitFlag: false,
        copyWin: false,
        //brchCodeWin: false,
        submitWin: false,
        submitMsg: "",
        submitTitle: "",
        retMsg: "",
        ifShowMore: false,
        bankNoRule: [{ test: /^[0-9]{12}$/, trigger: "blur", message: "大额行号由12位数字组成" }],
        acctNoRule: [{ test: /^[a-zA-Z0-9]{1,32}$/, trigger: "blur", message: "账号只能输入字母或数字" }],
        chooseType:""
      };
    },
    methods: {
      /*brchCodeWinOpen(type){
        this.chooseType=type;
        this.brchCodeWin=true;
      },*/
      /*brchCodeChange(info){
        if (this.chooseType==="byAgencyBankNo"){
          //被代理行号点击的
          this.addForm.byAgencyBankNo=info.transBrchBankNo;
          this.addForm.byAgencyBankName=info.brchFullNameZh;
        }else if (this.chooseType==="agencyBankNo"){
          //代理行号点击的
          this.addForm.agencyBankNo=info.transBrchBankNo;
          this.addForm.agencyBankName=info.brchFullNameZh;
        }
        this.brchCodeWin = false;
      },*/
      addFormReset() {
        this.$refs.addForm.resetFields();
        this.addForm.id = "";
      },
      handleAddForm(str) {
        this.type = str;
        this.readonly = false;
        this.isRequired = true;
        if (this.type == "modify" || this.type == "view") {
          let list = this.$refs.datagrid.selects;
          if (!list || list.length !== 1) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            return;
          }
          if (this.type == "modify") {
            this.readonly = true;
            let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
            if (userInfo.brchNo != list[0].createBrchNo) {
              this.$msgTip.info(this, { info: "只有创建机构能进行此操作" });
              return;
            }
          }
          if (this.type == "view") {
            this.isRequired = false;
          }
          this.$nextTick(() => {
            this.addForm.id = list[0].id;
            this.addForm.legalNo = list[0].legalNo;
            this.addForm.byAgencyBankNo = list[0].byAgencyBankNo;
            this.addForm.byAgencyBankName = list[0].byAgencyBankName;
            this.addForm.byAgencyBankAcctNo = list[0].byAgencyBankAcctNo;
            this.addForm.agencyBankNo = list[0].agencyBankNo;
            this.addForm.agencyBankName = list[0].agencyBankName;
            this.addForm.createTellerName = list[0].createTellerName;
            this.addForm.createBrchNo = list[0].createBrchNo;
            this.addForm.createBrchName = list[0].createBrchName;
            this.addForm.reserve1 = list[0].reserve1;
            this.addForm.reserve2 = list[0].reserve2;
            this.addForm.reserve3 = list[0].reserve3;
            this.addForm.createTime = list[0].createTime;
            this.addForm.updateTime = list[0].updateTime;
          });
        } else {
          this.$nextTick(() => {
            this.addFormReset();
          });
        }
        this.addOrEditWin = true;
      },
      unDisabled() {
        this.deletDisabled = false;
      },
      formSearch() {
        this.unDisabled();
        this.$refs.datagrid.dataChange(1);
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      submitForm() {
        let btnType = this.type;
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            // 新增或修改的url
            let url = this.type == "add" ? "/bm/cust/agencyrelation/agencyRelation/func_saveAgencyRelation" : "/bm/cust/agencyrelation/agencyRelation/func_updateAgencyRelation";
            let msg = this.type == "add" ? this.$t("m.i.common.addSuccess") : this.$t("m.i.common.modifySuccess");
            let pageNo = this.type === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
            this.submitFlag = true;
            this.submitMsg = msg;
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  // this.$hMessage.success(msg)
                  this.addOrEditWin = false;
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(pageNo);
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
                  this.retMsg = "";
                } else {
                  // this.submitMsg = this.type=="add"?this.$t('m.i.common.addFailed'):this.$t('m.i.common.modifyFailed');
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }

            });
          }
        });
      },
      handleComfirm() {
        let list = this.$refs.datagrid.selects;
        if (list != null && list.length > 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmDelete") + "?",
            onOk: () => {
              this.handledel();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }

      },
      handledel() {
        post({ ids: this.$refs.datagrid.selectIds }, "/bm/cust/agencyrelation/agencyRelation/func_deleteAgencyRelation").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              // this.$hMessage.success(this.$t('m.i.common.deleteSuccess'))
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.selectIds = [];
              this.retMsg = "";
            } else {
              // this.$hMessage.error(this.$t('m.i.common.deleteFailed')+res.data.retMsg)
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            // this.$hMessage.error(this.$t('m.i.common.netError'))
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      }

    }

  };
</script>

<style scoped>

</style>
