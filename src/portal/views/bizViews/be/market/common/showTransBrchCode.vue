<!--点击成交-交易对手类型弹出框-->
<template>
  <div>
    <h-msg-box v-model="tempTransBrchCodeWin" width="1000" :mask-closable="false" @on-close="handleClose" top="10"
               class="h-form-table-layer" :maximize="true" @on-maximize="onMaximize" :z-index='1010'>
      <p slot="header">
        <span>{{title}}</span>
      </p>
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
        :has-page="false"
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
    <show-notin-trans-brch-Code :transBrchCodeWin="joinTransBrchCodeWin" title="添加机构代码" displayType="join"
                          :transBrchCodeParams="joinTransBrchCodeParams" @transBrchCodeWinClose="joinTransBrchCodeWinClose"
                          :datagridUrl="notinDatagridUrl" :deleteUrl="deleteUrl" :addUrl="addUrl" :dictMap="dictMap"></show-notin-trans-brch-Code>
  </div>
</template>

<script>
  import { post } from "@/api/bizApi/commonUtil";

  export default {
    name: "showTransBrchCode",
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
          },
        ],
        formItem: {
          batchId: "",
          operate: ""
        },
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
      dictMap: {
        type: Map,
        default: {}
      },
      transBrchCodeParams: {
        type: Object,
        default: {
          batchId: "",
          operate: "",
          branchClasss: ""
        }
      }
    },
    components: {
      ShowNotinTransBrchCode: () => import(/* webpackChunkName: "be/market/common/showNotinTransBrchCode"*/"@/views/bizViews/be/market/common/showNotinTransBrchCode")
    },
    watch: {
      transBrchCodeWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.formItem  = this.transBrchCodeParams;
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
        let brchCodeName = [];
        this.$refs.datagrid.tData.forEach(x => brchCodeName.push(x.brchFullNameZh));
        this.$emit("transBrchCodeWinClose", brchCodeName.join(","));
      },
      transBrchCodeDelete() {
        if (this.$refs.datagrid.selects != null && this.$refs.datagrid.selects.length !== 0) {
          this.$hMsgBox.confirm({
            title: "删除",
            content: "确定删除机构类型吗？",
            zIndex:9999,
            onOk: () => {
              this.handleOperate(this.deleteUrl);
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      handleOperate(url) {
        let params = {
          batchId: this.transBrchCodeParams.batchId,
          branchCodes: this.$refs.datagrid.selectIds.join(","),
          operate: this.transBrchCodeParams.operate
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
        this.formSearch();
        this.joinTransBrchCodeWin = false;
      }
    }
  };
</script>

<style scoped>

</style>
