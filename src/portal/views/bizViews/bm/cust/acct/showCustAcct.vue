<!--客户账号信息-->
<template>
  <h-msg-box v-model="tempshowCustAcctWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
             width="1000" class="h-form-table-layer" :z-index=1201 @on-maximize="onMaximize">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <!--弹出框内容-->
    <div>
      <!--查询表单-->
      <h-form :model="formItem" :label-width="80" ref="formItem" cols="4" class="h-form-search"
              v-if="selectType === 'coll' || selectType === 'sign'">
        <div>
          <h-form-item :label="$t('m.i.common.custNo')" prop="custNo" :required="isRequired">
            <select-cust-corp v-model="formItem.custNo" :custNo="formItem.custNo"
                              :value.sync="formItem.custNo"></select-cust-corp>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.custAcctNo')" prop="custAcctNo" v-if="this.btnAuth.custAcctFormItem === undefined ? true : this.btnAuth.custAcctFormItem.isShow">
            <h-input v-model="formItem.custAcctNo" @on-change="collListReset" :maxlength=32></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.subAcctSrlNo')" prop="subAcctSrlNo" v-if="isSubAcctWorks == '1' && (this.btnAuth.subAcctSrlNoFormItem === undefined ? true : this.btnAuth.subAcctSrlNoFormItem.isShow)">
            <h-input v-model="formItem.subAcctSrlNo" @on-change="collListReset" :maxlength=32></h-input>
          </h-form-item>
          <h-form-item class="h-form-operate">
            <h-button type="primary" @click="formSearch()" v-if="selectType == 'coll' ">{{$t("m.i.common.synch")}}</h-button>
            <h-button type="primary" @click="formSearch()" v-if="selectType == 'sign' ">{{$t("m.i.common.search")}}</h-button>
            <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
          </h-form-item>
        </div>
      </h-form>
    </div>
    <!--数据展示表格-->
    <h-datagrid
      :columns="columns"
      highlight-row
      getDataFunc
      @get-data="getCustAcctList"
      :gridData="custAcctData"
      :bindForm="formItem"
      :onCurrentChange="handleCurrentChange"
      :onCurrentChangeCancel="handleCurrentChangeCancel"
      :onRowDbClick="doubleHandleClick"
      :autoLoad=false
      :row-select="!isCheckHidden"
      :hasSelect="false"
      :paramId="selectType === 'coll' ? 'custAcctNo' : 'id'"
      ref="datagrid">
    </h-datagrid>

    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="submitForm" v-if="selectType == 'coll'">{{$t("m.i.common.save")}}</h-button>
      <!--<h-button class="hsave" v-if="ifClearBtn" @click="handleClear">清空</h-button>-->
      <h-button type="primary" @click="submitForm" v-if="selectType == 'sign'">{{$t('m.i.bm.signOn')}}</h-button>
      <h-button type="primary" @click="selectCustAcct" v-if="selectType == 'select'">{{$t("m.i.common.commit")}}
      </h-button>
    </div>
  </h-msg-box>
</template>
<script>
  import { post, on, off, getSingleParamValuesByKeys } from "@/api/bizApi/commonUtil";

  export default {
    name: "showCustAcct",
    data() {
      let isCheckHidden = true;
      if(this.selectType === 'coll' || this.selectType === 'sign'){
        isCheckHidden = false;
      }
      let selection ={
        type: "selection",
        key:"duoxuan",
        width: 60,
        align: "center",
        hiddenCol: false
      };
      let radio = {
        title: ' ',
        type: 'radio',
        align: 'center',
        width : 60,
        hiddenCol: false
      };
      let columnsForOther = [
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          key:"xuhao",
          width: 60,
          align: "center",
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.common.custNo'),
          key: "custNo",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.custName'),
          key: "custName",
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t('m.i.common.acctName'),
          key: "acctName",
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t('m.i.bm.custAcctNo'),
          key: "custAcctNo",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.subAcctSrlNo'),
          key: "subAcctSrlNo",
          hiddenCol: this.isSubAcctWorks != "1"
        },
        {
          title: this.$t('m.i.common.custAcctType'),
          key: "custAcctType",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap,"custAcctType",params.row.custAcctType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          },
        },
        {
          title: this.$t('m.i.common.custAcctKind'),
          key: "custAcctKind",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap,"custAcctKind",params.row.custAcctKind);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          },
        },
        {
          title: this.$t('m.i.common.depositStyle'),
          key: "depositStyle",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap,"depositStyle",params.row.depositStyle);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          },
        },
        {
          title: this.$t('m.i.common.bailType'),
          key: "bailType",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap,"bailType",params.row.bailType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          },
        },
        {
          title: this.$t('m.i.bm.accountActiveFlag'),
          key: "activeFlag",
          hiddenCol: true,
          render: (h, params) => {
            let flag = "";
            if(params.row.activeFlag == "0"){
              flag = "未生效";
            } else if(params.row.activeFlag == "1"){
              flag = "生效";
            }
            return h("span", flag);
          }
        },
        {
          title: this.$t('m.i.bm.isOtherBankAcct'),
          key: "isOtherBankAcct",
          hiddenCol: false,
          render: (h, params) => {
            let flag = "";
            if(params.row.isOtherBankAcct == "1"){
              flag = "是";
            } else if(params.row.isOtherBankAcct == "0"){
              flag = "否";
            }
            return h("span", flag);
          }
        },
        {
          title: this.$t('m.i.bm.openDts'),
          key: "openDt",
          hiddenCol: true,
          render: (h, params) => {
            if(params.row.openDt == null || params.row.openDt == ""){
              return "";
            }
            let openDt = this.$moment(params.row.openDt, "YYYYMMDD").format("YYYY-MM-DD");
            return h("span", openDt);
          }
        },
        {
          title: this.$t('m.i.common.openBrchName'),
          key: "openBrchName",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.bm.openBrchNo'),
          key: "openBrchNo",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.openBankNo'),
          key: "openBankNo",
          hiddenCol: false
        },
      ];
      let columnsForColl = [
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          key:"xuhao",
          width: 60,
          align: "center",
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.common.custNo'),
          key: "custNo",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.custName'),
          key: "custName",
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t('m.i.common.acctName'),
          key: "acctName",
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t('m.i.bm.custAcctNo'),
          key: "custAcctNo",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.subAcctSrlNo'),
          key: "subAcctSrlNo",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.custAcctType'),
          key: "custAcctType",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap,"custAcctType",params.row.custAcctType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          },
        },
        {
          title: this.$t('m.i.common.custAcctKind'),
          key: "custAcctKind",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap,"custAcctKind",params.row.custAcctKind);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          },
        },
        {
          title: this.$t('m.i.common.depositStyle'),
          key: "depositStyle",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap,"depositStyle",params.row.depositStyle);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          },
        },
        {
          title: this.$t('m.i.common.bailType'),
          key: "bailType",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap,"bailType",params.row.bailType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          },
        },
        {
          title: this.$t('m.i.bm.accountActiveFlag'),
          key: "activeFlag",
          hiddenCol: true,
          render: (h, params) => {
            let flag = "";
            if(params.row.activeFlag == "0"){
              flag = "未生效";
            } else if(params.row.activeFlag == "1"){
              flag = "生效";
            }
            return h("span", flag);
          }
        },
        {
          title: this.$t('m.i.bm.openDts'),
          key: "openDt",
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.openDt == null || params.row.openDt == ""){
              return "";
            }
            let openDt = this.$moment(params.row.openDt, "YYYYMMDD").format("YYYY-MM-DD");
            return h("span", openDt);
          }
        },
        {
          title: this.$t('m.i.bm.openBrchNo'),
          key: "openBrchNo",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.openBrchName'),
          key: "openBrchName",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.busiOwnBrchNo'),
          key: "busiOwnBrchNo",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.busiOwnBrch'),
          key: "busiOwnBrchName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.openBankNo'),
          key: "openBankNo",
          hiddenCol: true
        },
      ];
      if (isCheckHidden) {
        columnsForOther.splice(0,0,radio);
        columnsForColl.splice(0,0,radio);
      } else {
        columnsForOther.splice(0,0,selection);
        columnsForColl.splice(0,0,selection);
      }
      return {
        columnsForOther:columnsForOther,
        columnsForColl:columnsForColl,
        columns : [],
        formItem : {
          custNo : '',
          custAcctNo : '',
          activeFlag : '1',
          isOtherBankAcct: '',
          subAcctSrlNo:'',
        },
        custAcctData : {rows:[],pageInfo: { count: 0 }},
        isRequired : true,
        dictMap : new Map(),
        currentSelectRow : null,
        updateFlag : "",
        isSubAcctWorks : "1",
        isCheckHidden: isCheckHidden,
        isMarketingBankMode: "1",
        isOnlineStdBill:"",
      };
    },
    props: {
      title: String,
      custAcctKind: "",
      bailType:"",
      discFlag:"",
      busiOwnBrchNo:"",
      showCustAcctWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      ifClearBtn: {
        type: Boolean,
        default() {
          return false;
        }
      },
      isAllBankAcct: {
        type: Boolean,
        default() {
          return false;
        }
      },
      selectCustNo: String,
      selectType: String,
      ifdoubleClick:{
        default() {
          return true;
        }
      },
      ifcheck: {
        default() {
          return false;
        }
      },
      isOtherBankAcct: {
        type: String,
        default: '0'
      },
      btnAuth:{
        type: Object,
        default(){
          return {
            custAcctFormItem:{
              isShow:true
            },
            subAcctSrlNoFormItem:{
              isShow:true
            }
          }
        }
      }
    },
    watch: {
      showCustAcctWin(val) {
        if (val === true) {
          if (this.isAllBankAcct) {
            this.isOtherBankAcct = null;
          }
          if (this.selectType === "coll") {
            this.columns = this.columnsForColl;
          } else {
            this.columns = this.columnsForOther;
          }
          this.$nextTick(() => {
            if(this.isSubAcctWorks === "1") {
              this.$refs.datagrid.controlColumnsHidden("subAcctSrlNo", false);
            } else {
              this.$refs.datagrid.controlColumnsHidden("subAcctSrlNo", true);
            }
            if(this.isMarketingBankMode === '1'){
              this.$refs.datagrid.controlColumnsHidden("busiOwnBrchNo", false);
              this.$refs.datagrid.controlColumnsHidden("busiOwnBrchName", false);
            } else {
              this.$refs.datagrid.controlColumnsHidden("busiOwnBrchNo", true);
              this.$refs.datagrid.controlColumnsHidden("busiOwnBrchName", true);
            }
          });
          if (this.selectType !== "coll") {
            this.$nextTick(() => {
              this.$refs.datagrid.dataChange(1);
            });
          }
          this.$nextTick(async () => {
            if (this.selectType !== "coll") {
              await this.getCustAcctList();
              this.$nextTick(() => {
                if(this.isOnlineStdBill === '1'){
                  this.$refs.datagrid.controlColumnsHidden("acctName", false);
                } else {
                  this.$refs.datagrid.controlColumnsHidden("acctName", true);
                }
              });
            } else {
              if(this.isOnlineStdBill === '1'){
                this.$refs.datagrid.controlColumnsHidden("acctName", false);
              } else {
                this.$refs.datagrid.controlColumnsHidden("acctName", true);
              }
            }
          });

          if (this.discFlag !==null || this.discFlag !=="") {
            if (this.discFlag ==="0") {
              this.isOtherBankAcct = "0";
            } else {
              this.isOtherBankAcct = "";
            }
          }
        }
      },
    },
    computed: {
      tempshowCustAcctWin: {
        get() {
          return this.showCustAcctWin;
        },
        set() {
        }
      },
    },
    methods: {
      doubleHandleClick(arr) {
        if(!this.ifdoubleClick){//不需要双击效果
          return;
        }
        if (this.isCheckHidden) {
          this.currentSelectRow = arr;
          this.selectCustAcct();
        }
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      getCustAcctList() {
        if (!this.showCustAcctWin) {
          return;
        }
        let url = "/bm/cust/acct/pageQueryCustAcctList";
        let custNo = this.selectCustNo;
        if (this.selectType == "coll") {
          url = "/bm/cust/acct/showCustAcct/func_pageQueryCustAcctCollList";
          if (this.formItem != null && this.formItem != undefined) {
            custNo = this.formItem.custNo;
          }
        }
        this.formItem.pageNo = this.$refs.datagrid.pageInfo.pageNo;
        this.formItem.pageSize = this.$refs.datagrid.pageInfo.pageSize;
        return post({
          "custNo": custNo, isOtherBankAcct: this.isOtherBankAcct, activeFlag: "1", custAcctKind: this.custAcctKind,
          "pageNo": this.formItem.pageNo, "pageSize": this.formItem.pageSize, "custAcctNo": this.formItem.custAcctNo,
          "subAcctSrlNo": this.formItem.subAcctSrlNo,"bailType":this.bailType,busiOwnBrchNo:this.busiOwnBrchNo
        }, url).then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode == "000000") {
                this.custAcctData = res.data.retData;
              } else {
                // 查询失败
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          }
        );
      },
      submitForm() {
        // 验证，必须至少选中一条数据
        let list =  this.$refs.datagrid.selectIds;
        if (list.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }

        // 获取check的array，提交到后台
        let url = "/bm/cust/acct/showCustAcct/func_collCustAcct";
        let msg = "保存同步数据成功";
        let acctDtos = this.$refs.datagrid.selects;
        let acctListJson = JSON.stringify(acctDtos);
        let formObjs = { acctListJson: acctListJson, custNo: this.formItem.custNo };

        let ids = [];
        if (this.selectType == "sign") {
          url = "/bm/sign/elecbusi/saveCustElecSign";
          msg = "签约成功";
          for (let i = 0; i < this.$refs.datagrid.selects.length; i++) {
            ids.push(this.$refs.datagrid.selectIds[i]);
          }
          formObjs = { ids: ids };
        }
        post(formObjs, url).then(res => {
          this.submitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.collListReset();
              this.$msgTip.success(this);
              // this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = null;
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.selectIds = [];
              this.updateFlag = "1";
              this.handleClose();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });

      },
      handleClose() {
        this.collListReset();
        this.formSearchReset();
        // this.$refs.datagrid.$refs.gridPage.clearElevator();
        this.$emit("showCustAcctWinClose", this.updateFlag);
        this.updateFlag = "";
      },
      formSearch() {
        this.$refs["formItem"].validate(valid => {
          if (valid) {
            if (!this.isCheckHidden) {
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.selectIds = [];
            }
            this.$refs.datagrid.dataChange(1);
          }
        });
      },
      formSearchReset() {
        if (this.selectType == "coll") {
          this.$refs.formItem.resetFields();
        }
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = null;
      },

      // 同步信息置空
      collListReset() {
        this.custAcctData = { rows: [], pageInfo: { count: 0 } };
      },
      // 选择一条记录反显
      selectCustAcct() {
        // 验证，只能选中一条数据
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          let obj = {
            "id": this.currentSelectRow.id,
            "custAcctNo": this.currentSelectRow.custAcctNo,
            "custAcctKind": this.currentSelectRow.custAcctKind,
            "subAcctSrlNo": this.currentSelectRow.subAcctSrlNo,
            "openBankNo": this.currentSelectRow.openBankNo,
            "bailType":this.currentSelectRow.bailType,
            "custAcctType":this.currentSelectRow.custAcctType
          };
          // 选择客户
          this.custAcctData = { rows: [], pageInfo: { count: 0 } };
          this.currentSelectRow = null;
          this.$refs.datagrid.selects = [];
          this.$refs.datagrid.selectIds = [];
          this.$emit("custAcctSelect", obj);
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      handleClear() {
        let obj = {
          "id": "",
          "custAcctNo": ""
        };
        // 清空客户选择信息
        this.$emit("custSelect", obj);
      }
    },
    created(){
      getSingleParamValuesByKeys("bm.cust.is_sub_acct_works,pc.is_marketing_bank_mode,bs.corpstdbill.is_online_std_bill").then(res => {
        this.isSubAcctWorks = res["bm.cust.is_sub_acct_works"];
        this.isMarketingBankMode = res["pc.is_marketing_bank_mode"];
        this.isOnlineStdBill = res["bs.corpstdbill.is_online_std_bill"];
      });
    },
    mounted() {
      this.getDictListByGroups("bailType,depositStyle,custAcctKind,custAcctType,Yon").then(res => {
        this.dictMap = res.get("map");
      });
    },
  };
</script>
<style>

</style>
