<style>

</style>
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <div class="h-search-form-row" >
                  <common-date-picker v-model="formItem.startDate" :label="$t('m.i.pc.startDate')" prop="startDate" type="daterange" :rangeValue="['minStartDt','maxStartDt']"
                                      :minStartDt.sync="formItem.minStartDt" :maxStartDt.sync="formItem.maxStartDt" :required="isRequired">
                  </common-date-picker>
                  <show-branch v-model="formItem.brchNos" :label="$t('m.i.common.brchName')" prop="brchNos"
                               title="机构名称" :brchNo.sync="formItem.brchNos" :brchName.sync="formItem.branchName">
                  </show-branch>
                  <!-- 票据来源 -->
                  <common-select :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                                 v-model="formItem.billOrigin" :dictList="billOriginList"></common-select>
                  <!-- 票据号码 -->
                  <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNoLike">
                    <h-input v-model="formItem.billNoLike" :maxLength="20"></h-input>
                  </h-form-item>
                  <!-- 子票区间 -->
                  <h-form-item :label="$t('m.i.billInfo.billRange')" prop="billRange">
                    <h-row>
                      <h-col span="11">
                        <h-typefield v-model="formItem.billRangeStart" integerNum="12" placeholder="" type="int"
                                     bigTips></h-typefield>
                      </h-col>
                      <h-col span="2" style="text-align: center">至</h-col>
                      <h-col span="11">
                        <h-typefield v-model="formItem.billRangeEnd" integerNum="12" placeholder="" type="int"
                                     bigTips></h-typefield>
                      </h-col>
                    </h-row>
                  </h-form-item>


                  <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                    <h-select v-model="formItem.billType" placeholder="">
                      <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value }}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass">
                    <h-select v-model="formItem.billClass" placeholder="">
                      <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{item.value }}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <common-date-picker v-model="formItem.transDtArr" :label="$t('m.i.pc.startDt')" prop="transDtArr" type="daterange" :rangeValue="['minTransDt','maxTransDt']"
                                      :minTransDt.sync="formItem.minTransDt" :maxTransDt.sync="formItem.maxTransDt">
                  </common-date-picker>
                  <h-form-item :label="$t('m.i.common.custName')" prop="custName">
                    <h-input v-model="formItem.custName"></h-input>
                  </h-form-item>
                  <!--<h-form-item :label="$t('m.i.billInfo.discBankName')" prop="discBankName">
                    <h-input @on-click="showbrch = true" v-model="formItem.discBankName" icon="search" readonly
                             clearable @on-clear="clearVal()">
                    </h-input>
                  </h-form-item>-->
                  <show-cpes-branch v-model="formItem.discBrchCode" :label="$t('m.i.billInfo.discBankName')"
                                    :brchCode.sync="formItem.discBrchCode"  :cpesBrchName.sync="formItem.discBankName"
                                    datagridUrl="/cpes/branch/queryBranchList" prop="discBankName"
                                    queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                  <h-form-item :label="$t('m.i.common.rate')">
                    <h-row>
                      <h-col span="11">
                        <h-input v-model="minRate" style="width: 75px" @on-blur="minRateVaild"></h-input>
                      </h-col>
                      <h-col span="2"><span>至</span></h-col>
                      <h-col span="11">
                        <h-input v-model="maxRate" style="width: 75px" @on-blur="maxRateVaild"></h-input>
                      </h-col>
                    </h-row>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.billMoney')" :prop="isMinBillMoney">
                    <h-row>
                      <h-col span="11">
                        <h-typefield type="money" v-model="formItem.minBillMoney" :maxlength="20"
                                     @on-blur="formatBillMoney('blur','min')" placeholder=""
                                     @on-focus="formatBillMoney('focus','min')"
                                     bigTips></h-typefield>
                      </h-col>
                      <h-col span="2"><span>至</span></h-col>
                      <h-col span="11">
                        <h-typefield type="money" v-model="formItem.maxBillMoney" :maxlength="20"
                                     @on-blur="formatBillMoney('blur','max')" placeholder=""
                                     @on-focus="formatBillMoney('focus','max')" bigTips></h-typefield>
                      </h-col>
                    </h-row>
                  </h-form-item>

                  <h-form-item :label="$t('m.i.billInfo.remitDt')" prop="remitDate">
                    <h-date-picker type="daterange" v-model="formItem.remitDate" format="yyyy-MM-dd" showFormat placeholder="" @on-change="handleRemitDateChange"></h-date-picker>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="dueDate">
                    <h-date-picker type="daterange" v-model="formItem.dueDate" format="yyyy-MM-dd" showFormat placeholder="" @on-change="handleDueDateChange" autoPlacement></h-date-picker>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.pc.onwayStatus')" prop="onwayStatuss">
                    <h-select  v-model="formItem.onwayStatuss" placeholder="" multiple showTitle>
                      <h-option v-for="item in onwayStatusList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                    </h-select>
                  </h-form-item>

                  <h-form-item :label="$t('m.i.pc.balanceType')" prop="balanceTypes">
                    <h-select  v-model="formItem.balanceTypes" placeholder="" multiple showTitle>
                      <h-option v-for="item in balanceTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.be.assetIndustry')" prop="assetIndustry" v-if="openI9flag">
                    <h-select v-model="formItem.assetIndustry" placeholder="">
                      <h-option v-for="item in busiClassifyList" :value="item.key" :key="item.value">{{ item.value}}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.pc.acptBankLevel')" prop="acptBankLevels" :label-width="110">
                    <h-select v-model="formItem.acptBankLevels" placeholder="" multiple showTitle>
                      <h-option v-for="item in acptBankLevelList" :value="item.key" :key="item.key">{{item.value }}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.ce.labelType')" prop="labelTypes" >
                    <h-select v-model="formItem.labelTypes" placeholder="" multiple showTitle>
                      <h-option v-for="item in labelTypeList" :value="item.key" :key="item.key">{{item.value }}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                    <h-button type="primary" @click="formSearch()">{{$t('m.i.common.search')}}</h-button>
                    <h-button type="ghost" @click="formSearchReset()">{{$t('m.i.common.reset')}}</h-button>
                  </h-form-item>

                </div>
              </h-form>
            </h-panel>
          </div>
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix">
              <h-form :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <h-form-item :label="$t('m.i.pc.sumMoney')" class="h-form-long-label">
                    <h-input v-model="sumMoney" placeholder="" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.pc.total')">
                    <h-input v-model="total" placeholder="" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.pc.totalSettleAmt')"  class="h-form-long-label">
                    <h-input v-model="totalSettleAmt" placeholder="" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.pc.totalProvInterest')">
                    <h-input v-model="totalProvInterest" placeholder="" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.pc.totalRemaInterest')" class="h-form-long-label">
                    <h-input v-model="totalRemaInterest" placeholder="" readonly></h-input>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            :hasSelect = false
            :rowSelect = true
            getDataFunc
            @get-data="getBalanceRegisterDataList"
            :gridData="balanceRegisterData"
            :bindForm="formItem"
            :auto-load="false"
            url="/pc/acct/balanceHis/indexBalanceHistory/ "
            ref="datagrid">
            <div slot="toolbar" class='pull-left'>
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen()">清单导出</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId":billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>
<!--    <brch-code-search :brchCodeWin="showbrch" optType="2" @brchCodeWinClose="showbrch=false" @brchCodeChange="brchCodeChange"></brch-code-search>-->

    <!--标票票面信息-->
    <bill-info-main-std @billInfoWinClose="billInfoStdWinClose" :showBillInfoWin="showBillInfoStdWin" :billId="billId" :billNo="billNo" :listId="listId"></bill-info-main-std>
  </div>


</template>
<script>


  import { post, on,off, formatNumber, accMul,exportList,formatBillRange} from "@/api/bizApi/commonUtil";

  export default {
    name: 'indexBalanceHistory',
    data() {
      let formItem = {
        brchNos: "",
        branchName:"",
        billNoLike: "",
        billType:"",
        billClass:"",
        startDate:"",
        minStartDt:"",
        maxStartDt:"",
        minRate:"",
        maxRate:"",
        minBillMoney:"",
        maxBillMoney:"",
        remitDate:"",
        minRemitDt:"",
        maxRemitDt:"",
        dueDate:"",
        minDueDt:"",
        maxDueDt:"",
        balanceTypes:[],
        onwayStatuss:[],
        acptBankLevels:[],
        labelTypes:[],
        transDt:"",
        transDtArr:[],
        minTransDt:"",
        maxTransDt:"",
        creditMainBrchCode:'',
        creditMainBankName:'',
        creditMainBankType:'',
        discBrchCode:'',
        discBankName:'',
        custName:"",
        billOrigin: "",
        billRangeStart: "",
        billRangeEnd: "",
        assetIndustry:""
      };
      let _this = this;
      return {
        //showbrch:false,
        showPartAcct:false,
        dictMap : new Map(),
        formItem : formItem,
        traderForm : {
          traderId: "",
          traderName: "",
          traderType:""
        },
        typeForm : {
          copyType: "1",
          toCopyRoleCode:"",
          creators:"",
          copyRoleCode:""
        },
        type : null,
        addOrEditWin : false,
        setRoleRole : false,
        setRoleRight : false,
        setRoleAllotRight : false,
        copyWin : false,
        readonly : false,
        isRequired : true,
        busiClassifyList: [],
        labelTypeList: [],
        onwayStatusList: [],
        minRate : "",
        maxRate : "",
        showBillInfoWin : false,
        showBillInfoStdWin : false,
        billId: "",
        billNo: "",
        billRangeStart:'',
        billRangeEnd:'',
        listId : "",
        addForm : {
          roleCode: "",
          roleName: "",
          roleOrder: "",
          paramValue: "",
          kindCode: "BIZFRAME",
          kindId:"",
          paramDesc: "",
          paramRegex: "",
          relOrg:"0_000000",
          beginDate:"",
          endDate:"",
          beginDateFmt:"",
          endDateFmt:"",
          roleType:0,
          schemeId:"",
          schemeName: "",
          remark:""
        },
        //给按钮增加权限
        authObj : {
          bizSetRoleAdd: true, //角色添加
          bizSetRoleDelete: true, //角色删除
          bizSetRoleORight: true, //角色操作权限
          bizSetRoleARight: true, //角色授权权限
          bizRoleRightSet: true, //角色权限处理
          bizRoleRightCopy: true, //角色权限复制
          bizSetRoleDownload: true, //角色信息下载
        },
        columns : [
          {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: false
          },

          {
            title: this.$t("m.i.common.index"),
            type: 'index',
            align: 'center',
            hiddenCol: false
          },
          {
            title:this.$t("m.i.pc.balanceType"),
            key: "balanceType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "BalanceType", params.row.balanceType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.pc.onwayStatus"),
            key: "onwayStatus",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "onwayStatus", params.row.onwayStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title:this.$t("m.i.pe.dueSettleDt"),
            key: 'dueSettleDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.dueSettleDt == null ? "" : this.$moment(params.row.dueSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
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
            title: this.$t("m.i.billInfo.billClass"),
            key: "billClass",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.be.batchNo"),
            key: "busiBatchNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.billOrigin"),
            align:'center',
            hiddenCol: false,
            render:(h,params) => {
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : this.getDictValueFromMap(this.dictMap, 'BillOrigin', params.row.billOrigin);

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
            title:this.$t("m.i.billInfo.billPackageMoney"),
            key: "billMoney",
            hiddenCol:false,
            sortable: true,
            render: (h, params) => {
              return h('div', [
                h('span', formatNumber(params.row.billMoney, 2, ','))
              ]);
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
            title: this.$t('m.i.common.interest'),
            key: 'interest',

            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('span', formatNumber(params.row.interest, 2, ','))
              ]);
            }
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: 'remitDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.remitDt == null ? "" : this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: 'dueDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.dueDt == null ? "" : this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title:this.$t("m.i.pc.startDate"),
            key: "startDt",
            hiddenCol:false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.startDt == null ? "" : this.$moment(params.row.startDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title:  this.$t('m.i.common.rate'),
            key: "rate",
            hiddenCol:false,
            sortable: true,
            render: (h, params) => {
              if(params.row.rate != null && params.row.rate !== ""){
                let rate = accMul(params.row.rate, 100);
                return h("span", rate);
              }
            }
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            hiddenCol:false,
            sortable: true
          },
          {
            title:  this.$t("m.i.billInfo.drwrAcctNo"),
            key: "drwrAcctNo",
            hiddenCol:false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.drwrBankNo"),
            key: "drwrBankNo",
            hiddenCol:false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            hiddenCol:false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.acptBankNo"),
            key: "acptBankNo",
            hiddenCol:false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.acptBankType"),
            key: "acptBankType",
            hiddenCol:false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, 'CreditMajor', params.row.acptBankType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.pc.acptBankLevel"),
            key: "acptBankLevel",
            hiddenCol:false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "bankLevel", params.row.acptBankLevel);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.discBankNo"),
            key: "discBankNo",
            hiddenCol:false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.discBankName"),
            key: "discBankName",
            hiddenCol:false,
            sortable: true
          },
          {
            title:this.$t("m.i.billInfo.discDt"),
            key: "discDt",
            hiddenCol:false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.discDt == null ? "" : this.$moment(params.row.discDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            hiddenCol:false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.pyeeBankName"),
            key: "pyeeBankName",
            hiddenCol:false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.creditMainBrchCode"),
            key: "creditMainBrchCode",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.creditMainBankName"),
            key: "creditMainBankName",
            hiddenCol: false,

          },
          {
            title: this.$t("m.i.billInfo.creditMainBankType"),
            key: "creditMainBankType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CreditMajor", params.row.creditMainBankType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.common.prodName"),
            key: "prodName",
            hiddenCol:false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.brchName'),
            key: "brchName",
            hiddenCol:false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.custName'),
            key: "custName",
            hiddenCol:false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.custAcctNo'),
            key: "custAcctNo",
            hiddenCol:false,
            sortable: true
          },
          {
            title: this.$t("m.i.be.assetIndustry"),
            key: "assetIndustry",
            hiddenCol: window.sessionStorage.getItem("isOpenI9")=="1"?false:true,
            render:(h,params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap,"AssetIndustry",params.row.assetIndustry);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {//别再改了，start_dt才是余额日期，trans_dt才是计提开始日
            title: this.$t("m.i.pc.startDt"),
            key: "transDt",
            hiddenCol:false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.transDt == null ? "" : this.$moment(params.row.transDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title:this.$t('m.i.pc.galeDt'),
            key: "galeDt",

            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.galeDt == null || params.row.galeDt === ""){
                return "";
              }
              let galeDt = this.$moment(params.row.galeDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", galeDt);
            }
          },
          {
            title: this.$t('m.i.pc.interestCalDays'),
            key: "interestCalDays",
            hiddenCol:false,
            sortable: true
          },
          {
            title: this.$t('m.i.pc.provInterest'),
            key: "provInterest",
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.provInterest, 2, ','))
            },
          },
          {
            key: "remaInterest",
            title:this.$t('m.i.pc.remaInterest'),
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.remaInterest, 2, ','))
            },
          },
          { title: this.$t('m.i.pc.settleAmt'),
            key: 'settleAmt',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('span', formatNumber(params.row.settleAmt, 2, ','))
              ]);
            }
          },
           {
            title: this.$t('m.i.common.labelTechEntp'),
            key: "labelTechEntp",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.labelTechEntp);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.labelTechRelated'),
            key: "labelTechRelated",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.labelTechRelated);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.labelGreen'),
            key: "labelGreen",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.labelGreen);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.labelInclusive'),
            key: "labelInclusive",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.labelInclusive);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.labelNumber'),
            key: "labelNumber",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.labelNumber);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
              title: this.$t('m.i.common.labelElderCare'),
              key: "labelElderCare",
              hiddenCol: false,
              render: (h, params) => {
                let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.labelElderCare);
                return h("span", {domProps: {title: dictValue}}, dictValue);
              }
            },
        ],
        histData : {rows:[],
          total:1},
        traderData : {rows:[],
          total:1},
        userTraderWin : false,
        occurData: { rows: [], total: 1 },
        showDefaultTeller : false,
        branchDto : {},
        currentSelectRow : [],
        traderSelectRow : [],
        currentSelectList : [],
        currentSelectRowInx : [],
        balanceTypeList: [],
        onwayStatusList: [],
        ifShowMore : false,
        brchRoleDistributeWin : false,
        userHistWin : false,
        defaultTraderNo : null,
        showBranchMenuWin : false,
        submitCopyRoleDisabled : false,
        numberRule : ['num'],
        deletDisabled : false,
        kindTree : [],
        submitFlag : false,
        schemeIdList : [],
        reqUrl : '/pc/acct/balanceReg',
        selectexport : [],
        billTypeList : [],
        billClassList : [],
        acptBankLevelList : [],
        openI9flag:false,
        sumMoney : "",
        total : "",
        totalSettleAmt:"",
        totalProvInterest:"",
        totalRemaInterest:"",
        tempShowExcelTemplateWin : false,
        param : null,
        rows : null,
        queryHisBalanceSumUrl:"/pc/acct/balanceHis/indexBalanceHistory/func_querySumBalanceHistoryForSettleAmtAndInterest",
        balanceRegisterData : {rows:[],total:1},
        maxStartDate : {
          disabledDate(date) {
            let start = _this.$moment(formItem.maxStartDt).format("YYYY/MM/DD");
            let end = date.valueOf() - new Date(start).getTime();
            return end < 0 || end / (3600 * 1000 * 24) > 30;
          }
        },
      };
      function formatterisonwayStatus(value, row, index) {
        if (value != null && value != "") {
          switch (value) {
            case '0':
              return '在库';
            case '1':
              return '返售在途';
            case '2':
              return '托收在途';
            case '3':
              return '在库';
            case '4':
              return '质押式回购';
            case '5':
              return '买断式回购';
            case '6':
              return '再贴现质押式回购';
          }
        } else {
          return "";
        }
      };
    },
    components: {
      //BrchCodeSearch:()=>import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`),
    },
    computed: {
      isMinBillMoney() {
        return this.billMoneyType === "min" ? "minBillMoney" : "maxBillMoney";
      }
    },
    methods:{
      getSumData() {
        post(this.formItem, this.queryHisBalanceSumUrl).then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                let data = res.data.retData;
                if (data == null) {
                  this.totalProvInterest="0.00";
                  this.totalRemaInterest="0.00";
                  this.totalSettleAmt="0.00";
                }
                if(data.sumSettleAmt!==null){
                  this.totalSettleAmt = formatNumber(data.sumSettleAmt, 2, ",");
                }else{
                  this.totalSettleAmt="0.00";
                }
                if(data.sumProvInterest!==null){
                  this.totalProvInterest = formatNumber(data.sumProvInterest, 2, ",");
                }else{
                  this.totalProvInterest="0.00";
                }
                if(data.sumRemaInterest!==null){
                  this.totalRemaInterest = formatNumber(data.sumRemaInterest, 2, ",");
                }else{
                  this.totalRemaInterest="0.00";
                }
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          }
        );
      },
      formatBillMoney(optType, itemType) {
        this.billMoneyType = itemType;
        if (optType === "blur") {
          if (itemType === "min") {
            if (!isNaN(parseFloat(this.formItem.minBillMoney)) && isFinite(this.formItem.minBillMoney)) {
              this.formItem.minBillMoney = this.formItem.minBillMoney == null ? "0.00" : formatNumber(this.formItem.minBillMoney, 2, ",");
            }
          } else {
            if (!isNaN(parseFloat(this.formItem.maxBillMoney)) && isFinite(this.formItem.maxBillMoney)) {
              this.formItem.maxBillMoney = this.formItem.maxBillMoney == null ? "0.00" : formatNumber(this.formItem.maxBillMoney, 2, ",");
            }
          }
        } else if (optType === "focus") {
          if (itemType === "min") {
            this.formItem.minBillMoney = this.formItem.minBillMoney.toString().replace(/,/g, "");
          } else {
            this.formItem.maxBillMoney = this.formItem.maxBillMoney.toString().replace(/,/g, "");
          }
        }
      },
      minRateVaild() {
        let re = /^(((\d|[1-9]\d)(\.\d{1,4})?)|100|100\.0|100\.00|100\.000|100\.0000)$/;
        if (this.minRate.length !== 0) {
          if (re.test(this.minRate)) {
            let min = Number(this.minRate);
            if (this.maxRate.length !== 0) {
              let max = Number(this.maxRate);
              if (min > max) {
                this.$msgTip.info(this, {info: "最小值不能大于最大值"});
                this.minRate = "";
              }
            }
          } else {
            this.$msgTip.info(this, {info: "利率为0~100之间的数，小数位不超过4位"});
            this.minRate = "";
          }
        }
      },
      maxRateVaild() {
        let re = /^(((\d|[1-9]\d)(\.\d{1,4})?)|100|100\.0|100\.00|100\.000|100\.0000)$/;
        if (this.maxRate.length !== 0) {
          if (re.test(this.maxRate)) {
            let max = Number(this.maxRate);
            if (this.minRate.length !== 0) {
              let min = Number(this.minRate);
              if (min > max) {
                this.$msgTip.info(this, {info: "最大值不能小于最小值"});
                this.maxRate = "";
              }
            }
          } else {
            this.$msgTip.info(this, {info: "利率为0~100之间的数，小数位不超过4位"});
            this.maxRate = "";
          }
        }
      },
      /*clearVal(){
        this.formItem.discBankName=''
        this.formItem.discBrchCode=''
      },*/
      //根据弹框所选数据进行赋值
      /*brchCodeChange(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.discBrchCode = info.brchCode;
        this.formItem.discBankName = info.brchFullNameZh;
        this.showbrch = false;
      },*/
      getBalanceRegisterDataList() {
        let obj = Object.assign({}, this.formItem, { "pageNo": this.$refs.datagrid.pageInfo.pageNo, "pageSize": this.$refs.datagrid.pageInfo.pageSize });
        let url = "/pc/acct/balanceHis/indexBalanceHistory/func_queryBalanceHistory";
        post(obj, url).then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                let data = res.data.retData;
                this.balanceRegisterData = data;
                this.total = data.pageInfo.count;
                this.sumMoney = formatNumber(data.pageInfo.sumMoney, 2, ',');
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          }
        );
      },

      handleRemitDateChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minRemitDt = arr[0].replace(/-/g, "");
          this.formItem.maxRemitDt = arr[1].replace(/-/g, "");
        }else{
          this.formItem.minRemitDt = "";
          this.formItem.maxRemitDt = "";
        }
      },
      handleDueDateChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
        }else{
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
        }
      },
      formSearch() {
        let minBillMoney = this.formItem.minBillMoney.toString().replace(/,/g, "");
        let maxBillMoney = this.formItem.maxBillMoney.toString().replace(/,/g, "");
        if (parseFloat(minBillMoney) > parseFloat(maxBillMoney)) {
          this.$msgTip.info(this, { info: "票据金额区间输入有误" });
          return;
        }
         if(this.formItem.startDate == "" || this.formItem.startDate == null){
          this.$msgTip.info(this, { info: "余额日期必输" });
                   return;
         }
          if(this.formItem.minStartDt !== this.formItem.maxStartDt ){
                   this.$msgTip.info(this, { info: "余额日期必须一致" });
                            return;
                  }
        this.formItem.minBillMoney = this.formItem.minBillMoney.toString().replace(/,/g, "");
        this.formItem.maxBillMoney = this.formItem.maxBillMoney.toString().replace(/,/g, "");
        if(this.formItem.transDt != null && this.formItem.transDt != "") {
          this.formItem.transDt = this.formItem.transDt.replace(/-/g, "");
        }
        if(this.minRate == "" || this.minRate == null){
          this.formItem.minRate = ""
        }else {
          this.formItem.minRate = Number(this.minRate)/100;
        }
        if(this.maxRate == "" || this.maxRate == null){
          this.formItem.maxRate = ""
        }else {
          this.formItem.maxRate = Number(this.maxRate)/100;
        }
        if(this.formItem.custName == "" || this.formItem.custName == null){
          this.formItem.custName =""
        }
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.getSumData();
        this.getBalanceRegisterDataList();
        // this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
       let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
        this.formItem.brchNos = userInfo.brchNo;
        this.formItem.branchName = userInfo.brchName;
        this.minRate = "";
        this.maxRate = "";
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.formItem.minRate="";
        this.formItem.maxRate="";
        this.formItem.transDt="";
        this.$refs.formItem.resetFields();
        this.formItem.discBankName="";
        this.formItem.discBrchCode="";
        let workDate = this.$moment(window.sessionStorage.getItem("preWorkDate"), "YYYYMMDD").format("YYYY-MM-DD");
        this.formItem.startDate = [workDate, workDate];
        this.formItem.minStartDt = window.sessionStorage.getItem("preWorkDate");
        this.formItem.maxStartDt = window.sessionStorage.getItem("preWorkDate");
        this.formItem.billRangeStart = "";
        this.formItem.billRangeEnd = "";
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //获取导出模板
      tempShowExcelTemplateWinOpen() {
        this.param = 'indexBalanceHistoryReportInfo';
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        }else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },

      //清单导出
      exportList(field, exportType) {
        if(this.minRate == "" || this.minRate == null){
          this.formItem.minRate = ""
        }else{
          this.formItem.minRate = Number(this.minRate)/100;
        }
        if(this.maxRate == "" || this.maxRate == null){
          this.formItem.maxRate = ""
        }else{
          this.formItem.maxRate = Number(this.maxRate)/100;
        }
        let exportUrl = window.LOCAL_CONFIG.API_HOME + "/pc/acct/balanceHis/indexBalanceHistory/func_exportBalanceHistory";
        let options = {};
        if (this.$refs.datagrid.selectIds.length !== 0) {
          options.params = {
            ids: this.$refs.datagrid.selectIds
          };
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, exportUrl, options);
      },

      showBillInfo(row){
        this.billId = row.billId;
        this.billRangeStart = row.billRangeStart;
        this.billRangeEnd = row.billRangeEnd;
        if(row.balanceType == "14"){
          this.listId = row.listId;
          this.billNo = row.billNo;
          this.showBillInfoStdWin = true;
        }else{
          this.showBillInfoWin = true;
        }
      },
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },

        billInfoStdWinClose(){
          this.billId=null;
          this.billNo=null;
          this.listId=null;
          this.showBillInfoStdWin=false;
        },

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
                  this.columns.forEach(element => {
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
    },

    created() {
      let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
      this.openI9flag=window.sessionStorage.getItem('isOpenI9')=='1'?true:false;
      this.formItem.brchNos = userInfo.brchNo;
      this.formItem.branchName = userInfo.brchName;
      let workDate = this.$moment(window.sessionStorage.getItem("preWorkDate"), "YYYYMMDD").format("YYYY-MM-DD");
      this.formItem.startDate = [workDate, workDate];
      this.formItem.minStartDt = window.sessionStorage.getItem("preWorkDate");
      this.formItem.maxStartDt = window.sessionStorage.getItem("preWorkDate");
    },
    mounted() {
      this.getSumData();
      this.getBalanceRegisterDataList();
      this.getDictListByGroups("DraftTypeCode,Yon,CDMedia,bankLevel,CreditMajor,BalanceType,LabelTypeClass,AssetIndustry,BillOrigin,onwayStatus").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get("CDMedia");
        this.balanceTypeList = res.get("BalanceType");
        this.acptBankLevelList = res.get("bankLevel");
        this.billOriginList = res.get("BillOrigin");
        this.onwayStatusList = res.get("onwayStatus");
        this.busiClassifyList=res.get("AssetIndustry").filter(item => item.key != "0");
        this.dictMap = res.get("map");
        this.labelTypeList = res.get("LabelTypeClass");
        this.getShowPartAcct();
      });
    }
  };
</script>
