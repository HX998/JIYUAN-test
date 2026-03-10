<template>
  <h-msg-box v-model="tempSettleStatusSynchron" :mask-closable="false" @on-close="handleClose" width="400"
             class="h-form-search-layer" :maximize="true" :zIndex="999">
    <p slot="header">
      <span>业务结算状态同步申请</span>
    </p>
    <h-panel>
      <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="1" class="h-form-search">
        <div class="h-search-form-row">
          <show-cpes-branch :label="$t('m.i.common.brchName')" required
                            :brchCode.sync="addOrEditForm.aplBranchCode"  :cpesBrchName.sync="addOrEditForm.aplBranchName"
                            datagridUrl="/cpes/branch/queryBranchList" prop="aplBranchName"  :clearable="false"
                            :cpesBrchParams="{'memberId':needMemberId}"  :msgBoxWin="tempSettleStatusSynchron"
                            queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

          <h-form-item prop="aplBranchCode" v-show="false">
            <h-input v-model="addOrEditForm.aplBranchCode"></h-input>
          </h-form-item>
          <h-form-item label="选择发起方式" prop="choose" required>
            <h-radio-group v-model="addOrEditForm.choose">
              <h-radio label="settleReqNo" @on-click="chooseReqNo">
                <span>结算请求编号</span>
              </h-radio>
              <h-radio label="settleBusiType" @on-click="chooseBusiType">
                <span>业务种类</span>
              </h-radio>
            </h-radio-group>
          </h-form-item>
          <h-form-item label="结算请求编号" prop="settleReqNo" v-if="isSettleReqNo"
                       required :validRules="settleReqNoRule">
            <h-input v-model="addOrEditForm.settleReqNo" :value="addOrEditForm.settleReqNo"
                     placeholder="" :maxlength="35"></h-input>
          </h-form-item>
          <h-form-item label="业务种类" prop="settleBusiType" v-if="isSettleBusiType" required>
            <h-select v-model="addOrEditForm.settleBusiType" @on-change="changeOption" placeholder="">
              <h-option v-for="item in settleBusiTypeList" :value="item.key" :key="item.value"
                        v-if="item.key !== 'T10008'">
                {{item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item label="成交单编号" prop="dealNo" v-if="isDealNo" required>
            <h-input v-model="addOrEditForm.dealNo" :value="addOrEditForm.dealNo"
                     placeholder="" :maxlength="20"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNo" v-if="isBillNo" required>
            <h-input v-model="addOrEditForm.billNo" :value="addOrEditForm.billNo"
                     placeholder="" :maxlength="30"></h-input>
          </h-form-item>
          <bill-range :formItem="addOrEditForm" :rangeProps="['billRangeStart','billRangeEnd']" :isShow="isBillNo"></bill-range>
        </div>
      </h-form>
    </h-panel>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose()">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
      <h-button type="primary" v-else @click="submitForm()">{{$t("m.i.common.commit")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  import { post, on, off, getDictListByGroups } from "@/api/bizApi/commonUtil";

  export default {
    name: "settleStatusSynchron",
    components: {
      //ShowCpesBranch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`)
    },
    data() {
      return {
        addOrEditForm: {
          aplBranchCode: "",
          aplBranchName: "",
          settleReqNo: "",
          settleBusiType: "",
          dealNo: "",
          billNo: "",
          choose: "",
          temp: "",
          billRangeStart: "",
          billRangeEnd: ""
        },
        choose: "",
        needMemberId: "",
        settleBusiTypeList: [],
        isDealNo: false,
        isBillNo: false,
        submitFlag: false,
        isSettleBusiType: false,
        isSettleReqNo: false,
        settleReqNoRule: [{ test: /^([0-9a-zA-Z]{1,35})$/, trigger: "blur", message: "由小于或等于35位数字或字母组成" }],
        //brchCodeWin: false
      };
    },
    mounted() {
      this.getUserInfo();
      getDictListByGroups("StlRequestType").then(res => {
        this.settleBusiTypeList = res.get("StlRequestType");
      });
    },
    props: {
      settleStatusSynchron: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    computed: {
      tempSettleStatusSynchron: {
        get() {
          return this.settleStatusSynchron;
        },
        set() {
        }
      }
    },
    methods: {
      //确定
      submitForm() {
        debugger
        if((this.addOrEditForm.billRangeStart == null && this.addOrEditForm.billRangeEnd != null)
          ||(this.addOrEditForm.billRangeStart != null && this.addOrEditForm.billRangeEnd == null)
          ||(!(this.addOrEditForm.billRangeStart+"") && (this.addOrEditForm.billRangeEnd+""))
          ||((this.addOrEditForm.billRangeStart+"") && !(this.addOrEditForm.billRangeEnd+""))
        ){
          this.$msgTip.error(this, { info: "子票区间的起始值和末尾值必须同时存在" });
          return;
        }
        let flag = false;
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            let url = "/shcpe/cpes/settle/settleStatusSynchron/func_settleStatusQueryApl";
            post(this.addOrEditForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this, { info: this.$t("m.i.common.actionSuccess") });
                  this.$refs["addOrEditForm"].resetFields();
                  this.currentSelectRow = [];
                  flag = true;
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
              this.$emit("settleStatusSynchronSubmit", flag);
            });
          }
        });
      },
      //关闭
      handleClose() {
        this.$refs["addOrEditForm"].resetFields();
        this.isDealNo = false;
        this.isBillNo = false;
        this.isSettleBusiType = false;
        this.isSettleReqNo = false;
        this.addOrEditForm.aplBranchCode = "";
        this.addOrEditForm.aplBranchName = "";
        this.$emit("settleStatusSynchronClose", "");
      },
      changeOption: function(currentValue) {
        if (currentValue === "RE2011" || currentValue === "RE2021" || currentValue === "T10008") {
          this.isDealNo = false;
          this.isBillNo = true;
          this.addOrEditForm.dealNo = "";
        } else {
          this.isDealNo = true;
          this.isBillNo = false;
          this.addOrEditForm.billNo = "";
          this.addOrEditForm.billRangeStart = "";
          this.addOrEditForm.billRangeEnd = "";
        }
      },
      chooseReqNo() {
        this.isSettleReqNo = true;
        this.isSettleBusiType = false;
        this.isDealNo = false;
        this.isBillNo = false;
        this.addOrEditForm.dealNo = "";
        this.addOrEditForm.settleBusiType = "";
        this.addOrEditForm.billNo = "";
        this.addOrEditForm.billRangeStart = "";
        this.addOrEditForm.billRangeEnd = "";
        this.addOrEditForm.temp = "";
      },
      chooseBusiType() {
        this.isSettleBusiType = true;
        this.isDealNo = true;
        this.isBillNo = true;
        this.isSettleReqNo = false;
        this.addOrEditForm.settleReqNo = "";
      },
      getUserInfo() {
        post({}, "/sm/auth/user/queryCurrentLoginInfo").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retData = res.data.retData;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.needMemberId = retData.memberId;
            } else {
              this.$msgTip.error(this, { info: msg });
              this.$refs.datagrid.dataChange(1);
            }
          } else {
            this.$hMessage.error(this.$t("m.i.common.netError"));
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
