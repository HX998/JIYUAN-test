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
                  <h-form-item :label="$t('m.i.shcpe.billMonth')" prop="chargeMonth">
                    <h-date-picker type="month" v-model="formItem.chargeMonth" format="yyyy-MM"
                                   showFormat placeholder="" @on-change="handleChargeMonthChange"></h-date-picker>
                  </h-form-item>
                  <show-branch v-model="formItem.branchNos" :label="$t('m.i.common.brchName')" prop="branchNos"
                               title="机构名称" :brchNo.sync="formItem.branchNos" :brchName.sync="formItem.branchName">
                  </show-branch>
                  <h-form-item class="h-form-operate two-form">
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
                    <h-input v-model="transFeeAmt" placeholder="" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.shcpe.settleTransferAmtTotal')" >
                    <h-input v-model="settFeeAmt" placeholder="" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.shcpe.acctAmtTotal')" >
                    <h-input v-model="acctFeeAmt" placeholder="" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.shcpe.otherAmtTotal')" >
                    <h-input v-model="otherFeeAmt" placeholder="" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.shcpe.sumMoney')" >
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
            url="/shcpe/cpes/feeData/queryFeeChargeData"
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
  import { post, on,off,formatNumber, accMul} from "@/api/bizApi/commonUtil";

  export default {
    name: "feeChargeData",
    components: {

    },
    data() {
      return {
        ifShowMore : false,
        tempShowExcelTemplateWin : false,
        param : null,
        rows : null,
        dictMap : new Map(),
        formItem : {
          chargeMonth:"",
          branchNos:"",
          branchName:"",
        },
        transFeeAmt:"",
        settFeeAmt:"",
        acctFeeAmt:"",
        otherFeeAmt:"",
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
            title:this.$t("m.i.shcpe.billMonth"),
            key: "chargeMonth",
            hiddenCol:false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.chargeMonth == null ? "" : this.$moment(params.row.chargeMonth, "YYYY-MM").format("YYYY-MM");
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
            title: this.$t("m.i.shcpe.calTransFeeAmt"),
            key: "calTransFeeAmt",
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('span', formatNumber(params.row.calTransFeeAmt, 2, ','))
              ]);
            }
          },
          {
            title: this.$t("m.i.shcpe.preTransFeeAmt"),
            key: "preTransFeeAmt",
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('span', formatNumber(params.row.preTransFeeAmt, 2, ','))
              ]);
            }
          },
          {
            title: this.$t("m.i.shcpe.calSettFeeAmt"),
            key: "calSettFeeAmt",
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('span', formatNumber(params.row.calSettFeeAmt, 2, ','))
              ]);
            }
          },
          {
            title: this.$t("m.i.shcpe.preSettFeeAmt"),
            key: "preSettFeeAmt",
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('span', formatNumber(params.row.preSettFeeAmt, 2, ','))
              ]);
            }
          },
          {
            title: this.$t("m.i.shcpe.calOtherFeeAmt"),
            key: "calOtherFeeAmt",
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('span', formatNumber(params.row.calOtherFeeAmt, 2, ','))
              ]);
            }
          },
          {
            title: this.$t("m.i.shcpe.preOtherFeeAmt"),
            key: "preOtherFeeAmt",
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('span', formatNumber(params.row.preOtherFeeAmt, 2, ','))
              ]);
            }
          },
          {
            title: this.$t("m.i.shcpe.calAcctFeeAmt"),
            key: "calAcctFeeAmt",
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('span', formatNumber(params.row.calAcctFeeAmt, 2, ','))
              ]);
            }
          },
          {
            title: this.$t("m.i.shcpe.preAcctFeeAmt"),
            key: "preAcctFeeAmt",
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('span', formatNumber(params.row.preAcctFeeAmt, 2, ','))
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
          }
        ],
      }
    },
    methods:{
      handleChargeMonthChange(){
          let month = this.formItem.chargeMonth.replace(/-/g,"");
          this.formItem.chargeMonth = month;
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
        this.$refs.formItem.resetFields();
      },
      getDataTotal() {
        let url = "/shcpe/cpes/feeData/querySumFeeChrgData";
        post(this.formItem, url).then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                let data = res.data.retData;
                this.transFeeAmt = formatNumber(data.transFeeAmt, 2, ',');
                this.settFeeAmt = formatNumber(data.settFeeAmt, 2, ',');
                this.acctFeeAmt = formatNumber(data.acctFeeAmt, 2, ',');
                this.otherFeeAmt = formatNumber(data.otherFeeAmt, 2, ',');
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
        let url = window.LOCAL_CONFIG.API_HOME + "/shcpe/cpes/feeData/exportFeeChrgBill";
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
        this.param = 'feeBillDataListExportInfo';
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
          let url = window.LOCAL_CONFIG.API_HOME + "/shcpe/cpes/feeData/exportFeeDataList";
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
              chargeMonth:this.formItem.chargeMonth,
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
            let url = window.LOCAL_CONFIG.API_HOME + "/shcpe/cpes/feeData/exportFeeDataList";
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
            let url = window.LOCAL_CONFIG.API_HOME + "/shcpe/cpes/feeData/exportFeeDataList";
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
      this.getDictListByGroups("").then(res => {
        this.dictMap = res.get("map");
      });
    }
  }
</script>

<style scoped>

</style>
