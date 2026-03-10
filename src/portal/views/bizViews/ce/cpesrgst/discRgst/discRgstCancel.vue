<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="billNoLike" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="formItem.billNoLike" placeholder="" :maxlength="30"></h-input>
                </h-form-item>
                <h-form-item prop="rgstStatus" :label="$t('m.i.ce.rgstStatus')">
                  <h-select v-model="formItem.rgstStatus" placeholder="">
                    <h-option value="BTA04" key="BTA04">登记成功</h-option>
                    <h-option value="BTA10" key="BTA10">登记撤回失败</h-option>
                    <h-option value="BTA16" key="BTA16">撤销权属记账失败</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate two-form">
                  <h-button type="primary" @click="handleSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      url="/ce/cpesrgst/discRgst/discRgstCancel/func_pagingQueryPaperRgstCancel"
                      :bindForm="formItem"
                      :has-select="false"
                      :row-select="true"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="rgstCancel">{{$t('m.i.common.revocation')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 查看票面 -->
    <rgst-bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo"></rgst-bill-info-main>
  </div>
</template>

<script>
  import { post, on, off, accMul, getDictListByGroups, getDictValueFromMap,formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "discRgstCancel",
    components : {
    },
    data() {
      return {
        //字典值
        dictMap: new Map(),
        //票面
        showBillInfoWin: false,
        billId: '',
        billNo: '',
        formItem: {
          rgstClass: 'RI04',
          billNoLike: ''
        },
        columns: [
          {
            type: 'selection',
            key: 'multiSelect',
            width: 60,
            hiddenCol: false,
          },
          {
            type: 'index',
            key: 'numOrder',
            title: this.$t("m.i.common.index"),
            width: 60,
            align: 'center',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: 'billType',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            },
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: 'billNo',
            hiddenCol: false,
            render: (h, params) => {
                return h("a", {
                    on: {
                        click: () => {
                            this.showBillInfo(params.row.id,params.row.billNo);
                        }
                    }
                }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billMoney"),
            key: 'billMoney',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ',');
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: 'dueDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.dueDt == null || params.row.dueDt === ""){
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
           title: this.$t("m.i.ce.registerStatus"),
            key: 'rgstStatus',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"AcptRgstStatus",params.row.rgstStatus);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            },
          },
          {
            title: this.$t("m.i.billInfo.acptBankName"),
            key: 'acptBankName',
            hiddenCol: false,
            sortable: true,
          },
          {
             title: this.$t("m.i.ce.discountApplyName"),
            key: 'transFromName',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.ce.transToBankName"),
            key: 'transToBankName',
            hiddenCol: false,
            sortable: true,
          },
          {
             title: this.$t("m.i.billInfo.discDt"),
            key: 'rgstDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.rgstDt == null || params.row.rgstDt === ""){
                return "";
              }
              let date = this.$moment(params.row.rgstDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
           title: this.$t("m.i.billInfo.discInterestRate"),
            key: 'discInterestRate',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.discInterestRate != null && params.row.discInterestRate !== "") {
                let rate = accMul(params.row.discInterestRate, 100) + "(%)";
                return h("span", rate);
              }
            }
          },
        ],
      }
    },
    mounted() {
      getDictListByGroups("DraftTypeCode,AcptRgstStatus").then(res => {
        this.dictMap = res.get("map");
      });
    },
    methods: {
      //表单查询
      handleSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      },
        //票面
        showBillInfo(billId, billNo) {
            this.billId = billId;
            this.billNo = billNo;
            this.showBillInfoWin = true;
        },
        billInfoWinClose() {
            this.showBillInfoWin = false;
        },

      //撤回
      rgstCancel() {
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: "确认",
          content: "确定撤回吗？",
          onOk: () => {
            this.handleRgstCancel();
          }
        });
      },
      handleRgstCancel() {
        let list = this.$refs.datagrid.selects;
        let ids = "";
        for (let i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({ listIds : ids}, "/ce/cpesrgst/discRgst/discRgstCancel/func_cancelDiscRgst").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.handleSearch();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.handleSearch();
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
