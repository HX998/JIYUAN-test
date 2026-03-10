<!--签约管理-池管理-池信息管理-->
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
                    <h-option value="0">全部</h-option>
                    <h-option v-for="item in modeTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="custName" :label="$t('m.i.common.custName')" v-if="formItem.modeType==='2'">
                  <h-input v-model="formItem.custName" placeholder="" icon="android-search"
                           @on-click="queryCustNo('query')" clearable @on-clear="clearVal('query')" readonly></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate" :class="formItem.modeType==='2' ? 'two-form' : 'one-form'">
                  <h-button type="primary" @click="handleSearch()">{{ $t("m.i.common.search") }}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{ $t("m.i.common.reset") }}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlight-row
                      url="/pl/plsign/plManage/plInfoMain/func_paginQueryBasePoolInfo"
                      :bindForm="formItem"
                      :onCurrentChange="handleCurrentChange"
                      :onCurrentChangeCancel="handleCurrentChangeCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="addOrEditPoolInfo('add')">{{ $t("m.i.common.add") }}</h-button>
              <h-button type="primary" @click="addOrEditPoolInfo('modify')">{{ $t("m.i.common.modify") }}</h-button>
              <h-button type="primary" @click="deletePoolInfo()">{{ $t("m.i.common.delete") }}</h-button>
              <h-button type="primary" @click="addOrEditPoolInfo('show')">{{ $t("m.i.pl.showPoolInfo") }}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 新增/修改池分配弹出框 -->
    <h-msg-box v-model="addOrEditWin" width="1000" @on-close="handleWinClose" class="h-form-table-layer"
               :maximize="true" :mask-closable="false" @on-maximize="onMaximize">
      <p slot="header">
        <span v-if="optType==='add'">新增池信息</span>
        <span v-if="optType==='modify'">修改池信息</span>
        <span v-if="optType==='show'">查看池信息</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="90" ref="addForm" cols="4" class="h-form-search">
          <h-form-item :label="$t('m.i.pl.modeType')" prop="modeType" required>
            <h-select v-model="addForm.modeType" placeholder="" :readonly="optType!=='add'"
                      @on-change="templateType1Change('add')">
              <h-option v-for="item in modeTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="custName" :label="$t('m.i.common.custName')" v-show="addForm.modeType==='2'"
                       :required="addForm.modeType==='2'">
            <h-input v-model="addForm.custName" placeholder="" :icon="optType==='add' ? 'android-search' : ''"
                     @on-click="queryCustNo('add')" :clearable="optType==='add'" @on-clear="clearVal('add')"
                     readonly></h-input>
          </h-form-item>
          <h-form-item class="h-form-operate two-form" v-if="optType==='add'">
            <h-button type="primary" @click="addFormSearch()">{{ $t("m.i.common.search") }}
            </h-button>
          </h-form-item>
        </h-form>
        <h-datagrid :columns="tempPoolInfoColumns"
                    :autoLoad="false"
                    getDataFunc
                    @get-data="getPoolInfoDataList"
                    :gridData="addPoolInfoData"
                    highlight-row
                    ref="poolInfoDatagrid" class="pl-5 pr-5">
        </h-datagrid>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="handleWinClose">{{ $t("m.i.common.close") }}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{ $t("m.i.common.submiting") }}</h-button>
        <h-button type="primary" v-else-if="optType!=='show'" @click="addFormSubmit()">{{ $t("m.i.common.commit") }}
        </h-button>
      </div>
    </h-msg-box>
    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                       @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
  </div>
</template>

<script>
import {post, on, off, formatNumber, accMul, accDiv} from "@/api/bizApi/commonUtil";


export default {
  name: "plInfoMain",
  data() {
    return {
      formItem: {
        modeType: "0",
        custNo: "",
        custName: ""
      },
      addForm: {
        id: "",
        legalNo: "",
        templateType: "1",
        modeType: "",
        custNo: "",
        custName: ""
      },
      columns: [
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
            return h("span", dictValue);
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
          title: this.$t("m.i.common.legalNo"),
          key: "legalNo",
          ellipsis: false,
          hiddenCol: true,
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
      addOrEditWin: false,
      optType: "",
      submitFlag: false,
      currentSelectRow: [],
      dictMap: new Map(),
      billTypeList: [],
      billClassList: [],
      acptBankLevelList: [],
      modeTypeList: [],
      custType: "query",
      showCustMessageWin: false,
      poolInfoColumns: [
        {
          type: "index",
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
            return h("span", dictValue);
          }
        }
      ],
      tempPoolInfoColumns: [],
      addPoolInfoData: {
        list: [],
        pageInfo: {
          count: 0,
          pageNo: 1,
          pageSize: 10
        }
      },
      submitPoolInfoMap: new Map(),
      isSearch: false,
      cannotSubmit: false,
    };
  },
  components: {},
  mounted() {
    this.getDictListByGroups("DraftTypeCode,CDMedia,bankLevel,ModeType").then(res => {
      this.acptBankLevelList = res.get("bankLevel");
      this.billClassList = res.get("CDMedia");
      this.billTypeList = res.get("DraftTypeCode");
      this.modeTypeList = res.get("ModeType");
      this.dictMap = res.get("map");
    });
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
    onMaximize() {
      setTimeout(() => {
        this.$refs.poolInfoDatagrid.$refs.gridContent.handleResize();
      }, 100);
    },
    //搜索选择框清空事件
    clearVal(optType) {
      if (optType === "query") {
        this.formItem.custName = "";
        this.formItem.custNo = "";
      }
      if (optType === "add") {
        this.addForm.custName = "";
        this.addForm.custNo = "";
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
    //新增/修改池信息
    addOrEditPoolInfo(str) {
      this.optType = str;
      this.$nextTick(() => {
        if (this.optType === "modify" || this.optType === "show") {
          if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
            if (this.optType === "modify" && this.currentSelectRow.legalNo != JSON.parse(window.sessionStorage.getItem("userInfo")).legalNo) {
              this.$msgTip.error(this, {info: "该数据为法人[" + this.currentSelectRow.legalNo + "]下维护的数据，当前法人[" + JSON.parse(window.sessionStorage.getItem("userInfo")).legalNo + "]下的柜员不可修改"});
              this.addOrEditWin = false;
              return;
            }
            this.addForm.id = this.currentSelectRow.id;
            this.addForm.legalNo = this.currentSelectRow.legalNo;
            this.addForm.modeType = this.currentSelectRow.modeType;
            if (this.addForm.modeType === "2") {
              this.addForm.custNo = this.currentSelectRow.custNo;
              this.addForm.custName = this.currentSelectRow.custName;
            }
            this.addFormSearch();
          } else {
            this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
            this.addOrEditWin = false;
          }
        } else {
          this.addFormReset();
          this.$refs.poolInfoDatagrid.$refs.gridContent.handleResize();
        }
      });
      this.addOrEditWin = true;
    },
    addFormReset() {
      this.tempPoolInfoColumns = [];
      this.tempPoolInfoColumns = this.deepClone(this.poolInfoColumns);
      this.$refs.addForm.resetFields();
      this.addForm.id = "";
      this.addForm.legalNo = "";
      this.addForm.modeType = "";
      this.addForm.custNo = "";
      this.addForm.custName = "";
    },
    // 删除
    deletePoolInfo() {
      if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
        if (this.currentSelectRow.legalNo != JSON.parse(window.sessionStorage.getItem("userInfo")).legalNo) {
          this.$msgTip.error(this, {info: "该数据为法人[" + this.currentSelectRow.legalNo + "]下维护的数据，当前法人[" + JSON.parse(window.sessionStorage.getItem("userInfo")).legalNo + "]下的柜员不可删除"});
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?",
          onOk: () => {
            this.handleDel();
          }
        });
      } else {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
      }
    },
    handleDel() {
      post({
        custNo: this.currentSelectRow.custNo,
        modeType: this.currentSelectRow.modeType
      }, "/pl/plsign/plManage/plInfoMain/func_delPoolInfo").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$msgTip.success(this);
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            this.currentSelectRow = [];
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    },
    addFormSearch() {
      this.$nextTick(() => {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.isSearch = true;
            this.submitPoolInfoMap = new Map();
            this.$refs.poolInfoDatagrid.tData = [];
            this.getKpiView();
          }
          ;
        });
      });
    },
    getKpiView() {
      this.tempPoolInfoColumns = [];
      this.tempPoolInfoColumns = this.deepClone(this.poolInfoColumns);
      post({
        modeType: this.addForm.modeType,
        custNo: this.addForm.custNo,
        kpiScene: "1"
      }, "/pl/plsign/plManage/plInfoMain/func_paginQueryCustRulesKpi").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            let data = res.data.retData.list;
            for (let item of data) {
              if (item.kpiCodeArray != null) {
                if (item.kpiCodeArray.indexOf("billClass") >= 0) {
                  this.tempPoolInfoColumns.push({
                    title: this.$t("m.i.billInfo.billClass"),
                    key: "billClass",
                    hiddenCol: false,
                    render: (h, params) => {
                      let dictValue = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
                      return h("span", {
                        domProps: {
                          title: dictValue
                        }
                      }, dictValue);
                    }
                  });
                }
                if (item.kpiCodeArray.indexOf("billType") >= 0) {
                  this.tempPoolInfoColumns.push({
                    title: this.$t("m.i.billInfo.billType"),
                    key: "billType",
                    hiddenCol: false,
                    render: (h, params) => {
                      let dictValue = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
                      return h("span", {
                        domProps: {
                          title: dictValue
                        }
                      }, dictValue);
                    }
                  });
                }
                if (item.kpiCodeArray.indexOf("billMoney") >= 0) {
                  this.tempPoolInfoColumns.push({
                    title: this.$t("m.i.pl.minBillAmt"),
                    key: "minBillAmt",
                    hiddenCol: false,
                    render: (h, params) => {
                      let billMoney = formatNumber(params.row.minBillAmt, 2, ",");
                      return h("span", {
                        domProps: {
                          title: billMoney
                        }
                      }, billMoney);
                    }
                  }, {
                    title: this.$t("m.i.pl.maxBillAmt"),
                    key: "maxBillAmt",
                    hiddenCol: false,
                    render: (h, params) => {
                      let billMoney = formatNumber(params.row.maxBillAmt, 2, ",");
                      return h("span", {
                        domProps: {
                          title: billMoney
                        }
                      }, billMoney);
                    }
                  });
                }
                if (item.kpiCodeArray.indexOf("acptBankLevel") >= 0) {
                  this.tempPoolInfoColumns.push({
                    title: this.$t("m.i.billInfo.acptTopBankLevel"),
                    hiddenCol: false,
                    key: "acptBankLevel",
                    render: (h, params) => {
                      let dictValue = this.getDictValueFromMap(this.dictMap, "bankLevel", params.row.acptBankLevel);
                      return h("span", {
                        domProps: {
                          title: dictValue
                        }
                      }, dictValue);
                    }
                  });
                }
              }
            }
            this.tempPoolInfoColumns.push({
              title: this.$t("m.i.pl.poolName"),
              key: "poolName",
              hiddenCol: false,
              render: (h, params) => {
                let inp;
                if (this.optType === "show") {
                  inp = h("span", params.row.poolName);
                } else {
                  inp = h("input",
                    {
                      domProps: {
                        name: "poolName",
                        maxLength: 60,
                        value: params.row.poolName
                      },
                      on: {
                        blur: (event) => {
                          this.poolNameChange(params.row, event.currentTarget.value);
                        }
                      }
                    });
                }
                return h("div", [inp]);
              }
            });
            this.$nextTick(() => {
              this.$refs.poolInfoDatagrid.createShowCol(this.tempPoolInfoColumns);
              this.getPoolInfoDataList();
            });
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
        }
      });
    },
    poolNameChange(poolInfo, poolName) {
      if (this.submitPoolInfoMap.get(poolInfo.id) !== undefined) {
        this.submitPoolInfoMap.get(poolInfo.id).poolName = poolName;
      } else {
        poolInfo.poolName = poolName;
        this.submitPoolInfoMap.set(poolInfo.id, poolInfo);
      }
    },
    poolBailPcetChange(poolInfo, poolBailPcet) {
      let initPoolBailPcet = poolBailPcet
      let currentPoolInfo = Object.assign({}, poolInfo)
      if (!!poolBailPcet) {
        poolBailPcet = accDiv(poolBailPcet, 100);
      }
      if (this.submitPoolInfoMap.get(poolInfo.id) !== undefined) {
        this.submitPoolInfoMap.get(poolInfo.id).poolBailPcet = poolBailPcet;
      } else {
        currentPoolInfo.poolBailPcet = poolBailPcet;
        this.submitPoolInfoMap.set(currentPoolInfo.id, currentPoolInfo);
      }
      let el = /^(((\d|[1-9]\d)(\.\d{1,2})?)|100|100\.0|100\.00|0|0\.0|0\.00)$/;
      if (!(el.test(initPoolBailPcet) || poolBailPcet === "" || poolBailPcet === null || poolBailPcet === undefined)) {
        this.$msgTip.info(this, {info: "池保证金比例为0~100，小数位不超过2位!"});
      }
    },
    //获取池信息
    getPoolInfoDataList() {
      let url = this.optType === "add" ? "/pl/plsign/plManage/plInfoMain/func_paginQueryRulesTemplateDtos" : "/pl/plsign/plManage/plInfoMain/func_paginQueryPoolInfo";
      let params = this.optType === "add" ? {
        templateType: "1",
        modeType: this.addForm.modeType,
        custNo: this.addForm.custNo,
        pageNo: this.$refs.poolInfoDatagrid.pageInfo.pageNo,
        pageSize: this.$refs.poolInfoDatagrid.pageInfo.pageSize
      } : {
        modeType: this.addForm.modeType,
        custNo: this.addForm.custNo,
        legalNo: this.addForm.legalNo,
        pageNo: this.$refs.poolInfoDatagrid.pageInfo.pageNo,
        pageSize: this.$refs.poolInfoDatagrid.pageInfo.pageSize
      };
      post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let data = res.data.retData.list;
              if (data.length === 0) {
                this.$msgTip.info(this, {info: "该客户的池指标模板未设置，请先维护！"});
                return;
              }
              for (let i = 0; i < data.length; i++) {
                if (this.submitPoolInfoMap.get(data[i].id) !== undefined) {
                  data[i].poolBailPcet = this.submitPoolInfoMap.get(data[i].id).poolBailPcet;
                  data[i].poolName = this.submitPoolInfoMap.get(data[i].id).poolName;
                } else {
                  this.submitPoolInfoMap.set(data[i].id, data[i]);
                }
              }
              this.addPoolInfoData = res.data.retData;
              console.log(this.addPoolInfoData);
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        }
      );
    },
    // 新增/修改池信息弹出框提交
    addFormSubmit() {
      let modeType = this.addForm.modeType
      if (!this.isSearch || this.$refs.poolInfoDatagrid.tData.length === 0) {
        this.modeTypeList.some((item) => {
          if (item.key === modeType) {
            modeType = item.value
            return true
          }
        })
      }
      if (!this.isSearch) {
        this.$msgTip.info(this, {info: "请先查询该池维度【" + modeType + "】的池指标模板！"});
        return;
      }
      if (this.$refs.poolInfoDatagrid.tData.length === 0) {
        this.$msgTip.info(this, {info: "池维度【" + modeType + "】的池指标模板为空，请先维护！"});
        return;
      }
      this.cannotSubmit = false;
      this.submitPoolInfoMap.forEach((value, key) => {
        let el = /^(((\d|[1-9]\d)(\.\d{1,2})?)|100|100\.0|100\.00|0|0\.0|0\.00)$/;
        let poolBailPcet = accMul(value.poolBailPcet, 100)
        if (!(el.test(poolBailPcet) || value.poolBailPcet === "" || value.poolBailPcet === null || value.poolBailPcet === undefined)) {
          this.cannotSubmit = true;
        }
      });
      if (this.cannotSubmit) {
        this.$msgTip.info(this, {info: "池保证金比例为0~100，小数位不超过2位!"});
        return;
      }
      if (this.optType === "add") {
        let count = 0;
        this.submitPoolInfoMap.forEach((value, key) => {
          if (value.poolBailPcet !== "" && value.poolBailPcet !== null && value.poolBailPcet !== undefined) {
            count++;
          }
        });
        // if (count < this.$refs.poolInfoDatagrid.total) {
        //   this.$msgTip.info(this, {info: "存在未输入池保证金比例的数据，请检查！"});
        //   return;
        // }
        let countName = 0;
        this.submitPoolInfoMap.forEach((value, key) => {
          if (value.poolName !== "" && value.poolName !== null && value.poolName !== undefined) {
            countName++;
          }
        });
        if (countName < this.$refs.poolInfoDatagrid.total) {
          this.$msgTip.info(this, {info: "存在未输入池名称的数据，请检查！"});
          return;
        }
      } else if (this.optType === "modify") {
        let count = 0;
        this.submitPoolInfoMap.forEach((value, key) => {
          if (value.poolBailPcet !== "" && value.poolBailPcet !== null && value.poolBailPcet !== undefined) {
            count++;
          }
        });
        // if (count < Object.keys(this.submitPoolInfoMap).length) {
        //   this.$msgTip.info(this, {info: "存在未输入池保证金比例的数据，请检查！"});
        //   return;
        // }
        let countName = 0;
        this.submitPoolInfoMap.forEach((value, key) => {
          if (value.poolName !== "" && value.poolName !== null && value.poolName !== undefined) {
            countName++;
          }
        });
        if (countName < this.addPoolInfoData.list.length) {
          this.$msgTip.info(this, {info: "存在未输入池名称的数据，请检查！"});
          return;
        }
      }
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          let url = this.optType === "add" ? "/pl/plsign/plManage/plInfoMain/func_addPoolInfo" : "/pl/plsign/plManage/plInfoMain/func_updatePoolInfo";
          let poolInfoArr = [];
          this.submitPoolInfoMap.forEach((value, key) => {
            let poolInfo = this.deepClone(value)
            // poolInfo.id = "";
            poolInfoArr.push(poolInfo);
          });
          this.submitFlag = true;
          post({list: poolInfoArr}, url).then(res => {
            this.submitFlag = false;
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$msgTip.success(this);
                this.handleWinClose();
                let pageNo = this.optType === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
                this.$refs.datagrid.dataChange(pageNo);
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
    handleWinClose() {
      this.$refs.poolInfoDatagrid.tData = [];
      this.submitPoolInfoMap = new Map();
      this.addOrEditWin = false;
      this.addFormReset();
    }
  }
};
</script>

<style scoped>

</style>
