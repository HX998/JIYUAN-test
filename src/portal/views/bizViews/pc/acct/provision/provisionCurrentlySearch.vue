<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <common-date-picker v-model="formItem.acctDtArr" :label="$t('m.i.common.acctDt')" prop="acctDtArr" type="daterange" :rangeValue="['minAcctDt','maxAcctDt']"
                                    :minAcctDt.sync="formItem.minAcctDt" :maxAcctDt.sync="formItem.maxAcctDt">
                </common-date-picker>
                <show-branch v-model="formItem.brchNos" :label="$t('m.i.common.brchName')" prop="brchNos"
                             title="机构名称" :brchNo.sync="formItem.brchNos" :brchName.sync="formItem.branchName">
                </show-branch>
                <h-form-item prop="backFlowNo" :label="$t('m.i.common.backFlowNo')">
                  <h-input v-model="formItem.backFlowNo"></h-input>
                </h-form-item>
                <!-- 票据来源 -->
                <common-select :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                               v-model="formItem.billOrigin" :dictList="billOriginList"></common-select>
                <!-- 票据号码 -->
                <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNoLike">
                  <h-input v-model="formItem.billNoLike"></h-input>
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
                <h-form-item :label="$t('m.i.common.status')" prop="isAcctSuccess">
                  <h-select v-model="formItem.isAcctSuccess" placeholder="">
                    <h-option v-for="item in acctStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>

                <h-form-item  :label="$t('m.i.pc.provisionType')" prop="provisionType">
                  <h-select  v-model="formItem.provisionType" placeholder="">
                    <h-option v-for="item in balanceTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>

                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix">
              <h-form :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <h-form-item :label="$t('m.i.pc.sumInterestMoney')" class="h-form-long-label">
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
          <h-datagrid :columns="columns"
                      getDataFunc
                      :autoLoad="false"
                      @get-data="getBalanceRegisterDateList"
                      :gridData="balanceRegisterDate"
                      :bindForm="formItem"
                      :hasSelect="false"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen()">{{$t("m.i.common.listExport")}}</h-button>
            </div>
          </h-datagrid>

        </div>
      </h-col>
    </h-row>

    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo":billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>

  </div>
</template>
<script>
  import { post , on, off, formatNumber,exportList,getDictValueFromMap,formatBillRange} from "@/api/bizApi/commonUtil";

  export default {
    name: 'provisionCurrentlySearch',
    components: {

    },
    data() {
      return {
        dictMap : new Map(),
        billId : "",
        billNo : "",
        showBillInfoWin : false,
        columns : [
          {
            type: "selection",
            align: "center",
            width: 60,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: 'index',
            align: 'center',
            width: 50,
            hiddenCol: false
          },
          {
            key: 'brchName',
            title: this.$t('m.i.common.brchName'),
            sortable: true,
            hiddenCol: false
          },
          {
            key: "provisionType",
            title: this.$t('m.i.pc.provisionType'),
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"BalanceType",params.row.provisionType);
              return h("span", {
                domProps: {
                  title: list
                }
              }, list);
            },
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
            key: "currentInterest",
            title:this.$t('m.i.pc.currentInterest'),
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.currentInterest, 2, ','))
            },
          },
          {
            key: "prodName",
            title: this.$t('m.i.pc.acctTransName'),
            sortable: true,
            hiddenCol: false,
          },
          {
            key: 'drSubjectNo',
            title:this.$t('m.i.pc.drSubjectNo'),
            hiddenCol: false
          },
          {
            key: 'crSubjectNo',
            title:this.$t('m.i.pc.crSubjectNo'),
            hiddenCol: false
          },
          {
            key: "acctDt",
            title:this.$t('m.i.common.acctDt'),
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.acctDt ? this.$moment(params.row.acctDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "-")
            },
          },
          {
            key: 'backFlowNo',
            title: this.$t('m.i.common.backFlowNo'),
            hiddenCol: false
          },
          {
            key: "isAcctSuccess",
            title: this.$t('m.i.common.status'),
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "AcctFlag", params.row.isAcctSuccess);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          }
        ],
        formItem : {
          acctDtArr: [],
          minAcctDt: "",
          maxAcctDt: "",
          brchNos:"",
          branchName:"",
          backFlowNo:"",
          billNo: "",
          billNoLike: "",
          isAcctSuccess:"",
          billRangeStart: "",
          billRangeEnd: "",
          provisionType:"",
          billOrigin: "",
        },
        // 机构树
        branchList : [],
        showMessageBox : false,
        messageBoxData : [],
        brchNosOrprodNos : false,
        messageBoxTitle : '',
        checkedbrchNosName : '',
        checkedbrchs : [],
        checkedprodNos : '',
        balanceRegisterDate : {rows:[],total:1},
        type : null,
        tableRef : "selfTable",
        showProvisionDetil : false,
        acctStatusList : [],
        showmsgBox : false,
        //选择的机构号集合
        selectList : [],
        //表格内选中的数据的id号
        whichSelect : {
          provision_id: ''
        },
        wanttosave : [],
        productTreeData : [],
        isDisabled : true,
        ifShowMore : false,
        showcheckbox : false,
        autoLoad : false,
        tmpForm : {},
        sumMoney : "",
        total : "",
        tempShowExcelTemplateWin : false,
        param : null,
        rows : null,
        billRangeStart: "",
        billRangeEnd: "",
        billOriginList: [],
        balanceTypeList: [],
      };
    },
    created() {
      let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
      this.formItem.brchNos = userInfo.brchNo;
      this.formItem.branchName = userInfo.brchName;
      let workDate = this.$moment(window.sessionStorage.getItem("preWorkDate"), "YYYYMMDD").format("YYYY-MM-DD");
      this.formItem.acctDtArr = [workDate, workDate];
      this.formItem.minAcctDt = window.sessionStorage.getItem("preWorkDate");
      this.formItem.maxAcctDt = window.sessionStorage.getItem("preWorkDate");
    },
    mounted() {
      this.formSearch();
      this.getDictListByGroups("AcctFlag,BalanceType,BillOrigin").then(res => {
        this.balanceTypeList = res.get("BalanceType");
        this.acctStatusList = res.get("AcctFlag");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      //查询点击事件
      formSearch() {
        /**清除多页选择的数据*/
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        //设置清单导出时所需的查询条件
        this.tmpForm = JSON.parse(JSON.stringify(this.formItem));
        this.$refs.datagrid.dataChange(1);
      },
      //表单重置事件
      formSearchReset() {
        let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
        this.formItem.brchNos = userInfo.brchNo;
        this.formItem.branchName = userInfo.brchName;
        this.$refs.formItem.resetFields();
        let workDate = this.$moment(window.sessionStorage.getItem("preWorkDate"), "YYYYMMDD").format("YYYY-MM-DD");
        this.formItem.acctDtArr = [workDate, workDate];
        this.formItem.minAcctDt = window.sessionStorage.getItem("preWorkDate");
        this.formItem.maxAcctDt = window.sessionStorage.getItem("preWorkDate");
        this.formItem.billRangeStart = "";
        this.formItem.billRangeEnd = "";
      },

      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      showBillInfo(row) {
          this.billId = row.billId;
        this.billRangeStart = row.billRangeStart;
        this.billRangeEnd = row.billRangeEnd;
          this.billNo = row.billNo;
          this.showBillInfoWin = true;
      },
      billInfoWinClose() {
          this.showBillInfoWin = false;
      },
      //获取导出模板
      tempShowExcelTemplateWinOpen() {
        this.param = 'provisionCurrentlySearchReportInfo';
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        }else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },

      //清单导出
      exportList(field, exportType) {
        let exportUrl = window.LOCAL_CONFIG.API_HOME + "/pc/acct/provision/provisionSearch/func_exportProvisionCurrently";
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

      getBalanceRegisterDateList() {
        let obj = Object.assign({}, this.formItem, { "pageNo": this.$refs.datagrid.pageInfo.pageNo, "pageSize": this.$refs.datagrid.pageInfo.pageSize });
        let url = "/pc/acct/provision/provisionCurrentlySearch/func_queryProvisionCurrently";
        post(obj, url).then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                let data = res.data.retData;
                this.balanceRegisterDate = data;
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
      }
    }
  }

</script>
