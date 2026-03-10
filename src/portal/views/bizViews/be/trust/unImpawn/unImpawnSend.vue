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
            :url="url + '/unImpawnSend/func_queryPendingApplyUnImpawnSend'"
            :bindForm="formItem"
            :onCurrentChange="onCurrentChange"
            :onCurrentChangeCancel="onCurrentChangeCancle"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleSend()">{{$t('m.i.common.send')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--发送弹出窗-->
    <h-msg-box v-model="sendWin" width="1000" height="400" class="h-form-table-layer"
               @on-close="sendWinClose" @on-maximize="onMaximize" :maximize="true" :mask-closable="false"
               :footerHide="true">
      <p slot="header">
        <span v-if="type!=='view'">发送申请</span>
        <span v-else>查看批次明细信息</span>
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
          <h-form-item :label="$t('m.i.common.applDt')" prop="unimpawnDt">
            <h-date-picker v-model="viewForm.unimpawnDt" :maxlength=60 type="date" readonly></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.custMgrNo')" prop="custMgrNo">
            <h-input v-model="viewForm.custMgrNo" :maxlength=60 readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.pawneeBrchName')" prop="applBrchName">
            <h-input v-model="viewForm.applBrchName" :maxlength=60 readonly></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <h-datagrid :columns="unImpawnBill.billColumns"
                  rowSelect
                  :gridData="billList"
                  @on-page-change="handlePage"
                  :has-select="false"
                  ref="datagridbill">
        <div slot="toolbar" class="pull-left">
          <h-dropdown v-show="type!=='view'" trigger="click" @on-click="send">
            <h-button type="primary">{{$t('m.i.be.sendApply')}}
              <h-icon name="unfold"></h-icon>
            </h-button>
            <h-dropdown-menu slot="list">
              <h-dropdown-item name="selectSend">选择发送</h-dropdown-item>
              <h-dropdown-item name="listSend">批次发送</h-dropdown-item>
            </h-dropdown-menu>
          </h-dropdown>
          <h-dropdown v-show="type!=='view'" trigger="click" @on-click="back">
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

    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="this.billId" :billRangeEnd = "this.billRangeEnd" :billRangeStart = "this.billRangeStart"></bill-info-main>

    <!--<show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true"
                         :checkStrictly="true"></show-license-branch>-->

  </div>
</template>

<script>
  import { post, on, off,formatNumber,formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "unImpawnSend",
    components: {
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)

    },
    data() {
      return {
        type: null,
        formItem: {
          batchNo: "",
          custName: "",
          custBrchCode: "",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath: this.$route.path,
          funcNo: "PIPB031206",
          queryFlag:"2",
        },
        addForm: {
          id: "",
          batchId: "",
          billIdsStr: "",
          ownedBrchNo:"",
          ownedBrchName:"",
          licenseFlag:false,
          unImpawnIds:"",
          isPass:"",
        },
        viewForm: {
          billType: "",
          billClass: "",
          custName: "",
          custBrchCode: "",
          unimpawnDt: "",
          custMgrNo: "",
          applBrchName: "",
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
            sortable: true
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
            key: "unimpawnDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let unimpawnDt = this.$moment(params.row.unimpawnDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", unimpawnDt);
            }
          }
        ],
        billTypeList: [],
        billClassList: [],
        currentSelectRow: null,
        currentSelectBillList: [],
        dictMap: new Map(),
        sendWin: false,
        ifShowMore: false,
        showBillInfoWin: false,
        billId: null,
        //授权信息
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
        //brchNoWin: false,
        url: "pb/trust/unImpawn",
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
            // {
            //   title: this.$t('m.i.billInfo.billMoney'),
            //   key: "billMoney",
            //   sortable: true,
            //   hiddenCol: false,
            //   render: (h, params) => {
            //     return h('span', formatNumber(params.row.billMoney, 2, ','))
            //   }
            // },
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
      onCurrentChange(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = currentRow;
      },
      onCurrentChangeCancle(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = null;
      },
      sendWinOpen() {
        this.sendWin = true;
      },
      sendWinClose() {
        this.$refs.datagridbill.selects = [];
        this.sendWin = false;
        this.$refs.viewForm.resetFields();
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
        this.type = "send";
        this.batchId = list.id
        this.viewForm.billType = list.billType;
        this.viewForm.billClass = list.billClass;
        this.viewForm.custName = list.custName;
        this.viewForm.custBrchCode = list.custBrchCode;
        if (list.unimpawnDt) {
          this.viewForm.unimpawnDt = this.$moment(list.unimpawnDt, "YYYYMMDD").format("YYYY-MM-DD");
        } else {
          this.viewForm.unimpawnDt = list.unimpawnDt;
        }
        this.viewForm.custMgrNo = list.custMgrNo;
        this.viewForm.applBrchName = list.applBrchName;
        this.queryBillByBatchId(list.id);
        this.sendWinOpen();
      },
      handleSend() {
        this.type = "send";
        let row = this.currentSelectRow;
        if (row != null) {
          this.batchId = this.currentSelectRow.id;
          this.addForm.ownedBrchNo = row.transBrchNo;
          this.addForm.ownedBrchName = row.applBrchName;
          this.addForm.licenseFlag = this.licenseFlag;
          this.queryBatchById(this.batchId);
          this.queryBillByBatchId(this.batchId);
          this.sendWinOpen();
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      // 查询批次信息
      queryBatchById(id) {
        post({ id: id + "" }, this.url + "/unImpawnApply/func_getUnImpawnBatchById").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.viewForm.billType = res.data.retData.billType;
              this.viewForm.billClass = res.data.retData.billClass;
              this.viewForm.custName = res.data.retData.custName;
              this.viewForm.custBrchCode = res.data.retData.custBrchCode;
              if (res.data.retData.unimpawnDt) {
                this.viewForm.unimpawnDt = this.$moment(res.data.retData.unimpawnDt, "YYYYMMDD").format("YYYY-MM-DD");
              } else {
                this.viewForm.unimpawnDt = res.data.retData.unimpawnDt;
              }
              this.viewForm.custMgrNo = res.data.retData.custMgrNo;
              this.viewForm.applBrchName = res.data.retData.applBrchName;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.sendWinClose();
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            this.sendWinClose();
          }
        });
      },
      // 查询批次票据明细
      queryBillByBatchId(id) {
        let obj = Object.assign({}, this.formItem, { batchId: id }, { pageNo: 1, pageSize: 10 });
        post(obj, this.url + "/unImpawnSend/func_queryUnImpawnApplySendBill").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.billList = res.data.retData;
              this.currentSelectBillList = [];
              this.$refs.datagridbill.selectIds = [];
              this.$refs.datagridbill.selects = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.sendWinClose();
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            this.sendWinClose();
          }
        });
      },
      // 分页事件
      handlePage(pageNo, pageSize) {
        let obj = Object.assign({}, this.formItem, { batchId: this.batchId }, { pageNo: pageNo, pageSize: pageSize });
        this.queryBillList(obj);
        this.currentSelectBillList = [];
        this.$refs.datagridbill.selectIds = [];
        this.$refs.datagridbill.selects = [];
      },
      // 查询票据清单
      queryBillList(obj) {
        post(obj, this.url + "/unImpawnSend/func_queryUnImpawnApplySendBill").then(res => {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.billList = res.data.retData;
          }
        });
      },
      //发送
      send(obj) {
        this.currentSelectBillList = this.$refs.datagridbill.selects;
        if (obj === "selectSend" && this.currentSelectBillList.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        } else {
          if (obj === "selectSend") {
            let list = this.currentSelectBillList;
            this.addForm.unImpawnIds = "";
            for (let i = 0; i < list.length; i++) {
              this.addForm.unImpawnIds += list[i].id;
              if (i < list.length - 1) {
                this.addForm.unImpawnIds += ",";
              }
            }
          } else {
            this.addForm.unImpawnIds = null;
          }
          this.addForm.batchId = this.batchId;
          this.addForm.isPass = "1";
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmSend") + "?",
            onOk: () => {
              post(this.addForm, this.url + "/unImpawnSend/func_sendApplyUnImpawnBatch").then(res => {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode === "000000") {
                    this.$msgTip.success(this, { info: this.$t("m.i.be.sendSuccess") });
                    this.sendWinClose();
                    this.formSearch();
                    this.currentSelectBillList = [];
                    this.$refs.datagridbill.selectIds = [];
                    this.$refs.datagridbill.selects = [];
                    this.addForm.unImpawnIds = "";
                    this.addForm.isPass = "";
                  } else {
                    this.$msgTip.error(this, { info: res.data.retMsg });
                    this.$refs.datagrid.dataChange(1);
                    this.addForm.unImpawnIds = "";
                    this.addForm.isPass = "";
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
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
            let list = this.currentSelectBillList;
            this.addForm.unImpawnIds = "";
            for (let i = 0; i < list.length; i++) {
              this.addForm.unImpawnIds += list[i].id;
              if (i < list.length - 1) {
                this.addForm.unImpawnIds += ",";
              }
            }
          } else {
            this.addForm.unImpawnIds = null;
          }
          this.addForm.batchId = this.batchId;
          this.addForm.isPass = "0";
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmBack") + "?",
            onOk: () => {
              post(this.addForm, this.url + "/unImpawnSend/func_backUnImpawnApplyBatch").then(res => {
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
                    this.addForm.unImpawnIds = "";
                    this.addForm.isPass = "";
                    this.sendWinClose();
                  } else {
                    this.$msgTip.error(this, { info: this.$t("m.i.be.backFailed") + res.data.retMsg });
                    this.$refs.datagridbill.dataChange(1);
                    this.addForm.unImpawnIds = "";
                    this.addForm.isPass = "";
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                }
              });
            }
          });
        }
      },

     /* //根据弹框所选数据进行赋值
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
