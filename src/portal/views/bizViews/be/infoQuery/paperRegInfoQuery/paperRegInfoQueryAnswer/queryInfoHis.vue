<!--机构查询-->
<template>
  <div>
    <h-msg-box v-model="tempqueryInfoHisWin" :maximize="true" @on-close="handleClose" width="1000"
               class="h-form-table-layer" @on-maximize="onMaximize">
      <p slot="header">
        <span>历史查询详细信息</span>
      </p>
      <!--数据展示表格-->
      <h-datagrid
        :columns="hisDataColumns"
        highlight-row
        url="/be/infoQuery/paperRegInfoQuery/paperRegInfoQueryAnswer/func_queryInfoHis"
        :bindForm="bills"
        :autoLoad=false
        showListCkeckBox
        ref="datagrid">
      </h-datagrid>
      <div slot="footer">
        <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import { on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "queryInfoHis",
    data() {
      return {
        hisDataColumns: [
          {
            title: " ",
            type: "radio",
            width: 50,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t('m.i.common.queryDt'),
            key: "queryDate",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", this.$moment(params.row.queryDate, "YYYY-MM-DD").format("YYYY-MM-DD"));
            }
          },
          {
            title: this.$t('m.i.common.queryBranchCode'),
            key: "queryBranchCode",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.queryBranchName'),
            key: "queryBranchName",
            hiddenCol: false,
            sortable: true
          }
        ],
        hisData: { rows: [], total: 1 }
      };
    },
    props: {
      title: String,
      bills: {
        type: Object,
        required: true
      },
      showmsg: {
        type: Boolean,
        default() {
          return false;
        }
      },
      queryInfoHisWin: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      handleClose() {
        this.$emit("queryInfoHisWinClose", "");
      }
    },
    watch: {
      showmsg() {
        this.$nextTick(() => {
          this.$refs.datagrid.dataChange(1);
        });
      }
    },
    computed: {
      tempqueryInfoHisWin: {
        get() {
          return this.showmsg;
        },
        set() {
        }
      }
    }
  };
</script>

