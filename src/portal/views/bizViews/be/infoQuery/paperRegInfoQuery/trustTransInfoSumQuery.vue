<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.applDt')" prop="applDt">
                  <h-date-picker :value="applDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleApplDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <!--  <h-form-item :label="$t('m.i.be.brchName')" prop="brchName">
                    <h-input v-model="formItem.brchName" icon="android-search" @on-click="brchNoWinOpen"
                             readonly clearable @on-clear="clearVal()" :title="formItem.brchName"></h-input>
                  </h-form-item>-->
                <show-branch v-model="formItem.brchName" :label="$t('m.i.be.brchName')" prop="brchNos"
                             title="机构名称" :showCheckBox="true" :brchNo.sync="formItem.brchNos" :brchName.sync="formItem.brchName"></show-branch>

                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="" showTitle>
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.settleBusiType')" prop="busiTypeList">
                  <h-select v-model="formItem.busiTypeList" placeholder="" multiple showTitle>
                    <h-option value="CPR01">质押</h-option>
                    <h-option value="CPR02">解质押</h-option>
                    <h-option value="CPR03">保证</h-option>
                    <h-option value="CPR04">提示付款</h-option>
                    <h-option value="CPR05">追索</h-option>
                    <!--<h-option value="CPR06">线下追偿结清</h-option>-->
                    <!--<h-option value="CPR07">线下追偿登记</h-option>-->
                    <h-option value="CPR08">非交易过户</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.trDir')" prop="trDir">
                  <h-select v-model="formItem.trDir" placeholder=""  showTitle>
                    <h-option value="IM01">申请方</h-option>
                    <h-option value="IM02">签收方</h-option>
                  </h-select>
                </h-form-item>
                <!--<h-form-item :label="$t('m.i.be.billStatus')" prop="busiStatusList">-->
                <!--<h-select v-model="formItem.busiStatusList" placeholder="" multiple showTitle>-->
                <!--<h-option v-for="item in barterTrustStatusList" :value="item.key" :key="item.key">{{ item.value }}</h-option>-->
                <!--</h-select>-->
                <!--</h-form-item>-->
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                                                   :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlightRow
            :row-select="true"
            url="be/infoQuery/paperRegInfoQuery/trustTransInfoSumQuery/func_queryTrustSumInfo"
            :bindForm="formItem"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen()">{{$t('m.i.common.exportExcel')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--<show-branch :showBranchWin="brchNoWin" title="机构名称" @brchNoChange="brchNoChange" :ifcheck="false"
                 :checkStrictly="true" @showBranchWinClose="brchNoWinClose"></show-branch>-->
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
import { post, on, off, formatNumber } from "@/api/bizApi/commonUtil";
export default {
  name: "trustTransInfoSumQuery",
  data(){
    return {
      ifShowMore :false,
      formItem : {
        brchNo : "",
        brchNos : "",
        brchName : "",
        minApplDt : "",
        maxApplDt : "",
        billType : "",
        busiTypeList : [],
        trDir : "",
        busiStatusList : []
      },
      applDt : [],
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
          width:60,
          align: 'center'
        },
        {
          title: this.$t("m.i.common.settleBusiType"),
          key: "busiType",
          sortable: true,
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.formatBusiType(params.row.busiType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.be.trDir"),
          key: "trDir",
          sortable: true,
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = "";
            if(params.row.trDir === "IM01"){
              dictValue = "申请方";
            }else if(params.row.trDir === "IM02"){
              dictValue = "签收方";
            }
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        // {
        //   title: this.$t("m.i.be.billStatus"),
        //   key: "busiStatus",
        //   width: 200,
        //   sortable: true,
        //   hiddenCol: false,
        //   render: (h, params) => {
        //     let dictValue = this.getDictValueFromMap(this.dictMap, "BarterTrustStatus", params.row.busiStatus);
        //     return h("span", {
        //       domProps: {
        //         title: dictValue
        //       }
        //     }, dictValue);
        //   }
        // },
        {
          title: this.$t('m.i.be.count'),
          key: "sumCount",
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.be.sumMoney'),
          key: "sumMoney",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h('p', formatNumber(params.row.sumMoney, 2, ','))
          },
        }
      ],
      //brchNoWin : false,
      tempShowExcelTemplateWin : false,
      param : null,
      rows : null,
      dictMap : new Map(),
      billTypeList : [],
      barterTrustStatusList : []
    }
  },
  components: {
    //ShowBranch: () => import(/* webpackChunkName: "sm/auth/branch/showBranch" */`@/views/bizViews/sm/auth/branch/showBranch`)
  },
  created() {
    this.initData();
  },
  methods: {

    initData(){
      let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
      this.formItem.brchNos = userInfo.brchNo;
      this.formItem.brchName = userInfo.brchName;
      this.formItem.minApplDt = window.sessionStorage.getItem("workDate");
      this.formItem.maxApplDt = window.sessionStorage.getItem("workDate");
      let minApplDt =  this.formItem.minApplDt.substring(0,4)+"-"+ this.formItem.minApplDt.substring(4,6)+"-"+ this.formItem.minApplDt.substring(6,8);
      let maxApplDt =  this.formItem.maxApplDt.substring(0,4)+"-"+ this.formItem.maxApplDt.substring(4,6)+"-"+ this.formItem.maxApplDt.substring(6,8);
      this.applDt = [];
      this.applDt.push(minApplDt,maxApplDt);
    },
    formSearch() {
      this.$refs.datagrid.selects = [];
      this.$refs.datagrid.dataChange(1);
    },
    formSearchReset() {
      let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
      this.formItem.brchNos = userInfo.brchNo;
      this.formItem.brchName = userInfo.brchName;
      this.formItem.busiTypeList = [];
      this.formItem.busiStatusList = [];
      this.formItem.billType = "";
      this.formItem.maxApplDt = "";
      this.formItem.minApplDt = "";
      this.formItem.trDir = "";
      this.initData();
    },
    /* brchNoChange(info) {
       this.formItem.brchNo = info[0].id;
       this.formItem.brchName = info[0].title;
       this.brchNoWin = false;
     },
     brchNoWinOpen() {
       this.brchNoWin = true;
     },
     brchNoWinClose() {
       this.brchNoWin = false;
     },*/
    showExcelTemplateWinClose() {
      this.tempShowExcelTemplateWin = false;
    },
    tempShowExcelTemplateWinOpen() {
      this.param = "trustTransInfoSumExport";
      this.rows = this.$refs.datagrid.total;
      this.tempShowExcelTemplateWin = true;
    },
    //清单导出
    exportList(field, exportType) {
      //exportType: 0-同步 1-异步
      if (exportType === "1") {
        let url = window.LOCAL_CONFIG.API_HOME + "/be/infoQuery/paperRegInfoQuery/trustTransInfoSumQuery/func_exportData";
        let pageSize = this.$refs.datagrid.total;
        if (this.$refs.datagrid.total == 0) {
          pageSize = 1;
        }
        let params = null;
        params = {
          ids:this.$refs.datagrid.selectIds,maxApplDt: this.formItem.maxApplDt, minApplDt: this.formItem.minApplDt,trDir : this.formItem.trDir,
          brchNos : this.formItem.brchNos, busiTypeList: this.formItem.busiTypeList,billType: this.formItem.billType,
          busiStatusList: this.formItem.busiStatusList,field: field, exportType: exportType, excelName: this.param, pageSize: pageSize
        };
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
        let url = window.LOCAL_CONFIG.API_HOME + "/be/infoQuery/paperRegInfoQuery/trustTransInfoSumQuery/func_exportData";
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
        if (this.$refs.datagrid.selectIds.length !== 0) {
          let input = document.createElement('input');
          input.type = 'text';
          input.name = 'ids';
          input.value = this.$refs.datagrid.selectIds;
          form.appendChild(input)
        }
        let input1 = document.createElement("input");
        input1.type = "text";
        input1.name = "field";
        input1.value = field;
        form.appendChild(input1);
        let input2 = document.createElement("input");
        input2.type = "text";
        input2.name = "exportType";
        input2.value = exportType;
        form.appendChild(input2);
        let input3 = document.createElement("input");
        input3.type = "text";
        input3.name = "excelName";
        input3.value = this.param;
        form.appendChild(input3);

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      }
    },

    formatBusiType(value) {
      if (value != null && value !== "") {
        switch (value) {
          case 'CPR01':
            return '质押';
          case 'CPR02':
            return '解质押';
          case 'CPR03':
            return '保证';
          case 'CPR04':
            return '提示付款';
          case 'CPR05':
            return '追索';
          case 'CPR06':
            return '线下追偿结清';
          case 'CPR07':
            return '线下追偿登记';
          case 'CPR08':
            return '非交易过户';
        }
      } else {
        return "";
      }
    },
    handleApplDtChange(arr) {
      if(arr && arr.length === 2){
        this.formItem.minApplDt = arr[0].replace(/-/g, "");
        this.formItem.maxApplDt = arr[1].replace(/-/g, "");
        this.applDt = [arr[0], arr[1]];
      }else{
        this.formItem.minApplDt = "";
        this.formItem.maxApplDt = "";
        this.applDt = [];
      }
    },
  },
  mounted() {
    this.getDictListByGroups("DraftTypeCode,BarterTrustStatus").then(res => {
      this.billTypeList = res.get("DraftTypeCode");
      this.barterTrustStatusList = res.get("BarterTrustStatus");
      this.dictMap = res.get("map");
    });
  }
}
</script>

<style scoped>

</style>
