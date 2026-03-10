<!--客户明细 客户信息+账户信息--->
<template>
  <div>
    <h-msg-box v-model="tempAcctDetailShow" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1000" class="h-form-search-layer" >
      <p slot="header">
        <span>企业明细信息</span>
      </p>
      <div>
        <h-form :model="acctDetailForm" :label-width="115" ref="acctDetailForm" cols="3" class="h-form-search">
          <acct-detail-item :custForm="acctDetailForm" :batchParams="batchParams"></acct-detail-item>
        </h-form>
        <!--数据展示表格-->
        <h-datagrid
          :columns="columns"
          highlight-row
          :auto-load="false"
          url="/bm/cpes/custsign/custCorpSign/func_queryCustAcctInfoByPage"
          :bindForm="dataGridFormItem"
          row-select
          ref="datagrid">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" @click="addAcctNo()" :disabled="!isShowBotton1" >{{$t('m.i.bm.addAcctNo')}}</h-button>
            <h-button type="primary" @click="deleteAcctNo()" :disabled="!isShowBotton1" >{{$t('m.i.bm.deleteAcctNo')}}</h-button>
            <h-button type="primary" @click="register()" :disabled="!isShowBotton1" >{{$t('m.i.bm.register')}}</h-button>
            <h-button type="primary" @click="acctNoModify()" :disabled="!isShowBotton2">{{$t('m.i.bm.acctNoModify')}}</h-button>
            <h-button type="primary" @click="acctNoCancel()" :disabled="!isShowBotton2">{{$t('m.i.bm.acctNoCancel')}}</h-button>
            <h-button type="primary" @click="cancelPreDeal()" :disabled="!isShowBotton2">{{$t('m.i.bm.cancelPreDeal')}}</h-button>
            <h-button type="primary" @click="compare()" :disabled="!isShowBotton2">{{$t('m.i.bm.rgstInfoCompare')}}</h-button>
          </div>
        </h-datagrid>
      </div>
      <div slot="footer">
      </div>
    </h-msg-box>

    <!-- 账户挑选 -->
    <pick-acct-no :pickAcctNoWin="pickAcctNoWin" :custCorpParams="custCorpParams" :dictMap="dictMap"
                  @pickAcctNoWinClose="pickAcctNoWinClose" @pickAcctNoWinSubmit="pickAcctNoWinSubmit" ref="pickAcctNo" ></pick-acct-no>

    <!--附件上传-->
    <show-file-win :showFileWin="showFileWin" :fileBatchParams="fileBatchParams" @showFileWinClose="showFileWinClose" :dictMap="dictMap" :filePathUrl="filePathUrl"></show-file-win>

    <!--客户信息比对-->
    <rgst-info-compare-win :rgstInfoCompareWin="rgstInfoCompareWin" @rgstInfoCompareWinClose="rgstInfoCompareWinClose"
                           :compareParams="compareParams" :dictMap="dictMap" ref="rgstInfoCompareWin"></rgst-info-compare-win>
  </div>
</template>

<script>
  import { post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "acctDetailShow",
    components: {
      acctDetailItem: () => import(/* webpackChunkName: "bm/sign/cpes/acctDetailItem" */"@/views/bizViews/bm/sign/cpes/acctDetailItem"),
      pickAcctNo: () => import(/* webpackChunkName: "bm/sign/cpes/pickAcctNo" */"@/views/bizViews/bm/sign/cpes/pickAcctNo"),
      showFileWin: () => import(/* webpackChunkName: "pc/img/showFileWin" */"@/views/bizViews/pc/img/showFileWin"),
      rgstInfoCompareWin: () => import(/* webpackChunkName: "bm/sign/cpes/rgstInfoCompareWin" */"@/views/bizViews/bm/sign/cpes/rgstInfoCompareWin"),
    },
    data() {
      return {
        custNo: "",
        custRgstStatus:"",
        custId:"",
        custSignIn:"",
        pickAcctNoWin:false,
        rgstInfoCompareWin:false,
        showFileWin:false,
        isShowBotton1:true,
        isShowBotton2:true,
        operType:"",
        attachBusiType:"custSignFile",
        fileBatchParams:{},
        compareParams:{},
        acctDetailForm: {
          id:"",
          custName:"",
          socCode:"",
          lccCode:"",
          leiCode:"",
          custEmail:"",
          custAddr:"",
          mainBusiAddr:"",
          corpScale: "",
          isGreenCorp: "",
          corpNature: "",
          isTechnologyCorp: "",
          isArc:"",
          creditRating:"",
          creditRatingMain:"",
          creditRatgDueDt:"",
          corpLegalName:"",
          corpLegalCertType:"",
          corpLegalCertNo:"",
          isChangeCustInfo:"",
          custRgstStatus:"1",
          isCanChangeCustPartInfo:"",
          custNo:"",
          isCanEdit:true,
        },
        dataGridFormItem: {
          custRgstStatus:"",
          custNo:"",
        },
        custCorpParams:{},
        filePathUrl: "/bm/cpes/custsign/custCorpSign/",
        columns: [
          {
            type: "selection",
            width: 50,
            hiddenCol: false,
            align: "center"
          },
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.operType'),
            key: 'preRelationFlag',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "PreRelationFlag", params.row.preRelationFlag);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.acctName"),
            key: "custAcctName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.acctNo"),
            key: "custAcctNo",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.openBankNo"),
            key: "openBankNo",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.common.cpesAcctType'),
            key: 'cpesAcctType',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "CpesAcctType", params.row.cpesAcctType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.acctOperDt'),
            key: 'openDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.openDt ? this.$moment(params.row.openDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.common.acctEffectiveDt'),
            key: 'acctEffectiveDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.acctEffectiveDt ? this.$moment(params.row.acctEffectiveDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t("m.i.common.agencyName"),
            key: "agencyName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.agencyPhone"),
            key: "agencyPhone",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.common.agencyCertType'),
            key: 'agencyCertType',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "CertType", params.row.agencyCertType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.agencyCertNo"),
            key: "agencyCertNo",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.be.rgstStatus'),
            key: 'cpesSignStatus',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "CorpSignRgstStatus", params.row.cpesSignStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
        ],
      };
    },
    props: {
      acctDetailShowWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      batchParams: {
        type: Object,
        default: {}
      },
      dictMap: { //CorpScale,Industry,partnerType,Yon
        type: Map
      },
    },

    watch: {
      acctDetailShowWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.custNo = this.batchParams.custNo;
            this.custId = this.batchParams.custId?this.batchParams.custId:"";
            this.custSignId = this.batchParams.custSignId?this.batchParams.custSignId:"";
            this.custRgstStatus = this.batchParams.custRgstStatus;
            if (this.custRgstStatus === "2"){
              this.isShowBotton1 = false;
              this.isShowBotton2 = false;
            }else if(this.custRgstStatus === "0"){
              this.isShowBotton2 = false;
            }else{
              this.isShowBotton1 = true;
              this.isShowBotton2 = true;
            }
            this.dataGridFormItem.custNo = this.batchParams.custNo;
            this.dataGridFormItem.custRgstStatus = this.batchParams.custRgstStatus;
            this.queryObjById();
            this.$refs.datagrid.dataChange(1);
          });
        }
      },
      batchId(val) {
        this.batchId = val;
      }
    },
    computed: {
      tempAcctDetailShow: {
        get() {
          return this.acctDetailShowWin;
        },
        set() {
        }
      }
    },
    methods: {
      //根据批次Id查询批次信息
      queryObjById() {
        let params = { custId: this.custId,custRgstStatus:this.custRgstStatus };
        let url = "/bm/cpes/custsign/custCorpSign/func_getCustInfo";
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.acctDetailForm.id = obj.id;
              this.acctDetailForm.custName = obj.custName;
              this.acctDetailForm.socCode = obj.socCode;
              this.acctDetailForm.lccCode = obj.lccCode;
              this.acctDetailForm.leiCode = obj.leiCode;
              this.acctDetailForm.custEmail = obj.custEmail;
              this.acctDetailForm.custAddr = obj.custAddr;
              this.acctDetailForm.mainBusiAddr = obj.mainBusiAddr;
              this.acctDetailForm.corpScale = obj.corpScale;
              this.acctDetailForm.industryCategory = obj.industryCategory;
              this.acctDetailForm.isGreenCorp = obj.isGreenCorp;
              this.acctDetailForm.isArc = obj.isArc;
              this.acctDetailForm.corpNature = obj.corpNature;
              this.acctDetailForm.isTechnologyCorp = obj.isTechnologyCorp;
              this.acctDetailForm.creditRating = obj.creditRating;
              this.acctDetailForm.creditRatingMain = obj.creditRatingMain;
              this.acctDetailForm.creditRatgDueDt = obj.creditRatgDueDt=== null ? "" : obj.creditRatgDueDt.toString();
              this.acctDetailForm.corpLegalName = obj.corpLegalName;
              this.acctDetailForm.corpLegalCertType = obj.corpLegalCertType;
              this.acctDetailForm.corpLegalCertNo = obj.corpLegalCertNo;
              this.acctDetailForm.custRgstStatus = obj.custRgstStatus;
              this.acctDetailForm.isCanChangeCustPartInfo = obj.isCanChangeCustPartInfo;
              this.acctDetailForm.custNo = obj.custNo;
              this.batchParams.isCanChangeCustPartInfo = obj.isCanChangeCustPartInfo === '0'? false : true;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      // 登记
      addAcctNo(){
        this.custCorpParams.custNo = this.custNo;
        this.custCorpParams.custId = this.custId;
        this.pickAcctNoWin = true;
      },

      compare(){
        this.compareParams.custNo = this.custNo;
        this.rgstInfoCompareWin = true;
      },

      rgstInfoCompareWinClose(){
        this.compareParams = {},
        this.rgstInfoCompareWin = false;
      },

      deleteAcctNo(){
        if (this.$refs.datagrid.selectIds.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        let custAcctSignIds = this.$refs.datagrid.selectIds;
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("请确认是否删除该账户") + "！",
          onOk: () => {
            let url = "/bm/cpes/custsign/custCorpSign/func_delCustAcctInfo";
            post({ custAcctSignIds: custAcctSignIds,custNo:this.custNo}, url).then(res => {
              if (res) {
                let retCode = res.data.retCode
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(1);
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
              }
            });
          }
        });
      },

      // 修改登记
      acctNoModify(){
        if (this.$refs.datagrid.selectIds.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        let custAcctSignIds = this.$refs.datagrid.selectIds;
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("请确认是否向票交所修改该账户") + "！",
          onOk: () => {
            let url = "/bm/cpes/custsign/custCorpSign/func_custAcctModifySign";
            post({ custAcctSignIds: custAcctSignIds}, url).then(res => {
              if (res) {
                let retCode = res.data.retCode
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(1);
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
              }
            });
          }
        });
      },

      // 注销登记
      acctNoCancel(){
        if (this.$refs.datagrid.selectIds.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        let custAcctSignIds = this.$refs.datagrid.selectIds;
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("请确认是否向票交所注销该账户") + "！",
          onOk: () => {
            let url = "/bm/cpes/custsign/custCorpSign/func_custAcctCancelSign";
            post({ custAcctSignIds: custAcctSignIds}, url).then(res => {
              if (res) {
                let retCode = res.data.retCode
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(1);
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
              }
            });
          }
        });
      },

      cancelPreDeal(){
        if (this.$refs.datagrid.selectIds.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        let custAcctSignIds = this.$refs.datagrid.selectIds;
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("确认要撤回预处理吗") + "?",
          onOk: () => {
            let url = "/bm/cpes/custsign/custCorpSign/func_cancelPreAcctNoSign";
            post({ custAcctSignIds: custAcctSignIds}, url).then(res => {
              if (res) {
                let retCode = res.data.retCode
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(1);
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
              }
            });
          }
        });
      },

      //关闭弹窗
      handleClose() {
        let stauts = this.custRgstStatus;
        this.$refs.acctDetailForm.resetFields();
        this.custNo="";
        this.custRgstStatus="";
        this.custId="";
        this.$emit("acctDetailShowWinClose", stauts);
      },

      pickAcctNoWinClose(){
        this.custCorpParams = {};
        this.pickAcctNoWin = false;
      },

      pickAcctNoWinSubmit(list){
        let custAcctIds = list;
        post({custId: this.custId, custAcctIds: custAcctIds ,custNo:this.custNo,custRgstStatus:this.custRgstStatus}, "/bm/cpes/custsign/custCorpSign/func_pickCustAcctInfo").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this, { info: "操作成功" });
              this.pickAcctNoWinClose();
              this.$refs.datagrid.dataChange(1);
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      register(){
        this.$refs["acctDetailForm"].validate(valid => {
          if (valid) {
            this.$hMsgBox.confirm({
              title: this.$t("m.i.common.confirm"),
              content: this.$t("请确认是否要进行登记") + "?",
              onOk: () => {
                let url = "/bm/cpes/custsign/custCorpSign/func_registerCustSign";
                post(this.acctDetailForm, url).then(res => {
                  if (res) {
                    let retCode = res.data.retCode
                    if (retCode == "000000") {
                      this.$msgTip.success(this);
                      this.handleClose();
                    } else {
                      this.$msgTip.error(this, { info: res.data.retMsg });
                    }
                  } else {
                    this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
                  }
                });
              }
            });
          }
        });
      },

      showFileWinClose(){
        this.fileBatchParams = {};
        this.showFileWin = false;
      },

      fileControl(){
        this.fileBatchParams.operType = "upload";
        this.fileBatchParams.busiNo = this.custNo;
        this.fileBatchParams.attachBusiType = this.attachBusiType;
        this.fileBatchParams.attTypeCodeList = this.batchParams.attTypeCodeList;
        this.fileBatchParams.fileDetailStatusList = this.batchParams.fileDetailStatusList;
        this.fileBatchParams.filePathUrl = this.filePathUrl;
        this.showFileWin = true;
      },

    }
  };
</script>

<style scoped>

</style>
