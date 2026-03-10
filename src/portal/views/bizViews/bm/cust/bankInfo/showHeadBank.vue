<!--机构查询-->
<template>
  <div class="h-tree-search">
    <div class="h-modal-header-wrapper">
      <h-msg-box v-model="tempshowHeadBankWin" @on-close="handleClose" width="1000">
        <p slot="header">
          <span>{{title}}</span>
        </p>
        <!--弹出框内容-->
        <h-row name="flex" class="layout-menu-wrapper">
          <h-col span="24">
            <div>
              <!--数据展示表格-->
              <h-datagrid
                  :columns="showColumns"
                  highlight-row
                  getDataFunc
                  @get-data="getHeadBankList"
                  :gridData="headBankData"
                  :bindForm="formItem"
                  :onCurrentChange="onCurrentChange"
                  :onCurrentChangeCancel="onCurrentChangeCancle"
                  ref="datagrid">
              </h-datagrid>
            </div>
          </h-col>
        </h-row>
        <!-- 弹出框模式底部按钮 -->
        <div slot="footer">
          <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
          <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
        </div>
      </h-msg-box>
      <h-msg-box v-model="submitWin" width="300" height="180">
        <p slot="header">
          <span>{{submitTitle}}</span>
        </p>
        <div class="h-prompt-content">
          <div class="h-prompt-top">
            <i v-if="retMsg == ''" class="icon iconfont icon-right"></i>
            <i v-else class="icon iconfont icon-wrong"></i>
            <span>{{submitMsg}}</span>
          </div>
          <p class="h-prompt-words">{{retMsg}}</p>
        </div>
        <div slot="footer">
          <h-button type="ghost" @click="submitWin = false">{{$t("m.i.common.close")}}</h-button>
          <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
        </div>
      </h-msg-box>
    </div>
  </div>
</template>
<script>
  import { post } from "@/api/bizApi/commonUtil";

  export default {
    name: "showHeadBank",
    data() {
      let columns = [
        {
          type: "selection",
          key: "duoxuan",
          width: 60,
          align: "center",
          hiddenCol: true
        },
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          key: "xuhao",
          width: 60,
          align: "center",

          hiddenCol: false
        },
        {
          title: "id",
          key: "id",
          hiddenCol: true
        },
        {
          title: this.$t("m.i.common.memberId"),
          key: "memberId",

          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.common.memberBankNo"),
          key: "memberBankNo",

          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.common.memberBankName"),
          key: "memberBankName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.bankLevel"),
          key: "bankLevel",

          hiddenCol: false,
          render: (h, params) => {
            return h("div", [
              h("span", params.row.bankLevel === "1" ? "一类行" : params.row.isEnable === "2" ? "二类行" : "三类行")
            ]);
          }
        },
        {
          title: this.$t("m.i.common.bankType"),
          key: "bankType",

          hiddenCol: false
        }
      ];
      let formItem = {
        roleName: ""
      };
      return {
        showColumns: columns,
        formItem: formItem,
        selectData:null,
        headBankData: { rows: [], total: 1 },
        submitWin: false,
        submitMsg: "",
        submitTitle: "",
        retMsg: "",
        ifShowMore: false
      };
    },
    props: {
      title: String,
      showHeadBankWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      ifcheck: {
        default() {
          return false;
        }
      }
    },
    watch: {
      showHeadBankWin(val) {
        if (val == true) {
          this.$nextTick(() => {
            this.$refs.datagrid.dataChange(1);
          });
        }
      }
    },
    computed: {
      tempshowHeadBankWin: {
        get() {
          return this.showHeadBankWin;
        },
        set() {
        }
      }
    },
    methods: {
      getHeadBankList() {
        if (!this.showHeadBankWin) {
          return;
        }
        post({
          pageNo: this.$refs.datagrid.pageInfo.pageNo,
          pageSize: this.$refs.datagrid.pageInfo.pageSize
        }, "/shcpe/cust/bankinfo/queryCustTopBankInfo").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode == "000000") {
                this.headBankData = res.data.retData;
              } else {
                // 查询失败
                this.submitMsg = "查询失败";
                this.retMsg = res.data.retMsg;
                this.submitWin = true;
              }
            } else {
              this.retMsg = this.$t("m.i.common.netError");
              this.submitWin = true;
            }
          }
        );
      },
      onCurrentChange(currentRow, oldCurrentRow, _index) {
        this.selectData = currentRow;
      },
      onCurrentChangeCancle(currentRow, oldCurrentRow, _index) {
        this.selectData = null;
      },
      unDisabled() {
        this.deletDisabled = false;
      },
      submitForm() {
        if (!this.selectData) {
          this.$hMessage.info(this.$t("m.i.common.chooseOneData"));
          return;
        }
        let obj = {
          "id": this.selectData.memberId,
          "bankNo": this.selectData.memberBankNo,
          "bankName": this.selectData.memberBankName
        };
        // 选择客户
        this.$emit("headBankSelect", obj);

      },
      handleClose() {
        // this.formSearchReset();
        this.$emit("showHeadBankWinClose", "");
      }
    }
  };
</script>
<style>

</style>
