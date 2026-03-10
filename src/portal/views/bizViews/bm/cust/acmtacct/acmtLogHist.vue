<template>
  <div class="layout">
    <h-msg-box v-model="tempImageWin" width="1000" @on-close="handleClose()" :maximize="true"   :mask-closable="false">
      <p slot="header">
        <span>{{title}}</span>
      </p>
      <h-row name="flex" class="layout-menu-wrapper">
        <h-col span="24">
          <div>
            <!--数据展示表格-->
            <h-datagrid
              :columns="columns"
              highlight-row
              getDataFunc
              :autoLoad="false"
              @get-data="queryHistData"
              :gridData = "histData"
              :bindForm="formItem"
              :onRowClick="handlelRowClick"
              :onSelectChange="handleSelectClick"
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
    <acmt-auth-list :acmtAuthListWin="acmtAuthListWin" @acmtAuthListWinClose="acmtAuthListWinClose"
                    :propAuthList="this.propAuthList"></acmt-auth-list>
  </div>
</template>

<script>
  import { post, on,off } from "@/api/bizApi/commonUtil";

  export default {
    name: "acmtLogHist",
    components: {
      AcmtAuthList: () => import(/* webpackChunkName: 'bm/cust/acmtacct/acmtAuthList' */`@/views/bizViews/bm/cust/acmtacct/acmtAuthList`),
    },
    props: {
      title: {
        type: String,
        default: "查看历史"
      },
      showHistWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      acmtAcctId:"",
    },
    data(){
      return {
        columns : [
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            key: "xuhao",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: 'ID',
            key: "id",
            hiddenCol: true,
          },
          {
            title: this.$t('m.i.common.custName'),
            key: "custName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.socCode'),
            key: "socCode",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.custAcctNo'),
            key: "custAcctNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.acctName'),
            key: "acctName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.acctType'),
            key: "acctType",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "AcmtAcctTypeCode", params.row.acctType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.distType'),
            key: "distType",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "DistTypeCode", params.row.distType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.openBrchCode'),
            key: "openBrchCode",
            hiddenCol: true
          },
          {
            title: this.$t('m.i.common.openBrchName'),
            key: "openBrchName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.busiChannelCode'),
            key: "memberId",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.acctAuthList'),
            key: "acctAuthList",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showAuthList(params.row.acctAuthList);
                  }
                }
              }, "权限清单");
            }

          },
          {
            title: this.$t('m.i.common.rgstName'),
            key: "rgstName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.rgstBrchCode'),
            key: "rgstBrchCode",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.operType'),
            key: "operType",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "AcmtOperTypeCode", params.row.operType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.operStatus'),
            key: "status",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "AcmtOperStatusCode", params.row.status);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.changeCustName'),
            key: "changeCustName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.changeCustAcctNo'),
            key: "changeCustAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.changeAcctName'),
            key: "changeAcctName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.changeOpenBrchName'),
            key: "changeOpenBrchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.changeAcctAuthList'),
            key: "changeAcctAuthList",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showAuthList(params.row.changeAcctAuthList);
                  }
                }
              }, "权限清单");
            }
          }
        ],
        formItem : {
        },
        propAuthList: [],
        acmtAcctTypeList: [],
        distTypeList: [],
        acmtOperStatusList: [],
        acmtOperTypeList: [],
        acmtAuthListWin: false,
        // 是否显示新增或修改窗口
        type : null,
        readonly:false,
        isRequired:true,
        tableRef : "selfTable",
        histData : {rows:[],total:1},
        submitWin : false,
        dictMap : new Map(),
      };
    },
    watch:{
      showHistWin(val) {
        this.$nextTick(() => {
          if (val == true) {
            this.getDictListByGroups("AcmtAcctTypeCode,AcmtOperStatusCode,AcmtOperTypeCode,DistTypeCode,SignUpMarkCode").then(res => {
              this.acmtAcctTypeList = res.get("AcmtAcctTypeCode");
              this.acmtOperStatusList = res.get("AcmtOperStatusCode");
              this.acmtOperTypeList = res.get("AcmtOperTypeCode");
              this.signUpMarkCodeList = res.get("SignUpMarkCode");
              this.distTypeList = res.get("DistTypeCode");
              this.dictMap = res.get("map");
            });
            this.queryHistData();
          }
        })
      }

    },
    methods :{
      handlelRowClick(arr) {
        this.currentSelectRow = arr;
      },
      handleSelectClick(arr,selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx
        if(arr.length==0) return
      },
      handleClose() {
        this.$emit("showHistWinClose", "");
      },

      queryHistData(){
        let json = {acmtAcctId : this.acmtAcctId, pageNo: this.$refs.datagrid.pageInfo.pageNo, pageSize:this.$refs.datagrid.pageInfo.pageSize};
        post(json,'/bm/cust/acmtacct/acmtAcctApply/func_queryAcmtHist').then(res => {
            if(res){
              let retCode = res.data.retCode;
              if(retCode == "000000" ){
                this.histData = res.data.retData;
              } else {
                // 查询失败
                // this.submitMsg = "查询失败";
                this.$msgTip.error(this,{info:res.data.retMsg})
              }
            } else {
              this.$msgTip.error(this,{info:this.$t('m.i.common.netError')})
            }
          }
        )
      },
      showAuthList(acctAuthList) {
        if (acctAuthList == null){
          acctAuthList = "";
        }
        this.propAuthList = acctAuthList.toString().split("|");
        this.acmtAuthListWin = true;
      },
      acmtAuthListWinClose() {
        this.acmtAuthListWin = false;
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
