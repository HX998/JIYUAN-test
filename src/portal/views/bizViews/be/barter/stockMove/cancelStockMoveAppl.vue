<!--库存移出撤回-->
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
                </h-form-item>
-->
                <show-branch v-model="formItem.ownedBrchNames"  :label="$t('m.i.common.ownedBrchNo')"  prop="ownedBrchNames"
                             v-if="this.licenseFlag"    :showCheckBox="true"     :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames"
                             :params="{authPath:this.$route.path}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                             queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item :label="$t('m.i.billInfo.billNo')" prop="likeBillNo">
                  <h-input v-model="formItem.likeBillNo"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="" showTitle>
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="moveOutDtRange" :label="$t('m.i.be.moveApplDt')">
                  <h-date-picker :value="moveOutDtRange" type="daterange" autoPlacement showFormat :editable=false
                                 placeholder="" @on-change="handleMoveOutDtChange"></h-date-picker>
                </h-form-item>
                <!--<h-form-item :label="$t('m.i.be.moveInBrchName')" prop="moveInBrchName" class="h-form-long-label">
                  <h-input v-model="formItem.moveInBrchName" readonly
                           icon="android-search" @on-click="queryCpesBrchCode()"
                           clearable @on-clear="clearVal('moveInBrchName')"></h-input>
                </h-form-item>-->

                <show-cpes-branch :label="$t('m.i.be.moveInBrchName')" class="h-form-long-label"
                                  :brchCode.sync="formItem.moveInBrchCode"  :cpesBrchName.sync="formItem.moveInBrchName"
                                  datagridUrl="/cpes/branch/queryBranchList" prop="moveInBrchName" :cpesBrchParams="{'memberId':memberId}"
                                  queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

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
            url="/be/barter/stockmove/cancelStockMoveAppl/func_queryPendingSubmitBill"
            :bindForm="formItem"
            :hasSelect="hasSelect" rowSelect
            ref="datagrid">
            <div slot="toolbar" class='pull-left'>
              <h-button type="primary" @click="handleCancel()">{{$t('m.i.be.withdraw')}}</h-button>
            </div>
          </h-datagrid>

          <!--库存移出申请撤销弹出窗-->
          <h-msg-box v-model="cancelWin" width="400" @on-close="cancelWinClose" class="h-form-search-layer"
                     :maximize="true">
            <p slot="header">
              <span>库存移出申请撤销</span>
            </p>
            <h-panel>
              <h-form :model="cancelForm" :label-width="90" ref="cancelForm" cols="1" class="h-form-search">
                <h-form-item :label="$t('m.i.be.withdrawRemark')" prop="respRemark" class="h-form-height-auto">
                  <h-input type="textarea" :rows="3" v-model="cancelForm.respRemark" :maxlength=150 :lengthByByte="false"></h-input>
                </h-form-item>
              </h-form>
            </h-panel>
            <div slot="footer">
              <h-button type="ghost" @click="cancelSubmit('close')">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary" @click="cancelSubmit('submit')">{{$t("m.i.common.commit")}}</h-button>
            </div>
          </h-msg-box>
          <!-- 票交机构弹出框 -->
          <!--<show-cpes-branch :showCpesBranch="brchCodeWin" @showCpesBranchClose="brchCodeWinClose" :showMemberId="false"
                            @showCpesBranchSubmit="brchCodeChange" :memberId="memberId"></show-cpes-branch>-->

          <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                          :billId="this.billId"></bill-info-main>
        </div>
      </h-col>
    </h-row>

    <!--<show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true"
                         :checkStrictly="true"></show-license-branch>-->

  </div>
</template>

<script>
  import { post, on, off, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "cancelStockMoveAppl",
    data() {
      return {
        formItem: {
          billNo: "",
          likeBillNo: "",
          billType: "",
          moveInBrchCode: "",
          moveInBrchName: "",
          moveOutDtRange: "",
          minMoveOutDt: "",
          maxMoveOutDt: "",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath: this.$route.path
        },
        moveOutDtRange:[],
        cancelForm: {
          ids: "",
          moveInBrchCode: "",
          moveInBrchName: "",
          respRemark: "",
          ownedBrchNo: "",
          licenseFlag:false,
        },
        billTypeList: [],
        billId: null,
        showBillInfoWin: false,
        type: "",
        optType: "",
        tableRef: "selfTable",
        dictMap: new Map(),
        ifShowMore: false,
        cancelWin: false,
        //brchCodeWin: false,
        currentSelectList: [],
        currentSelectRowInx: [],
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
            ellipsis: false,
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
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.billMoney, 2, ","));
            },
            sortable: true
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
            title: this.$t('m.i.be.moveApplDt'),
            ellipsis: false,
            key: "moveOutDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.moveOutDt == null ? "" : this.$moment(params.row.moveOutDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.billInfo.acptBankName'),
            ellipsis: false,
            key: "acptBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.be.hldrBrchName'),
            key: "hldrBrchName",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.be.moveInBrchName'),
            key: "moveInBrchName",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          }],
        memberId: "",
        hasSelect: false
      };
    },
    components: {
      //ShowCpesBranch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)

    },
    watch: {},
    computed: {},
    methods: {
      /**
       * 列表搜索
       * */
      formSearch() {
        /**清除多页选择的数据*/
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];

        this.unDisabled();
        this.$refs.datagrid.dataChange(1);
      },
      handleMoveOutDtChange(arr){
        if (arr && arr.length >= 2) {
          this.formItem.minMoveOutDt = arr[0].replace(/-/g, "");
          this.formItem.maxMoveOutDt = arr[1].replace(/-/g, "");
          this.moveOutDtRange = [arr[0],arr[1]];
        } else {
          this.formItem.minMoveOutDt = "";
          this.formItem.maxMoveOutDt = "";
          this.moveOutDtRange = [];
        }

      },
      /**
       * 查询区域重置
       * */
      formSearchReset() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.formItem.moveInBrchCode = "";
        this.formItem.minMoveOutDt = "";
        this.formItem.maxMoveOutDt = "";
        this.moveOutDtRange = [];
        this.$refs.formItem.resetFields();
        this.formItem.moveInBrchName = "";
      },
      // handleSelectClick(arr,selectInx) {
      //   this.unDisabled()
      //   this.currentSelectList = arr;
      //   this.currentSelectRowInx = selectInx
      //   if(arr.length==0) return
      // },
      /**
       * 库存变更申请撤销弹出框
       * **/
      handleCancel() {
        let selects = this.$refs.datagrid.selects;
        if (selects != null && selects.length >= 1) {
          this.cancelForm.ids = this.formateListData(selects);
          this.cancelWin = true;
          /*this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "是否确认撤回库存移出申请？",
            onOk: () => {
              this.cancelSubmit("submit");
            }
          });*/
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
        }
      },
      /**
       * 库存变更申请撤销提交
       * */
      cancelSubmit(str) {
        if ("close" == str) {
          this.cancelWin = false;
          this.cancelWinClose();
        } else if ("submit" == str) {
          let url = "/be/barter/stockmove/cancelStockMoveAppl/func_cancelApplyStockMoveAppl";
          post(this.cancelForm, url).then(res => {
            if (res) {
              let return_code = res.data.retCode;
              if (return_code === "000000") {
                this.$msgTip.success(this, { info: "操作成功" });
                this.$refs.datagrid.dataChange(1);
                /**清除多页选择的数据*/
                this.$refs.datagrid.selectIds = [];
                this.$refs.datagrid.selects = [];
                this.cancelWin = false;
                this.cancelWinClose();
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg === null ? "操作失败" : res.data.retMsg });
              }
            } else {
              this.$msgTip.error(this, { info: "操作失败" });
            }
          });
        }
      },
      formateListData(list) {
        let ids = [];
        for (let i = 0, len = list.length; i < len; i++) {
          ids.push(list[i].id);
        }
        return ids.join(",");
      },
      getMemberId(){
        let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
        this.memberId = userInfo.memberId;
      },
      //票交机构弹出框
      /*queryCpesBrchCode() {
        debugger
        let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
        this.memberId = userInfo.memberId;
        this.$nextTick(() => {
          this.brchCodeWin = true;
        });
      },*/
      //根据弹框所选数据进行赋值
      /*brchCodeChange(info) {
        if (info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.moveInBrchCode = info.brchCode;
        this.formItem.moveInBrchName = info.brchFullNameZh;
        this.brchCodeWin = false;
      },*/
      //关闭查询票交机构窗口
      /*brchCodeWinClose() {
        this.brchCodeWin = false;
      },*/
      unDisabled() {
        this.deletDisabled = false;
      },
      cancelWinClose() {
        this.$refs.cancelForm.resetFields();
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showBillInfo(billId) {
        this.billId = billId;
        this.showBillInfoWin = true;
      },
      /*clearVal(type) {
        if (type == "moveInBrchName") {
          this.formItem.moveInBrchCode = "";
          this.formItem.moveInBrchName = "";
        }
      }*/


     /* //根据弹框所选数据进行赋值
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
    },
    mounted() {
      this.getMemberId();
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
