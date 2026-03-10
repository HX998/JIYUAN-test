<!--保证增信移出（复核通过发送申请报文）-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
               <!-- <h-form-item :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" v-if="this.licenseFlag">
                  <h-input v-model="formItem.ownedBrchNames" icon="android-search" @on-click="brchNoWinOpen"
                           readonly clearable @on-clear="clearVal1('license')"
                           :title="formItem.ownedBrchNames"></h-input>
                </h-form-item>-->
                <show-branch v-model="formItem.ownedBrchNames"  :label="$t('m.i.common.ownedBrchNo')"  prop="ownedBrchNames"
                             v-if="this.licenseFlag"    :showCheckBox="true"     :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames"
                             :params="{authPath:this.$route.path}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                             queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder=" ">
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billNo')" prop="likeBillNo">
                  <h-input v-model="formItem.likeBillNo" placeholder=" " :maxlength="30"></h-input>
                </h-form-item>
                  <show-cpes-branch v-model="formItem.guarntrTrustBrchCode" :label="$t('m.i.billInfo.guarntrTrustBrchName')"  class="h-form-long-label"  prop="guarntrTrustBrchName"
                                    :brchCode.sync="formItem.guarntrTrustBrchCode"  :cpesBrchName.sync="formItem.guarntrTrustBrchName"
                                    datagridUrl="/cpes/branch/queryBranchList"
                                    queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                <bill-money :formItem="formItem"></bill-money>
                <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')">
                  <h-date-picker :value="dueDt" format="yyyy-MM-dd" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleDueDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/be/barter/guarntrtrust/checkGuarntrTrustAppl/func_queryPendingCheckBill"
            :bindForm="formItem"
            :hasSelect="hasSelect" rowSelect
            ref="datagrid">
            <div slot="toolbar" class='pull-left'>
              <h-button type="primary" @click="handleCancel()">{{$t('m.i.be.moveOut')}}</h-button>
              <h-button type="primary" @click="cancelSendApply()">{{$t('m.i.be.cancelMoveOut')}}</h-button>
            </div>
          </h-datagrid>
          <!-- 票交机构弹出框 -->
     <!--     <brch-code-search :brchCodeWin="brchCodeWin" @brchCodeWinClose="brchCodeWinClose"
                            @brchCodeChange="brchCodeChange" optType="2"></brch-code-search>-->

          <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                          :billId="this.billId"></bill-info-main>
        </div>
      </h-col>
    </h-row>

   <!-- <show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true"
                         :checkStrictly="true"></show-license-branch>-->

  </div>
</template>
<script>
  import { post, on, off, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "checkGuarntrTrustAppl",
    data() {
      return {
        formItem: {
          billNo: "",
          likeBillNo: "",
          billType: "",
          guarntrTrustBrchCode: "",
          guarntrTrustBrchName: "",
          minBillMoney: "",
          maxBillMoney: "",
          minDueDt: "",
          maxDueDt: "",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath: this.$route.path
        },
        dueDt: [],
        billTypeList: [],
        type: "",
        optType: "",
        billId: null,
        showBillInfoWin: false,
        tableRef: "selfTable",
        dictMap: new Map(),
        ifShowMore: false,
        cancelWin: false,
        brchCodeWin: false,
        currentSelectList: [],
        currentSelectRowInx: [],
        brchType: "",
        hasSelect: false,
        //授权信息
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
        //brchNoWin: false,

        columns: [
          {
            type: "selection",
            width: 50,
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
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "ownedBrchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billNo'),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t('m.i.billInfo.billMoney'),
            key: "billMoney",
            hiddenCol: false,
            type: "money",
            sortable: true,
            render: (h, params) => {
              return h("span", formatNumber(params.row.billMoney, 2, ","));
            }
          },
          {
            title: this.$t('m.i.common.applDt'),
            key: "applDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.applDt == null ? "" : this.$moment(params.row.applDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.dueDt == null ? "" : this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.billInfo.ownershipBrchName'),
            key: "ownershipBrchName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.guarntrTrustBankName'),
            key: "guarntrTrustBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.be.stockName'),
            key: "stockName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.acptBankName'),
            key: "acptBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.discBankName'),
            key: "discBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.be.reqRemark"),
            key: "reqRemark",
            hiddenCol: false,
            sortable: true
          }]
      };
    },
    components: {
      //BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`),
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)

    },
    watch: {},
    computed: {},
    methods: {
      /**
       * 列表搜索
       * */
      formSearch() {
        this.formItem.minDueDt = this.formItem.minDueDt.replace(/-/g, "");
        this.formItem.maxDueDt = this.formItem.maxDueDt.replace(/-/g, "");
        this.unDisabled();
        /**清除多页选择的数据*/
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      /**
       * 查询区域重置
       * */
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.formItem.moveInBrchCode = "";
        this.formItem.guarntrTrustBrchCode = "";
        this.dueDt = [];
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
      },
      handleSelectClick(arr, selectInx) {
        this.unDisabled();
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
        if (arr.length == 0) return;
      },
      /**
       * 发送申请处理
       * **/
      handleCancel(str) {
        let selects = this.$refs.datagrid.selects;
        if (selects != null && selects.length > 0) {
          this.type = str;
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确认要移出吗?",
            onOk: () => {
              //let ids = this.formateListData(this.currentSelectList);
              let list = this.$refs.datagrid.selects;
              let ids = "";
              for (let i = 0, count = list.length; i < count; i++) {
                ids += list[i].id;
                if (i < list.length - 1) {
                  ids += ",";
                }
              }
              post({ idList: ids }, "/be/barter/guarntrtrust/checkGuarntrTrustAppl/func_submitCheckTrustApply").then(res => {
                if (res) {
                  let return_code = res.data.retCode;
                  if (return_code === "000000") {
                    this.$msgTip.success(this);
                    /**清除多页选择的数据*/
                    this.$refs.datagrid.selectIds = [];
                    this.$refs.datagrid.selects = [];
                    this.$refs.datagrid.dataChange(1);
                  } else {
                    this.$msgTip.error(this, { info: res.data.retMsg });
                  }
                } else {
                  this.$msgTip.error(this, { info: "操作失败" });
                }
              });
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });

        }
      },
      /**
       * 取消发送申请处理
       * **/
      cancelSendApply(str) {
        let selects = this.$refs.datagrid.selects;
        if (selects != null && selects.length > 0) {
          this.type = str;
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确认要终止移出吗?",
            onOk: () => {
              let list = this.$refs.datagrid.selects;
              let ids = "";
              for (let i = 0, count = list.length; i < count; i++) {
                ids += list[i].id;
                if (i < list.length - 1) {
                  ids += ",";
                }
              }
              post({ idList: ids }, "/be/barter/guarntrtrust/checkGuarntrTrustAppl/func_refuseEnhancingTrustApply").then(res => {
                if (res) {
                  let return_code = res.data.retCode;
                  if (return_code === "000000") {
                    this.$msgTip.success(this);
                    this.$refs.datagrid.dataChange(1);
                    /**清除多页选择的数据*/
                    this.$refs.datagrid.selectIds = [];
                    this.$refs.datagrid.selects = [];
                  } else {
                    this.$msgTip.error(this, { info: res.data.retMsg });
                    this.$refs.datagrid.dataChange(1);
                  }
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              });
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      formateListData(list) {
        let ids = [];
        for (let i = 0, len = list.length; i < len; i++) {
          ids.push(list[i].id);
        }
        return ids.join(",");
      },
     /* //票交机构弹出框
      queryCpesBrchCode(str) {
        this.brchType = str;
        this.brchCodeWin = true;
      },
      //根据弹框所选数据进行赋值
      brchCodeChange(info) {
        if (info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        if (this.brchType === "ownership") {
          this.formItem.ownershipBrchCode = info.brchCode;
          this.formItem.ownershipBrchName = info.brchFullNameZh;
        }
        if (this.brchType === "move") {
          this.formItem.guarntrTrustBrchCode = info.brchCode;
          this.formItem.guarntrTrustBrchName = info.brchFullNameZh;
        }
        this.brchCodeWin = false;
      },
      clearVal(type) {
        if (type == "guarntrTrustBrchName") {
          this.formItem.guarntrTrustBrchCode = "";
          this.formItem.guarntrTrustBrchName = "";
        }
        if (type == "ownershipBrchName") {
          this.formItem.ownershipBrchCode = "";
          this.formItem.ownershipBrchName = "";
        }
      },
      //关闭查询票交机构窗口
      brchCodeWinClose() {
        this.brchCodeWin = false;
      },*/
      unDisabled() {
        this.deletDisabled = false;
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showBillInfo(billId) {
        this.billId = billId;
        this.showBillInfoWin = true;
      },
/*
      //根据弹框所选数据进行赋值
      brchNoChange(info) {
        let objs = [];
        if (info instanceof Array) {
          objs = info;
        } else {
          objs[0] = info;
        }
        let brchNos = "";
        let brchNames = "";
        for (var i = 0; i < objs.length; i++) {
          brchNos += objs[i].id + ",";
          brchNames += objs[i].title + ",";
        }
        this.formItem.ownedBrchNos = brchNos.substring(0, brchNos.length - 1);
        this.formItem.ownedBrchNames = brchNames.substring(0, brchNames.length - 1);
        this.brchNoWin = false;
      },
      brchNoWinOpen() {
        this.brchNoWin = true;
      },
      brchNoWinClose() {
        this.brchNoWin = false;
      },*/
      handleDueDtChange(arr) {
        if(arr && arr.length == 2){
          this.dueDt = [arr[0], arr[1]];
          this.formItem.minDueDt = arr[0].toString().replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].toString().replace(/-/g, "");
        } else {
          this.dueDt = [];
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
        }
      }
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.dictMap = res.get("map");
      });

      post({ authPath: this.$route.path }, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            if (this.licenseFlag) {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
            } else {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", true);
            }
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    }
  };
</script>

<style scoped>

</style>
