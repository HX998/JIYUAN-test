<template>
  <div>
    <h-msg-box maximize v-model="tempPreAuditPrintWin" width="1000" @on-close="handleClose">
      <p slot="header">
        <span>打印清单</span>
      </p>
      <div class="text-body" >
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.be.counterpartyFullName')}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.custBrchName}}</h-col>
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
              <h-col span="9" class="label">{{$t('m.i.be.preAuditNo')}}:</h-col>
              <h-col span="15" class="val">{{viewDatailForm.preAuditNo}}</h-col>
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
              <h-col span="9" class="label">{{$t('m.i.be.firstTransRate')}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.ratePct}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.dueTradRate")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.dueRatePct}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.common.busiType')}}：</h-col>
              <h-col span="15" class="val">{{format("BusiType",viewDatailForm.busiType)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.be.firstSettleDt')}}：</h-col>
              <h-col span="15" class="val">{{formatDate(viewDatailForm.firstSettleDt)}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
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
              <h-col span="9" class="label">{{$t('m.i.common.totalNumBillPackage')}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.totalNum}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.common.totalAmtBillPackage')}}：</h-col>
              <h-col span="15" class="val">{{formatNumber(viewDatailForm.totalAmt)}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.be.firstPayInterestByUnit')}}：</h-col>
              <h-col span="15" class="val">{{formatNumber(viewDatailForm.firstPayInterest)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.be.dueInterestByUnit')}}：</h-col>
              <h-col span="15" class="val">{{formatNumber(viewDatailForm.dueInterest)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.be.firstSettleAmtByUnit')}}：</h-col>
              <h-col span="15" class="val">{{formatNumber(viewDatailForm.firstSettleAmt)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.be.dueSettleAmtByUnit')}}：</h-col>
              <h-col span="15" class="val">{{formatNumber(viewDatailForm.dueSettleAmt)}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
      </div>
      <h-datagrid :columns="billsColumns" :autoLoad="autoLoad" :url="billsUrl" :bindForm="formItem" ref="bills">
        <div slot="toolbar" class="pull-left">
          <h-button type="primary" @click="printList">{{$t('m.i.be.printBill')}}</h-button>
        </div>
      </h-datagrid>
      <div slot="footer">
      </div>

      <h3 class="list-header">打印清单</h3>
      <div v-show="false"  ref="saleBatch">
        <ul class="list-total-info clearfix">
          <li>
            <label class="label">{{$t('m.i.be.counterpartyFullName')}}：</label><span class="val">{{viewDatailForm.custBrchName}}</span>
          </li>
          <li>
            <label class="label">{{$t('m.i.billInfo.billType')}}：</label><span class="val">{{format("DraftTypeCode",viewDatailForm.billType)}}</span>
          </li>
          <li>
            <label class="label">{{$t('m.i.be.preAuditNo')}}：</label><span class="val">{{viewDatailForm.preAuditNo}}</span>
          </li>
          <li>
            <label class="label">{{$t('m.i.billInfo.billClass')}}：</label><span class="val">{{format("CDMedia",viewDatailForm.billClass)}}</span>
          </li>
          <li>
            <label class="label">{{$t('m.i.be.firstTransRate')}}：</label><span class="val">{{viewDatailForm.ratePct}}</span>
          </li>
          <li>
            <label class="label">{{$t('m.i.be.dueTradRate')}}：</label><span class="val">{{viewDatailForm.dueRatePct}}</span>
          </li>
          <li>
            <label class="label">{{$t('m.i.common.busiType')}}：</label><span class="val">{{format("BusiType",viewDatailForm.busiType)}}</span>
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
            <label class="label">{{$t('m.i.common.totalNumBillPackage')}}：</label><span class="val">{{viewDatailForm.totalNum}}</span>
          </li>
          <li>
            <label class="label">{{$t('m.i.common.totalAmtBillPackage')}}：</label><span class="val">{{formatNumber(viewDatailForm.totalAmt)}}</span>
          </li>
          <li>
            <label class="label">{{$t('m.i.be.firstPayInterestByUnit')}}：</label><span class="val">{{formatNumber(viewDatailForm.firstPayInterest)}}</span>
          </li>
          <li>
            <label class="label">{{$t('m.i.be.dueInterestByUnit')}}：</label><span class="val">{{formatNumber(viewDatailForm.dueInterest)}}</span>
          </li>
          <li>
            <label class="label">{{$t('m.i.be.firstSettleAmtByUnit')}}：</label><span class="val">{{formatNumber(viewDatailForm.firstSettleAmt)}}</span>
          </li>
          <li>
            <label class="label">{{$t('m.i.be.dueSettleAmtByUnit')}}：</label><span class="val">{{formatNumber(viewDatailForm.dueSettleAmt)}}</span>
          </li>
        </ul>
      </div>
      <div  ref="saleBill" v-show="false" class="list-table-box">
        <table class="list-table">
          <thead>
          <tr>
            <td>序号</td>
            <td>{{$t('m.i.billInfo.billOrigin')}}</td>
            <td>{{$t('m.i.billInfo.billPackageNo')}}</td>
            <td>{{$t('m.i.billInfo.billRange')}}</td>
            <td>{{$t('m.i.billInfo.billPackageMoney')}}</td>
            <td>{{$t('m.i.billInfo.remitDt')}}</td>
            <td>{{$t('m.i.billInfo.dueDt')}}</td>
            <td>{{$t('m.i.billInfo.dueMatDt')}}</td>
            <td>{{$t('m.i.be.remainingPeriod')}}</td>
            <td>{{$t('m.i.be.firstPayInterestByUnit')}}</td>
            <td>{{$t('m.i.be.dueInterestByUnit')}}</td>
            <td>{{$t('m.i.be.firstSettleAmtByUnit')}}</td>
            <td>{{$t('m.i.be.dueSettleAmtByUnit')}}</td>
            <td>{{$t('m.i.billInfo.drwrName')}}</td>
            <td>{{$t('m.i.billInfo.acptName')}}</td>
            <td>{{$t('m.i.billInfo.discBankName')}}</td>
            <td>{{$t('m.i.billInfo.guarntrTrustBankName')}}</td>
            <td v-if="openI9flag">{{$t('m.i.be.assetIndustry')}}</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in billInfo" >
            <td>{{index+1}}</td>
            <td>{{formatBillOrigin('BillOrigin', item.billOrigin)}}</td>
            <td>{{item.billNo}}</td>
            <td>{{formatBillRange(item.billOrigin, item.billRangeStart, item.billRangeEnd)}}</td>
            <td>{{formatNumber(item.billMoney)}}</td>
            <td>{{formatDate(item.remitDt)}}</td>
            <td>{{formatDate(item.dueDt)}}</td>
            <td>{{formatDate(item.dueMatDt)}}</td>
            <td>{{item.remainDays}}</td>
            <td>{{formatNumber(item.firstPayInterest)}}</td>
            <td>{{formatNumber(item.dueInterest)}}</td>
            <td>{{formatNumber(item.firstSettleAmt)}}</td>
            <td>{{formatNumber(item.dueSettleAmt)}}</td>
            <td>{{item.drwrName}}</td>
            <td>{{item.acptName}}</td>
            <td>{{item.discBankName}}</td>
            <td>{{item.guarntrTrustBankName}}</td>
            <td v-if="openI9flag">{{format('AssetIndustry', item.assetIndustry)}}</td>
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
  import {formatNumber, getDictValueFromMap, post, formatBillRange} from "@/api/bizApi/commonUtil";

  export default {
    name: "preAuditDetailPrint",
    data() {
      return {
        batchUrl:"/be/market/preaudit/preAuditMain/func_findPreAuditById",
        billsUrl:"/be/market/preaudit/preAuditMain/func_findBillByBatchIdByPage",
        openI9flag: false,
        viewDatailForm : {
          preAuditNo: '',
          busiType: '',
          ratePct: '',
          subDeal: '',
          clearSpeed: '',
          firstSettleDt: '',
          dueSettleDt: '',
          settleMode: '',
          clearType: '',
          setTm: '',
          rate: "",
          custBrchName: '',
          billType: '',
          billClass: '',
          totalAmt: '',
          firstPayInterest: '',
          firstSettleAmt: '',
          tenorDays: '',
          yieldRatePct: '',
          totalNum: '',
          dealDt: ""
        },
        billsColumns : [
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
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
            key: "billNo",
            hiddenCol: false,
            sortable: true,
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
            title: this.$t('m.i.billInfo.billPackageMoney'),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', formatNumber(params.row.billMoney, 2, ','))
            }
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
            sortable: true,
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
            hiddenCol:window.sessionStorage.getItem("isOpenI9")=="1"?false:true,
            render: (h, params) => {
              let dictValue =getDictValueFromMap(this.dictMap, 'AssetIndustry', params.row.assetIndustry);
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
        },
      }
    },
    props: {
      batchId: {
        type: [String, Number],
        default() {
          return "";
        }
      },
      preAuditPrintWin: {
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
      dictMap: {
        type: Map
      }
    },
    methods: {
      format(groupcode, key) {
        return getDictValueFromMap(this.dictMap, groupcode, key);
      },
      formatDate(value) {
        return value ? this.$moment(value, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
      },
      formatNumber(value) {
        return formatNumber(value, 2, ',');
      },
      formatBillOrigin(groupcode, key) {
        if (!key || key === 'CS00') {
          return "";
        }
        return this.getDictValueFromMap(this.dictMap, groupcode, key)
      },
      formatBillRange(billOrigin, billRangeStart, billRangeEnd){
        return formatBillRange(billOrigin, billRangeStart, billRangeEnd)
      },
      printList() {
        post({ batchId: this.batchId }, this.billsUrl).then(res => {
          if (res && res.data) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.billInfo = res.data.retData.list;

              for(let i=0;i<this.billInfo.length;i++){
                let dictValue =getDictValueFromMap(this.dictMap, 'AssetIndustry', this.billInfo[i].assetIndustry);
                console.log(dictValue);
                this.billInfo[i].assetIndustry=dictValue;
              }
              this.$nextTick(()=>{
                let batchInfo=this.$refs.saleBatch.innerHTML;
                let billInfo=this.$refs.saleBill.innerHTML;
                let options = { bodyTop: "42%", headHeight:"25%"};
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
    watch: {
      preAuditPrintWin(i) {
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
    mounted() {
      this.openI9flag = window.sessionStorage.getItem('isOpenI9') == '1' ? true : false;
      this.getDictListByGroups("AssetIndustry").then(res => {
        this.dicMap = res.get("map");
        this.dictObject={
          assetIndustryList:res.get("AssetIndustry"),
        }
      });

    },
    computed: {
      tempPreAuditPrintWin: {
        get() {
          return this.preAuditPrintWin;
        },
        set() {
        }
      }
    }
  };
</script>

<style scoped>

</style>
