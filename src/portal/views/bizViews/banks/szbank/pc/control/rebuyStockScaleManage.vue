<!--台账管理 -->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form ref="formItem" :model="formItem" :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <h-form-item  :label="$t('m.i.pc.discCustName')" prop="custName">
                    <h-input v-model="formItem.custName" placeholder=""></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.pc.corpScale')" prop="corpScale">
                    <h-select v-model="formItem.corpScale" placeholder="">
                      <h-option v-for="item in corpScaleList" :value="item.key" :key="item.key">{{item.value }}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.pc.operDt')" prop="corpScaleUpDt">
                    <h-date-picker type="date" v-model="formItem.operDt" placeholder="" @on-change="handleoperDtChange" :editable=false></h-date-picker>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                    <h-button type="ghost" @click="handleReset()">{{$t("m.i.common.reset")}}</h-button>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            :hasSelect = false
            :rowSelect = true
            url = "/pc/szbank/scale/func_pageQueryRebuyCorpScaleList"
            :bindForm="formItem"
            ref="datagrid">
            <div slot="toolbar" class='pull-left'>
              <h-button type="primary" @click="corpScaleOpen()">规模维护</h-button>
              <h-button type="primary" @click="batchImport">{{$t("m.i.common.import")}}</h-button>
              <h-button type="primary" @click="templateDownload">{{$t("m.i.common.templateDownload")}}</h-button>
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen()">清单导出</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--新增、修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" :mask-closable="false" @on-close="handleWinClose"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span>维护企业规模</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="80" ref="addForm" cols="2" class="h-form-search" >
          <h-form-item  :label="$t('m.i.common.enterpriseName')" prop="custName" required>
            <h-input readonly v-model="addForm.custName" placeholder=""></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.corpScale')" prop="corpScale" required>
            <h-select v-model="addForm.corpScale" placeholder="">
              <h-option v-for="item in corpScaleList" :value="item.key" :key="item.key">{{item.value }}
              </h-option>
            </h-select>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="handleWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="submitForm">{{$t("m.i.common.save")}}</h-button>
      </div>
    </h-msg-box>

    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>
    <!-- 批量导入 -->
    <common-file-upload-no-show :import-win="this.importWin" :fileParams="fileParams" @importWinClose="importWinClose"
                                @importSuccess="importSuccess"></common-file-upload-no-show>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="this.billId" :billNo="this.billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
  </div>
</template>
<script>


  import { post, on, off, formatNumber, templateDownload,exportList,formatBillRange} from "@/api/bizApi/commonUtil";

  export default {
    name: "rebuyStockScaleManage",
    components: {

    },
    data() {
      return {
        dictMap : new Map(),
        formItem : {
          custName: '',
          corpScale:'',
          operDt:''
        },
        addForm : {
          id: '',
          custName: '',
          corpScale: ''
        },
        type : null,
        addOrEditWin : false,
        setRoleRole : false,
        setRoleRight : false,
        setRoleAllotRight : false,
        showBillInfoWin: false,
        tempShowExcelTemplateWin: false,
        importWin: false,
        ifShowMore: false,
        readonly:false,
        isRequired:true,
        billRangeStart:"",
        billRangeEnd:"",
        billId : "",
        billNo : "",
        listId : "",
        columns : [
          {
            type: 'selection',
            align: 'center',
            width: 60,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: 'index',
            align: 'center',
            width: 60,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.billInfoWinOpen(params.row);
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
            title: this.$t("m.i.pc.discCustName"),
            key: "custName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.pc.corpScale'),
            key: "corpScale",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CorpScale", params.row.corpScale);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.pc.operDt"),
            key: "operDt",
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.operDt == null || params.row.operDt === ""){
                return "";
              }
              let operDt = this.$moment(params.row.operDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", {domProps: {title: operDt}},  operDt);
            }
          },
        ],
        corpScaleList : [],
        tempInx : 0,
        pageInfo : {
          pageNo: 1,
          pageSize: 10
        },
        //导出参数
        tempShowExcelTemplateWin : false,
        param : null,
        rows : null,
        fileParams: {
          fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/pc/szbank/scale/func_batchAdd",  //excel数据导入接口
          uploadParams: {}       //调用excel数据解析接口时附带的额外参数
        },
      };
      //日期字符串格式化（yyyy-mm-dd）
      function datatoDate(value){
        if (value != null && value != "") {
          var str=value.toString();
          return str.slice(0,4)+'-'+str.slice(4,6)+'-'+str.slice(6,8);
        }
        else {
          return "";
        }
      }
    },
    methods: {
      handleoperDtChange(value){
        this.formItem.operDt = value.replace(/-/g, "");
      },
      billInfoWinOpen(row) {
        this.billNo = row.billNo;
        this.billId = row.billId;
        this.billRangeStart=row.billRangeStart;
        this.billRangeEnd=row.billRangeEnd;
        this.showBillInfoWin = true;
      },
      templateDownload() {
        templateDownload(window.LOCAL_CONFIG.API_HOME + "/pc/szbank/scale/func_templateDownloadExcel")
      },
      handleWinClose() {
        this.$refs.addForm.resetFields();
        this.addForm.corpScale = '';
        this.addForm.custName = '';
        this.addOrEditWin = false;
      },
      corpScaleOpen(){
        this.currentSelectRow = this.$refs.datagrid.selects;
        if(this.currentSelectRow == null || this.currentSelectRow.length == 0){
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          this.addOrEditWin = false;
          return false;
        }
        if(this.currentSelectRow.length > 1){
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
        } else {
          if (this.currentSelectRow[0].custName != undefined) {
            this.addForm.custName = this.currentSelectRow[0].custName;
          } else {
            this.addForm.custName = '';
          }
          if (this.currentSelectRow[0].corpScale != undefined) {
            this.addForm.corpScale = this.currentSelectRow[0].corpScale;
          } else {
            this.addForm.corpScale = '';
          }
          this.addOrEditWin = true;
        }
      },
      submitForm() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            post(this.addForm, "/pc/szbank/scale/func_addOrEditRebuyCorpScale").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.$refs.addForm.resetFields();
                  this.addForm.corpScale = '';
                  this.addForm.custName = '';
                  this.$refs.datagrid.dataChange(1);
                  this.addOrEditWin = false;
                } else {
                  this.$msgTip.error(this, {info: res.data.retMsg});
                }
              } else {
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
              }
            });
          }
        });
      },
      //批量导入
      batchImport() {
        this.importWin = true;
      },
      importWinClose() {
        this.importWin = false;
      },
      importSuccess() {
        this.importWin = false;
        this.$refs.datagrid.dataChange(1);
      },

      //查询按钮点击事件
      handleSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      },
      getSumMoneyAndTotal(params) {
        this.total = params.total;
        this.sumMoney = formatNumber(params.sumMoney, 2, ",");
      },
      handleReset() {
        this.$refs.formItem.resetFields();
        this.formItem.custName = "";
        this.formItem.corpScale = "";
        this.formItem.operDt = "";
      },

      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //获取导出模板
      tempShowExcelTemplateWinOpen() {
        this.param = 'rebuyCorpScaleQueryExportInfo';
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        }else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },

      //清单导出
      exportList(field, exportType) {
        let exportUrl = window.LOCAL_CONFIG.API_HOME + "/pc/szbank/scale/func_exportRebuyCorpScaleOccurExcel";
        let options = {};
        if (this.$refs.datagrid.selectIds.length !== 0) {
          options.params = {
            ids: this.$refs.datagrid.selectIds
          };
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, exportUrl, options);
      },
      showBillInfo(row){
          this.billId = row.billId;
          this.billRangeStart = row.billRangeStart;
          this.billRangeEnd = row.billRangeEnd;
          if(row.balanceType == "14"){
            this.listId = listId;
            this.billNo = billNo;
            this.showBillInfoStdWin = true;
          }else{
            this.showBillInfoWin = true;
          }


      },
      billInfoWinClose(){
          this.showBillInfoWin = false;
      },

      billInfoStdWinClose(){
        this.billId=null;
        this.billNo=null;
        this.listId=null;
        this.showBillInfoStdWin=false;
      },
    },

    created() {
      let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
      this.formItem.brchNos = userInfo.brchNo;
      this.formItem.branchName = userInfo.brchName;
    },
    mounted() {
      this.openI9flag=window.sessionStorage.getItem('isOpenI9')=='1'?true:false;
      this.getDictListByGroups("CorpScale").then(res => {
        this.corpScaleList = res.get("CorpScale");
        this.dictMap = res.get("map");
      });
    }
  };

</script>
