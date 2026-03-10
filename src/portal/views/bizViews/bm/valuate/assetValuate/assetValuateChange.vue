<!-- 估值管理-估值调整 -->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.belongBrchNos" :label="$t('m.i.common.ownedBrchNo')" prop="belongBrchNos"
                             title="机构名称" :brchNo.sync="formItem.belongBrchNos"
                             :brchName.sync="formItem.belongBrchNames">
                </show-branch>
                <common-select v-model="formItem.prodNo" prop="prodNo" :dictList="billSourceList"
                               :label="$t('m.i.billInfo.businessSource')"></common-select>
                <common-select v-model="formItem.assetIndustry" prop="assetIndustry" :dictList="assetIndustryList"
                               :label="$t('m.i.be.assetIndustry')"></common-select>
                <common-date-picker v-model="buyDt" :label="$t('m.i.be.buyDt')"
                                    type="daterange" :rangeValue="['minBuyDt','maxBuyDt']"
                                    :minBuyDt.sync="formItem.minBuyDt" :maxBuyDt.sync="formItem.maxBuyDt">
                </common-date-picker>
                <common-input v-model="formItem.transCustName" :label="$t('m.i.bm.transCustName')"
                              prop="transCustName"></common-input>
<!--                <common-date-picker v-model="valuateDt" :label="$t('m.i.bm.sysValuateDt')"-->
<!--                                    type="daterange" :rangeValue="['valuateMinDt','valuateMaxDt']"-->
<!--                                    :valuateMinDt.sync="formItem.valuateMinDt"-->
<!--                                    :valuateMaxDt.sync="formItem.valuateMaxDt">-->
<!--                </common-date-picker>-->

                <!-- 票据来源 -->
                <common-select :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                               v-model="formItem.billOrigin" :dictList="billOriginList"></common-select>

                <!-- 票据号码 -->
                <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNoLike">
                  <h-input v-model="formItem.billNoLike" :maxLength="20"></h-input>
                </h-form-item>
                <!-- 子票区间 -->
                <bill-range :formItem="formItem" :rangeProps="['billRangeStart','billRangeEnd']" ></bill-range>

                <remit-dt-range v-model="remitDt" :minRemitDt.sync="formItem.minRemitDt"
                                :maxRemitDt.sync="formItem.maxRemitDt"></remit-dt-range>
                <due-dt-range v-model="dueDt" :minDueDt.sync="formItem.minDueDt"
                              :maxDueDt.sync="formItem.maxDueDt"></due-dt-range>
                <bill-money-range v-model="formItem" :rangeProps="['minbillMoney','maxbillMoney']"></bill-money-range>

                <bill-type v-model="formItem.billType" :dictList="billTypeList"></bill-type>
                <bill-class v-model="formItem.billClass" :dictList="billClassList"></bill-class>
                <common-select v-model="formItem.operStatus" prop="operStatus" :dictList="operStatusList"
                               :label="$t('m.i.common.status')"></common-select>
                <query-btn @showChange="ifShowMore =! ifShowMore" :formSearch="handleSearch"
                           :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlight-row
                      url="/bm/valuate/assetValuate/func_queryDayAssetValuateDetail"
                      :bindForm="formItem"
                      :onCurrentChange="onCurrentChange"
                      :onCurrentChangeCancel="onCurrentChangeCancle"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="changeAssetValuate">{{$t("m.i.bm.changeAssetValuate")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!-- 估值调整 -->
    <h-msg-box v-model="addOrEditWin" width="800" @on-close="addOrEditWinClose" class="h-form-search-layer">
      <p slot="header">
        <span>估值调整</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="2" class="h-form-search">
          <bill-no v-model="addOrEditForm.billNo" readonly></bill-no>
          <common-date-picker v-model="addOrEditForm.dayValuateDtTransTm" :label="$t('m.i.bm.sysValuateDtTime')"
                              prop="dayValuateDtTransTm" type="datetime" readonly></common-date-picker>
          <common-type-field v-model="addOrEditForm.sysValuateAmt" :label="$t('m.i.bm.sysValuateAmt')"
                             prop="sysValuateAmt" readonly></common-type-field>
          <common-type-field v-model="addOrEditForm.manuAdjustAmt" :label="$t('m.i.bm.manuAdjustAmt')"
                             prop="manuAdjustAmt" required></common-type-field>
        </h-form>
      </div>
      <div slot="footer">
        <div slot="footer">
          <h-button type="ghost" @click="addOrEditWinClose">{{$t("m.i.common.close")}}</h-button>
          <h-button type="primary" @click="addOrEditWinSubmit()">{{$t("m.i.common.commit")}}</h-button>
        </div>
      </div>
    </h-msg-box>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId"
                    :billNo="billNo":billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>
  </div>
</template>

<script>
  import {post, formatNumber, accMul,formatBillRange} from "@/api/bizApi/commonUtil";

  export default {
    name: "assetValuateChange",
    data() {
      return {
        ifShowMore: false,
        formItem: {
          belongBrchNos: "",
          belongBrchNames: "",
          prodNo: "",
          assetIndustry: "",
          minBuyDt: "",
          maxBuyDt: "",
          transCustName: "",
          valuateMinDt: "",
          valuateMaxDt: "",
          billNo: "",
          minRemitDt: "",
          maxRemitDt: "",
          minDueDt: "",
          maxDueDt: "",
          minbillMoney: "",
          maxbillMoney: "",
          billType: "",
          billClass: "",
          billOrigin: "",
          billRangeStart: "",
          billRangeEnd: "",
          operStatus: ""
        },
        buyDt: [],
        valuateDt: [],
        remitDt: [],
        dueDt: [],
        currentSelectRow: null,
        columns: [
          {
            type: "radio",
            key: "radio",
            title: " ",
            width: 60,
            hiddenCol: false
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
            title: this.$t("m.i.billInfo.billOrigin"),
            align:'center',
            hiddenCol: false,
            render:(h,params) => {
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : this.getDictValueFromMap(this.dictMap, 'BillOrigin', params.row.billOrigin);

              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.billInfoWinOpen(params.row);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            align:'center',
            key:"billRange",
            hiddenCol: false,
            render:(h,params) => {
              let billOrigin = params.row.billOrigin;
              let billRangeStart = params.row.billRangeStart;
              let billRangeEnd = params.row.billRangeEnd;
              return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageMoney"),
            key: 'billMoney',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ',');
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t("m.i.billInfo.businessSource"),
            key: "prodNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "AssetCatProduct", params.row.prodNo);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.assetIndustry"),
            key: "assetIndustry",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "AssetIndustry", params.row.assetIndustry);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.buyDt"),
            key: "buyDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let buyDt = params.row.buyDt ? this.$moment(params.row.buyDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
              return h("span", buyDt);
            }
          },
          {
            title: this.$t("m.i.bm.buyRate"),
            key: "ratePct",
            sortable: true,
            hiddenCol: false,
            sortMethod:(a,b,type)=>{
              if (type==="asc") {
                let a1=parseFloat(a);
                let a2=parseFloat(b);
                if (isNaN(a1)) return -1;
                if (isNaN(a2)) return 1;
                return a1-a2;
              }else if (type==="desc") {
                let a1=parseFloat(a);
                let a2=parseFloat(b);
                if (isNaN(a1)) return 1;
                if (isNaN(a2)) return -1;
                return a2-a1;
              }
            }
          },
          {
            title: this.$t("m.i.bm.buyerInterest"),
            key: "interest",
            hiddenCol: false,
            render: (h, params) => {
              let amt = formatNumber(params.row.interest, 2, ",");
              return h("span", {
                domProps: {
                  title: amt
                }
              }, amt);
            }
          },
          {
            title: this.$t("m.i.ce.actulPayAmt"),
            key: "realPayAmt",
            hiddenCol: false,
            render: (h, params) => {
              let amt = formatNumber(params.row.realPayAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: amt
                }
              }, amt);
            }
          },
          {
            title: this.$t("m.i.bm.remaInterest"),
            key: "remaInterest",
            hiddenCol: false,
            render: (h, params) => {
              let amt = formatNumber(params.row.remaInterest, 2, ",");
              return h("span", {
                domProps: {
                  title: amt
                }
              }, amt);
            }
          },
          {
            title: this.$t("m.i.bm.buyerName"),
            key: "transCustName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.bm.sysValuateAmt"),
            key: "daySysValuateAmt",
            hiddenCol: false,
            render: (h, params) => {
              let amt = formatNumber(params.row.daySysValuateAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: amt
                }
              }, amt);
            }
          },
          {
            title: this.$t("m.i.bm.sysValuateDtTime"),
            key: "dayValuateDtTransTm",
            hiddenCol: false,
            sortable: true,

          },
          {
            title: this.$t("m.i.bm.manuAdjustAmt"),
            key: "manuAdjustAmt",
            hiddenCol: false,
            render: (h, params) => {
              let amt = formatNumber(params.row.manuAdjustAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: amt
                }
              }, amt);
            }
          },
          {
            title: this.$t("m.i.bm.manuValuateTellerNo"),
            key: "manuValuateTellerNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.bm.manuValuateDt"),
            key: "manuValuateDtTransTm",
            hiddenCol: false,
            sortable: true,

          },
          {
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "belongBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.accountBrchName"),
            key: "accountBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.status"),
            key: "operStatus",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "AssetOperStatus", params.row.operStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billClass"),
            key: "billClass",
            hiddenCol: false,
            sortable: true,
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
            title: this.$t("m.i.billInfo.billType"),
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
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            hiddenCol: false
          }
        ],
        addOrEditWin: false,
        addOrEditForm: {
          billNo: "",
          dayValuateDtTransTm: "",
          sysValuateAmt: "",
          manuAdjustAmt: ""
        },
        dictMap: new Map(),
        billSourceList: [],
        assetIndustryList: [],
        billTypeList: [],
        billClassList: [],
        operStatusList: [],
        showBillInfoWin: false,
        billRangeStart:"",
        billRangeEnd:"",
        billId: "",
        billNo: ""
      }
    },
    methods: {
      onCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      onCurrentChangeCancle(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = null;
      },
      handleSearch(pageNo) {
        this.currentSelectRow = null;
        this.$refs.datagrid.dataChange(pageNo ? pageNo : 1);
      },
      resetSearch() {
        this.$refs.formItem.resetFields();
        let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
        this.formItem.belongBrchNos = userInfo.brchNo;
        this.formItem.belongBrchNames = userInfo.brchName;
        this.formItem.minBuyDt = "";
        this.formItem.maxBuyDt = "";
        this.buyDt = [];
        this.formItem.valuateMinDt = "";
        this.formItem.valuateMaxDt = "";
        this.valuateDt = [];
        this.formItem.minRemitDt = "";
        this.formItem.maxRemitDt = "";
        this.remitDt = [];
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.formItem.billRangeStart = "";
        this.formItem.billRangeEnd = "";
        this.dueDt = [];
      },
      billInfoWinOpen(row) {
        this.billId = row.billId;
        this.billNo = row.billNo;
        this.billRangeStart = row.billRangeStart;
        this.billRangeEnd = row.billRangeEnd;
        this.showBillInfoWin = true;
      },
      billInfoWinClose() {
        this.billId = null;
        this.billNo = null;
        this.billRangeStart = null;
        this.billRangeEnd = null;
        this.showBillInfoWin = false;
      },
      changeAssetValuate() {
        if (this.currentSelectRow) {
          post({id: this.currentSelectRow.dayDetailId}, "/bm/valuate/assetValuate/func_selectDayAssetValuateById").then(res => {
            if (res) {
              if (res.data.retCode === "000000") {
                this.addOrEditWin = true;
                this.$nextTick(() => {
                  this.addOrEditForm.dayDetailId = res.data.retData.dayDetailId;
                  this.addOrEditForm.billNo = res.data.retData.billNo;
                  this.addOrEditForm.dayValuateDtTransTm = res.data.retData.dayValuateDtTransTm;
                  this.addOrEditForm.sysValuateAmt = res.data.retData.sysValuateAmt;
                });
              } else {
                this.$msgTip.error(this, {info: res.data.retMsg});
              }
            } else {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            }
          });
        } else {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
        }
      },
      addOrEditWinClose() {
        this.addOrEditWin = false;
        this.$refs.addOrEditForm.resetFields();
        this.addOrEditForm.dayDetailId = "";
      },
      addOrEditWinSubmit() {
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            post(this.addOrEditForm, "/bm/valuate/assetValuate/func_changeAssetValuateInfo").then(res => {
              if (res) {
                if (res.data.retCode === "000000") {
                  this.$msgTip.success(this);
                  this.addOrEditWinClose();
                  this.handleSearch(this.$refs.datagrid.pageInfo.pageNo);
                } else {
                  this.$msgTip.error(this, {info: res.data.retMsg});
                }
              } else {
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
              }
            });
          }
        });
      }
    },
    created() {
      let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
      this.formItem.belongBrchNos = userInfo.brchNo;
      this.formItem.belongBrchNames = userInfo.brchName;
    },
    mounted() {
      this.getDictListByGroups("AssetCatProduct,AssetIndustry,DraftTypeCode,CDMedia,AssetOperStatus,BillOrigin").then(res => {
        this.billSourceList = res.get("AssetCatProduct");
        this.assetIndustryList = res.get("AssetIndustry").filter(item => item.key !== "0");
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get("CDMedia");
        this.billOriginList = res.get("BillOrigin");
        this.operStatusList = res.get("AssetOperStatus");
        this.dictMap = res.get("map");
      });
    }
  }
</script>

<style scoped>

</style>
