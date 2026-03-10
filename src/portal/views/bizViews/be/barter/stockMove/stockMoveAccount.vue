<!--移库跟踪查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" cols="4" ref="formItem" class="h-form-search">
                <!--<h-form-item :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" v-if="this.licenseFlag">
                  <h-input v-model="formItem.ownedBrchNames" icon="android-search" @on-click="brchNoWinOpen"
                           readonly clearable @on-clear="clearVal1('license')"
                           :title="formItem.ownedBrchNames"></h-input>
                </h-form-item>-->
                <show-branch v-model="formItem.ownedBrchNames"  :label="$t('m.i.common.ownedBrchNo')"  prop="ownedBrchNames"
                             v-if="this.licenseFlag"    :showCheckBox="true"     :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames"
                             :params="{authPath:this.$route.path}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                             queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item :label="$t('m.i.be.trDir')" prop="trDir">
                  <h-select v-model="formItem.trDir" placeholder="" :clearable="false">
                    <h-option v-for="item in trDirList" :value="item.value" :key="item.value">{{ item.label}}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billNo')" prop="likeBillNo">
                  <h-input v-model="formItem.likeBillNo"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="">
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="'移库申请日期'" prop="moveOutDtRange">
                    <h-date-picker :value="moveOutDtRange" type="daterange" showFormat :editable=false
                                   placeholder="" @on-change="handleMoveOutDtChange"></h-date-picker>
                </h-form-item>
               <!-- <h-form-item :label="'库存移入机构'" prop="moveInBrchName">
                  <h-input v-model="formItem.moveInBrchName" readonly
                           icon="android-search" @on-click="queryBrchCode('moveIn')"
                           clearable @on-clear="clearVal('MoveIn')"></h-input>
                </h-form-item>-->
                <show-cpes-branch v-model="formItem.moveInBrchCode" :label="$t('m.i.be.moveInBrchName')" class="h-form-long-label" prop="moveInBrchName"
                                  :brchCode.sync="formItem.moveInBrchCode"  :cpesBrchName.sync="formItem.moveInBrchName"
                                  datagridUrl="/cpes/branch/queryBranchList"
                                  queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

      <!--          <h-form-item :label="'库存移出机构'" prop="moveOutBrchName">
                  <h-input v-model="formItem.moveOutBrchName" readonly
                           icon="android-search" @on-click="queryBrchCode('moveOut')"
                           clearable @on-clear="clearVal('moveOut')"></h-input>
                </h-form-item>-->

                <show-cpes-branch v-model="formItem.moveOutBrchCode" :label="$t('m.i.be.moveOutBrchName')" class="h-form-long-label" prop="moveOutBrchName"
                                  :brchCode.sync="formItem.moveOutBrchCode"  :cpesBrchName.sync="formItem.moveOutBrchName"
                                  datagridUrl="/cpes/branch/queryBranchList"
                                  queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                <h-form-item :label="$t('m.i.be.moveType')" prop="moveType" v-show="formItem.trDir==='4'">
                  <h-select v-model="formItem.moveType" placeholder=""  showTitle :clearable="clearable">
                    <h-option v-for="item in stockMoveTypeList" :value="item.key" :key="item.key">{{ item.value}}</h-option>
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
            hasPage
            url="/be/barter/stockmove/stockMoveAccount/func_queryStockMoveAccountBill"
            :bindForm="formItem"
            :hasSelect="hasSelect" rowSelect
            showListCkeckBox
            ref="datagrid">
            <div slot="toolbar" class='pull-left'>
              <h-button type="primary" @click="account()">{{$t('m.i.be.acct')}}</h-button>
            </div>
          </h-datagrid>
          <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                          :billId="this.billId"></bill-info-main>
 <!--         <brch-code-search :brchCodeWin="brchCodeWinOpen" @brchCodeWinClose="brchCodeWinOpen=false"
                            @brchCodeChange="brchCodeWinOpenChange" optType="2"></brch-code-search>-->
          <!-- 分录弹框 -->
          <acct-record :param="this.acctRecordParam" :url="this.acctRecordUrl" :submitFlag="this.acctSubmitFlag" :showPrintButton="this.showPrintButton"
                       :show-acct-record-win="this.showAcctRecordWin" @acctSubmitSure="acctSubmitSure" @showAcctRecordWinClose="showAcctRecordWinClose"
                       @printSuccessCallback="printSuccessCallback" ref="showAcctRecord"></acct-record>
        </div>
      </h-col>
    </h-row>

    <!--<show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true"
                         :checkStrictly="true"></show-license-branch>-->

  </div>
</template>

<script>
  import { post, on, off, formatNumber } from "@/api/bizApi/commonUtil";
  import { dateFormat } from "@/api/bizApi/be/barter/payment/payConfirmCommon";

  export default {
    name: "stockMoveAccount",
    data() {
      return {
        clearable:false,
        acctRecordParam: {},
        acctRecordUrl:"/be/barter/stockmove/stockMoveAccount/func_queryRecord",
        acctSubmitFlag:false,
        showPrintButton:false,
        showAcctRecordWin:false,
       // brchCodeWinOpen:false,
        formItem: {
          trDir:"1",
          billNo: "",
          likeBillNo: "",
          billType:"",
          moveType:"",
          moveOutDtRange:"",
          minMoveOutDt:"",
          maxMoveOutDt:"",
          moveInBrchName:"",
          moveInBrchCode:"",
          moveOutBrchCode:"",
          moveOutBrchName:"",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath: this.$route.path
        },
        moveOutDtRange:[],
        stockMoveTypeList: [
          {
            key:"VT02",
            value:"行内移库拒收退票"
          },{
            key:"VT03",
            value:"保证增信拒收退票"
          },{
            key:"VT05",
            value:"退回瑕疵票据"
          },{
            key:"VT06",
            value:"退回线下追偿票据"
          },{
            key:"VT07",
            value:"退回公示催告票据"
          }
        ],
        billTypeList:[],
        hasSelect: false,
        billId: null,
        showBillInfoWin: false,
        //授权信息
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
        //brchNoWin: false,
        //数据字典转型
        dictMap: new Map(),
        //是否显示高级查询
        ifShowMore: false,
        tempShowExcelTemplateWin: false,
        param: null,
        rows: null,
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "ownedBrchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.moveType'),
            ellipsis:false,
            key: "moveType",
            hiddenCol:false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap,"StockMoveType",params.row.moveType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billNo'),
            key: "billNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t('m.i.billInfo.billMoney'),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.billMoney, 2, ","));
            },
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", dateFormat(params.row.dueDt, "yyyy-MM-dd"));
            }
          },

          {
            title: this.$t('m.i.be.moveApplDt'), //移库申请日期
            ellipsis: false,
            key: "moveOutDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", dateFormat(params.row.moveOutDt, "yyyy-MM-dd"));
            }
          },
          {
            title: this.$t('m.i.billInfo.acptBankName'),
            ellipsis: false,
            key: "acptBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.hldrBrchName'),
            key: "hldrBrchName",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.moveInBrchName'),
            ellipsis: false,
            key: "moveInBrchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.moveOutBrchName'),
            ellipsis: false,
            key: "moveOutBrchName",
            hiddenCol: false
          },
          {
            title:"记账状态",
            key:"acctStatus",
            hiddenCol:false,
            render: (h, params) => {
              let dictValue;
              if (this.formItem.trDir==="3") {
                 dictValue = this.getDictValueFromMap(this.dictMap, 'AcctFlag', params.row.cancelAcctStatus);
              }else {
                 dictValue = this.getDictValueFromMap(this.dictMap, 'AcctFlag', params.row.acctStatus);
              }
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }
          ],
        trDirList: [{
          value: "1",
          label: "移出"
        }, {
          value: "2",
          label: "移入"
        },{
          value:"3",
          label:"移出撤回"
        },{
          value:"4",
          label:"退票签收"
        }],
        type:""
      };
    },
    components: {
      //BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`),
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)

    },
    methods: {
      //获取分录信息
      getEntryInfo() {
        let list = this.$refs.datagrid.selects;
        if (null === list || list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        let ownedBrchNo = "";
        let flag = true;
        list.forEach(row => {
          if (ownedBrchNo !== "" && ownedBrchNo !== row.ownedBrchNo) {
            this.$msgTip.info(this, { info: "请选择相同的机构下的票据记账" });
            return flag = false;
          }
          ownedBrchNo = row.ownedBrchNo;
        });
        this.formItem.ownedBrchNo = ownedBrchNo;
        this.acctRecordParam = {trDir: this.formItem.trDir, ids: this.$refs.datagrid.selectIds,
          ownedBrchNo:ownedBrchNo,licenseFlag:this.licenseFlag}
          if(flag){
            this.showAcctRecordWin = true;
          }

      },
      //确定记账
      acctSubmitSure(info) {
        let param = {ids: this.$refs.datagrid.selectIds, trDir: this.formItem.trDir,
          ownedBrchNo:this.formItem.ownedBrchNo,licenseFlag:this.licenseFlag};
        this.acctSubmitFlag = true;
        post(param, "/be/barter/stockmove/stockMoveAccount/func_account").then(res => {
          this.acctSubmitFlag = false;
          if(res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(1);
              this.showPrintButton = true;
              if(!info.isHasPrint) {
                this.showAcctRecordWinClose();
              }
            } else {
              this.$msgTip.error(this, { info: msg });
              this.showAcctRecordWinClose();
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      //打印成功回调
      printSuccessCallback() {
        this.showAcctRecordWinClose();
      },
      //关闭分录弹窗
      showAcctRecordWinClose() {
        this.showAcctRecordWin = false;
        this.showPrintButton = false;
        this.acctRecordParam = {};
      },
     /* queryBrchCode(value){
        this.type=value;
        this.brchCodeWinOpen=true
      },
      //根据弹框所选数据进行赋值
      brchCodeWinOpenChange(info) {
        debugger
        if (info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        if (this.type==='moveIn'){
          this.formItem.moveInBrchCode = info.brchCode;
          this.formItem.moveInBrchName = info.brchFullNameZh;
        }else if (this.type==='moveOut') {
          this.formItem.moveOutBrchCode = info.brchCode;
          this.formItem.moveOutBrchName = info.brchFullNameZh;
        }
        this.brchCodeWinOpen = false;
      },*/
      account(){
        if (this.$refs.datagrid.selects.length>0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确定记账吗?",
            onOk: () => {
              this.getEntryInfo();
            }
          });
        }else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
        }
      },
     /* clearVal(value){
        if (value==='moveIn'){
          this.formItem.moveInBrchCode='';
          this.formItem.moveInBrchName='';
        }else {
          this.formItem.moveOutBrchCode='';
          this.formItem.moveOutBrchName=''
        } ;
      },*/
      /**
       * 列表搜索
       * */
      formSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];

        this.$refs.datagrid.dataChange(1);
      },
      handleMoveOutDtChange(arr){
        if (arr && arr.length >= 2) {
          this.formItem.minMoveOutDt = arr[0].replace(/-/g, "");
          this.formItem.maxMoveOutDt = arr[1].replace(/-/g, "");
          this.moveOutDtRange = [arr[0],arr[1]];
        } else {
          this.formItem.minMoveOutDt = "";
          this.formItem.maxMoveOutDt = "";
          this.moveOutDtRange = [];
        }
      },
      /**
       * 查询区域重置
       * */
      formSearchReset() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.moveOutDtRange = [];

        this.formItem.moveType = "";
        this.formItem.minMoveOutDt = "";
        this.formItem.maxMoveOutDt = "";
        this.formItem.moveInBrchCode="";
        this.formItem.moveOutBrchCode="";
        this.$refs.formItem.resetFields();
        /*if (this.formItem.trDir==="4"){
          this.formItem.moveType="VT02";
        }*/
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showBillInfo(billId) {
        this.billId = billId;
        this.showBillInfoWin = true;
      },

     /* //根据弹框所选数据进行赋值
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
      },*/
    },
    watch:{
      'formItem.trDir'(obj){
        this.$nextTick(() => {
          if (obj==='4'){
            this.clearable=false
            this.formItem.moveType="VT02";
          }else if(obj==='3' || obj==='1'){
            this.clearable=true
            this.formItem.moveType="VT01"
          } else if (obj==='2'){
            this.clearable=true
            this.formItem.moveType="VT01"
          }
          this.$refs.datagrid.dataChange(1);
        })
      }
    },
    mounted() {
      this.getDictListByGroups("BarterTrustStatus,DraftTypeCode,StockMoveType,AcctFlag").then(res => {
        this.billStatusList = res.get("BarterTrustStatus");
        this.billTypeList = res.get("DraftTypeCode");
        this.dictMap = res.get("map");
      });

      post({ authPath: this.$route.path }, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            if (this.licenseFlag) {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
            } else {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", true);
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
