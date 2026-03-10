<!--匿名点击-授信额度管理-新增、修改、查看弹出框-->
<template>
  <div>
    <h-msg-box v-model="tempCreditLimitAddOrEditWin" :maximize="true" @on-close="handleClose"
               width="1000" class="h-form-search-layer" top="10" @on-maximize="onMaximize">
      <p slot="header">
        <span v-if="batchParams.batchType==='add'">新增授信额度</span>
        <span v-else-if="batchParams.batchType==='modify'">修改授信额度</span>
        <span v-else-if="batchParams.batchType==='show'">查看授信额度</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="3" class="h-form-search">
          <div>
            <common-input v-model="addOrEditForm.memberId" :label="$t('m.i.common.memberId')" prop="memberId"
                          :maxlength="6" :readonly="true"></common-input>
            <common-input v-model="addOrEditForm.memberName" :label="$t('m.i.common.memberName')" prop="memberName"
                          :maxlength="60" :readonly="true"></common-input>
            <common-input v-model="addOrEditForm.headBrchCode" :label="$t('m.i.common.headCpesBrchCode')"
                          prop="headBrchCode" :maxlength="9" :readonly="true"></common-input>
            <common-input v-model="addOrEditForm.headBrchName" :label="$t('m.i.common.headCpesBrchName')"
                          prop="headBrchName" :readonly="true"></common-input>
            <common-select v-model="addOrEditForm.preValidFlag" :dictList="batchParams.isList"
                           :label="$t('m.i.common.operateFlag')" prop="preValidFlag"
                           :readonly="batchParams.batchType === 'show' || addOrEditForm.status != 'CT_2'" :required="true"></common-select>
          </div>
        </h-form>
        <div style="text-align: right">
          <h-button type="primary" @click="formSave()" v-if="batchParams.batchType!=='show'">保存</h-button>
        </div>
        <h-tabs :animated="false" :value="tabPane" @on-click="clickTabs" ref="closetab">
          <h-tab-pane :label="$t('m.i.be.creditLimitAmt')" name="creditLimitTab">
            <keep-alive>
              <component is="creditLimitTab" ref="creditLimitTab" :batchParams="batchParams"></component>
            </keep-alive>
          </h-tab-pane>
          <h-tab-pane :label="$t('m.i.be.deductCoeff')" name="deductCoeffTab">
            <keep-alive>
              <component is="deductCoeffTab" ref="deductCoeffTab" :batchParams="batchParams"></component>
            </keep-alive>
          </h-tab-pane>
        </h-tabs>
      </div>
      <div slot="footer">
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import { post } from "@/api/bizApi/commonUtil";

  export default {
    name: "creditLimitAdd",
    components: {
      creditLimitTab: () => import(/* webpackChunkName: "be/market/anonyclick/credit/creditLimitTab" */`@/views/bizViews/be/market/anonyclick/credit/creditLimitTab`),
      deductCoeffTab: () => import(/* webpackChunkName: "be/market/anonyclick/credit/deductCoeffTab" */`@/views/bizViews/be/market/anonyclick/credit/deductCoeffTab`)
    },
    data() {
      return {
        batchId: "",
        addOrEditForm: {
          id: "",
          memberId: "",
          memberName: "",
          headBrchCode: "",
          headBrchName: "",
          preValidFlag: "1",
          validFlag: "",
          status: ""
        },
        //记录批次是否已保存
        hadBatchSave: false,
        tabPane: "creditLimitTab"
      };
    },
    props: {
      creditLimitAddOrEditWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      batchParams: {
        type: Object,
        default: {
          dictMap: new Map(),
          isList: [],
          creditMajorList: [],
          tenorVarietiesList: [],
          creditId: "",
          batchType: ""
        }
      }
    },
    computed: {
      tempCreditLimitAddOrEditWin: {
        get() {
          return this.creditLimitAddOrEditWin;
        },
        set() {
        }
      }
    },
    watch: {
      creditLimitAddOrEditWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.batchId = this.batchParams.creditId;
            if (this.batchParams.batchType === "add") {
              this.hadBatchSave = false;
              this.queryMember();
            }
            if (this.batchParams.batchType === "modify" || this.batchParams.batchType === "show") {
              this.hadBatchSave = true;
              this.queryObjById();
              this.handleSearch();
            }
          });
        }
      },
      batchId(val) {
        this.batchId = val;
      }
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      //新增时查询会员信息
      queryMember() {
        post({}, "/be/market/anonyclick/credit/creditLimit/func_findClickCreditTradeAddData").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.addOrEditForm.id = obj.id;
              this.batchParams.creditId = obj.id;
              this.batchId = obj.id;
              this.addOrEditForm.memberId = obj.memberId;
              this.addOrEditForm.memberName = obj.memberName;
              this.addOrEditForm.headBrchCode = obj.headBrchCode;
              this.addOrEditForm.headBrchName = obj.headBrchName;
              this.addOrEditForm.preValidFlag = obj.preValidFlag;
              this.addOrEditForm.validFlag = obj.validFlag;
              this.addOrEditForm.status = obj.status;

              this.$refs.creditLimitTab.$refs.datagrid.tData = [];
              this.$refs.creditLimitTab.creditLimitFormItem.batchId = this.batchParams.creditId;
              this.$refs.deductCoeffTab.$refs.datagrid.tData = [];
              this.$refs.deductCoeffTab.deductCoeffTabFormItem.batchId = this.batchParams.creditId;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //修改时根据批次Id查询批次信息
      queryObjById() {
        let params = { id: this.batchId };
        let url = this.batchParams.batchType === "show" ? "/be/market/anonyclick/credit/creditLimitSearch/func_queryCreditTradeBatchById" : "/be/market/anonyclick/credit/creditLimit/func_queryCreditTradeBatchById";
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.addOrEditForm.id = obj.id;
              this.addOrEditForm.memberId = obj.memberId;
              this.addOrEditForm.memberName = obj.memberName;
              this.addOrEditForm.headBrchCode = obj.headBrchCode;
              this.addOrEditForm.headBrchName = obj.headBrchName;
              this.addOrEditForm.preValidFlag = obj.preValidFlag;
              this.addOrEditForm.validFlag = obj.validFlag;
              this.addOrEditForm.status = obj.status;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //关闭弹窗
      handleClose() {
        this.$refs.addOrEditForm.resetFields();
        this.addOrEditForm.id = "";
        this.hadBatchSave = false;
        this.tabPane = "creditLimitTab";
        this.$refs.creditLimitTab.creditLimitFormItem.transMemberName = "";
        this.$refs.deductCoeffTab.deductCoeffTabFormItem.creditMainBrchClass = "";
        this.$emit("creditLimitAddOrEditWinClose", "");
      },
      //表单查询
      handleSearch() {
        //授信额度
        if (this.tabPane === "creditLimitTab") {
          this.$refs.creditLimitTab.handleSearch();
        }
        //扣除系数
        if (this.tabPane === "deductCoeffTab") {
          this.$refs.deductCoeffTab.handleSearch();
        }
      },
      //保存批次信息
      formSave() {
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            let url = "/be/market/anonyclick/credit/creditLimit/func_updateCreditTradeBatch";
            post(this.addOrEditForm, url).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  if (this.batchParams.batchType === "add" && this.hadBatchSave === false) {
                    this.batchId = res.data.retData.id;
                    this.addOrEditForm.id = res.data.retData.id;
                  }
                  this.$refs.datagrid.dataChange(1);
                  this.$refs.datagrid.selects = [];
                  this.hadBatchSave = true;
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
      //table点击切换事件
      clickTabs(name) {
        this.tabPane = name;
        this.handleSearch();
      }
    }
  };
</script>

<style scoped>

</style>
