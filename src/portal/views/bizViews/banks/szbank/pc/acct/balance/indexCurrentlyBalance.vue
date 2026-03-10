<style>

</style>
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <div class="h-search-form-row" >
                  <common-date-picker v-model="formItem.startDtArr" :label="$t('m.i.common.transDt')" prop="startDtArr" type="daterange" :rangeValue="['minStartDt','maxStartDt']"
                                      :minStartDt.sync="formItem.minStartDt" :maxStartDt.sync="formItem.maxStartDt">
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
                    <h-select v-model="formItem.billType" placeholder="" showTitle>
                      <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value }}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass">
                    <h-select v-model="formItem.billClass" placeholder="" showTitle>
                      <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{item.value }}
                      </h-option>
                    </h-select>
                  </h-form-item>
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

                  <h-form-item :label="$t('m.i.billInfo.remitDt')" prop="remitDate">
                    <h-date-picker type="daterange" v-model="formItem.remitDate" format="yyyy-MM-dd" showFormat placeholder="" @on-change="handleRemitDateChange"></h-date-picker>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="dueDate">
                    <h-date-picker type="daterange" v-model="formItem.dueDate" format="yyyy-MM-dd" showFormat placeholder="" @on-change="handleDueDateChange"></h-date-picker>
                  </h-form-item>
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

                  <h-form-item :label="$t('m.i.billInfo.billMoney')" prop="billMoneyItem" >
                    <h-row>
                      <h-col span="11">
                        <h-typefield  v-model="formItem.minBillMoney"  integerNum="10" placeholder="" type="money" bigTips ></h-typefield>
                      </h-col>
                      <h-col span="2" style="text-align: center">至</h-col>
                      <h-col span="11">
                        <h-typefield  v-model="formItem.maxBillMoney"  integerNum="10" placeholder="" type="money" bigTips ></h-typefield>
                      </h-col>
                    </h-row>
                  </h-form-item>

                  <h-form-item :label="$t('m.i.pc.onwayStatus')" prop="onwayStatuss">
                    <h-select  v-model="formItem.onwayStatuss" placeholder="" multiple showTitle>
                      <h-option v-for="item in onwayStatusList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                    </h-select>
                  </h-form-item>

                  <h-form-item :label="$t('m.i.pc.balanceType')" prop="balanceTypes">
                    <h-select v-model="formItem.balanceTypes" placeholder="" multiple showTitle
                              @on-change="handleBalanceTypeChange">
                      <h-option v-for="item in balanceTypeList" :value="item.key" :key="item.key">{{ item.value }}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.be.rebuyDueDt')" prop="dueSettleDate" v-if="isRebuyDueDateShow">
                    <h-date-picker type="daterange" v-model="formItem.dueSettleDate" format="yyyy-MM-dd" showFormat
                                   placeholder="" @on-change="handleRebuyDueDateChange"></h-date-picker>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.pc.acptBankLevel')" prop="acptBankLevels" :label-width="110">
                    <h-select v-model="formItem.acptBankLevels" placeholder="" multiple showTitle>
                      <h-option v-for="item in acptBankLevelList" :value="item.key" :key="item.key">{{item.value }}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.pc.orgnlProdNo')"  prop="orgnlBillSource">
                    <h-select  v-model="formItem.orgnlBillSource" placeholder="" showTitle>
                      <h-option v-for="item in balanceTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.ce.isCreditDisc')" prop="reserve1">
                    <h-select v-model="formItem.reserve1" placeholder="">
                      <h-option value="0" key="1">否</h-option>
                      <h-option value="1" key="2">是</h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.be.assetIndustry')" prop="assetIndustry" v-if="openI9flag">
                    <h-select v-model="formItem.assetIndustry" placeholder="">
                      <h-option v-for="item in busiClassifyList" :value="item.key" :key="item.value">{{ item.value}}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item  :label="$t('m.i.pc.inOutFlag')"  prop="inOutFlag">
                    <h-select v-model="formItem.inOutFlag" placeholder="" showTitle>
                      <h-option v-for="item in inOutFlagList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item  prop="likeAcptName" :label="$t('m.i.billInfo.acptName')">
                    <h-input v-model="formItem.likeAcptName" placeholder=""></h-input>
                  </h-form-item>
                  <h-form-item  prop="likeRejectAcptName" :label="$t('m.i.billInfo.rejectAcptName')" >
                    <h-input v-model="formItem.likeRejectAcptName" placeholder=""></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.ce.isRediscount')" prop="reserve4">
                    <h-select v-model="formItem.reserve4" placeholder="">
                      <h-option value="0">否</h-option>
                      <h-option value="1">是</h-option>
                    </h-select>
                  </h-form-item>
                  <common-date-picker v-model="formItem.discDtArr" :label="$t('m.i.billInfo.discDt')" prop="discDtArr" type="daterange" :rangeValue="['minDiscDt','maxDiscDt']"
                                      :minDiscDt.sync="formItem.minDiscDt" :maxDiscDt.sync="formItem.maxDiscDt">
                  </common-date-picker>
                  <h-form-item :label="$t('m.i.common.custNo')" prop="custNo">
                              <h-input v-model="formItem.custNo" placeholder=""></h-input>
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
                  <h-form-item :label="$t('m.i.pc.totalSettleAmt')">
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
            :loading="loading"
            :page-size="pageSizeParamValue"
            getDataFunc
            @get-data="getBalanceRegisterDataList"
            :gridData="occurData"
            :rowSelect = true
            :bindForm="formItem"
            :auto-load="false"
            url="/pc/acct/balance/indexCurrentlyBalance/func_queryCurrentlyBalanceRegister"
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
    <!--<brch-code-search :brchCodeWin="showbrch" optType="2" @brchCodeWinClose="showbrch=false" @brchCodeChange="brchCodeChange"></brch-code-search>-->

    <!--标票票面信息-->
    <bill-info-main-std @billInfoWinClose="billInfoStdWinClose" :showBillInfoWin="showBillInfoStdWin" :billId="billId" :billNo="billNo" :listId="listId":billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main-std>
  </div>


</template>
<script>
  import { post, on,off,formatNumber, accMul,exportList,formatBillRange} from "@/api/bizApi/commonUtil";

  export default {
    name: 'indexCurrentlyBalance',
    data() {
      let formItem = {
        brchNos: "",
        branchName:"",
        billNoLike: "",
        billType:"",
        billClass:"",
        startDt:"",
        startDtArr:[],
        minStartDt:"",
        maxStartDt:"",
        discDtArr:[],
        labelTypes:[],
        minDiscDt:"",
        maxDiscDt:"",
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
        dueSettleDate: "",
        minDueSettleDt: "",
        maxDueSettleDt: "",
        balanceTypes:[],
        onwayStatuss:[],
        acptBankLevels:[],
        creditMainBrchCode:'',
        creditMainBankName:'',
        creditMainBankType:'',
        discBrchCode:'',
        discBankName:'',
        status:'',
        inOutFlag:"",
        orgnlBillSource:"",
        reserve1:"",
        custName:"",
        assetIndustry:"",
        likeAcptName: "",
        billOrigin: "",
        billRangeStart: "",
        billRangeEnd: "",
        likeRejectAcptName: "",
        reserve4: ""
      };
      let _this = this;
      return {
        pageSizeParamValue : "",
        //showbrch:false,
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
        readonly:false,
        isRequired:true,
        showBillInfoWin : false,
        showBillInfoStdWin : false,
        billRangeStart:"",
        billRangeEnd:"",
        billId : "",
        billNo : "",
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
        busiClassifyList: [],
        labelTypeList: [],
        yonList: [],
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
            title: this.$t("m.i.pc.balanceType"),
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
            title: this.$t("m.i.pc.balanceStatus"),
            key: "isLock",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.isLock==='0') return h('span','正常')
              else if(params.row.isLock==='1') return h('span','已锁票')
              else if(params.row.isLock==='2') return h('span','已挑票')
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
            title:this.$t("m.i.billInfo.billType"),
            key: 'billType',
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
            title:this.$t("m.i.billInfo.billClass"),
            key: 'billClass',
            hiddenCol: false,
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
            title:this.$t("m.i.billInfo.billPackageNo"),
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
            title: this.$t("m.i.be.batchNo"),
            key: "busiBatchNo",
            hiddenCol: false,
            sortable: true
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
            title:this.$t('m.i.common.interest'),
            key: 'interest',

            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('span', formatNumber(params.row.interest, 2, ','))
              ]);
            }
          },
          {
            title:this.$t("m.i.billInfo.remitDt"),
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
            title:this.$t("m.i.common.transDt"),
            key: "startDt",
            hiddenCol:false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.startDt == null ? "" : this.$moment(params.row.startDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.common.rate'),
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
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: "drwrAcctNo",
            hiddenCol:false,
            sortable: true
          },
          {
            title:this.$t("m.i.billInfo.drwrBankNo"),
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
            title:this.$t("m.i.pe.discCustName"),
            key: "discCustName",
            hiddenCol:false,
            sortable: false
          },
          {
            title:this.$t("m.i.pc.investIndustryCategory"),
            key: "investIndustryCategory",
            hiddenCol:false,
            sortable: false
          },
          {
            title:this.$t("m.i.pc.custCorpScale"),
            key: "custCorpScale",
            hiddenCol:false,
            sortable: false
          },
          {
            title:this.$t("m.i.pc.controlType"),
            key: "controlType",
            hiddenCol:false,
            sortable: false
          },
          {
            title:this.$t("m.i.pc.entityTag"),
            key: "entityTag",
            hiddenCol:false,
            sortable: false
          },
          {
            title:this.$t("m.i.billInfo.acptTopBankLevel"),
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
            title:this.$t('m.i.billInfo.creditMainBrchCode'),
            key: "creditMainBrchCode",
            hiddenCol: false,

          },
          {
            title:this.$t('m.i.billInfo.creditMainBankName'),
            key: "creditMainBankName",
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.billInfo.creditMainBankType'),
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
          {
            title: this.$t('m.i.pc.galeDt'),
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
            key: "provInterest",
            title: this.$t('m.i.pc.provInterest'),
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.provInterest, 2, ','))
            },
          },
          {
            key: "remaInterest",
            title: this.$t('m.i.pc.remaInterest'),
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
            title: this.$t('m.i.pc.orgnlProdNo'),
            key: "orgnlBillSource",
            hiddenCol:false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "BalanceType", params.row.orgnlBillSource);
              if (params.row.orgnlBillSource === '' || params.row.orgnlBillSource == null) {
                return h('span', {}, '-');
              } else {
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
            }
          },
          {
            title: this.$t('m.i.ce.isCreditDisc'),
            key: "reserve2",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.reserve2 === '1') {
                return h("span", "是");
              } else {
                return h("span", "否");
              }
            }
          },
          {
            title: this.$t('m.i.ce.discPerferRate'),
            key: "reserve1",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.reserve1 != null && params.row.reserve1 !== ""){
                let reserve1 = accMul(params.row.reserve1, 100);
                return h("span", reserve1);
              }
            }
          },
          {
            title: this.$t('m.i.pc.rsmtCounts'),
            key: "reserve3",
            hiddenCol:false,
            sortable: true
          },
          {
              title: this.$t("m.i.pc.inOutFlag"),
              key: "inOutFlag",
              hiddenCol: false,
              render: (h, params) => {
                  if(params.row.inOutFlag === '' || params.row.inOutFlag == null){
                      return h('span',{},'-');
                  }
                  let dictValue = this.getDictValueFromMap(this.dictMap, "InOutFlagCode", params.row.inOutFlag);
                  return h("span", {
                      domProps: {
                          title: dictValue
                      }
                  }, dictValue);
              }
          },
          {
            title: this.$t('m.i.ce.isRediscount'),
            key: "reserve4",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              debugger
              if (params.row.reserve4 === '1') {
                return h("span", "是");
              } else {
                return h("span", "否");
              }
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
          }
        ],
        histData : {rows:[],
          total:1},
        traderData : {rows:[],
          total:1},
        inOutFlagList :[],
        showPartAcct:false,
        userTraderWin : false,
        showDefaultTeller : false,
        branchDto : {},
        currentSelectRow : [],
        traderSelectRow : [],
        currentSelectList : [],
        currentSelectRowInx : [],
        balanceTypeList: [],
        onwayStatusList: [],
        ifShowMore : false,
        tempInx : 0,
        pageInfo : {
          pageNo: 1,
          pageSize: 10
        },
        brchRoleDistributeWin : false,
        userHistWin : false,

        defaultTraderNo : null,

        showBranchMenuWin : false,
        submitCopyRoleDisabled : false,

        numberRule : ['num'],
        deletDisabled : false,
        kindTree : [],
        submitFlag : false,
        isRebuyDueDateShow: false,
        schemeIdList : [],
        reqUrl : '/pc/acct/balanceReg',
        selectexport : [],
        billTypeList : [],
        billClassList : [],
        acptBankLevelList : [],
        sumMoney : "",
        total : "",
        totalSettleAmt:"",
        openI9flag:false,
        totalProvInterest:"",
        totalRemaInterest:"",
        balanceRegisterDate : {rows:[],total:1},
        loading: true,
        minRate : "",
        maxRate : "",
        tempShowExcelTemplateWin : false,
        param : null,
        rows : null,
        queryCurrentlyBalanceSumUrl:"/pc/acct/balance/indexCurrentlyBalance/func_queryCurrentlyBalanceSumRegister",
        maxStartDate : {
          disabledDate(date) {
            let start = _this.$moment(formItem.maxStartDt).format("YYYY/MM/DD");
            let end = date.valueOf() - new Date(start).getTime();
            return end < 0 || end / (3600 * 1000 * 24) > 30;
          }
        },
        occurData: { rows: [], total: 1 }
      };
      function formatterisbalanceType(value, row, index) {
        if (value != null && value != "") {
          switch (value) {
            case '1':
              return '贴现余额';
            case '2':
              return '转入余额';
            case '3':
              return '质押式逆回购余额';
            case '4':
              return '买断式逆回购余额';
            case '5':
              return '质押式正回购余额';
            case '6':
              return '买断式正回购余额';
            case '7':
              return '承兑余额';
            case '8':
              return '再贴现回购余额';
            case '9':
              return '非交易过户余额';
            case '10':
              return '同业质押';
            case '11':
              return '对公质押';
          }
        } else {
          return "";
        }
      };
      function formatterisonwayStatus(value, row, index) {
        if (value != null && value != "") {
          switch (value) {
            case '0':
              return '在库';
            case '2':
              return '托收在途';
            case '3':
              return '在库';
            case '4':
              return '质押式回购';
            case '5':
              return '买断式回购';
            case '8':
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
    methods:{
      getSumData() {
        post(this.formItem, this.queryCurrentlyBalanceSumUrl).then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                let data = res.data.retData;
                if (data == null) {
                  this.totalProvInterest="0.00";
                  this.totalRemaInterest="0.00";
                }
                if(data.sumProvInterest!==null){
                  this.totalProvInterest = formatNumber(data.sumProvInterest, 2, ",");
                } else {
                  this.totalProvInterest="0.00";
                }
                if(data.sumRemaInterest!==null){
                  this.totalRemaInterest = formatNumber(data.sumRemaInterest, 2, ",");
                } else {
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
     /* clearVal(){
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
        let url = "/pc/acct/balance/indexCurrentlyBalance/func_queryCurrentlyBalanceRegister";
        post(obj, url).then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                let data = res.data.retData;
                this.occurData = data;
                this.total = data.pageInfo.count;
                this.sumMoney = formatNumber(data.pageInfo.sumMoney, 2, ',');
                this.totalSettleAmt = formatNumber(data.pageInfo.statDatas, 2, ',');
                this.loading=false
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
      handleRebuyDueDateChange(arr) {
        if (arr && arr.length == 2) {
          this.formItem.minDueSettleDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueSettleDt = arr[1].replace(/-/g, "");
        } else {
          this.formItem.minDueSettleDt = "";
          this.formItem.maxDueSettleDt = "";
        }
      },
      handleBalanceTypeChange() {
        if (this.formItem.balanceTypes.length === 0) {
          this.isRebuyDueDateShow = false;
          this.formItem.dueSettleDate = "";
          this.formItem.minDueSettleDt = "";
          this.formItem.maxDueSettleDt = "";
          return ;
        }
        // 使用every遍历formItem.balanceTypes中的值
        this.isRebuyDueDateShow = this.formItem.balanceTypes.every((curVal) => {
          // 如果balanceType是3,4,5,6,8即质押式逆回购余额、买断式逆回购余额、质押式正回购余额、买断式正回购余额、再贴现回购余额
          return curVal === '3' || curVal === '4' || curVal === '5'
            || curVal === '6' || curVal === '8';
        });
        this.formItem.dueSettleDate = "";
        this.formItem.minDueSettleDt = "";
        this.formItem.maxDueSettleDt = "";
      },
      formSearch() {
        this.loading=true;
        if(this.formItem.startDt != null && this.formItem.startDt != "") {
          this.formItem.startDt = this.formItem.startDt.replace(/-/g, "");
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
        this.getBalanceRegisterDataList();
        this.getSumData();
        // this.$refs.datagrid.dataChange(1);
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
      formSearchReset() {
        let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
        this.formItem.brchNos = userInfo.brchNo;
        this.formItem.branchName = userInfo.brchName;
        this.minRate = "";
        this.maxRate = "";
        this.dueSettleDate = "";
        this.formItem.minRate="";
        this.formItem.maxRate="";
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.formItem.minDueSettleDt = "";
        this.formItem.maxDueSettleDt = "";
        this.$refs.formItem.resetFields();
        this.formItem.discBankName="";
        this.formItem.discBrchCode="";
        let workDate = this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD").format("YYYY-MM-DD");
        this.formItem.startDtArr = [workDate, workDate];
        this.formItem.minStartDt = window.sessionStorage.getItem("workDate");
        this.formItem.maxStartDt = window.sessionStorage.getItem("workDate");
        this.formItem.billRangeStart = "";
        this.formItem.billRangeEnd = "";
      },

      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //获取导出模板
      tempShowExcelTemplateWinOpen() {
        this.param = 'indexCurrentlyBalanceReportInfo';
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        }else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },

      //清单导出
      exportList(field, exportType) {
        if(null != this.minRate && this.minRate !==""){
          this.formItem.minRate = Number(this.minRate)/100;
        }
        if(null != this.maxRate && this.maxRate !==""){
          this.formItem.maxRate = Number(this.maxRate)/100;
        }
        let exportUrl = window.LOCAL_CONFIG.API_HOME + "/pc/acct/balance/indexCurrentlyBalance/func_exportCurrentlyBalanceRegister";
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
          this.billRangeStart=null;
          this.billRangeEnd=null;
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
      this.formItem.brchNos = userInfo.brchNo;
      this.formItem.branchName = userInfo.brchName;
      let workDate = this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD").format("YYYY-MM-DD");
      this.formItem.startDtArr = [workDate, workDate];
      this.formItem.minStartDt = window.sessionStorage.getItem("workDate");
      this.formItem.maxStartDt = window.sessionStorage.getItem("workDate");
      this.pageSizeParamValue = parseInt(window.sessionStorage.getItem("pageSize"));
    },
    mounted() {
      this.getSumData();
      this.getBalanceRegisterDataList();
      this.openI9flag=window.sessionStorage.getItem('isOpenI9')=='1'?true:false;
      this.getDictListByGroups("DraftTypeCode,CDMedia,bankLevel,CreditMajor,Yon,InOutFlagCode,BalanceType,LabelTypeClass,AssetIndustry,BillOrigin,onwayStatus").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get("CDMedia");
        this.acptBankLevelList = res.get("bankLevel");
        this.inOutFlagList = res.get("InOutFlagCode");
        this.balanceTypeList = res.get("BalanceType");
        this.billOriginList = res.get("BillOrigin");
        this.onwayStatusList = res.get("onwayStatus");
        this.busiClassifyList=res.get("AssetIndustry").filter(item => item.key != "0");
        this.dictMap = res.get("map");
        this.yonList = res.get("Yon");
        this.labelTypeList = res.get("LabelTypeClass");
        this.getShowPartAcct();
      });
    }
  };
</script>
