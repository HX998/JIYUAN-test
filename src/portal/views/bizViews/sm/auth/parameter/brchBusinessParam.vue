<!--机构业务权限管理-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--    <h-form-item :label="$t('m.i.common.brchNo')" prop="brchNo">
                      <h-input v-model="formItem.brchNo" readonly :maxlength="10" icon="android-search"
                               @on-click="queryBrchNo('query')" clearable @on-clear="clearVal('query')"></h-input>
                    </h-form-item>
                    <h-form-item :label="$t('m.i.common.brchName')" prop="brchName">
                      <h-input v-model="formItem.brchName" readonly :maxlength="60" :title="formItem.brchName"></h-input>
                    </h-form-item>-->
                <show-branch v-model="formItem.brchNo" :label="$t('m.i.common.brchName')" prop="brchName"
                             :showCheckBox="false" :brchNo.sync="formItem.brchNo"
                             :brchName.sync="formItem.brchName"></show-branch>
                <h-form-item :label="$t('m.i.auth.paramKey')" prop="paramKey">
                  <h-input v-model="formItem.paramKey" :maxlength="50"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.auth.paramName')" prop="paramName">
                  <h-input v-model="formItem.paramName" :maxlength="100"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <!--                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"-->
                  <!--                                                                                  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>-->
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            url="/sm/auth/parameter/brchBusinessParam/func_pageQueryBrchBusiParam"
            :bindForm="formItem"
            :rowSelect="true"
            :has-select="false"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleAddForm('add')" v-if="authObj.brchParamAdd">
                {{$t("m.i.common.add")}}
              </h-button>
              <h-button type="primary" @click="handleAddForm('modify')" v-if="authObj.brchParamModify">
                {{$t("m.i.common.modify")}}
              </h-button>
              <h-button type="primary" @click="handleComfirm" v-if="authObj.brchParamDelete">
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
        <span v-if="type==='add'">新增机构参数</span>
        <span v-if="type==='modify'">修改机构参数</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">
          <!-- <h-form-item :label="$t('m.i.common.brchNo')" prop="brchNo" :required="isRequired" v-show="false">
            <h-input v-model="addForm.brchNo" readonly :maxlength="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.brchName')" prop="brchName" :required="isRequired">
            <h-input v-model="addForm.brchName" readonly icon="android-search"
                     @on-click="queryBrchNo('add')" :maxlength="60" clearable @on-clear="clearVal('add')"></h-input>
          </h-form-item> -->
          <!-- 选择机构号回显行号  单选 必输 普通机构-->
          <show-branch v-model="addForm.brchNo" :label="$t('m.i.common.brchNo')" prop="brchNo" :required="isRequired"
                       :filterable="type=='add'" showValue :msgBoxWin="addOrEditWin" :showCheckBox="false"
                       :brchNo.sync="addForm.brchNo" :brchName.sync="addForm.brchName"></show-branch>
          <h-form-item :label="$t('m.i.common.brchName')" prop="brchName" :required="isRequired">
            <h-input v-model="addForm.brchName" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.auth.activeScope')" prop="activeFlag" :required="isRequired">
            <h-select v-model="addForm.activeFlag" placeholder="" showTitle>
              <h-option value="1">全辖</h-option>
              <h-option value="0">本机构</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.auth.paramName')" prop="paramName" :required="isRequired">
            <h-select v-model="addForm.paramName"
                      ref="paramKeySelect"
                      placeholder=""
                      not-found-text="请选择参数"
                      filterable
                      @on-change="handleSearch"
                      showTitle>
              <h-option v-for="(item, index) in paramKeyList" :value="item.value" :key="index">{{item.value}}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.paramValue')" prop="paramValue" :required="showTax||showBackTax"
                       :validRules="valueRateRule" v-show="showTax||showBackTax">
            <h-input v-model="addForm.paramValue" placeholder="" :maxlength="150"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.paramValue')" prop="paramValue" :required="paramValueShow"
                       :validRules="paramValueRule" v-show="paramValueShow">
            <h-input v-model="addForm.paramValue" placeholder="1-100的整数" number :maxlength="150"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.paramValue')" prop="paramValue"
                       :required="!showTax&&!showBackTax&&!paramValueShow"
                       v-show="!showTax&&!showBackTax&&!paramValueShow">
            <h-select v-model="addForm.paramValue" placeholder="" showTitle>
              <h-option value="0">否</h-option>
              <h-option value="1">是</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.auth.paramRemark')" prop="paramRemark">
            <h-input type="textarea" :rows=3 v-model="addForm.paramRemark" readonly :canResize="false"
                     :maxlength="500"></h-input>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="handleWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
    <!--  <show-branch :showBranchWin="showBranchWin" title="机构查询" @brchNoChange="brchNoChange"
                   @showBranchWinClose="showBranchWinClose"></show-branch>-->
  </div>
</template>

<script>
  import {post, on, off} from "@/api/bizApi/commonUtil";

  export default {
    name: "brchBusinessParam",
    data() {
      return {
        ifShowMore: false,
        formItem: {
          brchNo: "",
          brchName: "",
          paramKey: "",
          paramName: ""
        },
        //给按钮增加权限
        authObj: {
          brchParamAdd: true, //新增机构业务参数
          brchParamModify: true, //修改机构业务参数
          brchParamDelete: true //删除机构业务参数
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
            title: this.$t("m.i.common.brchNo"),
            key: "brchNo",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.common.brchName"),
            key: "brchName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.auth.paramKey"),
            key: "paramKey",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.auth.paramName"),
            key: "paramName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.paramValue"),
            key: "paramValue",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.paramKey === "PrintCount" || params.row.paramKey === "pc.acct.interest_tax") {
                return h("span", params.row.paramValue);
              } else {
                let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.paramValue);
                return h("span",
                  {
                    domProps: {
                      title: dictValue
                    }
                  }, dictValue);
              }
            }
          },
          {
            title: this.$t("m.i.auth.paramRemark"),
            key: "paramRemark",
            hiddenCol: false
          }
        ],
        currentSelectList: [],
        type: null,
        isRequired: true,
        addOrEditWin: false,
        submitFlag: false,
        addForm: {
          id: "",
          legalNo: "",
          brchNo: "",
          brchName: "",
          cpesBrchCode: "",
          activeFlag: "",
          paramKey: "",
          paramName: "",
          paramValue: "",
          paramRemark: ""
        },
        paramValueRule: [{test: this.validateParamValue, trigger: "blur"}],
        valueRateRule: [{test: this.validateValue, trigger: "blur"}],
        //业务参数下拉框数据源
        paramKeyList: [],
        //参数值是否显示下拉框
        paramValueShow: false,
        paramKey: "",
        //参数值是否是利息税率
        showTax: false,
        showBackTax: false,
        //机构查询弹出框
        // showBranchWin: false,
        dictMap: new Map(),
        paramValueFlag: false
      };
    },
    components: {
      //ShowBranch: () => import(/* webpackChunkName: "sm/auth/branch/showBranch" */`@/views/bizViews/sm/auth/branch/showBranch`)
    },
    watch: {
      //获取当前法人下可配置的业务参数
      addOrEditWin(val) {
        if (val === true) {
          this.getBusiParamList();
        }
      }
    },
    methods: {
      formSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.currentSelectList = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.brchNo = "";
        this.$refs.formItem.resetFields();
      },
      handleWinClose(type) {
        this.paramValueShow = false;
        this.showTax = false;
        this.showBackTax = false;
        this.addOrEditWin = false;
        this.paramValueFlag = false;
        this.$refs.addForm.resetFields();
        this.addForm.id = '';
        this.addForm.legalNo = '';
        this.addForm.cpesBrchCode = '';
        this.addForm.paramKey = '';
        let pageNo = type && type === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
        this.$refs.datagrid.dataChange(pageNo);
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.currentSelectList = [];
      },
      //新增/修改机构业务参数
      handleAddForm(str) {
        this.type = str;
        this.isRequired = true;
        this.currentSelectList = this.$refs.datagrid.selects;
        if (this.type === "modify") {
          if (this.currentSelectList != null && this.currentSelectList.length !== 1) {
            this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
            this.addOrEditWin = false;
            return;
          } else {
            this.addOrEditWin = true;
            this.$nextTick(() => {
              let currentSelectRow = this.currentSelectList[0];
              this.paramValueShow = currentSelectRow.paramKey === "PrintCount";
              this.showTax = currentSelectRow.paramKey === "pc.acct.interest_tax";
              this.showBackTax = currentSelectRow.paramKey === "pc.acct.interest_back_tax";
              this.addForm.id = currentSelectRow.id;
              this.addForm.legalNo = currentSelectRow.legalNo;
              this.addForm.brchNo = currentSelectRow.brchNo;
              this.addForm.brchName = currentSelectRow.brchName;
              this.addForm.cpesBrchCode = currentSelectRow.cpesBrchCode;
              this.addForm.activeFlag = currentSelectRow.activeFlag;
              this.addForm.paramKey = currentSelectRow.paramKey;
              this.addForm.paramName = currentSelectRow.paramName;
              this.addForm.paramValue = currentSelectRow.paramValue;
              this.addForm.paramRemark = currentSelectRow.paramRemark;
              this.paramValueFlag = true;
            })
          }
        } else {
          this.addOrEditWin = true;
          this.$nextTick(() => {
            this.paramValueFlag = false;
          });
        }
      },
      //删除业务参数
      handleComfirm() {
        let list = this.$refs.datagrid.selects;
        if (list != null && list.length > 0) {
          let paramIds = "";
          for (let i = 0; i < list.length; i++) {
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
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
        }
      },
      handleDel(paramIds) {
        post({ids: paramIds}, "/sm/auth/parameter/brchBusinessParam/func_deleteByIds").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.selectIds = [];
              this.currentSelectList = [];
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
      submitForm() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = this.type === "add" ? "/sm/auth/parameter/brchBusinessParam/func_addBrchBusiParam" : "/sm/auth/parameter/brchBusinessParam/func_updateBrchBusiParam";
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.handleWinClose(this.type);
                } else {
                  this.$msgTip.error(this, {info: res.data.retMsg});
                }
              } else {
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
              }
            });
          }
        });
      },
      /*      clearVal(optType) {
              if (optType === "query") {
                this.formItem.brchNo = "";
                this.formItem.brchName = "";
              } else if (optType === "add") {
                this.addForm.brchNo = "";
                this.addForm.brchName = "";
              }
            },*/
      /*//查询机构弹出框
      queryBrchNo(optType) {
        this.showBranchWin = true;
        this.optType = optType;
      },
      //根据弹框所选数据进行赋值
      brchNoChange(info) {
        if (this.optType === "query") {
          this.formItem.brchNo = info[0].id;
          this.formItem.brchName = info[0].title;
        } else if (this.optType === "add") {
          this.addForm.brchNo = info[0].id;
          this.addForm.brchName = info[0].title;
        }
        this.showBranchWin = false;
      },
      showBranchWinClose() {
        this.showBranchWin = false;
      },*/
      handleSearch(paramName) {
        for (let param of this.paramKeyList) {
          if (param.value === paramName) {
            this.paramValueShow = param.key === "PrintCount";
            this.showTax = param.key === "pc.acct.interest_tax";
            this.showBackTax = param.key === "pc.acct.interest_back_tax";
            this.addForm.paramKey = param.key;
            this.addForm.paramRemark = param.description;
            if (!this.paramValueFlag) {
              this.addForm.paramValue = "";
            } else {
              this.paramValueFlag = false;
            }
            return;
          }
        }
      },
      //查询业务参数下拉框数据
      getBusiParamList() {
        post({dictGroupCode: "BrchBusiAuth"}, "/sm/config/dictionary/queryDictionary").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.paramKeyList = (res.data.retData instanceof Array) ? res.data.retData : [res.data.retData];
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
      validateParamValue(rule, val, callback) {
        if (val === '0') {
          callback(new Error("请输入1-100的整数"));
        }
        let re = /^(?:[1-9]?\d|100)$/;
        if (re.test(val)) {
          callback();
        } else {
          callback(new Error("请输入1-100的整数"));
        }
      },
      validateValue(rule, val, callback) {
        let re = /^(\d{1,2}(\.\d{1,4})?|100)$/;
        if (re.test(val)) {
          callback();
        } else {
          callback(new Error("税率范围0~100，且小数位不超过四位"));
        }
      }
    },
    mounted() {
      this.getDictListByGroups("Yon").then(res => {
        this.dictMap = res.get("map");
      });
    }
  };
</script>

<style scoped>

</style>
