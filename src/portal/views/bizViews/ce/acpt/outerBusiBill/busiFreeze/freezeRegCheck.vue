<!--司法冻结-冻结复核-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--出票人全称-->
                <common-input v-model="formItem.drwrName" :label="$t('m.i.billInfo.drwrName')" prop="drwrName"  :readonly="true" :showIcon="true"
                              @on-click="queryCustName()" :clearable="true" :clearVal="clearVal" :clearValTag="this.custName"></common-input>
                <!--出票人账号-->
                <common-input v-model="formItem.drwrAcctNo" :label="$t('m.i.billInfo.drwrAcctNo')" prop="drwrAcctNo" :readonly="true" :showIcon="true"
                              @on-click="queryCustAcctNo()" :clearable="true" :clearVal="clearVal" :clearValTag="this.custAcctNo"></common-input>
                <!--登记类型-->
                <common-select v-model="formItem.rgstType" :label="$t('m.i.ce.freezeRgstType')" prop="rgstType" :dictList="freezeRgstTypeList"></common-select>
                <!--冻结（解除）日期-->
                <common-date-picker v-model="sspdAndRelieveDate" :label="$t('m.i.ce.freezeOrUnFreezeDt')" type="daterange" :autoPlacement="true"
                                    @on-change="handleSspdAndRelieveDateChange"></common-date-picker>
                <!--票据号码-->
                <common-input v-model="formItem.likeBillNo" :label="$t('m.i.billInfo.billPackageNo')" prop="likeBillNo" :maxlength="30"></common-input>
                <!--票据(包)金额(元)-->
                <common-type-field-range v-model="formItem" :label="$t('m.i.billInfo.billPackageMoney')" :integerNum="16" :suffixNum="2":validRules="billMoneyRule"
                                         :rangeProps="['minBillMoney','maxBillMoney']" :bigTips="false" class="h-form-long-label"></common-type-field-range>
                <query-btn :advanceShow="true" @showChange="showChange" :formSearch="handleSearch" :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                      :row-select="true"
                      :has-select="false"
                      url="/ce/acpt/outerBusiBill/busiFreeze/freezeRegCheck/func_queryFreezeRegCheckByPage"
                      :bindForm="formItem"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="recheckPass" >{{$t('m.i.common.pass')}}</h-button>
              <h-button type="primary" @click="recheckBack" >{{$t('m.i.ce.returnBack')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 退回原因录入弹窗 -->
        <h-msg-box v-model="recheckBackWin" width="400" @on-close="recheckBackWinClose" class="h-form-search-layer" :maximize="true" :mask-closable="false">
          <p slot="header">
            <span>退回原因</span>
          </p>
          <div>
            <h-form :model="recheckForm" :label-width="115" ref="recheckForm" cols="1" class="h-form-search">
              <common-input v-model="recheckForm.checkRefuseReason" :label="$t('m.i.common.returnReason')" prop="checkRefuseReason" :maxlength="200"
                            :rows="3" type="textarea" :canResize="false" class="h-form-height-auto"></common-input>
            </h-form>
          </div>
          <div slot="footer">
            <div slot="footer">
              <h-button type="ghost" @click="recheckBackWinClose">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
              <h-button type="primary" v-else @click="recheckBackSubmit()">{{$t('m.i.common.commit')}}</h-button>
            </div>
          </div>
        </h-msg-box>
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
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { post, getDictListByGroups, getDictValueFromMap, formatNumber, formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "freezeRegCheck",
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
        },
        billMoneyRule:[{
          test: /^(?:[1-9]\d{0,15}|0)(?:\.\d{1,2})?$/,
          trigger: "blur",
          message: "票据(包)金额(元)必须是大于等于0的数字，最多16位整数且小数位不超过两位"
        }],
        custName: "custName",
        custAcctNo: "custAcctNo",
        sspdAndRelieveDate: [],
        dictMap: new Map(),
        sspdStatusList: [],
        sspdTypeList: [],
        relieveTypeList: [],
        freezeRgstTypeList: [],
        billTypeList: [],
        currentSelectList: [],
        showCustAcctNoWin: false,
        showCustMessageWin: false,
        //是否显示更多查询项
        ifShowMore: false,
        // 查看附件
        showFileWin: false,
        filePathUrl: "/ce/acpt/outerBusiBill/busiFreeze/freezeRegCheck/",
        fileBatchParams: {},
        // 退回原因
        recheckBackWin: false,
        recheckForm: {
          ids:"",
          checkRefuseReason: ""
        },
        submitFlag: false,
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
          },
          {
            title: this.$t("m.i.common.dealPrcMsg"),
            key: 'dealPrcMsg',
            hiddenCol: false,
          }
        ],
      }
    },
    mounted() {
      getDictListByGroups("DraftTypeCode,SspdStatus,SspdType,AnlgSspdType,AcptStatus,FreezeRgstType,AttTypeCode,FileDetailStatus,PreRelationFlag").then(res => {
        this.sspdStatusList = res.get("SspdStatus");
        this.sspdTypeList = res.get("SspdType");
        this.relieveTypeList = res.get("AnlgSspdType");
        this.freezeRgstTypeList = res.get("FreezeRgstType");
        this.billTypeList = res.get("DraftTypeCode");
        this.dictMap = res.get("map");
      });
    },
    methods: {
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
        });
      },
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

      //复核通过
      recheckPass() {
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
        this.recheckForm.ids = ids;
        let url = "/ce/acpt/outerBusiBill/busiFreeze/freezeRegCheck/func_checkPassFreezeRegApply";
        this.sendPost(this.recheckForm, url);
      },
      //复核退回
      recheckBack() {
        if(this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if(this.$refs.datagrid.selects.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
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
        this.recheckBackWin = true;
        this.recheckForm.ids = ids;
      },
      //退回确认
      recheckBackSubmit() {
        let url = "/ce/acpt/outerBusiBill/busiFreeze/freezeRegCheck/func_checkRejectFreezeRegApply";
        this.sendPost(this.recheckForm, url);
      },
      //提交请求
      sendPost(params, url) {
        post(params, url).then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.recheckBackWinClose();
              this.handleSearch();
            }else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //退回原因录入界面关闭
      recheckBackWinClose() {
        this.recheckForm.ids = "";
        this.recheckForm.checkRefuseReason = "";
        this.recheckBackWin = false;
      },
      // 打开附件弹窗
      showAttach(params) {
        this.fileBatchParams.operType = "show";
        this.fileBatchParams.busiId = params.row.id;
        this.fileBatchParams.filePathUrl = this.filePathUrl;
        if (params.row.rgstType === 'ST02'){
          this.fileBatchParams.attachBusiType = "unFreezeRegFile";
          this.fileBatchParams.fileType = "FT10";
          this.fileBatchParams.attTypeCodeList = [{ key: "FT10", value: "冻结解除" }];
        }else {
          this.fileBatchParams.attachBusiType = "freezeRegFile";
          this.fileBatchParams.fileType = "FT09";
          this.fileBatchParams.attTypeCodeList = [{ key: "FT09", value: "冻结" }];
        }
        this.fileBatchParams.fileDetailStatusList = [{ key: "FD00", value: "初始" },{ key: "FD01", value: "上传中" },
          { key: "FD02", value: "已上传" },{ key: "FD06", value: "登记失败" }];
        this.showFileWin = true;
      },
      // 关闭附件弹窗
      showFileWinClose(){
        this.fileBatchParams = {};
        this.showFileWin = false;
      }
    }
  };
</script>

<style scoped>

</style>
