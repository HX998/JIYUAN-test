<!--签约管理-打折比例管理-打折比例指标管理-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.pl.modeType')" prop="modeType">
                  <h-select v-model="formItem.modeType" placeholder="" @on-change="templateType1Change('query')">
                    <h-option v-for="item in modeTypeList" :value="item.key" :key="item.key">{{item.value}}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="custName" :label="$t('m.i.common.custName')" v-if="formItem.modeType==='2'">
                  <h-input v-model="formItem.custName" placeholder="" icon="android-search"
                           @on-click="queryCustNo('query')" clearable @on-clear="clearVal('custName')" readonly></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate" :class="formItem.modeType==='2' ? 'two-form' : 'one-form'">
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
                          url="/pl/plsign/percentRule/percentRuleMain/func_paginQueryCustRulesKpi"
                          :bindForm="formItem"
                          :onCurrentChange="handleCurrentChange"
                          :onCurrentChangeCancel="handleCurrentChangeCancel"
                          ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="addOrEditKpi('add')">{{$t("m.i.pl.addOrEditKpi")}}</h-button>
                  <h-button type="primary" @click="addOrEditKpi('modify')">{{$t("m.i.pl.modifyOrEditKpi")}}</h-button>
                  <h-button type="primary" @click="deleteKpi()">{{$t("m.i.pl.deleteKpi")}}</h-button>
                </div>
              </h-datagrid>
            </h-col>
          </h-row>
        </div>
      </h-col>
    </h-row>
    <!-- 新增/修改指标分配弹出框 -->
    <h-msg-box v-model="addOrEditWin" width="800" @on-close="handleWinClose" class="h-form-search-layer"
               :maximize="true" :mask-closable="false">
      <p slot="header">
        <span v-if="optType==='add'">新增指标</span>
        <span v-if="optType==='modify'">修改指标</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.pl.modeType')" prop="modeType" required>
            <h-select v-model="addForm.modeType" placeholder="" :readonly="optType==='modify'"
                      @on-change="templateType1Change('add')">
              <h-option v-for="item in modeTypeList" :value="item.key" :key="item.key">{{item.value}}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="custName" :label="$t('m.i.common.custName')" v-if="addForm.modeType==='2'"
                       :required="addForm.modeType==='2'">
            <h-input v-model="addForm.custName" placeholder="" :icon="optType==='add' ? 'android-search' : ''"
                     @on-click="queryCustNo('add')" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pl.kpiCodeArray')" prop="kpiCodeArray" required>
            <h-select v-model="addForm.kpiCodeArray" placeholder="" multiple @on-change="kpiCodeChange" showTitle>
              <h-option v-for="item in kpiList" :value="item.kpiCode" :key="item.kpiCode">{{item.kpiName}}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClassArray" :required="selectedKpiCode.isShowBillClass" v-if="selectedKpiCode.isShowBillClass">
            <h-select v-model="addForm.billClassArray" placeholder="" multiple showTitle>
              <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{item.value}}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billType')" prop="billTypeArray" :required="selectedKpiCode.isShowBillType" v-if="selectedKpiCode.isShowBillType">
            <h-select v-model="addForm.billTypeArray" placeholder="" multiple showTitle>
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value}}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billPackageMoney')" prop="billAmtArray" :required="selectedKpiCode.isShowBillAmt" v-if="selectedKpiCode.isShowBillAmt">
            <h-input v-model="addForm.billAmtArray"
                     placeholder="从0开始，以英文逗号隔开，如'0,100,200'表示[0,100)、[100,200)、[200,无穷大)"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.acptTopBankLevel')" prop="acptTopBankLevelArray" :required="selectedKpiCode.isShowBankLevel" v-if="selectedKpiCode.isShowBankLevel">
            <h-select v-model="addForm.acptTopBankLevelArray" placeholder="" multiple showTitle>
              <h-option v-for="item in acptBankLevelList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.acptBankType')" prop="acptBankTypeArray" :required="selectedKpiCode.isShowBankType" v-if="selectedKpiCode.isShowBankType">
            <h-select v-model="addForm.acptBankTypeArray" placeholder="" multiple showTitle>
              <h-option v-for="item in acptBankTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.corpScale')" prop="corpTypeArray" :required="selectedKpiCode.isShowCorpType" v-if="selectedKpiCode.isShowCorpType">
            <h-select v-model="addForm.corpTypeArray" placeholder="" multiple showTitle>
              <h-option v-for="item in corpTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.pl.residualTermArray')" prop="residualTermArray" :required="selectedKpiCode.isShowRemainDays" v-if="selectedKpiCode.isShowRemainDays">
            <h-input v-model="addForm.residualTermArray"  placeholder="从0开始，以英文逗号隔开，如'0,180,360'表示[0,180)、[180,360)、[360,无穷大)"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pl.remainMonthArray')" prop="remainMonthArray" :required="selectedKpiCode.isShowRemainMonth" v-if="selectedKpiCode.isShowRemainMonth">
            <h-input v-model="addForm.remainMonthArray" placeholder="从0开始，以英文逗号隔开，如'0,5,12'表示[0,5)、[5,12)、[12,无穷大)"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.billInfo.acptCustLevel')" prop="acptCustLevelArray" :required="selectedKpiCode.isShowCustLevel" v-if="selectedKpiCode.isShowCustLevel">
            <h-select v-model="addForm.acptCustLevelArray" placeholder="" multiple showTitle>
              <h-option v-for="item in custLevelList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="handleWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="addFormSubmit()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                       @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";


  export default {
    name: "percentRuleMain",
    data() {
      let kpiScene = "2";
      return {
        kpiScene : kpiScene,
        formItem : {
          modeType: "",
          custNo: "",
          custName: "",
          kpiScene: kpiScene
        },
        addForm : {
          id: "",
          legalNo: JSON.parse(window.sessionStorage.getItem('userInfo')).legalNo,
          kpiScene: kpiScene,
          modeType: "",
          custNo: "",
          custName: "",
          kpiCodeArray: [],
          billClassArray: [],
          billTypeArray: [],
          billAmtArray: "",
          acptTopBankLevelArray: [],
          acptCustLevelArray: [],
          acptBankTypeArray: [],
          corpTypeArray: [],
          residualTermArray: "",
          remainMonthArray: ""
        },
        columns : [
          {
            title: " ",
            type: "radio",
            align: "center",
            width: 50
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
            title: this.$t("m.i.pl.modeType"),
            key: "modeType",
            ellipsis: false,
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.modeType == null || params.row.modeType === "") {
                return "";
              }
              let dictValue = this.getDictValueFromMap(this.dictMap, "ModeType", params.row.modeType);
              return h("span",dictValue)
            }
          },
          {
            title: this.$t("m.i.common.custNo"),
            key: "custNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.custName"),
            key: "custName",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.createDt'),
            key: "createTime",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.createTime == null || params.row.createTime === "") {
                return "";
              }
              let date = this.$moment(params.row.createTime, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.pl.updateTime"),
            key: "updateTime",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.updateTime == null || params.row.updateTime === "") {
                return "";
              }
              let date = this.$moment(params.row.updateTime, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          }
        ],
        addOrEditWin : false,
        optType : "",
        submitFlag : false,
        currentSelectRow : [],
        dictMap : new Map(),
        billTypeList : [],
        billClassList : [],
        acptBankLevelList : [],
        acptBankTypeList : [],
        custLevelList:[],
        corpTypeList : [],
        modeTypeList : [],
        kpiList : [],
        custType : "query",
        showCustMessageWin : false,
        selectedKpiCode : {
          isShowBillClass: false,
          isShowBillType: false,
          isShowBillAmt: false,
          isShowBankLevel: false,
          isShowBankType: false,
          isShowCorpType: false,
          isShowRemainDays: false,
          isShowRemainMonth: false,
          isShowCustLevel: false
        },
      };
    },
    components: {  },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,CDMedia,bankLevel,bankType,CorpScale,ModeType,BillOrigin,custLevel").then(res => {
        this.acptBankLevelList = res.get("bankLevel");
        this.acptBankTypeList = res.get("bankType");
        this.billClassList = res.get("CDMedia");
        this.billTypeList = res.get("DraftTypeCode");
        this.corpTypeList = res.get("CorpScale");
        this.modeTypeList = res.get("ModeType");
        this.custLevelList = res.get("custLevel");
        this.dictMap = res.get("map");
      });
      this.getKpi();
    },
    methods: {
      //查询客户信息
      queryCustNo(custType) {
        this.showCustMessageWin = true;
        this.custType = custType;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.showCustMessageWin = false;
        if (this.custType === "query") {
          this.formItem.custNo = info.custNo;
          this.formItem.custName = info.custName;
        } else if (this.custType === "add") {
          this.addForm.custNo = info.custNo;
          this.addForm.custName = info.custName;
        }
      },
      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //池纬度变化
      templateType1Change(type) {
        if (type === "query" && this.formItem.modeType !== "2") {
          this.formItem.custNo = "";
          this.formItem.custName = "";
        } else if (type === "add" && this.addForm.modeType !== "2") {
          this.addForm.custNo = "";
          this.addForm.custName = "";
        }
      },
      //指标变化
      kpiCodeChange(currentValue) {
        currentValue = currentValue.join(",");
        if (currentValue.indexOf("billClass") !== -1) {
          this.selectedKpiCode.isShowBillClass = true;
        } else {
          this.selectedKpiCode.isShowBillClass = false;
          this.addForm.billClassArray = [];
        }
        if (currentValue.indexOf("billType") !== -1) {
          this.selectedKpiCode.isShowBillType = true;
        } else {
          this.selectedKpiCode.isShowBillType = false;
          this.addForm.billTypeArray = [];
        }
        if (currentValue.indexOf("billMoney") !== -1) {
          this.selectedKpiCode.isShowBillAmt = true;
        } else {
          this.selectedKpiCode.isShowBillAmt = false;
          this.addForm.billAmtArray = "";
        }
        if (currentValue.indexOf("acptBankLevel") !== -1) {
          this.selectedKpiCode.isShowBankLevel = true;
        } else {
          this.selectedKpiCode.isShowBankLevel = false;
          this.addForm.acptTopBankLevelArray = [];
        }
        if (currentValue.indexOf("corpType") !== -1) {
          this.selectedKpiCode.isShowCorpType = true;
        } else {
          this.selectedKpiCode.isShowCorpType = false;
          this.addForm.corpTypeArray = [];
        }
        if (currentValue.indexOf("acptBankType") !== -1) {
          this.selectedKpiCode.isShowBankType = true;
        } else {
          this.selectedKpiCode.isShowBankType = false;
          this.addForm.acptBankTypeArray = [];
        }
        if (currentValue.indexOf("remainDays") !== -1) {
          this.selectedKpiCode.isShowRemainDays = true;
        } else {
          this.selectedKpiCode.isShowRemainDays = false;
          this.addForm.residualTermArray = "";
        }
        if (currentValue.indexOf("remainMonths") !== -1) {
          this.selectedKpiCode.isShowRemainMonth = true;
        } else {
          this.selectedKpiCode.isShowRemainMonth = false;
          this.addForm.remainMonthArray = "";
        }
        if (currentValue.indexOf("acptCustLevel") !== -1) {
          this.selectedKpiCode.isShowCustLevel = true;
        } else {
          this.selectedKpiCode.isShowCustLevel = false;
          this.addForm.acptCustLevelArray = [];
        }
      },
      //搜索选择框清空事件
      clearVal(optType){
        if(optType === "custName"){
          this.formItem.custName = "";
          this.formItem.custNo = "";
        }
      },
      //表单查询
      handleSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.formItem.custNo = "";
        this.$refs.formItem.resetFields();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      //获取指标名称
      getKpi() {
        post({ code: this.kpiScene }, "/pl/plsign/percentRule/percentRuleMain/func_queryRuleKpiDtos").then(res => {
          if (res && res.data) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let data = (res.data.retData instanceof Array) ? res.data.retData : [res.data.retData];
              this.kpiList = data;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      //新增/修改指标分配
      addOrEditKpi(str) {
        this.optType = str;
        if (this.optType === "modify") {
          if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
            this.$nextTick(() => {
              this.addForm.id = this.currentSelectRow.id;
              this.addForm.legalNo = this.currentSelectRow.legalNo;
              this.addForm.modeType = this.currentSelectRow.modeType;
              if (this.addForm.modeType === "2") {
                this.addForm.custNo = this.currentSelectRow.custNo;
                this.addForm.custName = this.currentSelectRow.custName;
              }
              this.addForm.kpiCodeArray = this.currentSelectRow.kpiCodeArray.split(",");
              if (!!this.currentSelectRow.billClassArray) {
                this.addForm.billClassArray = this.currentSelectRow.billClassArray.split(",");
              }
              if (!!this.currentSelectRow.billTypeArray) {
                this.addForm.billTypeArray = this.currentSelectRow.billTypeArray.split(",");
              }
              if (!!this.currentSelectRow.billAmtArray) {
                this.addForm.billAmtArray = this.currentSelectRow.billAmtArray;
              }
              if (!!this.currentSelectRow.acptTopBankLevelArray) {
                this.addForm.acptTopBankLevelArray = this.currentSelectRow.acptTopBankLevelArray.split(",");
              }
              if (!!this.currentSelectRow.acptBankTypeArray) {
                this.addForm.acptBankTypeArray = this.currentSelectRow.acptBankTypeArray.split(",");
              }
              if (!!this.currentSelectRow.corpTypeArray) {
                this.addForm.corpTypeArray = this.currentSelectRow.corpTypeArray.split(",");
              }
              if (!!this.currentSelectRow.residualTermArray) {
                this.addForm.residualTermArray = this.currentSelectRow.residualTermArray;
              }
              if (!!this.currentSelectRow.remainMonthArray) {
                this.addForm.remainMonthArray = this.currentSelectRow.remainMonthArray;
              }
              if (!!this.currentSelectRow.acptCustLevelArray) {
                this.addForm.acptCustLevelArray = this.currentSelectRow.acptCustLevelArray.split(",");
              }
            });
          } else {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            this.addOrEditWin = false;
            return;
          }
        } else {
          this.$nextTick(() => {
            this.addFormReset();
            for (let i = 0; i < this.kpiList.length; i++) {
              if (this.kpiList[i].kpiScope === '2') {
                this.addForm.kpiCodeArray.push(this.kpiList[i].kpiCode);
              }
            }
          });
        }
        this.addOrEditWin = true;
      },
      addFormReset() {
        this.addForm.id = "";
        this.addForm.custNo = "";
        this.addForm.legalNo = JSON.parse(window.sessionStorage.getItem('userInfo')).legalNo;
        this.$refs.addForm.resetFields();
      },
      // 新增/修改指标分配弹出框提交
      addOrUpdateSubmit() {
        let url = this.optType === "add" ? "/pl/plsign/percentRule/percentRuleMain/func_addCustRulesKpi" : "/pl/plsign/percentRule/percentRuleMain/func_updateCustRulesKpi";
        this.submitFlag = true;
        post(this.addForm, url).then(res => {
          this.submitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.handleWinClose();
              let pageNo = this.type === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
              this.$refs.datagrid.dataChange(pageNo);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.$refs.datagrid.dataChange(1);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      addFormSubmit() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            if (this.optType === "add") {
              this.addOrUpdateSubmit();
            } else {
              post(this.addForm, "/pl/plsign/percentRule/percentRuleMain/func_queryCustNameForRulesKpi").then(res=>{
                if (res) {
                  let content = res.data.retMsg;
                  if (content == null || content === '') {
                    //该指标未有客户使用，则直接修改
                    this.addOrUpdateSubmit();
                  } else {
                    //该指标有客户使用，提醒
                    content = "修改指标后，需至【签约管理】页面为相应签约客户【"+ content + "】重新设置打折比例，确认要修改吗？"
                    this.$hMsgBox.confirm({
                      title: this.$t("m.i.common.confirm"),
                      content: content,
                      onOk: () => {
                        this.addOrUpdateSubmit();
                      }
                    });
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                }
              }).catch(error => {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
              });
            }
          }
        });
      },
      handleWinClose() {
        this.addOrEditWin = false;
        this.addFormReset();
      },
      // 删除
      deleteKpi() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          post({id:this.currentSelectRow.id}, "/pl/plsign/percentRule/percentRuleMain/func_queryCustNameForRulesKpi").then(res=>{
            if (res) {
              let content = res.data.retMsg;
              if (content == null || content === '') {
                content = "确认要删除吗?"
              } else {
                content = "删除指标后，需新增指标，然后至【签约管理】页面为相应签约客户【"+content +"】重新设置打折比例，确认要删除吗?"
              }
              this.$hMsgBox.confirm({
                title: this.$t("m.i.common.confirm"),
                content:  content,
                onOk: () => {
                  this.handleDel();
                }
              });
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          }).catch(error => {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
          });


        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      handleDel() {
        post({id: this.currentSelectRow.id }, "/pl/plsign/percentRule/percentRuleMain/func_delCustRulesKpi").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
