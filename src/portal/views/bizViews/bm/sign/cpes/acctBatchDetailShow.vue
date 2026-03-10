<!--客户明细 客户信息+账户信息--->
<template>
  <div>
    <h-msg-box v-model="tempAcctBatchDetailShow" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1000" class="h-form-search-layer" >
      <p slot="header">
        <span>企业明细信息</span>
      </p>
      <div>
        <h-form :model="acctDetailForm" :label-width="115"  cols="3" class="h-form-search">
          <!--企业全称-->
          <common-input v-model="acctDetailForm.custName" :label="$t('m.i.common.corpName')" prop="custName" :readonly="true"></common-input>
          <!--统一社会信用代码-->
          <common-input v-model="acctDetailForm.socCode" :label="$t('m.i.common.socCode')" prop="socCode" :readonly="true"></common-input>
          <!--中征码-->
          <common-input v-model="acctDetailForm.lccCode" :label="$t('m.i.bm.lccCode')" prop="lccCode" :readonly="true"></common-input>
          <!--LEI码-->
          <common-input v-model="acctDetailForm.leiCode" :label="$t('m.i.bm.leiCode')" prop="leiCode" :readonly="true"></common-input>
          <!--联系邮箱-->
          <common-input v-model="acctDetailForm.custEmail" :label="$t('m.i.bm.custEmail')" prop="custEmail" :readonly="true"></common-input>
          <!--注册地址-->
          <common-input v-model="acctDetailForm.custAddr" :label="$t('m.i.bm.custAddr')" prop="custAddr" :readonly="true"></common-input>
          <!--主要经营地址-->
          <common-input v-model="acctDetailForm.mainBusiAddr" :label="$t('m.i.bm.mainBusiAddr')" prop="mainBusiAddr" :readonly="true"></common-input>
          <!-- 客户规模 -->
          <common-select v-model="acctDetailForm.corpScale" :label="$t('m.i.bm.corpScale')"
                         prop="corpScale" :dictList="batchParams.corpScaleList"  :readonly="true"></common-select>
          <!-- 是否绿色 -->
          <common-select v-model="acctDetailForm.isGreenCorp" :label="$t('m.i.common.isGreenCorpFdisc')"
                         prop="isGreenCorp" :dictList="batchParams.yonList"  :readonly="true"></common-select>

          <!-- 是否涉农 -->
          <common-select v-model="acctDetailForm.isArc" :label="$t('m.i.common.isArcFdisc')"
                         prop="isArc" :dictList="batchParams.yonList"  :readonly="true"></common-select>

          <!-- 客户性质 -->
          <common-select v-model="acctDetailForm.corpNature" :label="$t('m.i.bm.corpNature')"
                         prop="corpNature" :dictList="batchParams.corpNatureList"  :readonly="true" ></common-select>

          <!-- 行业分类 -->
          <common-select v-model="acctDetailForm.industryCategory" :label="$t('m.i.common.industryCategory')"
                         prop="industryCategory" :dictList="batchParams.industryCategoryList"  :readonly="true"></common-select>
          <!-- 是否科技 -->
          <common-select v-model="acctDetailForm.isTechnologyCorp" :label="$t('m.i.common.isSciCorpFdisc')"
                         prop="isTechnologyCorp" :dictList="batchParams.yonList"  :readonly=true ></common-select>
          <!--信用评级-->
          <common-input v-model="acctDetailForm.creditRating" :label="$t('m.i.bs.creditRating')" prop="creditRating"  :readonly="true" :maxlength=6></common-input>

          <!--评级主体-->
          <common-input v-model="acctDetailForm.creditRatingMain" :label="$t('m.i.billInfo.cdtRatgAgcy')" prop="creditRatingMain" :maxlength=60 :lengthByByte="false"
                        :readonly="true" ></common-input>

          <!-- 评级到期日 -->
          <common-date-picker v-model="acctDetailForm.creditRatgDueDt" :label="$t('m.i.billInfo.cdtRatgDueDt')" prop="creditRatgDueDt"
                              :readonly="true"></common-date-picker>
          <!--法人姓名-->
          <common-input v-model="acctDetailForm.corpLegalName" :label="$t('m.i.bm.corpLegalName')" prop="corpLegalName" :readonly="true"></common-input>

          <!-- 法人证件类型 -->
          <common-select v-model="acctDetailForm.corpLegalCertType" :label="$t('m.i.bm.corpLegalCertType')"
                         prop="corpLegalCertType" :dictList="batchParams.certTypeList"  :readonly="true"></common-select>

          <!--法人证件号码 -->
          <common-input v-model="acctDetailForm.corpLegalCertNo" :label="$t('m.i.bm.corpLegalCertNo')" prop="corpLegalCertNo" :readonly="true"></common-input>

        </h-form>
        <!--数据展示表格-->
        <h-datagrid
          :columns="columns"
          highlight-row
          :auto-load="false"
          url="/bm/cpes/custsign/custCorpSign/func_queryStockAcctInfo"
          :bindForm="dataGridFormItem"
          row-select
          ref="datagrid">
          <div slot="toolbar" class="pull-left">
          </div>
        </h-datagrid>
      </div>
      <div slot="footer">
      </div>
    </h-msg-box>


  </div>
</template>

<script>
  import { post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "acctBatchDetailShow",
    components: {
      acctDetailItem: () => import(/* webpackChunkName: "bm/sign/cpes/acctDetailItem" */"@/views/bizViews/bm/sign/cpes/acctDetailItem"),
      pickAcctNo: () => import(/* webpackChunkName: "bm/sign/cpes/pickAcctNo" */"@/views/bizViews/bm/sign/cpes/pickAcctNo"),
      showFileWin: () => import(/* webpackChunkName: "pc/img/showFileWin" */"@/views/bizViews/pc/img/showFileWin"),
    },
    data() {
      return {
        custNo: "",
        custRgstStatus:"",
        custId:"",
        custSignIn:"",
        pickAcctNoWin:false,
        showFileWin:false,
        isShowBotton1:true,
        isShowBotton2:true,
        operType:"",
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
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
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
        ],
      };
    },
    props: {
      acctBatchDetailShowWin: {
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
      acctBatchDetailShowWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.custNo = this.batchParams.custNo;
            this.dataGridFormItem.custNo = this.batchParams.custNo;
            this.dataGridFormItem.custRgstStatus = this.batchParams.custRgstStatus;
            this.queryObjById();
            this.$refs.datagrid.dataChange(1);
          });
        }
      },
      batchId(val) {
        this.batchId = val;
      },

    },
    computed: {
      tempAcctBatchDetailShow: {
        get() {
          return this.acctBatchDetailShowWin;
        },
        set() {
        }
      }
    },
    methods: {
      //根据批次Id查询批次信息
      queryObjById() {
        let params = { custNo: this.custNo };
        let url = "/bm/cpes/custsign/custCorpSign/func_getCustInfoByCustNo";
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
        this.custNo="";
        this.custRgstStatus="";
        this.custId="";
        this.$emit("acctBatchDetailShowWinClose", stauts);
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
