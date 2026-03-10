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
                <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="rangeDueDt">
                  <h-date-picker :value="rangeDueDt" type="daterange" placeholder="" format="yyyy-MM-dd"
                                 showFormat @on-change="handleDueDtChange"></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.otherBrchName')" prop="buyBrchName">
                  <h-input v-model="formItem.saleBrchName" icon="android-search" @on-click="brchCodeWinOpen" readonly
                           clearable @on-clear="clearVal('saleBrchName')"></h-input>
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
        </div>
      </h-col>
    </h-row>
    <!--数据展示表格-->
    <h-datagrid
      :columns="columns"
      hasPage
      highlight-row
      url="/be/trust/transfer/func_queryTransferRebuyBillInitial"
      :bindForm="formItem"
      :row-select="true"
      :has-select="false"
      ref="datagrid">
      <div slot="toolbar" class="pull-left">
        <h-button type="primary" @click="handleRejectForm()">{{$t('m.i.be.refuse')}}</h-button>
      </div>
    </h-datagrid>
    <!-- 搜索按钮弹出框 -->
    <brch-code-search :brchCodeWin="brchCodeWin" @brchCodeWinClose="brchCodeWinClose"
                      @brchCodeChange="brchCodeChange" optType="2"></brch-code-search>

    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="this.billId" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>

  </div>
</template>

<script>
  import { post, on, off ,formatNumber} from "@/api/bizApi/commonUtil";
  import BillMoney from "../../../../../components/bemp/input/billMoney";

  export default {
    name: "transferRebuyReject",
    components: {
      BillMoney,
      BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/buyBrchNameSearch" */`@/views/bizViews/sm/auth/branch/buyBrchNameSearch`),
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
            title: this.$t('m.i.billInfo.billPackageNo'),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId,params.row.billRangeStart, params.row.billRangeEnd);
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
            title: this.$t('m.i.billInfo.billPackageMoney'),
            key: "billMoney",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.billMoney, 2, ','))
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
            title: this.$t('m.i.common.applDt'),
            key: "applDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let applDt = this.$moment(params.row.applDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", applDt);
            }
          },
          {
            title: this.$t('m.i.be.brchName'),
            key: "buyBrchName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.otherBrchName'),
            key: "saleBrchName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: "acptName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.drwrName'),
            key: "drwrName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptBankName'),
            key: "acptBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.transferReason'),
            key: "transferReason",
            hiddenCol: false
          }
        ],
        formItem: {
          billNo: "",
          billType: "",
          billClass: "",
          buyBrchName: "",
          saleBrchName: "",
          saleBrchCode: "",
          rangeDueDt: "",
          minDueDt: "",
          maxDueDt: "",
          isRefuse: "1",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          minBillMoney:"",
          maxBillMoney:"",
          minBillRangeStart:"",
          maxBillRangeEnd:"",
          authPath: this.$route.path,
        },
        rejectForm: {
          billIdsStr: "",
          busiBatchId: ""
        },
        ifShowMore: false,
        billId: null,
        billRangeStart: null,
        billRangeEnd: null,
        showBillInfoWin: false,
        rangeDueDt:[],
        currentSelectList: [],
        billTypeList: [],
        billClassList: [],
        //授权信息
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
        //brchNoWin: false,
        //对方机构名称搜索按钮弹出框
        brchCodeWin: false,
        dictMap: null
      };
    },
    methods: {
      //查询
      formSearch() {

        this.currentSelectList = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      handleDueDtChange(arr){
        if (arr && arr.length >= 2) {
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.rangeDueDt = [arr[0],arr[1]];
        } else {
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.rangeDueDt = [];
        }
      },
      //重置
      formSearchReset() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.rangeDueDt = [];
        this.formItem.saleBrchCode = "";
        this.formItem.saleBrchName = "";
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.$refs.formItem.resetFields();
      },
      //搜索按钮弹出框
      brchCodeWinOpen() {
        this.brchCodeWin = true;
      },
      //关闭按钮搜索框
      brchCodeWinClose() {
        this.brchCodeWin = false;
      },
      //根据弹框所选数据进行赋值
      brchCodeChange(info) {
        this.formItem.saleBrchName = info.brchFullNameZh;//对方机构名称
        this.formItem.saleBrchCode = info.brchCode;
        this.brchCodeWin = false;
      },
      //拒绝
      handleRejectForm() {
        this.currentSelectList = this.$refs.datagrid.selects;
        if (this.currentSelectList != null && this.currentSelectList.length > 0) {
          this.$hMsgBox.confirm({
            title: this.$t("受让拒绝"),
            content: this.$t("确定要受让拒绝吗") + "?",
            onOk: () => {
              this.handleReject();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      //受让拒绝
      handleReject() {
        let list = this.currentSelectList;
        this.rejectForm.billIdsStr = this.formateListData(list);
        post(this.rejectForm, "/be/trust/transfer/transferRebuyReject/func_refuseTransferRebuyBills").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this, { info: this.$t("拒绝成功") });
              this.$refs.datagrid.dataChange(1);
              this.currentSelectList = [];
              this.$refs.datagrid.selectIds = [];
              this.$refs.datagrid.selects = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.$refs.datagrid.dataChange(1);
              this.currentSelectList = [];
              this.$refs.datagrid.selectIds = [];
              this.$refs.datagrid.selects = [];
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
      clearVal(type) {
        if (type == "saleBrchName") {
          this.formItem.saleBrchCode = "";
          this.formItem.saleBrchName = "";
        }
      },

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
      this.getDictListByGroups("DraftTypeCode,CDMedia").then(res => {
        this.billClassList = res.get("CDMedia");
        this.billTypeList = res.get("DraftTypeCode");
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
