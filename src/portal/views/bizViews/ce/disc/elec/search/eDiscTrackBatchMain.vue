<template>
  <!--电票贴现跟踪查询-->
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div v-if="discTrackBatchMain" key="1">
          <div>
            <!--查询表单-->
            <div class="h-form-search-box">
              <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
                <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                 <!-- <own-brch-nos :formItem = "formItem" @brchNoWinOpen="brchNoWinOpen" v-if="this.licenseFlag"></own-brch-nos>-->
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
                  <h-form-item :label="$t('m.i.billInfo.discDt')" prop="discDt">
                    <h-date-picker :value="discDt" type="daterange" showFormat :editable=false
                                   @on-change="handleDiscDtChange" placeholder=""></h-date-picker>
                  </h-form-item>
                  <bill-type v-model="formItem.billType" :dictList="billTypeList"></bill-type>
                  <h-form-item prop="promNoteNo" :label="$t('m.i.ce.promNoteNo')">
                                              <h-input v-model="formItem.promNoteNo" placeholder=""></h-input>
                                  </h-form-item>
                  <query-btn v-on:showChange="showQry" :formSearch='handleSearch' :formSearchReset='resetSearch'></query-btn>
                </h-form>
              </h-panel>
              <!-- 数据展示表格 -->
              <h-datagrid
                :columns="columns"
                highlight-row
                :bindForm="formItem"
                url="/ce/disc/elec/search/eDiscTrackBatchMain/func_pageQueryDiscBatchList"
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


                <h-form-item :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin">
                  <h-select v-model="billFormItem.billOrigin" placeholder="">
                    <h-option v-for="item in billOriginList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>

                <bill-no :label="$t('m.i.billInfo.billPackageNo')" v-model="billFormItem.reverseBillNo" prop="reverseBillNo"></bill-no>
                <bill-range :formItem="billFormItem" :rangeProps="['billRangeStart','billRangeEnd']"></bill-range>
                <other-bank-disc-mark :formItem="billFormItem"></other-bank-disc-mark>
                <h-form-item :label="$t('m.i.common.acctStatus')" prop="acctStatus">
                  <h-select v-model="billFormItem.acctStatus" placeholder="">
                    <h-option v-for="item in acctStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <query-btn :advanceShow='false' :formSearch='billManagerHandleSearch' :formSearchReset='billManagerResetSearch'></query-btn>

              </h-form>
            </h-panel>
          </div>
        </div>
        <e-disc-batch-info-detail :is-show="discTrackBillMain" :batchId="this.discBatchId"
                                  :batchUrl = "'/ce/disc/elec/search/eDiscTrackBatchMain/func_queryDiscBatch'"
                                  :isQuery="isQuery" funcNo=""></e-disc-batch-info-detail>
        <!-- 数据展示表格 -->
        <div v-if="discTrackBillMain" key="3">
          <h-datagrid
            :columns="billColumns"
            highlight-row
            :auto-load="false"
            :bindForm="billFormItem"
            url="/ce/disc/elec/search/eDiscTrackBatchMain/func_pageQueryCeDiscBillList"
            :row-select="true"
            :has-select="hasSelect"
            ref="discTrackBillDatagrid">
            <div slot="toolbar">
              <go-back-btn @returnBack="returnBack"></go-back-btn>
            </div>
          </h-datagrid>
        </div>
        <!--票面信息-->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"   :billRangeEnd = "this.billRangeEnd" :billRangeStart = "this.billRangeStart" :billId="this.billId"></bill-info-main>
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
  import { post, on, off ,getDictListByGroups,formatNumber, getDictValueFromMap ,accMul,formatBillRange} from "@/api/bizApi/commonUtil";

  export default {
    name: "eDiscTrackBatchMain",
    components: {
      // EDiscBatchInfoDetail:() => import(/* webpackChunkName: "ce/disc/common/eDiscBatchInfoDetail" */`@/views/bizViews/ce/disc/common/eDiscBatchInfoDetail`) ,
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)
      ShowBranchSec:()=>import(/* webpackChunkName: "be/market/rediscount/common/showBranch" */`@/views/bizViews/be/market/rediscount/common/showBranch`)
    },
    data() {
      let columns = [
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
          title: this.$t("m.i.ce.redeemOpenDt"),
          key: "redeemOpenDt",
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.redeemOpenDt == null || params.row.redeemOpenDt === ""){
              return "";
            }
            let date = this.$moment(params.row.redeemOpenDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.ce.redeemDueDt"),
          key: "redeemDueDt",
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.redeemDueDt == null || params.row.redeemDueDt === ""){
              return "";
            }
            let date = this.$moment(params.row.redeemDueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.ce.redeemRate"),
          key: "redeemRatePct",
          hiddenCol: false,
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
          title: this.$t("m.i.billInfo.billPackageNo"),
          key: "billNo",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            return h("a", {
              on: {
                click: () => {
                  this.showBillInfo(params.row);
                }
              }
            }, params.row.billNo);
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
            return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
          }
        },
        {
          title: this.$t("m.i.billInfo.billPackageMoney"),
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
          title: this.$t("m.i.ce.otherBankDisc"),
          key: "otherBankDiscMark",
          hiddenCol: false,
          render:(h,params) => {
            let dictValue = getDictValueFromMap(this.dictMap,"Yon",params.row.otherBankDiscMark);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.billInfo.flowStatus"),
          key: "flowStatusName",
          hiddenCol: false,
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
        title: this.$t("m.i.ce.promNoteNo"),
        key: 'promNoteNo',
        hiddenCol: false,
      },
      {
        title: this.$t("m.i.billInfo.drwrName"),
        key: "drwrName",
        hiddenCol: false,
      },
      {
         title: this.$t("m.i.billInfo.acptName"),
        key: "acptName",
        sortable: true,
        hiddenCol: false
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
        title: this.$t("m.i.ce.realInterest"),
        key: "interest",
        hiddenCol: false,
        render: (h, params) => {
          let interest = formatNumber(params.row.interest, 2, ',');
          return h("span", {
            domProps: {
              title: interest
            }
          }, interest);
        }
      },
      {
        title: this.$t("m.i.ce.draftPayAmt"),
        key: "draftPayAmt",
        hiddenCol: false,
        render: (h, params) => {
          let draftPayAmt = formatNumber(params.row.draftPayAmt, 2, ',');
          return h("span", {
            domProps: {
              title: draftPayAmt
            }
          }, draftPayAmt);
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
        title: this.$t("m.i.ce.isSame"),
        key: "isSame",
        hiddenCol: false,
        render:(h,params) => {
          let dictValue = getDictValueFromMap(this.dictMap,"Yon",params.row.isSame);
          return h("span", {
            domProps: {
              title: dictValue
            }
          }, dictValue);
        }
      },
      {
        title: this.$t("m.i.ce.isCancel"),
        key: "isCancel",
        hiddenCol: false,
        render:(h,params) => {
          let dictValue = getDictValueFromMap(this.dictMap,"Yon",params.row.isCancel);
          return h("span", {
            domProps: {
              title: dictValue
            }
          }, dictValue);
        }
      },
      {
        title: this.$t("m.i.ce.buyerCustName"),
        key: "buyerCustName",
        hiddenCol: false
      },
    ];
      return {
        showBranchWin:false,
        acctStatusList:[],
        formItem : {
          brchNos: "",
          branchName:"",
          custName: "",
          custAcctNo: "",
          custNo:"",
          batchNo:"",
          billType:"",
          discDtStart:"",
          discDtEnd:"",
          funcNo:"",
          billClass:"ME02",
          ownedBrchName:"",
          ownedBrchNo:"",
          extremeDiscFlag:"0",
          ownedBrchNames:this.$store.getters.userInfo.brchName,
          ownedBrchNos:this.$store.getters.userInfo.brchNo,
          authPath:this.$route.path ,
        },
        billFormItem : {
          acctStatus:"",
          batchId:"",
          reverseBillNo:"",
          otherBankDiscMark:"",
          billRangeStart:"",
          billRangeEnd:"",
          billOrigin:""
        },
        columns: columns,
        billColumns : billColumns,
        isList : [],
        discDt: [],
        dictMap : new Map(),
        discTrackBatchMain : true,
        discTrackBillMain : false,
        showCustAcctNoWin : false,
        showCustMessageWin : false,
        ifShowMore : false,
        currentSelectList : [],
        billOriginList : [],
        currentSelectRowInx : [],
        currentBillSelectList : [],
        currentBillSelectRowInx : [],
        billTypeList: [],
        viewDetailForm : {},
        discBatchId : "",
        isQuery : false,
        //业务所属机构
        ownedBrchName:"",
        ownedBrchNo:"",
        ownedBrchNames:"",
        ownedBrchNos:"",
        licenseFlag:false,
        authPath:this.$route.path ,
        //brchNoWin : false,
        //票面信息页面
        showBillInfoWin : false,
        billId : "",
        billRangeStart:"",
        billRangeEnd:"",
        hasSelect : false,
        temp:this.deepClone(columns),
        billTemp:this.deepClone(billColumns),
      };
    },
    mounted() {
      getDictListByGroups("PayType,DraftTypeCode,AcctFlag,CorpScale,Yon,AssetIndustry,BillOrigin").then(res => {
        this.isList = res.get("Yon");
        this.billOriginList= res.get("BillOrigin");
        this.dictMap = res.get("map");
        this.billTypeList = res.get("DraftTypeCode");
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
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = this.$store.getters.userInfo.brchNo;
        this.formItem.ownedBrchNames = this.$store.getters.userInfo.brchName;
        this.formItem.brchNos = this.$store.getters.userInfo.brchNo;
        this.formItem.branchName = this.$store.getters.userInfo.brchName;
        this.formItem.billType = '';
        this.formItem.discDtStart = '';
        this.formItem.discDtEnd = '';
        this.discDt = [];
        this.billFormItem.billOrigin = '';
        this.billFormItem.reverseBillNo = '';
        this.billFormItem.billRangeStart = '';
        this.billFormItem.billRangeEnd = '';
        this.billFormItem.otherBankDiscMark = '';
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
        })
      },
      //票据管理界面重置
      billManagerResetSearch(){
        this.$refs.billFormItem.resetFields();
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
      clearVal1(){
        this.formItem.brchNos = "";
        this.formItem.branchName = "";
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
      handleDiscDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.discDtStart = arr[0].replace(/-/g, "");
          this.formItem.discDtEnd = arr[1].replace(/-/g, "");
          this.discDt = [arr[0], arr[1]];
        } else {
          this.formItem.discDtStart = "";
          this.formItem.discDtEnd = "";
          this.discDt = [];
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
          this.billColumns = this.deepClone(this.billTemp);
          this.$refs.discTrackBillDatagrid.selfAdaption();
          this.$refs.discTrackBillDatagrid.createShowCol(this.billTemp);
        });
      },
      //返回
      returnBack() {
        this.currentSelectList = [];
        this.currentBillSelectList = [];
        this.discBatchId = "";
        this.resetSearch();
        this.isQuery = false;
        this.discTrackBillMain = false;
        this.discTrackBatchMain = true;
        this.billManagerResetSearch();
        this.$nextTick(() => {
          this.columns = this.deepClone(this.temp);
          this.$refs.datagrid.createShowCol(this.temp);
          this.$refs.datagrid.selfAdaption();
        });
      },
      //批次编号超链接
      batchNoMain(str) {
        this.discBatchId = str;
        this.billFormItem.batchId = this.discBatchId;
        this.isQuery = true;
        this.discTrackBatchMain = false;
        this.discTrackBillMain = true;
        this.$nextTick(() => {
          this.billColumns = this.deepClone(this.billTemp);
          this.$refs.discTrackBillDatagrid.selfAdaption();
          this.$refs.discTrackBillDatagrid.createShowCol(this.billTemp);
        });
        this.billManagerHandleSearch();
      },
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      //票面信息
      showBillInfo(row) {
        this.billId = row.billId;
        this.billRangeStart=row.billRangeStart;
        this.billRangeEnd=row.billRangeEnd;
        this.showBillInfoWin = true;
      },

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
