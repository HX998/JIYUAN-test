<!--客户明细 客户信息+账户信息--->
<template>
  <div>
    <h-msg-box v-model="tempRecordDetailShow" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1000" class="h-form-search-layer" >
      <p slot="header">
        <span>记录查询</span>
      </p>
      <div>
        <!--数据展示表格-->
        <h-datagrid
          :columns="columns"
          highlight-row
          :auto-load="false"
          url="/bm/cpes/custsign/custCorpSign/func_queryCustCorpSignRecordDetailByPage"
          :bindForm="dataGridFormItem"
          row-select
          ref="datagrid">
        </h-datagrid>
      </div>
      <div slot="footer">
      </div>
    </h-msg-box>

  </div>
</template>

<script>
  import { post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "recordDetailShow",
    components: {},
    data() {
      return {
        custNo: "",
        custRgstStatus:"",
        custId:"",
        operType:"",
        custCorpParams:{},
        dataGridFormItem:{
          custNo:"",
        },
        columns: [
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.custNo'),
            key: 'custNo',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.common.corpName'),
            key: 'custName',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.common.socCode'),
            key: 'socCode',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.common.operType'),
            key: 'operType',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "CorpSignOperType", params.row.operType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.pc.operDtTime'),
            key: 'operDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.operDt ? this.$moment(params.row.operDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.bm.operTellerName'),
            key: 'operTellerNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.operResult"),
            key: "isSuccess",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "EcdsDraftStatusCode", params.row.isSuccess);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.failReason"),
            key: "failReason",
            hiddenCol: false,
          },
        ],
      };
    },
    props: {
      recordDetailShowWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      batchParams: {
        type: Object,
        default: {}
      },
      dictMap: { //CorpScale,Industry,partnerType,Yon
        type: Map
      },
    },

    watch: {
      recordDetailShowWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.custNo = this.batchParams.custNo;
            this.custId = this.batchParams.custId;
            this.dataGridFormItem.custNo = this.batchParams.custNo;
            this.$refs.datagrid.dataChange(1);
          });
        }
      },
      batchId(val) {
        this.batchId = val;
      }
    },
    computed: {
      tempRecordDetailShow: {
        get() {
          return this.recordDetailShowWin;
        },
        set() {
        }
      }
    },
    methods: {
      //关闭弹窗
      handleClose() {
        let stauts = this.custRgstStatus;
        this.custNo="";
        this.custRgstStatus="";
        this.custId="";
        this.$emit("recordDetailShowWinClose", stauts);
      },

      pickAcctNoWinClose(){
        this.custCorpParams = {};
        this.pickAcctNoWin = false;
      },

      pickAcctNoWinSubmit(list){
        let custAcctIds = list;
        post({id: this.custId, custAcctIds: custAcctIds ,custNo:this.custNo}, "/bm/cpes/custsign/custCorpSign/func_addCustAcctNoSign").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this, { info: "操作成功" });
              this.pickAcctNoWinClose();
              this.handleClose()
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      showFileWinClose(){
        this.custCorpParams = {};
        this.showFileWin = false;
      },

      fileControl(){
        this.operType = "upload";
        this.showFileWin = true;
      },

    }
  };
</script>

<style scoped>

</style>
