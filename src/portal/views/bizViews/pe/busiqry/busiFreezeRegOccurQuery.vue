<!--司法冻结-发生查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--机构名称-->
                <show-branch v-model="formItem.branchNos"  :label="$t('m.i.common.brchName')" prop="branchNos"
                             :showCheckBox="true" :brchNo.sync="formItem.branchNos" :brchName.sync="formItem.branchNames"></show-branch>
                <!--出票人全称-->
                <common-input v-model="formItem.drwrName" :label="$t('m.i.billInfo.drwrName')" prop="drwrName"  :readonly="true" :showIcon="true"
                              @on-click="queryCustName()" :clearable="true" :clearVal="clearVal" :clearValTag="this.custName"></common-input>
                <!--出票人账号-->
                <common-input v-model="formItem.drwrAcctNo" :label="$t('m.i.billInfo.drwrAcctNo')" prop="drwrAcctNo" :readonly="true" :showIcon="true"
                              @on-click="queryCustAcctNo()" :clearable="true" :clearVal="clearVal" :clearValTag="this.custAcctNo"></common-input>
                <!--冻结状态-->
                <common-select v-model="formItem.sspdStatus" :label="$t('m.i.ce.freezeStatus')" prop="sspdStatus" :dictList="freezeStatusList"></common-select>
                <!--票据号码-->
                <common-input v-model="formItem.likeBillNo" :label="$t('m.i.billInfo.billPackageNo')" prop="likeBillNo" :maxlength="30"></common-input>
                <!--票据(包)金额(元)-->
                <common-type-field-range v-model="formItem" :label="$t('m.i.billInfo.billPackageMoney')" :integerNum="16" :suffixNum="2":validRules="billMoneyRule"
                                         :rangeProps="['minBillMoney','maxBillMoney']" :bigTips="false" class="h-form-long-label"></common-type-field-range>
                <!--汇票到期日-->
                <common-date-picker v-model="dueDate" :label="$t('m.i.billInfo.dueDt')" type="daterange" :autoPlacement="true" @on-change="handleDueDateChange"></common-date-picker>
                <!--冻结（解除）日期-->
                <common-date-picker v-model="sspdAndRelieveDate" :label="$t('m.i.ce.freezeOrUnFreezeDt')" type="daterange" :autoPlacement="true"
                                    @on-change="handleSspdAndRelieveDateChange" class="h-form-long-label"></common-date-picker>
                <query-btn :advanceShow="true" @showChange="showChange" :formSearch="handleSearch" :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix">
              <h-form :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <h-form-item :label="$t('m.i.ce.billMoneyPackageTotalAmt')" class="h-form-long-label">
                    <h-input v-model="totalAmt" placeholder="" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.common.totalNum')">
                    <h-input v-model="totalNum" placeholder="" readonly></h-input>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                      :row-select="true"
                      :has-select="false"
                      @getSumMoneyAndTotal="getSumMoneyAndTotal"
                      :url="queryUrl"
                      :bindForm="formItem"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="listExport()">{{$t("m.i.common.listExport")}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 查询客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                           @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
        <!-- 查询客户账号信息弹窗 -->
        <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.drwrCustNo"
                           @showCustAcctNoWinClose="showCustAcctNoWinClose" @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
        <!--附件管理-->
        <show-file-win :showFileWin="showFileWin" :fileBatchParams="fileBatchParams" :dictMap="dictMap" :filePathUrl="filePathUrl" @showFileWinClose="showFileWinClose"></show-file-win>
        <!-- 票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId"
                        :billNo="billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
        <!--导出-->
        <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                               :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.exportParam" :rows="this.exportRows"></common-excel-download>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { getDictListByGroups, getDictValueFromMap, formatNumber, formatBillRange, exportList, getSingleParamValuesByKeys } from "@/api/bizApi/commonUtil";

  export default {
    name: "busiFreezeRegOccurQuery",
    components: {
      ShowFileWin: () => import(/* webpackChunkName: "pc/img/showFileWin" */`@/views/bizViews/pc/img/showFileWin`)
    },
    data() {
      return {
        showBillInfoWin: false,
        billId: "",
        billNo:"",
        billRangeStart:"",
        billRangeEnd:"",
        formItem: {
          drwrCustNo: "",
          drwrName: "",
          drwrAcctNo: "",
          rgstType: "",
          billType: "AC02",
          likeBillNo: "",
          acptProtocalNo: "",
          minSspdAndRelieveDt: "",
          maxSspdAndRelieveDt: "",
          minBillMoney: "",
          maxBillMoney: "",
          branchNos: this.$store.getters.userInfo.brchNo,
          branchNames: this.$store.getters.userInfo.brchName,
          sspdStatus: "",
          minDueDt: "",
          maxDueDt: "",
        },
        totalAmt: "",
        totalNum: "",
        queryUrl: "/pe/busiqry/busiFreezeRegOccurQuery/func_freezeRegOccurQueryByPage",
        billMoneyRule:[{
          test: /^(?:[1-9]\d{0,15}|0)(?:\.\d{1,2})?$/,
          trigger: "blur",
          message: "票据(包)金额(元)必须是大于等于0的数字，最多16位整数且小数位不超过两位"
        }],
        custName: "custName",
        custAcctNo: "custAcctNo",
        sspdAndRelieveDate: [],
        dueDate: [],
        dictMap: new Map(),
        freezeStatusList: [],
        freezeRgstTypeList: [],
        billTypeList: [],
        currentSelectList: [],
        showCustAcctNoWin: false,
        showCustMessageWin: false,
        //是否显示更多查询项
        ifShowMore: false,
        // 查看附件
        showFileWin: false,
        filePathUrl: "/pe/busiqry/busiFreezeRegOccurQuery/",
        fileBatchParams: {},
        //清单导出
        exportParam: "",
        exportRows: "",
        tempShowExcelTemplateWin: false,
        columns: [
          {
            type: 'selection',
            width: 60,
            hiddenCol: false,
            align: 'center'
          },
          {
            type: 'index',
            key: 'numOrder',
            title: this.$t("m.i.common.index"),
            width: 60,
            align: 'center',
            hiddenCol: false,
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
                    this.showBillInfo(params);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            align:'center',
            key:"sspdBillRange",
            hiddenCol: false,
            render:(h,params) => {
              let billOrigin = params.row.billOrigin;
              let billRangeStart = params.row.sspdBillRangeStart;
              let billRangeEnd = params.row.sspdBillRangeEnd;
              return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
            }
          },
          {
            title: this.$t("m.i.common.brchName"),
            key: 'acptBankName',
            hiddenCol: false,
            sortable: false,
          },
          {
            title: this.$t("m.i.ce.freezeStatus"),
            key: 'sspdStatus',
            hiddenCol: false,
            sortable: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"FreezeStatus",params.row.sspdStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.ce.freezeOrUnFreezeDt"),
            key: 'sspdAndRelieveDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.sspdAndRelieveDt ? this.$moment(params.row.sspdAndRelieveDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t("m.i.ce.freezeRgstType"),
            key: 'rgstType',
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"FreezeRgstType",params.row.rgstType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.ce.acptStatus"),
            key: 'acptStatus',
            hiddenCol: true,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"AcptStatus",params.row.acptStatus);
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
              let list = getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageMoney"),
            key: "billMoney",
            align: "right",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.billMoney, 2, ","));
            }
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: 'pyeeName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: 'drwrName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: 'drwrAcctNo',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: 'remitDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: 'dueDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.billInfo.acptDt'),
            key: 'acptDt',
            hiddenCol: true,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.acptDt ? this.$moment(params.row.acptDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t("m.i.common.remark"),
            key: 'sspdAndRelieveRemark',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.busiHandleBrchName"),
            key: 'busiBrchName',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.busiHandleBrchCode"),
            key: 'busiBrchCode',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.showAttach"),
            key: "showAttach",
            hiddenCol: false,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.showAttach(params)
                  }
                }
              }, "查看");
            }
          }
        ],
        freezeIsNeedCheckFlag: true,
        freezeIsNeedAcctFlag: false,
      }
    },
    async mounted() {
      await this.getBusinessParamValue();
      getDictListByGroups("DraftTypeCode,FreezeStatus,AcptStatus,FreezeRgstType,AttTypeCode,FileDetailStatus,PreRelationFlag").then(res => {
        this.freezeRgstTypeList = res.get("FreezeRgstType");
        this.billTypeList = res.get("DraftTypeCode");
        this.dictMap = res.get("map");
        this.freezeStatusList = res.get("FreezeStatus").filter(item => item.key === "5" || item.key === "6" || item.key === "7" || item.key === "8" || item.key === "9" || item.key === "10");
        // 不需要复核
        if (!this.freezeIsNeedCheckFlag){
          this.freezeStatusList = this.freezeStatusList.filter(item => item.key !== "6" && item.key !== "7");
        }
        // 需要记账
        if (!this.freezeIsNeedAcctFlag){
          this.freezeStatusList = this.freezeStatusList.filter(item => item.key !== "9");
        }
      });
    },
    methods: {
      getSumMoneyAndTotal(params) {
        this.totalNum = params.total;
        this.totalAmt = formatNumber(params.sumMoney, 2, ",");
      },
      showChange(val) {
        this.ifShowMore = val;
      },
      clearVal(type){
        if(type === 'custName'){
          this.formItem.drwrCustNo = '';
          this.formItem.drwrName = "";
        }else{
          this.formItem.drwrAcctNo = '';
        }
      },
      billInfoWinClose(){
        this.billId = "";
        this.billNo = "";
        this.billRangeStart = "";
        this.billRangeEnd = "";
        this.showBillInfoWin = false;
      },
      showBillInfo(params){
        this.billId = params.row.billId;
        this.billNo = params.row.billNo;
        this.billRangeStart = params.row.sspdBillRangeStart;
        this.billRangeEnd = params.row.sspdBillRangeEnd;
        this.showBillInfoWin = true;
      },
      //表单查询
      handleSearch() {
        this.$refs["formItem"].validate(valid => {
          if (valid) {
            this.$refs.datagrid.selects = [];
            this.$nextTick(() => {
              this.$refs.datagrid.dataChange(1);
            });
          }
        });
      },
      //重置表单查询结果
      resetSearch() {
        this.$nextTick(() => {
          this.$refs.formItem.resetFields();
          this.formItem.drwrCustNo = "";
          this.formItem.drwrName = "";
          this.formItem.drwrAcctNo = "";
          this.formItem.rgstType = "";
          this.formItem.billType = "AC02";
          this.formItem.likeBillNo = "";
          this.formItem.acptProtocalNo = "";
          this.formItem.minSspdAndRelieveDt = "";
          this.formItem.maxSspdAndRelieveDt = "";
          this.sspdAndRelieveDate = [];
          this.formItem.minBillMoney = "";
          this.formItem.maxBillMoney = "";
          this.formItem.branchNos = this.$store.getters.userInfo.brchNo;
          this.formItem.branchNames = this.$store.getters.userInfo.brchName;
          this.formItem.sspdStatus = "";
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDate = [];
        });
      },
      // 处理冻结(解除)日期
      handleSspdAndRelieveDateChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minSspdAndRelieveDt = arr[0].replace(/-/g, "");
          this.formItem.maxSspdAndRelieveDt = arr[1].replace(/-/g, "");
          this.sspdAndRelieveDate = [arr[0], arr[1]];
        } else {
          this.formItem.minSspdAndRelieveDt = "";
          this.formItem.maxSspdAndRelieveDt = "";
          this.sspdAndRelieveDate = [];
        }
      },
      // 处理票据到期日
      handleDueDateChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDate = [arr[0], arr[1]];
        } else {
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDate = [];
        }
      },
      //查询客户信息
      //触发弹窗
      queryCustName() {
        this.showCustMessageWin = true;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.formItem.drwrAcctNo = "";
        this.formItem.drwrName = info.custName;
        this.formItem.drwrCustNo = info.custNo;
        if(info.custAcctNo !== ""){
          this.formItem.drwrAcctNo = info.custAcctNo;
        }
        this.showCustMessageWin = false;
      },
      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //查询客户账号信息
      //触发弹窗
      queryCustAcctNo() {
        if (this.formItem.drwrCustNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustAcctNoWin = true;
      },
      //赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.drwrAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //关闭弹窗
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },
      // 打开附件弹窗
      showAttach(params) {
        this.fileBatchParams.operType = "show";
        this.fileBatchParams.busiId = params.row.id;
        this.fileBatchParams.filePathUrl = this.filePathUrl;
        this.fileBatchParams.attTypeCodeList = [{ key: "FT09", value: "冻结" },{ key: "FT10", value: "冻结解除" }];
        this.fileBatchParams.fileDetailStatusList = [{ key: "FD00", value: "初始" },{ key: "FD01", value: "上传中" },
          { key: "FD02", value: "已上传" },{ key: "FD06", value: "登记失败" }];
        this.showFileWin = true;
      },
      // 关闭附件弹窗
      showFileWinClose(){
        this.fileBatchParams = {};
        this.showFileWin = false;
      },
      //清单导出
      listExport() {
        this.exportParam = "busiFreezeRegOccurQueryExportInfo";
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.exportRows = this.$refs.datagrid.selectIds.length;
        } else {
          this.exportRows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      exportList(field, exportType) {
        let url = window.LOCAL_CONFIG.API_HOME + "/pe/busiqry/busiFreezeRegOccurQuery/func_exportFreezeRegOccurQueryList";
        let options = {};
        if (this.$refs.datagrid.selectIds.length !== 0) {
          options.params = {
            ids: this.$refs.datagrid.selectIds,
            billType: "AC02",
          };
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.exportParam, field, exportType, url, options);
      },
      // 查询业务参数：电票冻结/解冻是否需要双岗复核，1-是（默认） 0-否   电票冻结/解冻是否需要记账，1-是 0-否（默认）
      getBusinessParamValue() {
        return getSingleParamValuesByKeys("ce.acpt.freeze_is_need_check_flag,ce.acpt.freeze_is_need_acct_flag").then(res => {
          let freezeIsNeedCheckFlag = res['ce.acpt.freeze_is_need_check_flag'];
          let freezeIsNeedAcctFlag = res['ce.acpt.freeze_is_need_acct_flag'];
          if (freezeIsNeedCheckFlag && freezeIsNeedCheckFlag === "0") {
            this.freezeIsNeedCheckFlag = false;
          }
          if (freezeIsNeedAcctFlag && freezeIsNeedAcctFlag === "1") {
            this.freezeIsNeedAcctFlag = true;
          }
        });
      },
    }
  };
</script>

<style scoped>

</style>
