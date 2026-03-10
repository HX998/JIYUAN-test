<!--保证增信签收方记账主页面 -->
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
                  <h-input v-model="formItem.likeBillNo" :maxLength="30" placeholder=" "></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder=" ">
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <!--<h-form-item label="票据介质：" prop="billClass">-->
                <!--<h-select v-model="formItem.billClass" placeholder=" ">-->
                <!--<h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{item.value }}</h-option>-->
                <!--</h-select>-->
                <!--</h-form-item>-->
                <h-form-item class="h-form-operate">
                  <!-- <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>-->
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
            url="/be/barter/guarntrtrust/guarntrTrustSignAcct/func_queryPendingSignAcct"
            :bindForm="formItem"
            :hasSelect="hasSelect" rowSelect
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="account">{{$t('m.i.be.acct')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <acct-record :param="param"
                 :showAcctRecordWin="showAcctRecordWin"
                 :showPrintButton="showPrintButton"
                 @showAcctRecordWinClose="showAcctRecordWinClose"
                 :url="acctRecord"
                 @acctSubmitSure="acctRecordSure">
    </acct-record>

    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="this.billId"></bill-info-main>

    <!--<show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true"
                         :checkStrictly="true"></show-license-branch>-->

  </div>
</template>
<script>
  import {  post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "guarntrTrustSignAcct",
    data() {
      return {
        accountUrl: "/be/barter/guarntrtrust/guarntrTrustSignAcct/func_guarnTrustSignAcct",
        acctRecord: "/be/barter/guarntrtrust/guarntrTrustSignAcct/func_getGuarnTrustSignAcctRecord",
        dictMap: new Map(),
        columns: [
          {
            type: "selection",
            align: "center",
            width: 50,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            align: "center",
            width: 60,
            hiddenCol: false
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
            title: this.$t('m.i.billInfo.billMoneyByUnit'),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", formatNumber(params.row.billMoney, 2, ","));
            }
          },
          {
            title: this.$t('m.i.billInfo.ecdsBillStatus'),
            key: "billStatus",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "BarterTrustStatus", params.row.billStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
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
            title: this.$t('m.i.common.acctStatus'),
            key: "acctStatus",
            hiddenCol: false,
            render: (h, params) => {
              return h("div", [
                h("span", this.formatteracctStatus(params.row.acctStatus, params.row, params.row.index))
              ]);
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
            title: this.$t('m.i.be.reqRemark'),
            key: "reqRemark",
            hiddenCol: false,
            sortable: true
          }
        ],
        formItem: {
          billNo: "",
          likeBillNo: "",
          billType: "",
          billClass: "",
          acctStatus: "",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath: this.$route.path
        },
        ifShowMore: false,
        showbrch: false,
        busiTypeList: [],
        selectData: [],
        billTypeList: [],
        billClassList: [],
        billStatusList: [],
        showAcctRecordWin: false,
        showPrintButton: false,
        id: "",
        ids: "",
        billId: null,
        showBillInfoWin: false,
        param: {},
        hasSelect: false,
        //授权信息
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
        //brchNoWin: false,
      };
    },
    components: {
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)

    },
    mounted() {
      this.getDictListByGroups("CDMedia,DraftTypeCode,BarterTrustStatus").then(res => {
        this.billClassList = res.get("CDMedia");
        this.billTypeList = res.get("DraftTypeCode");
        this.billStatusList = res.get("BarterTrustStatus");
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
    },
    methods: {
      formSearch() {
        /**清除多页选择的数据*/
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.$refs.formItem.resetFields();
      },
      handleSelectClick(i) {
        this.selectData = i;
      },
      // 关闭记账窗口
      showAcctRecordWinClose() {
        this.showPrintButton = false;
        this.showAcctRecordWin = false;
        this.$refs.datagrid.dataChange(1);
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
      },
      acctRecordSure(info) {
        let list = this.$refs.datagrid.selects;
        if (list != null && list.length > 0) {
          let ids = "";
          for (let i = 0, count = list.length; i < count; i++) {
            ids += list[i].id;
            if (i < list.length - 1) {
              ids += ",";
            }
          }
          post({ ids: ids,ownedBrchNo:info.ownedBrchNo,licenseFlag:this.licenseFlag }, this.accountUrl).then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode == "000000") {
                this.showPrintButton = true;
                if (!info.isHasPrint) {
                  this.showAcctRecordWinClose();
                }
                this.$msgTip.success(this);
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
                this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      account() {
        let list = this.$refs.datagrid.selects;
        if (null === list || list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        let ownedBrchNo = "";
        let flag = true;
        list.forEach(row => {
          if (ownedBrchNo !== "" && ownedBrchNo !== row.ownedBrchNo) {
            this.$msgTip.info(this, { info: "请选择相同的机构下的票据记账" });
            return flag = false;
          }
          ownedBrchNo = row.ownedBrchNo;
        });

        let ids = "";
        for (let i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        this.param = { ids: ids ,ownedBrchNo:ownedBrchNo,licenseFlag:this.licenseFlag };

        if(flag){
          this.showAcctRecordWin = true;
        }

      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showBillInfo(billId) {
        this.billId = billId;
        this.showBillInfoWin = true;
      },
      formatteracctStatus(value) {
        if (value != null && value != "") {
          switch (value) {
            case "0":
              return "未记账";
            case "1":
              return "记账成功";
            case "2":
              return "记账失败";
            case "3":
              return "记账中";
            case "9":
              return "无需记账";
          }
        } else {
          return "";
        }
      },

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
    }
  };
</script>
<style scoped>

</style>
