<!--提示保证申请-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
               <!-- <h-form-item :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" v-show="this.licenseFlag">
                  <h-input v-model="formItem.ownedBrchNames" icon="android-search" @on-click="brchNoWinOpen"
                           readonly clearable @on-clear="clearVal1('license')"
                           :title="formItem.ownedBrchNames"></h-input>
                </h-form-item>-->
                <show-branch v-model="formItem.ownedBrchNos" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" title="机构名称"
                             :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames" v-if="this.licenseFlag" :params="{authPath: this.authPath}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree" queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>

                <common-select v-model="formItem.billOrigin" :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                               :dictList="billOriginList"></common-select>

                <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="reverseBillNo">
                  <h-input v-model="formItem.reverseBillNo" :maxlength="30"></h-input>
                </h-form-item>
                <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>

                <common-select v-model="formItem.billType" :label="$t('m.i.billInfo.billType')" prop="billType"
                               :dictList="billTypeList"></common-select>

                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
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
            url="/bp/guaranty/apply/func_queryCanSendGuarantyBillByPage"
            :bindForm="formItem"
            :has-select="false"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            param-id="hldrId"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="guaranteeApply()" v-if="authObj.guaranteeAuth">提示保证</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--提示保证弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" :mask-closable="false" @on-close="handleWinClose"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span>提示保证</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.ce.guarntrType')" prop="guarntrType" :required="isRequired">
            <h-select v-model="addForm.guarntrType" readonly placeholder="" showTitle>
              <h-option v-for="item in guarntrTypeList" :value="item.key" :key="item.value">{{ item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.guarantorName')" prop="custName" :required="isRequired">
            <h-input v-model="addForm.custName" :maxlength=60 :lengthByByte="false"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.guarantorAcctNo')" prop="custAcctNo" :required="isRequired" :validRules="custAcctNoRule">
            <h-input v-model="addForm.custAcctNo" :maxlength=35></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.guarantorBankNo')" prop="custBankNo" :required="isRequired"
                       :validRules="guarntrBankNoRule">
            <h-input v-model="addForm.custBankNo" :maxlength=12 placeholder="12位数字"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.guarantorAcctName')" prop="custAcctName" v-if="this.isShowAcctName">
            <h-input v-model="addForm.custAcctName" :maxlength=80 :lengthByByte="false" ></h-input>
          </h-form-item>
          <common-input v-model="addForm.billNo" :label="$t('m.i.billInfo.billPackageNo')" prop="billNo"
                   readonly></common-input>
          <common-type-field v-model="addForm.billMoney" :label="$t('m.i.billInfo.billPackageMoney')" prop="billMoney" :bigTips="false"
                         readonly></common-type-field>
          <common-input v-model="addForm.billRangeStr" :label="$t('m.i.billInfo.billRange')" prop="billRangeStr"
                         readonly></common-input>
          <common-type-field v-model="addForm.billMoney" :label="$t('m.i.bp.guarntrMoney')" prop="billMoney"
                         readonly></common-type-field>
          <h-form-item :label="$t('m.i.common.remark')" prop="guarntrApplRemark"  class="h-form-height-auto"  :validRules="reqRemarkRule">
            <h-input type="textarea" :rows=3 v-model="addForm.remark" :canResize="false"
                     :maxlength="150" :lengthByByte="false"></h-input>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="handleWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>


    <!--<show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true"
                         :checkStrictly="true"></show-license-branch>-->

  </div>
</template>

<script>
  import { on, off, post, formatNumber ,formatBillRange} from "@/api/bizApi/commonUtil";
  import CommonInput from "../../../../../components/bemp/input/commonInput";
  import CommonTypeField from "../../../../../components/bemp/typefield/commonTypeField";

  export default {
    name: "guaranteeApply",
    data() {
      function validcustAcctNo(rule,val,callback){
        let re = /^[a-zA-Z0-9]{1,32}$/;
        if(re.test(val)){
          callback()
        }else{
          callback(new Error("非法输入，只能输入英文、数字"))
        }
      }
      return {
        authObj: {
          guaranteeAuth: true           //提示保证
        },
        columns: [
          {
            title: " ",
            type: "radio",
            width: 60,
            align: "center",
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            key: "ownedBrchNo",
            hiddenCol: true
          },
          {
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "hldrName",
            hiddenCol: false
          },
          //票据来源列
          {
            title: this.$t("m.i.billInfo.billOrigin"),
            key: 'billOrigin',
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "BillOrigin", params.row.billOrigin);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billNo = params.row.billNo;
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row);
                  }
                }
              }, billNo);
            }
          },
          //子票区间列
          {
            title: this.$t("m.i.billInfo.billRange"),
            align:'center',
            key:"billRange",
            hiddenCol: false,
            render:(h,params) => {
              return h("span",formatBillRange(params.row.billOrigin,params.row.billRangeStart,params.row.billRangeEnd));
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageMoney"),
            key: "billMoney",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ",");
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.remitDt == null ? "" : this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.dueDt == null ? "" : this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.drweBankNo"),
            key: "drweBankNo",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              if (!params.row.drweBankNo) {
                return h("span", params.row.acptBankNo);
              } else {
                return h("span", params.row.drweBankNo);
              }
            }
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            sortable: true,
            hiddenCol: false,
            ellipsis: false
          }
        ],
        formItem: {
          billOrigin:"",
          billNo: "",
          minBillRangeStart:"",
          maxBillRangeEnd:"",
          billType: "",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          guarantyType:"2",
          reverseBillNo:"",
          authPath: this.$route.path
        },

        addForm: {
          billIds: "",
          hldrIds: "",
          guarntrType: "2",
          custName: "",
          custAcctNo: "",
          custAcctName: "",
          custBankNo: "",
          remark: "",
          ownedBrchNo: "",
          billNo:"",
          billMoney:"",
          billRangeStr:"",
          billOrigin:"",
          funcNo:"PIPB010101",
          licenseFlag: false
        },
        applyDto: {
          listDto: []
        },
        orgCodeRule: [{
          test: /^[0-9A-Z]{8}\-[0-9A-Z]$/,
          trigger: "blur",
          message: "组织机构代码由8位数字或大写字母加上“-”再加上一位数字或大写字母组成"
        }],

        guarntrBankNoRule: [{ test: /^[0-9]{12}$/, trigger: "blur", message: "保证人开户行行号由12位数字组成" }],
        custAcctNoRule: [{ test: validcustAcctNo, trigger: "blur" }],
        isRequired: true,
        ifShowMore: false,
        addOrEditWin: false,
        submitFlag: false,
        billTypeList: [],
        guarntrTypeList: [],
        currentSelectRow : [],
        billOriginList:[],
        isShowAcctName:false,
        dictMap: new Map(),
        showBillInfoWin: false,
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
        //brchNoWin: false,
        billId: "",
        billNo: "",
        reqRemarkRule: [{ test: this.validateReqRemark, trigger: "blur" }],

      };
    },
    components: {
      CommonTypeField,
      CommonInput
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)

    },
    computed: {
      isCustAcct() {
        return this.addForm.guarntrAcctNo === "0";
      }
    },
    methods: {
      validateReqRemark(rule, value, callback) {
        if(value){
          if(value.length>256){
            callback(new Error("备注长度不能超过256个字符"));
          }else{
            callback();
          }
        }else{
          callback();
        }
      },
      formSearch() {
        this.$refs.datagrid.selects = [];
        this.currentSelectRow=[];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.billOrigin="";
        this.formItem.billRangeStart="";
        this.formItem.billRangeEnd="";
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.$refs.formItem.resetFields();
      },
      handleWinClose() {
        this.addForm.billIds = "";
        this.addForm.hldrIds = "";
        this.$refs.addForm.resetFields();
        this.addForm.billNo = "";
        this.addForm.billMoney = "";
        this.addForm.billRangeStr = "";
        this.addForm.remark="";
        this.addForm.custName="";
        this.addForm.custAcctNo="";
        this.addForm.custBankNo="";
        this.addForm.ownedBrchNo="";
        this.addOrEditWin = false;
      },
      // 提示保证申请
      guaranteeApply() {
        this.isRequired = true;
        if (this.currentSelectRow == null || this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.isShowAcctName = this.currentSelectRow.billOrigin!=="CS01"?true:false;
        this.addOrEditWin = true;
        this.addForm.billOrigin = this.currentSelectRow.billOrigin;

        this.addForm.billNo = this.currentSelectRow.billNo;
        this.addForm.billMoney = this.currentSelectRow.billMoney;
        this.addForm.billRangeStr = formatBillRange(this.currentSelectRow.billOrigin,this.currentSelectRow.billRangeStart,this.currentSelectRow.billRangeEnd)
      },
      submitForm() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            if (this.addForm.billOrigin!=="CS01"&&this.addForm.custAcctNo!=='0'&&!this.addForm.custAcctName){
              this.$msgTip.error(this, { info: "保证人为企业时保证人账户名称为必输" });
              return;
            }
            this.addForm.hldrIds = this.currentSelectRow.hldrId;
            this.addForm.billIds = this.currentSelectRow.billId;
            this.addForm.ownedBrchNo = this.currentSelectRow.hldrBrchNo;
            this.submitFlag = true;
            let url = "/bp/guaranty/apply/func_sendGuarantyMsg";
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.handleWinClose();
                  let pageNo = this.$refs.datagrid.pageInfo.pageNo;
                  this.$refs.datagrid.dataChange(pageNo);
                  this.$refs.datagrid.selects = [];
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
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showBillInfo(row){
        this.billId = row.billId;
        this.billRangeStart = row.billRangeStart;
        this.billRangeEnd = row.billRangeEnd;
        this.showBillInfoWin = true;
      },
      /*//根据弹框所选数据进行赋值
      brchNoChange(info) {
        let objs = [];
        if (info instanceof Array) {
          objs = info;
        } else {
          objs[0] = info;
        }
        let brchNos = "";
        let brchNames = "";
        for (var i = 0; i < objs.length; i++) {
          brchNos += objs[i].id + ",";
          brchNames += objs[i].title + ",";
        }
        this.formItem.ownedBrchNos = brchNos.substring(0, brchNos.length - 1);
        this.formItem.ownedBrchNames = brchNames.substring(0, brchNames.length - 1);
        this.brchNoWin = false;
      },
      brchNoWinOpen() {
        this.brchNoWin = true;
      },
      brchNoWinClose() {
        this.brchNoWin = false;
      }*/
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,ElecGuarntrType,BillOrigin").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.guarntrTypeList = res.get("ElecGuarntrType");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });

      post({ authPath: this.$route.path }, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            if (this.licenseFlag) {
              this.$refs.datagrid.controlColumnsHidden("hldrName", false);
            } else {
              this.$refs.datagrid.controlColumnsHidden("hldrName", true);
            }
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    }
  };
</script>

<style scoped>

</style>
