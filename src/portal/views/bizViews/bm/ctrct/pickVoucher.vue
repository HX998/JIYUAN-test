<!--挑选合同-->
<template>
  <div>
    <h-msg-box v-model="tempPickVoucherWin" width="1000" :mask-closable="false" @on-close="goBack"
               class="h-form-table-layer" :maximize="true" @on-maximize="onMaximize" :footerHide="true">
      <p slot="header">
        <span>{{title}}</span>
      </p>
      <!--查询表单-->
      <div>
        <div class="h-form-search-box">
          <h-form :model="pickVoucherForm" :label-width="100" ref="pickVoucherForm" cols="4"
                  class="h-form-search">
            <h-form-item :label="$t('m.i.bm.otherVoucherNo')" prop="otherVoucherNoLike">
              <h-input v-model="pickVoucherForm.otherVoucherNoLike" :maxlength="32"></h-input>
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
            :bindForm="pickVoucherForm"
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
    name: "pickVoucher",
    data(){
      let _this = this;
      return{
        URL:"/bm/ctrct/tradeInfo/func_pagingNotRelationVoucher",
        hasSelect:false,
        currentSelectRow:[],
        pickVoucherForm:{
          otherVoucherNoLike:"",
          id:"",
          voucherType:"02",
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
            title: this.$t('m.i.bm.otherVoucherNo'),
            key: "otherVoucherNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.common.custNo'),
            key: "custNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.common.custName'),
            key: "custName",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
          },
         /* {
            title: this.$t('m.i.common.custAcctNo'),
            key: "custAcctNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
          },*/
          {
            title:this.$t('m.i.billInfo.oppName'),
            key:"oppName",
            hiddenCol:false
          },
          /*{
            title: this.$t('m.i.bm.oppAcctNo'),
            key: "oppAcctNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
          },*/
          {
            title: this.$t('m.i.bm.voucherUse'),
            key: "otherVoucherUse",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
          },
        ],
      }
    },
    watch: {
      pickVoucherWin(val) {
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
          return "挑选其他凭证";
        }
      },
      batchParams: {
        type: Object,
        default: {}
      },
      pickVoucherWin: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    computed: {
      tempPickVoucherWin: {
        get() {
          return this.pickVoucherWin;
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
        //this.relationBillForm.listId = this.relationVoucherBillParams.listId;
        this.currentSelectRow = [];
        this.hasSelect = false;
        this.$refs.pickDatagrid.selects = [];
        this.$refs.pickDatagrid.selectIds = [];
        this.pickVoucherForm.id = this.batchParams.tradeId;
        this.pickVoucherForm.voucherType = "02";
        this.pickVoucherForm.endorType = this.batchParams.endorType;
        this.pickVoucherForm.buyerName = this.batchParams.buyerName;
        this.pickVoucherForm.sellerName = this.batchParams.sellerName;
        this.$refs.pickDatagrid.dataChange(1);
        this.$refs.pickDatagrid.$refs.gridPage.clearElevator();
      },
      resetSearch() {
        this.$refs.pickVoucherForm.resetFields();
      },
      //返回
      goBack() {
        this.$refs.pickVoucherForm.resetFields();
        //this.relationBillForm.listId = "";
        this.pickVoucherForm.id = "";
        this.currentSelectRow = [];
        this.hasSelect = false;
        this.$refs.pickDatagrid.selects = [];
        this.$refs.pickDatagrid.selectIds = [];
        this.$refs.pickDatagrid.$refs.gridPage.clearElevator();
        this.$emit("pickVoucherWinClose", "");
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
        let url = "/bm/ctrct/tradeInfo/func_pickVoucher";
        post({voucherType:"02" ,voucherIds:idList,id:this.batchParams.tradeId}, url).then(res => {
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
