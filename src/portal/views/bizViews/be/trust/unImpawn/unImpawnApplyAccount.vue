<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--<h-form-item :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" v-if="this.licenseFlag">
                  <h-input v-model="formItem.ownedBrchNames" icon="android-search" @on-click="brchNoWinOpen"
                           readonly clearable @on-clear="clearVal1('license')"
                           :title="formItem.ownedBrchNames"></h-input>
                </h-form-item>-->
                <show-branch v-model="formItem.ownedBrchNames"  :label="$t('m.i.common.ownedBrchNo')"  prop="ownedBrchNames"
                             v-if="this.licenseFlag"    :showCheckBox="true"     :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames"
                             :params="{authPath:this.$route.path}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                             queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item :label="$t('m.i.common.batchNo')" prop="batchNo">
                    <h-input v-model="formItem.batchNo"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.be.pledgorName')" prop="custName">
                    <h-input v-model="formItem.custName"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.be.pledgorBrchCode')" class="h-form-long-label" prop="custBrchCode">
                    <h-input v-model="formItem.custBrchCode"></h-input>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <span class="h-more-input" v-if="this.licenseFlag" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                                                     :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                    <h-button type="primary" @click="formSearch()">{{$t('m.i.common.search')}}</h-button>
                    <h-button type="ghost" @click="formSearchReset()">{{$t('m.i.common.reset')}}</h-button>
                  </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
              <h-datagrid :columns="columns"
                          highlight-row
                          :url="url+'/unImpawnApplyAccount/func_queryPendingApplyUnImpawnAccount'"
                          :bindForm="formItem"
                          :onCurrentChange="onCurrentChange"
                          :onCurrentChangeCancel="onCurrentChangeCancle"
                          ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="showAcctWin()" v-if="authObj.bizSetRoleDelete">{{$t('m.i.be.acct')}}</h-button>
                </div>
              </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="1000" height="400" class="h-form-table-layer"
               @on-close="handleWinClose" @on-maximize="onMaximize" :maximize="true" :mask-closable="false" :footerHide="true">
      <p slot="header">
        <span>查看批次明细信息</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="120" ref="viewForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType" >
            <h-select v-model="addForm.billType" readonly showTitle>
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass" >
            <h-select v-model="addForm.billClass" readonly showTitle>
              <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.pledgorName')" prop="custName" >
            <h-input v-model="addForm.custName" :maxlength=60 readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.pledgorBrchCode')" prop="custBrchCode" >
            <h-input v-model="addForm.custBrchCode" :maxlength=60 readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.applDt')" prop="unimpawnDt" >
            <h-date-picker v-model="addForm.unimpawnDt" :maxlength=60 type="date" readonly></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.custMgrNo')" prop="custMgrNo">
            <h-input v-model="addForm.custMgrNo" :maxlength=60 readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.pawneeBrchName')" prop="applBrchName" >
            <h-input v-model="addForm.applBrchName" :maxlength=60 readonly ></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
          <h-datagrid
            :columns="unImpawnBill.billColumns"
            url="pb/trust/unImpawn/unImpawnApplyAccount/func_queryUnImpawnApplyAcctBill"
            rowSelect
            :bindForm="formItem"
            :gridData="billList"
            :auto-load="false"
            :has-select="false"
            @on-page-change="handlePage"
            ref="datagridbill">
            <div slot="toolbar" class="pull-left">
              <h-dropdown v-show="type!=='view'" trigger="click" @on-click="account" >
                <h-button type="primary">{{$t('m.i.be.acct')}}<h-icon name="unfold"></h-icon>
                </h-button>
                <h-dropdown-menu slot="list">
                  <h-dropdown-item name="selectAccout">选择记账</h-dropdown-item>
                  <h-dropdown-item name="allAccout">批次记账</h-dropdown-item>
                </h-dropdown-menu>
              </h-dropdown>
            </div>
          </h-datagrid>
    </h-msg-box>

    <acct-record :param="param"
                 :showAcctRecordWin="showAcctRecordWin"
                 @showAcctRecordWinClose="showAcctRecordWinClose"
                 :submitFlag="this.acctSubmitFlag"
                 :showPrintButton="this.showPrintButton"
                 :url="acctRecord"
                 @printSuccessCallback="printSuccessCallback"
                 @acctSubmitSure="applyAccount">
    </acct-record>

    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="this.billId" :billRangeEnd = "this.billRangeEnd" :billRangeStart = "this.billRangeStart"></bill-info-main>

    <!--<show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true"
                         :checkStrictly="true"></show-license-branch>-->

  </div>
</template>

<script>
  import { post, on,off,formatNumber,formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "unImpawnApplyAccount",
    components: {
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)

    },
    data(){
      return {
        formItem: {
          billType:'',
          billClass:'',
          billStatus:'',
          applDate:'',
          batchNo : '',
          custName:'',
          custBrchCode:'',
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath: this.$route.path,
          funcNo: "PIPB031208",
          queryFlag:"2",
        },
        columns: [
          {
            title: ' ',
            type: "radio",
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
            title: this.$t('m.i.common.batchNo'),
            key: "batchNo",
            hiddenCol: false,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.showBillList(params.row);
                  }
                }
              }, params.row.batchNo);
            }
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            },
            sortable: true,
          },
          {
            title: this.$t('m.i.billInfo.billClass'),
            key: "billClass",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            },
            sortable: true
          },
          {
            title: this.$t('m.i.be.pledgorName'),
            key: "custName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.pledgorBrchCode'),
            key: "custBrchCode",

            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.sumMoney'),
            key: "sumMoney",

            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', formatNumber(params.row.sumMoney, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.totalCount'),
            key: "sumCount",

            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.applDt'),
            key: "unimpawnDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let unimpawnDt = this.$moment(params.row.unimpawnDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", unimpawnDt);
            },
          }
        ],
        addForm: {
          id:"",
          legalNo:"",
          memberId:"",
          transBrchNo:"",
          applBrchName:"",
          applBrchCode:"",
          billClass:"",
          billType:"",
          batchNo:"",
          transCtrctNo:"",
          trDir:"",
          custNo:"",
          custName:"",
          custBrchNo:"",
          custBrchCode:"",
          custBankNo:"",
          unimpawnDt:"",
          prodNo:"",
          acctTellerNo:"",
          checkTellerNo:"",
          applTellerName:"",
          checkTellerName:"",
          totalAmt:"",
          totalNum:"",
          createTime:"",
          updateTime:"",
          ownedBrchNo:"",
          ownedBrchName:"",
          licenseFlag:false,
          unImpawnIds:"",
          operType:"",
        },
        //给按钮增加权限
        authObj: {
          bizSetRoleAdd: true, //角色添加
          bizSetRoleDelete: true, //角色删除
          bizSetRoleORight: true, //角色操作权限
          bizSetRoleARight: true, //角色授权权限
          bizRoleRightSet: true, //角色权限处理
          bizRoleRightCopy: true, //角色权限复制
          bizSetRoleDownload: true, //角色信息下载
        },
        billTypeList: [],
        billClassList: [],
        batchStatusList: [],
        billStatusList: [],
        currentSelectRow: null,
        currentSelectBillList: [],
        ifShowMore: false,
        url: "pb/trust/unImpawn",
        cdMediaList: [],
        //授权信息
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
        //brchNoWin: false,
        // 是否显示新增或修改窗口
        addOrEditWin: false,
        brchCodeWin: false,
        custMgrNoWinOpen: false,
        type: null,
        readonly: false,
        isRequired: true,
        submitFlag: false,
        copyWin: false,
        dictMap: new Map(),
        id: '',
        unImpawnBill: {
          billColumns: [
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
              title: this.$t("m.i.billInfo.billOrigin"),   //票据来源
              key: "billOrigin",
              hiddenCol: false,
              render: (h, params) => {
                let list = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : this.getDictValueFromMap(this.dictMap, 'BillOrigin', params.row.billOrigin);
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
              }
            },
            {
              title: this.$t('m.i.billInfo.billPackageNo'), //票据（包）号码
              key: "billNo",
              hiddenCol: false,
              sortable: true,
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
              title: this.$t("m.i.billInfo.billRange"),   //子票区间
              key: "billRange",
              hiddenCol: false,
              render:(h,params) => {
                let billOrigin = params.row.billOrigin;
                let billRangeStart = params.row.billRangeStart;
                let billRangeEnd = params.row.billRangeEnd;
                return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
              }
            },
            {
              title: this.$t('m.i.billInfo.billPackageMoney'),   //票据(包)金额
              key: "billMoney",
              sortable: true,
              hiddenCol: false,
              render: (h, params) => {
                return h('span', formatNumber(params.row.billMoney, 2, ','))
              }
            },
            {
              title: this.$t("m.i.billInfo.flowStatus"),
              key: "flowStatusName",
              hiddenCol: false
            },
            {
              title: this.$t('m.i.billInfo.billType'),
              key: "billType",
              hiddenCol: false,
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
              title: this.$t('m.i.billInfo.billClass'),
              key: "billClass",
              hiddenCol: false,
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
              title: this.$t('m.i.billInfo.billMoney'),
              key: "billMoney",
              sortable: true,
              hiddenCol: false,render: (h, params) => {
                return h('span', formatNumber(params.row.billMoney, 2, ','))
              }
            },
            {
              title: this.$t('m.i.billInfo.dueDt'),
              key: "dueDt",
              sortable: true,
              hiddenCol: false,
              render: (h, params) => {
                let dueDt = this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
                return h("span", dueDt);
              }
            },
            {
              title: this.$t('m.i.billInfo.acptBankName'),
              key: "acptBankName",
              sortable: true,
              hiddenCol: false
            },
            {
              title: this.$t('m.i.be.unImpawnRemark'),
              key: "unImpawnRemark",
              hiddenCol: false
            }
          ]
        },
        brchCodeWinOpen: false,
        billList: [],
        showAcctRecordWin: false,
        acctRecord: "/pb/trust/unImpawn/unImpawnApplyAccount/func_queryAcctRecord",
        param: {},
        acctSubmitFlag: false,
        showPrintButton: false,
        showBillInfoWin: false,
        billId: null,
        billList:{
          list: [],
          pageInfo: {
            count: 0,
            pageNo: 1,
            pageSize: 10
          }
        },
        batchId:null
      }
    },
    methods :{
      onMaximize() {
        this.$refs.datagridbill.$refs.gridContent.handleResize();
      },
      // 分页事件
      handlePage(pageNo,pageSize){
        let obj=Object.assign({}, this.formItem, {batchId:this.batchId}, {pageNo:pageNo,pageSize:pageSize});
        this.queryBillList(obj);
        this.currentSelectBillList = [];
        this.$refs.datagridbill.selectIds = [];
        this.$refs.datagridbill.selects = [];
      },
      onCurrentChange(currentRow,oldCurrentRow,_index) {
        this.currentSelectRow = currentRow;
      },
      onCurrentChangeCancle(currentRow,oldCurrentRow,_index){
        this.currentSelectRow = null;
      },
      formSearch() {
        this.$refs.datagrid.dataChange(1);
        this.currentSelectRow = null;
      },
      formSearchReset() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.$refs.formItem.resetFields();
      },
      // 查询票据清单
      queryBillList(obj){
        if(this.isRollBack){
          post(obj,'pb/trust/unImpawn/unImpawnApplyAccount/func_queryUnImpawnApplyAcctBill').then(res=>{
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.billList= res.data.retData;
            }
          })
        }
      },
      /**超链接点击票号弹出票据明细**/
      showBillInfo(row) {
        this.billId = row.billId;
        this.billRangeStart = "";
        this.billRangeEnd = "";
        this.billRangeStart=row.billRangeStart;
        this.billRangeEnd=row.billRangeEnd;
        this.showBillInfoWin = true;
      },
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },

      /**超链接点击批次号弹出票据明细**/
      showBillList(list){
        this.type = 'acct';
        this.batchId = list.id;
        this.addForm.billType = list.billType;
        this.addForm.billClass = list.billClass;
        this.addForm.custName = list.custName;
        this.addForm.custBrchCode = list.custBrchCode;
        if(list.unimpawnDt){
          this.addForm.unimpawnDt = this.$moment(list.unimpawnDt, "YYYYMMDD").format("YYYY-MM-DD");
        } else {
          this.addForm.unimpawnDt = list.unimpawnDt;
        }
        this.addForm.custMgrNo = list.custMgrNo;
        this.addForm.applBrchName = list.applBrchName;
        this.authObj.bizSetRoleAdd = true;
        this.queryObjById(list.id,this.formItem.funcNo);
        this.addOrEditWin = true;
      },

      handleWinClose() {
        this.batchId = "";
        this.$refs.datagridbill.selects = [];
        this.$refs.addForm.resetFields();
        this.addOrEditWin = false;
      },
      account(obj) {
        this.addForm.operType
        this.currentSelectBillList = this.$refs.datagridbill.selects;
        if (obj == "selectAccout" && this.currentSelectBillList.length == 0) {
          this.$msgTip.info(this, { info: this.$t('m.i.common.chooseOneData') });
        } else {
          if (obj == "selectAccout" && this.currentSelectBillList.length == 0) {
            this.$msgTip.info(this, { info: this.$t('m.i.common.chooseOneData') });
          } else {
            if (obj === "selectAccout") {
              let list = this.currentSelectBillList;
              this.addForm.unImpawnIds = "";
              this.addForm.operType = "0";
              for (let i = 0; i < list.length; i++) {
                this.addForm.unImpawnIds += list[i].id;
                if (i < list.length - 1) {
                  this.addForm.unImpawnIds += ",";
                }
              }
            } else {
              this.addForm.unImpawnIds = null;
              this.addForm.operType = "1";
            }
            this.addForm.batchId = this.batchId;
            if (this.addForm.unimpawnDt) {
              this.addForm.unimpawnDt = this.$moment(this.addForm.unimpawnDt, "YYYYMMDD").format("YYYYMMDD");
            } else {
              this.addForm.unimpawnDt = this.addForm.unimpawnDt;
            }
            Object.assign(this.param,{"unImpawnIds":this.addForm.unImpawnIds,"batchId":this.addForm.batchId,
              ownedBrchNo:this.addForm.ownedBrchNo,licenseFlag:this.licenseFlag,"operType": this.addForm.operType});
            this.showAcctRecordWin = true;
          }
        }
      },
      // 关闭记账窗口
      showAcctRecordWinClose() {
        /*this.showPrintButton = false;
        this.param = {};
        this.currentSelectBillList = [];
        this.$refs.datagridbill.selectIds = [];
        this.$refs.datagridbill.selects = [];*/
        this.showAcctRecordWin = false;
      },
      showAcctWin(){
        this.type = "acct";
        if(this.currentSelectRow != null){
          this.addOrEditWin = true;
          this.addForm.billType = this.currentSelectRow.billType;
          this.addForm.billClass = this.currentSelectRow.billClass;
          this.addForm.custName = this.currentSelectRow.custName;
          this.addForm.custBrchCode = this.currentSelectRow.custBrchCode;
          if(this.currentSelectRow.unimpawnDt){
            this.addForm.unimpawnDt = this.$moment(this.currentSelectRow.unimpawnDt, "YYYYMMDD").format("YYYY-MM-DD");
          } else {
            this.addForm.unimpawnDt = this.currentSelectRow.unimpawnDt;
          }
          this.addForm.custMgrNo = this.currentSelectRow.custMgrNo;
          this.addForm.applBrchName = this.currentSelectRow.applBrchName;
          this.addForm.ownedBrchNo = this.currentSelectRow.transBrchNo;
          this.addForm.ownedBrchName = this.currentSelectRow.applBrchName;
          this.addForm.licenseFlag = this.licenseFlag;
          this.queryObjById(this.currentSelectRow.id,this.formItem.funcNo);
        }else{
          this.$msgTip.info(this,{info:this.$t('m.i.common.chooseOneData')});
        }
      },
      queryObjById(id,funcNo){
        this.batchId = id;
        post({batchId:id+"" ,funcNo:funcNo},"pb/trust/unImpawn/unImpawnApplyAccount/func_queryUnImpawnApplyAcctBill").then(res => {
          this.submitFlag = false;
          if(res){
            let retCode = res.data.retCode
            if(retCode==="000000"){
              this.billList = res.data.retData;
            }else{
              this.$msgTip.error(this,{info:res.data.retMsg});
            }
          }else{
            this.$msgTip.error(this,{info:this.$t('m.i.common.netError')});
          }
        });
      },
      applyAccount(info) {
        this.acctSubmitFlag = true;
        post(this.addForm, "pb/trust/unImpawn/unImpawnApplyAccount/func_accountApplyUnImpawnBill").then(res => {
          this.acctSubmitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = Object.assign(this.formItem, { batchId: this.batchId });
              this.queryBillList(obj);
              this.formSearch();
              this.$msgTip.info(this, { info: this.$t('m.i.be.acctSuccess') });
              this.showPrintButton = true;
              if(!info.isHasPrint) {
                this.showAcctRecordWinClose();
              }
              this.addOrEditWin = false;
            } else {
              this.$msgTip.error(this,{info:res.data.retMsg});
              this.showAcctRecordWinClose();
            }
          } else {
            this.$msgTip.error(this,{info:this.$t('m.i.common.netError')});
          }
          //this.$refs.datagridbill.dataChange(1);
          this.showAcctRecordWin = false;
        });

      },
      //打印成功回调
      printSuccessCallback() {
        this.showAcctRecordWinClose();
      },
      //根据弹框所选数据进行赋值
      /*brchNoChange(info) {
        let objs = [];
        if (info instanceof Array) {
          objs = info;
        } else {
          objs[0] = info;
        }
        let brchNos = "";
        let brchNames = "";
        for (var i = 0; i < objs.length; i++) {
          brchNos += objs[i].id + ",";
          brchNames += objs[i].title + ",";
        }
        this.formItem.ownedBrchNos = brchNos.substring(0, brchNos.length - 1);
        this.formItem.ownedBrchNames = brchNames.substring(0, brchNames.length - 1);
        this.brchNoWin = false;
      },
      brchNoWinOpen() {
        this.brchNoWin = true;
      },
      brchNoWinClose() {
        this.brchNoWin = false;
      },*/
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,CDMedia,BarterTrustStatus,BillOrigin").then(res => {
        this.billClassList = res.get("CDMedia");
        this.billTypeList = res.get("DraftTypeCode");
        this.billStatusList=res.get("BarterTrustStatus");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });

      post({ authPath: this.$route.path }, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            if (this.licenseFlag) {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
            } else {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", true);
            }
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    }
  };
</script>

<style scoped>

</style>
