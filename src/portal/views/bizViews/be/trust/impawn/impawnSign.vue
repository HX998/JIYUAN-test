<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
               <!-- <h-form-item :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" v-if="this.licenseFlag">
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
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            :url="url + 'impawnConfirm/func_queryPendingImpawnSignBatch'"
            :bindForm="formItem"
            :onCurrentChange="onCurrentChange"
            :onCurrentChangeCancel="onCurrentChangeCancle"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleSign()">{{$t('m.i.be.sign')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--签收弹出窗-->
    <h-msg-box v-model="signWin" width="1000" height="400" class="h-form-table-layer"
               @on-close="signWinClose" @on-maximize="onMaximize" :maximize="true" :mask-closable="false"
               :footerHide="true">
      <p slot="header">
        <span>签收明细信息</span>
      </p>
      <h-panel>
        <h-form :model="viewForm" :label-width="120" ref="viewForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
            <h-select v-model="viewForm.billType" readonly showTitle>
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass">
            <h-select v-model="viewForm.billClass" readonly showTitle>
              <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.pledgorName')" prop="custName">
            <h-input v-model="viewForm.custName" :maxlength=60 readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.pledgorBrchCode')" prop="custBrchCode">
            <h-input v-model="viewForm.custBrchCode" :maxlength=60 readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.applDt')" prop="impawnDt">
            <h-date-picker v-model="viewForm.impawnDt" :maxlength=60 type="date" readonly></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.custMgrNo')" prop="custMgrNo">
            <h-input v-model="viewForm.custMgrNo" :maxlength=60 readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.pawneeBrchName')" prop="applBrchName">
            <h-input v-model="viewForm.applBrchName" :maxlength=60 readonly></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <h-datagrid :columns="impawnBill.billColumns"
                  highlight-row
                  :gridData="billList"
                  :bindForm="formItem"
                  @on-page-change="handlePage"
                  :auto-load="false"
                  :hasSelect="false"
                  :row-select="true"
                  ref="datagridbill">
        <div slot="toolbar" class="pull-left">
          <h-dropdown trigger="click" @on-click="sign" v-if="authObj.bizSetRoleAdd">
            <h-button type="primary">{{$t('m.i.be.sign')}}
              <h-icon name="unfold"></h-icon>
            </h-button>
            <h-dropdown-menu slot="list">
              <h-dropdown-item name="selectSign">选择签收</h-dropdown-item>
              <h-dropdown-item name="listSign">批次签收</h-dropdown-item>
            </h-dropdown-menu>
          </h-dropdown>
          <h-dropdown trigger="click" @on-click="back" v-if="authObj.bizSetRoleAdd">
            <h-button type="primary">{{$t('m.i.be.returnBack')}}
              <h-icon name="unfold"></h-icon>
            </h-button>
            <h-dropdown-menu slot="list">
              <h-dropdown-item name="selectBack">选择退回</h-dropdown-item>
              <h-dropdown-item name="listBack">批次退回</h-dropdown-item>
            </h-dropdown-menu>
          </h-dropdown>
        </div>
      </h-datagrid>
    </h-msg-box>

    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billRangeEnd = "this.billRangeEnd" :billRangeStart = "this.billRangeStart"></bill-info-main>


    <!--<show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true"
                         :checkStrictly="true"></show-license-branch>-->

  </div>
</template>

<script>
  import { post, on, off,formatNumber,formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "impawnSign",
    components: {
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)

    },
    data() {
      return {
        formItem: {
          billNo: "",
          billType: "",
          billMoney: "",
          maxBillMoney: "",
          minBillMoney: "",
          dueDt: "",
          minDueDt: "",
          maxDueDt: "",
          billClass: "",
          batchNo: "",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath: this.$route.path,
          queryFlag: "1",
          funcNo: "PIPB030106",
          custName: "",
          custBrchCode: "",
        },
        addForm: {
          id: "",
          legalNo: "",
          memberId: "",
          transBrchNo: "",
          brchName: "",
          applBrchCode: "",
          busiBatchNo: "",
          transCtrctNo: "",
          trDir: null,
          custNo: "",
          custName: "",
          custBrchNo: "",
          custBrchCode: "",
          custBankNo: "",
          impawnDt: "",
          prodNo: "",
          acctTellerNo: "",
          checkTellerNo: "",
          applTellerName: "",
          checkTellerName: "",
          totalAmt: "",
          totalNum: "",
          createTime: "",
          updateTime: "",
          billNo: "",
          billClass: "",
          billType: "",
          billMoney: "",
          remitDt: "",
          dueDt: "",
          drwrName: "",
          acptName: "",
          impawnRemark: "",
          ownedBrchNo:"",
          ownedBrchName:"",
          licenseFlag:false,
          batchId: "",
          operType: "1",
          impawnIds: "",
        },
        viewForm: {
          billType: "",
          billClass: "",
          custName: "",
          custBrchCode: "",
          impawnDt: "",
          custMgrNo: "",
          applBrchName: ""
        },
        columns: [
          {
            title: " ",
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
              return h("a", {
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
            title: this.$t('m.i.be.pledgorName'),
            key: "custName",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.be.pledgorBrchCode'),
            key: "custBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.sumMoney'),
            key: "sumMoney",
            sortable: true,
            hiddenCol: false,
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
            key: "impawnDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let impawnDt = this.$moment(params.row.impawnDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", impawnDt);
            }
          }
        ],
        //给按钮增加权限
        authObj: {
          bizSetRoleAdd: true, //角色添加
          bizSetRoleDelete: true, //角色删除
          bizSetRoleORight: true, //角色操作权限
          bizSetRoleARight: true, //角色授权权限
          bizRoleRightSet: true, //角色权限处理
          bizRoleRightCopy: true, //角色权限复制
          bizSetRoleDownload: true //角色信息下载
        },
        billTypeList: [],
        billClassList: [],
        currentSelectRow: [],
        currentSelectBillList: [],
        dictMap: new Map(),
        ifShowMore: false,
        signWin: false,
        showBillInfoWin: false,
        billId: null,
        billRangeStart:"",
        billRangeEnd:"",
        //授权信息
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
       // brchNoWin: false,
        url: "pb/trust/impawn/",
        impawnBill: {
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
              title: this.$t('m.i.billInfo.dueDt'),
              key: "dueDt",
              hiddenCol: false,
              sortable: true,
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
            // {
            //   title: this.$t('m.i.be.reqRemark'),
            //   key: "impawnRemark",
            //   hiddenCol: false
            // },
            {
              title: this.$t('m.i.be.respRemark'),
              key: "respRemark",
              hiddenCol: false
            }
          ]
        },
        billList: {
          list: [],
          pageInfo: {
            count: 0,
            pageNo: 1,
            pageSize: 10
          }
        },
        batchId: null
      };
    },
    methods: {
      onMaximize() {
        this.$refs.datagridbill.$refs.gridContent.handleResize();
      },
      /*汇票到期日*/
      dueDtChange() {
        if (this.formItem.dueDt != null && this.formItem.dueDt.length === 2) {
          this.formItem.minDueDt = this.formItem.dueDt[0].replace(/-/g, "");
          this.formItem.maxDueDt = this.formItem.dueDt[1].replace(/-/g, "");
        } else {
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
        }

      },
      formSearch() {
        this.currentSelectRow = null;
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.formItem.maxBillMoney = null;
        this.formItem.minBillMoney = null;
        this.formItem.minDueDt = null;
        this.formItem.maxDueDt = null;
        this.$refs.formItem.resetFields();
      },
      onCurrentChange(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = currentRow;
      },
      onCurrentChangeCancle(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = null;
      },
      signWinOpen() {
        this.signWin = true;
      },
      signWinClose() {
        this.$refs.datagridbill.selects = [];
        this.signWin = false;
      },
      handleSign() {
        if (this.currentSelectRow != null && this.currentSelectRow.id != null) {
          this.authObj.bizSetRoleAdd = true;
          this.batchId = this.currentSelectRow.id;
          this.addForm.ownedBrchNo = this.currentSelectRow.transBrchNo;
          this.addForm.ownedBrchName = this.currentSelectRow.applBrchName;
          this.addForm.licenseFlag = this.licenseFlag;
          this.queryBatchById(this.batchId);
          this.queryBillByBatchId(this.batchId);
          this.signWinOpen();
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      // 查询批次明细
      queryBatchById(id) {
        post({ id: id + "" }, "pb/trust/impawn/impawnApply/func_getImpawnBatchById").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.viewForm.billType = res.data.retData.billType;
              this.viewForm.billClass = res.data.retData.billClass;
              this.viewForm.custName = res.data.retData.custName;
              this.viewForm.custBrchCode = res.data.retData.custBrchCode;
              if (res.data.retData.impawnDt) {
                this.viewForm.impawnDt = this.$moment(res.data.retData.impawnDt, "YYYYMMDD").format("YYYY-MM-DD");
              } else {
                this.viewForm.impawnDt = res.data.retData.impawnDt;
              }
              this.viewForm.custMgrNo = res.data.retData.custMgrNo;
              this.viewForm.applBrchName = res.data.retData.applBrchName;
            } else {
              this.$refs.datagrid.dataChange(1);
              this.submitMsg = "查询批次信息失败";
              this.retMsg = res.data.retMsg;
              this.signWinClose();
            }
          } else {
            this.submitMsg = "查询批次信息失败";
            this.retMsg = this.$t("m.i.common.netError");
            this.signWinClose();
          }
        });
      },
      // 查询批次票据明细
      queryBillByBatchId(id) {
        let obj = Object.assign({}, this.formItem, { batchId: id }, { pageNo: 1, pageSize: 10 });
        post(obj, "pb/trust/impawn/impawnSign/func_queryImpawnSignSendBill").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.billList = res.data.retData;
            } else {
              this.$refs.datagrid.dataChange(1);
              this.submitMsg = "查询票据明细失败";
              this.retMsg = res.data.retMsg;
              this.signWinClose();
            }
          } else {
            this.submitMsg = "查询票据明细失败";
            this.retMsg = this.$t("m.i.common.netError");
            this.signWinClose();
          }
        });
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
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },

      /**超链接点击批次号弹出票据明细**/
      showBillList(list) {
        this.batchId = list.id
        this.viewForm.billType = list.billType;
        this.viewForm.billClass = list.billClass;
        this.viewForm.custName = list.custName;
        this.viewForm.custBrchCode = list.custBrchCode;
        if (list.impawnDt) {
          this.viewForm.impawnDt = this.$moment(list.impawnDt, "YYYYMMDD").format("YYYY-MM-DD");
        } else {
          this.viewForm.impawnDt = list.impawnDt;
        }
        this.viewForm.custMgrNo = list.custMgrNo;
        this.viewForm.applBrchName = list.applBrchName;
        this.queryBillByBatchId(list.id);
        this.authObj.bizSetRoleAdd = true;
        this.isRequired = false;
        this.readonly = true;
        this.signWin = true;
      },
      // 分页事件
      handlePage(pageNo, pageSize) {
        let obj = Object.assign({}, this.formItem, { batchId: this.batchId }, { pageNo: pageNo, pageSize: pageSize });
        this.queryBillList(obj);
      },
      // 查询票据清单
      queryBillList(obj) {
        post(obj, this.url + "impawnSign/func_queryImpawnSignSendBill").then(res => {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.billList = res.data.retData;
          }
        });
      },
      /**签收**/
      sign(obj) {
        this.currentSelectBillList = this.$refs.datagridbill.selects;
        if (obj === "selectSign" && this.currentSelectBillList.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        } else {
          if (obj === "selectSign") {
            this.addForm.impawnIds = "";
            //operType 操作类型 1 批次  0 选择
            this.addForm.operType = "0";
            let list = this.currentSelectBillList;
            for (let i = 0; i < list.length; i++) {
              this.addForm.impawnIds += list[i].id;
              if (i < list.length - 1){
                this.addForm.impawnIds += ",";
              }
            }
          } else {
            this.addForm.impawnIds = null;
            this.addForm.operType = "1";
          }
          this.addForm.batchId = this.batchId;
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmSend") + "?",
            onOk: () => {
              post(this.addForm, this.url + "impawnSign/func_submitImpawnSignBatch").then(res => {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode === "000000") {
                    this.$msgTip.success(this, { info: this.$t("m.i.be.signSuccess") });
                    this.signWinClose();
                    this.$refs.datagrid.dataChange(1);
                    this.currentSelectRow = [];
                    this.currentSelectBillList = [];
                    this.$refs.datagridbill.selectIds = [];
                    this.$refs.datagridbill.selects = [];
                    this.addForm.impawnIds = null;
                  } else {
                    this.$msgTip.error(this, { info: this.$t("m.i.be.signFailed") + res.data.retMsg });
                    this.$refs.datagridbill.dataChange(1);
                    this.addForm.impawnIds = null;
                  }
                } else {
                  this.currentSelectBillList = [];
                  this.$refs.datagridbill.selectIds = [];
                  this.$refs.datagridbill.selects = [];
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                  this.addForm.impawnIds = null;
                }
              });
            }
          });
        }
      },
      /**退回**/
      back(obj) {
        this.currentSelectBillList = this.$refs.datagridbill.selects;
        if (obj === "selectBack" && this.currentSelectBillList.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        } else {
          if (obj === "selectBack") {
            this.addForm.impawnIds = "";
            //operType 操作类型 1 批次  0 选择
            this.addForm.operType = "0";
            let list = this.currentSelectBillList;
            for (let i = 0; i < list.length; i++) {
              this.addForm.impawnIds += list[i].id;
              if (i < list.length - 1) {
                this.addForm.impawnIds += ",";
              }
            }
          } else {
            this.addForm.impawnIds = null;
            this.addForm.operType = "1";
          }
          this.addForm.batchId = this.batchId;
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmBack") + "?",
            onOk: () => {
              post(this.addForm, this.url + "impawnSign/func_backImpawnSignBatch").then(res => {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode === "000000") {
                    this.$msgTip.success(this, { info: this.$t("m.i.be.backSuccess") });
                    let obj = Object.assign(this.formItem, { batchId: this.batchId });
                    this.queryBillList(obj);
                    this.$refs.datagrid.dataChange(1);
                    this.currentSelectRow = [];
                    this.currentSelectBillList = [];
                    this.$refs.datagridbill.selectIds = [];
                    this.$refs.datagridbill.selects = [];
                    this.addForm.impawnIds = null;
                    this.signWinClose();
                  } else {
                    this.$msgTip.error(this, { info: this.$t("m.i.be.backFailed") + res.data.retMsg });
                    this.$refs.datagridbill.dataChange(1);
                    this.currentSelectRow = [];
                    this.currentSelectBillList = [];
                    this.$refs.datagridbill.selectIds = [];
                    this.$refs.datagridbill.selects = [];
                    this.addForm.impawnIds = null;
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                  this.addForm.impawnIds = null;
                }
              });
            }
          });
        }
      },

    /*  //根据弹框所选数据进行赋值
      brchNoChange(info) {
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
      this.getDictListByGroups("DraftTypeCode,CDMedia,BillOrigin").then(res => {
        this.billClassList = res.get("CDMedia");
        this.billTypeList = res.get("DraftTypeCode");
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
