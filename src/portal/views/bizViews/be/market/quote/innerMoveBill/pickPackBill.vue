<template>
  <div>
    <h-msg-box v-model="tempPickPackBillWin" width="1000" @on-close="handleClose"  class="h-form-table-layer" :maximize="true" :mask-closable="false">
      <p slot="header">
        <span >票据包挑票页面</span>
      </p>
      <div>
        <h-form :model="pickPackBillForm" :label-width="90" ref="pickPackBillForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.be.packetSeq')"  prop="dealNo">
            <h-input v-model="pickPackBillForm.dealNo" placeholder=""></h-input>
          </h-form-item>
          <h-form-item class="h-form-operate">
            <h-button type="primary" @click="handlePickPackBillSearch()">{{$t('m.i.common.search')}}</h-button>
            <h-button type="ghost" @click="resetPickPackBillSearch()">{{$t('m.i.common.reset')}}</h-button>
          </h-form-item>
        </h-form>
        <h-datagrid :columns="pickPackBillColumns"
                    url="/be/market/quote/quoteManager/func_querySalePacketBill"
                    highlight-row
                    :autoLoad="false"
                    :bindForm="pickPackBillForm"
                    :onCurrentChange="onCurrentChange"
                    :onCurrentChangeCancel="onCurrentChangeCancle"
                    ref="pickPackBillDatagrid" class="pl-5 pr-5">
        </h-datagrid>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="pickPackBillClose()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="pickPackBillStock()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import { post, on, off,getDictValueFromMap,formatNumber} from "@/api/bizApi/commonUtil";
  export default {
    name: "pickPackBill",
    data() {
      return  {
        submitFlag : false,
        pickPackBillForm:{
          dealNo:''
        },
        pickPackBillColumns:[
          {
            type: 'radio',
            title: " ",
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
            title: this.$t('m.i.be.packetSeq'),
            key: 'dealNo',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.saleBrchName'),
            key: 'saleBrchName',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.firstSettleDate'),
            key: 'firstSettleDt',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', params.row.firstSettleDt?this.$moment(params.row.firstSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD"):"")
            }
          },
          {
            title: this.$t('m.i.be.dueSettleDt'),
            key: 'dueSettleDt',
            hiddenCol: false,
            render: (h, params) => {
              return h('span', params.row.dueSettleDt?this.$moment(params.row.dueSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD"):"")
            }
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: 'billType',
            hiddenCol: false,
            render: (h, params) => {
          let dictValue =getDictValueFromMap(this.curDictMap.dictListMap, 'DraftTypeCode', params.row.billType);
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
            render: (h, params) => {
          let dictValue =getDictValueFromMap(this.curDictMap.dictListMap, 'CDMedia', params.row.billClass);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.totalNum'),
            key: 'totalNum',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.totalAmtByYUAN'),
            key: 'totalAmt',
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.totalAmt, 2, ','))
            }
          },

        ],
        pickPackBillSelectList: [],
        pickPackBillSelectRowInx: [],
        curDictMap:new Map()
      };
    },
    props:{
      batchId:Number,
      billType:String,
      billClass:String,
      isTemStorage:String,
      dictMap:{
        type:Object
      },
      firstSettleDt:[Number,String],
      dueSettleDt:[Number,String],
      pickPackBillWin:{
        type: Boolean,
        default() {
          return false;
        }
      },
    },
    computed: {
      tempPickPackBillWin: {
        get() {
          return this.pickPackBillWin;
        },
        set(){

        }
      },
    },
    watch:{
      pickPackBillWin(val){
        if(val){
          this.pickPackBillInit();
          this.$nextTick(() => {
            if(this.pickPackBillForm.batchId){
              this.$refs.pickPackBillDatagrid.dataChange(1);
              this.pickPackBillSelectList = [];
            }
          });
        }
      }
    },
    methods:{
      handleClose() {
        this.pickPackBillSelectList = [];
        this.$refs.pickPackBillForm.resetFields();
        this.firstSettleDt="";
        this.dueSettleDt="";
        this.pickPackBillForm.batchId ="";
        this.pickPackBillForm.maxFirstSettleDt="";
        this.pickPackBillForm.minDueSettleBakDt="";
        this.$emit("pickPackBillWinClose", "");

      },
      pickPackBillClose(){
        this.pickPackBillSelectList = [];
        this.$refs.pickPackBillForm.resetFields();
        this.firstSettleDt="";
        this.dueSettleDt="";
        this.pickPackBillForm.batchId ="";
        this.pickPackBillForm.maxFirstSettleDt="";
        this.pickPackBillForm.minDueSettleBakDt="";
        this.$emit("pickPackBillWinClose", "");
      },
      pickPackBillInit(){
        this.pickPackBillForm.billType=this.billType;
        this.pickPackBillForm.billClass=this.billClass;
        this.pickPackBillForm.batchId = this.batchId;
        if(this.firstSettleDt){
          this.pickPackBillForm.maxFirstSettleDt = this.firstSettleDt.replace(/-/g, "");
        }
        if(this.dueSettleDt){
          this.pickPackBillForm.minDueSettleBakDt = this.dueSettleDt.replace(/-/g, "");
        }
        this.curDictMap=this.dictMap;
      },
      onCurrentChange(currentRow, oldCurrentRow, _index){
        this.pickPackBillSelectList = [currentRow];
      },
      onCurrentChangeCancle(){
        this.pickPackBillSelectList = []
      },
      //票据包挑票页面查询
      handlePickPackBillSearch(){
        this.$refs.pickPackBillDatagrid.dataChange(1);
        this.pickPackBillSelectList = [];
      },
      //票据包挑票页面重置查询条件
      resetPickPackBillSearch() {
        this.$refs.pickPackBillForm.resetFields();
      },
      //票据包挑票新增方法
      pickPackBillStock(){
        this.submitFlag=true;
        let list = this.pickPackBillSelectList;
        if (list.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          this.submitFlag=false;
          return;
        }
        if (list.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          this.submitFlag=false;
          return;
        }
        let batchId = this.batchId;
        let url="/be/market/quote/quoteManager/addSalePacketBill";
        post({ saleBatchId: batchId ,buyBatchId:list[0].id,isTemStorage:this.isTemStorage}, url).then(res => {
          if (res) {
            let retCode = res.data.retCode
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.pickPackBillSelectList = [];
              this.pickPackBillClose();
              this.submitFlag=false;
            } else {
              this.submitFlag=false;
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.submitFlag=false;
            this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
          }
        });

      }
    }
  };
</script>

<style scoped>

</style>
