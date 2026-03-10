<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.ownedBrchNames"  :label="$t('m.i.common.ownedBrchNo')"  prop="ownedBrchNames"
                             v-if="this.licenseFlag"    :showCheckBox="true"     :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames"
                             :params="{authPath:this.$route.path}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                             queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNo">
                  <h-input v-model="formItem.billNo"></h-input>
                </h-form-item>
                <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="" showTitle>
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass">
                  <h-select v-model="formItem.billClass" placeholder="" showTitle>
                    <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billPackageMoney')" class="h-form-long-label">
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
                <show-cpes-branch  :label="$t('m.i.be.alieneeBrchName')" class="h-form-long-label"  :required="isRequired"
                                   :brchCode.sync="formItem.buyBrchCode"
                                   datagridUrl="/cpes/branch/queryBranchList" prop="buyBrchCode"
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
            url="/be/trust/transfer/transferSaleApplyRollBack/func_queryTransferSaleBill"
            :bindForm="formItem"
            :row-select="true"
            :has-select="false"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="rollbackComfirm()">{{$t('m.i.be.revokeAppl')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <h-msg-box v-model="transferSaleApplyRollBackWin" width="400" class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span>撤回申请意见描述</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="90" ref="addForm" cols="1" class="h-form-search">
          <h-form-item label="备注" prop="reqRemark" class="h-form-height-auto">
            <h-input type="textarea" :rows="3" v-model="addForm.remark"
                     :maxlength=150></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="transferSaleApplyRollBackSubmit('close')">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="transferSaleApplyRollBackSubmit('submit')">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="this.billId" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>

  </div>
</template>

<script>
  import { post, on, off,formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "transferSaleApplyRollBack",
    components: {
      //BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`),
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)

    },
    data() {
      return {
        columns: [
          {
            type: "selection",
            width: 60,
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
            title: this.$t('m.i.be.transferStatus'),
            key: "transferStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "TransferSaleBillStatus", params.row.transferStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageNo'),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId, params.row.billRangeStart, params.row.billRangeEnd);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            key:"billRange",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.pageShowFormatBillRange(params.row.billRangeStart, params.row.billRangeEnd);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageMoney'),
            key: "billMoney",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.billMoney, 2, ','))
            }
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.billClass'),
            key: "billClass",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: "remitDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let remitDt = this.$moment(params.row.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", remitDt);
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dueDt = this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", dueDt);
            }
          },
          {
            title: this.$t('m.i.billInfo.drwrName'),
            key: "drwrName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.be.drweName'),
            key: "acptName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptBrchCode'),
            key: "acptBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptBankName'),
            key: "acptBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.discBrchCode'),
            key: "discBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.discBankName'),
            key: "discBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.guarntrTrustBrchCode'),
            key: "guarntrTrustBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.guarntrTrustBankName'),
            key: "guarntrTrustBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.cfmAppBrchCode'),
            key: "cfmAppBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.cfmAppBankName'),
            key: "cfmAppBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptGuarntrBrchCode'),
            key: "acptGuarntrBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptGuarntrBankName'),
            key: "acptGuarntrBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.dsctGrntBrCode'),
            key: "busiBatchNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.discGuarntrBankName'),
            key: "busiBatchNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.alieneeBrchName'),
            key: "buyBrchName",
            sortable: true,
            hiddenCol: false
          }
        ],
        formItem: {
          billNo: "",
          billType: "",
          billClass: "",
          minBillMoney: "",
          maxBillMoney: "",
          buyBrchCode: "",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          minBillRangeStart:"",
          maxBillRangeEnd:"",
          authPath: this.$route.path,
        },
        addForm: {
          billIdsStr: "",//票据明细id集合
          batchIdsStr: "",//业务批次id集合
          remark:"",
          ownedBrchNo:"",
          ownedBrchName:"",
          licenseFlag:false,
        },
        billTypeList: [],
        billClassList: [],
        transferSaleBillStatusList: [],
        dictMap: null,
        //授权信息
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
       // brchNoWin: false,
        //对方机构号码搜索框
        //brchCodeWin: false,
        billId: null,
        billRangeStart: null,
        billRangeEnd: null,
        showBillInfoWin: false,
        ifShowMore: false,
        id: "",
        batchIds: "",
        currentSelectList: [],
        transferSaleApplyRollBackWin:false,
      };
    },
    methods: {
      transferSaleApplyRollBackSubmit(str){
        if ("close" === str) {
          this.transferSaleApplyRollBackWin = false;
          this.addForm.remark="";
        } else if ("submit" === str) {
          this.rollback();
          this.addForm.remark="";
        }
      },
      formSearch() {
        this.currentSelectList = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.$refs.formItem.resetFields();
        this.formItem.buyBrchCode = "";
        this.hasCommitDisabled = false;
        this.noCommitDisabled = false;
      },
      //点击对方机构名称搜索按钮弹出框
      /*brchCodeWinOpen() {
        this.brchCodeWin = true;
      },*/
      //关闭搜索弹出框
      /*brchCodeWinClose() {
        this.brchCodeWin = false;
      },*/
      //根据弹框所选数据进行赋值
      /*brchCodeChange(info) {
        this.formItem.buyBrchCode = info.brchCode;//将交易额大行行号赋值给对方机构号码
        this.brchCodeWin = false;
      },*/
      //撤回申请
      rollbackComfirm() {
        this.currentSelectList = this.$refs.datagrid.selects;
        if (this.currentSelectList != null && this.currentSelectList.length > 0) {
          this.transferSaleApplyRollBackWin = true;
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      //撤回
      rollback() {
        let list = this.currentSelectList;
        this.addForm.billIdsStr = this.formateListData(list);
        this.addForm.batchIdsStr = this.formateBatchIdListData(list);
        post(this.addForm,"/be/trust/transfer/transferSaleApplyRollBack/func_rollbackTransferSaleBatch").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this, { info: this.$t("撤回成功") });
              this.$refs.datagrid.dataChange(1);
              this.currentSelectList = [];
              this.$refs.datagrid.selectIds = [];
              this.$refs.datagrid.selects = [];
              this.transferSaleApplyRollBackWin=false;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          }
        });
      },
      formateListData(list) {
        let ids = [];
        for (let i = 0, len = list.length; i < len; i++) {
          ids.push(list[i].id);
        }
        return ids.join(",");
      },
      formateBatchIdListData(list) {
        let ids = [];
        for (let i = 0, len = list.length; i < len; i++) {
          ids.push(list[i].busiBatchId);
        }
        return ids.join(",");
      },
      billInfoWinClose() {
        this.billId = null;
        this.billRangeStart = null;
        this.billRangeEnd = null;
        this.showBillInfoWin = false;
      },
      showBillInfo(billId,billRangeStart,billRangeEnd) {
        this.billId = billId;
        this.billRangeStart = billRangeStart;
        this.billRangeEnd = billRangeEnd;
        this.showBillInfoWin = true;
      },
      /*clearVal() {
        this.formItem.buyBrchCode = "";
      },*/

      //根据弹框所选数据进行赋值
     /* brchNoChange(info) {
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
      pageShowFormatBillRange(billRangeStart, billRangeEnd) {
        if (billRangeStart == null || billRangeStart === ""
          || billRangeEnd == null || billRangeEnd === "") {
          return '-';
        }
        if (billRangeStart.toString() === '0' && billRangeEnd.toString() === '0') {
          return '0';
        }
        return billRangeStart.toString().padLeft(12, '0') + "," + billRangeEnd.toString().padLeft(12, '0');
      }
    },
    created() {
      this.getDictListByGroups("DraftTypeCode,CDMedia,TransferSaleBillStatus").then(res => {
        this.billClassList = res.get("CDMedia");
        this.billTypeList = res.get("DraftTypeCode");
        this.transferSaleBillStatusList = res.get("TransferSaleBillStatus");
        this.dictMap = res.get("map");
      });
    },

    mounted() {
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
