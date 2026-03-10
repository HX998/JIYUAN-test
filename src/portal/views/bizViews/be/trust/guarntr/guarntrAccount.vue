<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <!--批次页面-->
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
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="" showTitle>
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value}}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass">
                  <h-select v-model="formItem.billClass" placeholder="" showTitle>
                    <h-option v-for="item in cdMediaList" :value="item.key" :key="item.key">{{item.value}}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.applDt')" prop="applDate">
                  <h-date-picker type="daterange" autoPlacement placeholder="" :value="applDate" :showFormat="true"
                                 format="yyyy-MM-dd" @on-change="handleApplDateChange"></h-date-picker>
                </h-form-item>
                <h-input v-if="false" v-model="formItem.queryType"
                         placeholder="查询方式：1、保证确认 2、保证确认发送 3、保证确认记账"></h-input>
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
            url="/bp/guaranty/sign/func_querySignGuarntyBatch"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="showAcctWin()">{{$t('m.i.be.acct')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--点击查看弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="1000" height="400" class="h-form-table-layer"
               @on-close="handleWinClose" :maximize="true" @on-maximize="onMaximize">
      <p slot="header">
        <span v-if="type=='view'">查看票据信息</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="120" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType" :required="isRequired">
            <h-select v-if="type=='view'" :disabled=true :value="addForm.billType" class="input-boder-0"
                      :title="addForm.billType">
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value}}</h-option>
            </h-select>
            <h-select v-else v-model="addForm.billType" placeholder="" showTitle>
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value}}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass" :required="isRequired">
            <h-select v-if="type=='view'" :disabled=true :value="addForm.billClass" class="input-boder-0"
                      :title="addForm.billClass">
              <h-option v-for="item in cdMediaList" :value="item.key" :key="item.key">{{item.value}}</h-option>
            </h-select>
            <h-select v-else v-model="addForm.billClass" placeholder="" showTitle>
              <h-option v-for="item in cdMediaList" :value="item.key" :key="item.key">{{item.value}}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.warranteeName')" prop="custName" :required="isRequired">
            <h-input v-if="type=='view'" :disabled=true :value="addForm.custName" class="input-boder-0"
                     :title="addForm.custName"></h-input>
            <h-input v-else v-model="addForm.custName" :maxlength=60 readonly
                     icon="android-search" @on-click="brchCodeWinOpen"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.warranteeBrchCode')" prop="custBrchCode" :required="isRequired">
            <h-input v-if="type=='view'" :disabled=true :value="addForm.custBrchCode" class="input-boder-0"
                     :title="addForm.custBrchCode"></h-input>
            <h-input v-else v-model="addForm.custBrchCode" :maxlength=60 readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.applDt')" prop="applDt" :required="isRequired">
            <h-date-picker v-if="type=='view'" :disabled=true :value="addForm.applDt" class="input-boder-0"
                           :title="addForm.applDt" type="date"></h-date-picker>
            <h-date-picker v-else v-model="addForm.applDt" :maxlength=60 type="date" placeholder=""></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.custMgrNo')" prop="custMgrNo">
            <h-input v-if="type=='view'" :disabled=true :value="addForm.custMgrNo" class="input-boder-0"
                     :title="addForm.custMgrNo"></h-input>
            <h-input v-else v-model="addForm.custMgrNo" :maxlength=60 readonly
                     icon="android-search" @on-click="showCustManagerWinOpen"></h-input>
          </h-form-item>

        </h-form>
      </h-panel>
      <h-form :model="billManageFormItem" :label-width="120" ref="billManageFormItem" cols="2" class="h-form-search">
        <h-input v-if="false" v-model="billManageFormItem.batchId" placeholder="批次id"></h-input>
        <h-input v-if="false" v-model="billManageFormItem.queryType"
                 placeholder="查询方式：1、保证确认 2、保证确认发送 3、保证确认记账"></h-input>
      </h-form>
      <h-datagrid
        :columns="guarntrBill.billColumns"
        highlight-row
        url="bp/guaranty/sign/func_queryBatchBillByPage"
        :bindForm="billManageFormItem"
        :row-select="true"
        :has-select="false"
        :auto-load="false"
        @on-page-change="handlePage"
        ref="datagridbill">
        <div slot="toolbar" class="pull-left">
          <h-dropdown trigger="click" @on-click="account">
            <h-button type="primary">{{$t('m.i.be.acct')}}
              <h-icon name="unfold"></h-icon>
            </h-button>
            <h-dropdown-menu slot="list">
              <h-dropdown-item name="selectAccout">选择记账</h-dropdown-item>
              <h-dropdown-item name="allAccout">批次记账</h-dropdown-item>
            </h-dropdown-menu>
          </h-dropdown>
        </div>
      </h-datagrid>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
      </div>
    </h-msg-box>

    <acct-record :param="this.param"
                 :showAcctRecordWin="this.showAcctRecordWin"
                 :showPrintButton="this.showPrintButton"
                 @showAcctRecordWinClose="showAcctRecordWinClose"
                 :url="this.acctRecord"
                 @acctSubmitSure="applyAccount"
                 @printSuccessCallback="printSuccessCallback">
    </acct-record>

    <!--<show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true"
                         :checkStrictly="true"></show-license-branch>-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>

  </div>
</template>

<script>
  import { post, on, off,formatNumber ,formatBillRange} from "@/api/bizApi/commonUtil";

  export default {
    name: "guarntrAccount",
    components: {
     // ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)

    },
    data() {
      return {
        formItem: {
          billNo: "",
          billType: "",
          billMoney: "",
          dueDt: "",
          applDate: "",
          minApplDt: "",
          maxApplDt: "",
          billClass: "",
          queryType: "3",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          funcNo:"PIPB010205",
          authPath: this.$route.path,
        },
        addForm: {
          id: "",
          legalNo: "",
          memberId: "",
          transBrchNo: "",
          brchName: "",
          applBrchCode: "",
          billClass: "ME01",
          billType: "AC01",
          busiBatchNo: "",
          transCtrctNo: "",
          trDir: "",
          custNo: "",
          custName: "",
          custBrchNo: "",
          custBrchCode: "",
          custBankNo: "",
          applDt: "",
          prodNo: "",
          acctTellerNo: "",
          checkTellerNo: "",
          applTellerName: "",
          checkTellerName: "",
          totalAmt: "",
          totalNum: "",
          createTime: "",
          updateTime: "",
          ownedBrchNo:"",
          ownedBrchName:"",
          licenseFlag:false,
        },
        applDate:[],
        columns: [
          {
            type: "radio",
            title: " ",
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
            title: this.$t('m.i.be.warranteeName'),
            key: "custName",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.be.warranteeBrchCode'),
            key: "custBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.sumMoney'),
            key: "totalAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.totalAmt, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.totalCount'),
            key: "totalNum",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.applDt'),
            key: "applDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let applDt = this.$moment(params.row.applDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", applDt);
            }
          }
        ],
        billManageFormItem: {
          billNo: "",
          batchId: "",
          funcNo: "PIPB010205",
          queryType: "3"
        },
        billTypeList: [],
        cdMediaList: [],
        billOriginList:[],
        dictMap: new Map(),
        ifShowMore: false,
        type: "view",
        readonly: true,
        isRequired: false,
        viewWin: false,
        guarntrBill: {
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
              title: this.$t("m.i.billInfo.billOrigin"),
              key: 'billOrigin',
              render: (h, params) => {
                let list =  (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : this.getDictValueFromMap(this.dictMap, "BillOrigin", params.row.billOrigin);
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
              }
            },
            {
              title: this.$t("m.i.billInfo.billPackageNo"),
              key: "billNo",
              ellipsis: false,
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                let billNo = params.row.billNo;
                return h("a", {
                  on: {
                    click: () => {
                      this.showBillInfo(params.row);
                    }
                  }
                }, billNo);
              }
            },
            //子票区间列
            {
              title: this.$t("m.i.billInfo.billRange"),
              align:'center',
              key:"billRange",
              hiddenCol: false,
              render:(h,params) => {
                return h("span",formatBillRange(params.row.billOrigin,params.row.billRangeStart,params.row.billRangeEnd));
              }
            },
            {
              title: this.$t("m.i.billInfo.billPackageMoney"),
              key: "billMoney",
              hiddenCol: false,
              ellipsis: false,
              sortable: true,
              render: (h, params) => {
                let billMoney = formatNumber(params.row.billMoney, 2, ",");
                return h("span", {
                  domProps: {
                    title: billMoney
                  }
                }, billMoney);
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
            }
          ]
        },
        currentSelectRow: [],
        // 对于单页面，2个窗口的grid, 临时存放父窗口的选择记录
        tmpSelectList: [],
        brchCodeWinOpen: false,
        showAcctRecordWin: false,
        showPrintButton: false,
        //授权信息
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
        //brchNoWin: false,
        acctRecord: "/bp/guaranty/sign/func_getBatchRecord",
        param: {},
        addOrEditWin: false,
        billList: {
          list: [],
          pageInfo: {
            count: 0,
            pageNo: 1,
            pageSize: 10
          }
        },
        batchId: null,
        showBillInfoWin:false,
        billId:"",
        billNo:""
      };
    },
    methods: {
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showBillInfo(row){
        this.billId = row.billId;
        this.billRangeStart = row.billRangeStart;
        this.billRangeEnd = row.billRangeEnd;
        this.showBillInfoWin = true;
      },
      onMaximize() {
        this.$refs.datagridbill.$refs.gridContent.handleResize();
      },
      // 分页事件
      handlePage(pageNo, pageSize) {
        let obj = Object.assign({}, this.formItem, { batchId: this.batchId }, { pageNo: pageNo, pageSize: pageSize });
        this.queryBillList(obj);
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      formSearch() {

        this.$refs.datagrid.dataChange(1);
        this.dataSelectReset();
      },
      handleApplDateChange(arr){
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
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.applDate = [];
        this.$refs.formItem.resetFields();
      },
      // 查询票据清单
      queryBillList(obj) {
        if (this.isRollBack) {
          post(obj, "bp/guaranty/sign/func_queryBatchBillByPage").then(res => {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.billList = res.data.retData;
            }
          });
        }
      },
      /* 记账弹窗 */
      account(obj) {
        this.tmpSelectList = this.$refs.datagridbill.selects;
        if (obj == "selectAccout" && this.tmpSelectList.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
        } else {
          if (obj == "selectAccout" && this.tmpSelectList.length == 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          } else {
            if (obj === "selectAccout") {
              this.addForm.listIds = [];
              for (let selectRow of this.tmpSelectList) {
                this.addForm.listIds.push(selectRow.id);
              }
            } else {
              this.addForm.listIds = [];
            }
            this.addForm.batchId = this.batchId;
            if (this.addForm.applDt) {
              this.addForm.applDt = this.$moment(this.addForm.applDt, "YYYYMMDD").format("YYYYMMDD");
            } else {
              this.addForm.applDt = this.addForm.applDt;
            }
            Object.assign(this.param, {
              "listIds": this.addForm.listIds,
              "batchId": this.addForm.batchId,
              "queryType": 3,
              "funcNo":"PIPB010205",
              "ownedBrchNo":this.addForm.ownedBrchNo,
              "licenseFlag":this.licenseFlag
            });
            this.showAcctRecordWin = true;
          }
        }
      },
      showAcctWin() {
        if (!this.checkOnlyOne(this.currentSelectRow)) {
          return;
        }
        this.addOrEditWin = true;
        this.addForm.billType = this.currentSelectRow.billType;
        this.addForm.billClass = this.currentSelectRow.billClass;
        this.addForm.custName = this.currentSelectRow.custName;
        this.addForm.custBrchCode = this.currentSelectRow.custBrchCode;
        if (this.currentSelectRow.applDt) {
          this.addForm.applDt = this.$moment(this.currentSelectRow.applDt, "YYYYMMDD").format("YYYY-MM-DD");
        } else {
          this.addForm.applDt = this.currentSelectRow.applDt;
        }
        this.addForm.custMgrNo = this.currentSelectRow.custMgrNo;
        this.addForm.brchName = this.currentSelectRow.brchName;
        this.billManageFormItem.batchId = this.currentSelectRow.id;
        this.addForm.ownedBrchNo = this.currentSelectRow.ownedBrchNo;
        this.addForm.ownedBrchName = this.currentSelectRow.ownedBrchName;
        this.addForm.licenseFlag = this.licenseFlag;
        this.queryObjById(this.currentSelectRow.id);
        this.$nextTick(() => {
          this.$refs.datagridbill.dataChange(1);
        });
      },
      checkOnlyOne(selectList) {
        if (selectList == null || selectList.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return false;
        } else if (selectList.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return false;
        }
        return true;
      },
      //超链接点击批次号弹出票据明细
      showBillList(list) {
        this.dataSelectReset();
        this.addForm.id = list.id;
        this.addForm.billType = list.billType;
        this.addForm.billClass = list.billClass;
        this.addForm.custName = list.custName;
        this.addForm.custBrchCode = list.custBrchCode;
        if (list.applDt) {
          this.addForm.applDt = this.$moment(list.applDt, "YYYYMMDD").format("YYYY-MM-DD");
        } else {
          this.addForm.applDt = null;
        }
        this.addForm.custMgrNo = list.custMgrNo;
        this.addForm.brchName = list.brchName;
        this.addForm.busiBatchNo = list.busiBatchNo;
        this.addForm.memberId = list.memberId;
        this.addForm.transCtrctNo = list.transCtrctNo;
        this.addForm.custNo = list.custNo;
        this.addForm.createTime = list.createTime;
        this.batchId = list.id;
        this.billManageFormItem.batchId = list.id;
        this.$nextTick(() => {
          this.$refs.datagridbill.dataChange(1);
        });
        this.addForm.ownedBrchNo = list.ownedBrchNo;
        this.addForm.ownedBrchName = list.ownedBrchName;
        this.addForm.licenseFlag = this.licenseFlag;
        this.addOrEditWin = true;
      },
      handleWinClose() {
        this.batchId = "";
        this.$refs.addForm.resetFields();
        this.$refs.datagridbill.$refs.gridPage.clearElevator();
        this.dataTmpSelectReset();
      },
      queryObjById(id) {
        this.batchId = id;
        post({ batchId: id + "", queryType: 3 }, "bp/guaranty/sign/func_getGuarntrBatchById").then(res => {
          this.submitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.billList = res.data.retData;
            } else {
              this.$refs.datagrid.dataChange(1);
              this.submitMsg = "查询失败";
              this.retMsg = res.data.retMsg;
              this.submitWin = true;
            }
          } else {
            this.submitMsg = "查询失败";
            this.retMsg = this.$t("m.i.common.netError");
            this.submitWin = true;
          }
        });
      },
      closeAddOrEditWin() {
        this.addOrEditWin = false;
        this.$refs.addForm.resetFields();
      },
      //选择数据,重置
      dataSelectReset() {
        this.currentSelectRow = [];
      },
      //选择数据,重置
      dataTmpSelectReset() {
        this.tmpSelectList = [];
        this.$refs.datagridbill.selectIds = [];
        this.$refs.datagridbill.selects = [];
      },
      //确定记账，发送记账请求
      applyAccount(info) {
        post({
          listIds: this.addForm.listIds,
          batchId: this.addForm.batchId,
          funcNo : "PIPB010205",
          ownedBrchNo:this.addForm.ownedBrchNo,licenseFlag:this.licenseFlag
        }, "/bp/guaranty/sign/func_acctGuarntrBatch").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            let msg = res.data.retMsg;
            if (retCode == "000000") {
              let obj = Object.assign(this.formItem, { batchId: this.batchId });
              this.queryBillList(obj);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
              this.$msgTip.info(this, { info: this.$t("m.i.be.acctSuccess") });
              this.dataTmpSelectReset();
              this.addOrEditWin = false;
              this.showPrintButton = true;
              if (!info.isHasPrint) {
                this.showAcctRecordWinClose();
              }
            } else {
              this.$msgTip.error(this, { info: msg });
              this.showAcctRecordWinClose();
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
          this.$refs.datagridbill.dataChange(1);
        });
        // this.dataTmpSelectReset();
      },
      // 关闭记账窗口
      showAcctRecordWinClose() {
        this.showAcctRecordWin = false;
        this.showPrintButton = false;
        this.$refs.datagridbill.dataChange(1);
        this.dataTmpSelectReset();
      },
      //打印成功后关闭
      printSuccessCallback(){
        this.showAcctRecordWinClose();
      },

      //根据弹框所选数据进行赋值
     /* brchNoChange(info) {
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
    created() {
      this.getDictListByGroups("DraftTypeCode,CDMedia,BillOrigin").then(res => {
        this.cdMediaList = res.get("CDMedia");
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
