<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div class="h-form-search-box">
          <!-- 查询表单 -->
          <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
            <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
              <h-form-item prop="custNo" :label="$t('m.i.common.custNo')">
                <h-input v-model="formItem.custNo" placeholder="" icon="android-search" @on-click="queryCustName()" readonly
                         clearable @on-clear="clearVal('custName')"></h-input>
              </h-form-item>
              <h-form-item prop="custAcctNo" :label="$t('m.i.common.custAcctNo')">
                <h-input v-model="formItem.custAcctNo" placeholder="" icon="android-search" @on-click="queryCustAcctNo()" readonly
                         clearable @on-clear="clearVal('custAcctNo')"></h-input>
              </h-form-item>
              <common-select v-model="formItem.billOrigin" :label="$t('m.i.billInfo.billOrigin')" prop="billOriginArray"
                             :dictList="billOriginArray"></common-select>
              <bill-no :label="$t('m.i.billInfo.billPackageNo')" prop="billNo" v-model="formItem.billNo"></bill-no>
              <bill-range :form-item="formItem" :range-props="['minBillRangeStart','maxBillRangeEnd']" ></bill-range>
              <h-form-item class="h-form-operate">
                <span class="h-more-input" @click="ifShowMore=!ifShowMore">
                      {{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                <h-button type="primary" @click="handleSearch()">{{$t('m.i.common.search')}}</h-button>
                <h-button type="ghost" @click="resetSearch()">{{$t('m.i.common.reset')}}</h-button>
              </h-form-item>
            </h-form>
          </h-panel>
        </div>
        <!-- 数据展示表格 -->
        <h-datagrid :columns="columns"
                    highlightRow
                    url="/pl/custody/elec/saveBill/eSaveBillApplyRefuseMain/func_pageQueryApplyRefuseBill"
                    :bindForm="formItem"
                    :has-select="hasSelect"
                    :row-select="true"
                    :param-id="paramIdVal"
                    ref="datagrid">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" @click="signRefuse()">{{$t('m.i.pl.refuse')}}</h-button>
          </div>
        </h-datagrid>

        <!-- 查询客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                           @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
        <!-- 查询客户账号信息弹窗 -->
        <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.custNo"
                           @showCustAcctNoWinClose="showCustAcctNoWinClose" @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
        <!--票面信息-->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                        :bill-range-start="this.billRangeStart" :bill-range-end="this.billRangeEnd"
                        :billId="this.billId" :billNo="this.billNo"></bill-info-main>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap,formatNumber ,formatBillRange} from "@/api/bizApi/commonUtil";
  import {deepClone} from "@/utils/index";
  import BillNo from "../../../../../../components/bemp/input/billNo";

  export default {
    name: "eSaveBillApplyRefuseMain",
    components: {
      BillNo
    },
    data() {
      return {
        paramIdVal : 'billId',
        showBillInfoWin : false,
        billId : "",
        billOriginArray: [],
        billNo : "",
        billRangeStart: "",
        billRangeEnd: "",
        dictMap : new Map(),
        formItem : {
          custNo: '',
          custAcctNo: '',
          billNo: '',
          billClass: 'ME02',
          billOrigin: '',
          minBillRangeStart: '',
          maxBillRangeEnd: '',
        },
        columns : [
          {
            type: 'selection',
            key: 'multiSelect',
            width: 60,
            hiddenCol: false,
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
            title: this.$t("m.i.billInfo.billOrigin"),
            key: "billOrigin",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "BillOrigin", params.row.billOrigin);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
           title: this.$t("m.i.billInfo.billPackageNo"),
            key: 'billNo',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billNo = "";
              let type = "";
              if (params.row.billNo === null || params.row.billNo === "") {
                billNo = "查看票面";
              }else {
                billNo = params.row.billNo;
              }
              if (!!params.row.billId) {
                type = "billId";
              } else {
                type = "billNo";
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row, type);
                  }
                }
              }, billNo);
            }
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
           title: this.$t("m.i.billInfo.billType"),
            key: 'billType',
            hiddenCol: false,
            render: (h, params) => {
              return h("span", getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType));
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageMoney"),
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
           title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: 'drwrAcctNo',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: 'drwrName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: 'pyeeName',
            sortable: true,
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
            sortable: true,
            render: (h, params) => {
              if(params.row.dueDt == null || params.row.dueDt === ""){
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          }
        ],
        hasSelect : false,
        showCustAcctNoWin : false,
        showCustMessageWin : false,
        ifShowMore : false,
      };
    },
    mounted() {
      getDictListByGroups("CheckType,DraftTypeCode,BillOrigin").then(res => {
        this.billOriginArray = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      clearVal(type){
        if(type === 'custName'){
          this.formItem.custNo = '';
        }else{
          this.formItem.custAcctNo = '';
        }
      },
      handleSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$nextTick(() => {
          this.$refs.datagrid.dataChange(1);
        });
      },
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.billOrigin = '';
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showBillInfo(info, type) {
        this.billId = "";
        this.billNo = "";
        if (type === "billId") {
          this.billId = info.billId;
        } else {
          this.billNo = info.billNo;
        }
        this.billRangeStart = info.billRangeStart;
        this.billRangeEnd = info.billRangeEnd;
        this.showBillInfoWin = true;
      },
      //查询客户信息
      //触发弹窗
      queryCustName() {
        this.showCustMessageWin = true;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.formItem.custAcctNo = "";
        this.formItem.custNo = info.custNo;
        if (info.custAcctNo !== "") {
          this.formItem.custAcctNo = info.custAcctNo;
        }
        this.showCustMessageWin = false;
      },
      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //查询客户账号信息
      //触发弹窗
      queryCustAcctNo() {
        if (this.formItem.custNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustAcctNoWin = true;
      },
      //赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.custAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //关闭弹窗
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },
      signRefuse() {
        let listData = this.$refs.datagrid.selects;
        if (listData.length !== 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmRefuse") + "?",
            onOk: () => {
              this.refuse();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
        }
      },
      refuse() {
        let list = this.$refs.datagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let pickDtoList = [];
        for(let i=0; i<list.length; i++) {
          let pickDto = {
            transId: list[i].transId,
            billId: list[i].billId,
            hldrId: list[i].hldrId
          };
          pickDtoList.push(pickDto);
        }
        post({pickBillDtoList: pickDtoList}, "/pl/custody/elec/saveBill/eSaveBillApplyRefuseMain/func_applyRefuseBill").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this,{info:msg});
              this.handleSearch();
            } else {
              this.$msgTip.error(this,{info:res.data.retMsg});
              this.handleSearch();
            }
          } else {
            this.$msgTip.error(this,{info:this.$t('m.i.common.netError')});
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
