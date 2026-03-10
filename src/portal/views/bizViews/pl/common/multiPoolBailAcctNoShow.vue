<template>
  <h-msg-box v-model="multiPoolBailAcctNoWin" width="800" :mask-closable="false" @on-close="handleWinClose"
             class="h-form-search-layer" :maximize="true" >
    <p slot="header">
      <br/>
    </p>
    <div>
      <multi-pool-bail-acct-no :params="signPoolInfoForm"></multi-pool-bail-acct-no>
    </div>
    <div slot="footer">
      <h-button type="ghost" @click="handleWinClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="handleWinClose">{{$t("m.i.common.commit")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
import MultiPoolBailAcctNo from "./multiPoolBailAcctNo";
export default {
  name: "multiPoolBailAcctNoShow",
  components: {MultiPoolBailAcctNo},
  props: {
    win: {
      type: Boolean,
      default() {
        return false;
      }
    },
    params: {
      isMultiPool: '',
      signPoolInfoList: [],
      isSubAcctWorks: "",
      optType: "",
      custNo: "",
      legalNo: "",
    }
  },
  watch: {
    multiPoolBailAcctNoWin(val) {
      if (val === true) {
        this.signPoolInfoForm.isMultiPool = this.params.isMultiPool;
        this.signPoolInfoForm.signPoolInfoList = this.params.signPoolInfoList;
        this.signPoolInfoForm.isSubAcctWorks = this.params.isSubAcctWorks;
        this.signPoolInfoForm.optType = this.params.optType;
        this.signPoolInfoForm.custNo = this.params.custNo;
        this.signPoolInfoForm.legalNo = this.params.legalNo;
      }
    }
  },
  computed: {
    multiPoolBailAcctNoWin: {
      get() {
        return this.win;
      },
      set() {
      }
    }
  },
  data() {
    return {
      signPoolInfoForm:{
        isMultiPool: '',
        signPoolInfoList: [],
        isSubAcctWorks: "",
        optType: "",
        custNo: "",
        legalNo: "",
      },
    }
  },
  methods:{
    handleWinClose() {
      this.$emit("showMultiPoolBailAcctNoWinClose", "");
    },
  }
}
</script>

<style scoped>

</style>
