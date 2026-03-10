<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.brchNo" :label="$t('m.i.common.brchName')" prop="brchNo" :showCheckBox="false"
                             title="机构名称" :brchNo.sync="formItem.brchNo" :brchName.sync="formItem.brchName">
                </show-branch>
                <h-form-item :label="$t('m.i.pc.balanceType')" prop="balanceTypes">
                  <h-select  v-model="formItem.balanceTypes" placeholder="" multiple showTitle>
                    <h-option  value="1">贴现余额</h-option>
                    <h-option  value="2">转入余额</h-option>
                    <h-option  value="3">质押式逆回购余额</h-option>
                    <h-option  value="4">买断式逆回购余额</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.pc.acptBankMemberName')" prop="acptTopBankName" class="h-form-long-label">
                  <h-input v-show="false" :value="formItem.acptTopBankNo" :title="formItem.acptTopBankNo"></h-input>
                  <h-input v-model="formItem.acptTopBankName" :maxlength=60
                           readonly icon="android-search" @on-click="queryHeadBankInfo" clearable
                           @on-clear="clearHeadBankInfo"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <!--<span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>-->
                  <h-button type="primary" @click="formSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/pc/report/acptBankBalanceReport/func_queryAcptBankBalance"
            :bindForm="formItem"
            :page-size="pageSizeParamValue"
            :row-select="true"
            :has-select="false"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="excelExport">{{$t('m.i.common.export')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <head-bank-win :showHeadBankWin="showHeadBankWin" :title="'总行信息'"
                   @showHeadBankWinClose="showHeadBankWinClose" @headBankSelect="headBankSelect"></head-bank-win>
    <!--<show-head-bank :showHeadBankWin="showHeadBankWin" :title="'总行信息'"
                    @showHeadBankWinClose="showHeadBankWinClose" @headBankSelect="headBankSelect"></show-head-bank>-->
    <!-- excel导出-->
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="tempShowExcelTemplateWin=false"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>

  </div>
</template>

<script>
  import { post, on, off, exportList,formatNumber,getDictValueFromMap } from "@/api/bizApi/commonUtil";
  export default {
    name: "acptBankBalanceReport",
    components : {
      headBankWin: () => import(/* webpackChunkName: "pc/report/headBankWin"*/`@/views/bizViews/pc/report/headBankWin`)
    },
    data(){
      return{
        pageSizeParamValue : "",
        param : '',
        rows : null,
        ifShowMore : false,
        dictMap : new Map(),
        showHeadBankWin : false,
        tempShowExcelTemplateWin : false,
        formItem : {
          brchName:"",
          brchNo : '',
          balanceTypes : [],
          acptTopBankNo: "",
          acptTopBankName : ""
        },
        columns : [
          {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            key:"xuhao",
            align: "center"
          },
          {
            title: this.$t("m.i.common.memberId"),
            key: "memberId",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.brchName'),
            key: "brchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pc.acptBankMemberName"),
            key: "memberName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.pc.creditLimitMoney'),
            key: "creditLimitAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.creditLimitAmt === null){
                return h("span", "-");
              }else{
                return h("span", formatNumber(params.row.creditLimitAmt, 2, ","));
              }
            }
          },
          {
            title: this.$t('m.i.pc.doMoney'),
            key: "doAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.doAmt === null) {
                return h("span", "-");
              } else {
                return h("span", formatNumber(params.row.doAmt, 2, ","));
              }
            }
          },
          {
            title: this.$t('m.i.pc.usedCreditMoney'),
            key: "usedCreditAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.usedCreditAmt === null) {
                return h("span", "-");
              } else {
                return h("span", formatNumber(params.row.usedCreditAmt, 2, ","));
              }
            }
          },
          {
            title: this.$t('m.i.pc.usedDiscBillMoney'),
            key: "usedDiscBillMoney",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.usedDiscBillMoney === null) {
                return h("span", "-");
              } else {
                return h("span", formatNumber(params.row.usedDiscBillMoney, 2, ","));
              }
            }
          },
          {
            title: this.$t('m.i.pc.usedBuyBillMoney'),
            key: "usedBuyBillMoney",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.usedBuyBillMoney === null) {
                return  h("span", "-");
              } else {
                return h("span", formatNumber(params.row.usedBuyBillMoney, 2, ","))
              }
            }
          },
          {
            title: this.$t('m.i.pc.usedImpawnBillMoney'),
            key: "usedImpawnBillMoney",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.usedImpawnBillMoney === null) {
                return h("span", "-");
              } else {
                return h("span", formatNumber(params.row.usedImpawnBillMoney, 2, ","));
              }
            }
          },
          {
            title: this.$t('m.i.pc.usedOutRightBillMoney'),
            key: "usedOutRightBillMoney",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.usedOutRightBillMoney === null) {
                return  h("span", "-");
              } else {
                return h("span", formatNumber(params.row.usedOutRightBillMoney, 2, ","));
              }
            }
          }
        ],
      }
    },
    methods : {
      formSearch() {
        if (this.formItem.brchNo === null || this.formItem.brchNo === "") {
          this.$msgTip.info(this, { info: this.$t("机构名称不能为空") });
          return;
        }
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.formItem.resetFields();
        this.formItem.acptTopBankName = "",
          this.formItem.acptTopBankNo = "",
          this.initData();
      },
      clearVal() {
        this.formItem.brchNo = "";
        this.formItem.brchName = "";
      },
      queryHeadBankInfo() {
        this.showHeadBankWin = true;
      },
      clearHeadBankInfo() {
        this.formItem.acptTopBankNo = "";
        this.formItem.acptTopBankNo = "";
      },
      // 选择集团客户界面关闭
      showHeadBankWinClose() {
        this.showHeadBankWin = false;
      },
      // 选择集团总部客户
      headBankSelect(info) {
        this.formItem.acptTopBankNo = info.bankNo;
        this.formItem.acptTopBankName = info.bankName;
        this.showHeadBankWin = false;
      },
      initData(){
        let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
        this.formItem.brchNo = userInfo.brchNo;
        this.formItem.brchName = userInfo.brchName;
      },
      //excel导出
      excelExport(){
        this.param = "acptBankBalanceReport";
        if (this.$refs.datagrid.selectIds.length !== 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        }else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      //清单导出
      exportList(field, exportType){
        //exportType: 0-同步 1-异步
        let url = window.LOCAL_CONFIG.API_HOME + "/pc/report/acptBankBalanceReport/func_exportExcel";
        if(exportType === "1"){
          let params = null;
          let pageSize = this.$refs.datagrid.total;
          if(this.$refs.datagrid.total == 0){
            pageSize = 1;
          }
          if (this.$refs.datagrid.selectIds.length !== 0) {
            params = { ids: this.$refs.datagrid.selectIds,brchNo : this.formItem.brchNo,balanceTypes : this.formItem.balanceTypes, acptTopBankNo : this.formItem.acptTopBankNo, pageSize: this.$refs.datagrid.selectIds.length, field: field, exportType: exportType, excelName: this.param};
          } else {
            params = {
              brchNo: this.formItem.brchNo,
              brchName:this.formItem.brchName,
              balanceTypes: this.formItem.balanceTypes,
              acptTopBankNo: this.formItem.acptTopBankNo,
              acptTopBankName : this.formItem.acptTopBankName,
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
        }else {
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
            let input6 = document.createElement('input')
            input6.type = 'text'
            input6.name = 'brchNo';
            input6.value = this.formItem.brchNo;
            form.appendChild(input6)
            let input7 = document.createElement('input')
            input7.type = 'text'
            input7.name = 'balanceTypes';
            input7.value = this.formItem.balanceTypes;
            form.appendChild(input7)
            let input8 = document.createElement('input')
            input8.type = 'text'
            input8.name = 'acptTopBankNo';
            input8.value = this.formItem.acptTopBankNo;
            form.appendChild(input7)
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
    },
    created() {
      this.initData();
      this.pageSizeParamValue = parseInt(window.sessionStorage.getItem("pageSize"));
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,CpesFlowStatus").then(res => {
        this.dictMap = res.get("map");
      })
    }
  }
</script>

<style scoped>

</style>
