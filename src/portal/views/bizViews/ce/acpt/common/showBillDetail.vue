<template>
  <!-- 纸票票据明细查询 -->
  <h-msg-box v-model="tempBillDetailWin" width="1000" class="h-form-table-layer" :maximize="true" @on-close="handleClose" :mask-closable="false" @on-maximize="onMaximize">
    <p slot="header">
      <span>{{$t('m.i.ce.detailBill')}}</span>
    </p>
    <!--数据展示表格-->
    <h-datagrid :columns="showBillDetailColumns"
                highlight-row
                :height="400"
                :url="this.listUrl"
                :auto-load="false"
                :bind-form="formItem"
                ref="datagrid">
      <div slot="toolbar" class="pull-left">
      </div>
    </h-datagrid>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
    </div>
    <!--保证金账号查询-->
    <show-deduct-acct @dueDeductAcctWinClose="dueDeductAcctWinClose" :dueDeductAcctWin="dueDeductAcctWin" :params="showParams"></show-deduct-acct>
  </h-msg-box>
</template>

<script>
import {accMul, formatNumber} from "@/api/bizApi/commonUtil";

export default {
    name: "showBillDetail",
    components: {
      ShowDeductAcct:()=>import(/* webpackChunkName: "ce/acpt/common/showDeductAcct" */`@/views/bizViews/ce/acpt/common/showDeductAcct`),
    },
    data() {
      return {
        showBillDetailColumns: [
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.ce.promNoteNo"),
            key: 'promNoteNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.flowStatus"),
            key: 'flowStatusName',
            hiddenCol: false,
          },
          {
            title: this.$t((this.billClass == 'ME01')?"m.i.billInfo.billMoney":"m.i.billInfo.billPackageMoney"),
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
            title: this.$t("m.i.billInfo.dueDt"),
            key: 'dueDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.dueDt == null || params.row.dueDt === ""){
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.fee"),
            key: 'fee',
            hiddenCol: false,
            render: (h, params) => {
              let fee = formatNumber(params.row.fee, 2, ',');
              return h("span", {
                domProps: {
                  title: fee
                }
              }, fee);
            }
          },
          {
            title:  this.$t("m.i.ce.commitFee"),
            key: 'commitFee',
            hiddenCol: false,
            render: (h, params) => {
              let commitFee = formatNumber(params.row.commitFee, 2, ',');
              return h("span", {
                domProps: {
                  title: commitFee
                }
              }, commitFee);
            }
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: 'pyeeName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.pyeeAcctNo"),
            key: 'pyeeAcctNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.pyeeBankNo"),
            key: 'pyeeBankNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: 'acptName',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.ce.bailPcetStr"),
            key: 'bailPcet',
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.bailPcet != null && params.row.bailPcet !== ""){
                let rate = accMul(params.row.bailPcet, 100);
                let rateFormat = formatNumber(rate, 2, ',');
                return h("span", rateFormat);
              }
            }
          },
          {
            title: this.$t("m.i.ce.guarntrAmt"),
            key: 'guarntrAmt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let guarntrAmt = formatNumber(params.row.guarntrAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: guarntrAmt
                }
              }, guarntrAmt);
            }
          },
          {
            title: this.$t("m.i.ce.guarntrNo"),
            key: "guarntrNo",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.showDueDeductAcct(params.row.id);
                  }
                }
              }, '查看');
            }
          },
          {
            title: this.$t("m.i.ce.drwrAcctNo"),
            key: 'drwrAcctNo',
            hiddenCol: false,
          }
        ],
        formItem: {
          batchId: '',
          acctFlowIds: '',
          curFuncNo: 'PICE010303',
          billClass:'',
          licenseFlag: false,
          ownedBrchNo: ""
        },
        //查询保证金账户信息
        dueDeductAcctWin: false,
        showParams: {
          listId:"",
        }
      }
    },
    props: {
      billDetailWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      batchId: '',
      acctFlowIds: '',
      billClass:'',
      listUrl:'',
      licenseFlag:{
        type:Boolean,
        default() {
          return false;
        }
      },
      ownedBrchNo:""
    },
    watch: {
      tempBillDetailWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.formItem.batchId = this.batchId;
            this.formItem.acctFlowIds = this.acctFlowIds;
            this.formItem.billClass = this.billClass;
            this.formItem.licenseFlag=this.licenseFlag;
            this.formItem.ownedBrchNo=this.ownedBrchNo
            this.$refs.datagrid.dataChange(1);
          });
        }
      }
    },
    computed: {
      tempBillDetailWin: {
        get() {
          return this.billDetailWin;
        },
        set() {
        }
      }
    },
    methods: {
      showDueDeductAcct(id) {
        this.showParams.listId = id;
        this.dueDeductAcctWin = true;
      },

      dueDeductAcctWinClose() {
        this.dueDeductAcctWin = false;
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      handleClose() {
        this.$refs.datagrid.tData = [];
        this.$emit("billDetailWinClose", "");
      }
    }
  };
</script>

<style scoped>

</style>
