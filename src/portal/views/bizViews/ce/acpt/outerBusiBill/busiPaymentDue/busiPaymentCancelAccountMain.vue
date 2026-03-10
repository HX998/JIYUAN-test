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
                <h-form-item prop="remitDt" :label="$t('m.i.billInfo.remitDt')">
                  <h-date-picker type="daterange" :value="remitDt" format="yyyy-MM-dd" showFormat :editable=false placeholder="" @on-change="remitDtChange" autoPlacement></h-date-picker>
                </h-form-item>
                <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')">
                  <h-date-picker type="daterange" :value="dueDt" format="yyyy-MM-dd" showFormat :editable=false placeholder="" @on-change="dueDtChange" autoPlacement></h-date-picker>
                </h-form-item>
                <h-form-item prop="prsttnName" :label="$t('m.i.ce.entrustName')">
                  <h-input v-model="formItem.prsttnName" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="prsttnAcctNo" :label="$t('m.i.ce.entrustAcctNo')">
                  <h-input v-model="formItem.prsttnAcctNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="drwrName" label="出票人全称">
                  <h-input v-model="formItem.drwrName" placeholder=""></h-input>
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
                      :row-select="true"
                      :has-select="false"
                      url="/ce/acpt/outerBusiBill/busiPaymentDue/busiPaymentRegisterTrackSearch/func_pageQueryTrackSearchList"
                      :bindForm="formItem"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="cancelAccount" >撤销记账</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>
      </h-col>
    </h-row>
  </div>
</template>

<script>
import {formatNumber, getDictListByGroups, getDictValueFromMap, post} from "@/api/bizApi/commonUtil";

export default {
    name: "busiPaymentCancelAccountMain",
    components: {
    },
    data() {
      return {
        showBillInfoWin: false,
        billId: "",
        formItem: {
          paymentBrchNo:this.$store.getters.userInfo.brchNo,
          prsttnName: '',
          prsttnAcctNo: '',
          billNo: '',
          minRemitDt: '',
          maxRemitDt: '',
          minDueDt: '',
          maxDueDt: '',
          prsttnRespStatus:"SN15",
          billClass: 'ME01',
          drwrName:"",
          reverseBillNo: ''
        },
        dueDt: "",
        remitDt: "",
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
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.ce.entrustType"),
            key: 'prsttnType',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.prsttnType === '1') return h('span', '企业')
            }
          },
          {
            title: this.$t("m.i.billInfo.flowStatus"),
            key: 'prsttnRespStatus',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.riskStatus"),
            key: 'riskStatus',
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"RiskStatus",params.row.riskStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: 'billType',
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billMoney"),
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
            title: this.$t("m.i.billInfo.pyeeName"),
            key: 'pyeeName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title:this.$t("m.i.billInfo.pyeeAcctNo"),
            key:"pyeeAcctNo",
            hiddenCol:false
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: 'drwrName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: 'drwrAcctNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
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
            title: this.$t("m.i.billInfo.dueDt"),
            key: 'dueDt',
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.dueDt == null || params.row.dueDt === ""){
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.entrustAcctNo"),
            key: 'prsttnAcctNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.entrustName"),
            key: 'prsttnName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.entrustBankNo"),
            key: 'prsttnBankNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.prsttnApplBankName"),
            key: 'prsttnBankName',
            sortable: true,
            hiddenCol: false,
          }
        ],
        dictMap: new Map(),
        currentSelectList: [],
        ifShowMore: false
      }

    },
    mounted() {
      getDictListByGroups("AcptType,RiskStatus,DraftTypeCode,").then(res => {
        this.dictMap = res.get("map");
      });
    },
    methods: {
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(billId){
        this.billId = billId;
        this.showBillInfoWin = true;
      },
      remitDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minRemitDt = arr[0].replace(/-/g, "");
          this.formItem.maxRemitDt = arr[1].replace(/-/g, "");
          this.remitDt = [arr[0], arr[1]];
        } else {
          this.formItem.minRemitDt = "";
          this.formItem.maxRemitDt = "";
          this.remitDt = [];
        }
      },
      dueDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0], arr[1]];
        } else {
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDt = [];
        }
      },
      //表单查询
      handleSearch() {
        this.$nextTick(() => {
          this.$refs.datagrid.selects = [];
          this.$refs.datagrid.selectIds=[];
          this.$refs.datagrid.dataChange(1);
        })
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.minRemitDt = "";
        this.formItem.maxRemitDt = "";
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.remitDt = "";
        this.dueDt = "";
      },
      //撤销记账
      cancelAccount(){
        if (this.$refs.datagrid.selectIds.length==0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定批次撤销记账吗?",
          onOk: () => {
            this.$loadingbox.open({
              title: "撤销记账中，请稍后..."
            });
            let url="/ce/acpt/outerBusiBill/busiPaymentDue/busiPaymentRegisterMain/func_cancelPaymentAccount";
            post({ids:this.$refs.datagrid.selectIds},url).then(res=>{
              if(res) {
                let msg = res.data.retMsg
                let retCode = res.data.retCode
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.$loadingbox.close();
                  this.$refs.datagrid.selectIds=[];
                  this.$refs.datagrid.selects=[];
                  this.$refs.datagrid.dataChange(1);
                } else {
                  this.$loadingbox.close();
                  this.$msgTip.error(this, { info: msg });
                }
              }
            }).catch(error => {
              this.$loadingbox.close();
              this.$refs.datagrid.selectIds=[];
              this.$refs.datagrid.selects=[];
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
