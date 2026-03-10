<!--贴现通挂牌-交易对手类型查看-->
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
        highlightRow
        :url="transDataGridUrl"
        :bindForm="formItem"
        :autoLoad=false
        :has-select="false"
        :row-select="true"
        param-id="key"
        :has-page="hasPage"
        ref="datagrid">
        <div slot="toolbar" class="pull-left">
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
    name: "showTransBrchType",
    data() {
      return {
        columns: [
/*          {
            type: "selection",
            key: "check",
            width: 60,
            align: "center",
            hiddenCol: false
          },*/
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
        brchClassColumns:[
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
        brchCodeColumns:[
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.brchCode"),
            key: "key",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.brchName"),
            key: "value",
            hiddenCol: false
          }
        ],
        formItem: {
          keys: "",
          operate: ""
        },
        title:"交易对手类型",
        hasPage:false
      };
    },
    props: {
      transBrchTypeWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      transBrchTypeParams: {
        type: Object,
        default: {
          keys: "",
          operate: "",
          hasPage: {
            type: Boolean,
            default() {
              return false;
            }
          }
        }
      },
      transDataGridUrl:{
        type: String,
        default() {
          return "/be/discquote/broker/listing/discListingApplyMain/func_queryBranchClassAndBranchCodePage";
        }
      }
    },
    components: {
    },
    watch: {
      transBrchTypeWin(val) {
        if (val === true) {
          // this.$nextTick(() => {
            this.formItem  = this.transBrchTypeParams;
            if("BrchClass"===this.transBrchTypeParams.operate){
              this.columns=this.brchClassColumns;
              this.title="交易对手类型";

            }else if("BrchCode"===this.transBrchTypeParams.operate){
              this.columns=this.brchCodeColumns;
              this.title="剔除交易对手行别";
            }
            this.hasPage=this.transBrchTypeParams.hasPage;
            this.$nextTick(() => {
              this.formSearch();
            });
          // });
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
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      formSearch() {
        this.$refs.datagrid.dataChange(1);
      },
      handleClose() {
        this.$emit("transBrchTypeWinClose");
      },
    }
  };
</script>

<style scoped>

</style>
