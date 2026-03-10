<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.ownedBrchNos" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" title="机构名称"
                             :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames" v-if="this.licenseFlag" :params="{authPath: this.authPath}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree" queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <show-branch v-model="formItem.acptBrchNoList" :label="$t('m.i.common.brchName')" prop="acptBrchNoList"
                             title="机构名称" :showCheckBox="true"  isNeedChecked :brchNo.sync="formItem.acptBrchNoList" :brchName.sync="formItem.acptBrchNameList">
                </show-branch>
                <h-form-item prop="drwrName"  :label="$t('m.i.billInfo.drwrName')">
                  <h-input v-model="formItem.drwrName" placeholder="" icon="android-search" @on-click="queryCustName()" readonly
                           clearable @on-clear="clearVal('custName')"></h-input>
                </h-form-item>
                <h-form-item prop="drwrAcctNo" :label="$t('m.i.billInfo.drwrAcctNo')">
                  <h-input v-model="formItem.drwrAcctNo" placeholder="" icon="android-search" @on-click="queryCustAcctNo()" readonly
                           clearable @on-clear="clearVal('custAcctNo')"></h-input>
                </h-form-item>
                <common-select v-model="formItem.billOrigin" :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                               :dictList="billOriginList"></common-select>
                <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass">
                  <h-select v-model="formItem.billClass" placeholder="">
                    <h-option v-for="item in billClassList" :value="item.key" :key="item.value">{{ item.value}}
                    </h-option>
                  </h-select>
                </h-form-item>
                <bill-no :label="$t('m.i.billInfo.billPackageNo')"  v-model="formItem.reverseBillNo" prop="reverseBillNo"></bill-no>
                <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                <h-form-item prop="otherBankAcptMark" :label="$t('m.i.ce.otherBankAcptMark')">
                  <h-select v-model="formItem.otherBankAcptMark" placeholder="" showTitle>
                    <h-option v-for="item in YonList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="acptProtocalNoLike" :label="$t('m.i.billInfo.acptProtocalNo')">
                  <h-input v-model="formItem.acptProtocalNoLike" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="remitDt" :label="$t('m.i.billInfo.remitDt')">
                  <h-date-picker type="date" v-model="formItem.remitDt" placeholder="" @on-change="handleRemitDtChange" :editable=false></h-date-picker>
                </h-form-item>
                <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')">
                  <h-date-picker type="date" v-model="formItem.dueDt" placeholder="" @on-change="handleDueDtChange" :editable=false></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>

          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                      url="/ce/acpt/common/acptLoseRightMain/func_loseRigthQuery"
                      :bindForm="formItem"
                      :row-select="true"
                      :has-select="false"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="refundAcct()">{{$t('m.i.ce.account')}}</h-button>
            </div>
          </h-datagrid>

        </div>


        <!-- 查询客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose" @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>

        <!-- 查询客户账号信息弹窗 -->
        <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.drwrCustNo" @showCustAcctNoWinClose="showCustAcctNoWinClose" @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>

        <!-- 分录弹框 -->
        <acct-record :param="this.acctRecordParam" :url="this.acctRecordUrl" :submitFlag="this.acctSubmitFlag" :showPrintButton="this.showPrintButton"
                     :show-acct-record-win="this.showAcctRecordWin" @acctSubmitSure="acctSubmitSure" @showAcctRecordWinClose="showAcctRecordWinClose"
                     @printSuccessCallback="printSuccessCallback"></acct-record>
        <!-- 票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>

      </h-col>
    </h-row>
    <!--<show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWin = false" :ifcheck="true" :checkStrictly="true"></show-license-branch>-->
  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap,formatNumber,accMul,formatBillRange} from "@/api/bizApi/commonUtil";
  export default {
    name: "acptLoseRightMain",
    components: {
      //ShowBranch: () => import(/* webpackChunkName: "be/market/rediscount/common/showBranch" */ "@/views/bizViews/be/market/rediscount/common/showBranch")
    },
    data(){
      return {
        ifShowMore: false,
        licenseFlag:false,
        showCustMessageWin: false,
        showCustAcctNoWin: false,
        AcptTypeList: [],
        AcptStatusList: [],
        DeductStatusList: [],
        YonList: [],
        billClassList: [],
        dictMap: new Map(),
        showBranchWin:false,
        showAcctRecordWin: false,
        acctRecordParam: {},
        acctRecordUrl: "",
        acptIds: "",
        billId: "",
        showBillInfoWin: false,
        billOriginList : [],
        authPath: this.$route.path ,
        formItem: {
          billOrigin:"",
          reverseBillNo:"",
          /*brchNos: "",
          branchName:"",*/
          drwrCustNo: '',
          drwrName: '',
          drwrAcctNo: '',
          otherBankAcptMark: '',
          //billNoLike: '',
          acptProtocalNoLike: '',
          remitDt: '',
          dueDt: '',
          acptStatus: '',
          deductStatusList: [],
          payRgstDt:'',
          payRgstStatus:'',
          billClass: '',
          authPath:this.$route.path,
          ownedBrchNos:"",
          ownedBrchNames:"",
          /*brchNos:JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
          brchNames: JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,*/
          acptBrchNoList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
          acptBrchNameList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
          acptAcctFlag:"",
          backAcctFlag:"",
          paymentAcctFlag:""
        },
        columns: [
          {
            type: 'selection',
            key: 'multiSelect',
            width: 60,
            hiddenCol: false,
          },
          {
            type: 'index',
            key: 'numOrder',
            title: this.$t("m.i.common.index"),
            width: 60,
            align: 'center',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "ownedBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billOrigin"),
            align:'center',
            hiddenCol: false,
            render:(h,params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"BillOrigin",params.row.billOrigin);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billClass'),
            key: "billClass",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, 'CDMedia', params.row.billClass);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: 'billNo',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billNo = "";
              if (params.row.billNo === null || params.row.billNo === "") {
                billNo = "查看票面";
              }else {
                billNo = params.row.billNo;
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row);
                  }
                }
              }, billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            align:'center',
            key:"billRange",
            hiddenCol: false,
            render:(h,params) => {
              let billOrigin = params.row.billOrigin;
              let billRangeStart = params.row.billRangeStart;
              let billRangeEnd = params.row.billRangeEnd;
              return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd));
            }
          },
          {
            title: this.$t("m.i.ce.otherBankAcptMark"),
            key: 'otherBankAcptMark',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"Yon",params.row.otherBankAcptMark);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
          },
          {
            title: this.$t("m.i.billInfo.flowStatus"),
            key: 'flowStatusName',
            hiddenCol: false,
          },
          {
            title:  this.$t("m.i.billInfo.acptProtocalNo"),
            key: 'acptProtocalNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.promNoteNo"),
            key: 'promNoteNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: 'billType',
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageMoney"),
            key: 'billMoney',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ',');
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: 'pyeeName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: 'drwrName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: 'drwrAcctNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: 'remitDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.remitDt == null || params.row.remitDt === ""){
                return "";
              }
              let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: 'dueDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.dueDt == null || params.row.dueDt === ""){
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.common.brchName"),
            key: "transBrchName",
            hiddenCol: false,
          }
        ],
      }
    },
    mounted() {
      this.getDictListByGroups("AcptType,AcptStatus,DraftTypeCode,DeductStatusType,CDMedia,Yon,AcptRgstStatus,AcptCpesRgstType,InOutFlagCode,BillOrigin").then(res => {
        this.AcptTypeList = res.get("AcptType");
        this.DeductStatusList = res.get("DeductStatusType");
        this.billClassList = res.get("CDMedia");
        this.inOutFlagList = res.get("InOutFlagCode");
        this.billOriginList = res.get("BillOrigin");
        this.YonList = res.get("Yon");
        this.dictMap = res.get("map");
      });
      post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            if (this.licenseFlag) {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
            }else {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", true);
            }
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        }else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    methods:{
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(row){
        this.billId = row.billId;
        this.billRangeStart = row.billRangeStart;
        this.billRangeEnd = row.billRangeEnd;
        this.showBillInfoWin = true;
      },
      //表单查询
      handleSearch() {
        // this.getList();
        this.$refs.datagrid.selects = [];
        this.$nextTick(() => {
          this.$refs.datagrid.dataChange(1);
        })
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.drwrCustNo = '';
        this.formItem.ownedBrchNames ="";
        this.formItem.ownedBrchNos ="";
        this.formItem.acptBrchNoList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo;
        this.formItem.acptBrchNameList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
       /* this.formItem.brchNos = JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo;
        this.formItem.brchNames = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;*/
        /*let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
        this.formItem.brchNos = userInfo.brchNo;
        this.formItem.branchName = userInfo.brchName;*/
      },
      clearVal(type){
        if(type === 'custName'){
          this.formItem.drwrCustNo = '';
          this.formItem.drwrName = "";
        }else{
          this.formItem.drwrAcctNo = '';
        }
      },
      handleRemitDtChange(value) {
        this.formItem.remitDt = value.replace(/-/g, "");
      },
      handleDueDtChange(value) {
        this.formItem.dueDt = value.replace(/-/g, "");
      },
      queryCustName() {
        this.showCustMessageWin = true;
      },
      queryCustAcctNo() {
        if (this.formItem.drwrCustNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户！" });
          return;
        }
        this.showCustAcctNoWin = true;
      },
      custCorpSelectSubmit(info) {
        this.formItem.drwrAcctNo = "";
        this.formItem.drwrName = info.custName;
        this.formItem.drwrCustNo = info.custNo;
        if(info.custAcctNo !== ""){
          this.formItem.drwrAcctNo = info.custAcctNo;
        }
        this.showCustMessageWin = false;
      },
      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //关闭弹窗
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },
      //赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.drwrAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //记账
      refundAcct() {
        let list = this.$refs.datagrid.selectIds;
        let selects=this.$refs.datagrid.selects
        if (list == null || list.length == 0) {
          this.$msgTip.info(this, {info: this.$t('m.i.common.chooseAtLeastOneRecord')});
          return;
        } else {
          let ids = "";
          let list = this.$refs.datagrid.selects;
          let ownedBrchNo=list[0].ownedBrchNo;
          let flag=false;
          for(let i=0; i<list.length; i++) {
            ids += list[i].id;
            if(i<list.length-1) {
              ids += ",";
            }
            if (list[i].ownedBrchNo!==ownedBrchNo) {
              flag=true;
              break;
            }
          }
          if (flag) {
            this.$msgTip.info(this, { info: "请选择相同的机构下的票据记账" });
            return;
          }
          this.acptIds = ids;
          this.$hMsgBox.confirm({
            title: this.$t('m.i.common.confirm'),
            content: "是否提交已逾票据权利失效日记账？",
            onOk: () => {
              this.getEntryInfo();
            }
          })
        }
      },
      //获取分录信息
      getEntryInfo() {
        this.acctRecordUrl = "/ce/acpt/common/acptLoseRightMain/func_generateAcctRecord";
        this.acctRecordParam = {ids: this.acptIds,licenseFlag:this.licenseFlag,ownedBrchNo: this.$refs.datagrid.selects[0].ownedBrchNo};
        this.showAcctRecordWin = true;
      },

      //确定记账
      acctSubmitSure(info) {
        this.acctSubmitFlag = true;
        post({ids: this.acptIds,licenseFlag:this.licenseFlag,ownedBrchNo: this.$refs.datagrid.selects[0].ownedBrchNo}, "/ce/acpt/common/acptLoseRightMain/func_loseRightSubmitAcct").then(res => {
          this.acctSubmitFlag = false;
          if(res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.showPrintButton = true;
              if(!info.isHasPrint) {
                this.showAcctRecordWinClose();
              }
            } else {
              this.$msgTip.error(this, { info: msg });
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
        this.acctRecordUrl = "";
        this.$refs.datagrid.dataChange(1);
        this.$refs.datagrid.selects = [];
      },
    },
    created() {
     /* let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
      this.formItem.brchNos = userInfo.brchNo;
      this.formItem.branchName = userInfo.brchName;*/
    },
  }
</script>

<style scoped>

</style>
