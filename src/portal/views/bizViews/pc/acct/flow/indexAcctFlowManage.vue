<style>

</style>
<!--流水管理 -->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <div class="h-search-form-row" >
                <h-form-item :label="$t('m.i.common.transDt')" prop="acctDt">
                  <h-date-picker :value="formItem.acctDt" type="date" placeholder="" :editable=false
                                 :showFormat=true @on-change="handleChange"></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.pc.acctType')" prop="acctType" >
                  <h-select  v-model="formItem.acctType" placeholder="">
                    <h-option v-for="item in acctTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                  <show-branch v-model="formItem.accountBrchNos" :label="$t('m.i.common.accountBrchName')" prop="accountBrchNos"
                               title="机构名称" :brchNo.sync="formItem.accountBrchNos" :brchName.sync="formItem.branchName">
                  </show-branch>
                  <h-form-item :label="$t('m.i.common.status')" prop="isAcctSuccess" >
                    <h-select  v-model="formItem.isAcctSuccess" placeholder="">
                      <h-option v-for="item in isAcctSuccessList" v-if="item.key!='00'||item.key!='0'" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.common.foreFlowNo')" prop="foreFlowNo">
                    <h-input v-model="formItem.foreFlowNo" :maxLength="20"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.common.backFlowNo')" prop="backFlowNo">
                    <h-input v-model="formItem.backFlowNo" :maxLength="20"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.common.acctTellerNo')" prop="acctTellerNo">
                    <h-input v-model="formItem.acctTellerNo" :maxLength="20"></h-input>
                  </h-form-item>
                  <show-product v-model="formItem.prodName" @productSelectedChange="productSelectedChange" :clearable="false"></show-product>
                  <h-form-item prop="isCancelAcct" :label="$t('m.i.pc.isCancelAcct')" class="h-form-long-label">
                    <h-select  v-model="formItem.isCancelAcct" placeholder="">
                      <h-option v-for="item in isCancelAcct"  :value="item.key" :key="item.key">{{ item.value }}</h-option>
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
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            url="/pc/acct/flow/indexAcctFlowManage/func_queryExceptionAcctFlow"
            :bindForm="formItem"
            :hasSelect = false
            :rowSelect = true
            :onRowClick="handlelRowClick"
            :onSelectChange="handleSelectClick"
            ref="datagrid">
            <div slot="toolbar" class='pull-left'>

              <h-button type="primary" @click="showAcctRecord()" >{{$t('m.i.pc.showAcctRecord')}}</h-button>
              <h-button type="primary" @click="showBillInfo()" >{{$t('m.i.pc.showBillInfo')}}</h-button>
              <h-button type="primary" @click="selectCancelFlow()">{{$t('m.i.pc.cancelFlow')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--显示流水明细界面-->
    <h-msg-box v-model="acctFlowDetailWin" width="1000" :mask-closable="false" @on-close="acctFlowDetailClose" top="10"
               class="h-form-search-layer" :maximize="true" @on-maximize="onMaximize">
      <p slot="header">
        <span>流水明细</span>
      </p>
      <h-row>
        <h-col span="24">
          <h-datagrid
            :columns="acctFlowDetailColumns"
            :url="acctFlowUrl"
            highlightRow
            :auto-load="false"
            :bindForm="acctFlowFormItem"
            :rowSelect="true"
            ref="acctFlowDatagrid">
            <div slot="toolbar" class="pull-left">
            </div>
          </h-datagrid>
        </h-col>
      </h-row>
      <div slot="footer">
        <h-button type="ghost" @click="acctFlowDetailClose">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>

	  <show-acct-record :showAcctRecordWin="showAcctRecordWin" @showAcctRecordWinClose="showAcctRecordWinClose" ></show-acct-record>
	  <show-acct-bill :showAcctBillWin="showAcctBillWin" @showAcctBillWinClose="showAcctBillWinClose" :params="params"></show-acct-bill>


  </div>

</template>
<script>

  import { post,on,off,getDictListByGroups,getDictValueFromMap,formatNumber} from "@/api/bizApi/commonUtil";

  export default {
    name: 'indexAcctFlowManage',
    data() {
      return {
        params:{
          frontFlowNo:"",
          acctDate:""
        },
        showAcctBillWin:false,
        showAcctRecordWin:false,
        formItem : {
          acctDt: "",
          acctType: "",
          accountBrchNos:'',
          isAcctSuccess:'',
          foreFlowNo:"",
          backFlowNo:"",
          acctTellerNo:"",
          prodNos:"",
          prodName:""
        },
        traderForm : {
          traderId: "",
          traderName: "",
          traderType:""
        },
        typeForm : {
          copyType: "1",
          toCopyRoleCode:"",
          creators:"",
          copyRoleCode:""
        },
        type : null,
        addOrEditWin : false,
        setRoleRole : false,
        setRoleRight : false,
        setRoleAllotRight : false,
        copyWin : false,
        readonly:false,
        isRequired:true,
        acctFlowUrl:"",
        billRangeStart:"",
        billRangeEnd:"",
        addForm : {
          roleCode: "",
          roleName: "",
          roleOrder: "",
          paramValue: "",
          kindCode: "BIZFRAME",
          kindId:"",
          paramDesc: "",
          paramRegex: "",
          relOrg:"0_000000",
          beginDate:"",
          endDate:"",
          beginDateFmt:"",
          endDateFmt:"",
          roleType:0,
          schemeId:"",
          schemeName: "",
          remark:""
        },
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
        //储存字典的list
        acctTypeList : [],
        isAcctSuccessList : [],
        isCancelAcct : [],
        columns : [{
          type: "selection",
          align: "center",
          key:"selection",
          width: 50,
          hiddenCol: false
        },
          {
            title: this.$t("m.i.common.index"),
            type: 'index',
            key:'index1',
            align: 'center',
            width: 50,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pc.frontFlowNo"),
            key: 'frontFlowNo',
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('a', {
                  on: {
                    click: () => {
                      this.showAcctFlowDetail(params.row.frontFlowNo)
                    }
                  }
                }, params.row.frontFlowNo)
              ]);
            }
          },
          {
            title:this.$t("m.i.common.foreFlowNo"),
            key: 'foreFlowNo',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let foreFlowNo = "";
              if (params.row.foreFlowNo == null || params.row.foreFlowNo == "") {
                foreFlowNo = "查看明细";
              }else {
                foreFlowNo = params.row.foreFlowNo;
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showAcctFlowDetail(params.row.frontFlowNo)
                  }
                }
              }, foreFlowNo);
            }
          },
          {
            title:this.$t("m.i.common.backFlowNo"),
            key: 'backFlowNo',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let backFlowNo = "";
              if (params.row.backFlowNo == null || params.row.backFlowNo == "") {
                backFlowNo = "查看明细";
              }else {
                backFlowNo = params.row.backFlowNo;
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showAcctFlowDetail(params.row.frontFlowNo)
                  }
                }
              }, backFlowNo);
            }
          },
          {
            title: this.$t("m.i.pc.acctTransName"),
            key: "acctTransName",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.common.prodName"),
            key: "prodName",
            sortable:false
          },
          {
            title: this.$t("m.i.pc.acctType"),
            key: "acctType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap,"AcctFlowType",params.row.acctType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.pc.isCancelAcct"),
            key: "isCancelAcct",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap,"Yon",params.row.isCancelAcct);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title:this.$t("m.i.common.transDt"),
            key: "acctDt",
            hiddenCol:false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.acctDt ? this.$moment(params.row.acctDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "-")
            },
          },
          {
            title: this.$t("m.i.common.transTm"),
            key: "transTm",
            hiddenCol:false,
            sortable: true,
            render: (h, params) => {
              if(!params.row.transTm){
                return h("span", "");
              }
              let transTm = params.row.transTm;
              let len = transTm.toString().length;
              if(len<6){
                for(let i=0;i<6-len;i++){
                  transTm ="0"+transTm;
                }
              }
              let date = this.$moment(transTm, "HH:mm:ss").format("HH:mm:ss");
              return h("span", date);
            }
          },
          {
            title:this.$t("m.i.common.operBrchName"),
            key: "sendAcctBrchName",
            hiddenCol: false,
            sortable: true,
          },
          {
            title:this.$t("m.i.common.operTellerNo"),
            key: "operTellerNo",
            hiddenCol: false,
            sortable: true,
          },
          {
            title:this.$t("m.i.common.accountBrchName"),
            key: "acctBrchName",
            hiddenCol: false,
            sortable: true,
          },
          {
            title:this.$t("m.i.common.acctTellerNo"),
            key: "acctTellerNo",
            hiddenCol: false,
            sortable: true,
          },
          {
            key: "isAcctSuccess",
            title: this.$t('m.i.common.status'),
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "IsAcctSuccess", params.row.isAcctSuccess);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.pc.errorCode"),
            key: "errorCode",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.common.errorMsg"),
            key: "errorMsg",
            hiddenCol: false,
            sortable: true,
          }],

        acctFlowFormItem: {
          frontFlowNo: ""
        },
        acctFlowDetailColumns:[
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title:this.$t("m.i.common.foreFlowNo"),
            key: "foreFlowNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.backFlowNo"),
            key: "backFlowNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.pc.acctGroupName"),
            key: "acctGroupName",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.transDt"),
            key: "acctDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.acctDt == null || params.row.acctDt == "") {
                return "";
              }
              let date = this.$moment(params.row.acctDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.common.transTm"),
            key: "transTm",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.transTm == null || params.row.transTm == "") {
                return "";
              }
              let transTm = params.row.transTm.toString();
              if (params.row.transTm.toString().length < 6) {
                for (let i = 0; i < (6 - params.row.transTm.toString().length); i++) {
                  transTm = "0" + transTm;
                }
              }
              let date = this.$moment(transTm, "HH:mm:ss").format("HH:mm:ss");
              return h("span", date);
            }
          },
          {
            key: "isAcctSuccess",
            title: this.$t('m.i.common.status'),
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "IsAcctSuccess", params.row.isAcctSuccess);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.pc.errorCode'),
            key: "errorCode",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.errorMsg"),
            key: "errorMsg",
            ellipsis: false,
            hiddenCol: false
          }
        ],

        histColumns : [
          {
            title: this.$t("m.i.common.index"),
            type: 'index',

            align: 'center'
          },

          {
            title: this.$t("m.i.common.foreFlowNo"),
            key: "foreFlowNo",

            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.backFlowNo"),
            key: "backFlowNo",
            hiddenCol: false,
            sortable: true
          },

          {
            title: this.$t("m.i.common.acctDt"),
            key: "acctDt",
            sortable: true,
            hiddenCol:false
          },

          {
            title: this.$t("m.i.common.transTm"),
            key: "transTm",
            hiddenCol: false,
            sortable: true,

          },
          {
            title: this.$t("m.i.common.transName"),
            key: "acctTransName",

            hiddenCol:false
          },
          {
            title: this.$t("m.i.pc.acctTransName"),
            key: "acctGroupName",
            sortable: true,
            hiddenCol:false
          },{
            title: this.$t("m.i.pc.acctType"),
            key: "acctType",
            hiddenCol:false
          },
          {
            title: this.$t("m.i.common.prodName"),
            key: "prodName",
            hiddenCol:false
          },
          {
            title: this.$t("m.i.common.status"),
            key: "isAcctSuccess",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "IsAcctSuccess", params.row.isAcctSuccess);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.pc.errorCode"),
            key: "errorCode",
            hiddenCol: false,
            sortable: true,

          },

          {
            title: this.$t("m.i.common.errorMsg"),
            key: "errorMsg",

            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.operTellerNo"),
            key: "operTellerNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.acctTeller"),
            key: "acctTellerNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.accountBrch"),
            key: "accountBrchNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.accountBrchName"),
            key: "brchName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.operBrchName"),
            key: "sendAcctBrchNo",
            hiddenCol: false,
            sortable: true
          }
        ],
        traderColumns : [
          {
            title: this.$t("m.i.common.index"),
            type: 'index',
            align: 'center'
          },
          {
            title: this.$t("m.i.common.backFlowNo"),
            key: "backFlowNo",
            hiddenCol: false,
            sortable: true
          }

        ],
        prodType : "",
        histData : {rows:[],
          total:1},
        traderData : {rows:[],
          total:1},
        brchNameSelectWin : false,
        brchTreeData : [],
        userTraderWin : false,
        showDefaultTeller : false,
        branchDto : {},
        currentSelectRow : [],
        traderSelectRow : [],
        currentSelectList : [],
        currentSelectRowInx : [],
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
        numberRule : ['num'],
        deletDisabled : false,
        kindTree : [],
        submitFlag : false,
        acctFlowDetailWin: false,
        ifShowMore :false,
        schemeIdList : [],
        reqUrl : '/pc/acct/acctflow',
        tempShowExcelTemplateWin : false,
        dictMap: new Map(),
        param : null,
        rows : null
      };
    },
    components: {
	    ShowAcctRecord:()=>import(/* webpackChunkName: "pc/acct/flow/showAcctRecord" */`@/views/bizViews/pc/acct/flow/showAcctRecord`),
	    ShowAcctBill:()=>import(/* webpackChunkName: "pc/acct/flow/showAcctBill" */`@/views/bizViews/pc/acct/flow/showAcctBill`)
    },
    methods:{
		showAcctBillWinClose(){
			this.showAcctBillWin = false;
		},
		showAcctRecordWinClose(){
			this.showAcctRecordWin = false;
		},
      handleChange(value) {
        this.formItem.acctDt = value.replace(/-/g, "");
      },
      formSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.currentSelectList = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.prodNo = "";
        this.formItem.prodName = "";
        let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
        this.formItem.accountBrchNos = userInfo.brchNo;
        this.formItem.branchName = userInfo.brchName;
        this.formItem.acctDt = window.sessionStorage.getItem("workDate");
      },
      showAcctRecordClose() {
        this.showAcctRecordWin = false;
      },
      showBillWinClose() {
        this.showBillWin = false;
      },
      handleSelectClick(arr,selectInx) {

        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx
        if(arr.length==0) return
      },
      handlelRowClick(arr) {
        this.currentSelectRow = arr;
      },
      //选择产品名称弹出框确认
      productSelectedChange(arr) {
        this.formItem.prodNo = arr[0].id;
        this.formItem.prodName = arr[0].title;
      },
      //选择机构名称弹出框确认
      brchNameAdd() {
        let arr = this.$refs["brchTreeData"].getSelectedNodes();
        if(this.branchType === "query"){
          this.formItem.brchName = arr[0].title;
          this.formItem.brchNo = arr[0].id;
        }
        this.brchNameSelectWin = false;
      },
      /**查看分录数据*/
      showAcctRecord(str) {
        let list = this.currentSelectList;

        if (list.length > 1) {
          this.$msgTip.info(this,{info:this.$t('m.i.common.onlyChooseOneData')});
          return
        }
        if (list.length == 0) {
          this.$msgTip.info(this,{info:this.$t('m.i.common.chooseOneData')});
          return
        }
        let url = "/pc/acct/flow/indexAcctFlow/func_showAcctRecord";
        let frontFlowNo = this.currentSelectList[0].frontFlowNo;
        let acctDt = this.currentSelectList[0].acctDt;
        window.sessionStorage.setItem('frontFlowNo',frontFlowNo);
        window.sessionStorage.setItem('acctDt', acctDt);
        this.$nextTick(() => {
          this.showAcctRecordWin = true;
        });
      },

      /**查看票明细数据*/
      showBillInfo(str) {
        let list = this.currentSelectList;

        if (list.length > 1) {
          this.$msgTip.info(this,{info:this.$t('m.i.common.onlyChooseOneData')});
          return
        }
        if (list.length == 0) {
          this.$msgTip.info(this,{info:this.$t('m.i.common.chooseOneData')});
          return
        }
        if(list[0].prodNo == "02101101"){
          this.$msgTip.info(this,{info:this.$t('摊销记账为机构汇总记账，无记账明细')});
          return
        }
        if (list[0].prodNo == "03010201"||list[0].prodNo == "03010103"||list[0].prodNo == "03010102"||list[0].prodNo == "03010301") {
          this.$msgTip.info(this, { info: this.$t('标票退汇、标票手续费、标票对价支付、标票兑付记账为汇总记账，无记账明细') });
          return
        }

        let url = "/pc/acct/flow/indexAcctFlow/func_showAcctBill";
        let frontFlowNo = this.currentSelectList[0].frontFlowNo;
		    window.sessionStorage.setItem('frontFlowNo',frontFlowNo);
		    this.params.frontFlowNo=this.currentSelectList[0].frontFlowNo;
		    this.params.acctDate=this.currentSelectList[0].acctDt;
        this.params.prodNo = this.currentSelectList[0].prodNo;
        //区分标票和传统业务查询数据  存托记账、托收回款、追索
        if (list[0].prodNo == "03020201"||list[0].prodNo == "03020301"||list[0].prodNo == "03020302") {
          this.params.dataGridUrl = "/bs/corpstdbill/dpst/indexAcctFlow/func_showAcctBill";
        } else{
          this.params.dataGridUrl = "/pc/acct/flow/indexAcctFlow/func_showAcctBill";
        }
        this.$nextTick(() => {
		       this.showAcctBillWin = true;
        });
      },
      /**查看流水明细*/
      showAcctFlowDetail(frontFlowNo) {
        this.acctFlowFormItem.frontFlowNo = frontFlowNo;
        this.acctFlowUrl =  "/pc/acct/flow/indexAcctFlow/func_showAcctFlowDetail";
        this.acctFlowDetailWin = true;
        this.$nextTick(() => {
          if (this.$refs.acctFlowDatagrid != null) {
            this.$refs.acctFlowDatagrid.dataChange(1);
          }
        });
      },
      acctFlowDetailClose() {
        this.acctFlowDetailWin = false;
      },

      /**撤销流水*/
      selectCancelFlow(str) {
        let list = this.currentSelectList;

        if (list.length == 0) {
          this.$msgTip.info(this,{info:this.$t('m.i.common.chooseOneData')});
          return
        }
        let ids = "";
        for (var i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定要撤销流水吗?",
          onOk: () => {
            this.$loadingbox.open({
              title: "流水撤销中，请稍后..."
            });
            post({foreFlowIds:ids},"/pc/acct/flow/indexAcctFlowManage/func_cancelFlowByBatchId").then(res => {
              if(res) {
                let msg = res.data.retMsg
                let retCode = res.data.retCode
                if (retCode == "000000") {
                  this.$loadingbox.close();
                  this.$msgTip.success(this);
                } else {
                  this.$loadingbox.close();
                  this.$msgTip.error(this, { info: msg });
                }
              }
            }).catch(error => {
              this.$loadingbox.close();
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });
          }
        });
      }
    },
    created() {
      let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
      this.formItem.accountBrchNos = userInfo.brchNo;
      this.formItem.branchName = userInfo.brchName;
      this.formItem.acctDt = window.sessionStorage.getItem("workDate");
    },
    mounted() {
      this.getDictListByGroups("AcctFlowType,IsAcctSuccess,Yon").then(res => {
        this.acctTypeList = res.get("AcctFlowType");
        this.isAcctSuccessList = res.get("IsAcctSuccess").filter(item => item.key === "2" || item.key === "3" || item.key === "4"|| item.key === "5"|| item.key === "6");
        this.isCancelAcct = res.get("Yon");
        this.dictMap = res.get("map");
      });
    }
  };
</script>
