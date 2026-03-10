<template>
    <div>
      <h-msg-box title="修改额度占用对象"  v-model="tempCreditOccupyTypeWin" @on-close="handleClose" class="h-form-table-layer" width="1000" height="500" :footerHide="true">
        <div>
          <h-form :model="billCreditFormItem" :label-width="100" ref="billCreditFormItem" cols="4" class="h-form-search">
            <h-form-item :label="$t('m.i.common.batchNo')" prop="batchNo">
              <h-input v-model="billCreditFormItem.batchNo" placeholder="" readonly ></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.be.creditOccType')" prop="creditOccType">
              <h-select v-model="billCreditFormItem.creditOcc"  required placeholder="" readonly showTitle>
                <h-option v-for="item in curDictMap['creditDeductRuleList']" :value="item.key" :key="item.key" :label="item.value">{{item.value }}</h-option>
              </h-select>
            </h-form-item>

            <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNo"  :validRules="billNoRules">
              <h-input v-model="billCreditFormItem.billNo" placeholder=""></h-input>
            </h-form-item>
            <!--子票区间-->
            <bill-range :form-item="billCreditFormItem" :range-props="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
            <h-form-item class="h-form-operate">
              <h-button type="primary" @click="handleCreditSearch()">{{$t('m.i.common.search')}}</h-button>
              <h-button type="ghost" @click="resetCreditSearch()">{{$t('m.i.common.reset')}}</h-button>
            </h-form-item>
          </h-form>
        </div>
          <h-datagrid :columns="creditColumns"
                      url="/be/market/quote/quoteManager/func_queryRebuyBillList"
                      :bindForm="billCreditFormItem"
                      :auto-load="false"
                      ref="billCreditDatagrid">
          </h-datagrid>
      </h-msg-box>
    </div>
</template>

<script>
  import { post, on, off,formatNumber,getDictValueFromMap} from "@/api/bizApi/commonUtil";
  export default {
    name: "creditOccupyType",
    data(){
      return {
        billNoRules: [{
          test:  /^[0-9]{0,30}$/,
          trigger: "blur",
          message: "长度不能超过30位数字"
        }],
        curDictMap:new Map(),
        billCreditFormItem:{
          batchNo:'',
          creditOcc:'',
          batchId:'',
          billNo:'',
          minBillRangeStart:'',
          maxBillRangeEnd:''
        },
        creditColumns:[
          {
            type: 'index',
            title: this.$t("m.i.common.index"),
            width: 60,
            align: 'center'
          },
          {
            title: this.$t('m.i.common.status'),
            width: 60,
            key: 'preRelationFlag',
            hiddenCol: false,
            render: (h, params) => {
          let dictValue =getDictValueFromMap(this.curDictMap.dictListMap, 'PreRelationFlag', params.row.preRelationFlag);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billOrigin'),
            key: 'billOrigin',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : getDictValueFromMap(this.curDictMap.dictListMap, 'BillOrigin', params.row.billOrigin);
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
          },
          {
            title: this.$t('m.i.billInfo.billRange'),
            key: 'billRange',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = !params.row.billRange  ? '-' :params.row.billRange;
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.creditOccType'),
            key: 'creditOccupyType',
            className:'h-table-overflow-td',
            hiddenCol:false,
            render: (h, params) => {
              //下拉可选荐
              var option = this.curDictMap['creditDeductRuleList'].map((item)=>{
                return h('Option',{
                  props:{
                    value:item.key,
                    key:item.key,
                    label:item.value
                  }
                })}
              )
              return h('Select', {
                props:{
                  value:params.row.creditOccupyType,
                  clearable:false,
                  width:200
                },
                on: {
                  'on-change':(event) => {
                    //选中的值将可以通过
                    this.changeCredit(params.row.id,event);
                  }
                },
              }, option);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageMoney'),
            key: 'billMoney',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('p',formatNumber(params.row.billMoney, 2, ','))
            }
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: 'remitDt',
            hiddenCol: false,
            render: (h, params) => {
              return h('span', params.row.remitDt?this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD"):"")
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: 'dueDt',
            hiddenCol: false,
            render: (h, params) => {
              return h('span', params.row.dueDt?this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD"):"")
            }
          },
          {
            title: this.$t('m.i.billInfo.dueMatDt'),
            key: 'dueMatDt',
            hiddenCol: false,
            render: (h, params) => {
              return h('span', params.row.dueMatDt?this.$moment(params.row.dueMatDt, "YYYY-MM-DD").format("YYYY-MM-DD"):"")
            }
          },
          {
            title: this.$t('m.i.billInfo.drwrName'),
            key: "drwrName",
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: "acptName",
            sortable: true,
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.billInfo.acptBankName'),
            key: "acptBankName",
            sortable: true,
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.billInfo.cfmAppBankName'),
            key: "cfmAppBankName",
            sortable: true,
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.billInfo.acptGuarntrBankName'),
            key: "acptGuarntrBankName",
            sortable: true,
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.billInfo.discBankName'),
            key: "discBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.discGuarntrBankName'),
            key: "discGuarntrBankName",
            sortable: true,
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.billInfo.guarntrTrustBankName'),
            key: "guarntrTrustBankName",
            sortable: true,
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.billInfo.creditMainBrchCode'),
            key: "creditMainBrchCode",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.creditMainBankName'),
            key: "creditMainBankName",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.creditMainBankType'),
            key: "creditMainBankType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap.dictListMap, 'CreditMajor', params.row.creditMainBankType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
        ],
        // 分页切换配置
        pageSizeOpts : [10, 20, 50, 200]
      }
    },
    components:{
    },
    props:{
      batchNo:String,
      batchId:Number,
      creditOcc:String,
      dictMap:{
        type:Object
      },
      creditOccupyTypeWin: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    computed: {
      tempCreditOccupyTypeWin: {
        get() {
          return this.creditOccupyTypeWin;
        },
        set(){

        }
      }
    },
    watch:{
      creditOccupyTypeWin(val){
        if(val){
          this.$nextTick(() => {
            this.billCreditFormItem.batchId=this.batchId;
            this.billCreditFormItem.batchNo=this.batchNo;
            this.billCreditFormItem.creditOcc=this.creditOcc;
            this.curDictMap=this.dictMap;
            this.$refs.billCreditDatagrid.dataChange(1);
          });
        }
      }
    },
    methods:{
      //查询
      handleCreditSearch(){
        this.$refs.billCreditDatagrid.dataChange(1);
      },
      //重置
      resetCreditSearch(){
        this.$refs.billCreditFormItem.resetFields(true);
        this.billCreditFormItem.minBillRangeStart="";
        this.billCreditFormItem.maxBillRangeEnd="";
      },
      handleClose() {
        this.billCreditFormItem.batchId="";
        this.billCreditFormItem.billNo="";
        this.billCreditFormItem.minBillRangeStart="";
        this.billCreditFormItem.maxBillRangeEnd="";
        this.$emit("creditOccupyTypeClose", "");
      },
      changeCredit(id,creditOccupyType){
        if(this.billCreditFormItem.batchId){
          let url = '/be/market/quote/quoteManager/func_editRebuyCreditOccType';
          let ids=id;
          let creditOccType=this.billCreditFormItem.creditOcc;
          if(creditOccupyType){
            creditOccType=creditOccupyType;
          }
          let data={batchId:this.billCreditFormItem.batchId,ids:ids,creditOccType:creditOccType};
          post(data,url).then(res => {
            if(res){
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if(retCode=="000000") {
                this.$msgTip.success(this);
                this.$refs.billCreditDatagrid.dataChange(this.$refs.billCreditDatagrid.$refs.gridPage.currentPage);
              }else{
                this.$msgTip.error(this, { info: msg });
                this.$refs.billCreditDatagrid.dataChange(this.$refs.billCreditDatagrid.$refs.gridPage.currentPage);
              }
            }else{
              this.$msgTip.error(this, { info: this.$t('m.i.common.netError')});
            }
          });
        }

      }
    }
  };
</script>

<style scoped>

</style>
