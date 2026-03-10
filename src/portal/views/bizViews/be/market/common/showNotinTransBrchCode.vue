<!--点击成交-交易对手类型弹出框-->
<template>
  <div>
    <h-msg-box v-model="tempTransBrchCodeWin" width="980" :mask-closable="false" @on-close="handleClose" top="10"
               class="h-form-table-layer" :maximize="true" @on-maximize="onMaximize" :z-index='1010'>
      <p slot="header">
        <span>{{title}}</span>
      </p>
      <div :class="{'h-form-overhd':!ifShowMore}">
        <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
          <common-input v-model="formItem.brchCode" :label="$t('m.i.common.brchCode')" prop="brchCode"
                        :maxlength="9"></common-input>
          <common-input v-model="formItem.brchName" :label="$t('m.i.common.brchFullNameZh')" prop="brchName"
                        :maxlength="125"></common-input>
          <common-input v-model="formItem.bankNo" :label="$t('m.i.common.transBrchBankNo')" prop="bankNo"
                        :maxlength="12"></common-input>
          <query-btn :advanceShow="false" @showChange="showChange" :formSearch="handleSearch" :formSearchReset="resetSearch"></query-btn>
        </h-form>
      </div>
        <!--数据展示表格-->
        <h-datagrid
            :columns="columns"
            highlight-row
            :url="datagridUrl"
            :bindForm="formItem"
            :autoLoad=false
            :has-select="false"
            :row-select="true"
            param-id="brchCode"
            ref="datagrid">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" @click="transBrchCodeDelete()" v-if="displayType === 'display'">
              {{$t("m.i.common.delete")}}
            </h-button>
            <h-button type="primary" @click="transBrchCodeOperate('add')" v-if="displayType === 'display'">
              {{$t("m.i.common.addition")}}
            </h-button>
            <h-button type="primary" @click="transBrchCodeOperate('join')" v-if="displayType === 'join'">
              {{$t("m.i.common.join")}}
            </h-button>
          </div>
        </h-datagrid>

      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import { post } from "@/api/bizApi/commonUtil";

  export default {
    name: "showNotinTransBrchCode",
    data() {
      return {
        columns: [
          {
            type: "selection",
            key: "check",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.memberId"),
            key: "memberId",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.transBrchBankNo"),
            key: "transBrchBankNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.shcpe.transBrchClass"),
            key: "transBrchClass",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "BrchClass", params.row.transBrchClass);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.brchCode"),
            key: "brchCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.brchName"),
            key: "brchFullNameZh",
            hiddenCol: false
          }
        ],
        formItem: {
          batchId: "",
          operate: "",
          branchClasss: "",
          brchCode: "",
          brchName: "",
          bankNo: ""
        },
        ifShowMore: false,
        joinTransBrchCodeWin: false,
        joinTransBrchCodeParams: {
          batchId: "",
          operate: ""
        }
      };
    },
    props: {
      transBrchCodeWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      title: {
        type: String,
        default: "机构类型"
      },
      //弹框类型
      displayType: {
        type: String,
        default: "display"
      },
      datagridUrl: {
        type: String,
        default: "/be/market/clickdeal/rebuy/rebuyApply/func_queryBranchCodeList"
      },
      notinDatagridUrl: {
        type: String,
        default: "/be/market/clickdeal/rebuy/rebuyApply/func_queryBranchCodeAddList"
      },
      deleteUrl: {
        type: String,
        default: "/be/market/clickdeal/rebuy/rebuyApply/func_deleteRebuyBranchCode"
      },
      addUrl: {
        type: String,
        default: "/be/market/clickdeal/rebuy/rebuyApply/func_addBranchCode"
      },
      transBrchCodeParams: {
        type: Object,
        default: {
          batchId: "",
          operate: ""
        }
      },
      dictMap: {
        type: Map,
        default: {}
      }
    },
    watch: {
      transBrchCodeWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.formItem.batchId = this.transBrchCodeParams.batchId;
            this.formItem.operate = this.transBrchCodeParams.operate;
            this.formItem.branchClasss= "";
            this.formItem.brchCode= "";
            this.formItem.brchName= "";
            this.formItem.bankNo=  "";
            this.$nextTick(() => {
              this.formSearch();
            });
          });
        }
      }
    },
    computed: {
      tempTransBrchCodeWin: {
        get() {
          return this.transBrchCodeWin;
        },
        set() {
        }
      }
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      formSearch() {
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      handleClose() {
        this.$refs.formItem.resetFields();
        this.$emit("transBrchCodeWinClose", "");
      },
      transBrchCodeDelete() {
        if (this.$refs.datagrid.selects != null && this.$refs.datagrid.selects.length !== 0) {
          this.$hMsgBox.confirm({
            title: "删除",
            content: "确定删除机构类型吗？",
            onOk: () => {
              this.handleOperate(this.deleteUrl);
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      handleOperate(url) {
        let brchs = this.$refs.datagrid.selects;
        let brchClasss = [];
        for (let i = 0; i < brchs.length; i++) {
          brchClasss.push(brchs[i].transBrchClass);
        }
        let params = {
          batchId: this.transBrchCodeParams.batchId,
          branchCodes: this.$refs.datagrid.selectIds.join(","),
          operate: this.transBrchCodeParams.operate,
          branchClasss: brchClasss.join(",")
        };
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.selectIds = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      transBrchCodeOperate(str) {
        if (str === "add") {
          this.joinTransBrchCodeParams = this.transBrchCodeParams;
          this.joinTransBrchCodeWin = true;
        } else {
          if (this.$refs.datagrid.selects != null && this.$refs.datagrid.selects.length !== 0) {
            this.handleOperate(this.addUrl);
          } else {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          }
        }
      },
      joinTransBrchCodeWinClose() {
        this.joinTransBrchCodeWin = false;
      },
      showChange(val) {
        this.ifShowMore = val;
      },
      //表单查询
      handleSearch(pageNo) {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      }
    }
  };
</script>

<style scoped>

</style>
