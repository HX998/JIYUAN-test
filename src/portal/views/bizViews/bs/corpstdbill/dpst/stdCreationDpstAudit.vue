<!--企业存托-管理审批-->
<template>
  <div>
    <!-- 批次信息 -->
    <div v-if="isShow">
      <div class="text-wrap mb-10">
        <div class="text-header"><span class="tit">详细信息</span></div>
        <div class="text-body">
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.common.batchNo") }}:</h-col>
                <h-col span="15" class="val">{{ formItem.batchNo }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.collectMode') }}:</h-col>
                <h-col span="15" class="val">{{ formatDict("CollectMode", formItem.collectMode) }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.baseAssetType') }}:</h-col>
                <h-col span="15" class="val">{{ formatDict("BaseAssetType", formItem.baseAssetType) }}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.stdProductName') }}:</h-col>
                <h-col span="15" class="val">{{ formItem.stdProductName }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.stdProductShortName') }}:</h-col>
                <h-col span="15" class="val">{{ formItem.stdProductShortName }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.stdProductNo') }}:</h-col>
                <h-col span="15" class="val">{{ formItem.stdProductNo }}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.ecdsAcctNo') }}:</h-col>
                <h-col span="15" class="val">{{ formItem.ecdsAcctNo }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.bs.ecdsAcctName") }}:</h-col>
                <h-col span="15" class="val">{{ formItem.ecdsAcctName }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.dpstBrchName') }}:</h-col>
                <h-col span="15" class="val">{{ formItem.dpstBrchName }}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.dpstBrchCode') }}:</h-col>
                <h-col span="15" class="val">{{ formItem.dpstBrchCode }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.sellBrchName') }}:</h-col>
                <h-col span="15" class="val">{{ formItem.sellBrchName }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.creationMaxAmt') }}:</h-col>
                <h-col span="15" class="val">{{ formatNumber(formItem.creationMaxAmt) }}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.creationMaxTerm') }}:</h-col>
                <h-col span="15" class="val">{{ formItem.creationMaxTerm }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.financeMaxRatePct') }}:</h-col>
                <h-col span="15" class="val">{{ formItem.financeMaxRatePct }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.financeMinRatePct') }}:</h-col>
                <h-col span="15" class="val">{{ formItem.financeMinRatePct }}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.publishDt') }}:</h-col>
                <h-col span="15" class="val">{{ formatDate(formItem.publishDt) }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.declareEndDtTm') }}:</h-col>
                <h-col span="15" class="val">{{ formatDateTime(formItem.declareEndDtTm) }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.purchaseDt') }}:</h-col>
                <h-col span="15" class="val">{{ formatDate(formItem.purchaseDt) }}</h-col>
              </h-row>
            </h-col>

          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.raiseDt') }}:</h-col>
                <h-col span="15" class="val">{{ formatDate(formItem.raiseDt) }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.transPlace') }}:</h-col>
                <h-col span="15" class="val">{{ formatDict("TransPlace", formItem.transPlace) }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.preBeginDueDt') }}:</h-col>
                <h-col span="15" class="val">{{ formatDate(formItem.preBeginDueDt) }}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.preEndDueDt') }}:</h-col>
                <h-col span="15" class="val">{{ formatDate(formItem.preEndDueDt) }}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <br>
          <h-row>
            <h-col span="24">
              <ul>
                <li>
                  <hr>
                </li>
              </ul>
            </h-col>
          </h-row>
          <br>
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.beginDueDt') }}:</h-col>
                <h-col span="15" class="val">{{ formatDate(formItem.beginDueDt) }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.endDueDt') }}:</h-col>
                <h-col span="15" class="val">{{ formatDate(formItem.endDueDt) }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.creationAmt') }}:</h-col>
                <h-col span="15" class="val">{{ formatNumber(formItem.creationAmt) }}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.creationTerm') }}:</h-col>
                <h-col span="15" class="val">{{ formItem.creationTerm }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.paymentDt') }}:</h-col>
                <h-col span="15" class="val">{{ formatDate(formItem.paymentDt) }}</h-col>
              </h-row>
            </h-col>

          </h-row>

          <br>
          <h-row>
            <h-col span="24">
              <ul>
                <li>
                  <hr>
                </li>
              </ul>
            </h-col>
          </h-row>
          <br>
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.calFeeType') }}:</h-col>
                <h-col span="15" class="val">{{ formatDict("CalFeeType", formItem.calFeeType) }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.feeRate') }}:</h-col>
                <h-col span="15" class="val">{{ formItem.feeRatePct }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.auditSumNum') }}:</h-col>
                <h-col span="15" class="val">{{ formItem.sumNum }}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.auditSumAmt') }}:</h-col>
                <h-col span="15" class="val">{{ formatNumber(formItem.sumAmt) }}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <br>

          <h-row :gutter="8">
           <!-- <h-col span="8">
              <h-row>
                <h-button type="primary" @click="showCreditMain()">{{ $t('m.i.bs.showCreditMain') }}</h-button>
                <h-button type="primary" @click="showOrgHolder()" v-if="formItem.collectMode === 'CM02'">
                  {{ $t('m.i.bs.showOrgHolder') }}
                </h-button>
              </h-row>
            </h-col>-->
          </h-row>
        </div>
      </div>
      <h-datagrid
        :columns="billColumns"
        highlight-row
        :notSetWidth="true"
        :bindForm="billFormItem"
        url="/bs/corpstdbill/dpst/stdCreationDpstAudit/func_queryStdCorpDpstBillPage"
        ref="billDatagrid">
        <div slot="toolbar">
        </div>
      </h-datagrid>
    </div>
    <bill-info-main-std @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId" :billNo="billNo" :listId="listId"></bill-info-main-std>
  </div>
</template>

<script>
  import { formatNumber, post } from "@/api/bizApi/commonUtil";

  export default {
    name: "stdCreationDpstAudit",
    data() {
      return {
        formItem: {},
        billFormItem: {
          batchId: "",
          ids: ""
        },
        billColumns: [
         /* {
            type: "selection",
            width: 50,
            hiddenCol: false,
            align: "center"
          },*/
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            title: this.$t('m.i.common.custName'),
            key: 'custName',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.custAcctNo'),
            key: 'custAcctNo',
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.bs.endrsmtApplDt'),
            key: 'endrsmtApplDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.endrsmtApplDt ? this.$moment(params.row.endrsmtApplDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.billInfo.billNo'),
            key: 'billNo',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.billInfoWinOpen(params.row.billId, params.row.billNo,params.row.id)
                  }
                }
              }, params.row.billNo)
            }
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: 'billType',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'DraftTypeCode', params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.drwrName'),
            key: 'drwrName',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: 'acptName',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: 'remitDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: 'dueDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            align: "right",
            render: (h, params) => {
              return h("p", formatNumber(params.row.billMoney, 2, ","));
            }
          },
          {
            title: this.$t('m.i.bs.custPyeeAcctNo'),
            key: 'custPyeeAcctNo',
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.bs.custPyeeBankNo'),
            key: 'custPyeeBankNo',
            hiddenCol: false,
            sortable: true
          },
        ],
        dictMap: new Map(),
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        listId:""
      };
    },
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      listIds: "",
      batchId: ""
    },
    created() {
      this.billFormItem.batchId = this.batchId;
      this.billFormItem.ids = this.listIds;
    },
    mounted() {
      this.getDictListByGroups("BaseAssetType,Yon,DraftTypeCode,CDMedia,TransPlace,CollectMode,CorpScale,Industry,partnerType,CalFeeRuleControlMode,CalFeeType,MemberType,CreditRating").then(res => {
        this.dictMap = res.get("map");
        this.init();
      });
    },
    methods: {
      billInfoWinClose(){
        this.billId=null;
        this.billNo=null;
        this.listId=null;
        this.showBillInfoWin=false;
      },
      billInfoWinOpen(billId,billNo,listId){
        this.billId=billId;
        this.billNo=billNo;
        this.listId=listId;
        this.showBillInfoWin=true;
      },
      formatDict(groupcode, key) {
        if (!!key) {
          return this.getDictValueFromMap(this.dictMap, groupcode, key);
        }
      },
      formatDate(value) {
        if (!!value) {
          return value ? this.$moment(value, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
        }
      },
      formatDateTime(value) {
        return value ? this.$moment(value, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss") : "";
      },
      formatNumber(value){
        return formatNumber(value, 2, ",");
      },
      //  初始化页面
      init() {
        let batchId = this.batchId;
        let listIds = this.listIds;
        let url = "";
        if (batchId) {
          url = "/bs/corpstdbill/dpst/stdCreationDpstAudit/func_findStdCorpDpstById";
        } else {
          this.$msgTip.error(this, { info: "批次ID不能为空" });
        }
        post({ id: batchId ,listIds:listIds}, url).then(res => {
          if (res && res.data) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.formItem = res.data.retData;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      }
    }
  };
</script>

<style scoped>

</style>
