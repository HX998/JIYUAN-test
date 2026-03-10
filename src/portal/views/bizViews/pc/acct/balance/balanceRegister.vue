<!--台账管理 -->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form ref="formItem" :model="formItem" :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
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
                  <h-form-item  :label="$t('m.i.billInfo.billPackageNo')" prop="billNoLike">
                    <h-input v-model="formItem.billNoLike" placeholder=""></h-input>
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
                  <h-form-item :label="$t('m.i.pc.balanceType')" prop="balanceTypes">
                    <h-select v-model="formItem.balanceTypes" placeholder="" multiple showTitle
                              @on-change="handleBalanceTypeChange">
                      <h-option v-for="item in balanceTypeList" :value="item.key" :key="item.key">{{ item.value }}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <common-select v-if="openI9flag" v-model="formItem.assetIndustry"  prop="assetIndustry" :dictList="busiClassifyList"
                                 :label="$t('m.i.be.assetIndustry')"></common-select>
                  <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                    <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                    <h-button type="ghost" @click="handleReset()">{{$t("m.i.common.reset")}}</h-button>
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
                </div>
              </h-form>
            </h-panel>
          </div>

          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            :hasSelect = false
            :rowSelect = true
            url = "/pc/acct/balance/balanceRegister/func_queryBalanceRegisterOccur"
            @getSumMoneyAndTotal="getSumMoneyAndTotal"
            :bindForm="formItem"
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

    <!--标票票面信息-->
    <bill-info-main-std @billInfoWinClose="billInfoStdWinClose" :showBillInfoWin="showBillInfoStdWin" :billId="billId" :billNo="billNo" :listId="listId" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main-std>


  </div>
</template>
<script>


  import { post, on, off, formatNumber, accMul,exportList,formatBillRange} from "@/api/bizApi/commonUtil";

  export default {
    name: "balanceRegister",
    components: {

    },
    data() {
      return {
        dictMap : new Map(),
        openI9flag:false,
        formItem : {
          brchNos: "",
          branchName:"",
          billNoLike: "",
          billType:'',
          billClass:'',
          startDtArr: [],
          balanceTypes:[],
          minStartDt: "",
          maxStartDt: "",
          balanceType:"",
          billOrigin: "",
          billRangeStart: "",
          billRangeEnd: "",
          assetIndustry:""

        },
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
        busiClassifyList: [],
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
            type: 'selection',
            align: 'center',
            width: 60,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: 'index',
            align: 'center',
            width: 60,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pc.balanceType"),
            key: 'balanceType',
            hiddenCol: false,
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
            title: this.$t("m.i.billInfo.billType"),
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
            title: this.$t("m.i.billInfo.billClass"),
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
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: 'billNo',
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
            key: 'billMoney',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('div', [
                h('span', formatNumber(params.row.billMoney, 2, ','))
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
            title:this.$t("m.i.billInfo.dueDt"),
            key: 'dueDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.dueDt == null ? "" : this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title:this.$t("m.i.billInfo.drwrName"),
            key: 'drwrName',
            sortable: true,
            hiddenCol: false
          },
          {
            title:this.$t("m.i.billInfo.drwrAcctNo"),
            key: 'drwrAcctNo',
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrBankNo"),
            key: 'drwrBankNo',
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: 'acptName',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.common.prodName"),
            key: 'prodName',
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.transDt"),
            key: 'startDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.startDt == null ? "" : this.$moment(params.row.startDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.common.brchName'),
            key: 'brchName',
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.custName"),
            key: 'custName',
            hiddenCol: false
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
            title: this.$t("m.i.common.rate"),
            key: 'rate',
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.rate != null && params.row.rate !== ""){
                let rate = accMul(params.row.rate, 100);
                return h("span", rate);
              }
            }
          },
          {
            title: this.$t("m.i.common.interest"),
            key: 'interest',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('div', [
                h('span', formatNumber(params.row.interest, 2, ','))
              ]);
            }
          },
          { title: this.$t("m.i.pc.settleAmt"),
            key: 'settleAmt',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('span', formatNumber(params.row.settleAmt, 2, ','))
              ]);
            }
          }],
        histData : {rows:[],
          total:1},
        traderData : {rows:[],
          total:1},
        userTraderWin : false,
        showDefaultTeller:false,
        branchDto : {},
        currentSelectRow : [],
        traderSelectRow : [],
        currentSelectList : [],
        balanceTypeList: [],
        currentSelectRowInx : [],
        tempInx : 0,
        pageInfo : {
          pageNo: 1,
          pageSize: 10
        },
        brchRoleDistributeWin : false,
        userHistWin : false,

        defaultTraderNo:null,

        showBranchMenuWin:false,
        submitCopyRoleDisabled : false,

        numberRule : ['num'],
        deletDisabled : false,
        kindTree: [],
        submitFlag : false,
        ifShowMore :false,
        schemeIdList : [],
        reqUrl : 'pc/acct/balanceReg',

        selectexport : [],
        billTypeList : [],
        billClassList : [],

        balanceRegisterDate : {rows:[],total:1},
        sumMoney : "",
        total : "",

        //导出参数
        tempShowExcelTemplateWin : false,
        param : null,
        rows : null,
      };
      //日期字符串格式化（yyyy-mm-dd）
      function datatoDate(value){
        if (value != null && value != "") {
          var str=value.toString();
          return str.slice(0,4)+'-'+str.slice(4,6)+'-'+str.slice(6,8);
        }
        else {
          return "";
        }
      }
    },
    methods: {
      //查询按钮点击事件
      handleSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      },
      getSumMoneyAndTotal(params) {
        this.total = params.total;
        this.sumMoney = formatNumber(params.sumMoney, 2, ",");
      },
      handleReset() {
        let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
        this.formItem.branchName = userInfo.brchName;
        this.$refs.formItem.resetFields();
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
        this.param = 'balanceRegisterReportInfo';
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        }else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },

      //清单导出
      exportList(field, exportType) {
        let exportUrl = window.LOCAL_CONFIG.API_HOME + "/pc/acct/balance/balanceRegister/func_exportBalanceRegisterOccur";
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
            this.listId = listId;
            this.billNo = billNo;
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
    },

    created() {
      let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
      this.formItem.brchNos = userInfo.brchNo;
      this.formItem.branchName = userInfo.brchName;
      let workDate = this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD").format("YYYY-MM-DD");
      this.formItem.startDtArr = [workDate, workDate];
      this.formItem.minStartDt = window.sessionStorage.getItem("workDate");
      this.formItem.maxStartDt = window.sessionStorage.getItem("workDate");
    },
    mounted() {
      this.openI9flag=window.sessionStorage.getItem('isOpenI9')=='1'?true:false;
      this.getDictListByGroups("DraftTypeCode,CDMedia,AssetIndustry,BalanceType,BillOrigin").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get("CDMedia");
        this.balanceTypeList = res.get("BalanceType");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
        this.busiClassifyList=res.get("AssetIndustry").filter(item => item.key != "0");
      });
    }
  };

</script>
