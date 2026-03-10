<template>
  <!-- 展示记账分录 -->
  <div class="h-tree-search">
    <div class="h-modal-header-wrapper">
      <h-msg-box v-model="tempShowAcctRecordWin" width="1000" class="h-form-table-layer" :maximize="true" @on-close="handleClose" :mask-closable="false">
        <p slot="header">
          <span>分录信息</span>
        </p>
        <!--数据展示表格-->
        <h-row>
          <h-col span="24">
            <div v-for="(value , key) in recordInfo">
              <p>{{value[0].acctGroupName}}</P>
              <h-table :columns="columns" :data="value"></h-table>
            </div>
          </h-col>
        </h-row>
        <div slot="footer">
          <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
          <h-button type="primary" @click="acctSubmit">{{$t("m.i.common.confirmAcct")}}</h-button>
        </div>
      </h-msg-box>
    </div>
  </div>
</template>

<script>
  import { post, getDictListByGroups } from "@/api/bizApi/commonUtil";

  export default {
    name: "showAcctRecord",
    data() {
      return {
        recordInfo : null,
        columns : [
          {
            title: this.$t("m.i.ce.drCr"),
            key: 'drCr'
          },
          {
            title: this.$t("m.i.ce.subjectNo"),
            key: 'acctNo'
          },
          {
            title: this.$t("m.i.ce.amount"),
            key: 'amount'
          }
        ],
      };
    },
    watch: {
      tempShowAcctRecordWin(val) {
        if (val === true) {
          this.getRecordInfo();
        }
      }
    },
    computed: {
      tempShowAcctRecordWin: {
        get() {
          return this.showAcctRecordWin;
        },
        set() {
        }
      }
    },
    props: {
      title: "",
      url : "",
      param: Object,
      showAcctRecordWin: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    methods: {
      //获取分录信息
      getRecordInfo() {
        let params = this.param;
        let url = this.url;
        post(params, url).then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.recordInfo = res.data.retData;
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //确定记账
      acctSubmit() {
        this.$emit("acctSubmitSure",this.param);
      },
      //关闭
      handleClose() {
        this.$emit("showAcctRecordWinClose", "");
      }
    }
  };
</script>

<style scoped>

</style>
