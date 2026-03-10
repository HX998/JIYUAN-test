<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.operBrchNo" :label="$t('m.i.common.brchName')"
                             prop="operBrchNo" title="机构名称" :showCheckBox="false" :isInitValueClearable="true"
                             :brchNo.sync="formItem.operBrchNo" :brchName.sync="formItem.operBrchName">
                </show-branch>
                <!--客户名称-->
                <common-input v-model="formItem.custNameLike" :label="$t('m.i.common.corpName')"
                              prop="custNameLike" :maxlength=60></common-input>
                <!--统一社会信用代码-->
                <common-input v-model="formItem.socCodeLike" :label="$t('m.i.common.socCode')"
                              prop="socCodeLike" className="h-form-long-label" :maxlength=18></common-input>
                <!--查询状态-->
                <common-select v-model="formItem.queryStatus" :label="$t('m.i.common.status')" prop="queryStatus"
                               :dictList="queryStatusList"></common-select>
                <!--查询种类-->
                <common-select v-model="formItem.queryType" :label="$t('m.i.common.queryType')" prop="queryType"
                               :dictList="queryTypeList"></common-select>
                <!--查询日期-->
                <common-date-picker v-model="applDt" :label="$t('m.i.common.queryDt')" prop="applDt" type="daterange"
                                    @on-change="handleApplDtChange">
                </common-date-picker>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">
                    {{ $t('m.i.common.searchAdvanced') }}
                    <i class="icon iconfont"
                       :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i>
                  </span>
                  <h-button type="primary" @click="formSearch()">{{ $t("m.i.common.search") }}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{ $t("m.i.common.reset") }}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid :columns="columns"
                      highlight-row
                      url="/bm/sign/cpes/custInfoOnlineQuery/func_queryCustInfoByPage"
                      :bindForm="formItem"
                      :onCurrentChange="handleCurrentChange"
                      :onCurrentChangeCancel="handleCurrentChangeCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="apply()">{{ $t("m.i.shcpe.appl") }}</h-button>
              <h-button type="primary" @click="viewDetail()">{{ $t("m.i.common.viewDatail") }}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--查询申请弹出框-->
    <h-msg-box v-model="showApply" @on-close="handleWinClose"
               width="400" class="h-form-search-layer" :maximize="true" :mask-closable="false">
      <p slot="header">
        <span>{{ $t("m.i.common.onlineQueryAppl") }}</span>
      </p>
      <div>
        <h-form :model="applyForm" :label-width="130" ref="applyForm" cols="1" class="h-form-search">
          <!--统一社会信用代码-->
          <common-input v-model="applyForm.socCode" :label="$t('m.i.common.socCode')" required
                        :validRules="socCodeRules"
                        prop="socCode" className="h-form-long-label" :maxlength=18></common-input>
          <!--查询种类-->
          <common-select v-model="applyForm.queryType" :label="$t('m.i.common.queryType')" prop="queryType"
                         :dictList="queryTypeList" required></common-select>
        </h-form>
      </div>
      <div slot="footer">
        <div slot="footer">
          <h-button type="ghost" @click="handleWinClose">{{ $t("m.i.common.close") }}</h-button>
          <h-button type="primary" v-if="submitFlag" disabled>{{ $t("m.i.common.submiting") }}</h-button>
          <h-button type="primary" v-else @click="confirmApply()">{{ $t("m.i.common.commit") }}</h-button>
        </div>
      </div>
    </h-msg-box>

    <!--企业基本信息详情查看-->
    <h-msg-box v-model="showCorpDetail" @on-close="handleCorpWinClose"
               width="800" class="h-form-search-layer" :maximize="true" :mask-closable="false">
      <p slot="header">
        <span>{{ $t("m.i.common.custCorpDetail") }}</span>
      </p>
      <div>
        <h-form :model="viewCorpForm" :label-width="130" ref="viewCorpForm" cols="2" class="h-form-search">
          <!--客户名称-->
          <common-input v-model="viewCorpForm.custName" :label="$t('m.i.common.corpName')"
                        prop="custName" :maxlength=60 readonly></common-input>
          <!--统一社会信用代码-->
          <common-input v-model="viewCorpForm.socCode" :label="$t('m.i.common.socCode')"
                        prop="socCode" :maxlength=18 readonly></common-input>
          <!--查询种类-->
          <common-select v-model="viewCorpForm.queryType" :label="$t('m.i.common.queryType')" prop="queryType"
                         :dictList="queryTypeList" readonly></common-select>
          <!--中征码-->
          <common-input v-model="viewCorpForm.lccCode" :label="$t('m.i.bm.lccCode')" readonly></common-input>
          <!--LEI码-->
          <common-input v-model="viewCorpForm.leiCode" :label="$t('m.i.bm.leiCode')" readonly></common-input>
          <!--联系邮箱-->
          <common-input v-model="viewCorpForm.multipleEmail" :label="$t('m.i.bm.custEmail')"
                        readonly></common-input>
          <!--注册地址-->
          <common-input v-model="viewCorpForm.custAddr" :label="$t('m.i.bm.custAddr')" readonly></common-input>
          <!--主要经营地址-->
          <common-input v-model="viewCorpForm.mainBusiAddr" :label="$t('m.i.bm.mainBusiAddr')"
                        readonly></common-input>
          <!--客户规模-->
          <common-select v-model="viewCorpForm.corpScale" :label="$t('m.i.bm.corpScale')" prop="corpScale"
                         :dictList="corpScaleList" readonly></common-select>
          <!--行业分类-->
          <common-select v-model="viewCorpForm.industryCategory" :label="$t('m.i.common.industryCategory')"
                         prop="industryCategory" :dictList="industryCategoryList" readonly></common-select>
          <!--是否涉农-->
          <common-select v-model="viewCorpForm.isArc" :label="$t('m.i.common.isArcFdisc')" prop="isArc"
                         :dictList="isList" readonly></common-select>
          <!--是否绿色-->
          <common-select v-model="viewCorpForm.isGreenCorp" :label="$t('m.i.common.isGreenCorpFdisc')"
                         prop="isGreenCorp" :dictList="isList" readonly></common-select>
          <!--客户性质-->
          <common-select v-model="viewCorpForm.corpNature" :label="$t('m.i.bm.corpNature')" prop="corpNature"
                         :dictList="corpNatureList" readonly></common-select>
          <!--是否科技-->
          <common-select v-model="viewCorpForm.isTechnologyCorp" :label="$t('m.i.common.isSciCorpFdisc')"
                         prop="isTechnologyCorp" :dictList="isList" readonly></common-select>
          <!--信用评级-->
          <common-input v-model="viewCorpForm.creditRating" :label="$t('m.i.bs.creditRating')" prop="creditRating"
                        readonly></common-input>
          <!--评级主体-->
          <common-input v-model="viewCorpForm.creditRatingMain" :label="$t('m.i.billInfo.cdtRatgAgcy')"
                        prop="creditRatingMain" readonly></common-input>
          <!--评级到期日-->
          <common-date-picker v-model="viewCorpForm.creditRatgDueDt" :label="$t('m.i.billInfo.cdtRatgDueDt')"
                              prop="creditRatgDueDt" type="date" readonly></common-date-picker>
          <!--法定代表人姓名-->
          <common-input v-model="viewCorpForm.corpLegalName" :label="$t('m.i.common.corpLegalName')"
                        prop="corpLegalName" readonly></common-input>
          <!--法定代表人证件类型-->
          <common-select v-model="viewCorpForm.corpLegalCertType" :label="$t('m.i.common.corpLegalCertType')"
                         prop="corpLegalCertType" :dictList="corpLegalCertTypeList" readonly></common-select>
          <!--法定代表人证件号码-->
          <common-input v-model="viewCorpForm.corpLegalCertNo" :label="$t('m.i.common.corpLegalCertNo')"
                        prop="corpLegalCertNo" readonly></common-input>
        </h-form>
      </div>
      <div slot="footer">
      </div>
    </h-msg-box>

    <!--企业账户信息详情查看-->
    <h-msg-box v-model="showAcctDetail" width="1000" @on-close="handleAcctWinClose" top="30"
               class="h-form-search-layer" :maximize="true" @on-maximize="onMaximize">
      <p slot="header">
        <span>{{ $t("m.i.common.custAcctDetail") }}</span>
      </p>
      <!--查询表单-->
      <div>
        <h-form :model="viewAcctForm" :label-width="130" ref="viewAcctForm" cols="3"
                class="h-form-search">
          <!--客户名称-->
          <common-input v-model="viewAcctForm.custName" :label="$t('m.i.common.corpName')"
                        prop="custName" :maxlength=60 readonly></common-input>
          <!--统一社会信用代码-->
          <common-input v-model="viewAcctForm.socCode" :label="$t('m.i.common.socCode')"
                        prop="socCode" :maxlength=18 readonly></common-input>
          <!--查询种类-->
          <common-select v-model="viewAcctForm.queryType" :label="$t('m.i.common.queryType')" prop="queryType"
                         :dictList="queryTypeList" readonly></common-select>
          <!--账户总数-->
          <common-input v-model="acctQty" :label="$t('m.i.common.acctQty')"
                        prop="acctQty" readonly></common-input>
        </h-form>
      </div>
      <!--数据展示表格-->
      <h-datagrid
        :columns="showAcctDetailColumns"
        :auto-load="false"
        highlightRow
        :hasToolBar="false"
        url="/bm/sign/cpes/custInfoOnlineQuery/func_viewCustAcctDetail"
        :bindForm="viewAcctForm"
        @getTData="getTData"
        ref="showAcctDetailDatagrid">
      </h-datagrid>
      <div slot="footer">
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import {post, on, off, formatNumber, formatBillRange, getDictListByGroups} from "@/api/bizApi/commonUtil";
  import BillRange from "@/components/bemp/input/billRange";
  import store from "../../../../../store";
  import CommonSelect from "../../../../../components/bemp/select/commonSelect";

  export default {
    name: "custInfoOnlineQuery",
    components: {},
    data() {
      return {
        columns: [
          {
            type: "radio",
            title: " ",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t('m.i.common.brchName'),
            key: "operBrchName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.corpName'),
            key: 'custName',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.common.socCode'),
            key: 'socCode',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.common.queryDt'),
            key: "applDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.applDt == null || params.row.applDt === "") {
                return "";
              }
              let applDt = this.$moment(params.row.applDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", {domProps: {title: applDt}}, applDt);
            }
          },
          {
            title: this.$t('m.i.common.queryType'),
            key: "queryType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "OnlineQueryType", params.row.queryType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.common.status'),
            key: "queryStatus",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "QueryStatus", params.row.queryStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.shcpe.result'),
            key: "dealPrcMsg",
            sortable: true,
            hiddenCol: false
          }
        ],
        showAcctDetailColumns: [
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t('m.i.common.acctName'),
            key: "acctName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.acctNo'),
            key: "custAcctNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.openBankNo'),
            key: 'openBankNo',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.common.cpesAcctType'),
            key: 'custAcctType',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CpesAcctType", params.row.custAcctType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.common.acctOperDt'),
            key: "openDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.openDt == null || params.row.openDt === "") {
                return "";
              }
              let openDt = this.$moment(params.row.openDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", {domProps: {title: openDt}}, openDt);
            }
          },
          {
            title: this.$t('m.i.common.acctEffectiveDt'),
            key: "acctEffectiveDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.acctEffectiveDt == null || params.row.acctEffectiveDt === "") {
                return "";
              }
              let acctEffectiveDt = this.$moment(params.row.acctEffectiveDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", {domProps: {title: acctEffectiveDt}}, acctEffectiveDt);
            }
          },
          {
            title: this.$t('m.i.common.registReportDt'),
            key: "registReportDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.registReportDt == null || params.row.registReportDt === "") {
                return "";
              }
              let registReportDt = this.$moment(params.row.registReportDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", {domProps: {title: registReportDt}}, registReportDt);
            }
          },
          {
            title: this.$t('m.i.common.agencyName'),
            key: "agencyName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bm.agencyPhone'),
            key: "agencyPhone",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.common.agencyCertNo'),
            key: "agencyCertNo",
            sortable: true,
            hiddenCol: false
          }
        ],
        formItem: {
          operBrchNo: JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
          operBrchName: JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
          custNameLike: "",
          socCodeLike: "",
          queryStatus: "",
          queryType: "",
          minApplDt: "",
          maxApplDt: "",
        },
        applDt: [],
        submitFlag: false,
        ifShowMore: false,
        showApply: false,
        showAcctDetail: false,
        showCorpDetail: false,
        currentSelectRow: null,
        queryStatusList: [],
        queryTypeList: [],
        corpScaleList: [],
        industryCategoryList: [],
        isList: [],
        corpNatureList: [],
        corpLegalCertTypeList: [],
        acctQty: "",
        socCodeRules: [{test: /^[A-Z0-9\-]{18}$/, trigger: "blur", message: "统一社会信用代码由18位数字或大写字母组成"}],
        applyForm: {
          socCode: "",
          queryType: "",
        },
        viewCorpForm: {
          custName: "",
          socCode: "",
          queryType: "",
          lccCode: "",
          leiCode: "",
          multipleEmail: "",
          custAddr: "",
          mainBusiAddr: "",
          corpScale: "",
          industryCategory: "",
          isArc: "",
          isGreenCorp: "",
          corpNature: "",
          isTechnologyCorp: "",
          creditRating: "",
          creditRatingMain: "",
          creditRatgDueDt: "",
          corpLegalName: "",
          corpLegalCertType: "",
          corpLegalCertNo: ""
        },
        viewAcctForm: {
          custId: "",
          custName: "",
          socCode: "",
          queryType: "",
          leiCode: "",
          acctName: "",
          custAcctNo: "",
          openBankNo: "",
          custAcctType: "",
          openDt: "",
          acctEffectiveDt: "",
          registReportDt: "",
          agencyName: "",
          agencyPhone: "",
          agencyCertNo: "",
        },
        dictMap: new Map,
      };
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.showAcctDetailDatagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      getTData(tData) {
        this.acctQty = tData[0].acctQty;
      },
      formSearch() {
        this.$nextTick(() => {
          this.$refs.datagrid.dataChange(1);
        });
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.applDt = [];
        this.formItem.operBrchNo = JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo;
        this.formItem.operBrchName = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = null;
      },
      // 处理票据到期日
      handleApplDtChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minApplDt = arr[0].replace(/-/g, "");
          this.formItem.maxApplDt = arr[1].replace(/-/g, "");
          this.applDt = [arr[0], arr[1]];
        } else {
          this.formItem.minApplDt = "";
          this.formItem.maxApplDt = "";
          this.applDt = [];
        }
      },
      handleWinClose() {
        this.$refs.applyForm.resetFields();
        this.showApply = false;
      },
      handleCorpWinClose() {
        this.$refs.viewCorpForm.resetFields();
        this.showCorpDetail = false;
      },
      handleAcctWinClose() {
        this.$refs.viewAcctForm.resetFields();
        this.showAcctDetail = false;
        this.acctQty = "";
      },
      apply() {
        if (this.currentSelectRow != null && this.currentSelectRow.queryStatus === 'QS01') {
          this.$msgTip.error(this, {info: "该企业正在查询中，请勿重复操作"});
          return;
        }
        this.showApply = true;
        if (this.currentSelectRow) {
          this.applyForm.socCode = this.currentSelectRow.socCode;
          this.applyForm.queryType = this.currentSelectRow.queryType;
        }
      },
      viewDetail() {
        if (this.currentSelectRow == null) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
          return;
        }
        if (this.currentSelectRow != null && this.currentSelectRow.queryStatus !== "QS02") {
          this.$msgTip.error(this, {info: "状态为“已发出”或“查询失败”时，无详细信息"});
          return;
        }
        if (this.currentSelectRow.queryType === 'CT02') {
          this.showCorpDetail = true;
          let dto = {
            id: this.currentSelectRow.id
          }
          let url = "/bm/sign/cpes/custInfoOnlineQuery/func_viewCustCorpDetail";
          post(dto, url).then(res => {
            if (res) {
              if (res.data.retCode === "000000") {
                if (res.data.retData !== null && res.data.retData !== undefined) {
                  this.viewCorpForm.custName = res.data.retData[0].custName;
                  this.viewCorpForm.socCode = res.data.retData[0].socCode;
                  this.viewCorpForm.queryType = res.data.retData[0].queryType;
                  this.viewCorpForm.lccCode = res.data.retData[0].lccCode;
                  this.viewCorpForm.leiCode = res.data.retData[0].leiCode;
                  this.viewCorpForm.multipleEmail = res.data.retData[0].multipleEmail;
                  this.viewCorpForm.custAddr = res.data.retData[0].custAddr;
                  this.viewCorpForm.mainBusiAddr = res.data.retData[0].mainBusiAddr;
                  this.viewCorpForm.corpScale = res.data.retData[0].corpScale;
                  this.viewCorpForm.industryCategory = res.data.retData[0].industryCategory;
                  this.viewCorpForm.isArc = res.data.retData[0].isArc;
                  this.viewCorpForm.isGreenCorp = res.data.retData[0].isGreenCorp;
                  this.viewCorpForm.corpNature = res.data.retData[0].corpNature;
                  this.viewCorpForm.isTechnologyCorp = res.data.retData[0].isTechnologyCorp;
                  this.viewCorpForm.creditRating = res.data.retData[0].creditRating;
                  this.viewCorpForm.creditRatingMain = res.data.retData[0].creditRatingMain;
                  this.viewCorpForm.creditRatgDueDt = this.$moment(res.data.retData[0].creditRatgDueDt, "YYYYMMDD").format("YYYY-MM-DD");
                  this.viewCorpForm.corpLegalName = res.data.retData[0].corpLegalName;
                  this.viewCorpForm.corpLegalCertType = res.data.retData[0].corpLegalCertType;
                  this.viewCorpForm.corpLegalCertNo = res.data.retData[0].corpLegalCertNo;
                }
              } else {
                this.$msgTip.error(this, {info: res.data.retMsg});
              }
            } else {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            }
          });
        } else {
          this.showAcctDetail = true;
          this.viewAcctForm.custId = this.currentSelectRow.id;
          this.$nextTick(() => {
            this.$refs.showAcctDetailDatagrid.dataChange(1);
            this.viewAcctForm.custName = this.currentSelectRow.custName;
            this.viewAcctForm.socCode = this.currentSelectRow.socCode;
            this.viewAcctForm.queryType = this.currentSelectRow.queryType;
          });
        }
      },
      confirmApply() {
        this.$refs["applyForm"].validate(valid => {
          if (valid) {
            let url = "/bm/sign/cpes/custInfoOnlineQuery/func_custInfoQueryApply";
            this.submitFlag = true;
            post(this.applyForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                if (res.data.retCode === "000000") {
                  this.$msgTip.success(this);
                  this.currentSelectRow = null;
                  this.handleWinClose();
                  this.$refs.datagrid.dataChange(1);
                } else {
                  this.$msgTip.error(this, {info: res.data.retMsg});
                }
              } else {
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
              }
            });
          }
        });
      },
    },
    mounted() {
      this.getDictListByGroups("OnlineQueryType,QueryStatus,CorpScale,Industry,Yon,CpesCorpNature,CertType,CpesAcctType").then(res => {
        this.queryTypeList = res.get("OnlineQueryType");
        this.queryStatusList = res.get("QueryStatus");
        this.corpScaleList = res.get("CorpScale");
        this.industryCategoryList = res.get("Industry");
        this.corpNatureList = res.get("CpesCorpNature");
        this.isList = res.get("Yon");
        this.corpLegalCertTypeList = res.get("CertType");
        this.dictMap = res.get("map");
      });
    },
    created() {
    }
  }
</script>

<style scoped>

</style>
