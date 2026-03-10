<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div >
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <cust-name :formItem = "formItem" @queryCustMessage="queryCustMessage"></cust-name>
                <invoice-finish-flag :formItem = "formItem" :youList="youList"></invoice-finish-flag>
                <ce-disc-dt :formItem = "formItem"></ce-disc-dt>
                <batch-no v-model="formItem.batchNoLike" prop="batchNoLike"></batch-no>
                <query-btn  v-on:showChange="showQry"  :advanceShow='true' :formSearch='handleSearch' :formSearchReset='resetSearch'> </query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="batchColumns"
                      highlightRow
                      url="/ce/disc/paper/invoice/invoiceReplenishMain/func_queryPageInvociceReplenish"
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
        <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose" @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
        <invoice-replenish :showPDiscInvoiceWin="showPDiscInvoiceWin" :discBatchId="discBatchId" :licenseFlag="licenseFlag" @pDiscInvoiceWinClose="pDiscInvoiceWinClose"></invoice-replenish>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups,getBusinessParameter,getDictValueFromMap , formatNumber,accMul } from "@/api/bizApi/commonUtil";

  export default {
    name: "invoiceReplenishMain",
    components:{
      "invoice-replenish":()=>import(/* webpackChunkName: "ce/disc/paper/invoice/invoiceReplenish" */`@/views/bizViews/ce/disc/paper/invoice/invoiceReplenish`)
    },

    data() {
      return {
        showCustMessageWin : false,
        showPDiscInvoiceWin: false,
        ifShowMore : false,
        licenseFlag:"",
        discBatchId : '',
        youList : [],
        currentSelectRow: [],
        dictMap : new Map(),
        formItem : {
          custName: "",
          invoiceFinishFlag: "",
          discDt: "",
          batchNoLike: "",
          billClass: 'ME01',
          authPath:this.$route.path ,
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
              return h('div', [
                h('a', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.batchNoMain(params.row.id)
                    }
                  }
                }, params.row.batchNo)
              ]);
            }
          },
          {
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "ownedBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.custName"),
            key: "custName",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.common.custAcctNo"),
            key: "custAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
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
            title: this.$t("m.i.billInfo.discDt"),
            key: "discDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.discDt == null || params.row.discDt === ""){
                return "";
              }
              let discDt = this.$moment(params.row.discDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", discDt);
            }
          },
          {
            title: this.$t("m.i.billInfo.discInterestRate"),
            key: "ratePct",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.ce.totalCount"),
            key: "sumCount",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.totalAmt"),
            key: "sumMoney",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.sumMoney, 2, ',');
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t("m.i.common.busiType"),
            key: "prodName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.interestMethod"),
            key: "payType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"PayType",params.row.payType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
          },
          {
            title: this.$t("m.i.ce.salerCustName"),
            key: "salerCustName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.salerAcctNo"),
            key: "salerAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.buyPayPcetByUnit"),
            key: "buyPayPcet",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.buyerPayInterName"),
            key: "payCustName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.buyerPayInterAcctNo"),
            key: "payAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.thirdPayPcet"),
            key: "thirdPayPcet",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.thirdCustName"),
            key: "thirdCustName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.thirdAcctNo"),
            key: "thirdAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.transCtrctNo"),
            key: "transCtrctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.busiBrchName"),
            key: "busiBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.corpScale"),
            key: "corpScale",

            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"CorpScale",params.row.corpScale);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
          },
          {
            title: this.$t("m.i.common.isGreenCorp"),
            key: "isGreenCorp",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"Yon",params.row.isGreenCorp);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
          },
        ],
      };
    },

    mounted() {
      this.getDictListByGroups("DraftTypeCode,Yon,PayType,CorpScale").then(res => {
        this.youList = res.get("Yon");
        this.dictMap = res.get("map");
        this.handleSearch();
      });

      //有授权则显示业务所属机构列
      post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        this.authPath = this.$route.path;
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
        }else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },

    methods: {
      //查询
      handleSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },

      //重置查询结果
      resetSearch() {
        this.$nextTick(() => {
          this.formItem.custName = "";
          this.formItem.invoiceFinishFlag = "";
          this.formItem.discDt = "";
          this.formItem.batchNoLike = "";
        });
      },

      showQry(val){
        this.ifShowMore = val;
      },

      //行选中
      handleRowClick(arr) {
        this.currentSelectRow = arr;
      },

      handleRowClickCancel() {
        this.currentSelectRow = [];
      },

      //查询客户信息
      queryCustMessage(){
        this.showCustMessageWin = true;
      },

      //根据客户信息查询框所选数据进行赋值
      custCorpSelectSubmit(info) {
        this.formItem.custName = info.custName;
        this.showCustMessageWin = false;
      },

      //客户信息查询框关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },

      //批次编号超链接
      batchNoMain(str) {
        this.discBatchId = str;
        this.showPDiscInvoiceWin = true;
      },

      //票据管理
      invoiceBillManage() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.discBatchId = this.currentSelectRow.id;
        this.showPDiscInvoiceWin = true;
      },

      pDiscInvoiceWinClose() {
        this.showPDiscInvoiceWin = false;
        this.discBatchId = "",
        this.handleSearch();
      },

    }


  };
</script>

<style scoped>

</style>
