<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">

                <h-form-item :label="$t('m.i.common.custNo')" prop="discCustNo">
                  <h-input v-model="formItem.discCustNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.custName')" prop="discCustName">
                  <h-input v-model="formItem.discCustName" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.acptorCustName')" prop="acptorCustName">
                  <h-input v-model="formItem.acptorCustName" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.acptorSocCode')" prop="acptorSocCode" class="h-form-long-label">
                  <h-input v-model="formItem.acptorSocCode" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.creditLimitType')" prop="creditLimitType" >
                  <h-select v-model="formItem.creditLimitType" placeholder=""   showTitle>
                    <h-option v-for="item in CreditLimitTypeList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate two-form">
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlight-row
                      :bindForm="formItem"
                      url="/banks/szbank/ce/disc/elec/whiteroll/discCreditLimitMgr/func_queryDiscWhiteRollInfos"
                      :onCurrentChange="onCurrentChange"
                      :onCurrentChangeCancel="onCurrentChangeCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="discCreditLimitOpenWin('add')">
                {{ $t("m.i.common.add") }}
              </h-button>
              <h-button type="primary" @click="discCreditLimitOpenWin('modify')">
                {{ $t("m.i.common.modify") }}
              </h-button>
              <h-button type="primary" @click="discCreditLimitDelete()">
                {{ $t("m.i.common.delete") }}
              </h-button>
              <h-button type="primary" @click="enableAndDisable()">
                {{ $t("m.i.common.enableAndDisable") }}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!-- 点击新增弹出框 -->
    <h-msg-box v-model="addWin" width="1000" class="h-form-table-layer" :maximize="true" @on-close="addFormClose()"
               :mask-closable="false" top="10" @on-maximize="onMaximize">
      <p slot="header" v-if="addForm.optType=='modify'">修改商票贴现白名单</p>
      <p slot="header" v-else>新增商票贴现白名单</p>
      <div>
        <h-form :model="addForm" :label-width="90" ref="addForm" cols="2" class="h-form-search">

          <h-form-item prop="discCustNo" :label="$t('m.i.ce.discCustNo')" required>
            <select-cust-corp v-model="addForm.discCustNo" :custNo="addForm.discCustNo"
                              :value.sync="addForm.discCustNo" :custName.sync="addForm.discCustName" ></select-cust-corp>
          </h-form-item>

          <h-form-item prop="discCustName" :label="$t('m.i.ce.discCustName1')">
            <h-input v-model="addForm.discCustName" placeholder=""></h-input>
          </h-form-item>

          <h-form-item prop="creditLimitType" :label="$t('m.i.ce.creditLimitType')">
            <h-select v-model="addForm.creditLimitType" placeholder=""  @on-change="onChangeCreditLimitType"  showTitle>
              <h-option v-for="item in CreditLimitTypeList" :value="item.key" :key="item.key">{{ item.value }}
              </h-option>
            </h-select>
          </h-form-item>

          <h-form-item prop="grantCreditAmount" :label="$t('m.i.ce.grantCreditAmount')" :required="addForm.creditLimitType === '1'">
            <h-input v-model="addForm.grantCreditAmount" placeholder="" :readonly="addForm.creditLimitType !== '1'"></h-input>
          </h-form-item>

          <h-form-item prop="acptorCustName" :label="$t('m.i.ce.acptorCustName')" :required="addForm.creditLimitType === '0'" >
            <h-input v-model="addForm.acptorCustName" placeholder="" :readonly="addForm.creditLimitType !== '0'"></h-input>
          </h-form-item>

          <h-form-item prop="acptorSocCode" :label="$t('m.i.ce.acptorSocCode')"  class="h-form-long-label"  :required="addForm.creditLimitType === '0'" >
            <h-input v-model="addForm.acptorSocCode" placeholder="" :readonly="addForm.creditLimitType !== '0'"></h-input>
          </h-form-item>

          <h-form-item prop="discLimitAmount" :label="$t('m.i.ce.discLimitAmount')" :required="addForm.creditLimitType === '0'" >
            <h-input v-model="addForm.discLimitAmount" placeholder="" :readonly="addForm.creditLimitType !== '0'"></h-input>
          </h-form-item>

          <h-form-item prop="approvalNo" :label="$t('m.i.ce.approvalNo')" required>
            <h-input v-model="addForm.approvalNo" placeholder=""></h-input>
          </h-form-item>

          <h-form-item prop="approvalStatus" :label="$t('m.i.ce.approvalStatus')" required>
            <h-select v-model="addForm.approvalStatus" placeholder=""    showTitle>
              <h-option v-for="item in ApproveStatusList" :value="item.key" :key="item.key">{{ item.value }}
              </h-option>
            </h-select>
          </h-form-item>

          <h-form-item :label="$t('m.i.ce.approvalActiveDt')" prop="approvalActiveDt" required>
            <h-date-picker type="date" v-model="addForm.approvalActiveDt" showFormat :editable=true
                           placeholder=""   @on-change="activeDateChange()"></h-date-picker>
          </h-form-item>

          <h-form-item :label="$t('m.i.ce.approvalFailureDt')" prop="approvalFailureDt" >
            <h-date-picker type="date" v-model="addForm.approvalFailureDt" showFormat :editable=true
                           placeholder=""   @on-change="failureDateChange()"></h-date-picker>
          </h-form-item>

        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="addFormClose()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="formAdd()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

  </div>
</template>

<script>
  import { post, on, off, accMul, formatNumber, getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "discCreditLimitMgr",
    data() {
      let formItem = {
        discCustNo: "",
        discCustName: "",
        acptorCustName: "",
        acptorSocCode: "",
        creditLimitType: "0",
      };
      let addForm = {
        id: "",
        discCustNo: "",
        discCustName: "",
        grantCreditAmount: "",
        acptorCustName: "",
        acptorSocCode: "",
        discLimitAmount: "",
        creditLimitType: "0",
        approvalNo: "",
        approvalStatus: "1",
        approvalActiveDt: "",
        approvalFailureDt: "",
      };
      let columns = [
        {
          title: " ",
          type: "radio",
          align: "center",
          width: 50
        },
        {
          type: "selection",
          key: "multiSelect",
          width: 60,
          hiddenCol: true,
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
          title: this.$t("m.i.ce.discCustNo"),
          key: "discCustNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.discCustName1"),
          key: "discCustName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.grantCreditAmount"),
          key: "grantCreditAmount",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            let amount = formatNumber(params.row.grantCreditAmount, 2, ",");
            return h("span", {
              domProps: {
                title: amount
              }
            }, amount);
          }
        },
        {
          title: this.$t("m.i.ce.acptorCustName"),
          key: "acptorCustName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.acptorSocCode"),
          key: "acptorSocCode",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.discLimitAmount"),
          key: "discLimitAmount",
          hiddenCol: false,
          render: (h, params) => {
            let amount = formatNumber(params.row.discLimitAmount, 2, ",");
            return h("span", {
              domProps: {
                title: amount
              }
            }, amount);
          }
        },
        {
          title: this.$t("m.i.ce.creditLimitType"),
          key: "creditLimitType",
          hiddenCol: false,
          render: (h, params) => {
            return h("span", getDictValueFromMap(this.dictMap, "CreditLimitType", params.row.creditLimitType));
          }
        },
        {
          title: this.$t("m.i.be.activeFlag"),
          key: "activeFlag",
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.activeFlag === "" || params.row.activeFlag == null) {
              return "";
            }
            switch (params.row.activeFlag) {
              case "0":
                return h("span", "未生效");
              case "1":
                return h("span", "已生效");
              case "2":
                return h("span", "已禁用");
            }
          }
        },
        {
          title: this.$t("m.i.ce.approvalNo"),
          key: "approvalNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.approvalStatus"),
          key: "approvalStatus",
          hiddenCol: false,
          render: (h, params) => {
            return h("span", getDictValueFromMap(this.dictMap, "ApproveStatus", params.row.approvalStatus));
          }
        },
        {
          title: this.$t("m.i.ce.approvalActiveDt"),
          key: "approvalActiveDt",
          hiddenCol: false,
          render: (h, params) => {
            let date = params.row.approvalActiveDt == null ? "" : this.$moment(params.row.approvalActiveDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.ce.approvalFailureDt"),
          key: "approvalFailureDt",
          hiddenCol: false,
          render: (h, params) => {
            let date = params.row.approvalFailureDt == null ? "" : this.$moment(params.row.approvalFailureDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        }
      ];
      return {
        formItem: formItem,
        addForm: addForm,
        columns: columns,
        selectData:null,
        addWin: false,
        submitFlag: false,
        readonlyM: false,
        readonlyX: false,
        disabled: false,
        requiredM: false,
        requiredX: false,
        dictMap: new Map(),
        isList: [],
        ApproveStatusList: [],
        CreditLimitTypeList: [],
      };
    },
    computed: {

    },
    created() {
    },
    mounted() {
      this.getDictListByGroups("Yon,ApproveStatus,CreditLimitType").then(res => {
        this.isList = res.get("Yon");
        this.ApproveStatusList = res.get("ApproveStatus");
        this.CreditLimitTypeList = res.get("CreditLimitType");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      activeDateChange(arr) {
        if(arr){
          this.addForm.quotedPriceDt = arr.replace(/-/g, "");
        }
      },
      failureDateChange(arr) {
        if(arr){
          this.addForm.quotedPriceDt = arr.replace(/-/g, "");
        }
      },
      onCurrentChange(currentRow, oldCurrentRow, _index) {
        this.selectData = currentRow;
      },
      onCurrentChangeCancel(currentRow, oldCurrentRow, _index) {
        this.selectData = null;
      },
      //表单查询
      handleSearch() {
        this.selectData = null;
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      onChangeCreditLimitType(){
        let val=this.addForm.creditLimitType;
        console.assert("onChangeCreditLimitType" + val);
        if(2 === val){//明细
          this.$msgTip.info(this, { info: "承兑人上限限额不在此维护" });
          return;
        }
      },
      discCreditLimitDelete(){
        if (!this.selectData) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?",
          onOk: () => {
            post(this.selectData, "/banks/szbank/ce/disc/elec/whiteroll/discCreditLimitMgr/func_delDiscWhiteRollInfo").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.selectData = null;
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //新增
      discCreditLimitOpenWin(addOrUpdate) {
        this.addForm.optType = addOrUpdate;
        this.addWin = true;
        if(this.addForm.optType == "modify"){
          if (!this.selectData) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
            this.addWin = false;
            return;
          }
          this.$nextTick(async () => {
            this.addForm.id = this.selectData.id;
            this.addForm.discCustNo = this.selectData.discCustNo;
            this.addForm.discCustName = this.selectData.discCustName;
            this.addForm.grantCreditAmount = this.selectData.grantCreditAmount;
            this.addForm.acptorCustName = this.selectData.acptorCustName;
            this.addForm.acptorSocCode = this.selectData.acptorSocCode;
            this.addForm.discLimitAmount = this.selectData.discLimitAmount;
            this.addForm.creditLimitType = this.selectData.creditLimitType;
            this.addForm.approvalNo = this.selectData.approvalNo;
            this.addForm.approvalStatus = this.selectData.approvalStatus;
            this.addForm.approvalActiveDt = this.$moment(this.selectData.approvalActiveDt, "YYYYMMDD").format("YYYY-MM-DD");
            this.addForm.approvalFailureDt = this.$moment(this.selectData.approvalFailureDt, "YYYYMMDD").format("YYYY-MM-DD");
          });
        }else{
          this.$nextTick(() => {
            this.$refs.addForm.resetFields();
          });
        }
      },
      addFormClose() {
        this.$nextTick(() => {
          this.$refs.addForm.resetFields();
        });
        this.addWin = false;
      },
      formAdd(){
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            let desc = "新增";
            let url = "/banks/szbank/ce/disc/elec/whiteroll/discCreditLimitMgr/func_addDiscWhiteRollInfo";
            if(this.addForm.optType == "modify"){
              desc = "修改";
              url = "/banks/szbank/ce/disc/elec/whiteroll/discCreditLimitMgr/func_modifyDiscWhiteRollInfo";
            }
            this.addForm.approvalActiveDt = Number(this.addForm.approvalActiveDt.replace(/-/g, ""));
            this.addForm.approvalFailureDt = Number(this.addForm.approvalFailureDt.replace(/-/g, ""));
            this.submitFlag = true;
            post(this.addForm, url).then(res => {
                if (res) {
                  this.addWin = false;
                  this.submitFlag = false;
                  let msg = res.data.retMsg;
                  let retCode = res.data.retCode;
                  if (retCode == "000000") {
                    this.$msgTip.success(this);
                    this.$refs.datagrid.dataChange(1);
                    this.selectData = null;
                    this.addFormClose();
                  } else {
                    this.$msgTip.error(this, { info: msg });
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                }
              }
            );
          }
        });
      },
      enableAndDisable(){
        if (!this.selectData) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmEnableAndDis") + "?",
          onOk: () => {
            post(this.selectData, "/banks/szbank/ce/disc/elec/whiteroll/discCreditLimitMgr/func_enableAndDisable").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.selectData = null;
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      changeByCreditLimitTypeEdit(val) {
        if (val !== "1") {
          this.addForm.grantCreditAmount = "";
        }else{
          this.addForm.discLimitAmount = "";
        }
      }
    },
    watch:{
      'addForm.creditLimitType'(val){
        this.changeByCreditLimitTypeEdit(val);
      }
    }
  };
</script>
