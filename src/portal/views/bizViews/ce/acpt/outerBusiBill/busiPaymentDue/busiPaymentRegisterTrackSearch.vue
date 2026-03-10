<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="reverseBillNo" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="formItem.reverseBillNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="drwrAcctNo" :label="$t('m.i.billInfo.drwrAcctNo')">
                  <h-input v-model="formItem.drwrAcctNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="remitDtRange" :label="$t('m.i.billInfo.remitDt')">
                  <h-date-picker :value="formItem.remitDtRange" type="daterange" showFormat :editable=false
                                 @on-change="handleRemitDtChange" placeholder="" autoPlacement></h-date-picker>
                </h-form-item>
                <h-form-item prop="dueDtRange" :label="$t('m.i.billInfo.dueDt')">
                  <h-date-picker :value="formItem.dueDtRange" type="daterange" showFormat :editable=false
                                 @on-change="handleDueDtChange" placeholder="" autoPlacement></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                        url="/ce/acpt/outerBusiBill/busiPaymentDue/busiPaymentRegisterTrackSearch/func_pageQueryTrackSearchList"
                      :bindForm="formItem"
                      :has-select="false"
                      :row-select="true"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <!--<h-button type="primary" @click="exportData" >{{$t('m.i.common.export')}}</h-button>-->
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>
  </div>
</template>

<script>
import {formatNumber, getDictListByGroups, getDictValueFromMap} from "@/api/bizApi/commonUtil";

export default {
    name: "busiPaymentRegisterTrackSearch",
    components : {
    },
    data() {

      return {
        param : null,
        rows : null,
        formItem: {
          billNoLike:"",
          drwrAcctNo:"",
          remitDtRange:"",
          dueDtRange:"",
          acptStatus:"",
          prsttnRespStatusList: "0000,SN02,SN03,SN05,SN06,SN12,SN14,SN15,SN16",
          reverseBillNo: ''
        },
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: false
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
            title: this.$t("m.i.billInfo.billNo"),
            key: 'billNo',
            sortable: true,
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
                      this.showBillInfo(params.row.billId)
                    }
                  }
                }, params.row.billNo)
              ]);
            }
          },
          {
            title:this.$t("m.i.billInfo.flowStatus"),
            key:"prsttnRespStatus",
            hiddenCol:false
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: 'billType',
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
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
            key: 'billMoney',
            sortable: true,
            hiddenCol: false,
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
            title: this.$t("m.i.billInfo.pyeeName"),
            key: 'pyeeName',
            hiddenCol: false
          },
          {
            title:this.$t("m.i.billInfo.drwrName"),
            key:"drwrName",
            hiddenCol:false
          },
          {
            title:this.$t("m.i.billInfo.drwrAcctNo"),
            key:"drwrAcctNo",
            hiddenCol:false
          },
          {
            title:this.$t("m.i.billInfo.remitDt"),
            key:"remitDt",
            hiddenCol:false,
            render: (h, params) =>{
              let date = !!params.row.remitDt? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD"):""
              return h("span", date);
            }
          },
          {
            title:this.$t("m.i.billInfo.dueDt"),
            key:"dueDt",
            hiddenCol:false,
            render: (h, params) =>{
              let date = !!params.row.dueDt? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD"):""
              return h("span", date);
            }
          },
          {
            title:this.$t("m.i.ce.prsttnApplAcctNo"),
            key:"prsttnAcctNo",
            hiddenCol:false
          },
          {
            title:this.$t("m.i.ce.prsttnApplName"),
            key:"prsttnName",
            hiddenCol:false
          },
          {
            title:this.$t("m.i.ce.prsttnOpenBankNo"),
            key:"prsttnBankNo",
            hiddenCol:false
          },
          {
            title:this.$t("m.i.ce.prsttnApplBankName"),
            key:"prsttnBankName",
            hiddenCol:false
          },
          {
            title: this.$t("m.i.billInfo.paymentDt"),
            key: 'paymentDt',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.paymentDt == null || params.row.paymentDt === ""){
                return "";
              }
              let paymentDt = this.$moment(params.row.paymentDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", paymentDt);
            },
          },
          {
            title:this.$t("m.i.pl.acctTellerName"),
            key:"acctTellerNo",
            hiddenCol:false
          }
        ],
        dictMap: new Map(),
        currentSelectRow: [],
        currentSelectList: [],
        //是否显示更多查询项
        ifShowMore: false,
        billId: '',
        showBillInfoWin: false
      }
    },
    mounted() {
      getDictListByGroups("CorpScale,Yon,Province,Industry,ImgMainStatus,DraftTypeCode,AcptRgstStatus").then(res => {
        this.acptRgstStatusList = res.get("AcptRgstStatus");
        this.acptRgstStatusList = this.acptRgstStatusList.filter(item => item.key !== "BTA15"  &&item.key !== "BTA16"&&item.key !== "BTA17" );
        // 不需要这个，因为可选择的发起方，全部默认为企业
        this.dictMap = res.get("map");
      });
    },
    methods: {
      //表单查询
      handleSearch() {
        this.$refs.datagrid.dataChange(1);
        this.$refs.datagrid.selects = [];
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.drwrCustNo = '';
        this.formItem.maxBillMoney = '';
        this.formItem.minBillMoney = '';
        this.formItem.acptSettleRgstStatus = '';
      },
      handleDueDtChange(arr) {
        if (arr instanceof Array &&arr.length==2) {
          this.formItem.minDueDt=arr[0].replace(/-/g,"");
          this.formItem.maxDueDt=arr[1].replace(/-/g,"");
          this.formItem.dueDtRange=arr;
        }else {
          this.formItem.minDueDt="";
          this.formItem.maxDueDt="";
          this.formItem.dueDtRange=[];
        }
      },
      handleRemitDtChange(arr){
        if (arr instanceof Array &&arr.length==2) {
          this.formItem.minRemitDt=arr[0].replace(/-/g,"");
          this.formItem.maxRemitDt=arr[1].replace(/-/g,"");
          this.formItem.remitDtRange=arr;
        }else {
          this.formItem.minRemitDt="";
          this.formItem.maxRemitDt="";
          this.formItem.remitDtRange=[];
        }
      },
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(billId){
        this.billId = billId;
        this.showBillInfoWin = true;
      },
    }
  };
</script>

<style scoped>

</style>
