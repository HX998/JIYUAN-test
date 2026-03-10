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
                <h-form-item :label="$t('m.i.common.batchNo')" prop="busiBatchNo">
                  <h-input v-model="formItem.busiBatchNo"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="" showTitle>
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass">
                  <h-select v-model="formItem.billClass" placeholder="" showTitle>
                    <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.applDt')" prop="rangeApplDt">
                  <h-date-picker :value="rangeApplDt" type="daterange" placeholder="" format="yyyy-MM-dd"
                                 showFormat @on-change="handleApplDtChange"></h-date-picker>
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
            highlight-row
            url="/be/trust/transfer/transferRebuyAccount/func_queryTransferRebuyTrackAcct"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleAccountForm()">{{$t('m.i.be.acct')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--点击记账弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="1000" height="400" class="h-form-table-layer" @on-close="handleWinClose"
               :maximize="true" @on-maximize="onMaximize">
      <p slot="header">
        <span>记账</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="120" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.common.batchNo')" prop="busiBatchNo">
            <h-input :value="addForm.busiBatchNo" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.brchName')" prop="buyBrchName">
            <h-input :value="addForm.buyBrchName" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.otherBrchName')" prop="saleBrchName">
            <h-input :value="addForm.saleBrchName" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.applDt')" prop="applDt">
            <h-date-picker :value="addForm.applDt" type="date" readonly></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
            <h-select :value="addForm.billType" readonly placeholder="" showTitle>
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass">
            <h-select :value="addForm.billClass" readonly placeholder="" showTitle>
              <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
        </h-form>
      </h-panel>
      <h-datagrid
        :columns="billColumns"
        highlight-row
        url="/be/trust/transfer/transferRebuyAccount/func_queryTransferRebuyBillAcct"
        :bindForm="billItem"
        @on-page-change="handleBillPage"
        :gridData="billList"
        :auto-load="false"
        :row-select="true"
        :has-select="false"
        ref="datagridbill">
        <div slot="toolbar" class="pull-left">
          <h-dropdown trigger="click" @on-click="sendAccount">
            <h-button type="primary">{{$t('m.i.be.acct')}}
              <h-icon name="unfold"></h-icon>
            </h-button>
            <h-dropdown-menu slot="list">
              <h-dropdown-item name="selectAccount">选择记账</h-dropdown-item>
              <h-dropdown-item name="listAccount">批次记账</h-dropdown-item>
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
                 url="/be/trust/transfer/transferRebuyAccount/func_queryAcctRecord"
                 @acctSubmitSure="applyAccount"
                 @printSuccessCallback="applyAccount">
    </acct-record>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId" :billNo="billNo"
                    :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off ,formatNumber} from "@/api/bizApi/commonUtil";

  export default {
    name: "transferRebuyAccount",
    components: {
    },
    data() {
      return {
        columns: [
          {
            type: "radio",
            width: 60,
            align: "center",
            title: " "
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
            key: "busiBatchNo",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillList(params.row);
                  }
                }
              }, params.row.busiBatchNo);
            }
          },
          {
            title: this.$t('m.i.common.applDt'),
            key: "applDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let applDt = this.$moment(params.row.applDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", applDt);
            }
          },
          {
            title: this.$t('m.i.be.brchName'),
            key: "buyBrchName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.otherBrchName'),
            key: "saleBrchName",
            sortable: true,
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
            title: this.$t('m.i.be.totalCount'),
            key: "totalNum",
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
          /*{
            title: this.$t('m.i.be.transferReason'),
            key: "transferReason",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.remark'),
            key: "respRemark",
            hiddenCol: false
          }*/
        ],
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
            title: this.$t('m.i.be.busiFlowNo'),
            key: "busiFlowNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.dueAcctFlag'),
            key: "acctStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "Yon", params.row.acctStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageNo'),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.billInfoWinOpen(params.row.billId, params.row.billNo, params.row.billRangeStart, params.row.billRangeEnd)
                  }
                }
              }, params.row.billNo)
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
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.billMoney, 2, ','))
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
            title: this.$t('m.i.billInfo.remitDt'),
            key: "remitDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let remitDt = params.row.remitDt == null ? "" : this.$moment(params.row.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", remitDt);
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dueDt = params.row.dueDt == null ? "" : this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", dueDt);
            }
          },
          {
            title: this.$t('m.i.billInfo.drwrName'),
            key: "drwrName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: "acptName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptBrchCode'),
            key: "acptBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptBankName'),
            key: "acptBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptBankNo'),
            key: "acptBankNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.discBrchCode'),
            key: "discBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.discBankName'),
            key: "discBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.discBankNo'),
            key: "discBankNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.guarntrTrustBrchCode'),
            key: "guarntrTrustBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.guarntrTrustBankName'),
            key: "guarntrTrustBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.guarntrTrustBankNo'),
            key: "guarntrTrustBankNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.cfmAppBrchCode'),
            key: "cfmAppBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.cfmAppBankName'),
            key: "cfmAppBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.cfmAppBankNo'),
            key: "cfmAppBankNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptGuarntrBrchCode'),
            key: "acptGuarntrBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptGuarntrBankName'),
            key: "acptGuarntrBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptGuarntrBankNo'),
            key: "acptGuarntrBankNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.dsctGrntBrCode'),
            key: "discGuarntrBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.discGuarntrBankNo'),
            key: "discGuarntrBankNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.discGuarntrBankName'),
            key: "discGuarntrBankName",
            sortable: true,
            hiddenCol: false
          }
        ],
        rangeApplDt:[],
        formItem: {
          billType: "",
          billClass: "",
          busiBatchNo: "",
          rangeApplDt: "",
          minApplDt: "",
          maxApplDt: "",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath: this.$route.path,
        },
        billItem: {
          busiBatchId: "",
          billIdsStr: "",
          ownedBrchNo:"",
          ownedBrchName:"",
          licenseFlag:false,
        },
        addForm: {
          id: "",
          busiBatchNo: "",//批次号
          saleBrchName: "",//本方机构名称
          buyBrchName: "",//对方机构名称
          buyBrchCode: "",//对方机构代码
          applDt: "",
          billType: "",
          billClass: "",
          transferReason: "",
          respRemark: "",
          ownedBrchNo:"",
          ownedBrchName:"",
          licenseFlag:false,
        },
        ifShowMore: false,
        //记账弹出框
        addOrEditWin: false,
        showPrintButton: false,
        //授权信息
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
        //brchNoWin: false,
        currentSelectRow: [],
        currentSelectBillList: [],
        billTypeList: [],
        billClassList: [],
        yonList: [],
        dictMap: null,
        showAcctRecordWin: false,
        param: {},
        billList: {
          list: [],
          pageInfo: {
            count: 0,
            pageNo: 1,
            pageSize: 10
          }
        },
        showBillInfoWin:false,
        billId:"",
        billRangeStart:"",
        billRangeEnd:"",
        billNo:""
      };
    },
    methods: {
      billInfoWinClose(){
        this.billId=null;
        this.billNo=null;
        this.billRangeStart=null;
        this.billRangeEnd=null;
        this.showBillInfoWin=false;
      },
      billInfoWinOpen(billId,billNo,billRangeStart,billRangeEnd){
        this.billId=billId;
        this.billNo=billNo;
        this.billRangeStart=billRangeStart;
        this.billRangeEnd=billRangeEnd;
        this.showBillInfoWin=true;
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagridbill.$refs.gridContent.handleResize();
        }, 100);
      },
      handleWinClose() {
        this.busiBatchId = "";
        this.$refs.addForm.resetFields();
        this.addOrEditWin=false;
      },
      //查询
      formSearch() {

        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      handleApplDtChange(arr){
        if (arr && arr.length >= 2) {
          this.formItem.minApplDt = arr[0].replace(/-/g, "");
          this.formItem.maxApplDt = arr[1].replace(/-/g, "");
          this.rangeApplDt = [arr[0],arr[1]];
        } else {
          this.formItem.minApplDt = "";
          this.formItem.maxApplDt = "";
          this.rangeApplDt = [];
        }
      },
      //重置
      formSearchReset() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.rangeApplDt = [];
        this.$refs.formItem.resetFields();
      },
      handleBillPage(pageNo, pageSize) {
        let obj = Object.assign({}, this.billItem, {
          busiBatchId: this.billItem.busiBatchId,
          pageNo: pageNo,
          pageSize: pageSize
        });
        this.queryBillByBatchId(obj);
      },
      //查询记账批次下明细
      queryBillByBatchId(obj) {
        post(obj, "/be/trust/transfer/transferRebuyAccount/func_queryTransferRebuyBillAcct").then(res => {
          this.submitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.billList = res.data.retData;
            } else {
              this.$refs.datagrid.dataChange(1);
              this.submitMsg = "查询失败";
              this.retMsg = res.data.retMsg;
            }
          } else {
            this.submitMsg = "查询失败";
            this.retMsg = this.$t("m.i.common.netError");
          }
        });
      },
      //记账
      handleAccountForm() {
        if (this.currentSelectRow != null && this.currentSelectRow.length != 0) {
          this.addOrEditWin = true;
          //将批次id赋给batchiId,发送时需要批次id和明细id
          this.billItem.busiBatchId = this.currentSelectRow.id;
          this.billItem.ownedBrchNo = this.currentSelectRow.ownedBrchNo;
          this.billItem.licenseFlag = this.licenseFlag;
          //从页面获取值用于回显查询框
          this.addForm.id = this.currentSelectRow.id;
          this.addForm.busiBatchNo = this.currentSelectRow.busiBatchNo;
          this.addForm.billType = this.currentSelectRow.billType;
          this.addForm.billClass = this.currentSelectRow.billClass;
          this.addForm.buyBrchCode = this.currentSelectRow.buyBrchCode;
          this.addForm.buyBrchName = this.currentSelectRow.buyBrchName;
          this.addForm.saleBrchName = this.currentSelectRow.saleBrchName;
          this.addForm.transferReason = this.currentSelectRow.transferReason;
          this.addForm.respRemark = this.currentSelectRow.reqRemark;
          this.addForm.ownedBrchNo = this.currentSelectRow.transBrchNo;
          this.addForm.ownedBrchName = this.currentSelectRow.brchName;
          this.addForm.licenseFlag = this.licenseFlag;
          if (this.currentSelectRow.applDt) {
            this.addForm.applDt = this.$moment(this.currentSelectRow.applDt, "YYYYMMDD").format("YYYY-MM-DD");
          } else {
            this.addForm.applDt = this.currentSelectRow.applDt;
          }
          let obj = Object.assign({}, this.billItem, { busiBatchId: this.currentSelectRow.id,ownedBrchNo:this.addForm.ownedBrchNo,licenseFlag:this.licenseFlag });
          this.queryBillByBatchId(obj);
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      //超链接点击批次号弹出票据明细
      showBillList(list) {
        this.billItem.busiBatchId = list.id;
        this.addForm.id = list.id;
        this.addForm.busiBatchId = list.id;//业务批次id
        //从页面拿值
        this.addForm.billType = list.billType;
        this.addForm.billClass = list.billClass;
        this.addForm.busiBatchNo = list.busiBatchNo;
        this.addForm.buyBrchName = list.buyBrchName;
        this.addForm.saleBrchName = list.saleBrchName;
        this.addForm.buyBrchCode = list.buyBrchCode;
        if (list.applDt) {
          this.addForm.applDt = this.$moment(list.applDt, "YYYYMMDD").format("YYYY-MM-DD");
        } else {
          this.addForm.applDt = list.applDt;
        }
        this.$nextTick(() => {
          this.$refs.datagridbill.dataChange(1);
        });
        this.addOrEditWin = true;
      },
      //记账确认
      sendAccount(obj) {
        //记账弹出框
        this.currentSelectBillList = this.$refs.datagridbill.selects;
        if (obj == "selectAccount" && this.currentSelectBillList.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        } else {
          if (obj === "selectAccount") {
            this.billItem.billIdsStr = "";
            for (let selectRow of this.currentSelectBillList) {
              this.billItem.billIdsStr += selectRow.id + ",";
            }
          } else {
            this.billItem.billIdsStr = null;
          }
          this.billItem.busiBatchId = this.billItem.busiBatchId;
          Object.assign(this.param, {
            "billIdsStr": this.billItem.billIdsStr,
            "busiBatchId": this.billItem.busiBatchId,
            ownedBrchNo:this.addForm.ownedBrchNo,licenseFlag:this.licenseFlag
          });
          this.showAcctRecordWin = true;
        }
      },
      // 关闭记账窗口
      showAcctRecordWinClose() {
        this.showAcctRecordWin = false;
        this.showPrintButton = false;
      },
      applyAccount(info) {
        if (this.billItem.billIdsStr != null && this.billItem.billIdsStr.length > 0) {
          post(this.billItem, "/be/trust/transfer/transferRebuyAccount/func_accountTransferRebuyBills").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode == "000000") {
                let obj = Object.assign(this.formItem, { busiBatchId: this.busiBatchId,
                  ownedBrchNo:this.currentSelectRow.ownedBrchNo,licenseFlag:this.licenseFlag });
                this.queryBillList(obj);
                this.$refs.datagrid.dataChange(1);
                this.$refs.datagridbill.dataChange(1);
                this.$msgTip.info(this, { info: this.$t("m.i.be.acctSuccess") });
                this.currentSelectBillList = [];
                this.$refs.datagridbill.selectIds = [];
                this.$refs.datagridbill.selects = [];
                this.showPrintButton = true;
                if (!info.isHasPrint) {
                  this.showAcctRecordWinClose();
                  this.handleWinClose();
                }
              } else {
                this.$msgTip.info(this, { info: this.$t("m.i.be.acctFailed") });
                this.$refs.datagrid.dataChange(1);
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
            this.$refs.datagridbill.dataChange(1);
          });
        } else {
          post(this.billItem, "/be/trust/transfer/transferRebuyAccount/func_accountTransferRebuyBatch").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode == "000000") {
                let obj = Object.assign(this.formItem, { busiBatchId: this.busiBatchId,
                  ownedBrchNo:this.currentSelectRow.ownedBrchNo,licenseFlag:this.licenseFlag });
                this.queryBillList(obj);
                this.$refs.datagrid.dataChange(1);
                this.$msgTip.info(this, { info: this.$t("m.i.be.acctSuccess") });
                this.currentSelectBillList = [];
                this.$refs.datagridbill.selectIds = [];
                this.$refs.datagridbill.selects = [];
                this.showPrintButton = true;
                if (!info.isHasPrint) {
                  this.showAcctRecordWinClose();
                  this.handleWinClose();
                }
              } else {
                this.$msgTip.info(this, { info: this.$t("m.i.be.acctFailed") });
                this.$refs.datagrid.dataChange(1);
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
            this.$refs.datagridbill.dataChange(1);
          });
        }
        this.currentSelectBillList = [];
        this.$refs.datagridbill.selectIds = [];
        this.$refs.datagridbill.selects = [];
      },
      //组装打印票据明细
      contractPrinting(recordInfo) {
        let flowNo = "";
        for (let item in Object.keys(recordInfo)) {
          if (recordInfo[Object.keys(recordInfo)[item]][0].voucherType === "PE030401") {
            flowNo = Object.keys(recordInfo)[item];
          }
        }
      },
      // 查询票据清单
      queryBillList(obj) {
        if (this.isRollBack) {
          post(obj, "/be/trust/transfer/transferRebuyAccount/func_queryTransferRebuyBillAcct").then(res => {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.billList = res.data.retData;
            }
          });
        }
      },
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
    created() {
      this.getDictListByGroups("DraftTypeCode,CDMedia,Yon").then(res => {
        this.billClassList = res.get("CDMedia");
        this.billTypeList = res.get("DraftTypeCode");
        this.yonList = res.get("Yon");
        this.dictMap = res.get("map");
      });
    },

    mounted() {
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
