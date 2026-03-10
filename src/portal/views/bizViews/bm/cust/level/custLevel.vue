<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.enterpriseName')" prop="enterpriseName">
                  <h-input v-model="formItem.enterpriseName" :maxlength=60></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.acptBankLevel')" prop="acptBankLevel">
                  <h-select v-model="formItem.acptBankLevel" :clearable="false" :value="1" placeholder="">
                    <h-option v-for="item in bankLevelList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
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
            url="/bm/cust/level/showCustLevel/func_pageQueryCustLevelList"
            :bindForm="formItem"
            :hasSelect="false"
            rowSelect
            :onSelectChange="handleSelectClick"
            ref="datagrid">
            <div slot="toolbar" class="pull-left" v-if="this.isShowToolbar">
              <h-button type="primary" @click="handleAddForm('add')" v-if="authObj.bizSetRoleAdd && (this.btnAuth.add === undefined ? true : this.btnAuth.add.isShow)" :disabled="this.disabledFlag">
                {{$t("m.i.common.add")}}
              </h-button>
              <h-button type="primary" @click="handleAddForm('modify')" v-if="authObj.bizSetRoleModify && (this.btnAuth.modify === undefined ? true : this.btnAuth.modify.isShow)"
                        :disabled="this.isLogOn">{{$t("m.i.common.modify")}}
              </h-button>
              <h-button type="primary" @click="handleComfirm('delete')" v-if="authObj.bizSetRoleDelete && (this.btnAuth.loginOut === undefined ? true : this.btnAuth.loginOut.isShow)"
                        :disabled="this.isLogOn">{{$t("m.i.common.delete")}}
              </h-button>
            </div>
          </h-datagrid>

        </div>
      </h-col>
    </h-row>

    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" class="h-form-search-layer" :maximize="true" :mask-closable="false" @on-close="addOrEditWinClose">
      <p slot="header">
        <span v-if="type=='add'">新增企业级别信息</span>
        <span v-if="type=='modify'">修改企业级别信息</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="120" ref="addForm" cols="2" class="h-form-search" onlyBlurRequire>
          <h-form-item :label="$t('m.i.common.enterpriseName')" prop="enterpriseName" :required="isRequired">
            <h-input v-model="addForm.enterpriseName" :maxlength=60 :readonly="type=='view'" placeholder=""></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.enterpriseAcctNo')" prop="custAcctNo" :required="isRequired" :validRules="custAcctNoRule">
            <h-input v-model="addForm.custAcctNo" :maxlength=60 :readonly="type=='modify'" placeholder=""></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.acptBankLevel')" prop="acptBankLevel" :required="isRequired">
            <h-select v-if="type=='view'" :value="addForm.acptBankLevel" class="input-boder-0"
                      :title="addForm.acptBankLevel" placeholder="">
              <h-option v-for="item in bankLevelList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else v-model="addForm.acptBankLevel" :maxlength=60 placeholder="">
              <h-option v-for="item in bankLevelList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer" v-if="type!='view'">
        <!--<h-button type="ghost" style="margin:0 8px"  @click="addFormReset()">{{$t('m.i.common.reset')}}</h-button>-->
        <h-button type="ghost" @click="addOrEditWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm()">{{$t("m.i.common.confirm")}}</h-button>
      </div>
      <div slot="footer" v-else>
        <h-button type="primary" @click="addOrEditWinClose">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>

  </div>
</template>

<script>
  import { post, on, off ,getSingleParamValuesByKeys} from "@/api/bizApi/commonUtil";
  export default {
    name: "custLevel",
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
          title: this.$t('m.i.common.enterpriseName'),
          key: "enterpriseName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.enterpriseAcctNo'),
          key: "custAcctNo",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.acptBankLevel'),
          key: 'acptBankLevel',
          hiddenCol: false,
          render: (h, params) => {
            let dictValue =this.getDictValueFromMap(this.dictMap, 'custLevel', params.row.acptBankLevel);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        }
      ];
      let formItem = {
        enterpriseName: "",
        custAcctNo: "",
        acptBankLevel: "",
        legalNo: JSON.parse(window.sessionStorage.getItem("userInfo")).legalNo,
        dictMap: new Map()
      };
      let addForm = {
        enterpriseName: "",
        custAcctNo: "",
        acptBankLevel: "",
        operTellerNo : "",
        legalNo: ""
      };
      //给按钮增加权限
      let authObj = {
        bizSetRoleAdd: true, //添加
        bizSetRoleDelete: true, //删除
        bizSetRoleModify: true,//修改
      };

      function validcustAcctNo(rule,val,callback){
        let re = /^[a-zA-Z0-9]{1,32}$/;
        if(re.test(val)){
          callback()
        }else{
          callback(new Error("非法输入，只能输入英文、数字"))
        }
      }

      return {
        // 字典相关静态数据
        bankLevelList: [],
        isShowToolbar: false,
        btnAuth: {},
        columns: columns,
        formItem: formItem,
        authObj: authObj,
        // 是否显示新增或修改窗口
        addOrEditWin: false,
        addForm: addForm,
        type: null,
        readonly: false,
        isRequired: true,
        submitFlag: false,
        // 提交结果界面相关
        retMsg: "",
        custAcctNoRule: [{ test: validcustAcctNo, trigger: "blur" }],
        ifShowMore: false,
        isLogOff: false,
        isLogOn: false,
        disabledFlag: false,
        dictMap: new Map(),
        isDpstReadonly:false
      };
    },
    methods: {
      getButtonAuth(){
        let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;
        post({ authId: id, loading: false }, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            let retMsg = res.data.retMsg;
            if (retCode === "000000") {
              this.btnAuth = JSON.parse(res.data.retData);
              this.isShowToolbar = true;
            } else {
              this.$msgTip.error(this, { info: retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }

        });
      },
      addFormReset() {
        this.$nextTick(() => {
          this.$refs.addForm.resetFields();
          this.addForm.id = "";
        });
      },
      async handleAddForm(str) {
        this.type = str;
        this.readonly = false;
        this.isRequired = true;
        if (this.type == "modify" || this.type == "view") {
          let list = this.$refs.datagrid.selects;
          if (!list || list.length !== 1) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            return;
          }
          this.addFormReset();
          this.$nextTick(() => {
            this.queryObjById(list[0].id);
            if (this.type == "modify") {
              this.readonly = true;
            }
            if (this.type == "view") {
              this.isRequired = false;
            }
          });
        } else {
          this.addFormReset();
        }
        this.addOrEditWin = true;
      },
      addOrEditWinClose(){
        this.addOrEditWin = false;
        this.isDpstReadonly=false;
      },
      queryObjById(id) {
        post({ id: id }, "/bm/cust/level/custLevel/func_queryCustLevelById").then(res => {
          this.submitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.addForm.id = res.data.retData.id;
              this.addForm.enterpriseName = res.data.retData.enterpriseName;
              this.addForm.custAcctNo = res.data.retData.custAcctNo;
              this.addForm.acptBankLevel = res.data.retData.acptBankLevel;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });

      },
      handleSelectClick(arr, selectInx) {
        let array = this.$refs.datagrid.selects;
        if (array.length === 0) {
          this.isLogOn = false;
          this.isLogOff = false;
          this.disabledFlag = false;
          return false;
        }
        let activeFlag = array[0].activeFlag;
        for(let i = 1; i < array.length; i++) {
          if (activeFlag !== array[i].activeFlag) {
            this.isLogOn = true;
            this.isLogOff = true;
            this.disabledFlag = true;
            return true;
          }
        }
        this.disabledFlag = false;
        if (activeFlag === "1") {
          this.isLogOff = true;
          this.isLogOn = false;
        } else if (activeFlag === "0") {
          this.isLogOff = false;
          this.isLogOn = true;
        } else if (activeFlag === "2") {
          this.isLogOff = true;
          this.isLogOn = true;
        }
        return true;
      },
      formSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
        this.isLogOn = false;
        this.isLogOff = false;
        this.disabledFlag = false;
      },
      formSearchReset() {
        this.formItem.createBrchNo = "";
        this.formItem.openBrchNo = "";
        this.formItem.busiOwnBrchNo = "";
        this.$refs.formItem.resetFields();
      },
      submitForm() {
        let btnType = this.type;
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            // 新增或修改的url
            let url = this.type == "add" ? "/bm/cust/level/custLevel/func_insertCustLevel" : "/bm/cust/level/custLevel/func_updateCustLevel";
            let msg = this.type == "add" ? this.$t("m.i.common.addSuccess") : this.$t("m.i.common.modifySuccess");
            let pageNo = this.type === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
            this.submitFlag = true;

            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this. addOrEditWinClose();
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(pageNo);
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = []
                } else {
                  let msg = this.type == "add" ? this.$t("m.i.common.addFailed") : this.$t("m.i.common.modifyFailed");
                  this.submitFailed(msg, res.data.retMsg);
                }
              } else {
                let msg = this.type == "add" ? this.$t("m.i.common.addFailed") : this.$t("m.i.common.modifyFailed");
                this.submitFailed(msg, this.$t("m.i.common.netError"));
              }

            });
          }
        });

      },
      async handleComfirm(oper) {
        let list = this.$refs.datagrid.selects;
        debugger;
        if (list != null && list.length > 0) {
          let errorCurp = "";
          let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
          let content = "删除吗";
          let url = "/bm/cust/level/custLevel/func_deleteCustLevel";
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确认要" + content + "?",
            onOk: () => {
              this.handlelog(url, content);
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      handlelog(url, content) {
        let list = this.$refs.datagrid.selects;

        let delId = [];
        for (let i = 0; i < list.length; i++) {
          post({ id: list[i].id }, url).then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode == "000000") {
                this.$msgTip.success(this);
                this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                this.$refs.datagrid.selects = [];
                this.$refs.datagrid.selectIds = []
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        }
      },
      submitFailed(title, retMsg) {
        this.$msgTip.error(this, { info: retMsg });
      },


    },

    mounted() {
      this.getDictListByGroups("custLevel").then(res => {
        this.bankLevelList = res.get("custLevel");
        this.dictMap = res.get("map");
      });
      this.addForm.legalNo = JSON.parse(window.sessionStorage.getItem("userInfo")).legalNo;
      this.addForm.operTellerNo = JSON.parse(window.sessionStorage.getItem("userInfo")).userNo;
    },
    created(){
      this.getButtonAuth();
    }
  };
</script>

<style scoped>

</style>
