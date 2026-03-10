<template>
  <div class="layout">
    <h-msg-box v-model="showHistWin" width="1000" maxHeight="430" @on-close="handleClose()" :maximize="true" top="60"  :mask-closable="false">
      <p slot="header">
        <span>查看白名单历史维护记录</span>
      </p>
      <h-row name="flex" class="layout-menu-wrapper">
        <h-col span="24">
          <div>
            <!--数据展示表格-->
            <h-datagrid
              :columns="columns"
              highlight-row
              url= "pc/risk/billRiskMain/whiteRollManage/riskBillWhiteRollMain/func_queryRiskBillWhiteRollHis"
              :autoLoad="false"
              :bindForm="formItem"
              ref="datagrid">
            </h-datagrid>

          </div>
        </h-col>
      </h-row>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      </div>

    </h-msg-box>
  </div>
</template>

<script>
    import {formatNumber, post } from "@/api/bizApi/commonUtil";

  export default {
    name: "riskBillWhiteRollHis",
    components: {
    },
    props: {
      title: String,
      hisId:"",
      showHistWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
    },
    data(){
      return {
          formItem : {
              whiteId :""
          },
        columns : [
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            key: 'numOrder',
            align: "center"
          },
          {
              title: this.$t("m.i.common.custName"),
              key: 'custName',
              sortable: true,
          },
          {
              title: this.$t("m.i.common.operUserName"),
              key: 'createTellerNo',
              sortable: true,
          },
            {
                title: this.$t("m.i.common.operTm"),
                key: 'createTime',
                sortable: true,
                render: (h, params) => {
                    if (params.row.createTime == null || params.row.createTime === "") {
                        return "";
                    }
                    let date = params.row.createTime.toString().substring(0,8);
                    let time = params.row.createTime.toString().substring(8,14);
                    let createTime =this.$moment(date, "YYYY-MM-DD").format("YYYY-MM-DD")+" "+ this.$moment(time, "HH:mm:ss").format("HH:mm:ss");
                    return h("span", createTime);
                }
            },
            {
                title: this.$t("m.i.common.operType"),
                key: 'operType',
                sortable: true,
                render: (h, params) => {
                    let dictValue =this.getDictValueFromMap(this.dictMap, 'OperTypeCode', params.row.operType);
                    return h("span", {
                        domProps: {
                            title: dictValue
                        }
                    }, dictValue);
                }
            },
          {
              title: this.$t("m.i.pc.operRemark"),
              key: 'operRemark',
              sortable: true,
          },

        ],

          dictMap : new Map(),
          operStatusList:[],
          operTypeList : [],
      };
    },
    watch:{
      showHistWin(val) {
        if (val == true) {
            this.getDictListByGroups("OperStatusCode,OperTypeCode").then(res => {
                this.operStatusList = res.get("OperStatusCode");
                this.operTypeList = res.get("OperTypeCode");
                this.dictMap = res.get("map");
            });
          this.$nextTick(() => {
              this.formItem.whiteId = this.hisId;
              this.$refs.datagrid.dataChange(1);
          });
      }
        }
    },
    methods :{
      handleClose() {
        this.hisId = "";
        this.$emit("showHistWinClose", "");
      },
    },
    computed: {
      tempImageWin: {
        get() {
          return this.showHistWin;
        },
        set() {
        }
      }
    },

  };
</script>

<style scoped>

</style>
