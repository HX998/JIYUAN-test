<!--流水管理 -->
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
                    <h-select v-model="formItem.billType" placeholder="">
                      <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value }}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="dueDate">
                    <h-date-picker type="daterange" v-model="formItem.dueDate" format="yyyy-MM-dd" showFormat placeholder="" @on-change="handleDueDateChange"></h-date-picker>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass">
                    <h-select v-model="formItem.billClass" placeholder="">
                      <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{item.value }}
                      </h-option>
                    </h-select>
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
                  <h-form-item :label="$t('m.i.be.assetIndustry')" prop="assetIndustry" v-if="openI9flag">
                    <h-select v-model="formItem.assetIndustry" placeholder="">
                      <h-option v-for="item in busiClassifyList" :value="item.key" :key="item.value">{{ item.value}}
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
                  <h-form-item :label="$t('m.i.pc.total')">
                    <h-input v-model="sunNum" placeholder="" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.pc.sumMoney')" class="h-form-long-label">
                    <h-input v-model="sumBillMoney" placeholder="" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.pc.sumPayInterest')">
                    <h-input v-model="sumPayInterest" placeholder="" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.pc.sumRevMoney')">
                    <h-input v-model="sumRevMoney" placeholder="" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.pc.weightAverRate')" class="h-form-long-label">
                    <h-input v-model="weightAverRate" placeholder="" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.pc.weightAverInterDay')" class="h-form-long-label">
                    <h-input v-model="weightAverInterDay" placeholder="" readonly></h-input>
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
            url="/pc/acct/balance/rebuyCurrentlyBalance/func_queryRebuyCurrentlyBalanceRegister"
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
  </div>

</template>
<script>
  import { post, on,off, formatNumber, accMul,exportList,formatBillRange} from "@/api/bizApi/commonUtil";

  export default {
    name: 'rebuyCurrentlyBalance',
    data() {
      return {
        dictMap : new Map(),
        formItem : {
          brchNos: "",
          branchName:"",
          billNo: "",
          billNoLike : "",
          onwayStatus:"",
          billType:'',
          startDt:'',
          startDtArr:[],
          balanceTypes:[],
          onwayStatuss:[],
          minStartDt:"",
          maxStartDt:"",
          dueDate:"",
          balanceType:'',
          billClass:"",
          status:"",
          billOrigin: "",
          billRangeStart: "",
          billRangeEnd: "",
          assetIndustry:""
        },
        type : null,
        addOrEditWin : false,
        setRoleRole : false,
        setRoleRight : false,
        setRoleAllotRight : false,
        copyWin : false,
        readonly:false,
        isRequired:true,
        tempShowExcelTemplateWin : false,
        param : null,
        rows : null,
        busiClassifyList: [],
        onwayStatusList: [],
        showBillInfoWin : false,
        billRangeStart:"",
        billRangeEnd:"",
        billId : "",
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
            title: this.$t("m.i.billInfo.billOrigin"),
            align:'center',
            hiddenCol: false,
            render:(h,params) => {
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' :  this.getDictValueFromMap(this.dictMap, 'BillOrigin', params.row.billOrigin);

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
            align: 'center',
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
            align: 'center',
            sortable: true,
            render: (h, params) => {
              return h('div', [
                h('span', formatNumber(params.row.billMoney, 2, ','))
              ]);
            }
          },
          {
            title:  this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            hiddenCol:false,
            sortable: true,
            align: 'center',
            render: (h, params) => {
              let date = params.row.remitDt == null ? "" : this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title:  this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol:false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.dueDt == null ? "" : this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title:this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            hiddenCol:false,
            align: 'center',
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: "drwrAcctNo",
            hiddenCol:false,
            align: 'center',
            sortable: true
          },

          {
            title: this.$t("m.i.billInfo.drwrBankNo"),
            key: "drwrBankNo",
            hiddenCol:false,
            align: 'center',
            sortable: true
          },
          {
            title:this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            hiddenCol:false,
            align: 'center',
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
            sortable: true,
            align: 'center'
          },
          {
            title:this.$t("m.i.common.transDt"),
            key: "startDt",
            hiddenCol:false,
            align: 'center',
            sortable: true,
            render: (h, params) => {
              let date = params.row.startDt == null ? "" : this.$moment(params.row.startDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title:this.$t("m.i.pc.brchName"),
            key: "brchName",
            align: 'center',
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.custName"),
            key: "custName",
            hiddenCol: false,
            align: 'center',
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
          {
            title: this.$t("m.i.common.rate"),
            key: "rate",
            hiddenCol: false,
            align: 'center',
            sortable: true,
            render: (h, params) => {
              if(params.row.rate != null && params.row.rate !== ""){
                let rate = accMul(params.row.rate, 100);
                return h("span", rate);
              }
            }
          },
          {
            title:  this.$t("m.i.common.interest"),
            key: "interest",
            hiddenCol: false,
            align: 'center',
            sortable: true,
            render: (h, params) => {
              return h('div', [
                h('span', formatNumber(params.row.interest, 2, ','))
              ]);
            }
          },
          {
            title: this.$t("m.i.pc.settleAmt"),
            key: "settleAmt",
            hiddenCol: false,
            align: 'center',
            sortable: true,
            render: (h, params) => {
              return h('div', [
                h('span', formatNumber(params.row.settleAmt, 2, ','))
              ]);
            }
          }
        ],
        histData : {rows:[],
          total:1},
        traderData : {rows:[],
          total:1},
        userTraderWin : false,
        showDefaultTeller : false,
        branchDto : {},
        currentSelectRow : [],
        traderSelectRow : [],
        currentSelectList : [],
        currentSelectRowInx : [],
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
        schemeIdList : [],
        reqUrl : '/pc/acct/balanceReg',
        selectexport : [],
        interest : "",
        totalMoney : "",
        jqRate : "",
        jqdays : "",
        openI9flag:false,
        billTypeList : [],
        billClassList : [],
        sumBillMoney : "",
        sunNum : "",
        sumPayInterest : "",
        sumRevMoney : "",
        weightAverRate : "",
        weightAverInterDay : "",
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
            case '8':
              return '再贴现质押式回购';
          }
        } else {
          return "";
        }
      };
    },
    components: {

    },
    methods:{
      getRebuyCurrentlyBalanceRegister() {
        let obj = Object.assign({}, this.formItem);
        let url = "/pc/acct/balance/rebuyCurrentlyBalance/func_queryBuyStockBalanceCount";
        post(obj, url).then(res => {
            if (res) {
              this.sunNum = res.data.sunNum;
              this.sumBillMoney = formatNumber(res.data.sumBillMoney, 2, ',');
              this.sumPayInterest = formatNumber(res.data.sumPayInterest, 2, ',');
              this.sumRevMoney = formatNumber(res.data.sumRevMoney, 2, ',');
              this.weightAverRate = formatNumber(res.data.weightAverRate, 4, '');
              this.weightAverInterDay = res.data.weightAverInterDay;
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          }
        );
      },
      handleStartDateChange(arr){
        if(arr && arr.length == 2){
          this.formItem.minStartDt = arr[0].replace(/-/g, "");
          this.formItem.maxStartDt = arr[1].replace(/-/g, "");
        }else{
          this.formItem.minStartDt = "";
          this.formItem.maxStartDt = "";
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
        if(this.formItem.startDt != null && this.formItem.startDt != "") {
          this.formItem.startDt = this.formItem.startDt.replace(/-/g, "");
        }
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.getRebuyCurrentlyBalanceRegister();
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
        this.formItem.brchNos = userInfo.brchNo;
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
        this.param = 'rebuyCurrentlyBalanceReportInfo';
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        }else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },

      //清单导出
      exportList(field, exportType) {
        let exportUrl = window.LOCAL_CONFIG.API_HOME + "/pc/acct/balance/rebuyCurrentlyBalance/func_exportRebuyCurrentlyBalanceRegister";
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
            this.showBillInfoWin = true;
        },
        billInfoWinClose(){
            this.showBillInfoWin = false;
        }
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
      this.getRebuyCurrentlyBalanceRegister();
      this.openI9flag=window.sessionStorage.getItem('isOpenI9')=='1'?true:false;
      this.getDictListByGroups("DraftTypeCode,CDMedia,CreditMajor,AssetIndustry,BalanceType,BillOrigin,onwayStatus").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get("CDMedia");
        this.billOriginList = res.get("BillOrigin");
        this.balanceTypeList = res.get("BalanceType");
        this.onwayStatusList = res.get("onwayStatus");
        this.busiClassifyList=res.get("AssetIndustry").filter(item => item.key != "0");
        this.dictMap = res.get("map");
      });
    }
  };
</script>
