<!-- 库存余额查询 -->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.pc.creditBankName')" prop="creditBankName">
                  <h-input v-model="formItem.creditBankName" readonly icon="android-search"
                           @on-click="queryCustName()" clearable @on-clear="clearBankName()"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.pc.creditDt')" prop="creditDt">
                  <h-date-picker v-model="formItem.creditDt" type="date" :editable=false
                                 :showFormat=true placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate two-form">
                  <!--<span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"-->
                  <!--:class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>-->
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            url="/pc/credit/creditStockBalance/func_listPageStockBalance"
            :bindForm="formItem"
            :hasSelect = false
            :rowSelect = true
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen()">
                {{$t("m.i.common.export")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <show-member :showMemberWin="showMemberWin" @memberWinClose="memberWinClose"
                 @memberSelect="memberSelect" :isShowBankNo="true"></show-member>

    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import { on, off, post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "stockBalanceQuery",
    data() {
      return {
        ifShowMore : false,
        columns : [
          {
            type: "selection",
            width: 60,
            hiddenCol: false,
            align: "center"
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.pc.stockBalanceType"),
            key: "stockBalanceType",
            hiddenCol: false,
            render: (h, params) => {
              let info = params.row.stockBalanceType;
              switch (params.row.stockBalanceType) {
                case "1":
                  info = "承兑行贴现库存余额";
                  break;
              }
              return h("span", info);
            }
          },
          {
            title: this.$t("m.i.pc.creditBankNo"),
            key: "creditBankNo",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.pc.creditBankName"),
            key: "creditBankName",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.pc.stockLimitAmt"),
            key: "stockLimitAmt",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let stockLimitAmt = formatNumber(params.row.stockLimitAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: stockLimitAmt
                }
              }, stockLimitAmt);
            }
          },
          {
            title: this.$t("m.i.pc.stockDoAmt"),
            key: "stockDoAmt",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let stockDoAmt = formatNumber(params.row.stockDoAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: stockDoAmt
                }
              }, stockDoAmt);
            }
          },
          {
            title: this.$t("m.i.pc.stockUsedAmt"),
            key: "stockUsedAmt",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let stockUsedAmt = formatNumber(params.row.stockUsedAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: stockUsedAmt
                }
              }, stockUsedAmt);
            }
          },
          // {
          //   title: "生效日期",
          //   key: "activeDt",
          //   hiddenCol: false,
          //   sortable: true,
          //   render: (h, params) => {
          //     let date = params.row.activeDt == null ? "" : this.$moment(params.row.activeDt, "YYYY-MM-DD").format("YYYY-MM-DD");
          //     return h("span", date);
          //   }
          // },
          // {
          //   title: "失效日期",
          //   key: "failureDt",
          //   hiddenCol: false,
          //   sortable: true,
          //   render: (h, params) => {
          //     let date = params.row.failureDt == null ? "" : this.$moment(params.row.failureDt, "YYYY-MM-DD").format("YYYY-MM-DD");
          //     return h("span", date);
          //   }
          // },
          {
            title:this.$t("m.i.pc.creditDt"),
            key: "creditDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.creditDt == null ? "" : this.$moment(params.row.creditDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.pc.creditTellerNo"),
            key: "creditTellerNo",
            hiddenCol: false
          }
        ],
        formItem : {
          creditBankNo: "",
          creditBankName: "",
          creditDt: ""
        },
        type : null,
        isRequired : true,
        submitFlag : false,
        param: null,
        rows: null,
        //查看会员弹出框
        showMemberWin : false,
        tempShowExcelTemplateWin: false,
        importWin: false,
      };
    },
    components: {
      ShowMember:()=>import(/* webpackChunkName: "shcpe/cpes/member/showMember" */`@/views/bizViews/shcpe/cpes/member/showMember`)
    },
    methods: {
      //清单导出
      tempShowExcelTemplateWinOpen() {
        this.param = "creditStockBalanceListExport";
        if (this.$refs.datagrid.selectIds.length !== 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //清单导出
      exportList(field, exportType) {
        //exportType: 0-同步 1-异步
        let url = window.LOCAL_CONFIG.API_HOME + "/pc/credit/creditStockBalance/func_exportBillInfo";
        if (exportType === "1") {
          let params = null;
          let pageSize = this.$refs.datagrid.total;
          if(this.$refs.datagrid.total == 0){
            pageSize = 1;
          }
          if (this.$refs.datagrid.selectIds.length !== 0) {
            params = { ids: this.$refs.datagrid.selectIds, pageSize: this.$refs.datagrid.selectIds.length, field: field, exportType: exportType, excelName: this.param};
          } else {
            params = {
              creditBankNo: this.formItem.creditBankNo,
              creditBankName: this.formItem.creditBankName,
              creditDt: this.formItem.creditDt,
              field: field,
              exportType: exportType,
              excelName: this.param,
              pageSize:pageSize
            };
          }
          post(params, url).then(res => {
            if(res.status === 200 && res.data === null){
              this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            }else if(res.status === 200 && res.data === ""){
              this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            } else{
              this.$msgTip.error(this, { info: "异步导出失败" });
            }
          });
        } else {
          if (this.$refs.datagrid.selectIds.length !== 0) {
            let form = document.createElement("form");
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");

            let input1 = document.createElement('input')
            input1.type = 'text'
            input1.name = 'ids';
            input1.value = this.$refs.datagrid.selectIds;
            form.appendChild(input1)
            let input2 = document.createElement('input')
            input2.type = 'text'
            input2.name = 'pageSize';
            input2.value = this.$refs.datagrid.selectIds.length;
            form.appendChild(input2)
            let input3 = document.createElement('input')
            input3.type = 'text'
            input3.name = 'field';
            input3.value = field;
            form.appendChild(input3)
            let input4 = document.createElement('input')
            input4.type = 'text'
            input4.name = 'exportType';
            input4.value = exportType;
            form.appendChild(input4)
            let input5 = document.createElement('input')
            input5.type = 'text'
            input5.name = 'excelName';
            input5.value = this.param;
            form.appendChild(input5)
            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          } else {
            let form = document.createElement("form");
            for (let obj in this.formItem) {
              if (this.formItem.hasOwnProperty(obj)) {
                let input = document.createElement("input");
                input.type = "text";
                input.name = obj;
                input.value = this.formItem[obj];
                form.appendChild(input);
              }
            }
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");
            if (this.$refs.datagrid.total > 0) {
              let input1 = document.createElement("input");
              input1.type = "text";
              input1.name = "pageSize";
              input1.value = this.$refs.datagrid.total;
              form.appendChild(input1);
            }
            let input3 = document.createElement("input");
            input3.type = "text";
            input3.name = "field";
            input3.value = field;
            form.appendChild(input3);
            let input4 = document.createElement("input");
            input4.type = "text";
            input4.name = "exportType";
            input4.value = exportType;
            form.appendChild(input4);
            let input5 = document.createElement("input");
            input5.type = "text";
            input5.name = "excelName";
            input5.value = this.param;
            form.appendChild(input5);
            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          }
        }
      },
      formSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.formItem.creditDt = this.formItem.creditDt.replace(/-/g, "");
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.creditBankNo = "";
        this.$refs.formItem.resetFields();
      },
      memberSelect(info) {
        this.formItem.creditBankNo = info.memberBankNo;
        this.formItem.creditBankName = info.memberName;
        this.showMemberWin = false;
      },
      queryCustName() {
        this.showMemberWin = true;
      },
      memberWinClose() {
        this.showMemberWin = false;
      },
      clearBankName() {
        this.formItem.creditBankNo = "";
        this.formItem.creditBankName = "";
      },
    }
  };
</script>

<style scoped>

</style>
