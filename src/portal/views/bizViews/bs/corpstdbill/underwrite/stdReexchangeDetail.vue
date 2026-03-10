<!--承销管理-退汇复核-退汇复核详情-->
<template>
  <div>
    <h-msg-box v-model="tempStdReexchangeDetailWin" :maximize="true" :mask-closable="false" @on-close="stdReexchangeDetailWinClose"
               width="1000" class="h-form-search-layer" top="10" >
      <p slot="header">
        <span >退汇复核详情</span>
      </p>
      <div>
        <h-form :model="viewDetailForm" :label-width="115" ref="viewDetailForm" cols="3" class="h-form-search">
          <std-creation-reexchange-view-detail :viewDetailForm="viewDetailForm" :batchParams="batchParams"></std-creation-reexchange-view-detail>
        </h-form>
      </div>
      <!-- 数据展示表格 -->
      <h-datagrid :columns="reexchangeInfoColumns"
                  url="/bs/corpstdbill/underwrite/stdCreationReexchangeCheck/func_queryStdReexchangInfoByPage"
                  highlightRow
                  :row-select="true"
                  :has-select="false"
                  :bindForm="reexchangeFormItem"
                  :auto-load="false"
                  ref="datagrid">
        <div slot="toolbar" class="pull-left">
          <h-button type="primary" @click="account" >{{$t('m.i.common.pass')}}</h-button>
          <h-button type="primary" @click="reject" >{{$t('m.i.common.back')}}</h-button>
        </div>
      </h-datagrid>
      <div slot="footer">
      </div>
    </h-msg-box>
    <!-- 分录弹框 -->
    <acct-record :param="this.acctRecordParam" :url="this.acctRecordUrl" :submitFlag="this.acctSubmitFlag" :showPrintButton="showPrintButton" :show-acct-record-win="this.showAcctRecordWin"
                 @acctSubmitSure="acctSubmitSure" @showAcctRecordWinClose="showAcctRecordWinClose" ref="showAcctRecord"></acct-record>
  </div>
</template>

<script>
  import { post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "stdReexchangeDetail",
    components: {
      StdCreationReexchangeViewDetail:() =>import(/* webpackChunkName: "bs/corpstdbill/underwrite/stdCreationReexchangeViewDetail" */`@/views/bizViews/bs/corpstdbill/underwrite/stdCreationReexchangeViewDetail`),
    },
    data() {
      return {
        acctRecordParam: {},
        acctRecordUrl:"/bs/corpstdbill/underwrite/stdCreationReexchangeCheck/func_getStdReexchangeAcctRecord",
        acctSubmitFlag:false,
        showAcctRecordWin:false,
        showPrintButton : false,
        batchId: "",
        reexchangeFormItem:{
          creationId:""
        },
        viewDetailForm: {
          id:"",
          batchNo:"",
          baseAssetType:"",
          stdProductName:"",
          stdProductShortName:"",
          stdProductNo:"",
          creationAmt:"",
          creationTerm:"",
          financeRatePct:"",
          totalCollectAmt:""
        },
        reexchangeInfoColumns: [
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bs.custAcctNo'),
            key: 'custAcctNo',
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.bs.custName'),
            key: 'custName',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bs.custBankNo'),
            key: 'custBankNo',
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.bs.custBankName'),
            key: 'custBankName',
            hiddenCol: false
          },
          {
            title: this.$t("m.i.bs.reexchangeAmt"),
            key: "reexchangeAmt",
            hiddenCol: false,
            sortable: true,
            align: "right",
            render: (h, params) => {
              return h("p", formatNumber(params.row.reexchangeAmt, 2, ","));
            }
          },
          {
            title: this.$t('m.i.bs.acctStatus'),
            key: "acctStatus",
            hiddenCol: false,
            sortable: false,
            render: (h, params) => {
              let acctStatus = this.formatAcctStatus(params.row.acctStatus);
              return h("span", {
                domProps: {
                  title: acctStatus
                }
              }, acctStatus);
            }
          },
          {
            title: this.$t('m.i.bs.errorMsg'),
            key: 'errorMsg',
            hiddenCol: false
          },
        ],
      };
    },
    props: {
      stdReexchangeDetailWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      batchParams: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    computed: {
      tempStdReexchangeDetailWin: {
        get() {
          return this.stdReexchangeDetailWin;
        },
        set() {
        }
      }
    },
    watch: {
      stdReexchangeDetailWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.batchId = this.batchParams.batchId;
            this.reexchangeFormItem.creationId = this.batchId;
            this.handleSearch(1);
            this.queryObjById();
          });
        }
      },
    },
    methods: {
      //表单查询
      handleSearch(pageNo) {
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //根据批次Id查询批次信息
      queryObjById() {
        let params = { id: this.batchId };
        let url = "/bs/corpstdbill/underwrite/stdUnderwriteResultReg/func_findStdCreationById";
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.viewDetailForm.batchNo = obj.batchNo;
              this.viewDetailForm.baseAssetType = obj.baseAssetType;
              this.viewDetailForm.stdProductName = obj.stdProductName;
              this.viewDetailForm.stdProductShortName = obj.stdProductShortName;
              this.viewDetailForm.stdProductNo = obj.stdProductNo;
              this.viewDetailForm.creationAmt = obj.creationAmt === null ? "" : formatNumber(obj.creationAmt, 2, ",");
              this.viewDetailForm.creationTerm = obj.creationTerm;
              this.viewDetailForm.financeRatePct = obj.financeRatePct;
              this.viewDetailForm.totalCollectAmt = obj.totalCollectAmt === null ? "" : formatNumber(obj.totalCollectAmt, 2, ",");
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //关闭弹窗
      stdReexchangeDetailWinClose() {
        this.$refs.viewDetailForm.resetFields();
        this.batchId="";
        this.reexchangeFormItem.creationId = "";
        this.resetViewDetailForm();
        this.$emit("stdReexchangeDetailWinClose", "");
      },
      //重置详情表单
      resetViewDetailForm() {
        this.viewDetailForm.batchNo = "";
        this.viewDetailForm.baseAssetType = "";
        this.viewDetailForm.stdProductName = "";
        this.viewDetailForm.stdProductShortName = "";
        this.viewDetailForm.stdProductNo = "";
        this.viewDetailForm.creationAmt = "";
        this.viewDetailForm.creationTerm = "";
        this.viewDetailForm.financeRatePct = "";
        this.viewDetailForm.totalCollectAmt = "";
      },
      //提交请求
      sendPost(params, url) {
        post(params, url).then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.stdReexchangeDetailWinClose();
            }else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //记账
      account() {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定记账吗?",
          onOk: () => {
            this.getAcctRecordInfo();
          }
        });
      },
      //获取分录信息
      getAcctRecordInfo() {
        let creationId =  this.batchId;
        this.acctRecordParam = {creationId: creationId}
        this.showAcctRecordWin = true;
      },
      //分录确认记账
      acctSubmitSure(info) {
        let param = {creationId: this.batchId};
        let url = "/bs/corpstdbill/underwrite/stdCreationReexchangeCheck/func_stdReexchangeAccount";
        this.acctSubmitFlag = true;
        post(param, url).then(res => {
          this.acctSubmitFlag = false;
          if(res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.showPrintButton = true;
              if(!info.isHasPrint) {
                this.showAcctRecordWinClose();
                this.stdReexchangeDetailWinClose();
              }
            } else {
              this.showAcctRecordWinClose();
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      //关闭分录弹窗
      showAcctRecordWinClose() {
        this.showAcctRecordWin = false;
        this.showPrintButton = false;
        this.acctRecordParam = {};
        this.handleSearch();
      },
      //复核驳回
      reject() {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定驳回吗？",
          onOk: () => {
            let creationId = this.batchId;
            let params = {creationId: creationId};
            let url = "/bs/corpstdbill/underwrite/stdCreationReexchangeCheck/func_rejectStdCreationReexchangeDto";
            this.sendPost(params, url);
          }
        });
      },

      //格式化标票退汇记账状态
      formatAcctStatus(acctStatus){
        let acctStatusValue = "";
        if("0" == acctStatus){
          acctStatusValue = "未记账";
        }else if("1" == acctStatus){
          acctStatusValue = "记账成功";
        }else if("2" == acctStatus){
          acctStatusValue = "记账失败";
        }
        return acctStatusValue;
      }
    }
  };
</script>

<style scoped>

</style>
