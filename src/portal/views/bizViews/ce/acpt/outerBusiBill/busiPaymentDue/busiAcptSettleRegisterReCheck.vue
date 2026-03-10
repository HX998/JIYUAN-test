<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="reverseBillNo" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="formItem.reverseBillNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate one-form">
                  <h-button type="primary" @click="handleSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                      url="/ce/acpt/outerBusiBill/busiPaymentDue/busiAcptSettleRegisterReCheck/func_pageQueryAcptCorpList"
                      :bindForm="formItem"
                      :has-select="false"
                      :row-select="true"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="recheckPass" >{{$t('m.i.common.pass')}}</h-button>
              <h-button type="primary" @click="recheckBack" >{{$t('m.i.common.back')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>
  </div>
</template>

<script>
import {formatNumber, getDictListByGroups, getDictValueFromMap, post} from "@/api/bizApi/commonUtil";

export default {
    name: "busiAcptSettleRegisterReCheck",
    data() {
      return {
        formItem: {
          billNoLike: '',
          acptDt: '',
          applSettleTellerNoNotEqual : this.$store.getters.userInfo.userNo,
          auditModeKey : 'ce.acpt.is_corp_settle_pay_rgst_check_exclude',
          acptSettleRgstStatusList: 'BTA02,BTA05',
          reverseBillNo: ''
        },
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            key:"duoxuan",

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
             title: this.$t("m.i.billInfo.drweBankNo"),
            key: 'acptBankNo',

            hiddenCol: false
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
            title: this.$t("m.i.billInfo.hldrName"),
            key: 'hldrName',
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.hldrAcctNo"),
            key: 'hldrAcctNo',

            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.hldrBankNo"),
            key: 'hldrBankNo',

            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.hldrSocCode"),
            key: 'hldrSocCode',

            hiddenCol: false
          },
          {
          title: this.$t("m.i.ce.entrustBankNo"),
            key: 'prsttnBankNo',

            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.acptSettleRgstStatus"),
            key: 'acptSettleRgstStatus',

            hiddenCol: false,
            render: (h, params) => {
              let key = "";
              let dictValue = getDictValueFromMap(this.dictMap,"AcptRgstStatus",params.row.acptSettleRgstStatus);
              return h("span", {domProps: {title: dictValue}}, dictValue);

            }
          },
          /*{
            title: this.$t("m.i.billInfo.dataSource"),
            key: 'isInnerChannel',

            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"Yon",params.row.isInnerChannel);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },*/
        ],
        dictMap: new Map(),
        billId: '',
        showBillInfoWin: false
      }
    },
    components : {
    },
    mounted() {
      getDictListByGroups("CorpScale,Yon,Province,Industry,ImgMainStatus,DraftTypeCode,AcptRgstStatus").then(res => {
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
      },

      recheckPass() {
        if (this.$refs.datagrid.selects != null && this.$refs.datagrid.selects.length !== 0) {
          this.$hMsgBox.confirm({
            title: "确认",
            content: "确定复核通过吗？",
            onOk: () => {
              this.handleBackReCheck("1");
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      //退回
      recheckBack() {
        if (this.$refs.datagrid.selects != null && this.$refs.datagrid.selects.length !== 0) {
          this.$hMsgBox.confirm({
            title: "确认",
            content: "确定复核退回吗？",
            onOk: () => {
              this.handleBackReCheck("2");
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      handleBackReCheck(checkFlag) {
        let list = this.$refs.datagrid.selects;
        let ids = "";
        for (let i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({ ids: ids, checkFlag: checkFlag }, "/ce/acpt/outerBusiBill/busiPaymentDue/busiAcptSettleRegisterReCheck/func_checkAcptCorpSettle").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(1);
              this.$refs.datagrid.selects = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(billId){
        this.billId = billId;
        this.showBillInfoWin = true;
      }
    }
  };
</script>

<style scoped>

</style>
