<template>
  <!--纸票贴现登记申请-->
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div v-if="discRegisterBatchMain" key="1">
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
                  <cust-name :formItem = "formItem" @queryCustMessage="queryCustMessage"></cust-name>
                  <cust-acct-no :formItem = "formItem" @queryCustAcctNo="queryCustAcctNo"></cust-acct-no>
                  <batch-no v-model="formItem.batchNo"></batch-no>
                  <query-btn v-on:showChange="showQry" :advanceShow="this.licenseFlag" :formSearch='handleSearch' :formSearchReset='resetSearch'></query-btn>

                </h-form>
              </h-panel>
              <!-- 数据展示表格 -->
              <h-datagrid
                :columns="columns"
                highlight-row
                :bindForm="formItem"
                url="/ce/disc/paper/register/discRegisterApplyMain/func_pageQueryDiscBatchList"
                :auto-load="false"
                :on-current-change="handleSelectClick"
                :on-current-change-cancel="handleSelectClickCancel"
                ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <regist-apply-btn @handleForm="handleForm"></regist-apply-btn>
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
        <div v-if="discRegisterBillMain" key="2">
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="billFormItem" :label-width="90" ref="billFormItem" cols="4" class="h-form-search">
                <bill-no v-model="billFormItem.reverseBillNo" prop="reverseBillNo"></bill-no>
                <h-form-item :label="$t('m.i.billInfo.remitDt')" prop="minRemitDt">
                  <h-date-picker :value="remitDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleRemitDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <query-btn :advanceShow='false' :formSearch='billManagerHandleSearch' :formSearchReset='billManagerResetSearch'></query-btn>

              </h-form>
            </h-panel>
          </div>
        </div>
        <disc-register-info-detail :is-show="discRegisterBillMain" :batchId="this.discBatchId"
                                   :queryBatchUrl="'/ce/disc/paper/apply/discApplyBatchMain/func_queryDiscBatch'"
                                   :isQuery="isQuery" :discRgstStatusList="discRgstStatusList" ref="discRegisterInfoDetail"></disc-register-info-detail>
        <!-- 数据展示表格 -->
        <div v-if="discRegisterBillMain" key="3">
          <h-datagrid
            :columns="billColumns"
            highlight-row
            :auto-load="false"
            :bindForm="billFormItem"
            url="/ce/disc/paper/register/discRegisterApplyMain/func_pageQueryCeDiscBillList"
            :row-select="true"
            :has-select="hasSelect"
            ref="discRegisterBillDatagrid">
            <div slot="toolbar">
              <submit-check-btn @handleForm="registerBatch()"></submit-check-btn>
              <h-button type="primary" @click="updateRemark">{{$t('m.i.be.editRemark')}}</h-button>
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
          @imageWinClose="uploadImageWinClose"></image-loading>

        <!--票面信息-->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>
        <!--备注-->
        <remark-msg-box :remarkWin="editRemarkWin" title="修改备注信息" :param="param" @remarkWinClose="remarkWinClose" @remarkWinSubmit="remarkWinSubmit"></remark-msg-box>

      </h-col>
    </h-row>

    <!--业务所属机构-->
    <!--<show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true" :checkStrictly="true"></show-license-branch>-->

  </div>
</template>

<script>
  import { post, on, off,getDictListByGroups, getMoreParamValuesByKeys ,formatNumber, getDictValueFromMap ,accMul} from "@/api/bizApi/commonUtil";
  import {deepClone} from "@/utils/index";

  export default {
    name: "discRegisterApplyMain",
    components: {
      // DiscRegisterInfoDetail:() => import(/* webpackChunkName: "ce/disc/common/discRegisterInfoDetail" */`@/views/bizViews/ce/disc/common/discRegisterInfoDetail`) ,
      // ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`),
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
                    this.batchNoMain(params.row.id,params.row.ownedBrchNo)
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
                  this.showBillInfo(params.row.billId);
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
           title: this.$t("m.i.common.imgStatus"),
          key: "imgStatus",
          hiddenCol: false,
          render:(h,params) => {
            let dictValue = getDictValueFromMap(this.dictMap,"ImgMainStatus",params.row.imgStatus);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.ce.discountImg"),
          key: "discImage",
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
                    this.openImgWin(params.row.id,params.row.billNo)
                  }
                }
              }, '维护')
            ]);
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
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.drweBankName"),
          key: "drweBankName",
          sortable: true,
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
          title: this.$t("m.i.common.remark"),
          key: 'rgstRemark',
          hiddenCol: false,
        },
      ];
      return {
        formItem : {
          custName: "",
          custAcctNo: "",
          custNo:"",
          batchNo:"",
          funcNo:"",
          billClass:"ME01",
          discRgstStatusList:['BTF01', 'BTF06', 'BTF09'],
          ownedBrchName:"",
          ownedBrchNo:"",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath:this.$route.path ,
        },
        billFormItem : {
          billNo:"",
          reverseBillNo: "",
          minRemitDt : "",
          maxRemitDt : "",
          batchId:"",
          discRgstStatusList:['BTF01', 'BTF06', 'BTF09'],
        },
        remitDt : [],
        columns : columns,
        billColumns : billColumns,
        isList : [],
        dictMap : new Map(),
        discRegisterBatchMain : true,
        discRegisterBillMain : false,
        showCustAcctNoWin : false,
        showCustMessageWin : false,
        ifShowMore : false,
        currentSelectList : [],
        currentSelectRowInx : [],
        currentBillSelectList : [],
        currentBillSelectRowInx : [],
        discBatchId : "",
        isQuery : false,
        discRgstStatusList : [],
        showBillInfoWin : false,
        billId : "",
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
        editRemarkWin: false,
        imageParams : {
          discId:"",
          imgTypeList: [],//影像类型数据字典
          isByAttachId:true,
          imageUrl:"/ce/disc/paper/register/discRegisterReCheckMain/func_pageQueryDiscRgstImg", //查询可查看影像url
          imageUploadUrl:"/ce/disc/paper/register/discRegisterReCheckMain/func_loadImgFileAndSave", //影像上传url
          imageRegisterUrl:"/ce/disc/paper/register/discRegisterReCheckMain/func_sendAcptImgMsg", //影像登记url
          imageDeleteUrl:"/ce/disc/paper/register/discRegisterReCheckMain/func_deleteAcptImg", //影像删除url
          imgShowUrl:"/ce/disc/paper/register/discRegisterReCheckMain/func_showDiscImg?attachId=", //查看影像url
          listId:"",
          busiType:"RI03",
          billNo:"",
          licenseFlag :this.licenseFlag,
          ownedBrchNo :"",
        },
        queryType : "",
        hasSelect : false,
        temp:this.deepClone(columns),
        billTemp:this.deepClone(billColumns),
        param: {}
      };
    },
    mounted() {
      getDictListByGroups("QueryType,ArbitrateMode,ProtectType,RateType,PayType,DraftTypeCode,CorpScale,Yon,DiscRgstStatus,ImgMainStatus,AssetIndustry").then(res => {
        this.isList = res.get("Yon");
        this.dictMap = res.get("map");
      });
      getMoreParamValuesByKeys("ce.disc.rgst_audit_mode").then(res => {
        let idAudit = res['ce.disc.rgst_audit_mode'];
        if(idAudit == '0'){
          this.formItem.discRgstStatusList = ['BTF01', 'BTF05', 'BTF06', 'BTF09'];
          this.billFormItem.discRgstStatusList = ['BTF01', 'BTF05', 'BTF06', 'BTF09'];
        }
        this.handleSearch();
      });

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
            } else {
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
        this.ownedBrchNo = "";
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
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
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
      // 行选中
      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        this.ownedBrchNo = arr.ownedBrchNo;
        this.currentSelectRowInx = selectInx;
      },
      handleSelectClickCancel() {
        this.currentSelectList = [];
        this.ownedBrchNo = "";
      },
      //票据管理界面查询
      billManagerHandleSearch(){
        this.$nextTick(() => {
          this.hasSelect = false;
          this.$refs.discRegisterBillDatagrid.selects = [];
          this.$refs.discRegisterBillDatagrid.selectIds = [];
          this.$refs.discRegisterBillDatagrid.dataChange(1);
        });
      },
      //票据管理界面重置
      billManagerResetSearch(){
        this.$refs.billFormItem.resetFields();
        this.remitDt = [];
      },
      //票据管理界面行选中
      discRegisterBillHandleSelectClick(arr, selectInx) {
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
        this.discRegisterBatchMain = false;
        this.discBatchId = this.currentSelectList.id;
        this.billFormItem.batchId = this.currentSelectList.id;
        this.isQuery = true;
        this.discRgstStatusList = this.formItem.discRgstStatusList;
        this.discRegisterBillMain = true;
        this.billManagerHandleSearch();
        this.$nextTick(() => {
          this.billColumns = deepClone(this.billTemp);
          this.$refs.discRegisterBillDatagrid.selfAdaption();
          this.$refs.discRegisterBillDatagrid.createShowCol(this.billTemp);
        });
      },
      //返回
      returnBack() {
        this.billManagerResetSearch();
        this.currentSelectList = [];
        this.currentBillSelectList = [];
        this.resetSearch();
        this.isQuery = false;
        this.discRegisterBillMain = false;
        this.discRegisterBatchMain = true;
        this.$nextTick(() => {
          this.columns = deepClone(this.temp);
          this.$refs.datagrid.createShowCol(this.temp);
          this.$refs.datagrid.selfAdaption();
          this.handleSearch();
        });
      },
      //提交复核
      registerBatch() {
        if (this.$refs.discRegisterBillDatagrid.selects.length === 0) {
          this.$msgTip.info(this,{info:this.$t("m.i.common.chooseAtLeastOneRecord")});
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定提交复核吗？",
          onOk: () => {
            this.handleRegisterBatch();
          }
        });
      },
      handleRegisterBatch() {
        let ids = this.$refs.discRegisterBillDatagrid.selectIds.join(",");
        post({ ids: ids,id :this.billFormItem.batchId }, "/ce/disc/paper/register/discRegisterApplyMain/func_discRegImport").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this,{info:msg});
              if(this.$refs.discRegisterBillDatagrid.total === this.$refs.discRegisterBillDatagrid.selects.length) {
                this.returnBack();
              }else{
                this.$refs.discRegisterInfoDetail.getBatchInfo();
                this.$refs.discRegisterBillDatagrid.dataChange(this.$refs.discRegisterBillDatagrid.pageInfo.pageNo);
                this.currentBillSelectList = [];
                this.$refs.discRegisterBillDatagrid.selects = [];
                this.$refs.discRegisterBillDatagrid.selectIds = [];
              }
            } else {
              this.$msgTip.error(this,{info:res.data.retMsg});
              this.$refs.discRegisterBillDatagrid.dataChange(this.$refs.discRegisterBillDatagrid.pageInfo.pageNo);
            }
          } else {
            this.$msgTip.error(this,{info:this.$t('m.i.common.netError')});
          }
        });
      },
      //影像维护
      openImgWin(str,billNo) {
        this.imageParams.discId = str;
        this.imageParams.listId = str;
        this.imageParams.billNo = billNo;
        this.imageParams.imgTypeList.push({key: 'IM03', value: '贴现正面'});
        this.imageParams.imgTypeList.push({key: 'IM04', value: '贴现背面'});
        this.imageParams.imgTypeList.push({key: 'IM05', value: '贴现凭证'});
        this.imageParams.imgTypeList.push({key: 'IM06', value: '瑕疵证明'});
        this.imageParams.ownedBrchNo = this.ownedBrchNo;
        this.imageParams.licenseFlag = this.licenseFlag;
        this.queryType = 'add';
        this.showUploadImageWin = true;
      },
      //影像维护关闭
      uploadImageWinClose() {
        this.showUploadImageWin = false;
        this.imageParams.imgTypeList=[];
        this.billManagerHandleSearch();
      },
      //批次编号超链接
      batchNoMain(str,ownedBrchNo) {
        this.discBatchId = str;
        this.billFormItem.batchId = this.discBatchId;
        // this.batchInfoParams.id = this.discBatchId;
        // this.$refs.datagrid.tData = [];
        this.isQuery = true;
        this.discRgstStatusList = this.formItem.discRgstStatusList;
        this.discRegisterBatchMain = false;
        this.discRegisterBillMain = true;
        this.ownedBrchNo = ownedBrchNo;
        this.$nextTick(() => {
          this.billColumns = deepClone(this.billTemp);
          this.$refs.discRegisterBillDatagrid.selfAdaption();
          this.$refs.discRegisterBillDatagrid.createShowCol(this.billTemp);
        });
        this.billManagerHandleSearch();
      },
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(billId,billNo){
        this.billId = billId;
        this.showBillInfoWin = true;
      },
      //修改备注弹框
      updateRemark(){
        let ids = this.$refs.discRegisterBillDatagrid.selectIds.join(",");
        if (ids.length > 0) {
          this.param.ids = ids;
          this.param.id = this.billFormItem.batchId;
          this.editRemarkWin = true;
        }else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
        }
      },
      //关闭备注弹框
      remarkWinClose(){
        this.editRemarkWin = false;
      },
      //修改备注
      remarkWinSubmit(param, remark){
        post({ ids: param.ids,id: this.param.id,rgstRemark:remark }, "/ce/disc/paper/register/discRegisterApplyMain/func_updatePaperDiscBillRemark").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this,{info:msg});
              this.$refs.discRegisterBillDatagrid.dataChange(this.$refs.discRegisterBillDatagrid.pageInfo.pageNo);
              this.currentBillSelectList = [];
              this.$refs.discRegisterBillDatagrid.selects = [];
              this.$refs.discRegisterBillDatagrid.selectIds = [];
              this.remarkWinClose();
            } else {
              this.$msgTip.error(this,{info:res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      /*//根据弹框所选数据进行赋值
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
    }
  };
</script>

<style scoped>

</style>
