<!--账号信息维护-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
               <!-- <h-form-item :label="$t('m.i.common.brchName')" prop="openBrchName">
                  <h-input v-model="formItem.openBrchName" readonly :maxlength="60"
                           icon="android-search" @on-click="queryRcvBrchName('formItem')" clearable @on-clear="clearRcvBrchName('formItem')"></h-input>
                </h-form-item>-->
                <show-cpes-branch v-model="formItem.openBrchCode" :label="$t('m.i.common.brchName')"
                                  :brchCode.sync="formItem.openBrchCode"  :cpesBrchName.sync="formItem.openBrchName"
                                  datagridUrl="/cpes/branch/queryBranchList" prop="openBrchName"
                                  queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                <h-form-item :label="$t('m.i.bm.isOtherBank')" prop="isOtherBank">
                  <h-select  v-model="formItem.isOtherBank" placeholder="">
                    <h-option  value="1">他行账号</h-option>
                    <h-option  value="0">本行账号</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.bailAcctType')" prop="bailAcctType">
                  <h-select v-model="formItem.bailAcctType" placeholder="">
                    <h-option v-for="item in custAcctKindList" :value="item.key" :key="item.key">{{item.value}}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.acctNo')" prop="acctNo">
                  <h-input v-model="formItem.acctNo" :maxlength="32"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.acctName')" prop="acctName">
                  <h-input v-model="formItem.acctName"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.openBankNo')" prop="openBankNo">
                  <h-input v-model="formItem.openBankNo" :maxlength="12"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.openBankName')" prop="openBankName">
                  <h-input v-model="formItem.openBankName"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-row>
            <h-col span="24">
              <h-datagrid
                          :columns="columns"
                          :rowSelect = true
                          :hasSelect = false
                          url="/bm/cust/bankcustacct/pageQueryBankCustAcctListwh"
                          :bindForm="formItem"
                          ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="handleAddForm('add')" v-if="authObj.bizSetAdd">{{$t('m.i.common.add')}}</h-button>
                  <h-button type="primary" @click="handleAddForm('modify')" v-if="authObj.bizSetModify">{{$t('m.i.common.modify')}}</h-button>
                  <h-button type="primary" @click="handleDelect()" v-if="authObj.bizSetDelect">{{$t('m.i.common.delete')}}</h-button>
                  <h-button type="primary" @click="handleSubmit()" v-if="authObj.bizSetSubmit">提交复核</h-button>
                </div>
              </h-datagrid>
            </h-col>
          </h-row>

        </div>
      </h-col>
    </h-row>

    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" class="h-form-table-layer" :maximize="true" :mask-closable="false" @on-close="closeFrom()">
      <p slot="header">
        <span v-if="type=='add'">新增同业客户账号</span>
        <span v-if="type=='modify'">修改同业客户账号</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">
         <!-- <h-form-item :label="$t('m.i.common.brchCode')" prop="openBrchCode" :required="isRequired">
            <h-input v-if="type=='modify'" v-model="addForm.openBrchCode" readonly></h-input>
            <h-input v-else v-model="addForm.openBrchCode" readonly
                     icon="android-search" @on-click="queryRcvBrchName('addForm')" clearable @on-clear="clearRcvBrchName('addForm')"></h-input>
          </h-form-item>-->
          <!--<show-cpes-branch v-model="addForm.openBrchCode" :label="$t('m.i.common.brchCode')" :required="isRequired"
                            :brchCode.sync="addForm.openBrchCode"  :cpesBrchName.sync="addForm.openBrchName"
                            :filterable="type==='add'" :msgBoxWin="addOrEditWin" showValue
                            datagridUrl="/cpes/branch/queryBranchList" prop="openBrchCode"
                            queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>-->

          <show-cpes-branch :label="$t('m.i.common.brchName')" :required="isRequired"
                            :brchCode.sync="addForm.openBrchCode"  :cpesBrchName.sync="addForm.openBrchName"
                            :filterable="type==='add'" :msgBoxWin="addOrEditWin"
                            datagridUrl="/cpes/branch/queryBranchList" prop="openBrchName"
                            queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

          <h-form-item :label="$t('m.i.common.brchCode')"  prop="openBrchCode" :required="isRequired">
            <h-input v-if="type=='modify'" v-model="addForm.openBrchCode" readonly></h-input>
            <h-input v-else v-model="addForm.openBrchCode" readonly :maxlength="60"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.acctNo')" prop="acctNo" :required="isRequired">
            <h-input v-if="type=='modify'" v-model="addForm.acctNo" readonly></h-input>
            <h-input v-else v-model="addForm.acctNo" :maxlength="32" :filterRE="/[^\w]/ig"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.acctName')" prop="acctName" :required="isRequired">
            <h-input v-model="addForm.acctName" :maxlength=50></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.bm.isOtherBank')" prop="isOtherBank" :required="isRequired">
            <h-select v-if="type=='modify'" v-model="addForm.isOtherBank" placeholder="" readonly>
              <h-option  value="1">他行账号</h-option>
              <h-option  value="0">本行账号</h-option>
            </h-select>
            <h-select v-else v-model="addForm.isOtherBank" @on-change="showOpenBrch" placeholder="">
              <h-option  value="1">他行账号</h-option>
              <h-option  value="0">本行账号</h-option>
            </h-select>
          </h-form-item>

          <show-branch v-model="addForm.openBrchNo" :label="$t('m.i.common.openBrchName')" prop="openBrchNo" :required="isShowOpenBrch"
                       v-show="isShowOpenBrch"  :filterable="type=='add'" :showCheckBox="false" :msgBoxWin="addOrEditWin"
                       :brchNo.sync="addForm.openBrchNo" :brchName.sync="addForm.openBranchName" @brchNoChange="brchNoChange">
          </show-branch>

          <h-form-item :label="$t('m.i.common.openBankNo')" prop="openBankNo" :required="isRequired">
            <h-input v-if="type=='modify'" :value="addForm.openBankNo" readonly></h-input>
            <h-input v-else v-model="addForm.openBankNo" :readonly=isShowOpenBrch :maxlength="12" :specialFilter=true></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.openBankName')" prop="openBankName" :required="isRequired">
            <h-input v-if="type=='modify'" :value="addForm.openBankName" readonly></h-input>
            <h-input v-else v-model="addForm.openBankName" :maxlength=30 :readonly=isShowOpenBrch></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.bailAcctType')" prop="bailAcctType">
            <h-select v-model="addForm.bailAcctType" :placeholder="''">
              <h-option v-for="item in custAcctKindList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.custAcctType')" prop="accountType">
            <h-select v-if="type=='modify'" v-model="addForm.accountType" readonly :placeholder="''">
              <h-option  value="1">质押式再贴现到期</h-option>
              <h-option  value="2">提前或逾期回购</h-option>
            </h-select>
            <h-select v-else v-model="addForm.accountType" :placeholder="''">
              <h-option  value="1">质押式再贴现到期</h-option>
              <h-option  value="2">提前或逾期回购</h-option>
            </h-select>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.acctFuncNo')" prop="acctFuncNo">
            <h-input v-model="addForm.acctFuncNo" :maxlength=80></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" style="margin:0 8px"  @click="closeFrom()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary"  v-if="submitFlag" disabled>{{$t('m.i.common.submiting')}}</h-button>
        <h-button type="primary"  v-else @click="submitForm()">{{$t('m.i.common.commit')}}</h-button>

      </div>
    </h-msg-box>
    <h-msg-box v-model="submitWin" width="300" height="180">
      <p slot="header">
        <span>{{submitTitle}}</span>
      </p>
      <div class="h-prompt-content">
        <div class="h-prompt-top">
          <i v-if="retMsg == ''" class="icon iconfont icon-right"></i>
          <!--<i v-else class="icon iconfont icon-remind"></i>-->
          <i v-else class="icon iconfont icon-wrong"></i>
          <span>{{submitMsg}}</span>
        </div>
        <p class="h-prompt-words">{{retMsg}}</p>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="submitWin = false">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="submitWin = false">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
    <!--<cpes-brch-code-search :brchCodeWin="showCpesBranchWin" @brchCodeWinClose="brchCodeWinClose"
                      @brchCodeChange="brchCodeChange" optType="2"></cpes-brch-code-search>-->

  </div>
</template>

<script>
  import { bempConfirm, post,on,off} from "@/api/bizApi/commonUtil";

  export default {
    name: "bankCustAcctManager",
    components: {
      //CpesBrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch"*/"@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch"),
    },
    data() {
      let columns = [
        {
          type: "selection",
          key: "duoxuan",
          width: 60,
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
          title: this.$t('m.i.common.brchCode'),
          key: "openBrchCode",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.brchName'),
          key: "openBrchName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.bm.isOtherBank'),
          key: "isOtherBank",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            return h("span", getIsOtherBank(params.row.isOtherBank));
          }
        },
        {
          title: this.$t('m.i.common.acctNo'),
          key: "acctNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.acctName'),
          key: "acctName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.flowStatus'),
          key: "flowStatus",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "CustFlowStatus", params.row.flowStatus);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.common.openBankNo'),
          key: "openBankNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.openBankName'),
          key: "openBankName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.bailAcctType'),
          key: "bailAcctType",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "custAcctKind", params.row.bailAcctType);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.common.acctFuncNo'),
          key: "acctFuncNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.createBrchNo'),
          key: "createBrchNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.createBrchName'),
          key: "createBrchName",
          ellipsis: false,
          hiddenCol: false
        }
      ];
      let checkColumns = [
        {
          type: "selection",
          key: "duoxuan",
          width: 60,
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
          title: this.$t('m.i.common.brchCode'),
          key: "openBrchCode",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.brchName'),
          key: "openBrchName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.bm.isOtherBank'),
          key: "isOtherBank",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            return h("span", getIsOtherBank(params.row.isOtherBank));
          }
        },
        {
          title: this.$t('m.i.common.acctNo'),
          key: "acctNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.acctName'),
          key: "acctName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.openBankNo'),
          key: "openBankNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.openBankName'),
          key: "openBankName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.bailAcctType'),
          key: "bailAcctType",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "custAcctKind", params.row.bailAcctType);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.common.acctFuncNo'),
          key: "acctFuncNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.createBrchNo'),
          key: "createBrchNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.createBrchName'),
          key: "createBrchName",
          ellipsis: false,
          hiddenCol: false
        }
      ];
      //账号信息查询表单
      let queryFormItem = {
        openBrchNo: "",
        openBrchCode: "",
        openBrchName: "",
        isOtherBank: "",
        bailAcctType: "",
        acctNo: "",
        acctName: "",
        openBankNo: "",
        openBankName: "",
        flowStatus: ""
      };
      //账号信息维护查询表单
      let formItem = {
        openBrchNo: "",
        openBrchCode: "",
        openBrchName: "",
        isOtherBank: "",
        bailAcctType: "",
        acctNo: "",
        acctName: "",
        openBankNo: "",
        openBankName: ""
      };
      //新增/修改表单
      let addForm = {
        openBrchNo: "",
        openBrchCode: "",
        openBrchName: "",
        acctNo: "",
        acctName: "",
        isOtherBank: "",
        openBranchName: "",
        openBankNo: "",
        openBankName: "",
        bailAcctType: "",
        accountType: "",
        acctFuncNo: ""
      };
      let refuseForm = {
        returnReason: ""
      };
      //给按钮增加权限
      let authObj = {
        bizSetAdd: true, //添加
        bizSetModify: true, //修改
        bizSetDelect: true, //删除
        bizSetSubmit: true, //提交
        bizSetCheck: true, //录入复核
        bizSetRefuse: true, //复核拒绝
        bizSetRecallCheck: false, //撤销复核
        bizSetConfirmCheck: true, //复核确认
        bizSetRefuseCheck: true, //复核确认拒绝
        bizSetRecallConfirmCheck: false //撤销确认
      };

      function getIsOtherBank(value) {
        if (value != null && value !== "") {
          switch (value) {
            case '1':return '他行账号';
            case '0':return '本行账号';
          }
        } else {
          return "";
        }
      }

      return {
        authObj: authObj,
        // 是否显示新增或修改窗口
        addOrEditWin: false,
        queryFormItem: queryFormItem,
        formItem: formItem,
        addForm: addForm,
        refuseForm: refuseForm,
        columns: columns,
        checkColumns: checkColumns,
        type: null,
        deletDisabled: false,
        submitFlag: false,
        submitWin: false,
        submitMsg: "",
        submitTitle: "",
        retMsg: "",
        ifShowMore: false,
        flowStatusList: [],
        custAcctKindList: [],
        openBankNoRule: [{ test: /^[0-9]{12}$/, trigger: "blur", message: "行号由12位数字组成" }],
        acctNoRule: [{ test: /^[0-9]{1,32}$/, trigger: "blur", message: "账号由不超过32位的数字组成" }],
        isRequired: true,
        //showCpesBranchWin: false,
        brchType: "",
        isShowOpenBrch: true,
        dictMap: null,
        refuseReasonWin: false
      };
    },
    methods :{
      showOpenBrch(value){
        if(value === "1") {
          this.isShowOpenBrch = false;
        }
        else if(value === "0"){
          this.isShowOpenBrch = true;
        }
      },
      //查复机构名称
     /* queryRcvBrchName(brchType) {
        this.showCpesBranchWin = true;
        this.brchType = brchType;
      },*/
      /*clearRcvBrchName(brchType){
        if (brchType === "formItem") {
          this.formItem.openBrchNo = "";
          this.formItem.openBrchCode = "";
          this.formItem.openBrchName = "";
        }
        else if(brchType === "addForm"){
          this.addForm.openBrchNo = "";
          this.addForm.openBrchCode = "";
          this.addForm.openBrchName = "";
        }
      },*/
      /*brchCodeWinClose() {
        this.showCpesBranchWin = false;
      },*/
      //根据弹框所选数据进行赋值
      /*brchCodeChange(info) {
        if (this.brchType === "formItem") {
          this.formItem.openBrchNo = info.brchNo;
          this.formItem.openBrchCode = info.brchCode;
          this.formItem.openBrchName = info.brchFullNameZh;
        }
        else if(this.brchType === "addForm"){
          this.addForm.openBrchNo = info.brchNo;
          this.addForm.openBrchCode = info.brchCode;
          this.addForm.openBrchName = info.brchFullNameZh;
        }
        this.showCpesBranchWin = false;
        this.brchType = "";
      },*/
      //根据弹框所选数据进行赋值
      brchNoChange(info) {
        if(info.length > 0) {
          this.getBranchByBranchTreeNo(info[0].brchNo);
          this.$refs.addForm.validateField('openBrchNo');
        } else {
          this.addForm.openBankNo = "";
          this.addForm.openBankName = "";
        }
      },
      // 根据brchNo反查获得行号和行名
      getBranchByBranchTreeNo(brchNo){
        post({brchNo:brchNo},'/sm/auth/branch/getBranchByBranchTreeNo').then(res => {
          if(res){
            let retCode = res.data.retCode
            if(retCode=="000000"){
              this.addForm.openBankNo = res.data.retData.bankNo;
              this.addForm.openBankName = res.data.retData.cpesBrchName;
            }else{
              this.$msgTip.error(this,{info:res.data.retMsg})
            }
          }else{
            this.$msgTip.error(this,{info:this.$t('m.i.common.netError')})
          }
        });
      },

      addFormReset() {
        this.$refs.addForm.resetFields();
      },
      handleAddForm(str) {
        this.type = str;
        if (this.type == "modify") {
          this.isShowOpenBrch = false;
          let list = this.$refs.datagrid.selectIds;
          if(list != null && list.length==1){
            this.$nextTick(() => {
              this.queryObjById(list[0]);
            });
          }else if(list.length == 0 || list == null){
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            return ;
          }else if(list.length > 1){
            this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
            return ;
          }
        }else{
          this.$nextTick(() => {
            this.addFormReset();
          });
        }
        this.addOrEditWin = true;
      },
      queryObjById(id){
        post({id:id},"/bm/cust/bankcustacct/queryBankCustAcctById").then(res => {
          this.submitFlag = false;
          if(res){
            let retCode = res.data.retCode
            if(retCode=="000000"){
              this.addForm = res.data.retData
            }else{
              this.$refs.datagrid.dataChange(1)
              this.submitMsg = "查询失败";
              this.retMsg = res.data.retMsg;
              this.submitWin = true;
            }
          }else{
            this.submitMsg = "查询失败";
            this.retMsg = this.$t('m.i.common.netError');
            this.submitWin = true;
          }
        });
      },
      formSearch() {
        this.selectReset();
        this.$refs.datagrid.dataChange(1);
      },
      selectReset(){
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
      },
      formSearchReset() {
        this.formItem.openBrchNo = "";
        this.$refs.formItem.resetFields();
        this.formItem.openBrchCode = "";
        this.formItem.openBrchName = "";
      },
      handleDelect() {
        let list = this.$refs.datagrid.selectIds;
        if (list == null || list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return ;
        }else {
          let options = {
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmDelete") + "?"
          };
          bempConfirm(this, "/bm/cust/bankcustacct/deleteBankCustAcct", { ids: list }, options, this.$refs.datagrid.selects);
          // this.selectReset();
        }
      },
      handleSubmit() {
        let list = this.$refs.datagrid.selectIds;
        if (list == null || list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return ;
        }
        let options = {
          title: this.$t("m.i.common.confirm"),
          content: "确认要提交吗？"
        };
        bempConfirm(this, "/bm/cust/bankcustacct/submitBankCustAcct", { ids: list }, options, this.$refs.datagrid.selects);
        // this.selectReset();
      },
      closeFrom(){
        this.$refs.addForm.resetFields();
        this.addOrEditWin = false;
        this.addForm.openBrchCode = "";
        this.addForm.openBrchName = "";
        this.addForm.id = "";
        this.addForm.openBrchNo = "";
        this.addForm.openBrchCode="";
        this.addForm.openBrchName = "";
        this.addForm.acctNo = "";
        this.addForm.acctName = "";
        this.addForm.isOtherBank = "";
        this.addForm.openBranchName = "";
        this.addForm.openBankNo = "";
        this.addForm.openBankName = "";
        this.addForm. bailAcctType = "";
        this.addForm.accountType = "";
        this.addForm.acctFuncNo = "";
      },
      submitForm() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            // 新增或修改的url
            let url = this.type=="add"?'/bm/cust/bankcustacct/insertBankCustAcct':'/bm/cust/bankcustacct/updateBankCustAcct'
            let msg = this.type=="add"?this.$t('m.i.common.addSuccess'):this.$t('m.i.common.modifySuccess')
            this.submitFlag = true;
            this.submitMsg = msg;
            post(this.addForm,url).then(res => {
              this.submitFlag = false;
              if(res){
                let retCode = res.data.retCode
                if(retCode=="000000"){
                  this.$hMessage.success(msg)
                  this.addOrEditWin = false;
                  this.$refs.datagrid.dataChange(1);
                  this.selectReset();
                  this.retMsg = '';
                }else{
                  this.$refs.datagrid.dataChange(1)
                  this.submitMsg = this.type=="add"?this.$t('m.i.common.addFailed'):this.$t('m.i.common.modifyFailed');
                  this.retMsg = res.data.retMsg;
                  this.submitWin = true;
                }
              }else{
                this.submitMsg = this.type=="add"?this.$t('m.i.common.addFailed'):this.$t('m.i.common.modifyFailed');
                this.retMsg = this.$t('m.i.common.netError');
                this.submitWin = true;
              }

            });
          }
        });
      },
    },
    mounted() {
      this.getDictListByGroups("CustFlowStatus,custAcctKind").then(res => {
        this.custAcctKindList = res.get("custAcctKind");
        this.dictMap = res.get("map");
      });
    }
  };
</script>

<style scoped>

</style>
