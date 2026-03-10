<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <div class="h-search-form-row" >
                  <h-form-item :label="$t('m.i.shcpe.chargeMonth')" prop="chargeMonthRange">
                    <h-date-picker type="monthrange" v-model="formItem.chargeMonthRange" format="yyyy-MM"
                                   showFormat placeholder="" @on-change="handleChargeMonthChange"></h-date-picker>
                  </h-form-item>
                  <show-branch v-model="formItem.branchNos" :label="$t('m.i.common.brchName')" prop="branchNos"
                               title="机构名称" :brchNo.sync="formItem.branchNos" :brchName.sync="formItem.branchName">
                  </show-branch>
                  <h-form-item prop="status" :label="$t('m.i.common.status')">
                    <h-select v-model="formItem.status" placeholder="" showTitle>
                      <h-option v-for="item in statusList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <h-button type="primary" @click="formSearch()">{{$t('m.i.common.search')}}</h-button>
                    <h-button type="ghost" @click="formSearchReset()">{{$t('m.i.common.reset')}}</h-button>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix">
              <h-form :label-width="120" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <h-form-item :label="$t('m.i.shcpe.transAmtTotal')" >
                    <h-input v-model="transAmtTotal" placeholder="" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.shcpe.settleTransferAmtTotal')" >
                    <h-input v-model="settleTransferAmtTotal" placeholder="" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.shcpe.acctAmtTotal')" >
                    <h-input v-model="acctAmtTotal" placeholder="" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.shcpe.otherAmtTotal')" >
                    <h-input v-model="otherAmtTotal" placeholder="" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.shcpe.totalInterestAmtTotal')" >
                    <h-input v-model="totalInterestAmt" placeholder="" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.shcpe.totalFeeAmtTotal')" >
                    <h-input v-model="totalFeeAmt" placeholder="" readonly></h-input>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            :hasSelect = false
            highlight-row
            :rowSelect = true
            url="/shcpe/cpes/fee/queryFeeBillInfo"
            :bindForm="formItem"
            ref="datagrid">
            <div slot="toolbar" class='pull-left'>
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen()">清单导出</h-button>
              <h-button type="primary" @click="accountExcelTemplateWinOpen()">账单导出</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>
  </div>
</template>
<script>
  import { post, on,off,formatNumber,getDictListByGroups, accMul} from "@/api/bizApi/commonUtil";

    export default {
      name: "feeBillManage",
      components: {

      },
      data() {
          return {
            statusList:[],
            ifShowMore : false,
            tempShowExcelTemplateWin : false,
            param : null,
            rows : null,
            dictMap : new Map(),
            formItem : {
              minChargeMonth:"",
              maxChargeMonth:"",
              chargeMonthRange:"",
              branchNos:"",
              branchName:"",
              status:""
            },
            transAmtTotal:"",
            settleTransferAmtTotal:"",
            acctAmtTotal:"",
            otherAmtTotal:"",
            totalInterestAmt:"",
            totalFeeAmt:"",
            columns : [
              {
                type: "selection",
                width: 60,
                align: "center",
                hiddenCol: false
              },
              {
                title: this.$t("m.i.common.index"),
                type: 'index',
                align: 'center',
                hiddenCol: false
              },
              {
                title:this.$t("m.i.shcpe.chargeMonth"),
                key: "chargeMonth",
                hiddenCol:false,
                sortable: true,
                render: (h, params) => {
                  let date = params.row.chargeMonth == null ? "-" : this.$moment(params.row.chargeMonth, "YYYY-MM").format("YYYY-MM");
                  return h("span", date);
                }
              },
              {
                title: this.$t("m.i.common.memberName"),
                key: "memberName",
                hiddenCol: false
              },
              {
                title: this.$t("m.i.common.brchName"),
                key: "branchName",
                hiddenCol: false
              },
              {
                title: this.$t("m.i.common.brchCode"),
                key: "branchCode",
                hiddenCol: false
              },
              {
                title: this.$t("m.i.common.status"),
                key: "status",
                hiddenCol: false,
                render: (h, params) => {
                  let list = this.getDictValueFromMap(this.dictMap, "FeeBillStatus", params.row.status);
                  return h("span",
                    {
                      domProps: {
                        title: list
                      }
                    }, list);
                }
              },
              {
                title: this.$t("m.i.shcpe.startDate"),
                key: "startDate",
                hiddenCol: false,
                render: (h, params) => {
                  let date = params.row.startDate == null ? "-" : this.$moment(params.row.startDate, "YYYY-MM-DD").format("YYYY-MM-DD");
                  return h("span", date);
                }
              },
              {
                title: this.$t("m.i.shcpe.endDate"),
                key: "endDate",
                hiddenCol: false,
                render: (h, params) => {
                  let date = params.row.endDate == null ? "-" : this.$moment(params.row.endDate, "YYYY-MM-DD").format("YYYY-MM-DD");
                  return h("span", date);
                }
              },
              {
                title: this.$t("m.i.shcpe.chargeDate"),
                key: "chargeDate",
                hiddenCol: false,
                render: (h, params) => {
                  let date = params.row.chargeDate == null ? "-" : this.$moment(params.row.chargeDate, "YYYY-MM-DD").format("YYYY-MM-DD");
                  return h("span", date);
                }
              },
              {
                title: this.$t("m.i.shcpe.acctDate"),
                key: "acctDate",
                hiddenCol: false,
                render: (h, params) => {
                  let date = params.row.acctDate == null ? "-" : this.$moment(params.row.acctDate, "YYYY-MM-DD").format("YYYY-MM-DD");
                  return h("span", date);
                }
              },
              {
                title: this.$t("m.i.shcpe.transAmt"),
                key: "transAmt",
                hiddenCol: false,
                render: (h, params) => {
                  return h('div', [
                    h('span', formatNumber(params.row.transAmt, 2, ','))
                  ]);
                }
              },
              {
                title: this.$t("m.i.shcpe.settleTransferAmt"),
                key: "settleTransferAmt",
                hiddenCol: false,
                render: (h, params) => {
                  return h('div', [
                    h('span', formatNumber(params.row.settleTransferAmt, 2, ','))
                  ]);
                }
              },
              {
                title: this.$t("m.i.shcpe.acctAmt"),
                key: "acctAmt",
                hiddenCol: false,
                render: (h, params) => {
                  return h('div', [
                    h('span', formatNumber(params.row.acctAmt, 2, ','))
                  ]);
                }
              },
              {
                title: this.$t("m.i.shcpe.otherAmt"),
                key: "otherAmt",
                hiddenCol: false,
                render: (h, params) => {
                  return h('div', [
                    h('span', formatNumber(params.row.otherAmt, 2, ','))
                  ]);
                }
              },
              {
                title: this.$t("m.i.shcpe.terminalAmt"),
                key: "terminalAmt",
                hiddenCol: false,
                render: (h, params) => {
                  return h('div', [
                    h('span', formatNumber(params.row.terminalAmt, 2, ','))
                  ]);
                }
              },
              {
                title: this.$t("m.i.shcpe.totalCalFeeAmt"),
                key: "totalCalFeeAmt",
                hiddenCol: false,
                render: (h, params) => {
                  return h('div', [
                    h('span', formatNumber(params.row.totalCalFeeAmt, 2, ','))
                  ]);
                }
              },
              {
                title: this.$t("m.i.shcpe.totalPreferentialAmt"),
                key: "totalPreferentialAmt",
                hiddenCol: false,
                render: (h, params) => {
                  return h('div', [
                    h('span', formatNumber(params.row.totalPreferentialAmt, 2, ','))
                  ]);
                }
              },
              {
                title: this.$t("m.i.shcpe.totalInterestAmt"),
                key: "totalInterestAmt",
                hiddenCol: false,
                render: (h, params) => {
                  return h('div', [
                    h('span', formatNumber(params.row.totalInterestAmt, 2, ','))
                  ]);
                }
              },
              {
                title: this.$t("m.i.shcpe.totalFeeAmt"),
                key: "totalFeeAmt",
                hiddenCol: false,
                render: (h, params) => {
                  return h('div', [
                    h('span', formatNumber(params.row.totalFeeAmt, 2, ','))
                  ]);
                }
              },
              {
                title: this.$t("m.i.shcpe.ccpcMsgId"),
                key: "ccpcMsgId",
                hiddenCol: false
              }
            ],
          }
      },
      methods:{
        handleChargeMonthChange(){
          if(this.formItem.chargeMonthRange.length > 0){
            let range = this.formItem.chargeMonthRange.replace(/-/g,"");
            let DateRange = range.split("  ");
            this.formItem.minChargeMonth=DateRange[0];
            this.formItem.maxChargeMonth=DateRange[1];
          }else{
            this.formItem.minChargeMonth = "";
            this.formItem.maxChargeMonth = "";
          }
        },
        formSearch() {
          this.$refs.datagrid.selects = [];
          this.$refs.datagrid.selectIds = [];
          this.getDataTotal();
          this.$refs.datagrid.dataChange(1);
        },
        formSearchReset() {
          let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
          this.formItem.branchNos = userInfo.brchNo;
          this.formItem.branchName = userInfo.brchName;
          this.formItem.minChargeMonth = "";
          this.formItem.maxChargeMonth = "";
          this.$refs.formItem.resetFields();
        },
        getDataTotal() {
          let url = "/shcpe/cpes/fee/querySumFeeBill";
          post(this.formItem, url).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  let data = res.data.retData;
                  this.transAmtTotal = formatNumber(data.transAmtTotal, 2, ',');
                  this.settleTransferAmtTotal = formatNumber(data.settleTransferAmtTotal, 2, ',');;
                  this.acctAmtTotal = formatNumber(data.acctAmtTotal, 2, ',');
                  this.otherAmtTotal = formatNumber(data.otherAmtTotal, 2, ',');
                  this.totalInterestAmt = formatNumber(data.totalInterestAmt, 2, ',');
                  this.totalFeeAmt = formatNumber(data.totalFeeAmt, 2, ',');
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            }
          );
        },
        accountExcelTemplateWinOpen(){
          let selects = this.$refs.datagrid.selects;
          if (selects.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            return;
          }
          if (selects.length > 1) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
            return;
          }
            let url = window.LOCAL_CONFIG.API_HOME + "/shcpe/cpes/fee/exportAcctBill";
            let form = document.createElement('form');
            form.setAttribute("id", "formId");
            form.setAttribute('action', url);
            form.setAttribute("method", "post");
            let input = document.createElement('input')
            input.type = 'text'
            input.name = 'id'
            input.value = selects[0].id
            form.appendChild(input);
            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
        },
        //获取导出模板
        tempShowExcelTemplateWinOpen() {
          this.param = 'feeBillManageExportInfo';
          if (this.$refs.datagrid.selectIds.length !== 0) {
            this.rows = this.$refs.datagrid.selectIds.length;
          }else {
            this.rows = this.$refs.datagrid.total;
          }
          this.tempShowExcelTemplateWin = true;
        },
        showExcelTemplateWinClose() {
          this.tempShowExcelTemplateWin = false;
        },
        //清单导出
        exportList(field, exportType){
          //exportType: 0-同步 1-异步
          if(exportType === "1"){
            let url = window.LOCAL_CONFIG.API_HOME + "/shcpe/cpes/fee/exportFeeList";
            let pageSize = this.$refs.datagrid.total;
            if(this.$refs.datagrid.total == 0){
              pageSize = 1;
            }
            let params = null;
            if (this.$refs.datagrid.selectIds.length != 0) {
              params = { ids: this.$refs.datagrid.selectIds, pageSize: this.$refs.datagrid.selectIds.length, field: field, exportType: exportType, excelName: this.param};
            }else {
              params = {
                branchNos:this.formItem.branchNos,
                minChargeMonth:this.formItem.minChargeMonth,
                maxChargeMonth:this.formItem.maxChargeMonth,
                status:this.formItem.status,
                field: field, exportType: exportType, excelName: this.param,pageSize:pageSize};
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
              let url = window.LOCAL_CONFIG.API_HOME + "/shcpe/cpes/fee/exportFeeList";
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
              let url = window.LOCAL_CONFIG.API_HOME + "/shcpe/cpes/fee/exportFeeList";
              let form = document.createElement("form");
              for (let obj in this.formItem) {
                if (this.formItem.hasOwnProperty(obj)) {
                  let input = document.createElement('input')
                  input.type = 'text'
                  input.name = obj;
                  input.value = this.formItem[obj];
                  form.appendChild(input)
                }
              }
              form.setAttribute("id", "formId");
              form.setAttribute("action", url);
              form.setAttribute("method", "post");
              if (this.$refs.datagrid.total > 0) {
                let input1 = document.createElement('input')
                input1.type = 'text'
                input1.name = 'pageSize';
                input1.value = this.$refs.datagrid.total;
                form.appendChild(input1)
              }
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
            }
          }
        },
      },
      created() {
        let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
        this.formItem.branchNos = userInfo.brchNo;
        this.formItem.branchName = userInfo.brchName;
      },
      mounted() {
        this.getDataTotal();
        getDictListByGroups("FeeBillStatus").then(res => {
          this.statusList = res.get("FeeBillStatus");
          this.dictMap = res.get("map");
        });
      }
    }
</script>

<style scoped>

</style>
