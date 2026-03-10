<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item label="客户名称" prop="custName">
                  <h-input v-model="formItem.custName" placeholder="" :maxlength="30"></h-input>
                </h-form-item>
                <h-form-item >
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            url="/pc/risk/black/indexRiskBlackRollBusinessQuery/func_queryRiskRollBusinessInfo"
            :bindForm="formItem"
            :hasSelect="false"
            rowSelect
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="exportExcel()">{{$t('m.i.common.export')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="tempShowExcelTemplateWin=false"
                               :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>
      </h-col>
    </h-row>
  </div>
</template>
<script>
  import {  post ,formatNumber } from '@/api/bizApi/commonUtil'
  export default {
    data(){
      return {
        tempShowExcelTemplateWin:false,
        param : null,
        rows : null,
        formItem:{
          custName:''
        },
        columns:[
          {
            type:"selection",
            width: 60,
            align: "center",
          },
          {
            title:this.$t("m.i.common.index"),
            type:"index",
            hiddenCol:false,
            width: 60,
            align: "center",
          },
          {
            title:"业务类型",
            key:"busiType",
            hiddenCol:false
          },
          {
            title:"票据号码",
            key:"billNo",
            sortable: true,
            hiddenCol:false
          },
          {
            title:"金额",
            key:"money",
            sortable: true,
            hiddenCol:false,
            render: (h, params) => {
              return h('p', formatNumber(params.row.money, 2, ','))
            },
          },
          {
            title:"出票日",
            key:"remitDt",
            sortable: true,
            hiddenCol:false,
            render:(h, params) => {
              let dt = params.row.remitDt?this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD"):""
              return h('span',dt)
            }
          },
          {
            title:"到期日",
            key:"dueDt",
            sortable: true,
            hiddenCol:false,
            render:(h, params) => {
              let dt = params.row.dueDt?this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD"):""
              return h('span',dt)
            }
          },
          {
            title:"业务日期",
            key:"busiDt",
            sortable: true,
            hiddenCol:false,
            render:(h, params) => {
              let dt = params.row.busiDt?this.$moment(params.row.busiDt, "YYYY-MM-DD").format("YYYY-MM-DD"):""
              return h('span',dt)
            }
          },
          {
            title:"付款人",
            key:"drweName",
            sortable: true,
            hiddenCol:false
          },
          {
            title:"收款人",
            key:"pyeeName",
            sortable: true,
            hiddenCol:false
          },
        ]
      }
    },
    methods:{
      formSearch(){
        this.$refs.datagrid.dataChange(1);
        this.$refs.datagrid.selectIds=[];
        this.$refs.datagrid.selects=[];
      },
      formSearchReset(){
        this.$refs.formItem.resetFields();
      },
      //导出
      exportExcel() {
        this.param = 'blackRollBusinessInfoExport';
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
        let url = window.LOCAL_CONFIG.API_HOME + "/pc/risk/black/indexRiskBlackRollBusinessQuery/func_exportRiskRollBusinessInfo";
        if(exportType === "1"){
          let params = null;
          if (this.$refs.datagrid.selectIds.length !== 0) {
            params = { ids: this.$refs.datagrid.selectIds, field: field, exportType: exportType, excelName: this.param};
          }else {
            params = { custName: this.formItem.custName, field: field, exportType: exportType, excelName: this.param};
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

            let input1 = document.createElement('input');
            input1.type = 'text';
            input1.name = 'ids';
            input1.value = this.$refs.datagrid.selectIds;
            form.appendChild(input1);
            let input2 = document.createElement('input');
            input2.type = 'text';
            input2.name = 'field';
            input2.value = field;
            form.appendChild(input2);
            let input3 = document.createElement('input')
            input3.type = 'text';
            input3.name = 'exportType';
            input3.value = exportType;
            form.appendChild(input3);
            let input4 = document.createElement('input')
            input4.type = 'text';
            input4.name = 'excelName';
            input4.value = this.param;
            form.appendChild(input4);

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          } else {
            let form = document.createElement("form");
            for (let obj in this.formItem) {
              if (this.formItem.hasOwnProperty(obj)) {
                let input = document.createElement('input');
                input.type = 'text';
                input.name = obj;
                input.value = this.formItem[obj];
                form.appendChild(input)
              }
            }
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");

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
    }
  }
</script>
