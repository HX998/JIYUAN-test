<!--挑选合同-->
<template>
  <div>
    <h-msg-box v-model="tempPickContractWin" width="1000" :mask-closable="false" @on-close="goBack"
               class="h-form-table-layer" :maximize="true" @on-maximize="onMaximize" :footerHide="true">
      <p slot="header">
        <span>{{title}}</span>
      </p>
      <!--查询表单-->
      <div>
        <div class="h-form-search-box">
          <h-form :model="pickContractForm" :label-width="100" ref="pickContractForm" cols="4"
                  class="h-form-search">
            <h-form-item :label="$t('m.i.bm.ctrctNoLike')" prop="ctrctNoLike">
              <h-input v-model="pickContractForm.ctrctNoLike" :maxlength="60"></h-input>
            </h-form-item>
            <h-form-item class="h-form-operate one-form">
              <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
              <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
            </h-form-item>
          </h-form>
        </div>
      </div>
      <!--数据展示表格-->
      <h-row>
        <h-col span="24">
          <h-datagrid
            :columns="columns"
            :url="URL"
            :bindForm="pickContractForm"
            :auto-load="false"
            highlightRow
            :row-select="true"
            :has-select="hasSelect"
            ref="pickDatagrid">
            <!-- 弹出框模式顶部按钮 -->
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="pick">{{$t("m.i.common.commit")}}</h-button>
              <h-button type="ghost" @click="goBack">{{$t("m.i.common.close")}}</h-button>
            </div>
          </h-datagrid>
        </h-col>
      </h-row>

   <!--   <div slot="footer">
        <h-button type="ghost" @click="pickBillClose()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="pickBillStock()">{{$t("m.i.common.commit")}}</h-button>
      </div>-->
    </h-msg-box>
  </div>
</template>
<script>
  import { post, formatNumber } from "@/api/bizApi/commonUtil";
  export default {
    name: "pickContract",
    data(){
      let _this = this;
      return{
        URL:"/bm/ctrct/tradeInfo/func_pagingNotRelationContract",
        hasSelect:false,
        currentSelectRow:[],
        pickContractForm:{
          ctrctNoLike:"",
          id:"",
          voucherType:"01",
          endorType:""
        },
        columns: [
          {
            type: "selection",
            key: "multiSelect",
            width: 60,
            hiddenCol: false
          },
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.bm.ctrctNoLike"),
            key: "ctrctNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.custNo"),
            key: "sellerCustNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.custName"),
            key: "sellerCustName",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.bm.buyerName"),
            key: "buyerCustName",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.bm.ctrctSignDt"),
            key: "ctrctSignDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.ctrctSignDt == null || params.row.ctrctSignDt === "") {
                return "";
              }
              let date = _this.$moment(params.row.ctrctSignDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.bm.ctrctSignDueDt"),
            key: "ctrctSignDueDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.ctrctSignDueDt == null || params.row.ctrctSignDueDt === "") {
                return "";
              }
              let date = _this.$moment(params.row.ctrctSignDueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },

          {
            title: this.$t("m.i.bm.ctrctAmt"),
            key: "ctrctAmt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let ctrctAmt = formatNumber(params.row.ctrctAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: ctrctAmt
                }
              }, ctrctAmt);
            }
          },
          {
            title: this.$t("m.i.bm.ctrctContent"),
            key: "ctrctContent",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.bm.ctrctRemark"),
            key: "ctrctRemark",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.createDt"),
            key: "createDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.createTime == null || params.row.createTime == "" || params.row.createTime == 0) {
                return "";
              }
              let createDt = params.row.createTime.toString().substring(0, 8);
              let date = _this.$moment(createDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          }
        ],
      }
    },
    watch: {
      pickContractWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.formSearch();
          });
        }
      }
    },
    props: {
      title: {
        type: String,
        default() {
          return "挑选合同";
        }
      },
      batchParams: {
        type: Object,
        default: {}
      },
      pickContractWin: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    computed: {
      tempPickContractWin: {
        get() {
          return this.pickContractWin;
        },
        set() {
        }
      }
    },
    methods:{
      onMaximize() {
        setTimeout(() => {
          this.$refs.pickDatagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      //查询
      formSearch() {
        //this.relationBillForm.listId = this.relationInvoiceBillParams.listId;
        this.currentSelectRow = [];
        this.hasSelect = false;
        this.$refs.pickDatagrid.selects = [];
        this.$refs.pickDatagrid.selectIds = [];
        this.pickContractForm.id = this.batchParams.tradeId;
        this.pickContractForm.voucherType = "01";
        this.pickContractForm.endorType = this.batchParams.endorType;
        this.pickContractForm.buyerName = this.batchParams.buyerName;
        this.pickContractForm.sellerName = this.batchParams.sellerName;
        this.$refs.pickDatagrid.dataChange(1);
        this.$refs.pickDatagrid.$refs.gridPage.clearElevator();
      },
      resetSearch() {
        this.$refs.pickContractForm.resetFields();
      },
      //返回
      goBack() {
        this.$refs.pickContractForm.resetFields();
        //this.relationBillForm.listId = "";
        this.pickContractForm.id = "";
        this.currentSelectRow = [];
        this.hasSelect = false;
        this.$refs.pickDatagrid.selects = [];
        this.$refs.pickDatagrid.selectIds = [];
        this.$refs.pickDatagrid.$refs.gridPage.clearElevator();
        this.$emit("pickContractWinClose", "");
      },
      // 挑选
      pick(){
        let list = this.$refs.pickDatagrid.selects;
        if (list.length == 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
          return;
        }
        let idList = [];
        for (let i = 0; i < list.length; i++) {
          idList.push(list[i].id)
        }
        let url = "/bm/ctrct/tradeInfo/func_pickContract";
        post({voucherType:"01" ,voucherIds:idList,id:this.batchParams.tradeId}, url).then(res => {
          if (res) {
            let retCode = res.data.retCode
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.goBack();
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
          }
        });
      }
    }
  }
</script>

<style scoped>

</style>
