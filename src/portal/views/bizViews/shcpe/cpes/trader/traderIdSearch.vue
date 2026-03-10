<template>
  <!--交易员id查询弹出框-->
  <h-msg-box v-model="tempTraderIdWin" width="1000" :mask-closable="false" @on-close="handleClose" top="10"
             class="h-form-table-layer" :maximize="true" @on-maximize="onMaximize" :z-index='1010'>

    <p slot="header">
      <span>查询交易员</span>
    </p>
    <!--查询表单-->
    <div :class="{'h-form-overhd':!ifShowMore}">
        <h-form :model="formItem" :label-width="80" ref="formItem" cols="4" class="h-form-search">
          <h-form-item :label="$t('m.i.common.traderId')" prop="traderId">
            <h-input v-model="formItem.traderId" :maxlength="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.traderName')" prop="traderName">
            <h-input v-model="formItem.traderName" :maxlength="60"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.userStatus')" prop="traderStatus">
            <h-select v-model="formItem.traderStatus" placeholder="">
              <h-option v-for="item in traderStatusList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.userType')" prop="traderType">
            <h-select v-model="formItem.traderType" placeholder="">
              <h-option v-for="item in traderTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.brchCode')" prop="brchCode">
            <h-input v-model="formItem.brchCode" :maxlength="9"></h-input>
          </h-form-item>
          <h-form-item class="h-form-operate">
            <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                            :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
            <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
            <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
          </h-form-item>
        </h-form>
    </div>
    <!--数据展示表格-->
    <h-datagrid
      :columns="columns"
      highlightRow
      :autoLoad="false"
      url="/cpes/trader/queryTraderAll"
      :bindForm="formItem"
      :onCurrentChange="handleRowClick"
      :onCurrentChangeCancel="handleCurrentChangeCancel"
      :onRowDbClick="doubleHandleClick"
      ref="datagrid">
    </h-datagrid>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>

    </div>
  </h-msg-box>
  <!-- 弹出框模式底部按钮 -->
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "traderIdSearch",
    data() {
      return {
        formItem: {
          traderId: "",
          traderName: "",
          traderStatus: "",
          traderType: "",
          brchCode: ""
        },
        viewDatailForm: {
          id: "",
          memberId: "",
          memberName: "",
          brchCode: "",
          brchFullNameZh: "",
          traderId: "",
          traderType: "",
          traderRole: "",
          traderName: "",
          traderStatus: "",
          address: "",
          phone: "",
          tel: "",
          telPubMark: "",
          celSign: "",
          email: "",
          reserve1: "",
          reserve2: "",
          reserve3: "",
          operTm: "",
          createTime: "",
          updateTime: ""
        },

        pageInfo: {
          pageNo: 1,
          pageSize: 10
        },
        spanLeft: 4,
        spanRight: 20,
        tableRef: "selfTable",
        columns: [
          {
            type: "radio",
            width: 50,
            align: "center",
            title: " ",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: "id",
            key: "id",
            hiddenCol: true
          },
          {
            title: this.$t("m.i.common.traderId"),
            key: "traderId",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.traderName"),
            key: "traderName",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.userType"),
            key: "traderType",
            hiddenCol: false,

            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "TraderType", params.row.traderType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.common.userStatus"),
            key: "traderStatus",
            hiddenCol: false,

            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "TraderStatus", params.row.traderStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.common.brchCode"),
            key: "brchCode",

            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.memberId"),
            key: "memberId",

            hiddenCol: false
          }
        ],
        currentSelectRow: null,
        currentSelectList: [],
        currentSelectRowInx: [],
        dictMap: new Map(),
        traderTypeList: [],
        traderStatusList: [],
        type: null,
        readonly: false,
        isRequired: true,
        ifShowMore: false,
        id: null
      };
    },
    props: {
      traderIdWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      brchCode: {
        type: String,
        default() {
          return "";
        }
      }
    },
    watch: {
      tempTraderIdWin(val) {
        if (val == true) {
          this.$nextTick(() => {
            this.$refs.formItem.resetFields();
            this.currentSelectRow = null;
            this.formItem.brchCode = this.brchCode;
            this.$refs.datagrid.dataChange(1);
          });
        }
      }
    },
    computed: {
      tempTraderIdWin: {
        get() {
          return this.traderIdWin;
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
        this.currentSelectRow = null;
      },
      //重置
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      //行选中
      handleRowClick(arr) {
        this.currentSelectRow = arr;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = null;
      },
      doubleHandleClick(arr) {
        this.currentSelectRow = arr;
        this.$emit("traderIdChange", this.currentSelectRow);
      },
      //确定
      submitForm() {
        this.$emit("traderIdChange", this.currentSelectRow);
      },
      //关闭
      handleClose() {
        this.$emit("traderIdWinClose", "");
      }
    },
    mounted() {
      getDictListByGroups("TraderType,TraderStatus").then(res => {
        this.traderTypeList = res.get("TraderType");
        this.traderStatusList = res.get("TraderStatus");
        this.dictMap = res.get("map");
      });
    }
  };
</script>

<style scoped>


</style>
