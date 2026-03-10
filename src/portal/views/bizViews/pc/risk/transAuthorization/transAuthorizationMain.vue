<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.busiType')" prop="prodNo">
                  <h-select v-model="formItem.prodNo" placeholder="">
                    <h-option v-for="item in prodNoList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="minStartDt" :label="$t('m.i.common.beginDt')">
                  <h-date-picker :value="startDtList" type="daterange" autoPlacement placeholder="" @on-change="handleBeginDtChange"
                                 :editable=false showFormat></h-date-picker>
                </h-form-item>
                <h-form-item prop="minEndDt" :label="$t('m.i.shcpe.endDt')">
                  <h-date-picker :value="endDtList" type="daterange" autoPlacement placeholder="" @on-change="handleEndDtChange"
                                 :editable=false showFormat></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="">
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-row>
            <h-col span="24">
              <h-datagrid :columns="columns"
                          highlight-row
                          url="/pc/risk/transAuthorization/transAuthorizationMain/func_pageQueryTransAuthRuleList"
                          :bindForm="formItem"
                          :onCurrentChange="onCurrentChange"
                          :onCurrentChangeCancel="onCurrentChangeCancel"
                          ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="addTransAuth()" >{{$t("m.i.common.add")}}</h-button>
                  <h-button type="primary" @click="editTransAuth()" >{{$t("m.i.common.modify")}}</h-button>
                  <h-button type="primary" @click="enableTransAuth()" >{{$t('m.i.bs.enable')}}</h-button>
                  <h-button type="primary" @click="disableTransAuth()" >{{$t('m.i.bs.disable')}}</h-button>
                  <h-button type="primary" @click="ruleMaintainWinOpen()" >{{$t('m.i.common.ruleMaintain')}}</h-button>
                  <h-button type="primary" @click="ruleViewTransAuth()" >{{$t('m.i.common.ruleView')}}</h-button>
                </div>
              </h-datagrid>
            </h-col>
          </h-row>
        </div>
      </h-col>
    </h-row>


    <!-- 新增交易授权弹出框 -->
    <h-msg-box v-model="addTransAuthWin" width="400" class="h-form-search-layer" :maximize="true"
               :mask-closable="false" @on-close="addTransAuthWinClose()">
      <p slot="header">
        <span v-if="type=='add'">新增交易授权</span>
        <span v-if="type=='modify'">修改交易授权</span>
      </p>
      <div>
        <h-form :model="addTransAuthForm" :label-width="80" ref="addTransAuthForm" cols="1" class="h-form-search" onlyBlurRequire>
          <h-form-item :label="$t('m.i.common.busiType')" prop="prodNo" required>
            <h-select v-model="addTransAuthForm.prodNo" placeholder="" :readonly="type === 'modify'">
              <h-option v-for="item in prodNoList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType" required>
            <h-select v-model="addTransAuthForm.billType" placeholder="" :readonly="type === 'modify'">
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="startDt" :label="$t('m.i.common.beginDt')" required>
            <h-date-picker type="date" v-model="addTransAuthForm.startDt" placeholder="" @on-change="handleAddBeginDtChange" :editable=false></h-date-picker>
          </h-form-item>
          <h-form-item prop="endDt" :label="$t('m.i.shcpe.endDt')" required>
            <h-date-picker type="date" v-model="addTransAuthForm.endDt" placeholder="" @on-change="handleAddEndDtChange" :editable=false></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.totalBillMoney')" prop="totalAmt" class="h-form-long-label" required>
            <h-typefield type="money" v-model="addTransAuthForm.totalAmt" :maxlength="20" :nonNegative=true placeholder="" bigTips divided></h-typefield>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="addTransAuthWinClose()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="addTransAuthSubmit()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>


    <!-- 规则维护弹出框 -->
    <h-msg-box v-model="ruleMaintainWin" width="800" class="h-form-search-layer" :maximize="true"
               @on-close="ruleMaintainWinClose()" :mask-closable="false">
      <p slot="header">
        <span>规则维护</span>
      </p>
      <div>
        <!-- 数据展示表格 -->
        <h-datagrid :columns="ruleMaintainColumns"
                    highlight-row
                    :autoLoad="false"
                    url="/pc/risk/transAuthorization/transAuthorizationMain/func_pageQueryTransAuthParamList"
                    :bindForm="ruleMaintainFormItem"
                    :onCurrentChange="onRuleMaintainCurrentChange"
                    :onCurrentChangeCancel="onRuleMaintainCurrentChangeCancel"
                    ref="ruleMaintainDatagrid" class="pl-5 pr-5">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" @click="addRule()">{{$t("m.i.common.addRule")}}</h-button>
            <h-button type="primary" @click="deleteRule()">{{$t("m.i.common.deleteRule")}}</h-button>
          </div>
        </h-datagrid>
      </div>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="ruleMaintainWinClose()">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>

    <!-- 添加规则弹出框 -->
    <h-msg-box v-model="addRuleWin" width="800" class="h-form-table-layer" :maximize="true"
               @on-close="addRuleWinClose()" :mask-closable="false">
      <p slot="header">
        <span>添加规则</span>
      </p>
      <div>
        <h-form :model="addRuleForm" :label-width="120" ref="addRuleForm" cols="1" class="h-form-search" onlyBlurRequire>
          <h-form-item :label="$t('m.i.billInfo.acptTopBankLevel')" prop="acptBankLevels">
            <h-select v-model="addRuleForm.acptBankLevels" placeholder="" multiple showTitle>
              <h-option v-for="item in acptBankLevelList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.distClass')" prop="discBankLevels">
            <h-select v-model="addRuleForm.discBankLevels" placeholder="" multiple showTitle>
              <h-option v-for="item in discBankLevelList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="minDueDt" :label="$t('m.i.billInfo.dueDt')">
            <h-date-picker :value="dueDt" type="daterange" autoPlacement placeholder="" @on-change="handleDueDtChange"
                           :editable=false showFormat></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billMoney')" prop="billMoney">
            <h-row>
              <h-col span="11">
                <h-typefield v-model="addRuleForm.minBillAmt" integerNum="10" placeholder="" type="money" :nonNegative=true
                             bigTips></h-typefield>

              </h-col>
              <h-col span="2" style="text-align: center">至</h-col>
              <h-col span="11">
                <h-typefield v-model="addRuleForm.maxBillAmt" integerNum="10" placeholder="" type="money" :nonNegative=true
                             bigTips></h-typefield>

              </h-col>
            </h-row>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.rate')" required>
            <h-row>
              <h-col span="11">
                <h-input v-model="addRuleForm.minRate" @on-blur="minRateVaild"></h-input>
              </h-col>
              <h-col span="2" style="text-align: center"><span>至</span></h-col>
              <h-col span="11">
                <h-input v-model="addRuleForm.maxRate" @on-blur="maxRateVaild"></h-input>
              </h-col>
            </h-row>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="addRuleWinClose()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="addRuleSubmit()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>


    <!-- 规则查看弹出框 -->
    <h-msg-box v-model="ruleViewWin" width="800" class="h-form-table-layer" :maximize="true"
               @on-close="ruleViewWinClose()" :mask-closable="false">
      <p slot="header">
        <span>规则查看</span>
      </p>
      <div>
        <!-- 数据展示表格 -->
        <h-datagrid :columns="ruleViewColumns"
                    highlight-row
                    :autoLoad="false"
                    url="/pc/risk/transAuthorization/transAuthorizationMain/func_pageQueryTransAuthParamList"
                    :bindForm="ruleViewFormItem"
                    ref="ruleViewDatagrid" class="pl-5 pr-5">
          <div slot="toolbar" class="pull-left">
          </div>
        </h-datagrid>
      </div>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="ruleViewWinClose()">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>


  </div>
</template>


<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap,formatNumber,accMul } from "@/api/bizApi/commonUtil";

  export default {
    name: "transAuthorizationMain",
    data() {
      return {
        dictMap: new Map(),
        billTypeList: [],
        prodNoList: [],
        acptBankLevelList: [],
        discBankLevelList: [],

        type:'',
        ifShowMore: false,
        formItem:{
          prodNo:"",
          billType:"",
          minStartDt:"",
          maxStartDt:"",
          minEndDt:"",
          maxEndDt:""
        },
        startDtList: [],
        endDtList: [],
        dueDt: [],
        currentSelectRow : [],
        ruleMaintainCurrentSelectRow: [],
        columns:[
          {
            type: "radio",
            title: " ",
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
            title: this.$t("m.i.common.busiType"),
            key: "prodNo",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "TransAuthProdNo", params.row.prodNo);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.beginDt'),
            key: "startDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.startDt == null || params.row.startDt === ""){
                return "";
              }
              let date = this.$moment(params.row.startDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.shcpe.endDt'),
            key: "endDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.endDt == null || params.row.endDt === ""){
                return "";
              }
              let date = this.$moment(params.row.endDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.totalBillMoney'),
            key: 'totalAmt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let totalAmt = formatNumber(params.row.totalAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: totalAmt
                }
              }, totalAmt);
            }
          },
          {
            title: this.$t('m.i.common.usedTransAuthAmt'),
            key: 'usedTotalAmt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let totalAmt = formatNumber(params.row.usedTotalAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: totalAmt
                }
              }, totalAmt);
            }
          },
          {
            title: this.$t('m.i.common.createDt'),
            key: "createDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.createDt == null || params.row.createDt === "") {
                return "";
              }
              let date = this.$moment(params.row.createDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.common.status'),
            key: "status",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "TransAuthStatus", params.row.status);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
        ],
        addTransAuthWin:false,
        addTransAuthForm: {
          id: "",
          prodNo:"",
          prodName: "",
          billType:"AC01",
          startDt:"",
          endDt:"",
          totalAmt:""
        },
        ruleMaintainWin:false,
        ruleMaintainFormItem: {
          transAuthRuleId: "",
        },
        ruleMaintainColumns: [
          {
            type: "radio",
            title: " ",
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
            title: this.$t("m.i.billInfo.acptTopBankLevel"),
            key: "acptBankLevels",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = "";
              if (params.row.acptBankLevels === "" || params.row.acptBankLevels === null
                || params.row.acptBankLevels === undefined) {
                return h("span", { domProps: { title: dictValue } }, dictValue);
              } else {
                let split = params.row.acptBankLevels.split(",");
                for (let i=0; i < split.length; i++) {
                  if (i === split.length-1) {
                    dictValue = dictValue + getDictValueFromMap(this.dictMap, "bankLevel", split[i])
                  } else {
                    dictValue = dictValue + getDictValueFromMap(this.dictMap, "bankLevel", split[i])+","
                  }
                }
                return h("span", { domProps: { title: dictValue } }, dictValue);
              }
            }
          },
          {
            title: this.$t('m.i.billInfo.distClass'),
            key: "discBankLevels",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = "";
              if (params.row.discBankLevels === "" || params.row.discBankLevels === null
                || params.row.discBankLevels === undefined) {
                return h("span", { domProps: { title: dictValue } }, dictValue);
              } else {
                let split = params.row.discBankLevels.split(",");
                for (let i=0; i < split.length; i++) {
                  if (i === split.length-1) {
                    dictValue = dictValue + getDictValueFromMap(this.dictMap, "bankLevel", split[i])
                  } else {
                    dictValue = dictValue + getDictValueFromMap(this.dictMap, "bankLevel", split[i])+","
                  }
                }
                return h("span", { domProps: { title: dictValue } }, dictValue);
              }

            }
          },
          {
            title: this.$t('m.i.billInfo.minDueDate'),
            key: "minDueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.minDueDt == null || params.row.minDueDt === "") {
                return "";
              }
              let date = this.$moment(params.row.minDueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.billInfo.maxDueDate'),
            key: "maxDueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.maxDueDt == null || params.row.maxDueDt === "") {
                return "";
              }
              let date = this.$moment(params.row.maxDueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.pl.minBillAmt"),
            key: "minBillAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let totalAmt = formatNumber(params.row.minBillAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: totalAmt
                }
              }, totalAmt);
            }
          },
          {
            title: this.$t("m.i.pl.maxBillAmt"),
            key: "maxBillAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let totalAmt = formatNumber(params.row.maxBillAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: totalAmt
                }
              }, totalAmt);
            }
          },
          {
            title: this.$t('m.i.common.minRate'),
            key: "minRate",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.maxRate'),
            key: "maxRate",
            hiddenCol: false
          },
        ],
        addRuleWin:false,
        addRuleForm: {
          transAuthRuleId: "",
          acptBankLevels:[],
          discBankLevels:[],
          minBillAmt:"",
          maxBillAmt:"",
          minDueDt:"",
          maxDueDt:"",
          minRate:"",
          maxRate:"",
        },
        ruleViewWin:false,
        ruleViewFormItem: {
          transAuthRuleId: "",
        },
        ruleViewColumns: [
          {
            type: "radio",
            title: " ",
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
            title: this.$t("m.i.billInfo.acptTopBankLevel"),
            key: "acptBankLevels",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = "";
              if (params.row.acptBankLevels === "" || params.row.acptBankLevels === null
                || params.row.acptBankLevels === undefined) {
                return h("span", { domProps: { title: dictValue } }, dictValue);
              } else {
                let split = params.row.acptBankLevels.split(",");
                for (let i=0; i < split.length; i++) {
                  if (i === split.length-1) {
                    dictValue = dictValue + getDictValueFromMap(this.dictMap, "bankLevel", split[i])
                  } else {
                    dictValue = dictValue + getDictValueFromMap(this.dictMap, "bankLevel", split[i])+","
                  }
                }
                return h("span", { domProps: { title: dictValue } }, dictValue);
              }
            }
          },
          {
            title: this.$t('m.i.billInfo.distClass'),
            key: "discBankLevels",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = "";
              if (params.row.discBankLevels === "" || params.row.discBankLevels === null
                || params.row.discBankLevels === undefined) {
                return h("span", { domProps: { title: dictValue } }, dictValue);
              } else {
                let split = params.row.discBankLevels.split(",");
                for (let i=0; i < split.length; i++) {
                  if (i === split.length-1) {
                    dictValue = dictValue + getDictValueFromMap(this.dictMap, "bankLevel", split[i])
                  } else {
                    dictValue = dictValue + getDictValueFromMap(this.dictMap, "bankLevel", split[i])+","
                  }
                }
                return h("span", { domProps: { title: dictValue } }, dictValue);
              }

            }
          },
          {
            title: this.$t('m.i.billInfo.minDueDate'),
            key: "minDueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.minDueDt == null || params.row.minDueDt === "") {
                return "";
              }
              let date = this.$moment(params.row.minDueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.billInfo.maxDueDate'),
            key: "maxDueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.maxDueDt == null || params.row.maxDueDt === "") {
                return "";
              }
              let date = this.$moment(params.row.maxDueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.pl.minBillAmt"),
            key: "minBillAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let totalAmt = formatNumber(params.row.minBillAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: totalAmt
                }
              }, totalAmt);
            }
          },
          {
            title: this.$t("m.i.pl.maxBillAmt"),
            key: "maxBillAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let totalAmt = formatNumber(params.row.maxBillAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: totalAmt
                }
              }, totalAmt);
            }
          },
          {
            title: this.$t('m.i.common.minRate'),
            key: "minRate",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.maxRate'),
            key: "maxRate",
            hiddenCol: false
          },
        ],


      }
    },
    mounted() {
      getDictListByGroups("DraftTypeCode,bankLevel,TransAuthProdNo,TransAuthStatus").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.prodNoList = res.get("TransAuthProdNo");
        this.acptBankLevelList = res.get("bankLevel");
        this.discBankLevelList = res.get("bankLevel");
        this.dictMap = res.get("map");
      });
    },

    methods: {
      minRateVaild() {
        let re = /^(((\d|[1-9]\d)(\.\d{1,4})?)|100|100\.0|100\.00|100\.000|100\.0000)$/;
        if ( this.addRuleForm.minRate.length !== 0) {
          if (re.test( this.addRuleForm.minRate)) {
            let min = Number(this.addRuleForm.minRate);
            if (this.addRuleForm.maxRate.length !== 0) {
              let max = Number(this.addRuleForm.maxRate);
              if (min > max) {
                this.$msgTip.info(this, {info: "最小值不能大于最大值"});
                this.addRuleForm.minRate = "";
              }
            }
          } else {
            this.$msgTip.info(this, {info: "利率为0~100之间的数，小数位不超过4位"});
            this.addRuleForm.minRate = "";
          }
        }
      },
      maxRateVaild() {
        let re = /^(((\d|[1-9]\d)(\.\d{1,4})?)|100|100\.0|100\.00|100\.000|100\.0000)$/;
        if (this.addRuleForm.maxRate.length !== 0) {
          if (re.test(this.addRuleForm.maxRate)) {
            let max = Number(this.addRuleForm.maxRate);
            if (this.addRuleForm.minRate.length !== 0) {
              let min = Number(this.addRuleForm.minRate);
              if (min > max) {
                this.$msgTip.info(this, {info: "最大值不能小于最小值"});
                this.addRuleForm.maxRate = "";
              }
            }
          } else {
            this.$msgTip.info(this, {info: "利率为0~100之间的数，小数位不超过4位"});
            this.addRuleForm.maxRate = "";
          }
        }
      },
      handleAddBeginDtChange(value) {
        this.addTransAuthForm.startDt = value.replace(/-/g, "");
      },
      handleAddEndDtChange(value) {
        this.addTransAuthForm.endDt = value.replace(/-/g, "");
      },
      handleBeginDtChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minStartDt = arr[0].replace(/-/g, "");
          this.formItem.maxStartDt = arr[1].replace(/-/g, "");
          this.startDtList = [arr[0],arr[1]];
        } else {
          this.formItem.minStartDt = "";
          this.formItem.maxStartDt = "";
          this.startDtList = [];
        }
      },
      handleEndDtChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minEndDt = arr[0].replace(/-/g, "");
          this.formItem.maxEndDt = arr[1].replace(/-/g, "");
          this.endDtList = [arr[0],arr[1]];
        } else {
          this.formItem.minEndDt = "";
          this.formItem.maxEndDt = "";
          this.endDtList = [];
        }
      },
      handleDueDtChange(arr) {
        if (arr && arr.length >= 2) {
          this.addRuleForm.minDueDt = arr[0].replace(/-/g, "");
          this.addRuleForm.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0],arr[1]];
        } else {
          this.addRuleForm.minDueDt = "";
          this.addRuleForm.maxDueDt = "";
          this.dueDt = [];
        }
      },
      //表单查询
      handleSearch() {
        this.currentSelectRow = [];
        this.$nextTick(() => {
          this.$refs.datagrid.dataChange(1);
        });
      },
      //重置表单查询结果
      resetSearch() {
        this.$nextTick(() => {
          this.formItem.prodNo = '';
          this.formItem.billType = '';
          this.formItem.minStartDt = '';
          this.formItem.maxStartDt = '';
          this.formItem.minEndDt = '';
          this.formItem.maxEndDt = '';
          this.startDtList = [];
          this.endDtList = [];
        });
      },
      onCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      onRuleMaintainCurrentChange(currentRow) {
        this.ruleMaintainCurrentSelectRow = currentRow;
      },
      onCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      onRuleMaintainCurrentChangeCancel() {
        this.ruleMaintainCurrentSelectRow = [];
      },


      //新增
      addTransAuth() {
        this.type = 'add';
        this.$nextTick(() => {
          this.addTransAuthFormReset();
        });
        this.addTransAuthWin = true;
      },
      addTransAuthFormReset() {
        this.$refs.addTransAuthForm.resetFields();
        this.addTransAuthForm.id = "";
        this.addTransAuthForm.prodNo = "";
        this.addTransAuthForm.prodName = "";
        this.addTransAuthForm.billType = "AC01";
        this.addTransAuthForm.startDt = "";
        this.addTransAuthForm.endDt = "";
        this.addTransAuthForm.totalAmt = "";
      },
      //修改
      editTransAuth() {
        this.type = 'modify';
        if(this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if (this.currentSelectRow.status === "1") {
          this.$msgTip.error(this, { info: "该交易授权状态为已启用，禁止修改！" });
          return;
        }
        if (this.currentSelectRow.endDt < Number(window.sessionStorage.getItem("workDate"))) {
          this.$msgTip.error(this, {info: "该交易授权的结束日期小于当前营业日，禁止修改！"});
          return;
        }
        post({id: this.currentSelectRow.id}, "/pc/risk/transAuthorization/transAuthorizationMain/func_queryTransAuthRuleById").then(res => {
          if(res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.addTransAuthForm.id = res.data.retData.id;
              this.addTransAuthForm.prodNo = res.data.retData.prodNo;
              this.addTransAuthForm.prodName = res.data.retData.prodName;
              this.addTransAuthForm.billType = res.data.retData.billType;
              this.addTransAuthForm.startDt = this.$moment(res.data.retData.startDt, "YYYYMMDD").format("YYYY-MM-DD");
              this.addTransAuthForm.endDt = this.$moment(res.data.retData.endDt, "YYYYMMDD").format("YYYY-MM-DD");
              this.addTransAuthForm.totalAmt = formatNumber(res.data.retData.totalAmt, 2, ",")
              this.addTransAuthWin = true;
            } else {
              this.$msgTip.error(this, { info: msg });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      //交易授权弹窗
      //交易授权弹窗-保存
      addTransAuthSubmit() {
        this.$refs["addTransAuthForm"].validate(valid => {
          if (valid) {
            let url = this.type==="add"?'/pc/risk/transAuthorization/transAuthorizationMain/func_addTransAuthRule':'/pc/risk/transAuthorization/transAuthorizationMain/func_editTransAuthRule';
            let form = this.addTransAuthForm;
            form.startDt = this.$moment(this.addTransAuthForm.startDt).format("YYYYMMDD");
            form.endDt =  this.$moment(this.addTransAuthForm.endDt).format("YYYYMMDD");
            post(form,url).then(res => {
              if(res){
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if(retCode==="000000"){
                  this.$msgTip.success(this);
                  this.addTransAuthWinClose();
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.currentSelectRow = [];
                }else{
                  this.$msgTip.error(this, { info: msg });
                }
              }else{
                this.$msgTip.error(this, { info: this.$t('m.i.common.netError')});
              }
            });
          }
        });
      },
      //交易授权弹窗-关闭
      addTransAuthWinClose() {
        this.addTransAuthFormReset();
        this.addTransAuthWin = false;
      },

      //启用
      enableTransAuth() {
        if(this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定启用吗？",
          onOk: () => {
            post({id: this.currentSelectRow.id}, "/pc/risk/transAuthorization/transAuthorizationMain/func_activeTransAuthRule").then(res => {
              if(res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                } else {
                  this.$msgTip.error(this, { info: msg });
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                }
              }
            }).catch(error => {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });
          }
        });
      },

      //禁用
      disableTransAuth() {
        if(this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定禁用吗？",
          onOk: () => {
            post({id: this.currentSelectRow.id}, "/pc/risk/transAuthorization/transAuthorizationMain/func_forbidTransAuthRule").then(res => {
              if(res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                } else {
                  this.$msgTip.error(this, { info: msg });
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                }
              }
            }).catch(error => {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });
          }
        });
      },

      //规则维护
      ruleMaintainWinOpen() {
        if(this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.ruleMaintainFormItem.transAuthRuleId = this.currentSelectRow.id;
        this.ruleMaintainWin = true;
        this.$nextTick(() => {
          this.$refs.ruleMaintainDatagrid.dataChange(1);
        });
      },
      //规则维护弹窗
      //规则维护弹窗-添加规则
      addRule() {
        this.addRuleForm.transAuthRuleId = this.ruleMaintainFormItem.transAuthRuleId;
        this.addRuleWin = true;
      },
      //添加规则弹窗
      //添加规则弹窗-保存
      addRuleSubmit() {
        this.$refs["addRuleForm"].validate(valid => {
          if (valid) {
            let url = '/pc/risk/transAuthorization/transAuthorizationMain/func_addTransAuthParam';
            post(this.addRuleForm,url).then(res => {
              if(res){
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if(retCode==="000000"){
                  this.$msgTip.success(this);
                  this.addRuleWinClose();
                  this.$refs.ruleMaintainDatagrid.dataChange(1);
                  this.ruleMaintainCurrentSelectRow = [];
                }else{
                  this.$msgTip.error(this, { info: msg });
                }
              }else{
                this.$msgTip.error(this, { info: this.$t('m.i.common.netError')});
              }
            });
          }
        });
      },
      //添加规则弹窗-关闭
      addRuleWinClose() {
        this.$refs.addRuleForm.resetFields();
        this.addRuleForm.transAuthRuleId = "";
        this.addRuleForm.acptBankLevels = [];
        this.addRuleForm.discBankLevels = [];
        this.addRuleForm.maxBillAmt = "";
        this.addRuleForm.minBillAmt = "";
        this.addRuleForm.maxDueDt = "";
        this.addRuleForm.minDueDt = "";
        this.addRuleForm.maxRate = "";
        this.addRuleForm.minRate = "";
        this.dueDt = [];
        this.addRuleWin = false;
      },
      //规则维护弹窗-删除规则
      deleteRule() {
        if(this.ruleMaintainCurrentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }

        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定删除吗?",
          onOk: () => {
            post({id: this.ruleMaintainCurrentSelectRow.id}, "/pc/risk/transAuthorization/transAuthorizationMain/func_deleteTransAuthParam").then(res => {
              if(res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.$refs.ruleMaintainDatagrid.dataChange(1);
                  this.ruleMaintainCurrentSelectRow = [];
                } else {
                  this.$msgTip.error(this, { info: msg });
                  this.$refs.ruleMaintainDatagrid.dataChange(this.$refs.ruleMaintainDatagrid.pageInfo.pageNo);
                }
              }
            }).catch(error => {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });
          }
        });
      },
      //规则维护弹窗-关闭
      ruleMaintainWinClose() {
        this.ruleMaintainFormItem.transAuthRuleId = "";
        this.ruleMaintainCurrentSelectRow = [];
        this.ruleMaintainWin = false;
      },


      //规则查看
      ruleViewTransAuth() {
        if(this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.ruleViewFormItem.transAuthRuleId = this.currentSelectRow.id;
        this.ruleViewWin = true;
        this.$nextTick(() => {
          this.$refs.ruleViewDatagrid.dataChange(1);
        });
      },
      //规则查看弹窗
      //规则查看弹窗-关闭
      ruleViewWinClose() {
        this.ruleViewFormItem.transAuthRuleId = "";
        this.ruleViewWin = false;
      },

    },
  }

</script>

<style scoped>

</style>
