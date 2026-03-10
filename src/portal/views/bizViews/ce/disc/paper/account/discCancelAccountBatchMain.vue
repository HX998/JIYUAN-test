<template>
  <!--纸票贴现撤销记账-->
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div v-if="discCancelAccountBatchMain" key="1">
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
                url="/ce/disc/paper/account/discCancelAccountBatchMain/func_pageQueryDiscBatchList"
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
        <div v-if="discCancelAccountBillMain" key="2">
          <!--查询表单-->
          <h-datagrid
            :columns="billManageColumns"
            highlight-row
            :auto-load="false"
            :bindForm="billManageFormItem"
            url="/ce/disc/paper/account/discCancelAccountBatchMain/func_pageQueryCancelAcctFlow"
            :row-select="true"
            :has-select="hasSelect"
            ref="discCancelAccountBillDatagrid">
            <div slot="toolbar">

              <cancel-account-btn @cancelAccountList="cancelAccountList"></cancel-account-btn>
              <detail-bill-btn @accountBillDetail="accountBillDetail"></detail-bill-btn>
              <go-back-btn @returnBack="returnBack"></go-back-btn>

            </div>
          </h-datagrid>
          <!--显示票据明细界面-->
          <h-msg-box v-model="billDetailSearchWin" width="800"  class="h-form-table-layer"
                     :maximize="true" >
            <p slot="header">
              <span>票据明细</span>
            </p>
            <h-datagrid
              :columns="billColumns"
              highlight-row
              :auto-load="false"
              :bindForm="billFormItem"
              url="/ce/disc/paper/account/discCancelAccountBatchMain/func_pageQueryCeDiscBillList"
              ref="billDatagrid">
            </h-datagrid>
            <!-- 弹出框模式底部按钮 -->
            <div slot="footer">
              <close-btn @close="billDetailClose"></close-btn>
            </div>
          </h-msg-box>
        </div>

        <!--显示流水明细界面-->
        <h-msg-box v-model="acctFlowDetailWin" width="1000" :mask-closable="false" @on-close="acctFlowDetailClose" top="10"
                   class="h-form-search-layer" :maximize="true">
          <p slot="header">
            <span>流水明细</span>
          </p>
          <h-datagrid
            :columns="acctFlowColumns"
            :url="acctFlowUrl"
            highlightRow
            :auto-load="false"
            :bindForm="acctFlowFormItem"
            :rowSelect="true"
            ref="acctFlowDatagrid">
            <div slot="toolbar" class="pull-left">
            </div>
          </h-datagrid>
          <div slot="footer">
            <close-btn @close="acctFlowDetailClose"></close-btn>
          </div>
        </h-msg-box>
        <!--票面信息-->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>
      </h-col>
    </h-row>

    <!--业务所属机构-->
    <!--<show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true" :checkStrictly="true"></show-license-branch>-->

    <cancel-acct-print :showCancelAcctPrintWin="showCancelAcctPrintWin" :frontFlowNos="frontFlowNo" @showCancelAcctPrintWinClose="showCancelAcctPrintWinClose"></cancel-acct-print>

  </div>
</template>

<script>
  import { post, on, off ,getDictListByGroups,formatNumber, getDictValueFromMap,getSingleParamValuesByKeys,accMul} from "@/api/bizApi/commonUtil";
  import {deepClone} from "@/utils/index";

  export default {
    name: "discCancelAccountBatchMain",
    components: {
      // DiscBatchInfoDetail:() => import(/* webpackChunkName: "ce/disc/common/discBatchInfoDetail" */`@/views/bizViews/ce/disc/common/discBatchInfoDetail`),
      // ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)
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
      let billManageColumns = [
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
          title: this.$t("m.i.ce.frontFlowNo"),
          key: "frontFlowNo",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            return h('div', [
              h('a', {
                on: {
                  click: () => {
                    this.showAcctFlowDetail(params.row.id)
                  }
                }
              }, params.row.frontFlowNo)
            ]);
          }
        },
        {
          title: this.$t("m.i.common.backFlowNo"),
          key: 'backFlowNo',
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.backFlowNo === null || params.row.backFlowNo === "") {
            return h('div', [
              h('a', {
                on: {
                  click: () => {
                    this.showAcctFlowDetail(params.row.id)
                  }
                }
              }, "查看明细")
            ]);
            }else {
              return h("span",
                {
                  domProps: {
                    title: params.row.backFlowNo
                  }
                }, params.row.backFlowNo);
            }
          }
        },
        {
          title: this.$t("m.i.common.prodName"),
          key: "prodName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.sendAcctBrchNo"),
          key: "sendAcctBrchNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.operTellerNo"),
          key: "operTellerNo",
          hiddenCol: false
        },
        {
         title: this.$t("m.i.ce.acctBrchNo"),
          key: "acctBrchNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.acctTellerNo"),
          key: "acctTellerNo",
          hiddenCol: false
        },
        {
         title: this.$t("m.i.common.acctDt"),
          key: "acctDt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.acctDt == null || params.row.acctDt === ""){
              return h("span","---");
            }
            let acctDt = this.$moment(params.row.acctDt, "YYYYMMDD").format("YYYY-MM-DD");
            return h("span", acctDt);
          }
        },
        {
          title: this.$t("m.i.common.transTm"),
          key: "transTm",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.transTm == null || params.row.transTm === "") {
              return h("span", "---");
            }
            if (params.row.transTm.toString().length < 6) {
              let transTm = params.row.transTm + "";
              for(let i=0; i<(6-params.row.transTm.toString().length); i++) {
                transTm = "0" + transTm;
              }
              let date = this.$moment(transTm, "HH:mm:ss").format("HH:mm:ss");
              return h("span", date);
            }else{
              let date = this.$moment(params.row.transTm, "HH:mm:ss").format("HH:mm:ss");
              return h("span", date);
            }
          }
        },
      ];
      return {
        showCancelAcctPrintWin:false,
        frontFlowNo:[],
        cancelType:"",
        acctFlowFormItem : {
          foreFlowIds: ""
        },
        acctFlowUrl : "",
        acctFlowDetailWin : false,
        acctAuthMode : false,
        acctFlowColumns : [
          {
            type: "selection",
            key: "multiSelect",
            width: 60,
            hiddenCol: false
          },
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.foreFlowNo"),
            key: "foreFlowNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.backFlowNo"),
            key: "backFlowNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.rowType"),
            key: "rowType",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.rowType === "1") {
                return h("span", "是");
              }
              return h("span", "否");
            }
          },
          {
            title: this.$t("m.i.common.prodName"),
            key: "prodName",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.sendAcctBrchNo"),
            key: "sendAcctBrchNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
           title: this.$t("m.i.common.operTellerNo"),
            key: "operTellerNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.accountBrchNo"),
            key: "accountBrchNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
          title: this.$t("m.i.common.acctTellerNo"),
            key: "acctTellerNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.acctDt"),
            key: "acctDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.acctDt == null || params.row.acctDt === "") {
                return "";
              }
              let date = this.$moment(params.row.acctDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.common.transTm"),
            key: "transTm",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.transTm == null || params.row.transTm === "") {
                return "";
              }
              let transTm = params.row.transTm.toString();
              if (params.row.transTm.toString().length < 6) {
                for (let i = 0; i < (6 - params.row.transTm.toString().length); i++) {
                  transTm = "0" + transTm;
                }
              }
              let date = this.$moment(transTm, "HH:mm:ss").format("HH:mm:ss");
              return h("span", date);
            }
          }
        ],
        billDetailColumns : [
          {
            type: "selection",
            key: "multiSelect",
            width: 60,
            hiddenCol: false
          },
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
           title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            ellipsis: false,
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
            title: this.$t("m.i.billInfo.flowStatus"),
            key: "flowStatusName",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.impawnBillParams.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.remitDt == null || params.row.remitDt === "") {
                return "";
              }
              let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.dueDt == null || params.row.dueDt === "") {
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
          title: this.$t("m.i.billInfo.billMoneyByUnit"),
            key: "billMoney",
            ellipsis: false,
            hiddenCol: false,
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
           title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            ellipsis: false,
            hiddenCol: false
          },
          {
           title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: "drwrAcctNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrBankNo"),
            key: "drwrBankNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            ellipsis: false,
            hiddenCol: false
          },
          {
           title: this.$t("m.i.billInfo.pyeeAcctNo"),
            key: "pyeeAcctNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
             title: this.$t("m.i.billInfo.pyeeBankNo"),
            key: "pyeeBankNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            ellipsis: false,
            hiddenCol: false
          }
        ],
        formItem : {
          custName: "",
          custAcctNo: "",
          custNo:"",
          batchNo:"",
          funcNo:"PICE021304",
          billClass:"ME01",
          ownedBrchName:"",
          ownedBrchNo:"",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath:this.$route.path ,
        },
        billManageFormItem : {
          batchId:"",
          billNo:""
        },
        columns : columns,
        billManageColumns : billManageColumns,
        billFormItem : {
          id:"",
          batchId:"",
          acctFlowId:""
        },
        billColumns : [
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
            render:(h,params) => {
              if(params.row.discRgstStatus == null || params.row.discRgstStatus === ""){
                let flowStatusName = params.row.flowStatusName;
                return h("span", flowStatusName);
              }else {
                let discRgstStatus = getDictValueFromMap(this.dictMap,"DiscRgstStatus",params.row.discRgstStatus);
                let name = discRgstStatus + "(" + params.row.flowStatusName + ")";
                return h("span", name);
              }
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
            title: this.$t("m.i.ce.innerRate"),
            key: "innerRate",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.innerInterest"),
            key: "innerInterest",
            hiddenCol: false
          },
        ],
        isList : [],
        dictMap : new Map(),
        discCancelAccountBatchMain : true,
        discCancelAccountBillMain : false,
        billDetailSearchWin : false,
        showCustAcctNoWin : false,
        showCustMessageWin : false,
        ifShowMore : false,
        currentSelectList : [],
        currentSelectRowInx : [],
        currentBillSelectList : [],
        currentBillSelectRowInx : [],
        discBatchId : "",
        isQuery : false,
        //业务所属机构
        ownedBrchName:"",
        ownedBrchNo:"",
        ownedBrchNames:"",
        ownedBrchNos:"",
        licenseFlag:false,
        authPath:this.$route.path ,
        // brchNoWin : false,
        //票面信息页面
        showBillInfoWin : false,
        billId : "",
        hasSelect : false,
        temp:this.deepClone(columns),
        billTemp:this.deepClone(billManageColumns),
      };
    },
    mounted() {
      getDictListByGroups("DraftTypeCode,PayType,CorpScale,Yon,DiscRgstStatus,AssetIndustry").then(res => {
        this.isList = res.get("Yon");
        this.dictMap = res.get("map");
      });
      post({ code: "04" }, "pc/acct/authorize/judgeAcctAuthorizeBusi").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.acctAuthMode = res.data.retData;
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
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
      },
      //重置查询结果
      resetSearch() {
        // this.$refs.formItem.resetFields();
        this.formItem.custNo = '';
        this.formItem.custName = '';
        this.formItem.custAcctNo = '';
        this.formItem.batchNo = '';
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos =  "";
        this.formItem.ownedBrchNames =  "";
      },
      // 行选中
      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
      },
      handleSelectClickCancel() {
        this.currentSelectList = [];
      },
      //票据明细界面查询
      billManageHandleSearch() {
        this.$nextTick(() => {
          this.hasSelect = false;
          this.$refs.discCancelAccountBillDatagrid.selects = [];
          this.$refs.discCancelAccountBillDatagrid.selectIds = [];
          this.$refs.discCancelAccountBillDatagrid.dataChange(1);
        });
      },
      //票据明细信息查询
      billHandleSearch() {
        this.$nextTick(() => {
          this.$refs.billDatagrid.dataChange(1);
        });
      },
      discCancelAccountBillHandleSelectClick(arr, selectInx) {
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
        this.discBatchId = this.currentSelectList.id;
        this.billManageFormItem.batchId = this.currentSelectList.id;
        this.discCancelAccountBatchMain = false;
        this.discCancelAccountBillMain = true;
        this.billManageHandleSearch();
        this.$nextTick(() => {
          this.billManageColumns = deepClone(this.billTemp);
          this.$refs.discCancelAccountBillDatagrid.selfAdaption();
          this.$refs.discCancelAccountBillDatagrid.createShowCol(this.billTemp);
        });
      },
      //返回
      returnBack() {
        this.currentSelectList = [];
        this.currentBillSelectList = [];
        this.resetSearch();
        this.discCancelAccountBillMain = false;
        this.discCancelAccountBatchMain = true;
        this.$nextTick(() => {
          this.columns = deepClone(this.temp);
          this.$refs.datagrid.createShowCol(this.temp);
          this.$refs.datagrid.selfAdaption();
        });
      },
      //撤销记账按钮下拉选择“选择撤销记账/批次撤销记账”
      cancelAccountList(str){
        this.cancelType=str;
        if (this.acctAuthMode) {
          if(str === "batch") {
            this.batchAcctAuthorize();
          }
          if(str === "select") {
            this.selectAcctAuthorize();
          }
        }else{
          if(str === "select"){
            this.cancelAccountSelect();
          }
          if(str === "batch"){
            this.cancelAccountBatch();
          }
        }
      },
      //选择撤销记账
      cancelAccountSelect(){
        if(this.$refs.discCancelAccountBillDatagrid.selects.length === 0){
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        let ids = this.$refs.discCancelAccountBillDatagrid.selectIds.join(",");
        let obj=this.$refs.discCancelAccountBillDatagrid.selects[0];
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定选择撤销记账吗?",
          onOk: () => {
            post({batchId : this.discBatchId , operType:"0" , foreFlowNos:ids}, "/ce/disc/paper/account/discCancelAccountBatchMain/func_cancelDiscAccount").then(res => {
              if(res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  if (obj.isPrint==="1" && res.data.retData && res.data.retData.length > 0) {
                      this.showCancelAcctPrintWin = true;
                      this.frontFlowNo = res.data.retData;
                  }else {
                    if(this.$refs.discCancelAccountBillDatagrid.total === this.$refs.discCancelAccountBillDatagrid.selects.length) {
                      this.returnBack();
                    }else{
                      this.$refs.discCancelAccountBillDatagrid.dataChange(this.$refs.discCancelAccountBillDatagrid.pageInfo.pageNo);
                      this.currentBillSelectList = [];
                      this.$refs.discCancelAccountBillDatagrid.selects = [];
                      this.$refs.discCancelAccountBillDatagrid.selectIds = [];
                    }
                  }
                } else {
                  this.$msgTip.error(this, { info: msg });
                  this.$refs.discCancelAccountBillDatagrid.dataChange(this.$refs.discCancelAccountBillDatagrid.pageInfo.pageNo);
                }
              }
            }).catch(error => {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });
          }
        });
      },
      //批次撤销记账
      cancelAccountBatch() {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定批次撤销记账吗？",
          onOk: () => {
            this.handleAccountBatch();
          }
        });
      },
      handleAccountBatch() {
        let obj=this.$refs.discCancelAccountBillDatagrid.tData[0];
        post({ batchId : this.discBatchId , operType:"1" }, "/ce/disc/paper/account/discCancelAccountBatchMain/func_cancelDiscAccount").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if (obj.isPrint==="1") {
                this.showCancelAcctPrintWin = true;
                this.frontFlowNo = res.data.retData;
              }else {
                this.returnBack();
                this.currentBillSelectList = [];
                this.$refs.discCancelAccountBillDatagrid.selects = [];
                this.$refs.discCancelAccountBillDatagrid.selectIds = [];
              }
            } else {
              this.$msgTip.error(this,{info:res.data.retMsg});
              this.$refs.discCancelAccountBillDatagrid.dataChange(this.$refs.discCancelAccountBillDatagrid.pageInfo.pageNo);
            }
          } else {
            this.$msgTip.error(this,{info:this.$t('m.i.common.netError')});
          }
        });
      },
      showCancelAcctPrintWinClose(){
        this.showCancelAcctPrintWin=false;
        console.log("执行了close方法")
        this.$msgTip.success(this);
        if (this.cancelType==="select") {
          if(this.$refs.discCancelAccountBillDatagrid.total === this.$refs.discCancelAccountBillDatagrid.selects.length) {
            this.returnBack();
          }else {
            this.$refs.discCancelAccountBillDatagrid.dataChange(this.$refs.discCancelAccountBillDatagrid.pageInfo.pageNo);
            this.currentBillSelectList = [];
            this.$refs.discCancelAccountBillDatagrid.selects = [];
            this.$refs.discCancelAccountBillDatagrid.selectIds = [];
          }
        }
        if (this.cancelType==="batch") {
          this.returnBack();
          this.currentBillSelectList = [];
          this.$refs.discCancelAccountBillDatagrid.selects = [];
          this.$refs.discCancelAccountBillDatagrid.selectIds = [];
        }
      },
      //票据明细界面
      accountBillDetail() {
        if (this.$refs.discCancelAccountBillDatagrid.selects.length > 1) {
          this.$msgTip.info(this,{info:this.$t("m.i.common.onlyChooseOneData")});
          return;
        }
        if (this.$refs.discCancelAccountBillDatagrid.selects.length === 0) {
          this.$msgTip.info(this,{info:this.$t("m.i.common.chooseOneData")});
          return;
        }
        this.billFormItem.acctFlowId = this.$refs.discCancelAccountBillDatagrid.selectIds;
        this.billFormItem.batchId = this.discBatchId;
        this.billDetailSearchWin = true ;
        this.billHandleSearch();
      },
      //票据明细关闭按钮
      billDetailClose(){
        this.billDetailSearchWin = false ;
      },
      //批次编号超链接
      batchNoMain(str) {
        this.discBatchId = str;
        this.billManageFormItem.batchId = this.discBatchId;
        this.discCancelAccountBatchMain = false;
        this.discCancelAccountBillMain = true;
        this.billManageHandleSearch();
        this.$nextTick(() => {
          this.billManageColumns = deepClone(this.billTemp);
          this.$refs.discCancelAccountBillDatagrid.selfAdaption();
          this.$refs.discCancelAccountBillDatagrid.createShowCol(this.billTemp);
        });
      },
      //前台流水号超链接
      showAcctFlowDetail(frontFlowId){
        this.acctFlowFormItem.foreFlowIds = frontFlowId;
        this.acctFlowUrl =  "/pc/acct/flow/queryAcctFlowPageByBatchIds";
        this.acctFlowDetailWin = true;
        this.$nextTick(() => {
          if (this.$refs.acctFlowDatagrid != null) {
            this.$refs.acctFlowDatagrid.dataChange(1);
          }
        });
      },
      acctFlowDetailClose() {
        this.acctFlowDetailWin = false;
      },
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(billId,billNo){
        this.billId = billId;
        this.showBillInfoWin = true;
      },
      //批次提交到记账授权
      batchAcctAuthorize(){
        let param = {};
        param = {batchId: this.discBatchId, operType: "1",acctType:"2"};
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定批次提交记账授权吗?",
          onOk: () => {
            this.$loadingbox.open({
              title: "提交授权中，请稍后..."
            });
            post(param, "/ce/disc/paper/account/discAccountBatchMain/func_submitAcctAuthorize").then(res => {
              if(res) {
                this.$loadingbox.close();
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.returnBack();
                  this.currentBillSelectList = [];
                  this.$refs.discCancelAccountBillDatagrid.selects = [];
                  this.$refs.discCancelAccountBillDatagrid.selectIds = [];
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              }
            }).catch(error => {
              this.$loadingbox.close();
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });
          }
        });
      },
      //明细提交到记账授权
      selectAcctAuthorize(){
        let param = {};
        let list = this.$refs.discCancelAccountBillDatagrid.selects;
        if(list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let ids = this.$refs.discCancelAccountBillDatagrid.selectIds.join(",");
        param = {batchId: this.discBatchId, operType: "0", acctFlowIds: ids,acctType:"2"};
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定提交授权吗?",
          onOk: () => {
            this.$loadingbox.open({
              title: "提交授权中，请稍后..."
            });
            post(param, "/ce/disc/paper/account/discAccountBatchMain/func_submitAcctAuthorize").then(res => {
              if(res) {
                this.$loadingbox.close();
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  if(this.$refs.discCancelAccountBillDatagrid.total === this.$refs.discCancelAccountBillDatagrid.selects.length) {
                    this.returnBack();
                  }else{
                    this.$refs.discCancelAccountBillDatagrid.dataChange(this.$refs.discCancelAccountBillDatagrid.pageInfo.pageNo);
                    this.currentBillSelectList = [];
                    this.$refs.discCancelAccountBillDatagrid.selects = [];
                    this.$refs.discCancelAccountBillDatagrid.selectIds = [];
                  }
                } else {
                  this.$loadingbox.close();
                  this.$msgTip.error(this, { info: msg });
                }
              }
            }).catch(error => {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });
          }
        });
      },
    }
  };
</script>

<style scoped>

</style>
