<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNo">
                  <h-input v-model="formItem.billNo" :maxlength=30></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder=" ">
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.drwrName')" prop="drwrName">
                  <h-input v-model="formItem.drwrName" :maxlength=60></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.acptName')" prop="acptName">
                  <h-input v-model="formItem.acptName" :maxlength=60></h-input>
                </h-form-item>
                <h-form-item :label="this.$t('m.i.common.operStatus')" prop="operStatus">
                  <h-select v-model="formItem.operStatus" placeholder="">
                    <h-option v-for="item in operStatusList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{ $t("m.i.common.searchAdvanced") }}<i
                    class="icon iconfont"
                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{ $t("m.i.common.search") }}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{ $t("m.i.common.reset") }}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="pc/risk/ticket/indexRiskTicket/func_queryPageRiskTicketHisNew"
            :bindForm="formItem"
            row-select
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleAddForm('add')">{{ $t("m.i.common.add") }}</h-button>
              <h-button type="primary" @click="handleAddForm('modify')">{{ $t("m.i.common.modify") }}</h-button>
              <h-button type="primary" @click="handleComfirm()">{{ $t("m.i.common.delete") }}
              </h-button>
              <h-button type="primary" @click="commitComfirm()" :disabled="!auditMode">
                {{ $t("m.i.common.submitCheck") }}
              </h-button>
              <h-button type="primary" @click="rollbackComfirm()" :disabled="!auditMode">
                {{ $t("m.i.common.cancelCheckAuth") }}
              </h-button>
              <h-button type="primary" @click="importByExcel()">{{ $t("m.i.common.batchImport") }}
              </h-button>
              <h-button type="primary" @click="downModel()">{{ $t("m.i.common.templateDownload") }}
              </h-button>
              <h-button type="primary" @click="showHist()">{{ $t("m.i.common.showHist") }}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" class="h-form-search-layer" :maximize="true" :mask-closable="false"
               @on-close="editWinClose">
      <p slot="header">
        <span v-if=" type==='add'">新增票据风险信息</span>
        <span v-if=" type==='modify'">修改票据风险信息</span>
      </p>
      <h-form :model="addForm" :label-width="120" ref="addForm" cols="2" class="h-form-search">
        <!--票据(包)号码-->
        <common-input :readonly=" type==='modify'" v-model="addForm.billNo" :maxlength=30 placeholder="" :label="$t('m.i.billInfo.billPackageNo')"
                      prop="billNo" required :validRules="billNoRule" :filterRE="/[^0-9]/g"></common-input>

        <!--子票区间-->
        <common-input-range  v-model="addForm" :rangeProps="['billRangeStart','billRangeEnd']"
                            :label="$t('m.i.billInfo.billRange')" :maxlength="12" :filterRE="/[^0-9]/g"></common-input-range>

        <!--票据类型-->
        <common-select :readonly=" type==='modify'" :dictList="billTypeList" v-model="addForm.billType" :label="$t('m.i.billInfo.billType')"
                       prop="billType" required></common-select>

        <!--出票人全称-->
        <common-input v-model="addForm.drwrName" :label="$t('m.i.billInfo.drwrName')"
                      prop="drwrName" :maxlength=60 :lengthByByte="false"></common-input>

        <!--承兑人全称-->
        <common-input v-model="addForm.acptName" :label="$t('m.i.billInfo.acptName')"
                      prop="acptName" :maxlength=60  :lengthByByte="false"></common-input>

        <!--承兑日期-->
        <common-date-picker :editable=false :options="acptOptions" v-model="addForm.acptDt"
                            :label="$t('m.i.billInfo.remitDt')" prop="acptDt"></common-date-picker>

        <!--汇票到期日-->
        <common-date-picker :editable=false :options="dueOptions" v-model="addForm.dueDt"
                            :label="$t('m.i.billInfo.dueDt')" prop="dueDt"></common-date-picker>

        <!--票据金额-->
        <common-type-field v-model="addForm.billMoney" integerNum="10" :label="$t('m.i.billInfo.billPackageMoney')"
                           prop="billMoney" required :validRules="moneyRule"></common-type-field>

        <!--风险备注-->
        <common-input v-model="addForm.riskDesc" :label="$t('m.i.pc.riskDesc')" prop="riskDesc"
                      :maxlength=250  :lengthByByte="false"></common-input>

        <common-select :dictList="riskStatusList" v-model="addForm.riskStatus" :label="$t('m.i.billInfo.riskStatus')"
                       prop="riskStatus" required></common-select>
      </h-form>

      <div slot="footer">
        <h-button type="ghost" @click="editWinClose">{{ $t("m.i.common.close") }}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{ $t("m.i.common.submiting") }}</h-button>
        <h-button type="primary" v-else @click="submitForm()">{{ $t("m.i.common.commit") }}</h-button>
      </div>
    </h-msg-box>

    <!-- 批量导入弹出框-->
    <common-file-upload :importWin="importWin" :fileParams="fileParams" @importWinClose="importWinClose"
                        @importSuccess="importSuccess"></common-file-upload>

    <h-ticket-hist :showOptHistWin="showOptHistWin" optTitle="查看历史维护记录" :id="id" @showHistWinClose="showHistWinClose">
    </h-ticket-hist>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo" ref="billInfoMain"></bill-info-main>
  </div>
</template>

<script>
import {post, formatNumber, getMoreParamValuesByKeys, formatBillRangeNoBillOrigin} from "@/api/bizApi/commonUtil";

export default {
  name: "indexRiskTicket",
  components: {
    HTicketHist: () => import(/* webpackChunkName: "pc/risk/indexRiskTicketHist" */`@/views/bizViews/pc/risk/indexRiskTicketHist`)
  },
  data() {
    let addForm = {
      id: "",
      riskTicketId: "",
      billNo: "",
      billRangeStart: "",
      billRangeEnd: "",
      billType: "AC01",
      acptName: "",
      drwrName: "",
      billMoney: "",
      acptDt: "",
      dueDt: "",
      riskDesc: "",
      riskStatus: "RS01",
      createDt: "",
      createTime: "",
      operNo: "",
      reserve1: "",
      reserve2: "",
      updateDt: "",
      updateTm: "",
      operStatus: ""
    };
    return {
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
          key: "duoxuan",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          width: 60,
          key: "xuhao",
          align: "center"
        },
        {
          title: this.$t("m.i.billInfo.billPackageNo"),
          key: "billNo",
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.billRange"),
          key: "billRange",
          hiddenCol: false,
          render: (h, params) => {
            let billRangeStart = params.row.billRangeStart;
            let billRangeEnd = params.row.billRangeEnd;
            return h("span", formatBillRangeNoBillOrigin(billRangeStart, billRangeEnd))
          }
        },
        {
          title: this.$t("m.i.billInfo.billType"),
          key: "billType",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            let billType = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
            return h("span", {domProps: {title: billType}}, billType);
          }
        },
        {
          title: this.$t("m.i.billInfo.drwrName"),
          key: "drwrName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.acptName"),
          key: "acptName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.remitDt"),
          key: "acptDt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.acptDt == null || params.row.acptDt == "") {
              return "";
            }
            let acptDt = this.$moment(params.row.acptDt, "YYYYMMDD").format("YYYY-MM-DD");
            return h("span", {domProps: {title: acptDt}}, acptDt);
          }
        },
        {
          title: this.$t("m.i.billInfo.dueDt"),
          key: "dueDt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.dueDt == null || params.row.dueDt == "") {
              return "";
            }
            let dueDt = this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
            return h("span", {domProps: {title: dueDt}}, dueDt);
          }
        },
        {
          title: this.$t("m.i.billInfo.billPackageMoney"),
          key: "billMoney",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let billMoney;
            if (params.row.billMoney == 0.0 || params.row.billMoney == null || params.row.billMoney == "" || params.row.billMoney == "null") {
              billMoney = "0.00";
            } else {
              billMoney = formatNumber(params.row.billMoney, 2, ",");
            }
            return h("span", {
              domProps: {
                title: billMoney
              }
            }, billMoney);
          }
        },
        {
          title: this.$t("m.i.pc.riskDesc"),
          key: "riskDesc",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.riskStatus"),
          key: "riskStatus",
          hiddenCol: false,
          render: (h, params) => {
            let riskStatus = this.getDictValueFromMap(this.dictMap, "RiskStatus", params.row.riskStatus);
            return h("span", {domProps: {title: riskStatus}}, riskStatus);
          }
        },
        {
          title: this.$t("m.i.pc.originFlag"),
          key: "originFlag",
          hiddenCol: false,
          render: (h, params) => {
            let originFlag = this.getDictValueFromMap(this.dictMap, "OriginFlag", params.row.originFlag);
            return h("span", {domProps: {title: originFlag}}, originFlag);
          }
        },
        {
          title: this.$t("m.i.common.operStatus"),
          key: "operStatus",
          hiddenCol: false,
          render: (h, params) => {
            let operStatus = this.getDictValueFromMap(this.dictMap, "RiskOperStatus", params.row.operStatus);
            return h("span",
              {
                domProps: {
                  title: operStatus
                }
              }, operStatus);
          }
        },
        {
          title: this.$t("m.i.pc.newUpdateTime"),
          key: "updateTime",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            let updateTime = params.row.updateTime == null ? "" : this.$moment(params.row.updateTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
            return h("span", {domProps: {title: updateTime}}, updateTime);
          }
        }
      ],
      formItem: {
        billNo: "",
        billType: "",
        drwrName: "",
        acptName: "",
        operStatus: ""
      },
      addForm: addForm,
      showBillInfoWin: false,
      billId: "",
      billNo: "",
      billTypeList: [],
      riskStatusList: [],
      originFlagList: [],
      operStatusList: [],
      // 是否显示新增或修改窗口
      addOrEditWin: false,
      uploadFileName: "",
      fileId: "",
      uploadWin: false,
      type: null,
      readonly: false,
      submitFlag: false,
      copyWin: false,
      ifShowMore: false,
      showOptHistWin: false,
      id: "",
      uploadUrl: window.LOCAL_CONFIG.API_HOME + "/pc/risk/ticket/importTicket",
      importSelect: true,
      selectDataFirst: false,
      importWin: false,
      acptOptions: {
        disabledDate(date) {
          if (addForm.dueDt != null && addForm.dueDt != "") {
            let pattern = /(\d{4})(\d{2})(\d{2})/;
            let dueDt = addForm.dueDt.replace(pattern, '$1-$2-$3');
            return date && date.valueOf() > new Date(dueDt).valueOf();
          }
        }
      },
      dueOptions: {
        disabledDate(date) {
          if (addForm.acptDt != null && addForm.acptDt != "") {
            let pattern = /(\d{4})(\d{2})(\d{2})/;
            let acptDt = addForm.acptDt.replace(pattern, '$1-$2-$3');
            return date && date.valueOf() < new Date(acptDt).valueOf();
          }
        }
      },
      moneyRule: [{test: validMoney, trigger: "blur"}],
      billNoRule: [{test: validBillNo, trigger: "blur"}],
      auditMode: true,
      fileParams: {
        loadExcelUrl: window.LOCAL_CONFIG.API_HOME + "/pc/risk/ticket/indexRiskTicket/func_loadExcelData",  //导入excel数据解析接口
        fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/pc/risk/ticket/indexRiskTicket/func_submitExcelData",  //excel数据导入接口
        formItem: {},           //请求表格数据时附带参数
        uploadParams: {},       //调用excel数据解析接口时附带的额外参数
        extraGridDatas: {},     //需在反显数据中额外添加的字段
        columns: [
          {
            type: "selection",
            key: "multiSelect",
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
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            key: "billRange",
            hiddenCol: false,
            render: (h, params) => {
              let billRangeStart = params.row.billRangeStart;
              let billRangeEnd = params.row.billRangeEnd;
              return h("span", formatBillRangeNoBillOrigin(billRangeStart, billRangeEnd))
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let list = this.billTypeList;
              let billType = params.row.billType;
              for (let i = 0; i < list.length; i++) {
                if (params.row.billType === list[i].key) {
                  billType = list[i].value;
                }
              }
              return h("span", {domProps: {title: billType}}, billType);
            }
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptDt"),
            key: "acptDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.acptDt == null || params.row.acptDt == "") {
                return "";
              }
              let acptDt = this.$moment(params.row.acptDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", {domProps: {title: acptDt}}, acptDt);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.dueDt == null || params.row.dueDt == "") {
                return "";
              }
              let dueDt = this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", {domProps: {title: dueDt}}, dueDt);
            }
          },
          {
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billMoney;
              if (params.row.billMoney == 0.0 || params.row.billMoney == null || params.row.billMoney == "" || params.row.billMoney == "null") {
                billMoney = "0.00";
              } else {
                billMoney = formatNumber(params.row.billMoney, 2, ",");
              }
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t("m.i.pc.riskDesc"),
            key: "riskDesc",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.riskStatus"),
            key: "riskStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.riskStatusList;
              let riskStatus = params.row.riskStatus;
              for (let i = 0; i < list.length; i++) {
                if (params.row.riskStatus === list[i].key) {
                  riskStatus = list[i].value;
                }
              }
              return h("span", {domProps: {title: riskStatus}}, riskStatus);
            }
          }
        ],
        paramKey: "riskTicketHisDtos"         //后台接收对应key
      },
      dictMap: new Map(),
      currentSelectList: []
    };

    function validMoney(rule, val, callback) {
      let re = /^([1-9]\d{0,19}|0)([.]?|(\.\d{1,2})?)$/;
      if (val <= 0) {
        callback(new Error("票据金额必须大于0"));
      } else if (re.test(val)) {
        callback();
      } else {
        callback(new Error("金额为大于等于0的数，小数位只能输两位，最大长度为20位"));
      }
    }

    function validBillNo(rule, val, callback) {

      if (val.length == 16) {
        if (addForm.billType == "AC01") {
          let re = /^[0-9]{3}0[0-9]{2}[5]{1}[0-9]{9}$/;
          if (re.test(val)) {
            callback();
          } else {
            callback(new Error("纸质银票号码由16位数字组成,第四位为0,第七位为5"));
          }
        } else if (addForm.billType == "AC02") {
          let re = /^[0-9]{3}0[0-9]{2}[6]{1}[0-9]{9}$/;
          if (re.test(val)) {
            callback();
          } else {
            callback(new Error("纸质商票号码由16位数字组成,第四位为0,第七位为6"));
          }
        } else {
          callback(new Error("请选择票据类型"));
        }
      } else if (val.length == 30) {
        let re = /^[1-9][0-9]{29}$/;
        if (re.test(val)) {
          callback();
        } else {
          callback(new Error("电票票据号码由30位数字组成且首位不为0"));
        }
      } else {
        callback(new Error("纸票票据号码由16位组成,电票票据号码由30位数字组成"));
      }

    }
  },
  watch: {
    selectDataFirst(val) {
      if (val) {
        this.importSelect = false;
      }
    }
  },
  methods: {
    addFormReset() {
      this.$refs.addForm.resetFields();
      this.addForm.id = "";
    },
    editWinClose() {
      this.addFormReset();
      this.addOrEditWin = false;
    },
    handleAddForm(str) {
      this.type = str;
      this.readonly = false;
      this.addForm.schemeId = "";
      this.addForm.schemeName = "";
      this.addForm.dueDt = "";
      this.addForm.acptDt = "";
      this.addForm.riskDesc = "";
      this.currentSelectList = this.$refs.datagrid.selects
      if (this.type === "modify") {
        let list = this.currentSelectList;
        let currentSelectRow = null;
        if (list != null && list.length === 1) {
          currentSelectRow = this.currentSelectList[0];
        } else if (list.length > 1) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.onlyChooseOneData")});
          return;
        } else {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
          return;
        }
        if (currentSelectRow.operStatus == "12" || currentSelectRow.operStatus == "22"
          || currentSelectRow.operStatus == "32" || currentSelectRow.operStatus == "33") {
          this.$msgTip.error(this, {info: this.$t("m.i.pc.updateError")});
          return;
        } else if (currentSelectRow.originFlag == "2") {
          this.$msgTip.error(this, {info: "票交所下发风险票不可修改"});
          return;
        } else {
          this.$nextTick(() => {
            this.queryObjById(currentSelectRow.id);
            if (this.type === "modify") {
              this.readonly = true;
            }
          });
        }
      } else {
        this.$nextTick(() => {
          this.addFormReset();
        });
      }
      this.addOrEditWin = true;
    },
    queryObjById(id) {
      post({id: id + ""}, "pc/risk/ticket/indexRiskTicket/func_findRiskTicketByIdWhenEdit").then(res => {
        this.submitFlag = false;
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.addForm.id = res.data.retData.id;
            this.addForm.billNo = res.data.retData.billNo;
            this.addForm.riskTicketId = res.data.retData.riskTicketId;
            this.addForm.billType = res.data.retData.billType;
            this.addForm.acptName = res.data.retData.acptName;
            this.addForm.drwrName = res.data.retData.drwrName;
            this.addForm.billMoney = res.data.retData.billMoney;
            if (res.data.retData.billRangeStart !== '' && res.data.retData.billRangeStart !== null) {
              this.addForm.billRangeStart = res.data.retData.billRangeStart.toString().padLeft(12, '0');
            }else {
              this.addForm.billRangeStart = "";
            }
            if (res.data.retData.billRangeEnd !== '' && res.data.retData.billRangeEnd !== null) {
              this.addForm.billRangeEnd = res.data.retData.billRangeEnd.toString().padLeft(12, '0');
            }else {
              this.addForm.billRangeEnd = "";
            }
            if (res.data.retData.acptDt) {
              this.addForm.acptDt = this.$moment(res.data.retData.acptDt, "YYYYMMDD").format("YYYY-MM-DD");
            } else {
              this.addForm.acptDt = "";
            }
            if (res.data.retData.dueDt) {
              this.addForm.dueDt = this.$moment(res.data.retData.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
            } else {
              this.addForm.dueDt = "";
            }
            this.addForm.operStatus = res.data.retData.operStatus;
            this.addForm.riskDesc = res.data.retData.riskDesc;
            this.addForm.riskStatus = res.data.retData.riskStatus;
            this.addForm.createDt = res.data.retData.createDt;
            this.addForm.createTime = res.data.retData.createTime;
            this.addForm.operNo = res.data.retData.operNo;
            this.addForm.reserve1 = res.data.retData.reserve1;
            this.addForm.reserve2 = res.data.retData.reserve2;
            this.addForm.updateDt = res.data.retData.updateDt;
            this.addForm.updateTm = res.data.retData.updateTm;
            this.addForm.transplantFlag = res.data.retData.transplantFlag;
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    },
    billInfoWinClose() {
      this.billId = "";
      this.billNo = "";
      this.showBillInfoWin = false;
    },
    showBillInfo(billId, billNo) {
      this.billId = billId;
      this.billNo = billNo;
      this.showBillInfoWin = true;
    },
    formSearch() {
      this.$refs.datagrid.dataChange(1);
      this.currentSelectList = [];
    },
    formSearchReset() {
      this.$refs.formItem.resetFields();
    },
    submitForm() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          if (!!this.addForm.billRangeStart ^ !!this.addForm.billRangeEnd){
            this.$msgTip.error(this, {info: "子票区间起始和子票区间截止应同时为空或同时不为空"});
            return;
          }
          if (!!this.addForm.billRangeStart && !!this.addForm.billRangeEnd) {
            let billRangeStart = Number(this.addForm.billRangeStart);
            let billRangeEnd = Number(this.addForm.billRangeEnd);
            if (billRangeStart === 0 && billRangeEnd === 0) {

            } else if (billRangeStart === 0 ^ billRangeEnd === 0) {
              this.$msgTip.error(this, {info: "子票区间起始和子票区间截止应同时为0或同时不为0"});
              return;
            } else if (billRangeStart >= billRangeEnd) {
              this.$msgTip.error(this, {info: "非0子票区间起始必须小于子票区间截止"});
              return;
            }
          }
          // 新增或修改的url
          let url = this.type === "add" ? "pc/risk/ticket/indexRiskTicket/func_addRiskTicket" : "pc/risk/ticket/indexRiskTicket/func_updateRiskTicket";
          this.submitFlag = true;
          if (this.addForm.acptDt) {
            let acptDt = this.addForm.acptDt;
            this.addForm.acptDt = this.$moment(acptDt).format("YYYYMMDD");
          } else {
            this.addForm.acptDt = "";
          }
          if (this.addForm.dueDt) {
            let dueDt = this.addForm.dueDt;
            this.addForm.dueDt = this.$moment(dueDt).format("YYYYMMDD");
          } else {
            this.addForm.dueDt = "";
          }
          post(this.addForm, url).then(res => {
            this.submitFlag = false;
            if (res) {
              let retCode = res.data.retCode;
              if (retCode == "000000") {
                this.$msgTip.success(this);
                this.addOrEditWin = false;
                let pageNo = this.type === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
                this.$refs.datagrid.dataChange(pageNo);
                this.currentSelectList = [];
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
    handleComfirm() {
      this.currentSelectList = this.$refs.datagrid.selects
      let list = this.currentSelectList;
      if (list != null && list.length > 0) {
        // if (list.length > 1) {
        //   this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
        //   return;
        // }
        let ids = [];
        for (let i = 0; i < list.length; i++) {
          let currentSelectRow = this.currentSelectList[i];
          if (currentSelectRow.operStatus == "12" || currentSelectRow.operStatus == "22"
            || currentSelectRow.operStatus == "32" || currentSelectRow.operStatus == "33") {
            this.$msgTip.error(this, {info: this.$t("m.i.pc.deleteError")});
            return;
          } else if (currentSelectRow.originFlag == "2") {
            this.$msgTip.error(this, {info: "票交所下发风险票不可删除"});
            return;
          } else {
            ids.push(currentSelectRow.id);
          }
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?",
          onOk: () => {
            this.handledel(ids);
          }
        });
      } else {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
      }
    },
    handledel(ids) {
      let delId = this.currentSelectList[0].id;
      post({ids: ids}, "pc/risk/ticket/indexRiskTicket/func_deleteRiskTicket").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            if (this.currentSelectList[0].operStatus != "13" && this.currentSelectList[0].operStatus != "23") {
              this.$msgTip.success(this);
            }
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            this.currentSelectList = [];
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    },
    commitComfirm() {
      this.currentSelectList = this.$refs.datagrid.selects
      let list = this.currentSelectList;
      if (list != null && list.length > 0) {
        let ids = [];
        for (let i = 0; i < list.length; i++) {
          let operStatus = this.currentSelectList[i].operStatus;

          if (operStatus != "11" && operStatus != "21" && operStatus != "31") {
            this.$msgTip.error(this, {info: "只有待提交状态才能提交复核"});
            return;
          }
          ids.push(this.currentSelectList[i].id);
        }

        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmCommit") + "?",
          onOk: () => {
            this.commitCheck(ids);
          }
        });
      } else {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
      }
    },
    /**提交复核**/
    commitCheck(ids) {
      post({ids: ids}, "pc/risk/ticket/indexRiskTicket/func_submitRiskTicket").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode == "000000") {
            this.$msgTip.success(this);
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            this.currentSelectList = [];
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    },
    rollbackComfirm() {
      this.currentSelectList = this.$refs.datagrid.selects
      let list = this.currentSelectList;
      if (list != null && list.length > 0) {
        let ids = [];
        for (let i = 0; i < list.length; i++) {
          let operStatus = list[i].operStatus;
          if (operStatus != "12" && operStatus != "22" && operStatus != "32") {
            this.$msgTip.error(this, {info: "只有待复核状态才能撤销"});
            return;
          }
          ids.push(list[i].id);
        }


        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmRollBack") + "?",
          onOk: () => {
            this.rollback(ids);
          }
        });
      } else {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
      }
    },
    /**撤销**/
    rollback(ids) {
      let list = this.currentSelectList;
      if (list == null || list.length == 0) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
        return;
      }
      post({ids: ids}, "pc/risk/ticket/indexRiskTicket/func_rollBackRiskTicket").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode == "000000") {
            this.$msgTip.success(this);
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            this.currentSelectList = [];
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    },

    /**批量导入**/
    importByExcel() {
      this.importWin = true;
    },
    importWinClose() {
      this.importWin = false;
    },
    importSuccess() {
      this.importWin = false;
      this.$refs.datagrid.dataChange(1);
    },
    /**模板下载**/
    downModel() {
      let url = window.LOCAL_CONFIG.API_HOME + "/pc/risk/ticket/indexRiskTicket/func_download";
      let form = document.createElement("form");
      form.setAttribute("id", "formId");
      form.setAttribute("action", url);
      form.setAttribute("method", "post");
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    },
    showHist() {
      this.currentSelectList = this.$refs.datagrid.selects
      let list = this.currentSelectList;
      if (list == null || list.length == 0) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
        return;
      } else if (list.length > 1) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.onlyChooseOneData")});
        return;
      }
      this.id = list[0].id + "";
      this.showOptHistWin = true;
    },
    showHistWinClose() {
      this.showOptHistWin = false;
    }
  },
  mounted() {
    this.getDictListByGroups("RiskStatus,DraftTypeCode,OriginFlag,RiskOperStatus").then(res => {
      this.riskStatusList = res.get("RiskStatus");
      this.billTypeList = res.get("DraftTypeCode");
      this.originFlagList = res.get("OriginFlag");
      this.operStatusList = res.get("RiskOperStatus");
      this.dictMap = res.get("map");
    });
    getMoreParamValuesByKeys("pc.risk.risk_ticket_audit_mode").then(res => {
      let idAudit = res["pc.risk.risk_ticket_audit_mode"];
      if (idAudit === "0") {
        this.auditMode = false;
      } else {
        this.auditMode = true;
      }
    });
  }
};
</script>

<style scoped>

</style>
