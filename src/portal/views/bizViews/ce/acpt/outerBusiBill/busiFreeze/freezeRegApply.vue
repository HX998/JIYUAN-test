<!--司法冻结-冻结申请-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div class="h-form-search-box">
            <!-- 查询表单 -->
          <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
            <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
              <!--出票人全称-->
              <common-input v-model="formItem.drwrName" :label="$t('m.i.billInfo.drwrName')" prop="drwrName" :readonly="true" :showIcon="true"
                            @on-click="queryCustName()" :clearable="true" :clearVal="clearVal" :clearValTag="this.custName"></common-input>
              <!--出票人账号-->
              <common-input v-model="formItem.drwrAcctNo" :label="$t('m.i.billInfo.drwrAcctNo')" prop="drwrAcctNo" :readonly="true" :showIcon="true"
                            @on-click="queryCustAcctNo()" :clearable="true" :clearVal="clearVal" :clearValTag="this.custAcctNo"></common-input>
              <!--冻结状态-->
              <common-select v-model="formItem.sspdStatus" :label="$t('m.i.ce.freezeStatus')" prop="sspdStatus" :dictList="freezeStatusList"></common-select>
              <!--票据号码-->
              <common-input v-model="formItem.likeBillNo" :label="$t('m.i.billInfo.billPackageNo')" prop="likeBillNo" :maxlength="30"></common-input>
              <!--票据(包)金额(元)-->
              <common-type-field-range v-model="formItem" :label="$t('m.i.billInfo.billPackageMoney')" :integerNum="16" :suffixNum="2" :validRules="billMoneyRule"
                                       :rangeProps="['minBillMoney','maxBillMoney']" :bigTips="false" class="h-form-long-label"></common-type-field-range>
              <query-btn :advanceShow="true" @showChange="showChange" :formSearch="handleSearch" :formSearchReset="resetSearch"></query-btn>
            </h-form>
          </h-panel>
        </div>
          <!-- 数据展示表格 -->
        <h-datagrid :columns="columns"
                    highlightRow
                    url="/ce/acpt/outerBusiBill/busiFreeze/freezeRegApply/func_queryFreezeRegApplyByPage"
                    :bindForm="formItem"
                    :row-select="true"
                    :has-select="false"
                    :onSelectChange="handleRowClick"
                    ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="stopPayment()" :disabled="handleSspdStatus">{{$t('m.i.ce.freezeOperate')}}</h-button>
              <h-button type="primary" @click="cancelStopPayment()" :disabled="cancelHandleSspdStatus">{{$t('m.i.ce.unFreezeOperate')}}</h-button>
              <h-button type="primary" @click="submit()">{{$t('m.i.common.submit')}}</h-button>
              <h-button type="primary" @click="remove()">{{$t('m.i.common.delete')}}</h-button>
            </div>
          </h-datagrid>
        <!-- 查询客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                           @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
        <!-- 查询客户账号信息弹窗 -->
        <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="formItem.drwrCustNo"
                           @showCustAcctNoWinClose="showCustAcctNoWinClose" @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
        <!-- 票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId"
                        :billNo="billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
        <!-- 新增冻结/解冻明细弹窗 -->
        <freeze-reg-form-item :freezeRegFormItemWin="this.freezeRegFormItemWin" :freezeRegParams = "this.freezeRegParams"
                              @freezeRegFormItemWinClose="freezeRegFormItemWinClose" ref="freezeRegFormItem"></freeze-reg-form-item>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { post, getDictListByGroups, getDictValueFromMap, formatNumber, formatBillRange, getSingleParamValuesByKeys } from "@/api/bizApi/commonUtil";

  export default {
    name: "freezeRegApply",
    components: {
    },
    data() {
      return {
        billMoneyRule:[{
          test: /^(?:[1-9]\d{0,15}|0)(?:\.\d{1,2})?$/,
          trigger: "blur",
          message: "票据(包)金额(元)必须是大于等于0的数字，最多16位整数且小数位不超过两位"
        }],
        YonList: [],
        custName: "custName",
        custAcctNo: "custAcctNo",
        showBillInfoWin: false,
        billId: "",
        billNo:"",
        billRangeStart:"",
        billRangeEnd:"",
        formItem: {
          drwrCustNo: "",
          drwrName: "",
          drwrAcctNo: "",
          sspdStatus: "",
          likeBillNo: "",
          acptProtocalNo: "",
          billType:"AC02",
          minBillMoney:"",
          maxBillMoney:""
        },
        freezeRegParams:{},
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
            title: this.$t("m.i.billInfo.sspdBillRange"),
            align:'center',
            key:"sspdBillRange",
            hiddenCol: false,
            render:(h,params) => {
              let billOrigin = params.row.billOrigin;
              let sspdBillRangeStart = params.row.sspdBillRangeStart;
              let sspdBillRangeEnd = params.row.sspdBillRangeEnd;
              return h("span", formatBillRange(billOrigin, sspdBillRangeStart, sspdBillRangeEnd))
            }
          },
          {
            title: this.$t("m.i.ce.freezeStatus"),
            key: 'sspdStatus',
            hiddenCol: false,
            sortable: true,
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
            title: this.$t("m.i.ce.freezeRgstType"),
            key: 'rgstType',
            hiddenCol: false,
            sortable: false,
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
            title: this.$t("m.i.ce.freezeOrUnFreezeDt"),
            key: 'sspdAndRelieveDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.sspdAndRelieveDt ? this.$moment(params.row.sspdAndRelieveDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t("m.i.ce.acptStatus"),
            key: 'acptStatus',
            hiddenCol: false,
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
            hiddenCol: false,
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
            title: this.$t('m.i.common.returnReason'),
            key: 'checkRefuseReason',
            hiddenCol: false,
            sortable: false
          }
        ],
        billTypeList: [],
        freezeStatusList: [],
        freezeRgstTypeList: [],
        dictMap: new Map(),
        currentSelectRow: [],
        showCustAcctNoWin: false,
        showCustMessageWin: false,
        handleSspdStatus: false,
        cancelHandleSspdStatus: false,
        sspdImageTypeList : [],
        relieveImageTypeList: [],
        sspdId:"",
        //是否显示更多查询项
        ifShowMore: false,
        freezeRegFormItemWin:false,
        submitForm: {
          ids:"",
        },
        freezeIsNeedCheckFlag: true,
      }

    },
    async mounted() {
      await this.getBusinessParamValue();
      getDictListByGroups("DraftTypeCode,FreezeStatus,FreezeRgstType,AcptStatus,Yon,AttTypeCode,FileDetailStatus,PreRelationFlag").then(res => {
        this.YonList = res.get("Yon");
        this.billTypeList = res.get("DraftTypeCode");
        this.freezeRgstTypeList = res.get("FreezeRgstType");
        this.dictMap = res.get("map");
        this.freezeStatusList = res.get("FreezeStatus").filter(item => item.key === "0" || item.key === "5" || item.key === "2" || item.key === "7" || item.key === "10");
        if (!this.freezeIsNeedCheckFlag){
          this.freezeStatusList = this.freezeStatusList.filter(item => item.key === "0" || item.key === "5");
        }
      });
    },
    methods: {
      showChange(val) {
        this.ifShowMore = val;
      },
      clearVal(type){
        if(type === 'custName'){
          this.formItem.drwrCustNo = "";
          this.formItem.drwrName = "";
        }else{
          this.formItem.drwrAcctNo = "";
        }
      },
      billInfoWinClose() {
        this.billId = "";
        this.billNo = "";
        this.billRangeStart = "";
        this.billRangeEnd = "";
        this.showBillInfoWin = false;
      },
      showBillInfo(params) {
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
            this.currentSelectRow = [];
            this.$nextTick(() => {
              this.$refs.datagrid.dataChange(1);
            });
            this.handleSspdStatus = false;
            this.cancelHandleSspdStatus = false;
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
          this.formItem.sspdStatus = "";
          this.formItem.likeBillNo = "";
          this.formItem.acptProtocalNo = "";
          this.formItem.billType = "AC02";
          this.formItem.minBillMoney = "";
          this.formItem.maxBillMoney ="";
        });
      },

      //行选中
      handleRowClick() {
        // 未选中，则两个按钮都显示
        if (this.$refs.datagrid.selects.length === 0) {
          this.handleSspdStatus = false;
          this.cancelHandleSspdStatus = false;
          return;
        }
        // 选中大于1个，则两个按钮都不显示
        if (this.$refs.datagrid.selects.length > 1) {
          this.handleSspdStatus = true;
          this.cancelHandleSspdStatus = true;
          return;
        }
        let sspdInfoArray = this.$refs.datagrid.selects;
        let sspdInfo = sspdInfoArray[0];
        // 根据解付状态判断隐藏哪个按钮
        // 未冻结、冻结复核驳回，做止付登记
        if (sspdInfo.sspdStatus === "0" || sspdInfo.sspdStatus === "2" || sspdInfo.sspdStatus === "10") {
          this.handleSspdStatus = false;
          this.cancelHandleSspdStatus = true;
          return;
        }
        // 已冻结、解除冻结复核驳回，做解止付登记
        if (sspdInfo.sspdStatus === "5" || sspdInfo.sspdStatus === "7") {
          this.handleSspdStatus = true;
          this.cancelHandleSspdStatus = false;
          return;
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
        if (info.custAcctNo !== "") {
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
      //关闭冻结/解冻弹窗
      freezeRegFormItemWinClose() {
        this.freezeRegFormItemWin = false;
        this.freezeRegParams = {};
        this.handleSearch();
      },
      // 冻结
      stopPayment() {
        if(this.$refs.datagrid.selects.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        // 组装参数信息
        this.freezeRegParams.freezeRgstType = "ST01";
        this.freezeRegParams.billTypeList = this.billTypeList;
        this.freezeRegParams.freezeRgstTypeList = this.freezeRgstTypeList;
        this.freezeRegParams.billType = "AC02";
        this.freezeRegParams.dictMap = this.dictMap;
        if(this.$refs.datagrid.selects.length === 1) {
          let list = this.$refs.datagrid.selects;
          let info = list[0];
          // 未冻结、冻结复核驳回，做止付登记
          if (info.sspdStatus !== "0" && info.sspdStatus !== "2" && info.sspdStatus !== "10") {
            this.$msgTip.info(this, { info: "只有未冻结、已解除冻结、冻结复核驳回的记录才能进行冻结操作" });
            return;
          }
          this.freezeRegParams.freezeRegInfo = info;
        }
        this.freezeRegFormItemWin = true;
      },
      // 解除冻结
      cancelStopPayment() {
        if(this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if(this.$refs.datagrid.selects.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        let list = this.$refs.datagrid.selects;
        let info = list[0];
        // 已冻结、解除冻结复核驳回，做解止付登记
        if (info.sspdStatus !== "5" && info.sspdStatus !== "7") {
          this.$msgTip.info(this, { info: "只有已冻结与解除冻结复核驳回的记录才能进行解除冻结操作" });
          return;
        }
        // 组装参数信息
        this.freezeRegParams.billType = "AC02";
        this.freezeRegParams.acptId = info.acptId;
        this.freezeRegParams.freezeRgstType = "ST02";
        this.freezeRegParams.billTypeList = this.billTypeList;
        this.freezeRegParams.freezeRgstTypeList = this.freezeRgstTypeList;
        this.freezeRegParams.dictMap = this.dictMap;
        this.freezeRegParams.unFreezeRegInfo = info;
        this.freezeRegFormItemWin = true;
      },
      // 提交
      submit() {
        if(this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        let list = this.$refs.datagrid.selects;
        let ids = "";
        for (let i = 0; i < list.length; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        this.submitForm.ids = ids;
        let url = "/ce/acpt/elec/freeze/freezeRegApply/func_submitFreezeOrUnFreezeRegApply";
        this.sendPost(this.submitForm, url);
      },
      // 删除：只能删除未冻结和冻结复核驳回的数据
      remove() {
        if(this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        let list = this.$refs.datagrid.selects;
        let ids = "";
        for (let i = 0; i < list.length; i++) {
          if (list[i].sspdStatus !=='0' &&  list[i].sspdStatus !=='2'){
            this.$msgTip.info(this, { info: this.$t("只能删除未冻结和冻结复核驳回的数据") });
            return;
          }
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        this.submitForm.ids = ids;
        let url = "/ce/acpt/elec/freeze/freezeRegApply/func_deleteFreezeRegApply";
        this.$hMsgBox.confirm({
          title: this.$t('m.i.common.confirm'),
          content: '确定要删除吗?',
          onOk: () => {
            this.sendPost(this.submitForm, url);
          }
        })
      },
      //提交请求
      sendPost(params, url) {
        post(params, url).then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.handleSearch();
            }else {
              this.handleSearch();
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.handleSearch();
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      // 查询业务参数：电票冻结/解冻是否需要双岗复核，1-是（默认） 0-否
      getBusinessParamValue() {
        return getSingleParamValuesByKeys("ce.acpt.freeze_is_need_check_flag").then(res => {
          let freezeIsNeedCheckFlag = res['ce.acpt.freeze_is_need_check_flag'];
          if (freezeIsNeedCheckFlag && freezeIsNeedCheckFlag === "0") {
            this.freezeIsNeedCheckFlag = false;
          }
        });
      },
    }
  };
</script>

<style scoped>

</style>
