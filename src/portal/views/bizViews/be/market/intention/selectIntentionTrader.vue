<template>
  <h-msg-box v-model="tempTraderWin" width="850" @on-close="traderWinClose" class="h-form-table-layer" :maximize="true"
             :mask-closable="false" :footerHide="true" :z-index="1002">
    <p slot="header">
      <span>添加交易员</span>
    </p>
    <h-form :model="traderFormItem" :label-width="90" ref="traderFormItem" cols="4" class="h-form-search">
      <h-form-item :label="$t('m.i.common.brchCode')" prop="brchCode">
        <h-input v-model="traderFormItem.brchCode"></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.common.traderId')" prop="traderId">
        <h-input v-model="traderFormItem.traderId"></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.theTraderName')" prop="traderName">
        <h-input v-model="traderFormItem.traderName"></h-input>
      </h-form-item>
      <h-form-item class="h-form-operate">
        <h-button type="primary" @click="handleSearch">{{$t("m.i.common.search")}}</h-button>
        <h-button type="ghost" @click="resetSearch">{{$t("m.i.common.reset")}}</h-button>
      </h-form-item>
    </h-form>
    <h-datagrid :columns="columns"
                :auto-load="false"
                url="/cpes/trader/selectIntentionTrader/func_queryTraderCopy"
                :bindForm="traderFormItem"
                rowSelect
                :hasSelect="hasSelect"
                ref="datagrid">
      <div slot="toolbar" class="pull-left">
        <h-button type="primary" @on-click="addTrader()" v-if="!isView">{{$t('m.i.common.addition')}}</h-button>
        <h-button type="primary" @on-click="delTrader()" v-if="!isView">{{$t('m.i.common.delete')}}</h-button>
      </div>
    </h-datagrid>

    <h-msg-box v-model="selectTraderWin" width="850" @on-close="selectTraderWinClose" class="h-form-table-layer"
               :maximize="true" :z-index="1004" :footerHide="true">
      <p slot="header">
        <span>选择交易员</span>
      </p>
      <h-form :model="queryFormItem" :label-width="90" ref="queryFormItem" cols="4" class="h-form-search">
        <h-form-item :label="$t('m.i.be.groupNo')" prop="groupNo">
          <h-select v-model="queryFormItem.groupNo" placeholder="" filterable showTitle>
            <h-option v-for="item in GroupList" :value="item.groupNo" :key="item.groupName">{{item.groupName}}
            </h-option>
          </h-select>
        </h-form-item>
        <h-form-item :label="$t('m.i.common.brchCode')" prop="brchCode">
          <h-input v-model="queryFormItem.brchCode"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.common.traderId')" prop="traderId">
          <h-input v-model="queryFormItem.traderId"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.be.theTraderName')" prop="traderName">
          <h-input v-model="queryFormItem.traderName"></h-input>
        </h-form-item>

        <h-form-item class="h-form-operate">
          <h-button type="primary" @click="handleSearch2">{{$t("m.i.common.search")}}</h-button>
          <h-button type="ghost" @click="resetSearch2">{{$t("m.i.common.reset")}}</h-button>
        </h-form-item>
      </h-form>
          <h-datagrid :columns="traderColumns"
                      :auto-load="false"
                      rowSelect
                      url="/cpes/trader/selectIntentionTrader/func_queryTraderCopy"
                      :bindForm="queryFormItem"
                      :hasSelect="traderHasSelect"
                      ref="selectDatagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @on-click="addSelectTrader()">{{$t('m.i.common.addition')}}</h-button>
            </div>
          </h-datagrid>
    </h-msg-box>
  </h-msg-box>
</template>

<script>
  import { post, on, off, getDictListByGroups,getDictValueFromMap,get} from "@/api/bizApi/commonUtil";

  export default {
    name: "selectIntentionTrader",
    data() {
      return {
        traderFormItem : {
          brchCode: "",
          traderId: "",
          traderName: "",
          batchId: "",
          type: "traderIn"
        },
        queryFormItem : {
          groupNo:"",
          brchCode: "",
          traderId: "",
          traderName: "",
          type: "traderNotIn",
          branchInList: []
        },
        columns : [
          {
            type: "selection",
            hiddenCol: false,
            align: "center",
            width: 50
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            align: "center",
            hiddenCol: false,
            width: 50
          },
          {
            title: this.$t('m.i.common.id'),
            key: "id",
            hiddenCol: true,
            align: "center"
          },
          {
            title: this.$t('m.i.common.brchCode'),
            key: "brchCode",
            hiddenCol: false,
            align: "center"
          },
          {
            title: this.$t('m.i.common.traderId'),
            key: "traderId",
            hiddenCol: false,
            align: "center"
          },
          {
            title: this.$t('m.i.common.traderName'),
            key: "traderName",
            hiddenCol: false,
            align: "center"
          },
          {
            title: this.$t('m.i.be.traderType'),
            key: "traderType",
            align: "center",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'TraderType', params.row.traderType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.traderStatus'),
            key: "traderStatus",
            align: "center",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'TraderStatus', params.row.traderStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }
        ],
        traderColumns : [
          {
            type: "selection",
            hiddenCol: false,
            align: "center",
            width: 50
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            align: "center",
            hiddenCol: false,
            width: 50
          },
          {
            title: this.$t('m.i.common.id'),
            key: "id",
            hiddenCol: true,
            align: "center"
          },
          {
            title: this.$t('m.i.common.brchCode'),
            key: "brchCode",
            hiddenCol: false,
            align: "center"
          },
          {
            title: this.$t('m.i.shcpe.transBrchClass'),
            key: "transBrchClass",
            hiddenCol: true,
            align: "center"
          },
          {
            title: this.$t('m.i.common.traderId'),
            key: "traderId",
            hiddenCol: false,
            align: "center"
          },
          {
            title: this.$t('m.i.common.traderName'),
            key: "traderName",
            hiddenCol: false,
            align: "center"
          },
          {
            title: this.$t('m.i.be.traderType'),
            key: "traderType",
            align: "center",
            hiddenCol: false,

            render: (h, params) => {
          let dictValue = getDictValueFromMap(this.dictMap, 'TraderType', params.row.traderType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.traderStatus'),
            key: "traderStatus",
            align: "center",
            hiddenCol: false,

            render: (h, params) => {
          let dictValue = getDictValueFromMap(this.dictMap, 'TraderStatus', params.row.traderStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }
        ],
        selectTraderWin : false,
        GroupList : [],
        currentSelectList : [],
        currentTraderSelectList : [],
        traderUrl : "/cpes/trader/selectIntentionTrader/func_queryTraderCopy",
        hasSelect : false,
        traderHasSelect : false
      }
    },
    props: {
      traderView: {
        type: Boolean,
        default() {
          return false
        }
      },
      isView: {
        type: Boolean,
        default() {
          return false;
        }
      },
      needBatchId: "",
      branchTypeInList: {
        type: Array
      }
    },
    computed: {
      tempTraderWin: {
        get() {
          return this.traderView;
        },
        set() {
        }
      }
    },
    watch: {
      needBatchId(val) {
        this.traderFormItem.batchId = val;
        this.queryFormItem.batchId = val;
      },

      traderView(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.$refs.datagrid.dataChange(1);
          });
        }
      },
      selectTraderWin(val) {
        if (val === true) {
          this.getGroupList();
          this.$nextTick(() => {
            this.$refs.selectDatagrid.dataChange(1);
          });
        }
      }
    },
    mounted() {
      getDictListByGroups("TraderStatus,TraderType").then(res => {
        this.dictMap = res.get("map");
      });
    },
    methods: {
      getGroupList() {
        get({},"/be/market/group/intentionMain/func_findCrowdGroup").then(res => {
          if (res) {
            let data = res.data.retData;
            if (res.data.retCode === "000000") {
              this.GroupList = data;
            }
          }
        });
      },
      handleSearch() {
        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
      },
      handleSearch2() {
        this.$refs.selectDatagrid.dataChange(this.$refs.selectDatagrid.pageInfo.pageNo);
      },
      resetSearch() {
        this.$refs.traderFormItem.resetFields();
        this.traderFormItem.batchId = this.needBatchId;
      },
      resetSearch2() {
        this.$refs.queryFormItem.resetFields();
        this.queryFormItem.batchId = this.needBatchId;
      },
      traderWinClose() {
        this.hasSelect = true;
        this.$refs.traderFormItem.resetFields();
        this.$emit("traderWinClose", "");
      },
      selectTraderWinClose() {
        this.traderHasSelect = true;
        this.$refs.queryFormItem.resetFields();
        this.$refs.selectDatagrid.selects=[];
        this.$refs.selectDatagrid.selectIds=[];
        this.selectTraderWin = false;
      },
      addTrader() {
        this.traderHasSelect = false;
        this.queryFormItem.branchTypeInList = this.branchTypeInList;
        this.selectTraderWin = true;
      },
      delTrader() {
        let list = this.$refs.datagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        let traders = [];
        for (var i = 0, count = list.length; i < count; i++) {
          traders.push(list[i].traderId);
        }
        this.hasSelect = true;
        post({
          traders: traders,
          batchId: this.needBatchId
        }, "/be/market/intention/intentionMain/func_deleteTrader").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
            } else {
              this.$msgTip.error(this, { info: msg });
            }
            this.hasSelect = false;
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      addSelectTrader() {
        let list = this.$refs.selectDatagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        let traders = [];
        for (var i = 0, count = list.length; i < count; i++) {
          traders.push(list[i].traderId + ":" + list[i].traderName);
        }
        post({
          traders: traders,
          batchId: this.needBatchId
        }, "/be/market/intention/intentionMain/func_addTrader").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.selectTraderWinClose();
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
