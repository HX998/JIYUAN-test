<!--内部账户维护-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.brchNo" :label="$t('m.i.common.brchName')" prop="brchNo" :showCheckBox="false"
                             title="机构名称" :brchNo.sync="formItem.brchNo" :brchName.sync="formItem.brchName">
                </show-branch>
                <h-form-item :label="$t('m.i.common.acctType')" prop="typeKey">
                  <h-select v-model="formItem.typeKey">
                    <h-option v-for="item in typeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.bm.inneerCustNo')" prop="acctNo">
                  <h-input v-model="formItem.acctNo" :maxlength="32"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.acctName')" prop="acctName">
                  <h-input v-model="formItem.acctName" :maxlength="60"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t("m.i.common.searchAdvanced")}}<i
                      class="icon iconfont"
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
              url="/bm/cust/inneracct/pageQueryBrchInnerAcctList"
              :bindForm="formItem"
              :hasSelect="false"
              rowSelect
              ref="datagrid">
            <div slot="toolbar" class='pull-left'>

              <h-button type="primary" @click="handleAddForm('add')">
                {{$t("m.i.common.add")}}
              </h-button>
              <h-button type="primary" @click="handleAddForm('modify')">
                {{$t("m.i.common.modify")}}
              </h-button>
              <h-button type="primary" @click="handleDelete()">
                {{$t("m.i.common.delete")}}
              </h-button>

            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--新增科目弹出框-->
    <h-msg-box width="400"
               v-model="addOrEditWin"
               :mask-closable="maskclosable"
               :maximize="maximize">
      <!--自定义页头，根据类型显示-->
      <p slot="header">
        <span v-if="type==='add'">{{$t("m.i.common.add")}}</span>
        <span v-if="type==='modify'">{{$t("m.i.common.modify")}}</span>
      </p>

      <!--表单主体-->
      <h-panel>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="" class="h-form-search">
          <div class="h-search-form-row">
            <show-branch :filterable="type==='add'" v-model="addForm.brchNo" :label="$t('m.i.common.brchName')" prop="brchNo" required :showCheckBox="false"
                         title="机构名称" :brchNo.sync="addForm.brchNo" :brchName.sync="addForm.brchName" :msgBoxWin="addOrEditWin">
            </show-branch>
          </div>
          <div class="h-search-form-row">
            <h-form-item :label="$t('m.i.common.acctType')" prop="typeKey" :required="this.isRequired">
              <h-select v-if="type==='modify'" v-model="addForm.typeKey" readonly>
                <h-option v-for="item in typeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
              </h-select>
              <h-select v-else v-model="addForm.typeKey">
                <h-option v-for="item in typeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
              </h-select>
            </h-form-item>
          </div>
          <div class="h-search-form-row">
            <h-form-item :label="$t('m.i.bm.inneerCustNo')" prop="acctNo" :required="this.isRequired" :validRules="custAcctNoRule">
              <h-input v-model="addForm.acctNo" :maxlength="32"></h-input>
            </h-form-item>
          </div>
          <div class="h-search-form-row">
            <h-form-item label="内部账户子账户" prop="subAcctSrlNo" required="true" :validRules="custAcctNoRule" v-if="isBrchInnerSubAcctWorks == '1'">
              <h-input v-model="addForm.subAcctSrlNo" :maxlength="8"></h-input>
            </h-form-item>
          </div>
          <div class="h-search-form-row">
            <h-form-item :label="$t('m.i.common.acctName')" prop="acctName">
              <h-input v-model="addForm.acctName" :maxlength="60"></h-input>
            </h-form-item>
          </div>
        </h-form>
      </h-panel>

      <!--自定义页尾-->
      <div slot="footer">
        <h-button type="primary" @click="submitForm()">{{$t("m.i.common.commit")}}</h-button>
        <h-button type="ghost" style="margin:0 8px" @click="cancleWin()">{{$t("m.i.common.cancle")}}</h-button>
      </div>
    </h-msg-box>

  </div>
</template>
<script>
  import { post, on, off, getSingleParamValuesByKeys} from "@/api/bizApi/commonUtil";

  export default {
    name: "indexBrchInnerAcct",
    data() {
      let formItem = {
        id: "",
        brchNo: "",
        brchName: "",
        typeKey: "",
        acctNo: "",
        acctName: ""
      };
      let columns = [
        {
          type: "selection",
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {

          title: this.$t("m.i.common.index"),
          width: 60,
          type: "index",
          hiddenCol: false,
          align: "center"
        },
        {
          title: this.$t("m.i.common.brchName"),
          key: "brchName",
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.common.acctType"),
          key: "typeKey",
          hiddenCol: false,
          sortable: true,

          render: (h, params) => {
            let list = this.typeList;
            let typeKey = params.row.typeKey;
            for (let i = 0; i < list.length; i++) {
              if (params.row.typeKey === list[i].key) {
                typeKey = list[i].value;
              }
            }
            return h("span", typeKey);
          }
        },

        {
          title: this.$t('m.i.bm.inneerCustNo'),
          key: "acctNo",
          hiddenCol: false,
          sortable: true

        },
        {
          title: "内部账户子账户",
          key: "subAcctSrlNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.acctName"),
          key: "acctName",
          hiddenCol: false,
          sortable: true
        }];
      let addForm = {
        id: "",
        legalNo: "",
        brchNo: "",
        brchName: "",
        typeKey: "",
        acctNo: "",
        acctName: "",
        accountRemark: "",
        validFlag: "",
        applTellerNo: "",
        checkTellerNo: "",
        createTime: "",
        updateTime: "",
        subAcctSrlNo:""
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
        formItem: formItem,
        columns: columns,
        addForm: addForm,
        addOrEditWin: false,//弹窗value
        maximize: true,//是否允许最大化
        maskclosable: false,//是否允许点击遮罩层关闭
        //科目类型下拉列表
        typeList: [],
        //禁用状态
        deletDisabled: false,
        optType: "",
        type: null,
        //是否只读
        readonly: false,
        //是否必填
        isRequired: true,
        ifShowMore: false,
        //提交标志，一个请求正在提交的时候会设为false
        submitFlag: false,
        //控制层所在的url
        reqUrl: "/bm/cust/inneracct",
        custAcctNoRule: [{ test: validcustAcctNo, trigger: "blur" }],
        isBrchInnerSubAcctWorks:"0"
      };
    },
    components: {

    },
    methods: {
      //提交查询
      formSearch() {
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单数据
      formSearchReset() {
        this.formItem.brchNo = "";
        this.formItem.brchName = "";
        this.$refs.formItem.resetFields();
      },
      //判断是否继续(判断选中是否只有一条)
      isAllowContinue() {
        let list = this.$refs.datagrid.selects;
        if (list != null && list.length > 0) {
          if (list.length === 1) {
            return true;
          } else {
            this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
            return false;
          }
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return false;
        }
      },

      //新增或修改操作
      handleAddForm(str) {
        this.type = str;
        this.readonly = false;
        this.isRequired = true;
        if (this.type === "modify" && this.isAllowContinue()) {
          this.$nextTick(() => {
            this.queryObjById(this.$refs.datagrid.selectIds[0]);
            this.readonly = true;
          });
        } else if (this.type !== "add") {
          this.$nextTick(() => {
            this.addFormReset();
          });
          return;
        } else {
          this.$nextTick(() => {
            this.addFormReset();
          });
        }
        this.addOrEditWin = true;
      },

      queryObjById(id) {
        post({ id: id }, this.reqUrl + "/queryBrchInnerAcctById").then(res => {
          this.submitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.addForm.id = res.data.retData.id;
              this.addForm.legalNo = res.data.retData.legalNo;
              this.addForm.brchNo = res.data.retData.brchNo;
              this.addForm.brchName = res.data.retData.brchName;
              this.addForm.typeKey = res.data.retData.typeKey;
              this.addForm.acctNo = res.data.retData.acctNo;
              this.addForm.acctName = res.data.retData.acctName;
              this.addForm.accountRemark = res.data.retData.accountRemark;
              this.addForm.validFlag = res.data.retData.validFlag;
              this.addForm.applTellerNo = res.data.retData.applTellerNo;
              this.addForm.checkTellerNo = res.data.retData.checkTellerNo;
              this.addForm.createTime = res.data.retData.createTime;
              this.addForm.updateTime = res.data.retData.updateTime;
              this.addForm.subAcctSrlNo = res.data.retData.subAcctSrlNo;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.$refs.datagrid.dataChange(1);
              this.submitWin = true;
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            this.submitWin = true;
          }
        });
      },

      //重置添加或修改表单
      addFormReset() {
        this.$refs.addForm.resetFields();
        this.addForm.id = "";
        this.addForm.brchNo = "";
        this.addForm.brchName = "";
        if (this.type === "modify" && this.isAllowContinue()) {
          this.queryObjById(this.$refs.datagrid.selectIds[0]);
        }
      },

      //取消表单操作
      cancleWin() {
        this.$refs.addForm.resetFields();
        this.addForm.id = "";
        this.addForm.brchNo = "";
        this.addForm.brchName = "";
        this.addOrEditWin = false;
      },
      //添加或修改表单提交请求
      submitForm() {
        let btnType = this.type;
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            let url = this.type === "modify" ? this.reqUrl + "/updateBrchInnerAcct" : this.reqUrl + "/insertBrchInnerAcct";
            let msg = this.type === "modify" ? this.$t("m.i.common.modifySuccess") : this.$t("m.i.common.addSuccess");
            this.submitFlag = true;
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let return_code = res.data.return_code;
                if (res.data.retCode === "000000") {
                  this.$msgTip.success(this, { info: msg });
                  this.addOrEditWin = false;
                  this.$refs.datagrid.dataChange(1);
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.$refs.datagrid.dataChange(1);
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });

      },


      //删除操作
      handleDelete() {
        let list = this.$refs.datagrid.selects;
        if (list && list.length > 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmDelete") + "?",
            onOk: () => {
              this.handledel();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return false;
        }
      },

      //提交删除请求
      handledel() {
        let url = this.reqUrl + "/deleteBrchInnerAcct";
        post({ ids: this.$refs.datagrid.selectIds }, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this, { info: this.$t("m.i.common.deleteSuccess") });
              this.$refs.datagrid.dataChange(1);
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.selectIds = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.$refs.datagrid.dataChange(1);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      }
    },
    mounted() {
      this.getDictListByGroups("BrchInnerAcctType").then(res => {
        this.typeList = res.get("BrchInnerAcctType");
        // this.typeList = this.typeList.filter(item => item.key === "t2" || item.key === "t3" || item.key === "t4"
        //   || item.key === "t5" || item.key === "t6" || item.key === "t7" || item.key === "t8" || item.key === "t9");
        this.dictMap = res.get("map");
      });
      getSingleParamValuesByKeys("bm.cust.is_brch_inner_sub_acct_works").then(res=>{
        this.isBrchInnerSubAcctWorks=res["bm.cust.is_brch_inner_sub_acct_works"];
        if (this.isBrchInnerSubAcctWorks === '1') {
          this.$refs.datagrid.controlColumnsHidden("subAcctSrlNo", false);
        } else {
          this.$refs.datagrid.controlColumnsHidden("subAcctSrlNo", true);
        }
      })
    }
  };
</script>

<style scoped>

</style>
