<!--流水管理 -->
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
                  <h-form-item :label="$t('m.i.common.brchName')" prop="brchNos">
                    <h-input v-model="formItem.brchNos" placeholder="" readonly
                             icon="android-search" @on-click="queryBrchNo('query')"
                             v-show="false"
                    ></h-input>
                    <h-input v-model="formItem.branchName" placeholder="" readonly
                             icon="android-search" @on-click="queryBrchNo('query')" :title="formItem.branchName"
                    ></h-input>
                  </h-form-item>

                  <h-form-item  :label="$t('m.i.common.custName')" prop="custName">
                    <h-input v-model="formItem.custName" :maxLength="20"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.common.custAcctNo')" prop="custAcctNo">
                    <h-input v-model="formItem.custAcctNo" :maxLength="20"></h-input>
                  </h-form-item>

                  <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="dueDtShow">
                    <h-date-picker :value="dueDtShow" type="daterange" showFormat :editable=false @on-change="handleDueDtChange" placeholder=""></h-date-picker>
                  </h-form-item>

                  <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNo">
                    <h-input v-model="formItem.billNo" :maxLength="20"></h-input>
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
              <h-form :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <h-form-item :label="$t('m.i.pc.sumMoney')" class="h-form-long-label">
                    <h-input v-model="sumMoney" placeholder="" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.pc.total')">
                    <h-input v-model="total" placeholder="" readonly></h-input>
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
            url="/pc/report/fineInterest/func_queryFineInterest"
            :bindForm="formItem"
            @getSumMoneyAndTotal="getSumMoneyAndTotal"
            ref="datagrid">
            <div slot="toolbar" class='pull-left'>
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen()">{{$t("m.i.common.listExport")}}</h-button>
            </div>
          </h-datagrid>


        </div>
      </h-col>
    </h-row>
    <show-branch :showBranchWin="showBranchWin" title="机构查询" @brchNoChange="brchNoChange"
                 ifcheck="true" :checkStrictly="true"  @showBranchWinClose="showBranchWinClose"></show-branch>
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>

  </div>

</template>
<script>
  import { post, on,off, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: 'fineInterest',
    data() {
      return {
        dictMap : new Map(),
        formItem : {
          brchNos: "",
          branchName:"",
          billNo: "",
          custName:"",
          custAcctNo:'',
          minDueDt: '',
          maxDueDt: ''
        },
        type : null,
        addOrEditWin : false,
        setRoleRole : false,
        setRoleRight : false,
        setRoleAllotRight : false,
        copyWin : false,
        readonly:false,
        isRequired:true,
        showBranchWin:false,
        tempShowExcelTemplateWin : false,
        param : null,
        rows : null,
        //给按钮增加权限
        authObj : {
          bizSetRoleAdd: true, //角色添加
          bizSetRoleDelete: true, //角色删除
          bizSetRoleORight: true, //角色操作权限
          bizSetRoleARight: true, //角色授权权限
          bizRoleRightSet: true, //角色权限处理
          bizRoleRightCopy: true, //角色权限复制
          bizSetRoleDownload: true, //角色信息下载
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
            type: 'index',
            align: 'center',
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.custName"),
            key: "custName",
            hiddenCol: false,
            sortable: true,
            align: 'center',
          },
          {
            title:  this.$t("m.i.common.custAcctNo"),
            key: "custAcctNo",
            hiddenCol: false,
            sortable: true,
            align: 'center',
          },
          {
            title: this.$t("m.i.billInfo.billSource"),
            key: "billSource",
            hiddenCol:false,
            sortable: true,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('span', setBillSource(params.row.billSource,params.row,params.row.index))
              ]);
            }
          },
          {
            title:this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billClass"),
            key: "billClass",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            align: 'center',
          },
          {
            title:this.$t("m.i.billInfo.billMoney"),
            key: "billMoney",
            hiddenCol:false,
            align: 'center',
            sortable: true,
            render: (h, params) => {
              return h('div', [
                h('span', formatNumber(params.row.billMoney, 2, ','))
              ]);
            }
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            hiddenCol:false,
            sortable: true,
            align: 'center',
            render: (h, params) => {
              let date = params.row.remitDt == null ? "" : this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },

          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol:false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.dueDt == null ? "" : this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.pc.galeDt"),
            key: "galeDt",
            hiddenCol:false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.galeDt == null ? "" : this.$moment(params.row.galeDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.pc.fineInterest"),
            key: "fineInterest",
            hiddenCol:false,
            align: 'center',
            sortable: true,
            render: (h, params) => {
              return h('div', [
                h('span', formatNumber(params.row.fineInterest, 2, ','))
              ]);
            }
          },
          {
            title: this.$t("m.i.pc.fineInterestCalDays"),
            key: "fineInterestCalDays",
            hiddenCol:false,
            align: 'center',
            sortable: true
          },
          {
            title:this.$t("m.i.billInfo.settlePayDt"),
            key: "endDt",
            hiddenCol:false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.endDt == null ? "" : this.$moment(params.row.endDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          }
        ],
        histData : {rows:[],
          total:1},
        traderData : {rows:[],
          total:1},
        userTraderWin : false,
        showDefaultTeller : false,
        branchDto : {},
        currentSelectRow : [],
        traderSelectRow : [],
        currentSelectList : [],
        currentSelectRowInx : [],
        ifShowMore : false,
        tempInx : 0,
        pageInfo : {
          pageNo: 1,
          pageSize: 10
        },
        brchRoleDistributeWin : false,
        userHistWin : false,
        defaultTraderNo:null,
        showBranchMenuWin:false,
        submitCopyRoleDisabled : false,
        dueDtShow : [],
        numberRule : ['num'],
        deletDisabled : false,
        kindTree : [],
        submitFlag : false,
        schemeIdList : [],
        queryUrl : "/pc/report/fineInterest/func_queryFineInterest",
        selectexport : [],
        interest : "",
        totalMoney : "",
        jqRate : "",
        jqdays : "",
        billTypeList : [],
        billClassList : [],
        sumBillMoney : "",
        sunNum : "",
        sumMoney : "",
        total : "",
        weightAverRate : "",
        weightAverInterDay : "",
      };
      function setBillSource(value, row, index) {
        if (value != null && value != "") {
          switch (value) {
            case '1':
              return '贴现来源';
            case '2':
              return '转贴现来源';
            case '5':
              return '买断式回购逾期';
            case '6':
              return '买断式回购逾期';

          }
        } else {
          return "";
        }
      };
    },
    components: {
      ShowBranch:()=>import(/* webpackChunkName: "sm/auth/branch/showBranch" */`@/views/bizViews/sm/auth/branch/showBranch`)
    },
    methods:{
      getSumMoneyAndTotal(params) {
        this.total = params.total;
        this.sumMoney = formatNumber(params.sumMoney, 2, ",");
      },
      formSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
        this.getOccrData();
      },
      formSearchReset() {
        let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
        this.formItem.brchNos = userInfo.brchNo;
        this.formItem.branchName = userInfo.brchName;
        this.formItem.minDueDt = '';
        this.formItem.maxDueDt = '';
        this.dueDtShow = [];
        this.$refs.formItem.resetFields();
      },

      //查询机构弹出框
      queryBrchNo(optType) {
        this.showBranchWin = true;
        this.optType = optType;
      },
      showBranchWinClose() {
        this.showBranchWin = false;
      },
      //根据弹框所选数据进行赋值
      brchNoChange(info) {

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
        this.formItem.brchNos = brchNos.substring(0,brchNos.length - 1);
        this.formItem.branchName = brchNames.substring(0,brchNames.length - 1);
        this.showBranchWin = false;
      },
      handleDueDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDtShow = [arr[0], arr[1]];
        }else{
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDtShow = [];
        }

      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //获取导出模板
      tempShowExcelTemplateWinOpen() {
        this.param = 'fineInterestExportInfo';
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        }else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      //清单导出
      exportList(field, exportType){
        //exportType: 0-同步 1-异步
        if(exportType === "1"){
          let url = window.LOCAL_CONFIG.API_HOME + "/pc/report/fineInterest/func_exportFineInterest";
          let params = null;
          let pageSize = this.$refs.datagrid.total;
          if(this.$refs.datagrid.total == 0){
            pageSize = 1;
          }
          if (this.$refs.datagrid.selectIds.length != 0) {
            params = { ids: this.$refs.datagrid.selectIds, pageSize: this.$refs.datagrid.selectIds.length, field: field, exportType: exportType, excelName: this.param};
          }else {
            params = { brchNos:this.formItem.brchNos,custName:this.formItem.custName,custAcctNo:this.formItem.custAcctNo,
              minDueDt:this.formItem.minDueDt,maxDueDt:this.formItem.maxDueDt,
              billNo:this.formItem.billNo,
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
            let url = window.LOCAL_CONFIG.API_HOME +  "/pc/report/fineInterest/func_exportFineInterest";
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
            let url = window.LOCAL_CONFIG.API_HOME +  "/pc/report/fineInterest/func_exportFineInterest";
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
      this.formItem.brchNos = userInfo.brchNo;
      this.formItem.branchName = userInfo.brchName;
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,CDMedia").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get("CDMedia");
        this.dictMap = res.get("map");
      });
    }
  };
</script>
