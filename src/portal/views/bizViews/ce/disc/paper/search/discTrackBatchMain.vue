<template>
  <!--纸票贴现跟踪查询-->
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div v-if="discTrackBatchMain" key="1">
          <div>
            <!--查询表单-->
            <div class="h-form-search-box">
              <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
                <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                  <!--<own-brch-nos :formItem = "formItem" @brchNoWinOpen="brchNoWinOpen" v-if="this.licenseFlag"></own-brch-nos>-->
                  <show-branch v-model="formItem.ownedBrchNos" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" title="机构名称"
                               :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames" v-if="this.licenseFlag" :params="{authPath: this.authPath}"
                               url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree" queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                  </show-branch>
                  <h-form-item :label="$t('m.i.common.brchName')" prop="brchNos">
                    <h-input v-model="formItem.brchNos" placeholder="" readonly
                             icon="android-search" @on-click="queryBrchNo"
                             v-show="false"
                    ></h-input>
                    <h-input v-model="formItem.branchName" placeholder="" readonly
                             icon="android-search" @on-click="queryBrchNo" :title="formItem.branchName"
                    ></h-input>
                  </h-form-item>
                  <cust-name :formItem = "formItem" @queryCustMessage="queryCustMessage"></cust-name>
                  <cust-acct-no :formItem = "formItem" @queryCustAcctNo="queryCustAcctNo"></cust-acct-no>
                  <batch-no v-model="formItem.batchNo"></batch-no>
                  <query-btn v-on:showChange="showQry" :formSearch='handleSearch' :formSearchReset='resetSearch'></query-btn>
                </h-form>
              </h-panel>
              <!-- 数据展示表格 -->
              <h-datagrid
                :columns="columns"
                highlight-row
                :bindForm="formItem"
                url="/ce/disc/paper/search/discTrackBatchMain/func_pageQueryDiscBatchList"
                :on-current-change="handleSelectClick"
                :on-current-change-cancel="handleSelectClickCancel"
                ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <bill-manage-btn @handleForm="handleForm"></bill-manage-btn>
                </div>
              </h-datagrid>
              <!-- 查询客户信息弹窗 -->
              <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose" @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
              <!-- 查询客户账号信息弹窗 -->
              <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.custNo" :isAllBankAcct=true
                                 @showCustAcctNoWinClose="showCustAcctNoWinClose" @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
            </div>
          </div>
        </div>
        <div v-if="discTrackBillMain" key="2">
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="billFormItem" :label-width="90" ref="billFormItem" cols="4" class="h-form-search">
                <bill-no v-model="billFormItem.reverseBillNo" prop="reverseBillNo"></bill-no>
                <h-form-item :label="$t('m.i.common.acctStatus')" prop="acctStatus">
                  <h-select v-model="billFormItem.acctStatus" placeholder="">
                    <h-option v-for="item in acctStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.remitDt')" prop="minRemitDt">
                  <h-date-picker :value="remitDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleRemitDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <query-btn :advanceShow='false' :formSearch='billManagerHandleSearch' :formSearchReset='billManagerResetSearch'></query-btn>

              </h-form>
            </h-panel>
          </div>
        </div>
        <disc-batch-info-detail :is-show="discTrackBillMain" :batchId="this.discBatchId"
                                :queryBatchUrl="'/ce/disc/paper/apply/discApplyBatchMain/func_queryDiscBatch'"
                                :isQuery="isQuery" funcNo="" ></disc-batch-info-detail>
        <!-- 数据展示表格 -->
        <div v-if="discTrackBillMain" key="3">
          <h-datagrid
            :columns="billColumns"
            highlight-row
            :auto-load="false"
            :bindForm="billFormItem"
            url="/ce/disc/paper/register/discTrackBatchMain/func_pageQueryCeDiscBillList"
            :row-select="true"
            :has-select="hasSelect"
            ref="discTrackBillDatagrid">
            <div slot="toolbar">
              <go-back-btn @returnBack="returnBack"></go-back-btn>
            </div>
          </h-datagrid>
        </div>

        <!-- 影像维护 -->
        <image-loading
          :imageWin="showUploadImageWin"
          :imageParams="imageParams"
          :isShowDealPrcMsg="false"
          :isShowErrorMsg="true"
          :isShowImgStatus="true"
          :isShowApplStatus="false"
          :showImgPlat="true"
          :couldDel="false"
          @imageWinClose="uploadImageWinClose"></image-loading>

        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo"></bill-info-main>

      </h-col>
    </h-row>

    <!--业务所属机构-->
    <!--<show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true" :checkStrictly="true"></show-license-branch>-->
    <show-branch-sec :showBranchWin="showBranchWin" title="机构查询" @brchNoChange="brchNoChanges"
                 :ifcheck="true" :checkStrictly="true"  @showBranchWinClose="showBranchWinClose"></show-branch-sec>

  </div>
</template>

<script>
  import { post, on, off ,getDictListByGroups,formatNumber, getDictValueFromMap ,accMul } from "@/api/bizApi/commonUtil";
  import {deepClone} from "@/utils/index";

  export default {
    name: "discTrackBatchMain",
    components: {
      // DiscBatchInfoDetail:() => import(/* webpackChunkName: "ce/disc/common/discBatchInfoDetail" */`@/views/bizViews/ce/disc/common/discBatchInfoDetail`),
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)
      ShowBranchSec:()=>import(/* webpackChunkName: "be/market/rediscount/common/showBranch" */`@/views/bizViews/be/market/rediscount/common/showBranch`)
    },
    data() {
      let columns= [
        {
          title: ' ',
          type: 'radio',
          align: 'center',
          width : 50
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
          title: this.$t("m.i.common.batchNo"),
          key: "batchNo",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h('div', [
              h('a', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.batchNoMain(params.row.id)
                  }
                }
              }, params.row.batchNo)
            ]);
          }
        },
        {
          title: this.$t("m.i.common.custName"),
          key: "custName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.custAcctNo"),
          key: "custAcctNo",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.billType"),
          key: "billType",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          },
        },
        {
           title: this.$t("m.i.billInfo.discDt"),
          key: "discDt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.discDt == null || params.row.discDt === ""){
              return "";
            }
            let discDt = this.$moment(params.row.discDt, "YYYYMMDD").format("YYYY-MM-DD");
            return h("span", discDt);
          }
        },
        {
          title: this.$t("m.i.billInfo.discInterestRate"),
          key: "ratePct",
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.ce.totalCount"),
          key: "sumCount",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.totalAmt"),
          key: "sumMoney",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            let billMoney = formatNumber(params.row.sumMoney, 2, ',');
            return h("span", {
              domProps: {
                title: billMoney
              }
            }, billMoney);
          }
        },
        {
          title: this.$t("m.i.common.busiType"),
          key: "prodName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.interestMethod"),
          key: "payType",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = getDictValueFromMap(this.dictMap,"PayType",params.row.payType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          },
        },
        {
          title: this.$t("m.i.ce.salerCustName"),
          key: "salerCustName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.salerAcctNo"),
          key: "salerAcctNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.buyPayPcetByUnit"),
          key: "buyPayPcet",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.buyerPayInterName"),
          key: "payCustName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.buyerPayInterAcctNo"),
          key: "payAcctNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.thirdPayPcet"),
          key: "thirdPayPcet",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.thirdCustName"),
          key: "thirdCustName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.thirdAcctNo"),
          key: "thirdAcctNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.transCtrctNo"),
          key: "transCtrctNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.busiBrchName"),
          key: "busiBrchName",
          hiddenCol: false
        },
        {
            title: this.$t("m.i.common.corpScale"),
          key: "corpScale",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = getDictValueFromMap(this.dictMap,"CorpScale",params.row.corpScale);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          },
        },
        {
           title: this.$t("m.i.common.isGreenCorp"),
          key: "isGreenCorp",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = getDictValueFromMap(this.dictMap,"Yon",params.row.isGreenCorp);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          },
        },
      ];
      let billColumns = [
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
          title: this.$t("m.i.billInfo.billNo"),
          key: "billNo",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h("a", {
              on: {
                click: () => {
                  this.showBillInfo(params.row.billId, params.row.billNo);
                }
              }
            }, params.row.billNo);
          }
        },
        {
          title: this.$t("m.i.billInfo.flowStatus"),
          key: "flowStatusName",
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.discRgstStatus == null || params.row.discRgstStatus === ""){
              let flowStatusName = params.row.flowStatusName;
              return h("span", flowStatusName);
            }else {
              let discRgstStatus = getDictValueFromMap(this.dictMap,"DiscRgstStatus",params.row.discRgstStatus);
              return h("span",  discRgstStatus +"("+ params.row.flowStatusName+")");
            }
          }
        },
        {
          title: this.$t('m.i.common.acctStatus'),
          key: "acctStatus",
          hiddenCol: false,
          render:(h, params)=>{
            let list = getDictValueFromMap(this.dictMap, "AcctFlag", params.row.acctStatus);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t("m.i.billInfo.discInterestRate"),
          key: "ratePct",
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.billInfo.billType"),
          key: "billType",
          hiddenCol: false,
          render:(h,params) => {
            let dictValue = getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.ce.outAcctNo"),
          key: "putOutNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.drwrName"),
          key: "drwrName",
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.drweBankName"),
          key: "drweBankName",
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.drweBankNo"),
          key: "drweBankNo",
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.remitDt"),
          key: "remitDt",
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
          key: "dueDt",
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
          title: this.$t("m.i.billInfo.billMoney"),
          key: "billMoney",
          hiddenCol: false,
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
          title: this.$t("m.i.ce.isOwnBankAcpt"),
          key: "isAcpt",
          hiddenCol: false,
          render:(h,params) => {
            if (params.row.isAcpt == null || params.row.isAcpt === ""){
              return "";
            }
            if (params.row.isAcpt === '1') {
              return h("span", "是");
            } else {
              return h("span", "否");
            }
          }
        },
        {
          title: this.$t("m.i.ce.isSameCity"),
          key: "isSameCity",
          hiddenCol: false,
          render:(h,params) => {
            let dictValue = getDictValueFromMap(this.dictMap,"Yon",params.row.isSameCity);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.be.assetIndustry"),
          key: "busiClassify",
          hiddenCol: window.sessionStorage.getItem("isOpenI9")=="1"?false:true,
          render:(h,params) => {
            let dictValue = getDictValueFromMap(this.dictMap,"AssetIndustry",params.row.busiClassify);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.ce.interestDueDt"),
          key: "galeDt",
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.galeDt == null || params.row.galeDt === ""){
              return "";
            }
            let date = this.$moment(params.row.galeDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.ce.interestCalDays"),
          key: "interestCalDays",
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.ce.delayDays"),
          key: "delayDays",
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.ce.buyerInterest"),
          key: "buyerInterest",
          hiddenCol: false,
          render: (h, params) => {
            let buyerInterest = formatNumber(params.row.buyerInterest, 2, ',');
            return h("span", {
              domProps: {
                title: buyerInterest
              }
            }, buyerInterest);
          }
        },
        {
          title: this.$t("m.i.ce.salerInterest"),
          key: "salerInterest",
          hiddenCol: false,
          render: (h, params) => {
            let salerInterest = formatNumber(params.row.salerInterest, 2, ',');
            return h("span", {
              domProps: {
                title: salerInterest
              }
            }, salerInterest);
          }
        },
        {
          title: this.$t("m.i.ce.thirdInterest"),
          key: "thirdInterest",
          hiddenCol: false,
          render: (h, params) => {
            let thirdInterest = formatNumber(params.row.thirdInterest, 2, ',');
            return h("span", {
              domProps: {
                title: thirdInterest
              }
            }, thirdInterest);
          }
        },
        {
          title: this.$t("m.i.ce.realPayAmt"),
          key: "realPayAmt",
          hiddenCol: false,
          render: (h, params) => {
            let realPayAmt = formatNumber(params.row.realPayAmt, 2, ',');
            return h("span", {
              domProps: {
                title: realPayAmt
              }
            }, realPayAmt);
          }
        },
        {
          title: this.$t("m.i.ce.bankPayAmt"),
          key: "payAmt",
          hiddenCol: false,
          render: (h, params) => {
            let payAmt = formatNumber(params.row.payAmt, 2, ',');
            return h("span", {
              domProps: {
                title: payAmt
              }
            }, payAmt);
          }
        },
        {
          title: this.$t("m.i.ce.buyerCustName"),
          key: "buyerCustName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.discRgstDt"),
          key: "discRgstDt",
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.discRgstDt == null || params.row.discRgstDt === ""){
              return "";
            }
            let date = this.$moment(params.row.discRgstDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.ce.draftErrorReason"),
          key: "draftErrorReason",
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.common.discImage"),
          key: "discImage",
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.discRgstStatus === "BTF04"){
              return h('div', [
                h('a', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.openImgWin(params.row.id,params.row.billNo)
                    }
                  }
                }, '维护')
              ]);
            }
          }
        },
      ];
      return {
        showBranchWin:false,
        formItem : {
          brchNos: "",
          branchName:"",
          custName: "",
          custAcctNo: "",
          custNo:"",
          batchNo:"",
          funcNo:"",
          billClass:"ME01",
          ownedBrchName:"",
          ownedBrchNo:"",
          ownedBrchNames:this.$store.getters.userInfo.brchName,
          ownedBrchNos:this.$store.getters.userInfo.brchNo,
          authPath:this.$route.path ,
        },
        acctStatusList:[],
        billFormItem : {
          acctStatus:"",
          billNo:"",
          reverseBillNo: "",
          minRemitDt : "",
          maxRemitDt : "",
          funcNo:"",
          batchId:"",
        },
        remitDt : [],
        columns : columns,
        billColumns : billColumns,
        isList : [],
        dictMap : new Map(),
        prodMap : new Map(),
        discTrackBatchMain : true,
        discTrackBillMain : false,
        showCustAcctNoWin : false,
        showCustMessageWin : false,
        ifShowMore : false,
        currentSelectList : [],
        currentSelectRowInx : [],
        currentBillSelectList : [],
        currentBillSelectRowInx : [],
        // viewDetailForm : {},
        discBatchId : "",
        isQuery : false,
        showBillInfoWin : false,
        billId : "",
        billNo : "",
        //业务所属机构
        ownedBrchName:"",
        ownedBrchNo:"",
        ownedBrchNames:"",
        ownedBrchNos:"",
        licenseFlag:false,
        authPath:this.$route.path ,
        // brchNoWin : false,
        //影像上传
        showUploadImageWin : false,
        imageParams : {
          discId:"",
          imgTypeList: [],//影像类型数据字典
          isByAttachId:true,
          imageUrl:"/ce/disc/paper/register/discRegisterReCheckMain/func_pageQueryDiscRgstImg", //查询可查看影像url
          imageUploadUrl:"/ce/disc/paper/register/discRegisterReCheckMain/func_loadImgFileAndSave", //影像上传url
          imageRegisterUrl:"/ce/disc/paper/register/discRegisterReCheckMain/func_sendAcptImgMsg", //影像登记url
          imageDeleteUrl:"/ce/disc/paper/register/discRegisterReCheckMain/func_deleteAcptImg", //影像删除url
          imgShowUrl:"/ce/disc/paper/register/discRegisterReCheckMain/func_showDiscImg?attachId=", //查看影像url
          busiType:"RI03",
          listId:"",
          billNo:"",
          uploadType: "UM02",//补充影像
        },
        queryType : "",
        hasSelect : false,
        temp:this.deepClone(columns),
        billTemp:this.deepClone(billColumns),
      };
    },
    mounted() {
      getDictListByGroups("QueryType,ArbitrateMode,AcctFlag,ProtectType,RateType,PayType,DraftTypeCode,CorpScale,Yon,DiscRgstStatus,AssetIndustry").then(res => {
        this.isList = res.get("Yon");
        this.dictMap = res.get("map");
      });
      let item1 = {};
      let item2 = {};
      let item3 = {};
      item1.value = "未记账";
      item2.value = "已记账";
      item3.value = "记账失败";
      item1.key = "0";
      item2.key = "1";
      item3.key = "2";
      this.acctStatusList.push(item1);
      this.acctStatusList.push(item2);
      this.acctStatusList.push(item3);
      //有授权则显示业务所属机构列
      post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        this.authPath = this.$route.path;
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            let  columns = [];
            if (this.licenseFlag) {
              columns = this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
            }else {
              columns = this.$refs.datagrid.controlColumnsHidden("ownedBrchName", true);
            }
            this.temp = this.deepClone(columns);
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        }else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    methods: {
      clearVal1(){
        this.formItem.brchNos = "";
        this.formItem.branchName = "";
      },
      //查询机构弹出框
      queryBrchNo() {
        this.showBranchWin = true;
      },
      showBranchWinClose() {
        this.showBranchWin = false;
      },
      //根据弹框所选数据进行赋值
      brchNoChanges(info) {

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
        this.formItem.brchNos = brchNos.substring(0,brchNos.length - 1);
        this.formItem.branchName = brchNames.substring(0,brchNames.length - 1);
        this.showBranchWin = false;
      },
      showQry(val){
        this.ifShowMore = val;
      },
      //搜索选择框清空事件
      clearVal(optType){
        if(optType === "custName"){
          this.formItem.custName = "";
          this.formItem.custNo = "";
        }
        if(optType === "custAcctNo"){
          this.formItem.custAcctNo = "";
        }
      },
      //查询
      handleSearch() {
        this.$refs.datagrid.dataChange(1);
      },
      //重置查询结果
      resetSearch() {
        // this.$refs.formItem.resetFields();
        this.formItem.custNo = '';
        this.formItem.custName = '';
        this.formItem.custAcctNo = '';
        this.formItem.batchNo = '';
        this.billFormItem.billNo = '';
        this.billFormItem.reverseBillNo = '';
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = this.$store.getters.userInfo.brchNo;
        this.formItem.ownedBrchNames = this.$store.getters.userInfo.brchName;
        this.formItem.brchNos = this.$store.getters.userInfo.brchNo;
        this.formItem.branchName = this.$store.getters.userInfo.brchName;
      },
      // 行选中
      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
      },
      handleSelectClickCancel() {
        this.currentSelectList = [];
      },
      //票据管理界面查询
      billManagerHandleSearch(){
        this.$nextTick(() => {
          this.hasSelect = false;
          this.$refs.discTrackBillDatagrid.selects = [];
          this.$refs.discTrackBillDatagrid.selectIds = [];
          this.$refs.discTrackBillDatagrid.dataChange(1);
        });
      },
      //票据管理界面重置
      billManagerResetSearch(){
        this.$refs.billFormItem.resetFields();
        this.remitDt = [];
      },
      //票据管理界面中行选中
      discTrackBillHandleSelectClick(arr, selectInx) {
        this.currentBillSelectList = arr;
        this.currentBillSelectRowInx = selectInx;
      },
      //查询客户信息
      queryCustMessage() {
        this.showCustMessageWin = true;
      },
      //根据客户信息查询框所选数据进行赋值
      custCorpSelectSubmit(info) {
        this.formItem.custAcctNo = "";
        this.formItem.custName = info.custName;
        this.formItem.custNo = info.custNo;
        if(info.custAcctNo !== ""){
          this.formItem.custAcctNo = info.custAcctNo;
        }
        this.showCustMessageWin = false;
      },
      //客户信息查询框关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //查询客户账号
      queryCustAcctNo() {
        if (this.formItem.custNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustAcctNoWin = true;
      },
      //根据客户账号查询框所选数据进行赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.custAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //客户账号查询框关闭
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },
      handleRemitDtChange(arr) {
        if (arr && arr.length == 2) {
          this.billFormItem.minRemitDt = arr[0].replace(/-/g, "");
          this.billFormItem.maxRemitDt = arr[1].replace(/-/g, "");
          this.remitDt = [arr[0], arr[1]];
        } else {
          this.billFormItem.minRemitDt = "";
          this.billFormItem.maxRemitDt = "";
          this.remitDt = [];
        }
      },
      //票据管理
      handleForm() {
        if (this.currentSelectList.length > 1) {
          this.$msgTip.info(this,{info:this.$t("m.i.common.onlyChooseOneData")});
          return;
        }
        if (this.currentSelectList.length === 0) {
          this.$msgTip.info(this,{info:this.$t("m.i.common.chooseDataFirst")});
          return;
        }
        this.discTrackBatchMain = false;
        this.discBatchId = this.currentSelectList.id;
        this.billFormItem.batchId = this.currentSelectList.id;
        this.isQuery = true;
        this.discTrackBillMain = true;
        this.billManagerHandleSearch();
        this.$nextTick(() => {
          this.billColumns = deepClone(this.billTemp);
          this.$refs.discTrackBillDatagrid.selfAdaption();
          this.$refs.discTrackBillDatagrid.createShowCol(this.billTemp);
        });
      },
      //返回
      returnBack() {
        this.currentSelectList = [];
        this.currentBillSelectList = [];
        this.$refs.discTrackBillDatagrid.selects = [];
        this.$refs.discTrackBillDatagrid.selectIds = [];
        this.discBatchId = "";
        this.resetSearch();
        this.isQuery = false;
        this.discTrackBillMain = false;
        this.discTrackBatchMain = true;
        this.billManagerResetSearch();
        this.$nextTick(() => {
          this.columns = deepClone(this.temp);
          this.$refs.datagrid.createShowCol(this.temp);
          this.$refs.datagrid.selfAdaption();
        });
      },
      //批次编号超链接
      batchNoMain(str) {
        this.discBatchId = str;
        this.billFormItem.batchId = this.discBatchId;
        // this.batchInfoParams.id = this.discBatchId;
        // this.$refs.datagrid.tData = [];
        this.isQuery = true;
        this.discTrackBatchMain = false;
        this.discTrackBillMain = true;
        this.$nextTick(() => {
          this.billColumns = deepClone(this.billTemp);
          this.$refs.discTrackBillDatagrid.selfAdaption();
          this.$refs.discTrackBillDatagrid.createShowCol(this.billTemp);
        });
        this.billManagerHandleSearch();
      },
      //影像维护
      openImgWin(str,billNo) {
        this.imageParams.discId = str;
        this.imageParams.listId = str;
        this.imageParams.billNo = billNo;
        this.imageParams.imgTypeList.push({key: 'IM05', value: '贴现凭证'});
        this.imageParams.imgTypeList.push({key: 'IM06', value: '瑕疵证明'});
        this.imageParams.imgTypeList.push({key: 'IM08', value: '贴现影像补充登记'});
        this.queryType = 'modify';
        this.showUploadImageWin = true;
      },
      //影像维护关闭
      uploadImageWinClose() {
        this.showUploadImageWin = false;
        this.imageParams.imgTypeList=[];
        this.billManagerHandleSearch();
      },
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(billId,billNo){
        this.billId = billId;
        this.billNo = billNo;
        this.showBillInfoWin = true;
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
    created() {
      let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
      this.formItem.brchNos = userInfo.brchNo;
      this.formItem.branchName = userInfo.brchName;
    }
  };
</script>

<style scoped>

</style>
