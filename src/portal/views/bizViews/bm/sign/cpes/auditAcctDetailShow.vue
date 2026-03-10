<!--客户明细 客户信息+账户信息--->
<template>
  <div>
    <h-msg-box v-model="tempAuditAcctDetailShow" :maximize="true" :mask-closable="false" @on-close="handleClose"
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
            <h-button type="primary" @click="pass()" >{{$t('m.i.common.agree')}}</h-button>
            <h-button type="primary" @click="refuse()" >{{$t('m.i.common.back')}}</h-button>
            <h-button type="primary" @click="compare()">{{$t('m.i.bm.rgstInfoCompare')}}</h-button>
          </div>
        </h-datagrid>
      </div>
      <div slot="footer">
      </div>
    </h-msg-box>


    <!--附件上传-->
    <show-file-win :showFileWin="showFileWin" :fileBatchParams="fileBatchParams" @showFileWinClose="showFileWinClose" :filePathUrl="filePathUrl" :dictMap="dictMap" ></show-file-win>
    <!--客户信息比对-->
    <rgst-info-compare-win :rgstInfoCompareWin="rgstInfoCompareWin" @rgstInfoCompareWinClose="rgstInfoCompareWinClose"
                           :compareParams="compareParams" :dictMap="dictMap" ref="rgstInfoCompareWin"></rgst-info-compare-win>

  </div>
</template>

<script>
  import { post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "auditAcctDetailShow",
    components: {
      acctDetailItem: () => import(/* webpackChunkName: "bm/sign/cpes/acctDetailItem" */"@/views/bizViews/bm/sign/cpes/acctDetailItem"),
      showFileWin: () => import(/* webpackChunkName: "pc/img/showFileWin" */"@/views/bizViews/pc/img/showFileWin"),
      rgstInfoCompareWin: () => import(/* webpackChunkName: "bm/sign/cpes/rgstInfoCompareWin" */"@/views/bizViews/bm/sign/cpes/rgstInfoCompareWin"),
    },
    data() {
      return {
        custNo: "",
        id:"",
        custRgstStatus:"1",
        showFileWin:false,
        rgstInfoCompareWin:false,
        operType:"",
        compareForm:{},
        filePathUrl: "/bm/cpes/custsign/custCorpSign/",
        attachBusiType:"custSignFile",
        fileBatchParams:{},
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
          isArc: "",
          corpNature: "",
          isTechnologyCorp: "",
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
          isCanEdit:false,
        },
        dataGridFormItem: {
          custRgstStatus:"",
          custNo:"",
          auditId:"",
        },
        compareParams:{},
        columns: [
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
      auditAcctDetailShowWin: {
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
      auditAcctDetailShowWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.custNo = this.batchParams.custNo;
            this.id = this.batchParams.id;
            this.dataGridFormItem.custNo = this.batchParams.custNo;
            this.dataGridFormItem.auditId = this.batchParams.id;
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
      tempAuditAcctDetailShow: {
        get() {
          return this.auditAcctDetailShowWin;
        },
        set() {
        }
      }
    },
    methods: {
      //根据批次Id查询批次信息
      queryObjById() {
        let params = { id: this.id };
        let url = "/bm/cpes/custsignaudit/func_getCustInfo";
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.acctDetailForm.id = this.id;
              this.acctDetailForm.custName = obj.custName;
              this.acctDetailForm.socCode = obj.socCode;
              this.acctDetailForm.lccCode = obj.lccCode;
              this.acctDetailForm.leiCode = obj.leiCode;
              this.acctDetailForm.custEmail = obj.custEmail;
              this.acctDetailForm.custAddr = obj.custAddr;
              this.acctDetailForm.mainBusiAddr = obj.mainBusiAddr;
              this.acctDetailForm.corpScale = obj.corpScale;
              this.acctDetailForm.industryCategory = obj.industryCategory;
              this.acctDetailForm.isArc = obj.isArc;
              this.acctDetailForm.isGreenCorp = obj.isGreenCorp;
              this.acctDetailForm.corpNature = obj.corpNature;
              this.acctDetailForm.isTechnologyCorp = obj.isTechnologyCorp;
              this.acctDetailForm.creditRating = obj.creditRating;
              this.acctDetailForm.creditRatingMain = obj.creditRatingMain;
              this.acctDetailForm.creditRatgDueDt = obj.creditRatgDueDt=== null ? "" : obj.creditRatgDueDt.toString();
              this.acctDetailForm.corpLegalName = obj.corpLegalName;
              this.acctDetailForm.corpLegalCertType = obj.corpLegalCertType;
              this.acctDetailForm.corpLegalCertNo = obj.corpLegalCertNo;
              this.acctDetailForm.custRgstStatus = obj.operType === "CC01" ? "1":"";
              this.acctDetailForm.isChangeCustInfo = obj.isChangeCustInfo;
              this.acctDetailForm.isCanChangeCustPartInfo = obj.isCanChangeCustPartInfo;
              this.acctDetailForm.custNo = obj.custNo;
              if (obj.isCanChangeCustPartInfo !== '0' && obj.channelSource !== "1"){
                this.batchParams.isCanChangeCustPartInfo = true;
              }else{
                this.batchParams.isCanChangeCustPartInfo = false;
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      compare(){
        this.compareParams.custNo = this.custNo;
        this.rgstInfoCompareWin = true;
      },

      rgstInfoCompareWinClose(){
        this.compareParams = {},
        this.rgstInfoCompareWin = false;
      },

      pass(){
        this.$refs["acctDetailForm"].validate(valid => {
          if (valid) {
            this.$hMsgBox.confirm({
              title: this.$t("m.i.common.confirm"),
              content: this.$t("请确认是否要通过") + "?",
              onOk: () => {
                let url = "/bm/cpes/custsignaudit/func_passAudit";
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

      refuse(){
        this.$refs["acctDetailForm"].validate(valid => {
          if (valid) {
            this.$hMsgBox.confirm({
              title: this.$t("m.i.common.confirm"),
              content: this.$t("请确认是否要驳回") + "?",
              onOk: () => {
                let url = "/bm/cpes/custsignaudit/func_refuseAudit";
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

      //关闭弹窗
      handleClose() {
        let stauts = this.custRgstStatus;
        this.$refs.acctDetailForm.resetFields();
        this.custNo="";
        this.custRgstStatus="";
        this.custId="";
        this.$emit("auditAcctDetailShowWinClose", stauts);
      },


      register(){
        this.$refs["acctDetailForm"].validate(valid => {
          if (valid) {
            this.$hMsgBox.confirm({
              title: this.$t("m.i.common.confirm"),
              content: this.$t("请确认是否要进行登记") + "?",
              onOk: () => {
                let custNo = this.custNo;
                let custSignId = this.custId;
                let url = "/bm/cpes/custsign/custCorpSign/func_registerCustSign";
                post({ custRgstStatus: this.custRgstStatus,custNo:this.custNo ,isChangeCustInfo : this.acctDetailForm.isChangeCustInfo}, url).then(res => {
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
        this.fileBatchParams.isShowOperBotton = "0";
        this.showFileWin = true;
      },

    }
  };
</script>

<style scoped>

</style>
