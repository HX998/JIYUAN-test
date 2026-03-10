<template>
  <div>
    <h-msg-box v-model="tempPickPackBillWin" width="1000" class="h-form-table-layer" :maximize="true"
               :mask-closable="false" @on-close="handleClose" :z-index="1002">
      <p slot="header">
        <span>票据包挑票页面</span>
      </p>
      <div>
        <h-form :model="pickPackBillForm" :label-width="90" ref="pickPackBillForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.be.packetSeq')" prop="dealNo">
            <h-input v-model="pickPackBillForm.dealNo" placeholder=""></h-input>
          </h-form-item>
          <h-form-item class="h-form-operate">
            <h-button type="primary" @click="handlePickPackBillSearch()">{{$t("m.i.common.search")}}</h-button>
            <h-button type="ghost" @click="resetPickPackBillSearch()">{{$t("m.i.common.reset")}}</h-button>
          </h-form-item>
        </h-form>
        <h-datagrid :columns="pickPackBillColumns"
                    url="/be/market/intention/intentionMain/func_querySalePacketBill"
                    highlight-row
                    :autoLoad="false"
                    :height="300"
                    :bindForm="pickPackBillForm"
                    :onCurrentChange="onCurrentChange"
                    :onCurrentChangeCancel="onCurrentChangeCancle"
                    ref="pickPackBillDatagrid">
        </h-datagrid>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="pickPackBillStock()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups,getDictValueFromMap,formatNumber } from "@/api/bizApi/commonUtil";
  export default {
    name: "pickPackBill",
    data() {
      return  {
        submitFlag : false,
        pickPackBillForm : {
          dealNo: "",
          billClass: "",
          billType: ""
        },
        pickPackBillColumns : [
          {
            title: " ",
            type: "radio",
            width: 50,
            hiddenCol: false,
            align: "center"
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 50,
            align: "center"
          },
          {
            title: this.$t('m.i.be.packetSeq'),
            key: "dealNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.saleBrchName'),
            key: "saleBrchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.buyBrchName'),
            key: "buyBrchName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.firstSettleDate'),
            key: "firstSettleDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.firstSettleDt?this.$moment(params.row.firstSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD"):"")
            }
          },
          {
            title: this.$t('m.i.be.dueSettleDt'),
            key: "dueSettleDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', params.row.dueSettleDt?this.$moment(params.row.dueSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD"):"")
            }
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
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
            key: "billClass",
            hiddenCol: false,
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
            title: this.$t('m.i.common.totalNumBillPackage'),
            key: "totalNum",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.totalAmtBillPackage'),
            key: "totalAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.totalAmt, 2, ','))
            }
          }

        ],
        pickPackBillSelectList: null
      }
    },
    props: {
      pickPackBillWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      needBillClass: "",
      needBillType: "",
      packetSeqWithout: ""
    },
    computed: {
      tempPickPackBillWin: {
        get() {
          return this.pickPackBillWin;
        },
        set() {
        }
      }
    },
    watch: {
      pickPackBillWin(val) {
        if (val) {
          this.pickPackBillForm.billClass = this.packetSeqWithout;
          this.pickPackBillForm.billClass = this.needBillClass;
          this.pickPackBillForm.billType = this.needBillType;
          this.$nextTick(() => {
            this.$refs.pickPackBillDatagrid.dataChange(1);
          });
        }
      }
    },
    methods: {
      onCurrentChange(currentRow, oldCurrentRow, _index){
        this.pickPackBillSelectList = currentRow;
      },
      onCurrentChangeCancle(){
        this.pickPackBillSelectList = null;
      },
      //票据包挑票页面查询
      handlePickPackBillSearch() {
        this.$refs.pickPackBillDatagrid.dataChange(this.$refs.pickPackBillDatagrid.pageInfo.pageNo);
      },
      //票据包挑票页面重置查询条件
      resetPickPackBillSearch() {
        this.$refs.pickPackBillForm.resetFields();
      },
      //票据包挑票新增方法
      pickPackBillStock() {
        let list = this.pickPackBillSelectList;
        if (!list) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        //this.pickPackBillSelectList = null;
        this.$emit("pickedPackBill", list.id);
      },
      handleClose() {
        this.pickPackBillSelectList = null;
        this.$refs.pickPackBillForm.resetFields();
        this.$emit("pickPackBillWinClose", "");
      }
    },
    mounted() {
      getDictListByGroups("CDMedia,DraftTypeCode").then(res => {
        this.dictMap = res.get("map");
      });
    }
  };
</script>

<style scoped>

</style>
