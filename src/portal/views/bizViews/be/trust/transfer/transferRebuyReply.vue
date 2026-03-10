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
            url="/be/trust/transfer/transferRebuyReply/func_queryTransferRebuyTrackReply"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleSend()">{{$t('m.i.common.send')}}</h-button>
              <h-button type="primary" @click="handleBack()">{{$t('m.i.be.returnBack')}}</h-button>
              <h-button type="primary" @click="handleDetail()">{{$t('m.i.be.billDetail')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--点击发送弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="1000" height="400" class="h-form-table-layer" :maximize="true" @on-close="closeAddFormOrEditWin">
      <p slot="header">
        <span>发送受让确认</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="120" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.common.batchNo')" prop="busiBatchNo">
            <h-input :value="addForm.busiBatchNo" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.brchName')" prop="saleBrchName">
            <h-input :value="addForm.buyBrchName" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.otherBrchName')" prop="buyBrchName">
            <h-input :value="addForm.saleBrchName" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.applDt')" prop="applDt">
            <h-date-picker :value="addForm.applDt" type="date" readonly placeholder=""></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType" :required="isRequired">
            <h-select :value="addForm.billType" readonly placeholder="" showTitle>
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass" :required="isRequired">
            <h-select :value="addForm.billClass" readonly placeholder="" showTitle>
              <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
        </h-form>
      </h-panel>
      <h-datagrid
        :columns="transferRebuyInfo.billColumns"
        highlight-row
        :bindForm="billItem"
        :gridData="billList"
        @on-page-change="handleBillPage"
        :row-select="true"
        :has-select="false"
        ref="datagridbill">
        <div slot="toolbar" class="pull-left">
          <h-dropdown trigger="click" @on-click="sendBatch">
            <h-button type="primary">{{$t('m.i.common.send')}}
              <h-icon name="unfold"></h-icon>
            </h-button>
            <h-dropdown-menu slot="list">
              <h-dropdown-item name="selectSend">选择发送</h-dropdown-item>
              <h-dropdown-item name="listSend">批次发送</h-dropdown-item>
            </h-dropdown-menu>
          </h-dropdown>
        </div>
      </h-datagrid>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
      </div>
    </h-msg-box>

    <!--点击新增/修改/票据明细弹出窗-->
    <h-msg-box v-model="detailWin" width="1000" height="400" class="h-form-table-layer"
               @on-close="handleWinClose" :maximize="true">
      <p slot="header">
        <span>票据明细</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="120" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.common.batchNo')" prop="busiBatchNo">
            <h-input v-model="addForm.busiBatchNo" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.brchName')" prop="buyBrchName">
            <h-input v-model="addForm.buyBrchName"readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.otherBrchName')" prop="saleBrchName">
            <h-input v-model="addForm.saleBrchName" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.applDt')" prop="applDt">
            <h-date-picker v-model="addForm.applDt" type="date" readonly
                           placeholder=""></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
            <h-select v-model="addForm.billType" readonly placeholder="" showTitle>
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass">
            <h-select v-model="addForm.billClass" readonly placeholder="" showTitle>
              <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
        </h-form>
      </h-panel>
      <h-datagrid
        :columns="transferRebuyInfo.billColumns"
        highlight-row
        :gridData="billList"
        @on-page-change="handleBillPage"
        :row-select="true"
        ref="datagridbillInfo">
      </h-datagrid>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="handleWinClose">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId" :billNo="billNo"
                    :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off,formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "transferRebuyReply",
    components: {
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)

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
          }
        ],
        rangeApplDt:[],
        formItem: {
          busiBatchNo: "",
          billType: "",
          billClass: "",
          rangeApplDt: "",
          minApplDt: "",
          maxApplDt: "",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath: this.$route.path,
        },
        addForm: {
          busiBatchNo: "",
          saleBrchName: "",
          buyBrchName: "",
          applDt: "",
          billType: "",
          billClass: "",
          respRemark: "",
          ownedBrchNo:"",
          ownedBrchName:"",
          licenseFlag:false,
        },
        billItem: {
          id: "",
          busiBatchId: "",
          billIdsStr: ""
        },
        ifShowMore: false,
        detailWin: false,
        addOrEditWin: false,
        //授权信息
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
        currentSelectRow: [],
        currentSelectBillList: [],
        billTypeList: [],
        billClassList: [],
        billList: [],
        transferStatusList: [],
        dictMap: null,
        transferRebuyInfo: {
          billColumns: [
            {
              type: "selection",
              key: "selection",
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
              title: this.$t('m.i.common.status'),
              key: "deleteFlag",
              hiddenCol: false,
              render: (h, params) => {
                return h("span", params.row.deleteFlag === "0" ? "正常" : "异常");
              }
            },
            {
              title: this.$t('m.i.be.transferStatus'),
              key: "transferStatus",
              hiddenCol: false,
              render: (h, params) => {
                let list = this.getDictValueFromMap(this.dictMap, "TransferRebuyBillStatus", params.row.transferStatus);
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
                      this.billInfoWinOpen(params.row.billId, params.row.billNo,params.row.billRangeStart, params.row.billRangeEnd)
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
                return h("span", this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType));
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
                let remitDt = this.$moment(params.row.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
                return h("span", remitDt);
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
              title: this.$t('m.i.billInfo.drwrName'),
              key: "drwrName",
              hiddenCol: false,
              sortable: true
            },
            {
              title: this.$t('m.i.be.transferReason'),
              key: "transferReason",
              hiddenCol: false
            },
            {
              title: this.$t('m.i.billInfo.acptBrchCode'),
              key: "acptBrchCode",
              hiddenCol: false
            },
            {
              title: this.$t('m.i.billInfo.acptBankName'),
              key: "acptName",
              sortable: true,
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
              title: this.$t('m.i.be.dsctGrntBrCode'),
              key: "discGuarntrBrchCode",
              hiddenCol: false
            },
            {
              title: this.$t('m.i.be.discGuarntrBankName'),
              key: "discGuarntrBankName",
              sortable: true,
              hiddenCol: false
            }
          ]
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
      //关闭票据明细弹出框
      handleWinClose() {
        this.addForm.id = null;
        this.$refs.datagridbillInfo.selects = [];
        this.$refs.datagridbillInfo.selectIds = [];
        this.$refs.datagridbillInfo.pageInfo.pageNo = 1;
        this.$refs.datagridbillInfo.pageInfo.pageSize = 10;
        this.$refs.addForm.resetFields();
        this.detailWin = false;
      },
      closeAddFormOrEditWin() {
        this.addOrEditWin = false;
        this.$refs.datagridbill.selects = [];
        this.$refs.datagridbill.selectIds = [];
        this.$refs.datagridbill.pageInfo.pageNo = 1;
        this.$refs.datagridbill.pageInfo.pageSize = 10;
      },

      handleBillPage(pageNo, pageSize) {
        let obj = Object.assign({}, this.billItem, {
          busiBatchId: this.billItem.busiBatchId,
          pageNo: pageNo,
          pageSize: pageSize
        });
        this.queryBillByBatchId(obj);
      },
      //查询已提交批次下明细
      queryBillByBatchId(obj) {
        post(obj, "/be/trust/transfer/transferRebuyReply/func_queryTransferRebuyBillApproval").then(res => {
          this.submitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.billList = res.data.retData;
            } else {
              this.$refs.datagrid.dataChange(1);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //发送
      handleSend() {
        if (this.currentSelectRow == null || this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        } else {
          this.billItem.ownedBrchNo = this.currentSelectRow.transBrchNo;
          this.billItem.ownedBrchName = this.currentSelectRow.brchName;
          this.billItem.licenseFlag = this.licenseFlag;
          let obj = Object.assign({}, this.billItem, { busiBatchId: this.currentSelectRow.id });
          this.queryBillByBatchId(obj);
          //将批次id赋给batchiId,发送时需要批次id和明细id
          this.billItem.busiBatchId = this.currentSelectRow.id;
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
          this.addOrEditWin = true;
          this.selectionHiddenCol(false);
        }
      },

      sendBatch(obj) {
        this.currentSelectBillList = this.$refs.datagridbill.selects;
        if (obj == "selectSend" && this.currentSelectBillList.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.$hMsgBox.confirm({
          title: "发送信息",
          content: "确定要发送吗?",
          onOk: () => {
            this.sendBatchConfirm(obj);
          }
        });
      },
      sendBatchConfirm(obj) {
        this.currentSelectBillList = this.$refs.datagridbill.selects;
        if (obj == "selectSend" && this.currentSelectBillList.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        } else {
          //选择发送
          if (obj == "selectSend") {
            this.billItem.billIdsStr = this.formateListData(this.currentSelectBillList);
            post(this.billItem, "/be/trust/transfer/transferRebuyReply/func_sendTransferRebuyBills").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this, { info: this.$t("发送成功") });
                  this.currentSelectRow = [];
                  this.addOrEditWin = false;
                  this.$refs.datagrid.dataChange(1);
                  this.currentSelectBillList = [];
                  this.$refs.datagridbill.selectIds = [];
                  this.$refs.datagridbill.selects = [];
                  this.$refs.datagridbill.dataChange(1);
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.currentSelectRow = [];
                  this.$refs.datagrid.dataChange(1);
                  this.currentSelectBillList = [];
                  this.$refs.datagridbill.selectIds = [];
                  this.$refs.datagridbill.selects = [];
                  this.$refs.datagridbill.dataChange(1);
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          } else {
            //批次发送只传批次id
            let id = this.billItem.busiBatchId;
            post({ id: id }, "/be/trust/transfer/transferRebuyReply/func_sendTransferRebuyBatch").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this, { info: this.$t("发送成功") });
                  this.currentSelectRow = [];
                  this.addOrEditWin = false;
                  this.$refs.datagrid.dataChange(1);
                  this.currentSelectBillList = [];
                  this.$refs.datagridbill.selectIds = [];
                  this.$refs.datagridbill.selects = [];
                  this.$refs.datagridbill.dataChange(1);
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.currentSelectRow = [];
                  this.$refs.datagrid.dataChange(1);
                  this.currentSelectBillList = [];
                  this.$refs.datagridbill.selectIds = [];
                  this.$refs.datagridbill.selects = [];
                  this.$refs.datagridbill.dataChange(1);
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        }
      },
      //超链接点击批次号弹出票据明细
      showBillList(list) {
        let obj = Object.assign({}, this.billItem, { busiBatchId: list.id });
        this.queryBillByBatchId(obj);
        this.addOrEditWin = true;
        this.selectionHiddenCol(false);
        this.billItem.busiBatchId = list.id;
        this.addForm.id = list.id;
        this.addForm.busiBatchNo = list.busiBatchNo;
        this.addForm.billType = list.billType;
        this.addForm.billClass = list.billClass;
        this.addForm.buyBrchCode = list.buyBrchCode;
        this.addForm.buyBrchName = list.buyBrchName;
        this.addForm.saleBrchName = list.saleBrchName;
        this.addForm.transferReason = list.transferReason;
        this.addForm.respRemark = list.reqRemark;
        if (list.applDt) {
          this.addForm.applDt = this.$moment(list.applDt, "YYYYMMDD").format("YYYY-MM-DD");
        } else {
          this.addForm.applDt = list.applDt;
        }
      },
      selectionHiddenCol(hiddenCol){
        const columns = this.transferRebuyInfo.billColumns;
        let selection=null;
        for (let column of columns) {
          if (column.key === 'selection') {
            selection = column;
            break;
          }
        }
        if (selection != null) {
          selection.hiddenCol = hiddenCol;
        }
      },
      formateListData(list) {
        let ids = [];
        for (let i = 0, len = list.length; i < len; i++) {
          ids.push(list[i].id);
        }
        return ids.join(",");
      },
      //退回
      handleBack() {
        if (this.currentSelectRow == null || this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        } else {
          this.$hMsgBox.confirm({
            title: this.$t("退回"),
            content: this.$t("确定退回") + "?",
            onOk: () => {
              this.handleBackConfirm();
            }
          });
        }
      },
      handleBackConfirm() {
        post({ id: this.currentSelectRow.id }, "/be/trust/transfer/transferRebuyReply/func_resetTransferRebuy").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this, { info: "退回成功" });
              this.currentSelectRow = [];
              this.$refs.datagrid.dataChange(1);
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.currentSelectRow = [];
              this.$refs.datagrid.dataChange(1);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //票据退回
      handleBillBack() {
        if (this.currentSelectRow != null) {
          this.$hMsgBox.confirm({
            title: this.$t("票据退回信息"),
            content: this.$t("确定要票据退回吗") + "?",
            onOk: () => {
              this.handleBillBackConfirm();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      handleBillBackConfirm() {
        post({ id: this.currentSelectRow.id }, "/be/trust/transfer/transferRebuyReply/func_transferRebuyBack").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this, { info: "票据退回成功" });
              this.currentSelectRow = [];
              this.$refs.datagrid.dataChange(1);
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.currentSelectRow = [];
              this.$refs.datagrid.dataChange(1);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //票据明细
      handleDetail() {
        if (this.currentSelectRow == null || this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        } else {
          let obj = Object.assign({}, this.billItem, { busiBatchId: this.currentSelectRow.id });
          this.queryBillByBatchId(obj);
          this.billItem.busiBatchId = this.currentSelectRow.id;
          this.detailWin = true;
          this.selectionHiddenCol(true);
          //明细弹出框
          this.addForm.busiBatchNo = this.currentSelectRow.busiBatchNo;
          this.addForm.billType = this.currentSelectRow.billType;
          this.addForm.billClass = this.currentSelectRow.billClass;
          this.addForm.buyBrchCode = this.currentSelectRow.buyBrchCode;
          this.addForm.buyBrchName = this.currentSelectRow.buyBrchName;
          this.addForm.saleBrchName = this.currentSelectRow.saleBrchName;
          this.addForm.transferReason = this.currentSelectRow.transferReason;
          this.addForm.respRemark = this.currentSelectRow.reqRemark;
          if (this.currentSelectRow.applDt) {
            this.addForm.applDt = this.$moment(this.currentSelectRow.applDt, "YYYYMMDD").format("YYYY-MM-DD");
          } else {
            this.addForm.applDt = this.currentSelectRow.applDt;
          }
        }
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
      this.getDictListByGroups("DraftTypeCode,CDMedia,TransferRebuyBillStatus").then(res => {
        this.billClassList = res.get("CDMedia");
        this.billTypeList = res.get("DraftTypeCode");
        this.transferStatusList = res.get("TransferRebuyBillStatus");
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
