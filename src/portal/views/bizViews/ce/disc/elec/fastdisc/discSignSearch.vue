<!--极速贴现-签约查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.signBrchNos" :label="$t('m.i.ce.signBrchName')" prop="signBrchNos" required
                             title="机构名称" :brchNo.sync="formItem.signBrchNos" :brchName.sync="formItem.signBrchName">
                </show-branch>
                <h-form-item prop="custNo" :label="$t('m.i.common.custNo')">
                  <h-input v-model="formItem.custNo" placeholder="" icon="android-search" @on-click="queryCustNo()"
                           readonly></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.custName')" prop="custName">
                  <h-input v-model="formItem.custName" :maxlength=60 readonly></h-input>
                </h-form-item>
                <h-form-item prop="custAcctNo" :label="$t('m.i.common.custAcctNo')">
                  <h-input v-model="formItem.custAcctNo" placeholder="" readonly icon="android-search"
                           @on-click="queryCustAcctNo()"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.signStatus')" prop="signStatusList">
                  <h-select v-model="formItem.signStatusList" multiple   showTitle placeholder="">
                    <h-option v-for="item in signStatusList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <channel-select v-model="formItem.channelNo" :label="$t('m.i.ce.signChannel')"></channel-select>
                <h-form-item :label="$t('m.i.ce.signApplyDt')" prop="minApplDt">
                  <h-date-picker :value="applDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleApplDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.actualSignEnableDt')" prop="minActualActiveDt" class="h-form-long-label">
                  <h-date-picker :value="actualActiveDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleActiveDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.actualSignDueDt')" prop="minActualFailureDt" class="h-form-long-label">
                  <h-date-picker :value="actualFailureDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleFailureDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <show-branch v-model="formItem.discInBrchNo" :label="$t('m.i.ce.discInBrchName')" prop="discInBrchNo" :showCheckBox="false"
                             title="机构名称" :brchNo.sync="formItem.discInBrchNo" :brchName.sync="formItem.discInBrchName">
                </show-branch>
                <h-form-item prop="custMgrName" :label="$t('m.i.ce.inCustManager')">
                  <h-input v-model="formItem.custMgrName" placeholder="" readonly icon="android-search"
                           @on-click="queryCustManager()"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.custArea')" prop="custArea">
                  <h-select v-model="formItem.custArea" placeholder="">
                    <h-option v-for="item in custAreaList" :value="item.key" :key="item.key">{{item.value}}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.isBargain')" prop="isBargain">
                  <h-select v-model="formItem.isBargain" placeholder="">
                    <h-option v-for="item in YonList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/ce/disc/elec/fastdisc/discSignSearch/func_queryList"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen()">导出EXCEL
              </h-button>
              <h-button type="primary" v-if="this.isDownSignFile" @click="downLoad()">{{$t("m.i.common.downSignFile")}}
              </h-button>
              <h-button type="primary" @click="signOperate()">查看操作历史</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                       @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.custNo"
                       @showCustAcctNoWinClose="showCustAcctNoWinClose"
                       @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
    <!--查询客户经理-->
    <show-cust-manager :showCustManagerWin="showCustManagerWin" :title="$t('m.i.ce.selectManager')"
                       @showCustManagerWinClose="showCustManagerWinClose"
                       @custManagerSelect="custManagerSelect"></show-cust-manager>
    <!--查看操作历史-->
    <disc-sign-log :discSignLogWin="discSignLogWin" :detailFormItem="detailFormItem" :dictMap="dictMap"
                   :histListUrl = "'/ce/disc/elec/fastdisc/discSignSearch/func_queryHistList'"
                   @discSignLogWinClose="discSignLogWinClose"></disc-sign-log>
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import { post, on, off, formatNumber, accMul,exportList } from "@/api/bizApi/commonUtil";

  export default {
    name: "discSignSearch",
    components: {
      DiscSignLog:() => import(/* webpackChunkName: "ce/disc/elec/fastdisc/discSignLog" */`@/views/bizViews/ce/disc/elec/fastdisc/discSignLog`),
      DiscSignOperate:() => import(/* webpackChunkName: "ce/disc/elec/fastdisc/discSignOperate" */`@/views/bizViews/ce/disc/elec/fastdisc/discSignOperate`),
      ShowCustManager:() => import(/* webpackChunkName: "bm/cust/manager/showCustManager" */`@/views/bizViews/bm/cust/manager/showCustManager`)
    },
    data() {
      return {
        activeDt : [],
        applDt : [],
        actualActiveDt :[],
        actualFailureDt : [],
        failureDt : [],
        formItem : {
          busiType: "3",
          queryFlag: "2",
          signBrchNos: this.$store.getters.userInfo.brchNo,
          signBrchName: this.$store.getters.userInfo.brchName,
          custNo: "",
          custName: "",
          custAcctNo: "",
          signStatus: "",
          signStatusList:[],
          minApplDt: "",
          maxApplDt: "",
          minActiveDt: "",
          maxActiveDt: "",
          minFailureDt: "",
          maxFailureDt: "",
          discInBrchNo: "",
          discInBrchName: "",
          custMgrNo: "",
          custMgrName: "",
          custArea: "",
          isBargain: "",
          bargainAuditBrchNo: "",
          minActualActiveDt: "",
          maxActualActiveDt: "",
          minActualFailureDt: "",
          maxActualFailureDt: "",
          actualActiveDt: "",
          actualFailureDt: "",
          channelNo: ""
        },
        columns : [
          {
            type: "radio",
            title: " ",
            width: 60,
            hiddenCol: false
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
            title: this.$t("m.i.common.custNo"),
            key: "custNo",
            hiddenCol: false,
            sortable: true
          },
          {
           title: this.$t("m.i.common.custName"),
            key: "custName",
            hiddenCol: false,
            sortable: true
          },
          {
           title: this.$t("m.i.common.custAcctNo"),
            key: "custAcctNo",
            hiddenCol: false,
            sortable: true
          },
          {
           title: this.$t("m.i.ce.signBrchName"),
            key: "signBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.signStatus"),
            key: "signStatus",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "FDiscSignStatus", params.row.signStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.ce.signChannel"),
            key: "channelName",
            hiddenCol: false,
            sortable: false
          },
          {
            title: this.$t("m.i.ce.signApplyDt"),
            key: "applDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.applDt;
              if (!!params.row.applDt) {
                date = this.$moment(params.row.applDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              }
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.signApplyTm"),
            key: "applTm",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let time = params.row.applTm;
              if (!!params.row.applTm) {
                let transTm = params.row.applTm.toString();
                if (transTm.length < 6) {
                  for (let i = 0; i < (6 - params.row.applTm.toString().length); i++) {
                    transTm = "0" + transTm;
                  }
                }
                time = this.$moment(transTm, "HH:mm:ss").format("HH:mm:ss");
              }
              return h("span", time);
            }
          },
          {
            title: this.$t("m.i.ce.applSignEnableDt"),
            key: "applActiveDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.applActiveDt;
              if (!!params.row.applActiveDt) {
                date = this.$moment(params.row.applActiveDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              }
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.applSignDueDt"),
            key: "applFailureDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.applFailureDt;
              if (!!params.row.applFailureDt) {
                date = this.$moment(params.row.applFailureDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              }
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.actualSignEnableDt"),
            key: "actualActiveDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.actualActiveDt;
              if (!!params.row.actualActiveDt) {
                date = this.$moment(params.row.actualActiveDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              }
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.actualSignDueDt"),
            key: "actualFailureDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.actualFailureDt;
              if (!!params.row.actualFailureDt) {
                date = this.$moment(params.row.actualFailureDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              }
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.adjustRate"),
            key: "adjustRate",
            hiddenCol: false,
            render: (h, params) => {
              let  adjustRate = formatNumber(accMul(params.row.adjustRate, 100), 4, ",");
              return h("span", adjustRate);
            }
          },
          {
            title: this.$t("m.i.ce.limitAmt"),
            key: "limitAmt",
            hiddenCol: false,
            render: (h, params) => {
              let limitAmt = formatNumber(params.row.limitAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: limitAmt
                }
              }, limitAmt);
            }
          },
          {
            title: this.$t("m.i.ce.discInBrchName"),
            key: "discInBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.isBargain"),
            key: "isBargain",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isBargain);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.ce.bargainRate"),
            key: "bargainRate",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let  bargainRate = formatNumber(accMul(params.row.bargainRate, 100), 4, ",");
              return h("span", bargainRate);
            }
          },
          {
            title: this.$t("m.i.ce.isLimitFdiscSum"),
            key: "isLimitFdiscSum",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isLimitFdiscSum);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.ce.everydayFdiscSum"),
            key: "everydayFdiscSum",
            hiddenCol: false,
            sortable: false
          },
          {
            title: this.$t("m.i.ce.inCustManagerNo"),
            key: "custMgrNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.inCustManagerName"),
            key: "custMgrName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.ce.industryCategory'),
            key: "industryCategory",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "IndustryCategoryDetail", params.row.industryCategory);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
           title: this.$t("m.i.ce.custArea"),
            key: "custArea",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "CustArea", params.row.custArea);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.bm.operOpin"),
            key: "checkRemark",
            hiddenCol: false,
            sortable: true
          }
        ],
        signStatusList : [],
        YonList : [],
        custAreaList : [],
        dictMap : new Map(),
        currentSelectRow : "",
        //是否下载签约文件
        isDownSignFile: false,
        //是否显示更多查询项
        ifShowMore : false,
        showCustMessageWin : false,
        showCustAcctNoWin : false,
        showCustManagerWin : false,
        //议价审批机构弹出框
        showBargainAuditBrchWin : false,
        //查询操作历史弹出框
        discSignLogWin : false,
        detailFormItem : {},
        exportParam: "",
        exportRows: "",
        param : null,
        rows : null,
        tempShowExcelTemplateWin : false,
      };
    },
    mounted() {
        this.getIsDownloadSignFile();
        this.getDictListByGroups("FDiscSignStatus,Yon,IndustryCategoryDetail,CustArea").then(res => {
        this.signStatusList = res.get("FDiscSignStatus");
        this.YonList = res.get("Yon");
        this.custAreaList = res.get("CustArea");
        this.dictMap = res.get("map");

      });
    },
    methods: {
      //表单查询
      handleSearch() {
        this.$refs["formItem"].validate(valid => {
          if (valid) {
            this.currentSelectRow = "";
            this.formItem.minApplDt = this.formItem.minApplDt.replace(/-/g, "");
            this.formItem.maxApplDt = this.formItem.maxApplDt.replace(/-/g, "");
            this.formItem.minActiveDt = this.formItem.minActiveDt.replace(/-/g, "");
            this.formItem.maxActiveDt = this.formItem.maxActiveDt.replace(/-/g, "");
            this.formItem.minFailureDt = this.formItem.minFailureDt.replace(/-/g, "");
            this.formItem.minFailureDt = this.formItem.minFailureDt.replace(/-/g, "");
            this.$refs.datagrid.dataChange(1);
          }
        });
      },
      //重置表单查询结果
      resetSearch() {
        this.activeDt = [];
        this.applDt = [];
        this.failureDt = [];
        this.actualFailureDt = [];
        this.actualActiveDt = [];
        this.formItem.minActiveDt = "";
        this.formItem.maxActiveDt = "";
        this.formItem.minApplDt = "";
        this.formItem.actualActiveDt="";
        this.formItem.actualFailureDt="";
        this.formItem.maxApplDt = "";
        this.formItem.minApplFailureDt = "";
        this.formItem.maxApplFailureDt = "";
        this.formItem.minActualFailureDt = "";
        this.formItem.maxActualFailureDt = "";
        this.formItem.custMgrNo = "";
        this.formItem.discInBrchNo = "";
        this.formItem.discInBrchName = "";
        this.formItem.signBrchNos = this.$store.getters.userInfo.brchNo;
        this.formItem.signBrchName = this.$store.getters.userInfo.brchName;
        this.formItem.bargainAuditBrchNo = "";
        this.$refs.formItem.resetFields();
        this.currentSelectRow = "";
      },
        //获取系统参数（极速贴现是否下载签约文件）ce.disc.fastdisc.is_download_sign_file
        getIsDownloadSignFile() {
            let paramKey = "ce.disc.fastdisc.is_download_sign_file";
            post({ paramKey: paramKey }, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
                if (res) {
                    let retCode = res.data.retCode;
                    if (retCode === "000000") {
                        let isAllowBillRate = res.data.retData;
                        if( isAllowBillRate === "1"){
                            this.isDownSignFile = true;
                        }else{
                            this.isDownSignFile = false;
                        }
                    } else {
                        this.isDownSignFile = false;
                        this.$msgTip.error(this, { info: res.data.retMsg });
                    }
                } else {
                    this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                }
            });
        },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = "";
      },
      handleActiveDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minActualActiveDt = arr[0].replace(/-/g, "");
          this.formItem.maxActualActiveDt = arr[1].replace(/-/g, "");
          this.activeDt = [arr[0], arr[1]];
        } else {
          this.formItem.minActualActiveDt = "";
          this.formItem.maxActualActiveDt = "";
          this.activeDt = [];
        }
      },
      handleApplDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minApplDt = arr[0].replace(/-/g, "");
          this.formItem.maxApplDt = arr[1].replace(/-/g, "");
          this.applDt = [arr[0], arr[1]];
        } else {
          this.formItem.minApplDt = "";
          this.formItem.maxApplDt = "";
          this.applDt = [];
        }
      },
      handleFailureDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minActualFailureDt = arr[0].replace(/-/g, "");
          this.formItem.maxActualFailureDt = arr[1].replace(/-/g, "");
          this.failureDt = [arr[0], arr[1]];
        } else {
          this.formItem.minActualFailureDt = "";
          this.formItem.maxActualFailureDt = "";
          this.failureDt = [];
        }
      },
      //查询客户信息
      queryCustNo() {
        this.showCustMessageWin = true;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.formItem.custNo = info.custNo;
        this.formItem.custName = info.custName;
        this.formItem.custAcctNo = info.custAcctNo;
        this.showCustMessageWin = false;
      },
      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //查询客户账号信息
      queryCustAcctNo() {
        if (this.formItem.custNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustAcctNoWin = true;
      },
      //赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.custAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //关闭弹窗
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },
      //查询客户经理
      queryCustManager() {
        this.showCustManagerWin = true;
      },
      //赋值
      custManagerSelect(info) {
        this.formItem.custMgrNo = info.custMgrNo;
        this.formItem.custMgrName = info.custMgrName;
        this.showCustManagerWin = false;
      },
      //关闭弹窗
      showCustManagerWinClose() {
        this.showCustManagerWin = false;
      },
      //查询议价审批机构弹出框
      queryBargainAuditBrchNo() {
        this.showBargainAuditBrchWin = true;
      },
      showBargainAuditBrchWinClose() {
        this.showBargainAuditBrchWin = false;
      },

      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //获取导出模板
      tempShowExcelTemplateWinOpen() {
        this.param = 'discSignReportInfo';
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        }else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      //清单导出
      exportList(field, exportType){
        let exportUrl = window.LOCAL_CONFIG.API_HOME + "/ce/disc/elec/fastdisc/discSignSearch/func_export";
        let options = {};
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          options.params = { id: this.currentSelectRow.id, busiType:this.formItem.busiType,queryFlag:this.formItem.queryFlag,
            signBrchNos:this.formItem.signBrchNos, signBrchName:this.formItem.signBrchName,channelNo: this.formItem.channelNo };
          options.pageSize =  this.currentSelectRow.length;
        } else {
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, exportUrl, options);
      },
      downLoad(){
          if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
              debugger;
              if(this.currentSelectRow.signFileId !== null && this.currentSelectRow.signFileId !==""){
              let url = window.LOCAL_CONFIG.API_HOME + "/ce/disc/elec/fastdisc/discSignSearch/func_downloadSignFile";
              let form = document.createElement("form");
              form.setAttribute("id", "formId");
              form.setAttribute("action", url);
              form.setAttribute("method", "post");
              let input1 = document.createElement('input')
              input1.type = 'text'
              input1.name = 'id';
              input1.value = this.currentSelectRow.signFileId;
              form.appendChild(input1)
              let input2 = document.createElement('input')
              input2.type = 'text'
              input2.name = 'fileName';
              input2.value = this.currentSelectRow.custName+"签约文件";
              form.appendChild(input2)
              document.body.appendChild(form);
              form.submit();
              document.body.removeChild(form);

              }else{
                  this.$msgTip.info(this, { info: "签约文件id为空无法下载" });
              }
          } else {
              this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          }

      },
      signOperate() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.discSignLogWin = true;
          this.detailFormItem.signId = this.currentSelectRow.id;
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      discSignLogWinClose() {
        this.discSignLogWin = false;
        this.detailFormItem = {};
      }
    }
  };
</script>

<style scoped>

</style>
