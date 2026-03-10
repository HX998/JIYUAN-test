<!-- 法人业务参数管理 -->
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
                <h-form-item :label="$t('m.i.common.legalpersonName')" prop="legalNo" v-if="isShow">
                  <h-input v-show="false" :value="formItem.legalNo" readonly
                           :placeholder="$t('m.i.common.legalNo')" :maxlength="6"></h-input>
                  <h-input v-model="formItem.legalpersonName" readonly icon="android-search"
                           @on-click="queryLegalPersonName" :maxlength="60" clearable @on-clear="clearVal()"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.auth.paramTitle')" prop="paramTitle">
                  <h-select v-model="formItem.paramTitle" placeholder="">
                    <h-option v-for="item in paramTitleList" :value="item" :key="item">{{ item }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.auth.paramKey')" prop="paramKey">
                  <h-input v-model="formItem.paramKey" :maxlength="50"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.auth.paramName')" prop="paramName">
                  <h-input v-model="formItem.paramName" :maxlength="100"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore" v-if="isShow">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
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
            url="/sm/auth/parameter/businessParameter/func_pageQueryBusinessParameter"
            :bindForm="formItem"
            :row-select="true"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleParamDistribute" v-if="isShow">
                {{$t("m.i.common.allot")}}
              </h-button>
              <h-button type="primary" @click="handleParamModifyForm">
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
        <span>修改业务参数</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.auth.paramKey')" prop="paramKey" :required="isRequired">
            <h-input v-model="addForm.paramKey" :maxlength="50" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.auth.paramTitle')" prop="paramTitle" :required="isRequired">
            <h-input v-model="addForm.paramTitle" :maxlength="100" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.auth.paramType')" prop="paramType" :required="isRequired">
            <h-select v-model="addForm.paramType" placeholder="" readonly>
              <h-option value="0">文本框输入</h-option>
              <h-option value="1">下拉框</h-option>
              <h-option value="2">复选框</h-option>
              <h-option value="3">密文</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.auth.paramName')" prop="paramName" :required="isRequired">
            <h-input v-model="addForm.paramName" :maxlength="100" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.paramValue')" prop="paramValue" :required="isRequired">
            <h-input v-model="addForm.paramValue" :maxlength="150" v-if="addForm.paramType==='0'"></h-input>
            <h-select v-model="addForm.paramValue" placeholder="" v-else-if="addForm.paramType==='1'">
              <h-option v-for="item in paramValueList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-model="addForm.paramValue" placeholder="" v-else-if="addForm.paramType==='2'" multiple showTitle>
              <h-option v-for="item in paramValueList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-input v-model="addForm.paramValue" placeholder="" readonly icon="android-search" v-else-if="addForm.paramType==='3'"
                     @on-click="paramValueEncryptionWinOpen"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.auth.paramRemark')" prop="paramRemark" class="h-form-height-auto">
            <h-input type="textarea" :rows=3 v-model="addForm.paramRemark" :canResize="false"
                     :maxlength="500" readonly></h-input>
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
    <distribute-param :distributeParamWin="distributeParamWin" :paramIds="paramIds"
                      @distributeParamWinClose="distributeParamWinClose"
                      @distributeParamSubmit="distributeParamSubmit"></distribute-param>
    <param-value-encryption :paramValueEncryptionWin="paramValueEncryptionWin"
                          @paramValueEncryptionWinClose="paramValueEncryptionWinClose"
                          @paramValueEncryptionSubmit="paramValueEncryptionSubmit"></param-value-encryption>
  </div>
</template>

<script>
  import { post } from "@/api/bizApi/commonUtil";

  export default {
    name: "businessParameter",
    data() {
      return {
        formItem: {
          legalNo: "",
          legalpersonName: "",
          paramTitle: "",
          paramKey: "",
          paramName: ""
        },
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
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.legalNo"),
            key: "legalNo",
            hiddenCol: false,
            ellipsis: false,
            sortable: this.$store.getters.userInfo.userType === "1"
          },
          {
            title: this.$t("m.i.common.legalpersonName"),
            key: "legalPersonName",
            hiddenCol: false,
            ellipsis: false,
            sortable: this.$store.getters.userInfo.userType === "1"
          },
          {
            title: this.$t("m.i.auth.paramKey"),
            key: "paramKey",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.auth.paramName"),
            key: "paramName",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.paramValue"),
            key: "paramValue",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.auth.paramTitle"),
            key: "paramTitle",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.updateTime"),
            key: "updateTime",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.updateTime == null ? "" : this.$moment(params.row.updateTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.auth.paramRemark"),
            key: "paramRemark",
            ellipsis: false,
            hiddenCol: false
          }
        ],
        currentSelectList: [],
        isRequired: true,
        addOrEditWin: false,
        submitFlag: false,
        addForm: {
          id: "",
          legalNo: "",
          paramKey: "",
          paramTitle: "",
          paramName: "",
          paramType: "",
          paramValue: [],
          paramRemark: "",
          paramGroupCode: ""
        },
        //查询法人弹出框
        showLegalPersonWin: false,
        //分配业务参数弹出框
        distributeParamWin: false,
        ifShowMore: false,
        //选中业务参数ID
        paramIds: "",
        //筛选出的参数主题
        paramTitleList: [],
        //参数值下拉框数据
        paramValueList: [],
        paramValueEncryptionWin:false
      };
    },
    components: {
      DistributeParam: () => import(/* webpackChunkName: "sm/auth/parameter/distributeParam" */`@/views/bizViews/sm/auth/parameter/distributeParam`),
      LegalPersonSearch: () => import(/* webpackChunkName: "sm/auth/legalperson/legalPersonSearch" */`@/views/bizViews/sm/auth/legalperson/legalPersonSearch`),
      ParamValueEncryption: () => import(/* webpackChunkName: "sm/auth/parameter/paramValueEncryption" */`@/views/bizViews/sm/auth/parameter/paramValueEncryption`)
    },
    watch: {},
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
      }
    },
    methods: {
      //查询所有参数主题，用于填充下拉框
      queryParamTitles() {
        post({}, "/sm/auth/parameter/businessParameter/func_queryParamTitle").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.paramTitleList = res.data.retData;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      formSearch() {
        this.currentSelectList = [];
        this.$refs.datagrid.dataChange(1);
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
        this.addForm.paramGroupCode = "";
        this.$refs.addForm.resetFields();
      },
      //分配业务参数
      handleParamDistribute() {
        this.currentSelectList = this.$refs.datagrid.selects;
        let list = this.currentSelectList;
        if (list != null && list.length > 0) {
          let paramIds = "";
          for (let i = 0; i < list.length; i++) {
            if ("000000" !== list[i].legalNo) {
              this.$msgTip.info(this, { info: "非法人[000000]的参数不可分配，请重新选择记录!" });
              return false;
            }
            paramIds += list[i].id;
            if (i < list.length - 1) {
              paramIds += ",";
            }
          }
          this.distributeParamWin = true;
          this.paramIds = paramIds;
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
        }
      },
      //修改业务参数
      handleParamModifyForm() {
        this.currentSelectList = this.$refs.datagrid.selects;
        if (this.currentSelectList === null || this.currentSelectList.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          this.addOrEditWin = false;
          return false;
        }
        if (this.currentSelectList[0].paramType==="2") {
          this.isRequired = false;
        } else {
          this.isRequired = true;
        }
        if (this.currentSelectList != null && this.currentSelectList.length !== 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          this.addOrEditWin = false;
          return false;
        } else {
          let currentSelectRow = this.currentSelectList[0];
          let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
          let userType = userInfo.userType;
          if (userType === "1" && "000000" !== currentSelectRow.legalNo) {
            this.$msgTip.info(this, { info: "非法人[000000]的参数不可修改，请重新选择记录!" });
            return false;
          }
          this.addOrEditWin = true;
          this.$nextTick(() => {
            this.paramValueList = [];
            this.$refs.addForm.resetFields();
            this.addForm.id = currentSelectRow.id;
            this.addForm.legalNo = currentSelectRow.legalNo;
            this.addForm.paramKey = currentSelectRow.paramKey;
            this.addForm.paramTitle = currentSelectRow.paramTitle;
            this.addForm.paramName = currentSelectRow.paramName;
            this.addForm.paramType = currentSelectRow.paramType;
            this.paramTypeChange(this.addForm.paramType, currentSelectRow);
            this.addForm.paramRemark = currentSelectRow.paramRemark;
            this.addForm.paramGroupCode = currentSelectRow.paramGroupCode;

          });
        }
      },
      //删除业务参数
      handleComfirm() {
        this.currentSelectList = this.$refs.datagrid.selects;
        let list = this.currentSelectList;
        if (list != null && list.length > 0) {
          let paramIds = "";
          for (let i = 0; i < list.length; i++) {
            let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
            let userType = userInfo.userType;
            if (userType === "1" && "000000" !== list[i].legalNo) {
              this.$msgTip.info(this, { info: "非法人[000000]的参数不可删除，请重新选择记录!" });
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
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      handleDel(paramIds) {
        post({ ids: paramIds }, "/sm/auth/parameter/businessParameter/func_deleteByIds").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectList = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      submitForm() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = "/sm/auth/parameter/businessParameter/func_updateBusinessParameter";
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
      distributeParamWinClose() {
        this.paramIds = "";
        this.distributeParamWin = false;
      },
      distributeParamSubmit() {
        this.paramIds = "";
        this.distributeParamWin = false;
        this.currentSelectList = [];
        this.$refs.datagrid.dataChange(1);
      },
      paramTypeChange(currentValue, currentSelectRow) {
        if (currentValue === "1") {
          post({ code: this.currentSelectList[0].paramGroupCode }, "/sm/auth/parameter/businessParameter/func_getParamDictByGroupCode").then(res => {
            if (res) {
              this.addForm.paramValue = currentSelectRow.paramValue;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.paramValueList = res.data.retData;
              } else {
                this.paramValueList = [];
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        } else if (currentValue==="2") {
          post({ code: this.currentSelectList[0].paramGroupCode }, "/sm/auth/parameter/businessParameter/func_getParamDictByGroupCode").then(res => {
            if (res) {
              if (!!currentSelectRow.paramValue) {
                this.addForm.paramValue = currentSelectRow.paramValue.split(",");
              }
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.paramValueList = res.data.retData;
              } else {
                this.paramValueList = [];
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        } else {
          this.addForm.paramValue = currentSelectRow.paramValue;
        }
      },
      paramValueEncryptionWinOpen(){
        this.paramValueEncryptionWin=true;
      },
      paramValueEncryptionWinClose(){
        this.paramValueEncryptionWin=false;
      },
      paramValueEncryptionSubmit(value){
        this.addForm.paramValue=value;
        this.paramValueEncryptionWin=false;
      }
    },
    mounted() {
      this.queryParamTitles();
    }
  };
</script>

<style scoped>

</style>
