<template>
  <div class="layout">
    <h-msg-box v-model="tempImageWin" width="1000" maxHeight="430" @on-close="handleClose()" :maximize="true"   :mask-closable="false">
      <p slot="header">
        <span>查看风险字样历史维护记录</span>
      </p>
      <h-row name="flex" class="layout-menu-wrapper">
        <h-col span="24">
          <div>
            <!--数据展示表格-->
            <h-datagrid
              :columns="columns"
              url = "/pc/risk/billRiskMain/riskWordManage/riskWordMain/func_queryRiskWordInfoHis"
              highlight-row
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
    import {formatNumber, getDictListByGroups, getDictValueFromMap, post,getBusinessParameter } from "@/api/bizApi/commonUtil";

  export default {
    name: "riskWordHis",
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
              riskWordId : ""
          },
        columns : [

          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            key:"xuhao",
            align: "center"
          },
          {
            title: this.$t("m.i.pc.riskObject"),
            key:"riskObj",
            hiddenCol: false,
            render: (h, params) => {
                let dictValue =this.getDictValueFromMap(this.dictMap, 'RiskObjCode', params.row.riskObj);
                return h("span", {
                    domProps: {
                        title: dictValue
                    }
                }, dictValue);
            }
          },
            {
                title: this.$t("m.i.pc.remindRiskWord"),
                key:"remindRiskWord",
                hiddenCol: false,
            },
            {
                title: this.$t("m.i.pc.banRiskWord"),
                key:"banRiskWord",
                hiddenCol: false,
            },
          {
            title: this.$t("m.i.common.operUserName"),
            key:"operTellerName",
            hiddenCol: false,
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
            key:"operType",
            hiddenCol: false,
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
            key:"operRemark",
            hiddenCol: false,
          }
        ],

        dictMap : new Map(),
        operStatusList:[],
        riskObjList : [],
        operTypeList : [],
        riskLevelList : [],
      };
    },
    watch:{
      showHistWin(val) {
        if (val == true) {
            this.getDictListByGroups("OperStatusCode,RiskObjCode,OperTypeCode,RiskLevel").then(res => {
                this.operStatusList=res.get("OperStatusCode");
                this.riskObjList = res.get("RiskObjCode");
                this.operTypeList = res.get("OperTypeCode");
                this.riskLevelList = res.get("RiskLevel");
                this.dictMap = res.get("map");
            });
          this.$nextTick(() => {
              this.formItem.riskWordId = this.hisId;
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
