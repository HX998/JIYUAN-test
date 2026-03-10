<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="">
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass">
                  <h-select v-model="formItem.billClass" placeholder="">
                    <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billOrigin')"  prop="billOrigin">
                  <h-select v-model="formItem.billOrigin" placeholder="">
                    <h-option v-for="item in billOriginList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="billNo" :label="$t('m.i.billInfo.billPackageNo')">
                  <h-input v-model="formItem.billNo"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.isLock')" prop="isLock">
                  <h-select v-model="formItem.isLock" placeholder="">
                    <h-option v-for="item in lockList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="transFromName" :label="$t('m.i.common.custName')">
                  <h-input v-model="formItem.transFromName"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i
                    class="icon iconfont"
                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-row>
            <h-col span="24">
              <h-datagrid :columns="columns" :hasSelect="false" rowSelect :url="url" :bindForm="formItem"
                          ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="lockBills">{{$t('m.i.be.lockBill')}}</h-button>
                  <h-button type="primary" @click="unlockBills">{{$t('m.i.be.unlockBill')}}</h-button>
                  <h-button type="primary" @on-click="tempShowExcelTemplateWinOpen">{{$t('m.i.common.listExport')}}
                  </h-button>
                </div>
              </h-datagrid>
            </h-col>
          </h-row>
        </div>
      </h-col>
    </h-row>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId"
                    :billNo="billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
  </div>
</template>
<script>
  import {
    post,
    getDictListByGroups,
    getDictValueFromMap,
    formatNumber,
    accMul,
    exportList
  } from "@/api/bizApi/commonUtil";

  export default {
    name: "lockBill",
    data() {
      return {
        dictMap: new Map(),
        billClassList: [],
        billTypeList: [],
        assetIndustry: [],
        billOriginList:[],
        url: "/be/market/quote/sale/lockBill/func_queryBillInfo",
        formItem: {
          billType: '',
          billClass: '',
          billNo: '',
          isLock: '',
          transFromName: '',
          billOrigin:''
        },
        columns: [
          {
            type: 'selection',
            width: 50,
            hiddenCol: false,
            align: 'center'
          },
          {
            type: 'index',
            title: this.$t("m.i.common.index"),
            width: 60,
            align: 'center'
          },

          {
            title: this.$t('m.i.be.isLockBill'),
            key: 'isLock',
            sortable: true,
            render: (h, params) => {
              if (!params.row.isLock||params.row.isLock == '0') {
                return h('span', '未锁定');
              } else {
                return h('span', '已锁定');
              }
            },
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.billOrigin'),
            key: 'billOrigin',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : getDictValueFromMap(this.dictMap, 'BillOrigin', params.row.billOrigin);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageNo'),
            key: 'billNo',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.billInfoWinOpen(params.row.billId, params.row.billNo, params.row.billRangeStart, params.row.billRangeEnd);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t('m.i.billInfo.billRange'),
            key: 'billRange',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = !params.row.billRange ? '-' : params.row.billRange;
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: 'billType',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'DraftTypeCode', params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billClass'),
            key: 'billClass',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'CDMedia', params.row.billClass);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageMoney'),
            key: 'billMoney',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.billMoney, 2, ','))
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: 'dueDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.be.buyDt'),
            key: 'transDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.transDt ? this.$moment(params.row.transDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.be.buyRate'),
            key: 'ratePct',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.be.assetIndustry'),
            key: 'assetIndustry',
            hiddenCol: window.sessionStorage.getItem("isOpenI9") == "1" ? false : true,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'AssetIndustry', params.row.assetIndustry);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.custName'),
            key: 'oppName',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: 'acptName',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.billInfo.acptBankName'),
            key: 'acptBankName',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.billInfo.cfmAppBankName'),
            key: 'cfmAppBankName',
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptGuarntrBankName'),
            key: 'acptGuarntrBankName',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.discBankName'),
            key: 'discBankName',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.discGuarntrBankName'),
            key: 'discGuarntrBankName',
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.guarntrTrustBankName'),
            key: 'trustBankName',
            sortable: true,
            hiddenCol: false
          },
        ],
        lockList: [
          {
            key: 0,
            value: "未锁定"
          }, {
            key: 1,
            value: "已锁定"
          }
        ],
        ifShowMore: false,
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        billRangeStart: '',
        billRangeEnd: '',
        param: null,
        rows: null,
        tempShowExcelTemplateWin: false,
      };
    },
    components: {},
    mounted() {
      getDictListByGroups('CDMedia,DraftTypeCode,AssetIndustry,BillOrigin').then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get('CDMedia');
        this.assetIndustry = res.get('AssetIndustry');
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get('map')
      })
    },
    methods: {
      //清单导出
      tempShowExcelTemplateWinOpen() {
        this.param = "lockBillListExport";
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //清单导出
      exportList(field, exportType) {
        let exportUrl = window.LOCAL_CONFIG.API_HOME + "/be/market/quote/sale/lockBill/func_exportBillInfo";
        let options = {};
        if (this.$refs.datagrid.selectIds.length !== 0) {
          options.params = {
            ids: this.$refs.datagrid.selectIds
          };
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, exportUrl, options);
      },
      billInfoWinClose() {
        this.billId = null;
        this.billNo = null;
        this.billRangeStart = null;
        this.billRangeEnd = null;
        this.showBillInfoWin = false;
      },
      billInfoWinOpen(billId, billNo,billRangeStart,billRangeEnd) {
        this.billId = billId;
        this.billNo = billNo;
        this.billRangeStart = billRangeStart;
        this.billRangeEnd = billRangeEnd;
        this.showBillInfoWin = true;
      },
      lockBills() {
        let selectIds = this.$refs.datagrid.selectIds
        if (selectIds.length == 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
          return;
        }
        post({hldrIdList: selectIds}, "/be/market/quote/sale/lockBill/func_lock").then(res => {
          if (res && res.data && res.data.retCode == '000000') {
            this.$msgTip.info(this, {info: "锁票成功"});
            this.$refs.datagrid.selectIds = []
            this.$refs.datagrid.selects = []
            this.$refs.datagrid.dataChange(1);
          } else if (res) {
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
        }).catch(error => {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
        });
      },
      unlockBills() {
        let selectIds = this.$refs.datagrid.selectIds
        if (selectIds.length == 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
          return;
        }
        post({hldrIdList: selectIds}, "/be/market/quote/sale/lockBill/func_unlock").then(res => {
          if (res && res.data && res.data.retCode == '000000') {
            this.$msgTip.info(this, {info: "解锁成功"});
            this.$refs.datagrid.selectIds = []
            this.$refs.datagrid.selects = []
            this.$refs.datagrid.dataChange(1);
          } else if (res) {
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
        }).catch(error => {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
        });
      },
      formSearch() {
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.isLock = '';
        this.$refs.formItem.resetFields();
      }
    },
  }

</script>
