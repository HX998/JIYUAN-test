<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">

                <show-branch v-model="formItem.ownedBrchNames"  :label="$t('m.i.common.ownedBrchNo')"  prop="ownedBrchNames"
                             v-if="this.licenseFlag"    :showCheckBox="true"     :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames"
                             :params="{authPath:this.$route.path}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                             queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item :label="$t('m.i.common.busiType')" prop="busiType">
                  <h-select v-model="formItem.busiType" @on-change="busiTypeWinOpen" placeholder="" :clearable="false">
                    <h-option v-for="item in busiTypeList" :value="item.value" :key="item.value">{{ item.label }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNo">
                  <h-input v-model="formItem.billNo"></h-input>
                </h-form-item>
                <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                <h-form-item :label="$t('m.i.common.batchNo')" prop="busiBatchNo">
                  <h-input v-model="formItem.busiBatchNo"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.applDt')" prop="applDate">
                  <h-date-picker type="daterange" :value="applDate" placeholder="" format="yyyy-MM-dd"
                                 showFormat @on-change="handleApplDtChange"></h-date-picker>
                </h-form-item>

                <show-cpes-branch  :label="$t('m.i.be.sponsorBrchName')"
                                   :brchCode.sync="formItem.saleBrchCode"  :cpesBrchName.sync="formItem.saleBrchName"
                                   datagridUrl="/cpes/branch/queryBranchList" prop="saleBrchName"
                                   queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                <show-cpes-branch  :label="$t('m.i.be.receiverBrchName')"
                                   :brchCode.sync="formItem.buyBrchCode"  :cpesBrchName.sync="formItem.buyBrchName"
                                   datagridUrl="/cpes/branch/queryBranchList" prop="buyBrchName"
                                   queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                <h-form-item :label="$t('m.i.be.billStatus')" prop="transferStatus">
                  <h-select v-model="formItem.transferStatus" placeholder="">
                    <h-option v-for="item in transferStatusList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billPackageMoney')" class="h-form-long-label">
                  <h-row>
                    <h-col span="11">
                      <h-typefield v-model="formItem.minBillMoney" integerNum="10" placeholder="" type="money"
                                   bigTips></h-typefield>
                    </h-col>
                    <h-col span="2" style="text-align: center">-</h-col>
                    <h-col span="11">
                      <h-typefield v-model="formItem.maxBillMoney" integerNum="10" placeholder="" type="money"
                                   bigTips></h-typefield>
                    </h-col>
                  </h-row>
                </h-form-item>
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
            hasPage
            :url="datagridUrl"
            :bindForm="formItem"
            showListCkeckBox
            :hasSelect=false
            :rowSelect=true
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen()">{{$t('m.i.common.exportExcel')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="this.billId" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>

    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>

  </div>
</template>

<script>
  import { post, on, off, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "transferSaleTrackQuery",
    components: {
      //BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`),
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`),

    },
    data() {
      return {
        columns: [
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
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "ownedBrchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.busiType'),
            key: "busiType",
            hiddenCol: false,
            render: (h) => {
              return h("span", this.busiType === "1" ? "转让" : "受让");
            }
          },
          {
            title: this.$t('m.i.be.billStatus'),
            key: "transferStatus",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", this.getDictValueFromMap(this.dictMap, this.busiType === "2" ? "TransferRebuyBillStatus" : "TransferSaleBillStatus", params.row.transferStatus));
            }
          },
          {
            title: this.$t('m.i.common.acctStatus'),
            key: "acctStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "AcctFlag", params.row.acctStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.common.batchNo'),
            key: "busiBatchNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.billPackageNo'),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId, params.row.billRangeStart, params.row.billRangeEnd);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            key:"billRange",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.pageShowFormatBillRange(params.row.billRangeStart, params.row.billRangeEnd);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageMoney'),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("div", [
                h("span", formatNumber(params.row.billMoney, 2, ","))
              ]);
            }
          },
          {
            title: this.$t('m.i.be.sponsorBrchName'),
            key: "saleBrchName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.receiverBrchName'),
            key: "buyBrchName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.applDt'),
            key: "applDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.applDt == null ? "" : this.$moment(params.row.applDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.be.transferReason'),
            key: "transferReason",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.remark'),
            key: "respRemark",
            hiddenCol: false,
            render: (h, params) => {
              let date = "";
              if("CR00"=== params.row.respRemark){
                date="票据结清";
              }else if("CR01"=== params.row.respRemark){
                date="除权判决";
              }else if("CR02"=== params.row.respRemark){
                date="不应答清理";
              }else{
                date = params.row.respRemark;
              }
              return h("span", date);
            }
          }
        ],
        formItem: {
          ownedBrchName:"",
          ownedBrchNo:"",
          ownedBrchNames:this.$store.getters.userInfo.brchName,
          ownedBrchNos:this.$store.getters.userInfo.brchNo,
          authPath:this.$route.path ,
          busiType: "1",
          billNo: "",
          busiBatchNo: "",
          applDate: "",
          minApplDt: "",
          maxApplDt: "",
          saleBrchName: "",//发起方机构名称
          saleBrchCode: "",//发起方机构代码，查询条件是利用机构代码查询
          buyBrchName: "",//接收方机构名称
          buyBrchCode: "",//接收方机构代码
          transferStatus: "",
          minBillMoney: "",
          maxBillMoney: "",
          minBillRangeStart: "",
          maxBillRangeEnd: "",
          custName: ""
        },
        applDate:[],
        //业务类型
        busiTypeList: [{
          value: "1",
          label: "转让"
        }, {
          value: "2",
          label: "受让"
        }],
        busiStatusList: [],
        billClassList: [],
        billId: null,
        billRangeStart: null,
        billRangeEnd: null,
        showBillInfoWin: false,
        param: null,
        rows: null,
        tempShowExcelTemplateWin: false,
        dueDt: "",
        applDt: "",
        busiType: "1",
        selectexport: [],
        transferStatusList: [],
        acctFlagList: [],
        readonly: false,
        ifShowMore: false,
        //brchCodeWinBrch: false,
        //brchCodeWinCust: false,
        brchCodeWin: false,
        dictMap: new Map(),
        ownedBrchName:"",
        ownedBrchNo:"",
        ownedBrchNames:"",
        ownedBrchNos:"",
        licenseFlag:false,
        authPath: this.$route.path ,
        //brchNoWin : false,
        datagridUrl: "/be/trust/transfer/transferSaleTrackQuery/func_queryTransferTrackSaleBillPage"
      };
    },
    methods: {
      busiTypeWinOpen() {
        this.datagridUrl = this.formItem.busiType === "2" ? "/be/trust/transfer/transferSaleTrackQuery/func_queryTransferTrackRebuyBillPage" : "/be/trust/transfer/transferSaleTrackQuery/func_queryTransferTrackSaleBillPage";
        this.getDictListByGroups("TransferRebuyBillStatus,TransferSaleBillStatus,AcctFlag").then(res => {
          if (this.formItem.busiType == 1) {
            //转让，即申请方
            this.transferStatusList = res.get("TransferSaleBillStatus");
          } else {
            this.transferStatusList = res.get("TransferRebuyBillStatus");
          }
          this.dictMap = res.get("map");
        });
      },
      formSearch() {

        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
        this.busiType = this.formItem.busiType;
      },
      handleApplDtChange(arr){
        if (arr && arr.length >= 2) {
          this.formItem.minApplDt = arr[0].replace(/-/g, "");
          this.formItem.maxApplDt = arr[1].replace(/-/g, "");
          this.applDate = [arr[0],arr[1]];
        } else {
          this.formItem.minApplDt = "";
          this.formItem.maxApplDt = "";
          this.applDate = [];
        }
      },
      formSearchReset() {
        this.applDate = [];
        this.formItem.minApplDt = "";
        this.formItem.maxApplDt = "";
        this.formItem.saleBrchCode = "";
        this.formItem.buyBrchCode = "";
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.formItem.busiType = "1";
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = this.$store.getters.userInfo.brchNo;
        this.formItem.ownedBrchNames = this.$store.getters.userInfo.brchName;
        this.$refs.formItem.resetFields();
        this.formItem.saleBrchName = "";
        this.formItem.buyBrchName = "";
      },
      /*brchCodeWinOpen() {
        this.brchCodeWinBrch = true;
      },*/
      /*brchCodeWinOpen1() {
        this.brchCodeWinCust = true;
      },*/
      /*brchCodeWinOpen2() {
        this.brchCodeWin = true;
      },*/
      /*brchCodeWinClose() {
        this.brchCodeWinBrch = false;
      },*/
      /*brchCodeWinClose1() {
        this.brchCodeWinCust = false;
      },*/
      /*brchCodeWinClose2() {
        this.brchCodeWin = false;
      },*/
      //根据弹框所选数据进行赋值
      /*brchCodeChange(info) {
        this.formItem.saleBrchName = info.brchFullNameZh;//发起方机构名称
        this.formItem.saleBrchCode = info.brchCode;//机构代码
        this.brchCodeWinBrch = false;
      },*/
      /*brchCodeChange1(info) {
        this.formItem.buyBrchName = info.brchFullNameZh;//接收方机构名称
        this.formItem.buyBrchCode = info.brchCode;
        this.brchCodeWinCust = false;
      },*/
      /*brchCodeChange2(info) {
        this.formItem.custName = info.brchFullNameZh;//机构
        this.brchCodeWin = false;
      },*/
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      tempShowExcelTemplateWinOpen() {
        this.param = "transferTrackBillInfo";
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      //清单导出
      exportList(field, exportType) {
        //exportType: 0-同步 1-异步
        if (exportType === "1") {
          let pageSize = this.$refs.datagrid.total;
          if(pageSize == 0){
            pageSize = 1;
          }
          let url = null;
          if (this.formItem.busiType === "2") {
            url = window.LOCAL_CONFIG.API_HOME + "/be/trust/transfer/transferSaleTrackQuery/func_exportRebuyExcel";
          } else {
            url = window.LOCAL_CONFIG.API_HOME + "/be/trust/transfer/transferSaleTrackQuery/func_exportSaleExcel";
          }
          let params = null;
          if (this.$refs.datagrid.selectIds.length != 0) {
            params = {
              ids: this.$refs.datagrid.selectIds,
              pageSize: this.$refs.datagrid.selectIds.length,
              field: field,
              exportType: exportType,
              excelName: this.param
            };
          } else {
            params = {
              billNo: this.formItem.billNo,
              busiBatchNo: this.formItem.busiBatchNo,
              applDate: this.formItem.applDate,
              minApplDt: this.formItem.minApplDt,
              maxApplDt: this.formItem.maxApplDt,
              saleBrchCode: this.formItem.saleBrchCode,
              buyBrchCode: this.formItem.buyBrchCode,
              transferStatus: this.formItem.transferStatus,
              minBillMoney: this.formItem.minBillMoney,
              maxBillMoney: this.formItem.maxBillMoney,
              custName: this.formItem.custName,
              ownedBrchNames:this.formItem.ownedBrchNames,
              ownedBrchNos:this.formItem.ownedBrchNos,
              minBillRangeStart:this.formItem.minBillRangeStart,
              maxBillRangeEnd:this.formItem.maxBillRangeEnd,
              authPath:this.$route.path ,
              field: field,
              exportType: exportType,
              excelName: this.param,
              pageSize: pageSize
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
        } else {
          if (this.$refs.datagrid.selectIds.length != 0) {
            let url = null;
            if (this.formItem.busiType === "2") {
              url = window.LOCAL_CONFIG.API_HOME + "/be/trust/transfer/transferSaleTrackQuery/func_exportRebuyExcel";
            } else {
              url = window.LOCAL_CONFIG.API_HOME + "/be/trust/transfer/transferSaleTrackQuery/func_exportSaleExcel";
            }
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
            input2.name = "pageSize";
            input2.value = this.$refs.datagrid.selectIds.length;
            form.appendChild(input2);
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
          } else {
            let url = null;
            if (this.formItem.busiType === "2") {
              url = window.LOCAL_CONFIG.API_HOME + "/be/trust/transfer/transferSaleTrackQuery/func_exportRebuyExcel";
            } else {
              url = window.LOCAL_CONFIG.API_HOME + "/be/trust/transfer/transferSaleTrackQuery/func_exportSaleExcel";
            }
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
      //将后台传来的null转成空字符串
      formatTableData(arr) {
        arr.forEach(x => {
          Object.keys(x).forEach(function(key) {
            if (x[key] == null) x[key] = "";
          });
        });
      },
      billInfoWinClose() {
        this.billId = null;
        this.billRangeStart = null;
        this.billRangeEnd = null;
        this.showBillInfoWin = false;
      },
      showBillInfo(billId,billRangeStart,billRangeEnd) {
        this.billId = billId;
        this.billRangeStart = billRangeStart;
        this.billRangeEnd = billRangeEnd;
        this.showBillInfoWin = true;
      },
      /*clearVal(type) {
        if (type == "saleBrchName") {
          this.formItem.saleBrchCode = "";
          this.formItem.saleBrchName = "";
        }
        if (type == "buyBrchName") {
          this.formItem.buyBrchCode = "";
          this.formItem.buyBrchName = "";
        }
        if (type == "custName") {
          this.formItem.custName = "";
        }
      },*/

      //根据弹框所选数据进行赋值
     /* brchNoChange(info) {
        let objs = [];
        if(info instanceof Array){
          objs = info;
        } else {
          objs[0] = info;
        }
        let brchNos = "";
        let brchNames = "";
        for(var i=0;i<objs.length; i++){
          brchNos += objs[i].id + ',';
          brchNames += objs[i].title + ',';
        }
        this.formItem.ownedBrchNos = brchNos.substring(0,brchNos.length - 1);
        this.formItem.ownedBrchNames = brchNames.substring(0,brchNames.length - 1);
        this.brchNoWin = false;
      },
      brchNoWinOpen() {
        this.brchNoWin = true;},
      brchNoWinClose() {
        this.brchNoWin = false;
      },*/
      pageShowFormatBillRange(billRangeStart, billRangeEnd) {
        if (billRangeStart == null || billRangeStart === ""
          || billRangeEnd == null || billRangeEnd === "") {
          return '-';
        }
        if (billRangeStart.toString() === '0' && billRangeEnd.toString() === '0') {
          return '0';
        }
        return billRangeStart.toString().padLeft(12, '0') + "," + billRangeEnd.toString().padLeft(12, '0');
      }
    },
    mounted() {
      //TransferRebuyBillStatus非交易过户接收方过户状态
      //TransferSaleBillStatus非交易过户申请方过户状态
      this.getDictListByGroups("TransferRebuyBillStatus,TransferSaleBillStatus,AcctFlag").then(res => {
        if (this.formItem.busiType == 1) {
          //转让，即申请方
          this.transferStatusList = res.get("TransferSaleBillStatus");
        } else {
          this.transferStatusList = res.get("TransferRebuyBillStatus");
        }
        this.dictMap = res.get("map");
      });

      post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            if (this.licenseFlag) {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
            }else {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", true);
            }
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        }else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
  };
</script>

<style scoped>

</style>
