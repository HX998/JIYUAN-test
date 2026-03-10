<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">

                <h-form-item :label="$t('m.i.ce.acptorSocCode')" prop="acptorSocCode" class="h-form-long-label">
                  <h-input v-model="formItem.acptorSocCode" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.acptorCustName')" prop="acptorCustName" class="h-form-long-label">
                  <h-input v-model="formItem.acptorCustName" placeholder=""></h-input>
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
                      url="/banks/szbank/ce/disc/elec/whiteroll/discCreditLimitAcptor/func_queryCreditAcptorInfo"
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
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!-- 点击新增弹出框 -->
    <h-msg-box v-model="addWin" width="1000" class="h-form-table-layer" :maximize="true" @on-close="addFormClose()"
               :mask-closable="false" top="10" @on-maximize="onMaximize">
      <p slot="header" v-if="addForm.optType=='modify'">修改商票快贴上限总额控制</p>
      <p slot="header" v-else>新增商票快贴上限总额控制</p>
      <div>
        <h-form :model="addForm" :label-width="90" ref="addForm" cols="2" class="h-form-search">

          <h-form-item prop="acptorCustName" :label="$t('m.i.ce.acptorCustName')" class="h-form-long-label" required>
            <h-input v-model="addForm.acptorCustName" placeholder=""></h-input>
          </h-form-item>

          <h-form-item prop="acptorSocCode" :label="$t('m.i.ce.acptorSocCode')" class="h-form-long-label" required>
            <h-input v-model="addForm.acptorSocCode" placeholder=""  placeholder=""></h-input>
          </h-form-item>

          <h-form-item prop="acptorBankNo" :label="$t('m.i.pl.acptBankNo')">
                      <h-input v-model="addForm.acptorBankNo" placeholder=""></h-input>
          </h-form-item>

        <h-form-item prop="acptorBankName" :label="$t('m.i.billInfo.acptBankName')" class="h-form-long-label">
                    <h-input v-model="addForm.acptorBankName" placeholder=""></h-input>
        </h-form-item>

        <h-form-item prop="discLimitAmount" :label="$t('m.i.ce.grantCreditMaxAmount')"  class="h-form-long-label" required>
                <h-input v-model="addForm.discLimitAmount"  placeholder=""></h-input>
        </h-form-item>

        <h-form-item :label="$t('m.i.common.activeFlag')" prop="activeFlag">
          <h-select  v-model="addForm.activeFlag" placeholder="" :clearable="false">
            <h-option  value="">请选择</h-option>
            <h-option  value="1">已生效</h-option>
            <h-option  value="0">未生效</h-option>
          </h-select>
        </h-form-item>

          <h-form-item :label="$t('m.i.common.activeDt')" prop="activeDt" >
            <h-date-picker type="date" v-model="addForm.activeDt" showFormat :editable=true
                           placeholder=""   @on-change="activeDateChange()"></h-date-picker>
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
  import { post, on, formatNumber,off, accMul, getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "discCreditLimitAcptor",
    data() {
      let formItem = {
        discCustNo: "",
        discCustName: "",
      };
      let addForm = {
        id:"",
        discCustNo:"",
        discCustName:"",
        grantCreditAmount:"",
        acptorCustNo:"",
        acptorCustName:"",
        acptorSocCode:"",
        acptorBankNo:"",
        acptorBankName:"",
        acptorMemberId:"",
        discLimitAmount:"",
        creditLimitType:"",
        usedLimit:"",
        availLimit:"",
        activeFlag:"",
        activeDt:"",
        approvalNo:"",
        approvalStatus:"",
        approvalActiveDt:"",
        approvalFailureDt:"",
        importMsg:"",
        createTime: "",
        updateTime: "",
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
         title: this.$t("m.i.pl.acptBankNo"),
         key: "acptorBankNo",
         hiddenCol: false
       },
      {
       title: this.$t("m.i.billInfo.acptBankName"),
       key: "acptorBankName",
       hiddenCol: false
      },
      {
        title: this.$t("m.i.billInfo.acptCode"),
        key: "acptorBankNo",
        hiddenCol: false
        },
     {
       title: this.$t("m.i.ce.grantCreditMaxAmount"),
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
       title: this.$t('m.i.common.activeFlag'),
       key: 'activeFlag',
       hiddenCol: false,
       render: (h, params) => {
         return h('div', [
           h('span', params.row.activeFlag=='1'?'已生效':'未生效')
         ]);
       },
     },
     {
       title: this.$t("m.i.common.activeDt"),
       key: "activeDt",
       hiddenCol: false,
       render: (h, params) => {
         let date = params.row.activeDt == null ? "" : this.$moment(params.row.activeDt, "YYYY-MM-DD").format("YYYY-MM-DD");
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
        this.isOffList = res.get("Yon");
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
        if(0 === val){//明细
          this.readonlyM=true;
          this.readonlyX=false;
          this.$emit('grantCreditAmount','0');
        }else if(1 === val){//授信总额
          this.readonlyM=false;
          this.readonlyX=true;
          this.$emit('discLimitAmount','0');
          this.disabled=true;
        }else{
          console.assert("onChangeCreditLimitType-default");
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
            post(this.selectData, "/banks/szbank/ce/disc/elec/whiteroll/discCreditLimitAcptor/func_delDiscAcptorInfo").then(res => {
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
            this.addForm.acptorCustNo = this.selectData.acptorCustNo;

            this.addForm.acptorBankNo = this.selectData.acptorBankNo;
            this.addForm.acptorBankName = this.selectData.acptorBankName;
            this.addForm.acptorMemberId = this.selectData.acptorMemberId;
            this.addForm.activeFlag = this.selectData.activeFlag;
            this.addForm.activeDt = this.$moment(this.selectData.activeDt, "YYYYMMDD").format("YYYY-MM-DD");


            this.addForm.acptorSocCode = this.selectData.acptorSocCode;
            this.addForm.discLimitAmount = this.selectData.discLimitAmount;
            this.addForm.creditLimitType = this.selectData.creditLimitType;
            this.addForm.approvalNo = this.selectData.approvalNo;
            this.addForm.approvalStatus = this.selectData.approvalStatus;
            this.addForm.activeDt = this.$moment(this.selectData.activeDt, "YYYYMMDD").format("YYYY-MM-DD");

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
            let url = "/banks/szbank/ce/disc/elec/whiteroll/discCreditLimitAcptor/func_addDiscAcptorInfo";
            if(this.addForm.optType == "modify"){
              desc = "修改";
              url = "/banks/szbank/ce/disc/elec/whiteroll/discCreditLimitAcptor/func_modifyDiscAcptorInfo";
            }
            this.addForm.activeDt = Number(this.addForm.activeDt.replace(/-/g, ""));

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
      }

    }
  };
</script>
