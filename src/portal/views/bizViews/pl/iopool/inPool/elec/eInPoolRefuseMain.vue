<!--电票出入池-入池电票拒绝-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <common-select v-model="formItem.billOrigin" :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                               :dictList="billOriginArray"></common-select>
                <bill-no :label="$t('m.i.billInfo.billPackageNo')"  v-model="formItem.likeBillNo" prop="likeBillNo"></bill-no>
                <bill-range :form-item="formItem" :range-props="['minBillRangeStart','maxBillRangeEnd']" ></bill-range>
                <h-form-item prop="billMoney" :label="$t('m.i.billInfo.billPackageMoney')" class="h-form-long-label">
                  <h-typefield v-model="formItem.billMoney" type="money" bigTips placeholder="" :maxLength="20"></h-typefield>
                </h-form-item>
                <h-form-item prop="minRemitDt" :label="$t('m.i.billInfo.remitDt')">
                  <h-date-picker :value="remitDt" type="daterange" autoPlacement placeholder="" @on-change="handleRemitDtChange"
                                 :editable=false showFormat></h-date-picker>
                </h-form-item>
                <h-form-item prop="minDueDt" :label="$t('m.i.billInfo.dueDt')">
                  <h-date-picker :value="dueDt" type="daterange" autoPlacement placeholder="" @on-change="handleDueDtChange"
                                 :editable=false showFormat></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      url="/pl/iopool/inpool/elec/eInPoolRefuseMain/func_pagingQueryInPoolUnsignBills"
                      :bindForm="formItem"
                      :rowSelect="true"
                      :hasSelect="false"
                      :paramId="'transId'"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="refuse">{{$t('m.i.pl.refuse')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo" :billRangeEnd = "this.billRangeEnd" :billRangeStart = "this.billRangeStart"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off, formatNumber ,formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "eInPoolRefuseMain",
    components: {
    },
    data() {
      return {
        dueDt : [],
        remitDt : [],
        billOriginArray: [],
        formItem : {
          queryType: "0",
          likeBillNo: "",
          billMoney: "",
          minRemitDt: "",
          maxRemitDt: "",
          minDueDt: "",
          maxDueDt: "",
          billClass:"ME02",
          billOrigin: '',
          minBillRangeStart: '',
          maxBillRangeEnd: '',
        },
        columns : [
          {
            type: "selection",
            key: "multiSelect",
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
            key: "billOrigin",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "BillOrigin", params.row.billOrigin);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let info = "", type = "";
              if (!!params.row.billId) {
                info = params.row.billId;
                type = "billId";
              } else {
                info = params.row.billNo;
                type = "billNo";
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row, type);
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
            key: "billMoney",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ",");
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            ellipsis: false,
            hiddenCol: false,
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
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.remitDt == null || params.row.remitDt === "") {
                return "";
              }
              let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.dueDt == null || params.row.dueDt === "") {
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: "drwrAcctNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrBankNo"),
            key: "drwrBankNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            sortable: true,
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeAcctNo"),
            key: "pyeeAcctNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeBankNo"),
            key: "pyeeBankNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            ellipsis: false,
            hiddenCol: false
          }
        ],
        currentSelectList : [],
        dictMap : new Map(),
        //是否显示更多查询项
        ifShowMore : false,
        showBillInfoWin : false,
        billId: "",
        billNo: "",
        billRangeStart: "",
        billRangeEnd: "",
      };
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,Yon,BillOrigin").then(res => {
        this.billOriginArray = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      handleRemitDtChange(arr) {
        if(arr&&arr.length==2){
          this.formItem.minRemitDt = arr[0].replace(/-/g, "");
          this.formItem.maxRemitDt = arr[1].replace(/-/g, "");
          this.remitDt = [arr[0], arr[1]];
        }else {
          this.formItem.minRemitDt="";
          this.formItem.maxRemitDt="";
          this.remitDt=[]
        }
      },
      handleDueDtChange(arr) {
        if (arr&&arr.length==2){
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0], arr[1]];
        } else {
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDt = [];
        }
      },
      //表单查询
      handleSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.currentSelectList = [];
        this.formItem.minDueDt = this.formItem.minDueDt.replace(/-/g, "");
        this.formItem.maxDueDt = this.formItem.maxDueDt.replace(/-/g, "");
        this.formItem.minRemitDt = this.formItem.minRemitDt.replace(/-/g, "");
        this.formItem.maxRemitDt = this.formItem.maxRemitDt.replace(/-/g, "");
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.dueDt = [];
        this.remitDt = [];
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.formItem.minRemitDt = "";
        this.formItem.maxRemitDt = "";
        this.$refs.formItem.resetFields();
      },
      //拒绝
      refuse() {
        if (this.$refs.datagrid.selects != null && this.$refs.datagrid.selects.length !== 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确定拒绝吗?",
            onOk: () => {
              this.handleDel();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      handleDel() {
        let list = this.$refs.datagrid.selects;
        let transIds = [];
        for (let i = 0; i < list.length; i++) {
          transIds.push(list[i].transId);
        }
        transIds = this.$refs.datagrid.selectIds;
        post({ transIds: transIds.join(",") }, "/pl/iopool/inpool/elec/eInPoolRefuseMain/func_refuseBill").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectList = [];
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.selectIds = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(info, type) {
        this.billId = "";
        this.billNo = "";
        if (type === "billId") {
          this.billId = info.billId;
        } else {
          this.billNo = info.billNo;
        }
        this.billRangeStart = info.billRangeStart;
        this.billRangeEnd = info.billRangeEnd;
        this.showBillInfoWin = true;
      }
    }
  };
</script>

<style scoped>

</style>
