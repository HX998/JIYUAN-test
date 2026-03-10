<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.custName')" prop="custName">
                  <h-input v-model="formItem.custName" :maxlength=60></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate two-form">
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
            url="pc/risk/billRiskMain/whiteRollManage/riskBillWhiteRollShow/func_queryRiskBillPassWhite"
            :bindForm="formItem"
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
    <!--excel导出-->
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="tempShowExcelTemplateWin=false"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
    import {formatNumber, getDictListByGroups, getDictValueFromMap, post,getBusinessParameter } from "@/api/bizApi/commonUtil";

    export default {
        name: "riskBillWhiteRollShow",
        data(){
            return {
                tempShowExcelTemplateWin:false,
                downLoadUrl : "pc/risk/billRiskMain/whiteRollManage/riskBillWhiteRollMain/func_exportBillRiskWhiteExcel",
                param : '',
                rows : null,
                ifShowMore : false,
                dictMap : new Map(),
                operStatusList:[],
                operTypeList : [],
                formItem : {
                    custName : "",
                },
                columns : [
                    {
                        type: "selection",
                        width: 60,
                        key: "multiSelect",
                        align: "center",
                    },
                    {
                        type: 'index',
                        key: 'numOrder',
                        title: this.$t("m.i.common.index"),
                        width: 60,
                        align: 'center',
                    },
                    {
                        title: this.$t("m.i.common.custName"),
                        key: 'custName',
                        sortable: true,
                    },
                    {
                        title: this.$t("m.i.pc.createUser"),
                        key: 'createTellerNo',
                        sortable: true,
                    },
                    {
                        title: this.$t("m.i.common.createTime"),
                        key: 'createTime',
                        sortable: true,
                        render: (h, params) => {
                            if (params.row.createTime == null || params.row.createTime === "") {
                                return "";
                            }
                            let date = params.row.createTime.toString().substring(0,8);
                            let time = params.row.createTime.toString().substring(8,14);
                            let createTime =this.$moment(date, "YYYY-MM-DD").format("YYYY-MM-DD")+" "+this.$moment(time, "HH:mm:ss").format("HH:mm:ss");
                            return h("span", createTime);
                        }
                    },
                    {
                        title: this.$t("m.i.pc.newUpdateTime"),
                        key: 'updateTime',
                        sortable: true,
                        render: (h, params) => {
                            if (params.row.updateTime == null || params.row.updateTime === "") {
                                return "";
                            }
                            let date = params.row.updateTime.toString().substring(0,8);
                            let time = params.row.updateTime.toString().substring(8,14);
                            let updateTime = this.$moment(date, "YYYY-MM-DD").format("YYYY-MM-DD")+" "+this.$moment(time, "HH:mm:ss").format("HH:mm:ss");
                            return h("span", updateTime);
                        }
                    },
                ],
            }
        },
        methods : {
            formSearch() {
                this.$refs.datagrid.selects = [];
                this.$refs.datagrid.dataChange(1);
            },
            formSearchReset() {
                this.$refs.datagrid.selects = [];
                this.$refs.formItem.resetFields();
            },
            //excel导出
            excelExport(){
                this.param = 'billRiskWhiteInfoExport';
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
                let url = window.LOCAL_CONFIG.API_HOME + this.downLoadUrl;
                if(exportType === "1"){
                    let params = null;
                    if (this.$refs.datagrid.selectIds.length !== 0) {
                        params = { ids: this.$refs.datagrid.selectIds, field: field, exportType: exportType, excelName: this.param};
                    }else {
                        params = {custName : this.formItem.custName,field: field, exportType: exportType, excelName: this.param};
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
                    let form = document.createElement("form");
                    form.setAttribute("id", "formId");
                    form.setAttribute("action", url);
                    form.setAttribute("method", "post");
                    if (this.$refs.datagrid.selectIds.length !== 0) {
                        let input1 = document.createElement('input');
                        input1.type = 'text';
                        input1.name = 'ids';
                        input1.value = this.$refs.datagrid.selectIds;
                        form.appendChild(input1);
                    } else {
                        let input1 = document.createElement('input');
                        input1.type = 'text';
                        input1.name = "custName";
                        input1.value = this.formItem.custName;
                        form.appendChild(input1);
                    }
                    let input2 = document.createElement('input');
                    input2.type = 'text';
                    input2.name = 'field';
                    input2.value = field;
                    form.appendChild(input2);
                    let input3 = document.createElement('input');
                    input3.type = 'text';
                    input3.name = 'exportType';
                    input3.value = exportType;
                    form.appendChild(input3);
                    let input4 = document.createElement('input');
                    input4.type = 'text';
                    input4.name = 'excelName';
                    input4.value = this.param;
                    form.appendChild(input4);

                    document.body.appendChild(form);
                    form.submit();
                    document.body.removeChild(form);
                }
            },
        },
        mounted() {
            this.getDictListByGroups("OperStatusCode,OperTypeCode").then(res => {
                this.operStatusList = res.get("OperStatusCode");
                this.operTypeList = res.get("OperTypeCode");
                this.dictMap = res.get("map");
            });
        }
    }
</script>

<style scoped>

</style>
