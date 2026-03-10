<!--库存移出-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--<h-form-item :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" v-if="this.licenseFlag">
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
                <h-form-item :label="$t('m.i.billInfo.billNo')" prop="likeBillNo">
                  <h-input v-model="formItem.likeBillNo"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="">
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="dueDtRange" :label="$t('m.i.billInfo.dueDt')">
                  <h-date-picker :value="dueDtRange" type="daterange" autoPlacement showFormat :editable=false
                                 placeholder="" @on-change="handleDueDtChange"></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billMoney')">
                  <h-row>
                    <h-col span="11">
                      <h-typefield v-model="formItem.minBillMoney" integerNum="10" placeholder="" type="money"
                                   bigTips></h-typefield>
                    </h-col>
                    <h-col span="2" style="text-align: center">-</h-col>
                    <h-col span="11">
                      <h-typefield v-model="formItem.maxBillMoney" integerNum="10" placeholder="" type="money"
                                   bigTips></h-typefield>
                    </h-col>
                  </h-row>
                </h-form-item>
          <!--      <h-form-item :label="$t('m.i.billInfo.ownershipBankName')" prop="ownershipBankName" class="h-form-long-label">
                  <h-input v-model="formItem.ownershipBankName" readonly
                           icon="android-search" @on-click="queryBrchCodeWinOpen"
                           clearable @on-clear="clearVal('ownershipBankName')"></h-input>
                </h-form-item>-->
                <show-cpes-branch v-model="formItem.ownershipBrchCode" :label="$t('m.i.billInfo.ownershipBankName')" class="h-form-long-label" prop="ownershipBankName"
                                  :brchCode.sync="formItem.ownershipBrchCode"  :cpesBrchName.sync="formItem.ownershipBankName"
                                  datagridUrl="/cpes/branch/queryBranchList"
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
            url="/be/barter/stockmove/stockMoveAppl/func_queryStockBill"
            :paramId="'stockId'"
            :bindForm="formItem"
            :hasSelect="hasSelect" rowSelect
            ref="datagrid">
            <div slot="toolbar" class='pull-left'>
              <h-button type="primary" @click="handleSend()">{{$t('m.i.be.moveOut')}}</h-button>
            </div>
          </h-datagrid>

          <!--库存移出申请弹出窗-->
          <h-msg-box v-model="sendWin" @on-close="sendWinClose" width="400" class="h-form-search-layer"
                     :maximize="true">
            <p slot="header">
              <span>库存移出申请</span>
            </p>
            <h-panel>
              <h-form :model="sendForm" :label-width="90" ref="sendForm" cols="1" class="h-form-search">
      <!--          <h-form-item :label="$t('m.i.be.moveInBrchCode')" prop="moveInBrchName" required class="h-form-long-label">
                  <h-input v-model="sendForm.moveInBrchName" readonly
                           icon="android-search" @on-click="queryCpesBrchCode()"></h-input>
                </h-form-item>-->
                <show-cpes-branch v-model="sendForm.moveInBrchCode" :label="$t('m.i.be.moveInBrchCode')" class="h-form-long-label" prop="moveInBrchName" :required="true"
                                  :brchCode.sync="sendForm.moveInBrchCode"  :cpesBrchName.sync="sendForm.moveInBrchName"
                                  datagridUrl="/cpes/branch/queryBranchList"   :cpesBrchParams="{'memberId':memberId}"  :msgBoxWin="sendWin"
                                  queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                <h-form-item :label="$t('m.i.be.reqRemark')" prop="reqRemark" class="h-form-height-auto">
                  <h-input type="textarea" :rows="3" v-model="sendForm.reqRemark" :maxlength=150 :lengthByByte="false"></h-input>
                </h-form-item>
              </h-form>
            </h-panel>
            <div slot="footer">
              <h-button type="ghost" @click="sendSubmit('close')">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary" @click="sendSubmit('submit')">{{$t("m.i.common.commit")}}</h-button>
            </div>
          </h-msg-box>

 <!--         &lt;!&ndash; 票交机构弹出框 &ndash;&gt;
          <show-cpes-branch :showCpesBranch="brchCodeWin" @showCpesBranchClose="brchCodeWinClose" :showMemberId="false"
                            @showCpesBranchSubmit="brchCodeChange" :memberId="memberId"></show-cpes-branch>
          <brch-code-search :brchCodeWin="brchCodeWinOpen" @brchCodeWinClose="brchCodeWinOpenClose"
                            @brchCodeChange="brchCodeWinOpenChange" optType="2"></brch-code-search>-->

          <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                          :billId="this.billId"></bill-info-main>
        </div>
      </h-col>
    </h-row>

  <!--  <show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true"
                         :checkStrictly="true"></show-license-branch>-->

  </div>
</template>

<script>
  import { post, on, off, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "stockMoveAppl",
    data() {
      return {
        formItem: {
          likeBillNo: "",
          billType: "",
          minBillMoney: "",
          maxBillMoney: "",
          dueDtRange: "",
          minDueDt: "",
          maxDueDt: "",
          ownershipBankName: "",
          ownershipBrchCode: "",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath: this.$route.path
        },
        dueDtRange:[],
        sendForm: {
          ids: "",
          billIds: "",
          stockIds: "",
          moveInBrchCode: "",
          moveInBrchName: "",
          reqRemark: "",
          ownedBrchNo: "",
          licenseFlag:false,
        },

        billTypeList: [],
        billId: null,
        showBillInfoWin: false,
        type: "",
        optType: "",
        dictMap: new Map(),
        tableRef: "selfTable",
        ifShowMore: false,
        sendWin: false,
        //brchCodeWin: false,
        //brchCodeWinOpen: false,
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
        //库存移出列表
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
                    this.showBillInfo(params.row.id);
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
            title: this.$t('m.i.billInfo.acptBankName'),
            ellipsis: false,
            key: "acptBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.ownershipBankName'),
            key: "ownershipBankName",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          }
        ],
        memberId: "",
        hasSelect: false
      };
    },
    components: {
      //ShowCpesBranch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
      //BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`),
     // ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)

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
      handleDueDtChange(arr){
        if (arr && arr.length >= 2) {
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDtRange = [arr[0],arr[1]];
        } else {
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDtRange = [];
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
        this.dueDtRange = [];
        this.formItem.ownershipBrchCode = "";
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.$refs.formItem.resetFields();
      },
      // handleSelectClick(arr,selectInx) {
      //   this.unDisabled()
      //   this.currentSelectList = arr;
      //   this.currentSelectRowInx = selectInx
      //   if(arr.length==0) return
      // },
      /**
       * 库存变更申请弹出框
       * **/
      handleSend() {
        let list = this.$refs.datagrid.selects;
        if (null === list || list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        let ownedBrchNo = "";
        let flag = true;
        list.forEach(row => {
          if (ownedBrchNo !== "" && ownedBrchNo !== row.ownedBrchNo) {
            this.$msgTip.info(this, { info: "请选择相同的业务所属机构下的票据发起库存移出" });
            return flag = false;
          }
          ownedBrchNo = row.ownedBrchNo;
        });
        let billIds = [];
        let stockIds = [];
        for (let i = 0, len = list.length; i < len; i++) {
          billIds.push(list[i].billId);
          stockIds.push(list[i].stockId);
        }
        this.sendForm.billIds = billIds;
        this.sendForm.stockIds = stockIds;
        this.sendForm.ownedBrchNo = ownedBrchNo;
        this.sendForm.licenseFlag = this.licenseFlag;
        if(flag){
          this.sendWin = true;
        }

      },
/*      queryBrchCodeWinOpen() {
        this.brchCodeWinOpen = true;
      },
      //根据弹框所选数据进行赋值
      brchCodeWinOpenChange(info) {
        if (info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.ownershipBrchCode = info.brchCode;
        this.formItem.ownershipBankName = info.brchFullNameZh;
        this.brchCodeWinOpen = false;
      },
      //关闭查询票交机构窗口
      brchCodeWinOpenClose() {
        this.brchCodeWinOpen = false;
      },*/
      /**
       * 库存变更申请提交
       * */
      sendSubmit(str) {
        if ("close" == str) {
          this.sendWin = false;
          this.sendWinClose();
        } else if ("submit" == str) {
          this.$refs["sendForm"].validate(valid => {
            if (valid) {
              let url = "/be/barter/stockmove/stockMoveAppl/func_saveStockMoveApplAndSend";
              post(this.sendForm, url).then(res => {
                if (res) {
                  let return_code = res.data.retCode;
                  if (return_code === "000000") {
                    this.$msgTip.success(this, { info: "操作成功" });
                    this.$refs.datagrid.dataChange(1);
                    /**清除多页选择的数据*/
                    this.$refs.datagrid.selectIds = [];
                    this.$refs.datagrid.selects = [];
                    this.sendWin = false;
                    this.sendWinClose();
                  } else {
                    this.$msgTip.error(this, { info: res.data.retMsg === null ? "操作失败" : res.data.retMsg });
                  }
                } else {
                  this.$msgTip.error(this, { info: "操作失败" });
                }
              });
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
      unDisabled() {
        this.deletDisabled = false;
      },
      sendWinClose() {
        this.sendForm.moveInBrchCode = "";
        this.sendForm.moveInBrchName = "";
        this.$refs.sendForm.resetFields();
      },
/*      //票交机构弹出框
      queryCpesBrchCode() {
        let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
        this.memberId = userInfo.memberId;
        this.brchCodeWin = true;
      },
      //根据弹框所选数据进行赋值
      brchCodeChange(info) {
        if (info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        this.sendForm.moveInBrchCode = info.brchCode;
        this.sendForm.moveInBrchName = info.brchFullNameZh;
        this.brchCodeWin = false;
      },
      //关闭查询票交机构窗口
      brchCodeWinClose() {
        this.brchCodeWin = false;
      },*/
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showBillInfo(billId) {
        this.billId = billId;
        this.showBillInfoWin = true;
      },
/*      clearVal(type) {
        if (type == "ownershipBankName") {
          this.formItem.ownershipBrchCode = "";
          this.formItem.ownershipBankName = "";
        }
      },*/

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
      let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
      this.memberId = userInfo.memberId;
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
