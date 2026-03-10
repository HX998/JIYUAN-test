<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form ref="formItem" :model="formItem" :label-width="90" class="h-form-search" cols="4">
              <!--  <own-brch-nos :formItem = "formItem" @brchNoWinOpen="brchNoWinOpen" v-if="this.licenseFlag"></own-brch-nos>-->
                <show-branch v-model="formItem.ownedBrchNames"  :label="$t('m.i.common.ownedBrchNo')"  prop="ownedBrchNames"
                             v-if="this.licenseFlag"    :showCheckBox="true"     :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames"
                             :params="{authPath:this.$route.path}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                             queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <bill-type v-model="formItem.billType" :dictList="billTypeList"></bill-type>
                <bill-no v-model="formItem.likeBillNo" prop="likeBillNo"></bill-no>
                <bill-money :formItem="formItem"></bill-money>
                <due-dt :formItem="formItem" :dueDt="dueDt"></due-dt>
                <query-btn v-on:showChange="showQry" :advanceShow='true' :formSearch='formSearch'
                           :formSearchReset='formSearchReset'></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
              :columns="columns"
              highlight-row
              url="/be/barter/payment/paymentApplAcct/func_pageQueryPayConfirmList"
              :bindForm="formItem"
              :hasSelect="hasSelect"
              rowSelect
              ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @on-click="showAcct()">{{$t("m.i.be.acct")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <acct-record :param="param" :showAcctRecordWin="showAcctRecordWin" @showAcctRecordWinClose="showAcctRecordWinClose"
                 :submitFlag="acctSubmitFlag"
                 :showPrintButton="showPrintButton"
                 @printSuccessCallback="printSuccessCallback"
                 url="/be/barter/payment/paymentApplAcct/func_queryAcctRecord"
                 @acctSubmitSure="paymentConfirmApplyApplyAcct"></acct-record>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="this.billId" :billNo="this.billNo"></bill-info-main>
    <image-loading :imageWin="imageWin"
                   :authObj="authObj1"
                   :imageParams="imageParams"
                   @imageWinClose="imageWinClose"></image-loading>

   <!-- <show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true" :checkStrictly="true"></show-license-branch>-->

  </div>
</template>

<script>
  import { post, on, formatNumber, getDictValueFromMap } from "@/api/bizApi/commonUtil";
  import { dateFormat } from "@/api/bizApi/be/barter/payment/payConfirmCommon";

  export default {
    name: "paymentApplAcct",
    components: {
      ShowHvpsBank: () => import(/* webpackChunkName: "shcpe/cpes/hvpsbank/showHvpsBank" */`@/views/bizViews/shcpe/cpes/hvpsbank/showHvpsBank`),
     // ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`),

    },
    data() {
      let formItem = {
        billType: "",
        billNo: "",
        likeBillNo: "",
        minBillMoney: "",
        maxBillMoney: "",
        minDueDt: "",
        maxDueDt: "",
        ownedBrchName:"",
        ownedBrchNo:"",
        ownedBrchNames:"",
        ownedBrchNos:"",
        authPath:this.$route.path ,
      };
      let columns = [
        {
          type: "selection",
          width: 50,
          align: "center",
          hiddenCol: false
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
          title: this.$t("m.i.billInfo.cfmAppType"),
          key: "cfmAppType",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = getDictValueFromMap(this.dictMap, "CfmAppType", params.row.cfmAppType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.be.cfmAppReqType"),
          key: "cfmAppReqType",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = getDictValueFromMap(this.dictMap, "CfmAppReqType", params.row.cfmAppReqType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.billInfo.billNo"),
          key: "billNo",
          hiddenCol: false,
          sortable: true,
            render: (h, params) => {
                let info = "", type = "";
                if (!!params.row.billId) {
                    info = params.row.billId;
                    type = "billId";
                } else {
                    info = params.row.billNo;
                    type = "billNo";
                }
                return h("a", {
                    on: {
                        click: () => {
                            this.showBillInfo(info, type);
                        }
                    }
                }, params.row.billNo);
            }
        },
        {
          title: this.$t("m.i.billInfo.dueDt"),
          key: "dueDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            return h("span", dateFormat(params.row.dueDt, "yyyy-MM-dd"));
          }
        },
        {
          title: this.$t("m.i.billInfo.billMoneyByUnit"),
          key: "billMoney",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            return h("span", formatNumber(params.row.billMoney, 2, ","));
          }
        },
        {
          title: this.$t("m.i.be.respBrchCode"),
          key: "respBrchCode",

          hiddenCol: false
        },
        {
          title: this.$t("m.i.be.transCustName"),
          key: "transCustName",

          hiddenCol: false
        },
        {
          title: this.$t("m.i.be.reqRemark"),
          key: "reqRemark",

          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.showImg"),
          key: "viewImg",
          hiddenCol: false,
          render: (h, params) => {
            return h("div", [
              h("a", {
                props: {
                  type: "primary",
                  size: "small"
                },
                style: {
                  marginRight: "5px"
                },
              on: {
                "click": () => {
                  this.getImgFile(params.row.billNo);
                }
              }
            }, this.$t("m.i.common.showImg"))]);
          }
        }];
      return {
        formItem: formItem,
        columns: columns,
        param: {},
        authObj1: {
          imageAdd: false,       //影像新增
          imageRegister: false,  //登记
          imageDelete: false     //删除
        },
        imageParams: {
          imgTypeList: [],
          billNo: "",
          isLock:"1",
          dictMap: new Map(),
          imgBusiType: "RI11",
          imageUrl : "/be/barter/payment/payConfirmApplyMain/func_queryImgInfo", //查询可查看影像url
          imgShowUrl : "/be/barter/payment/payConfirmApplyMain/func_showImg?id=", //查看影像url
        },
        dictMap: {},
        billTypeList: [],
        dueDt: [],
        ifShowMore: false,
        showAcctRecordWin: false,
        acctSubmitFlag: false,
        showPrintButton: false,
        showBillInfoWin: false,
        imageWin: false,
        hasSelect: false,
        billId: "",
        billNo: "",
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
        //brchNoWin: false,
        imageTypeList: []
      };
    },
    methods: {
      showQry(val) {
        this.ifShowMore = val;
      },
      formSearch() {
        this.$refs.datagrid.dataChange(1);
        /**清除多页选择的数据*/
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
      },
      formSearchReset() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.$refs.formItem.resetFields();
        this.dueDt = [];
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
      },
      showAcct() {
        let selects = this.$refs.datagrid.selects;
        if (null === selects || selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        let ids = [];
        let billClass = "";
        let billType = "";
        let ownedBrchNo = "";
        let flag = true;
        selects.forEach(row => {
          if (billType !== "" && billType !== row.billType) {
            this.$msgTip.info(this, { info: "请选择票据种类相同的票据记账" });
            return flag = false;
          }
          if (ownedBrchNo !== "" && ownedBrchNo !== row.ownedBrchNo) {
            this.$msgTip.info(this, { info: "请选择相同的机构下的票据记账" });
            return flag = false;
          }
          billType = row.billType;
          billClass = row.billClass;
          ownedBrchNo = row.ownedBrchNo;
          ids.push(row.id);
        });
        this.param = { ids: ids ,ownedBrchNo:ownedBrchNo,licenseFlag:this.licenseFlag};
        if(flag){
          this.showAcctRecordWin = true;
        }
      },
      printSuccessCallback() {
        this.showAcctRecordWinClose();
        this.$refs.datagrid.dataChange(1);
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
      },
      showAcctRecordWinClose() {
        this.showPrintButton = false;
        this.showAcctRecordWin = false;
      },
      paymentConfirmApplyApplyAcct(info) {
        this.acctSubmitFlag = true;
        post({ ids: info.ids,ownedBrchNo:info.ownedBrchNo,licenseFlag:this.licenseFlag }, "/be/barter/payment/paymentApplAcct/func_paymentConfirmApplyApplyAcct").then(res => {
          this.acctSubmitFlag = false;
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.showPrintButton = true;
              if (!info.isHasPrint) {
                this.showAcctRecordWinClose();
                this.$refs.datagrid.dataChange(1);
                this.$refs.datagrid.selectIds = [];
                this.$refs.datagrid.selects = [];
              }
              this.$msgTip.success(this, { info: this.$t("m.i.common.actionSuccess") });
            } else {
              this.$msgTip.error(this, { info: msg });
              this.$refs.datagrid.dataChange(1);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
        //票面
        billInfoWinClose(){
            this.showBillInfoWin = false;
        },
        showBillInfo(info, type) {
            this.billId = "";
            this.billNo = "";
            if (type === "billId") {
                this.billId = info;
            } else {
                this.billNo = info;
            }
            this.showBillInfoWin = true;
        },
      getImgFile(billNo) {
        this.imageWin = true;
        this.imageParams.billNo = billNo;
        this.imageParams.dictMap = this.dictMap;
        let item1 = {};
        let item2 = {};
        let item3 = {};
        item1.value = "贴现凭证";
        item2.value = "瑕疵证明";
        item3.value = "补充影像（贴现）";
        item1.key = "IM05";
        item2.key = "IM06";
        item3.key = "IM08";
        this.imageTypeList.push(item1);
        this.imageTypeList.push(item2);
        this.imageTypeList.push(item3);
        this.imageParams.imgTypeList = this.imageTypeList;
      },
      imageWinClose() {
        this.imageWin = false;
        this.imageParams.billNo = "";
        this.imageParams.imgTypeList = [];
        this.imageTypeList = [];
        this.imageParams.dictMap = new Map();
      },
     /* //根据弹框所选数据进行赋值
      brchNoChange(info) {
        let objs = [];
        if(info instanceof Array){
          objs = info;
        } else {
          objs[0] = info;
        }
        let brchNos = "";
        let brchNames = "";
        for(var i=0;i<objs.length; i++){
          brchNos += objs[i].id + ',';
          brchNames += objs[i].title + ',';
        }
        this.formItem.ownedBrchNos = brchNos.substring(0,brchNos.length - 1);
        this.formItem.ownedBrchNames = brchNames.substring(0,brchNames.length - 1);
        this.brchNoWin = false;
      },
      brchNoWinOpen() {this.brchNoWin = true;},
      brchNoWinClose() {
        this.brchNoWin = false;
      },*/
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,CfmAppReqType,CfmAppType,ImgType,ImgStatus").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.dictMap = res.get("map");
      });

      //有授权则显示业务所属机构列
      post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        this.authPath = this.$route.path;
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
        }else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    }
  };
</script>

<style scoped>

</style>
