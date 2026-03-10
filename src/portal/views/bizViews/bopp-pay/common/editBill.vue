<template>
  <h-msg-box v-model="tempEditBillWin" width="800" :mask-closable="false" @on-close="handleClose"
             class="h-form-table-layer" :maximize="true">
    <p slot="header">
      <span>票据录入</span>
    </p>
    <h-panel>
      <div style="margin-top: 15px;">
        <h-tabs :animated="false" :value="tabPane" @on-click="clickTabs" ref="closetab">
          <h-tab-pane :label="$t('s.i.pay.billImportSignal')" name="billImportSignalTab">
            <keep-alive>
              <component is="billImportSignalTab" ref="billImportSignalTab"
                         :payInfoId="payInfoId"></component>
            </keep-alive>
          </h-tab-pane>
          <h-tab-pane :label="$t('s.i.pay.billImportList')" name="billImportListTab">
            <keep-alive>
              <component is="billImportListTab" ref="billImportListTab"
                         :payInfoId="payInfoId"></component>
            </keep-alive>
          </h-tab-pane>
        </h-tabs>
      </div>
    </h-panel>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
      <h-button type="primary" v-else @click="formAdd()">{{$t("m.i.common.commit")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  import {post, on, off, formatNumber, getDictValueFromMap} from "@/api/bizApi/commonUtil";

  export default {
    name: "editBill",
    data(){
      return {
        tabPane: "billImportSignalTab",
        submitFlag: false,
      }
    },
    components: {
      billImportSignalTab: () => import(/* webpackChunkName: "bopp-pay/common/billImportSignalTab" */`@/views/bizViews/bopp-pay/common/billImportSignalTab`),
      billImportListTab: () => import(/* webpackChunkName: "bopp-pay/common/billImportListTab" */`@/views/bizViews/bopp-pay/common/billImportListTab`)
    },
    props: {
      editBillWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      payInfoId: "",
    },
    computed: {
      tempEditBillWin: {
        get() {
          return this.editBillWin;
        },
        set() {
        }
      }
    },
    watch: {
      editBillWin(val) {
        if (val === true) {
          this.handleSearch();
        }
      }
    },
    methods: {
      handleClose() {
        this.tabPane = "billImportSignalTab";
        this.$refs.billImportSignalTab.formItemReset();
        this.$emit("editBillWinClose", "");
      },
      formAdd(){
        this.submitFlag = true;
        let url="/pay/payment/billPaymentMain/func_lockAllBillFromPage";
        let obj = {
          id: this.payInfoId,
          paymentOptionType: "POT01",
          sendBrchType: "TG01",
          memberId: this.$store.getters.userInfo.memberId,
          branchCode: this.$store.getters.userInfo.cepsBrchCode,
        }
        post(obj, url).then(res => {
          if (res) {
            this.submitFlag = false;
            let retCode = res.data.retCode
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.handleClose();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
          }
        });
      },
      //表单查询
      handleSearch() {
        this.$nextTick(() => {
          if (this.tabPane === "billImportSignalTab") {
            this.$refs.billImportSignalTab.handleSearch();
          }
          if (this.tabPane === "billImportListTab") {
            this.$refs.billImportListTab.handleSearch();
          }
        })
      },
      //table点击切换事件
      clickTabs(name) {
        this.tabPane = name;
        this.handleSearch();
      }
    }
  }
</script>

<style scoped>

</style>
