<template>
  <div>
    <h-msg-box maximize v-model="tempImageWin" width="1000" @on-close="handleClose">
      <p slot="header">
        <span>打印清单</span>
      </p>
      <div class="text-body" >
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">交易对手全称：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.buyBrchName}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.billInfo.billType')}}:</h-col>
              <h-col span="15" class="val">{{format("DraftTypeCode",viewDatailForm.billType)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">批次号:</h-col>
              <h-col span="15" class="val">{{viewDatailForm.batchNo}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.billInfo.billClass')}}：</h-col>
              <h-col span="15" class="val">{{format("CDMedia",viewDatailForm.billClass)}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">首期交易利率(%)：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.ratePct}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">到期交易利率(%)：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.dueRatePct}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.common.busiType')}}：</h-col>
              <h-col span="15" class="val">{{format("QuoteBusiType",viewDatailForm.busiType)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">成交日：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.dealDt}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.be.firstSettleDt')}}：</h-col>
              <h-col span="15" class="val">{{formatDate(viewDatailForm.firstSettleDt)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.be.dueSettleDt')}}：</h-col>
              <h-col span="15" class="val">{{formatDate(viewDatailForm.dueSettleDt)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.be.settleMode')}}：</h-col>
              <h-col span="15" class="val">{{format("SettleType",viewDatailForm.settleMode)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">总张数：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.totalNum}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">总金额(元)：</h-col>
              <h-col span="15" class="val">{{formatNumber(viewDatailForm.totalAmt)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">首期应付利息(元)：</h-col>
              <h-col span="15" class="val">{{formatNumber(viewDatailForm.firstPayInterest)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">到期应付利息(元)：</h-col>
              <h-col span="15" class="val">{{formatNumber(viewDatailForm.dueInterest)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">首期结算金额(元)：</h-col>
              <h-col span="15" class="val">{{formatNumber(viewDatailForm.firstSettleAmt)}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">到期结算金额(元)：</h-col>
              <h-col span="15" class="val">{{formatNumber(viewDatailForm.dueSettleAmt)}}</h-col>
            </h-row>
          </h-col>
        </h-row>
      </div>
      <h-datagrid :columns="billsColumns" :autoLoad="autoLoad" :url="billsUrl" :bindForm="formItem" ref="bills">
        <div slot="toolbar" class="pull-left">
          <h-button type="primary" @click="printList">{{$t('m.i.be.printBill')}}</h-button>
        </div>
      </h-datagrid>
      <div slot="footer">
      </div>

      <!--<h3 class="list-header">打印清单</h3>-->
      <div v-show="false"  ref="saleBatch">
        <ul class="list-total-info clearfix">
          <li>
            <label class="label">交易对手全称：</label><span class="val">{{viewDatailForm.buyBrchName}}</span>
          </li>
          <li>
            <label class="label">{{$t('m.i.billInfo.billType')}}：</label><span class="val">{{format("DraftTypeCode",viewDatailForm.billType)}}</span>
          </li>
          <li>
            <label class="label">批次号：</label><span class="val">{{viewDatailForm.batchNo}}</span>
          </li>
          <li>
            <label class="label">{{$t('m.i.billInfo.billClass')}}：</label><span class="val">{{format("CDMedia",viewDatailForm.billClass)}}</span>
          </li>
          <li>
            <label class="label">首期交易利率(%)：</label><span class="val">{{viewDatailForm.ratePct}}</span>
          </li>
          <li>
            <label class="label">到期交易利率(%)：</label><span class="val">{{viewDatailForm.dueRatePct}}</span>
          </li>
          <li>
            <label class="label">{{$t('m.i.common.busiType')}}：</label><span class="val">{{format("QuoteBusiType",viewDatailForm.busiType)}}</span>
          </li>

          <li>
            <label class="label">成交日：</label><span class="val">{{viewDatailForm.dealDt}}</span>
          </li>

          <li>
            <label class="label">{{$t('m.i.be.firstSettleDt')}}：</label><span class="val">{{formatDate(viewDatailForm.firstSettleDt)}}</span>
          </li>
          <li>
            <label class="label">{{$t('m.i.be.dueSettleDt')}}：</label><span class="val">{{formatDate(viewDatailForm.dueSettleDt)}}</span>
          </li>

          <li>
            <label class="label">{{$t('m.i.be.settleMode')}}：</label><span class="val">{{format("SettleType",viewDatailForm.settleMode)}}</span>
          </li>
          <li>
            <label class="label">总张数：</label><span class="val">{{viewDatailForm.totalNum}}</span>
          </li>
          <li>
            <label class="label">总金额(元)：</label><span class="val">{{formatNumber(viewDatailForm.totalAmt)}}</span>
          </li>

          <li>
            <label class="label">首期应付利息(元)：</label><span class="val">{{formatNumber(viewDatailForm.firstPayInterest)}}</span>
          </li>
          <li>
            <label class="label">到期应付利息(元)：</label><span class="val">{{formatNumber(viewDatailForm.dueInterest)}}</span>
          </li>
          <li>
            <label class="label">首期结算金额(元)：</label><span class="val">{{formatNumber(viewDatailForm.firstSettleAmt)}}</span>
          </li>
          <li>
            <label class="label">到期结算金额(元)：</label><span class="val">{{formatNumber(viewDatailForm.dueSettleAmt)}}</span>
          </li>
        </ul>
      </div>
      <div  ref="saleBill" v-show="false" class="list-table-box">
        <table class="list-table">
          <thead>
            <tr>
              <td>序号</td>
              <td>票据号码</td>
              <td>出票日期</td>
              <td>汇票到期日</td>
              <td>实际到期日</td>
              <td>计息天数</td>
              <td>票据金额(元)</td>
              <td>{{$t('m.i.be.firstPayInterestByUnit')}}</td>
              <td>{{$t('m.i.be.dueInterestByUnit')}}</td>
              <td>{{$t('m.i.be.firstSettleAmtByUnit')}}</td>
              <td>{{$t('m.i.be.dueSettleAmtByUnit')}}</td>
              <td>出票人</td>
              <td>承兑人</td>
              <td>贴现行</td>
              <td>增信行</td>
              <td v-if="openI9flag && isTotalColl=='1' ">{{$t('m.i.be.assetIndustry')}}</td>
              <td>信用主体</td>
              <td>信用主体名称</td>
              <td>信用主体类型</td>
              <td v-if="openI9flag && isTotalColl!='1' ">{{$t('m.i.be.assetIndustry')}}</td>
            </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in billInfo" >
            <td>{{index+1}}</td>
            <td>{{item.billNo}}</td>
            <td>{{formatDate(item.remitDt)}}</td>
            <td>{{formatDate(item.dueDt)}}</td>
            <td>{{formatDate(item.dueMatDt)}}</td>
            <td>{{item.remainDays}}</td>
            <td>{{formatNumber(item.billMoney)}}</td>
            <td>{{formatNumber(item.firstPayInterest)}}</td>
            <td>{{formatNumber(item.dueInterest)}}</td>
            <td>{{formatNumber(item.firstSettleAmt)}}</td>
            <td>{{formatNumber(item.dueSettleAmt)}}</td>
            <td>{{item.drwrName}}</td>
            <td>{{item.acptName}}</td>
            <td>{{item.discBankName}}</td>
            <td>{{item.guarntrTrustBankName}}</td>
            <td v-if="openI9flag && isTotalColl=='1'">{{format('AssetIndustry', item.assetIndustry)}}</td>
            <td>{{item.creditMainBrchCode}}</td>
            <td>{{item.creditMainBankName}}</td>
            <td>{{format('CreditMajor', item.creditMainBankType)}}</td>
            <td v-if="openI9flag && isTotalColl!='1'">{{format('AssetIndustry', item.assetIndustry)}}</td>
          </tr>
          </tbody>
        </table>
        <div class="list-page">
          <span>当前第<em><font tdata="PageNO" >##</font></em>页</span><span>共<em><font tdata="PageCount" >##</font></em>页</span>
        </div>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import { post,formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "saleDetailPrint",
    data() {
      return {
        batchUrl:"/be/market/quote/quoteManager/findSaleBatchById",
        billsUrl:"/be/market/quote/quoteManager/querySaleBillList",
        openI9flag:false,
        viewDatailForm : {
          batchNo: '',
          quoteNo: '',
          busiType: '',
          quoteTm: '',
          ratePct: '',
          subDeal: '',
          clearSpeed: '',
          firstSettleDt: '',
          dueSettleDt: '',
          settleMode: '',
          clearType: '',
          setTm: '',
          rate: "",
          buyBrchName: '',
          buyTraderName: '',
          billType: '',
          billClass: '',
          totalAmt: '',
          firstPayInterest: '',
          dueInterest: '',
          firstSettleAmt: '',
          dueSettleAmt: '',
          tenorDays: '',
          yieldRatePct: '',
          totalNum: '',
          dealDt: "",
          creditMainBrchCode:'',
          creditMainBankName:'',
          creditMainBankType:''
        },
         billsColumns : [
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
          },
          {
            title: this.$t('m.i.billInfo.billNo'),
            key: "billNo",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: "remitDt",
            hiddenCol: false,
            render: (h, params) => {
              return h('span', params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            hiddenCol: false,
            render: (h, params) => {
              return h('span', params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.billInfo.dueMatDt'),
            key: 'dueMatDt',
            hiddenCol: false,
            render: (h, params) => {
              return h('span', params.row.dueMatDt ? this.$moment(params.row.dueMatDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.be.remainingPeriod'),
            key: "remainDays",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.billMoneyByUnit'),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', formatNumber(params.row.billMoney, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.firstPayInterestByUnit'),
            key: "firstPayInterest",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.firstPayInterest, 2, ','))
            }
          },
           {
             title: this.$t('m.i.be.dueInterestByUnit'),
             key: "dueInterest",
             sortable: true,
             hiddenCol: false,
             render: (h, params) => {
               return h('span', formatNumber(params.row.dueInterest, 2, ','))
             }
           },
          {
            title: this.$t('m.i.be.firstSettleAmtByUnit'),
            key: "firstSettleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.firstSettleAmt, 2, ','))
            },
          },
           {
             title: this.$t('m.i.be.dueSettleAmtByUnit'),
             key: "dueSettleAmt",
             sortable: true,
             hiddenCol: false,
             render: (h, params) => {
               return h('span', formatNumber(params.row.dueSettleAmt, 2, ','))
             },
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
            title: this.$t('m.i.billInfo.discBankName'),
            key: "discBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.guarntrTrustBankName'),
            key: "guarntrTrustBankName",
            sortable: true,
            hiddenCol: false,
          },
           {
             title: this.$t('m.i.be.assetIndustry'),
             key: 'assetIndustry',
             hiddenCol:(window.sessionStorage.getItem("isOpenI9")=="1" && this.isTotalColl=='1') ?false:true ,
             render: (h, params) => {
               let dictValue =this.getDictValueFromMap(this.dictMap, 'AssetIndustry', params.row.assetIndustry);
               return h("span", {
                 domProps: {
                   title: dictValue
                 }
               }, dictValue);
             }
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
              let dictValue = this.getDictValueFromMap(this.dictMap, 'CreditMajor', params.row.creditMainBankType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
           {
             title: this.$t('m.i.be.assetIndustry'),
             key: 'assetIndustry',
             hiddenCol:(window.sessionStorage.getItem("isOpenI9")=="1" && this.isTotalColl!='1')?false:true,
             render: (h, params) => {
               let dictValue =this.getDictValueFromMap(this.dictMap, 'AssetIndustry', params.row.assetIndustry);
               return h("span", {
                 domProps: {
                   title: dictValue
                 }
               }, dictValue);
             }
           },
        ],
        autoLoad : false,
        billInfo : [],
        formItem : {
          batchId: ''
        }
      }
    },
    props: {
      batchId: {
        type: [String, Number],
        default() {
          return "";
        }
      },
      saleDetailPrintWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      busiType: {
        type: String,
        default() {
          return ""
        }
      },
      isTotalColl: {
        type: String,
        default() {
          return ""
        }
      },
      dictMap: {
        type: Map
      }
    },
    methods: {
      format(groupcode, key) {
        return this.getDictValueFromMap(this.dictMap, groupcode, key);
      },
      formatDate(value) {
        return value ? this.$moment(value, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
      },
      formatNumber(value){
        return formatNumber(value, 2, ',');
      },
      printList() {
        let total = this.$refs.bills.total;
        post({ batchId: this.batchId,pageSize:total}, this.billsUrl).then(res => {
          if (res && res.data) {
            let retCode = res.data.retCode
            if (retCode == "000000") {
              this.billInfo = res.data.retData.list;
              this.$nextTick(()=>{
                let batchInfo=this.$refs.saleBatch.innerHTML;
                let billInfo=this.$refs.saleBill.innerHTML;
                let options = { bodyTop: "37%", headHeight:"25%",bodyWidth:"90%"};
                this.$print.printListHtm(this,batchInfo,billInfo,options);
              })
            }
          }

        });

      },
      handleClose() {
        this.$emit("closeMsgBox", "");
      }
    },
    mounted() {
      this.openI9flag=window.sessionStorage.getItem('isOpenI9')=='1'?true:false;
    },
    watch: {
      saleDetailPrintWin(i) {
        if (i == true) {
          post({ id: this.batchId }, this.batchUrl).then(res => {
            if (res.data.retCode === "000000") {
              if (res.data.retData != null)
                this.viewDatailForm = res.data.retData;
            }
          }).catch(error => {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
          });
          this.$nextTick(() => {
            this.formItem.batchId = this.batchId;
            this.$refs.bills.dataChange(1);
          });
        }
      }
    },
    computed: {
      tempImageWin: {
        get() {
          return this.saleDetailPrintWin;
        },
        set() {
        }
      }
    }
  };
</script>

<style scoped>

</style>
