<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--<h-form-item prop="acptSettleRgstBrchNo" :label="$t('m.i.ce.acptSettleRgstBrchNo')">
                  <select-branch v-model="formItem.acptSettleRgstBrchNo" :textShow="'name'" :showMsg="formItem.acptSettleRgstBrchName"
                                 :brchNo.sync="formItem.acptSettleRgstBrchNo"
                                 :brchName.sync="formItem.acptSettleRgstBrchName"></select-branch>
                </h-form-item>-->
                <show-branch v-model="formItem.acptSettleRgstBrchNo" :label="$t('m.i.ce.acptSettleRgstBrchNo')" prop="acptSettleRgstBrchNo" title="机构名称"
                             :showCheckBox="false" :brchNo.sync="formItem.acptSettleRgstBrchNo" :brchName.sync="formItem.acptSettleRgstBrchName">
                </show-branch>
                <h-form-item prop="reverseBillNo" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="formItem.reverseBillNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billMoney')">
                  <h-row>
                    <h-col span="11">
                      <h-typefield v-model="formItem.minBillMoney" integerNum="10" placeholder="" type="money"
                                   bigTips></h-typefield>
                    </h-col>
                    <h-col span="2" style="text-align: center">至</h-col>
                    <h-col span="11">
                      <h-typefield v-model="formItem.maxBillMoney" integerNum="10" placeholder="" type="money"
                                   bigTips></h-typefield>
                    </h-col>
                  </h-row>
                </h-form-item>
                <h-form-item prop="acptSettleRgstDtRange" :label="$t('m.i.ce.acptSettleRgstDtRange')">
                  <h-date-picker type="daterange" v-model="formItem.acptSettleRgstDtRange" format="yyyy-MM-dd" showFormat :editable=false placeholder="" @on-change="handleAcptSettleRgstDtChange"></h-date-picker>
                </h-form-item>
                <h-form-item prop="dueDtRange" :label="$t('m.i.billInfo.dueDt')">
                  <h-date-picker type="daterange" v-model="formItem.dueDtRange" format="yyyy-MM-dd" showFormat :editable=false placeholder="" @on-change="handleDueDtChange"></h-date-picker>
                </h-form-item>
                <h-form-item prop="acptBankNo" :label="$t('m.i.billInfo.acptBankNo')" class="h-form-long-label">
                  <select-branch v-model="formItem.acptBankNo" :textShow="'bankNo'" :showMsg="formItem.acptBankNo"
                                 :bankNo.sync="formItem.acptBankNo"
                                 :brchName.sync="formItem.acptBankName"></select-branch>
                </h-form-item>
                <h-form-item prop="acptSettleRgstStatus" :label="$t('m.i.common.acptRgstStatus')">
                  <h-select v-model="formItem.acptSettleRgstStatus" placeholder="" showTitle>
                    <h-option v-for="item in acptRgstStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                      url="/ce/acpt/outerBusiBill/busiPaymentDue/busiAcptSettleRegisterTrackSearch/func_pageQueryAcptCorpList"
                      :bindForm="formItem"
                      :has-select="false"
                      :row-select="true"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="exportData" >{{$t('m.i.common.export')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>

    <!-- 明细导出 -->
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
import {formatNumber, getDictListByGroups, getDictValueFromMap, post} from "@/api/bizApi/commonUtil";

export default {
    name: "busiAcptSettleRegisterTrackSearch",
    components : {
    },
    data() {

      return {
        tempShowExcelTemplateWin: false,
        param: null,
        rows: null,
        formItem: {
          ids:'',
          billNoLike: '',
          acptDt: '',
          acptSettleRgstStatusList: 'BTA01,BTA02,BTA03,BTA04,BTA05,BTA06,BTA08,BTA09,BTA10',
          acptSettleRgstStatus : '',
          acptBankNo : '',
          acptSettleRgstDtRange : [],
          dueDtRange : [],
          minBillMoney : '',
          maxBillMoney : '',
          drwrName : '',
          acptSettleRgstBrchNo : JSON.parse(window.sessionStorage.getItem("userInfo")).brchNo,
          acptSettleRgstBrchName : JSON.parse(window.sessionStorage.getItem("userInfo")).brchName,
          reverseBillNo: ''
        },
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            key:"duoxuan",

            hiddenCol: false
          },
          {
            type: 'index',
            key: 'numOrder',
            title: this.$t("m.i.common.index"),
            width: 60,
            align: 'center',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.acptRgstBrchName"),
            key: 'acptSettleRgstBrchName',
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.acptRgstDt"),
            key: 'acptSettleRgstDt',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.acptSettleRgstDt == null || params.row.acptSettleRgstDt === ""){
                return "";
              }
              let acptSettleRgstDt = this.$moment(params.row.acptSettleRgstDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", acptSettleRgstDt);
            },
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: 'billType',

            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: 'billNo',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('a', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.showBillInfo(params.row.billId)
                    }
                  }
                }, params.row.billNo)
              ]);
            }
          },
          {
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
            key: 'billMoney',
            sortable: true,
            hiddenCol: false,
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
             title: this.$t("m.i.billInfo.drweBankNo"),
            key: 'acptBankNo',

            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.paymentDt"),
            key: 'paymentDt',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.paymentDt == null || params.row.paymentDt === ""){
                return "";
              }
              let paymentDt = this.$moment(params.row.paymentDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", paymentDt);
            },
          },
          {
            title: this.$t("m.i.billInfo.hldrName"),
            key: 'hldrName',
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.hldrAcctNo"),
            key: 'hldrAcctNo',

            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.hldrBankNo"),
            key: 'hldrBankNo',

            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.hldrSocCode"),
            key: 'hldrSocCode',

            hiddenCol: false
          },
          {
          title: this.$t("m.i.ce.entrustBankNo"),
            key: 'prsttnBankNo',

            hiddenCol: false
          },
          {
           title: this.$t("m.i.common.acptRgstStatus"),
            key: 'acptSettleRgstStatus',

            hiddenCol: false,
            render: (h, params) => {
              let key = "";
              let dictValue = getDictValueFromMap(this.dictMap,"AcptRgstStatus",params.row.acptSettleRgstStatus);
              return h("span", {domProps: {title: dictValue}}, dictValue);

            }
          },
          {
             title: this.$t("m.i.common.failReason"),
            key: 'acptSettleErrorReason',

            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.applTellerName"),
            key: 'acptSettleApplTellerName',

            hiddenCol: false
          }
        ],
        dictMap: new Map(),
        currentSelectRow: [],
        currentSelectList: [],
        //是否显示更多查询项
        ifShowMore: false,
        acptRgstStatusList: [],
        billId: '',
        showBillInfoWin: false
      }
    },
    mounted() {
      getDictListByGroups("CorpScale,Yon,Province,Industry,ImgMainStatus,DraftTypeCode,AcptRgstStatus").then(res => {
        this.acptRgstStatusList = res.get("AcptRgstStatus");
        this.acptRgstStatusList = this.acptRgstStatusList.filter(item => item.key !== "BTA07" &&item.key !== "BTA11" &&item.key !== "BTA14" &&item.key !== "BTA15"  &&item.key !== "BTA16"&&item.key !== "BTA17" );
        // 不需要这个，因为可选择的发起方，全部默认为企业
        this.dictMap = res.get("map");
      });
    },
    methods: {
      //表单查询
      handleSearch() {
        this.$refs.datagrid.dataChange(1);
        this.$refs.datagrid.selects = [];
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.drwrCustNo = '';
        this.formItem.maxBillMoney = '';
        this.formItem.minBillMoney = '';
        this.formItem.acptSettleRgstStatus = '';
        this.formItem.acptSettleRgstBrchNo = JSON.parse(window.sessionStorage.getItem("userInfo")).brchNo;
        this.formItem.acptSettleRgstBrchName = JSON.parse(window.sessionStorage.getItem("userInfo")).brchName;
      },
      //行选中
      handleRowClick(arr) {
        this.currentSelectRow = arr[0];
      },
      handleSelectClick(arr) {
        this.currentSelectList = arr;
      },

      handleAcptSettleRgstDtChange(arr) {

      },
      handleDueDtChange(arr) {

      },
      //导出
      exportData() {
        this.param = "outerBusiAptSettleRgstTrackSearchExportInfo";
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
        if (exportType === "1") {
          let url = window.LOCAL_CONFIG.API_HOME + "/ce/acpt/outerBusiBill/busiPaymentDue/busiAcptSettleRegisterTrackSearch/func_exportDataForOuterBusiSettle";
          let params = null;
          if (this.$refs.datagrid.selectIds.length !== 0) {
            params = {
              ids: this.$refs.datagrid.selectIds,
              field: field,
              exportType: exportType,
              excelName: this.param
            };
          } else {
            params = {
              acptSettleRgstBrchNo: this.formItem.acptSettleRgstBrchNo,
              acptSettleRgstBrchName: this.formItem.acptSettleRgstBrchName,
              minBillMoney: this.formItem.minBillMoney,
              maxBillMoney: this.formItem.maxBillMoney,
              billNoLike: this.formItem.billNoLike,
              acptSettleRgstDtRange: this.formItem.acptSettleRgstDtRange,
              dueDtRange: this.formItem.dueDtRange,
              acptBankNo: this.formItem.acptBankNo,
              acptBankName: this.formItem.acptBankName,
              acptSettleRgstStatus: this.formItem.acptSettleRgstStatus,
              acptSettleRgstStatusList: this.formItem.acptSettleRgstStatusList,
              field: field,
              exportType: exportType,
              excelName: this.param
            };
          }
          post(params, url).then(res => {
            if (res.status === 200 && res.data === null) {
              this.$msgTip.info(this, { info: "异步导出成功，请进入公共管理》导出下载页面，进行下载" });
            } else if (res.status === 200 && res.data === "") {
              this.$msgTip.info(this, { info: "异步导出成功，请进入公共管理》导出下载页面，进行下载" });
            } else {
              this.$msgTip.error(this, { info: "异步导出失败" });
            }
          });
        } else {
          if (this.$refs.datagrid.selectIds.length !== 0) {
            let url = window.LOCAL_CONFIG.API_HOME + "/ce/acpt/outerBusiBill/busiPaymentDue/busiAcptSettleRegisterTrackSearch/func_exportDataForOuterBusiSettle";
            let form = document.createElement("form");
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");

            let input1 = document.createElement("input");
            input1.type = "text";
            input1.name = "ids";
            input1.value = this.$refs.datagrid.selectIds;
            form.appendChild(input1);
            let input2 = document.createElement("input");
            input2.type = "text";
            input2.name = "field";
            input2.value = field;
            form.appendChild(input2);
            let input3 = document.createElement("input");
            input3.type = "text";
            input3.name = "exportType";
            input3.value = exportType;
            form.appendChild(input3);
            let input4 = document.createElement("input");
            input4.type = "text";
            input4.name = "excelName";
            input4.value = this.param;
            form.appendChild(input4);

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          } else {
            let url = window.LOCAL_CONFIG.API_HOME + "/ce/acpt/outerBusiBill/busiPaymentDue/busiAcptSettleRegisterTrackSearch/func_exportDataForOuterBusiSettle";
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

      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(billId){
        this.billId = billId;
        this.showBillInfoWin = true;
      }

    }
  };
</script>

<style scoped>

</style>
