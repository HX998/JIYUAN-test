<template>
  <div id="acptBankBalanceReport">
    <div class="h-form-search-box">
      <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
        <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
          <h-form-item :label="$t('m.i.pc.reportDate')" prop="reportDate">
            <h-date-picker :value="formItem.reportDate" type="date" placeholder=""  v-model="formItem.reportDate"  :editable=false :showFormat=true @on-change="handleDateChange"></h-date-picker>
          </h-form-item>
          <h-form-item class="h-form-operate one-form">
            <h-button type="ghost" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
          </h-form-item>
        </h-form>
      </h-panel>
    </div>
    <!--数据展示表格-->
    <h-datagrid
      :columns="columns"
      hasPage
      url="/pc/report/discBalanceRegisteReport/func_queryBalanceRegistePage"
      :bindForm="formItem"
      showListCkeckBox
      :hasSelect = false
      :rowSelect = true
      ref="datagrid">
      <div slot="toolbar" class="pull-left">
        <h-button type="primary" @click="tempShowExcelTemplateWinOpen()" >{{$t("m.i.common.listExport")}}</h-button>
      </div>
    </h-datagrid>

    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose" :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>

  </div>
</template>

<script>
  import {  post, on, off ,formatNumber} from "@/api/bizApi/commonUtil";

  export default {
    name: 'discBalanceRegisteReport',
    data(){
      let userNo=window.sessionStorage.getItem('userName');
      return {
        formItem : {
          id:'',
          reportDate:'',
          billType:'',
          custName:'',
          acptName:'',
          cny:'',
          billMoney:'',
          settleAmt:'',
          discDt:'',
          dueDt:'',
          reportCnName:'',
          brchNo:'',
          reportName:'discBalanceRegisteReport',
          userNo:userNo,
          status:'',
          operDt:'',
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
            align: "center"
          },
          {
            title: this.$t("m.i.pc.reportDate"),
            key: "reportDate",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.reportDate ? this.$moment(params.row.reportDate, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.discApplyName"),
            key: "custName",
            hiddenCol: false,
            sortable: true,
          },
          {
            title:this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            sortable: true,
            hiddenCol: false,

          },
          {
            title: this.$t("m.i.pc.amtType"),
            key: "cny",
            hiddenCol: false,

          },
          {
            title: this.$t("m.i.billInfo.discMoney"),
            key: "settleAmt",
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.settleAmt, 2, ","));
            }
          },
          {
            title:  this.$t("m.i.billInfo.discDt"),
            key: "discDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", params.row.discDt ? this.$moment(params.row.discDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.pc.acptEndDt"),
            key: "dueDt",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title:  this.$t("m.i.billInfo.billMoney"),
            key: "billMoney",
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.billMoney, 2, ","));
            }
          },
          {
            title: this.$t('m.i.common.brchNo'),
            key: "brchNo",
            hiddenCol: false,
          },
        ],
        ifShowMore : false,
        billTypeList : [],
        dictMap : null,
        tempShowExcelTemplateWin : false,
        param : null,
        rows : null,
      };
    },
    components: {

    },
    mounted () {
    },
    computed:{
      getHeight() {
        return window.innerHeight - 100;
      }
    },
    methods: {
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //获取导出模板
      tempShowExcelTemplateWinOpen() {
        this.param = 'discBalanceRegisteReportInfo';
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        }else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },

      //清单导出
      exportList(field, exportType){
        let userNo =  window.sessionStorage.getItem('userName');
        //exportType: 0-同步 1-异步
        if(exportType === "1"){
          let url = window.LOCAL_CONFIG.API_HOME + "/pc/report/discBalanceRegisteReport/func_exportExcel";
          let pageSize = this.$refs.datagrid.total;
          if(this.$refs.datagrid.total == 0){
            pageSize = 1;
          }
          let params = null;
          if (this.$refs.datagrid.selectIds.length != 0) {
            params = { reportDate:this.formItem.reportDate,ids: this.$refs.datagrid.selectIds,userNo:userNo, pageSize: this.$refs.datagrid.selectIds.length, field: field, exportType: exportType, excelName: this.param};
          }else {
            params = { reportDate:this.formItem.reportDate,billType:this.formItem.billType,
              custName:this.formItem.custName,acptName:this.formItem.acptName,
              cny:this.formItem.cny,settleAmt:this.formItem.settleAmt,discDt:this.formItem.discDt,
              dueDt:this.formItem.dueDt,billMoney:this.formItem.billMoney,brchNo:this.formItem.brchNo,userNo:userNo,
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
          if (this.$refs.datagrid.selectIds.length != 0) {
            let url = window.LOCAL_CONFIG.API_HOME + "/pc/report/discBalanceRegisteReport/func_exportExcel";
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
            input6.name = 'userNo';
            input6.value = userNo;
            form.appendChild(input6)
            let input7 = document.createElement('input')
            input7.type = 'text'
            input7.name = 'reportDate';
            input7.value = this.formItem.reportDate;
            form.appendChild(input7)

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          } else {
            let url = window.LOCAL_CONFIG.API_HOME + "/pc/report/discBalanceRegisteReport/func_exportExcel";
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
      handleDateChange(value) {
        this.formItem.reportDate = value.replace(/-/g, "");
      },
      formSearch(){
        this.$refs.datagrid.dataChange(1);
      },
    },
    created(){
      this.getDictListByGroups("DraftTypeCode").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.dictMap = res.get("map");
      });
    }
  }
</script>

