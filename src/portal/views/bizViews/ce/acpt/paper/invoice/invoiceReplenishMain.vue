<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div >
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')">
                  <h-input v-model="formItem.drwrName" placeholder="" icon="android-search" @on-click="queryCustNo()" readonly></h-input>
                </h-form-item>
                <h-form-item prop="invoiceFinishFlag" :label="$t('m.i.ce.invoiceFinishFlag')">
                  <h-select v-model="formItem.invoiceFinishFlag" placeholder="" showTitle>
                    <h-option v-for="item in YonList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="remitDt" :label="$t('m.i.billInfo.remitDt')">
                  <h-date-picker type="date" v-model="formItem.remitDt" placeholder="" @on-change="handleDateChange" :editable=false></h-date-picker>
                </h-form-item>
                <h-form-item prop="acptProtocalNoLike" :label="$t('m.i.billInfo.acptProtocalNo')">
                  <h-input v-model="formItem.acptProtocalNoLike" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="batchNoLike" :label="$t('m.i.common.batchNo')">
                  <h-input v-model="formItem.batchNoLike" placeholder="" :maxlength="50"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}
                    <i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i>
                  </span>
                  <h-button type="primary" @click="handleSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="batchColumns"
                      highlightRow
                      url="/ce/acpt/paper/invoice/invoiceReplenishMain/func_queryPageInvociceReplenish"
                      :bindForm="formItem"
                      :auto-load="false"
                      :on-current-change="handleRowClick"
                      :on-current-change-cancel="handleRowClickCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="invoiceBillManage()" >{{$t('m.i.ce.billManage')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 查询客户信息弹窗 -->
        <show-cust-message :showCustMessageWin="showCustInfoWin" @custCorpWinClose="custCorpWinClose" @custCorpSelectSubmit="custCorpSelectSubmit" ref="showCustInfo"></show-cust-message>
        <invoice-replenish :showInvoiceReplenishWin="invoiceReplenishWin" :batchParams="batchParams"  @invoiceReplenishFormClose="invoiceReplenishFormClose" ref="invoiceReplenishInfo"></invoice-replenish>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap, formatNumber,accMul } from "@/api/bizApi/commonUtil";
  import {deepClone} from "@/utils/index";

  export default {
    name: "invoiceReplenishMain",
    components:{
      "invoice-replenish":()=>import(/* webpackChunkName: "ce/acpt/paper/invoice/eInvoiceReplenish" */`@/views/bizViews/ce/acpt/paper/invoice/invoiceReplenish`)
    },
    data() {
      return {
        ifShowMore: false,
        showCustInfoWin: false,
        invoiceReplenishWin: false,
        YonList: [],
        acptTypeArray: [],
        guarntrTypeArray: [],
        currentSelectRow: [],
        dictMap: {
          type: Map
        },
        formItem: {
          drwrName: '',
          invoiceFinishFlag: '',
          remitDt: '',
          acptProtocalNoLike: '',
          batchNoLike: '',
          billClass: 'ME01'
        },
        batchColumns: [
          {
            title: ' ',
            type: 'radio',
            align: 'center',
            width : 50
          },
          {
            type: 'index',
            key: 'numOrder',
            title: this.$t("m.i.common.index"),
            width: 60,
            align: 'center',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.batchNo"),
            key: "batchNo",
            hiddenCol: false,
            render: (h, params) => {
              return h("div", [
                h("a", {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.openBillManagerWin(params.row.id)
                    }
                  }
                }, params.row.batchNo)
              ]);
            }
          },
          {
            title: this.$t("m.i.billInfo.acptProtocalNo"),
            key: "acptProtocalNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: "drwrAcctNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.ce.invoiceAfterFlag'),
            key: 'invoiceAfterFlag',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"Yon",params.row.invoiceAfterFlag);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.ce.forceInvoiceFlag'),
            key: 'forceInvoiceFlag',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"Yon",params.row.forceInvoiceFlag);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.ce.invoiceFinishFlag'),
            key: 'invoiceFinishFlag',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"Yon",params.row.invoiceFinishFlag);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title:  this.$t('m.i.billInfo.remitDt'),
            key: 'remitDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.remitDt == null || params.row.remitDt === ""){
                return "";
              }
              let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.ce.acptType'),
            key: 'acptType',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"AcptType",params.row.acptType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.ce.guarntrType"),
            key: "guarntrType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "GuarntrType", params.row.guarntrType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.ce.totalCount'),
            key: 'totalCount',
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.ce.totalAmt'),
            key: 'totalAmt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let totalAmt = formatNumber(params.row.totalAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: totalAmt
                }
              }, totalAmt);
            }
          }
        ],
        batchParams : {
          batchId: {
            type: Number
          },
          dictMap: {
            type: Map
          },
          YonList: [],
          guarntrTypeArray: [],
          acptTypeArray: []
        }
      };
    },

    mounted() {
      this.getDictListByGroups("AcptType,Yon,GuarntrType,DraftTypeCode").then(res => {
        this.YonList = res.get("Yon");
        this.acptTypeArray = res.get("AcptType");
        this.guarntrTypeArray = res.get("GuarntrType");
        this.dictMap = res.get("map");
        this.handleSearch();
      });
    },

    methods: {
      handleDateChange(value) {
        this.formItem.remitDt = value.replace(/-/g, "");
      },

      //表单查询
      handleSearch() {
        this.currentSelectRow = [];
        this.$nextTick(() => {
          this.$refs.datagrid.dataChange(1);
        })
      },

      //重置表单查询结果
      resetSearch() {
        this.$nextTick(() => {
          this.formItem.drwrName = '';
          this.formItem.invoiceFinishFlag = '';
          this.formItem.remitDt = '';
          this.formItem.acptProtocalNoLike = '';
          this.formItem.batchNoLike = '';
        });
      },

      //行选中
      handleRowClick(arr) {
        this.currentSelectRow = arr;
      },

      handleRowClickCancel() {
        this.currentSelectRow = [];
      },

      //查询客户信息
      queryCustNo() {
        this.showCustInfoWin = true;
      },

      //赋值
      custCorpSelectSubmit(info) {
        this.formItem.drwrName = info.custName;
        this.showCustInfoWin = false;
      },

      //关闭
      custCorpWinClose() {
        this.showCustInfoWin = false;
      },

      openBillManagerWin(id) {
        this.batchParams.batchId = id;
        this.assembleParams();
      },

      //票据管理
      invoiceBillManage() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.batchParams.batchId = this.currentSelectRow.id;
        this.assembleParams();
      },

      assembleParams() {
        this.batchParams.dictMap = this.dictMap;
        this.batchParams.YonList = this.YonList;
        this.batchParams.guarntrTypeArray = this.guarntrTypeArray;
        this.batchParams.acptTypeArray = this.acptTypeArray;
        this.invoiceReplenishWin = true;
      },

      //发票后补回调关闭
      invoiceReplenishFormClose () {
        this.invoiceReplenishWin = false;
        this.handleSearch();
        this.batchParams = {};
      }

    }
  };
</script>

<style scoped>

</style>
