<!--贴现通经济机构映射-新增弹出框-->
<template>
  <div>
    <h-msg-box v-model="tempAddBrokerEntrustWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1000" class="h-form-search-layer" top="10" @on-maximize="onMaximize">
      <p slot="header">
        <span>新增机构映射</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search" onlyBlurRequire>
          <h-form-item :label="$t('m.i.be.brokerBank')" prop="brokerBrchName" required >
            <h-input v-model="addForm.brokerBrchName" placeholder="" readonly icon="android-search"
                     @on-click="brchSearchWinOpen('broker')"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.entrustBank')" prop="entrustBrchName" required >
            <h-input v-model="addForm.entrustBrchName" placeholder="" readonly icon="android-search"
                     @on-click="brchSearchWinOpen('entrust')"></h-input>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="handleClose()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="saveBatchFunc()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
    <show-cpes-branch-broker :showCpesBranch="showCpesBranch" @showCpesBranchClose="brchSearchWinClose"
                             @showCpesBranchSubmit="brchSearchChange" :memberId="memberId"  :showMemberId="showMemberId"></show-cpes-branch-broker>
  </div>
</template>

<script>
  import { post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "discBrokerEntrustApplyAdd",
    components: {
      ShowCpesBranchBroker:()=>import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranchBroker" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranchBroker`),
    },
    data() {
      return {
        addForm: {
          brokerBrchCode:"",
          brokerBrchName:"",
          entrustBrchCode:"",
          entrustBrchName:"",
        },
        memberId:JSON.parse(window.sessionStorage.getItem("userInfo")).memberId,
        showMemberId:false,
        showCpesBranch:false
      };
    },
    props: {
      addBrokerEntrustWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      batchParams: {
        type: Object,
        default: {}
      }
    },
    computed: {
      tempAddBrokerEntrustWin: {
        get() {
          return this.addBrokerEntrustWin;
        },
        set() {
        }
      }
    },
    watch: {
      addBrokerEntrustWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.queryObj();
          });
        }
      },
    },
    methods: {
      onMaximize() {
        // setTimeout(() => {
        //   this.$refs.datagrid.$refs.gridContent.handleResize();
        // }, 100);
      },
      brchSearchWinOpen(type){
        this.queryType=type;
        this.showCpesBranch=true;

      },
      brchSearchChange(info){
        if("broker"===this.queryType){
          this.addForm.brokerBrchCode=info.brchCode;
          this.addForm.brokerBrchName=info.brchFullNameZh;
        }else if("entrust"===this.queryType){
          this.addForm.entrustBrchCode=info.brchCode;
          this.addForm.entrustBrchName=info.brchFullNameZh;
        }
        this.brchSearchWinClose();
      },
      brchSearchWinClose(){
        this.showCpesBranch=false;
        this.queryType="";
      },
      //查询信息
      queryObj() {
        // let params = { id: this.batchId };
        // let url = "/be/discquote/broker/out/discOutApplyMain/func_editDiscOut";
        // post(params, url).then(res => {
        //   if (res) {
        //     let retCode = res.data.retCode;
        //     if (retCode === "000000") {
        //       let obj = res.data.retData;
        //       this.addForm.id = obj.id;
        //     } else {
        //       this.$msgTip.error(this, { info: res.data.retMsg });
        //     }
        //   } else {
        //     this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        //   }
        // });
      },
      //关闭弹窗
      handleClose() {
        this.$refs.addForm.resetFields();
        this.$emit("addBrokerEntrustWinClose", "");
      },
      saveBatchFunc(){
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            let url = "/be/discquote//mapping/discBrokerEntrustApplyMain/func_addDiscListingBatch";
            post(this.addForm, url).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.handleClose();
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },

    }
  };
</script>

<style scoped>

</style>
