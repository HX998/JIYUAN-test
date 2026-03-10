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
                    <h-date-picker type="month" v-model="formItem.chargeMonth" format="yyyy-MM" :clearable="false"
                                   showFormat placeholder="" @on-change="handleChargeMonthChange"></h-date-picker>
                  </h-form-item>

                  <show-branch v-model="formItem.branchNos" :label="$t('m.i.common.brchName')" prop="branchName"
                               title="机构名称" :brchNo.sync="formItem.branchNos" :brchName.sync="formItem.branchName">
                  </show-branch>

                  <h-form-item :label="$t('m.i.shcpe.superFeeBusiType')" prop="superFeeBusiType" label-width="120">
                    <h-select v-model="formItem.superFeeBusiType" placeholder="" showTitle @on-change="changeSuperFeeBusiType">
                      <h-option  value="1">交易手续费</h-option>
                      <h-option  value="2">结算过户费</h-option>
                      <h-option  value="3">其他结算费</h-option>
                      <h-option  value="4">账户维护费</h-option>
                    </h-select>
                  </h-form-item>

                  <h-form-item :label="$t('m.i.shcpe.feeBusiTypeTwo')" prop="feeBusiType" v-if="isShow1" label-width="120">
                    <h-select v-model="formItem.feeBusiType" placeholder="" showTitle>
                      <h-option  value="FPP001">交易手续费-转贴现</h-option>
                      <h-option  value="FPP002">交易手续费-质押式回购(7天(含)内)</h-option>
                      <h-option  value="FPP003">交易手续费-质押式回购(其他期限)</h-option>
                      <h-option  value="FPP004">交易手续费-买断式回购(7天(含)内)</h-option>
                      <h-option  value="FPP005">交易手续费-买断式回购(其他期限)</h-option>
                    </h-select>
                  </h-form-item>

                  <h-form-item :label="$t('m.i.shcpe.feeBusiTypeTwo')" prop="feeBusiType" v-if="isShow2" label-width="120">
                    <h-select v-model="formItem.feeBusiType" placeholder="" showTitle>
                      <h-option  value="FPP006">结算过户费-转贴现(纯票过户)</h-option>
                      <h-option  value="FPP007">结算过户费-转贴现(票款对付)</h-option>
                      <h-option  value="FPP008">结算过户费-质押式回购(纯票过户)</h-option>
                      <h-option  value="FPP009">结算过户费-质押式回购(票款对付)</h-option>
                      <h-option  value="FPP010">结算过户费-买断式回购(纯票过户)</h-option>
                      <h-option  value="FPP011">结算过户费-买断式回购(票款对付)</h-option>
                      <h-option  value="FPP012">结算过户费-跨机构权属登记</h-option>
                      <h-option  value="FPP013">结算过户费-已贴现票据质押</h-option>
                      <h-option  value="FPP014">结算过户费-非交易过户</h-option>
                      <h-option  value="FPP015">结算过户费-提前回购、逾期回购</h-option>
                      <h-option  value="FPP016">结算过户费-已贴现票据托收</h-option>
                      <h-option  value="FPP017">结算过户费-追偿结算</h-option>
                      <h-option  value="FPP018">结算过户费-票交所资金账户扣划</h-option>
                      <h-option  value="FPP019">结算过户费-信息更正</h-option>
                    </h-select>
                  </h-form-item>

                  <h-form-item :label="$t('m.i.shcpe.feeBusiTypeTwo')" prop="feeBusiType" v-if="isShow3" label-width="120">
                    <h-select v-model="formItem.feeBusiType" placeholder="" showTitle>
                      <h-option  value="FPP020">其他结算费-未贴现票据背书转让</h-option>
                      <h-option  value="FPP021">其他结算费-未贴现票据托收</h-option>
                    </h-select>
                  </h-form-item>

                  <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
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
            url="/shcpe/cpes/feeData/queryFeeBaseData"
            :bindForm="formItem"
            ref="datagrid">
            <div slot="toolbar" class='pull-left'>
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen()">清单导出</h-button>
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
    name: "feeBaseData",
    components: {

    },
    data() {
      return {
        isShow1:false,
        isShow2:false,
        isShow3:false,
        ifShowMore : false,
        tempShowExcelTemplateWin : false,
        param : null,
        rows : null,
        dictMap : new Map(),
        formItem : {
          chargeMonth:"",
          branchNos:"",
          branchName:"",
          superFeeBusiType:"",
          feeBusiType:""
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
            title:this.$t("m.i.shcpe.calFeeDate"),
            key: "calFeeDate",
            hiddenCol:false,
            sortable: true,
            render: (h, params) => {
              if(params.row.calFeeDate == null || params.row.calFeeDate === ""){
                return "-";
              }
              let date = this.$moment(params.row.calFeeDate, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
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
            title: this.$t("m.i.shcpe.feeBusiType"),
            key: "feeBusiType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "FeeBusiType", params.row.feeBusiType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.shcpe.calFeeBase"),
            key: "calFeeBase",
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.calFeeBase==='CT0001') return h('span','固定')
              else if(params.row.calFeeBase==='CT0002') return h('span','票面总额')
              else if(params.row.calFeeBase==='CT0003') return h('span','户')
              else if(params.row.calFeeBase==='CT0004') return h('span','笔')
              else if(params.row.calFeeBase==='CT0005') return h('span','张')
              else if(params.row.calFeeBase==='CT0006') return h('span','背书次数')
              else if(params.row.calFeeBase==='CT0007') return h('span','回购金额')
            }
          },
          {
            title: this.$t("m.i.shcpe.calFeeBaseValue"),
            key: "calFeeBaseValue",
            hiddenCol: false
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
      changeSuperFeeBusiType(){
        this.ifShowMore = true;
        this.isShow1 = false;
        this.isShow2 = false;
        this.isShow3 = false;
         if(this.formItem.superFeeBusiType === "1"){
           this.isShow1 = true;
         }else if(this.formItem.superFeeBusiType === "2"){
           this.isShow2 = true;
         }else if(this.formItem.superFeeBusiType === "3"){
           this.isShow3 = true;
         }else if(this.formItem.superFeeBusiType === "4"){
           this.isShow1 = false;
           this.isShow2 = false;
           this.isShow3 = false;
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
        let workDate = JSON.parse(window.sessionStorage.getItem('workDate'));
        this.formItem.branchNos = userInfo.brchNo;
        this.formItem.branchName = userInfo.brchName;
        this.formItem.chargeMonth = workDate.toString().substring(0,6);
        this.$refs.formItem.resetFields();
      },
      getDataTotal() {
        let url = "/shcpe/cpes/feeData/querySumFeeBaseData";
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
      //获取导出模板
      tempShowExcelTemplateWinOpen() {
        this.param = 'feeBillBaseDataExportInfo';
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
          let url = window.LOCAL_CONFIG.API_HOME + "/shcpe/cpes/feeData/exportFeeBaseData";
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
              superFeeBusiType:this.formItem.superFeeBusiType,
              feeBusiType:this.formItem.feeBusiType,
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
            let url = window.LOCAL_CONFIG.API_HOME + "/shcpe/cpes/feeData/exportFeeBaseData";
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
            let url = window.LOCAL_CONFIG.API_HOME + "/shcpe/cpes/feeData/exportFeeBaseData";
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
      let workDate = JSON.parse(window.sessionStorage.getItem('workDate'));
      this.formItem.branchNos = userInfo.brchNo;
      this.formItem.branchName = userInfo.brchName;
      this.formItem.chargeMonth = workDate.toString().substring(0,6);
    },
    mounted() {
      this.getDataTotal();
      this.getDictListByGroups("FeeBusiType").then(res => {
        this.dictMap = res.get("map");
      });
    }
  }
</script>

<style scoped>

</style>
