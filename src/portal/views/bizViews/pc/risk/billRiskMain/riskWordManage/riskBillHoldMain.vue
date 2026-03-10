<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="100" ref="formItem" cols="4" class="h-form-search">
                <!--票据来源-->
                <common-select v-model="formItem.billOrigin" :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                               :dictList="billOriginList"></common-select>
                <!--票据(包)号码-->
                <bill-no v-model="formItem.billNoLike" prop="billNoLike" :label="$t('m.i.billInfo.billPackageNo')"></bill-no>
                <!--子票区间-->
                <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                <show-branch v-model="formItem.brchNo" :label="$t('m.i.pc.kcBrch')" prop="brchNo"
                             title="机构名称" :brchNo.sync="formItem.brchNo" :brchName.sync="formItem.brchName" :showCheckBox="false">
                </show-branch>
                <query-btn :advanceShow='true' @showChange="showChange" :formSearch='formSearch' :formSearchReset='formSearchReset'></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="pc/risk/billRiskMain/riskWordManage/riskBillHoldMain/func_queryRiskBillHold"
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
    <!-- excel导出-->
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="tempShowExcelTemplateWin=false"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>
    <!-- 查看票面 -->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billRangeEnd = "this.billRangeEnd" :billRangeStart = "this.billRangeStart"
                    :billId="this.billId"></bill-info-main>
  </div>
</template>

<script>
    import {formatNumber, formatBillRange, getDictValueFromMap, post,getBusinessParameter } from "@/api/bizApi/commonUtil";

    export default {
        name: "riskBillHoldMain",
        components : {

        },
        data(){
            return{
                downLoadUrl : "/pc/risk/billRiskMain/riskWordManage/riskBillHoldMain/func_exportRiskBIllExcel",
                param : '',
                rows : null,
                ifShowMore : false,
                tempShowExcelTemplateWin :false,
                dictMap : new Map(),
                brchNo : "",
                showBillInfoWin: false,
                billId: '',
                billNo: '',
                maxBillRangeEnd : "",
                billRangeEnd:"",
                billOriginList:[],
                formItem : {
                    billNoLike: "",
                    billOrigin:"",
                    minBillRangeStart:"",
                    maxBillRangeEnd : "",
                    brchNo : '',
                    brchName: ""
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
                    title: this.$t("m.i.billInfo.billOrigin"),
                    align:'center',
                    hiddenCol: false,
                    render:(h,params) => {
                      let dictValue = getDictValueFromMap(this.dictMap,"BillOrigin",params.row.billOrigin);
                      return h("span", {
                        domProps: {
                          title: dictValue
                        }
                      }, dictValue);
                    }
                  },
                  {
                    title: this.$t("m.i.billInfo.billPackageNo"),
                    key: "billNo",
                    sortable: true,
                    hiddenCol: false,
                    render: (h, params) => {
                      return h("a", {
                        on: {
                          click: () => {
                            this.showBillInfo(params.row);
                          }
                        }
                      }, params.row.billNo);
                    }
                  },
                  {
                    title: this.$t("m.i.billInfo.billRange"),
                    align:'center',
                    key:"billRange",
                    hiddenCol: false,
                    render:(h,params) => {
                      let billOrigin = params.row.billOrigin;
                      let billRangeStart = params.row.billRangeStart;
                      let billRangeEnd = params.row.billRangeEnd;
                      return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
                    }
                  },
                    {
                        title: this.$t("m.i.billInfo.billType"),
                        key: "billType",
                        hiddenCol: false,
                        render: (h, params) => {
                            let dictValue = getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
                            return h("span", {
                                domProps: {
                                    title: dictValue
                                }
                            }, dictValue);
                        }
                    },
                    {
                        title: this.$t("m.i.billInfo.drwrName"),
                        key: 'drwrName',
                        sortable: true,
                        hiddenCol: false,
                    },
                    {
                        title: this.$t("m.i.billInfo.acptName"),
                        key: 'acptName',
                        hiddenCol: false,
                        sortable: true,
                    },
                  {
                    title: this.$t('m.i.billInfo.pyeeName'),
                    key: "pyeeName",
                    sortable: true,
                    hiddenCol: false
                  },
                    {
                        title: this.$t("m.i.billInfo.remitDt"),
                        key: "remitDt",
                        ellipsis: false,
                        hiddenCol: false,
                        sortable: true,
                        render: (h, params) => {
                            if (params.row.remitDt == null || params.row.remitDt === "") {
                                return "";
                            }
                            let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                            return h("span", date);
                        }
                    },
                    {
                        title: this.$t("m.i.billInfo.dueDt"),
                        key: "dueDt",
                        hiddenCol: false,
                        sortable: true,
                        render: (h, params) => {
                            if (params.row.dueDt == null || params.row.dueDt === "") {
                                return "";
                            }
                            let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                            return h("span", date);
                        }
                    },
                  {
                    title: this.$t("m.i.billInfo.billPackageMoney"),
                    key: "billMoney",
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
                        title: this.$t("m.i.pc.kcBrch"),
                        key:"hldrBrchName",
                        hiddenCol: false,
                        sortable: true,
                    },
                    {
                        title: this.$t("m.i.pc.holdBillDt"),
                        key: "transDt",
                        hiddenCol: false,
                        sortable: true,
                        render: (h, params) => {
                            if (params.row.transDt == null || params.row.transDt === "") {
                                return "";
                            }
                            let date = this.$moment(params.row.transDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                            return h("span", date);
                        }
                    },
                    {
                        title: this.$t("m.i.pc.riskDescription"),
                        key:"riskRemark",
                        hiddenCol: false,
                    }
                ],
            }
        },
        methods : {
          showChange(val) {
            this.ifShowMore = val;
          },
            formSearch() {
                this.$refs.datagrid.selects = [];
                this.$refs.datagrid.selectIds = [];
                this.$refs.datagrid.dataChange(1);
            },
            formSearchReset() {
                this.$refs.datagrid.selects = [];
                this.$refs.datagrid.selectIds = [];
                this.$refs.formItem.resetFields();
                this.formItem.brchNo = "";
                this.formItem.brchName = "";
            },
          //票面信息
          showBillInfo(row) {
            this.billId = row.billId;
            this.billRangeStart=row.billRangeStart;
            this.billRangeEnd=row.billRangeEnd;
            this.showBillInfoWin = true;
          },
            billInfoWinClose() {
                this.showBillInfoWin = false;
            },
            //excel导出
            excelExport(){
                this.param = 'riskBillExport';
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
                        params = {billNo : this.formItem.billNo,brchNo : this.formItem.brchNo,
                          billNoLike: this.formItem.billNoLike,billOrigin: this.formItem.billOrigin,
                          minBillRangeStart: this.formItem.minBillRangeStart,maxBillRangeEnd : this.formItem.maxBillRangeEnd,
                          field: field, exportType: exportType, excelName: this.param};
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
                        for (let obj in this.formItem) {
                            if (this.formItem.hasOwnProperty(obj)) {
                                let input = document.createElement('input');
                                input.type = 'text';
                                input.name = obj;
                                input.value = this.formItem[obj];
                                form.appendChild(input)
                            }
                        }
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
                    this.$refs.datagrid.selects = [];
                    this.$refs.datagrid.selectIds = [];
                }
            },
        },
        mounted() {
            this.getDictListByGroups("DraftTypeCode,BillOrigin").then(res => {
                this.billOriginList = res.get("BillOrigin");
                this.dictMap = res.get("map");
            })
        }
    }
</script>

<style scoped>

</style>
