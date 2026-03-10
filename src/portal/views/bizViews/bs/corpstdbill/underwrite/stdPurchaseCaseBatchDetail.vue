<template>
  <div>
    <h-msg-box v-model="tempStdPurchaseCaseBatchDetailWin" maximize width="1000" :mask-closable="false"
               @on-close="handleClose">
      <p slot="header">
        <span>认购函详情</span>
      </p>
      <div class="text-body">
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.bs.stdProductName") }}:</h-col>
              <h-col span="15" class="val">{{ formItem.stdProductName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.bs.stdProductShortName") }}:</h-col>
              <h-col span="15" class="val">{{ formItem.stdProductShortName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.bs.stdProductNo") }}:</h-col>
              <h-col span="15" class="val">{{ formItem.stdProductNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.common.brchName') }}:</h-col>
              <h-col span="15" class="val">{{ formItem.investBrchName }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.investLegalPerson') }}:</h-col>
              <h-col span="15" class="val">{{ formItem.investLegalPerson }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.investLicenseNo') }}:</h-col>
              <h-col span="15" class="val">{{ formItem.investLicenseNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.investAgentName') }}:</h-col>
              <h-col span="15" class="val">{{ formItem.investAgentName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.bs.email") }}:</h-col>
              <h-col span="15" class="val">{{ formItem.investEmail }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.linkPhone') }}:</h-col>
              <h-col span="15" class="val">{{ formItem.investPhone }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.fax') }}:</h-col>
              <h-col span="15" class="val">{{ formItem.investFax }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.investTrustAcctName') }}:</h-col>
              <h-col span="15" class="val">{{ formItem.investTrustAcctName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.investTrustAcctNo') }}:</h-col>
              <h-col span="15" class="val">{{ formItem.investTrustAcctNo }}</h-col>
            </h-row>
          </h-col>
        </h-row>
      </div>
      <h-datagrid
        :columns="columns"
        highlight-row
        :auto-load="false"
        :bindForm="dataGridFormItem"
        :url="dataGridUrl"
        :has-select="false"
        :rowSelect="true"
        ref="datagridDetail">
        <div slot="toolbar" class="pull-left">
          <!--          <h-button type="primary" @click="listExport()" v-if="!isNotShowExport">{{$t("m.i.common.exportData")}}</h-button>-->
        </div>
      </h-datagrid>
      <div slot="footer" style="text-align:left">

      </div>
    </h-msg-box>

  </div>
</template>

<script>
  import {post, formatNumber} from "@/api/bizApi/commonUtil";

  export default {
    name: "stdPurchaseCaseBatchDetail",
    components: {},
    data() {
      return {
        batchId: "",
        formItem: {},
        dataGridFormItem: {
          batchId: ""
        },
        dataGridUrl: "/bs/corpstdbill/underwrite/stdPurchaseCaseApply/func_queryStdPurchaseCaseDetailPage",
        columns: [
          {
            type: "selection",
            width: 50,
            hiddenCol: false,
            align: "center"
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.bs.purchasePrice"),
            key: "purchasePrice",
            hiddenCol: false,
            sortable: true,
            align: "right",
            render: (h, params) => {
              return h("p", formatNumber(params.row.purchasePrice, 4, ","));
            }
          },
          {
            title: this.$t("m.i.bs.purchaseAmt"),
            key: "purchaseAmt",
            hiddenCol: false,
            sortable: true,
            align: "right",
            render: (h, params) => {
              return h("p", formatNumber(params.row.purchaseAmt, 2, ","));
            }
          },
        ],
      };
    },
    props: {
      stdPurchaseCaseBatchDetailWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      batchParams: {
        type: Object,
        default() {
          return {};
        }
      },
      dictMap: {
        type: Map,
        required: true
      },
    },
    computed: {
      tempStdPurchaseCaseBatchDetailWin: {
        get() {
          return this.stdPurchaseCaseBatchDetailWin;
        },
        set() {
        }
      }
    },
    watch: {
      stdPurchaseCaseBatchDetailWin(val) {
        if (val) {
          if (this.batchParams.dataGridUrl) {
            this.dataGridUrl = this.batchParams.dataGridUrl;
          }
          this.batchId = this.batchParams.batchId;
          this.dataGridFormItem.batchId = this.batchParams.batchId;
          this.$nextTick(() => {
            if (this.dataGridFormItem.batchId) {
              this.queryObjById();
              this.handleSearch();
            }
          });
        }
      }
    },


    methods: {
      // 根据批次Id查询信息
      queryObjById() {
        let params = {id: this.batchId};
        let url = "/bs/corpstdbill/underwrite/stdPurchaseCaseApply/func_findStdPurchaseCaseBatchById";
        if (this.batchParams.batchUrl) {
          url = this.batchParams.batchUrl;
        }
        post(params, url).then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.formItem= res.data.retData;
              } else {
                this.$msgTip.error(this, {info: res.data.retMsg});
              }
            } else {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            }
          }
        );
      },
      handleSearch(pageNo) {
        if (this.dataGridFormItem.batchId) {
          this.$refs.datagridDetail.selects = [];
          this.$refs.datagridDetail.selectIds = [];
          this.$refs.datagridDetail.dataChange(!!pageNo ? pageNo : 1);
        }
      },
      // 关闭弹窗
      handleClose() {
        this.formItem= {};
        this.dataGridFormItem.batchId = "";
        this.batchId = "";
        this.$refs.datagridDetail.selects = [];
        this.$refs.datagridDetail.selectIds = [];
        this.$emit("stdPurchaseCaseBatchDetailClose", "");
      },
    }
  };
</script>

<style scoped>

</style>
