<!--极速贴现规则-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <!--右侧数据展示表格-->
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="91" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="fdiscMode" :label="$t('m.i.common.fdiscMode')" required >
                  <h-select v-model="formItem.fdiscMode" placeholder="">
                    <h-option v-for="item in fdiscModeList" :value="item.key" :key="item.key">{{item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.legalpersonName')" prop="legalNo" v-if="isShow">
                  <h-input v-model="formItem.legalpersonName" readonly icon="android-search"
                           @on-click="queryLegalPersonName" :maxlength="60" clearable @on-clear="clearVal()"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.ruleCode')" prop="ruleCode">
                  <h-input v-model="formItem.ruleCode" :maxlength="100"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.ruleName')" prop="ruleName">
                  <h-input v-model="formItem.ruleName" :maxlength="100"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.ruleStatus')" prop="ruleStatus">
                  <h-select v-model="formItem.ruleStatus" placeholder="">
                    <h-option value="0">失效</h-option>
                    <h-option value="1">生效</h-option>
                  </h-select>
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
            url="/ce/disc/elec/fastdisc/discRule/func_queryDiscRuleInfoByCondition"
            :bindForm="formItem"
            :row-select="true"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleDiscRuleDistribute" v-if="isShow">
                {{$t("m.i.common.allot")}}
              </h-button>
              <h-button type="primary" @click="handleDiscRuleModifyForm">
                {{$t("m.i.common.modify")}}
              </h-button>
              <h-button type="primary" @click="handleComfirm">
                {{$t("m.i.common.delete")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--点击修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" :mask-closable="false" @on-close="handleWinClose"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span>修改极速贴现规则</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.ce.ruleCode')" prop="ruleCode" :required="isRequired">
            <h-input v-model="addForm.ruleCode" :maxlength="100" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.ruleName')" prop="ruleName" :required="isRequired">
            <h-input v-model="addForm.ruleName" :maxlength="100" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.ruleBean')" :required="isRequired">
            <h-input v-model="addForm.ruleBean" :maxlength="100" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.fdiscMode')" prop="fdiscModeName" :required="isRequired" >
            <h-input v-model="addForm.fdiscModeName" :maxlength="100" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.ruleStatus')" prop="ruleStatus" :required="isRequired">
            <h-select v-model="addForm.ruleStatus" placeholder="" showTitle>
              <h-option value="0">失效</h-option>
              <h-option value="1">生效</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.ruleValue')" prop="ruleValue">
            <h-input v-model="addForm.ruleValue" :maxlength="100"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.ruleDesc')" prop="ruleDesc" class="h-form-height-auto">
            <h-input type="textarea" :rows=3 v-model="addForm.ruleDesc" :canResize="false"
                     :maxlength="125"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.flowFuncNo')" prop="flowFuncNo" >
            <h-input v-model="addForm.flowFuncNo" :maxlength="100" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.flowFuncName')" prop="flowFuncName" >
            <h-input v-model="addForm.flowFuncName" :maxlength="100" readonly></h-input>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="handleWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm">{{$t("m.i.common.commit")}}</h-button>

      </div>
    </h-msg-box>
    <legal-person-search :showLegalPersonWin="showLegalPersonWin" @legalPersonChange="legalPersonChange"
                         @legalPersonWinClose="legalPersonWinClose"></legal-person-search>
    <distribute-disc-rule :distributeDiscRuleWin="distributeDiscRuleWin" :discRuleIds="discRuleIds"
                      @distributeDiscRuleWinClose="distributeDiscRuleWinClose"
                      @distributeDiscRuleSubmit="distributeDiscRuleSubmit"></distribute-disc-rule>
  </div>
</template>

<script>
  import { post } from "@/api/bizApi/commonUtil";

  export default {
    name: "discRule",
    data() {
      return {
        formItem : {
          legalNo: "",
          legalpersonName: "",
          ruleCode: "",
          ruleName: "",
          fdiscMode:"000000",
          ruleStatus:"",
        },
        columns : [
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
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.legalNo"),
            key: "legalNo",
            hiddenCol: false,
            ellipsis: false,
            sortable: JSON.parse(window.sessionStorage.getItem("userInfo")).userType === "1"
          },
          {
            title: this.$t("m.i.ce.ruleCode"),
            key: "ruleCode",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
              title: this.$t("m.i.ce.ruleName"),
            key: "ruleName",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
              title: this.$t("m.i.ce.ruleBean"),
            key: "ruleBean",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.common.fdiscMode"),
            key: "fdiscModeName",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.ce.ruleStatus"),
            key: "ruleStatus",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let ruleStatus = params.row.ruleStatus;
              switch (params.row.ruleStatus) {
                case "0":
                  ruleStatus = "失效";
                  break;
                case "1":
                  ruleStatus = "生效";
                  break;
              }
              return h("span", ruleStatus);
            }
          },
          {
              title: this.$t("m.i.ce.ruleValue"),
            key: "ruleValue",
            hiddenCol: false,
            ellipsis: false
          },
          {
              title: this.$t("m.i.ce.ruleDesc"),
            key: "ruleDesc",
            hiddenCol: false,
            ellipsis: false
          },
          {
              title: this.$t("m.i.ce.flowFuncNo"),
            key: "flowFuncNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
              title: this.$t("m.i.ce.flowFuncName"),
            key: "flowFuncName",
            ellipsis: false,
            hiddenCol: false
          }
        ],
        currentSelectList : [],
        isRequired : true,
        addOrEditWin : false,
        submitFlag : false,
        addForm : {
          id: "",
          legalNo: "",
          ruleCode: "",
          ruleName: "",
          ruleBean: "",
          ruleStatus: "",
          ruleValue: "",
          ruleDesc: "",
          flowFuncNo: "",
          flowFuncName: "",
          fdiscMode: "",
          fdiscModeName: ""
        },
        //查询法人弹出框
        showLegalPersonWin : false,
        //分配贴现规则弹出框
        distributeDiscRuleWin : false,
        ifShowMore : false,
        //选中贴现规则ID
        discRuleIds : "",
        dictMap:new Map(),
        fdiscModeList:[]
      };
    },
    components: {
      DistributeDiscRule:() => import(/* webpackChunkName: "ce/disc/elec/fastdisc/distributeDiscRule" */`@/views/bizViews/ce/disc/elec/fastdisc/distributeDiscRule`),
      LegalPersonSearch:() => import(/* webpackChunkName: "sm/auth/legalperson/legalPersonSearch" */`@/views/bizViews/sm/auth/legalperson/legalPersonSearch`)
    },
    computed: {
      isShow() {
        let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
        let userType = userInfo.userType;
        if (userType === "1") {
          return true;
        } else {
          this.formItem.legalNo = userInfo.legalNo;
          return false;
        }
      },
    },
    methods: {
      formSearch() {
        this.$refs["formItem"].validate(valid => {
            if (valid) {
              this.currentSelectList = [];
              this.$refs.datagrid.dataChange(1);
            }
        });

      },
      formSearchReset() {
        let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
        let userType = userInfo.userType;
        if (userType === "1") {
          this.formItem.legalNo = "";
          this.formItem.legalpersonName = "";
        }
        this.$refs.formItem.resetFields();
      },
      handleWinClose() {
        this.addOrEditWin = false;
        this.$refs.addForm.resetFields();
      },
      //分配贴现规则
      handleDiscRuleDistribute() {
        this.currentSelectList = this.$refs.datagrid.selects;
        let list = this.currentSelectList;
        if (list != null && list.length > 0) {
          let discRuleIds = "";
          for (let i = 0; i < list.length; i++) {
            if ("000000" !== list[i].legalNo) {
              this.$msgTip.info(this, { info: "非法人[000000]的规则不可分配，请重新选择记录!" });
              return false;
            }
            discRuleIds += list[i].id;
            if (i < list.length - 1) {
              discRuleIds += ",";
            }
          }
          this.distributeDiscRuleWin = true;
          this.discRuleIds = discRuleIds;
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
        }
      },
      //修改贴现规则
      handleDiscRuleModifyForm() {
        this.isRequired = true;
        this.currentSelectList = this.$refs.datagrid.selects;
        if (this.currentSelectList != null && this.currentSelectList.length !== 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          this.addOrEditWin = false;
          return false;
        } else {
            let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
            let userType = userInfo.userType;
            if (userType === "1" && "000000" !== this.currentSelectList[0].legalNo) {
              this.$msgTip.info(this, { info: "非法人[000000]的规则不可修改，请重新选择记录!" });
              return false;
            }else {
              this.addOrEditWin = true;
              this.$nextTick(() => {
                this.$refs.addForm.resetFields();
                this.addForm.id = this.currentSelectList[0].id;
                this.addForm.legalNo = this.currentSelectList[0].legalNo;
                this.addForm.ruleCode = this.currentSelectList[0].ruleCode;
                this.addForm.ruleName = this.currentSelectList[0].ruleName;
                this.addForm.ruleBean = this.currentSelectList[0].ruleBean;
                this.addForm.fdiscMode = this.currentSelectList[0].fdiscMode;
                this.addForm.fdiscModeName = this.currentSelectList[0].fdiscModeName;
                this.addForm.ruleStatus = this.currentSelectList[0].ruleStatus;
                this.addForm.ruleValue = this.currentSelectList[0].ruleValue;
                this.addForm.ruleDesc = this.currentSelectList[0].ruleDesc;
                this.addForm.flowFuncNo = this.currentSelectList[0].flowFuncNo;
                this.addForm.flowFuncName = this.currentSelectList[0].flowFuncName;
              });
            }
        }
      },
      //删除贴现规则
      handleComfirm() {
        this.currentSelectList = this.$refs.datagrid.selects;
        let list = this.currentSelectList;
        if (list != null && list.length >0) {
          let paramIds = "";
          for (let i = 0; i < list.length; i++) {
            let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
            let userType = userInfo.userType;
            if (userType === "1" && "000000" !== list[i].legalNo) {
              this.$msgTip.info(this, { info: "非法人[000000]的规则不可删除，请重新选择记录!" });
              return false;
            }
            paramIds += list[i].id;
            if (i < list.length - 1) {
              paramIds += ",";
            }
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmDelete") + "?",
            onOk: () => {
              this.handleDel(paramIds);
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
        }
      },
      handleDel(paramIds) {
        post({ code: paramIds }, "/ce/disc/elec/fastdisc/discRule/func_deleteDiscRuleInfoById").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectList = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      submitForm() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = "/ce/disc/elec/fastdisc/discRule/func_updateDiscRuleInfoByCondition";
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.addOrEditWin = false;
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
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
      clearVal() {
        let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
        let userType = userInfo.userType;
        if (userType === "1") {
          this.formItem.legalNo = "";
          this.formItem.legalpersonName = "";
        }
      },
      //查询法人弹出框
      queryLegalPersonName() {
        this.showLegalPersonWin = true;
      },
      legalPersonChange(info) {
        this.formItem.legalNo = info.legalNo;
        this.formItem.legalpersonName = info.legalpersonName;
        this.showLegalPersonWin = false;
      },
      legalPersonWinClose() {
        this.showLegalPersonWin = false;
      },
      distributeDiscRuleWinClose() {
        this.discRuleIds = "";
        this.distributeDiscRuleWin = false;
      },
      distributeDiscRuleSubmit() {
        this.discRuleIds = "";
        this.distributeDiscRuleWin = false;
        this.$refs.datagrid.dataChange(1);
        this.currentSelectList = [];
      }
    },
    mounted() {
      this.getDictListByGroups("FDiscMode").then(res => {
        this.fdiscModeList = res.get("FDiscMode");
        this.dictMap = res.get("map");
      });
    },
  };
</script>

<style scoped>

</style>
