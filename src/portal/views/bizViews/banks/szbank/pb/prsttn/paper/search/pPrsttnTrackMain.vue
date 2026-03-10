<template>
  <!--纸票托收跟踪查询-->
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div v-if="collectionTrackBatchMain" key="1">
          <div>
            <!--查询表单-->
            <div class="h-form-search-box">
              <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
                <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                  <h-form-item :label="$t('m.i.common.brchName')" prop="busiBrchNoList">
                    <h-input v-model="formItem.busiBrchNoList" placeholder="" readonly
                             icon="android-search" @on-click="queryBrchNo"
                             v-show="false"
                    ></h-input>
                    <h-input v-model="formItem.busiBrchNameList" placeholder="" readonly
                             icon="android-search" @on-click="queryBrchNo" :title="formItem.busiBrchNameList"
                    ></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.ce.remitType')" prop="prsttnType">
                    <h-radio-group v-model="formItem.prsttnType">
                      <h-radio label="ST01" @on-click="noCommitButton">
                        <span>持票</span>
                      </h-radio>
                      <h-radio label="ST02" @on-click="hasCommitButton">
                        <span>代客</span>
                      </h-radio>
                    </h-radio-group>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNoLike">
                    <h-input v-model="formItem.billNoLike"></h-input>
                  </h-form-item>
                  <h-form-item label="登记日期" prop="signDt" >
                    <h-date-picker type="daterange" autoPlacement :value="signDt" format="yyyy-MM-dd" showFormat :editable=false placeholder="" @on-change="handleSignDateChange"></h-date-picker>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="dueDt" >
                    <h-date-picker type="daterange" autoPlacement :value="dueDt" format="yyyy-MM-dd" showFormat :editable=false placeholder="" @on-change="handleMinOrMaxDateChange"></h-date-picker>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.ce.entrustAdverseBankNo')" prop="drweBankNoLike" >
                    <h-input v-model="formItem.drweBankNoLike"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.hldrName')" prop="hldrNameLike" >
                    <h-input v-model="formItem.hldrNameLike"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.hldrAcctNo')" prop="hldrAcctNoLike" >
                    <h-input v-model="formItem.hldrAcctNoLike"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.minBillMoney')" prop="minBillMoney">
                    <h-typefield type="money" v-model="formItem.minBillMoney" placeholder="" bigTips></h-typefield>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.maxBillMoney')" prop="maxBillMoney">
                    <h-typefield type="money" v-model="formItem.maxBillMoney" placeholder="" bigTips></h-typefield>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                    <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                    <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                  </h-form-item>
                </h-form>
              </h-panel>
              <!-- 数据展示表格 -->
              <h-datagrid
                :columns="columns"
                highlight-row
                :bindForm="formItem"
                :auto-load="false"
                :row-select="true"
                url="/pb/prsttn/paper/search/pPrsttnTrackMain/func_queryPagePrsttnBatchTrack"
                ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="handleForm()">{{$t("m.i.ce.billManage")}}</h-button>
                  <h-button type="primary" @click="prsttnBatchPrint()">信封清单打印</h-button>
                </div>
              </h-datagrid>
            </div>
          </div>
        </div>
        <prsttn-batch-info-detail :is-show="collectionTrackBillMain" :batchId="this.batchId"
                                  :isQuery="isQuery" funcNo="" ></prsttn-batch-info-detail>
        <!-- 数据展示表格 -->
        <div v-if="collectionTrackBillMain" key="2">
          <h-datagrid
            :columns="billColumns"
            highlight-row
            :auto-load="false"
            :bindForm="billFormItem"
            url="/banks/szbank/pb/prsttn/paper/search/pPrsttnTrackMain/func_pageQueryPrsttnBill"
            :row-select="true"
            :has-select="hasSelect"
            ref="collectionDatagrid">
            <div slot="toolbar">
              <h-button type="primary" @click="prsttnPrint()">{{$t("m.i.ce.remitPrint")}}</h-button>
              <h-button type="primary" @click="envelopePrint()">{{$t("m.i.ce.envelopePrint")}}</h-button>
              <h-button type="primary" @click="prsttnBillPrint()">{{$t("m.i.ce.remitBillPrint")}}</h-button>
              <h-button type="ghost" @click="returnBack()">{{$t("m.i.common.goBack")}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!--票面信息-->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>

      </h-col>
    </h-row>
    <show-branch-sec :showBranchWin="showBranchWin" title="机构查询" @brchNoChange="brchNoChanges"
                     :ifcheck="true" :checkStrictly="true"  @showBranchWinClose="showBranchWinClose"></show-branch-sec>
  </div>
</template>

<script>
  import { post, on, off, billMoneyDisplay, cmycurd, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "pPrsttnTrackMain",
    components: {
      PrsttnBatchInfoDetail: () => import(/* webpackChunkName: "pb/prsttn/common/prsttnBatchInfoDetail" */ '@/views/bizViews/pb/prsttn/common/prsttnBatchInfoDetail'),
      ShowBranchSec:()=>import(/* webpackChunkName: "be/market/rediscount/common/showBranch" */`@/views/bizViews/be/market/rediscount/common/showBranch`),
    },
    data() {
      return {
        dueDt : [],
        signDt:[],
        showBranchWin:false,
        formItem : {
          prsttnType:"ST01",
          billNoLike:"",
          minDueDt:"",
          maxDueDt:"",
          minSignDt:"",
          maxSignDt:"",
          prsttnBankNoLike:"",
          hldrNameLike:"",
          hldrAcctNoLike:"",
          minBillMoney:"",
          maxBillMoney:"",
          curFuncNo:"",
          drweBankNoLike: "",
          billClass:"ME01",
          authPath:this.$route.path,
          busiBrchNoList: "",
          busiBrchNameList:"",
        },
        columns : [
          {
            type: 'selection',
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
            title: this.$t("m.i.common.brchName"),
            key: "transBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.hldrAcctNo"),
            key: "hldrAcctNo",

            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.hldrName"),
            key: "hldrName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.entrustAdverseBankNo"),
            key: "drweBankNo",

            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.entrustAdverseBankName"),
            key: "drweBankName",

            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.address"),
            key: "drweAddr",

            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.postCode"),
            key: "drwePostCode",

            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.EMSCode"),
            key: "emsNo",

            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.totalCount"),
            key: "totalCount",

            hiddenCol: false,
            render: (h, params) => {
              if (params.row.totalCount === "" || params.row.totalCount == null) {
                return h("span", "0");
              }else {
                return h("span", params.row.totalCount);
              }
            }
          },
          {
            title: this.$t("m.i.ce.totalAmt"),
            key: "totalAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if(null == params.row.totalAmt || params.row.totalAmt === ""){
                return h("span", "0.00");
              }else {
                let totalAmt = formatNumber(params.row.totalAmt, 2, ',');
                return h("span", {
                  domProps: {
                    title: totalAmt
                  }
                }, totalAmt);
              }
            }
          },
        ],
        billFormItem : {
          batchId:"",
          billClass:"ME01",
          transBrchNo:"",
          // billNoLike:"",
          // minDueDt:"",
          // maxDueDt:"",
          // minSignDt:"",
          // maxSignDt:"",
          // minBillMoney:"",
          // maxBillMoney:"",
        },
        billColumns : [
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
            title: this.$t("m.i.billInfo.flowStatus"),
            key: "flowStatusName",

            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce. remitStatus"),
            key: "prsttnStatus",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap,"PrsnttnStatusCode",params.row.prsttnStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",

            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
          },
          {
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
            key: "billMoney",
            sortable: true,
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
            title: this.$t("m.i.billInfo.returnMoney"),
            key: "returnMoney",

            sortable: true,
            hiddenCol: true,
            render: (h, params) => {
              let returnMoney = formatNumber(params.row.returnMoney, 2, ',');
              return h("span", {
                domProps: {
                  title: returnMoney
                }
              }, returnMoney);
            }
          },
          {
            title: this.$t("m.i.billInfo.noReturnMoney"),
            key: "noReturnMoney",

            sortable: true,
            hiddenCol: true,
            render: (h, params) => {
              let noReturnMoney = formatNumber(params.row.noReturnMoney, 2, ',');
              return h("span", {
                domProps: {
                  title: noReturnMoney
                }
              }, noReturnMoney);
            }
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",

            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.remitDt == null || params.row.remitDt === ""){
                return "";
              }
              let remitDt = this.$moment(params.row.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", remitDt);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",

            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.dueDt == null || params.row.dueDt === ""){
                return "";
              }
              let dueDt = this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", dueDt);
            }
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",

            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.rgstApplDt"),
            key: "signDt",

            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.signDt == null || params.row.signDt === ""){
                return "";
              }
              let signDt = this.$moment(params.row.signDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span",{domProps: {title: signDt}},   signDt);
            }
          },
          {
            title: this.$t("m.i.ce.paymentSignOpin"),
            key: "signOpin",

            hiddenCol: false
          },
        ],
        dictMap : new Map(),
        currentSelectList : {},
        currentBillSelectRow : [],
        ifShowMore : false,
        noCommitDisabled : true,
        hasCommitDisabled : false,
        collectionTrackBatchMain : true,
        collectionTrackBillMain : false,
        isQuery : '',
        batchId : '',
        //票面信息页面
        showBillInfoWin : false,
        billId : "",
        hasSelect : false,
      }
    },
    mounted() {
      this.getDictListByGroups("PayType,DraftTypeCode,CorpScale,Yon,PrsnttnStatusCode").then(res => {
        this.isList = res.get("Yon");
        this.dictMap = res.get("map");
        this.getShowPartAcct();
      });
      this.noCommitButton();
      post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            let columns=[]
            if (this.licenseFlag) {
              columns=this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
            }else {
              columns=this.$refs.datagrid.controlColumnsHidden("ownedBrchName", true);
            }
            this.cloneColumns=this.deepClone(columns);
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        }else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    methods: {
      getShowPartAcct() {
        let paramKey = "be.trust.prsnttn_part_acct";
        post({ paramKey :paramKey}, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let param = res.data.retData;
              this.showPartAcct = param === "1";
              if(this.showPartAcct){
                this.$nextTick(() => {
                  this.billColumns.forEach(element => {
                    if (element.key === "returnMoney") {
                      element.hiddenCol = false;
                    } else if (element.key === "noReturnMoney") {
                      element.hiddenCol = false;
                    }
                  });
                });
              }
            } else {
              this.showPartAcct = false;
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      handleMinOrMaxDateChange(arr){
        if(arr && arr.length == 2){
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0], arr[1]];
        }else{
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDt = [];
        }

      },
      handleSignDateChange(arr){
        if(arr && arr.length == 2){
          this.formItem.minSignDt = arr[0].replace(/-/g, "");
          this.formItem.maxSignDt = arr[1].replace(/-/g, "");
          this.signDt = [arr[0], arr[1]];
        }else{
          this.formItem.minSignDt = "";
          this.formItem.maxSignDt = "";
          this.signDt = [];
        }

      },
      //查询
      handleSearch() {
        this.currentSelectList = {};
        this.$refs.datagrid.selectIds=[];
        this.$refs.datagrid.selects=[];
        this.$refs.datagrid.dataChange(1);
      },
      //重置查询结果
      resetSearch() {
        this.formItem.billNoLike = "";
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.dueDt = [];
        this.signDt = [];
        this.formItem.minSignDt="";
        this.formItem.maxSignDt="";
        this.formItem.prsttnBankNoLike = "";
        this.formItem.hldrNameLike = "";
        this.formItem.hldrAcctNoLike = "";
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.formItem.drweBankNoLike = "";
        this.formItem.busiBrchNoList = this.$store.getters.userInfo.brchNo;
        this.formItem.busiBrchNameList = this.$store.getters.userInfo.brchName;
      },
      //票据管理界面查询
      billManagerHandleSearch(){
        this.$nextTick(() => {
          this.hasSelect = false;
          this.$refs.collectionDatagrid.selects = [];
          this.$refs.collectionDatagrid.selectIds = [];
          this.currentBillSelectRow = [];
          this.$refs.collectionDatagrid.dataChange(1);
        })
      },
      //票据管理界面重置
      billManagerResetSearch(){
        this.$refs.billFormItem.resetFields();
      },
      //票据管理界面中行选中
      handlelBillRowClick(arr) {
        this.currentBillSelectRow = arr;
      },
      //没有提交的
      noCommitButton(){
        this.formItem.prsttnType = "ST01";
        this.noCommitDisabled = true;
        this.hasCommitDisabled = false;
        this.$nextTick(() => {
          this.handleSearch();
        });
      },
      //已经提交的
      hasCommitButton(){
        this.formItem.prsttnType = "ST02";
        this.hasCommitDisabled = true;
        this.noCommitDisabled = false;
        this.$nextTick(() => {
          this.handleSearch();
        });
      },
      //票据管理
      handleForm() {
        if (this.$refs.datagrid.selectIds.length != 1) {
          this.$msgTip.info(this,{info:this.$t("m.i.common.chooseOneData")});
          return;
        }
        this.currentSelectList=this.$refs.datagrid.selects[0];
        this.collectionTrackBatchMain = false;
        this.batchId = this.currentSelectList.id;
        this.billFormItem.batchId = this.currentSelectList.id;
        this.billFormItem.transBrchNo = this.currentSelectList.transBrchNo;
        // this.billFormItem.billNoLike = this.formItem.billNoLike;
        // this.billFormItem.minDueDt = this.formItem.minDueDt;
        // this.billFormItem.maxDueDt = this.formItem.maxDueDt;
        // this.billFormItem.minSignDt = this.formItem.minSignDt;
        // this.billFormItem.maxSignDt = this.formItem.maxSignDt;
        // this.billFormItem.minBillMoney = this.formItem.minBillMoney;
        // this.billFormItem.maxBillMoney = this.formItem.maxBillMoney;
        this.isQuery = true;
        this.collectionTrackBillMain = true;
        this.billManagerHandleSearch();
        this.$nextTick(() => {
          this.$refs.collectionDatagrid.selfAdaption();
          this.$refs.collectionDatagrid.createShowCol(this.billColumns);
        });
      },
      //信封清单打印
      prsttnBatchPrint() {
        let params = this.deepClone(this.formItem);
        params.pageSize = this.$refs.datagrid.total === 0 ? "1" : this.$refs.datagrid.total.toString();
        params.ids=this.$refs.datagrid.selectIds;
        let list= this.$refs.datagrid.selects;
        if (list.length==0) {
          this.$msgTip.info(this,{info:this.$t("m.i.common.chooseAtLeastOneRecord")});
          return;
        }
        let expressCompanyName= list[0].reserve2;
        let flag=list.some( item => item.reserve2 !== expressCompanyName)
        if (flag) {
          this.$msgTip.info(this, { info: "请选择相同快递公司名称的信封" });
          return;
        }

        post(params, "/pb/prsttn/paper/search/pPrsttnTrackMain/func_queryPagePrsttnBatchTrack").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let list = (res.data.retData.list instanceof Array) ? res.data.retData.list : [res.data.retData.list];
              this.assemblePrsttnBatchParams(list);
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          }
        })
      },
      assemblePrsttnBatchParams(vocherData) {
        let bodyStr = "";
        for (let i = 0; i < vocherData.length; i++) {
          bodyStr += "<tr>";
          bodyStr +=  "<td class='ta-c'>" + (1+i) + "</td>";
          bodyStr += "<td>" + vocherData[i].envelopeNo + "</td>";
          bodyStr += "<td>" + vocherData[i].drweBankName + "</td>";
          bodyStr += "<td>" + vocherData[i].drweAddr + "</td>";
          bodyStr += "<td>" + vocherData[i].drwePostCode + "</td>";
          bodyStr += "</tr>";
        }
        let headHtml = `<div style="text-align:center;" ref="headHtml">
          <div style="text-align:center;font-size:18px;font-weight:bold;">苏州银行实物票据邮寄交接清单</div>
        </div>
        <div><span style="display:-moz-inline-box; display:inline-block;width: 400px">快递公司名称：`+ vocherData[0].reserve2 +`</span><span style="width: 150px">交接日期：`+ window.sessionStorage.getItem("workDate") +'</span></div>'
        let bodyHtml = `<div class="list-table-box"><table class="list-table">
          <thead>
            <tr>
              <th class="ta-c"><b>序号</b></th>
              <th>快件编号</th>
              <th>收件人名称</th>
              <th>收件地址</th>
              <th>邮编</th>
            </tr>
          </thead>
          <tbody>${bodyStr}</tbody>
        </table>
      </div>`;
        let footerHtml='<span style="display:-moz-inline-box; display:inline-block;width: 200px">总件数：'+ vocherData.length +'</span><span>签收：</span>'
        this.$print.printListHtm(this, headHtml, bodyHtml, { bodyTop: "12%", bodyLeft:"5%", bodyWidth:"90%", bodyHeight:"75%", headHeight:"11%" },footerHtml);
      },
      //托收打印
      prsttnPrint() {
        if(this.$refs.collectionDatagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if(this.$refs.collectionDatagrid.selects.length > 1) {
          this.$msgTip.info(this, { info: this.$t('m.i.common.onlyChooseOneData') });
          return;
        }
        this.currentBillSelectRow = this.$refs.collectionDatagrid.selects;
        this.assemblePrsttnParams();
      },
      assemblePrsttnParams() {
        let vocherData = this.deepClone(this.currentBillSelectRow);
        for (let i = 0; i < vocherData.length; i++) {
          let workDate = window.sessionStorage.getItem("workDate");
          vocherData[i].yyyy = workDate.toString().substring(0, 4);
          vocherData[i].mm = workDate.toString().substring(4, 6);
          vocherData[i].dd = workDate.toString().substring(6, 8);
          let billMoney = vocherData[i].billMoney === null ? "0" : vocherData[i].billMoney;
          vocherData[i].billMoney = cmycurd(vocherData[i].billMoney);
          let tempMoney = "¥" + billMoney.toString();
          billMoneyDisplay(tempMoney, vocherData[i]);
          let billType = vocherData[i].billType;
          if('2' === billType){
            billType='商承托收';
          } else {
            billType='银承托收';
          }
          vocherData[i].billType = billType;
          vocherData[i].acctBrchName = this.currentSelectList.acctBrchName;
          vocherData[i].flowNo = vocherData[i].acctFlowId;
          vocherData[i].printObj = JSON.stringify(vocherData[i]);
        }
        this.$print.vochPrint(this, {
          exitDataFlag: true, params: { voucherType: "PE031801", vocherData: vocherData },
          callback: () => {
            this.$refs.collectionDatagrid.dataChange(this.$refs.collectionDatagrid.$refs.gridPage.currentPage);
          },
          errorCallback: () => {
            this.$refs.collectionDatagrid.dataChange(this.$refs.collectionDatagrid.$refs.gridPage.currentPage);
          }
        });
      },
      //信封打印
      envelopePrint() {
        let vocherData = this.deepClone(this.currentSelectList);
        post({ code:vocherData.drweBankNo}, "/pb/prsttn/paper/search/pPrsttnTrackMain/func_getPrsttnBankInfoByBankNo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
              vocherData.brchName = userInfo.brchName;
              vocherData.pyeePhone = res.data.retData.phone;
              vocherData.pyeeAddr = res.data.retData.address;
              vocherData.pyeePostCode = res.data.retData.postCode;
              vocherData.printObj = JSON.stringify(vocherData);
              let vocherDatas = [];
              vocherDatas.push(vocherData);
              this.$print.vochPrint(this, {
                exitDataFlag: true, params: { voucherType: "PE031802", vocherData: vocherDatas },
                callback: () => {
                  this.$refs.collectionDatagrid.dataChange(this.$refs.collectionDatagrid.$refs.gridPage.currentPage);
                },
                errorCallback: () => {
                  this.$refs.collectionDatagrid.dataChange(this.$refs.collectionDatagrid.$refs.gridPage.currentPage);
                }
              });
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          }
        })
      },
      //托收清单打印
      prsttnBillPrint() {
        let params = {
          billClass: this.billFormItem.billClass,
          batchId: this.billFormItem.batchId,
          transBrchNo:this.billFormItem.transBrchNo,
          // billNoLike:this.billFormItem.billNoLike,
          // minDueDt:this.billFormItem.minDueDt,
          // maxDueDt:this.billFormItem.maxDueDt,
          // minSignDt:this.billFormItem.minSignDt,
          // maxSignDt:this.billFormItem.maxSignDt,
          // minBillMoney:this.billFormItem.minBillMoney,
          // maxBillMoney:this.billFormItem.maxBillMoney,
        };
        post(params, "/banks/szbank/pb/prsttn/paper/search/pPrsttnTrackMain/func_queryPrsttnBill").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let list = (res.data.retData.list instanceof Array) ? res.data.retData.list : [res.data.retData.list];
              this.assemblePrsttnBillParams(list);
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          }
        })
      },
      assemblePrsttnBillParams(vocherData) {
        let bodyStr = "";
        for (let i = 0; i < vocherData.length; i++) {
          if (!!vocherData[i].remitDt) {
            vocherData[i].remitDt = this.$moment(vocherData[i].remitDt, "YYYYMMDD").format("YYYY-MM-DD");
          }
          if (!!vocherData[i].dueDt) {
            vocherData[i].dueDt = this.$moment(vocherData[i].dueDt, "YYYYMMDD").format("YYYY-MM-DD");
          }
          vocherData[i].billMoney = formatNumber(vocherData[i].billMoney, 2, ',');
          vocherData[i].flowNo = vocherData[i].acctFlowId;
          vocherData[i].printObj = JSON.stringify(vocherData[i]);

          bodyStr += "<tr>";
          bodyStr +=  "<td class='ta-c'>" + (1+i) + "</td>";
          bodyStr += "<td>" + vocherData[i].drwrName + "</td>";
          bodyStr += "<td>" + vocherData[i].acptName + "</td>";
          bodyStr += "<td>" + vocherData[i].billNo + "</td>";
          bodyStr += "<td>" + vocherData[i].remitDt + "</td>";
          bodyStr += "<td>" + vocherData[i].dueDt + "</td>";
          bodyStr += "<td>" + vocherData[i].billMoney + "</td>";
          bodyStr += "</tr>";
        }
        let headHtml = `<div style="text-align:center;" ref="headHtml">
          <div style="text-align:center;font-size:18px;font-weight:bold;">票据出库清单 编号：<label>${this.currentSelectList.envelopeNo}</label></div>
        </div>`
        let footerHtml = `<div style="font-size:14px;font-weight:bold;display:-webkit-box;display:flex;justify-content:flex-end;">
          <label style="padding-right:20%;white-space:nowrap">经办:</label>
          <label style="padding-right:20%;white-space:nowrap">复核:</label>
          <label style="padding-right:20%;white-space:nowrap">日期:</label>
        </div>`
        let bodyHtml = `<div class="list-table-box"><table class="list-table">
          <thead>
            <tr>
              <th class="ta-c"><b>序号</b></th>
              <th>出票人全称</th>
              <th>承兑人全称</th>
              <th>票据号码</th>
              <th>出票日期</th>
              <th>汇票到期日</th>
              <th>票面金额</th>
            </tr>
          </thead>
          <tbody>${bodyStr}</tbody>
        </table>
      </div>`;
        this.$print.printListHtm(this, headHtml, bodyHtml, { bodyTop: "12%", bodyLeft:"5%", bodyWidth:"90%", bodyHeight:"74%", headHeight:"11%" }, footerHtml);
      },
      //返回
      returnBack() {
        this.currentSelectList = {};

        this.currentBillSelectRow = [];
        this.batchId = "";
        this.isQuery = false;
        this.resetSearch();
        this.collectionTrackBillMain = false;
        this.collectionTrackBatchMain = true;
        this.$nextTick(() => {
          this.$refs.datagrid.selectIds=[];
          this.$refs.datagrid.selects=[];
          this.$refs.datagrid.selfAdaption();
          this.$refs.datagrid.dataChange(1);
        });
      },
      //票面信息关闭
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      //票面信息
      showBillInfo(billId,billNo){
        this.billId = billId;
        this.showBillInfoWin = true;
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
        this.formItem.busiBrchNoList = brchNos.substring(0,brchNos.length - 1);
        this.formItem.busiBrchNameList = brchNames.substring(0,brchNames.length - 1);
        this.showBranchWin = false;
      },
    },
    created() {
      let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
      this.formItem.busiBrchNoList = userInfo.brchNo;
      this.formItem.busiBrchNameList = userInfo.brchName;
    }
  };
</script>

<style scoped>

</style>
