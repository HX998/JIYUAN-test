<!--点击成交-交易对手类型弹出框-->
<template>
  <div>
    <h-msg-box v-model="tempTransBrchTypeWin" width="1000" :mask-closable="false" @on-close="handleClose" top="10"
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
        :autoLoad="false"
        :has-select="false"
        :row-select="true"
        param-id="key"
        :has-page="false"
        ref="datagrid">
        <div slot="toolbar" class="pull-left">
          <h-button type="primary" @click="transBrchTypeDelete()" v-if="displayType === 'display'">
            {{$t("m.i.common.delete")}}
          </h-button>
          <h-button type="primary" @click="transBrchTypeOperate('add')" v-if="displayType === 'display'">
            {{$t("m.i.common.addition")}}
          </h-button>
          <h-button type="primary" @click="transBrchTypeOperate('join')" v-if="displayType === 'join'">
            {{$t("m.i.common.join")}}
          </h-button>
        </div>
      </h-datagrid>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
      </div>
    </h-msg-box>
    <show-notin-trans-brch-type :transBrchTypeWin="joinTransBrchTypeWin" title="添加机构类型" displayType="join"
                          :transBrchTypeParams="joinTransBrchTypeParams" @transBrchTypeWinClose="joinTransBrchTypeWinClose"
                          :datagridUrl="notinDatagridUrl" :deleteUrl="deleteUrl" :addUrl="addUrl"></show-notin-trans-brch-type>
  </div>
</template>

<script>
  import { post } from "@/api/bizApi/commonUtil";

  export default {
    name: "showTransBrchType",
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
            title: this.$t("m.i.shcpe.transBrchClass"),
            key: "key",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.shcpe.transBrchClassName"),
            key: "value",
            hiddenCol: false
          }
        ],
        formItem: {
          batchId: "",
          operate: ""
        },
        joinTransBrchTypeWin: false,
        joinTransBrchTypeParams: {
          batchId: "",
          operate: ""
        }
      };
    },
    props: {
      transBrchTypeWin: {
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
        default: "/be/market/clickdeal/sale/saleApply/func_queryBranchClass"
      },
      notinDatagridUrl: {
        type: String,
        default: "/be/market/clickdeal/sale/saleApply/func_queryBranchClassAdd"
      },
      deleteUrl: {
        type: String,
        default: "/be/market/clickdeal/sale/saleApply/func_deleteSaleBranchClass"
      },
      addUrl: {
        type: String,
        default: "/be/market/clickdeal/sale/saleApply/func_addSaleBranchClass"
      },
      transBrchTypeParams: {
        type: Object,
        default: {
          batchId: "",
          operate: ""
        }
      }
    },
    components: {
      ShowNotinTransBrchType: () => import(/* webpackChunkName: "be/market/common/showNotinTransBrchType"*/"@/views/bizViews/be/market/common/showNotinTransBrchType")
    },
    watch: {
      transBrchTypeWin(val) {
        if (val === true) {
            this.formItem  = this.transBrchTypeParams;
            this.$nextTick(() => {
              this.formSearch();
              this.selectionHiddenCol();
            });
        }
      }
    },
    computed: {
      tempTransBrchTypeWin: {
        get() {
          return this.transBrchTypeWin;
        },
        set() {
        }
      }
    },
    methods: {
      selectionHiddenCol(){
        const columns = this.columns;
        let selection=null;
        for (let column of columns) {
          if (column.key === 'check') {
            selection = column;
            break;
          }
        }
        if (selection != null) {
          selection.hiddenCol = this.displayType==='show' ? true : false;
        }
      },
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
        let brchTypeName = [];
        if(this.displayType==='show'){
          this.$emit("transBrchTypeWinClose", '');
        }else{
          this.$refs.datagrid.tData.forEach(x => brchTypeName.push(x.value));
          this.$emit("transBrchTypeWinClose", brchTypeName.join(","));
        }
      },
      transBrchTypeDelete() {
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
          batchId: this.transBrchTypeParams.batchId,
          branchClasses: this.$refs.datagrid.selectIds.join(","),
          operate: this.transBrchTypeParams.operate
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
      transBrchTypeOperate(str) {
        if (str === "add") {
          this.joinTransBrchTypeParams = this.transBrchTypeParams;
          this.joinTransBrchTypeWin = true;
        } else {
          if (this.$refs.datagrid.selects != null && this.$refs.datagrid.selects.length !== 0) {
            this.handleOperate(this.addUrl);
          } else {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          }
        }
      },
      joinTransBrchTypeWinClose() {
        this.formSearch();
        this.joinTransBrchTypeWin = false;
      }
    }
  };
</script>

<style scoped>

</style>
